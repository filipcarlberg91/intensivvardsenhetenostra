import React, { useState, useEffect, useMemo } from 'react';
import { IVA_FLUIDS_DATA, ROSE_PHASES, IVA_BLOOD_PRODUCTS_DATA } from '../data/clinicalData';
import { SearchIcon } from '../components/Icons';

export const FluidBalanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ostra_model' | 'fluids' | 'blood' | 'rose'>('ostra_model');

  // ==========================================
  // PATIENTUPPGIFTER (Från Östra Excel 2.2)
  // ==========================================
  const [gender, setGender] = useState<'Man' | 'Kvinna'>(() => {
    return (localStorage.getItem('iva_ostra_gender') as 'Man' | 'Kvinna') || 'Man';
  });
  const [age, setAge] = useState<number>(() => {
    return parseFloat(localStorage.getItem('iva_ostra_age') || '58') || 58;
  });
  const [heightCm, setHeightCm] = useState<number>(() => {
    return parseFloat(localStorage.getItem('iva_ostra_height') || '165') || 165;
  });
  const [arrivalWeight, setArrivalWeight] = useState<number>(() => {
    return parseFloat(localStorage.getItem('iva_ostra_arr_weight') || '67.3') || 67.3;
  });
  const [currentWeightTBW, setCurrentWeightTBW] = useState<number>(() => {
    return parseFloat(localStorage.getItem('iva_ostra_tbw') || '65.0') || 65.0;
  });

  // ==========================================
  // ÖNSKAD BALANS & KLINISKA INSTÄLLNINGAR
  // ==========================================
  const [targetBalance, setTargetBalance] = useState<number>(() => {
    const stored = localStorage.getItem('iva_ostra_target_balance');
    return stored !== null ? parseFloat(stored) : -500;
  });

  const [hasPerspiratio, setHasPerspiratio] = useState<boolean>(false);
  const [bodyTemp, setBodyTemp] = useState<number>(38.0);
  const [ventilatorHours, setVentilatorHours] = useState<number>(24);
  const [hfnoHours, setHfnoHours] = useState<number>(0);

  // Nutrition & Metabola mål
  const [energyTargetPerKg, setEnergyTargetPerKg] = useState<number>(25); // kcal/kg/dygn
  const [proteinTargetPerKg, setProteinTargetPerKg] = useState<number>(1.3); // g/kg/dygn
  const [crrtCitrate, setCrrtCitrate] = useState<boolean>(false);
  const [citrateKcalExtra, setCitrateKcalExtra] = useState<number>(0);

  // ==========================================
  // PLANERAD VÄTSKETILLFÖRSEL (VÄTSKA IN - ML)
  // ==========================================
  const [vasoactive, setVasoactive] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_vaso');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Noradrenalin 0,1 mg/ml': 61,
      'Adrenalin 0,05 mg/ml': 0,
      'Argipressin 0,4 E/ml': 0,
      'Dobutamin 2 mg/ml': 0,
      'Fenylefrin 0,1 mg/ml': 0,
      'Glyceryltrinitrat 1 mg/ml': 0,
      'Milrinon 0,2 mg/ml': 0,
      'Terlipressin 0,2 mg/ml': 0,
    };
  });

  const [sedatives, setSedatives] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_sed');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Propofol 20 mg/ml': 200,
      'Remifentanil 50 µg/ml': 182,
      'Fentanyl 50 µg/ml': 20,
      'Klonidin 15 µg/ml': 19,
      'Dexmedetomidin 8 µg/ml': 0,
      'Ketamin 10 mg/ml': 0,
      'Midazolam 1 mg/ml': 0,
      'Morfin 1 mg/ml': 0,
      'Oxikodon 1 mg/ml': 0,
      'Rokuronium 10 mg/ml': 0,
      'EDA (Ropivakain 2 mg/ml)': 0,
    };
  });

  const [antimicrobial, setAntimicrobial] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_anti');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Piperacillin/tazobactam': 60,
      'Vancomycin': 0,
      'Meropenem': 0,
      'Cefotaxim': 0,
      'Anidulafungin (ECALTA)': 0,
      'Aciklovir': 0,
    };
  });

  const [otherDrugs, setOtherDrugs] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {
      'Kaliumklorid 1 mmol/ml': 33,
      'Fosfat (Glycophos / Addex-Fosfat)': 0,
      'Magnesiumsulfat': 0,
      'Levetiracetam (Keppra)': 200,
      'Paracetamol 10 mg/ml': 100,
      'Esomeprazol 0,8 mg/ml': 0,
      'Furosemid 10 mg/ml': 0,
      'Insulin Actrapid 1 E/ml': 0,
      'Burinex': 0,
    };
    try {
      const stored = localStorage.getItem('iva_ostra_other_drugs');
      if (stored) return { ...defaults, ...JSON.parse(stored) };
    } catch (e) {}
    return defaults;
  });

  const [crystalloids, setCrystalloids] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_cryst');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Glukos 50 mg/ml (5%)': 367,
      'Ringer-Acetat': 250,
      'Plasmalyte': 0,
      'Natriumklorid 9 mg/ml': 0,
      'Glukos 100 mg/ml (10%)': 0,
      'Glukos 200 mg/ml (20%)': 0,
      'Smof-Kabiven central': 0,
      'Spolsprutor': 0,
    };
  });

  const [enteral, setEnteral] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_enteral');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Fresubin 2 kcal/ml': 280,
      'Enteral nutrition (EN 1 kcal/ml)': 0,
      'Vatten i sond': 100,
      'Resource Ultra fruit': 0,
      'Katrinplommon': 0,
      'Övrigt p.o.': 0,
    };
  });

  const [proteinPowderG, setProteinPowderG] = useState<number>(0);

  const [colloids, setColloids] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_coll');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Albumin 200 mg/ml (20%)': 0,
      'SAG-M Blod': 0,
      'Plasma': 0,
      'Trombocyter': 0,
    };
  });

  const [otherIn, setOtherIn] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_other_in');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Tryckset (spolvätska, 1 dom = 87 ml)': 87,
      'CRRT, recirkulation (NaCl)': 0,
      'PiCCO, kalibrering (NaCl)': 0,
    };
  });

  // ==========================================
  // UPPSKATTADE FÖRLUSTER (VÄTSKA UT - EXKL. URIN)
  // ==========================================
  const [losses, setLosses] = useState<Record<string, number>>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_losses');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      'Ventrikelsond (aspirat/retention)': 0,
      'Avföring / diarré / stomi': 0,
      'Blödning': 0,
      'Dränage 1': 0,
      'Dränage 2': 0,
      'Dränage 3': 0,
      'Dränage 4': 0,
      'Dränage 5': 0,
      'IHD (hemodialys vätskedragning)': 0,
      'CRRT vätskedragning': 0,
    };
  });

  const [manualPerspiratio, setManualPerspiratio] = useState<number>(0);

  // ==========================================
  // RONDAVSTÄMNINGAR FÖR FAKTISK URIN (KL 12, 18, 24, 06)
  // ==========================================
  const [actualUrine, setActualUrine] = useState<{
    h12: string; // Ackumulerat sedan 06:00 vid kl 12:00
    h18: string; // Ackumulerat vid kl 18:00
    h24: string; // Ackumulerat vid kl 24:00
    h06: string; // Ackumulerat vid kl 06:00 (dygnsavslut)
  }>(() => {
    try {
      const stored = localStorage.getItem('iva_ostra_actual_urine');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return { h12: '', h18: '', h24: '', h06: '' };
  });

  // % Fluid Overload kumulativ balans
  const [foCumulativeL, setFoCumulativeL] = useState<number>(4.2);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // ==========================================
  // SPARA TILL LOCALSTORAGE
  // ==========================================
  useEffect(() => {
    try {
      localStorage.setItem('iva_ostra_gender', gender);
      localStorage.setItem('iva_ostra_age', age.toString());
      localStorage.setItem('iva_ostra_height', heightCm.toString());
      localStorage.setItem('iva_ostra_arr_weight', arrivalWeight.toString());
      localStorage.setItem('iva_ostra_tbw', currentWeightTBW.toString());
      localStorage.setItem('iva_ostra_target_balance', targetBalance.toString());
      localStorage.setItem('iva_ostra_vaso', JSON.stringify(vasoactive));
      localStorage.setItem('iva_ostra_sed', JSON.stringify(sedatives));
      localStorage.setItem('iva_ostra_anti', JSON.stringify(antimicrobial));
      localStorage.setItem('iva_ostra_other_drugs', JSON.stringify(otherDrugs));
      localStorage.setItem('iva_ostra_cryst', JSON.stringify(crystalloids));
      localStorage.setItem('iva_ostra_enteral', JSON.stringify(enteral));
      localStorage.setItem('iva_ostra_coll', JSON.stringify(colloids));
      localStorage.setItem('iva_ostra_other_in', JSON.stringify(otherIn));
      localStorage.setItem('iva_ostra_losses', JSON.stringify(losses));
      localStorage.setItem('iva_ostra_actual_urine', JSON.stringify(actualUrine));
    } catch (e) {}
  }, [
    gender, age, heightCm, arrivalWeight, currentWeightTBW, targetBalance,
    vasoactive, sedatives, antimicrobial, otherDrugs, crystalloids, enteral,
    colloids, otherIn, losses, actualUrine
  ]);

  // ==========================================
  // BERÄKNINGAR: PATIENT & ANTROPOMETRI
  // ==========================================
  const heightM = heightCm / 100;
  // IBW (Devine):
  // IBW (män) = 50 + 0.907 * (längd cm - 152.4)
  // IBW (kvinnor) = 45.5 + 0.907 * (längd cm - 152.4)
  const ibw = useMemo(() => {
    if (heightCm <= 0) return 0;
    const base = gender === 'Man' ? 50 : 45.5;
    const calc = base + 0.907 * (heightCm - 152.4);
    return Math.round(calc * 10) / 10;
  }, [gender, heightCm]);

  // AdjBW: IBW + 0.33 * (TBW - IBW)
  const adjBw = useMemo(() => {
    if (ibw <= 0 || currentWeightTBW <= 0) return 0;
    const calc = ibw + 0.33 * (currentWeightTBW - ibw);
    return Math.round(calc * 10) / 10;
  }, [ibw, currentWeightTBW]);

  // DuBois kroppsyta: 0.007184 * L^0.725 * Vikt^0.425
  const bsa = useMemo(() => {
    if (heightCm <= 0 || currentWeightTBW <= 0) return 0;
    const calc = 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(currentWeightTBW, 0.425);
    return Math.round(calc * 100) / 100;
  }, [heightCm, currentWeightTBW]);

  const bmi = useMemo(() => {
    if (heightM <= 0 || currentWeightTBW <= 0) return 0;
    const calc = currentWeightTBW / (heightM * heightM);
    return Math.round(calc * 10) / 10;
  }, [heightM, currentWeightTBW]);

  // Perspiratio insensibilis: ca 10 ml/kg/dygn bas. Ökar 10% per grad feber över 37. Minskar ca 30% om fuktad ventilator.
  const calculatedPerspiratio = useMemo(() => {
    if (!hasPerspiratio) return 0;
    if (manualPerspiratio > 0) return manualPerspiratio;
    let base = currentWeightTBW * 10; // ml/dygn
    if (bodyTemp > 37) {
      base *= (1 + (bodyTemp - 37) * 0.12);
    }
    if (ventilatorHours > 0) {
      base *= 0.75; // befuktad ventilator sparar vatten
    }
    return Math.round(base);
  }, [hasPerspiratio, manualPerspiratio, currentWeightTBW, bodyTemp, ventilatorHours]);

  // ==========================================
  // BERÄKNINGAR: TOTALT IN
  // ==========================================
  const sumVaso = Object.values(vasoactive).reduce((a, b) => a + (b || 0), 0);
  const sumSed = Object.values(sedatives).reduce((a, b) => a + (b || 0), 0);
  const sumAnti = Object.values(antimicrobial).reduce((a, b) => a + (b || 0), 0);
  const sumOtherDrugs = Object.values(otherDrugs).reduce((a, b) => a + (b || 0), 0);
  const sumCryst = Object.values(crystalloids).reduce((a, b) => a + (b || 0), 0);
  const sumEnteral = Object.values(enteral).reduce((a, b) => a + (b || 0), 0);
  const sumColl = Object.values(colloids).reduce((a, b) => a + (b || 0), 0);
  const sumOtherIn = Object.values(otherIn).reduce((a, b) => a + (b || 0), 0);

  const totalIn = sumVaso + sumSed + sumAnti + sumOtherDrugs + sumCryst + sumEnteral + sumColl + sumOtherIn;
  const inMlKgDay = currentWeightTBW > 0 ? Math.round(totalIn / currentWeightTBW) : 0;

  // ==========================================
  // BERÄKNINGAR: TOTALT UT (ÖVRIGA FÖRLUSTER UTAN URIN)
  // ==========================================
  const sumLosses = Object.values(losses).reduce((a, b) => a + (b || 0), 0) + calculatedPerspiratio;

  // ==========================================
  // BERÄKNING AV DIURESMÅL (KÄRNAN I ANVÄNDARENS BEGÄRAN)
  // Önskad Balans = In - (Diuresmål + Ut_övrigt)
  // => Diuresmål = In - Ut_övrigt - Önskad Balans
  // ==========================================
  const targetUrineDaily = Math.round(totalIn - sumLosses - targetBalance);

  // Timdiures 06-06 (okorrigerat dygnsgenomsnitt)
  const hourlyTargetAverage = Math.round(targetUrineDaily / 24);
  const hourlyTargetMlKgAverage = currentWeightTBW > 0 ? (hourlyTargetAverage / currentWeightTBW).toFixed(2) : '0';

  // Dag / Kväll vs Natt profil enligt Östra IVA standard:
  // Kl 06-22 (16h) är aktivare fas (~60-65% av dygnsurinen)
  // Kl 22-06 (8h) är nattfas
  // I Östra arket: Dygnsmål 2459 ger kl 06-22 = 118 ml/h, kl 22-06 = 72 ml/h!
  // Ratio 118 / 72 ≈ 1.64. Exakt formel: 16*R_day + 8*R_night = Target, R_day ≈ 1.638 * R_night.
  // 16*(1.638*R_night) + 8*R_night = 34.2 * R_night = Target => R_night = Target / 34.2
  const hourlyNight = Math.round(targetUrineDaily / 34.2);
  const hourlyDay = Math.round(hourlyNight * 1.638);

  // Ackumulerade delmål vid rondtiderna:
  // Kl 12:00: 6 timmar dagdiures = 6 * hourlyDay
  // Kl 18:00: 12 timmar dagdiures = 12 * hourlyDay
  // Kl 24:00: 16 timmar dag + 2 timmar natt = 16*hourlyDay + 2*hourlyNight
  // Kl 06:00: 24 timmar = targetUrineDaily
  const targetCheckpoints = {
    h12: Math.round(6 * hourlyDay),
    h18: Math.round(12 * hourlyDay),
    h24: Math.round(16 * hourlyDay + 2 * hourlyNight),
    h06: targetUrineDaily,
  };

  // ==========================================
  // FAKTISK UPPFÖLJNING & JUSTERAT DIURESMÅL
  // ==========================================
  const act12 = actualUrine.h12 ? parseFloat(actualUrine.h12) : null;
  const act18 = actualUrine.h18 ? parseFloat(actualUrine.h18) : null;
  const act24 = actualUrine.h24 ? parseFloat(actualUrine.h24) : null;
  const act06 = actualUrine.h06 ? parseFloat(actualUrine.h06) : null;

  // Senaste kända ackumulerade urin
  let latestUrineVal = 0;
  let latestHourElapsed = 0;
  if (act06 !== null) { latestUrineVal = act06; latestHourElapsed = 24; }
  else if (act24 !== null) { latestUrineVal = act24; latestHourElapsed = 18; }
  else if (act18 !== null) { latestUrineVal = act18; latestHourElapsed = 12; }
  else if (act12 !== null) { latestUrineVal = act12; latestHourElapsed = 6; }

  const hoursRemaining = 24 - latestHourElapsed;
  const remainingUrineNeeded = Math.max(0, targetUrineDaily - latestUrineVal);
  const adjustedHourlyTarget = hoursRemaining > 0 ? Math.round(remainingUrineNeeded / hoursRemaining) : 0;
  const currentActualBalance = latestHourElapsed > 0
    ? Math.round((totalIn * (latestHourElapsed / 24)) - (sumLosses * (latestHourElapsed / 24)) - latestUrineVal)
    : 0;

  // ==========================================
  // NUTRITION & ENERGI FRÅN VÄTSKORNA (ESPEN & ÖSTRA)
  // ==========================================
  const energyTargetKcal = Math.round(currentWeightTBW * energyTargetPerKg);
  const proteinTargetG = Math.round(currentWeightTBW * proteinTargetPerKg);

  // Kcal från Propofol: 1.1 kcal per ml
  const propofolMl = sedatives['Propofol 20 mg/ml'] || 0;
  const propofolKcal = Math.round(propofolMl * 1.1);
  const propofolFatG = Math.round(propofolMl * 0.1);

  // Kcal från Glukos:
  // Glukos 5% = 200 kcal/L (0.2 kcal/ml), 50 g kolhydrat/L (0.05 g/ml)
  // Glukos 10% = 400 kcal/L (0.4 kcal/ml), 100 g kolhydrat/L (0.1 g/ml)
  // Glukos 20% = 800 kcal/L (0.8 kcal/ml), 200 g kolhydrat/L (0.2 g/ml)
  const g5Ml = crystalloids['Glukos 50 mg/ml (5%)'] || 0;
  const g10Ml = crystalloids['Glukos 100 mg/ml (10%)'] || 0;
  const g20Ml = crystalloids['Glukos 200 mg/ml (20%)'] || 0;
  const glucoseKcal = Math.round(g5Ml * 0.2 + g10Ml * 0.4 + g20Ml * 0.8);
  const glucoseCarbsG = Math.round(g5Ml * 0.05 + g10Ml * 0.1 + g20Ml * 0.2);

  // Enteral Fresubin 2 kcal/ml:
  // 2.0 kcal/ml, 10 g protein per 100 ml (0.1 g/ml), 20.8 g kolhydrat/100ml, 8.6 g fett/100ml
  const fresubinMl = enteral['Fresubin 2 kcal/ml'] || 0;
  const fresubinKcal = Math.round(fresubinMl * 2.0);
  const fresubinProteinG = Math.round(fresubinMl * 0.1);
  const fresubinCarbsG = Math.round(fresubinMl * 0.208);
  const fresubinFatG = Math.round(fresubinMl * 0.086);

  // Standard EN (1 kcal/ml):
  const enStdMl = enteral['Enteral nutrition (EN 1 kcal/ml)'] || 0;
  const enStdKcal = Math.round(enStdMl * 1.0);
  const enStdProteinG = Math.round(enStdMl * 0.04);

  // SmofKabiven central (TPN):
  // ca 1.1 kcal/ml, 0.051 g protein/ml, 0.127 g kolhydrat/ml, 0.038 g fett/ml
  const tpnMl = crystalloids['Smof-Kabiven central'] || 0;
  const tpnKcal = Math.round(tpnMl * 1.1);
  const tpnProteinG = Math.round(tpnMl * 0.051);
  const tpnCarbsG = Math.round(tpnMl * 0.127);
  const tpnFatG = Math.round(tpnMl * 0.038);

  // Citrat vid CRRT
  const citrateKcal = crrtCitrate ? (citrateKcalExtra || 250) : 0;

  // Summering näringsämnen:
  const deliveredKcal = propofolKcal + glucoseKcal + fresubinKcal + enStdKcal + tpnKcal + citrateKcal;
  const deliveredProteinG = fresubinProteinG + enStdProteinG + tpnProteinG + proteinPowderG;
  const deliveredCarbsG = glucoseCarbsG + fresubinCarbsG + tpnCarbsG;
  const deliveredFatG = propofolFatG + fresubinFatG + tpnFatG;

  const kcalPercent = energyTargetKcal > 0 ? Math.round((deliveredKcal / energyTargetKcal) * 100) : 0;
  const proteinPercent = proteinTargetG > 0 ? Math.round((deliveredProteinG / proteinTargetG) * 100) : 0;

  // ==========================================
  // FUNKTION FÖR ATT LADDA IN BILDENS EXEMPEL
  // ==========================================
  const loadPhotoPreset = () => {
    setGender('Man');
    setAge(58);
    setHeightCm(165);
    setArrivalWeight(67.3);
    setCurrentWeightTBW(65.0);
    setTargetBalance(-500);
    setHasPerspiratio(false);
    setBodyTemp(38.0);
    setVentilatorHours(24);
    setEnergyTargetPerKg(25);
    setProteinTargetPerKg(1.3);

    setVasoactive({
      'Noradrenalin 0,1 mg/ml': 61,
      'Adrenalin 0,05 mg/ml': 0,
      'Argipressin 0,4 E/ml': 0,
      'Dobutamin 2 mg/ml': 0,
      'Fenylefrin 0,1 mg/ml': 0,
      'Glyceryltrinitrat 1 mg/ml': 0,
      'Milrinon 0,2 mg/ml': 0,
      'Terlipressin 0,2 mg/ml': 0,
    });

    setSedatives({
      'Propofol 20 mg/ml': 200,
      'Remifentanil 50 µg/ml': 182,
      'Fentanyl 50 µg/ml': 20,
      'Klonidin 15 µg/ml': 19,
      'Dexmedetomidin 8 µg/ml': 0,
      'Ketamin 10 mg/ml': 0,
      'Midazolam 1 mg/ml': 0,
      'Morfin 1 mg/ml': 0,
      'Oxikodon 1 mg/ml': 0,
      'Rokuronium 10 mg/ml': 0,
      'EDA (Ropivakain 2 mg/ml)': 0,
    });

    setAntimicrobial({
      'Piperacillin/tazobactam': 60,
      'Vancomycin': 0,
      'Meropenem': 0,
      'Cefotaxim': 0,
      'Anidulafungin (ECALTA)': 0,
      'Aciklovir': 0,
    });

    setOtherDrugs({
      'Kaliumklorid 1 mmol/ml': 33,
      'Fosfat (Glycophos / Addex-Fosfat)': 0,
      'Magnesiumsulfat': 0,
      'Levetiracetam (Keppra)': 200,
      'Paracetamol 10 mg/ml': 100,
      'Esomeprazol 0,8 mg/ml': 0,
      'Furosemid 10 mg/ml': 0,
      'Insulin Actrapid 1 E/ml': 0,
      'Burinex': 0,
    });

    setCrystalloids({
      'Glukos 50 mg/ml (5%)': 367,
      'Ringer-Acetat': 250,
      'Plasmalyte': 0,
      'Natriumklorid 9 mg/ml': 0,
      'Glukos 100 mg/ml (10%)': 0,
      'Glukos 200 mg/ml (20%)': 0,
      'Smof-Kabiven central': 0,
      'Spolsprutor': 0,
    });

    setEnteral({
      'Fresubin 2 kcal/ml': 280,
      'Enteral nutrition (EN 1 kcal/ml)': 0,
      'Vatten i sond': 100,
      'Resource Ultra fruit': 0,
      'Katrinplommon': 0,
      'Övrigt p.o.': 0,
    });

    setColloids({
      'Albumin 200 mg/ml (20%)': 0,
      'SAG-M Blod': 0,
      'Plasma': 0,
      'Trombocyter': 0,
    });

    setOtherIn({
      'Tryckset (spolvätska, 1 dom = 87 ml)': 87,
      'CRRT, recirkulation (NaCl)': 0,
      'PiCCO, kalibrering (NaCl)': 0,
    });

    setLosses({
      'Ventrikelsond (aspirat/retention)': 0,
      'Avföring / diarré / stomi': 0,
      'Blödning': 0,
      'Dränage 1': 0,
      'Dränage 2': 0,
      'Dränage 3': 0,
      'Dränage 4': 0,
      'Dränage 5': 0,
      'IHD (hemodialys vätskedragning)': 0,
      'CRRT vätskedragning': 0,
    });

    setActualUrine({ h12: '700', h18: '1400', h24: '', h06: '' });
  };

  const resetAll = () => {
    setVasoactive((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setSedatives((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setAntimicrobial((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setOtherDrugs((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setCrystalloids((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setEnteral((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setColloids((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setOtherIn((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setLosses((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, 0])));
    setActualUrine({ h12: '', h18: '', h24: '', h06: '' });
  };

  // Helper för redigering av rader
  const handleMapChange = (
    setter: React.Dispatch<React.SetStateAction<Record<string, number>>>,
    key: string,
    valStr: string
  ) => {
    const val = parseInt(valStr, 10) || 0;
    setter((prev) => ({ ...prev, [key]: val }));
  };

  // Filtrering av vätskor och blodprodukter
  const filteredFluids = IVA_FLUIDS_DATA.filter(
    (fl) =>
      fl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.electrolytes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fl.primaryUse.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlood = IVA_BLOOD_PRODUCTS_DATA.filter(
    (bp) =>
      bp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.effectPerUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.indications.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const fluidOverloadPct = arrivalWeight > 0 ? ((foCumulativeL / arrivalWeight) * 100).toFixed(1) : '0';

  return (
    <div className="fluid-balance-view-container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '1rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Sektionshuvud */}
      <div
        className="section-header-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.4rem' }}>💧</span>
              <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Vätskebalans & Diuresmål (IVA Östra 2.2)
              </h1>
              <span style={{ background: '#d1fae5', color: '#059669', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                Delade dokument Östra
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Fyll i tillförsel och förluster – kalkylatorn räknar automatiskt ut nödvändigt diuresmål (ml/dygn & ml/h) för att uppnå din valda vätskebalans.
            </p>
          </div>

          {/* Flikväljare */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('ostra_model')}
              style={{
                border: 'none',
                background: activeTab === 'ostra_model' ? '#ffffff' : 'transparent',
                color: activeTab === 'ostra_model' ? '#0284c7' : '#64748b',
                fontWeight: 800,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'ostra_model' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📊 Östra Kalkylator
            </button>
            <button
              onClick={() => setActiveTab('fluids')}
              style={{
                border: 'none',
                background: activeTab === 'fluids' ? '#ffffff' : 'transparent',
                color: activeTab === 'fluids' ? '#0284c7' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'fluids' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🧪 Infusionsvätskor
            </button>
            <button
              onClick={() => setActiveTab('blood')}
              style={{
                border: 'none',
                background: activeTab === 'blood' ? '#ffffff' : 'transparent',
                color: activeTab === 'blood' ? '#0284c7' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'blood' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🩸 Blodprodukter
            </button>
            <button
              onClick={() => setActiveTab('rose')}
              style={{
                border: 'none',
                background: activeTab === 'rose' ? '#ffffff' : 'transparent',
                color: activeTab === 'rose' ? '#0284c7' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'rose' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🌹 ROSE-Modellen
            </button>
          </div>
        </div>
      </div>

      {/* =============================================================== */}
      {/* 1. HUVUDVY: ÖSTRA KALKYLATORN & DIURESMÅL                        */}
      {/* =============================================================== */}
      {activeTab === 'ostra_model' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* TOPP-BANNER MED DIURESMÅLET (ALLTID SYNLIGT & CENTRAL RESUMÉ) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
              border: '1px solid #334155',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <span style={{ background: '#0284c7', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '6px', textTransform: 'uppercase' }}>
                  Beräknat Diuresmål (24h)
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.5px' }}>
                    {targetUrineDaily} ml
                  </span>
                  <span style={{ fontSize: '1rem', color: '#94a3b8' }}>
                    för att nå önskad dygnsbalans på <strong style={{ color: targetBalance < 0 ? '#34d399' : '#f87171' }}>{targetBalance > 0 ? `+${targetBalance}` : targetBalance} ml</strong>
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                  Formel: <strong>Tillförsel ({totalIn} ml) - Förluster ({sumLosses} ml) - Målbalans ({targetBalance} ml) = {targetUrineDaily} ml</strong>
                </div>
              </div>

              {/* Mallknappar */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={loadPhotoPreset}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.4)',
                  }}
                  title="Laddar in exakt patientfallet från Excel-bilden (65 kg, Noradrenalin, Fresubin, -500 ml balans)"
                >
                  📷 Ladda exempel (från fotot)
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  style={{
                    background: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Rensa
                </button>
              </div>
            </div>

            {/* TIMDIURESNYCKLAR & KLOCKSLAG ENLIGT BILDEN */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Snitt kl 06–06</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>{hourlyTargetAverage} ml/h</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{hourlyTargetMlKgAverage} ml/kg/h</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Kl 06–22 (Dag/Kväll)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#a7f3d0' }}>{hourlyDay} ml/h</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Aktiv diuresfas</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Kl 22–06 (Natt)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fef08a' }}>{hourlyNight} ml/h</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Nattprofil</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Mål Kl 12:00</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e0f2fe' }}>{targetCheckpoints.h12} ml</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ackumulerat lunch</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Mål Kl 18:00</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e0f2fe' }}>{targetCheckpoints.h18} ml</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ackumulerat rond</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>Mål Kl 24:00</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e0f2fe' }}>{targetCheckpoints.h24} ml</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Ackumulerat midnatt</div>
              </div>
            </div>

            {/* LIVE UPPFÖLJNING & JUSTERING OM DATA MATATS IN */}
            {latestHourElapsed > 0 && (
              <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(2, 132, 199, 0.25)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                    📊 AKTUELLT STATUS EFTER {latestHourElapsed} TIMMAR:
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#ffffff' }}>
                    Inrapporterad urin: <strong>{latestUrineVal} ml</strong> • Beräknad netto-balans just nu: <strong>{currentActualBalance > 0 ? `+${currentActualBalance}` : currentActualBalance} ml</strong>
                  </div>
                </div>
                {hoursRemaining > 0 && (
                  <div style={{ background: '#0284c7', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 800 }}>
                    Korrigerat timdiuresmål: {adjustedHourlyTarget} ml/h ({hoursRemaining} timmar kvar)
                  </div>
                )}
              </div>
            )}
          </div>

          {/* TRE-KOLUMNERS LAYOUT PRECIS SOM I EXCEL ONLINE ÖSTRA (RESPONSIV FÖR MOBIL) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '1.25rem' }}>

            {/* ======================================================= */}
            {/* VÄNSTER KOLUMN: PATIENTUPPGIFTER & ÖNSKAD BALANS         */}
            {/* ======================================================= */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  👤 Patientuppgifter
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bas & Mått</span>
              </div>

              {/* Kön & Ålder */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Kön</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Man' | 'Kvinna')}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="Man">Man</option>
                    <option value="Kvinna">Kvinna</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Ålder</label>
                  <input
                    type="number"
                    value={age || ''}
                    onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Längd & Vikter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Längd (cm / m)</label>
                  <input
                    type="number"
                    value={heightCm || ''}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    placeholder="165"
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{(heightCm / 100).toFixed(2)} m</span>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Ankomstvikt (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={arrivalWeight || ''}
                    onChange={(e) => setArrivalWeight(parseFloat(e.target.value) || 0)}
                    placeholder="67.3"
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1' }}>
                  Aktuell kroppsvikt (TBW kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentWeightTBW || ''}
                  onChange={(e) => setCurrentWeightTBW(parseFloat(e.target.value) || 0)}
                  placeholder="65.0"
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1.5px solid #0284c7', fontWeight: 800, fontSize: '1rem', background: '#f0f9ff' }}
                />
              </div>

              {/* Beräknade mått (IBW, AdjBW, BSA, BMI) */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Idealvikt (IBW):</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{ibw} kg</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Justerad vikt (AdjBW):</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{adjBw} kg</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Kroppsyta (BSA):</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{bsa} m²</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>BMI:</span>
                  <div style={{ fontWeight: 800, color: '#0f172a' }}>{bmi} kg/m²</div>
                </div>
              </div>

              {/* =================================================== */}
              {/* ÖNSKAD BALANS (HIGHLIGHTAD INPUT SOM I EXCEL-BILDEN) */}
              {/* =================================================== */}
              <div style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', padding: '0.85rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>🎯 Önskad Balans (mL)</span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', background: '#d1fae5', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    Styr diuresmålet
                  </span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <input
                    type="number"
                    step="50"
                    value={targetBalance}
                    onChange={(e) => setTargetBalance(parseFloat(e.target.value) || 0)}
                    style={{
                      flex: 1,
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1.5px solid #059669',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                      color: targetBalance < 0 ? '#047857' : targetBalance > 0 ? '#b91c1c' : '#0f172a',
                      background: '#ffffff',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#065f46' }}>mL</span>
                </div>

                {/* Snabbval för önskad balans */}
                <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {[-1000, -500, 0, 500].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setTargetBalance(b)}
                      style={{
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #a7f3d0',
                        background: targetBalance === b ? '#059669' : '#ffffff',
                        color: targetBalance === b ? '#ffffff' : '#065f46',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {b > 0 ? `+${b}` : b} ml
                    </button>
                  ))}
                </div>
              </div>

              {/* KLINISKA PARAMETRAR: TEMPERATUR & VENTILATOR */}
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#334155' }}>Perspiratio insensibilis:</span>
                  <button
                    type="button"
                    onClick={() => setHasPerspiratio(!hasPerspiratio)}
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: hasPerspiratio ? '#0284c7' : '#ffffff',
                      color: hasPerspiratio ? '#ffffff' : '#475569',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                    }}
                  >
                    {hasPerspiratio ? 'Ja (Aktiv)' : 'Nej'}
                  </button>
                </div>

                {hasPerspiratio && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Beräknad perspiratio:</span>
                    <strong>{calculatedPerspiratio} ml/dygn</strong>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>Kroppstemp (°C)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bodyTemp}
                      onChange={(e) => setBodyTemp(parseFloat(e.target.value) || 37.0)}
                      style={{ width: '100%', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>Ventilator (h/dygn)</label>
                    <input
                      type="number"
                      value={ventilatorHours}
                      onChange={(e) => setVentilatorHours(parseInt(e.target.value, 10) || 0)}
                      style={{ width: '100%', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                    />
                  </div>
                </div>
              </div>

              {/* NUTRITIONSÖVERSIKT (INTEGRERAD FRÅN EXCEL-BILDEN) */}
              <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400e', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>🥣 Energi- & Proteinmål</span>
                  <span>ESPEN + Östra</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.65rem' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#78350f' }}>Mål Kalorier ({energyTargetPerKg} kcal/kg):</span>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>{energyTargetKcal} kcal</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#78350f' }}>Mål Protein ({proteinTargetPerKg} g/kg):</span>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#b45309' }}>{proteinTargetG} g</div>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '8px', padding: '0.6rem', border: '1px solid #fef3c7', fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Tillfört energi:</span>
                    <strong>{deliveredKcal} kcal ({kcalPercent}%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span>Tillfört protein:</span>
                    <strong>{deliveredProteinG} g ({proteinPercent}%)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#78350f', borderTop: '1px dashed #fef3c7', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
                    <span>Kolhydrater: {deliveredCarbsG} g</span>
                    <span>Fett: {deliveredFatG} g</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ======================================================= */}
            {/* MITTENKOLUMN: PLANERAD VÄTSKETILLFÖRSEL (VÄTSKA IN)      */}
            {/* ======================================================= */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                  ➕ Planerad Tillförsel (In)
                </h3>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0284c7' }}>
                  Summa: {totalIn} ml ({inMlKgDay} ml/kg)
                </span>
              </div>

              {/* 1. Vasoaktiva läkemedel */}
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Vasoaktiva läkemedel</span>
                  <span>{sumVaso} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(vasoactive).map(([drug, val]) => (
                    <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{drug}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setVasoactive, drug, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Sedativa och analgetika */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sedativa och analgetika</span>
                  <span>{sumSed} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(sedatives).map(([drug, val]) => (
                    <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{drug}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setSedatives, drug, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Antimikrobiella läkemedel */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Antimikrobiella</span>
                  <span>{sumAnti} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(antimicrobial).map(([drug, val]) => (
                    <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{drug}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setAntimicrobial, drug, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Övriga läkemedel */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Övriga läkemedel</span>
                  <span>{sumOtherDrugs} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(otherDrugs).map(([drug, val]) => (
                    <div key={drug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{drug}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setOtherDrugs, drug, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Kristalloider */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kristalloider & Infusioner</span>
                  <span>{sumCryst} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(crystalloids).map(([fluid, val]) => (
                    <div key={fluid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{fluid}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setCrystalloids, fluid, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Enteralt */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Enteral Nutrition & Vätska</span>
                  <span>{sumEnteral} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(enteral).map(([ent, val]) => (
                    <div key={ent} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{ent}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setEnteral, ent, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Kolloider & Blod */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Kolloider & Blod</span>
                  <span>{sumColl} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(colloids).map(([col, val]) => (
                    <div key={col} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{col}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setColloids, col, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Övrigt (Tryckset osv) */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Övrigt Tillfört (Tryckset)</span>
                  <span>{sumOtherIn} ml</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {Object.entries(otherIn).map(([oth, val]) => (
                    <div key={oth} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                      <span style={{ color: '#334155' }}>{oth}</span>
                      <input
                        type="number"
                        value={val || ''}
                        onChange={(e) => handleMapChange(setOtherIn, oth, e.target.value)}
                        placeholder="0"
                        style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ======================================================= */}
            {/* HÖGER KOLUMN: FÖRLUSTER & RONDAVSTÄMNINGAR               */}
            {/* ======================================================= */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b91c1c', margin: 0 }}>
                  ➖ Uppskattade Förluster (Ut)
                </h3>
                <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#dc2626' }}>
                  Summa: {sumLosses} ml
                </span>
              </div>

              {/* Förlustrader */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {Object.entries(losses).map(([lossName, val]) => (
                  <div key={lossName} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                    <span style={{ color: '#334155' }}>{lossName}</span>
                    <input
                      type="number"
                      value={val || ''}
                      onChange={(e) => handleMapChange(setLosses, lossName, e.target.value)}
                      placeholder="0"
                      style={{ width: '70px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'right', fontWeight: 700, fontSize: '0.82rem' }}
                    />
                  </div>
                ))}
                {hasPerspiratio && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', background: '#f8fafc', padding: '0.35rem 0.5rem', borderRadius: '6px' }}>
                    <span style={{ color: '#334155' }}>Perspiratio insensibilis</span>
                    <span style={{ fontWeight: 800, color: '#475569' }}>{calculatedPerspiratio} ml</span>
                  </div>
                )}
              </div>

              {/* RONDAVSTÄMNINGAR: SKRIV IN VAD PATIENTEN HAR KISSAT */}
              <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    🕒 Rondavstämningar (Mata in urin)
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Faktiskt vs Mål</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { key: 'h12' as const, time: 'Kl 12:00', target: targetCheckpoints.h12, val: actualUrine.h12 },
                    { key: 'h18' as const, time: 'Kl 18:00', target: targetCheckpoints.h18, val: actualUrine.h18 },
                    { key: 'h24' as const, time: 'Kl 24:00', target: targetCheckpoints.h24, val: actualUrine.h24 },
                    { key: 'h06' as const, time: 'Kl 06:00', target: targetCheckpoints.h06, val: actualUrine.h06 },
                  ].map((cp) => {
                    const entered = cp.val ? parseFloat(cp.val) : null;
                    const diff = entered !== null ? entered - cp.target : null;

                    return (
                      <div
                        key={cp.key}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '10px',
                          padding: '0.65rem 0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.85rem' }}>
                            {cp.time}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            Mål: <strong style={{ color: '#0284c7' }}>{cp.target} ml</strong>
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="number"
                            value={cp.val}
                            onChange={(e) => setActualUrine((prev) => ({ ...prev, [cp.key]: e.target.value }))}
                            placeholder={`Ackumulerad urin (${cp.target})`}
                            style={{
                              flex: 1,
                              padding: '0.4rem 0.6rem',
                              borderRadius: '6px',
                              border: '1px solid #94a3b8',
                              fontSize: '0.9rem',
                              fontWeight: 800,
                              background: '#fff',
                            }}
                          />
                          <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>ml</span>
                        </div>

                        {diff !== null && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', color: diff >= 0 ? '#15803d' : '#b91c1c' }}>
                            <span>Differens mot mål:</span>
                            <span>{diff >= 0 ? `+${diff} ml` : `${diff} ml`}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* % FLUID OVERLOAD */}
              <div style={{ background: '#f8fafc', borderRadius: '10px', border: '1px solid #cbd5e1', padding: '0.85rem', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    Kumulativ övervätskning (% FO)
                  </span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 800, color: parseFloat(fluidOverloadPct) > 10 ? '#b91c1c' : '#0369a1' }}>
                    {fluidOverloadPct}% FO
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Kumulativ balans (L):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foCumulativeL}
                    onChange={(e) => setFoCumulativeL(parseFloat(e.target.value) || 0)}
                    style={{ width: '60px', padding: '0.25rem 0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', textAlign: 'center', fontWeight: 700, fontSize: '0.8rem' }}
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 2. INFUSIONSVÄTSKOR & TABELL                                     */}
      {/* =============================================================== */}
      {activeTab === 'fluids' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem' }}>
                🧪 Infusionsvätskor & Elektrolytsammansättning
              </h2>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                Jämför osmolaritet, elektrolyter och indikationer för kristalloider och kolloider på IVA.
              </p>
            </div>
            <div style={{ position: 'relative', minWidth: '220px' }}>
              <input
                type="text"
                placeholder="Sök vätska..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
            {filteredFluids.map((fl) => (
              <div key={fl.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0369a1' }}>{fl.name}</h3>
                  <span style={{ fontSize: '0.7rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {fl.category}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '0.5rem' }}>
                  Osmolaritet: <strong>{fl.osmolarity} mOsm/L</strong>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#334155', background: '#ffffff', padding: '0.5rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                  <strong>Elektrolyter:</strong> {fl.electrolytes}
                </div>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  {fl.primaryUse}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 3. BLODPRODUKTER                                                */}
      {/* =============================================================== */}
      {activeTab === 'blood' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            🩸 Blodprodukter & Transfusioner på IVA
          </h2>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
            Transfusionsmål, förväntad effekt per enhet och Massivt Transfusionsprotokoll (MTP 4:4:1).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1rem' }}>
            {filteredBlood.map((bp) => (
              <div key={bp.name} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 800, color: '#e11d48' }}>{bp.name}</h3>
                <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '0.4rem' }}>
                  Volym: <strong>{bp.volumePerUnit}</strong> • Tid: {bp.time}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.45rem', borderRadius: '6px', marginBottom: '0.5rem', fontWeight: 700 }}>
                  Effekt: {bp.effectPerUnit}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                  <strong>Indikationer:</strong> {bp.indications.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =============================================================== */}
      {/* 4. ROSE-MODELLEN                                                */}
      {/* =============================================================== */}
      {activeTab === 'rose' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
            🌹 ROSE-Modellen för Vätsketerapi på IVA
          </h2>
          <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
            Resuscitation, Optimization, Stabilization, Evacuation – strukturerad avtrappning av vätska för att förhindra mortalitetsdrivande kumulativ övervätskning.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem' }}>
            {ROSE_PHASES.map((p) => (
              <div key={p.letter} style={{ background: '#f8fafc', border: `1.5px solid ${p.color}`, borderRadius: '12px', padding: '1.1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 900, color: p.color, textTransform: 'uppercase' }}>{p.letter} – {p.name}</span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.timing}</span>
                </div>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{p.subname}</h3>
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, marginBottom: '0.5rem' }}>
                  Mål: {p.goal}
                </div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Strategi:</strong> {p.fluidStrategy}
                </p>
                <div style={{ fontSize: '0.74rem', background: '#ffffff', padding: '0.45rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <strong>Monitorering:</strong> {p.monitoring}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
