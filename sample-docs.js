/**
 * Intensivvårdsenheten Östra - Avdelningens Rutiner & Styrande PM
 * Samtliga tidigare exempel-PM har raderats enligt användarens begäran.
 * Innehåller nu användarens test-PM för Befuktare F&P 950 under Respiration.
 */

const DEFAULT_DOCUMENTS = [
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
- **Flödesintervall:** 1–600 mL/h (steg om 1 mL/h) | **Volyminerval:** 1–4 000 mL (steg om 1 mL) eller **KONT**.
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
  }
];

const CATEGORIES = [
  { id: "Respiration", name: "Respiration", subtitle: "Ventilator, PEEP, Befuktning, ARDS", color: "#0284c7", colorLight: "#e0f2fe", colorBorder: "#bae6fd", icon: "lungs", description: "Riktlinjer och rutiner för invasiv och icke-invasiv ventilation, befuktning, trakeostomi och ARDS-vård." },
  { id: "Circulation", name: "Circulation", subtitle: "Chock, Inotropa, MAP, Arytmier", color: "#e11d48", colorLight: "#ffe4e6", colorBorder: "#fecdd3", icon: "heartPulse", description: "Hemodynamisk monitorering, chockbehandling, inotropi, vasoaktiva infusioner och arytmihantering." },
  { id: "Nutrition", name: "Nutrition", subtitle: "ESPEN, Enteral, TPN, Kalorier", color: "#d97706", colorLight: "#fef3c7", colorBorder: "#fde68a", icon: "apple", description: "ESPEN-riktlinjer, sondmatning, parenteral nutrition (TPN), ventrikelretention och energimål." },
  { id: "CRRT", name: "CRRT", subtitle: "Dialys, Citrat, Filter, Vätskedrag", color: "#7c3aed", colorLight: "#f3e8ff", colorBorder: "#e9d5ff", icon: "filter", description: "Kontinuerlig njurersättningsterapi, regional citratantikoagulation, filterbyte och vätskebalansering." },
  { id: "Elimination", name: "Elimination", subtitle: "KAD, Diures, Buktryck, Dränage", color: "#059669", colorLight: "#d1fae5", colorBorder: "#a7f3d0", icon: "droplet", description: "Urinmätning, KAD-skötsel, intraabdominellt tryck (IAP), ventrikelsond och bukskötsel." },
  { id: "Omvårdnad", name: "Omvårdnad", subtitle: "Mobilisering, Hud, Munvård, CVK", color: "#0d9488", colorLight: "#ccfbf1", colorBorder: "#99f6e4", icon: "handHeart", description: "Omvårdnadsåtgärder, trycksårsprofylax, munvård på intuberad patient, infarter och sårbehandling." },
  { id: "Anhöriga", name: "Anhöriga", subtitle: "Närstående, Samtal, Krisstöd", color: "#4f46e5", colorLight: "#e0e7ff", colorBorder: "#c7d2fe", icon: "users", description: "Bemötande och stöd till närstående, krisstöd, barn som anhöriga samt samtal vid vård i livets slutskede." }
];

// Gör tillgänglig globalt
if (typeof window !== "undefined") {
  window.DEFAULT_DOCUMENTS = DEFAULT_DOCUMENTS;
  window.CATEGORIES = CATEGORIES;
}

