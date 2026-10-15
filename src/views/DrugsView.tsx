import React, { useState, useEffect, useMemo } from 'react';
import { IVA_DRUGS, DRUG_CATEGORIES, getDrugCompatibility } from '../data/drugsData';
import { DrugCategory, DrugItem } from '../types';
import { SearchIcon, StarIcon } from '../components/Icons';
import { DrugDetailModal } from '../components/modals/DrugDetailModal';

interface DrugsViewProps {
  initialDrugId?: string | null;
  favoriteDrugs?: string[];
  onToggleFavoriteDrug?: (drugId: string) => void;
  onOpenMedicationCatalog?: () => void;
}

export const DrugsView: React.FC<DrugsViewProps> = ({
  initialDrugId,
  favoriteDrugs = [],
  onToggleFavoriteDrug,
  onOpenMedicationCatalog,
}) => {
  const [selectedDrugId, setSelectedDrugId] = useState<string>(initialDrugId || IVA_DRUGS[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<DrugCategory | 'ALL' | 'FAVORITES'>('ALL');
  const [weight, setWeight] = useState<number>(80);
  const [calcMode, setCalcMode] = useState<'DOSE_TO_RATE' | 'RATE_TO_DOSE'>('DOSE_TO_RATE');
  const [doseInputStr, setDoseInputStr] = useState<string>(String(IVA_DRUGS[0].defaultDose));
  const [rateInputStr, setRateInputStr] = useState<string>('5.0');
  const [activeSubTab, setActiveSubTab] = useState<'CALC' | 'CVK'>('CALC');
  const [detailModalDrug, setDetailModalDrug] = useState<DrugItem | null>(null);

  // CVK Y-site compatibility state
  const [compatDrugA, setCompatDrugA] = useState<string>('noradrenalin');
  const [compatDrugB, setCompatDrugB] = useState<string>('propofol');
  const [matrixFilter, setMatrixFilter] = useState<'CORE' | DrugCategory>('CORE');

  const doseInput = Math.max(0, parseFloat(doseInputStr.replace(',', '.')) || 0);
  const rateInput = Math.max(0, parseFloat(rateInputStr.replace(',', '.')) || 0);

  useEffect(() => {
    if (initialDrugId) {
      const found = IVA_DRUGS.find((d) => d.id === initialDrugId);
      if (found) {
        setSelectedDrugId(found.id);
        setDoseInputStr(String(found.defaultDose));
        const r = found.infusionFormula(weight, found.defaultDose);
        setRateInputStr(r.toFixed(1));
      }
    }
  }, [initialDrugId]);

  const currentDrug: DrugItem = IVA_DRUGS.find((d) => d.id === selectedDrugId) || IVA_DRUGS[0];

  const handleSelectDrug = (drug: DrugItem) => {
    setSelectedDrugId(drug.id);
    setDoseInputStr(String(drug.defaultDose));
    const calculatedRate = drug.infusionFormula(weight, drug.defaultDose);
    setRateInputStr(calculatedRate.toFixed(1));
  };

  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return IVA_DRUGS.filter((d) => {
      if (selectedCategory === 'FAVORITES' && !favoriteDrugs.includes(d.id)) return false;
      if (selectedCategory !== 'ALL' && selectedCategory !== 'FAVORITES' && d.category !== selectedCategory) return false;
      if (!q) return true;
      return (
        d.name.toLowerCase().includes(q) ||
        d.tradeNames.toLowerCase().includes(q) ||
        d.class.toLowerCase().includes(q) ||
        d.shortEffect.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory, favoriteDrugs]);

  const calculatedRate = currentDrug.infusionFormula(weight, doseInput);
  const calculatedDose = currentDrug.doseFromRate(weight, rateInput);
  const isContinuousInfusion = currentDrug.infusionFormula(80, currentDrug.defaultDose || 1) > 0;

  const compatResult = getDrugCompatibility(compatDrugA, compatDrugB);

  const matrixDrugs = useMemo(() => {
    if (matrixFilter === 'CORE') {
      const coreIds = [
        'noradrenalin',
        'vasopressin',
        'adrenalin',
        'dobutamin',
        'milrinon',
        'levosimendan',
        'propofol',
        'dexmedetomidin',
        'klonidin',
        'midazolam',
        'remifentanil',
        'fentanyl',
        'morfin',
        'furosemid',
        'kaliumklorid',
        'fosfat',
        'kalciumglukonat',
        'amiodaron',
        'insulin',
      ];
      return IVA_DRUGS.filter((d) => coreIds.includes(d.id));
    }
    return IVA_DRUGS.filter((d) => d.category === matrixFilter);
  }, [matrixFilter]);

  return (
    <div className="drugs-view-container" style={{ maxWidth: '1320px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: '18px',
          padding: '1.5rem 1.75rem',
          color: '#ffffff',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <span
            style={{
              background: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Farmakologi & Infusionsstöd • {IVA_DRUGS.length} läkemedel
          </span>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.4rem 0 0.2rem' }}>
            Läkemedelskalkylator, Spädning & CVK Blandbarhet
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            Samtliga IVA- och PostOp-läkemedel med dosberäkning, spädningskort, bolusdoser och Y-kopplingsmatris.
          </p>
        </div>

        {/* Sub-tab Switcher & Gen-knapp till Läkemedelskategorin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {onOpenMedicationCatalog && (
            <button
              onClick={onOpenMedicationCatalog}
              style={{
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.08)',
                color: '#ffffff',
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              📋 Kompakt Läkemedelslista (FASS/IVA) →
            </button>
          )}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '0.3rem', borderRadius: '12px', gap: '0.3rem' }}>
            <button
              onClick={() => setActiveSubTab('CALC')}
              style={{
                border: 'none',
                background: activeSubTab === 'CALC' ? '#0284c7' : 'transparent',
                color: '#ffffff',
                padding: '0.55rem 1rem',
                borderRadius: '9px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              💉 Dos & Spädning ({IVA_DRUGS.length})
            </button>
            <button
              onClick={() => setActiveSubTab('CVK')}
              style={{
                border: 'none',
                background: activeSubTab === 'CVK' ? '#0284c7' : 'transparent',
                color: '#ffffff',
                padding: '0.55rem 1rem',
                borderRadius: '9px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              🔗 CVK Y-koppling & Blandbarhet
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'CALC' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {/* VÄNSTER: Läkemedelsväljare med sök & kategorifilter + Kalkylator */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Välj läkemedel */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  1. Välj Läkemedel ({filteredDrugs.length} visas)
                </label>
                {onToggleFavoriteDrug && (
                  <button
                    onClick={() => setSelectedCategory(selectedCategory === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      border: selectedCategory === 'FAVORITES' ? '1.5px solid #f59e0b' : '1px solid #cbd5e1',
                      background: selectedCategory === 'FAVORITES' ? '#fffbeb' : '#f8fafc',
                      color: selectedCategory === 'FAVORITES' ? '#b45309' : '#475569',
                      padding: '0.25rem 0.6rem',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <StarIcon filled={selectedCategory === 'FAVORITES' || favoriteDrugs.length > 0} size={13} />
                    <span>Favoriter ({favoriteDrugs.length})</span>
                  </button>
                )}
              </div>

              {/* Sökfält i Dos & CVK */}
              <div style={{ position: 'relative', marginBottom: '0.65rem' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
                  <SearchIcon size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Sök läkemedel eller varunamn (t.ex. Noradrenalin, Ultiva, Furix, Robinul)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 1.8rem 0.45rem 2.1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.82rem',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Kategoripills */}
              <div style={{ display: 'flex', gap: '0.3rem', overflowX: 'auto', paddingBottom: '0.45rem', marginBottom: '0.6rem' }}>
                <button
                  onClick={() => setSelectedCategory('ALL')}
                  style={{
                    border: 'none',
                    background: selectedCategory === 'ALL' ? '#0f172a' : '#f1f5f9',
                    color: selectedCategory === 'ALL' ? '#ffffff' : '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.6rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Alla ({IVA_DRUGS.length})
                </button>
                {DRUG_CATEGORIES.map((cat) => {
                  const isAct = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(isAct ? 'ALL' : cat)}
                      style={{
                        border: 'none',
                        background: isAct ? '#0284c7' : '#f1f5f9',
                        color: isAct ? '#ffffff' : '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.3rem 0.6rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Scrollbar med kompakt läkemedelsknappar */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(165px, 1fr))',
                  gap: '0.4rem',
                  maxHeight: '240px',
                  overflowY: 'auto',
                  paddingRight: '0.25rem',
                }}
              >
                {filteredDrugs.map((drug) => {
                  const isSelected = drug.id === selectedDrugId;
                  const isFav = favoriteDrugs.includes(drug.id);
                  return (
                    <button
                      key={drug.id}
                      onClick={() => handleSelectDrug(drug)}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '8px',
                        border: isSelected ? `2px solid ${drug.color}` : '1px solid #e2e8f0',
                        background: isSelected ? '#f8fafc' : '#ffffff',
                        color: '#0f172a',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.76rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.35rem',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', minWidth: 0 }}>
                        <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: drug.color, flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{drug.name}</span>
                      </div>
                      {isFav && <span style={{ color: '#f59e0b', fontSize: '0.75rem', flexShrink: 0 }}>★</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Kalkylator */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  2. Dos- & Infusionsberäkning ({currentDrug.name})
                </label>

                <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '0.2rem' }}>
                  <button
                    onClick={() => setCalcMode('DOSE_TO_RATE')}
                    style={{
                      border: 'none',
                      background: calcMode === 'DOSE_TO_RATE' ? '#ffffff' : 'transparent',
                      color: calcMode === 'DOSE_TO_RATE' ? '#0f172a' : '#64748b',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: calcMode === 'DOSE_TO_RATE' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    Dos → ml/h
                  </button>
                  <button
                    onClick={() => setCalcMode('RATE_TO_DOSE')}
                    style={{
                      border: 'none',
                      background: calcMode === 'RATE_TO_DOSE' ? '#ffffff' : 'transparent',
                      color: calcMode === 'RATE_TO_DOSE' ? '#0f172a' : '#64748b',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: calcMode === 'RATE_TO_DOSE' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    ml/h → Dos
                  </button>
                </div>
              </div>

              {/* Patientvikt */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Patientvikt (kg)</span>
                  <strong style={{ fontSize: '1rem', color: '#0284c7' }}>{weight} kg</strong>
                </div>
                <input
                  type="range"
                  min={35}
                  max={160}
                  step={1}
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                  <span>35 kg</span>
                  <span>70 kg</span>
                  <span>100 kg</span>
                  <span>160 kg</span>
                </div>
              </div>

              {isContinuousInfusion ? (
                <>
                  {calcMode === 'DOSE_TO_RATE' ? (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                        Önskad dos ({currentDrug.doseUnit})
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={doseInputStr}
                        onChange={(e) => setDoseInputStr(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                        Terapeutiskt intervall: <strong>{currentDrug.standardDoseRange}</strong>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                        Aktuell pumphastighet (ml/h)
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={rateInputStr}
                        onChange={(e) => setRateInputStr(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '10px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem' }}>
                        Baserat på standardkoncentration: <strong>{currentDrug.standardConc}</strong>
                      </div>
                    </div>
                  )}

                  {/* Resultatbox */}
                  <div
                    style={{
                      background: '#f0f9ff',
                      border: '2px solid #bae6fd',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {calcMode === 'DOSE_TO_RATE' ? 'Beräknad Infusionshastighet' : 'Beräknad Aktuell Dos'}
                    </div>
                    <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0c4a6e', margin: '0.25rem 0' }}>
                      {calcMode === 'DOSE_TO_RATE'
                        ? `${calculatedRate.toFixed(1)} ml/h`
                        : `${calculatedDose.toFixed(3)} ${currentDrug.doseUnit}`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 600 }}>
                      Vid styrka {currentDrug.standardConc} ({weight} kg)
                    </div>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '14px',
                    padding: '1.15rem',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Intermittent / Bolusadministrering ({weight} kg)
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
                    Dosering: {currentDrug.standardDoseRange}
                  </div>
                  {currentDrug.bolusDose && (
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0284c7', marginTop: '0.3rem' }}>
                      Bolus / Singeldos: {currentDrug.bolusDose}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.5rem', lineHeight: 1.45 }}>
                    Detta läkemedel ges normalt som bolusinjektion eller intermittent korttidsinfusion (ej kontinuerlig ml/h-titrering). Se spädnings- och administreringskortet till höger.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HÖGER: Spädningskort & Kliniska Riktlinjer */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              borderTop: `5px solid ${currentDrug.color}`,
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: currentDrug.color, textTransform: 'uppercase' }}>
                    {currentDrug.category}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>• {currentDrug.class}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0.2rem 0' }}>
                  {currentDrug.name}
                </h2>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Varunamn: {currentDrug.tradeNames}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {onToggleFavoriteDrug && (
                  <button
                    onClick={() => onToggleFavoriteDrug(currentDrug.id)}
                    style={{
                      border: '1px solid #cbd5e1',
                      background: favoriteDrugs.includes(currentDrug.id) ? '#fffbeb' : '#ffffff',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      color: '#334155',
                    }}
                  >
                    <StarIcon filled={favoriteDrugs.includes(currentDrug.id)} size={15} />
                  </button>
                )}
                <button
                  onClick={() => setDetailModalDrug(currentDrug)}
                  style={{
                    border: '1px solid #bae6fd',
                    background: '#f0f9ff',
                    color: '#0369a1',
                    padding: '0.45rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  📖 Fullständig FASS/IVA-info
                </button>
              </div>
            </div>

            {/* Kort farmakologisk sammanfattning (Vad det gör, T½, Biverkningar) */}
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Vad det gör & Kinetik
              </div>
              <div style={{ fontSize: '0.86rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
                {currentDrug.shortEffect}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.45rem', fontSize: '0.76rem', color: '#475569' }}>
                <span><strong>Anslag:</strong> {currentDrug.onset}</span>
                <span><strong>Duration:</strong> {currentDrug.duration}</span>
                <span><strong>T½:</strong> {currentDrug.halfLife}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Standardkoncentration</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>{currentDrug.standardConc}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Alternativ styrka</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155', marginTop: '0.2rem' }}>{currentDrug.altConc}</div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Spädningsinstruktion (Standard)
              </div>
              <p style={{ fontSize: '0.88rem', color: '#1e293b', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                {currentDrug.dilutionGuide}
              </p>
              <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#475569' }}>
                <strong>Godkända spädningsvätskor:</strong> {currentDrug.approvedDiluents}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Infart / Administrering</div>
                <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{currentDrug.administrationRoute}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Hållbarhet</div>
                <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>{currentDrug.stability}</div>
              </div>
            </div>

            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.73rem', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                ⚠️ Viktiga Biverkningar
              </div>
              <p style={{ fontSize: '0.83rem', color: '#881337', margin: 0, lineHeight: 1.45, fontWeight: 500 }}>
                {currentDrug.sideEffects}
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                💡 Viktiga Kliniska IVA-noteringar
              </div>
              <p style={{ fontSize: '0.85rem', color: '#78350f', margin: 0, lineHeight: 1.5, fontWeight: 500 }}>
                {currentDrug.clinicalNotes}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* CVK Y-KOPPLING & BLANDBARHETSVY */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
              Snabbkontroll: Y-koppling i samma CVK-skänkel ({IVA_DRUGS.length} läkemedel)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem' }}>
              Välj två läkemedel ur listan nedan för att kontrollera om de kan samadministreras via Y-koppling/trevägskran i samma lumen.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                  Läkemedel 1
                </label>
                <select
                  value={compatDrugA}
                  onChange={(e) => setCompatDrugA(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {DRUG_CATEGORIES.map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {IVA_DRUGS.filter((d) => d.category === cat).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.tradeNames})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                  Läkemedel 2
                </label>
                <select
                  value={compatDrugB}
                  onChange={(e) => setCompatDrugB(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  {DRUG_CATEGORIES.map((cat) => (
                    <optgroup key={cat} label={cat}>
                      {IVA_DRUGS.filter((d) => d.category === cat).map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.tradeNames})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Resultatbanner */}
            <div
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background:
                  compatResult.status === 'YES'
                    ? '#ecfdf5'
                    : compatResult.status === 'NO'
                    ? '#fef2f2'
                    : '#fffbeb',
                border:
                  compatResult.status === 'YES'
                    ? '2px solid #6ee7b7'
                    : compatResult.status === 'NO'
                    ? '2px solid #fca5a5'
                    : '2px solid #fcd34d',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '1.4rem' }}>
                  {compatResult.status === 'YES' ? '✅' : compatResult.status === 'NO' ? '⛔' : '⚠️'}
                </span>
                <strong
                  style={{
                    fontSize: '1.05rem',
                    color:
                      compatResult.status === 'YES'
                        ? '#065f46'
                        : compatResult.status === 'NO'
                        ? '#991b1b'
                        : '#92400e',
                  }}
                >
                  {compatResult.text}
                </strong>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.88rem',
                  color:
                    compatResult.status === 'YES'
                      ? '#047857'
                      : compatResult.status === 'NO'
                      ? '#b91c1c'
                      : '#b45309',
                }}
              >
                {compatResult.details}
              </p>
            </div>
          </div>

          {/* Fullständig Korsmatris */}
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Översiktsmatris för CVK Y-koppling
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                  Klicka på en ruta i matrisen för att inspektera detaljerna ovan.
                </p>
              </div>

              <select
                value={matrixFilter}
                onChange={(e) => setMatrixFilter(e.target.value as any)}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0f172a',
                }}
              >
                <option value="CORE">Vanligaste IVA-infusionerna (16 st)</option>
                {DRUG_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    Grupp: {cat}
                  </option>
                ))}
              </select>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'left' }}>
                    Läkemedel
                  </th>
                  {matrixDrugs.map((d) => (
                    <th key={d.id} style={{ padding: '0.5rem', border: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'center' }}>
                      {d.name.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixDrugs.map((rowDrug) => (
                  <tr key={rowDrug.id}>
                    <td style={{ padding: '0.5rem', border: '1px solid #e2e8f0', fontWeight: 700, background: '#f8fafc', whiteSpace: 'nowrap' }}>
                      {rowDrug.name.split(' ')[0]}
                    </td>
                    {matrixDrugs.map((colDrug) => {
                      const res = getDrugCompatibility(rowDrug.id, colDrug.id);
                      const isSame = rowDrug.id === colDrug.id;
                      return (
                        <td
                          key={colDrug.id}
                          onClick={() => {
                            setCompatDrugA(rowDrug.id);
                            setCompatDrugB(colDrug.id);
                          }}
                          style={{
                            padding: '0.5rem',
                            border: '1px solid #e2e8f0',
                            textAlign: 'center',
                            cursor: 'pointer',
                            fontWeight: 800,
                            background: isSame
                              ? '#f1f5f9'
                              : res.status === 'YES'
                              ? '#d1fae5'
                              : res.status === 'NO'
                              ? '#fee2e2'
                              : '#fef3c7',
                            color: isSame
                              ? '#94a3b8'
                              : res.status === 'YES'
                              ? '#065f46'
                              : res.status === 'NO'
                              ? '#991b1b'
                              : '#92400e',
                          }}
                          title={`${rowDrug.name} + ${colDrug.name}: ${res.text}`}
                        >
                          {isSame ? '—' : res.status === 'YES' ? 'JA' : res.status === 'NO' ? 'NEJ' : 'OBS'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal för fullständig läkemedelsinformation */}
      <DrugDetailModal
        drug={detailModalDrug}
        onClose={() => setDetailModalDrug(null)}
        isFavorite={detailModalDrug ? favoriteDrugs.includes(detailModalDrug.id) : false}
        onToggleFavorite={(drugId) => {
          if (onToggleFavoriteDrug) onToggleFavoriteDrug(drugId);
        }}
      />
    </div>
  );
};
