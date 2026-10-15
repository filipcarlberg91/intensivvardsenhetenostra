import React from 'react';
import { DrugItem } from '../../types';
import { StarIcon, PillIcon } from '../Icons';

interface DrugDetailModalProps {
  drug: DrugItem | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (drugId: string) => void;
  onOpenInCalculator?: (drugId: string) => void;
}

export const DrugDetailModal: React.FC<DrugDetailModalProps> = ({
  drug,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenInCalculator,
}) => {
  if (!drug) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '880px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(to right, #f8fafc, #ffffff)',
            borderBottom: '1px solid #e2e8f0',
            borderLeft: `6px solid ${drug.color}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
              <span
                style={{
                  background: `${drug.color}18`,
                  color: drug.color,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {drug.category}
              </span>
              <span
                style={{
                  background: '#f1f5f9',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                }}
              >
                {drug.class}
              </span>
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
              {drug.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem', fontWeight: 500 }}>
              Varunamn / Synonymer: <strong style={{ color: '#334155' }}>{drug.tradeNames}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <button
              onClick={() => onToggleFavorite(drug.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '10px',
                border: isFavorite ? '1.5px solid #f59e0b' : '1px solid #cbd5e1',
                background: isFavorite ? '#fffbeb' : '#ffffff',
                color: isFavorite ? '#b45309' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
              title={isFavorite ? 'Ta bort från favoriter' : 'Spara som favorit'}
            >
              <StarIcon filled={isFavorite} size={16} />
              <span>{isFavorite ? 'Favorit' : 'Favoritmarkera'}</span>
            </button>

            <button
              onClick={onClose}
              style={{
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#475569',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 700,
              }}
              title="Stäng fönster"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Kort sammanfattning banner */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.9rem 1.15rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Huvudsaklig effekt på IVA / PostOp
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                {drug.shortEffect}
              </div>
            </div>

            {onOpenInCalculator && (
              <button
                onClick={() => {
                  onOpenInCalculator(drug.id);
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(2, 132, 199, 0.2)',
                }}
              >
                <PillIcon size={16} />
                <span>Öppna i Dos & CVK-kalkylator →</span>
              </button>
            )}
          </div>

          {/* Farmakokinetik Strip (4 snabba boxar: Anslag, Duration, Halveringstid, Eliminering) */}
          <div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.6rem' }}>
              ⏱️ Farmakokinetik & Tidsprofil
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px', padding: '0.75rem 0.9rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Anslagstid (Onset)</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0c4a6e', marginTop: '0.2rem' }}>{drug.onset}</div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '0.75rem 0.9rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>Effektduration</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#14532d', marginTop: '0.2rem' }}>{drug.duration}</div>
              </div>

              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '10px', padding: '0.75rem 0.9rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase' }}>Halveringstid (T½)</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4c1d95', marginTop: '0.2rem' }}>{drug.halfLife}</div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 0.9rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Eliminering / Metabolism</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', marginTop: '0.2rem', lineHeight: 1.35 }}>{drug.elimination}</div>
              </div>
            </div>
          </div>

          {/* 2-Column Grid: Vad det gör / Verkningsmekanism & Indikationer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.15rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🧬 Vad det gör (Verkningsmekanism)
              </div>
              <p style={{ fontSize: '0.88rem', color: '#1e293b', margin: 0, lineHeight: 1.55 }}>
                {drug.mechanism}
              </p>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.15rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🎯 Indikationer på IVA & PostOp
              </div>
              <p style={{ fontSize: '0.88rem', color: '#1e293b', margin: 0, lineHeight: 1.55 }}>
                {drug.indications}
              </p>
            </div>
          </div>

          {/* 2-Column Grid: Biverkningar & Kontraindikationer */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1rem 1.15rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                ⚠️ Biverkningar
              </div>
              <p style={{ fontSize: '0.88rem', color: '#881337', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                {drug.sideEffects}
              </p>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem 1.15rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                🛑 Kontraindikationer & Försiktighet
              </div>
              <p style={{ fontSize: '0.88rem', color: '#78350f', margin: 0, lineHeight: 1.55, fontWeight: 500 }}>
                {drug.contraindications}
              </p>
            </div>
          </div>

          {/* Dosering, Spädning & Administrering */}
          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '14px', padding: '1.15rem 1.25rem' }}>
            <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 0.85rem' }}>
              💉 Dosering, Spädning & Administrering (IVA / PostOp)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Standardkoncentration</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>{drug.standardConc}</div>
                {drug.altConc && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Alternativ: {drug.altConc}</div>
                )}
              </div>

              <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Doseringsintervall</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0284c7', marginTop: '0.15rem' }}>{drug.standardDoseRange}</div>
                {drug.bolusDose && (
                  <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.2rem', fontWeight: 600 }}>
                    Bolus: {drug.bolusDose}
                  </div>
                )}
              </div>

              <div style={{ background: '#ffffff', padding: '0.75rem 0.9rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Infart / Administreringsväg</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>{drug.administrationRoute}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>Hållbarhet: {drug.stability}</div>
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Beredning & Spädningsinstruktion ({drug.approvedDiluents})
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.5 }}>
                {drug.dilutionGuide}
              </div>
            </div>

            {/* Viktiga kliniska IVA-noteringar */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#1d4ed8', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                💡 Kliniska IVA- & PostOp-noteringar
              </div>
              <div style={{ fontSize: '0.88rem', color: '#1e3a8a', lineHeight: 1.5, fontWeight: 600 }}>
                {drug.clinicalNotes}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            background: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            IVA & PostOp Klinisk Läkemedelsguide • Kontrollera alltid mot patientens aktuella ordination i Melior/MCCA
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
};
