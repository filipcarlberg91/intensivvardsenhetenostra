import React, { useState } from 'react';
import { CATEGORY_HUB_DATA, CategoryHubInfo } from '../data/categoryHubData';
import { CategoryItem } from '../types';

interface CategoryHubSectionProps {
  categoryId: string;
  categoryObj?: CategoryItem;
  onSelectCategory: (cat: string) => void;
  pmCount: number;
  onScrollToPmList?: () => void;
}

export const CategoryHubSection: React.FC<CategoryHubSectionProps> = ({
  categoryId,
  categoryObj,
  onSelectCategory,
  pmCount,
  onScrollToPmList,
}) => {
  const [activeSubView, setActiveSubView] = useState<'ALL' | 'VALUES' | 'SETTINGS' | 'PEARLS'>('ALL');
  const [valueFilter, setValueFilter] = useState('');

  const hub: CategoryHubInfo | undefined = CATEGORY_HUB_DATA[categoryId];
  if (!hub) return null;

  const accentColor = categoryObj?.color || '#0284c7';
  const accentLight = categoryObj?.colorLight || '#e0f2fe';
  const accentBorder = categoryObj?.colorBorder || '#bae6fd';

  const filteredValues = hub.normalValues.filter(
    (row) =>
      !valueFilter.trim() ||
      row.parameter.toLowerCase().includes(valueFilter.toLowerCase()) ||
      row.targetIva.toLowerCase().includes(valueFilter.toLowerCase()) ||
      row.normalRange.toLowerCase().includes(valueFilter.toLowerCase()) ||
      row.note.toLowerCase().includes(valueFilter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', marginBottom: '1.5rem' }}>
      {/* Snabbnavigering i Hubben + Genvägar till Kalkylatorer */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '0.9rem 1.2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Sektionsfilter (Visa allt vs fokusera) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: '#f1f5f9',
              padding: '0.25rem',
              borderRadius: '10px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setActiveSubView('ALL')}
              style={{
                border: 'none',
                background: activeSubView === 'ALL' ? '#ffffff' : 'transparent',
                color: activeSubView === 'ALL' ? '#0f172a' : '#475569',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: activeSubView === 'ALL' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Översikt (Alla delar)
            </button>
            <button
              onClick={() => setActiveSubView('VALUES')}
              style={{
                border: 'none',
                background: activeSubView === 'VALUES' ? '#ffffff' : 'transparent',
                color: activeSubView === 'VALUES' ? accentColor : '#475569',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: activeSubView === 'VALUES' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Normalvärden & Mål ({hub.normalValues.length})
            </button>
            <button
              onClick={() => setActiveSubView('SETTINGS')}
              style={{
                border: 'none',
                background: activeSubView === 'SETTINGS' ? '#ffffff' : 'transparent',
                color: activeSubView === 'SETTINGS' ? accentColor : '#475569',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: activeSubView === 'SETTINGS' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Inställningar & Riktlinjer ({hub.settingsAndProtocols.length})
            </button>
            <button
              onClick={() => setActiveSubView('PEARLS')}
              style={{
                border: 'none',
                background: activeSubView === 'PEARLS' ? '#ffffff' : 'transparent',
                color: activeSubView === 'PEARLS' ? accentColor : '#475569',
                fontWeight: 700,
                fontSize: '0.78rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: activeSubView === 'PEARLS' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Bra att veta & Checklista ({hub.goodToKnow.length})
            </button>
          </div>

          {onScrollToPmList && (
            <button
              onClick={onScrollToPmList}
              style={{
                border: `1px solid ${accentBorder}`,
                background: accentLight,
                color: accentColor,
                fontWeight: 800,
                fontSize: '0.78rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span>Hoppa till Rutiner/PM ({pmCount} st)</span>
              <span>↓</span>
            </button>
          )}
        </div>

        {/* Relaterade Interaktiva Verktyg & Kalkylatorer */}
        {hub.quickLinks && hub.quickLinks.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '0.6rem',
              paddingTop: '0.35rem',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            {hub.quickLinks.map((ql, idx) => (
              <button
                key={idx}
                onClick={() => onSelectCategory(ql.targetCategory)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.65rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.55rem 0.85rem',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{ql.label}</div>
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: '#64748b',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {ql.desc}
                  </div>
                </div>
                <span style={{ color: accentColor, fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 }}>→</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. NORMALVÄRDEN & IVA-MÅLVÄRDEN */}
      {(activeSubView === 'ALL' || activeSubView === 'VALUES') && (
        <section
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}
        >
          <div
            style={{
              padding: '0.9rem 1.25rem',
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Normalvärden, Målvärden & Gränsvärden – {categoryObj?.name || categoryId}
              </h2>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                Referensintervall och kliniska styrgränser vid sängkant på IVA Östra
              </p>
            </div>

            <input
              type="text"
              placeholder="Filtrera parameter (t.ex. Pplat, MAP, iCa)..."
              value={valueFilter}
              onChange={(e) => setValueFilter(e.target.value)}
              style={{
                padding: '0.38rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                width: '240px',
                maxWidth: '100%',
              }}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.82rem',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: '#f1f5f9',
                    borderBottom: '1px solid #cbd5e1',
                    textAlign: 'left',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#475569',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <th style={{ padding: '0.6rem 1rem' }}>Parameter / Mätvärde</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Normalreferens</th>
                  <th style={{ padding: '0.6rem 1rem' }}>IVA-Målvärde / Styrgräns</th>
                  <th style={{ padding: '0.6rem 1rem' }}>Klinisk kommentar & Åtgärd</th>
                </tr>
              </thead>
              <tbody>
                {filteredValues.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: idx < filteredValues.length - 1 ? '1px solid #f1f5f9' : 'none',
                      background: row.isCritical ? '#fffbeb' : idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                    }}
                  >
                    <td style={{ padding: '0.65rem 1rem', fontWeight: 800, color: '#0f172a', minWidth: '190px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span>{row.parameter}</span>
                        {row.isCritical && (
                          <span
                            style={{
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              color: '#b45309',
                              textTransform: 'uppercase',
                            }}
                          >
                            • Nyckelmål
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: '0.65rem 1rem',
                        color: '#475569',
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: '0.78rem',
                        minWidth: '130px',
                      }}
                    >
                      {row.normalRange}
                    </td>
                    <td
                      style={{
                        padding: '0.65rem 1rem',
                        fontWeight: 800,
                        color: accentColor,
                        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: '0.8rem',
                        minWidth: '200px',
                      }}
                    >
                      {row.targetIva}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', color: '#334155', lineHeight: 1.4, minWidth: '260px' }}>
                      {row.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 2. INSTÄLLNINGAR, DOSERING & RIKTLINJER */}
      {(activeSubView === 'ALL' || activeSubView === 'SETTINGS') && (
        <section>
          <div style={{ marginBottom: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Inställningar, Behandlingsprotokoll & Riktlinjer
              </h2>
              <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.1rem 0 0' }}>
                Praktiska grundinställningar, titreringsscheman och rutiner vid sängkant
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '0.9rem',
            }}
          >
            {hub.settingsAndProtocols.map((card, cIdx) => (
              <div
                key={cIdx}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  padding: '1rem 1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.55rem' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {card.title}
                  </h3>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: accentColor }}>
                    {card.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  {card.items.map((it, iIdx) => (
                    <div
                      key={iIdx}
                      style={{
                        paddingBottom: iIdx < card.items.length - 1 ? '0.55rem' : 0,
                        borderBottom: iIdx < card.items.length - 1 ? '1px dashed #e2e8f0' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b' }}>{it.label}</span>
                        <span
                          style={{
                            fontSize: '0.79rem',
                            fontWeight: 800,
                            color: accentColor,
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {it.value}
                        </span>
                      </div>
                      {it.detail && (
                        <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.15rem', lineHeight: 1.35 }}>
                          {it.detail}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. BRA SAKER ATT VETA, KLINISKA PÄRLOR & RÖDA FLAGGOR */}
      {(activeSubView === 'ALL' || activeSubView === 'PEARLS') && (
        <section>
          <div style={{ marginBottom: '0.65rem' }}>
            <h2 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Bra saker att veta, Kliniska Pärlor & Fallgropar
            </h2>
            <p style={{ fontSize: '0.76rem', color: '#64748b', margin: '0.1rem 0 0' }}>
              Viktig fysiologi, felsökning vid larm och kritiska säkerhetsregler
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: '0.9rem',
            }}
          >
            {hub.goodToKnow.map((box, bIdx) => {
              const isWarning = box.type === 'warning';
              const isChecklist = box.type === 'checklist';
              const boxBg = isWarning ? '#fff1f2' : isChecklist ? '#f0fdf4' : '#f8fafc';
              const boxBorder = isWarning ? '#fecdd3' : isChecklist ? '#bbf7d0' : '#e2e8f0';
              const titleColor = isWarning ? '#9f1239' : isChecklist ? '#166534' : '#0f172a';
              const kicker = isWarning ? 'Viktig Säkerhetsregel / Fallgrop' : isChecklist ? 'Bedside-Checklista' : 'Klinisk Pärla & Fysiologi';

              return (
                <div
                  key={bIdx}
                  style={{
                    background: boxBg,
                    borderRadius: '14px',
                    border: `1px solid ${boxBorder}`,
                    padding: '1rem 1.15rem',
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: titleColor, opacity: 0.85, marginBottom: '0.2rem' }}>
                    {kicker}
                  </div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: titleColor, margin: '0 0 0.55rem' }}>
                    {box.title}
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: '1.15rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {box.points.map((pt, pIdx) => (
                      <li key={pIdx} style={{ fontSize: '0.79rem', color: '#1e293b', lineHeight: 1.45 }}>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
