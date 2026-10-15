import React, { useState } from 'react';
import { CPOT_SCALE, RASS_SCALE } from '../data/clinicalData';

export const PainSedationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cpot' | 'rass'>('cpot');
  const [cpotScores, setCpotScores] = useState<Record<string, number>>({
    facial: 0,
    movements: 0,
    muscle_tone: 0,
    vent_or_vocal: 0,
  });
  const [selectedRass, setSelectedRass] = useState<number>(0);

  const totalCpot = Object.values(cpotScores).reduce((a, b) => a + b, 0);

  const getCpotInterpretation = (score: number) => {
    if (score <= 2) {
      return {
        level: 'Adekvat smärtkontroll / Minimal smärta',
        color: '#15803d',
        bg: '#dcfce7',
        border: '#86efac',
        advice: 'Patienten är smärtlindrad. Fortsätt regelbunden monitorering.',
      };
    } else if (score <= 5) {
      return {
        level: 'Måttlig smärta (Åtgärd krävs)',
        color: '#b45309',
        bg: '#fef3c7',
        border: '#fde68a',
        advice: 'Poäng ≥ 3 indikerar kliniskt signifikant smärta. Titrera analgetika (t.ex. Remifentanil, Fentanyl, Morfin) och omvärdera efter 15–30 min.',
      };
    } else {
      return {
        level: 'Svår smärta / Agitation (Akut analgesi)',
        color: '#b91c1c',
        bg: '#fee2e2',
        border: '#fca5a5',
        advice: 'Akut smärtreaktion! Ge ordinerad bolusdos av analgetika, uteslut orsak (t.ex. urinstämma, dislocerad tub, extremitetstryck) och öka grundinfusion.',
      };
    }
  };

  const cpotInterp = getCpotInterpretation(totalCpot);
  const currentRassObj = RASS_SCALE.levels.find((l) => l.score === selectedRass) || RASS_SCALE.levels[4];

  return (
    <div className="pain-sedation-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      {/* Sektionshuvud */}
      <div className="section-header-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem 1.5rem', border: '1px solid #e2e8f0', marginBottom: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🧠</span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Smärta & Sedering (CPOT & RASS)
              </h1>
              <span style={{ background: '#fae8ff', color: '#c026d3', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                Kliniska IVA-Skalor
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Validerade mätinstrument för smärtbedömning och sederingsdjup hos intensivvårdspatienter.
            </p>
          </div>

          {/* Flikväljare */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', gap: '0.35rem' }}>
            <button
              style={{
                border: 'none',
                background: activeTab === 'cpot' ? '#ffffff' : 'transparent',
                color: activeTab === 'cpot' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'cpot' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              onClick={() => setActiveTab('cpot')}
            >
              <span>📊</span>
              <span>CPOT Smärtskattning</span>
            </button>
            <button
              style={{
                border: 'none',
                background: activeTab === 'rass' ? '#ffffff' : 'transparent',
                color: activeTab === 'rass' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: activeTab === 'rass' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
              onClick={() => setActiveTab('rass')}
            >
              <span>💤</span>
              <span>RASS Sederingsgrad</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. CPOT SKATTNING */}
      {activeTab === 'cpot' && (
        <div>
          {/* Resultatkort */}
          <div
            style={{
              background: cpotInterp.bg,
              border: `1.5px solid ${cpotInterp.border}`,
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: cpotInterp.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Aktuell CPOT-Poäng:
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: cpotInterp.color, marginTop: '0.15rem' }}>
                {totalCpot} / 8 poäng — {cpotInterp.level}
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.875rem', color: '#334155', maxWidth: '750px' }}>
                {cpotInterp.advice}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: cpotInterp.color,
                  color: '#ffffff',
                  fontSize: '2rem',
                  fontWeight: 800,
                  width: '60px',
                  height: '60px',
                  lineHeight: '60px',
                  borderRadius: '50%',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {totalCpot}
              </span>
            </div>
          </div>

          {/* Domäner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '1.25rem' }}>
            {CPOT_SCALE.domains.map((dom) => (
              <div
                key={dom.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{dom.name}</h3>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                    Valt: {cpotScores[dom.id] ?? 0} p
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {dom.options.map((opt) => {
                    const isSelected = (cpotScores[dom.id] ?? 0) === opt.score;
                    return (
                      <label
                        key={opt.score}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.75rem 1rem',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                          background: isSelected ? '#f0f9ff' : '#f8fafc',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <input
                          type="radio"
                          name={`cpot_${dom.id}`}
                          value={opt.score}
                          checked={isSelected}
                          onChange={() => setCpotScores((prev) => ({ ...prev, [dom.id]: opt.score }))}
                          style={{ marginTop: '0.2rem', accentColor: '#0284c7' }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.9rem', color: isSelected ? '#0369a1' : '#0f172a' }}>
                              {opt.label}
                            </strong>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isSelected ? '#0369a1' : '#64748b' }}>
                              +{opt.score} p
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                            {opt.desc}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Målbeskrivning */}
          <div style={{ marginTop: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', fontSize: '0.85rem', color: '#475569' }}>
            <strong>💡 Mål på IVA:</strong> CPOT ≤ 2 poäng. Smärtlindring bör alltid föregå sedering (&quot;Analgo-sedering&quot;).
          </div>
        </div>
      )}

      {/* 2. RASS SEDERINGSGRAD */}
      {activeTab === 'rass' && (
        <div>
          {/* Framhävt RASS Resultat */}
          <div
            style={{
              background: currentRassObj.bg,
              border: `1.5px solid ${currentRassObj.color}`,
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: currentRassObj.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Vald Sederingsnivå:
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: currentRassObj.color, marginTop: '0.15rem' }}>
                {currentRassObj.name}
              </div>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.9rem', color: '#1e293b', fontWeight: 500, maxWidth: '750px' }}>
                {currentRassObj.desc}
              </p>
            </div>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: currentRassObj.color,
                  color: '#ffffff',
                  fontSize: '2rem',
                  fontWeight: 800,
                  width: '64px',
                  height: '64px',
                  lineHeight: '64px',
                  borderRadius: '50%',
                  textAlign: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {selectedRass > 0 ? `+${selectedRass}` : selectedRass}
              </span>
            </div>
          </div>

          {/* Klickbara nivåer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {RASS_SCALE.levels.map((lvl) => {
              const isSelected = selectedRass === lvl.score;
              return (
                <div
                  key={lvl.score}
                  onClick={() => setSelectedRass(lvl.score)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '12px',
                    border: isSelected ? `2.5px solid ${lvl.color}` : '1px solid #e2e8f0',
                    background: isSelected ? lvl.bg : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: lvl.color,
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {lvl.score > 0 ? `+${lvl.score}` : lvl.score}
                    </span>
                    <div>
                      <strong style={{ fontSize: '0.95rem', color: lvl.color }}>{lvl.name}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.1rem' }}>{lvl.desc}</div>
                    </div>
                  </div>
                  {isSelected && <span style={{ color: lvl.color, fontWeight: 700, fontSize: '1.2rem' }}>✓</span>}
                </div>
              );
            })}
          </div>

          {/* Kliniska målområden */}
          <div style={{ marginTop: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
              🎯 Standardmål för sedering på IVA:
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#dcfce7', padding: '0.75rem', borderRadius: '8px', border: '1px solid #86efac' }}>
                <strong style={{ color: '#166534' }}>Mål vid urträning / weaning:</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#14532d' }}>RASS 0 till -1 (Vaken, lugn, följer uppmaningar).</p>
              </div>
              <div style={{ background: '#e0e7ff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
                <strong style={{ color: '#3730a3' }}>Mål vid invasiv kontrollerad ventilation:</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#312e81' }}>RASS -2 till -3 (Kort ögonkontakt vid tilltal).</p>
              </div>
              <div style={{ background: '#f3e8ff', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
                <strong style={{ color: '#6b21a8' }}>Djup sedering (ARDS / Bukläge / ICP):</strong>
                <p style={{ margin: '0.2rem 0 0', color: '#581c87' }}>RASS -4 till -5 (Kräver adekvat smärtlindring + muskelrelaxantia vid behov).</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
