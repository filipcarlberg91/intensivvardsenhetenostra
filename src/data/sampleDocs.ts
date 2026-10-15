import { CategoryItem, DocumentItem } from '../types';

export const CATEGORIES: CategoryItem[] = [
  { id: "Läkemedel", name: "Läkemedel", subtitle: "IVA & PostOp Register, Effekt, Biverkningar, T½", color: "#2563eb", colorLight: "#eff6ff", colorBorder: "#bfdbfe", icon: "syringe", description: "Komplett läkemedelsregister för IVA & PostOp – sökfunktion, favoriter, vad läkemedlet gör, biverkningar, halveringstid, spädning och dosering." },
  { id: "Respiration", name: "Respiration", subtitle: "Ventilator, PEEP, Befuktning, ARDS", color: "#0284c7", colorLight: "#e0f2fe", colorBorder: "#bae6fd", icon: "lungs", description: "Riktlinjer och rutiner för invasiv och icke-invasiv ventilation, befuktning, trakeostomi och ARDS-vård." },
  { id: "Circulation", name: "Circulation", subtitle: "Chock, Inotropa, MAP, Arytmier", color: "#e11d48", colorLight: "#ffe4e6", colorBorder: "#fecdd3", icon: "heartPulse", description: "Hemodynamisk monitorering, chockbehandling, inotropi, vasoaktiva infusioner och arytmihantering." },
  { id: "Nutrition", name: "Nutrition", subtitle: "ESPEN, Enteral, TPN, Kalorier", color: "#d97706", colorLight: "#fef3c7", colorBorder: "#fde68a", icon: "apple", description: "ESPEN-riktlinjer, sondmatning, parenteral nutrition (TPN), ventrikelretention och energimål." },
  { id: "CRRT", name: "CRRT", subtitle: "Dialys, Citrat, Filter, Vätskedrag", color: "#7c3aed", colorLight: "#f3e8ff", colorBorder: "#e9d5ff", icon: "filter", description: "Kontinuerlig njurersättningsterapi, regional citratantikoagulation, filterbyte och vätskebalansering." },
  { id: "Elimination", name: "Elimination", subtitle: "KAD, Diures, Buktryck, Dränage", color: "#059669", colorLight: "#d1fae5", colorBorder: "#a7f3d0", icon: "droplet", description: "Urinmätning, KAD-skötsel, intraabdominellt tryck (IAP), ventrikelsond och bukskötsel." },
  { id: "Omvårdnad", name: "Omvårdnad", subtitle: "Mobilisering, Hud, Munvård, CVK", color: "#0d9488", colorLight: "#ccfbf1", colorBorder: "#99f6e4", icon: "handHeart", description: "Omvårdnadsåtgärder, trycksårsprofylax, munvård på intuberad patient, infarter och sårbehandling." },
  { id: "Anhöriga", name: "Anhöriga", subtitle: "Närstående, Samtal, Krisstöd", color: "#4f46e5", colorLight: "#e0e7ff", colorBorder: "#c7d2fe", icon: "users", description: "Bemötande och stöd till närstående, krisstöd, barn som anhöriga samt samtal vid vård i livets slutskede." },
  { id: "Sedering", name: "Sedering", subtitle: "RASS, CPOT, Delirium, Urträning", color: "#d946ef", colorLight: "#fae8ff", colorBorder: "#f5d0fe", icon: "sedering", description: "Sederingsprotokoll, analgosedering, deliriumscreening med CAM-ICU, urträningsrutiner och abstinensbehandling." },
  { id: "Buk", name: "Buk", subtitle: "IAP-mätning, Ileus, Pankreatit, Compartment", color: "#ea580c", colorLight: "#ffedd5", colorBorder: "#fed7aa", icon: "buk", description: "Intraabdominellt tryck (IAP), abdominellt compartmentsyndrom (ACS), öppen buk, pankreatit och ileus." },
  { id: "Infektion", name: "Infektion", subtitle: "Sepsis-3, Antibiotikaval, Odlingar, VAP", color: "#dc2626", colorLight: "#fee2e2", colorBorder: "#fca5a5", icon: "infektion", description: "Sepsis och septisk chock, empirisk antibiotikabehandling, odlingsrutiner, VAP-profylax och isoleringsföreskrifter." },
  { id: "Gynekologi", name: "Gynekologi", subtitle: "Preeklampsi, HELLP, PPH, Gravid på IVA", color: "#db2777", colorLight: "#fce7f3", colorBorder: "#fbcfe8", icon: "gynekologi", description: "Obstetrisk intensivvård, svår preeklampsi, eklampsi, HELLP-syndrom, atoni och massiv postpartumblödning." },
  { id: "Avslut", name: "Avslut", subtitle: "Palliation, Brytpunkt, Vård i livets slutskede", color: "#475569", colorLight: "#f1f5f9", colorBorder: "#cbd5e1", icon: "avslut", description: "Brytpunktssamtal, avbrytande av livsuppehållande behandling, palliativ symtomlindring och stöd till närstående." },
  { id: "Donation", name: "Donation", subtitle: "DCD, DBD, Donationsprocess, Organsamtycke", color: "#059669", colorLight: "#ecfdf5", colorBorder: "#a7f3d0", icon: "donation", description: "Organdonationsprocessen på IVA, DBD (hjärndöd), DCD (cirkulationsdöd), samtyckesutredning och organbevarande behandling." }
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-resp-servo-u",
    title: "Servo-U Ventilator (Getinge) – Praktisk Guide & Klinisk Rutin",
    category: "Respiration",
    dateAdded: "2026-10-15T10:15:00Z",
    priority: "Riktlinje",
    isPinned: true,
    tags: ["Servo-U", "Ventilator", "Respiration", "PRVC", "PC", "PS/CPAP", "NAVA", "Automode", "NIV", "P0.1", "Platåtryck", "Drivtryck", "Larm", "IVA"],
    description: "Praktisk klinisk guide och handhavanderutin för Getinge Servo-U intensivvårdsventilator. Omfattar systemöversikt, förkontroll & patientkretstest, inställning av PBW/tidalvolym, ventilationsmoder (PRVC, PC, VC, PS/CPAP, Automode, SIMV, Bi-Vent/APRV, NAVA, NIV, High Flow), trigger- och cykelinställningar, lungmekaniska manövrar (Pplat, ΔP, Auto-PEEP, P0.1, Open Lung Tool), sugstöd, nebulisering, larmfelsökning och hygienrutiner.",
    content: `# Servo-U Ventilator (Getinge) – Praktisk Guide & Klinisk Rutin

> **Avdelningsriktlinje – Intensivvårdsenheten Östra**  
> **Kategori:** Respiration | **Målgrupp:** Intensivvårdssjuksköterskor, IVA-läkare och undersköterskor  
> **Utrustning:** Servo-U® Mechanical Ventilator (Getinge / Maquet Critical Care)

---

## 1. Systemöversikt, Kopplingar & Förberedelse

Servo-U är en avancerad intensivvårdsventilator för invasiv och icke-invasiv ventilation (inklusive NAVA och Högflödesterapi) hos vuxna och pediatriska patienter. Systemet består av **Användargränssnittet (pekskärmen)** och **Patientenheten (gas- och pneumatikmodulen)**.

### 1.1 Huvudkomponenter på Patientenheten & Skärmen

| Komponent | Placering / Beteckning | Funktion & Klinisk Kontroll |
|:---|:---|:---|
| **Användargränssnitt (UI)** | Vridbar pekskärm med larmram | Visar kurvor, loopar, numeriska värden, larm och snabbknappar. Kan låsas mot oavsiktlig beröring. |
| **Direktvalsvred (Main Rotary Knob)** | Nedre högra hörnet på skärmen | Används för finjustering och bekräftelse av valda ventilationsparametrar. |
| **Inspirationsdel (Inspirationsutlopp)** | Patientenhetens högra sida | Ansluts via bakterie-/virusfilter till inspirationsslangen (och ev. aktiv befuktare F&P 950). |
| **Expirationsintag & Expirationskassett** | Patientenhetens vänstra sida | Utbytbar kassett med integrerad **ultraljudsflödesmätare** och expirationsventil. Skyddas alltid med expirationsfilter/vattenfälla. |
| **Gasanslutningar (Luft & O₂)** | Patientenhetens baksida | Ansluts till centralgassystemet (**Air** och **O₂**, drifttryck **2,0–6,0 bar / 200–600 kPa**). |
| **Nätström & Reservbatterier** | Patientenhetens baksida/undersida | Minst **2 laddade batterier** (1 internt + 1 utbytbart i fack). Ger ca **60–120 min** drift vid strömavbrott/transport. |
| **Modulfack (Edi, CO₂, Y-sensor)** | Patientenhetens sida | Anslutning av **Edi-modul** (för NAVA-ventilation) samt **kapnograf (CO₂-sensor)**. |
| **Aerogen® Nebulisatoruttag** | Framsidan av patientenheten | Integrerad strömförsörjning och tidsstyrning för Aerogen Solo mikropumpnebulisator. |

> [!CAUTION]
> **Befuktning – Aktiv vs. Passiv (HME):**  
> Använd **ALDRIG** HME-filter (värme-fuktväxlare vid Y-stycket) samtidigt som aktiv befuktare (F&P 950) eller nebulisator! Kombinationen mättar HME-filtret med vätska och orsakar akut, livshotande totalstopp (ocklusion) i andningskretsen.

---

## 2. Förkontroll (Pre-use Check) & Patientkretstest

Innan ventilatorn kopplas till en patient måste alltid funktion och slangkretstäthet verifieras.

### 2.1 Förkontroll (Pre-use Check)
Utförs i **Standby-läge** inför varje ny patient samt efter byte av expirationskassett (tar ca 3–4 minuter):
1. Säkerställ att både **nätström** samt **Luft och O₂** är anslutna.
2. Koppla den korta **blå/transparanta testslangen** mellan inspirationsutloppet och expirationsintaget.
3. Tryck på **FÖRKONTROLL (Pre-use check)** på Standby-skärmen och följ instruktionerna på skärmen.
4. Ventilatorn testar automatiskt:
   - Intern teknik, barometertryck och säkerhetsventil
   - Gasförsörjning (Luft och O₂) samt O₂-sensor/cell
   - Inre läckage, tryckgivare och expirationskassettens ultraljudsflödesmätare
   - Batteristatus (växlar kort till batteridrift under testet) och akustiska/visuella larm
5. Efter godkänd förkontroll kopplas patientens faktiska andningsslangset på, varefter ventilatorn automatiskt övergår till **Patientkretstest**.

### 2.2 Patientkretstest (Patient Circuit Test)
Kan även köras separat i Standby (t.ex. vid byte av slangset eller befuktare under pågående vårdtillfälle):
1. Anslut det kompletta slangsetet (inkl. aktiv befuktare med vattenfylld kammare, filter, svivel/kateterfäste).
2. Blockera (plugga) patientänden vid Y-stycket när skärmen ber om det, och öppna Y-stycket när skärmen anger det.
3. **Varför detta är kritiskt:** Testet mäter läckage, inspiratorisk/expiratorisk resistans samt **slangarnas komplians (Circuit Compliance, mL/cmH₂O)**. När slangkompensation är aktiverad kompenserar Servo-U automatiskt varje andetag för den volym som fjädrar bort i slangarna, så att den inställda tidalvolymen speglar vad patienten faktiskt får i lungorna.

---

## 3. Uppstart i Standby & Inställning av PBW (Predicted Body Weight)

Följ alltid dessa 5 steg i **Standby** innan du trycker på *Starta ventilation*:

| Steg | Skärmval | Klinisk Rutin på IVA Östra |
|:---:|:---|:---|
| **1** | **Patientkategori** | Välj **Vuxen (Adult)** (vikt 10–250 kg, $V_T$ 100–4000 mL) eller **Barn (Pediatric)** (vikt 0,5–30 kg, $V_T$ 10–350 mL). |
| **2** | **Kön & Längd (PBW)** | Tryck på **Patientdata** och mata in **Kön** och **Kroppslängd (cm)**. Servo-U räknar automatiskt ut **PBW (Predicted Body Weight / Idealvikt)** enligt Devine-formeln och visar tidalvolymen i **mL/kg PBW** direkt på inställningsknappen! |
| **3** | **Ventilationsform** | Välj **Invasiv** (intuberad / trakeostomerad) eller **Icke-invasiv (NIV / High Flow)**. |
| **4** | **Ventilationsmod & Värden** | Tryck på **MODER (Modes)**, välj mod (t.ex. *PRVC*, *PC* eller *PS/CPAP*), ställ in grundparametrar och **Reservventilation (Backup)** samt kontrollera **Larmgränser**. |
| **5** | **Starta ventilation** | Anslut Y-stycket till patienten, tryck på **Starta ventilation** och verifiera thoraxhöjning, kurvor, etCO₂ och auskultationsfynd. |

> [!IMPORTANT]
> **Lungprotektiv ventilation baseras på PBW (Längd & Kön – ALDRIG faktisk kroppsvikt!):**  
> Lungornas volym bestäms av bröstkorgens storlek (kroppslängd och biologiskt kön), inte av fettmassa eller ödem.  
> - **Mål för Tidalvolym ($V_T$):** **6 mL/kg PBW** (intervall **4–8 mL/kg PBW**, vid svår ARDS 4–6 mL/kg PBW).  
> - **Mål för Platåtryck ($P_{\text{plat}}$):** **< 30 cmH₂O**.  
> - **Mål för Drivtryck ($\Delta P = P_{\text{plat}} - \text{PEEP}_{\text{tot}}$):** **< 14–15 cmH₂O**.

---

## 4. Ventilationsmoder på Servo-U – Funktion & Inställning

### 4.1 Kontrollerade & Adaptiva Moder

| Mod | Typ & Funktionsprincip | Grundinställningar (Standard Vuxen) | Kliniska Fördelar & Fallgropar |
|:---|:---|:---|:---|
| **PRVC**<br>*(Tryckreglerad Volymkontroll)* | **Adaptiv dubbelkontroll (Förstahandsmod på IVA):**<br>Levererar en garanterad målvolym ($V_T$) med ett **decelererande flöde** och lägsta möjliga konstanta inspiratoriska tryck. Första andetaget är ett testandetag; därefter justeras trycket automatiskt med max ±3 cmH₂O/andetag efter lungans compliance. | • **$V_T$:** 6 mL/kg PBW (4–8 mL/kg)<br>• **PEEP:** 5–10 cmH₂O (enl. PEEP/FiO₂)<br>• **AF (RR):** 12–20 /min<br>• **I:E / $T_i$:** 1:2 (eller $T_i$ 0,9–1,2 s)<br>• **$\text{FiO}_2$:** För $\text{SpO}_2$ 92–96% | **Fördel:** Garanterar minutvolym samtidigt som topptryck hålls så lågt som möjligt.<br>**Fallgrop:** Trycket begränsas vid **5 cmH₂O under Övre trycklarmgräns** (*Varning: Begränsat tryck!*). Vid kraftig lufthunger/spontanandning kan PRVC ge för lågt tryckstöd om patienten drar stora volymer. |
| **PC**<br>*(Tryckkontroll / Pressure Control)* | **Tryckstyrd mod:**<br>Levererar en fast inställd trycknivå (**PC över PEEP**, cmH₂O) under inställd inspirationstid ($T_i$). Flödet är decelererande. Patienten kan trigga extra PC-andetag. | • **PC över PEEP:** 10–18 cmH₂O (titrera så att $V_T \approx 6\text{ mL/kg PBW}$)<br>• **PEEP:** 5–15 cmH₂O<br>• **AF (RR):** 12–20 /min<br>• **I:E:** 1:2 (vid obstruktivitet 1:3–1:4) | **Fördel:** Strikt kontroll över maximalt alveolärt tryck ($P_{\text{peak}} \approx P_{\text{plat}}$ om flödet når 0). Utmärkt vid svår ARDS eller läckage.<br>**Fallgrop:** **Ingen volymgaranti!** Vid slempropp, bronkospasm eller buktrycksstegring sjunker $V_T$ och minutvolymen direkt – sätt snäva larmgränser för **MVe**! |
| **VC**<br>*(Volymkontroll / Volume Control)* | **Volymstyrd mod:**<br>Levererar en fast tidalvolym ($V_T$) med ett förinställt flödesmönster (konstant fyrkantsvåg eller decelererande flöde) och ev. inspiratorisk paus ($T_{\text{pause}}$ %). | • **$V_T$:** 6 mL/kg PBW<br>• **PEEP:** 5–10 cmH₂O<br>• **AF:** 12–20 /min<br>• **$T_{\text{pause}}$:** 10 % (för kontinuerlig $P_{\text{plat}}$-mätning)<br>• **Flödesadaptation:** På/Av | **Fördel:** Möjliggör exakt separation av resistivt tryck ($P_{\text{peak}} - P_{\text{plat}}$) och elastiskt platåtryck ($P_{\text{plat}}$).<br>**Fallgrop:** Konstant flöde ger högre topptryck och kan ge flödesasymmetri ("flow starvation") hos vaknande patienter om flödesadaptation ej är aktiv. |

### 4.2 Understödda, Interaktiva & Spontana Moder

| Mod | Typ & Funktionsprincip | Viktigaste Inställningar | Kliniska Riktlinjer vid Sängkant |
|:---|:---|:---|:---|
| **PS / CPAP**<br>*(Tryckunderstöd / Pressure Support)* | **Spontanandningsmod (Urträning / Vakna patienter):**<br>Patienten triggar själv varje andetag och styr både andningsfrekvens och inspirationstid. Ventilatorn ger ett inställt tryckstöd (**PS över PEEP**). Vid **PS = 0 cmH₂O** fungerar moden som ren **CPAP**. | • **PS över PEEP:** 6–14 cmH₂O<br>• **PEEP:** 5–10 cmH₂O<br>• **Inspirationsavslut (Cycle off):** Standard **30 %**<br>• **Apnétid:** 15–30 s<br>• **Reservventilation:** PC eller PRVC | **Kritiskt:** Kontrollera alltid att **Reservventilation (Backup)** är rimligt inställd (t.ex. PC över PEEP 12–15 cmH₂O, AF 14/min). Justera *Inspirationsavslut (%)* efter grundsjukdom (se avsnitt 4.3!). |
| **Automode®**<br>*(PRVC ⇄ VS, PC ⇄ PS, VC ⇄ VS)* | **Automatisk övergångsmod:**<br>Växlar sömlöst från kontrollerad mod (t.ex. PC eller PRVC) till understödd spontanmod (PS eller VS – Volume Support) så snart patienten triggar egna andetag. Vid apné växlar den mjukt tillbaka till kontrollerad mod utan larm. | • Aktiveras med skjutreglaget **Automode På/Av** inne i *PRVC*, *PC* eller *VC*.<br>• **Trigger-timeout:** 7–12 s (anpassas dynamiskt). | Utmärkt för postoperativa patienter och patienter som växlar i vakenhetsgrad under dygnet eller vid urträningsstart. |
| **SIMV**<br>*(VC+PS, PC+PS, PRVC+PS)* | **Kombinationsmod:**<br>Levererar en fast SIMV-frekvens av synkroniserade obligatoriska andetag. Mellan dessa kan patienten andas spontant med tryckunderstöd (**PS**). | • **SIMV-frekvens**, **Tidalvolym / PC**, **PS över PEEP**, **Andningscykel-tid**. | Används mer sällan på vuxen-IVA eftersom Automode eller ren PS med reservventilation ger bättre synkroni. |
| **Bi-Vent / APRV**<br>*(Airway Pressure Release Ventilation)* | **Tvåfasigt positivt luftvägstryck:**<br>Växlar tidsstyrt mellan en hög trycknivå (**$P_{\text{high}}$**) och en låg trycknivå (**$P_{\text{low}}$**). Patienten kan spontanandas fritt med eller utan PS på båda trycknivåerna. | • **$P_{\text{high}}$** & **$P_{\text{low}}$** (PEEP)<br>• **$T_{\text{high}}$** & **$T_{\text{low}}$**<br>• **PS över $P_{\text{high}}$** / **PS över $P_{\text{low}}$** | Vid klassisk APRV ("inverse ratio") hålls $T_{\text{high}}$ lång (4–6 s) för alveolär rekrytering och $T_{\text{low}}$ mycket kort (0,4–0,8 s) för CO₂-utvädring utan alveolär kollaps. |
| **NAVA & NIV NAVA**<br>*(Neurally Adjusted Ventilatory Assist)* | **Diafragmastyrda andetag via Edi-kateter:**<br>Ventilatorn läser av den elektriska aktiviteten i diafragma (**Edi** i $\mu\text{V}$) via en speciell ventrikelsond med elektroder och levererar tryck i direkt proportion till patientens eget nervsignal-påslag! | • **NAVA-nivå:** $0,5\text{–}2,0\text{ cmH}_2\text{O}/\mu\text{V}$<br>• **Edi-trigger:** $0,5\ \mu\text{V}$<br>• **PEEP:** 5–10 cmH₂O<br>• **Mål för Edi-peak:** **$5\text{–}15\ \mu\text{V}$** | **Unik fördel:** Eliminerar asynkroni vid trigger och cykelavslut (styrs av nervsignalen, opåverkad av läckage). Om Edi-signalen faller bort växlar Servo-U automatiskt till **PS**, och vid apné vidare till **PC-reservventilation**. |
| **NIV PC / NIV PS & High Flow O₂** | **Icke-invasiv maskventilation & Högflödesgrimma:**<br>NIV kompenserar automatiskt för maskläckage upp till 65 L/min hos vuxna. **High Flow** levererar kontinuerligt befuktat flöde via Optiflow-grimma. | • **NIV PS:** PEEP 4–8 cmH₂O, PS 6–12 cmH₂O<br>• **High Flow:** Flöde **30–60 L/min**, $\text{FiO}_2$ **21–100 %** (kräver aktiv befuktare F&P 950 i Optiflow-läge 37 °C!). | Vid NIV: Invänta att patienten är informerad, håll masken mot ansiktet initialt innan banden spänns och följ läckage-% på skärmen. |

---

### 4.3 Finjustering av Patient-Ventilator-Synkroni (Trigger, Stigtid & Cykelavslut)

När en patient ”kämpar mot ventilatorn” (dyssynkroni) i understödda eller kontrollerade moder justeras dessa tre nyckelparametrar:

1. **Triggerkänslighet (Trigger Sensitivity):**
   - **Flödestrigger (Grönt fält, nivå 1–10, standard = 2):** Patienten behöver bara suga till en liten volym av biasflödet (2 L/min) för att utlösa ett andetag.
   - **Rött fält (Hög känslighet):** Ökar risken för **autotriggning / självtriggning** (t.ex. av hjärtslag/kardiogena oscillationer eller kondensvatten som skvalpar i slangen!).
   - **Trycktrigger (0 till -20 cmH₂O):** Kräver att patienten skapar ett negativt undertryck. Används om autotriggning inte kan hävas med flödestrigger.
2. **Inspiratorisk Stigtid (Inspiratory Rise Time):**
   - Styr hur snabbt trycket stiger till inställd nivå i början av inspirationen (normalt **0,15 s** eller **5 %**).
   - **Kortare stigtid (0,05–0,10 s):** Vid hög andningsdrive / ”lufthunger” där tryckkurvan hänger ned i början av andetaget.
   - **Längre stigtid (0,20–0,30 s):** Om en tryckspik (*overshoot*) ses i början av inspirationen eller om patienten upplever luftströmmen som obehagligt hård.
3. **Inspirationsavslut (Inspiratory Cycle Off / Expiratorisk Trigger %):**
   - Bestämmer vid vilken procentandel av toppflödet som inspirationen avslutas i **PS/CPAP** (standard **30 %**):
   - **KOL / Astma (Obstruktivt):** Höj till **40–60 %**! Obstruktiva lungor har långsamt avtagande flöde; med 30 % blir inspirationen för lång och patienten tvingas aktivt krysta ut luften. Högre % ger kortare inspiration och **längre expirationstid** (mindre Auto-PEEP).
   - **ARDS / Lungfibros (Restriktivt / Stela lungor):** Sänk till **10–20 %**! Stela lungor når snabbt lågt flöde, vilket annars bryter andetaget för tidigt med små tidalvolymer och dubbeltriggning som följd.

---

## 5. Skärmvyer, Servo Compass & Lungmekaniska Manövrar

### 5.1 Skärmvyer & Servo Compass®
Genom att trycka på **VYER (Views)** i menyraden kan du växla mellan:
- **Grundvy (Basic)** & **Mer värden (More values):** Visar alla numeriska parametrar.
- **Loopar (Loops):** *Tryck-Volym*, *Flöde-Volym* och *Tryck-Flöde* (med möjlighet att spara referensloop för att utvärdera bronkdilatation eller PEEP-effekt).
- **Servo Compass®:** Ett visuellt ”sikte” som i realtid övervakar de två viktigaste målen för lungprotektiv ventilation:
  1. **Tidalvolym per kg idealvikt ($V_T / \text{PBW}$, mål 4–8 mL/kg)**
  2. **Drivtryck ($\Delta P$, mål < 15 cmH₂O) eller Totaltryck ($P_{\text{plat}}$, mål < 30 cmH₂O)**  
  Så länge kompassen är grön ventileras lungan inom inställda skyddsgränser.

### 5.2 Diagnostiska Manövrar på Servo-U

| Manöver / Parameter | Hur den utförs på Servo-U | Formel & Normal-/Målvärde | Klinisk Tolkning vid Sängkant |
|:---|:---|:---|:---|
| **Inspiratorisk Paus**<br>*(Platåtryck $P_{\text{plat}}$ & $C_{\text{stat}}$)* | Håll in knappen **INSP. PAUS (Insp. hold)** i **2–3 sekunder** under kontrollerad el. lugn andning. | • **$P_{\text{plat}}$:** **< 30 cmH₂O**<br>• **$C_{\text{stat}}$:** $\frac{V_T}{P_{\text{plat}} - \text{PEEP}_{\text{tot}}}$<br>*(Normalt 50–80 mL/cmH₂O; ARDS 20–35)* | Speglar det sanna alveolära sluttrycket när flödet är 0. Om **Topptryck ($P_{\text{peak}}$) är högt men $P_{\text{plat}}$ är normalt** beror problemet på **luftvägsmotstånd** (slempropp, bronkospasm, knickad tub). Om **både $P_{\text{peak}}$ och $P_{\text{plat}}$ stiger** har **lungcompliance försämrats** (lungödem, atelektas, pneumothorax, buktryck). |
| **Drivtryck ($\Delta P$)**<br>*(Driving Pressure)* | Beräknas kontinuerligt i PRVC/PC samt exakt vid **INSP. PAUS**. | • **$\Delta P = P_{\text{plat}} - \text{PEEP}_{\text{tot}}$**<br>• **Målvärde:** **< 14–15 cmH₂O** | Det elastiska distensionstrycket över alveolerna vid varje andetag. Starkaste prediktorn för överlevnad vid ARDS. Om $\Delta P \ge 15\text{ cmH}_2\text{O}$: sänk $V_T$ (ned mot 4–5 mL/kg PBW) eller optimera PEEP. |
| **Expiratorisk Paus**<br>*(Auto-PEEP / $\text{PEEP}_i$)* | Håll in knappen **EXP. PAUS (Exp. hold)** i **3–5 sekunder** i slutet av utandningen. | • **$\text{PEEP}_{\text{tot}} = \text{PEEP}_{\text{inst}} + \text{Auto-PEEP}$**<br>• **Normalt Auto-PEEP:** **< 1–2 cmH₂O** | Detekterar *dynamisk hyperinflation (air-trapping)* där patienten inte hinner tömma lungorna före nästa andetag. **Åtgärd vid högt Auto-PEEP:** Sänk andningsfrekvensen, förläng expirationstiden (I:E 1:3–1:4), ge bronkdilaterande inhalationer och sug rent. |
| **P0.1**<br>*(Ocklusionstryck vid 100 ms)* | Visas kontinuerligt vid spontanandning (eller via P0.1-manöver). | • **Målintervall på IVA:** **$1,5\text{–}3,5\text{ cmH}_2\text{O}$** | Mäter patientens centrala andningsdrive under de första 0,1 sekunderna av inspirationen:<br>• **< 1,5 cmH₂O:** Överassisterad / för djupt sederad (risk för diafragmaatrofi). Sänk PS eller sedering.<br>• **> 3,5–4,0 cmH₂O:** Kraftig lufthunger / hög belastning (risk för utmattning och P-SILI). Öka PS eller utred orsak (acidos, smärta, feber, slem). |
| **SBI / RSBI**<br>*(Rapid Shallow Breathing Index)* | Avläses under *Mer värden* i spontanmod (PS/CPAP). | • **$\text{SBI} = \frac{\text{Andningsfrekvens (AF)}}{\text{Tidalvolym (L)}}$**<br>• **Mål inför extubation:** **< 100–105** | Ett högt SBI (> 105 andetag/min/L) visar att patienten andas snabbt och ytligt och löper hög risk att misslyckas vid urträning/extubation. |

---

## 6. Endotrakeal Sugning (Sugstöd), O₂-Boost & Nebulisering

### 6.1 O₂-Boost (Snabbknapp för Preoxygenering)
- Tryck på **O₂-boost** längst ned på skärmen för att ge **100 % syrgas i 1 minut (60 sekunder)** inför procedurer som lägesändring, vändning eller sugning med slutet sugsystem.
- Efter 60 sekunder återgår ventilatorn automatiskt till den tidigare inställda $\text{FiO}_2$-nivån.

### 6.2 Sugstöd (Suction Support – vid Frånkoppling / Öppen Sugning)
När kretsen måste kopplas isär:
1. Tryck på **Sugning / Frånkoppling (Suction support)** och välj önskad $\text{FiO}_2$ (standard 100 %).
2. **Fas 1 – För-oxygenering:** Ventilatorn ger 100 % $\text{O}_2$ i upp till **2 minuter**.
3. **Fas 2 – Frånkoppling & Sugning:** När du kopplar isär Y-stycket pausar ventilatorn automatiskt larmen (apné och minutvolym) och stoppar högtrycksblåsningen så att aerosol/kondens inte sprids i vårdrummet.
4. **Fas 3 – Efter-oxygenering:** Så snart Y-stycket kopplas tillbaka till patienten återupptar Servo-U ventilationen automatiskt och ger **100 % $\text{O}_2$ i 1 minut** innan den återgår till ordinarie $\text{FiO}_2$.

### 6.3 Nebulisering (Aerogen Solo®)
1. Anslut Aerogen-kabeln till nebulisatoruttaget på patientenhetens framsida och placera T-stycket med läkemedelskoppen på inspirationsslangen.
2. **KRITISKT:** Om patienten har ett **HME-filter** vid tuben/Y-stycket **MÅSTE HME-filtret tas bort** innan nebuliseringen startas! Kontrollera att ett bakterie-/virusfilter sitter på expirationsingången för att skydda expirationskassetten från läkemedelsutfällning.
3. Tryck på **Nebulisering** i menyn och välj tid (**5–30 min**, standard **15 min**, eller *Kontinuerlig* vid t.ex. status asthmaticus). Aerogen-nebulisatorn tillför ingen extra gasvolym och påverkar därför inte tidalvolymer eller tryck.

---

## 7. Larmhantering & Klinisk Felsökningsmatris

- **Hög prioritet (Rött larm, snabba pip):** Kräver omedelbar åtgärd vid sängkant!
- **Medelhög prioritet (Gult larm):** Kräver snar bedömning och åtgärd.
- **Låg prioritet (Blått/Gult informationslarm):** Notera och åtgärda.
- **Ljudpaus (Audio Pause – klockikon):** Tystar pågående larm i **2 minuter (120 sekunder)**.

| Larmmeddelande på Servo-U | Prioritet | Vanligaste Orsaker | Klinisk Felsökning & Åtgärd |
|:---|:---:|:---|:---|
| **Luftvägstryck över övre gräns**<br>*(Airway pressure high)* | **Hög (Röd)** | 1. Sekret/slempropp i ET-tub eller luftvägar.<br>2. Patienten hostar, krystar eller biter på tuben.<br>3. Vatten/kondens eller knick i andningsslang.<br>4. Bronkospasm, pneumothorax eller glidning av tub i höger huvudbronk. | 1. Titta på patienten och $\text{SpO}_2$ – **handventilera med Rubens blåsa vid akut desaturation/cirkulationspåverkan!**<br>2. Sug rent i ET-tuben, sätt ev. bitblock.<br>3. Töm kondens i slangar och kontrollera kretsen.<br>4. Auskultera lungorna bilateralt och mät $P_{\text{plat}}$ (Insp. paus). |
| **Exspiratorisk minutvolym: Låg**<br>*(Expiratory minute volume low)* | **Hög (Röd)** | 1. **Läckage:** Slangkoppling har lossnat, kuffläckage eller dislocerad ET-tub.<br>2. Minskad spontanandning i PS/CPAP.<br>3. I PC-mod: Försämrad compliance eller ökad resistans ger mindre tidalvolymer. | 1. Kontrollera alla kopplingar från tub till befuktare och ventilator.<br>2. Kontrollera kufftryck (**25–30 cmH₂O**) och tubläge vid mungipa/tandrad.<br>3. Om PC: Kontrollera luftvägarna och justera PC över PEEP eller larmgräns. |
| **Begränsat tryck (PRVC / VS)**<br>*(Regulation pressure limited)* | **Medel/Hög** | Ventilatorn kan inte leverera inställd tidalvolym ($V_T$) eftersom det skulle kräva ett tryck som är närmare än **5 cmH₂O under övre trycklarmgränsen**. | 1. Åtgärda grundorsaken till de höga trycken (sug rent, töm kondens, bedöm sedering/smärta/compliance).<br>2. Om högre tryck är medicinskt motiverat: Höj **Övre tryckgräns** eller sänk inställd $V_T$. |
| **Apné / Ingen patientansträngning**<br>*(Apnea / No patient effort)* | **Hög / Medel** | Patienten har inte triggat något andetag inom inställd apnétid (15–30 s) i PS/CPAP. Ventilatorn har växlat till **Reservventilation (Backup)**. | 1. Bedöm vakenhet/sederingsdjup (RASS) och nyligen givna opioid-/propofolbolusar.<br>2. Om patienten ska vila: Byt aktivt till kontrollerad mod (**PRVC** eller **PC**).<br>3. Om patienten är vaken men inte orkar trigga: Kontrollera triggerkänslighet och Auto-PEEP. |
| **Läckage för högt (NIV)**<br>*(Leakage too high)* | **Medel (Gul)** | Masken sluter inte tätt mot ansiktet (t.ex. över näsrygg eller vid ventrikelsond). | Justera maskens läge och huvudband. Undvik att dra åt banden för hårt (trycksårsrisk) – lyft och omplacera maskkudden under pågående luftflöde. |
| **Kontrollera slangar**<br>*(Check tubing)* | **Hög (Röd)** | Blockerad slang, felkopplad krets eller frånkopplad tryckmätning. | Kontrollera att inspirations- och expirationsslangar samt filter är fria från ocklusion (kontrollera särskilt våta filter vid nebulisering!). |
| **Expirationskassett frånkopplad / Tekniskt fel** | **Hög (Röd)** | Expirationskassetten sitter inte korrekt nedtryckt i sitt fäste eller kondens/läkemedelsrester stör ultraljudssensorn. | Tryck ned expirationskassetten tills den klickar fast. Vid kvarstående larm eller synlig kontamination: Byt till en ren expirationskassett och kör kretstest. |
| **Lågt gastryck (Luft / O₂)**<br>*(Gas supply pressure low)* | **Hög (Röd)** | Gasslangen är inte intryckt i vägguttaget eller centralgastrycket är < 2,0 bar. | Kontrollera snabbkopplingarna för **Air** och **O₂** i väggen/pendeln. (Obs: Servo-U kräver minst en högtrycksgas för att kunna ventilera!). |

---

## 8. Hygien, Rengöring & Byte av Expirationskassett

### 8.1 Expirationskassett & Filterrutin
- **Expirationsfilter:** Använd alltid ett högeffektivt bakterie-/virusfilter (och vattenfälla vid aktiv befuktning) framför expirationsintaget för att skydda expirationskassetten och förhindra kontamination av omgivningsluften.
- **Byte av Expirationskassett:**
  1. Byt expirationskassett **mellan varje patient**, vid **nebulisering utan skyddsfilter**, eller om larm/högt expirationsmotstånd uppstår.
  2. Öppna spärren vid expirationsintaget, lyft rakt upp och ta ut kassetten.
  3. Sätt i en ren, desinficerad kassett och tryck ned tills den klickar i lås.
  4. **Viktigt:** Kör alltid ett **Patientkretstest (eller Förkontroll)** efter byte av expirationskassett!
  5. Den använda kassetten skickas till diskdesinfektor/autoklav enligt avdelningens rutin.

### 8.2 Avtorkning av Skärm & Patientenhet
1. **Lås pekskärmen före avtorkning** (håll in låsikonen i menyn) eller sätt ventilatorn i Standby/avstängt läge.
2. Torka utvändiga ytor på skärm, arm, vagn och patientenhet med luddfri duk fuktad med ytdesinfektionsmedel (t.ex. etanol/isopropanol 70 % eller väteperoxidbaserat medel).
3. Låt aldrig vätska tränga in i modulfack eller kontakter.

### 8.3 Säkerhetsföreskrifter vid Transport & MR
- **Intrahospital transport:** Kontrollera före avfärd att minst **2 fulladdade batterier** sitter i ventilatorn, att beräknad kvarvarande batteritid på skärmen överstiger transporttiden med god marginal (minst 60 min), samt att **handventilationsblåsa (Rubens blåsa)** och full syrgastub medföljer sängen!
- **MR-miljö:** Standard **Servo-U är MR-osäker (MR Unsafe)** och får **ALDRIG** tas in i MR-undersökningsrummet. Vid MR-undersökning används avdelningens dedikerade MR-kompatibla transportventilator.
`
  },
  {
    id: "doc-resp-fp950",
    title: "Fisher & Paykel 950 Befuktare (F&P 950™) – Bruksanvisning & Klinisk Rutin",
    category: "Respiration",
    filename: "Befuktare_FP_950.pdf",
    type: "application/pdf",
    size: 3578763,
    dateAdded: "2026-10-13T18:00:00Z",
    priority: "Riktlinje",
    isPinned: true,
    tags: ["Befuktning", "F&P 950", "Respiration", "Optiflow", "Invasiv", "NIV", "Larm", "Rengöring", "IVA"],
    description: "Klinisk bruksanvisning och handhavande för Fisher & Paykel 950 respiratorisk befuktare på IVA. Omfattar Invasiv ventilation, Mask (NIV) och Optiflow högflödessyrgas, temperaturlägen, komfortinställningar, larmhantering, rengöring och säkerhetsrutiner.",
    content: `# Fisher & Paykel 950 Befuktare (F&P 950™) – Bruksanvisning & Klinisk Rutin

> **Avdelningsriktlinje – Intensivvårdsenheten Östra**  
> **Kategori:** Respiration | **Målgrupp:** Intensivvårdssjuksköterskor, IVA-läkare och undersköterskor  
> **Utrustning:** F&P 950™ Respiratory Humidifier (Fisher & Paykel Healthcare)

---

## 1. Indikationer & Funktionsprincip

F&P 950 är ett aktivt befuktningssystem konstruerat för att tillföra optimal värme och fuktighet till medicinska andningsgaser som administreras till patienter på intensivvårdsavdelning.

### Funktionsprincip
- Medicinska gaser från ventilator eller gasblandare passerar genom en uppvärmd vattenkammare fylld med sterilt vatten.
- Gasen mättas med vattenånga och transporteras därefter genom andningsslangar med integrerade värmeslingor (inspirations- och expirationsdel).
- Värmetillförseln styrs automatiskt av en avancerad mikroprocessor baserat på kontinuerliga temperaturmätningar från sensorkassetten i kammaren och vid patientanslutningen.

> [!IMPORTANT]
> **Fysiologisk betydelse:** Förbikoppling av övre luftvägarna vid intubation eller trakeotomi eliminerar kroppens naturliga befuktning och uppvärmning. Adekvat aktiv befuktning (37 °C, 44 mg/L vattenånga) förhindrar uttorkning av slemhinnor, sekretstagnation, atelektaser och endotrakealtubocklusion.

---

## 2. Utrustningsdelar & Basmontering

| Komponent | Referens / Modell | Funktion |
|:---|:---|:---|
| **Värmebas (Heaterbase)** | 950JUS / 950AXX | Huvudenhet med värmeplatta, pekskärm och fäste för sensorkassett. |
| **Sensorkassett** | 950S02 | Monteras på värmebasen; innehåller flödes- och temperatursensorer. |
| **Slangset Vuxen/Pediatrisk** | 950A81J / 950P81J | Dubbeluppvärmt andningsslangset med autovattentryckkammare. |
| **Expiratorisk värmeoffset** | 950X00 | Adapter för expiratorisk värmekabel. |
| **Apparatfäste** | 900MR030 | Stativ-/skenfäste (godkänt för minst 4 kg belastning). |
| **Vattenförsörjning** | Sterilt vatten för inhalation | Automatisk påfyllnadskammare kopplas till 1000–2000 ml påse. |

### Monteringssteg vid sängkant
1. **Montera värmebasen** på IVA-pelaren eller ventilatorskenan med godkänt fäste. Kontrollera stabilitet.
2. **Koppla nätsladd och sladdhållare:** Fäst sladdhållaren med skruv (åtdragningsmoment 0,8 ± 0,3 Nm) för att förhindra oavsiktlig urkoppling.
3. **Montera sensorkassetten (950S02):** Skjut kassetten uppåt och framåt tills den klickar fast ordentligt i värmebasen.
4. **För in vattenkammaren** i kassetten och tryck nedåt tills den snäpper fast på värmeplattan.
5. **Anslut sterilvattenpåse** via överföringsaggregatet. Kontrollera att kammaren fylls till den blå flottörnivån och därefter stänger automatiskt.
6. **Starta enheten:** Tryck på standby-knappen på skärmen. Enheten avger ett enda bekräftande pip.

> [!CAUTION]
> **Placering i förhållande till patient:** Befuktaren skall **ALLTID** vara placerad i våg och **LÄGRE än patientens huvud**. Detta förhindrar att eventuellt kondensat rinner ner i patientens luftvägar!

---

## 3. Ventilationslägen & Driftlägen

Befuktaren anpassar automatiskt tillgängliga lägen efter vilken typ av slangset som ansluts:

| Ventilationsläge | Patientgrupp / Gränssnitt | Standard Måltemperatur (Daggpunkt) | Komfortval |
|:---|:---|:---|:---|
| **Invasivt läge (Invasive)** | Intuberad patient (ET-tub) eller trakeostomerad patient. | **37,0 °C** (100% RH, 44 mg/L) | Ej valbart (fast 37 °C för patientsäkerhet). |
| **Mask-läge (NIV)** | Icke-invasiv ventilation med helmask, oronasalmask eller CPAP. | **31,0 °C** | **31 °C** (Standard), **29 °C** (Mellan), **27 °C** (Låg) |
| **Optiflow™-läge** | Högflödessyrgas via Optiflow näsgrimma (HFNO). | **37,0 °C** | **37 °C** (Standard), **35 °C** (Mellan), **33 °C** (Låg) |
| **Neonatalt Invasivt** | Nyfödda och spädbarn med trakealtub. | **37,0 °C** | Fast 37 °C |
| **Neonatalt CPAP / NIV** | CPAP eller mask/prongs hos nyfödda. | **37,0 °C** | **37 °C**, **34 °C**, **31 °C** |

### Byte av Driftläge på Skärmen
1. Tryck på rullgardinsmenyn i skärmens överkant där det aktuella läget visas (t.ex. *Invasive*).
2. Välj önskat nytt läge i listan (*Invasive*, *Mask* eller *Optiflow*).
3. Bekräfta valet. Vid byte av läge återställs komfortinställningarna automatiskt till standard.

---

## 4. Komfortinställningar & Kondenshantering

Vid Mask- och Optiflow-lägen kan patienten uppleva 37 °C som för varmt eller klaga över fuktighet/kondens i masken. Då kan daggpunkten sänkas stegvis:

- **Steg 1:** Tryck på temperaturvärdet på huvudskärmen.
- **Steg 2:** Välj önskad komfortnivå (*Standard*, *Medium*, *Low*).
- **Steg 3:** Bekräfta. Enheten reglerar nu värmen i slangen och kammaren för att uppnå vald daggpunkt.

> [!TIP]
> **Kondens i slangarna:** Om kondens bildas i inspirationsslangen beror det vanligen på låg rumstemperatur (< 18 °C) eller att drag från luftkonditionering kyler slangen. Kontrollera att slangen inte ligger under kalla täcken eller utsätts för direkt fläktdrag. Töm vattenfällor/slangar var 6:e timme.

---

## 5. Larmhantering & Felsökningsmatris

F&P 950 är utrustad med ett intelligent larmsystem med visuella skärminstruktioner, animationsguider och akustiska signaler.

### Larmprioriteter
- **Medelhög prioritet:** 3 pip var 5:e sekund. Gul lysdiod tänds.
- **Låg prioritet:** 1 pip var 5:e sekund.

### Fullständig Larmlista & Åtgärder

| Larmlarm | Prioritet | Tidsfördröjning | Orsak & Klinisk Åtgärd |
|:---|:---:|:---:|:---|
| **Disconnection** (Frånkoppling) | Medel | < 10 sekunder | Inspirationsslang eller kammare ej helt ansluten. Kontrollera kopplingar och tryck in kammaren helt. |
| **No Water** (Vatten saknas) | Medel | < 60 minuter | Vattenkammaren eller sterilvattenpåsen är tom. Byt omedelbart till ny sterilvattenpåse. |
| **Check Setup** (Kontrollera koppling) | Medel | < 60 minuter | Slangarna är felvända så gas leds till patienten innan den passerat befuktaren. Kammarutloppets temperatur > 43 °C. Kontrollera ventilatorportar (Inspiration vs Expiration). |
| **Low Temperature** (Låg temperatur) | Medel | 10–60 min | Gasströmmen är mer än 2 °C under börvärdet under längre tid. Kontrollera att gasflödet ligger inom specifikation och att apparaten inte kyls av drag. |
| **High Temperature** (Hög temperatur) | Medel | < 30 sekunder | Temperatur vid patientänden > 43 °C. Kontrollera flödeskällan och att slangarna inte är övertäckta. |
| **Cartridge Disconnection** | Medel | < 10 sekunder | Sensorkassetten har lossnat elektriskt från värmebasen. Tryck fast sensorkassetten. |
| **Breathing Circuit Fault** | Medel | < 10 sekunder | Skadat eller brutet slangset / värmetråd. Byt ut andningsslangsetet. |
| **Service Required** | Medel | 10s – 5 min | Intern teknisk felkod på värmebasen. Stäng av enheten, ta ur bruk och kontakta Medicinteknisk avdelning (MTA). |
| **Check Adapter** (Kontrollera adapter) | Låg | < 20 sekunder | Expiratorisk värmekabeladapter ej ansluten (aktivt i CPAP/NIV). Anslut adaptern mellan sensorkassetten och expirationsslangen. |
| **Cartridge Service Life** | Låg/Info | 15 000 driftstimmar | Sensorkassetten har nått sin maximala livslängd. Tryck "Pausa larm" och byt kassetten vid nästa säkra tillfälle. |

### Tysta larm (Ljudpaus)
- Tryck på den gula knappen för larmtystnad i skärmens nedre högra hörn. Ljudet pausas i **2 minuter (120 sekunder)** medan åtgärd vidtas.

---

## 6. Låsning & Upplåsning av Skärmen

För att förhindra oavsiktliga ändringar av driftläge eller temperatur kan skärmen låsas:
1. Gå till menyn **Options** genom att trycka på menyikonen (tre streck) längst ner till vänster.
2. Håll inne **hänglåsikonen** tills cirkelanimationen gjort ett helt varv.
3. Skärmen är nu låst (låsikon visas i hörnet).
4. **För att låsa upp:** Tryck på låsikonen en gång, tryck därefter och håll inne den upplåsta symbolen tills nedräkningsanimationen slutförs.

---

## 7. Rengöring, Desinfektion & Underhåll

> [!WARNING]
> **Viktigt:** Enheten får **ALDRIG autoklaveras eller nedsänkas i vätska**. Spraya aldrig vätska direkt in i ventilationsöppningar eller elektriska kontakter.

### Rengöringsrutin (Minst var 14:e dag samt vid patientbyte)
1. Stäng av enheten och dra ur stickkontakten ur vägguttaget.
2. Kassera förbrukningsartiklar (kammare och slangset är engångsartiklar och kastas).
3. Säkerställ att gummiskyddet för USB-porten på baksidan är stängt.
4. Torka av värmebas, sensorkassett och adapter med en ren luddfri trasa fuktad med milt diskmedelsvatten i minst 1 minut.
5. Eftertorka med trasa fuktad med vanligt kranvatten för att avlägsna rengöringsmedelsrester.
6. Torka torrt med torr trasa och låt lufttorka.

### Desinfektionsrutin
- Använd fördränkta desinfektionsservetter godkända för medicinteknisk utrustning.
- **Godkända medel:** Isopropanol (sprit), Etanol, Väteperoxid (Hydrogen Peroxide).
- Håll ytorna synligt fuktiga under den kontakttid som tillverkaren föreskriver (vanligen 2–3 minuter).
- Eftertorka med ren fuktad trasa och låt lufttorka.

### CAVE – Ämnen som förstör polykarbonatplasten:
Använd **ALDRIG** medel som innehåller:
- Ammoniak eller ammoniumhydroxid
- Limonen / citrusoljor
- Kaustiksoda / natriumhydroxid (lut)
- Jodlösningar
- Organiska lösningsmedel (aceton, tinner, bensin, lacknafta)
- Klorin / natriumhypoklorit (blekmedel)

---

## 8. Kritiska Varningar & Säkerhetsföreskrifter

- **MR-miljö:** F&P 950 är **MR-osäker (MR Unsafe)** och får under inga omständigheter tas in i MR-kamerarummet!
- **Heliox-gas:** Enheten är konstruerad för luft och medicinsk syrgas. Användning med Heliox (helium-syrgas) kan orsaka falska larm för vattenbrist.
- **Brandfara:** Håll öppen eld och tändkällor borta vid administrering av hög syrgaskoncentration.
- **Kondensinspektion:** Inspektera andningsslangar minst var 6:e timme för kondensansamling.
- **Teknisk kontroll:** Vid misstanke om tekniskt fel eller om LED-varningslampan lyser fast utan skärmbild – ta enheten ur drift och felanmäl till MTA.
`
  },
  {
    id: "doc-nutr-compat-ella",
    title: "Compat Ella® Enteral Nutritionspump – Bruksanvisning & Klinisk Rutin",
    category: "Nutrition",
    dateAdded: "2026-10-14T16:36:00Z",
    priority: "Riktlinje",
    isPinned: true,
    tags: ["Compat Ella", "Nutritionspump", "Sondmatning", "Enteral nutrition", "ENFit", "ENPlus", "Kontinuerligt läge", "Intervalläge", "Larm", "Rengöring", "IVA"],
    description: "Klinisk bruksanvisning och handhavande för Compat Ella® enteral nutritionspump på IVA. Omfattar laddning av kassett och aggregat, autopåfyllning, kontinuerligt läge och intervalläge (bolus), volymhistorik, knappsatslås, larmhantering, rengöring och säkerhetsföreskrifter.",
    content: `# Compat Ella® Enteral Nutritionspump – Bruksanvisning & Klinisk Rutin

> **Avdelningsriktlinje – Intensivvårdsenheten Östra**  
> **Kategori:** Nutrition | **Målgrupp:** Intensivvårdssjuksköterskor, IVA-läkare och undersköterskor  
> **Utrustning:** Compat Ella® Enteral Nutritionspump (Nestlé Health Science / Axium MTech S.A.)

---

## 1. Indikationer, Avsedd Användning & Funktionsprincip

Compat Ella® är en portabel, mikroprocessorstyrd peristaltisk rullpump konstruerad för kontrollerad enteral tillförsel av sondnäring och hydreringsvätskor (vatten, te) till magtarmkanalen hos vuxna och pediatriska patienter.

### Funktionsprincip
- Pumpen arbetar med en unik kassett- och rotormekanism och kan drivas både stationärt (via nätström på droppställning/IVA-pelare) och ambulerande i alla positioner.
- **Intermittent pumpcykel:** Compat Ella® pumpar en liten mängd vätska i taget, gör ett kort uppehåll och pumpar sedan igen. Motorn hörs därför inte kontinuerligt, men **de gröna pilarna i sekvens på skärmen** bekräftar att behandlingen pågår normalt.
- **Patenterad AAFF-mekanism (Auto-Anti-Free-Flow):** Samtliga Compat Ella®-aggregat har ett inbyggt skydd mot fritt flöde i kassetten som alltid är aktivt utanför pumpen och endast frigörs när kassetten sitter korrekt monterad i pumpen med stängd lucka.

> [!IMPORTANT]
> **Endast för enteralt bruk:** Compat Ella® får **ALDRIG** användas för intravenös infusion! Aggregatet har ENPlus-anslutning mot näringspåse och ENFit®-anslutning mot patientens sond för att förhindra felkoppling till intravenösa infarter.

---

## 2. Systemöversikt, Utrustningsdelar & Montering av Aggregat

| Komponent | Beteckning | Funktion & Klinisk Notering |
|:---|:---:|:---|
| **Pumpens lucka & spärr** | A, B | Öppnas med tumfliken upptill; stängs genom tryck på **"PUSH"**-symbolen. |
| **Pumprotor** | C | Peristaltisk rotor som kassettens silikonslang lindas runt. |
| **Trycksensor uppströms & nedströms** | G, H | Detekterar ocklusion/stopp före pumpen (-34 kPa) och efter pumpen (83–103 kPa). |
| **Luftsensor** | I | Detekterar luft i slangen eller tom näringsbehållare (aktiveras vid ca 1,5 mL luft). |
| **Knappsats & Färgskärm** | D, F | Färgkodad skärm med alfanumeriska värden, symboler och bakgrundsljus. |
| **Statuslampa nätström** | E | Lyser **stadigt grönt** när pumpen är ansluten till fungerande nätström. |
| **Anslutning nätström & Nätadapter** | K, Q | 5 VDC anslutning på pumpens sida. Kontrollera alltid att kontakten är helt torr. |
| **Fäste & Stativklämma** | L, R | Vridbart fäste på baksidan för stabil montering på droppställning eller IVA-balk. |
| **Compat Ella®-aggregat** | S, T, U, V | **S:** ENPlus-spike/koppling, **T:** Kassett med AAFF, **U:** ENFit® läkemedelsport, **V:** ENFit® distal patientände. |

### Ladda Kassetten i Pumpen (Steg 1–6)
1. **Inspektera aggregatet:** Använd endast original Compat Ella®-aggregat. **Byt aggregat var 24:e timme** (och efter max 1 500 mL för bibehållen noggrannhet ±5 %) för att motverka bakterietillväxt och bibehålla flödesprecision.
2. **Öppna luckan (Fig. 1):** Lyft på tumfliken på pumpens ovansida.
3. **Linda slangen (Fig. 2–3):** Linda kassettens slangögla runt pumprotorn (C) i pilens riktning.
4. **Fäst kassetten (Fig. 4–5):** Använd tummen för att skjuta kassetten bestämt åt **höger** tills den klickar fast i sitt säte.
5. **Stäng luckan (Fig. 6):** Tryck på **"PUSH"**-symbolen på luckan tills spärren klickar igen.

### Fylla Aggregatet (Påfyllning / Priming)

> [!CAUTION]
> **Kritisk säkerhetsregel före påfyllning:** Verifiera **ALLTID** att aggregatet **INTE är anslutet till patientens sond** när autopåfyllning eller manuell påfyllning utförs! Under påfyllning är larmet för luft i slang inaktiverat.

- **Autopåfyllning (Rekommenderas alltid):**
  1. Säkerställ att aggregatet är kopplat till sondnäringspåsen och att kassetten sitter i pumpen.
  2. Håll in **Påfyllningsknappen** (symbol med slang/droppe) i **2 sekunder (2")**.
  3. Pumpen matar fram sondnäring med hög hastighet (≥ 600 mL/h) och visar **PÅFYLLNING**.
  4. När slangen är fylld stannar pumpen automatiskt och visar **PÅFYLLNING KLAR** (kan avbrytas i förtid genom ett nytt tryck på knappen). Kontrollera visuellt att all luft är borta.
- **Manuell påfyllning:**
  - Nyp försiktigt ihop slangen på kassetten **ovanför** AAFF-symbolen med fingrets mjuka, platta del (använd aldrig naglar!) tills all luft har försvunnit. Vid trögflytande/högviskösa sondnäringar ska alltid autopåfyllning användas.

---

## 3. Knappfunktioner, Färgskärm & Batteridrift

### Översikt över Knappsatsen

| Knapp / Symbol | Primär Funktion | Sekundär Funktion (Långtryck / Kombination) |
|:---|:---|:---|
| **På/Av (Strömknapp)** | Slå på eller stänga av pumpen (håll intryckt i **2 sekunder**). 3 pip hörs och **SJÄLVKONTROLL OK** visas. | Alltid aktiv (även vid låst knappsats). |
| **START / PAUSE** | Starta eller pausa pågående nutritionsbehandling. | **Snooze / Bekräfta larm:** Tystar larm eller förlänger pausläge med 2 minuter. |
| **Autopåfyllning** | Starta autopåfyllning av aggregatet (håll intryckt i **2 sekunder**). | Tryck en gång till för att avbryta påfyllning i förtid. |
| **mL/h / mL** | Bläddra mellan hastighets-, volym- och intervallprogrammering. | **Byta driftsläge:** Håll intryckt i **5 sekunder (5")** för att växla mellan *Kontinuerligt läge* och *Intervalläge*. |
| **– och +** | Minska eller öka värden (håll intryckt för snabbbläddring). | **Knappsatslås:** Tryck på **både – och + samtidigt** för att låsa eller låsa upp knappsatsen. |
| **Papperskorg (Rensa)** | Nollställer det aktuella värdet på skärmen till standardvärde eller **0**. | **Total återställning:** Håll intryckt i **3 sekunder (3")** för att rensa alla behandlingsinställningar och aktuell volymhistorik (**ÅTERSTÄLL INSTÄLLNINGAR FÖR MATNING**). |
| **info** | Bläddra genom aktuell volymhistorik (**MÄNGD GIVEN VOLYM** och **ACKUMULERAD VOLYM**). | **30-dagarshistorik:** Håll intryckt i **2 sekunder (2")** för att öppna rullande 30-dagars dygnsvolymer. |
| **Kugghjul (Inställningar)** | Bläddra genom användarinställningar (ljudnivå, bakgrundsljus, autodim, klar-larm). | **Språkval:** Håll intryckt i **2 sekunder (2")** för att byta språk. |

### Färgskärmens Färgkodning
- **Svarta tecken:** Programmeringsläge (t.ex. *STÄLL IN FLÖDESHASTIGHET*).
- **Gröna ikoner med svarta tecken:** Normal drift (gröna sekvenspilar, hastighet i mL/h samt tillförd/målvolym t.ex. *100/500 mL* eller */KONT*).
- **Röda tecken och ikoner:** Aktivt larm (t.ex. *INGET INFLÖDE*, *LUFT I SLANG*).
- **Blå tecken:** Informationsläge via **info**-knappen (t.ex. *MÄNGD GIVEN VOLYM*).
- **Gröna tecken:** Användarinställningar via kugghjulsknappen (t.ex. *LJUDNIVÅ*).

### Batteri & Strömförsörjning
- **Batterikapacitet:** Ca **24 timmar** vid 125 mL/h (nytt batteri, 1–2 år gammalt). Vid 3 år ca 20 h, 4 år ca 16 h, 5 år ca 12 h.
- **Laddningstid:** Ca **6 timmar** från helt urladdat till fulladdat.
- **Serviceintervall:** Vart 5:e år (eller tidigare om batteriet inte längre tar laddning).

---

## 4. Driftslägen & Snabbguider (Kontinuerligt Läge & Intervalläge)

Compat Ella® sparar alltid de senast programmerade värdena och den senast tillförda volymen i minnet även när pumpen stängs av.

> [!WARNING]
> **Nollställ alltid MÄNGD GIVEN VOLYM vid ny behandling!**  
> Om **MÄNGD GIVEN VOLYM** inte nollställs innan en ny ordination startas kommer pumpen att räkna med föregående behandling och utlösa larmet **SLUT / AVSLUTAD NUTRITIONS BEHANDLING** för tidigt!

### 4.1 Snabbguide: Matning i Kontinuerligt Läge (Standard på IVA)
Används för jämn kontinuerlig tillförsel med definierad hastighet (1–600 mL/h), med eller utan volymgräns.

| Steg | Knapp | Åtgärd & Klinisk Kontroll |
|:---:|:---|:---|
| **1** | **På/Av (2")** | Starta pumpen. Kontrollera att 3 pip hörs, att alla skärmsegment syns och att **SJÄLVKONTROLL OK** visas. Ladda aggregatet i pumpen. |
| **2** | **info** | Tryck på **info** för att kontrollera tidigare **MÄNGD GIVEN VOLYM**. |
| **3** | **Papperskorg** | Tryck på papperskorgen för att nollställa **MÄNGD GIVEN VOLYM** till **0 mL** (alternativt håll in papperskorgen i 3 sek från huvudmenyn för total nollställning). |
| **4** | **Autopåfyllning (2")** | Fyll aggregatet (kontrollera att slangen **inte** är kopplad till patienten!). |
| **5** | **mL/h / mL** + **+/–** | Ställ in **STÄLL IN FLÖDESHASTIGHET** (**1–600 mL/h**). Vid intryckt knapp pausar snabbbläddringen vid *1, 50, 125, 250 och 600 mL/h*. |
| **6** | **mL/h / mL** + **+/–** | Tryck på **mL/h / mL** igen för **ANGE VOLYM** (**1–4000 mL** eller **KONT**). **KONT** innebär att pumpen kör kontinuerligt tills påsen är tom. Snabbbläddring pausar vid *1, 125, 250, 500, 750, 1000, 1250, 1500, 2000 och 4000 mL*. |
| **7** | **START / PAUSE** | Verifiera ordinationen, anslut ENFit®-kopplingen till patientens sond och tryck **START/PAUSE**. |

### 4.2 Snabbguide: Matning i Intervalläge (Bolusmatning)
Tillför en definierad bolusdos upprepade gånger med fasta tidsintervall. *Obs! Ett intervall räknas från början av en bolusdos till början av nästa bolusdos.*
- **Växla till Intervalläge:** Håll in **mL/h / mL** i **5 sekunder (5")** tills fyrkantsvåg-ikonen och **INTERVALL-LÄGE AKTIVERAT** visas (kräver att *TILLÅTA INTERVALL? JA* är aktiverat i Övriga inställningar).
- **Programmeringssteg med mL/h / mL:**
  1. **STÄLL IN FLÖDESHASTIGHET:** **1–600 mL/h**.
  2. **ANGE BOLUSDOS:** **1–2000 mL** (volym per dostillfälle).
  3. **ANGE INTERVALL:** **00:15–12:00 timmar** i steg om 15 minuter (minsta valbara intervall beror på hur lång tid bolusdosen tar att ge vid vald hastighet).
  4. **ANGE TOTAL MÄNGD VOLYM:** **1 bolusdos upp till 4000 mL**, eller **KONT**.
  5. Anslut till patient och tryck **START/PAUSE**. Mellan doserna visar skärmen **INTERVALL PAUS** och **TID TILL NÄSTA BOLUSDOS**.

---

## 5. Pausläge, Volymavläsning & Inställningar

### Pausa en Nutritionsbehandling
- Tryck på **START/PAUSE** under drift. Körikonen slocknar och **PUMP PAUSAD** visas.
- Använd pausläget vid läkemedelsadministrering via ENFit®-porten, påsbyte eller justering av flödeshastighet.
- **Pauslarm efter 2 minuter:** Om pumpen lämnas i pausläge i 2 minuter ljuder larmet **PUMP VÄNTAR**. Tryck på **START/PAUSE** en gång för att skjuta upp larmet i ytterligare 2 minuter, eller tryck igen för att återuppta matningen.

### Avläsa och Nollställa Tillförd Volym (info)
1. **Tryck 1 gång på info – MÄNGD GIVEN VOLYM:** Visar volym (mL) som givits under pågående behandling. Nollställ genom att först pausa pumpen, trycka **info** och därefter **Papperskorg**.
2. **Tryck 2 gånger på info – ACKUMULERAD VOLYM:** Visar total ackumulerad volym sedan senaste nollställning (praktiskt för skiftavläsning/vätskebalans över dygnet). Nollställ i pausläge med **info** x 2 följt av **Papperskorg**.
3. *(I intervalläge visar ytterligare tryck på **info** även: **TID TILL TOTALVOLYM KLAR**, **TID TILL BOLUSDOS KLAR / NÄSTA BOLUSDOS**, **INSTÄLLD BOLUSDOS** samt **INSTÄLLT INTERVALL**).*
4. **Rullande 30-dagarshistorik:** Håll in **info** i **2 sekunder (2")**. Använd **+** och **–** för att bläddra mellan de senaste 30 dygnen (dygnsvolym räknad midnatt till midnatt). Kan ej nollställas.

### Användarinställningar (Kugghjul) & Knappsatslås
- **Kugghjul (kort tryck):** Bläddra mellan:
  - **LJUDNIVÅ:** **1–3** (3 = högst, standard = 3).
  - **BAKGRUNDSLJUS:** **1–3** (3 = högst, standard = 2).
  - **AUTODIM?:** **JA** (skärmen dämpas efter 10 sek vid nätdrift) / **NEJ** (skärmen lyser konstant vid nätdrift, standard).
  - **ALARM PÅ NÄR BEHANDLING KLAR?:** **JA** (standard) / **NEJ** (tyst vid målvolym).
- **Knappsatslås:** Tryck samtidigt på **–** och **+** för att låsa (**KNAPPSATS LÅST** + hänglåsikon) eller låsa upp (**KNAPPSATS OLÅST**). Vid aktivt larm låses knappsatsen upp automatiskt.
- **Servicemeny / Övriga inställningar (Endast utbildad vårdpersonal):** När pumpen är avstängd, tryck på **På/Av** och tryck sedan på **Kugghjul** exakt medan texten *"TRYCK FÖR ATT SLÅ PÅ"* visas. Här ställs **LÅSA PROGRAM?** (NEJ/JA), **TILLÅTA INTERVALL?** (JA/NEJ), **KOMMUNIKATION** (AV/SKOT/PDMS) samt datum och klockslag in. Avsluta genom att stänga av pumpen för att spara.

---

## 6. Larmhantering & Felsökningsmatris

När ett larm ljuder visas röd text och röd larmikon på skärmen:
1. **Steg 1:** Tryck på **START/PAUSE** för att tysta/bekräfta larmet.
2. **Steg 2:** Åtgärda orsaken enligt tabellen nedan.
3. **Steg 3:** Tryck på **START/PAUSE** igen för att återuppta matningen.

| Larmmeddelande på Skärmen | Orsak | Klinisk Åtgärd / Lösning |
|:---|:---|:---|
| **SLUT / AVSLUTAD NUTRITIONS BEHANDLING** | 1. Förprogrammerad målvolym har levererats fullt ut.<br>2. Inställd målvolym är mindre än eller lika med **MÄNGD GIVEN VOLYM**. | Avsluta matningen eller programmera ny behandling. **Viktigt:** Nollställ alltid **MÄNGD GIVEN VOLYM** innan ny målvolym startas! |
| **DÖRR ÖPPEN** | Pumpens lucka är öppen eller låsspärren är skadad. | Stäng pumpens lucka ordentligt (tryck på "PUSH"). Om spärren är skadad, ta pumpen ur bruk och kontakta MTA. |
| **ÅTERPLACERA AGGREGAT** | Aggregatets kassett är felaktigt insatt eller saknas. | Öppna luckan, kontrollera att slangen ligger runt rotorn och att kassetten är skjuten helt åt höger. Stäng luckan. |
| **LUFT I SLANG** | Näringspåsen är tom, aggregatet är inte ordentligt luftat eller stopp finns mellan påse och pump. | 1. Om behandlingen är klar: Stäng av och spola sonden.<br>2. Byt tom näringspåse, koppla loss från patienten vid behov av ny autopåfyllning, kontrollera att ingen klämma/knick finns före pumpen och starta igen. |
| **INGET INFLÖDE** | Ocklusion/stopp eller klämd slang **före pumpen** (mellan näringsbehållare och pump, <-34 kPa i 5 s). | Kontrollera att slangen inte är klämd eller snodd mellan påse och pump. Öppna luckan, kontrollera kassettens läge, stäng luckan och starta igen. |
| **INGET UTFLÖDE** | Ocklusion/stopp eller vikt slang **efter pumpen på patientsidan** (83 kPa i 30 s / 103 kPa i 5 s). | Kontrollera hela vägen från pump till patientens sond efter veck eller stängd kran. Kontrollera sondens patens och **spola igenom sonden** med vatten vid behov. |
| **BATTERI LÅGT** | Batteriet börjar bli urladdat (eller är nästan helt tomt). | Anslut omedelbart pumpen till nätström via nätadaptern. |
| **LADDA BATTERI** | Batteriet är helt tomt och pumpen kan inte köras utan kort uppladdning. | Anslut till nätström. Vänta tills **KLAR ATT ANVÄNDA** visas och bekräfta med **START/PAUSE**. |
| **PUMP VÄNTAR** | Pumpen har stått i pausläge i 2 minuter utan knapptryckning. | Tryck **START/PAUSE** för att starta matningen, stäng av pumpen, eller tryck **START/PAUSE** för att förlänga pausen med 2 minuter. |
| **TA BORT MAGNET** | Magnetiska störningar från yttre källa detekteras. | Avlägsna den magnetiska källan eller flytta pumpen (får ej användas nära MR!). |
| **ERXX / STARTA OM PUMPEN** | Internt systemfel (*XX* = felkod 01–99). | Stäng av pumpen och starta om. Om felet återkommer: Ta pumpen ur drift och skicka till MTA/servicecenter. |

---

## 7. Rengöring, Desinfektion & Tekniska Specifikationer

### Rengöringsrutin
1. **Koppla alltid bort pumpen från elnätet** och stäng av den före rengöring (risk för elektrisk stöt).
2. Rengör pumpen med en fuktig mjuk trasa eller svamp och **varm tvållösning**.
3. Pumpen är vattenskyddad (**IP25**) och kan hållas under **rinnande varmt vatten** vid rengöring.
4. Torka pumpen noga med en mjuk trasa innan den används igen.

> [!WARNING]
> **Försiktighet vid rengöring & desinfektion:**
> - **Trycksensorer (G och H):** Använd aldrig vassa föremål eller hårda borstar i sensorområdet under luckan.
> - **Hölje & Desinfektionsmedel:** Sänk **aldrig** ned pumpen i vatten, kör den aldrig i diskmaskin och autoklavera den aldrig. Undvik starka desinfektionsmedel och **isopropylalkohol**, eftersom dessa kan orsaka sprickbildning och missfärgning i pumpens plasthölje!

### Tekniska Specifikationer i Korthet
- **Mått & Vikt:** 140 × 140 × 62 mm | Vikt: **499 g**.
- **Flödesintervall:** 1–600 mL/h (steg om 1 mL/h) | **Volymintervall:** 1–4 000 mL (steg om 1 mL) eller **KONT**.
- **Noggrannhet:** ± 5 % (gäller vid nytt originalaggregat upp till 1 500 mL levererad volym och vätskehöjd 30 cm ± 30 cm ovanför rotor).
- **Kapslingsklass & Elsäkerhet:** IP25, Klass II, Tillämpad del typ BF.

---

## 8. Kontraindikationer & Kliniska Säkerhetsföreskrifter på IVA

### Kontraindikationer – Compat Ella® ska INTE användas:
- För administrering av intravenösa infusioner (livsfara!).
- Om enteral nutrition är medicinskt kontraindicerad (t.ex. mekaniskt tarmhinder, paralytisk ileus, tarmperforation).
- Vid enterokutan fistel med högt flöde.
- Vid hemodynamisk instabilitet med **höga doser positiva inotropa/vasokonstriktiva läkemedel** där splanknisk hypoperfusion medför risk för icke-ocklusiv tarmischemi (följ avdelningens nutritionsriktlinje ESPEN Östra 2.2).
- Med andra aggregat än original Compat Ella®-aggregat.

### Övervakning & Komplikationsförebyggande på IVA
- **Aspirationsprofylax:** Håll huvudändan höjd **30–45°** under pågående sondmatning och kontrollera sondläge samt eventuell ventrikelretention enligt rutin.
- **Känsliga patienter:** Hos patienter med kontinuerlig insulininfusion eller hög risk för hypoglykemi måste ett oväntat avbrott i sondmatningen (t.ex. vid larm eller sondstopp) uppmärksammas direkt så att P-Glukos kontrolleras och eventuell glukosinfusion kopplas.
- **MR-miljö:** Pumpen får **inte** användas i starka magnetfält som MR-undersökningsrum.
`
  },
  {
    id: "doc-sedering-protokoll",
    title: "Sederings- & Analgesiprotokoll på IVA Östra (RASS- & CPOT-styrd)",
    category: "Sedering",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Riktlinje",
    isPinned: true,
    tags: ["Sedering", "RASS", "CPOT", "Dexdor", "Propofol", "Analgosedering", "Delirium"],
    description: "Avdelningsövergripande riktlinje för strukturerad analgosedering. Målstyrd sedering (RASS 0 till -1), dagligt uppvakningstest (DSI), deliriumscreening med CAM-ICU samt val av sedativa.",
    content: `# Sederings- & Analgesiprotokoll på IVA Östra

> **Kategori:** Sedering | **Målgrupp:** IVA-läkare och intensivvårdssjuksköterskor  
> **Mål:** Smärtfrihet, minimal sedering (RASS 0 till -1) och prevention av IVA-delirium.

---

## 1. Grundprinciper – Analgosedering först!
1. **Behandla smärta före sedering:** Alltid adekvat analgesi (Oxykodon, Morfin eller Fentanyl) utvärderad med CPOT (mål CPOT ≤ 2).
2. **Lättaste möjliga sederingsgrad:** Standardmål på IVA Östra är **RASS 0 till -1** (vaken, lugn, kontaktbar och medverkande).
3. **Djup sedering (RASS -4 till -5)** är ENDAST indicerat vid:
   - Svår ARDS med neuromuscular blockad (NMBA)
   - Bukläge (proning)
   - Svår intrakraniell tryckstegring (ICP-kris)
   - Refraktär status epilepticus
   - Terapeutisk hypotermi

---

## 2. Preparatval på IVA Östra
- **Förstahandsval vid kort/medellång sedering:** Propofol (startdos 1.0–2.0 mg/kg/h, max 4.0 mg/kg/h). Obs! PRIS-risk vid långvarig högdos.
- **Förstahandsval vid urträning och delirium:** Dexmedetomidin (Dexdor) (start 0.7 µg/kg/h, titrera 0.2–1.4 µg/kg/h). Påverkar ej andningsdrive!
- **Tillägg vid hyperaktivt delirium och abstinens:** Klonidin (Catapresan) 0.5–2.0 µg/kg/h eller intermittenta doser.
- **Undvik bensodiazepiner** (Midazolam) som rutin – starkt kopplat till långvarigt delirium och förlängd ventilatortid.

---

## 3. Daglig avbrytning av sedering (DSI / Spontaneous Awakening Trial)
- Genomförs varje morgon kl 07:00–08:00 om inga kontraindikationer föreligger.
- Sköterskan pausar sedativa och inväntar spontan reaktion, kontaktbarhet och andningsdrive före läkarond.`
  },
  {
    id: "doc-buk-iap",
    title: "Intraabdominellt Tryck (IAP) & Abdominellt Compartmentsyndrom (ACS)",
    category: "Buk",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Akut",
    isPinned: true,
    tags: ["Buk", "IAP", "Buktryck", "ACS", "Öppen buk", "Urinblåsetryck", "Pankreatit"],
    description: "Mätmetodik för intraabdominellt tryck via urinblåsekateter (KAD). Diagnostik och trappstegsbehandling vid Intra-Abdominal Hypertension (IAH) och Abdominal Compartment Syndrome (ACS).",
    content: `# Intraabdominellt Tryck (IAP) & Abdominellt Compartmentsyndrom

> **Kategori:** Buk | **Målgrupp:** IVA-personal, kirurg- och anestesiläkare  
> **Definition:** Normalt IAP hos kritiskt sjuka: 5–7 mmHg. IAH: IAP ≥ 12 mmHg. ACS: IAP > 20 mmHg med ny organsvikt.

---

## 1. Mätmetod (Bladder Pressure via KAD)
1. Patienten placeras i planläge (supine, 0°).
2. Spola in **20–25 ml rumstempererad NaCl 0.9%** i urinblåsan via trevägskran på KAD.
3. Nollställ tryckgivaren vid **symfysens övre kant (eller iliac crest i mittaxillarlinjen)**.
4. Avläs trycket i slutet av expirationen (end-expiration).

---

## 2. Gradering av IAH (Intra-Abdominal Hypertension)
- **Grad I:** IAP 12–15 mmHg
- **Grad II:** IAP 16–20 mmHg
- **Grad III:** IAP 21–25 mmHg
- **Grad IV:** IAP > 25 mmHg

> ⚠️ **Abdominellt Compartmentsyndrom (ACS):**  
> Ihållande IAP > 20 mmHg associerat med **nytt eller progredierande organsvikt** (t.ex. oliguri, minskad lungcompliance / höga topptryck, hypotension).

---

## 3. Handläggning och Åtgärdstrappa
1. **Evakuering av intraluminalt innehåll:** Ventrikelsond (V-sond) med aktiv aspiration, rektalsond, laxering/lavemang.
2. **Avlasta bukväggen:** Fördjupa analgosedering, adekvat smärtlindring, överväg muskelrelaxantia (Esmeron) vid refraktärt tryck.
3. **Optimera vätskebalans:** Undvik överresuscitation! Forcera negativ balans med diuretika eller CRRT ultrafiltration om hemodynamiskt stabilt.
4. **Kirurgisk dekompression (Laparostomi / Öppen buk):** Omedelbar kontakt med kirurgjour vid ACS som ej svarar på medicinsk dekompression.`
  },
  {
    id: "doc-infektion-sepsis",
    title: "Sepsis-3 & Septisk Chock – Empirisk Antibiotikaterapi och Akutprovtagning",
    category: "Infektion",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Akut",
    isPinned: true,
    tags: ["Infektion", "Sepsis", "Septisk chock", "Antibiotika", "Blododling", "Laktat", "Prokalcitonin"],
    description: "Evidensbaserad rutin för handläggning av misstänkt sepsis och septisk chock på IVA Östra. Timme 1-åtgärder, blododlingar, laktatuppföljning och empiriska antibiotikaval.",
    content: `# Sepsis-3 & Septisk Chock – Handläggning & Antibiotikaval

> **Kategori:** Infektion | **Målgrupp:** IVA-personal och infektionskonsult  
> **Tidsmål:** Antibiotika inom 1 timme vid septisk chock!

---

## 1. Timme 1-paketet (Sepsis Resuscitation Bundle)
1. **Mät P-Laktat:** Upprepa varannan timme tills normalisering (< 2.0 mmol/L).
2. **Ta odlingar FÖRE antibiotikastart:**
   - Blododling x 2 (aerob + anaerob från minst två separata insticksställen/infarter).
   - Urinodling, sputum/NPH, sårodling, dränvätska vid misstänkt fokus.
3. **Bredspektrumantibiotika i.v.:** Starta inom 60 minuter.
4. **Vätskebolus:** Ringer-Acetat 30 ml/kg vid hypotension (MAP < 65) eller laktat ≥ 4.0 mmol/L.
5. **Vasopressor:** Noradrenalin titreras för att hålla **MAP ≥ 65 mmHg**.

---

## 2. Empiriska Antibiotikaval (Vuxen, IVA Östra)
| Misstänkt Fokus | Förstahandsval | Tillägg vid Septisk Chock / Neutropeni |
|:---|:---|:---|
| **Okänt fokus / Svår sepsis** | Piperacillin/Tazobactam 4g x 4 | + Gentamicin 5–7 mg/kg som engångsdos |
| **Bukaort / Peritonit** | Meropenem 1g x 3 (infusionstid 3h) | + Gentamicin 5 mg/kg eller Metronidazol |
| **Svår Samhällsförvärvad Pneumoni** | Bensylpenicillin 3g x 4 + Moxifloxacin | el. Cefotaxim 2g x 3 + Erytromycin 1g x 3 |
| **Nosokomial / VAP** | Meropenem 1g x 3 el. Pip/Tazo 4g x 4 | + Amikacin vid hög resistensrisk |
| **Urosepsis** | Cefotaxim 2g x 3 el. Pip/Tazo 4g x 3 | + Gentamicin 5–7 mg/kg x 1 |

---

## 3. Källkontroll (Source Control)
Identifiera och dränera abscesser, avlägsna infekterade katetrar (CVK, dialyskatetrar) och utför akut laparotomi vid tarmischemi eller perforation senast inom 6–12 timmar.`
  },
  {
    id: "doc-gyn-preeklampsi",
    title: "Svår Preeklampsi, Eklampsi & HELLP-syndrom på IVA",
    category: "Gynekologi",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Akut",
    isPinned: true,
    tags: ["Gynekologi", "Preeklampsi", "Eklampsi", "HELLP", "Magnesiumsulfat", "Trandate", "Obstetrik"],
    description: "Klinisk riktlinje för handläggning av den obstetriska intensivvårdspatienten. Blodtryckskontroll, krampprofylax med Magnesiumsulfat, koagulationsövervakning och förlossningsplanering.",
    content: `# Svår Preeklampsi, Eklampsi & HELLP-syndrom

> **Kategori:** Gynekologi | **Målgrupp:** IVA-team och förlossningsjour  
> **Huvudfokus:** Blodtryckssänkning, krampprofylax med MgSO4 och fosterövervakning.

---

## 1. Definitioner & Varningstecken
- **Svår preeklampsi:** Blodtryck ≥ 160/110 mmHg och/eller tecken på organsvikt (trombocytopeni, ALAT/ASAT-stegring, kreatininstegring, huvudvärk, synstörning, epigastralgier).
- **HELLP:** Hemolysis (s-haptoglobin ↓, LD ↑), Elevated Liver enzymes (ASAT/ALAT ↑), Low Platelets (TPK < 100 x 10⁹/L).
- **Eklampsi:** Tonisk-kloniska kramper hos preeklamptisk patient utan annan känd orsak.

---

## 2. Krampprofylax & Kramphävning (Magnesiumsulfat)
- **Laddningsdos:** Magnesiumsulfat (Addex-Magnesium) **4 g (16 mmol)** i.v. under 10–15 minuter.
- **Underhållsdos:** 1–2 g/timme (4–8 mmol/h) som kontinuerlig infusion i 24 timmar post partum.
- **Antidot vid överdosering (andningsdepression, upphävda senreflexer):**  
  **Kalciumglukonat 10%** 10 ml i.v. under 3–5 minuter.

---

## 3. Blodtrycksbehandling
- **Målblodtryck:** Systoliskt 140–150 mmHg, Diastoliskt 90–100 mmHg.
- **Labetalol (Trandate):** 20–50 mg i.v. långsamt under 2 minuter, kan upprepas var 10:e min till max 200 mg, eller infusion 10–50 mg/h.
- **Hydralazin (Apresolin):** 5–10 mg i.v. långsamt, upprepas efter 20 min vid behov.`
  },
  {
    id: "doc-avslut-palliation",
    title: "Avbrytande / Avslutande av Livsuppehållande Behandling & Palliation på IVA",
    category: "Avslut",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Rutin",
    isPinned: true,
    tags: ["Avslut", "Palliation", "Brytpunkt", "Etik", "Livets slutskede", "Närstående", "Symtomlindring"],
    description: "Klinisk och etisk vägledning vid ställningstagande till att avstå från eller avbryta livsuppehållande behandling på IVA. Dokumentation, brytpunktssamtal, extubation och symtomkontroll.",
    content: `# Avslutande av Livsuppehållande Behandling & Palliation på IVA

> **Kategori:** Avslut | **Målgrupp:** IVA-läkare, sjuksköterskor och kurator  
> **Etisk princip:** Göra gott, icke skada och lindra lidande när kurativ intensivvård inte längre gagnar patienten.

---

## 1. Beslutsprocess & Dokumentation
1. **Medicinskt beslut:** Fattas av patientansvarig specialistläkare efter diskussion i vårdteamet (inklusive specialistsjuksköterska och ev. konsulter).
2. **Brytpunktssamtal med närstående:**
   - Genomförs i lugnt samtalsrum.
   - Förklara sakligt den medicinska prognosen och varför fortsatt livsuppehållande behandling inte längre gagnar patienten utan endast förlänger dödsprocessen.
   - Klargör att beslutet är medicinskt och inte vilar på anhörigas axlar.
3. **Dokumentation i journal:** Tydlig anteckning med rubrik *"Ställningstagande till livsuppehållande behandling"* med deltagare, skäl, ordinationer och plan.

---

## 2. Symtomlindring (De 4 hörnstenarna i palliativ vård)
- **Smärta & Andnöd:** Morfin eller Oxykodon som kontinuerlig infusion och vb-doser.
- **Ångest & Oro:** Midazolam kontinuerlig infusion (1–5 mg/h) eller injektion 1–2.5 mg vb.
- **Rassel / Rosslighet:** Robinul (Glykopyrron) 0.2 mg i.v. eller Buscopan.
- **Illamående:** Haldol 0.5–1 mg i.v.

---

## 3. Praktisk Nedtrappning vid Sängkant
- Sänk FiO2 till 0.21 och avveckla inotropa/vasoaktiva dropp.
- Säkerställ fullgod analgosedering INNAN extubation genomförs.
- Stäng av monitorlarm och skapa en värdig, lugn och fridfull miljö för de närstående.`
  },
  {
    id: "doc-donation-dcd-dbd",
    title: "Organdonationsprocessen på IVA (DBD & DCD) – Rutin och Checklista",
    category: "Donation",
    dateAdded: "2026-10-14T08:00:00Z",
    priority: "Riktlinje",
    isPinned: true,
    tags: ["Donation", "DBD", "DCD", "Organdonation", "Transplantation", "Samtycke", "Organbevarande"],
    description: "Handläggning av potentiell organdonator på IVA. Fastställande av total hjärninfarkt (DBD), kontrollerad donation efter cirkulationsstillestånd (DCD), samtyckesutredning och organbevarande behandling.",
    content: `# Organdonationsprocessen på IVA (DBD & DCD)

> **Kategori:** Donation | **Målgrupp:** Donationsansvarig läkare (DAL), donationsansvarig sjuksköterska (DAS) och IVA-team  
> **Regional samordnare:** Transplantationskoordinator SU/Sahlgrenska dygnet runt.

---

## 1. Identifiering av Potentiell Donator
- Patient med svår primär eller sekundär hjärnskada där beslut fattats om att avbryta livsuppehållande behandling.
- **Kontakta Transplantationskoordinator:** Kontakta tidigt för avstämning och förberedelse, redan innan samtal med anhöriga om donation.

---

## 2. Två Donatortyper
1. **DBD (Donation after Brain Death):**
   - Misstanke om total hjärninfarkt under pågående ventilatorbehandling.
   - Fastställs med två kliniska neurologiska undersökningar (med minst 2 timmars intervall) eller konfirmerande cerebral angiografi.
2. **DCD (Donation after Circulatory Death):**
   - För patienter där beslut fattats om att avbryta livsuppehållande behandling och där hjärtstillestånd förväntas inom rimlig tid (< 2–3 timmar) efter behandlingsavslut.
   - Behandlingsavslutet sker kontrollerat på IVA. Efter 5 minuters bekräftad cirkulationsstillestånd (no-touch period) konstateras döden.

---

## 3. Utredning av Donationsvilja
- Kontrollera Donationsregistret (Socialstyrelsen).
- Samtal med närstående för att utreda patientens inställning till organdonation. Respektera patientens förmodade vilja.

---

## 4. Organbevarande Behandling (Intensivvård för Donatorn)
- **MAP:** Håll MAP 65–80 mmHg (Noradrenalin och ev. Vasopressin vid diabetes insipidus).
- **Elektrolyter & Urinmätning:** Korrigera hypernatremi vid diabetes insipidus med Minirin (Desmopressin) 1–4 µg i.v.
- **Normotermi:** Håll temperatur 36–37.5 °C med aktiv värmetäcke.
- **Ventilation:** Lungprotektiv ventilation med PEEP 8–10 cmH2O och rekrytering före uttag.`
  }
];

export const SAMPLE_DOCUMENTS = DEFAULT_DOCUMENTS;

