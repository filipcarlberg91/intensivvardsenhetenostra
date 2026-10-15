import React, { useState } from 'react';
import { GoogleIcon } from '../Icons';
import { UserProfile } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const PRESET_ACCOUNTS = [
  {
    name: 'Filip Carlberg',
    email: 'filipcarlberg91@gmail.com',
    roleLabel: 'Huvudägare / Admin',
    desc: 'Full behörighet att redigera, ladda upp och hantera användarroller',
    badge: '👑 Ägare',
    badgeColor: '#b45309',
    badgeBg: '#fef3c7',
  },
  {
    name: 'IVA Specialistläkare',
    email: 'iva.lakare@vgregion.se',
    roleLabel: 'Behörig Redaktör',
    desc: 'Kan redigera och publicera PM, läkemedelsrutiner och protokoll',
    badge: '✏️ Redaktör',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
  },
  {
    name: 'IVA Specialistsjuksköterska',
    email: 'iva.ssk@vgregion.se',
    roleLabel: 'Behörig Redaktör',
    desc: 'Kan uppdatera omvårdnadsrutiner, spola-protokoll och checklistor',
    badge: '✏️ Redaktör',
    badgeColor: '#0284c7',
    badgeBg: '#e0f2fe',
  },
  {
    name: 'Klinisk Läsare / ST-läkare',
    email: 'st.lakare@vgregion.se',
    roleLabel: 'Läsare',
    desc: 'Personliga favoriter och anteckningar, alla kalkylatorer och PM tillgängliga',
    badge: '👁️ Läsare',
    badgeColor: '#475569',
    badgeBg: '#f1f5f9',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (acc: typeof PRESET_ACCOUNTS[0]) => {
    onLogin({
      name: acc.name,
      email: acc.email,
    });
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) {
      setErrorMsg('Vänligen ange en giltig e-postadress.');
      return;
    }
    const name = customName.trim() || customEmail.trim().split('@')[0];
    onLogin({
      name,
      email: customEmail.trim(),
    });
    onClose();
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
          maxWidth: '520px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GoogleIcon size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Logga in i IVA Dokumenthub
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Välj profil för att aktivera favoriter, checklistor och behörigheter
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: '#e2e8f0',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.6rem' }}>
              Snabbval av profil (Sahlgrenska / Östra)
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PRESET_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectPreset(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '10px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0284c7';
                    e.currentTarget.style.background = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#ffffff';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#0284c7',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        flexShrink: 0,
                      }}
                    >
                      {acc.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>
                        {acc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {acc.email}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.1rem' }}>
                        {acc.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '999px',
                      fontWeight: 700,
                      background: acc.badgeBg,
                      color: acc.badgeColor,
                      flexShrink: 0,
                    }}
                  >
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0.25rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>eller ange eget konto</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleCustomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
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
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Ditt Namn</label>
                <input
                  type="text"
                  placeholder="t.ex. Johan Lind"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>E-postadress *</label>
                <input
                  type="email"
                  required
                  placeholder="johan.lind@vgregion.se"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.25rem',
                padding: '0.6rem',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Logga in med e-post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
