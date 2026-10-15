import React from 'react';
import { ShiftChecklistItem } from '../../types';

interface ShiftChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  checklist: ShiftChecklistItem[];
  onToggleItem: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onResetChecklist: () => void;
}

export const ShiftChecklistModal: React.FC<ShiftChecklistModalProps> = ({
  isOpen,
  onClose,
  checklist,
  onToggleItem,
  onUpdateNote,
  onResetChecklist,
}) => {
  if (!isOpen) return null;

  const checkedCount = checklist.filter((i) => i.checked).length;
  const totalCount = checklist.length;
  const percent = totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0;

  return (
    <div className="modal-backdrop is-open" onClick={onClose} style={{ zIndex: 1000, position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Start av arbetspass (12 punkter)
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                Strukturerad klinisk status- och säkerhetskontroll vid skiftstart på IVA Östra
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: '#e2e8f0', color: '#475569', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ padding: '0.75rem 1.5rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, marginRight: '1.5rem' }}>
            <div style={{ height: '8px', background: '#cbd5e1', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${percent}%`,
                  background: percent === 100 ? '#10b981' : '#0284c7',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: percent === 100 ? '#15803d' : '#0284c7' }}>
              {checkedCount} av {totalCount} klara ({percent}%)
            </span>
            <button
              onClick={onResetChecklist}
              style={{ border: 'none', background: 'transparent', color: '#64748b', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Nollställ
            </button>
          </div>
        </div>

        {/* Checklista Items */}
        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {checklist.map((item) => (
            <div
              key={item.id}
              style={{
                border: item.checked ? '1px solid #86efac' : '1px solid #e2e8f0',
                background: item.checked ? '#f0fdf4' : '#ffffff',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id={`chk_${item.id}`}
                  checked={item.checked}
                  onChange={() => onToggleItem(item.id)}
                  style={{ width: '18px', height: '18px', marginTop: '0.2rem', accentColor: '#10b981', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <label
                      htmlFor={`chk_${item.id}`}
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: item.checked ? '#166534' : '#0f172a',
                        textDecoration: item.checked ? 'line-through' : 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {item.number}. {item.title}
                    </label>
                    <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 600, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      {item.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.25rem 0 0.5rem', lineHeight: 1.45 }}>
                    {item.description}
                  </p>
                  <input
                    type="text"
                    placeholder="Anteckning vid behov (t.ex. RLS 1, pupiller 3mm runda l-r, PEEP 8)..."
                    value={item.notes || ''}
                    onChange={(e) => onUpdateNote(item.id, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.35rem 0.55rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8rem',
                      background: item.checked ? '#ffffff' : '#f8fafc',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            💾 Spara ändringar automatiskt i din webbläsare
          </span>
          <button
            onClick={onClose}
            style={{
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            Stäng checklistan
          </button>
        </div>
      </div>
    </div>
  );
};
