import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '15mb' }));

// Gemini IVA Notebook & Assistent AI API Endpoint
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, context, history, imageBase64, mimeType, studioMode } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY environment variable found.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `Du är Gemini IVA Notebook för Intensivvårdsenheten Östra (IVA Östra, Sahlgrenska Universitetssjukhuset).
Du fungerar som ett intelligent kliniskt NotebookLM / antecknings- och beslutsstöd för IVA-läkare och intensivvårdssjuksköterskor.
Du baserar dina svar på användarens valda källor (avdelningens rutiner, vård-PM, läkemedelsregister, CVK-blandbarhet, blodgaskalkylator, vätsketerapi, nutrition samt eventuella egna anteckningar eller kamerabilder).

VIKTIGA RIKTLINJER FÖR DINA SVAR:
1. Svara alltid på professionell, saklig och tydlig svenska anpassad för svensk intensivvård.
2. Strukturera dina svar pedagogiskt med tydliga rubriker (###), punktlistor och fetstil för doser, enheter och gränsvärden.
3. Ange alltid källhänvisningar inom hakparentes baserat på de valda källorna (t.ex. [Källa: Läkemedelsregistret], [Källa: PM Respiration], [Källa: Egen Anteckning]).
4. Framhäv alltid viktiga kliniska säkerhetsvarningar (t.ex. maxdoseringar, inkompatibiliteter vid Y-koppling, PRIS vid Propofol, kalcium-fosfatutfällning).
5. Om användaren ber om en Studio-generering (Sammanfattning, Instuderingsfrågor/Quiz, SBAR-Rondstöd eller Audio-manus), leverera ett välstrukturerat och direkt användbart underlag.
6. Detta är ett kliniskt beslutsstöd; ordinationer beslutas alltid av patientansvarig läkare.

VALDA KÄLLOR I ANTECKNINGSBOKEN:
${context || ''}`;

    let fullPrompt = prompt || '';
    if (studioMode === 'summary') {
      fullPrompt = `Skapa en strukturerad Klinisk Notebook-Sammanfattning av de valda källorna ovan. Inkludera:
1. Huvudpunkter & Kritiska Målvärden
2. Dosering & Inställningar att ha koll på
3. Viktigaste Säkerhetsvarningarna ("Röda Flaggor")
${prompt ? `\nFokusområde: ${prompt}` : ''}`;
    } else if (studioMode === 'study_guide') {
      fullPrompt = `Skapa en Instuderingsguide & Kliniska Förhörsfrågor (5 skarpa frågor med tydliga facit/nyckelsvar) baserat på de valda källorna i anteckningsboken.
${prompt ? `\nFokusområde: ${prompt}` : ''}`;
    } else if (studioMode === 'sbar') {
      fullPrompt = `Skapa en strukturerad SBAR-mall & Rondchecklista (Situation, Bakgrund, Aktuellt tillstånd, Rekommendation) anpassad efter de valda källorna och anteckningarna i Notebooken.
${prompt ? `\nPatientkontext/fokus: ${prompt}` : ''}`;
    } else if (studioMode === 'audio_script') {
      fullPrompt = `Skriv en kortfattad, muntlig och engagerande klinisk genomgång (som en 60-sekunders röstöversikt för ronden) av de viktigaste punkterna i de valda källorna. Skriv i ren löpande talvänlig text utan komplicerade tabeller så den passar perfekt för uppläsning.
${prompt ? `\nFokus: ${prompt}` : ''}`;
    } else if (history && Array.isArray(history) && history.length > 0) {
      const formattedHistory = history
        .slice(-6)
        .map((m: any) => `${m.role === 'user' ? 'Användare' : 'Gemini Notebook'}: ${m.text}`)
        .join('\n');
      fullPrompt = `Tidigare samtal i anteckningsboken:\n${formattedHistory}\n\nAktuell fråga/uppgift:\n${prompt}`;
    }

    const parts: any[] = [];
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }
    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    const reply = response.text || 'Inget svar kunde genereras.';
    return res.json({ success: true, text: reply });
  } catch (err: any) {
    console.error('Gemini API Error:', err);
    return res.status(200).json({
      success: false,
      error: err.message,
      fallback: true,
    });
  }
});

// Gemini Multimodal Blodgas OCR API Endpoint
app.post('/api/bloodgas-ocr', async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Ingen bild skickades.' });
    }

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY environment variable configured.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    const cleanBase64 = imageBase64.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');
    const detectedMime = mimeType || 'image/jpeg';

    const promptText = `Du är en expert på laboratorieanalyser inom svensk intensivvård och tolkning av Radiometer ABL90 / ABL800 blodgasremsor.
Analysera denna bild av en blodgasutskrift/remsa och extrahera alla uppmätta laboratorievärden med högsta precision.
Svara ENBART med ett giltigt JSON-objekt (inga code blocks, inga backticks) med följande struktur:
{
  "pH": number or null,
  "pCO2": number or null,
  "pO2": number or null,
  "hco3": number or null,
  "be": number or null,
  "so2": number or null,
  "ctHb": number or null,
  "hct": number or null,
  "na": number or null,
  "k": number or null,
  "ca": number or null,
  "cl": number or null,
  "glu": number or null,
  "lac": number or null,
  "fcohb": number or null,
  "fmethb": number or null,
  "albumin": number or null
}
Notera:
- pCO2 och pO2 ska anges i enheten kPa (om värdet på lappen är i mmHg, konvertera till kPa genom att dividera med 7.50).
- sO2, fcohb, fmethb ska vara i procent (t.ex. 96 för 96%).
- hct ska anges i decimalform eller procent (t.ex. 0.38 eller 38).
- Om ett värde inte syns eller saknas på lappen, sätt dess värde till null.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: detectedMime,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const reply = response.text;
    let parsedData = null;
    try {
      parsedData = JSON.parse(reply || '{}');
    } catch (parseErr) {
      const jsonMatch = reply?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      }
    }

    if (!parsedData) {
      return res.status(200).json({ success: false, fallback: true, message: 'Kunde inte tolka JSON från modellen.' });
    }

    return res.json({ success: true, data: parsedData });
  } catch (err: any) {
    console.error('Blood gas OCR Error:', err);
    return res.status(200).json({
      success: false,
      error: err.message,
      fallback: true,
    });
  }
});

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
