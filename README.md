# Intensivvårdsenheten Östra 🏥

En modern, heltäckande och kliniskt anpassad webbapplikation för Intensivvårdsenheten Östra (IVA Östra). Appen samlar sjukhusets alla styrande vård-PM, rutiner och checklistor tillsammans med avancerade kliniska beslutsstöd och kalkylatorer för intensivvårdsteamet.

Applikationen är byggd som en fristående Progressive Web App (PWA) som fungerar offline, i alla webbläsare, på sjukhusets datorer och som mobilapp för Android.

---

## 🚀 Snabbstart

1. **Öppna direkt på datorn:**
   - Dubbelklicka på `Starta-IVA-Dokumenthub.bat` eller
   - Öppna `index.html` direkt i Google Chrome, Microsoft Edge eller valfri modern webbläsare.
2. **Ingen installation krävs:** Appen körs helt lokalt, blixtsnabbt och kräver ingen extern databasserver.

---

## 🌟 Huvudmoduler & Kliniska Verktyg

### 1. 🩺 Sjukdomstillstånd på IVA
En omfattande klinisk kunskapsbas och handläggningsstöd för svårt sjuka patienter:
- **Cirkulationssvikt (Chock):**
  - Septisk chock (kärldilatation, hypoperfusion, vätska, noradrenalin, vasopressin, hydrokortison).
  - Kardiogen chock (pumpinsufficiens, inotropi med dobutamin/milrinon, mekaniskt stöd).
  - Obstruktiv chock (LE, tamponad, tryckpneumotorax – akut avlastning).
  - Hypovolem chock (blödning/dehydrering, MTP massiv transfusionsprotokoll).
- **Respirationssvikt:**
  - Typ 1 hypoxisk svikt vs Typ 2 hyperkapnisk ventilationssvikt.
  - ARDS handläggning: Låg tidalvolym ($6\text{ ml/kg}$ PBW), PEEP-tabell, bukläge ($\ge 16\text{ h}$), neuromuskulär blockad.
  - Svår astma och KOL-exacerbation: Bronkodilatation, NIV, ventilatorinställningar vid hyperinflation.
- **Njursvikt (AKI & CRRT):**
  - KDIGO stadium 1–3 (kreatininstegring och urinproduktion).
  - Indikationer för kontinuerlig dialys enligt **AEIOU** (Acidos, Elektrolytrubbning/Hyperkalemi, Intoxikation, Övervätskning, Uremi).
  - CRRT-strategier: CVVHDF, citratantikoagulation och filterövervakning.
- **Leversvikt:**
  - Akut leversvikt (ALF): King's College-kriterier för levertransplantation.
  - Akut-på-kronisk leversvikt (ACLF) och hepatisk encefalopati stadium 1–4.
  - Ammoniak, risk för intrakraniellt hjärnödem, laktulos, rifaximin och neurointensivvård.
  - Hepatorenalt syndrom (HRS): Terlipressin och albumin 20%.
- **Sepsis & Septisk Chock:**
  - Sepsis-3 konsensuskriterier och SOFA/qSOFA-bedömning.
  - 1-timmarsbunt: Blododlingar, bredspektrumantibiotika, kristalloider, laktatuppföljning och MAP $\ge 65\text{ mmHg}$.
- **Neurokritiska tillstånd:**
  - Intrakraniellt tryck (ICP $< 20\text{ mmHg}$) och cerebralt perfusionstryck (CPP $60\text{–}70\text{ mmHg}$).
  - Stegvis intrakraniell trycksänkning (sedering, hyperton NaCl, extern ventrikeldränage, mild hyperventilation).
  - Status epilepticus: Akut brytning med bensodiazepiner och andrahandsval (levetiracetam, valproat, fosfenytoin).
- **Bukkompartmentsyndrom (ACS & IAH):**
  - Intraabdominellt tryck via urinblåsekateter ($> 12\text{ mmHg}$ för IAH, $> 20\text{ mmHg}$ med organsvikt för ACS).
  - Medicinsk avlastning och kirurgisk dekompression (öppen buk / laparostomi).

---

### 2. 🧪 Syra-Bas Balans & Interaktiv Blodgaskalkylator
Komplett kalkylator och tolkningsverktyg för arteriella blodgaser (ABG):
- **Inmatning:** pH, $\text{pCO}_2$ (kPa), $\text{PaO}_2$ (kPa), $\text{HCO}_3^-$ (mmol/L), BE (mmol/L), $\text{Na}^+$, $\text{Cl}^-$, Albumin (g/L), Laktat (mmol/L), $\text{FiO}_2$ (%).
- **Automatisk beräkning & tolkning:**
  - Status: Normal, acidemi ($< 7.35$) eller alkalemi ($> 7.45$).
  - Primär rubbning: Respiratorisk eller metabolisk komponent.
  - Kompensationsbedömning: Okompenserad, partiellt kompenserad, fullständigt kompenserad eller kombinerad blandrubbning.
  - **Anjongap (AG):** $\text{Na}^+ - (\text{Cl}^- + \text{HCO}_3^-)$, normalt $8\text{–}12\text{ mmol/L}$.
  - **Albuminkorrigerat Anjongap ($\text{AG}_{\text{korr}}$):** $\text{AG} + 0.25 \times (40 - \text{Albumin})$.
  - **Delta Ratio ($\Delta\text{AG}/\Delta\text{HCO}_3$):** Identifierar om en HAGMA kombineras med samtidig NAGMA eller metabolisk alkalos.
  - **Horovitz-kvot ($\text{PaO}_2/\text{FiO}_2$):** Automatisk omräkning till mmHg och gradering av eventuell ARDS (Mild $200\text{–}300$, Måttlig $100\text{–}200$, Svår $< 100\text{ mmHg}$).
  - **Laktatstatus:** Normalt, lätt förhöjt eller signifikant hypoperfusion ($> 4.0\text{ mmol/L}$).
- **6 Färdiga Typfalls-presets:**
  - Septisk chock (Laktatacidos)
  - Diabetesketoacidos (DKA)
  - Svår KOL-exacerbation (Kronisk kompenserad respirationsacidos)
  - Salicylatintoxikation (Kombinerad respirationsalkalos + HAGMA)
  - Svåra kräkningar / Ventrikelretention (Hypokloremisk metabol alkalos)
  - Normal referensgas

---

### 3. 💧 Vätskebalans, Vätsketerapi & Kalkylator
Evidensbaserad översikt över vätsketerapi på IVA:
- **Genomgång av vätsketyper:**
  - **Ringer-Acetat & Plasmalyte:** Balanserade kristalloider, förstahandsval vid resuscitation.
  - **NaCl 0.9%:** Används vid hypokloremi/kräkningar eller hjärnödem; varning för hyperkloremisk acidos och njurvasokonstriktion.
  - **Glukos 5%:** Fritt vatten, använd vid dehydrering/hypernatremi; ej som volymexpander.
  - **Albumin 20%:** Onkotiskt dragande kolloid, volymbesparande vid hypoalbuminemi, levercirros och avvätskning.
  - **Albumin 5%:** Iso-onkotisk volymersättning vid refraktär chock och plasmaferes.
  - **Hyperton NaCl 3%:** Akut ICP-sänkning vid hernieringsrisk och symtomatisk hyponatremi.
  - **Syntetiska kolloider (HES, gelatin):** Varning! Ökad risk för akut njursvikt och mortalitet.
- **ROSE-konceptet för vätskestyrning:**
  - **R**esuscitation (dygn 1, rädda liv med snabb volym).
  - **O**ptimization (titrering efter hemodynamiska mål).
  - **S**tabilization (nollbalans, undvik övervätskning).
  - **E**vacuation (aktiv avvätskning med diuretika/CRRT).
- **Test av vätskekänslighet:** Passive Leg Raising (PLR) och slagvolymsvariation (SVV/PPV).
- **Kalkylator för kumulativ övervätskning (% Fluid Overload):**
  - Formel: $\frac{\text{Kumulativ vätskebalans (L)}}{\text{Intagningsvikt (kg)}} \times 100$.
  - Tydlig riskgradering: $< 5\%$ Låg risk, $5\text{–}10\%$ Måttlig övervätskning, $> 10\%$ Kritisk övervätskning associerad med ökad IVA-mortalitet och organsvikt.

---

### 4. 🍎 ESPEN Nutritionskalkylator för IVA
Anpassad efter ESPEN guidelines för kritisk sjukdom:
- **Fasbaserat energimål:**
  - Tidig akutfas (dygn 1–2): $20\text{ kcal/kg/dygn}$ (undvik övernutrition och refeeding).
  - Stabiliseringsfas (dygn 3+): $25\text{–}30\text{ kcal/kg/dygn}$.
- **Proteinmål:** $1.2\text{–}2.0\text{ g/kg/dygn}$ för att minimera muskelkatabolism och främja sårläkning.
- **Icke-nutritionella kalorier:**
  - Automatisk avräkning för Propofol 10 mg/ml ($1.1\text{ kcal/ml}$ lipidbärare).
  - Avdrag för intravenös glukos och citratdialys.
- **Sondmatsberäkning:**
  - Välj sondmatsproduktens energitäthet ($1.0, 1.2, 1.5, 2.0\text{ kcal/ml}$).
  - Visar exakt rekommenderad infusionshastighet i **ml/h** för enteral nutritionspump.

---

### 5. 💊 IVA-Kategori: Läkemedel, Doskalkylator & CVK Blandbarhet (85 preparat)
- **Ny IVA-Kategori – Läkemedel:** Komplett kliniskt FASS- & IVA/PostOp-register med samtliga **85 läkemedel** i en kompakt, snabbsökt tabellvy med fritextsökning, kategorifilter och favoritmarkering (⭐).
- **Detaljerat Farmakologifönster:** Klicka på valfritt läkemedel i listan för att öppna en fullständig vy med *Vad det gör (Effekt & Verkningsmekanism)*, *Indikationer på IVA/PostOp*, *Vanliga & Kritiska Biverkningar*, *Farmakokinetik (Halveringstid $T_{1/2}$, Tillslag, Duration)*, *Dosering (Infusion & Bolus)* samt *Spädning & Administrering*.
- **Interaktiv Doskalkylator (Dos & CVK):** Dubbelriktad beräkning mellan ordinerad dos (t.ex. $\mu\text{g/kg/min}$, $\text{mg/h}$) och infusionshastighet ($\text{ml/h}$) samt visning av bolus-/intermittent dosering för alla 85 preparat.
- **CVK Blandbarhet (Y-koppling):** Direkt kompatibilitetskontroll mellan två läkemedel grupperade per kategori med färgkodad status (Grön = Blandbar, Röd = Ej blandbar, Gul = Försiktighet), kemisk/pH-baserad motivering och interaktiv blandbarhetsmatris.
- **3-lumen CVK-översikt:** Rekommenderade placeringar i distal, medial och proximal skänk.

---

### 6. ⭐ Google-inloggning, Admin & "Min Sida"
- **Inloggning med Google-konto:** Klicka på logga in för att spara personliga favoriter.
- **Admin-behörighet:** `filipcarlberg91@gmail.com` är förkonfigurerad som administratör (standardlösenord: `Sahlgrenska2026!`) med exklusiv behörighet att ladda upp, redigera och ta bort rutiner.
- **Inbjudningsfunktion:** Administratören kan bjuda in kollegor som antingen redaktörer eller läsare direkt via appen.
- **Min Sida Dashboard:** Samlar dina favoritmarkerade rutiner och kalkylatorer med ett eget dedikerat sökfält och kategorifilter.
- **Notissystem:** Aviseringar visas omedelbart när ett nytt dokument laddas upp eller uppdateras.

---

### 7. 🤖 Gemini IVA-Assistent (Klinisk AI & Kunskapsbas)
En inbyggd, intelligent medicinsk AI-assistent med fullständig tillgång till all data och kunskap på hela Intensivvårdsenheten Östras webbplats:
- **Full kännedom om avdelningens rutiner:** Har direkt access till alla uppladdade vård-PM, spädningsregister, CVK-blandbarhetstabeller, sjukdomsprotokoll, syra-bas formler, vätsketerapiriktlinjer och ESPEN-nutritionsdata.
- **Dubbel AI-motor (Online & Offline):**
  - **Online Google Gemini API:** Stödjer `gemini-1.5-flash` och `gemini-2.0-flash` för avancerade generativa resonemang, djupa medicinska differentialdiagnoser och fri klinisk dialog.
  - **Inbyggd offline IVA-kunskapsmotor:** Även utan internet eller innan en API-nyckel angetts svarar assistenten blixtsnabbt med exakta spädningsrecept, doser, kompatibiliteter och behandlingssteg direkt från sjukhusets lokala protokoll.
- **Interaktiv Chat-panel:**
  - Öppnas enkelt via **"Fråga Gemini"** i sidhuvudet, i FAB-menyn eller med kortkommandot `Ctrl + J`.
  - Snabbfråge-chips för vanliga akuta situationer (Noradrenalin-spädning, Propofol-kalorier, ARDS bukläge, CRRT AEIOU, blodgastolkning, m.m.).
  - Svar formaterade med klinisk Markdown, tydliga varningar och klickbara snabblänkar som tar dig direkt till berörd kalkylator eller PM i appen.
  - Inställningsmodal (⚙️) där användaren kan mata in sin personliga Gemini API-nyckel från Google AI Studio och testa anslutningen.

---

### 8. 📐 Ny Kompakt & Välorganiserad Navigering (Ingen mer horisontell scroll)
Tidigare låg alla knappar i en lång utsträckt rad som tvingade användaren att scrolla horisontellt. Menyn har nu designats om från grunden till en kompakt och ergonomisk tvådelad struktur:
- **Övre huvudrad (Identitet & Globala verktyg):**
  - Logotyp & titel (*Intensivvårdsenheten Östra*) till vänster.
  - Kompakt global sökning (`Ctrl + K`).
  - Framträdande **✨ Fråga Gemini**-knapp med AI-effekt.
  - Notisklocka med oläst-räknare.
  - Google-profil och inloggning.
  - Kompakta knappar för *Nytt PM* (endast redaktörer), behörighetsroller och säkerhetskopia.
- **Undre klinisk subnav-list (Kompakta Pills):**
  - En ren, färgkodad rad med klickbara flikar:
    - 🩺 **Sjukdomar** (*Chock & ARDS*)
    - 🧪 **Syra-Bas** (*Blodgaskalkylator*)
    - 💧 **Vätskor** (*ROSE & % FO*)
    - 🍎 **Nutrition** (*ESPEN & Propofol*)
    - 💊 **Dos & CVK** (*Spädning & Y-gren*)
    - 📑 **Rutiner & PM** (*7 sektioner*)
    - ⭐ **Min Sida** (*Favoriter med räknare*)
  - Anpassad med mjuk, touch-vänlig scrollning enbart inom navlisten på små skärmar — hela webbplatsen har nu noll horisontell scrollning!
- **Flytande FAB-meny:** Ger snabb åtkomst till alla sektioner och Gemini AI i mobilvy.

---

## 🌐 Publicera Live & Installera på Android

### 1. Hur du publicerar hemsidan Live via GitHub Pages
1. Repositoryt på ditt GitHub-konto heter: `intensivvardsenhetenostra`.
2. Gå till **Settings** $\rightarrow$ **Pages** i ditt GitHub-repository.
3. Under *Branch*, välj `main` och mappen `/(root)`.
4. Sidan är live på en säker HTTPS-adress:  
   `https://filipcarlberg91.github.io/intensivvardsenhetenostra/`

### 2. Hur du installerar appen på en Android-enhet (PWA)
1. Öppna din live-adress `https://filipcarlberg91.github.io/intensivvardsenhetenostra/` i **Google Chrome** på Android-telefonen eller surfplattan.
2. Tryck på menyknappen i Chrome (tre vertikala punkter ⋮ uppe till höger).
3. Välj **"Installera app"** (eller **"Lägg till på startskärmen"**).
4. Bekräfta installationen.
5. Appen installeras nu på enheten med namnet **IVA Östra** och avdelningens ikon. Den öppnas i fullskärm som en vanlig Android-app och fungerar offline!
