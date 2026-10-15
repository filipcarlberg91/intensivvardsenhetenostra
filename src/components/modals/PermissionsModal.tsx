import React, { useState } from 'react';
import { AuthorizedEditor } from '../../types';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editors: AuthorizedEditor[];
  ownerEmail: string;
  onAddEditor: (email: string, name: string, role: 'OWNER' | 'EDITOR') => void;
  onRemoveEditor: (email: string) => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  editors,
  ownerEmail,
  onAddEditor,
  onRemoveEditor,
}) => {
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'OWNER' | 'EDITOR'>('EDITOR');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newEmail.includes('@')) {
      setErrorMsg('Vänligen ange en giltig e-postadress.');
      return;
    }
    if (editors.some((ed) => ed.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setErrorMsg('Denna användare finns redan i behörighetslistan.');
      return;
    }
    setErrorMsg('');
    onAddEditor(newEmail.trim(), newName.trim() || newEmail.trim().split('@')[0], newRole);
    setNewEmail('');
    setNewName('');
  };

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1100,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              🛡️ Behörigheter & Roller
            </h2>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
              Hantera redaktörer med behörighet att redigera och ladda upp PM
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#e2e8f0',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Lägg till ny redaktör */}
          <form
            onSubmit={handleAdd}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
              Bjud in ny redaktör
            </h3>

            {errorMsg && (
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  background: '#fee2e2',
                  border: '1px solid #f87171',
                  borderRadius: '6px',
                  color: '#b91c1c',
                  fontSize: '0.8rem',
                }}
              >
                ⚠️ {errorMsg}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Namn</label>
                <input
                  type="text"
                  placeholder="t.ex. Anna Svensson"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Roll</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'OWNER' | 'EDITOR')}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="EDITOR">Redaktör (Editor)</option>
                  <option value="OWNER">Ägare (Admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>E-postadress *</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                <input
                  type="email"
                  required
                  placeholder="anna.svensson@vgregion.se"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  + Bjud in
                </button>
              </div>
            </div>
          </form>

          {/* Nuvarande redaktörer */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                Behöriga användare ({editors.length})
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {editors.map((editor) => {
                const isPrimaryOwner = editor.email.toLowerCase() === ownerEmail.toLowerCase();
                const initial = (editor.name || editor.email).charAt(0).toUpperCase();

                return (
                  <div
                    key={editor.email}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: isPrimaryOwner ? '#0284c7' : '#e0f2fe',
                          color: isPrimaryOwner ? '#ffffff' : '#0369a1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {initial}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                          {editor.name || editor.email.split('@')[0]}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {editor.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          background: editor.role === 'OWNER' ? '#fef3c7' : '#e0f2fe',
                          color: editor.role === 'OWNER' ? '#b45309' : '#0284c7',
                        }}
                      >
                        {editor.role === 'OWNER' ? '👑 Ägare' : '✏️ Redaktör'}
                      </span>
                      {!isPrimaryOwner && (
                        <button
                          onClick={() => onRemoveEditor(editor.email)}
                          title="Ta bort redaktör"
                          style={{
                            border: 'none',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          Ta bort
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1.25rem',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Klar
          </button>
        </div>
      </div>
    </div>
  );
};
