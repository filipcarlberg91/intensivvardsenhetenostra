export interface NormalValueRow {
  parameter: string;
  normalRange: string;
  targetIva: string;
  note: string;
  isCritical?: boolean;
}

export interface SettingCardItem {
  label: string;
  value: string;
  detail?: string;
}

export interface SettingProtocolCard {
  title: string;
  badge: string;
  items: SettingCardItem[];
}

export interface GoodToKnowBox {
  title: string;
  type: 'pearl' | 'warning' | 'checklist';
  points: string[];
}

export interface CategoryQuickLink {
  label: string;
  targetCategory: string;
  desc: string;
}

export interface CategoryHubInfo {
  categoryId: string;
  hubTitle: string;
  hubSummary: string;
  quickLinks: CategoryQuickLink[];
  normalValues: NormalValueRow[];
  settingsAndProtocols: SettingProtocolCard[];
  goodToKnow: GoodToKnowBox[];
}

export const CATEGORY_HUB_DATA: Record<string, CategoryHubInfo> = {
  Respiration: {
    categoryId: 'Respiration',
    hubTitle: 'Respiration – Normalvärden, Ventilatorinställningar & Klinisk Hubb',
    hubSummary:
      'Samlad klinisk översikt för lungprotektiv ventilation, blodgasmål, Servo-U-inställningar, aktiv befuktning (F&P 950), högflödesgrimma/NIV och luftvägshantering på IVA Östra.',
    quickLinks: [
      {
        label: 'Servo-U Ventilator & Apparatur',
        targetCategory: 'EQUIPMENT',
        desc: 'Moder, PBW-kalkylator, Pplat, ΔP & larmlista',
      },
      {
        label: 'Blodgas & Syra-Bas (Radiometer ABL)',
        targetCategory: 'ACID_BASE',
        desc: 'Horovitz (P/F-kvot), Anjongap, Winters & ventilatorråd',
      },
      {
        label: 'ARDS & Respirationssvikt',
        targetCategory: 'DISEASES',
        desc: 'ARDS Typ 1 & 2, Berlin-kriterier & bukläge',
      },
    ],
    normalValues: [
      {
        parameter: 'SpO₂ (Pulsoximetri)',
        normalRange: '96–100 %',
        targetIva: '92–96 % (KOL/Hyperkapni: 88–92 %)',
        note: 'Undvik hyperoxi (PaO₂ > 16 kPa) pga fria syreradikaler och absorptionsatelektaser.',
      },
      {
        parameter: 'PaO₂ (Artärblodgas)',
        normalRange: '10,0–13,3 kPa',
        targetIva: '8,0–11,5 kPa (ARDS: 7,3–10,5 kPa)',
        note: 'Utvärderas alltid i relation till aktuell FiO₂ (P/F-kvot).',
      },
      {
        parameter: 'PaCO₂ (Artärblodgas)',
        normalRange: '4,6–6,0 kPa',
        targetIva: '4,5–6,0 kPa (Tillåt hyperkapni vid ARDS om pH > 7,20)',
        note: 'Kontraindicerat med permissiv hyperkapni vid förhöjt ICP / akut hjärnskada (mål 4,5–5,0 kPa).',
      },
      {
        parameter: 'P/F-kvot (Horovitz-kvot = PaO₂ / FiO₂)',
        normalRange: '> 53 kPa (> 400 mmHg)',
        targetIva: '> 26,6 kPa (> 200 mmHg)',
        note: 'Mild ARDS: 26,6–40 kPa | Måttlig: 13,3–26,6 kPa | Svår: < 13,3 kPa (< 100 mmHg).',
        isCritical: true,
      },
      {
        parameter: 'Tidalvolym (VT per kg idealvikt PBW)',
        normalRange: '6–8 mL/kg PBW',
        targetIva: '6 mL/kg PBW (ARDS: 4–6 mL/kg PBW)',
        note: 'Baseras ALLTID på kroppslängd och biologiskt kön (PBW) – aldrig faktisk kroppsvikt!',
        isCritical: true,
      },
      {
        parameter: 'Platåtryck (Pplat vid Insp. paus)',
        normalRange: '< 20 cmH₂O',
        targetIva: '< 28–30 cmH₂O',
        note: 'Mäts med 2–3 s inspiratorisk paus på Servo-U. Speglar det alveolära sluttrycket.',
        isCritical: true,
      },
      {
        parameter: 'Drivtryck (ΔP = Pplat − PEEPtot)',
        normalRange: '5–10 cmH₂O',
        targetIva: '< 14–15 cmH₂O',
        note: 'Starkaste prediktorn för ventilatororsakad lungskada (VILI). Vid ΔP ≥ 15: sänk VT eller optimera PEEP.',
        isCritical: true,
      },
      {
        parameter: 'Statisk Compliance (Cstat)',
        normalRange: '60–100 mL/cmH₂O',
        targetIva: '> 40 mL/cmH₂O (ARDS ofta 15–35 mL/cmH₂O)',
        note: 'Formel: VT / (Pplat − PEEPtot). Sjunker vid lungödem, atelektas, ARDS, pneumothorax, buktryck.',
      },
      {
        parameter: 'P0.1 (Ocklusionstryck vid 100 ms)',
        normalRange: '1,0–2,5 cmH₂O',
        targetIva: '1,5–3,5 cmH₂O',
        note: '< 1,5 = överassisterad/för djupt sederad. > 3,5–4,0 = lufthunger, hög andningsdrive (risk för P-SILI).',
      },
      {
        parameter: 'etCO₂ – PaCO₂-gradient',
        normalRange: '0,3–0,7 kPa',
        targetIva: '< 1,0 kPa',
        note: 'Ökad klyfta (> 1,5 kPa) talar för ökat alveolärt dead-space (lungemboli, emfysem, hypovolemi/lågt CO).',
      },
      {
        parameter: 'Cufftryck (Endotrakealtub / Trakealkanyl)',
        normalRange: '20–30 cmH₂O',
        targetIva: '25–28 cmH₂O',
        note: '< 20 cmH₂O ökar risk för mikroaspiration/VAP. > 30 cmH₂O ger slemhinneischemi i trakea.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Servo-U Standarduppstart (Invasiv Ventilation)',
        badge: 'Grundinställning',
        items: [
          { label: 'Förstahandsmod (Kontrollerad)', value: 'PRVC eller PC', detail: 'Ställ alltid in kön & längd för PBW först!' },
          { label: 'Tidalvolym (VT)', value: '6 mL/kg PBW (4–8 mL/kg)', detail: 'Män: 50 + 0,91×(cm−152,4) | Kvinnor: 45,5 + 0,91×(cm−152,4)' },
          { label: 'PEEP (Grundnivå)', value: '5–8 cmH₂O (Obesitas/ARDS: 10–15 cmH₂O)', detail: 'Undvik PEEP < 5 cmH₂O hos intuberad patient' },
          { label: 'Andningsfrekvens (AF) & I:E', value: '14–18 /min • I:E 1:2', detail: 'Vid KOL/Astma: AF 10–12 /min och I:E 1:3–1:4' },
          { label: 'Triggerkänslighet', value: 'Flödestrigger 2 (Grönt fält)', detail: 'Vid autotriggning: sänk känslighet mot trycktrigger' },
        ],
      },
      {
        title: 'Spontanandning (PS/CPAP) & Cykelavslut',
        badge: 'Urträning & Synkroni',
        items: [
          { label: 'Tryckunderstöd (PS över PEEP)', value: '6–12 cmH₂O', detail: 'Titrera mot AF 12–25/min, VT 6–8 mL/kg och P0.1 1,5–3,5' },
          { label: 'Inspirationsavslut (Normal lunga)', value: '30 % av toppflöde', detail: 'Standardvärde på Servo-U i PS/CPAP' },
          { label: 'Inspirationsavslut vid KOL / Obstruktivitet', value: '40–60 % (Höj!)', detail: 'Bryter inspirationen tidigare -> längre utandning, mindre Auto-PEEP' },
          { label: 'Inspirationsavslut vid ARDS / Stel lunga', value: '10–20 % (Sänk!)', detail: 'Förlänger inspirationen -> motverkar dubbeltriggning' },
          { label: 'SBI / RSBI inför extubation', value: '< 100–105 (AF / VT i liter)', detail: 'Kräver vaken patient, god hostkraft och cuff-leak' },
        ],
      },
      {
        title: 'NIV, Optiflow (High Flow) & Befuktning (F&P 950)',
        badge: 'Icke-invasivt & Befuktare',
        items: [
          { label: 'Högflödesgrimma (Optiflow)', value: 'Flöde 40–60 L/min • FiO₂ 21–100 %', detail: 'ROX-index = (SpO₂/FiO₂)/AF -> ROX ≥ 4,88 talar för framgång' },
          { label: 'NIV (Tryckunderstödd mask)', value: 'PEEP 5–8 cmH₂O • PS 6–12 cmH₂O', detail: 'Acceptera maskläckage < 25–30 L/min; undvik trycksår över näsrygg' },
          { label: 'F&P 950 – Invasivt läge', value: '37,0 °C vid Y-stycket (44 mg H₂O/L)', detail: 'Kontrollera att både gul och blå givarpropp är helt intryckta' },
          { label: 'F&P 950 – Mask / Trach / Optiflow', value: 'Mask/Trach: 31 °C | Optiflow: 37 °C', detail: 'Varning: Kombinera ALDRIG aktiv befuktare med HME-filter!' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Felsökning vid Högt Luftvägstryck (High Paw) – Ppeak vs Pplat',
        type: 'pearl',
        points: [
          'Gör en Inspiratorisk Paus (2–3 sek) och jämför Topptryck (Ppeak) med Platåtryck (Pplat):',
          'Högt Ppeak men normalt Pplat (< 25–30 cmH₂O): Ökat luftvägsmotstånd! Orsak: Slempropp i tuben, bronkospasm, patienten biter på tuben, knickad slang eller vattenmättat HME-filter.',
          'Både Ppeak och Pplat är förhöjda: Försämrad lung-/thoraxcompliance! Orsak: Atelektas, lungödem, ARDS-progress, tub i höger huvudbronk, övertryckspneumothorax eller bukcompartmentsyndrom (högt IAP).',
        ],
      },
      {
        title: 'Kritiska Säkerhetsregler (Röda Flaggor)',
        type: 'warning',
        points: [
          'ALDRIG HME-filter samtidigt som aktiv befuktare (F&P 950) eller nebulisator (Aerogen) –filtret sväller igen och ger total ocklusion!',
          'Vid akut desaturation på ventilator (DOPES): Displacering av tub? Ocklusion (slem/bitning)? Pneumothorax? Equipment failure (koppla loss och ventilera med Rubens blåsa + 100% O₂!)? Stacked breaths (Auto-PEEP – koppla loss 10 sek för att släppa ut luft!)?',
          'Bukläge (Proning) vid svår ARDS (P/F < 15–20 kPa): Minst 16 sammanhängande timmar/dygn. Kontrollera tryckavlastning av ögon, ansikte, bröstkorg/crista och tubfixering efter varje vändning.',
        ],
      },
      {
        title: 'Bedside-checklista vid varje pass (Respiratorpatient)',
        type: 'checklist',
        points: [
          'Kontrollera tubläge vid mungipa/näsborre (cm-markering dokumenterad) samt cufftryck (25–28 cmH₂O).',
          'Verifiera att reservutrustning finns vid sängplatsen: Rubens blåsa med syrgasslang, fungerande sug med sugkatetrar och trakealdilatator (vid trakeostomi).',
          'Kontrollera att larmgränser för Minutvolym (MVe ±25 %), Luftvägstryck (Ppeak +10 cmH₂O över arbetstryck, max 40 cmH₂O) och Apné/Reservventilation är korrekt satta.',
        ],
      },
    ],
  },

  Circulation: {
    categoryId: 'Circulation',
    hubTitle: 'Cirkulation – Hemodynamik, Vasoaktiva Mål & Klinisk Hubb',
    hubSummary:
      'Referensvärden för hemodynamisk övervakning (Artärnål, CVP, PiCCO/Termodilution), chockbehandling, vasoaktiva/inotropa infusioner, laktatclearance och vätskeresponsivitet på IVA Östra.',
    quickLinks: [
      {
        label: 'Doskalkylator & Blandbarhet i CVK',
        targetCategory: 'DRUGS',
        desc: 'Noradrenalin, Vasopressin, Dobutamin, Levosimendan & Y-koppling',
      },
      {
        label: 'Chock & Kardiella Tillstånd',
        targetCategory: 'DISEASES',
        desc: 'Septisk chock, Kardiogen chock, ACS & Lungemboli',
      },
      {
        label: 'Vätsketerapi & ROSE',
        targetCategory: 'FLUID_BALANCE',
        desc: 'Balanserade kristalloider, Albumin & Fluid Overload',
      },
    ],
    normalValues: [
      {
        parameter: 'MAP (Medelartärtryck)',
        normalRange: '70–100 mmHg',
        targetIva: '≥ 65 mmHg (Kronisk hypertoni/AKI-risk: 70–75 mmHg)',
        note: 'Vid okontrollerad blödning/trauma utan TBI: permissiv hypotoni MAP 50–60 mmHg tills blödningskontroll.',
        isCritical: true,
      },
      {
        parameter: 'S-Laktat (Artärblodgas)',
        normalRange: '0,5–1,6 mmol/L',
        targetIva: '< 2,0 mmol/L (Mål: sjunkande > 10–20 % per 2 h)',
        note: '> 2,0 mmol/L + vasopressorbehov för MAP ≥ 65 trots vätska = Septisk chock (Sepsis-3).',
        isCritical: true,
      },
      {
        parameter: 'ScvO₂ (Centralvenös syremättnad, CVK)',
        normalRange: '70–80 %',
        targetIva: '≥ 70 % (SvO₂ i pulmonalis: ≥ 65 %)',
        note: 'Lågt ScvO₂ (< 65–70 %) = otillräcklig syrgasleverans (DO₂) pga lågt CO, anemi eller hypoxi. Högt (> 85 %) ses vid septisk shunt/mitokondriedysfunktion.',
        isCritical: true,
      },
      {
        parameter: 'Ven-artär pCO₂-gap (ΔpCO₂ = PvCO₂ − PaCO₂)',
        normalRange: '0,3–0,8 kPa (2–6 mmHg)',
        targetIva: '< 0,8 kPa (< 6 mmHg)',
        note: 'ΔpCO₂ > 0,8 kPa (> 6 mmHg) talar starkt för otillräckligt hjärtminutvolymflöde (lågt Cardiac Output) även om ScvO₂ ser normalt ut!',
      },
      {
        parameter: 'Cardiac Index (CI – Hjärtindex via PiCCO/PA)',
        normalRange: '2,5–4,0 L/min/m²',
        targetIva: '> 2,2–2,5 L/min/m²',
        note: 'Cardiac Output (CO) normalvärde 4,0–8,0 L/min. CI < 2,2 L/min/m² + hypoperfusion indikerar kardiogen svikt.',
      },
      {
        parameter: 'SVRI (Systemvaskulärt resistansindex)',
        normalRange: '1700–2400 dyn·s·cm⁻⁵·m²',
        targetIva: '1600–2400 dyn·s·cm⁻⁵·m²',
        note: 'Lågt (< 1500) vid distributiv/septisk chock (vasoplegi). Högt (> 2500) vid kardiogen/hypovolem chock.',
      },
      {
        parameter: 'GEDVI (Global End-Diastolic Volume Index)',
        normalRange: '680–800 mL/m²',
        targetIva: '680–800 mL/m²',
        note: 'Volymetriskt mått på preload (fyllnad i hjärtats alla 4 rum via PiCCO). Säkrare än CVP för volymstatus.',
      },
      {
        parameter: 'EVLWI (Extravascular Lung Water Index)',
        normalRange: '3,0–7,0 mL/kg PBW',
        targetIva: '< 10 mL/kg PBW',
        note: '> 10 mL/kg talar för manifest lungödem / kapillärläckage (bromsa vätsketillförsel!).',
      },
      {
        parameter: 'PPV / SVV (Pulstrycks-/Slagvolymsvariation)',
        normalRange: '< 10 %',
        targetIva: '> 12–13 % = Sannolikt vätskeresponsiv',
        note: 'Gäller ENDAST vid sinusrytm, kontrollerad ventilation utan spontanandning och VT ≥ 8 mL/kg.',
      },
      {
        parameter: 'CVP (Centralt ventryck)',
        normalRange: '2–8 mmHg',
        targetIva: '6–12 mmHg (intuberad med PEEP)',
        note: 'Dåligt mått på vätskeresponsivitet isolerat, men viktigt som ”back-pressure” för organperfusion (MAP − CVP) och vid högerkammarsvikt/tamponad.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Vasoaktiva & Inotropa Förstahandsval på IVA',
        badge: 'Vasoaktiva Dropp',
        items: [
          { label: 'Noradrenalin (Förstahandspressor)', value: '0,02–0,5 µg/kg/min (Styrka 0,1 el. 0,2 mg/ml)', detail: 'α₁- och β₁-agonist. Ges i dedikerad CVK-skänkel utan bolusar.' },
          { label: 'Vasopressin (Empressin – Tillägg)', value: '0,01–0,03 E/min (Fast dos, ej viktbaserad)', detail: 'Läggs till vid septisk chock när Noradrenalin överstiger 0,25–0,3 µg/kg/min. Katekolaminsparande via V₁-receptorer.' },
          { label: 'Dobutamin (Inotropi vid lågt CO)', value: '2–15 µg/kg/min', detail: 'β₁-agonist vid kardiogen chock eller septisk kardiomyopati med lågt CI/ScvO₂.' },
          { label: 'Levosimendan (Simdax)', value: '0,05–0,2 µg/kg/min under 24 h', detail: 'Kalciumsensitiserare + K-kanalöppnare. Ingen laddningsdos på IVA pga hypotensionsrisk! Effekt kvarstår 7–9 dygn.' },
          { label: 'Milrinon (Corotrop)', value: '0,25–0,75 µg/kg/min', detail: 'PDE3-hämmare (inodilatator) – utmärkt vid högerkammarsvikt och pulmonell hypertension. Obs njurfunktion!' },
        ],
      },
      {
        title: 'Artärnål, Tryckset & Vätskeresponsivitet (PLR)',
        badge: 'Monitorering',
        items: [
          { label: 'Nollställning av tryckdom', value: 'Flebostatiska axeln (4:e revbensinterstitiet, mellersta axillarlinjen)', detail: 'Nollställ vid passets start samt efter varje höjd-/lägesändring av sängen.' },
          { label: 'Övertrycksmanschett', value: '300 mmHg (ger kontinuerligt flöde ~3 mL/h)', detail: 'Endast steril NaCl 9 mg/ml utan tillsatser i tryckspolpåsen!' },
          { label: 'Passive Leg Raising (PLR-test)', value: 'Sittande 45° -> Plan rygg + ben 45° i 60–90 sek', detail: 'Autotransfusion av ~300 mL blod. Ökning av CO/SV eller pulstryck ≥ 10–15 % bekräftar vätskeresponsivitet utan att ge en enda droppe vätska!' },
          { label: 'Kapillär återfyllnadstid (CRT) & Mottling', value: 'CRT < 3 sek • Mottling score 0–1', detail: 'Snabb klinisk markör för perifer mikrocirkulation (ANDROMEDA-SHOCK).' },
        ],
      },
      {
        title: 'Akut Förmaksflimmer & Elektrolytmål vid Arytmi',
        badge: 'Arytmikontroll',
        items: [
          { label: 'Elektrolytoptimering vid arytmi', value: 'S-Kalium 4,5–5,0 mmol/L • S-Magnesium > 1,0–1,2 mmol/L', detail: 'Korrigera alltid K⁺ och Mg²⁺ direkt vid nytillkommet FF eller VES/VT!' },
          { label: 'Magnesiumsulfat (Addex-Mg) bolus', value: '10–20 mmol i.v. på 20–30 min', detail: 'Stabiliserar myokardiet och förstärker effekten av Amiodaron/betablockad.' },
          { label: 'Amiodaron (Cordarone) i CVK', value: 'Laddning 300 mg i 5% Glukos på 20–30 min, sedan 900 mg/24 h', detail: 'Blandas ENDAST i Glukos 50 mg/ml (5 %) – fäller ut i NaCl! Ges i CVK (kärlretande).' },
          { label: 'Synkroniserad Elkonvertering', value: 'Bifasiskt 120–150–200 J (alltid SYNC-knapp intryckt!)', detail: 'Förstahandsval vid hemodynamiskt instabilt förmaksflimmer/fladder eller VT med puls.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Artärkurvans utseende – Underdämpning vs Överdämpning',
        type: 'pearl',
        points: [
          'Överdämpad kurva (slät, avrundad, försvunnen dikrotisk våg): Ger falskt LÅGT systoliskt tryck och falskt HÖGT diastoliskt tryck (men MAP är ofta relativt korrekt). Orsak: Luftbubbla i trycksetet, koagel i spetsen, knickad artärnål eller för lågt tryck i övertrycksmanschetten (< 300 mmHg).',
          'Underdämpad kurva / ”Whip” (spetsig resonansspik): Ger falskt HÖGT systoliskt tryck, medan MAP förblir korrekt. Styr därför alltid noradrenalin på MAP (inte systoliskt tryck) om inte specifik indikation (t.ex. aortadissektion/ICH) föreligger!',
        ],
      },
      {
        title: 'Säkerhet vid Vasoaktiva Infusioner (Röda Flaggor)',
        type: 'warning',
        points: [
          'Ge ALDRIG en snabb flush/bolus i samma CVK-skänkel som Noradrenalin, Adrenalin eller Vasopressin går i – det trycker in en livshotande bolusdos av vasopressorn i patienten!',
          'Vid byte av Noradrenalin-spruta: Använd dubbelpumpsteknik (överlappning) så att blodtrycket inte rasar under sprutbytet.',
          'Hydrokortison (Solu-Cortef 50 mg x 4 eller 200 mg/dygn inf.) övervägs vid refraktär septisk chock med högt noradrenalinbehov (> 0,25 µg/kg/min i > 4 h).',
        ],
      },
      {
        title: 'De 4 Chocktyperna – Snabb Differentialdiagnostik med UCG/PiCCO',
        type: 'checklist',
        points: [
          'Distributiv (Septisk / Anafylaktisk): Högt/normalt CO, lågt SVRI, varma extremiteter initialt, högt kapillärläckage.',
          'Hypovolem (Blödning / Dehydrering): Lågt CO, lågt CVP/GEDVI, högt SVRI, sammanfallande vena cava på UCG.',
          'Kardiogen (Infarkt / Svikt / Myokardit): Lågt CI (< 2,2), högt CVP/inkilningstryck, högt SVRI, nedsatt EF på UCG.',
          'Obstruktiv (Tamponad / Lungemboli / Övertryckspneumothorax): Lågt CO, högt CVP, dilaterad högerkammare eller perikardvätska på akut UCG.',
        ],
      },
    ],
  },

  Nutrition: {
    categoryId: 'Nutrition',
    hubTitle: 'Nutrition – ESPEN-Mål, Sondmatning, Refeeding & Klinisk Hubb',
    hubSummary:
      'Riktlinjer för enteral och parenteral nutrition på IVA Östra enligt ESPEN, Compat Ella® nutritionspump, ventrikelretentionsgränser, propofol-/glukosavräkning och refeedingsyndrom.',
    quickLinks: [
      {
        label: 'ESPEN Nutritionskalkylator & IVA 343 Meny',
        targetCategory: 'NUTRITION',
        desc: 'Beräkna kcal/protein, Propofolavräkning & kaloritabell',
      },
      {
        label: 'Vätskebalans & Diures',
        targetCategory: 'FLUID_BALANCE',
        desc: '24h vätskebalans och kumulativ vätskeöverskottsrisk',
      },
      {
        label: 'Dos & CVK (Fosfat, Elektrolyter, Insulin)',
        targetCategory: 'DRUGS',
        desc: 'Glycophos/Addex-Fosfat, Actrapid & Kalium',
      },
    ],
    normalValues: [
      {
        parameter: 'Energimål Akut Fas (Dag 1–3 på IVA)',
        normalRange: 'Hypokalorisk uppstart',
        targetIva: '10–15 kcal/kg/dygn (max 70 % av energibehov)',
        note: 'Undvik övernäring i tidig katabol fas (endogen glukosproduktion ger redan 500–1000 kcal/d).',
        isCritical: true,
      },
      {
        parameter: 'Energimål Stabil / Sen Akut Fas (Dag 4+)',
        normalRange: '20–25 kcal/kg/dygn',
        targetIva: '20–25 kcal/kg/dygn (Återhämtnings-/anabol fas: 25–30 kcal/kg/d)',
        note: 'Vid BMI > 30 beräknas målet på idealvikt (PBW) eller justerad kroppsvikt (ABW).',
        isCritical: true,
      },
      {
        parameter: 'Proteinmål på IVA (ESPEN)',
        normalRange: '0,8 g/kg/dygn (friska)',
        targetIva: '1,2–1,5 g/kg/dygn (CRRT / Brännskada / Öppen buk: 1,5–2,0 g/kg/d)',
        note: 'Kontinuerlig dialys (CRRT) medför förlust av ~10–15 g aminosyror/dygn i dialysatet.',
        isCritical: true,
      },
      {
        parameter: 'B-Glukos (Blodsocker på IVA)',
        normalRange: '4,0–6,0 mmol/L',
        targetIva: '6,0–10,0 mmol/L (NICE-SUGAR)',
        note: 'Starta Actrapid-infusion (1 E/ml) vid B-Glukos > 10 mmol/L vid två mätningar. Undvik hypoglykemi (< 4,0 mmol/L)!',
      },
      {
        parameter: 'Ventrikelretention (GRV – Gastric Residual Volume)',
        normalRange: '< 200 mL',
        targetIva: 'Åtgärdsgräns > 300–500 mL per 4–6 h',
        note: 'Spruta tillbaka aspiratet upp till 250–300 mL (för att undvika elektrolyt-/syraförlust) och sätt in prokinetika!',
      },
      {
        parameter: 'S-Fosfat (Markör för Refeedingsyndrom)',
        normalRange: '0,80–1,50 mmol/L',
        targetIva: '> 0,80 mmol/L (Kritisk refeeding-gräns: < 0,65 mmol/L el. fall > 30 %)',
        note: 'Vid refeeding-hypofosfatemi: ge Glycophos 20–40 mmol i.v. + Pabrinex (Tiamin) och sänk kaloritillförseln till 5–10 kcal/kg/d!',
        isCritical: true,
      },
      {
        parameter: 'S-Triglycerider (under Propofol / SmofKabiven)',
        normalRange: '< 1,7 mmol/L',
        targetIva: '< 4,0–4,5 mmol/L',
        note: 'Vid S-TG > 4,5 mmol/L: byt ut Propofol mot Dexdor/Midazolam och pausa lipider i TPN.',
      },
      {
        parameter: 'Icke-nutritionella Kalorier (Propofol & Glukos)',
        normalRange: '0 kcal',
        targetIva: 'Propofol (10 el. 20 mg/ml) = 1,1 kcal/mL',
        note: 'Glukos 5 % = 0,2 kcal/mL | Glukos 10 % = 0,4 kcal/mL | Citrat vid CRRT ≈ 100–200 kcal/dygn.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Uppstart av Enteral Nutrition (EN via Compat Ella®)',
        badge: 'Sondmatning',
        items: [
          { label: 'Starttidpunkt', value: 'Inom 24–48 h från IVA-ankomst', detail: 'Tidig trofisk enteral nutrition skyddar tarmmukosan och minskar bakterietranslokation.' },
          { label: 'Uppstartshastighet', value: '10–20 mL/h kontinuerligt', detail: 'Öka med 10–20 mL/h var 6–12:e timme vid god tolerans mot beräknat mål.' },
          { label: 'Standardpreparat IVA Östra', value: 'Fresubin 2 kcal HP / Fresubin Original / Peptamen AF', detail: 'Fresubin 2 kcal HP (2,0 kcal/mL, 10 g protein/100 mL) används vid vätskerestriktion.' },
          { label: 'Spolrutin (Compat Ella)', value: '20–30 mL vatten var 4:e timme samt före/efter läkemedel', detail: 'Förhindrar sondstopp. Vid stopp: spola med ljummet vatten (aldrig läsk/sura vätskor!).' },
        ],
      },
      {
        title: 'Prokinetika & Hög Ventrikelretention',
        badge: 'Tarmmotilitet',
        items: [
          { label: '1:a handsval – Erytromycin', value: '200–250 mg i.v. x 2–3 i 3–4 dygn', detail: 'Motilinreceptoragonist – kraftfull ventrikeltömmande effekt. Obs QT-tid!' },
          { label: 'Tillägg – Metoklopramid (Primperan)', value: '10 mg i.v. x 3 (5 mg vid GFR < 30)', detail: 'Dopaminantagonist. Kombineras ofta med Erytromycin vid svår gastropares.' },
          { label: 'Opioidantagonist i sond (Enteralt Naloxon)', value: 'Naloxon 4–8 mg x 3–4 i V-sond', detail: 'Motverkar lokal opioidinducerad tarmparalys utan att upphäva systemisk smärtlindring (hög förstapassagemetabolism i levern).' },
          { label: 'Postpylorisk sond (Jeju-sond)', value: 'Endoskopisk eller blind nedläggning', detail: 'Övervägs vid kvarstående retention > 500 mL trots maximal prokinetika eller vid svår pankreatit.' },
        ],
      },
      {
        title: 'Parenteral Nutrition (TPN) & Refeedingskydd',
        badge: 'TPN & Elektrolyter',
        items: [
          { label: 'Indikation för TPN (SmofKabiven)', value: 'Dag 4–7 om EN täcker < 60 % av målet', detail: 'Tillsätt alltid Soluvit (vattenlösliga vitaminer), Vitalipid och Addaven (spårämnen) i påsen!' },
          { label: 'Refeeding-profylax före nutritionsstart', value: 'Pabrinex (Tiamin 250–500 mg i.v.) 30 min före glukos/mat', detail: 'Ges i minst 3–5 dygn hos svält-/alkohol-/malnutrierade patienter.' },
          { label: 'Daglig labkontroll vid uppstart', value: 'S-Fosfat, S-Kalium, S-Magnesium, B-Glukos', detail: 'Substituera proaktivt när S-Fosfat, S-K eller S-Mg sjunker.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Enteral Nutrition under pågående Vasopressor (Noradrenalin)',
        type: 'pearl',
        points: [
          'Låg till måttlig och stabil dos Noradrenalin (< 0,15–0,20 µg/kg/min) med normalt/sjunkande laktat är INGEN kontraindikation mot lågdos enteral nutrition (10–20 mL/h)!',
          'Pausa däremot enteral nutrition vid eskalerande chock, stigande laktat (> 3–4 mmol/L), höga doser vasopressor (> 0,3 µg/kg/min) eller misstänkt tarmischemi (risk för icke-ocklusiv mesenteriell ischemi, NOMI).',
        ],
      },
      {
        title: 'Säkerhet med ENFit® & Ventrikelsond (Röda Flaggor)',
        type: 'warning',
        points: [
          'Kontrollera alltid sondläge (röntgenverifiering av nyinlagd tunn nutritionssond eller pH ≤ 5,5 i ventrikelaspirat) innan start av sondmat!',
          'Håll alltid huvudändan höjd 30–45° under pågående sondmatning för att minska risken för tyst aspiration och VAP.',
          'Glöm inte att räkna av Propofol-kalorier (20 mL/h Propofol 20 mg/ml = 480 mL/dygn = 528 kcal ren fettenergi/dygn!).',
        ],
      },
      {
        title: 'Bedside-checklista för Nutrition på IVA',
        type: 'checklist',
        points: [
          'Är längd och idealvikt (PBW) uträknad så att vi inte övernär en överviktig eller ödematös patient?',
          'Byts aggregat till Compat Ella och sondmatspåse var 24:e timme (märkt med datum och tid)?',
          'Får patienten tillräckligt med protein (1,2–1,5 g/kg/d, ev. tillägg av Protifar/proteinpulver eller aminosyror)?',
        ],
      },
    ],
  },

  CRRT: {
    categoryId: 'CRRT',
    hubTitle: 'CRRT – Kontinuerlig Dialys, Citratantikoagulation & Klinisk Hubb',
    hubSummary:
      'Klinisk hubb för CRRT (CVVHDF / CVVHD) med regional citratantikoagulation (RCA), joniserat kalcium-styrning, filtertryck, effluentdos och felsökning vid citratackumulering.',
    quickLinks: [
      {
        label: 'KDIGO AKI & Akut Njursvikt',
        targetCategory: 'DISEASES',
        desc: 'AKI stadie 1–3, dialysindikationer (AEIOU) & patofysiologi',
      },
      {
        label: 'Vätskebalans & Ultrafiltration',
        targetCategory: 'FLUID_BALANCE',
        desc: 'Vätskedrag, % Fluid Overload & timbalans',
      },
      {
        label: 'Syra-Bas & Elektrolyter (ABL)',
        targetCategory: 'ACID_BASE',
        desc: 'Metabol acidos, Anjongap & joniserat kalcium',
      },
    ],
    normalValues: [
      {
        parameter: 'Post-filter Joniserat Kalcium (Krets-iCa)',
        normalRange: '1,15–1,30 mmol/L (blod)',
        targetIva: '0,25–0,35 mmol/L i dialyskretsen',
        note: 'Vid iCa < 0,35 mmol/L i filtret är koagulationskaskaden helt blockerad. Om > 0,35: höj citratdosen med 0,1–0,2 mmol/L.',
        isCritical: true,
      },
      {
        parameter: 'Systemiskt Joniserat Kalcium (Patient-iCa i artär)',
        normalRange: '1,15–1,30 mmol/L',
        targetIva: '1,00–1,20 mmol/L',
        note: 'Styr kalciumåterföringen (Ca-kompensation %). Om patient-iCa < 1,00 mmol/L: öka Ca-kompensation med 10–20 % (+ ev. bolus Ca-glukonat).',
        isCritical: true,
      },
      {
        parameter: 'Total-Kalcium / Joniserat Kalcium-kvot (Tot-Ca / iCa)',
        normalRange: '< 2,0',
        targetIva: '< 2,25 (Kritisk gräns: ≥ 2,25–2,50)',
        note: 'Kvot > 2,25 = Citratackumulering (citrat-kalciumkomplex kan ej brytas ned av levern, t.ex. vid svår leversvikt eller laktatacidos).',
        isCritical: true,
      },
      {
        parameter: 'Effluentdos (Total dialysdos)',
        normalRange: '—',
        targetIva: '25–30 mL/kg/h (Levererat målvärde: ≥ 20–25 mL/kg/h)',
        note: 'Förskriven dos 25–30 mL/kg/h kompenserar för ”down-time” vid röntgen/filterbyten.',
      },
      {
        parameter: 'Blodflöde (Qb vid Citrat-CVVHDF)',
        normalRange: '—',
        targetIva: '100–150 mL/min',
        note: 'Vid citratantikoagulation är citrattillförseln direkt kopplad till blodflödet! Högt blodflöde ger hög citratbelastning.',
      },
      {
        parameter: 'TMP (Transmembrantryck i filtret)',
        normalRange: '50–150 mmHg',
        targetIva: '< 200–250 mmHg',
        note: 'Stigande TMP (> 250 mmHg) talar för igensatta filterporer (clogging) -> planera filterbyte och återgivning av blod!',
      },
      {
        parameter: 'Filtertrycksfall (ΔP Filter = Pfilter − Preturn)',
        normalRange: '30–80 mmHg',
        targetIva: '< 150 mmHg',
        note: 'Snabbt stigande ΔP talar för koagulation i hålfibrerna (clotting).',
      },
      {
        parameter: 'Filtrationsfraktion (FF %)',
        normalRange: '< 20 %',
        targetIva: '< 20–25 %',
        note: 'Hög FF (> 25 %) ger kraftig hemokoncentration i filtret och snabb filterkoagulation.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Standardinställning Regional Citratantikoagulation (RCA)',
        badge: 'Citratprotokoll',
        items: [
          { label: 'Blodflöde (Qb)', value: '100–130 mL/min', detail: 'Håll så jämnt flöde som möjligt via välfungerande CDK (13,5 Fr).' },
          { label: 'Citratdos (Pre-blodpump)', value: '3,0 mmol/L blod (intervall 2,5–3,5 mmol/L)', detail: 'Binder fritt Ca²⁺ i kretsen och förhindrar koagulation.' },
          { label: 'Kalciumkompensation (Post-filter / CVK)', value: 'Start 100 %', detail: 'Justera i steg om 10 % efter patientens artär-iCa (mål 1,00–1,20 mmol/L).' },
          { label: 'Dialysat- & Ersättningsvätska', value: 'Kalciumfri vid citrat (t.ex. Phoxilium / Biphozyl / Prismocitrate)', detail: 'Vid normokalemi/hypofosfatemi väljs fosfatinnehållande dialysat (Phoxilium) för att förebygga dialysutlöst hypofosfatemi!' },
          { label: 'Nettovätskedrag (Patient Fluid Removal)', value: '0–250 mL/h efter ordinerad dygnsbalans', detail: 'Starta ofta med 0–50 mL/h vid hemodynamisk instabilitet och öka gradvis.' },
        ],
      },
      {
        title: 'Provtagning & Styrschema under pågående CRRT',
        badge: 'Kontrollrutin',
        items: [
          { label: 'Vid uppstart / ändring av citrat el. Ca', value: 'Kontrollera Patient-iCa + Filter-iCa efter 1 timme', detail: 'Därefter var 4–6:e timme vid stabil drift.' },
          { label: 'Dagliga prover på morgonen', value: 'Total-Kalcium (S-Ca), S-Fosfat, S-Magnesium, S-Na, Krea, Urea', detail: 'Beräkna alltid kvoten Total-Ca / Patient-iCa (ska vara < 2,25)!' },
          { label: 'Filterlivslängd (Maxtid)', value: '72 timmar (3 dygn)', detail: 'Planera elektivt byte innan TMP når > 250 mmHg så att patientens blod kan ges tillbaka.' },
        ],
      },
      {
        title: 'CDK-Skötsel (Central Dialyskateter)',
        badge: 'Vaskulär Access',
        items: [
          { label: 'Placering (Prioritetsordning)', value: '1. V. jugularis interna dx • 2. V. femoralis • 3. V. jugularis sin', detail: 'Undvik v. subclavia pga stenosrisk. Höger jugularis ger rakast bana och bäst flöde.' },
          { label: 'Vid högt inflödestryck (Access alarm, < -150 till -200 mmHg)', value: 'Kontrollera läge, spola med NaCl, byt skänklar som sista utväg', detail: 'Om skänklar kopplas om (reverseras) ökar recirkulationen – notera alltid i journalen!' },
          { label: 'Låsning av CDK vid vila', value: 'Citratlås (CitraFlow 4 % el. DuraLock) eller NaCl enl. exakt skänkelvolym', detail: 'Aspirera alltid ut låsvolymen (ca 1,5–2,0 mL/skänkel) innan ny dialys kopplas!' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Citratackumulering vs. Citratöverdos (Metabol Alkalos) – Så skiljer du dem åt!',
        type: 'pearl',
        points: [
          '1. Citratackumulering (Farligt! Ses vid leversvikt / svår chock med laktat > 4): Levern klarar inte att metabolisera citrat till bikarbonat. Kännetecken: Stigande Total-Ca / iCa-kvot (> 2,25), SJUNKANDE systemiskt iCa (ökande Ca-substitutionsbehov), förvärrad metabol ACIDOS och stigande anjongap! Åtgärd: Sänk blodflödet/citratdosen eller byt till CRRT utan citrat.',
          '2. Citratnettobelastning (Ofarligt överskott vid fungerande lever): För mycket citrat når patienten och omvandlas i levern till bikarbonat (1 mmol citrat = 3 mmol HCO₃⁻). Kännetecken: Metabol ALKALOS (pH > 7,48, högt Base Excess/HCO₃⁻) men NORMAL Tot-Ca/iCa-kvot (< 2,25). Åtgärd: Sänk blodflödet eller öka dialysatflödet (som vädrar ut citrat/bikarbonat i filtret).',
        ],
      },
      {
        title: 'Kritiska Säkerhetsregler vid CRRT (Röda Flaggor)',
        type: 'warning',
        points: [
          'CRRT kyler blodet! Övervaka patientens kärntemperatur kontinuerligt och använd blodvärmare på CRRT-maskinen. Observera att feber vid sepsis maskeras av dialysfiltret!',
          'Läkemedelsdosering vid CRRT: Många antibiotika (t.ex. Meropenem, Piperacillin/Tazobactam, Cefotaxim, Vancomycin) elimineras effektivt via CRRT – ge ALLTID full laddningsdos och kontrollera dalvärden (TDM) så att septiska patienter inte underbehandlas!',
          'Hypofosfatemi och hypomagnesemi uppstår hos > 50 % efter 24–48 h på CRRT om inte fosfatinnehållande dialysat (Phoxilium) eller aktiv substitution med Glycophos/Addex-Mg ges.',
        ],
      },
      {
        title: 'Akuta Dialysindikationer (AEIOU)',
        type: 'checklist',
        points: [
          'A – Acidosis: Svår metabol acidos (pH < 7,15–7,20) refraktär mot behandling.',
          'E – Electrolytes: Svår hyperkalemi (S-K > 6,5 mmol/L eller EKG-förändringar) trots medicinsk terapi.',
          'I – Intoxication: Dialyserbara gifter/läkemedel (Litium, Metanol, Etylenglykol, Salicylater, Metformin/laktatacidos).',
          'O – Overload: Diuretikarefraktär övervätskning med lungödem / hypoxisk svikt.',
          'U – Uremia: Uremisk encefalopati, perikardit eller blödningsbenägenhet.',
        ],
      },
    ],
  },

  Elimination: {
    categoryId: 'Elimination',
    hubTitle: 'Elimination – Diuresmål, AKI, KAD, Tarmfunktion & Klinisk Hubb',
    hubSummary:
      'Normalvärden och kliniskt beslutsstöd för timdiures, KDIGO AKI-kriterier, Furosemid Stress Test, urinanalys, KAD-handhavande, ventrikelsond/dränage och tarmprotokoll på IVA Östra.',
    quickLinks: [
      {
        label: 'Vätskebalans & Timdiures (12, 18, 24, 06)',
        targetCategory: 'FLUID_BALANCE',
        desc: 'Östra Excel-vätskebalans, Diuresmål & % Fluid Overload',
      },
      {
        label: 'Buk & Intraabdominellt Tryck (IAP)',
        targetCategory: 'Buk',
        desc: 'IAP-mätning via KAD, Compartment & Ileus',
      },
      {
        label: 'KDIGO AKI & Njursvikt',
        targetCategory: 'DISEASES',
        desc: 'Prerenal, renal och postrenal AKI-utredning',
      },
    ],
    normalValues: [
      {
        parameter: 'Timdiures (Normalmål vuxen på IVA)',
        normalRange: '0,5–1,5 mL/kg/h',
        targetIva: '≥ 0,5 mL/kg/h (t.ex. ≥ 40 mL/h vid 80 kg)',
        note: 'Avstämningstider på IVA Östra: kl. 12:00, 18:00, 24:00 och 06:00.',
        isCritical: true,
      },
      {
        parameter: 'Oliguri & Anuri (Gränsvärden)',
        normalRange: '> 1000 mL/dygn',
        targetIva: 'Oliguri: < 0,5 mL/kg/h (> 6 h) el. < 400 mL/dygn | Anuri: < 50–100 mL/dygn',
        note: 'Vid plötslig anuri (< 10 mL/h): uteslut ALLTID stopp/knick på KAD med spolning och Bladderscan först!',
        isCritical: true,
      },
      {
        parameter: 'Polyuri (Ökad urinproduktion)',
        normalRange: '< 2500 mL/dygn',
        targetIva: '> 3,0 mL/kg/h eller > 300 mL/h i ≥ 2 timmar',
        note: 'Orsaker på IVA: Urglasfas efter ATN, osmotisk diures (hyperglykemi/mannitol/urea), Dexdor-infusion eller Diabetes Insipidus (kontrollera U-Osm & S-Na!).',
      },
      {
        parameter: 'KDIGO AKI Stadium 1',
        normalRange: 'S-Krea: Män < 100, Kvinnor < 90 µmol/L',
        targetIva: 'Krea × 1,5–1,9 (el. +26,5 µmol/L på 48 h) ELLER Diures < 0,5 mL/kg/h i 6–12 h',
        note: 'Tidig varningssignal! Optimera MAP (≥ 65–75 mmHg), volymstatus och sätt ut nefrotoxiska läkemedel.',
      },
      {
        parameter: 'KDIGO AKI Stadium 2 & 3',
        normalRange: '—',
        targetIva: 'Stad 2: Krea × 2,0–2,9 / Diures < 0,5 i ≥ 12 h | Stad 3: Krea × 3,0 (> 354) / Diures < 0,3 i ≥ 24 h / CRRT',
        note: 'Anpassa samtliga renalt utsöndrade läkemedel (antibiotika, LMWH, opioider) efter aktuell GFR!',
        isCritical: true,
      },
      {
        parameter: 'U-Natrium & FENa (Fraktionerad Na-exkretion)',
        normalRange: 'Varierar med intag',
        targetIva: 'Prerenal: U-Na < 20 mmol/L (FENa < 1 %) | ATN: U-Na > 40 mmol/L (FENa > 2 %)',
        note: 'Obs: U-Na och FENa blir falskt höga om patienten nyligen fått Furosemid (använd då FEUrea < 35 % som prerenal markör!).',
      },
      {
        parameter: 'Tarmtömning / Defekation på IVA',
        normalRange: 'Var 1–2:a dag',
        targetIva: 'Senast dag 3–4 på IVA',
        note: 'Obehandlad obstipation ökar buktrycket (IAP), försvårar respiratorurträning och ökar risken för delirium och bakterietranslokation.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Utredning & Handläggning av Akut Oliguri vid Sängkant',
        badge: 'Oliguri-Algoritm',
        items: [
          { label: 'Steg 1 – Postrenalt (Mekaniskt stopp?)', value: 'Kontrollera slang, spola KAD med 20–40 mL NaCl + Bladderscan', detail: 'Vanligaste orsaken till plötsligt diuresstopp är knickad slang, luftlås i timdiuresmätaren eller koagel i KAD.' },
          { label: 'Steg 2 – Prerenalt (Perfusion & Tryck?)', value: 'Utvärdera MAP (≥ 65–75), CVP, IAP och vätskeresponsivitet (PLR)', detail: 'Njurperfusionstryck = MAP − CVP (eller MAP − IAP). Högt CVP eller högt IAP (> 12–15 mmHg) stryper njurvenavflödet!' },
          { label: 'Steg 3 – Furosemid Stress Test (FST)', value: '1,0 mg/kg i.v. (1,5 mg/kg om patienten haft loopdiuretika senaste 7 dgr)', detail: 'Endast på euvolem/hypervolem patient! Om diures < 200 mL under de kommande 2 timmarna föreligger uttalad tubulär skada med hög sannolikhet för CRRT-behov.' },
          { label: 'Steg 4 – Kontinuerlig Furosemidinfusion', value: 'Start 2–10 mg/h (efter bolusdos 10–40 mg)', detail: 'Ger jämnare natriures och mindre hemodynamisk svängning än upprepade stora bolusdoser.' },
        ],
      },
      {
        title: 'Tarmprotokoll & Obstipationsbehandling på IVA',
        badge: 'Tarmfunktion',
        items: [
          { label: 'Dag 1–2 (Basprofylax vid opioider/enteral mat)', value: 'Movicol 1–2 påsar x 2 i sond + ev. Laktulos 15–30 mL x 2', detail: 'Startas direkt när enteral nutrition och opioider påbörjas.' },
          { label: 'Dag 3 utan avföring', value: 'Lägg till Cilaxoral (Natriumpikosulfat) 10–20 droppar till natten + Naloxon 4–8 mg x 3 enteralt', detail: 'Motoriskt stimulerande laxantia + lokal opioidblockad i tarmen.' },
          { label: 'Dag 4+ utan avföring', value: 'Rektal palpation -> Dulcolax supp / Klyx 120–240 mL / Oljeklavemang', detail: 'Uteslut mekanisk ileus eller akut buk (röntgen/CT) innan kraftfull laxering!' },
          { label: 'Diarré på IVA (> 3–4 lösa tömningar/dygn)', value: 'Skicka Clostridioides difficile-toxin + pausa laxantia!', detail: 'Vid uttalad vattentunn diarré och hudmaceration: överväg fekalkateter (Flexi-Seal) efter rektal palpation.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Njurperfusion: Varför ”mer vätska” ofta förvärrar oliguri på IVA!',
        type: 'pearl',
        points: [
          'Njuren är inkapslad i en stram bindvävskapsel. Vid övervätskning och högt CVP (> 12–14 mmHg) eller högt buktryck (IAP > 15 mmHg) uppstår venös stas i njuren ("renal tamponad" / nefrosark).',
          'Ge ALDRIG slentrianmässiga vätskebolusar enbart för att timdiuresen är låg om patienten inte är dokumenterat hypovolem och vätskeresponsiv!',
        ],
      },
      {
        title: 'Nefrotoxiska läkemedel att se upp med (Röda Flaggor)',
        type: 'warning',
        points: [
          'Undvik "Triple Whammy" och nefrotoxiska kombinationer: NSAID, ACE-hämmare/ARB, Aminoglykosider (Tobramycin), Vancomycin i höga dalvärden (> 20 mg/L), Aciklovir (kräver god hydrering!) och jodkontrast vid hypovolemi.',
          'Furosemid ”botar” inte akut njursvikt (AKI) – det används för att hantera vätskeöverskott (Fluid Overload) och hyperkalemi hos diuretika-responsiva patienter.',
        ],
      },
    ],
  },

  Omvårdnad: {
    categoryId: 'Omvårdnad',
    hubTitle: 'Omvårdnad – VAP-Bundle, Mobilisering, Infarter & Klinisk Hubb',
    hubSummary:
      'Evidensbaserad intensivvårdsomvårdnad på IVA Östra: luftvägsvård, munvård, trycksårsprofylax, tidig mobilisering, skötsel av CVK/artärnål, ögonvård och IVA-dagbok.',
    quickLinks: [
      {
        label: 'Smärta & Sedering (CPOT & RASS)',
        targetCategory: 'PAIN_SEDATION',
        desc: 'Bedömning av smärta och vakenhet vid omvårdnad',
      },
      {
        label: 'Dos & CVK-Blandbarhet',
        targetCategory: 'DRUGS',
        desc: 'Y-kopplingsmatris och skänkelfördelning i CVK',
      },
      {
        label: 'Nutrition & Sondvård',
        targetCategory: 'Nutrition',
        desc: 'Sondmatning, huvudända 30° & munvård',
      },
    ],
    normalValues: [
      {
        parameter: 'Huvudändans lutning (Intuberad / Sondmatad)',
        normalRange: '0–15°',
        targetIva: '30–45° (Halvsittande läge)',
        note: 'Minska risken för gastroesofageal reflux, tyst mikroaspiration och ventilatorassocierad pneumoni (VAP).',
        isCritical: true,
      },
      {
        parameter: 'Vändningsintervall & Lägesändring',
        normalRange: '—',
        targetIva: 'Var 2–3:e timme (Hälavlastning kontinuerligt!)',
        note: 'Använd 30° sidoläge med kuddar och säkerställ att hälarna svävar fritt från madrassen.',
      },
      {
        parameter: 'Munvård & Subglottisk sugning',
        normalRange: '—',
        targetIva: 'Munvård var 4:e timme • Subglottisk sugning var 2–4:e timme',
        note: 'Fukta slemhinnor var 2:a timme, borsta tänder morgon och kväll. Sug alltid rent ovan kuffen FÖRE lägesändring eller kufftryckskontroll!',
        isCritical: true,
      },
      {
        parameter: 'Cufftryck (ET-tub & Trakealkanyl)',
        normalRange: '20–30 cmH₂O',
        targetIva: '25–28 cmH₂O (Kontrolleras varje arbetspass)',
        note: 'Dokumentera även tubens cm-markering i mungipan/näsborren vid varje skiftstart.',
      },
      {
        parameter: 'Omläggning av CVK & Artärnål',
        normalRange: '—',
        targetIva: 'Var 7:e dag (Transparant semipermeabelt förband)',
        note: 'Byt omedelbart om förbandet lossnat, är fuktigt eller blodigt under. Desinfektera med Klorhexidinsprit 5 mg/ml (lufttorka 30–60 s!).',
      },
      {
        parameter: 'Byte av Infusionsaggregat & Tre-vägskranar',
        normalRange: '—',
        targetIva: 'Standardaggregat: var 72:a timme (3 dygn)',
        note: 'OBS: Propofol-aggregat byts var 12:e timme! TPN/Lipid-aggregat och Sondmatsaggregat byts var 24:e timme! Blodaggregat direkt efter transfusion.',
        isCritical: true,
      },
    ],
    settingsAndProtocols: [
      {
        title: 'VAP-Bundle (Förebyggande av Ventilatorassocierad Pneumoni)',
        badge: 'Luftväg & VAP',
        items: [
          { label: '1. Höjd huvudända', value: '30–45° kontinuerligt', detail: 'Om ej medicinskt kontraindicerat (t.ex. instabil kotfraktur, IAP-mätning).' },
          { label: '2. Subglottisk sekretdränering', value: 'Aspirera i subglottisk kanal var 2–4:e timme', detail: 'Avlägsnar bakterierikt sekret som samlas ovanför tubkuffen.' },
          { label: '3. Strukturerad munvård', value: 'Tandborstning 2 ggr/dygn + fuktning var 2–4:e timme', detail: 'Motverkar plackbildning och kolonisering i orofarynx.' },
          { label: '4. Daglig sederingsbedömning & urträning', value: 'RASS 0 till -1 dagtid • Daglig SBT-utvärdering', detail: 'Varje sparad ventilatordag minskar VAP-risken markant.' },
          { label: '5. Slutet sugsystem & Kondensvatten', value: 'Töm vattenfällor bort från patienten', detail: 'Låt aldrig kondensvatten i respiratorns slangar rinna bakåt ned i patientens tub vid vändning!' },
        ],
      },
      {
        title: 'Infarter, Aseptik & Byte av Aggregat',
        badge: 'CVK & Infarter',
        items: [
          { label: '”Scrub the Hub” (Membran-desinfektion)', value: 'Gnugga injektionsmembran 15 sek med Klorhexidinsprit 5 mg/ml', detail: 'Låt torka före varje koppling eller injektion för att förhindra CRBSI (kateterrelaterad sepsis).' },
          { label: 'Propofol-infusion (Fettemulsion)', value: 'Byt spruta och aggregat senast var 12:e timme!', detail: 'Propofol saknar konserveringsmedel och gynnar snabb bakterietillväxt.' },
          { label: 'TPN (SmofKabiven) & Enteral Nutrition', value: 'Byt påse och aggregat var 24:e timme', detail: 'Märk alltid med datum, klockslag och signatur.' },
          { label: 'Tryckset (Artärnål & CVP)', value: 'Byts var 72–96:e timme (3–4 dygn)', detail: 'Inspektera distala fingrar (kapillär återfyllnad, färg, värme) vid radialisartärnål varje pass!' },
        ],
      },
      {
        title: 'Ögonvård, Trycksår & Tidig Mobilisering',
        badge: 'Helhetsomvårdnad',
        items: [
          { label: 'Ögonvård hos sederad/intuberad', value: 'Rengör med NaCl + Viscotears/Oculentum simplex var 4–6:e timme', detail: 'Vid ofullständig ögonlocksslutning (lagophthalmos) eller muskelrelaxation: tejpa/använd fuktkammare för att förhindra kornealsår!' },
          { label: 'Trycksårsprevention (SSK/USK)', value: 'Inspektera sacrum, hälar, bakhuvud, öron (grimma/band) och näsrygg', detail: 'Flytta SpO₂-klämma var 2–4:e timme. Kontrollera att tubband och V-sond inte trycker mot näsvinge/mungipa.' },
          { label: 'Tidig mobilisering på IVA', value: 'Passiv/aktiv rörelseträning -> Sängkant -> Ståträning/Fåtölj', detail: 'Även intuberade patienter med låg dos noradrenalin kan mobiliseras till sängkant/fåtölj i samarbete med fysioterapeut!' },
          { label: 'IVA-Dagbok', value: 'Påbörjas vid förväntad vårdtid > 3 dygn', detail: 'Hjälper patienten att bearbeta minnesluckor och overklighetsupplevelser efter utskrivning.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Inför vändning och mobilisering av kritiskt sjuk patient',
        type: 'pearl',
        points: [
          '1. Ge adekvat procedursmärtlindring (bolus opioid 3–5 min före vändning om CPOT stiger vid rörelse).',
          '2. Sug rent subglottiskt (ovan kuffen) och vid behov i tuben samt ge O₂-boost vid labil syresättning.',
          '3. Utse en person vid huvudändan som har 100 % ansvar för endotrakealtub/trakealkanyl och CVK under själva lyftet/vändningen!',
        ],
      },
      {
        title: 'Vanliga Omvårdnadsfallgropar på IVA (Röda Flaggor)',
        type: 'warning',
        points: [
          'Trycksår av medicinteknisk utrustning (MDRPI): Kontrollera huden under NIV-masker, högflödesgrimmor (bakom öronen!), trakeostomiband, V-sonder i näsborren och artärnålsfixering varje pass.',
          'Exponeringskeratopati (hornhinnesår): Sederade patienter förlorar blinkreflexen och tårfilmsproduktionen. Om glipan mellan ögonlocken lämnas öppen torkar hornhinnan ut på få timmar.',
        ],
      },
    ],
  },

  Anhöriga: {
    categoryId: 'Anhöriga',
    hubTitle: 'Anhöriga – Närståendestöd, Krisbemötande, Barn & Klinisk Hubb',
    hubSummary:
      'Riktlinjer för strukturerat omhändertagande av närstående på IVA Östra: kommunikation, akut krisstöd, barn som anhöriga (HSL 5 kap. 7 §), brytpunktssamtal och post-IVA-uppföljning.',
    quickLinks: [
      {
        label: 'Avslut & Palliativ Vård',
        targetCategory: 'Avslut',
        desc: 'Brytpunktssamtal, symtomlindring och vård i livets slutskede',
      },
      {
        label: 'Organdonation (DBD & DCD)',
        targetCategory: 'Donation',
        desc: 'Samtyckesutredning och stöd till närstående vid donation',
      },
      {
        label: 'Omvårdnad & IVA-Dagbok',
        targetCategory: 'Omvårdnad',
        desc: 'IVA-dagbok och delaktighet vid sängkanten',
      },
    ],
    normalValues: [
      {
        parameter: 'Första anhörigkontakt vid akut inläggning',
        normalRange: '—',
        targetIva: 'Snarast (inom 1–2 timmar från ankomst)',
        note: 'Dokumentera utsedd huvudkontaktperson (namn, relation och telefonnummer) i Melior.',
        isCritical: true,
      },
      {
        parameter: 'Strukturerat läkarsamtal med närstående',
        normalRange: '—',
        targetIva: 'Inom 24 h från inläggning samt vid varje klinisk vändpunkt',
        note: 'Sjuksköterska/undersköterska deltar alltid vid läkarsamtal för att kunna fånga upp frågor efteråt.',
      },
      {
        parameter: 'Barn som anhöriga (0–18 år)',
        normalRange: 'Lagkrav: HSL 5 kap. 7 §',
        targetIva: 'Kartläggs på 100 % av alla inlagda IVA-patienter',
        note: 'Gäller patientens egna barn, bonusbarn och minderåriga syskon. Dokumenteras under sökord i journalen.',
        isCritical: true,
      },
      {
        parameter: 'Post-IVA-mottagning (Uppföljning)',
        normalRange: '—',
        targetIva: 'Erbjuds vid IVA-vårdtid ≥ 3–4 dygn (uppföljning efter 2–3 mån)',
        note: 'Genomgång av vårdförloppet, överlämning av IVA-dagbok och besök på enheten (minskar PTSD/PICS-F).',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Ankomst- & Besöksrutin för Närstående på IVA Östra',
        badge: 'Mottagande',
        items: [
          { label: 'Förberedelse i anhörigrum', value: 'Berätta vad de kommer att se, höra och möta på salen', detail: 'Förklara respirator, slangar, svullnad/ödem, larm (att larm övervakas kontinuerligt) och sederingsgrad.' },
          { label: 'Kontaktperson i familjen', value: 'Utse 1–2 primära kontaktpersoner', detail: 'Dessa ringer in på direktnumret och förmedlar information vidare till övriga släkten.' },
          { label: 'Delaktighet vid sängkant', value: 'Uppmuntra beröring, lugnt tal och medverkan i enkel omvårdnad', detail: 'Att få fukta läppar, smörja händer, spela bekant musik eller skriva i IVA-dagboken ger kontroll och minskar vanmakt.' },
          { label: 'Närståendes egen återhämtning', value: 'Uppmuntra närstående att äta, dricka och sova hemma nattetid', detail: 'Försäkra att vi ringer omedelbart dygnet runt om patientens tillstånd försämras.' },
        ],
      },
      {
        title: 'Barn som Anhöriga – Åldersanpassat Stöd',
        badge: 'HSL 5 kap. 7 §',
        items: [
          { label: 'Förberedelse inför besök', value: 'Visa bilder/docka och förklara konkret utan medicinsk jargong', detail: 'Barn har ofta en värre fantasi än verkligheten. Låt barnet själv bestämma hur nära sängen det vill gå.' },
          { label: 'Skuldavlastning', value: 'Förklara tydligt att barnet inte har orsakat sjukdomen', detail: 'Yngre barn kan ha ”magiskt tänkande” och tro att de gjort något fel.' },
          { label: 'Förskola / Skola & Kuratorsstöd', value: 'Uppmuntra föräldrar att informera skola/förskola', detail: 'Koppla in IVA-kurator för stödmaterial, böcker och samtalsstöd till familjen.' },
        ],
      },
      {
        title: 'Samtalsmetodik vid Svåra Besked (VALUE & NURSE)',
        badge: 'Kommunikation',
        items: [
          { label: 'V – Value family statements', value: 'Värdesätt och bekräfta närståendes observationer', detail: 'De känner patientens personlighet och habituella tillstånd bäst.' },
          { label: 'A – Acknowledge emotions', value: 'Bekräfta känslor (chock, rädsla, ilska, sorg)', detail: 'Möt reaktioner med lugn och empati – ta inte krisreaktioner personligt.' },
          { label: 'L – Listen (70/30-regeln)', value: 'Låt närstående tala till punkt och ställ öppna frågor', detail: '”Vad är det viktigaste för er att vi berättar om idag?”' },
          { label: 'U – Understand the patient as a person', value: 'Fråga vem patienten är i vardagen', detail: 'Skapar förtroende och ger underlag för etiska bedömningar.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'PICS-F (Post-Intensive Care Syndrome – Family)',
        type: 'pearl',
        points: [
          'Upp till 30–50 % av närstående till kritiskt sjuka IVA-patienter utvecklar symtom på ångest, depression eller posttraumatisk stress (PICS-F).',
          'Tydlig, ärlig och samstämmig kommunikation från läkare och sjuksköterskor samt delaktighet i IVA-dagboken är de starkaste skyddsfaktorerna.',
        ],
      },
      {
        title: 'Att tänka på vid akut kris och språkförbistring',
        type: 'checklist',
        points: [
          'Använd alltid auktoriserad tolk (telefon- eller platstolk) vid medicinska samtal och brytpunktssamtal – använd aldrig barn eller chockade anhöriga som tolk!',
          'Erbjud kontakt med Kurator och Sjukhuskyrkan / Andlig vård (tillgängliga för samtal oavsett livsåskådning eller religion).',
          'Ge kortfattad information i små steg vid chockfas – förmågan att ta in komplexa medicinska detaljer är kraftigt nedsatt under akut stress.',
        ],
      },
    ],
  },

  Sedering: {
    categoryId: 'Sedering',
    hubTitle: 'Sedering – Analgosedering, RASS, CPOT, Delirium & Klinisk Hubb',
    hubSummary:
      'Klinisk hubb för eCASH-baserad analgosedering (”Smärtlindring först”), RASS- och CPOT-mål, sederingsläkemedel (Propofol, Dexdor, Klonidin, Ultiva), CAM-ICU deliriumscreening och urträning.',
    quickLinks: [
      {
        label: 'Interaktiv CPOT & RASS-kalkylator',
        targetCategory: 'PAIN_SEDATION',
        desc: 'Räkna ut poäng med kliniska titreringsråd',
      },
      {
        label: 'Dos & CVK (Propofol, Dexdor, Ultiva)',
        targetCategory: 'DRUGS',
        desc: 'Spädning, dosintervall och blandbarhet',
      },
      {
        label: 'Läkemedelsregister (Sedativa & Opioider)',
        targetCategory: 'Läkemedel',
        desc: 'Halveringstid (T½), anslagstid och biverkningar',
      },
    ],
    normalValues: [
      {
        parameter: 'CPOT (Critical-Care Pain Observation Tool)',
        normalRange: '0 poäng (Ingen smärta)',
        targetIva: '< 3 poäng i vila och vid omvårdnad (Skala 0–8 p)',
        note: 'CPOT ≥ 3 p = Signifikant smärta! Behandla ALLTID smärta med opioid/multimodal analgesi innan sedering höjs.',
        isCritical: true,
      },
      {
        parameter: 'NRS / VAS (Hos kommunikativ patient)',
        normalRange: '0',
        targetIva: '≤ 3 i vila (≤ 4 vid mobilisering/hosta)',
        note: 'Självskattning är alltid guldstandard hos patient som kan kommunicera (nicka/peka).',
      },
      {
        parameter: 'RASS-mål Dagtid (Standard IVA-patient)',
        normalRange: '0 (Alert och lugn)',
        targetIva: 'RASS 0 till -1 (Vaken el. trött men ger ögonkontakt > 10 s vid tilltal)',
        note: 'Lätt sedering kortar ventilatortid, vårdtid och minskar delirium och mortalitet.',
        isCritical: true,
      },
      {
        parameter: 'RASS-mål Nattetid (Sömnfrämjande)',
        normalRange: '—',
        targetIva: 'RASS -1 till -2 (Kort ögonkontakt < 10 s vid tilltal)',
        note: 'Dämpa belysning/ljud, samla provtagning/omvårdnad och använd Dexdor/Melatonin för naturlig sömn.',
      },
      {
        parameter: 'Djup Sedering (RASS -4 till -5)',
        normalRange: '—',
        targetIva: 'Endast på strikt medicinsk indikation!',
        note: 'Indikationer: Förhöjt ICP/hjärnödem, svår ARDS i bukläge/dyssynkroni, pågående muskelrelaxation (NMB), status epilepticus, hypotermibehandling.',
        isCritical: true,
      },
      {
        parameter: 'Propofol Maximal Dosgräns (PRIS-skydd)',
        normalRange: '—',
        targetIva: 'Max 4,0 mg/kg/h (≤ 48 h vid högdos)',
        note: 'Dos > 4 mg/kg/h ökar risken för Propofolinfusionssyndrom (PRIS: laktatacidos, rabdomyolys/CK-stegring, hyperkalemi, arytmi/hjärtsvikt).',
        isCritical: true,
      },
      {
        parameter: 'CAM-ICU (Deliriumscreening)',
        normalRange: 'Negativ',
        targetIva: 'Utförs 1 gång/arbetspass (vid RASS -3 till +4)',
        note: 'Kräver Drag 1 (Akut debut/fluktuerande) + Drag 2 (Ouppmärksamhet, ASE-bokstavstest > 2 fel) + antingen Drag 3 (RASS ≠ 0) eller Drag 4 (Oorganiserat tänkande).',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Analgosedering på IVA Östra – Preparatval & Doser',
        badge: 'Läkemedelsval',
        items: [
          { label: 'Remifentanil (Ultiva) – Basanalgesi i respirator', value: '0,05–0,25 µg/kg/min (Styrka 50 µg/ml)', detail: 'Esterasnedbrytning (oberoende av lever/njure!), T½ 3–10 min. OBS: Ge alltid långverkande opioid (Oxykodon/Morfin) 30 min före avstängning!' },
          { label: 'Oxykodon / Morfin – Analgesi vid extubation/spontanandning', value: 'Bolus 1–5 mg i.v. el. infusion 1–5 mg/h', detail: 'Observera ackumulering av aktiva metaboliter (M6G) vid njursvikt (välj Fentanyl eller lägre dos Oxykodon vid AKI/CRRT).' },
          { label: 'Propofol 20 mg/ml – Korttids-/bas-sedering', value: '0,5–4,0 mg/kg/h', detail: 'Snabbt anslag och uppvaknande. Sänker ICP och bryter kramper. Ger hypotension och 1,1 kcal/mL fett.' },
          { label: 'Dexmedetomidin (Dexdor) – Vaken sedering & Delirium', value: '0,2–1,4 µg/kg/h (Ingen laddningsdos!)', detail: 'Selektiv α₂-agonist. Ger samarbetande patient utan andningsdepression! Biverkning: bradykardi och hypotension.' },
          { label: 'Klonidin (Catapresan) – Abstinens, Sympatikuspåslag & Smärta', value: '0,3–1,5 µg/kg/h el. intermittent 37,5–75 µg x 3–4 i.v.', detail: 'Trappas ut långsamt över flera dygn för att undvika rebound-hypertoni och agitation!' },
        ],
      },
      {
        title: 'Åtgärdsstege vid Agitation (RASS +1 till +4)',
        badge: 'Agitationsalgoritm',
        items: [
          { label: '1. Uteslut livshotande fysiologisk orsak!', value: 'Hypoxi? Hyperkapni? Hypoglykemi? Blåstensi/Urinstopp?', detail: 'En agiterad patient som ”sliter i tuben” kan ha slemstopp, felplacerad tub eller akut hypoxi!' },
          { label: '2. Behandla smärta först (CPOT ≥ 3)', value: 'Ge opioidbolus + Paracetamol 1g x 4 (+ ev. Klonidin/Ketamin)', detail: 'Obehandlad smärta är den vanligaste orsaken till oro och dyssynkroni i respirator.' },
          { label: '3. Behandla IVA-delirium (CAM-ICU positiv)', value: 'Icke-farmakologiskt + Dexmedetomidin (Dexdor)', detail: 'Vid uttalade psykotiska hallucinationer/agitation: Quetiapin 25–50 mg p.o. eller Haloperidol 0,5–2,5 mg i.v. (kontrollera QTc!). Undvik bensodiazepiner (utom vid alkohol-/bensoabstinens)!' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Hypoaktivt vs Hyperaktivt Delirium – Den tysta faran!',
        type: 'pearl',
        points: [
          'Mer än 70 % av allt IVA-delirium är HYPOAKTIVT (tyst, tillbakadragen, apatisk patient med RASS -1 till -3) eller blandat.',
          'Utan systematisk CAM-ICU-screening missas majoriteten av alla patienter med hypoaktivt delirium, trots att det är associerat med längre ventilatortid och högre mortalitet.',
          'Bensodiazepiner (Midazolam/Oxascand) är starkt deliriumdrivande på IVA – reservera dem för alkoholabstinens (CIWA-Ar), status epilepticus, palliativ vård eller djup sedering där Propofol ej räcker.',
        ],
      },
      {
        title: 'Propofolinfusionssyndrom (PRIS) – Tidiga Varningssignaler',
        type: 'warning',
        points: [
          'Misstänk PRIS vid oförklarad laktatacidos / negativt Base Excess, stigande CK / Myoglobin (rabdomyolys), stigande S-Kalium, triglyceridstegring eller Brugada-liknande EKG-förändringar/bradyarytmi.',
          'Avbryt Propofol omedelbart vid misstanke och byt till Dexmedetomidin, Klonidin eller Midazolam/Isofluran (Sedaconda).',
        ],
      },
    ],
  },

  Buk: {
    categoryId: 'Buk',
    hubTitle: 'Buk – Intraabdominellt Tryck (IAP), Compartment, Pankreatit & Klinisk Hubb',
    hubSummary:
      'Referensvärden och rutiner för mätning av intraabdominellt tryck (IAP via KAD), abdominellt perfusions-tryck (APP), bukcompartmentsyndrom (ACS), akut pankreatit, ileus och leversvikt.',
    quickLinks: [
      {
        label: 'Sjukdomstillstånd (Pankreatit, Leversvikt, Ileus)',
        targetCategory: 'DISEASES',
        desc: 'Patofysiologi och intensivvård vid akuta buktillstånd',
      },
      {
        label: 'Vätskebalans & Diures',
        targetCategory: 'FLUID_BALANCE',
        desc: 'Undvik positiv vätskebalans vid förhöjt buktryck',
      },
      {
        label: 'Nutrition & Prokinetika',
        targetCategory: 'Nutrition',
        desc: 'Enteral nutrition, retention och tarmmotilitet',
      },
    ],
    normalValues: [
      {
        parameter: 'Normalt IAP hos kritiskt sjuk IVA-patient',
        normalRange: '0–5 mmHg (friska)',
        targetIva: '5–7 mmHg (Obesitas/Graviditet: 8–11 mmHg)',
        note: 'OBS: IAP anges ALLTID i mmHg (1 mmHg = 1,36 cmH₂O). Kontrollera att monitorn mäter i mmHg!',
        isCritical: true,
      },
      {
        parameter: 'IAH (Intraabdominell Hypertension – WSACS)',
        normalRange: '< 12 mmHg',
        targetIva: 'Upprepade mätningar ≥ 12 mmHg',
        note: 'Grad I: 12–15 mmHg | Grad II: 16–20 mmHg | Grad III: 21–25 mmHg | Grad IV: > 25 mmHg.',
        isCritical: true,
      },
      {
        parameter: 'ACS (Abdominellt Compartmentsyndrom)',
        normalRange: '—',
        targetIva: 'IAP > 20 mmHg + Nytillkommen organsvikt',
        note: 'Organsvikt: Oliguri/AKI, höga luftvägstryck (Pplat/Ppeak ↑), sjunkande CO/hypotension. Kräver omedelbar åtgärd och kirurgkontakt!',
        isCritical: true,
      },
      {
        parameter: 'APP (Abdominal Perfusion Pressure = MAP − IAP)',
        normalRange: '> 70 mmHg',
        targetIva: '≥ 60 mmHg',
        note: 'Exempel: Om MAP är 65 mmHg och IAP är 18 mmHg är APP endast 47 mmHg -> hög risk för tarm- och njurischemi! Höj MAP eller sänk IAP.',
        isCritical: true,
      },
      {
        parameter: 'Instillationsvolym i urinblåsa vid IAP-mätning',
        normalRange: '—',
        targetIva: 'Max 20–25 mL steril NaCl 9 mg/ml',
        note: 'För stor volym (> 25–50 mL) tänjer ut detrusormuskeln och ger falskt FÖRHÖJT IAP-värde!',
      },
      {
        parameter: 'P-Amylas (Bukspottkörtel) / S-Lipas',
        normalRange: 'P-Amylas < 1,1 µkat/L',
        targetIva: '> 3 × övre referensgräns talar för akut pankreatit',
        note: 'Amylasnivån korrelerar INTE med pankreatitens svårighetsgrad – följ CRP, laktat, hematokrit, kalcium och IAP!',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Standardiserad IAP-Mätning via KAD (WSACS-Rutin)',
        badge: 'Mätteknik',
        items: [
          { label: '1. Kroppsläge', value: 'Helt plant ryggläge (0° huvudända!)', detail: 'Höjd huvudända på 30° höjer IAP med +3 till +5 mmHg och ger felaktigt värde.' },
          { label: '2. Nollställning av tryckgivare', value: 'I höjd med mellersta axillarlinjen vid crista iliaca', detail: 'Markera gärna nollpunkten på patientens sida med penna så alla mäter på samma ställe.' },
          { label: '3. Instillation i tom blåsa', value: 'Kläm KAD-slangen och fyll med 20 mL steril NaCl', detail: 'Vänta 30–60 sekunder så att blåsans glatta muskulatur slappnar av.' },
          { label: '4. Avläsning', value: 'I slutet av utandningen (end-expiratoriskt) i mmHg', detail: 'Utförs utan aktiv bukmuskelspänning/hosta. Mät var 4–6:e timme vid IAH-risk.' },
        ],
      },
      {
        title: 'Medicinsk Behandlingstrappa för att Sänka Förhöjt IAP (WSACS)',
        badge: 'IAH-Behandling',
        items: [
          { label: '1. Töm intraluminalt innehåll', value: 'Öppen V-sond, rektalsond, prokinetika (Erytromycin + Primperan) & lavemang', detail: 'Avlastar gas- och vätskefylld ventrikel/kolon.' },
          { label: '2. Evakuera fri vätska/abscess i bukhålan', value: 'Ultraljudsledd paracentes / dränage av ascites', detail: 'Kan sänka IAP dramatiskt vid cirros, pankreatit eller kapillärläckage.' },
          { label: '3. Öka bukväggens compliance', value: 'Optimera smärtlindring, sedering, undvik brant sittande (> 20°), ev. kortvarig NMB', detail: 'En smärtpåverkad patient som spänner buken får kraftigt förhöjt IAP.' },
          { label: '4. Optimera vätskebalans & perfusion', value: 'Noll- till negativ vätskebalans (Furosemid / Albumin 20 % / CRRT), håll APP ≥ 60', detail: 'Tredjerumsödem i tarmväggen förvärras snabbt av stora kristalloidmängder.' },
          { label: '5. Kirurgisk dekompression', value: 'Laparotomi med temporär bukförslutning (Öppen buk / VAC / Nät)', detail: 'Vid manifest ACS (IAP > 20 mmHg med progredierande organsvikt) trots medicinska åtgärder.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Hur högt buktryck (IAP) påverkar bröstkorg, hjärta, njurar och hjärna',
        type: 'pearl',
        points: [
          'Respiration: Diafragma trycks kranialt -> kompressionsatelektaser basalt och högt Pplat. Du kan behöva högre PEEP (ofta PEEP i cmH₂O ≈ 50–80 % av IAP i mmHg) för att hålla basala lungdelar öppna!',
          'Cirkulation: Vena cava inferior komprimeras -> minskat venöst återflöde (preload ↓, CO ↓) samtidigt som CVP och inkilningstryck blir falskt HÖGA pga det intrathorakala trycket!',
          'Njurar: Redan vid IAP 15 mmHg halveras njurblodflödet pga kompression av njurvener och parenkym. Vid IAP > 20 mmHg ses ofta oliguri/anuri.',
          'CNS: Förhöjt IAP ökar intrathorakalt tryck -> försämrat venöst avflöde från hjärnan -> FÖRHÖJT ICP!',
        ],
      },
      {
        title: 'Akut Svår Pankreatit & Öppen Buk – Viktiga Bedside-regler',
        type: 'warning',
        points: [
          'Vid akut pankreatit: Följ S-Kalcium (joniserat Ca sjunker vid fettnekroser!), B-Glukos, laktat, diures och IAP. Starta tidig enteral nutrition och ge välbalanserad, målstyrd Ringer-Acetat (undvik massiv övervätskning som utlöser ACS och ARDS!).',
          'Vid Öppen Buk (VAC / Bogota bag): Betydande protein- och vätskeförluster i bukförbandet (ca 2–3 g protein per 100 mL exsudat) – räkna med i vätske- och nutritionsbalansen!',
        ],
      },
    ],
  },

  Infektion: {
    categoryId: 'Infektion',
    hubTitle: 'Infektion – Sepsis-3, Antibiotikaval, Odlingar & Klinisk Hubb',
    hubSummary:
      'Beslutsstöd för Sepsis-3 och septisk chock, Hour-1 Bundle, empiriska antibiotikaregimer på IVA Östra, förlängd betalaktaminfusion, läkemedelskoncentrationer (TDM) och vårdhygien.',
    quickLinks: [
      {
        label: 'Septisk Chock & Infektionstillstånd',
        targetCategory: 'DISEASES',
        desc: 'Sepsis-3, Meningit, Nekrotiserande fasciit & Pneumoni',
      },
      {
        label: 'Dos & CVK (Antibiotikaspädning)',
        targetCategory: 'DRUGS',
        desc: 'Cefotaxim, Pip/Tazo, Meropenem, Vancomycin & Tobramycin',
      },
      {
        label: 'Cirkulation & Vasopressor',
        targetCategory: 'Circulation',
        desc: 'Noradrenalin, Vasopressin, Laktat & ScvO₂',
      },
    ],
    normalValues: [
      {
        parameter: 'SOFA-poäng (Sepsis-3 Definition)',
        normalRange: '0 poäng',
        targetIva: 'Ökning ≥ 2 SOFA-poäng pga dysreglerat infektionssvar = Sepsis',
        note: 'Bedömer 6 organsystem (0–4 p vardera): Respiration (P/F), Koagulation (TPK), Lever (Bilirubin), Cirkulation (MAP/vasopressor), CNS (RLS/GCS), Njure (Krea/diures).',
        isCritical: true,
      },
      {
        parameter: 'Septisk Chock (Sepsis-3 Kriterier)',
        normalRange: '—',
        targetIva: 'Vasopressor för MAP ≥ 65 mmHg + S-Laktat > 2,0 mmol/L trots adekvat vätska',
        note: 'Sjukhusmortalitet > 35–40 %. Kräver antibiotika och cirkulatorisk stabilisering inom 1 timme!',
        isCritical: true,
      },
      {
        parameter: 'Tid till Antibiotika (Door-to-Needle)',
        normalRange: '—',
        targetIva: '< 60 minuter vid septisk chock / svår sepsis (Sepsis utan chock: < 3 h)',
        note: 'Fördröj ALDRIG antibiotika > 45 min om svårigheter att få odlingar/lumbalpunktion!',
        isCritical: true,
      },
      {
        parameter: 'S-Prokalcitonin (PCT)',
        normalRange: '< 0,05 µg/L',
        targetIva: '< 0,25–0,5 µg/L (eller fall med ≥ 80 % från toppvärde) stödjer utsättning',
        note: 'Stiger inom 3–6 h vid invasiv bakteriell infektion (T½ ~24 h). Bättre kinetik än CRP (som släpar 24–48 h).',
      },
      {
        parameter: 'CRP & LPK (Leukocyter)',
        normalRange: 'CRP < 5 mg/L • LPK 3,5–8,8 × 10⁹/L',
        targetIva: 'Följ daglig trend',
        note: 'Både leukocytos (> 12) och leukopeni (< 4) kan ses vid svår sepsis. Obs att Tocilizumab/leversvikt dämpar CRP.',
      },
      {
        parameter: 'Vancomycin Koncentrationsmål (TDM)',
        normalRange: '—',
        targetIva: 'Intermittent dalvärde: 15–20 mg/L | Kontinuerlig inf.: 20–25 mg/L',
        note: 'Kräver alltid viktbaserad laddningsdos (20–30 mg/kg) för att snabbt nå terapeutisk nivå hos septisk patient!',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Surviving Sepsis – Hour-1 Bundle vid Sängkant',
        badge: 'Sepsislarm',
        items: [
          { label: '1. Mät S-Laktat (Artärblodgas)', value: 'Direkt vid misstanke; upprepa inom 2–4 h om > 2,0 mmol/L', detail: 'Styr rehydrering och cirkulationsoptimering.' },
          { label: '2. Säkra Blododling × 2 + Fokusodlingar', value: '2 par (4 flaskor) från 2 separata perifera stick FÖRE antibiotika', detail: 'Vid CVK > 48 h med misstänkt katetersepsis: ta 1 par perifert + 1 par ur CVK samtidigt (för tidsskillnad i växt, DTP).' },
          { label: '3. Ge bredspektrumantibiotika i.v.', value: 'Inom 1 timme! Ge alltid full laddningsdos oavsett GFR!', detail: 'Se empiriska val nedan. Ge eventuell β-laktam först (snabbare infusion än vancomycin).' },
          { label: '4. Balanserad kristalloid vid hypotension/laktat ≥ 4', value: 'Ringer-Acetat (initialt 10–30 mL/kg i 250–500 mL bolusar under utvärdering)', detail: 'Utvärdera vätskeresponsivitet kontinuerligt med PLR, pulstrycksvariation och UCG.' },
          { label: '5. Starta Noradrenalin tidigt', value: 'Mål MAP ≥ 65 mmHg', detail: 'Vänta inte på att flera liter vätska ska gå in om patienten är djupt hypotensiv (diastoliskt BT ≤ 40–50 mmHg = uttalad vasoplegi -> starta Noradrenalin direkt!).' },
        ],
      },
      {
        title: 'Empiriskt Antibiotikaval på IVA (Vuxen – Kontrollera allergi!)',
        badge: 'Empirisk Regim',
        items: [
          { label: 'Samhällsförvärvad Sepsis (Okänt el. Luftvägs-/Urinvägsfokus)', value: 'Cefotaxim 2 g x 3 i.v. (+ ev. engångsdos Tobramycin 5–7 mg/kg vid chock)', detail: 'Vid misstanke om atypisk pneumoni (Legionella): lägg till Moxifloxacin 400 mg x 1 el. Erytromycin.' },
          { label: 'Bukfokus / Nosokomial Sepsis / Neutropen feber', value: 'Piperacillin/Tazobactam 4 g x 4 i.v.', detail: 'Ge en extra dos (4 g) mellan dos 1 och 2 första dygnet, eller ge som förlängd infusion (3–4 h) efter laddningsdos!' },
          { label: 'Septisk Chock med ESBL-risk / Nosokomial VAP / Svår Pankreatit', value: 'Meropenem 1 g x 3–4 (vid chock/CNS: 2 g x 3) i.v.', detail: 'Bredast täckning mot Gramnegativa inkl. ESBL.' },
          { label: 'Nekrotiserande Fasciit / Streptokock-TSS', value: 'Meropenem 2 g x 3 + Klindamycin 600–900 mg x 3 + IVIG + Akut Kirurgi!', detail: 'Klindamycin (Dalacin) stänger av bakteriens toxinproduktion (Eagle-effekt).' },
          { label: 'Akut Bakteriell Meningit', value: 'Betametason (Betapred) 8 mg x 4 FÖRE/MED + Cefotaxim 3 g x 4 + Ampicillin 3 g x 4', detail: 'Ampicillin (Doktacillin) täcker Listeria monocytogenes.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Farmakokinetik vid Sepsis: Varför första antibiotikadosen ALDRIG ska njurdossänkas!',
        type: 'pearl',
        points: [
          'Under de första 24 timmarna av sepsis ökar distributionsvolymen (Vd) kraftigt p.g.a. kapillärläckage och vätskeresuscitering. Många yngre IVA-patienter har dessutom ”Augmented Renal Clearance” (ARC, GFR > 130 mL/min).',
          'Första dosen (laddningsdosen) av betalaktamer, vancomycin och aminoglykosider beror ENBART på distributionsvolymen – ge därför alltid full dos först, och anpassa därefter underhållsdos/dosintervall efter njurfunktion och TDM!',
        ],
      },
      {
        title: 'Source Control – Antibiotika biter inte på en oöppnad abscess!',
        type: 'warning',
        points: [
          'Identifiera och sanera alltid infektionsfokus inom 6–12 timmar: avlasta avstängd pyelit (nefrostomi/JJ-stent), dränera pleuraempyem/bukabscess, debridera nekrotiserande mjukdelsinfektion och avlägsna infekterad CVK/KAD.',
        ],
      },
    ],
  },

  Gynekologi: {
    categoryId: 'Gynekologi',
    hubTitle: 'Gynekologi & Obstetrik – Preeklampsi, HELLP, PPH & Klinisk Hubb',
    hubSummary:
      'Obstetrisk intensivvård på IVA Östra: svår preeklampsi, eklampsi, Magnesiumsulfat-protokoll (och antidot), HELLP-syndrom, vätskerestriktion och massiv postpartumblödning (PPH).',
    quickLinks: [
      {
        label: 'Preeklampsi, HELLP & Obstetriska Tillstånd',
        targetCategory: 'DISEASES',
        desc: 'Klinisk fördjupning och handläggningsalgoritm',
      },
      {
        label: 'Dos & CVK (Trandate, Magnesium, Oxytocin)',
        targetCategory: 'DRUGS',
        desc: 'Spädning och dosering av obstetriska IVA-läkemedel',
      },
      {
        label: 'Vätskebalans (Strikt 80 mL/h vid Preeklampsi)',
        targetCategory: 'FLUID_BALANCE',
        desc: 'Övervakning av timdiures och vätsketillförsel',
      },
    ],
    normalValues: [
      {
        parameter: 'Blodtrycksgräns för Akut Behandling (Preeklampsi)',
        normalRange: '< 140/90 mmHg',
        targetIva: 'Behandla omedelbart vid ≥ 160/110 mmHg! Målblodtryck: 135–145 / 85–95 mmHg',
        note: 'Systoliskt BT ≥ 160 mmHg innebär akut risk för intracerebral blödning hos den gravida/nyförlösta kvinnan!',
        isCritical: true,
      },
      {
        parameter: 'Terapeutiskt S-Magnesium (vid Eklampsiprofylax)',
        normalRange: '0,70–0,95 mmol/L',
        targetIva: '2,0–3,5 mmol/L',
        note: '> 3,5–4,0 mmol/L: Patellarreflexer försvinner! > 5,0 mmol/L: Andningsdepression/paralys! > 10 mmol/L: Hjärtstopp!',
        isCritical: true,
      },
      {
        parameter: 'Total Vätsketillförsel vid Svår Preeklampsi',
        normalRange: '—',
        targetIva: 'Strikt restriktion: Max 80 mL/h (ca 1 mL/kg/h inkl. alla läkemedelsinfusioner!)',
        note: 'Preeklampsi ger generellt endotelialt kapillärläckage och lågt kolloidosmotiskt tryck – hög risk för livshotande lungödem och hjärnödem!',
        isCritical: true,
      },
      {
        parameter: 'Timdiures vid Preeklampsi / Magnesiuminfusion',
        normalRange: '≥ 0,5 mL/kg/h',
        targetIva: '≥ 30–40 mL/h (Tillåt mild oliguri ned till 20 mL/h kortvarigt hellre än att övervätska!)',
        note: 'Magnesium utsöndras 100 % renalt! Vid diures < 25–30 mL/h: kontrollera S-Mg akut och halvera/pausa underhållsinfusionen.',
        isCritical: true,
      },
      {
        parameter: 'P-Fibrinogen vid Graviditet / PPH',
        normalRange: 'Icke-gravid: 2,0–4,0 g/L | Fullgången gravid: 4,0–6,0 g/L',
        targetIva: 'Håll > 2,0–2,5 g/L vid pågående blödning!',
        note: 'Ett ”normalt” fibrinogen på 2,0 g/L hos en blödande nyförlöst kvinna är i praktiken redan kritiskt lågt! Ge Riastap (Fibrinogenkoncentrat) 2–4 g direkt.',
        isCritical: true,
      },
      {
        parameter: 'HELLP-kriterier (Hemolysis, Elevated Liver enzymes, Low Platelets)',
        normalRange: 'TPK > 150 • ASAT/ALAT < 0,6',
        targetIva: 'Haptoglobin omätbart + LD ↑ | ASAT/ALAT > 1,2 µkat/L | TPK < 100 × 10⁹/L',
        note: 'TPK < 50 × 10⁹/L innebär hög blödningsrisk; vid kejsarsnitt/blödning transfunderas trombocyter för TPK > 50 (spinal/epidural kräver > 75–80).',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Magnesiumsulfat (Addex-Mg) – Krampprofylax & Kramphävning',
        badge: 'MgSO₄-Protokoll',
        items: [
          { label: 'Laddningsdos (Bolus)', value: '4 g Magnesiumsulfat (= 16 mmol Mg²⁺) i.v. under 10–15 min', detail: 'Ges via sprutpump. Patienten upplever ofta värmekänsla och rodnad (ofarligt – informera i förväg!).' },
          { label: 'Underhållsinfusion', value: '1–2 g/timme (= 4–8 mmol/h) i 24 timmar efter förlossning/sista kramp', detail: 'Standard på IVA Östra: 1 g/h (4 mmol/h).' },
          { label: 'Vid pågående Eklampsikramp trots pågående infusion', value: 'Ge extra bolus 2 g (8 mmol) MgSO₄ i.v. på 5–10 min', detail: 'Lägg i sidoläge, ge 100 % syrgas, säkra fri luftväg.' },
          { label: 'Kliniska kontroller under infusion (varje timme)', value: 'Patellarreflexer (knäreflex), Andningsfrekvens (≥ 12/min), SpO₂ och Timdiures', detail: 'Bortfall av patellarreflex är det FÖRSTA kliniska tecknet på magnesiumintoxikation!' },
          { label: 'ANTIDOT vid Magnesiumöverdosering', value: 'Kalciumglukonat 10 % 10 mL i.v. långsamt under 3–5 min', detail: 'Skall alltid finnas uppdraget/tillgängligt på rummet när Magnesiuminfusion pågår!' },
        ],
      },
      {
        title: 'Akut Blodtryckssänkning vid Svår Preeklampsi',
        badge: 'Antihypertensiva',
        items: [
          { label: 'Labetalol (Trandate) i.v.', value: 'Bolus 20 mg i.v. under 2 min -> om otillräcklig effekt efter 10 min: 40 mg, sedan 80 mg (max 200–300 mg)', detail: 'Eller kontinuerlig infusion 20–160 mg/h. Kontraindicerat vid svår astma/AV-block.' },
          { label: 'Nifedipin (Adalat) p.o.', value: '10 mg tablett peroralt, kan upprepas efter 30–45 min', detail: 'Snabb och effektiv vid fungerande peroralt intag.' },
          { label: 'Hydralazin (Apresolin) i.v.', value: '5–10 mg i.v. långsamt, upprepas vid behov efter 20 min', detail: 'Direkt kärldilaterare. Kan ge reflextakykardi och huvudvärk.' },
        ],
      },
      {
        title: 'Massiv Postpartumblödning (PPH > 1000 mL) –De 4 T:na',
        badge: 'PPH-Algoritm',
        items: [
          { label: 'Orsaker (4 T)', value: 'Tonus (Uterusatoni 70 %) • Trauma (Ruptur) • Tissue (Placentarest) • Trombin (Koagulopati)', detail: 'Aortakompression och bimanuell uterusmassage omedelbart!' },
          { label: 'Uterotonika-trappa', value: '1. Oxytocin • 2. Misoprostol (Cytotec) • 3. Carboprost (Prostinfenem) • 4. Methergin', detail: 'OBS: Methergin är KONTRAINDICERAT vid preeklampsi/hypertoni! Prostinfenem är kontraindicerat vid astma!' },
          { label: 'Koagulation & Transfusion', value: 'Tranexamsyra (Cyklokapron) 1–2 g i.v. + Fibrinogen (Riastap) 2–4 g + TEG/ROTEM', detail: 'Håll normotermi (> 36 °C), pH > 7,25 och joniserat Ca > 1,15 mmol/L!' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Fysiologi hos den Höggravida / Nyförlösta IVA-patienten',
        type: 'pearl',
        points: [
          'Aortokaval kompression (Vena cava-syndrom): Från graviditetsvecka 20 måste livmodern ALLTID tippas 15–30° åt VÄNSTER (vänster sidoläge eller kilkudde under höger höft) vid ryggläge, procedurer och HLR!',
          'Den obstetriska luftvägen: Slemhinnorna är ödematösa och lättblödande, och funktionell residualkapacitet (FRC) är sänkt samtidigt som syrgasförbrukningen är ökad -> patienten desaturerar extremt snabbt vid apné! Använd mindre tubstorlek (ID 6,0–6,5 mm) och videolaryngoskop.',
        ],
      },
      {
        title: 'Kritiska Fallgropar vid Preeklampsi/HELLP (Röda Flaggor)',
        type: 'warning',
        points: [
          '30–40 % av alla eklampsikramper och lungödem inträffar EFTER förlossningen (postpartum, oftast inom de första 24–72 timmarna när det extravaskulära ödemet mobiliseras tillbaka in i blodbanan)!',
          'Ge ALDRIG Methergin (Metylergometrin) till en patient med preeklampsi eller hypertoni – det kan utlösa akut hypertensiv kris och hjärnblödning!',
        ],
      },
    ],
  },

  Avslut: {
    categoryId: 'Avslut',
    hubTitle: 'Avslut & Palliation – Brytpunkt, Symtomlindring & Klinisk Hubb',
    hubSummary:
      'Vägledning för brytpunktsbeslut, avstående eller avbrytande av livsuppehållande behandling (SIR-riktlinjer), palliativ läkemedelstitrering, palliativ extubation och omhändertagande av närstående.',
    quickLinks: [
      {
        label: 'Anhöriga & Krisstöd',
        targetCategory: 'Anhöriga',
        desc: 'Kommunikation, barn som anhöriga och sorgebearbetning',
      },
      {
        label: 'Organdonation (DBD & DCD)',
        targetCategory: 'Donation',
        desc: 'Kontakta alltid Tx-koordinator vid svår hjärnskada före avslut',
      },
      {
        label: 'Dos & CVK (Morfin, Midazolam, Robinul)',
        targetCategory: 'DRUGS',
        desc: 'Palliativa infusioner och kompatibilitet',
      },
    ],
    normalValues: [
      {
        parameter: 'Mål för Smärta, Andnöd & Ångest vid Behandlingsavslut',
        normalRange: '—',
        targetIva: 'Fullständig symtomfrihet (CPOT 0, ingen lufthunger/takypné eller grimaserande)',
        note: 'Etisk princip (dubbel effekt): Läkemedel ges i den dos som krävs för att lindra smärta, ångest och andnöd – syftet är symtomlindring, aldrig att påskynda döden.',
        isCritical: true,
      },
      {
        parameter: 'Monitorlarm & Övervakning på Salen',
        normalRange: '—',
        targetIva: 'Alla akustiska larm och skärmar på salen avstängda ("Comfort Care Mode")',
        note: 'Behåll vid behov diskret skärmövervakning på centralen så att personalen ser när cirkulationen upphör utan att störa familjen.',
        isCritical: true,
      },
      {
        parameter: 'Vätsketerapi, Nutrition & Provtagning efter Brytpunkt',
        normalRange: '—',
        targetIva: 'Avslutas helt (endast frekvent fuktning av mun och läppar)',
        note: 'Parenteral vätska/nutrition i döendefasen orsakar lungödem, rosslighet och ökat lidande.',
      },
      {
        parameter: 'ICD (Implanterbar Defibrillator) vid Behandlingsavslut',
        normalRange: '—',
        targetIva: 'Chockfunktionen MÅSTE avaktiveras (med programmerare eller ringmagnet över dosan)',
        note: 'Förhindrar smärtsamma och ovärdiga elchocker i livets slutskede! Pacemakerfunktionen behöver normalt inte stängas av.',
        isCritical: true,
      },
    ],
    settingsAndProtocols: [
      {
        title: 'De 4 Palliativmedlen på IVA – Dosering & Titrering',
        badge: 'Symtomlindring',
        items: [
          { label: '1. Smärta & Dyspné – Morfin eller Oxykodon', value: 'Bolus 2,5–5–10 mg i.v. var 10–15:e min tills besvärsfrihet + Infusion 2–15 mg/h', detail: 'Om patienten redan står på Ultiva/Fentanyl: behåll/konvertera till motsvarande potens och ge bolus före varje nedtrappningssteg av ventilatorn!' },
          { label: '2. Ångest, Oro & Lufthunger – Midazolam', value: 'Bolus 1–2,5–5 mg i.v. + Kontinuerlig infusion 2–10 mg/h', detail: 'Kan kombineras med pågående Propofol-infusion för att garantera lugn sömn under avveckling av ventilator.' },
          { label: '3. Rosslighet i luftvägarna – Robinul (Glykopyrron)', value: '0,2–0,4 mg i.v. eller s.c. × 3–4 (max 1,2–1,6 mg/dygn)', detail: 'Ges PROAKTIVT redan innan rosslighet uppstår (torkar ut ny sekretproduktion men tar inte bort redan bildat slem).' },
          { label: '4. Illamående & Delirium – Haloperidol (Haldol)', value: '0,5–1,5 mg i.v. eller s.c. × 2–3', detail: 'Alternativt Ondansetron 4 mg i.v. vid rent illamående.' },
        ],
      },
      {
        title: 'Praktisk Genomförandechecklista vid Behandlingsavslut',
        badge: 'Bedside-Rutin',
        items: [
          { label: 'Steg 1 – Förberedelse & Miljö', value: 'Dokumentera beslut (2 specialistläkare), avaktivera ev. ICD, stäng av larm på salen', detail: 'Ta bort onödiga sprutpumpar, manschetter, sonder och saturationsklämmor. Skapa lugn belysning och plats för anhöriga runt sängen.' },
          { label: 'Steg 2 – Fördjupa analgosedering FÖRE nedtrappning', value: 'Ge bolus Morfin + Midazolam/Propofol och höj underhållsinfusionen', detail: 'Utrota varje risk för lufthunger innan FiO₂ och ventilatorstöd sänks. Obs: Eventuell muskelrelaxation (Esmeron/Nimbex) MÅSTE vara helt urgången!' },
          { label: 'Steg 3 – Avveckla Vasoaktiva dropp, CRRT & Syrgas', value: 'Stäng av Noradrenalin/Inotropi och CRRT. Sänk FiO₂ till 21 % och PEEP till 5 cmH₂O', detail: 'Utvärdera patientens andningsmönster och ge extra bolus opioid/sedering om AF stiger > 20–25/min eller näsvingespel ses.' },
          { label: 'Steg 4 – Palliativ Extubation vs. Nedtrappning på Tub', value: 'Anpassas efter patientens luftväg och teamets/närståendes samtal', detail: 'Före palliativ extubation: ge Robinul 0,2–0,4 mg i.v. (+ ev. Betapred 8 mg mot larynxödem), sug rent i svalg/tub och ha handduk redo. Informera anhöriga om att agonal/snarkande andning (Cheyne-Stokes) kan förekomma och inte innebär smärta.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Glöm aldrig donationsfrågan vid primär eller sekundär hjärnskada!',
        type: 'pearl',
        points: [
          'Innan livsuppehållande ventilatorbehandling avbryts hos en patient med svår hjärnskada (stroke, blödning, TBI, anoxisk hjärnskada efter hjärtstopp) ska alltid möjligheten till organdonation (DBD eller DCD) övervägas och diskuteras med Transplantationskoordinator!',
        ],
      },
      {
        title: 'Etisk och Juridisk Trygghet (SIR-Riktlinjer)',
        type: 'warning',
        points: [
          'Det föreligger ingen etisk eller juridisk skillnad mellan att avstå från att påbörja (withhold) och att avbryta (withdraw) en livsuppehållande behandling som inte längre gagnar patienten.',
          'Anhöriga ska ALDRIG bära skulden för beslutet: gör tydligt att beslutet är ett rent medicinskt ställningstagande fattat av ansvariga läkare, medan anhörigas roll är att berätta vad patienten själv hade önskat i livets slutskede.',
        ],
      },
    ],
  },

  Donation: {
    categoryId: 'Donation',
    hubTitle: 'Donation – DBD, DCD, Organbevarande Behandling & Klinisk Hubb',
    hubSummary:
      'Klinisk hubb för organdonationsprocessen på IVA Östra: identifiering av potentiell donator, kontakt med Transplantationskoordinator, hjärndödsdiagnostik (DBD), kontrollerad DCD och organbevarande intensivvård.',
    quickLinks: [
      {
        label: 'Avslut & Brytpunktsbeslut',
        targetCategory: 'Avslut',
        desc: 'Brytpunktssamtal föregår alltid samtal om DCD',
      },
      {
        label: 'Cirkulation & Vasopressor (MAP & Vasopressin)',
        targetCategory: 'Circulation',
        desc: 'Hemodynamiska mål under organbevarande vård',
      },
      {
        label: 'Dos & CVK (Minirin, Solu-Medrol, Vasopressin)',
        targetCategory: 'DRUGS',
        desc: 'Behandling av Diabetes Insipidus och katecholaminstorm',
      },
    ],
    normalValues: [
      {
        parameter: 'MAP-mål (Organbevarande Behandling)',
        normalRange: '70–100 mmHg',
        targetIva: '65–80 mmHg (Undvik höga noradrenalindoser > 0,2–0,3 µg/kg/min)',
        note: 'Lägg tidigt till Vasopressin (0,01–0,03 E/min) vid vasoplegi och samtidig Diabetes Insipidus!',
        isCritical: true,
      },
      {
        parameter: 'Timdiures & Diabetes Insipidus-gräns',
        normalRange: '0,5–1,5 mL/kg/h',
        targetIva: 'Mål: 1,0–3,0 mL/kg/h | Diabetes Insipidus: > 300 mL/h (> 4 mL/kg/h)',
        note: 'Vid diures > 300 mL/h + stigande S-Natrium (> 145 mmol/L) och låg U-osmolalitet (< 200 mOsm/kg): ge Minirin (Desmopressin) 1–4 µg i.v.!',
        isCritical: true,
      },
      {
        parameter: 'S-Natrium (Donatorsmål för lever/organ)',
        normalRange: '137–145 mmol/L',
        targetIva: '135–150 mmol/L (Undvik svår hypernatremi > 155 mmol/L)',
        note: 'Utmärkt natriumkontroll skyddar levergraftets funktion. Ersätt fria vattenförluster med Glukos 5 % el. enteralt vatten.',
      },
      {
        parameter: 'Kroppstemperatur (Normotermi)',
        normalRange: '36,5–37,5 °C',
        targetIva: '36,0–37,5 °C (Aldrig < 35,0 °C!)',
        note: 'Vid total hjärninfarkt slås hypotalamus termoreglering ut -> patienten blir snabbt poikiloterm/hypoterm. Använd aktivt värmetäcke (Bair Hugger) tidigt!',
        isCritical: true,
      },
      {
        parameter: 'Apnétest-gräns vid DBD-diagnostik (SOSFS)',
        normalRange: 'PaCO₂ 4,6–6,0 kPa',
        targetIva: 'PaCO₂ ≥ 8,0 kPa OCH pH < 7,30 (utan egna andningsrörelser)',
        note: 'Hos patient med kronisk hyperkapni (KOL) krävs dessutom en stegring på ≥ 2,7 kPa från utgångsvärdet.',
        isCritical: true,
      },
      {
        parameter: 'Maxtid för Organbevarande Behandling (Lag (1987:269))',
        normalRange: '—',
        targetIva: 'Max 24 timmar efter fastställande av döden vid DBD',
        note: 'Om särskilda skäl föreligger kan tidsfristen förlängas kortvarigt i samråd med Tx-koordinator.',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'DBD (Donation after Brain Death) – Diagnostik & Handläggning',
        badge: 'DBD-Protokoll',
        items: [
          { label: 'Förutsättningar för Klinisk Neurologisk Undersökning', value: 'Känd orsak till oåterkallelig intrakraniell skada + Temp ≥ 33 °C + Ingen sedering/NMB/intoxikation', detail: 'Uteslut metabol, endokrin eller farmakologisk förklaring till reaktionslösheten.' },
          { label: 'Två Kliniska Undersökningar', value: 'Minst 2 timmars intervall mellan undersökning 1 och 2', detail: 'Samtliga kranialnervsreflexer (pupill, korneal, vestibulo-okulär, svalg, host) måste vara borta + godkänt apnétest vid båda tillfällena. Vid osäkerhet/ofullständigt apnétest krävs fyrkärlsangiografi.' },
          { label: 'Dödstidpunkt vid DBD', value: 'Klockslaget då den andra kliniska undersökningen (el. angiografin) avslutas', detail: 'Dokumenteras på protokollet enligt Socialstyrelsens föreskrifter.' },
        ],
      },
      {
        title: 'DCD (Donation after Circulatory Death) – Kontrollerad Process',
        badge: 'DCD-Protokoll',
        items: [
          { label: 'Steg 1 – Brytpunktsbeslut (Helt separat från donation!)', value: 'Beslut att avbryta livsuppehållande behandling fattas först', detail: 'Donationssamtalet hålls först EFTER att närstående tagit in brytpunktsbeslutet.' },
          { label: 'Steg 2 – Behandlingsavslut (WLST) på IVA', value: 'Extubation och avstängning av organstöd med full palliativ symtomlindring', detail: 'Maximal väntetid till cirkulationsstillestånd för DCD är 3 timmar (för lever oftast < 30–60 min funktionell varm ischemi med MAP < 50).' },
          { label: 'Steg 3 – 5 minuters ”No-Touch”-period', value: 'Från upphörd pulskurva på invasiv artärnål (asystoli/PEA) räknas exakt 5 minuter', detail: 'Under dessa 5 minuter får INGEN röra patienten. Därefter konstateras döden av IVA-läkare och rask transport sker till operation.' },
        ],
      },
      {
        title: 'Organbevarande Checklista (Lungor, Hjärta, Lever, Njurar)',
        badge: 'Donatorsvård',
        items: [
          { label: 'Lungprotektion & Rekrytering', value: 'VT 6–8 mL/kg PBW • PEEP 8–10 cmH₂O • Slutet sugsystem', detail: 'Undvik frånkoppling av kretsen (gör rekryteringsmanöver efter apnétest!). Restriktiv vätskebalans om lungor ska doneras.' },
          { label: 'Hormonsubstitution (Kortison & Minirin)', value: 'Solu-Medrol 15 mg/kg i.v. + Minirin 1–4 µg i.v. vid DI', detail: 'Metylprednisolon dämpar den systemiska inflammationsstormen vid hjärndöd och förbättrar lung- och hjärtfunktion.' },
          { label: 'Blodsocker & Elektrolyter', value: 'B-Glukos 6–10 mmol/L • S-K 4,0–5,0 • S-Mg > 1,0 • Hb > 90–100 g/L', detail: 'Ta blodgas och elektrolyter var 2–4:e timme.' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Autonom Storm (Katekolaminstorm) vid Inklämning – Fällan med långverkande betablockad!',
        type: 'pearl',
        points: [
          'Precis vid inklämning (hjärnstamsischemi) frisätts enorma mängder endogena katekolaminer -> extrem hypertoni och takykardi under 15–60 minuter, vilket nästan alltid följs av ett TVÄRT RAS i blodtrycket (total vasoplegi) när sympatikusutflödet upphör!',
          'Behandla därför aldrig en autonom storm med långverkande betablockad (Metoprolol/Labetalol) som sänker hjärtat när vasoplegin slår till – använd endast extremt kortverkande medel (t.ex. Esmolol eller Remifentanil) om trycket måste dämpas akut.',
        ],
      },
      {
        title: 'Spinala Reflexer (Lazarus-tecken) efter Hjärndöd',
        type: 'warning',
        points: [
          'Hos en hjärndöd patient (DBD) är ryggmärgen fortfarande intakt och oinhiberad. Vid beröring eller smärtstimulering nedom halsen kan spinala reflexer (t.ex. tåflexion, armlyft eller bukkontraktion) utlösas – informera alltid närstående och personal att detta är lokala ryggmärgsreflexer och INTE tecken på hjärnaktivitet!',
        ],
      },
    ],
  },

  Läkemedel: {
    categoryId: 'Läkemedel',
    hubTitle: 'Läkemedel – Farmakologisk Hubb, Säkerhetsgränser & Kompakt Register',
    hubSummary:
      'Snabbguide för högriskläkemedel på IVA & PostOp, CVK-skänkelfördelning, viktbaserad dosering (PBW vs TBW), antidoter samt komplett sök- och favoritbart läkemedelsregister nedan.',
    quickLinks: [
      {
        label: 'Doskalkylator & Blandbarhet i CVK',
        targetCategory: 'DRUGS',
        desc: 'Interaktiv ml/h-kalkylator och Y-kopplingsmatris',
      },
      {
        label: 'Smärta & Sedering (CPOT & RASS)',
        targetCategory: 'PAIN_SEDATION',
        desc: 'Titreringsstöd för opioider och sedativa',
      },
    ],
    normalValues: [
      {
        parameter: 'Noradrenalin Standardstyrka (IVA Östra)',
        normalRange: '0,1 mg/ml (eller 0,2 mg/ml vid vätskerestriktion)',
        targetIva: 'Dosintervall: 0,02–0,50 µg/kg/min (Ges i dedikerad CVK-skänkel)',
        note: 'Späds i Glukos 50 mg/ml (5 %) eller NaCl 9 mg/ml. Märk alltid skänkeln ”VASO – EJ BOLUS!”',
        isCritical: true,
      },
      {
        parameter: 'Kaliumklorid (Addex-Kalium) Infusionshastighet',
        normalRange: 'S-Kalium: 3,6–4,6 mmol/L',
        targetIva: 'Max 20 mmol/timme i CVK (PVK: max 10 mmol/h och max 40 mmol/L)',
        note: 'Koncentrerad kalium får ALDRIG ges outspätt i.v.! Vid > 10 mmol/h krävs kontinuerlig EKG-övervakning.',
        isCritical: true,
      },
      {
        parameter: 'Fosfat (Glycophos / Addex-Fosfat) Infusionsstid',
        normalRange: 'S-Fosfat: 0,80–1,50 mmol/L',
        targetIva: '20–40 mmol i 100–250 ml NaCl/Glukos 5% under 4–8 timmar (max 10 mmol/h)',
        note: 'Får ALDRIG samadministreras i samma skänkel som Kalcium eller Magnesium (utfällning av kalciumfosfat)!',
        isCritical: true,
      },
      {
        parameter: 'Insulin (Actrapid 1 E/ml) på IVA',
        normalRange: 'B-Glukos: 4,0–6,0 mmol/L',
        targetIva: 'B-Glukosmål: 6,0–10,0 mmol/L (Infusion 0,5–8 E/h)',
        note: 'Kontrollera alltid S-Kalium före och under insulininfusion (insulin flyttar K⁺ intracellulärt!).',
      },
      {
        parameter: 'QTc-tid vid QT-förlängande läkemedel',
        normalRange: '< 440 ms (män) / < 460 ms (kvinnor)',
        targetIva: '< 500 ms',
        note: 'Kombination av Amiodaron, Erytromycin, Ondansetron, Haldol eller Moxifloxacin + hypokalemi/hypomagnesemi ger hög risk för Torsades de Pointes!',
      },
    ],
    settingsAndProtocols: [
      {
        title: 'Antidoter på IVA – Akut Dosering vid Överdos / Intoxikation',
        badge: 'Antidoter',
        items: [
          { label: 'Opioidöverdos – Naloxon', value: '0,04–0,1–0,4 mg i.v. titrerat var 2:a min', detail: 'Titrera försiktigt så att andningsdepressionen hävs utan att utlösa akut smärtkris och lungödem! Obs att Naloxon har kortare T½ (30–60 min) än de flesta opioider.' },
          { label: 'Bensodiazepinöverdos – Flumazenil (Lanexat)', value: '0,2 mg i.v. under 15 sek, sedan 0,1 mg var 60:e sek (max 1–2 mg)', detail: 'KONTRAINDICERAT vid blandintoxikation med tricykliska/kramptröskelsänkande läkemedel eller epilepsi!' },
          { label: 'Icke-depolariserande NMB (Rokuronium/Esmeron) – Sugammadex (Bridion)', value: '2–4 mg/kg i.v. (Akut omvändning efter intubationsdos: 16 mg/kg)', detail: 'Reverserar Esmeron inom 2 minuter.' },
          { label: 'Heparin – Protaminsulfat', value: '1 mg Protamin neutraliserar ca 100 IE ofraktionerat Heparin (max 50 mg på 10 min)', detail: 'Ges långsamt i.v. (snabb injektion kan ge grav hypotension och pulmonell hypertension).' },
          { label: 'Warfarin / NOAK – Ocplex (PCC) & Praxbind', value: 'Ocplex (4-faktor PCC) 25–50 IE/kg + Konakion 10 mg | Dabigatran: Praxbind 5 g', detail: 'Vid livshotande blödning under antikoagulantia.' },
          { label: 'Paracetamolintoxikation – Acetylcystein', value: '150 mg/kg på 15–60 min -> 50 mg/kg på 4 h -> 100 mg/kg på 16 h', detail: 'Bäst effekt inom 8–10 h men ges även sent vid manifest leverskada.' },
        ],
      },
      {
        title: '3-Lumen CVK – Rekommenderad Skänkelfördelning',
        badge: 'CVK-Rutin',
        items: [
          { label: 'Skänkel 1 (Dedikerad Vasoaktiv)', value: 'Noradrenalin + Vasopressin + Adrenalin/Inotropi', detail: 'Aldrig bolusinjektioner eller intermittenta antibiotika i denna skänkel!' },
          { label: 'Skänkel 2 (Sedering & Analgesi)', value: 'Propofol + Remifentanil (Ultiva) + Dexdor/Midazolam', detail: 'Byt Propofol-spruta och aggregat var 12:e timme.' },
          { label: 'Skänkel 3 (Basvätska, TPN, Antibiotika & CVP)', value: 'Ringer/Glukos, TPN, Elektrolyter och intermittenta läkemedel', detail: 'Spola med NaCl mellan inkompatibla läkemedel (t.ex. Furosemid, Pantoprazol, Erytromycin).' },
        ],
      },
    ],
    goodToKnow: [
      {
        title: 'Klassiska Inkompatibiliteter i CVK (Fällningsrisk!)',
        type: 'warning',
        points: [
          'Furosemid (Furix) är basiskt och fäller ut med sura lösningar som Noradrenalin, Adrenalin, Dobutamin, Midazolam och Milrinon!',
          'Pantoprazol (Pantoloc) och Omeprazol är starkt inkompatibla med nästan alla kontinuerliga infusioner – ge i egen skänkel eller PVK efter spolning med NaCl.',
          'Amiodaron (Cordarone) får ENDAST blandas i Glukos 50 mg/ml (5 %) och fäller ut med NaCl, Bikarbonat, Heparin och Furosemid.',
          'Fosfat (Glycophos/Addex-Fosfat) och Bikarbonat fäller ut direkt med Kalcium och Magnesium!',
        ],
      },
    ],
  },
};
