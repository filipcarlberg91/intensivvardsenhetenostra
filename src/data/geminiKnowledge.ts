import { DocumentItem } from '../types';
import { IVA_DRUGS } from './drugsData';
import { IVA_DISEASE_STATES, IVA_FLUIDS_DATA, ROSE_PHASES } from './clinicalData';

export interface NotebookCustomSource {
  id: string;
  title: string;
  type: 'text' | 'image' | 'clinical_note';
  content: string;
  imageBase64?: string;
  mimeType?: string;
  selected: boolean;
  createdAt: string;
}

export interface NotebookNote {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  pinned?: boolean;
}

export function compileClinicalContext(
  docs: DocumentItem[],
  enabledModules?: string[],
  customSources?: NotebookCustomSource[]
): string {
  const allEnabled = !enabledModules || enabledModules.length === 0;
  const hasMod = (key: string) => allEnabled || enabledModules.includes(key);

  let ctx = 'KUNSKAPSBAS & VALDA KÄLLOR I GEMINI IVA NOTEBOOK (IVA ÖSTRA):\n\n';

  // 0. EGNA KÄLLOR & URKLIPP I NOTEBOOKEN
  if (customSources && customSources.length > 0) {
    const activeCustom = customSources.filter((s) => s.selected);
    if (activeCustom.length > 0) {
      ctx += `=== EGNA INLAGDA KÄLLOR & PATIENTDATA (${activeCustom.length} st) ===\n`;
      activeCustom.forEach((s) => {
        ctx += `• [Källa: ${s.title}] (${s.type}):\n  ${s.content}\n\n`;
      });
    }
  }

  // 1. DOKUMENT & PM
  if (hasMod('PMS')) {
    ctx += `=== STYRANDE VÅRD-PM OCH RUTINER (${docs.length} st) ===\n`;
    docs.forEach((d) => {
      ctx += `• [${d.id}] ${d.title} (Kategori: ${d.category})\n`;
      ctx += `  Beskrivning: ${d.description || ''}\n`;
      if (d.content) ctx += `  Utdrag/Protokoll: ${d.content.substring(0, 450)}...\n`;
      ctx += '\n';
    });
  }

  // 2. LÄKEMEDEL & SPÄDNINGSREGISTER
  if (hasMod('DRUGS')) {
    ctx += '=== LÄKEMEDELSREGISTER & SPÄDNINGSINSTRUKTIONER ===\n';
    IVA_DRUGS.forEach((med) => {
      ctx += `• Läkemedel: ${med.name} (${med.class})\n`;
      ctx += `  Standardkoncentration: ${med.standardConc}\n`;
      ctx += `  Beredning/Spädning: ${med.dilutionGuide}\n`;
      ctx += `  Bärarvätska: ${med.approvedDiluents}\n`;
      ctx += `  Infart: ${med.administrationRoute}\n`;
      ctx += `  Standarddosering: ${med.standardDoseRange} (enhet: ${med.doseUnit})\n`;
      ctx += `  Kliniska observationer & Varningar: ${med.clinicalNotes}\n\n`;
    });
  }

  // 3. SJUKDOMSTILLSTÅND PÅ IVA
  if (hasMod('DISEASES')) {
    ctx += '=== HANDLÄGGNING AV SJUKDOMSTILLSTÅND PÅ IVA ===\n';
    IVA_DISEASE_STATES.forEach((st) => {
      ctx += `• ${st.title} (${st.category}):\n`;
      ctx += `  Kort sammanfattning: ${st.shortSummary}\n`;
      if (st.subtypes) {
        st.subtypes.forEach((sub) => {
          ctx += `  - ${sub.name}: Tecken: ${sub.signs}. Åtgärder: ${sub.actions.replace(/\n/g, ' ')}\n`;
        });
      }
      ctx += '\n';
    });
  }

  // 4. VÄTSKETERAPI & ROSE
  if (hasMod('FLUIDS')) {
    ctx += '=== VÄTSKETERAPI & ROSE-KONCEPTET ===\n';
    IVA_FLUIDS_DATA.forEach((fl) => {
      ctx += `• ${fl.name} (${fl.category}): Osmolaritet: ${fl.osmolarity}. Elektrolyter: ${fl.electrolytes}. Huvudindikation: ${fl.primaryUse}. Varning: ${fl.caution}\n`;
    });
    ctx += '\nROSE-FASERNA:\n';
    ROSE_PHASES.forEach((rp) => {
      ctx += `- ${rp.letter} (${rp.name} / ${rp.subname}): Timing: ${rp.timing}. Mål: ${rp.goal}. Strategi: ${rp.fluidStrategy}\n`;
    });
    ctx += '\n% Fluid Overload = (Kumulativ vätskebalans i liter / Intagningsvikt i kg) * 100. >5% måttlig risk, >10% allvarlig risk med ökad mortalitet.\n\n';
  }

  // 5. SYRA-BAS & BLODGAS
  if (hasMod('ACID_BASE')) {
    ctx += '=== SYRA-BAS BALANS & BLODGASFORMEL ===\n';
    ctx += 'Normalvärden: pH 7.35-7.45, pCO2 4.6-6.0 kPa, PaO2 10-14 kPa, HCO3 22-27 mmol/L, BE -3 till +3 mmol/L.\n';
    ctx += 'Anjongap (AG) = Na+ - (Cl- + HCO3-). Normalt 8-12 mmol/L.\n';
    ctx += 'Albuminkorrigerat AG = AG + 0.25 * (40 - Albumin g/L).\n';
    ctx += 'Winters formel för kompensationsbedömning vid metabol acidos: Förväntad pCO2 (kPa) = 0.2 * HCO3- + 1.07 (+/- 0.27).\n';
    ctx += 'Delta Ratio = (AG - 12) / (24 - HCO3-): <0.4 ren NAGMA, 0.4-0.8 blandad HAGMA+NAGMA, 0.8-2.0 ren HAGMA, >2.0 HAGMA + samtidig metabol alkalos.\n';
    ctx += 'Horovitz-kvot (PaO2/FiO2): PaO2 (kPa) * 7.5 / FiO2. Normalt >400 mmHg. ARDS: Mild 200-300, Måttlig 100-200, Svår <100 mmHg.\n\n';
  }

  // 6. NUTRITION
  if (hasMod('NUTRITION')) {
    ctx += '=== NUTRITION ENLIGT ESPEN PÅ IVA ===\n';
    ctx += '- Tidig akutfas (dygn 1-2): 20 kcal/kg/dygn.\n';
    ctx += '- Stabiliseringsfas (dygn 3+): 25-30 kcal/kg/dygn.\n';
    ctx += '- Proteinbehov: 1.2 - 2.0 g/kg/dygn för att motverka katabolism.\n';
    ctx += '- Propofol 10 mg/ml innehåller 1.1 kcal/ml från fettemulsion. Måste dras av från näringsordinationen!\n';
  }

  return ctx;
}

export function generateLocalExpertResponse(userQuery: string, studioMode?: string): string {
  const q = (userQuery || '').toLowerCase().trim();

  if (studioMode === 'summary') {
    return `### 📋 Notebook-Sammanfattning av Valda IVA-Källor

**1. Kritiska Målvärden på IVA Östra**
* **Respiration:** Lungprotektiv ventilation med Vt **6 ml/kg PBW** (4–8 ml/kg), Pplat **< 30 cmH₂O**, Driving Pressure (ΔP) **< 15 cmH₂O**, SpO₂ 92–96% (88–92% vid KOL/ARDS).
* **Cirkulation:** MAP **≥ 65 mmHg** (70–75 mmHg vid kronisk hypertoni), laktatnormalisering, timdiures **≥ 0,5 ml/kg/h**.
* **Sedering & Smärta:** CPOT **≤ 2 p**, RASS **0 till -1** (daglig väckning om ej svår ARDS/ICP/bukläge).

**2. Läkemedel & CVK-Säkerhet**
* **Noradrenalin (0,1 mg/ml):** 5 ml (1 mg/ml) + 45 ml Glukos 5%. Ges i CVK. Vid dos > 0,25 µg/kg/min, överväg tillägg av Vasopressin (0,03 E/min).
* **Kritiska Inkompatibiliteter:** Furosemid får **ALDRIG** samadministreras med Noradrenalin/Adrenalin/Amiodaron. Fosfat får **ALDRIG** gå i samma skänkel som Kalcium.

**3. Viktiga Observationspunkter ("Röda Flaggor")**
* Räkna alltid av **Propofol (1,1 kcal/ml)** och **Citrat-CRRT (ca 200–400 kcal/dygn)** i nutritionsbalansen.
* Vid CRRT med citrat: Följ **Total/Joniserat Ca-kvot** (< 2,5 normalt; > 2,5 talar för citratackumulering).`;
  }

  if (studioMode === 'study_guide') {
    return `### ❓ Instuderingsguide & Kliniska Förhörsfrågor (IVA Notebook)

**Fråga 1: Vad innebär Driving Pressure (ΔP) på Servo-U och vad är gränsvärdet?**
* **Facit:** ΔP = Pplat − PEEP. Det speglar töjningen (strain) i den funktionella lungan. Gränsvärdet är **< 15 cmH₂O**. Högre värden är starkt kopplade till ventilatorinducerad lungskada (VILI).

**Fråga 2: Varför får Furosemid aldrig kopplas i Y-koppling med Noradrenalin?**
* **Facit:** Furosemid är starkt basiskt (pH ~9) medan Noradrenalin är surt (pH ~3–4). Samadministrering ger omedelbar utfällning och risk för kateterstopp eller blodtrycksfall.

**Fråga 3: Hur tolkar du en Total/Joniserad Kalcium-kvot på 2,8 hos en patient i CRRT?**
* **Facit:** En kvot **> 2,5** indikerar **citratackumulering** (ofta pga leversvikt eller svår hypoperfusion), där levern inte kan metabolisera citrat till bikarbonat.

**Fråga 4: När är bukläge (Prone Positioning) indicerat vid ARDS?**
* **Facit:** Vid måttlig till svår ARDS med **PaO₂/FiO₂ < 20 kPa (< 150 mmHg)** trots PEEP ≥ 5–10 cmH₂O. Behandlingstid minst **16 timmar/dygn**.

**Fråga 5: Hur korrigeras Anjongapet (AG) vid lågt S-Albumin?**
* **Facit:** Korrigerat AG = Uppmätt AG + 0,25 × (40 − S-Albumin i g/L). För varje 10 g/L sänkning i albumin sjunker annars det synliga anjongapet med 2,5 mmol/L.`;
  }

  if (studioMode === 'sbar') {
    return `### 🏥 SBAR Rond- & Överlämningsmall (IVA Östra)

* **S – Situation:** Patient på IVA-sal, aktuell huvuddiagnos och vårdorsak.
* **B – Bakgrund:** Tidigare sjukdomar, intagningsdatum, kirurgi/infektionsfokus.
* **A – Aktuellt tillstånd (A–G):**
  * **A/B (Respiration):** Luftväg, respiratorinställning (VKTS/TK/TU), FiO₂, PEEP, ΔP, PaO₂/FiO₂, befuktare F&P 950 (37 °C).
  * **C (Cirkulation):** rytm, MAP (mål ≥ 65), Noradrenalin (µg/kg/min), Laktat, ScvO₂.
  * **D (Neurologi/Sedering):** RLS/GCS, pupiller, RASS-mål, CPOT-poäng.
  * **E (Elimination/CRRT):** Timdiures (ml/kg/h), kumulativ vätskebalans (ROSE-fas), KDIGO/CRRT.
  * **F (Nutrition/Buk):** Bukstatus, IAP, ESPEN kcal-mål (Propofol avräknat), P-Glukos (6–10 mmol/L), P-Fosfat.
  * **G (Infarter/Infektion):** CVK-skänklar, odlingar, antibiotikadygn.
* **R – Rekommendation / Dagens Mål:** Urträningsplan, vätskebalansmål, planerade kontroller.`;
  }

  if (studioMode === 'audio_script') {
    return `Här är din muntliga röstöversikt från Gemini IVA Notebook för Intensivvårdsenheten Östra. Under dagens pass fokuserar vi på tre kliniska kärnområden. För det första, lungprotektiv ventilation: håll tidalvolymen runt 6 milliliter per kilo idealvikt, platåtrycket under 30 och drivtrycket under 15 centimeter vatten. För det andra, hemodynamik och läkemedelssäkerhet: sikta på ett medelartärtryck på minst 65 millimeter kvicksilver, och kom ihåg att aldrig blanda furosemid i samma skänkel som noradrenalin, eller fosfat i samma skänkel som kalcium. För det tredje, glöm inte att räkna av kalorierna från propofol vid nutritionsrond och kontrollera fosfat inför urträning ur respirator.`;
  }

  // 1. SPECIFIKA LÄKEMEDELSFRÅGOR
  if (q.includes('noradrenalin')) {
    return `### 💉 Noradrenalin (Norepinefrin) på IVA Östra [Källa: Läkemedelsregistret]

**Indikation:** Förstahandsval vid vasodilaterande / septisk chock för att återställa systemvaskulär resistens.

* **Standardstyrka:** **0.1 mg/ml** (100 µg/ml) eller **0.05 mg/ml** (50 µg/ml)
* **Beredning & Spädning:** 5 ml Noradrenalin (1 mg/ml) spädes i **45 ml Glukos 5%** i 50 ml spruta = 0.1 mg/ml (100 µg/ml).
* **Infart:** **Strikt central venkateter (CVK)**. I akut nödfall perifert i stor ven i max 30–60 min i väntan på CVK pga nekrosrisk.
* **Dosering:**
  * Startdos: 0.05 µg/kg/min
  * Vanlig underhållsdos: 0.02 – 0.50 µg/kg/min
  * Maxdos: > 1.0 µg/kg/min (Vid doser > 0.25 µg/kg/min, överväg tidigt tillägg av Vasopressin).
* **Målvärde:** MAP ≥ 65 mmHg (vid kronisk hypertoni ofta MAP 70–75 mmHg).
* **CVK Blandbarhet:** Blandbar i Y-koppling med Propofol, Dexdor, Vasopressin och Remifentanil. Får **ALDRIG** gå tillsammans med Furosemid (utfällning)!`;
  }

  if (q.includes('propofol')) {
    return `### 💤 Propofol (Sedering på IVA Östra) [Källa: Läkemedelsregistret & Nutrition]

**Indikation:** Sedering av mekaniskt ventilerade intensivvårdspatienter.

* **Styrka:** Standard **20 mg/ml (2%)** eller 10 mg/ml (1%).
* **Beredning:** Ges outspädd direkt från originalflaska/spruta via dedikerad pump.
* **Kaloriinnehåll:** Innehåller **1.1 kcal/ml** fettemulsion! Detta måste räknas av från patientens dygnskalorier för att undvika övernutrition och fettlever.
* **Dosering:** Underhållsdos 0.5 – 4.0 mg/kg/h (Max 4.0 mg/kg/h vid längre IVA-vård).
* **⚠️ Varning - PRIS (Propofol Infusion Syndrome):** Risk vid doser > 4–5 mg/kg/h under > 48 h.`;
  }

  if (q.includes('vasopressin') || q.includes('argipressin') || q.includes('empressin')) {
    return `### 💉 Vasopressin (Empressin) på IVA Östra [Källa: Läkemedelsregistret]

**Indikation:** Tilläggsbehandling vid refraktär septisk chock när Noradrenalinbehovet överstiger 0.25 µg/kg/min.

* **Styrka & Beredning:** 1 ml Argipressin (20 E/ml) späds med **49 ml NaCl 0.9% eller Glukos 5%** i 50 ml spruta = **0.4 E/ml**.
* **Dosering:** Fast dos **0.03 – 0.04 E/min** (motsvarar **4.5 – 6.0 ml/h** med standardspädning).
* **Infart:** Endast CVK. Kompatibel med Noradrenalin i Y-koppling.`;
  }

  if (q.includes('fosfat') || q.includes('glycophos') || q.includes('hypofosfatemi')) {
    return `### 🧪 Fosfat (Glycophos / Addex-Fosfat 1 mmol/ml) [Källa: Läkemedelsregistret]

**Indikation:** Hypofosfatemi (P-Fosfat < 0,70 mmol/L; kritisk < 0,30 mmol/L), Refeeding-syndrom, CRRT-förluster och respiratorurträning.

* **Blandning 1 (Standard påse 100–250 ml för PVK/CVK):** 20 ml (20 mmol) Fosfat i 100–250 ml NaCl 0,9% eller Glukos 5%, infunderas under 4–8 timmar.
* **Blandning 2 (Sprutpump 50 ml i CVK vid vätskerestriktion):** 20 ml (20 mmol) Fosfat + 30 ml NaCl 0,9% i 50 ml spruta = 0,4 mmol/ml. Ges i CVK under 4–6 timmar.
* **⚠️ CVK Blandbarhet:** Får **ALDRIG** gå i samma skänkel som **Kalcium** pga utfällningsrisk!`;
  }

  if (q.includes('cpot') || q.includes('rass') || q.includes('smärta') || q.includes('sedering')) {
    return `### 📊 Smärtskattning (CPOT) & Sederingsgrad (RASS) [Källa: Smärta & Sedering]

* **CPOT:** 4 domäner, 0–2 poäng per domän. Mål på IVA: **CPOT ≤ 2 poäng**. Vid ≥ 3 poäng krävs analgesi.
* **RASS:** Skala +4 till -5. Standardmål: **RASS 0 till -1**. Djup sedering (-4 till -5) vid svår ARDS, bukläge, relaxantia eller högt ICP.`;
  }

  if (q.includes('blandbar') || q.includes('cvk') || q.includes('y-koppling') || q.includes('kompatib')) {
    return `### ⚡ CVK Blandbarhet & Kompatibilitet på IVA Östra [Källa: Dos & CVK]

* **Säkra kombinationer:** Noradrenalin + Propofol / Vasopressin / Remifentanil / Dexdor.
* **Kritiska inkompatibiliteter (FÅR EJ GÅ TILLSAMMANS):**
  * **Furosemid:** Basiskt pH (~9) — fäller ut med Noradrenalin, Adrenalin och Amiodaron!
  * **Fosfat + Kalcium:** Fäller ut som kalciumfosfat!
  * **Amiodaron:** Måste spädas i Glukos 5%.`;
  }

  if (q.includes('blodgas') || q.includes('acid') || q.includes('abl') || q.includes('anjongap')) {
    return `### 🧪 Syra-Bas & Blodgasanalys (Radiometer ABL) [Källa: Syra-Bas]

1. **pH:** 7.35–7.45 | **pCO2:** 4.6–6.0 kPa | **HCO3:** 22–27 mmol/L.
2. **Anjongap:** AG = Na⁺ - (Cl⁻ + HCO3⁻) (normalt 8–12). Korrigerat AG = AG + 0.25 × (40 - Albumin).
3. **Winters formel:** Förväntad pCO2 (kPa) = 0.2 × HCO3⁻ + 1.07 (± 0.27).`;
  }

  if (q.includes('befuktare') || q.includes('950') || q.includes('fp950')) {
    return `### 🫁 F&P 950™ Respiratorisk Befuktare [Källa: PM Respiration]

* **Måltemperaturer:** Invasiv: **37.0 °C**, NIV/Mask: **31.0 °C**, Optiflow: **37.0 °C**.
* **Placering:** Lägre än patientens huvud.
* **Rengöring:** Isopropanol, Etanol eller Väteperoxid (aldrig klorin/aceton).`;
  }

  return `### 📓 Gemini IVA Notebook (Intensivvårdsenheten Östra)

Jag analyserar dina **valda källor** i anteckningsboken:
* **Styrande PM & Rutiner**
* **Läkemedelsregister & CVK-blandbarhet**
* **Blodgas, Vätsketerapi (ROSE) & ESPEN Nutrition**
* **Egna anteckningar & kamerabilder**

Använd **Studio-knapparna** ovan för att generera en **Sammanfattning**, **Instuderingsfrågor**, **SBAR-rondmall** eller **Lyssna på Audio-översikt**, eller ställ en fråga i fältet nedan!`;
}
