import { DocumentItem } from '../types';
import { IVA_DRUGS } from './drugsData';
import { IVA_DISEASE_STATES, IVA_FLUIDS_DATA, ROSE_PHASES } from './clinicalData';

export function compileClinicalContext(docs: DocumentItem[]): string {
  let ctx = "KUNSKAPSBAS FÖR INTENSIVVÅRDSENHETEN ÖSTRA (IVA ÖSTRA):\n\n";

  // 1. DOKUMENT & PM
  ctx += `=== STYRANDE VÅRD-PM OCH RUTINER (${docs.length} st) ===\n`;
  docs.forEach((d) => {
    ctx += `• [${d.id}] ${d.title} (Kategori: ${d.category})\n`;
    ctx += `  Beskrivning: ${d.description || ""}\n`;
    if (d.tags && d.tags.length) ctx += `  Taggar: ${d.tags.join(", ")}\n`;
    if (d.content) ctx += `  Utdrag/Protokoll: ${d.content.substring(0, 400)}...\n`;
    ctx += "\n";
  });

  // 2. LÄKEMEDEL & SPÄDNINGSREGISTER
  ctx += "=== LÄKEMEDELSREGISTER & SPÄDNINGSINSTRUKTIONER ===\n";
  IVA_DRUGS.forEach((med) => {
    ctx += `• Läkemedel: ${med.name} (${med.class})\n`;
    ctx += `  Standardkoncentration: ${med.standardConc}\n`;
    ctx += `  Beredning/Spädning: ${med.dilutionGuide}\n`;
    ctx += `  Bärarvätska: ${med.approvedDiluents}\n`;
    ctx += `  Infart: ${med.administrationRoute}\n`;
    ctx += `  Standarddosering: ${med.standardDoseRange} (enhet: ${med.doseUnit})\n`;
    ctx += `  Kliniska observationer & Varningar: ${med.clinicalNotes}\n\n`;
  });

  // 3. SJUKDOMSTILLSTÅND PÅ IVA
  ctx += "=== HANDLÄGGNING AV SJUKDOMSTILLSTÅND PÅ IVA ===\n";
  IVA_DISEASE_STATES.forEach((st) => {
    ctx += `• ${st.title} (${st.category}):\n`;
    ctx += `  Kort sammanfattning: ${st.shortSummary}\n`;
    if (st.subtypes) {
      st.subtypes.forEach((sub) => {
        ctx += `  - ${sub.name}: Tecken: ${sub.signs}. Åtgärder: ${sub.actions.replace(/\n/g, ' ')}\n`;
      });
    }
    ctx += "\n";
  });

  // 4. VÄTSKETERAPI & ROSE
  ctx += "=== VÄTSKETERAPI & ROSE-KONCEPTET ===\n";
  IVA_FLUIDS_DATA.forEach((fl) => {
    ctx += `• ${fl.name} (${fl.category}): Osmolaritet: ${fl.osmolarity}. Elektrolyter: ${fl.electrolytes}. Huvudindikation: ${fl.primaryUse}. Varning: ${fl.caution}\n`;
  });
  ctx += "\nROSE-FASERNA:\n";
  ROSE_PHASES.forEach((rp) => {
    ctx += `- ${rp.letter} (${rp.name} / ${rp.subname}): Timing: ${rp.timing}. Mål: ${rp.goal}. Strategi: ${rp.fluidStrategy}\n`;
  });
  ctx += "\n% Fluid Overload = (Kumulativ vätskebalans i liter / Intagningsvikt i kg) * 100. >5% måttlig risk, >10% allvarlig risk med ökad mortalitet.\n\n";

  // 5. SYRA-BAS & BLODGAS
  ctx += "=== SYRA-BAS BALANS & BLODGASFORMEL ===\n";
  ctx += "Normalvärden: pH 7.35-7.45, pCO2 4.6-6.0 kPa, PaO2 10-14 kPa, HCO3 22-27 mmol/L, BE -3 till +3 mmol/L.\n";
  ctx += "Anjongap (AG) = Na+ - (Cl- + HCO3-). Normalt 8-12 mmol/L.\n";
  ctx += "Albuminkorrigerat AG = AG + 0.25 * (40 - Albumin g/L).\n";
  ctx += "Winters formel för kompensationsbedömning vid metabol acidos: Förväntad pCO2 (kPa) = 0.2 * HCO3- + 1.07 (+/- 0.27).\n";
  ctx += "Delta Ratio = (AG - 12) / (24 - HCO3-): <0.4 ren NAGMA, 0.4-0.8 blandad HAGMA+NAGMA, 0.8-2.0 ren HAGMA, >2.0 HAGMA + samtidig metabol alkalos.\n";
  ctx += "Horovitz-kvot (PaO2/FiO2): PaO2 (kPa) * 7.5 / FiO2. Normalt >400 mmHg. ARDS: Mild 200-300, Måttlig 100-200, Svår <100 mmHg.\n\n";

  // 6. NUTRITION
  ctx += "=== NUTRITION ENLIGT ESPEN PÅ IVA ===\n";
  ctx += "- Tidig akutfas (dygn 1-2): 20 kcal/kg/dygn.\n";
  ctx += "- Stabiliseringsfas (dygn 3+): 25-30 kcal/kg/dygn.\n";
  ctx += "- Proteinbehov: 1.2 - 2.0 g/kg/dygn för att motverka katabolism.\n";
  ctx += "- Propofol 10 mg/ml innehåller 1.1 kcal/ml från fettemulsion. Måste dras av från näringsordinationen!\n";

  return ctx;
}

export function generateLocalExpertResponse(userQuery: string): string {
  const q = userQuery.toLowerCase().trim();

  // 1. SPECIFIKA LÄKEMEDELSFRÅGOR
  if (q.includes("noradrenalin")) {
    return `### 💉 Noradrenalin (Norepinefrin) på IVA Östra

**Indikation:** Förstahandsval vid vasodilaterande / septisk chock för att återställa systemvaskulär resistens.

* **Standardstyrka:** **0.1 mg/ml** (100 µg/ml) eller **0.05 mg/ml** (50 µg/ml)
* **Beredning & Spädning:** 5 ml Noradrenalin (1 mg/ml) spädes i **45 ml Glukos 5%** i 50 ml spruta = 0.1 mg/ml (100 µg/ml).
* **Infart:** **Strikt central venkateter (CVK)**. I akut nödfall perifert i stor ven i max 30–60 min i väntan på CVK pga nekrosrisk.
* **Dosering:**
  * Startdos: 0.05 µg/kg/min
  * Vanlig underhållsdos: 0.02 – 0.50 µg/kg/min
  * Maxdos: > 1.0 µg/kg/min (Vid doser > 0.25 µg/kg/min, överväg tidigt tillägg av Vasopressin).
* **Målvärde:** MAP ≥ 65 mmHg (vid kronisk hypertoni ofta MAP 70–75 mmHg).
* **CVK Blandbarhet:** Blandbar i Y-koppling med Propofol, Dexdor, Vasopressin och Remifentanil. Får **ALDRIG** gå tillsammans med Furosemid (utfällning)!

👉 *Du kan beräkna exakt pumpinställning (ml/h) i fliken **Dos & CVK**.*`;
  }

  if (q.includes("propofol")) {
    return `### 💤 Propofol (Sedering på IVA Östra)

**Indikation:** Sedering av mekaniskt ventilerade intensivvårdspatienter.

* **Styrka:** Standard **20 mg/ml (2%)** eller 10 mg/ml (1%).
* **Beredning:** Ges outspädd direkt från originalflaska/spruta via dedikerad pump.
* **Kaloriinnehåll:** Innehåller **1.1 kcal/ml** fettemulsion! Detta måste räknas av från patientens dygnskalorier för att undvika övernutrition och fettlever.
* **Dosering:**
  * Underhållsdos: 0.5 – 4.0 mg/kg/h.
  * Maxdos: 4.0 mg/kg/h vid längre IVA-vård.
* **⚠️ Varning - PRIS (Propofol Infusion Syndrome):**
  * Risk vid doser > 4–5 mg/kg/h under > 48 h.
  * Tecken: Refraktär metabol acidos, rabdomyolys, hyperkalemi, hepatomegali, akut njursvikt och arytmi/hjärtsvikt.
  * Provtagning: Följ serum-triglycerider, CK och syra-bas dagligen.`;
  }

  if (q.includes("vasopressin") || q.includes("argipressin") || q.includes("empressin")) {
    return `### 💉 Vasopressin (Empressin) på IVA Östra

**Indikation:** Tilläggsbehandling vid refraktär septisk chock när Noradrenalinbehovet överstiger 0.25 µg/kg/min.

* **Styrka & Beredning:** 1 ml Argipressin (20 E/ml) späds med **49 ml NaCl 0.9% eller Glukos 5%** i 50 ml spruta = **0.4 E/ml**.
* **Dosering:** Fast dos **0.03 – 0.04 E/min** (motsvarar **4.5 – 6.0 ml/h** med standardspädning).
* **OBS:** Ska ej titreras upp och ner som noradrenalin, utan ges i fast dos. Titrera istället noradrenalin.
* **Infart:** Endast CVK.
* **Blandbarhet:** Kompatibel med Noradrenalin i Y-koppling.`;
  }

  if (q.includes("fosfat") || q.includes("glycophos") || q.includes("hypofosfatemi")) {
    return `### 🧪 Fosfat (Glycophos / Addex-Fosfat 1 mmol/ml) på IVA Östra

**Indikation:** Hypofosfatemi (P-Fosfat < 0,70 mmol/L; kritisk < 0,30 mmol/L), Refeeding-syndrom, CRRT-förluster och respiratorurträning (ATP-brist i diafragma).

* **Stamlösning:** **1 mmol fosfat/ml** (Glycophos 20 ml flaska = 20 mmol fosfat + 40 mmol Na⁺; OBS: MÅSTE SPÄDAS!).
* **Blandning 1 (Standard påse 100–250 ml för PVK/CVK):**
  * Tillsätt **20 ml (20 mmol) Fosfat** i **100 ml eller 250 ml NaCl 0,9% eller Glukos 5%** (= ca **0,2 mmol/ml** vid 100 ml).
  * Infunderas under **4–8 timmar** (minst 4 h; 25 ml/h vid 100 ml på 4h = **5 mmol/h**).
* **Blandning 2 (Sprutpump 50 ml i CVK vid vätskerestriktion):**
  * **20 ml (20 mmol) Fosfat + 30 ml NaCl 0,9% (eller Glukos 5%)** i 50 ml spruta = **0,4 mmol/ml**.
  * Ges i **CVK** under **4–6 timmar** (8,3 – 12,5 ml/h).
* **⚠️ CVK Blandbarhet:** Får **ALDRIG** samadministreras i samma skänkel som **Kalcium (Calcium-Sandoz)** pga kalciumfosfatutfällning! Kompatibelt med Kaliumklorid och Insulin.`;
  }

  if (q.includes("cpot") || q.includes("rass") || q.includes("smärta") || q.includes("sedering")) {
    return `### 📊 Smärtskattning (CPOT) & Sederingsgrad (RASS)

* **CPOT (Critical-Care Pain Observation Tool):**
  * 4 domäner (Ansiktsuttryck, Kroppsrörelser, Muskeltonus, Ventilatoranpassning/Vokalisering), 0–2 poäng per domän.
  * Mål på IVA: **CPOT ≤ 2 poäng**.
  * Vid **CPOT ≥ 3 poäng**: Föreligger signifikant smärta som kräver analgesi.
* **RASS (Richmond Agitation-Sedation Scale):**
  * Tiogradig skala från +4 (Våldsam) till -5 (Oväckbar).
  * Standardmål: **RASS 0 till -1** (vaken och lugn eller lätt dåsig) vid urträning.
  * Djup sedering (**RASS -4 till -5**): Endast vid svår ARDS, bukläge, muskelrelaxantia eller förhöjt ICP.

👉 *Använd interaktiva skattningsverktyget under fliken **Smärta & Sedering**.*`;
  }

  if (q.includes("blandbar") || q.includes("cvk") || q.includes("y-koppling") || q.includes("kompatib")) {
    return `### ⚡ CVK Blandbarhet & Kompatibilitet på IVA Östra

* **Säkra kombinationer (Grön status i Y-koppling):**
  * Noradrenalin + Propofol: Kompatibla i Y-koppling med godkänd bärarvätska.
  * Noradrenalin + Vasopressin: Mycket god blandbarhet i vasoaktiv skänk.
  * Noradrenalin + Remifentanil / Dexdor: Kompatibla.
* **Kritiska inkompatibiliteter (Röd status - FÅR EJ GÅ TILLSAMMANS):**
  * **Furosemid (Furix):** Har basiskt pH (~9). Får **ALDRIG** gå tillsammans med Noradrenalin, Adrenalin eller Amiodaron (surt pH → omedelbar utfällning som täpper katetern!).
  * **Amiodaron:** Utfäller i ren NaCl 0.9%. Måste spädas i **Glukos 5%** och kräver egen ren skänk.
* **3-Lumen CVK Rekommenderad Allokering:**
  * **Distal (16G, brun):** CVP-mätning, blodprodukter, kolloider/albumin.
  * **Medial (18G, blå):** TPN (SmofKabiven), elektrolyter, underhållsvätskor.
  * **Proximal (18G, vit):** Vasoaktiva infusioner (Noradrenalin, Vasopressin) och sedering.`;
  }

  if (q.includes("blodgas") || q.includes("acid") || q.includes("abl") || q.includes("anjongap")) {
    return `### 🧪 Syra-Bas & Blodgasanalys (Radiometer ABL)

Systematisk 5-stegs analys på IVA:
1. **pH:** Acidemi (< 7.35) eller Alkalemi (> 7.45).
2. **Respiratorisk komponent:** pCO2 normalt 4.6–6.0 kPa.
3. **Metabolisk komponent:** Standardbikarbonat (22–27 mmol/L) och Base Excess (-3 till +3 mmol/L).
4. **Anjongap:** AG = Na⁺ - (Cl⁻ + HCO3⁻). Normalt 8–12 mmol/L.
   * Vid hypoalbuminemi: Korrigerat AG = AG + 0.25 × (40 - S-Albumin).
5. **Kompensation (Winters formel vid metabol acidos):**
   * Förväntad pCO2 (kPa) = 0.2 × HCO3⁻ + 1.07 (± 0.27).
6. **Horovitz-kvot (PaO2/FiO2):** PaO2 i kPa × 7.5 / FiO2.
   * Normalt > 400 mmHg. ARDS-kriterier: Mild 200–300, Måttlig 100–200, Svår < 100 mmHg.

👉 *Mata in dina värden i fliken **Syra-Bas** för automatisk fullständig beräkning.*`;
  }

  if (q.includes("befuktare") || q.includes("950") || q.includes("fp950")) {
    return `### 🫁 F&P 950™ Respiratorisk Befuktare

* **Måltemperaturer:**
  * Invasiv ventilation (tub/trakeostomi): **Fast 37.0 °C** (100% RH, 44 mg/L vattenånga).
  * Mask / NIV: **31.0 °C** (Komfortval: 31 °C Standard, 29 °C Mellan, 27 °C Låg).
  * Optiflow™ högflödessyrgas: **37.0 °C** (Komfortval: 37 °C, 35 °C, 33 °C).
* **Placering:** Alltid i våg och **lägre än patientens huvud** för att hindra kondensat från att rinna ner i luftvägarna.
* **Larm:** Pausa med gula knappen (2 min tystnad). Kontrollera vattenpåse vid "No Water" och slangkopplingar vid "Disconnection".
* **Rengöring:** Torka av med Isopropanol, Etanol eller Väteperoxid. Använd **ALDRIG** ammoniak, kaustiksoda, klorin eller aceton.

👉 *Se fullständig PM under sektionen **Respiration**.*`;
  }

  // Generellt standardsvar
  return `### 🏥 Intensivvårdsenheten Östra (IVA Östra)

Jag är din kliniska IVA-assistent och har full tillgång till:
* **Styrande PM & Rutiner** (F&P 950 Befuktare, ARDS, m.fl.)
* **Läkemedelsregister & Spädningsguider** (Noradrenalin, Vasopressin, Propofol, m.fl.)
* **CVK Blandbarhet & Y-kopplingsmatris**
* **Interaktiv Blodgaskalkylator** (ABL slip, Anjongap, Winters formel, PaO2/FiO2)
* **Vätskebalans & ROSE-modellen** samt Dropptaktsräknare
* **ESPEN Nutritionskalkylator & Kaloritabell IVA 343**
* **CPOT & RASS** smärt- och sederingsskalor
* **Servo-U Ventilatorguide** och lungprotektiva inställningar

Ställ gärna en specifik klinisk fråga eller välj ett av snabbvalen!`;
}
