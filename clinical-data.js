/**
 * Intensivvårdsenheten Östra - Kliniska Moduler & Medicinsk Kunskapsbas
 * Utökad med:
 * 1. Fler och fördjupade sjukdomstillstånd på IVA (15 kritiska tillstånd)
 * 2. Blodgasparametrar (Radiometer ABL), ventilatorinteraktioner och patofysiologiska analyser
 * 3. Vätskebalans (Östra Excel-modellen, ROSE, dropptaktsberäkning)
 * 4. Smärta & Sedering: CPOT (Critical-Care Pain Observation Tool) & RASS (Richmond Agitation-Sedation Scale)
 * 5. Skiftstart / Start av arbetspass (12-punkters klinisk checklista)
 * 6. Nutritionskalkylator & Kaloritabell IVA 343 Östra sjukhuset
 * 7. Blodprodukter & Medicinteknisk apparatur
 */

// =========================================================================
// 1. SJUKDOMSTILLSTÅND PÅ IVA (KLINISK KUNSKAPSBAS - 15 TILLSTÅND)
// =========================================================================

const IVA_DISEASE_STATES = [
  {
    id: "circ-failure",
    title: "Cirkulationssvikt & Chock",
    category: "Circulation",
    icon: "heart-pulse",
    color: "#e11d48",
    colorLight: "#ffe4e6",
    badge: "Kritisk Hemodynamik",
    shortSummary: "Obalans mellan syrgastillförsel (DO2) och syrgasbehov (VO2) med cellulär hypoxi och förhöjt laktat.",
    subtypes: [
      {
        name: "Septisk Chock (Distributiv)",
        physio: "Vasoplegi (kraftigt sänkt SVR), patologisk mikrocirkulation och relativ hypovolemi. Hyperdynamiskt hjärta (hög CO initialt) men risk för myokarddepression.",
        signs: "MAP < 65 mmHg trots adekvat vätskeladdning, laktat > 2.0 mmol/L, varma extremiteter initialt, takykardi.",
        monitoring: "Arteriell blodtryckskurva, timdiures, ScvO2 (> 70%), ekokardiografi (uteslut septisk kardiomyopati), laktatclearence.",
        actions: "1. Kristalloid (Ringer-Acetat) 30 ml/kg inom 3h vid hypotension.\n2. Noradrenalin för mål-MAP ≥ 65 mmHg.\n3. Vasopressin (0.01–0.03 E/min) som andrahand vid höga noradrenalindoser (> 0.25 µg/kg/min).\n4. Hydrokortison 200 mg/dygn vid refraktär chock.\n5. Tidig fokusjakt och bredspektrumantibiotika inom 1 timme."
      },
      {
        name: "Kardiogen Chock",
        physio: "Primär pumpsvikt (sänkt CO och CI < 2.2 L/min/m2) med ökat fyllnadstryck (PCWP > 15-18 mmHg) och kompensatoriskt förhöjd SVR.",
        signs: "Kalla marmorerade extremiteter, lungstas/lungödem, oliguri, förvirring, förhöjt laktat, takypné.",
        monitoring: "Fokuserad TTE/TEE (LVEF, RVEF, VTI, fyllnadstryck), arteriell tryckvåg (dicrotic notch, pulstrycksvariation), ScvO2 (ofta < 60%).",
        actions: "1. Akut koronarangiografi vid misstänkt infarkt (STEMI/NSTEMI).\n2. Inotropi: Dobutamin (2.5–10 µg/kg/min) eller Milrinon / Levosimendan vid högt fyllnadstryck och sänkt CI.\n3. Försiktig vasopressor (Noradrenalin) för att säkra koronarperfusion (MAP 65–70 mmHg).\n4. Undvik övervätskning – diuretika vid lungödem och adekvat MAP.\n5. Överväg mekaniskt stöd: Impella CP / VA-ECMO / IABP vid refraktärt tillstånd."
      },
      {
        name: "Obstruktiv Chock",
        physio: "Fysiskt flödeshinder som hindrar venöst återflöde eller utflöde från kamrarna (akut cor pulmonale eller komprimerat hjärta).",
        signs: "Halsvenstas, hypotoni, takykardi, pulslös elektrisk aktivitet (PEA) vid kollaps. Kraftig högerkammardilatation.",
        monitoring: "Akut bedside TTE (McConnell's tecken vid lungemboli, perikardvätska med tamponadtecken, pleura/lungultraljud för tryckpneumothorax).",
        actions: "1. Massiv Lungemboli: Akut trombolys (Alteplas 50–100 mg iv) eller kateterburen trombektomi.\n2. Hjärt-tamponad: Omedelbar perikardiocentes under ultraljudsvägledning.\n3. Tryckpneumothorax: Akut dekompression med grov kanyl i I2 medioklavikulärt eller I4-5 främre axillarlinjen följt av pleuradrän."
      },
      {
        name: "Hypovolem Chock (Hemorragisk / Icke-blödning)",
        physio: "Minskad intravaskulär volym leder till sänkt venöst återflöde, sänkt slagvolym och uttalad vasokonstriktion (hög SVR).",
        signs: "Takykardi, hypotoni, blekhet, förlängd kapillär återfyllnad (> 3s), oliguri, lågt pulstryck.",
        monitoring: "Test av vätskeresponsivitet (PLR - passiv benlyftning, VTI-ökning > 10–15%), Hb, laktat, koagulationsstatus.",
        actions: "1. Hemorragisk: Aktivera Massiv Transfusionsprotokoll (MTP 4:4:1 E-konc:Plasma:Trombocyter), Tranexamsyra 1g iv tidigt (< 3h), kirurgisk/angiografisk blödningskontroll.\n2. Icke-blödning (dehydrering/brännskada): Snabb infusion av balanserad kristalloid (Ringer-Acetat)."
      }
    ]
  },
  {
    id: "resp-failure",
    title: "Respirationssvikt & ARDS",
    category: "Respiration",
    icon: "lungs",
    color: "#0284c7",
    colorLight: "#e0f2fe",
    badge: "Mekanisk Ventilation",
    shortSummary: "Oförmåga att upprätthålla adekvat syresättning (Typ 1) eller koldioxidvädring (Typ 2) vid kritisk sjukdom.",
    subtypes: [
      {
        name: "Typ 1 Hypoxisk Respirationssvikt & ARDS",
        physio: "Intrapulmonell shunt och ventilation-perfusions (V/Q) mismatch på grund av atelektaser, alveolärt ödem eller konsolidering.",
        signs: "Svår dyspné, takypné (AF > 30), cyanos, auxiliär andningsmuskulatur, PaO2/FiO2 ≤ 40 kPa (300 mmHg) trots syrgas.",
        monitoring: "Arteriell blodgas, PaO2/FiO2-kvot, drivtryck (ΔP = Platåtryck - PEEP, mål < 14 cmH2O), lungcompliance, lungultraljud (B-linjer).",
        actions: "1. Lungprotektiv ventilation: Tidalvolym 4–6 ml/kg PBW, Platåtryck < 30 cmH2O.\n2. PEEP-titrering enligt PEEP/FiO2-tabell.\n3. Bukläge (Prone position) ≥ 16 h/dygn vid PaO2/FiO2 < 20 kPa (150 mmHg).\n4. Neuromuskulär blockad (Cisatrakurium) tidigt vid kraftig dyssynkroni.\n5. Restriktiv vätskestrategi efter initial stabilisering."
      },
      {
        name: "Typ 2 Hyperkapnisk Svikt (Ventilationssvikt)",
        physio: "Alveolär hypoventilation på grund av ökat andningsarbete, utmattning, luftvägsobstruktion eller nedsatt andningsdrive.",
        signs: "Huvudvärk, somnolens, svettning, perifer vasodilatation, takypné som övergår i ytlig bradypné, respiratorisk acidos (pH < 7.35, pCO2 > 6.0 kPa).",
        monitoring: "Kontinuerlig pCO2-monitorering, arteriella blodgaser, andningsfrekvens, medvetandegrad (GCS/RASS).",
        actions: "1. Icke-invasiv ventilation (NIV / BiPAP) är förstahandsval vid KOL-exacerbation eller kardiogent lungödem.\n2. Farmakologi: Inhalationer (Salbutamol + Ipratropium), systemiska steroider vid KOL/astma.\n3. Vid intubation vid obstruktivitet: Förläng expirationstid (I:E 1:3 eller 1:4), låg andningsfrekvens, övervaka intrinsic PEEP (auto-PEEP).\n4. Permissiv hyperkapni accepteras så länge pH > 7.20 (undantag vid förhöjt ICP)."
      },
      {
        name: "Svår Astma & Status Asthmaticus",
        physio: "Uttalad bronkospasm, mukuspluggar och dynamisk hyperinflation (air trapping) med risk för kardiovaskulär kollaps.",
        signs: "Tyst lungfält (silent chest), cyanos, utmattning, pulsus paradoxus, paradoxal bukrörelse.",
        monitoring: "Auto-PEEP mätning (end-expiratorisk paus), topptryck vs platåtryck, blodgas (stigande pCO2 är larmsignal för omedelbar intubationsrisk!).",
        actions: "1. Kontinuerlig nebulisering av beta-2-agonist + antikolinergikum.\n2. Magnesiumsulfat 10–20 mmol iv över 20 minuter.\n3. Betametason/Hydrokortison iv.\n4. Överväg Ketamin som sedering vid intubation (bronkodilaterande).\n5. Försiktighet vid ventilator: Mycket låg frekvens (10–12/min), lång expiration, acceptera hög pCO2."
      }
    ]
  },
  {
    id: "renal-failure",
    title: "Akut Njursvikt (AKI) & CRRT",
    category: "CRRT",
    icon: "filter",
    color: "#7c3aed",
    colorLight: "#f3e8ff",
    badge: "KDIGO & Dialys",
    shortSummary: "Snabb nedgång i glomerulär filtration med retention av kvävehaltiga restprodukter, acidos och vätskeöverbelastning.",
    subtypes: [
      {
        name: "AKI Stadium 1–3 (KDIGO)",
        physio: "Tredelat syndrom: Prerenal hypoperfusion, Intrinsisk tubulär/glomerulär skada (ATN, nefrotoxiner), Postrenal obstruktion.",
        signs: "Oliguri (< 0.5 ml/kg/h i > 6h), stigande S-Kreatinin och Ureum, metabolisk acidos, hyperkalemi, ödem.",
        monitoring: "Timdiures via timbägar-KAD, vätskebalansräkning (% Fluid Overload), elektrolyter (K+, Ca2+, fosfat), syra-bas, urinsticka.",
        actions: "1. Sätt ut nefrotoxiska läkemedel (NSAID, ACEi/ARB, aminoglykosider).\n2. Optimera renalt perfusionstryck (MAP ≥ 65 mmHg, hos kroniska hypertoniker ofta 75–80 mmHg).\n3. Ultraljud urinvägar för att utesluta avflödeshinder.\n4. Korrigera hypovolemi, men undvik volymöverbelastning efter uppnådd normovolemi.\n5. Furosemid stresstest (FST: 1.0–1.5 mg/kg iv) för att prediktera behov av dialys."
      },
      {
        name: "Akuta Indikationer för CRRT (AEIOU-regeln)",
        physio: "När medicinsk terapi sviktar för att hantera biokemiska rubbningar eller volymstatus hos den kritiskt sjuke.",
        signs: "Refraktär hyperkalemi, grav metabol acidos, lungödem/uttalad vätskeöverbelastning (> 10%), uremisk encefalopati/perikardit.",
        monitoring: "Joniserat kalcium (post-filter och systemiskt vid citratdialys), bikarbonat, effluentdos (20–25 ml/kg/h), filtertryck och transmembrane pressure (TMP).",
        actions: "1. **A**cidos: pH < 7.15 som ej svarar på ventilation eller farmaka.\n2. **E**lektrolyter: S-Kalium > 6.5 mmol/L refraktär mot medicinsk behandling (Insulin-Glukos, Resonium).\n3. **I**ntoxikationer: Litium, metanol, etylenglykol, teofyllin, salicylat.\n4. **Ö/O**verload: Vätskeöverbelastning > 10% med behandlingsresistent lungödem eller grav syresättningssvikt.\n5. **U**remi: Uremi med perikardit, encefalopati eller grav blödningsbenägenhet.\n6. Regional citratantikoagulation (RCA) är förstahandsval för filterlivslängd."
      }
    ]
  },
  {
    id: "sepsis-syndrome",
    title: "Sepsis & Septisk Chock (Sepsis-3)",
    category: "Circulation",
    icon: "flame",
    color: "#dc2626",
    colorLight: "#fee2e2",
    badge: "SOFA & 1-Timmarsbunt",
    shortSummary: "Livshotande organdysfunktion orsakad av ett dysreglerat värdsvar på infektion, definierad av SOFA-stegring ≥ 2 poäng.",
    subtypes: [
      {
        name: "Surviving Sepsis 1-Timmarsbunt (Hour-1 Bundle)",
        physio: "Överväldigande cytokinfrisättning med endotelcellsdysfunktion, mikrovaskulär trombos, kapillärläckage och mitokondriell svikt.",
        signs: "Takykardi, hypotoni, takypné, förändrad medvetandegrad, oliguri, förhöjt laktat, feber eller hypotermi.",
        monitoring: "SOFA-score beräkning (Respiration, Koagulation, Lever, Cirkulation, CNS, Njurar), upprepad laktatmätning var 2–4h.",
        actions: "1. Mät P-Laktat omedelbart (återmät inom 2–4 h om initialt > 2 mmol/L).\n2. Ta blododlingar (minst 2 par) före antibiotika.\n3. Administrera bredspektrumantibiotika inom 1 timme från misstanke.\n4. Ge 30 ml/kg balanserad kristalloid vid hypotension (MAP < 65) eller laktat ≥ 4.0 mmol/L.\n5. Påbörja Noradrenalin om MAP < 65 trots initial vätska (titrera för MAP ≥ 65 mmHg)."
      }
    ]
  },
  {
    id: "neuro-critical",
    title: "Neurokritiska Tillstånd & Ökat ICP",
    category: "Omvårdnad",
    icon: "brain",
    color: "#4f46e5",
    colorLight: "#e0e7ff",
    badge: "ICP & Neuro-IVA",
    shortSummary: "Skydd mot sekundär hjärnskada vid skalltrauma, subaraknoidalblödning, status epilepticus och hjärnödem.",
    subtypes: [
      {
        name: "Intrakraniell Hypertension (ICP > 20–22 mmHg)",
        physio: "Monro-Kellie-doktrinen: Skallens volym är konstant. Ökad volym av hjärna, blod eller likvor leder till skenande tryck och inklämning.",
        signs: "Cushings triad (stigande BT, bradykardi, oregelbunden andning = sen pre-inklämningsvarning!), vida/tröga pupiller, sjunkande GCS.",
        monitoring: "Intrakraniell tryckmätare (Ventriculostomi / parenkymnål), CPP = MAP - ICP (mål 60–70 mmHg), pupillometri, TCD.",
        actions: "1. Huvudända höjd 30°, rak hals (optimera jugulärt venöst avflöde).\n2. Adekvat sedering och analgesi (Propofol + Remifentanil/Fentanyl).\n3. Normoventilation (pCO2 4.5–5.0 kPa). Hyperventilation (pCO2 4.0) endast akut vid hotande inklämning.\n4. Osmoterapi: Hyperton NaCl 3% (150–250 ml bolus) eller Mannitol 15% (1–1.5 g/kg).\n5. Vid ventrikeldrän: Dränera likvor mot ordinerad trycknivå.\n6. Normotermi (feber ökar hjärnans metabolism dramatiskt) och normoglykemi (5–10 mmol/L)."
      }
    ]
  },
  {
    id: "status-epilepticus",
    title: "Refraktärt Status Epilepticus (SE)",
    category: "Omvårdnad",
    icon: "zap",
    color: "#9333ea",
    colorLight: "#f3e8ff",
    badge: "Neurologisk Akutsituation",
    shortSummary: "Krampanfall som pågått i mer än 5 minuter eller upprepade anfall utan återvunnet medvetande.",
    subtypes: [
      {
        name: "Stegvis Behandlingsalgoritm vid Status Epilepticus",
        physio: "Progredierande förlust av GABA-erg hämning och uppreglering av excitatoriska NMDA-receptorer leder till refraktäritet och excitotoxisk hjärnskada.",
        signs: "Generella kramper, tonisk-klonisk aktivitet, ryckningar i ansikte/ögonlock, autonom dysreglering (hypertermi, takykardi, laktatstegring).",
        monitoring: "Kontinuerligt EEG (cEEG) vid nedsövning för att verifiera anfallsfrihet, artärnål, syra-bas, temperatur.",
        actions: "1. Steg 1 (0–10 min): Diazepam 10 mg iv eller Lorazepam 4 mg iv (kan upprepas efter 5 min).\n2. Steg 2 (10–30 min): Levetiracetam (Keppra) 60 mg/kg iv (max 4500 mg) eller Valproat 40 mg/kg iv eller Fosfenytoin 20 mg FE/kg.\n3. Steg 3 (> 30 min, Refraktärt SE): Nedsövning med intubation: Propofol (bolus 2 mg/kg + infusion 2–10 mg/kg/h) och/eller Midazolam (bolus 0.2 mg/kg + infusion 0.05–2 mg/kg/h) eller Tiopental. Mål: Burst-suppression på EEG i minst 24–48 timmar."
      }
    ]
  },
  {
    id: "liver-failure",
    title: "Akut Leversvikt & Dekompenserad Cirros",
    category: "Elimination",
    icon: "activity",
    color: "#d97706",
    colorLight: "#fef3c7",
    badge: "Metabolisk Katastrof",
    shortSummary: "Grav nedsättning av leverns syntes- och reningsförmåga med koagulopati, gulsot och hepatisk encefalopati.",
    subtypes: [
      {
        name: "Akut Leversvikt (ALF / Fulminant)",
        physio: "Akut massiv hepatocytnekros hos tidigare leverfrisk individ, vanligen paracetamolintox, viral hepatit eller autoimmun genes.",
        signs: "Ikterus, koagulopati (PK/INR > 1.5), hepatisk encefalopati, hypoglykemi, hyperammonemi, risk för cerebralt ödem.",
        monitoring: "P-Glukos (tät kontroll!), INR, S-Ammoniak, laktat, medvetandegrad (GCS), pupillreaktion.",
        actions: "1. N-acetylcystein (NAC) ges tidigt till ALLA med akut leversvikt oavsett etiologi.\n2. Glukosinfusion (10–20%) för att förhindra dödlig hypoglykemi.\n3. Hjärnödemsbehandling: Högläge huvudända 30°, normotermi, hyperton NaCl 3% (S-Na mål 145–150 mmol/L).\n4. Tidig kontakt med transplantationscentrum (Sahlgrenska / Karolinska) enligt King's College-kriterier."
      },
      {
        name: "Hepatorenalt Syndrom (HRS-AKI)",
        physio: "Grav renal vasokonstriktion utlöst av splanknisk vasodilatation vid portal hypertension.",
        signs: "Oliguri, stigande kreatinin hos patient med cirros och ascites utan tecken på strukturell njurskada eller chock.",
        monitoring: "Diures, central venperfusion, bukomfång, elektrolyter.",
        actions: "1. Terlipressin 1–2 mg x 4–6 iv (alt kontinuerlig infusion 2–12 mg/dygn).\n2. Albumin 20% (1 g/kg dag 1, därefter 20–40 g/dygn).\n3. Sätt ut diuretika och nefrotoxiska läkemedel."
      }
    ]
  },
  {
    id: "massive-pe",
    title: "Massiv Lungemboli & Högerkammarsvikt",
    category: "Circulation",
    icon: "alert-triangle",
    color: "#ea580c",
    colorLight: "#ffedd5",
    badge: "Högmortalitet",
    shortSummary: "Ocklusion av lungartärträdet som leder till akut efterbelastningsökning för höger kammare, kardiogen chock och kollaps.",
    subtypes: [
      {
        name: "Massiv (Hög-risk) Lungemboli",
        physio: "Akut efterbelastning på höger kammare orsakar dilatation, septumförskjutning åt vänster, nedsatt vänsterkammarfyllnad och cirkulationskollaps.",
        signs: "Hypotoni (systoliskt BT < 90 mmHg eller BT-fall ≥ 40 mmHg), takykardi, cyanos, halsvenstas, akut dyspné.",
        monitoring: "Akut Bedside Eko (McConnell's sign, D-shaped vänsterkammare, TAPSE < 16 mm), Troponin, NT-proBNP, blodgas.",
        actions: "1. Systemisk trombolys: Alteplas (Actilyse) 100 mg iv under 2 timmar (eller bolus 50 mg vid hjärtstopp).\n2. Heparinbolus (5000 IE iv) följt av infusion om trombolys kontraindicerad.\n3. Försiktig vätsketillförsel (max 250–500 ml) – övervätskning förvärrar högerkammardilatation och ischemi!\n4. Noradrenalin för att återställa koronarperfusion i höger kammare (mål MAP 70–75 mmHg).\n5. Inotropi med Dobutamin vid låg CO och adekvat blodtryck.\n6. ECMO (VA-ECMO) eller kateterburen trombektomi vid refraktärt tillstånd."
      }
    ]
  },
  {
    id: "cardiac-arrest-post",
    title: "Hjärtstopp & Post-Resuscitation Care",
    category: "Circulation",
    icon: "heart",
    color: "#be123c",
    colorLight: "#ffe4e6",
    badge: "Post-HLR Vård",
    shortSummary: "Omhändertagande efter återupprättad spontan cirkulation (ROSC) för att minimera reperfusionsskada och hjärnskada.",
    subtypes: [
      {
        name: "Post-HLR Protokoll på IVA",
        physio: "Post-cardiac arrest syndrom kännetecknas av hjärnskada, myokarddysfunktion, systemisk ischemi-reperfusionsrespons och kvarstående patologi.",
        signs: "Koma, instabil cirkulation, metabol acidos med hyperlaktatemi, lungödem, myoklonier.",
        monitoring: "Artärnål, kontinuerlig kärntemperatur (blåskateter/esofagus), kontinuerligt cEEG, seriala blodgaser, ekokardiografi.",
        actions: "1. Temperaturkontroll (TTM): Måltemperatur 36 °C (eller aktiv normotermi < 37.5 °C). Förhindra strikt all feber > 37.7 °C i minst 72 timmar!\n2. Hemodynamiskt mål: MAP 65–75 mmHg med Noradrenalin. Dobutamin vid myokarddepression.\n3. Ventilationsmål: Normoventilation (pCO2 4.5–5.5 kPa) och normoxemi (SpO2 94–98%, PaO2 10–13 kPa). Undvik hyperoxi!\n4. Akut koronarangiografi: Omedelbart vid ST-höjning (STEMI) eller vid misstänkt kardiell orsak utan ST-höjning.\n5. Neuroprognostisering: Genomförs tidigast efter 72 timmar och normotermi (N20 SSEP, NSE, cEEG, MR hjärna)."
      }
    ]
  },
  {
    id: "dka-hhs",
    title: "Diabetisk Ketoacidos (DKA) & HHS",
    category: "Elimination",
    icon: "droplet",
    color: "#b45309",
    colorLight: "#fef3c7",
    badge: "Metabolisk Akutvård",
    shortSummary: "Svår insulinbrist som leder till ketonproduktion, uttalad metabolisk acidos, osmotisk diures och elektrolytkatastrof.",
    subtypes: [
      {
        name: "Diabetisk Ketoacidos (DKA)",
        physio: "Absolut insulinbrist och överskott av motreglerande hormoner inducerar lipolys och bildning av ketonkroppar (acetoacetat, betahydroxibutyrat) som ger svår HAGMA-acidos.",
        signs: "Kussmaul-andning, acetondoft, dehydrering, buksmärtor, illamående/kräkningar, sänkt medvetande.",
        monitoring: "Täta blodgaser (pH, BE, anjongap, laktat), P-Glukos varje timme, S-Kalium var 1–2h, S-Fosfat, timdiures.",
        actions: "1. Vätska: Balanserad kristalloid (Plasmalyte / Ringer-Acetat) 1000 ml första timmen, därefter 500 ml/h med justering mot hemodynamik.\n2. Kalium: Starta ALDRIG insulin om S-Kalium < 3.5 mmol/L! Tillsätt 20–40 mmol K+ per liter vätska när K < 5.0.\n3. Insulin: Snabbverkande insulin (Actrapid) infusion 0.05–0.1 E/kg/h. Sänk ej glukos snabbare än 3–5 mmol/L per timme för att förhindra hjärnödem.\n4. Byt till Glukos 5–10% med elektrolyter när P-Glukos når 12–14 mmol/L, men FORTSÄTT insulininfusionen tills acidosen och anjongapet är helt normaliserat!"
      },
      {
        name: "Hyperosmolärt Hyperglykemiskt Syndrom (HHS)",
        physio: "Relativ insulinbrist hos typ 2-diabetiker. Tillräckligt med insulin för att förhindra massiv ketos, men extrem hyperglykemi och hyperosmolaritet.",
        signs: "Extrem hyperglykemi (> 30–40 mmol/L), hög P-osmolalitet (> 320 mOsm/kg), grav dehydrering (vätskedeficit 8–12 liter), förvirring/koma.",
        monitoring: "Beräknad effektiv osmolalitet = 2*Na + Glukos, timdiures, trombosprofylax.",
        actions: "1. Försiktig vätskeersättning under 48 timmar för att undvika neurologisk kollaps.\n2. Lågdos insulin (0.05 E/kg/h) först EFTER påbörjad adekvat rehydrering.\n3. Högdos trombosprofylax (extrem trombosrisk på grund av hyperviskositet)."
      }
    ]
  },
  {
    id: "anaphylaxis-shock",
    title: "Anafylaxi & Refraktär Chock",
    category: "Circulation",
    icon: "shield-alert",
    color: "#c026d3",
    colorLight: "#fae8ff",
    badge: "Akut Allergologi",
    shortSummary: "Svår, snabbt insättande systemisk överkänslighetsreaktion med luftvägsobstruktion och/eller cirkulationskollaps.",
    subtypes: [
      {
        name: "Handläggning vid Refraktär Anafylaktisk Chock",
        physio: "IgE-medierad mastcells- och basofildegranulering med massiv histamin-, leukotrien- och PAF-frisättning som ger kapillärläckage och vasodilatation.",
        signs: "Stridor, bronkospasm, urtikaria/angioödem, hypotoni, takykardi, buksmärtor, hjärtstopp.",
        monitoring: "Blodtryck, EKG, SpO2, luftvägstryck vid intubation, serumnivå av tryptas (tas inom 1–2h för verifiering).",
        actions: "1. **Adrenalin Intramuskulärt direkt:** 0.3–0.5 mg (0.3–0.5 ml av 1 mg/ml) i lårets utsida. Upprepa var 5–10 min vid utebliven effekt.\n2. **Intravenöst Adrenalin vid chock:** Starta infusion (0.05–0.3 µg/kg/min) eller ge försiktiga titrerade bolusdoser (20–50 µg iv).\n3. **Aggressiv Vätsketillförsel:** Ringer-Acetat 1000–2000 ml bolus snabbt (kapillärläckage kan tömma 35% av blodvolymen på 10 min!).\n4. **Glukagon vid Betablockad:** Glukagon 1–5 mg iv långsamt vid refraktär hypotoni hos patienter som står på betablockerare.\n5. **Sekundär behandling:** Tavegyl 2 mg iv, Betapred 8 mg iv, inhalation Ventoline/Atrovent vid bronkospasm."
      }
    ]
  },
  {
    id: "abdominal-compartment",
    title: "Bukkompartmentsyndrom (ACS) & Pankreatit",
    category: "Elimination",
    icon: "droplet",
    color: "#059669",
    colorLight: "#d1fae5",
    badge: "Buktryck & WSACS",
    shortSummary: "Patologiskt ökat intraabdominellt tryck som leder till multipel organsvikt (respirationssvikt, njursvikt, sänkt hjärtminutvolym).",
    subtypes: [
      {
        name: "Intraabdominell Hypertension (IAH) & ACS",
        physio: "IAH definieras som IAP ≥ 12 mmHg. ACS definieras som kvarstående IAP > 20 mmHg associerat med ny eller förvärrad organsvikt.",
        signs: "Spänd hård buk, oliguri som ej svarar på volym, stigande topptryck på ventilatorn, försämrad syresättning, metabol acidos.",
        monitoring: "Regelbunden buktrycksmätning via KAD (instillera 25 ml steril NaCl i blåsan, mät i end-expiration i ryggläge med nollpunkt i symfysen).",
        actions: "1. Minska intraluminalt innehåll: Ventrikelsond med aktiv sug, tarmsond, avlastande lavemang/neostigmin.\n2. Evakuera intraabdominell vätska: Perkutan dränering av ascites under ultraljud.\n3. Optimera vätsketillförsel: Undvik överresuscitation, använd diuretika eller CRRT vid hypervolemi.\n4. Förbättra bukcompliance: Adekvat analgesi, sedering, överväg muskelrelaxantia.\n5. Kirurgisk dekompression (öppen buk / laparostomi) vid refraktärt ACS."
      },
      {
        name: "Akut Svår Nekrotiserande Pankreatit",
        physio: "Lokal pankreasnekros med massiv retroperitoneal inflammation, kapillärläckage och systemiskt inflammatoriskt responssyndrom (SIRS).",
        signs: "Svåra epigastriesmärtor, illamående, paralytisk ileus, instabil hemodynamik, hög CRP, laktatstegring.",
        monitoring: "Intraabdominellt tryck (IAP), timdiures, hematokrit (mått på hemokoncentration), CT buk efter 72h för nekrosbedömning.",
        actions: "1. Målstyrd vätsketillförsel med Ringer-Acetat (undvik övervätskning; mål diures 0.5–1 ml/kg/h och sjunkande hematokrit).\n2. Tidig enteral nutrition (EN) via ventrikel- eller jejunalsond (skyddar tarmslemhinnan och minskar translokation av bakterier).\n3. Profylaktisk antibiotika rekommenderas EJ rutinmässigt.\n4. Smärtlindring: Epiduralanalgesi (EDA) eller PCA-opioid."
      }
    ]
  },
  {
    id: "malignant-hyperthermia",
    title: "Malign Hypertermi & Malignt Neuroleptikasyndrom",
    category: "Omvårdnad",
    icon: "thermometer",
    color: "#b91c1c",
    colorLight: "#fee2e2",
    badge: "Hypermetabol Kris",
    shortSummary: "Akut livshotande hypermetabol reaktion i skelettmuskulatur utlöst av narkosgaser, succinylkolin eller neuroleptika.",
    subtypes: [
      {
        name: "Malign Hypertermi (MH)",
        physio: "Mutation i ryanodinreceptorn (RYR1) som orsakar okontrollerat kalciumläckage från sarkoplasmatiska retiklet med massiv muskelkontraktion och metabolism.",
        signs: "Skentoppande etCO2 (det tidigaste tecknet!), massiv takykardi, muskelrigiditet (masseterkramp), snabbt stigande kroppstemperatur (> 40–42 °C), grav blandad acidos, hyperkalemi.",
        monitoring: "Kontinuerlig etCO2, kärntemperatur, artärblodgaser (K+, CK, laktat), myoglobinuri.",
        actions: "1. Avbryt omedelbart alla utlösande medel (stäng av halogenhaltiga inhalationsanoder, avbryt Celocurin).\n2. Hyperventilera med 100% syrgas med maximalt färskgasflöde för att vädra ut CO2.\n3. **Dantrolen (Dantrium / Ryanodex) OMEDELBART:** Initial dos 2.5 mg/kg iv snabbt. Upprepa med 1 mg/kg var 5–10 min tills symtomen viker (kumulativ dos upp till 10 mg/kg).\n4. Aktiv kylning: Kalla intravenösa vätskor, ispåsar i ljumskar/axiller, ventrikelsköljning med kallt vatten (avbryt vid temp < 38 °C för att undvika hypotermi).\n5. Behandla hyperkalemi aktivt (Insulin-Glukos, Kalciumklorid)."
      }
    ]
  },
  {
    id: "severe-hypothermia",
    title: "Grav Oavsiktlig Hypotermi",
    category: "Omvårdnad",
    icon: "snowflake",
    color: "#0284c7",
    colorLight: "#e0f2fe",
    badge: "Termisk IVA-vård",
    shortSummary: "Kärntemperatur under 30 °C med grav risk för fatala kammararytmier, koagulopati och multiorgansvikt.",
    subtypes: [
      {
        name: "Handläggning vid Grav Hypotermi (< 30 °C)",
        physio: "Generell cellulär hypometabolism, minskad cerebral syreförbrukning, bradykardi och myokardial instabilitet.",
        signs: "Medvetslöshet, grav bradykardi, Osborn-vågor (J-vågor) på EKG, stelhet utan frossa, apnéliknande andning.",
        monitoring: "Kontinuerlig esofagus- eller blåstemperatur, invasivt blodtryck, EKG-övervakning.",
        actions: "1. Skonsam hantering! Undvik onödiga lägesändringar som kan utlösa ventrikelflimmer (VF).\n2. Aktiv intern uppvärmning: Varmluftstäcke (Bair Hugger), uppvärmda intravenösa vätskor (40–42 °C), uppvärmd andningsgas (F&P 950 37 °C).\n3. Vid hjärtstopp med hypotermi: HLR fortsätter under transport till ECMO-centrum (VA-ECMO är guldstandard för återuppvärmning vid cirkulationsstillestånd).\n4. 'Ingen är död förrän den är varm och död' (Återuppvärmning till minst 32–35 °C innan dödförklaring)."
      }
    ]
  },
  {
    id: "hypertensive-crisis",
    title: "Hypertensiv Kris & Akut Aortadissektion",
    category: "Circulation",
    icon: "gauge",
    color: "#b91c1c",
    colorLight: "#fee2e2",
    badge: "Akut Kärlkatastrof",
    shortSummary: "Extrem blodtrycksstegring (systoliskt > 180 och/eller diastoliskt > 120 mmHg) med akut progressiv målorganpåverkan.",
    subtypes: [
      {
        name: "Akut Aortadissektion Typ A & B",
        physio: "Intimaruptur i aorta med dissektion av blod i median. Extrem skjuvspänning (dP/dt) driver dissektionen perifert.",
        signs: "Svår, plötslig, skärande/slitande bröst-/ryggsmärta, blodtrycksasymmetri mellan armar (> 20 mmHg), pulsbortfall, aortainsufficiens.",
        monitoring: "Arteriell tryckmätning i höger arm, akut DT-aorta, ekokardiografi.",
        actions: "1. Omedelbar blodtrycks- och hjärtfrekvenssänkning: Mål hjärtfrekvens < 60 slag/min och systoliskt BT 100–120 mmHg.\n2. Förstahand: Intravenös betablockad med Labetalol (Trandate) 10–20 mg iv bolus följt av infusion, eller Esmolol.\n3. Vasodilaterare (Nitroprussid / Nitroglycerin) får ENDAST ges EFTER att betablockad har getts för att förhindra reflektorisk takykardi!\n4. Akut toraxkirurgisk kontakt vid Typ A (kirurgisk indikation) och interventionell radiologi/kärlkirurgi vid komplicerad Typ B."
      }
    ]
  }
];

// =========================================================================
// 2. CHECKLISTA: START AV ARBETSPASS PÅ IVA (12 PUNKTER)
// =========================================================================

const SHIFT_CHECKLIST_TEMPLATE = [
  {
    id: "check-rls",
    number: 1,
    title: "Bedöm RLS (Reaction Level Scale)",
    description: "Bedöm medvetandegrad enligt RLS-85: RLS 1 (vaken), RLS 2 (slö/oklar), RLS 3 (mycket slö), RLS 4 (lokaliserar smärta), RLS 5 (undandragande), RLS 6 (böjrörelse), RLS 7 (sträckrörelse), RLS 8 (ingen reaktion).",
    badge: "CNS / Medvetande",
    category: "Neurologi"
  },
  {
    id: "check-pupils",
    number: 2,
    title: "Bedöm pupiller och reflexer",
    description: "Inspektera pupillstorlek (mm), symmetri (anisokori), direkt och indirekt ljusreaktion. Kontrollera svalgreflex, hostreflex och cornealreflex vid nedsövd/intuberad patient.",
    badge: "Pupillometri",
    category: "Neurologi"
  },
  {
    id: "check-auscultate",
    number: 3,
    title: "Auskultera hjärta, lungor och buk",
    description: "Hjärttoner (bi-ljud, galopptakt). Lungor bilateralt (liksidiga andningsljud, rassel, ronki, dämpning, sekret). Buk (tarmljud, tyst buk, metalliska ljud).",
    badge: "Stetoskop",
    category: "Status"
  },
  {
    id: "check-palpation",
    number: 4,
    title: "Palpation Thorax och buk. Inspektera stomi",
    description: "Palpera thorax för subkutant emfysem, revbensinstabilitet. Bukpalpation: mjuk, spänd, ömhet, peritonitretning. Inspektera stomi: färg (vital röd vs nekrotisk mörk), funktion och flöde.",
    badge: "Buk & Thorax",
    category: "Status"
  },
  {
    id: "check-skin",
    number: 5,
    title: "Hudkostym – ödem, missfärgning, sår, utslag, kapillär återfyllnad, temperatur",
    description: "Inspektera hela hudkostymen. Ödemgrad (sakralt, extremiteter). Marmorering (mottling score). Trycksår (sakrum, hälar, nacke). Kapillär återfyllnadstid (< 2s normal, > 3s förlängd). Perifer temperatur (varm vs kall).",
    badge: "Hud & Periferi",
    category: "Omvårdnad"
  },
  {
    id: "check-drains-lines",
    number: 6,
    title: "Drän och infarter",
    description: "Kontrollera alla infarter (CVK, CDK, Artärnål, PVK, PICC-line): insticksställe, förband, märkningsdatum, backflöde. Kontrollera drän (thoraxdrän sug/passivt, bukdrän): sekretion, mängd, färg, luftläckage.",
    badge: "Infarter & Drän",
    category: "Medicinteknik"
  },
  {
    id: "check-kad",
    number: 7,
    title: "KAD: färg på urin?",
    description: "Inspektera KAD-systemet: urinfärg (halmgul, koncentrerad, makroskopisk hematuri, grumlig), timdiuresmätning nollställd och fungerande, förekomst av koagler eller sediment.",
    badge: "Elimination",
    category: "Njurfunktion"
  },
  {
    id: "check-vsond",
    number: 8,
    title: "V-sond (Ventrikelsond)",
    description: "Kontrollera markering vid näsvinge, fixering, aspirationstest/pH-kontroll. Mät retention, kontrollera om aktivt sug eller öppen påse är ordinerad. Pågående sondmat?",
    badge: "Gastroenterologi",
    category: "Nutrition"
  },
  {
    id: "check-vent-settings",
    number: 9,
    title: "Ventilatorinställningar",
    description: "Kontrollera inställt läge (PRVC, PC, PS), PEEP, FiO2, inställd/levererad tidalvolym (Vt/kg PBW), andningsfrekvens, topp- och platåtryck (ΔP < 14 cmH2O). Kontrollera aktiv befuktare (F&P 950 temperatur och vattennivå).",
    badge: "Respiration",
    category: "Ventilation"
  },
  {
    id: "check-pumps-time",
    number: 10,
    title: "Infusionspumpar: När tar de slut?",
    description: "Gå igenom alla pågående infusioner (Noradrenalin, Propofol, Remifentanil, Insulin m.fl.). Beräkna kvarvarande tid baserat på aktuell ml/h och sprutvolym. Förbered nästa spruta/påse i god tid för att undvika behandlingsavbrott!",
    badge: "Pumpar & Doser",
    category: "Läkemedel"
  },
  {
    id: "check-med-times",
    number: 11,
    title: "Medicintider?",
    description: "Stäm av dygnsordinationslistan: planerade antibiotikadoser i tid (betalaktamer, vankomycin-koncentrationer), trombosprofylax, elektrolytinfusioner, fastande inför undersökning/operation.",
    badge: "Ordinationer",
    category: "Läkemedel"
  },
  {
    id: "check-rass",
    number: 12,
    title: "Bedöm RASS (Richmond Agitation-Sedation Scale)",
    description: "Bedöm patientens sederingsnivå på RASS-skalan (+4 till -5). Jämför mot läkarordinerat målvärde (ofta RASS 0 till -1 vid urträning, eller RASS -4 vid bukläge/svår ARDS).",
    badge: "Sedering",
    category: "Neurologi"
  }
];

// =========================================================================
// 3. SMÄRTA & SEDERING: CPOT & RASS SKALOR
// =========================================================================

const CPOT_SCALE = {
  title: "CPOT (Critical-Care Pain Observation Tool)",
  description: "Validerat observationsinstrument för smärtskattning hos icke-kommunikativa, sederade eller intuberade intensivvårdspatienter.",
  targetGoal: "Mål på IVA: CPOT ≤ 2 poäng. Vid CPOT ≥ 3 poäng föreligger signifikant smärta som kräver analgesi och åtgärd.",
  domains: [
    {
      id: "facial",
      name: "1. Ansiktsuttryck",
      options: [
        { score: 0, label: "Avslappnat / Neutralt", desc: "Ingen muskelspänning i ansiktet, lugnt uttryck." },
        { score: 1, label: "Spänt / Sammandraget", desc: "Rynkad panna, sammanpressade ögonbryn, spänd mun." },
        { score: 2, label: "Grimaserar", desc: "Hårt knipande ögon, grimaserar, visar tänder, djupa veck." }
      ]
    },
    {
      id: "movements",
      name: "2. Kroppsrörelser",
      options: [
        { score: 0, label: "Inga rörelser / Normalt", desc: "Ligger stilla i normal vilsam position." },
        { score: 1, label: "Skyddande / Långsamma", desc: "Försiktiga rörelser mot smärtstället, rör händer mot kroppen." },
        { score: 2, label: "Rastlös / Drar i slangar", desc: "Kastar sig i sängen, försöker sätta sig upp, drar i tub/infarter." }
      ]
    },
    {
      id: "muscle_tone",
      name: "3. Muskeltonus (passiv böjning/sträckning av arm)",
      options: [
        { score: 0, label: "Avslappnad", desc: "Inget motstånd vid passiv flexion och extension av armbågen." },
        { score: 1, label: "Spänd / Visst motstånd", desc: "Märkbart motstånd vid passiv rörelse men kan böjas." },
        { score: 2, label: "Mycket spänd / Rigiditet", desc: "Starkt motstånd, rigid eller omöjlig att böja armen." }
      ]
    },
    {
      id: "vent_or_vocal",
      name: "4. Ventilatoranpassning (om intuberad) ELLER Vokalisering (om extuberad)",
      options: [
        { score: 0, label: "Tolererar väl / Tyst", desc: "Intuberad: Alarmerar ej, följer ventilatorn. Extuberad: Talar normalt eller är tyst." },
        { score: 1, label: "Hosta / Kvider ibland", desc: "Intuberad: Hostar, triggar larm som tystnar spontant. Extuberad: Suckar, stönar då och då." },
        { score: 2, label: "Kämpar mot ventilatorn / Gråter", desc: "Intuberad: Kämpar aktivt, asynkroni, frekventa trycklarm. Extuberad: Gråter, skriker, stönar kontinuerligt." }
      ]
    }
  ]
};

const RASS_SCALE = {
  title: "RASS (Richmond Agitation-Sedation Scale)",
  description: "Standardiserad tiogradig skala för bedömning av sederingsdjup och agitation hos intensivvårdspatienter.",
  levels: [
    { score: 4, name: "Våldsam (+4)", color: "#991b1b", bg: "#fee2e2", desc: "Öppet aggressiv, våldsam, omedelbar fara för personalen eller sig själv." },
    { score: 3, name: "Mycket agiterad (+3)", color: "#b91c1c", bg: "#fecaca", desc: "Drar eller rycker i endotrakealtub, katetrar eller PVK; aggressivt beteende." },
    { score: 2, name: "Agiterad (+2)", color: "#c2410c", bg: "#ffedd5", desc: "Frekventa icke-målmedvetna rörelser, kämpar mot ventilatorn." },
    { score: 1, name: "Rastlös (+1)", color: "#d97706", bg: "#fef3c7", desc: "Ängslig, orolig, men rörelserna är inte aggressiva eller kraftiga." },
    { score: 0, name: "Vaken och lugn (0)", color: "#15803d", bg: "#dcfce7", desc: "Spontant alert, fokuserar blicken, lugn och samarbetsvillig. (Normalstatus)" },
    { score: -1, name: "Dåsig (-1)", color: "#0284c7", bg: "#e0f2fe", desc: "Ej fullt vaken, men upprätthåller ögonkontakt vid tilltal i > 10 sekunder." },
    { score: -2, name: "Lätt sedering (-2)", color: "#2563eb", bg: "#dbeafe", desc: "Vaknar kort vid tilltal, ögonkontakt < 10 sekunder." },
    { score: -3, name: "Måttlig sedering (-3)", color: "#4f46e5", bg: "#e0e7ff", desc: "Rörelse eller ögonöppning vid tilltal, men ingen ögonkontakt." },
    { score: -4, name: "Djup sedering (-4)", color: "#7c3aed", bg: "#f3e8ff", desc: "Ingen reaktion på tilltal, men rör sig eller öppnar ögonen vid fysisk stimulering." },
    { score: -5, name: "Oväckbar (-5)", color: "#581c87", bg: "#fae8ff", desc: "Ingen som helst reaktion på varken röst eller fysisk smärtstimulering." }
  ]
};

// =========================================================================
// 4. KALORITABELL IVA 343, ÖSTRA SJUKHUSET (FRÅN BIFOGAD BILD/PDF)
// =========================================================================

const IVA_CALORIE_TABLE = [
  { id: "fibre-drink-2", name: "Fibre drink 2 kcal Fresubin", unit: "100 ml", amount: 100, kcal: 200, category: "Sondnäring & Näringsdryck" },
  { id: "energy-fibre-15", name: "Energy Fibre 1,5 kcal Fresubin", unit: "100 ml", amount: 100, kcal: 150, category: "Sondnäring & Näringsdryck" },
  { id: "jucy-drink-15", name: "Jucy drink 1,5 kcal Fresubin", unit: "100 ml", amount: 100, kcal: 150, category: "Sondnäring & Näringsdryck" },
  { id: "diben-drink", name: "Diben drink (Diabetesanpassad)", unit: "100 ml", amount: 100, kcal: 150, category: "Sondnäring & Näringsdryck" },
  { id: "resource-katrin", name: "Resource Katrinplommon", unit: "100 ml", amount: 100, kcal: 55, category: "Mage & Tarmdryck" },
  { id: "nyponsoppa-kiviks", name: "Nyponsoppa Kiviks", unit: "100 ml", amount: 100, kcal: 50, category: "Soppor & Dryck" },
  { id: "appeljuice-konc", name: "Äppeljuice koncentrerat", unit: "100 ml", amount: 100, kcal: 41, category: "Juice & Dryck" },
  { id: "apelsinjuice-konc", name: "Apelsinjuice koncentrerat", unit: "100 ml", amount: 100, kcal: 45, category: "Juice & Dryck" },
  { id: "jordgubb-blandsaft", name: "Jordgubb blandsaft", unit: "100 ml", amount: 100, kcal: 30, category: "Juice & Dryck" },
  { id: "proviva-jordgubb", name: "Proviva jordgubb", unit: "100 ml", amount: 100, kcal: 35, category: "Mage & Tarmdryck" },
  { id: "proviva-mango", name: "Proviva Mango", unit: "100 ml", amount: 100, kcal: 40, category: "Mage & Tarmdryck" },
  { id: "arla-yoggi", name: "Arla yoggi original", unit: "100 g", amount: 100, kcal: 85, category: "Mejeri" },
  { id: "mjolk-mellan", name: "Mjölk mellan", unit: "100 ml", amount: 100, kcal: 45, category: "Mejeri" },
  { id: "isglass", name: "Isglass", unit: "1 glass", amount: 1, kcal: 36, category: "Mellanmål & Dessert" },
  { id: "brod-halvgrovt", name: "Bröd halvgrovt", unit: "1 skiva", amount: 1, kcal: 99, category: "Bröd & Mat" },
  { id: "polarkaka", name: "Polarkaka", unit: "1 skiva", amount: 1, kcal: 81, category: "Bröd & Mat" },
  { id: "billinge-ost", name: "Billinge ost", unit: "1 skiva", amount: 1, kcal: 35, category: "Pålägg" },
  { id: "bob-jordgubbssylt", name: "Bob jordgubbssylt", unit: "1 msk", amount: 1, kcal: 20, category: "Pålägg & Sött" },
  { id: "bob-apelsinmarmelad", name: "Bob apelsinmarmelad", unit: "1 msk", amount: 1, kcal: 25, category: "Pålägg & Sött" }
];

// =========================================================================
// 5. DROPTAKTSBERÄKNING (IVA DROPPAGGREGAT & FORMEL)
// =========================================================================

const IVA_DRIP_FACTORS = [
  { id: "standard-20", name: "Standard Infusionsaggregat", dropsPerMl: 20, desc: "20 droppar/ml (Vanlig kristalloid- och glukosinfusion)" },
  { id: "blood-20", name: "Blodaggregat", dropsPerMl: 20, desc: "20 droppar/ml (Transfusionsaggregat med 200 µm filter)" },
  { id: "micro-60", name: "Mikrodroppaggregat (Pediatrik / Finjustering)", dropsPerMl: 60, desc: "60 droppar/ml (1 ml/h motsvarar exakt 1 drp/min)" },
  { id: "custom", name: "Anpassat aggregat", dropsPerMl: 20, desc: "Manuellt angivet dropptal per ml" }
];

// =========================================================================
// 6. BLODGAS: RADIOMETER ABL PARAMETRAR, REFERENSER & KORRELATIONER
// =========================================================================

const RADIOMETER_BG_FIELDS = [
  // Blodgasvärden
  { id: "pH", name: "pH", group: "Blodgasvärden", unit: "", ref: "7.35 – 7.45", step: 0.001, default: 7.433 },
  { id: "pCO2", name: "pCO2", group: "Blodgasvärden", unit: "kPa", ref: "4.6 – 6.0", step: 0.01, default: 5.03 },
  { id: "pO2", name: "pO2", group: "Blodgasvärden", unit: "kPa", ref: "10.0 – 14.0", step: 0.1, default: 11.5 },
  { id: "hco3", name: "cHCO3⁻(P)c", group: "Blodgasvärden", unit: "mmol/L", ref: "22.0 – 27.0", step: 0.1, default: 25.2 },
  { id: "be", name: "cBase(Ecf)c", group: "Blodgasvärden", unit: "mmol/L", ref: "-3.0 – +3.0", step: 0.1, default: 0.9 },
  // Oximetervärden
  { id: "hct", name: "Hctc (Hematokrit)", group: "Oximetervärden", unit: "decimal", ref: "0.35 – 0.50", step: 0.001, default: 0.339 },
  { id: "ctHb", name: "ctHb (Hemoglobin)", group: "Oximetervärden", unit: "g/L", ref: "120 – 160", step: 1, default: 111 },
  { id: "sO2", name: "sO2 (Syremättnad)", group: "Oximetervärden", unit: "%", ref: "95.0 – 99.0", step: 0.1, default: 97.8 },
  { id: "fcoHb", name: "FCOHb (Karboxihemoglobin)", group: "Oximetervärden", unit: "%", ref: "< 1.5 – 2.0", step: 0.1, default: 1.2 },
  { id: "fmetHb", name: "FMetHb (Methemoglobin)", group: "Oximetervärden", unit: "%", ref: "< 1.0 – 1.5", step: 0.1, default: 0.2 },
  // Elektrolytvärden
  { id: "na", name: "cNa⁺ (Natrium)", group: "Elektrolytvärden", unit: "mmol/L", ref: "137 – 145", step: 1, default: 140 },
  { id: "k", name: "cK⁺ (Kalium)", group: "Elektrolytvärden", unit: "mmol/L", ref: "3.5 – 5.0", step: 0.1, default: 4.4 },
  { id: "ca", name: "cCa²⁺ (Joniserat Kalcium)", group: "Elektrolytvärden", unit: "mmol/L", ref: "1.15 – 1.33", step: 0.01, default: 1.11 },
  { id: "cl", name: "cCl⁻ (Klorid)", group: "Elektrolytvärden", unit: "mmol/L", ref: "98 – 107", step: 1, default: 108 },
  // Metabolitvärden
  { id: "glu", name: "cGlu (Glukos)", group: "Metabolitvärden", unit: "mmol/L", ref: "4.0 – 6.0", step: 0.1, default: 7.0 },
  { id: "lac", name: "cLac (Laktat)", group: "Metabolitvärden", unit: "mmol/L", ref: "0.5 – 1.6", step: 0.1, default: 0.5 }
];

// Ventilatorinställningar som kopplas till blodgasen
const VENTILATOR_DEFAULT_INPUTS = {
  fio2: 40,        // % (t.ex. 40% = 0.40)
  peep: 8,         // cmH2O
  af: 16,          // andetag/minut
  vt: 450,         // ml
  pbw: 70          // kg (för beräkning av ml/kg PBW)
};

// =========================================================================
// 7. VÄTSKETYPER & VÄTSKEBALANS (ROSE-MODELLEN & INFUSIONER)
// =========================================================================

const IVA_FLUIDS_DATA = [
  {
    id: "ringer-acetat",
    name: "Ringer-Acetat",
    category: "Balanserad Kristalloid",
    osmolarity: "270 mOsm/L (Hypoton in vitro, fysiologisk in vivo)",
    electrolytes: "Na: 130 | K: 4.0 | Ca: 2.0 | Mg: 1.0 | Cl: 110 | Acetat: 30 mmol/L",
    expansionFactor: "Ca 20–25% (200–250 ml stannar intravaskulärt per 1000 ml)",
    caloriesPerLiter: 9,
    caloriesNote: "Ca 9 kcal/L (från 30 mmol acetat som metaboliseras till bikarbonat och CO2)",
    pros: [
      "Fysiologiskt kloridinnehåll (110 mmol/L) som minskar risken för hyperkloremisk metabol acidos.",
      "Minskar risken för akut njurskada (AKI) och behov av dialys jämfört med NaCl 0.9% (visat i SMART- och SALT-ED-studierna).",
      "Acetat metaboliseras snabbt i muskler och perifer vävnad till bikarbonat (oberoende av leverfunktion till skillnad från laktat).",
      "Förstahandsval vid generell resuscitation, sepsis och kirurgiska patienter."
    ],
    cons: [
      "Något hypoton jämfört med plasma (270 mOsm/L). Kan öka hjärnödem vid svår traumatisk hjärnskada (TBI).",
      "Kräver stora volymer vid svår hypovolemi, vilket kan leda till interstitiellt ödem och lungödem om vätskeresponsivitet saknas."
    ],
    primaryUse: "Förstahandsvätska vid sepsis, hypovolemi, perioperativt och generell vätsketerapi.",
    caution: "Undvik stora volymer vid akut hjärnskada med intrakraniellt tryckstegringshot."
  },
  {
    id: "plasmalyte",
    name: "Plasmalyte / Sterofundin",
    category: "Balanserad Kristalloid",
    osmolarity: "295 mOsm/L (Isoton)",
    electrolytes: "Na: 140 | K: 5.0 | Mg: 1.5 | Cl: 98 | Acetat: 27 | Glukonat: 23 mmol/L",
    expansionFactor: "Ca 20–25% stannar intravaskulärt",
    caloriesPerLiter: 16,
    caloriesNote: "Ca 16 kcal/L (från acetat och glukonat)",
    pros: [
      "Närmast identisk med normal human plasmaelektrolytprofil.",
      "Kloridhalt (98 mmol/L) helt i nivå med plasma – noll risk för hyperkloremisk acidos.",
      "Isoton osmolaritet (295 mOsm/L), vilket gör den säkrare vid hjärnskador än Ringer-Acetat.",
      "Innehåller magnesium (1.5 mmol/L)."
    ],
    cons: [
      "Dyrare än Ringer-Acetat.",
      "Innehåller kalium (5.0 mmol/L) – försiktighet vid svår hyperkalemi före dialysstart."
    ],
    primaryUse: "Idealt vid neurointensivvård, levercirros med acidos och stora resuscitationsbehov.",
    caution: "Kontrollera kaliumvärde vid grav njursvikt."
  },
  {
    id: "nacl-09",
    name: "Natriumklorid 0.9% (Fysiologisk koksalt)",
    category: "Obalanserad Kristalloid",
    osmolarity: "308 mOsm/L (Isoton in vitro)",
    electrolytes: "Na: 154 | Cl: 154 mmol/L",
    expansionFactor: "Ca 20–25% stannar intravaskulärt",
    caloriesPerLiter: 0,
    caloriesNote: "0 kcal/L (innehåller inga metaboliserbara anjoner eller kolhydrater)",
    pros: [
      "Innehåller varken kalium eller kalcium – säkert vid grav hyperkalemi med EKG-förändringar.",
      "Kompatibel med de flesta läkemedel och blodkomponenter.",
      "Förstahandsval vid hypokloremisk metabol alkalos (t.ex. efter upprepade kräkningar eller ventrikelretention)."
    ],
    cons: [
      "Extremt suprafysiologiskt kloridinnehåll (154 mmol/L mot normalt 100 mmol/L i plasma).",
      "Inducerar hyperkloremisk metabol acidos ('normal anion gap acidosis') vid infusioner > 2 liter.",
      "Kloridorsakad renal vasokonstriktion sänker GFR och ökar risken för akut njursvikt (AKI)."
    ],
    primaryUse: "Hypokloremisk alkalos, traumatisk hjärnskada (isoton), spädning av specifika läkemedel.",
    caution: "Undvik som rutinresuscitation vid sepsis och kirurgi."
  },
  {
    id: "glukos-5",
    name: "Glukos 50 mg/ml (Glukos 5%)",
    category: "Hypoton / Fritt vatten",
    osmolarity: "278 mOsm/L (Isoton i påsen, funktionellt fritt vatten i kroppen)",
    electrolytes: "Glukos: 50 g/L (278 mmol/L) | Elektrolyter: 0",
    expansionFactor: "Endast ca 8–10% stannar intravaskulärt! (2/3 går intracellulärt, 1/3 extracellulärt)",
    caloriesPerLiter: 200,
    caloriesNote: "200 kcal/L (50g x 4 kcal/g). Tillför basal energi och förhindrar ketos.",
    pros: [
      "Klassisk vätska för korrektion av hypernatremi och rent vätskeunderskott (fritt vatten).",
      "Tillför basal energi (200 kcal/L) och hämmar lipolys och muskelkatabolism vid fasta.",
      "Standard bärarvätska för elektrolyttillsatser (Addex-Kalium, Addex-Natrium)."
    ],
    cons: [
      "Helt oduglig som volymresuscitation vid hypotension eller chock (90% lämnar blodbanan!).",
      "Kan orsaka snabb osmotisk shift och cerebralt ödem vid överanvändning.",
      "Kan inducera hyperglykemi hos kritiskt sjuka med insulinresistens."
    ],
    primaryUse: "Underhållsvätska med tillsatser, korrektion av dehydrering med hypernatremi.",
    caution: "Kontraindicerad vid hypovolem chock och akut skallskada med hjärnödem."
  },
  {
    id: "glukos-10",
    name: "Glukos 100 mg/ml (Glukos 10%)",
    category: "Hyperton energivätska",
    osmolarity: "555 mOsm/L (Hyperton)",
    electrolytes: "Glukos: 100 g/L (555 mmol/L) | Elektrolyter: 0 (tillsätts vb)",
    expansionFactor: "Initialt dras vätska från interstitiet, därefter fördelas fritt vatten i alla kompartments.",
    caloriesPerLiter: 400,
    caloriesNote: "400 kcal/L (100g x 4 kcal/g). Dubbel energitäthet jämfört med Glukos 5%.",
    pros: [
      "Effektiv för att täcka kaloribehov vid vätskerestriktion (t.ex. njursvikt eller lungödem).",
      "Förstahandsval vid insulininducerad hypoglykemi och vid kontinuerlig insulin-glukosinfusion vid hyperkalemi.",
      "Standard vid akut leversvikt där leverns glykogenolys och glukoneogenes fallerar."
    ],
    cons: [
      "Kärlretande – infusion i perifer ven under längre tid kan orsaka tromboflebit.",
      "Kräver tät P-Glukosmonitorering för att undvika osmotisk diures och hyperglykemi.",
      "Får ej användas som volymresuscitation."
    ],
    primaryUse: "Hypoglykemi, energitillförsel vid vätskerestriktion, leversvikt, hyperkalemibehandling.",
    caution: "Ge företrädesvis i CVK vid långvarig infusion."
  },
  {
    id: "albumin-20",
    name: "Albumin 200 g/L (Albumin 20%)",
    category: "Hyperonkotisk Kolloid",
    osmolarity: "Ca 300 mOsm/L (Onkotiskt tryck ca 100 mmHg, ~4 ggr normal plasma)",
    electrolytes: "Na: 130–160 | Cl: ≤ 160 mmol/L | Albumin: 200 g/L",
    expansionFactor: "Volymexpansion 300–400%! (100 ml drar till sig ca 300–400 ml från interstitiet till blodbanan)",
    caloriesPerLiter: 800,
    caloriesNote: "Ca 800 kcal/L från protein (används dock ej som energikälla).",
    pros: [
      "Kraftfull intravaskulär volymexpansion med minimal tillförd totalvolym.",
      "Evidensbaserad överlevnadsvinst vid septisk chock som kräver stora volymer kristalloider (ALBIOS-studien).",
      "Minskar mortalitet vid spontan bakteriell peritonit (SBP) och efter storvolymsparacentes (> 5L).",
      "Förstahandsval vid hepatorenalt syndrom (HRS-AKI) i kombination med Terlipressin."
    ],
    cons: [
      "Hög kostnad, human blodprodukt.",
      "Kontraindicerad vid akut traumatisk hjärnskada (SAFE-studien visade ökad mortalitet vid TBI!)."
    ],
    primaryUse: "Septisk chock med stort kristalloidbehov, levercirros/SBP, paracentes, HRS-AKI, refraktärt ödem med hypoalbuminemi.",
    caution: "Absolut kontraindicerad vid akut traumatisk hjärnskada (TBI)."
  }
];

// =========================================================================
// 8. SONDMAT & NÄRINGSPRODUKTER (ESPEN GUIDELINES)
// =========================================================================

const NUTRITION_FORMULAS = [
  {
    id: "fresubin-energy",
    name: "Fresubin Energy (Standard Sondmat)",
    energyDensity: 1.5,
    energyPerMl: 1.5,
    proteinDensity: 5.6,
    proteinPer100ml: 5.6,
    description: "Standard energirik sondmat för patienter med normalt till förhöjt energibehov.",
    category: "Enteral standard",
    indication: "Standard enteral nutrition för IVA-patienter utan grav njur-/leversvikt.",
    caution: "Kontrollera ventrikelretention regelbundet enligt avdelningsrutin."
  },
  {
    id: "fresubin-hp-energy",
    name: "Fresubin HP Energy (Högprotein)",
    energyDensity: 1.5,
    energyPerMl: 1.5,
    proteinDensity: 7.5,
    proteinPer100ml: 7.5,
    description: "Högproteinsonmat för kritiskt sjuka IVA-patienter, trauma och katabola tillstånd.",
    category: "Enteral högprotein",
    indication: "Katabola IVA-patienter, sepsis, kirurgi, trauma eller hög proteinförlust (t.ex. CRRT).",
    caution: "Följ urea och kreatinin vid njursvikt utan pågående dialys."
  },
  {
    id: "peptamen-af",
    name: "Peptamen AF (Peptidbaserad Högprotein)",
    energyDensity: 1.5,
    energyPerMl: 1.5,
    proteinDensity: 9.4,
    proteinPer100ml: 9.4,
    description: "Hydrolyserat vassleprotein och MCT-fett för patienter med malabsorption, diarré eller svår sepsis.",
    category: "Enteral semielementär",
    indication: "Malabsorption, hög ventrikelretention, diarré eller intolerans mot standardsondmat.",
    caution: "Högre osmolaritet – trappa upp infusionshastigheten stegvis."
  },
  {
    id: "smofkabiven-central",
    name: "SmofKabiven Central (Parenteral Nutrition)",
    energyDensity: 1.1,
    energyPerMl: 1.1,
    proteinDensity: 5.1,
    proteinPer100ml: 5.1,
    description: "Fullvärdig trekammarpåse med SMOF-lipider (fiskolja, soja, MCT, oliv) för infusion i CVK.",
    category: "Parenteral (TPN)",
    indication: "Patienter där enteral nutrition är kontraindicerad (ileus, tarmischemi, perforation) eller otillräcklig efter 3–7 dygn.",
    caution: "Endast i central venkateter (CVK). Följ triglycerider och leverstatus."
  }
];

// =========================================================================
// 8b. ROSE-MODELLEN FÖR VÄTSKETERAPI PÅ IVA
// =========================================================================

const ROSE_PHASES = [
  {
    letter: "R",
    name: "Resuscitation",
    subname: "Räddningsfas",
    timing: "Minuter till första timmarna",
    color: "#dc2626",
    goal: "Rädda liv vid cirkulatorisk chock och hypoperfusion. Återställ mikrocirkulation och adekvat perfusionstryck (MAP ≥ 65 mmHg).",
    fluidStrategy: "Tidig initial balanserad kristalloid 30 ml/kg inom 3 timmar. Utvärdera vätskeresponsivitet (PLR / SVV). Avbryt vätska när patienten inte längre svarar!",
    monitoring: "P-Laktat, MAP, ScvO2, kapillär återfyllnad, passivt benlyft (PLR)."
  },
  {
    letter: "O",
    name: "Optimization",
    subname: "Optimeringsfas",
    timing: "Första 6–24 timmarna",
    color: "#ea580c",
    goal: "Optimera syrgasleverans (DO2) och organperfusion och minimera risken för interstitiellt vätskeläckage och ödem.",
    fluidStrategy: "Restriktiv vätsketillförsel. Endast små titrerade bolusdoser (250–500 ml) vid påvisad vätskeresponsivitet. Tidig insättning av Noradrenalin.",
    monitoring: "Ekokardiografi (VTI, VCI-kollapsibilitet), arteriell blodgas, timdiures."
  },
  {
    letter: "S",
    name: "Stabilization",
    subname: "Stabiliseringsfas",
    timing: "Dag 2 till 4",
    color: "#0284c7",
    goal: "Förhindra organödem, lungödem (ARDS), bukhinneödem och intraabdominell hypertension (IAH).",
    fluidStrategy: "Neutral vätskebalans (Nollbalans). Endast basala underhållsvätskor, elektrolyter och nödvändiga läkemedelsbärare.",
    monitoring: "Daglig kumulativ vätskebalans, % Fluid Overload (%FO), PaO2/FiO2-kvot."
  },
  {
    letter: "E",
    name: "Evacuation",
    subname: "Avvecklingsfas / De-eskalering",
    timing: "Dag > 4 (när chocken har hävts)",
    color: "#059669",
    goal: "Aktivt avlägsna ackumulerat vätskeöverskott, förbättra lungcompliance, möjliggöra extubation och minska IVA-vårdtid.",
    fluidStrategy: "Målmedveten negativ dygnsbalans (-1000 till -2000 ml/dygn) med loopdiuretika (Furosemid) i infusion eller CRRT med netto-ultrafiltration.",
    monitoring: "Vikt, elektrolyter (K, Na, Mg), njurfunktion (kreatinin/diures), hemodynamik vid negativ dragning."
  }
];

// =========================================================================
// 9. BLODPRODUKTER & TRANSFUSION PÅ IVA
// =========================================================================

const IVA_BLOOD_PRODUCTS_DATA = [
  {
    id: "sagman-erythrocytes",
    name: "Erytrocytkoncentrat (E-konc / SAGMAN)",
    category: "Röda blodkroppar",
    volumePerUnit: "Ca 250–300 ml",
    effectPerUnit: "Höjer Hb med ca 8–10 g/L hos en vuxen (70 kg).",
    time: "Normalt 60–120 min per enhet (akut: tryckpåse vid massiv blödning)",
    caution: "TACO (risk vid hjärtsvikt/äldre) och TRALI. Kontrollera blodgrupp/bastest.",
    indications: [
      "Restriktiv transfusionsgräns (TRICC, TRISS): Hb < 70 g/L (mål 70–90 g/L) för generella IVA- och sepsispatienter.",
      "Kardiell ischemi / Akut koronart syndrom (ACS): Hb < 80 g/L (mål 80–100 g/L).",
      "Akut pågående okontrollerad blödning (aktivera MTP 4:4:1)."
    ],
    risks: ["TACO (Transfusion-Associated Circulatory Overload)", "TRALI", "Hyperkalemi vid snabb infusion av äldre påsar", "Hypokalcemi vid massiv transfusion (citrat)"]
  },
  {
    id: "plasma-octaplas",
    name: "Färskfrusen Plasma / Octaplas",
    category: "Koagulationsfaktorer",
    volumePerUnit: "Ca 200 ml",
    effectPerUnit: "Tillför alla humana koagulationsfaktorer och fibrinogen.",
    time: "Ca 30–60 min per enhet. Upptinad plasma ska användas inom 4 timmar.",
    caution: "TRALI (störst risk bland blodprodukter). Används EJ som enbart volymsubstitution!",
    indications: [
      "Massiv blödning som del i MTP 4:4:1 (SAGMAN : Plasma : Trombocyter).",
      "Kritisk blödning vid förhöjd PK(INR) > 1.5 eller brist på multipla koagulationsfaktorer.",
      "Trombotisk trombocytopen purpura (TTP) / terapeutisk plasmaferes."
    ],
    risks: ["TRALI (störst risk bland blodprodukter)", "Allergisk/anafylaktisk reaktion", "Volymöverbelastning"]
  },
  {
    id: "platelets-trombocyter",
    name: "Trombocytkoncentrat (Koncentrerade TPK)",
    category: "Trombocyter",
    volumePerUnit: "Ca 200–250 ml (Poolade eller aferes)",
    effectPerUnit: "Höjer B-TPK med ca 20–40 x 10^9/L hos en 70 kg vuxen.",
    time: "Ca 30 min per enhet. Får ALDRIG kylförvaras eller värmas i blodvärmare!",
    caution: "Förvaras i rumstemperatur (20–24 °C) under konstant vaggning. Högst risk för bakteriell kontamination.",
    indications: [
      "TPK < 10 x 10^9/L: Profylaktiskt till icke-blödande patient.",
      "TPK < 50 x 10^9/L: Vid pågående blödning, inför CVK-inläggning eller operation.",
      "TPK < 100 x 10^9/L: Vid intrakraniell blödning eller neurokirurgi."
    ],
    risks: ["Bakteriell kontamination", "Febril icke-hemolytisk reaktion", "Refraktäritet pga HLA-antikroppar"]
  }
];

// =========================================================================
// 10. APPARATUR: SERVO-U VENTILATOR (GETINGE)
// =========================================================================

const SERVO_U_DATA = {
  title: "Servo-U Mekanisk Ventilator (Getinge)",
  description: "Standardventilator på Intensivvårdsenheten Östra för invasiv och icke-invasiv ventilation.",
  modes: [
    {
      id: "prvc",
      name: "PRVC (Tryckreglerad Volymkontroll)",
      type: "Adaptiv Dubbelkontroll",
      isPrimary: true,
      description: "Standard basmod på IVA för intuberade patienter.",
      mechanism: "Levererar en förinställd tidalvolym med lägsta möjliga inspiratoriska tryck via automatiskt decelererande flöde.",
      keySettings: "Tidalvolym Vt (4–6 ml/kg PBW), PEEP, Andningsfrekvens, FiO2, Inspirationstid (I:E 1:2).",
      advantages: ["Garanterar tidalvolym samtidigt som topptryck minimeras automatiskt."],
      pitfalls: ["Kan ge för höga tryck om compliance plötsligt rasar; kontrollera larmgränser."]
    },
    {
      id: "pc",
      name: "PC (Tryckkontroll)",
      type: "Tryckstyrd Kontrollmod",
      isPrimary: true,
      description: "Förstahandsval vid grav lungsvikt (ARDS) eller kraftigt läckage.",
      mechanism: "Levererar ett konstant inspiratoriskt tryck (P-insp) under en förinställd inspirationstid.",
      keySettings: "P-insp över PEEP, PEEP, Andningsfrekvens, Inspirationstid (Ti), FiO2.",
      advantages: ["Strikt kontroll över topptryck och platåtryck; skyddar mot barotrauma."],
      pitfalls: ["Tidalvolymen varierar med lungcompliance och resistans; risk för hypo-/hyperventilation."]
    },
    {
      id: "ps",
      name: "PS / CPAP (Tryckunderstöd)",
      type: "Spontanandningsmod",
      isPrimary: true,
      description: "Förstahandsval vid urträning (weaning) och för vakna spontanandande patienter.",
      mechanism: "Patienten triggar varje andetag. Ventilatorn bistår med ett förinställt tryckunderstöd (PS över PEEP).",
      keySettings: "Tryckunderstöd (8–14 cmH2O), PEEP, Triggersensitivitet, Inspiratorisk avslutning (E-sens), Reservventilation.",
      advantages: ["Förhindrar diafragmadysfunktion (VIDD) och ger bättre komfort."],
      pitfalls: ["Risk för apné vid för djup sedering. Reservventilation MÅSTE vara korrekt inställd!"]
    },
    {
      id: "vc",
      name: "VC (Volymkontroll)",
      type: "Volymstyrd Kontrollmod",
      isPrimary: false,
      description: "Konstant flöde för mätning av ren luftvägsresistans och platåtryck.",
      mechanism: "Levererar förinställd tidalvolym med ett konstant (fyrkantsvåg) inspiratoriskt flöde.",
      keySettings: "Tidalvolym Vt, Flöde / Insp-tid, PEEP, Andningsfrekvens.",
      advantages: ["Möjliggör exakt separation mellan resistivt tryck och elastiskt platåtryck."],
      pitfalls: ["Ofta sämre patient-ventilator-synkroni jämfört med PRVC och PC."]
    },
    {
      id: "nava",
      name: "NAVA (Neurally Adjusted Ventilatory Assist)",
      type: "Neuronal Styrning",
      isPrimary: false,
      description: "Styr ventilatorn direkt via elektrisk aktivitet i diafragma (Edi).",
      mechanism: "Edi-kateter i esofagus mäter diafragmans aktionspotential och anpassar trycket i realtid.",
      keySettings: "NAVA-nivå, PEEP, Triggersensor, Reservventilation.",
      advantages: ["Överlägsen synkroni, förhindrar över- och underassistans."],
      pitfalls: ["Kräver korrekt placerad Edi-kateter och intakt andningsdrive."]
    }
  ],
  ventilationModes: [], // Alias för app.js
  diagnosticTools: [
    {
      name: "Inspiratorisk Paus (Platåtryck Pplat & Cstat)",
      type: "Diagnostiskt Manöver",
      shortcut: "Insp Pause knapp (2–3 s)",
      formula: "Cstat = Vt / (Pplat - PEEP)",
      procedure: "Håll 'Insp Pause' intryckt i 2–3 sekunder under slutinspiration.",
      normalValue: "Pplat < 30 cmH2O | Cstat > 50 ml/cmH2O (vid ARDS ofta 20–35)",
      clinicalMeaning: "Platåtrycket speglar det sanna alveolära trycket utan flödesresistans. Beräknar statisk compliance: Cstat = Vt / (Pplat - PEEP).",
      clinicalRelevance: "Platåtrycket speglar det sanna alveolära trycket utan flödesresistans. Beräknar statisk compliance: Cstat = Vt / (Pplat - PEEP)."
    },
    {
      name: "Expiratorisk Paus (Auto-PEEP & Total PEEP)",
      type: "Dynamisk Hyperinflation",
      shortcut: "Exp Pause knapp (3–5 s)",
      formula: "Auto-PEEP = Pexp_hold - PEEP_inställt",
      procedure: "Håll 'Exp Pause' intryckt i 3–5 sekunder under slutexpiration.",
      normalValue: "Auto-PEEP < 2 cmH2O (0 hos lungfriska)",
      clinicalMeaning: "Mäter 'intrinsic PEEP' och air-trapping vid obstruktiva tillstånd (KOL/Astma). Hög Auto-PEEP ger cirkulationskollaps och barotrauma.",
      clinicalRelevance: "Mäter 'intrinsic PEEP' och air-trapping vid obstruktiva tillstånd (KOL/Astma). Hög Auto-PEEP ger cirkulationskollaps och barotrauma."
    },
    {
      name: "Drivtryck (Driving Pressure ΔP)",
      type: "Lungskydsparameter",
      shortcut: "Auto-beräknas kontinuerligt",
      formula: "ΔP = Platåtryck (Pplat) - Total PEEP",
      procedure: "Beräknas automatiskt: ΔP = Platåtryck (Pplat) minus Total PEEP.",
      normalValue: "Målvärde ΔP < 14 cmH2O vid lungprotektiv ventilation",
      clinicalMeaning: "Starkaste oberoende prediktorn för mortalitet vid ARDS (Amato et al., NEJM). Högt drivtryck kräver sänkt tidalvolym eller PEEP-optimering.",
      clinicalRelevance: "Starkaste oberoende prediktorn för mortalitet vid ARDS (Amato et al., NEJM). Högt drivtryck kräver sänkt tidalvolym eller PEEP-optimering."
    },
    {
      name: "O2-Boost (Preoxygenering)",
      type: "Säkerhetsfunktion",
      shortcut: "Snabbknapp 'O2-Boost'",
      formula: "100% FiO2 i 120 sekunder med automatisk återgång",
      procedure: "Tryck på O2-Boost knappen på skärmen (levererar 100% O2 i 2 minuter).",
      normalValue: "100% FiO2 i 120 sekunder med automatisk återgång",
      clinicalMeaning: "Används inför endotrakeal sugning, bronkoskopi, lägesändring eller vändning till bukläge.",
      clinicalRelevance: "Används inför endotrakeal sugning, bronkoskopi, lägesändring eller vändning till bukläge."
    }
  ],
  alarmsTroubleshooting: [
    {
      alarm: "Högt luftvägstryck (High Paw)",
      priority: "Hög (Rött larm)",
      immediateCheck: "Auskultera omedelbart, sug rent i tuben och uteslut tryckpneumothorax!",
      causes: [
        "Sekret/slempropp i tub eller luftvägar",
        "Patienten biter på tuben eller hostar/kämpar mot ventilatorn",
        "Kinkad andningsslang eller vattenfylld slang",
        "Pneumothorax (ventilpneumothorax!)",
        "Bronkospasm eller akut försämrad lungcompliance"
      ],
      actions: [
        "Sug rent i tuben med slutet sugsystem",
        "Sätt bitblock vid behov",
        "Auskultera lungor bilateralt för att utesluta ensidig ventilation eller pneumothorax",
        "Koppla från och handventilera vid cirkulationspåverkan!"
      ]
    },
    {
      alarm: "Låg minutvolym / Läckage (Low MVe)",
      priority: "Hög (Rött larm)",
      immediateCheck: "Kontrollera tubläge vid tandrad, kufftryck och alla slangkopplingar!",
      causes: [
        "Kuffläckage eller cuff-ruptur",
        "Oavsiktlig diskonnektion av andningsslang eller fuktaranslutning",
        "Tuben har dislocerats ur trakea (extubation)",
        "Patienten har slutat spontanandas i understödsmod (PS)"
      ],
      actions: [
        "Kontrollera kufftryck med kuffmanometer (mål 25–30 cmH2O)",
        "Inspektera alla slangkopplingar och befuktningskammare",
        "Kontrollera tubläge vid tandrad och bekräfta bilateral ventilation"
      ]
    },
    {
      alarm: "Apnélarm (Apnea time exceeded)",
      priority: "Hög (Rött larm)",
      immediateCheck: "Kontrollera spontanandning, sederingsdjup och reservventilation!",
      causes: [
        "Patienten andas inte spontant i tryckunderstöd (PS/CPAP)",
        "För djup sedering eller muskelrelaxantia kvar i kroppen",
        "För okänslig triggersättning"
      ],
      actions: [
        "Ventilatorn växlar automatiskt till reservventilation (PRVC/PC)",
        "Minska sedering om patienten är redo för urträning",
        "Växla till kontrollerad mod (PRVC) om patienten inte orkar andas själv"
      ]
    }
  ]
};

// Se till att ventilationModes pekar på modes
SERVO_U_DATA.ventilationModes = SERVO_U_DATA.modes;
const IVA_EQUIPMENT_DATA = SERVO_U_DATA;

// Exportera globalt till window
if (typeof window !== "undefined") {
  window.IVA_DISEASE_STATES = IVA_DISEASE_STATES;
  window.SHIFT_CHECKLIST_TEMPLATE = SHIFT_CHECKLIST_TEMPLATE;
  window.CPOT_SCALE = CPOT_SCALE;
  window.RASS_SCALE = RASS_SCALE;
  window.IVA_CALORIE_TABLE = IVA_CALORIE_TABLE;
  window.IVA_DRIP_FACTORS = IVA_DRIP_FACTORS;
  window.RADIOMETER_BG_FIELDS = RADIOMETER_BG_FIELDS;
  window.VENTILATOR_DEFAULT_INPUTS = VENTILATOR_DEFAULT_INPUTS;
  window.IVA_FLUIDS_DATA = IVA_FLUIDS_DATA;
  window.NUTRITION_FORMULAS = NUTRITION_FORMULAS;
  window.IVA_BLOOD_PRODUCTS_DATA = IVA_BLOOD_PRODUCTS_DATA;
  window.ROSE_PHASES = ROSE_PHASES;
  window.SERVO_U_DATA = SERVO_U_DATA;
  window.IVA_EQUIPMENT_DATA = IVA_EQUIPMENT_DATA;
}
