import { DrugItem, DrugCategory } from '../types';
import { IVA_DRUGS_PART1 } from './drugsDataPart1';
import { IVA_DRUGS_PART2 } from './drugsDataPart2';

export const DRUG_CATEGORIES: DrugCategory[] = [
  'Vasoaktiva & Inotropi',
  'Antiarytmika & Blodtryck',
  'Sedation & Sömn',
  'Analgetika & Opioider',
  'Muskelrelaxantia & Antidoter',
  'Diuretika, Vätska & Elektrolyter',
  'Koagulation & Blödning',
  'PostOp PONV & GI',
  'Respiration, Hormon & Neuro',
  'Antibiotika & Infektion',
];

export const IVA_DRUGS: DrugItem[] = [
  ...IVA_DRUGS_PART1,
  ...IVA_DRUGS_PART2,
];

export const COMPATIBILITY_DATA: Record<string, { status: 'YES' | 'NO' | 'CAUTION'; text: string; details: string }> = {
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
  "noradrenalin+levosimendan": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan samadministreras med katekolaminer i samma skänkel."
  },
  "noradrenalin+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Standard sedation/analgesi vid intuberad IVA-vård."
  },
  "noradrenalin+fentanyl": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat fysikaliskt kompatibla."
  },
  "noradrenalin+alfentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla."
  },
  "noradrenalin+morfin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan ges i samma lumen."
  },
  "noradrenalin+oxikodon": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan ges i samma lumen."
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
  "noradrenalin+midazolam": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Båda har surt pH och är fysikaliskt kompatibla."
  },
  "noradrenalin+esketamin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kompatibla i Y-koppling."
  },
  "noradrenalin+rokuronium": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Surt pH hos båda, kompatibla."
  },
  "noradrenalin+kaliumklorid": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan samadministreras i CVK."
  },
  "noradrenalin+insulin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Vanlig samtidig infusion vid kritisk sjukdom. Observera dock risk för flödesvariation vid bolus."
  },
  "noradrenalin+furosemid": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Kraftig risk för utfällning.",
    details: "Furosemid har högt basiskt pH (~9) medan Noradrenalin kräver surt pH (3-4). Fällning sker omedelbart i slangen. Måste gå i helt separat lumen!"
  },
  "noradrenalin+natriumbikarbonat": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Inaktiverar katekolaminer.",
    details: "Alkalisk bikarbonatlösning inaktiverar Noradrenalin och andra katekolaminer. Ge alltid i separat lumen."
  },
  "noradrenalin+pantoprazol": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Starkt basisk lösning.",
    details: "Pantoprazol (pH ~9-10) orsakar fällning och inaktivering med sura katekolaminer."
  },
  "noradrenalin+tiopental": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Starkt alkaliskt pH (~10.5).",
    details: "Tiopental fäller omedelbart med sura läkemedel."
  },
  "noradrenalin+amiodaron": {
    status: "CAUTION",
    text: "Villkorlig / Försiktighet. Begränsad kompatibilitetsdata.",
    details: "Amiodaron fäller lätt vid pH-förändringar. Rekommenderas att ges i separat skänkel om möjligt."
  },
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
  "propofol+alfentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Stabil TIVA-kombination."
  },
  "propofol+fentanyl": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla i Y-koppling."
  },
  "propofol+dexmedetomidin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla."
  },
  "propofol+klonidin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan samadministreras."
  },
  "propofol+esketamin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Vanlig kombination vid analgosedering."
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
  "propofol+kalciumglukonat": {
    status: "NO",
    text: "INKOMPATIBEL! Divalenta katjoner bryter fettemulsionen.",
    details: "Kalciumjoner kan destabilisera fettdropparna i Propofol (risk för fettemboli)."
  },
  "propofol+insulin": {
    status: "CAUTION",
    text: "Villkorlig / Försiktighet.",
    details: "Risk för osäker absorption i lipidmatrisen. Ge helst i separat lumen."
  },
  "furosemid+amiodaron": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Omedelbar fällning.",
    details: "Amiodaron fäller i basisk miljö. Måste separeras helt."
  },
  "furosemid+milrinon": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning uppstår direkt.",
    details: "Fysisk inkompatibilitet mellan Furosemid och Milrinon."
  },
  "furosemid+dobutamin": {
    status: "NO",
    text: "INKOMPATIBEL! Utfällning.",
    details: "Dobutamin inaktiveras och fäller vid högt pH."
  },
  "furosemid+midazolam": {
    status: "NO",
    text: "INKOMPATIBEL! Midazolam fäller vid pH > 5.",
    details: "Furosemid höjer pH vilket gör att Midazolam förlorar sin vattenlöslighet och fäller ut."
  },
  "furosemid+nicardipin": {
    status: "NO",
    text: "INKOMPATIBEL! Omedelbar fällning.",
    details: "Nicardipin fäller direkt vid kontakt med Furosemid eller basiska vätskor."
  },
  "furosemid+labetalol": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning.",
    details: "Labetalol och Furosemid bildar fällning i Y-koppling."
  },
  "furosemid+esketamin": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning.",
    details: "Ketamin/Esketamin är inkompatibelt med alkaliska Furosemid."
  },
  "furosemid+rokuronium": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning.",
    details: "Rokuronium har surt pH (4) och fäller med Furosemid."
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
  "amiodaron+insulin": {
    status: "CAUTION",
    text: "Villkorlig kompatibilitet.",
    details: "Separera om möjligt."
  },
  "amiodaron+heparin": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Fällning uppstår.",
    details: "Amiodaron och Heparin bildar fällning vid kontakt i kateter/slang."
  },
  "amiodaron+natriumbikarbonat": {
    status: "NO",
    text: "INKOMPATIBEL! Fällning uppstår direkt.",
    details: "Amiodaron fäller omedelbart med natriumbikarbonat."
  },
  "amiodaron+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Dokumenterat kompatibla i Glukos 5%."
  },
  "dexmedetomidin+vasopressin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan ges i samma lumen."
  },
  "dexmedetomidin+remifentanil": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Stabil kombination för multimodal analgosedering."
  },
  "kalciumglukonat+natriumbikarbonat": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Bildar olösligt kalciumkarbonat (kalk)!",
    details: "Total kateterocklusion och kristallutfällning sker omedelbart."
  },
  "kalciumglukonat+fosfat": {
    status: "NO",
    text: "INKOMPATIBEL (EJ BLANDBART)! Bildar olöslig kalciumfosfatfällning!",
    details: "Kalcium (Calcium-Sandoz) och Fosfat (Glycophos / Addex-Fosfat) får ALDRIG samadministreras i samma CVK-skänkel pga risk för kristallutfällning och kateterocklusion/emboli!"
  },
  "kalciumglukonat+natriumglycerofosfat": {
    status: "NO",
    text: "INKOMPATIBEL! Risk för kalciumfosfatutfällning.",
    details: "Kalcium och fosfat i hög koncentration kan fälla ut i slangen."
  },
  "fosfat+kaliumklorid": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Fosfat (Glycophos/Addex-Fosfat) och Kaliumklorid utspädda i NaCl 0,9% eller Glukos 5% är fysikaliskt kompatibla i CVK."
  },
  "fosfat+insulin": {
    status: "YES",
    text: "Kompatibel i Y-koppling.",
    details: "Kan samadministreras vid t.ex. ketoacidos (DKA) eller Refeeding-behandling."
  },
  "fosfat+propofol": {
    status: "NO",
    text: "INKOMPATIBEL! Elektrolytkoncentrat kan bryta fettemulsionen.",
    details: "Propofol är en känslig lipidemulsion och bör ej samadministreras med koncentrerade fosfat-/elektrolytinfusioner."
  },
  "fosfat+magnesiumsulfat": {
    status: "CAUTION",
    text: "Försiktighet (Risk för magnesiumfosfatfällning vid höga koncentrationer).",
    details: "Oorganiskt fosfat (Addex-Fosfat) kan fälla med magnesium. Organiskt fosfat (Glycophos) har högre kompatibilitet, men separera helst i skilda CVK-skänklar."
  },
  "kalciumglukonat+ceftriaxon": {
    status: "NO",
    text: "ABSOLUT KONTRAINDICERAT! Livshotande Ceftriaxon-Kalcium-utfällning.",
    details: "Ceftriaxon bildar olösliga salter med kalcium i blod och kateter. Spola noggrant emellan!"
  },
  "piperacillin-tazobactam+vankomycin": {
    status: "NO",
    text: "INKOMPATIBEL i Y-koppling vid standardkoncentrationer!",
    details: "Tazocin och Vankomycin fäller ut vid samtidig Y-infusion. Ge vid skilda tidpunkter och spola med NaCl emellan, eller använd skilda skänklar."
  }
};

export function getDrugCompatibility(idA: string, idB: string): { status: 'YES' | 'NO' | 'CAUTION'; text: string; details: string } {
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

  const drugA = IVA_DRUGS.find(d => d.id === idA);
  const drugB = IVA_DRUGS.find(d => d.id === idB);

  if (drugA && drugB) {
    const phA = drugA.phCategory || 'neutral';
    const phB = drugB.phCategory || 'neutral';

    // Rule 0: Calcium + Phosphate -> immediate precipitation risk
    if ((phA === 'calcium' && phB === 'phosphate') || (phB === 'calcium' && phA === 'phosphate')) {
      return {
        status: "NO",
        text: "INKOMPATIBEL (EJ BLANDBART)! Kalcium + Fosfat fäller ut!",
        details: "Samadministrering av kalcium och fosfat i samma skänkel ger hög risk för olöslig kalciumfosfatfällning. Måste gå i separata CVK-lumen!"
      };
    }

    // Rule 1: Strongly alkaline (Furosemid, Pantoprazol, Tiopental, Bikarbonat, Levosimendan/Fenytoin) vs Acidic drugs (Catecholamines, Midazolam, Nicardipin, Vancomycin, Amiodarone, Opioids, Rocuronium)
    const isAlkaline = (ph: string) => ph === 'alkaline' || ph === 'bicarbonate';
    const isAcidic = (ph: string) => ph === 'acidic';

    if ((isAlkaline(phA) && isAcidic(phB)) || (isAlkaline(phB) && isAcidic(phA))) {
      const alkName = isAlkaline(phA) ? drugA.name : drugB.name;
      const acidName = isAcidic(phA) ? drugA.name : drugB.name;
      return {
        status: "NO",
        text: "INKOMPATIBEL (pH-konflikt: Basiskt mot Surt)!",
        details: `${alkName} är alkaliskt (högt pH) medan ${acidName} har lågt/surt pH. Samadministrering i samma CVK-skänkel medför hög risk för omedelbar utfällning eller inaktivering. Använd separata skänklar!`
      };
    }

    // Rule 2: Sodium bicarbonate with almost anything vasoactive or calcium
    if (phA === 'bicarbonate' || phB === 'bicarbonate') {
      const other = phA === 'bicarbonate' ? drugB : drugA;
      if (other.phCategory === 'calcium') {
        return {
          status: "NO",
          text: "INKOMPATIBEL! Bildar kalciumkarbonat (kalkfällning)!",
          details: "Natriumbikarbonat och kalciumlösningsmedel fäller omedelbart ut som olösligt kalk i slangen."
        };
      }
      return {
        status: "NO",
        text: "INKOMPATIBEL! Natriumbikarbonat bör gå i separat lumen.",
        details: `Natriumbikarbonat har högt pH och hög jonstyrka vilket riskerar utfällning eller inaktivering av ${other.name}.`
      };
    }

    // Rule 3: Lipid emulsions (Propofol, Clevidipine) with alkaline or electrolyte/calcium concentrates
    if (phA === 'emulsion' || phB === 'emulsion') {
      const emul = phA === 'emulsion' ? drugA : drugB;
      const other = phA === 'emulsion' ? drugB : drugA;
      if (other.phCategory === 'alkaline' || other.phCategory === 'calcium' || other.phCategory === 'phosphate') {
        return {
          status: "NO",
          text: "INKOMPATIBEL! Risk för att fettemulsionen spricker.",
          details: `${emul.name} är en känslig fettemulsion som kan destabiliseras av ${other.name} (risk för droppaggregering/fällning).`
        };
      }
    }

    // Rule 4: Both are acidic catecholamines / standard opioids / sedatives -> generally compatible or caution
    if (phA === 'acidic' && phB === 'acidic') {
      const catA = drugA.category;
      const catB = drugB.category;
      const isCoreIva = (cat: DrugCategory) =>
        cat === 'Vasoaktiva & Inotropi' ||
        cat === 'Sedation & Sömn' ||
        cat === 'Analgetika & Opioider';
      if (isCoreIva(catA) && isCoreIva(catB) && idA !== 'amiodaron' && idB !== 'amiodaron') {
        return {
          status: "YES",
          text: "Kompatibla i Y-koppling (likartat surt pH).",
          details: `Både ${drugA.name} och ${drugB.name} är sura lösningar som normalt är fysikaliskt kompatibla i Y-koppling på IVA. Kontrollera alltid att bärarvätskan (NaCl 0.9% / Glukos 5%) är godkänd för båda.`
        };
      }
    }

    // Rule 5: Beta-lactam antibiotics with catecholamines or heparin/vancomycin
    if (phA === 'antibiotic_beta' || phB === 'antibiotic_beta') {
      return {
        status: "CAUTION",
        text: "Försiktighet vid Y-koppling av betalaktamantibiotika.",
        details: "Betalaktamer (t.ex. Tazocin, Meronem, Cefotaxim, Kloxacillin) bör helst ges i egen skänkel eller med spolning före/efter, och aldrig blandas med vasoaktiva droger i samma skänkel!"
      };
    }

    // Rule 6: Vasoactive drugs safety rule
    if (drugA.category === 'Vasoaktiva & Inotropi' || drugB.category === 'Vasoaktiva & Inotropi') {
      return {
        status: "CAUTION",
        text: "Försiktighet (Vasoaktivt läkemedel i skänkeln)!",
        details: "Undvik att ge intermittenta infusioner eller bolusinjektioner i samma CVK-skänkel som pågående vasoaktiv infusion pga risk för oavsiktlig bolus av vasopressor!"
      };
    }

    // Rule 7: Two neutral drugs
    if (phA === 'neutral' && phB === 'neutral') {
      return {
        status: "YES",
        text: "Fysikaliskt kompatibla vid Y-koppling.",
        details: `${drugA.name} och ${drugB.name} har neutralt pH och ingen känd kemisk utfällningsrisk i Y-koppling med NaCl 0.9%.`
      };
    }
  }

  return {
    status: "CAUTION",
    text: "Begränsade kompatibilitetsdata / Kontrollera lokalt blandbarhetsschema",
    details: "Specifik Y-site studie saknas för denna kombination. Använd separata CVK-skänklar eller spola med NaCl 0.9% före och efter administration."
  };
}
