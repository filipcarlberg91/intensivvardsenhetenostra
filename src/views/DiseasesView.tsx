import React, { useState } from 'react';
import { IVA_DISEASE_STATES } from '../data/clinicalData';
import { SearchIcon } from '../components/Icons';

export const DiseasesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string>(IVA_DISEASE_STATES[0]?.id || '');

  const categories = ['ALL', 'Circulation', 'Respiration', 'CRRT', 'Elimination', 'Omvårdnad'];

  const filteredDiseases = IVA_DISEASE_STATES.filter((d) => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortSummary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subtypes.some((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="diseases-view-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      {/* Header */}
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
              <span style={{ fontSize: '1.4rem' }}>🚨</span>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Sjukdomstillstånd på IVA (15 Kritiska Tillstånd)
              </h1>
              <span style={{ background: '#ffe4e6', color: '#e11d48', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                Klinisk Kunskapsbas
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
              Evidensbaserade handläggningsprotokoll, patofysiologi, kliniska tecken, övervakning och prioriterade åtgärder.
            </p>
          </div>

          {/* Sökfält */}
          <div style={{ position: 'relative', width: '280px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <SearchIcon size={16} />
            </span>
            <input
              type="text"
              placeholder="Sök tillstånd eller åtgärd..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.2rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Kategori-chips */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                border: 'none',
                background: selectedCategory === cat ? '#0f172a' : '#f1f5f9',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'ALL' ? 'Alla tillstånd' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tillståndslista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredDiseases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Inga tillstånd matchade din sökning</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              style={{
                marginTop: '0.5rem',
                border: 'none',
                background: '#0284c7',
                color: '#fff',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Återställ sökning
            </button>
          </div>
        ) : (
          filteredDiseases.map((dis) => {
            const isExpanded = expandedId === dis.id;

            return (
              <div
                key={dis.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isExpanded ? `2px solid ${dis.color}` : '1px solid #e2e8f0',
                  boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.02)',
                  overflow: 'hidden',
                  transition: 'border 0.2s ease',
                }}
              >
                {/* Header rad */}
                <div
                  onClick={() => setExpandedId(isExpanded ? '' : dis.id)}
                  style={{
                    padding: '1.2rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isExpanded ? dis.colorLight : '#ffffff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: dis.color,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {dis.category === 'Circulation' ? '❤️' : dis.category === 'Respiration' ? '🫁' : dis.category === 'CRRT' ? '🩸' : '🩺'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                          {dis.title}
                        </h2>
                        <span
                          style={{
                            background: '#ffffff',
                            color: dis.color,
                            border: `1px solid ${dis.color}`,
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '9999px',
                          }}
                        >
                          {dis.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                          {dis.category}
                        </span>
                      </div>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                        {dis.shortSummary}
                      </p>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.2rem', color: dis.color, fontWeight: 700, paddingLeft: '1rem' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {/* Expanderat innehåll */}
                {isExpanded && (
                  <div style={{ padding: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {dis.subtypes.map((sub, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            padding: '1.25rem',
                          }}
                        >
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: dis.color, margin: '0 0 0.85rem' }}>
                            {sub.name}
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            {/* Fysiologi */}
                            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <strong style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
                                🔬 Patofysiologi
                              </strong>
                              <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: '#1e293b' }}>
                                {sub.physio}
                              </p>
                            </div>

                            {/* Kliniska tecken */}
                            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <strong style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
                                ⚠️ Kliniska Tecken
                              </strong>
                              <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: '#1e293b' }}>
                                {sub.signs}
                              </p>
                            </div>

                            {/* Övervakning */}
                            <div style={{ background: '#ffffff', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <strong style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>
                                📈 Monitorering
                              </strong>
                              <p style={{ margin: '0.3rem 0 0', fontSize: '0.875rem', color: '#1e293b' }}>
                                {sub.monitoring}
                              </p>
                            </div>
                          </div>

                          {/* Prioriterade åtgärder */}
                          <div
                            style={{
                              background: '#ffffff',
                              borderLeft: `4px solid ${dis.color}`,
                              padding: '1rem',
                              borderRadius: '0 8px 8px 0',
                              border: '1px solid #e2e8f0',
                              borderLeftColor: dis.color,
                            }}
                          >
                            <strong style={{ fontSize: '0.85rem', color: dis.color, textTransform: 'uppercase' }}>
                              ⚡ Kliniska Åtgärder & Behandling
                            </strong>
                            <div style={{ whiteSpace: 'pre-line', fontSize: '0.875rem', color: '#0f172a', marginTop: '0.4rem', lineHeight: '1.6' }}>
                              {sub.actions}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
