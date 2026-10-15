import React, { useState, useEffect, useMemo } from 'react';
import { IVA_CALORIE_TABLE, NUTRITION_FORMULAS } from '../data/clinicalData';
import { SearchIcon } from '../components/Icons';

export const NutritionView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calc' | 'formulas' | 'calories' | 'targets'>('calc');

  // ==========================================
  // PATIENTDATA & ANTROPOMETRI (Synkad med Östra 2.2)
  // ==========================================
  const [gender, setGender] = useState<'Man' | 'Kvinna'>(() => {
    return (localStorage.getItem('iva_ostra_gender') as 'Man' | 'Kvinna') || 'Man';
  });
  const [ageStr, setAgeStr] = useState<string>(() => {
    return localStorage.getItem('iva_ostra_age') || '58';
  });
  const [heightStr, setHeightStr] = useState<string>(() => {
    return localStorage.getItem('iva_ostra_height') || '165';
  });
  const [arrivalWeightStr, setArrivalWeightStr] = useState<string>(() => {
    return localStorage.getItem('iva_ostra_arr_weight') || '67.3';
  });
  const [weightStr, setWeightStr] = useState<string>(() => {
    return localStorage.getItem('iva_ostra_tbw') || '65.0';
  });

  // Val av beräkningsvikt för kalorier & protein: 'tbw' (aktuell), 'adjBw' (justerad), 'ibw' (idealvikt)
  const [weightType, setWeightType] = useState<'tbw' | 'adjBw' | 'ibw'>('tbw');

  // ==========================================
  // ESPEN MÅLVÄRDEN
  // ==========================================
  const [energyTargetPerKg, setEnergyTargetPerKg] = useState<number>(25); // kcal/kg/dygn
  const [proteinTargetPerKg, setProteinTargetPerKg] = useState<number>(1.3); // g/kg/dygn

  // ==========================================
  // NÄRINGSKÄLLOR & TILLFÖRSEL (ML ELLER GRAM)
  // ==========================================
  // 1. Sedering (Propofol)
  const [propofolMl, setPropofolMl] = useState<number>(200); // ml/dygn (1.1 kcal/ml, 0.1 g fett/ml)
  const [propofolRateMlH, setPropofolRateMlH] = useState<number>(8);

  // 2. Glukosinfusioner
  const [g5Ml, setG5Ml] = useState<number>(367); // 50 mg/ml (5%): 0.2 kcal/ml, 50 g kolhydrat/L
  const [g10Ml, setG10Ml] = useState<number>(0);  // 100 mg/ml (10%): 0.4 kcal/ml, 100 g kolhydrat/L
  const [g20Ml, setG20Ml] = useState<number>(0);  // 200 mg/ml (20%): 0.8 kcal/ml, 200 g kolhydrat/L

  // 3. Enteral nutrition (Sondnäring)
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('fresubin-2kcal');
  const [sondMl, setSondMl] = useState<number>(280); // ml/dygn
  const [waterMl, setWaterMl] = useState<number>(100); // sondvatten ml/dygn

  // 4. Parenteral nutrition (TPN)
  const [tpnCentralMl, setTpnCentralMl] = useState<number>(0); // SmofKabiven central 1.1 kcal/ml

  // 5. Dialys (CRRT) & Extra protein
  const [citrateKcal, setCitrateKcal] = useState<number>(0);
  const [proteinPowderG, setProteinPowderG] = useState<number>(0); // g rent protein

  // Kaloritabell IVA 343 & sökning
  const [calorieSearch, setCalorieSearch] = useState<string>('');
  const [selectedPortions, setSelectedPortions] = useState<Record<string, number>>({});
  const [formulaSearch, setFormulaSearch] = useState<string>('');

  // Spara till localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iva_ostra_gender', gender);
      localStorage.setItem('iva_ostra_age', ageStr);
      localStorage.setItem('iva_ostra_height', heightStr);
      localStorage.setItem('iva_ostra_arr_weight', arrivalWeightStr);
      localStorage.setItem('iva_ostra_tbw', weightStr);
    } catch (e) {}
  }, [gender, ageStr, heightStr, arrivalWeightStr, weightStr]);

  // Numerisk parsning
  const age = parseFloat(ageStr.replace(',', '.')) || 0;
  const height = parseFloat(heightStr.replace(',', '.')) || 0;
  const arrivalWeight = parseFloat(arrivalWeightStr.replace(',', '.')) || 0;
  const weight = parseFloat(weightStr.replace(',', '.')) || 0; // Aktuell vikt (TBW)

  // Antropometri beräkningar
  const heightM = height / 100;
  const bmi = heightM > 0 && weight > 0 ? (weight / (heightM * heightM)).toFixed(1) : '0';
  const bmiNum = parseFloat(bmi);

  // Ideell kroppsvikt (Devine IBW)
  const ibw = useMemo(() => {
    if (height <= 0) return 0;
    const base = gender === 'Man' ? 50 : 45.5;
    const calc = base + 0.907 * (height - 152.4);
    return Math.round(calc * 10) / 10;
  }, [gender, height]);

  // Justerad beräkningsvikt (AdjBW = IBW + 0.33 * [TBW - IBW])
  const adjBw = useMemo(() => {
    if (ibw <= 0 || weight <= 0) return 0;
    const calc = ibw + 0.33 * (weight - ibw);
    return Math.round(calc * 10) / 10;
  }, [ibw, weight]);

  // DuBois BSA (m²)
  const bsa = useMemo(() => {
    if (height <= 0 || weight <= 0) return 0;
    const calc = 0.007184 * Math.pow(height, 0.725) * Math.pow(weight, 0.425);
    return Math.round(calc * 100) / 100;
  }, [height, weight]);

  // Aktiv beräkningsvikt baserat på användarens val
  const calcWeight = useMemo(() => {
    if (weightType === 'ibw') return ibw > 0 ? ibw : weight;
    if (weightType === 'adjBw') return adjBw > 0 ? adjBw : weight;
    return weight > 0 ? weight : 70;
  }, [weightType, ibw, adjBw, weight]);

  // ==========================================
  // ESPEN MÅLVÄRDEN (TOTALT)
  // ==========================================
  const totalKcalTarget = Math.round(calcWeight * energyTargetPerKg);
  const totalProteinTarget = Math.round(calcWeight * proteinTargetPerKg);

  // Vald sondnäringsprodukt
  const chosenFormula = useMemo(() => {
    return NUTRITION_FORMULAS.find((f) => f.id === selectedFormulaId) || NUTRITION_FORMULAS[0];
  }, [selectedFormulaId]);

  // ==========================================
  // TILLFÖRD NÄRING PER KÄLLA
  // ==========================================
  // 1. Propofol (1.1 kcal/ml, 0.1 g fett/ml)
  const propofolKcal = Math.round(propofolMl * 1.1);
  const propofolFatG = Math.round(propofolMl * 0.1);

  // 2. Glukosinfusioner
  const glucoseKcal = Math.round(g5Ml * 0.2 + g10Ml * 0.4 + g20Ml * 0.8);
  const glucoseCarbsG = Math.round(g5Ml * 0.05 + g10Ml * 0.1 + g20Ml * 0.2);

  // 3. Sondnäring
  const sondEnergyPerMl = chosenFormula.energyDensity || 1.5;
  const sondProteinPerMl = (chosenFormula.proteinDensity || 5.0) / 100;
  const sondCarbsPerMl = ((chosenFormula as any).carbsPer100ml || 15.0) / 100;
  const sondFatPerMl = ((chosenFormula as any).fatPer100ml || 5.0) / 100;

  const sondKcal = Math.round(sondMl * sondEnergyPerMl);
  const sondProteinG = Math.round(sondMl * sondProteinPerMl);
  const sondCarbsG = Math.round(sondMl * sondCarbsPerMl);
  const sondFatG = Math.round(sondMl * sondFatPerMl);
  const sondRateMlH = Math.round(sondMl / 24);

  // 4. Parenteral (SmofKabiven Central: 1.1 kcal/ml, 0.051 g protein, 0.127 g kolhydrat, 0.038 g fett)
  const tpnKcal = Math.round(tpnCentralMl * 1.1);
  const tpnProteinG = Math.round(tpnCentralMl * 0.051);
  const tpnCarbsG = Math.round(tpnCentralMl * 0.127);
  const tpnFatG = Math.round(tpnCentralMl * 0.038);

  // 5. Total tillförd näring
  const totalDeliveredKcal = propofolKcal + glucoseKcal + sondKcal + tpnKcal + citrateKcal;
  const totalDeliveredProteinG = sondProteinG + tpnProteinG + proteinPowderG;
  const totalDeliveredCarbsG = glucoseCarbsG + sondCarbsG + tpnCarbsG;
  const totalDeliveredFatG = propofolFatG + sondFatG + tpnFatG;

  // Icke-nutritionskalorier
  const nonNutrKcal = propofolKcal + glucoseKcal + citrateKcal;
  const nonNutrPercent = totalDeliveredKcal > 0 ? Math.round((nonNutrKcal / totalDeliveredKcal) * 100) : 0;

  // Måluppfyllelse %
  const kcalPercent = totalKcalTarget > 0 ? Math.round((totalDeliveredKcal / totalKcalTarget) * 100) : 0;
  const proteinPercent = totalProteinTarget > 0 ? Math.round((totalDeliveredProteinG / totalProteinTarget) * 100) : 0;
  const proteinPerKgDelivered = calcWeight > 0 ? (totalDeliveredProteinG / calcWeight).toFixed(2) : '0';

  // Makronutrient energiprocent (E%)
  const carbsKcal = totalDeliveredCarbsG * 4;
  const proteinKcal = totalDeliveredProteinG * 4;
  const fatKcal = totalDeliveredFatG * 9;
  const macroKcalSum = carbsKcal + proteinKcal + fatKcal || 1;
  const carbsEPercent = Math.round((carbsKcal / macroKcalSum) * 100);
  const proteinEPercent = Math.round((proteinKcal / macroKcalSum) * 100);
  const fatEPercent = Math.round((fatKcal / macroKcalSum) * 100);

  // Återstående energibehov & rekommenderad sondmatshastighet för att nå 100%
  const remainingKcal = Math.max(0, totalKcalTarget - nonNutrKcal - tpnKcal);
  const recommendedSondTotalMl = sondEnergyPerMl > 0 ? Math.round(remainingKcal / sondEnergyPerMl) : 0;
  const recommendedSondRateMlH = Math.round(recommendedSondTotalMl / 24);

  // ==========================================
  // FUNKTIONER FÖR ATT LADDA PRESETS
  // ==========================================
  const loadOstraPhotoPreset = () => {
    setGender('Man');
    setAgeStr('58');
    setHeightStr('165');
    setArrivalWeightStr('67.3');
    setWeightStr('65.0');
    setWeightType('tbw');
    setEnergyTargetPerKg(25);
    setProteinTargetPerKg(1.3);
    setPropofolMl(200);
    setPropofolRateMlH(8);
    setG5Ml(367);
    setG10Ml(0);
    setG20Ml(0);
    setSelectedFormulaId('fresubin-2kcal');
    setSondMl(280);
    setWaterMl(100);
    setTpnCentralMl(0);
    setCitrateKcal(0);
    setProteinPowderG(0);
  };

  const syncFromLocalStorage = () => {
    try {
      const g = localStorage.getItem('iva_ostra_gender');
      if (g) setGender(g as any);
      const a = localStorage.getItem('iva_ostra_age');
      if (a) setAgeStr(a);
      const h = localStorage.getItem('iva_ostra_height');
      if (h) setHeightStr(h);
      const aw = localStorage.getItem('iva_ostra_arr_weight');
      if (aw) setArrivalWeightStr(aw);
      const tw = localStorage.getItem('iva_ostra_tbw');
      if (tw) setWeightStr(tw);

      // Sedering propofol
      const sedStr = localStorage.getItem('iva_ostra_sed');
      if (sedStr) {
        const sed = JSON.parse(sedStr);
        if (sed['Propofol 20 mg/ml'] !== undefined) {
          setPropofolMl(sed['Propofol 20 mg/ml']);
          setPropofolRateMlH(Math.round(sed['Propofol 20 mg/ml'] / 24));
        }
      }

      // Glukos
      const crystStr = localStorage.getItem('iva_ostra_cryst');
      if (crystStr) {
        const cryst = JSON.parse(crystStr);
        if (cryst['Glukos 50 mg/ml (5%)'] !== undefined) setG5Ml(cryst['Glukos 50 mg/ml (5%)']);
      }

      // Enteral
      const entStr = localStorage.getItem('iva_ostra_enteral');
      if (entStr) {
        const ent = JSON.parse(entStr);
        if (ent['Fresubin 2 kcal/ml'] !== undefined) {
          setSondMl(ent['Fresubin 2 kcal/ml']);
          setSelectedFormulaId('fresubin-2kcal');
        }
        if (ent['Vatten i sond'] !== undefined) setWaterMl(ent['Vatten i sond']);
      }
    } catch (e) {}
  };

  const resetAllFields = () => {
    setPropofolMl(0);
    setPropofolRateMlH(0);
    setG5Ml(0);
    setG10Ml(0);
    setG20Ml(0);
    setSondMl(0);
    setWaterMl(0);
    setTpnCentralMl(0);
    setCitrateKcal(0);
    setProteinPowderG(0);
  };

  // Summera kaloritabell
  const totalOralKcal = IVA_CALORIE_TABLE.reduce((sum, item) => {
    const qty = selectedPortions[item.id] || 0;
    return sum + qty * item.kcal;
  }, 0);

  const handlePortionChange = (id: string, delta: number) => {
    setSelectedPortions((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const filteredFoods = IVA_CALORIE_TABLE.filter(
    (item) =>
      calorieSearch === '' ||
      item.name.toLowerCase().includes(calorieSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(calorieSearch.toLowerCase())
  );

  const filteredFormulas = NUTRITION_FORMULAS.filter(
    (f) =>
      formulaSearch === '' ||
      f.name.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.category.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(formulaSearch.toLowerCase()) ||
      f.indication.toLowerCase().includes(formulaSearch.toLowerCase())
  );

  return (
    <div className="nutrition-view-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem', width: '100%', boxSizing: 'border-box' }}>
      {/* Sektionshuvud */}
      <div
        className="section-header-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          border: '1px solid #e2e8f0',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '1.4rem' }}>🥣</span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Klinisk Nutrition & Kaloriberäkning
              </h1>
              <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                ESPEN Guidelines & IVA Östra 2.2
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Komplett energiberäkning, makronutrienter, Propofol- & Glukosavräkning, sondmatsprodukter och autentisk kaloritabell från IVA Östra sjukhuset.
            </p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('calc')}
              style={{
                border: 'none',
                background: activeTab === 'calc' ? '#ffffff' : 'transparent',
                color: activeTab === 'calc' ? '#d97706' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'calc' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              ⚡ ESPEN & Östra 2.2 Kalkylator
            </button>
            <button
              onClick={() => setActiveTab('formulas')}
              style={{
                border: 'none',
                background: activeTab === 'formulas' ? '#ffffff' : 'transparent',
                color: activeTab === 'formulas' ? '#d97706' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'formulas' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🥛 Sondnäring Preparat
            </button>
            <button
              onClick={() => setActiveTab('calories')}
              style={{
                border: 'none',
                background: activeTab === 'calories' ? '#ffffff' : 'transparent',
                color: activeTab === 'calories' ? '#d97706' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'calories' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📊 Kaloritabell IVA 343
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              style={{
                border: 'none',
                background: activeTab === 'targets' ? '#ffffff' : 'transparent',
                color: activeTab === 'targets' ? '#d97706' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                boxShadow: activeTab === 'targets' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🎯 Målvärden & Riktlinjer
            </button>
          </div>
        </div>
      </div>

      {/* 1. ESPEN & ÖSTRA 2.2 KALKYLATOR */}
      {activeTab === 'calc' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          {/* Snabbåtgärdsrad: Presets, Synk & Nollställning */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              flexWrap: 'wrap',
              gap: '0.6rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155' }}>
                📋 Snabbval & Mallar:
              </span>
              <button
                type="button"
                onClick={loadOstraPhotoPreset}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>📷 Ladda exempel från Östra 2.2 (bilden)</span>
              </button>
              <button
                type="button"
                onClick={syncFromLocalStorage}
                style={{
                  background: '#ffffff',
                  color: '#0369a1',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <span>🔄 Synka från Vätskebalansen</span>
              </button>
            </div>

            <button
              type="button"
              onClick={resetAllFields}
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '0.35rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Nollställ tillförsel
            </button>
          </div>

          {/* HUVUDSUMMERING (KPI CARDS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', width: '100%' }}>
            {/* Energimål & Levererad energi */}
            <div
              style={{
                background: kcalPercent >= 90 && kcalPercent <= 110 ? '#f0fdf4' : kcalPercent > 110 ? '#fef2f2' : '#fffbeb',
                border: `1.5px solid ${kcalPercent >= 90 && kcalPercent <= 110 ? '#86efac' : kcalPercent > 110 ? '#fca5a5' : '#fde68a'}`,
                borderRadius: '14px',
                padding: '1rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Energi: Tillfört vs Mål
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: kcalPercent >= 90 && kcalPercent <= 110 ? '#dcfce7' : kcalPercent > 110 ? '#fee2e2' : '#fef3c7',
                    color: kcalPercent >= 90 && kcalPercent <= 110 ? '#15803d' : kcalPercent > 110 ? '#b91c1c' : '#b45309',
                  }}
                >
                  {kcalPercent}% Mål
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', marginTop: '0.3rem' }}>
                {totalDeliveredKcal}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>/ {totalKcalTarget} kcal/d</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.3rem' }}>
                {energyTargetPerKg} kcal/kg/d • Beräknat på {Math.round(calcWeight)} kg ({weightType.toUpperCase()})
              </div>
            </div>

            {/* Proteinmål & Levererat protein */}
            <div
              style={{
                background: proteinPercent >= 90 && proteinPercent <= 120 ? '#eff6ff' : proteinPercent > 120 ? '#f5f3ff' : '#f8fafc',
                border: `1.5px solid ${proteinPercent >= 90 && proteinPercent <= 120 ? '#93c5fd' : '#cbd5e1'}`,
                borderRadius: '14px',
                padding: '1rem 1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase' }}>
                  Protein: Tillfört vs Mål
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px',
                    background: '#dbeafe',
                    color: '#1e40af',
                  }}
                >
                  {proteinPercent}% Mål
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1e3a8a', marginTop: '0.3rem' }}>
                {totalDeliveredProteinG}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#64748b' }}>/ {totalProteinTarget} g/d</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '0.3rem' }}>
                {proteinPerKgDelivered} g/kg/d (Mål: {proteinTargetPerKg} g/kg/d)
              </div>
            </div>

            {/* Icke-nutritionskalorier */}
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecdd3', borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991b1b', textTransform: 'uppercase' }}>
                  Icke-nutrition (Propofol & Glukos)
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '9999px', background: '#fee2e2', color: '#991b1b' }}>
                  {nonNutrPercent}% av energi
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#991b1b', marginTop: '0.3rem' }}>
                {nonNutrKcal} kcal
              </div>
              <div style={{ fontSize: '0.75rem', color: '#b91c1c', marginTop: '0.3rem' }}>
                Propofol: {propofolKcal} kcal • Glukos: {glucoseKcal} kcal • Citrat: {citrateKcal} kcal
              </div>
            </div>

            {/* Sondmatshastighet för att nå målet */}
            <div style={{ background: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '14px', padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', textTransform: 'uppercase' }}>
                  Sondmatshastighet (Mål 100%)
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#047857' }}>
                  {chosenFormula.name.split(' ')[0]}
                </span>
              </div>
              <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#065f46', marginTop: '0.3rem' }}>
                {recommendedSondRateMlH}{' '}
                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#047857' }}>ml / timme</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.3rem' }}>
                Motsvarar {recommendedSondTotalMl} ml/dygn för att täcka resterande {remainingKcal} kcal
              </div>
            </div>
          </div>

          {/* DELAD SEKTION: 1. PATIENTUPPGIFTER & MÅL // 2. TILLFÖRD NÄRING */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', width: '100%' }}>
            {/* VÄNSTER: PATIENTUPPGIFTER & ANTROPOMETRI */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  👤 Patientdata & Antropometri
                </h3>
                <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                  Östra IVA standard
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="nutr_gender" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Kön</label>
                  <select
                    id="nutr_gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    style={{ width: '100%', minHeight: '42px', padding: '0.45rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                  >
                    <option value="Man">Man</option>
                    <option value="Kvinna">Kvinna</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="nutr_age" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Ålder (år)</label>
                  <input
                    id="nutr_age"
                    type="text"
                    inputMode="numeric"
                    value={ageStr}
                    onChange={(e) => setAgeStr(e.target.value)}
                    style={{ width: '100%', minHeight: '42px', padding: '0.45rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label htmlFor="nutr_height" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Längd (cm)</label>
                  <input
                    id="nutr_height"
                    type="text"
                    inputMode="decimal"
                    value={heightStr}
                    onChange={(e) => setHeightStr(e.target.value)}
                    style={{ width: '100%', minHeight: '42px', padding: '0.45rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label htmlFor="nutr_weight" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Aktuell vikt TBW (kg)</label>
                  <input
                    id="nutr_weight"
                    type="text"
                    inputMode="decimal"
                    value={weightStr}
                    onChange={(e) => setWeightStr(e.target.value)}
                    style={{ width: '100%', minHeight: '42px', padding: '0.45rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 800, marginTop: '0.2rem', boxSizing: 'border-box', color: '#0369a1' }}
                  />
                </div>

                <div>
                  <label htmlFor="nutr_arr_weight" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Ankomstvikt (kg)</label>
                  <input
                    id="nutr_arr_weight"
                    type="text"
                    inputMode="decimal"
                    value={arrivalWeightStr}
                    onChange={(e) => setArrivalWeightStr(e.target.value)}
                    style={{ width: '100%', minHeight: '42px', padding: '0.45rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>BMI & BSA</label>
                  <div style={{ minHeight: '42px', padding: '0.45rem', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
                    <span>BMI: <strong>{bmi}</strong></span>
                    <span style={{ color: '#64748b' }}>BSA: {bsa} m²</span>
                  </div>
                </div>
              </div>

              {/* Antropometrisk sammanställning & Val av beräkningsvikt */}
              <div style={{ marginTop: '1rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.4rem' }}>
                  ⚖️ Beräkningsvikt för energibehov & protein:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
                  <button
                    type="button"
                    onClick={() => setWeightType('tbw')}
                    style={{
                      padding: '0.4rem 0.2rem',
                      borderRadius: '6px',
                      border: weightType === 'tbw' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: weightType === 'tbw' ? '#ffffff' : '#f8fafc',
                      color: weightType === 'tbw' ? '#0369a1' : '#64748b',
                      fontWeight: weightType === 'tbw' ? 800 : 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    TBW: {weight} kg
                    <div style={{ fontSize: '0.68rem', fontWeight: 400 }}>Aktuell</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeightType('adjBw')}
                    style={{
                      padding: '0.4rem 0.2rem',
                      borderRadius: '6px',
                      border: weightType === 'adjBw' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: weightType === 'adjBw' ? '#ffffff' : '#f8fafc',
                      color: weightType === 'adjBw' ? '#0369a1' : '#64748b',
                      fontWeight: weightType === 'adjBw' ? 800 : 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    AdjBW: {adjBw} kg
                    <div style={{ fontSize: '0.68rem', fontWeight: 400 }}>Justerad</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setWeightType('ibw')}
                    style={{
                      padding: '0.4rem 0.2rem',
                      borderRadius: '6px',
                      border: weightType === 'ibw' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                      background: weightType === 'ibw' ? '#ffffff' : '#f8fafc',
                      color: weightType === 'ibw' ? '#0369a1' : '#64748b',
                      fontWeight: weightType === 'ibw' ? 800 : 600,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    IBW: {ibw} kg
                    <div style={{ fontSize: '0.68rem', fontWeight: 400 }}>Ideal</div>
                  </button>
                </div>
                {bmiNum > 30 && (
                  <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '0.4rem', fontWeight: 600 }}>
                    ⚠️ Obs! Vid BMI &gt; 30 rekommenderar ESPEN justerad vikt (AdjBW) för att undvika övermatning.
                  </div>
                )}
              </div>

              {/* MÅLSÄTTNING: KCAL/KG OCH G PROTEIN/KG */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
                  🎯 ESPEN Målsättning (per kg kroppsvikt)
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                      Energimål (kcal/kg/d)
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                      {[20, 25, 30].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setEnergyTargetPerKg(v)}
                          style={{
                            flex: 1,
                            padding: '0.35rem 0',
                            borderRadius: '6px',
                            border: energyTargetPerKg === v ? '1.5px solid #d97706' : '1px solid #cbd5e1',
                            background: energyTargetPerKg === v ? '#fef3c7' : '#ffffff',
                            color: energyTargetPerKg === v ? '#b45309' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      = <strong>{totalKcalTarget} kcal/dygn</strong>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
                      Proteinmål (g/kg/d)
                    </label>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.2rem' }}>
                      {[1.3, 1.5, 1.7, 2.0].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setProteinTargetPerKg(v)}
                          style={{
                            flex: 1,
                            padding: '0.35rem 0',
                            borderRadius: '6px',
                            border: proteinTargetPerKg === v ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                            background: proteinTargetPerKg === v ? '#e0f2fe' : '#ffffff',
                            color: proteinTargetPerKg === v ? '#0369a1' : '#475569',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                      = <strong>{totalProteinTarget} g protein/dygn</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HÖGER: REGISTRERING AV NÄRINGSKÄLLOR (VÄTSKA IN & ENERGI) */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>
                🥣 Tillförd Näring & Infusioner (Dygnsmängder)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* 1. Propofol */}
                <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: '10px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991b1b' }}>
                      Sedering: Propofol (1.1 kcal/ml, 0.1 g fett/ml)
                    </label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#991b1b' }}>
                      {propofolKcal} kcal ({propofolFatG} g fett)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Dygnsdos (ml):</span>
                      <input
                        type="number"
                        min="0"
                        value={propofolMl || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPropofolMl(val);
                          setPropofolRateMlH(Math.round(val / 24));
                        }}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Hastighet (ml/h):</span>
                      <input
                        type="number"
                        min="0"
                        value={propofolRateMlH || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPropofolRateMlH(val);
                          setPropofolMl(val * 24);
                        }}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Glukosinfusioner */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                      Glukosinfusioner (ml/dygn)
                    </label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      {glucoseKcal} kcal ({glucoseCarbsG} g kolhydrater)
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>5% (200 kcal/L)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={g5Ml || ''}
                        onChange={(e) => setG5Ml(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>10% (400 kcal/L)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={g10Ml || ''}
                        onChange={(e) => setG10Ml(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>20% (800 kcal/L)</span>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={g20Ml || ''}
                        onChange={(e) => setG20Ml(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Enteral Nutrition (Sondmat) */}
                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>
                      Enteral Nutrition (Sondnäring)
                    </label>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#065f46' }}>
                      {sondKcal} kcal ({sondProteinG} g protein)
                    </span>
                  </div>

                  <div style={{ marginTop: '0.4rem' }}>
                    <select
                      value={selectedFormulaId}
                      onChange={(e) => setSelectedFormulaId(e.target.value)}
                      style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1.5px solid #a7f3d0', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                    >
                      {NUTRITION_FORMULAS.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.energyDensity} kcal/ml, {f.proteinDensity} g prot/100ml)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#047857' }}>Volym (ml/d):</span>
                      <input
                        type="number"
                        min="0"
                        value={sondMl || ''}
                        onChange={(e) => setSondMl(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#047857' }}>Hastighet:</span>
                      <div style={{ minHeight: '38px', padding: '0.35rem', borderRadius: '6px', background: '#ffffff', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {sondRateMlH} ml/h
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#047857' }}>Sondvatten (ml):</span>
                      <input
                        type="number"
                        min="0"
                        value={waterMl || ''}
                        onChange={(e) => setWaterMl(parseFloat(e.target.value) || 0)}
                        style={{ width: '100%', minHeight: '38px', padding: '0.35rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Parenteral nutrition & Citrat & Proteinpulver */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>SmofKabiven Central (ml/d):</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={tpnCentralMl || ''}
                      onChange={(e) => setTpnCentralMl(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', minHeight: '36px', padding: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>
                      {tpnKcal} kcal ({tpnProteinG} g protein)
                    </div>
                  </div>

                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155' }}>Proteinpulver (g prot):</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={proteinPowderG || ''}
                      onChange={(e) => setProteinPowderG(parseFloat(e.target.value) || 0)}
                      style={{ width: '100%', minHeight: '36px', padding: '0.3rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
                    />
                    <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: '0.1rem' }}>
                      Fresubin Protifar / modul
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DETALJERAD MAKRONUTRIENT & ESPEN MÅLUPPFÖLJNING (Identiskt med Östra 2.2 arket) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '1.25rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1rem' }}>
              📊 Makronutrientfördelning & ESPEN Målutvärdering
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {/* Makro tabell */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '0.5rem' }}>Makronutrient</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Mängd</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Energi (kcal)</th>
                      <th style={{ padding: '0.5rem', textAlign: 'right' }}>Energiprocent (E%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: '#0369a1' }}>🍞 Kolhydrater</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{totalDeliveredCarbsG} g</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{carbsKcal} kcal</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, color: '#0369a1' }}>{carbsEPercent}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: '#15803d' }}>🥩 Protein</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{totalDeliveredProteinG} g</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{proteinKcal} kcal</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, color: '#15803d' }}>{proteinEPercent}%</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.5rem', fontWeight: 700, color: '#b45309' }}>🧈 Fett</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700 }}>{totalDeliveredFatG} g</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>{fatKcal} kcal</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, color: '#b45309' }}>{fatEPercent}%</td>
                    </tr>
                    <tr style={{ background: '#f8fafc', fontWeight: 800 }}>
                      <td style={{ padding: '0.6rem 0.5rem' }}>Summa tillfört</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>—</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', color: '#0f172a' }}>{totalDeliveredKcal} kcal</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right' }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Visuell Progress & Rekommendation */}
              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Energimål ({totalKcalTarget} kcal/d):</span>
                    <span>{kcalPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, kcalPercent)}%`,
                        background: kcalPercent >= 90 && kcalPercent <= 110 ? '#22c55e' : kcalPercent > 110 ? '#ef4444' : '#eab308',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    <span>Proteinmål ({totalProteinTarget} g/d):</span>
                    <span>{proteinPercent}%</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, proteinPercent)}%`,
                        background: '#3b82f6',
                        borderRadius: '9999px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.6rem', fontSize: '0.78rem', color: '#475569', lineHeight: 1.4 }}>
                  <strong>Klinisk vägledning (Östra & ESPEN):</strong>
                  {kcalPercent < 70 && (
                    <div style={{ color: '#b45309', marginTop: '0.2rem' }}>
                      • Patienten erhåller undernutrition (&lt;70%). Öka sondmat till <strong>{recommendedSondRateMlH} ml/h</strong> för att täcka energibehovet.
                    </div>
                  )}
                  {kcalPercent >= 90 && kcalPercent <= 110 && (
                    <div style={{ color: '#15803d', marginTop: '0.2rem' }}>
                      • Optimalt energiintag (90–110% av målet). Motsvarar ESPEN:s rekommendation för stabil fas.
                    </div>
                  )}
                  {kcalPercent > 110 && (
                    <div style={{ color: '#b91c1c', marginTop: '0.2rem' }}>
                      • Risk för övermatning (&gt;110%). Minska sondmat eller justera för Propofol- och Glukoskalorier.
                    </div>
                  )}
                  {proteinPercent < 80 && (
                    <div style={{ color: '#b45309', marginTop: '0.2rem' }}>
                      • Proteinintaget är lågt ({proteinPerKgDelivered} g/kg). Överväg proteinpulver eller byte till Fresubin 2 kcal HP.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SONDNÄRING PREPARAT */}
      {activeTab === 'formulas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Sökbox */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <SearchIcon size={18} />
            <input
              type="text"
              placeholder="Sök bland sondnäring och TPN (Fresubin HP Energy, Peptamen AF, SmofKabiven)..."
              value={formulaSearch}
              onChange={(e) => setFormulaSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {filteredFormulas.map((f) => (
              <div
                key={f.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: `2px solid ${selectedFormulaId === f.id ? '#d97706' : '#e2e8f0'}`,
                  borderTop: '4px solid #d97706',
                  padding: '1.25rem',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {f.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {f.category}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    {f.energyDensity} kcal/ml
                  </span>
                </div>

                <div style={{ background: '#fffbeb', border: '1px solid #fef08a', padding: '0.55rem 0.75rem', borderRadius: '8px', fontSize: '0.82rem', color: '#92400e', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Protein per 100 ml:</span>
                  <strong>{f.proteinDensity} g</strong>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#334155', margin: 0, lineHeight: 1.4 }}>
                  {f.description}
                </p>

                <div style={{ background: '#f8fafc', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#1e293b' }}>
                  <strong style={{ color: '#0369a1' }}>Klinisk indikation:</strong> {f.indication}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#b91c1c', background: '#fff1f2', border: '1px solid #fecdd3', padding: '0.45rem 0.65rem', borderRadius: '6px' }}>
                  <strong>⚠️ Säkerhet & Cave:</strong> {f.caution}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFormulaId(f.id);
                    setActiveTab('calc');
                  }}
                  style={{
                    marginTop: 'auto',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    border: '1px solid #d97706',
                    background: selectedFormulaId === f.id ? '#d97706' : '#ffffff',
                    color: selectedFormulaId === f.id ? '#ffffff' : '#b45309',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>{selectedFormulaId === f.id ? '✓ Vald produkt i kalkylatorn' : 'Välj produkt för ESPEN-beräkning'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. KALORITABELL IVA 343 */}
      {activeTab === 'calories' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                Kaloritabell IVA 343, Östra sjukhuset
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Autentiska energivärden för avdelningens näringsdrycker, soppor, mejeriprodukter och mellanmål.
              </p>
            </div>

            {/* Total summering */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', padding: '0.6rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Summa vald föda:</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#92400e' }}>
                  {totalOralKcal} kcal
                </div>
              </div>
              {Object.keys(selectedPortions).length > 0 && (
                <button
                  onClick={() => setSelectedPortions({})}
                  style={{ border: 'none', background: '#fef3c7', color: '#b45309', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Nollställ
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
            <SearchIcon size={16} />
            <input
              type="text"
              placeholder="Sök i menyn (t.ex. Fortimel, Nyponsoppa, Glass, Gröt)..."
              value={calorieSearch}
              onChange={(e) => setCalorieSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Livsmedel / Produkt</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Kategori</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Portionsenhet</th>
                  <th style={{ padding: '0.6rem 0.5rem' }}>Energi (kcal)</th>
                  <th style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>Antal portioner</th>
                </tr>
              </thead>
              <tbody>
                {filteredFoods.map((item) => {
                  const qty = selectedPortions[item.id] || 0;
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', background: qty > 0 ? '#fffbeb' : 'transparent' }}>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#64748b' }}>{item.category}</td>
                      <td style={{ padding: '0.6rem 0.5rem', color: '#64748b' }}>{item.unit}</td>
                      <td style={{ padding: '0.6rem 0.5rem', fontWeight: 700, color: '#b45309' }}>{item.kcal} kcal</td>
                      <td style={{ padding: '0.6rem 0.5rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.15rem 0.35rem' }}>
                          <button
                            type="button"
                            onClick={() => handlePortionChange(item.id, -1)}
                            disabled={qty === 0}
                            style={{ border: 'none', background: 'none', cursor: qty > 0 ? 'pointer' : 'default', opacity: qty > 0 ? 1 : 0.3, fontWeight: 800, padding: '0 0.3rem' }}
                          >
                            -
                          </button>
                          <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 800, color: '#0f172a' }}>{qty}</span>
                          <button
                            type="button"
                            onClick={() => handlePortionChange(item.id, 1)}
                            style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 800, padding: '0 0.3rem', color: '#b45309' }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. MÅLVÄRDEN & RIKTLINJER */}
      {activeTab === 'targets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#b45309', margin: '0 0 0.75rem' }}>
              ⚡ ESPEN Energiriktlinjer på IVA
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Akutfas (dygn 1–2):</strong> Hypokalorisk nutrition (max 70% av energimålet eller 20 kcal/kg). Full nutrition i tidig fas ökar mortaliteten och försvårar autofagi.</li>
              <li><strong>Stabil fas (dygn 3–7):</strong> Upptrappning till 25 kcal/kg/dygn.</li>
              <li><strong>Rekonvalescens/katabol fas:</strong> 30 kcal/kg/dygn.</li>
              <li><strong>BMI &gt; 30 (Obesitas):</strong> Använd justerad beräkningsvikt (Adjusted Body Weight, ABW = IBW + 0.25 × [faktisk vikt - IBW]).</li>
            </ul>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8', margin: '0 0 0.75rem' }}>
              🥩 Proteinmål vid kritisk sjukdom
            </h3>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li><strong>Standard IVA-patient:</strong> 1.3 g protein / kg / dygn.</li>
              <li><strong>CRRT / Kontinuerlig dialys:</strong> 1.5 – 2.0 g/kg/dygn (kompenserar för signifikanta aminosyraförluster i hemofiltret).</li>
              <li><strong>Svåra brännskador / Polytrauma:</strong> Upp till 2.0 – 2.5 g/kg/dygn.</li>
              <li>Välj högrenade formuleringar som Fresubin HP Energy (7.5 g protein/100 ml) för att täcka proteinbehovet utan att övergöda med kalorier.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
