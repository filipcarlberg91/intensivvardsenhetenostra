import React, { useState, useEffect, useRef } from 'react';
import { DocumentItem } from '../../types';
import { IVA_DRUGS } from '../../data/drugsData';
import { IVA_DISEASE_STATES } from '../../data/clinicalData';
import { SearchIcon } from '../Icons';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  onOpenDoc: (doc: DocumentItem) => void;
  onSelectCategory: (cat: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  documents,
  onOpenDoc,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Resultat
  const matchedDocs = q
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
      )
    : [];

  const matchedDrugs = q
    ? IVA_DRUGS.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.tradeNames.toLowerCase().includes(q) ||
          m.class.toLowerCase().includes(q) ||
          m.shortEffect.toLowerCase().includes(q) ||
          m.sideEffects.toLowerCase().includes(q) ||
          m.indications.toLowerCase().includes(q)
      )
    : [];

  const matchedDiseases = q
    ? IVA_DISEASE_STATES.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.shortSummary.toLowerCase().includes(q) ||
          s.subtypes.some((sub) => sub.name.toLowerCase().includes(q))
      )
    : [];

  const hasResults = matchedDocs.length > 0 || matchedDrugs.length > 0 || matchedDiseases.length > 0;

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1100,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '3rem 1rem 1rem',
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Sökruta */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SearchIcon size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Sök i hela hubben (PM, doser, sjukdomar, verktyg)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#0f172a',
            }}
          />
          <kbd style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#64748b' }}>ESC</kbd>
        </div>

        {/* Resultatlista */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.25rem' }}>
          {!q ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sök snabbt i hela IVA Östra</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setQuery('Noradrenalin')}
                  style={{ border: 'none', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Noradrenalin
                </button>
                <button
                  onClick={() => setQuery('Befuktare')}
                  style={{ border: 'none', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  F&P 950 Befuktare
                </button>
                <button
                  onClick={() => setQuery('ARDS')}
                  style={{ border: 'none', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  ARDS
                </button>
                <button
                  onClick={() => setQuery('CPOT')}
                  style={{ border: 'none', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  CPOT
                </button>
              </div>
            </div>
          ) : !hasResults ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
              Inga resultat matchade &quot;{query}&quot;
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Läkemedel */}
              {matchedDrugs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    💊 Läkemedel & Doser ({matchedDrugs.length})
                  </div>
                  {matchedDrugs.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => {
                        onClose();
                        onSelectCategory('DRUGS');
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.35rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{med.name}</strong> <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({med.standardConc})</span>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>{med.class}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Öppna doskalkylator →</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Sjukdomar */}
              {matchedDiseases.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#e11d48', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    🚨 Sjukdomstillstånd ({matchedDiseases.length})
                  </div>
                  {matchedDiseases.map((dis) => (
                    <div
                      key={dis.id}
                      onClick={() => {
                        onClose();
                        onSelectCategory('DISEASES');
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.35rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{dis.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#475569' }}>{dis.shortSummary.substring(0, 90)}...</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 700 }}>Öppna protokoll →</span>
                    </div>
                  ))}
                </div>
              )}

              {/* PM & Dokument */}
              {matchedDocs.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    📄 Rutiner & PM ({matchedDocs.length})
                  </div>
                  {matchedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => {
                        onClose();
                        onOpenDoc(doc);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        marginBottom: '0.35rem',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong>{doc.title}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{doc.category} • {doc.priority}</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 700 }}>Läs PM →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
