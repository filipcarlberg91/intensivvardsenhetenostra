/**
 * IVA Dokumenthub - Läkemedelsregister, Spädningsinstruktioner & Blandbarhetsmatris
 * Autentiska kliniska beredningar och rekommendationer för svensk intensivvård.
 */

const IVA_DRUGS = [
  {
    id: "noradrenalin",
    name: "Noradrenalin",
    tradeNames: "Noradrenalin, Levophed",
    class: "Vasoaktiv / Inotropi (Alfa-1, svag Beta-1)",
    standardConc: "0.1 mg/ml (100 µg/ml)",
    altConc: "0.05 mg/ml (50 µg/ml) eller 0.2 mg/ml",
    dilutionGuide: "5 ml Noradrenalin (1 mg/ml) tillsätts till 45 ml Glukos 5% i 50 ml spruta för sprutpump = 0.1 mg/ml. För 0.05 mg/ml: 2.5 ml i 47.5 ml Glukos 5%.",
    approvedDiluents: "Glukos 5% (förstahandsval pga oxidationsskydd), NaCl 0.9%",
    doseUnit: "µg/kg/min",
    standardDoseRange: "0.02 – 0.50 µg/kg/min (vid refraktär chock upp till > 1.0 µg/kg/min)",
    infusionFormula: (weight, dose) => {
      // dose i µg/kg/min, conc i mg/ml (0.1 mg/ml = 100 µg/ml)
      // ml/h = (dose * weight * 60) / 100
      return (dose * weight * 60) / 100;
    },
    doseFromRate: (weight, rate) => {
      // rate i ml/h
      // dose = (rate * 100) / (weight * 60)
      return (rate * 100) / (weight * 60);
    },
    defaultDose: 0.10,
    administrationRoute: "Strikt centralt (CVK). Perifert endast i akut livräddande skede under kontinuerlig tillsyn pga nekrosrisk.",
    stability: "24 timmar i rumstemperatur. Skyddas mot ljus vid längre infusion.",
    clinicalNotes: "Titreras efter invasivt MAP (mål ≥ 65 mmHg). Spola ALDRIG infart där noradrenalin går! Vid doser > 0.25 µg/kg/min överväg tidigt tillägg av Vasopressin.",
    color: "#e11d48"
  },
  {
    id: "vasopressin",
    name: "Vasopressin",
    tradeNames: "Argipressin, Empressin",
    class: "Vasoaktiv (V1a-receptoragonist)",
    standardConc: "0.4 E/ml (20 E i 50 ml)",
    altConc: "0.2 E/ml",
    dilutionGuide: "1 ml Argipressin (20 E/ml) späds med 49 ml NaCl 0.9% eller Glukos 5% i 50 ml spruta = 0.4 E/ml.",
    approvedDiluents: "NaCl 0.9%, Glukos 5%",
    doseUnit: "E/min",
    standardDoseRange: "Fast dos: 0.03 – 0.04 E/min (ska EJ titreras)",
    infusionFormula: (weight, dose) => {
      // fast dos i E/min (oberoende av vikt)
      // vid 0.4 E/ml: ml/h = (dose * 60) / 0.4
      return (dose * 60) / 0.4;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 0.4) / 60;
    },
    defaultDose: 0.03,
    administrationRoute: "Central venkateter (CVK).",
    stability: "24 timmar.",
    clinicalNotes: "Andrahandsval vid vasodilaterande septisk chock med noradrenalinbehov > 0.25 µg/kg/min. Ska ej titreras upp och ner pga risk för perifer och splanknisk ischemi.",
    color: "#e11d48"
  },
  {
    id: "adrenalin",
    name: "Adrenalin",
    tradeNames: "Adrenalin, Epinefrin",
    class: "Inotropi / Kronotropi / Kärlsammandragande (Alfa & Beta)",
    standardConc: "0.1 mg/ml (100 µg/ml)",
    altConc: "0.02 mg/ml",
    dilutionGuide: "5 ml Adrenalin (1 mg/ml) tillsätts till 45 ml Glukos 5% i 50 ml spruta = 0.1 mg/ml.",
    approvedDiluents: "Glukos 5%, NaCl 0.9%",
    doseUnit: "µg/kg/min",
    standardDoseRange: "0.01 – 0.30 µg/kg/min (post-hjärtstopp, kardiogen chock, anafylaxi)",
    infusionFormula: (weight, dose) => {
      return (dose * weight * 60) / 100;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 100) / (weight * 60);
    },
    defaultDose: 0.05,
    administrationRoute: "Central venkateter (CVK).",
    stability: "24 timmar. Skyddas mot ljus.",
    clinicalNotes: "Potent beta-1 och alfa-effekt. Ökar myokardiets syrgasförbrukning och ger ofta övergående laktatstegring pga ökad aerob glykolys.",
    color: "#e11d48"
  },
  {
    id: "dobutamin",
    name: "Dobutamin",
    tradeNames: "Dobutamin, Dobutrex",
    class: "Inotropi (Beta-1 dominant agonist)",
    standardConc: "5.0 mg/ml (250 mg i 50 ml)",
    altConc: "2.5 mg/ml eller 1.0 mg/ml",
    dilutionGuide: "20 ml Dobutamin (12.5 mg/ml = 250 mg) blandas med 30 ml Glukos 5% i 50 ml spruta = 5.0 mg/ml (5000 µg/ml).",
    approvedDiluents: "Glukos 5%, NaCl 0.9%",
    doseUnit: "µg/kg/min",
    standardDoseRange: "2.5 – 15.0 µg/kg/min",
    infusionFormula: (weight, dose) => {
      // conc = 5000 µg/ml
      return (dose * weight * 60) / 5000;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 5000) / (weight * 60);
    },
    defaultDose: 5.0,
    administrationRoute: "Helst CVK. Kan ges kortvarigt perifert vid god venaccess.",
    stability: "24 timmar. Rosa missfärgning pga oxidation påverkar ej effekten.",
    clinicalNotes: "Ökar hjärtminutvolym (CO) vid kardiogen chock och akut hjärtsvikt. Kan orsaka perifer vasodilatation och arytmi.",
    color: "#f59e0b"
  },
  {
    id: "milrinon",
    name: "Milrinon",
    tradeNames: "Milrinon, Corotrop",
    class: "Inodilatator (Fosfodiesteras-3-hämmare)",
    standardConc: "0.2 mg/ml (10 mg i 50 ml)",
    altConc: "0.1 mg/ml",
    dilutionGuide: "10 ml Milrinon (1 mg/ml = 10 mg) späds med 40 ml Glukos 5% eller NaCl 0.9% = 0.2 mg/ml (200 µg/ml).",
    approvedDiluents: "Glukos 5%, NaCl 0.9%",
    doseUnit: "µg/kg/min",
    standardDoseRange: "0.25 – 0.75 µg/kg/min",
    infusionFormula: (weight, dose) => {
      return (dose * weight * 60) / 200;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 200) / (weight * 60);
    },
    defaultDose: 0.375,
    administrationRoute: "Central venkateter (CVK).",
    stability: "24 timmar.",
    clinicalNotes: "Sänker afterload (systemisk och pulmonell resistens) och ökar inotropi oberoende av beta-receptorer. Dosreduktion vid njursvikt!",
    color: "#f59e0b"
  },
  {
    id: "propofol",
    name: "Propofol",
    tradeNames: "Propofol, Diprivan, Propolipid",
    class: "Sedation / Sömnmedel (GABA-A-agonist)",
    standardConc: "20 mg/ml (2%)",
    altConc: "10 mg/ml (1%)",
    dilutionGuide: "Ges outspädd direkt från originalflaska/spruta via dedikerad pump.",
    approvedDiluents: "Ges outspädd. Får ej spädas utom vid TCI med Glukos 5%.",
    doseUnit: "mg/kg/h",
    standardDoseRange: "0.5 – 4.0 mg/kg/h (max 4.0 mg/kg/h vid längre IVA-vård)",
    infusionFormula: (weight, dose) => {
      // vid 20 mg/ml: ml/h = (dose * weight) / 20
      return (dose * weight) / 20;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 20) / weight;
    },
    defaultDose: 2.0,
    administrationRoute: "CVK eller grov PVK.",
    stability: "Max 12 timmars infusionstid per aggregat/spruta pga risk för bakterieväxt i fettemulsionen!",
    clinicalNotes: "Kräver kontinuerlig monitorering av triglycerider och CK vid långvarig infusion pga risk för Propofolinfusionssyndrom (PRIS). Ger vasodilatation och hypotoni.",
    color: "#0284c7"
  },
  {
    id: "dexmedetomidin",
    name: "Dexmedetomidin (Dexdor)",
    tradeNames: "Dexdor",
    class: "Sedation / Anxiolytikum (Selektiv Alfa-2-agonist)",
    standardConc: "4 µg/ml (200 µg i 50 ml)",
    altConc: "8 µg/ml",
    dilutionGuide: "2 ml Dexdor (100 µg/ml = 200 µg) späds med 48 ml NaCl 0.9% eller Glukos 5% i 50 ml spruta = 4 µg/ml.",
    approvedDiluents: "NaCl 0.9%, Glukos 5%",
    doseUnit: "µg/kg/h",
    standardDoseRange: "0.2 – 1.4 µg/kg/h (inget boluskrav på IVA)",
    infusionFormula: (weight, dose) => {
      // vid 4 µg/ml: ml/h = (dose * weight) / 4
      return (dose * weight) / 4;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 4) / weight;
    },
    defaultDose: 0.7,
    administrationRoute: "CVK eller perifer infart.",
    stability: "24 timmar.",
    clinicalNotes: "Kooperativ sedering (lätt väckbar patient, dämpar delirium) utan respiratorisk depression. Kan ge bradykardi och hypotoni vid snabb upptrappning.",
    color: "#0284c7"
  },
  {
    id: "remifentanil",
    name: "Remifentanil (Ultiva)",
    tradeNames: "Ultiva",
    class: "Analgesi / Opioid (Ultrakortverkande my-agonist)",
    standardConc: "50 µg/ml (2 mg i 40 ml)",
    altConc: "25 µg/ml eller 100 µg/ml",
    dilutionGuide: "Torrsubstans 2 mg rekonstitueras och späds till 40 ml NaCl 0.9% eller Glukos 5% = 50 µg/ml.",
    approvedDiluents: "NaCl 0.9%, Glukos 5%",
    doseUnit: "µg/kg/min",
    standardDoseRange: "0.05 – 0.30 µg/kg/min (upp till 0.5 µg/kg/min vid invasiv procedur)",
    infusionFormula: (weight, dose) => {
      // vid 50 µg/ml: ml/h = (dose * weight * 60) / 50
      return (dose * weight * 60) / 50;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 50) / (weight * 60);
    },
    defaultDose: 0.10,
    administrationRoute: "CVK eller dedikerad säker PVK.",
    stability: "24 timmar.",
    clinicalNotes: "Metaboliseras av ospecifika blod- och vävnadsesteraser. Halveringstid 3–5 min oberoende av njur- och leverfunktion. Kräver förberedelse av långverkande analgetika före avveckling!",
    color: "#7c3aed"
  },
  {
    id: "klonidin",
    name: "Klonidin (Catapresan)",
    tradeNames: "Catapresan",
    class: "Sedation / Sympatikushämmare (Alfa-2-agonist)",
    standardConc: "15 µg/ml (outspädd) eller 3 µg/ml",
    altConc: "3 µg/ml (150 µg i 50 ml)",
    dilutionGuide: "Kan ges outspädd 15 µg/ml i sprutpump, ELLER 1 ml (150 µg) späds med 49 ml NaCl 0.9% = 3 µg/ml.",
    approvedDiluents: "NaCl 0.9%, Glukos 5%",
    doseUnit: "µg/kg/h",
    standardDoseRange: "0.2 – 1.5 µg/kg/h",
    infusionFormula: (weight, dose) => {
      // vid 15 µg/ml: ml/h = (dose * weight) / 15
      return (dose * weight) / 15;
    },
    doseFromRate: (weight, rate) => {
      return (rate * 15) / weight;
    },
    defaultDose: 0.5,
    administrationRoute: "CVK eller PVK.",
    stability: "24 timmar.",
    clinicalNotes: "Effektivt vid sympatikushyperaktivitet, abstinens och agitation. Observera risk för bradykardi och rebound-hypertoni vid tvärt utsättande.",
    color: "#0284c7"
  },
  {
    id: "furosemid",
    name: "Furosemid (Furix)",
    tradeNames: "Furix, Furosemid, Impugan",
    class: "Loop-diuretikum",
    standardConc: "10 mg/ml (outspädd)",
    altConc: "2 mg/ml i infusionspåse",
    dilutionGuide: "Dras upp outspädd 10 mg/ml direkt i 50 ml spruta för kontinuerlig infusion.",
    approvedDiluents: "Outspädd (10 mg/ml) eller i NaCl 0.9%. FÅR EJ blandas med sura vätskor!",
    doseUnit: "mg/h",
    standardDoseRange: "5 – 40 mg/h (vid refraktär oliguri upp till 80 mg/h)",
    infusionFormula: (weight, dose) => {
      // vid 10 mg/ml: ml/h = dose / 10
      return dose / 10;
    },
    doseFromRate: (weight, rate) => {
      return rate * 10;
    },
    defaultDose: 10,
    administrationRoute: "CVK eller PVK.",
    stability: "24 timmar. Skyddas mot starkt ljus.",
    clinicalNotes: "OBS! Starkt basiskt pH (~9). Fäller OMEDELBART vid kontakt med sura läkemedel (Noradrenalin, Amiodaron, Milrinon m.fl.). Måste gå i separat lumen eller spolas rent emellan!",
    color: "#059669"
  },
  {
    id: "amiodaron",
    name: "Amiodaron (Cordarone)",
    tradeNames: "Cordarone, Amiodaron",
    class: "Antiarytmikum Klass III",
    standardConc: "6.0 mg/ml (300 mg i 50 ml)",
    altConc: "1.2 mg/ml vid påsinfusion",
    dilutionGuide: "6 ml Amiodaron (50 mg/ml = 300 mg) späds med 44 ml Glukos 5% i 50 ml spruta = 6 mg/ml. OBS: Endast Glukos 5%!",
    approvedDiluents: "ENDAST Glukos 5%. Fällning uppstår i NaCl 0.9%!",
    doseUnit: "mg/h",
    standardDoseRange: "Laddningsdos 300 mg under 20–60 min, därefter underhåll 25 – 50 mg/h (totalt 900–1200 mg/dygn)",
    infusionFormula: (weight, dose) => {
      // vid 6 mg/ml: ml/h = dose / 6
      return dose / 6;
    },
    doseFromRate: (weight, rate) => {
      return rate * 6;
    },
    defaultDose: 50,
    administrationRoute: "Alltid via CVK! Starkt kärlretande och flebitframkallande vid perifer infusion.",
    stability: "24 timmar i Glukos 5%.",
    clinicalNotes: "Inkompatibel med NaCl, Heparin och Furosemid. Risk för förlängt QTc och bradykardi.",
    color: "#dc2626"
  },
  {
    id: "insulin",
    name: "Insulin Snabbverkande (Actrapid)",
    tradeNames: "Actrapid, Novorapid",
    class: "Hormon / Glukosreglering",
    standardConc: "1 E/ml (50 E i 50 ml)",
    altConc: "2 E/ml",
    dilutionGuide: "0.5 ml Actrapid (100 E/ml = 50 E) tillsätts till 49.5 ml NaCl 0.9% i 50 ml spruta = 1 E/ml.",
    approvedDiluents: "NaCl 0.9%, Glukos 5%",
    doseUnit: "E/h",
    standardDoseRange: "1 – 10 E/h (titreras efter P-Glukos var 1–2:a timme, målområde 6.0 – 10.0 mmol/L)",
    infusionFormula: (weight, dose) => {
      // vid 1 E/ml: ml/h = dose / 1
      return dose;
    },
    doseFromRate: (weight, rate) => {
      return rate;
    },
    defaultDose: 2.0,
    administrationRoute: "CVK eller PVK.",
    stability: "24 timmar. Byt spruta dagligen.",
    clinicalNotes: "Spola igenom slangen med 5-10 ml beredning före uppstart då plasten adsorberar insulin. Kontrollera alltid Kalium vid höga doser!",
    color: "#0d9488"
  }
];

// Blandbarhetsmatris i CVK / Y-koppling
// Status: 'YES' (Kompatibel / Kan gå tillsammans), 'NO' (Inkompatibel / Fäller), 'CAUTION' (Försiktighet / Data saknas / Koncentrationsberoende)
const COMPATIBILITY_DATA = {
  "noradrenalin+propofol": {
    status: "YES",
    text: "Kompatibel i Y-koppling. Vanlig standardkombination på IVA.",
    details: "Kan administreras i samma skänkel vid god flödeshastighet."
  },
  "noradrenalin+vasopressin": {
    status: "YES",
    text: "Kompatibel i Y-koppling. Standardkombination vid refraktär septisk chock.",
    details: "Stabila tillsammans i Glukos 5% och NaCl 0.9%."
  },
  "noradrenalin+adrenalin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Båda är katekolaminer med likartad stabilitet i sur miljö."
  },
  "noradrenalin+dobutamin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan gå i samma skänkel."
  },
  "noradrenalin+milrinon": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Fysiskt och kemiskt kompatibla."
  },
  "noradrenalin+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Standard sedation/analgesi vid intuberad IVA-vård."
  },
  "noradrenalin+dexmedetomidin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan samadministreras i Y-koppling."
  },
  "noradrenalin+klonidin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kemiskt kompatibla."
  },
  "noradrenalin+insulin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Vanlig samtidig infusion vid kritisk sjukdom."
  },
  "noradrenalin+furosemid": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Kraftig risk för utfällning.",
    details: "Furosemid har högt basiskt pH (~9) medan Noradrenalin kräver surt pH (3-4). Fällning sker omedelbart i slangen. Måste gå i helt separat lumen!"
  },
  "noradrenalin+amiodaron": {
    status: "CAUTION",
    text: "Villkorlig / Försiktighet. Begränsad kompatibilitetsdata.",
    details: "Amiodaron fäller lätt vid pH-förändringar. Rekommenderas att ges i separat skänkel om möjligt."
  },

  // Propofol kombinationer
  "propofol+vasopressin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan gå tillsammans i samma lumen."
  },
  "propofol+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling. Standard TIVA-kombination.",
    details: "Mycket stabil kombination."
  },
  "propofol+dexmedetomidin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla."
  },
  "propofol+furosemid": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Emulsionen kan brytas och fälla.",
    details: "Propofol är en känslig olja-i-vatten emulsion. Skall ej blandas med starkt alkaliska Furosemid."
  },
  "propofol+amiodaron": {
    status: "NO",
    text: "INKOMPATIBEL! Emulsionsdestabilisering.",
    details: "Amiodaron bryter propofolemulsionen. Ge i skilda skänklar."
  },
  "propofol+insulin": {
    status: "CAUTION",
    text: "Villkorlig / Försiktighet.",
    details: "Risk för osäker absorption i lipidmatrisen. Ge helst i separat lumen."
  },

  // Furosemid kombinationer (mycket inkompatibelt)
  "furosemid+amiodaron": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Omedelbar fällning.",
    details: "Amiodaron fäller i basisk miljö. Måste separeras helt."
  },
  "furosemid+milrinon": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning uppstår direkt.",
    details: "Fysisk inkompatibilitet."
  },
  "furosemid+dobutamin": {
    status: "NO",
    text: "INKOMPATIBEL! Utfällning.",
    details: "Dobutamin inaktiveras och fäller vid högt pH."
  },
  "furosemid+remifentanil": {
    status: "CAUTION",
    text: "Försiktighet. Begränsade data.",
    details: "Opioider i sur lösning kan fälla med basisk Furosemid."
  },
  "furosemid+insulin": {
    status: "NO",
    text: "INKOMPATIBEL. Bör ej samadministreras.",
    details: "Separera i olika skänklar."
  },

  // Amiodaron kombinationer
  "amiodaron+insulin": {
    status: "CAUTION",
    text: "Villkorlig kompatibilitet.",
    details: "Separera om möjligt."
  },
  "amiodaron+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla i Glukos 5%."
  },

  // Dexmedetomidin kombinationer
  "dexmedetomidin+vasopressin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan ges i samma lumen."
  },
  "dexmedetomidin+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Stabil kombination för multimodal analgosedering."
  }
};

// Hjälpfunktion för att hämta kompatibilitet oavsett ordning
function getDrugCompatibility(idA, idB) {
  if (idA === idB) {
    return {
      status: "YES",
      text: "Samma läkemedel (Kompatibelt)",
      details: "Samma substans kan infunderas tillsammans."
    };
  }

  const key1 = `${idA}+${idB}`;
  const key2 = `${idB}+${idA}`;

  if (COMPATIBILITY_DATA[key1]) return COMPATIBILITY_DATA[key1];
  if (COMPATIBILITY_DATA[key2]) return COMPATIBILITY_DATA[key2];

  // Standard fallback vid okänd parning
  return {
    status: "CAUTION",
    text: "Begränsade kompatibilitetsdata",
    details: "Specifik Y-site studie saknas för denna kombination. Använd separata CVK-skänklar eller spola med NaCl emellan om möjligt."
  };
}
