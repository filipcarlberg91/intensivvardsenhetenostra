import React, { useState } from 'react';
import { SERVO_U_DATA } from '../data/clinicalData';

export const EquipmentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'modes' | 'diagnostics' | 'alarms' | 'calc'>('overview');

  // PBW Kalkylator
  const [calcGender, setCalcGender] = useState<'male' | 'female'>('male');
  const [calcHeight, setCalcHeight] = useState<number>(178);
  const [targetMlKg, setTargetMlKg] = useState<number>(6); // ml/kg PBW (lungprotektivt 4-8)

  // Devine formula för PBW
  const pbw =
    calcGender === 'male'
      ? 50 + 0.91 * (calcHeight - 152.4)
      : 45.5 + 0.91 * (calcHeight - 152.4);

  const roundedPbw = Math.max(30, Math.round(pbw));
  const targetVt = Math.round(roundedPbw * targetMlKg);
  const vtRangeMin = Math.round(roundedPbw * 4);
  const vtRangeMax = Math.round(roundedPbw * 8);

  return (
    <div className="equipment-view-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🫁</span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {SERVO_U_DATA.title}
              </h1>
              <span style={{ background: '#cffafe', color: '#0891b2', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                Medicinteknik
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              {SERVO_U_DATA.description}
            </p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', gap: '0.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                border: 'none',
                background: activeTab === 'overview' ? '#ffffff' : 'transparent',
                color: activeTab === 'overview' ? '#0891b2' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: activeTab === 'overview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📖 Översikt
            </button>
            <button
              onClick={() => setActiveTab('modes')}
              style={{
                border: 'none',
                background: activeTab === 'modes' ? '#ffffff' : 'transparent',
                color: activeTab === 'modes' ? '#0891b2' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: activeTab === 'modes' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              ⚙️ Moder (PRVC, PC, PS)
            </button>
            <button
              onClick={() => setActiveTab('diagnostics')}
              style={{
                border: 'none',
                background: activeTab === 'diagnostics' ? '#ffffff' : 'transparent',
                color: activeTab === 'diagnostics' ? '#0891b2' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: activeTab === 'diagnostics' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🔬 Diagnostik (Pplat & ΔP)
            </button>
            <button
              onClick={() => setActiveTab('alarms')}
              style={{
                border: 'none',
                background: activeTab === 'alarms' ? '#ffffff' : 'transparent',
                color: activeTab === 'alarms' ? '#0891b2' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: activeTab === 'alarms' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              🚨 Larmfelsökning
            </button>
            <button
              onClick={() => setActiveTab('calc')}
              style={{
                border: 'none',
                background: activeTab === 'calc' ? '#ffffff' : 'transparent',
                color: activeTab === 'calc' ? '#0891b2' : '#64748b',
                fontWeight: 700,
                padding: '0.45rem 0.8rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.8rem',
                boxShadow: activeTab === 'calc' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              📏 PBW Tidalvolym Kalkylator
            </button>
          </div>
        </div>
      </div>

      {/* 1. ÖVERSIKT */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0891b2', margin: '0 0 0.85rem' }}>
              🛡️ Lungprotektiv Mekanisk Ventilation
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Standardprincipen på IVA Östra vid respiratorbehandling bygger på att minimera ventilatorskada (VILI - Ventilator-Induced Lung Injury) genom strikt begränsning av volym- och trycktrauma:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>1. Tidalvolym (Vt):</strong> 4–6 ml/kg PBW (Predikterad Idealvikt). Max 8 ml/kg.
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>2. Platåtryck (Pplat):</strong> Alltid &lt; 30 cmH2O (kontrolleras med Insp Pause).
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>3. Drivtryck (ΔP):</strong> Platåtryck minus total PEEP bör hållas &lt; 14 cmH2O.
              </div>
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <strong>4. Permissiv hyperkapni:</strong> Acceptera pH &gt; 7.20 om det skyddar lungan mot skadliga tryck (undantag vid ökat ICP!).
              </div>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0891b2', margin: '0 0 0.85rem' }}>
              ⚡ Snabbkontroller vid Skiftstart
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#334155' }}>
              <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                • <strong>Kufftryck:</strong> Kontrollera med kuffmanometer (mål 25–30 cmH2O).
              </div>
              <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                • <strong>Aktiv Befuktare (F&P 950):</strong> Invasivt 37 °C, kontrollera vattennivå.
              </div>
              <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                • <strong>Slutet sugsystem:</strong> Kontrollera funktion och färg på sekret.
              </div>
              <div style={{ padding: '0.5rem 0' }}>
                • <strong>Reservventilation:</strong> Verifiera korrekta backup-inställningar i spontanlägen (PS/CPAP).
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. VENTILATIONSMODER */}
      {activeTab === 'modes' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {SERVO_U_DATA.modes.map((m) => (
            <div key={m.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0891b2', margin: 0 }}>{m.name}</h3>
                <span style={{ fontSize: '0.72rem', background: '#ecfeff', color: '#0e7490', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {m.type}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, margin: '0 0 0.75rem' }}>
                {m.description}
              </p>
              <div style={{ background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.82rem', color: '#334155', marginBottom: '0.75rem' }}>
                <strong>Mekanism:</strong> {m.mechanism}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.5rem' }}>
                <strong>Inställningar:</strong> {m.keySettings}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#047857', background: '#ecfdf5', padding: '0.45rem', borderRadius: '6px', marginBottom: '0.35rem' }}>
                <strong>Fördel:</strong> {m.advantages[0]}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b91c1c', background: '#fff1f2', padding: '0.45rem', borderRadius: '6px' }}>
                <strong>Obs/Risk:</strong> {m.pitfalls[0]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DIAGNOSTIK */}
      {activeTab === 'diagnostics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {SERVO_U_DATA.diagnosticTools.map((d, idx) => (
            <div key={idx} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{d.name}</h3>
                <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                  {d.type}
                </span>
              </div>
              <div style={{ background: '#ecfeff', border: '1px solid #a5f3fc', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.82rem', color: '#0e7490', fontWeight: 700, marginBottom: '0.65rem' }}>
                Handhavande: {d.shortcut}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.5rem' }}>
                <strong>Formel:</strong> <code>{d.formula}</code>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '0.5rem' }}>
                <strong>Normalvärde:</strong> {d.normalValue}
              </div>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {d.clinicalMeaning}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 4. LARM & FELSÖKNING */}
      {activeTab === 'alarms' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {SERVO_U_DATA.alarmsTroubleshooting.map((al, idx) => (
            <div key={idx} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#b91c1c', margin: 0 }}>
                  🚨 {al.alarm}
                </h3>
                <span style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '9999px' }}>
                  {al.priority}
                </span>
              </div>
              <div style={{ background: '#fef2f2', border: '1px solid #fecdd3', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', color: '#991b1b', fontWeight: 700, marginBottom: '0.85rem' }}>
                ⚡ Direkt åtgärd: {al.immediateCheck}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
                <div>
                  <strong style={{ color: '#475569' }}>Troliga orsaker:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1.2rem', padding: 0, color: '#334155' }}>
                    {al.causes.map((c, cIdx) => (
                      <li key={cIdx} style={{ marginBottom: '0.2rem' }}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <strong style={{ color: '#047857' }}>Åtgärdsplan:</strong>
                  <ul style={{ margin: '0.25rem 0 0 1.2rem', padding: 0, color: '#334155' }}>
                    {al.actions.map((act, aIdx) => (
                      <li key={aIdx} style={{ marginBottom: '0.2rem' }}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. PBW TIDALVOLYM KALKYLATOR */}
      {activeTab === 'calc' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', maxWidth: '700px', margin: '0 auto', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0891b2', margin: '0 0 1rem' }}>
            📏 Beräkna Predikterad Idealvikt (PBW) & Tidalvolym
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem' }}>
            Lungstorlek avgörs av kön och kroppslängd, INTE av övervikt/fettmassa. Använd Devine-formeln för att ställa in skonsam tidalvolym (4–8 ml/kg PBW).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="equip_gender" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Kön</label>
              <select
                id="equip_gender"
                value={calcGender}
                onChange={(e) => setCalcGender(e.target.value as any)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}
              >
                <option value="male">Man</option>
                <option value="female">Kvinna</option>
              </select>
            </div>
            <div>
              <label htmlFor="equip_height" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Längd (cm)</label>
              <input
                id="equip_height"
                type="number"
                value={calcHeight}
                onChange={(e) => setCalcHeight(parseInt(e.target.value, 10) || 150)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.25rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label htmlFor="equip_target_ml" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Mål för Tidalvolym (ml / kg PBW)
              </label>
              <strong style={{ color: '#0891b2' }}>{targetMlKg} ml/kg PBW</strong>
            </div>
            <input
              id="equip_target_ml"
              type="range"
              min="4"
              max="8"
              step="0.5"
              value={targetMlKg}
              onChange={(e) => setTargetMlKg(parseFloat(e.target.value))}
              style={{ width: '100%', marginTop: '0.35rem', accentColor: '#0891b2' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b' }}>
              <span>4 ml/kg (Svår ARDS)</span>
              <span>6 ml/kg (Standard lungskydd)</span>
              <span>8 ml/kg (Övre gräns)</span>
            </div>
          </div>

          <div style={{ background: '#ecfeff', border: '1.5px solid #a5f3fc', borderRadius: '14px', padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.85rem', color: '#0e7490', fontWeight: 700, textTransform: 'uppercase' }}>
              Beräknad Idealvikt (PBW): {roundedPbw} kg
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0891b2', margin: '0.35rem 0' }}>
              {targetVt} <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>ml</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#0e7490', fontWeight: 600 }}>
              Rekommenderat lungskyddat område: {vtRangeMin} – {vtRangeMax} ml
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
