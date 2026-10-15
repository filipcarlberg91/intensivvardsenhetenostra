import React, { useState } from 'react';

interface PocketguideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PocketguideModal: React.FC<PocketguideModalProps> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2.5, z + 0.25));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.6, z - 0.25));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1000,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
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
          borderRadius: '20px',
          width: '100%',
          maxWidth: '1100px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📖</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                IVA Pocketguide (Fullständig Snabbreferens)
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.1rem 0 0' }}>
                Intensivvårdsenheten Östra • Sahlgrenska Universitetssjukhuset
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Zoom kontroller */}
            <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '0.2rem', gap: '0.2rem' }}>
              <button
                onClick={handleZoomOut}
                style={{ border: 'none', background: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
                title="Zooma ut"
              >
                -
              </button>
              <button
                onClick={handleResetZoom}
                style={{ border: 'none', background: '#fff', padding: '0 0.5rem', height: '28px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                title="Återställ zoom"
              >
                {Math.round(zoomLevel * 100)}%
              </button>
              <button
                onClick={handleZoomIn}
                style={{ border: 'none', background: '#fff', width: '28px', height: '28px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}
                title="Zooma in"
              >
                +
              </button>
            </div>

            {/* Ladda ner PDF */}
            <a
              href="IVA_pocketguide.pdf"
              download="IVA_pocketguide.pdf"
              style={{
                background: '#0284c7',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              📥 Ladda ner PDF
            </a>

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: '#cbd5e1',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Bildvisare med Scroll & Zoom */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            background: '#334155',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <img
            src="iva_pocketguide.png"
            alt="IVA Pocketguide"
            style={{
              width: `${zoomLevel * 100}%`,
              maxWidth: zoomLevel === 1 ? '100%' : 'none',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              transition: 'width 0.15s ease',
            }}
          />
        </div>
      </div>
    </div>
  );
};
