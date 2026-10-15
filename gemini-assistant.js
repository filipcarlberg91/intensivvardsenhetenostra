/**
 * Intensivvårdsenheten Östra - Gemini IVA-Assistent
 * Klinisk AI-expert & intelligent beslutsstöd med full access till sjukhusets PM,
 * läkemedelsregister, CVK-blandbarhet, sjukdomsprotokoll, syra-bas, vätskor och nutrition.
 * 
 * Stödjer både Google Gemini API (gemini-1.5-flash / gemini-2.0-flash) och en
 * inbyggd offline IVA-kunskapsmotor så att assistenten alltid svarar omedelbart.
 */

class GeminiIVAAssistant {
  constructor() {
    this.apiKey = localStorage.getItem("iva_gemini_api_key") || "";
    this.model = localStorage.getItem("iva_gemini_model") || "gemini-1.5-flash";
    this.isOpen = false;
    this.isGenerating = false;
    this.chatHistory = this.loadChatHistory();

    // Initiera vid DOMContentLoaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    this.injectStyles();
    this.renderUI();
    this.setupEventListeners();
    this.updateStatusBadge();
  }

  // =========================================================================
  // Lagring & Historik
  // =========================================================================

  loadChatHistory() {
    try {
      const stored = localStorage.getItem("iva_gemini_chat_history");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Kunde inte läsa in chatthistorik:", e);
    }
    return [];
  }

  saveChatHistory() {
    try {
      // Spara de senaste 30 meddelandena
      const trimmed = this.chatHistory.slice(-30);
      localStorage.setItem("iva_gemini_chat_history", JSON.stringify(trimmed));
    } catch (e) {
      console.warn("Kunde inte spara chatthistorik:", e);
    }
  }

  clearChatHistory() {
    this.chatHistory = [];
    localStorage.removeItem("iva_gemini_chat_history");
    this.renderMessages();
    if (window.app && typeof window.app.showToast === "function") {
      window.app.showToast("Chatthistoriken rensades 🗑️");
    }
  }

  // =========================================================================
  // Bygg fullständig klinisk kontext från hela applikationen
  // =========================================================================

  compileClinicalContext() {
    let ctx = "KUNSKAPSBAS FÖR INTENSIVVÅRDSENHETEN ÖSTRA (IVA ÖSTRA):\n\n";

    // 1. DOKUMENT & PM
    const docs = (window.app && window.app.documents) ? window.app.documents : (typeof sampleDocs !== "undefined" ? sampleDocs : []);
    ctx += "=== STYRANDE VÅRD-PM OCH RUTINER (" + docs.length + " st) ===\n";
    docs.forEach((d) => {
      ctx += `• [${d.id}] ${d.title} (Kategori: ${d.category}, Version: ${d.version || "1.0"})\n`;
      ctx += `  Beskrivning: ${d.description || ""}\n`;
      if (d.summary) ctx += `  Sammanfattning: ${d.summary}\n`;
      if (d.tags && d.tags.length) ctx += `  Taggar: ${d.tags.join(", ")}\n`;
      if (d.fullText) ctx += `  Utdrag/Protokoll: ${d.fullText.substring(0, 300)}...\n`;
      ctx += "\n";
    });

    // 2. LÄKEMEDEL & SPÄDNINGSREGISTER
    if (typeof IVA_DRUGS !== "undefined") {
      ctx += "=== LÄKEMEDELSREGISTER & SPÄDNINGSINSTRUKTIONER ===\n";
      IVA_DRUGS.forEach((med) => {
        ctx += `• Läkemedel: ${med.name} (${med.category})\n`;
        ctx += `  Indikation: ${med.indication}\n`;
        ctx += `  Standardkoncentration: ${med.concentration}\n`;
        ctx += `  Bärarvätska: ${med.diluent}\n`;
        ctx += `  Infart: ${med.centralLineOnly ? "ENDAST CVK" : "Perifer infart tillåten"}\n`;
        ctx += `  Beredning: ${med.preparation}\n`;
        ctx += `  Standarddosering: Start ${med.dosage.start}, Underhåll ${med.dosage.maintenance}, Maxdos ${med.dosage.max}\n`;
        ctx += `  Mål & Titrering: ${med.dosage.titration}\n`;
        ctx += `  Viktiga observationer & Varningar: ${med.notes}\n\n`;
      });
    }

    // 3. CVK BLANDBARHET & Y-KOPPLING
    if (typeof IVA_COMPATIBILITY_RULES !== "undefined") {
      ctx += "=== CVK KOMPATIBILITETSREGLER & BLANDBARHET (Y-KOPPLING) ===\n";
      IVA_COMPATIBILITY_RULES.forEach((rule) => {
        ctx += `• ${rule.drug1} + ${rule.drug2}: ${rule.status} - ${rule.note}\n`;
      });
      ctx += "\n3-LUMEN CVK STANDARDALLOKERING:\n";
      ctx += "- Distal skänk (16G, brun): Invasiv tryckmätning, kolloider, albumin, blodprodukter, CVP.\n";
      ctx += "- Medial skänk (18G, blå): Parenteral nutrition (TPN), elektrolyter, underhållsvätskor.\n";
      ctx += "- Proximal skänk (18G, vit): Vasoaktiva infusioner (Noradrenalin, Vasopressin, Inotropi) och sedering.\n\n";
    }

    // 4. SJUKDOMSTILLSTÅND PÅ IVA
    if (typeof IVA_DISEASE_STATES !== "undefined") {
      ctx += "=== HANDLÄGGNING AV SJUKDOMSTILLSTÅND PÅ IVA ===\n";
      IVA_DISEASE_STATES.forEach((st) => {
        ctx += `• ${st.title} (${st.category}):\n`;
        ctx += `  Kort sammanfattning: ${st.shortSummary}\n`;
        if (st.subtypes) {
          st.subtypes.forEach((sub) => {
            ctx += `  - ${sub.name}: Diagnostik: ${sub.criteria}. Förstahandsbehandling: ${sub.firstLine}. Kliniska pärlor: ${sub.pearls}\n`;
          });
        }
        ctx += "\n";
      });
    }

    // 5. VÄTSKETERAPI & ROSE
    if (typeof IVA_FLUIDS_DATA !== "undefined") {
      ctx += "=== VÄTSKETERAPI & ROSE-KONCEPTET ===\n";
      IVA_FLUIDS_DATA.types.forEach((fl) => {
        ctx += `• ${fl.name} (${fl.category}):\n`;
        ctx += `  Fördelar: ${fl.pros.join(", ")}\n`;
        ctx += `  Nackdelar/Risker: ${fl.cons.join(", ")}\n`;
        ctx += `  Huvudindikation: ${fl.indications}\n`;
      });
      ctx += "\nROSE-FASERNA:\n";
      IVA_FLUIDS_DATA.rosePhases.forEach((rp) => {
        ctx += `- ${rp.phase}: ${rp.title} (${rp.timing}). Mål: ${rp.goal}. Åtgärd: ${rp.action}\n`;
      });
      ctx += "\n% Fluid Overload = (Kumulativ vätskebalans i liter / Intagningsvikt i kg) * 100. >5% måttlig risk, >10% allvarlig risk med ökad mortalitet.\n\n";
    }

    // 6. SYRA-BAS & BLODGAS
    ctx += "=== SYRA-BAS BALANS & BLODGASFORMEL ===\n";
    ctx += "Normalvärden: pH 7.35-7.45, pCO2 4.7-6.0 kPa, PaO2 >10 kPa, HCO3 22-26 mmol/L, BE -3 till +3 mmol/L.\n";
    ctx += "Anjongap (AG) = Na+ - (Cl- + HCO3-). Normalt 8-12 mmol/L.\n";
    ctx += "Albuminkorrigerat AG = AG + 0.25 * (40 - Albumin g/L).\n";
    ctx += "Winters formel för kompensationsbedömning vid metabol acidos: Förväntad pCO2 (kPa) = 0.2 * HCO3- + 1.07 (+/- 0.27).\n";
    ctx += "Delta Ratio = (AG - 12) / (24 - HCO3-): <0.4 ren NAGMA, 0.4-0.8 blandad HAGMA+NAGMA, 0.8-2.0 ren HAGMA, >2.0 HAGMA + samtidig metabol alkalos.\n";
    ctx += "Horovitz-kvot (PaO2/FiO2): PaO2 (kPa) * 7.5 / FiO2. Normalt >400 mmHg. ARDS: Mild 200-300, Måttlig 100-200, Svår <100 mmHg.\n\n";

    // 7. NUTRITION
    ctx += "=== NUTRITION ENLIGT ESPEN PÅ IVA ===\n";
    ctx += "- Tidig akutfas (dygn 1-2): 20 kcal/kg/dygn.\n";
    ctx += "- Stabiliseringsfas (dygn 3+): 25-30 kcal/kg/dygn.\n";
    ctx += "- Proteinbehov: 1.2 - 2.0 g/kg/dygn för att motverka katabolism.\n";
    ctx += "- Propofol 10 mg/ml innehåller 1.1 kcal/ml från fettemulsion. Måste dras av från näringsordinationen!\n";

    return ctx;
  }

  buildSystemInstruction() {
    return `Du är Gemini IVA-Assistenten för Intensivvårdsenheten Östra (IVA Östra).
Du är en specialiserad klinisk AI-kollega för IVA-läkare och IVA-sjuksköterskor.
Du har full access till alla avdelningens rutiner, vård-PM, spädningsregister, CVK-blandbarhet, sjukdomsprotokoll, blodgaskalkylator, vätsketerapi och nutritionsberäkningar.

VIKTIGA RIKTLINJER FÖR DINA SVAR:
1. Svara alltid på professionell, saklig och tydlig svenska anpassad för svensk intensivvård.
2. Strukturera dina svar pedagogiskt med tydliga rubriker (###), punktlistor och fetstil för doser, enheter och gränsvärden.
3. Hänvisa specifikt till avdelningens rutiner och verktyg (t.ex. [Doskalkylatorn], [Syra-Bas Kalkylatorn], [PM: Septisk chock]).
4. Framhäv alltid viktiga kliniska säkerhetsvarningar (t.ex. maxdoseringar, inkompatibiliteter vid Y-koppling, hernieringsrisk vid ICP, risk för hyperkloremisk acidos vid NaCl).
5. Vid frågor om blodgaser, använd systematisk tolkningsmetodik (pH, respiratorisk/metabolisk komponent, anjongap, albuminkorrigering och kompensationsgrad).
6. Detta är ett kliniskt beslutsstöd; ordinationer beslutas alltid av patientansvarig läkare.

Följande är den fullständiga databasen för Intensivvårdsenheten Östra:
${this.compileClinicalContext()}`;
  }

  // =========================================================================
  // Inbyggd intelligent lokal IVA-kunskapsmotor (Offline Fallback)
  // =========================================================================

  generateLocalExpertResponse(userQuery) {
    const q = userQuery.toLowerCase().trim();

    // 1. SPECIFIKA LÄKEMEDELSFRÅGOR (Noradrenalin, Propofol, m.fl.)
    if (q.includes("noradrenalin")) {
      return `### 💉 Noradrenalin (Norepinefrin) på IVA Östra

**Indikation:** Förstahandsval vid vasodilaterande / septisk chock för att återställa systemvaskulär resistens.

* **Standardstyrka:** **40 µg/ml** ($0.04\\text{ mg/ml}$)
* **Beredning & Spädning:** $4\\text{ mg}$ ($4\\text{ ml}$ à $1\\text{ mg/ml}$) spädes i **$100\\text{ ml}$ Glukos $50\\text{ mg/ml}$** (eller $100\\text{ ml}$ NaCl $9\\text{ mg/ml}$).
* **Infart:** **Endast central venkateter (CVK)**. I absolut akut nödfall perifert i stor ven i max 30-60 min i väntan på CVK (risk för hudnekros).
* **Dosering:**
  * Startdos: $0.05\\text{ µg/kg/min}$
  * Vanlig underhållsdos: $0.05\\text{–}0.5\\text{ µg/kg/min}$
  * Maxdos: $1.5\\text{–}2.0\\text{ µg/kg/min}$ (Vid doser $> 0.25\\text{ µg/kg/min}$, överväg tillägg av Vasopressin).
* **Målvärde:** MAP $\\ge 65\\text{ mmHg}$ (vid kronisk hypertoni eller njurpåverkan ev. MAP $70\\text{–}75$).
* **CVK Blandbarhet:** Blandbar i Y-koppling med Propofol, Dexdor, Vasopressin och Remifentanil. Får **EJ** gå tillsammans med Furosemid (utfällning)!

👉 *Du kan beräkna exakt pumpinställning (ml/h) i [Doskalkylatorn](#).*`;
    }

    if (q.includes("propofol")) {
      return `### 💤 Propofol (Sedering på IVA Östra)

**Indikation:** Sedering av mekaniskt ventilerade intensivvårdspatienter.

* **Styrka:** Standard **10 mg/ml** (finns även $20\\text{ mg/ml}$).
* **Beredning:** Ges outspädd i dedikerad sprutpump eller droppräknare.
* **Kaloriinnehåll:** Innehåller **1.1 kcal/ml** fettemulsion! Detta måste räknas av från patientens dygnskalorier för att undvika övernutrition och fettlever.
* **Dosering:**
  * Underhållsdos: $1.0\\text{–}3.0\\text{ mg/kg/h}$.
  * Maxdos: $4.0\\text{ mg/kg/h}$ i max 48 timmar.
* **⚠️ Varning - PRIS (Propofol Infusion Syndrome):**
  * Risk vid doser $> 4\\text{–}5\\text{ mg/kg/h}$ under $> 48\\text{ h}$.
  * Tecken: Refraktär metabol acidos, rabdomyolys, hyperkalemi, hepatomegali, akut njursvikt och arytmi/hjärtsvikt.
  * Provtagning: Följ serum-triglycerider, CK och syra-bas dagligen.`;
    }

    if (q.includes("vasopressin")) {
      return `### 💉 Vasopressin (Empressin) på IVA Östra

**Indikation:** Tilläggsbehandling vid refraktär septisk chock när Noradrenalinbehovet överstiger $0.25\\text{ µg/kg/min}$.

* **Styrka & Beredning:** $20\\text{ E}$ ($1\\text{ ml}$) spädes i **$50\\text{ ml}$ NaCl $9\\text{ mg/ml}$** $\\rightarrow$ Koncentration **$0.4\\text{ E/ml}$**.
* **Dosering:** Fast dos **$0.01\\text{–}0.03\\text{ E/min}$** (motsvarar **$1.5\\text{–}4.5\\text{ ml/h}$** med standardspädning).
* **OBS:** Ska ej titreras upp och ner som noradrenalin, utan ges i fast dos. Titrera istället noradrenalin.
* **Infart:** Endast CVK.
* **Blandbarhet:** Kompatibel med Noradrenalin i Y-koppling.`;
    }

    // 2. CVK BLANDBARHET / Y-KOPPLING
    if (q.includes("blandbar") || q.includes("cvk") || q.includes("y-koppling") || q.includes("kompatib")) {
      return `### ⚡ CVK Blandbarhet & Kompatibilitet på IVA Östra

På IVA Östra rekommenderas följande hantering för att undvika kemisk inaktivering och partikelutfällning:

#### 1. Säkra kombinationer (Grön status i Y-koppling):
* **Noradrenalin + Propofol:** Kompatibla i Y-koppling med godkänd bärarvätska.
* **Noradrenalin + Vasopressin:** Mycket god blandbarhet i vasoaktiv skänk.
* **Noradrenalin + Remifentanil / Dexdor:** Kompatibla.

#### 2. Kritiska inkompatibiliteter (Röd status - FÅR EJ GÅ TILLSAMMANS):
* **Furosemid (Furix):** Har basiskt pH (~9). Får **ALDRIG** gå tillsammans med Noradrenalin, Adrenalin, Midazolam eller Amiodaron (surt pH $\\rightarrow$ omedelbar utfällning av kristaller som täpper katetern!).
* **Amiodaron:** Utfäller i ren NaCl $9\\text{ mg/ml}$. Måste spädas i **Glukos $50\\text{ mg/ml}$** och kräver egen ren skänk.
* **Kalciumklorid:** Får ej blandas med Bikarbonat eller Fosfat (bildar kalciumkarbonat/fosfatfällning).

#### 3. Standardfördelning i 3-Lumen CVK:
1. **Distal skänk (16G, brun):** CVP/Invasiv tryckmätning, blodprodukter, albumin, plasma.
2. **Medial skänk (18G, blå):** TPN/Parenteral nutrition, elektrolyter och kalium.
3. **Proximal skänk (18G, vit):** Vasoaktiva infusioner (Noradrenalin/Vasopressin) och sedering.

👉 *Kontrollera specifika läkemedelspar interaktivt under fliken [Dos & CVK](#).*`;
    }

    // 3. ARDS & RESPIRATIONSVIKT
    if (q.includes("ards") || q.includes("bukläge") || q.includes("ventilator") || q.includes("respiration")) {
      return `### 🫁 ARDS & Respirationssvikt Handläggning

Enligt Berlin-definitionen klassificeras ARDS efter Horovitz-kvoten ($PaO_2/FiO_2$):
* **Mild ARDS:** $200\\text{–}300\\text{ mmHg}$ ($26.7\\text{–}40.0\\text{ kPa}$)
* **Måttlig ARDS:** $100\\text{–}200\\text{ mmHg}$ ($13.3\\text{–}26.7\\text{ kPa}$)
* **Svår ARDS:** $< 100\\text{ mmHg}$ ($< 13.3\\text{ kPa}$)

#### Lungprotektiv Ventilatorstrategi (Gyllene standard):
1. **Tidalvolym ($V_t$):** Starta på **$6\\text{ ml/kg}$ förutspådd kroppsvikt (PBW)** (ej faktisk vikt!).
2. **Drivtryck (Driving Pressure, $\\Delta P = P_{plat} - PEEP$):** Mål **$< 14\\text{–}15\\text{ cmH}_2\\text{O}$**.
3. **Platåtryck ($P_{plat}$):** Mål **$< 30\\text{ cmH}_2\\text{O}$**.
4. **PEEP-titrering:** Högre PEEP-tabell vid måttlig/svår ARDS (ofta $12\\text{–}16\\text{ cmH}_2\\text{O}$).
5. **Bukläge (Prone Positioning):**
   * **Indikation:** $PaO_2/FiO_2 < 150\\text{ mmHg}$ vid $FiO_2 \\ge 0.6$ och PEEP $\\ge 10$.
   * **Behandlingstid:** Minst **16 timmar per dygn**.
6. **Neuromuskulär blockad:** Överväg kontinuerligt Cisatrakurium tidigt vid svår dyssynkroni.

👉 *Se hela rutinen under [PM: Ventilatorinställning vid ARDS](#).*`;
    }

    // 4. NJURSVIKT & CRRT / AEIOU
    if (q.includes("njursvikt") || q.includes("crrt") || q.includes("aeiou") || q.includes("dialys") || q.includes("kdigo")) {
      return `### 🧪 Akut Njursvikt (AKI) & CRRT-indikationer (AEIOU)

Akut njursvikt definieras enligt **KDIGO 1–3** baserat på serumkreatinin och timdiures.

#### När ska kontinuerlig njurersättningsterapi (CRRT) startas?
Minnesregeln **AEIOU** sammanfattar de akuta indikationerna:
* **A - Acidos:** Refraktär metabol acidos med $pH < 7.15\\text{–}7.20$ och $BE < -10$ trots optimerad ventilation och volymstatus.
* **E - Elektrolytrubbning:** Allvarlig hyperkalemi ($S-K > 6.5\\text{ mmol/L}$) eller snabb stegring som inte svarar på medicinsk terapi (insulin-glukos, Resonium).
* **I - Intoxikation:** Dialyserbara toxiner (litium, metanol, etylenglykol, salicylat).
* **O - Övervätskning (Overload):** Kumulativ vätskeöverbelastning $> 10\\%$ intagningsvikt med refraktärt lungödem och diuretikaresistens.
* **U - Uremi:** Uremiska komplikationer såsom perikardit, uremisk encefalopati eller blödningsrubbning.

#### Standardinställning på IVA Östra:
* Metod: **CVVHDF** (hemodiafiltration)
* Antikoagulation: Regional citratantikoagulation (RCA) som förstahandsval.
* Måldos: $20\\text{–}25\\text{ ml/kg/h}$ efluentdos.`;
    }

    // 5. BLODGAS & SYRA-BAS
    if (q.includes("blodgas") || q.includes("syra-bas") || q.includes("anjongap") || q.includes("acidos") || q.includes("alkalos")) {
      return `### 🧪 Systematisk Blodgastolkning på IVA Östra

Följ denna 5-stegsmodell för korrekt tolkning:

1. **pH (Acidemi vs Alkalemi):**
   * $pH < 7.35$: Acidemi
   * $pH > 7.45$: Alkalemi
2. **Respiratorisk ($pCO_2$) vs Metabolisk ($HCO_3^-$ / BE):**
   * Vid acidos: Om $pCO_2 > 6.0\\text{ kPa}$ $\\rightarrow$ Respiratorisk. Om $HCO_3^- < 22\\text{ mmol/L}$ / $BE < -3$ $\\rightarrow$ Metabolisk.
3. **Anjongap (AG):**
   * Formel: $\\text{Na}^+ - (\\text{Cl}^- + \\text{HCO}_3^-)$. Normalt: **$8\\text{–}12\\text{ mmol/L}$**.
   * Förhöjt AG ($> 12$): HAGMA (MUDPILES / Laktat, Ketoacidos, Uremi, Toxiner).
4. **Albuminkorrigering:**
   * $\\text{AG}_{korr} = \\text{AG} + 0.25 \\times (40 - \\text{Albumin})$.
   * Vid svår hypoalbuminemi döljs ofta en allvarlig acidos om inte korrigering görs!
5. **Delta Ratio ($\\Delta AG / \\Delta HCO_3$):**
   * $< 0.4$: Ren normalt anjongapacidos (NAGMA / hyperkloremi).
   * $0.8\\text{–}2.0$: Ren HAGMA.
   * $> 2.0$: Samtidig metabolisk alkalos eller kronisk kompensatorisk retention.

👉 *Mata in dina värden i den interaktiva [Syra-Bas Kalkylatorn](#) för direkt färgkodad analys och åtgärdsförslag.*`;
    }

    // 6. VÄTSKEBALANS, VÄTSKETERAPI & ROSE
    if (q.includes("vätska") || q.includes("ringer") || q.includes("albumin") || q.includes("rose") || q.includes("övervätsk")) {
      return `### 💧 Vätsketerapi & ROSE-konceptet på IVA

#### Val av vätska:
* **Ringer-Acetat & Plasmalyte:** Balanserade kristalloider. Förstahandsval vid resuscitation och underhåll.
* **NaCl 0.9%:** Endast vid hypokloremisk metabol alkalos (kräkningar) eller intrakraniell hypertension. Varning: Ger njurvasokonstriktion och hyperkloremisk acidos vid volymer $> 2000\\text{ ml}$.
* **Albumin 20%:** Onkotiskt dragande. Indicerat vid refraktär chock, hypoalbuminemi ($< 20\\text{ g/L}$), svår levercirros och vid forcerad avvätskning med diuretika.
* **Syntetiska kolloider (HES/Voluven):** Kontraindicerat! Ökar risken för njursvikt och död.

#### ROSE-fashantering:
1. **Resuscitation (dygn 1):** Snabb volymexpansion ($30\\text{ ml/kg}$) för att säkra organperfusion.
2. **Optimization (timmar-dygn):** Titrering efter funktionella dynamiska tester (Passive Leg Raising, PLR).
3. **Stabilization (dygn 2-3):** Nollbalans. Undvik rutinmässiga underhållsdropp.
4. **Evacuation (dygn 3+):** Aktiv avvätskning med Furosemid/CRRT för att vända ackumulerad vätska.

👉 *Beräkna kumulativ övervätskning under fliken [Vätskor](#).*`;
    }

    // 7. NUTRITION
    if (q.includes("nutrition") || q.includes("sondmat") || q.includes("espen") || q.includes("kalorier") || q.includes("protein")) {
      return `### 🍎 Nutrition på IVA (ESPEN Riktlinjer)

* **Energimål:**
  * **Tidig akutfas (dygn 1–2):** **$20\\text{ kcal/kg/dygn}$** (undvik refeeding och övernutrition).
  * **Stabiliseringsfas (dygn 3+):** **$25\\text{–}30\\text{ kcal/kg/dygn}$**.
* **Proteinmål:** **$1.2\\text{–}2.0\\text{ g/kg/dygn}$** för att bromsa katabolism.
* **Propofolavdrag:** Kom ihåg att Propofol ger **$1.1\\text{ kcal/ml}$** fett. Vid $20\\text{ ml/h}$ ges hela $528\\text{ kcal/dygn}$ som måste dras av från sondmatsordinationen!

👉 *Använd [Nutritionskalkylatorn](#) för att beräkna exakt ml/h på sondmatspumpen.*`;
    }

    // 8. LEVERSVIKT / CHOCK / NEURO
    if (q.includes("lever") || q.includes("alf") || q.includes("hjärnödem") || q.includes("ammoniak")) {
      return `### 🩺 Akut Leversvikt (ALF) på IVA Östra

* **Kärnproblematik:** Sviktande syntesförmåga (PK/INR $> 1.5$), hepatisk encefalopati och hög risk för hjärnödem vid ammoniak $> 150\\text{–}200\\text{ µmol/L}$.
* **King's College-kriterier:** Kontakta omedelbart transplantationscentrum vid paracetamolintox med $pH < 7.30$ eller INR $> 6.5$ + kreatinin $> 300\\text{ µmol/L}$.
* **Neurointensivvård vid ALF:**
  * Höjd huvudände ($30^\\circ$), undvik halsvenkompression.
  * Håll $S-Na$ $145\\text{–}150\\text{ mmol/L}$ med Hyperton NaCl $3\\%$ för att förebygga intrakraniellt ödem.
  * Laktulos och Rifaximin för att reducera tarmens ammoniakproduktion.`;
    }

    // 9. GENERELL SÖKNING I APPLICERINGENS PM
    const matchingDocs = (window.app && window.app.documents ? window.app.documents : []).filter((d) => {
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchDesc = (d.description || "").toLowerCase().includes(q);
      const matchTag = (d.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchTag;
    });

    if (matchingDocs.length > 0) {
      let resp = `### 📑 Relevanta PM på Intensivvårdsenheten Östra\n\nJag hittade följande styrande dokument som matchar din fråga:\n\n`;
      matchingDocs.slice(0, 4).forEach((d) => {
        resp += `* **${d.title}** (${d.category})\n  _${d.description || d.summary || ""}_\n\n`;
      });
      resp += `👉 *Du kan öppna och läsa hela dokumenten direkt via sökfunktionen eller kategorimenyn.*`;
      return resp;
    }

    // Standard fallback
    return `### 💡 Svar från IVA Östras Kunskapsmotor

Jag har sökt igenom alla avdelningens styrande vård-PM, läkemedelsspädningar, CVK-blandbarhetstabeller och kalkylatorer.

För mer specifika svar, pröva att fråga om:
* **Läkemedel & Spädning:** T.ex. *"Hur späder jag Noradrenalin?"* eller *"Maxdos för Milrinon"*
* **CVK-blandbarhet:** T.ex. *"Kan Propofol och Noradrenalin gå tillsammans?"*
* **Respiration & ARDS:** T.ex. *"Kriterier för bukläge vid ARDS"* eller *"Tidalvolym"*
* **Dialys & Njursvikt:** T.ex. *"Indikationer för CRRT enligt AEIOU"*
* **Blodgas & Syra-bas:** T.ex. *"Hur tolkas metabol acidos och anjongap?"*
* **Vätskor & Nutrition:** T.ex. *"ROSE-konceptet"* eller *"Hur mycket kalorier ger Propofol?"*

⚙️ *Tips: För fri medicinsk dialog och djupare generativa resonemang med Google Gemini AI, klicka på kugghjulet (⚙️) och ange din Gemini API-nyckel!*`;
  }

  // =========================================================================
  // Gemini API-anrop (Online)
  // =========================================================================

  async askGemini(userQuery) {
    if (!this.apiKey) {
      // Ingen API-nyckel konfigurerad -> använd den intelligenta lokala kunskapsmotorn
      return {
        text: this.generateLocalExpertResponse(userQuery),
        isLocal: true
      };
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Bygg konversationshistorik för Gemini
    const contents = [];

    // Ta med de senaste 6 turerna i historiken för kontext
    const recentHistory = this.chatHistory.slice(-6);
    recentHistory.forEach((item) => {
      contents.push({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.text }]
      });
    });

    // Lägg till den aktuella frågan
    contents.push({
      role: "user",
      parts: [{ text: userQuery }]
    });

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: this.buildSystemInstruction() }]
      },
      generationConfig: {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048
      }
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error ? errorData.error.message : `HTTP ${response.status}`;
        console.warn("Gemini API fel:", errorMessage);

        // Vid fel (t.ex. ogiltig nyckel eller kvotgräns), fall tillbaka på lokal kunskapsmotor
        const localAnswer = this.generateLocalExpertResponse(userQuery);
        return {
          text: `> [!WARNING] **Gemini API meddelande:** Kunde inte ansluta till Gemini (${errorMessage}). Svarar via IVA Östras inbyggda kunskapsmotor istället.\n\n${localAnswer}`,
          isLocal: true,
          error: errorMessage
        };
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
        const replyText = data.candidates[0].content.parts.map((p) => p.text).join("\n");
        return {
          text: replyText,
          isLocal: false
        };
      } else {
        throw new Error("Oväntat svarsformat från Gemini API");
      }
    } catch (err) {
      console.warn("Nätverksfel vid anrop till Gemini:", err);
      // Fallback till lokal motor
      const localAnswer = this.generateLocalExpertResponse(userQuery);
      return {
        text: `> [!NOTE] **Offline / Nätverksläge:** Svarar via Intensivvårdsenheten Östras lokala kunskapsmotor.\n\n${localAnswer}`,
        isLocal: true
      };
    }
  }

  // =========================================================================
  // Meddelandehantering & Flöde
  // =========================================================================

  async handleUserSubmit(text) {
    if (!text || !text.trim() || this.isGenerating) return;

    const query = text.trim();
    this.isGenerating = true;

    // Lägg till användarmeddelande i historik
    const userMsg = {
      role: "user",
      text: query,
      timestamp: new Date().toISOString()
    };
    this.chatHistory.push(userMsg);
    this.renderMessages();
    this.showTypingIndicator(true);

    try {
      const result = await this.askGemini(query);
      const botMsg = {
        role: "model",
        text: result.text,
        isLocal: result.isLocal,
        timestamp: new Date().toISOString()
      };
      this.chatHistory.push(botMsg);
      this.saveChatHistory();
    } catch (err) {
      this.chatHistory.push({
        role: "model",
        text: `Ett oväntat fel inträffade: ${err.message}`,
        isLocal: true,
        timestamp: new Date().toISOString()
      });
    } finally {
      this.isGenerating = false;
      this.showTypingIndicator(false);
      this.renderMessages();
      this.updateStatusBadge();
    }
  }

  // =========================================================================
  // Markdown-parser (Enkel, säker & snygg)
  // =========================================================================

  formatMarkdown(text) {
    if (!text) return "";
    let html = text;

    // GitHub-liknande alerts (> [!WARNING] eller > [!NOTE])
    html = html.replace(/^>\s*\[!WARNING\]\s*(.*)$/gim, '<div class="chat-alert alert-warning"><strong>⚠️ Varning:</strong> $1</div>');
    html = html.replace(/^>\s*\[!NOTE\]\s*(.*)$/gim, '<div class="chat-alert alert-note"><strong>ℹ️ Information:</strong> $1</div>');

    // Rubriker
    html = html.replace(/^### (.*$)/gim, '<h4 class="chat-h4">$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3 class="chat-h3">$1</h3>');
    html = html.replace(/^# (.*$)/gim, '<h2 class="chat-h2">$1</h2>');

    // Fetstil och kursiv
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Inline kod
    html = html.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

    // Klickbara länkar för interna IVA-verktyg
    html = html.replace(/\[Doskalkylatorn\]\(#\)/gi, `<button class="chat-inline-btn" onclick="app.switchCategory('DRUGS'); geminiIVA.closeChat();">💊 Öppna Doskalkylatorn</button>`);
    html = html.replace(/\[Syra-Bas Kalkylatorn\]\(#\)/gi, `<button class="chat-inline-btn" onclick="app.switchCategory('ACID_BASE'); geminiIVA.closeChat();">🧪 Öppna Syra-Bas Kalkylatorn</button>`);
    html = html.replace(/\[Nutritionskalkylatorn\]\(#\)/gi, `<button class="chat-inline-btn" onclick="app.switchCategory('NUTRITION_CALC'); geminiIVA.closeChat();">🍎 Öppna Nutritionskalkylatorn</button>`);
    html = html.replace(/\[Vätskor\]\(#\)/gi, `<button class="chat-inline-btn" onclick="app.switchCategory('FLUID_BALANCE'); geminiIVA.closeChat();">💧 Öppna Vätskemodulen</button>`);
    html = html.replace(/\[PM: ([^\]]+)\]\(#\)/gi, `<button class="chat-inline-btn" onclick="app.openDocumentByTitle('$1'); geminiIVA.closeChat();">📑 Läs PM: $1</button>`);

    // Punktlistor
    html = html.replace(/^\s*[\*\-]\s+(.*)$/gim, '<li class="chat-li">$1</li>');
    html = html.replace(/(<li class="chat-li">.*<\/li>(\n|$))+/g, '<ul class="chat-ul">$&</ul>');

    // Nya rader till <p> eller <br>
    html = html.replace(/\n\n/g, '<div class="chat-spacer"></div>');

    return html;
  }

  // =========================================================================
  // Rendering av Användargränssnitt (Chat Drawer & Inställningsmodal)
  // =========================================================================

  injectStyles() {
    // Styles läggs till via styles.css, men fallback-kontroll om styles saknas
  }

  renderUI() {
    // 1. Skapa Chatt-Drawer Backdrop & Panel om de inte finns
    let drawerBackdrop = document.getElementById("geminiChatBackdrop");
    if (!drawerBackdrop) {
      drawerBackdrop = document.createElement("div");
      drawerBackdrop.id = "geminiChatBackdrop";
      drawerBackdrop.className = "gemini-drawer-backdrop";
      drawerBackdrop.onclick = () => this.closeChat();
      document.body.appendChild(drawerBackdrop);
    }

    let drawer = document.getElementById("geminiChatDrawer");
    if (!drawer) {
      drawer = document.createElement("aside");
      drawer.id = "geminiChatDrawer";
      drawer.className = "gemini-chat-drawer";
      drawer.setAttribute("aria-label", "Gemini IVA Assistent");
      drawer.innerHTML = `
        <div class="gemini-drawer-header">
          <div class="gemini-header-title-group">
            <div class="gemini-ai-avatar">
              <span class="ai-sparkle-glow"></span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
            <div>
              <div class="gemini-header-title">
                <strong>Gemini IVA-Assistent</strong>
                <span class="gemini-status-pill" id="geminiStatusPill">Lokal kunskapsmotor</span>
              </div>
              <p class="gemini-header-sub">Intensivvårdsenheten Östra • Klinisk AI-rådgivare</p>
            </div>
          </div>
          <div class="gemini-header-actions">
            <button class="btn-gemini-tool" onclick="geminiIVA.openSettingsModal()" title="Inställningar för Gemini API (⚙️)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="btn-gemini-tool" onclick="geminiIVA.clearChatHistory()" title="Rensa chatthistorik (🗑️)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
            <button class="btn-gemini-close" onclick="geminiIVA.closeChat()" title="Stäng panelen (Esc)">
              ✕
            </button>
          </div>
        </div>

        <!-- Chattens meddelandeyta -->
        <div class="gemini-drawer-body" id="geminiChatMessages">
          <!-- Renderas dynamiskt -->
        </div>

        <!-- Skrivfält & Input -->
        <div class="gemini-drawer-footer">
          <form class="gemini-input-form" id="geminiChatForm" onsubmit="event.preventDefault(); geminiIVA.submitCurrentInput();">
            <textarea 
              id="geminiChatInput" 
              class="gemini-textarea" 
              placeholder="Fråga om läkemedel, spädning, ARDS, syra-bas, dialys..."
              rows="1"
              onkeydown="geminiIVA.handleTextareaKeydown(event)"
            ></textarea>
            <button type="submit" class="btn-gemini-send" id="btnGeminiSend" title="Skicka fråga (Enter)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>
              </svg>
            </button>
          </form>
          <div class="gemini-disclaimer">
            <span>🛡️ Kliniskt beslutsstöd för IVA Östra. Ersätter ej läkarordination. Inga personnummer.</span>
          </div>
        </div>
      `;
      document.body.appendChild(drawer);
    }

    // 2. Skapa Inställningsmodal för Gemini API
    let settingsModal = document.getElementById("geminiSettingsModal");
    if (!settingsModal) {
      settingsModal = document.createElement("div");
      settingsModal.id = "geminiSettingsModal";
      settingsModal.className = "modal-backdrop";
      settingsModal.innerHTML = `
        <div class="modal-dialog gemini-settings-dialog">
          <div class="modal-header">
            <div style="display:flex; align-items:center; gap:0.6rem;">
              <div class="gemini-ai-avatar small">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              </div>
              <h2 style="font-size:1.15rem; font-weight:700;">Inställningar för Google Gemini AI</h2>
            </div>
            <button class="modal-close-btn" onclick="geminiIVA.closeSettingsModal()">✕</button>
          </div>
          <div class="modal-body">
            <p style="font-size:0.875rem; color:#475569; margin-bottom:1rem; line-height:1.5;">
              Med en Google Gemini API-nyckel får assistenten full tillgång till avancerade resonemang, kliniska analyser och fri medicinsk dialog. Nyckeln sparas säkert endast lokalt i din egen webbläsare.
            </p>

            <div class="form-group" style="margin-bottom:1rem;">
              <label style="display:block; font-size:0.8rem; font-weight:600; color:#1e293b; margin-bottom:0.35rem;">
                Gemini API-Nyckel
              </label>
              <div style="display:flex; gap:0.5rem;">
                <input 
                  type="password" 
                  id="geminiApiKeyInput" 
                  class="form-control" 
                  placeholder="AIzaSy..." 
                  style="font-family:monospace; font-size:0.85rem;"
                />
                <button type="button" class="btn-header-secondary" onclick="geminiIVA.toggleApiKeyVisibility()" title="Visa / dölj nyckel" style="padding:0.4rem 0.7rem;">
                  👁️
                </button>
              </div>
              <small style="display:block; margin-top:0.35rem; color:#64748b; font-size:0.75rem;">
                Saknar du nyckel? Hämta en gratis på 30 sekunder via <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color:#0284c7; text-decoration:underline;">Google AI Studio</a>.
              </small>
            </div>

            <div class="form-group" style="margin-bottom:1.25rem;">
              <label style="display:block; font-size:0.8rem; font-weight:600; color:#1e293b; margin-bottom:0.35rem;">
                Välj Gemini Modell
              </label>
              <select id="geminiModelSelect" class="form-control" style="font-size:0.85rem;">
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Rekommenderad - Blixtsnabb & 1M kontext)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Nyaste experimentella)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Djupare resonemang)</option>
              </select>
            </div>

            <div id="geminiTestStatus" style="font-size:0.8rem; padding:0.6rem; border-radius:6px; margin-bottom:1rem; display:none;"></div>
          </div>
          <div class="modal-footer" style="display:flex; justify-content:space-between; align-items:center;">
            <button type="button" class="btn-header-secondary" onclick="geminiIVA.testApiKeyConnection()" style="font-size:0.85rem;">
              ⚡ Testa anslutning
            </button>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn-header-secondary" onclick="geminiIVA.closeSettingsModal()">Avbryt</button>
              <button type="button" class="btn-upload-primary" onclick="geminiIVA.saveSettingsFromModal()">Spara inställningar</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(settingsModal);
    }

    this.renderMessages();
  }

  renderMessages() {
    const container = document.getElementById("geminiChatMessages");
    if (!container) return;

    if (this.chatHistory.length === 0) {
      container.innerHTML = `
        <div class="gemini-welcome-card">
          <div class="gemini-welcome-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <h3>Hej! Hur kan jag assistera dig på IVA?</h3>
          <p>
            Jag har full tillgång till alla styrande rutiner, PM, läkemedelsspädningar, CVK-blandbarhet och kalkylatorer för Intensivvårdsenheten Östra.
          </p>

          <div class="gemini-quick-prompts">
            <span class="quick-prompt-label">Vanliga kliniska frågor:</span>
            <button class="quick-chip" onclick="geminiIVA.askQuick('Hur späder jag Noradrenalin och vad är maxdosen?')">
              💉 Hur späder jag Noradrenalin och maxdos?
            </button>
            <button class="quick-chip" onclick="geminiIVA.askQuick('Kan Noradrenalin och Propofol gå i samma CVK-skänk?')">
              ⚡ CVK: Noradrenalin + Propofol i Y-koppling?
            </button>
            <button class="quick-chip" onclick="geminiIVA.askQuick('När ska vi vända en patient till bukläge vid ARDS?')">
              🫁 Kriterier för bukläge vid ARDS?
            </button>
            <button class="quick-chip" onclick="geminiIVA.askQuick('Vilka är de akuta indikationerna för CRRT enligt AEIOU?')">
              🧪 Indikationer för CRRT enligt AEIOU?
            </button>
            <button class="quick-chip" onclick="geminiIVA.askQuick('Hur tolkas ett förhöjt anjongap vid metabol acidos?')">
              🩸 Tolkning av anjongap vid metabol acidos
            </button>
            <button class="quick-chip" onclick="geminiIVA.askQuick('Hur mycket kalorier ger Propofol 20 ml/h per dygn?')">
              🍎 Hur mycket kalorier ger Propofol 20 ml/h?
            </button>
          </div>
        </div>
      `;
      return;
    }

    let html = "";
    this.chatHistory.forEach((msg, idx) => {
      const isUser = msg.role === "user";
      html += `
        <div class="chat-bubble-row ${isUser ? 'user-row' : 'bot-row'}">
          ${!isUser ? `
            <div class="chat-avatar bot-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
            </div>
          ` : ''}

          <div class="chat-bubble ${isUser ? 'user-bubble' : 'bot-bubble'}">
            <div class="chat-bubble-content">
              ${isUser ? this.escapeHtml(msg.text) : this.formatMarkdown(msg.text)}
            </div>
            <div class="chat-bubble-meta">
              <span>${this.formatTime(msg.timestamp)}</span>
              ${!isUser && msg.isLocal ? `<span class="chat-engine-tag">IVA Kunskapsmotor</span>` : ''}
              ${!isUser && !msg.isLocal ? `<span class="chat-engine-tag online">Gemini 1.5 Flash</span>` : ''}
              ${!isUser ? `
                <button class="btn-copy-bubble" onclick="geminiIVA.copyMessageText(${idx})" title="Kopiera svar">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
              ` : ''}
            </div>
          </div>

          ${isUser ? `
            <div class="chat-avatar user-avatar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          ` : ''}
        </div>
      `;
    });

    container.innerHTML = html;
    this.scrollToBottom();
  }

  showTypingIndicator(show) {
    const container = document.getElementById("geminiChatMessages");
    if (!container) return;

    let el = document.getElementById("geminiTypingBubble");
    if (show) {
      if (!el) {
        el = document.createElement("div");
        el.id = "geminiTypingBubble";
        el.className = "chat-bubble-row bot-row";
        el.innerHTML = `
          <div class="chat-avatar bot-avatar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            </svg>
          </div>
          <div class="chat-bubble bot-bubble typing">
            <div class="typing-indicator-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="typing-text">Gemini söker i IVA Östras protokoll & beräknar...</span>
          </div>
        `;
        container.appendChild(el);
        this.scrollToBottom();
      }
    } else {
      if (el) el.remove();
    }
  }

  scrollToBottom() {
    const container = document.getElementById("geminiChatMessages");
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }

  // =========================================================================
  // Interaktionsmetoder (Öppna / Stäng / Snabbfrågor)
  // =========================================================================

  openChat() {
    this.isOpen = true;
    const drawer = document.getElementById("geminiChatDrawer");
    const backdrop = document.getElementById("geminiChatBackdrop");
    if (drawer) drawer.classList.add("active");
    if (backdrop) backdrop.classList.add("active");
    this.updateStatusBadge();
    this.scrollToBottom();

    setTimeout(() => {
      const input = document.getElementById("geminiChatInput");
      if (input) input.focus();
    }, 150);
  }

  closeChat() {
    this.isOpen = false;
    const drawer = document.getElementById("geminiChatDrawer");
    const backdrop = document.getElementById("geminiChatBackdrop");
    if (drawer) drawer.classList.remove("active");
    if (backdrop) backdrop.classList.remove("active");
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  askQuick(promptText) {
    const input = document.getElementById("geminiChatInput");
    if (input) input.value = promptText;
    this.submitCurrentInput();
  }

  submitCurrentInput() {
    const input = document.getElementById("geminiChatInput");
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    input.value = "";
    input.style.height = "auto";
    this.handleUserSubmit(val);
  }

  handleTextareaKeydown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.submitCurrentInput();
    }
  }

  copyMessageText(idx) {
    const msg = this.chatHistory[idx];
    if (!msg) return;
    navigator.clipboard.writeText(msg.text).then(() => {
      if (window.app && typeof window.app.showToast === "function") {
        window.app.showToast("Kopierat till urklipp! 📋");
      }
    }).catch(() => {});
  }

  updateStatusBadge() {
    const pill = document.getElementById("geminiStatusPill");
    if (!pill) return;
    if (this.apiKey) {
      pill.textContent = `🟢 Gemini Live (${this.model})`;
      pill.className = "gemini-status-pill online";
    } else {
      pill.textContent = `🔵 IVA Kunskapsmotor (Lokal)`;
      pill.className = "gemini-status-pill offline";
    }
  }

  // =========================================================================
  // Inställningsmodal
  // =========================================================================

  openSettingsModal() {
    const modal = document.getElementById("geminiSettingsModal");
    if (!modal) return;
    const keyInput = document.getElementById("geminiApiKeyInput");
    const modelSelect = document.getElementById("geminiModelSelect");
    const statusDiv = document.getElementById("geminiTestStatus");

    if (keyInput) keyInput.value = this.apiKey;
    if (modelSelect) modelSelect.value = this.model;
    if (statusDiv) statusDiv.style.display = "none";

    modal.classList.add("active");
  }

  closeSettingsModal() {
    const modal = document.getElementById("geminiSettingsModal");
    if (modal) modal.classList.remove("active");
  }

  toggleApiKeyVisibility() {
    const input = document.getElementById("geminiApiKeyInput");
    if (!input) return;
    input.type = input.type === "password" ? "text" : "password";
  }

  saveSettingsFromModal() {
    const keyInput = document.getElementById("geminiApiKeyInput");
    const modelSelect = document.getElementById("geminiModelSelect");

    if (keyInput) {
      this.apiKey = keyInput.value.trim();
      localStorage.setItem("iva_gemini_api_key", this.apiKey);
    }
    if (modelSelect) {
      this.model = modelSelect.value;
      localStorage.setItem("iva_gemini_model", this.model);
    }

    this.closeSettingsModal();
    this.updateStatusBadge();
    if (window.app && typeof window.app.showToast === "function") {
      window.app.showToast("Gemini AI-inställningar sparades! ⚙️");
    }
  }

  async testApiKeyConnection() {
    const keyInput = document.getElementById("geminiApiKeyInput");
    const modelSelect = document.getElementById("geminiModelSelect");
    const statusDiv = document.getElementById("geminiTestStatus");
    if (!keyInput || !statusDiv) return;

    const testKey = keyInput.value.trim();
    const testModel = modelSelect ? modelSelect.value : "gemini-1.5-flash";

    if (!testKey) {
      statusDiv.style.display = "block";
      statusDiv.style.background = "#fee2e2";
      statusDiv.style.color = "#991b1b";
      statusDiv.textContent = "⚠️ Ange en API-nyckel för att testa anslutningen.";
      return;
    }

    statusDiv.style.display = "block";
    statusDiv.style.background = "#f1f5f9";
    statusDiv.style.color = "#475569";
    statusDiv.textContent = "Testar anslutning mot Google Gemini...";

    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${testModel}:generateContent?key=${testKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: "Ping. Svara med ordet 'OK'." }] }]
        })
      });

      if (res.ok) {
        statusDiv.style.background = "#dcfce7";
        statusDiv.style.color = "#166534";
        statusDiv.textContent = "✓ Anslutning lyckades! Gemini API är redo att användas.";
      } else {
        const err = await res.json().catch(() => ({}));
        statusDiv.style.background = "#fee2e2";
        statusDiv.style.color = "#991b1b";
        statusDiv.textContent = `✕ Fel vid anslutning (${res.status}): ${err.error ? err.error.message : 'Kontrollera nyckeln'}`;
      }
    } catch (e) {
      statusDiv.style.background = "#fee2e2";
      statusDiv.style.color = "#991b1b";
      statusDiv.textContent = `✕ Nätverksfel: ${e.message}`;
    }
  }

  // =========================================================================
  // Event listeners
  // =========================================================================

  setupEventListeners() {
    // Tangentbordsgenväg: Ctrl + J öppnar eller stänger Gemini chat
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        this.toggleChat();
      } else if (e.key === "Escape" && this.isOpen) {
        this.closeChat();
      }
    });

    // Auto-expand textarea när man skriver
    const input = document.getElementById("geminiChatInput");
    if (input) {
      input.addEventListener("input", () => {
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 120) + "px";
      });
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  formatTime(isoStr) {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return "";
    }
  }
}

// Skapa global instans
const geminiIVA = new GeminiIVAAssistant();
window.geminiIVA = geminiIVA;
