import React from 'react';
import { CategoryItem, DocumentItem, UserProfile } from '../types';
import {
  HomeIcon,
  StarIcon,
  SearchIcon,
  SparklesIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  FlaskIcon,
  DropletIcon,
  NutritionIcon,
  PillIcon,
  VentilatorIcon,
  LayersIcon,
  CategoryIcon
} from './Icons';

interface FloatingMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: CategoryItem[];
  documents: DocumentItem[];
  favoritesCount: number;
  currentUser: UserProfile | null;
  onOpenGlobalSearch: () => void;
  onOpenUploadModal: () => void;
  onOpenGeminiChat: () => void;
  canEdit: boolean;
}

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  activeCategory,
  onSelectCategory,
  categories,
  documents,
  favoritesCount,
  currentUser,
  onOpenGlobalSearch,
  onOpenUploadModal,
  onOpenGeminiChat,
  canEdit,
}) => {
  return (
    <div
      id="floatingMenuContainer"
      className={`fab-container ${isOpen ? 'is-open' : ''}`}
      style={{
        position: 'fixed',
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        right: '1.25rem',
        left: 'auto',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fab-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 99990,
          }}
        />
      )}

      {/* FAB main button */}
      <button
        className="fab-main-btn"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title="Öppna IVA-menyn (Navigering & Sidor)"
        aria-label="Öppna navigationsmeny"
        aria-expanded={isOpen}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: isOpen ? '#0f172a' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2.5px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 10px 25px -4px rgba(2, 132, 199, 0.5), 0 4px 10px rgba(0, 0, 0, 0.25)',
          cursor: 'pointer',
          zIndex: 100000,
          touchAction: 'manipulation',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          position: 'relative',
        }}
      >
        {isOpen ? (
          <span style={{ fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
        {favoritesCount > 0 && !isOpen && (
          <span
            className="fab-badge-pill"
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#ef4444',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 800,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid white',
            }}
          >
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Utfällbar meny-panel */}
      {isOpen && (
        <div
          className="fab-menu-panel"
          onClick={(e) => e.stopPropagation()}
          role="menu"
          style={{
            position: 'fixed',
            right: '1.25rem',
            bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))',
            width: 'min(380px, calc(100vw - 2.5rem))',
            maxHeight: 'calc(80vh - env(safe-area-inset-bottom, 0px))',
            overflowY: 'auto',
            background: '#0f172a',
            backdropFilter: 'none',
            WebkitBackdropFilter: 'none',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            padding: '1.15rem',
            zIndex: 99998,
            color: '#f8fafc',
            pointerEvents: 'auto',
            opacity: 1,
          }}
        >
          <div className="fab-panel-header">
            <div className="fab-panel-title">
              <span style={{ color: '#0284c7' }}>🏥</span>
              <span>IVA Navigering</span>
            </div>
            <div className="fab-header-actions">
              <button
                className="fab-mini-btn"
                onClick={() => {
                  onClose();
                  onOpenGlobalSearch();
                }}
                title="Sök i hela appen (Ctrl+K)"
              >
                <SearchIcon size={14} />
              </button>
              {canEdit && (
                <button
                  className="fab-mini-btn primary"
                  onClick={() => {
                    onClose();
                    onOpenUploadModal();
                  }}
                  title="Ladda upp nytt PM"
                >
                  +
                </button>
              )}
            </div>
          </div>

          {/* Startsida card */}
          <div
            className={`fab-mypage-card ${activeCategory === 'HOME' ? 'active' : ''}`}
            style={{
              background: activeCategory === 'HOME'
                ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(14, 165, 233, 0.2) 100%)'
                : 'rgba(255, 255, 255, 0.06)',
              borderColor: activeCategory === 'HOME' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)',
              marginBottom: '0.65rem',
            }}
            onClick={() => {
              onSelectCategory('HOME');
              onClose();
            }}
            title="Öppna Startsidan"
          >
            <div className="fab-mypage-icon" style={{ background: '#0284c7', color: '#ffffff' }}>
              <HomeIcon size={20} />
            </div>
            <div className="fab-mypage-info">
              <div className="fab-mypage-title" style={{ color: '#ffffff' }}>Startsida</div>
              <div className="fab-mypage-sub">IVA Översikt & Guider</div>
            </div>
            <span style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 700 }}>🏠</span>
          </div>

          {/* Min Sida & Favoriter */}
          <div
            className={`fab-mypage-card ${activeCategory === 'MY_PAGE' ? 'active' : ''}`}
            onClick={() => {
              onSelectCategory('MY_PAGE');
              onClose();
            }}
            title="Öppna Min Sida med dina sparade favoriter"
          >
            <div className="fab-mypage-icon">
              <StarIcon filled size={20} />
            </div>
            <div className="fab-mypage-info">
              <div className="fab-mypage-title">Min Sida</div>
              <div className="fab-mypage-sub">
                {currentUser ? currentUser.name || currentUser.email : 'Gäst'} • {favoritesCount} sparade
              </div>
            </div>
            <span className="fab-badge">{favoritesCount}</span>
          </div>

          {/* De 7 medicinska IVA-kategorierna */}
          <div className="fab-section-label">IVA-Kategorier</div>
          <div className="fab-category-grid">
            {categories.map((cat) => {
              const count = documents.filter((d) => d.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  className={`fab-cat-btn ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  title={`${cat.name} (${cat.subtitle})`}
                >
                  <span className="fab-cat-icon" style={{ color: isActive ? '#ffffff' : cat.color }}>
                    <CategoryIcon icon={cat.icon} size={18} color={cat.color} />
                  </span>
                  <span className="fab-cat-name">{cat.name}</span>
                  <span className="fab-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Kliniska Moduler & AI */}
          <div className="fab-section-label">Kliniska Moduler & AI</div>

          {/* Gemini AI Snabbknapp */}
          <div style={{ marginBottom: '0.6rem' }}>
            <button
              className="fab-cat-btn"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                width: '100%',
                border: 'none',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(124, 58, 237, 0.35)',
              }}
              onClick={() => {
                onClose();
                onOpenGeminiChat();
              }}
              title="Öppna Gemini IVA-Assistent (Ctrl+J)"
            >
              <SparklesIcon size={18} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', flex: 1, textAlign: 'left' }}>
                Fråga Gemini IVA AI
              </span>
              <span style={{ background: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '9999px' }}>
                AI-Assistent
              </span>
            </button>
          </div>

          <div className="fab-tools-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
            <button
              className={`fab-cat-btn ${activeCategory === 'PAIN_SEDATION' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('PAIN_SEDATION');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#d946ef' }}>
                <HeartPulseIcon size={16} />
              </span>
              <span className="fab-cat-name">CPOT & RASS</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'DISEASES' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('DISEASES');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#e11d48' }}>
                <StethoscopeIcon size={16} />
              </span>
              <span className="fab-cat-name">Sjukdomar</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'ACID_BASE' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('ACID_BASE');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#7c3aed' }}>
                <FlaskIcon size={16} />
              </span>
              <span className="fab-cat-name">Syra-Bas</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'FLUID_BALANCE' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('FLUID_BALANCE');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#059669' }}>
                <DropletIcon size={16} />
              </span>
              <span className="fab-cat-name">Vätskor</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'NUTRITION' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('NUTRITION');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#d97706' }}>
                <NutritionIcon size={16} />
              </span>
              <span className="fab-cat-name">Nutrition</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'DRUGS' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('DRUGS');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#0ea5e9' }}>
                <PillIcon size={16} />
              </span>
              <span className="fab-cat-name">Dos & CVK</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'EQUIPMENT' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('EQUIPMENT');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#0891b2' }}>
                <VentilatorIcon size={16} />
              </span>
              <span className="fab-cat-name">Apparatur</span>
            </button>

            <button
              className={`fab-cat-btn ${activeCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('ALL');
                onClose();
              }}
            >
              <span className="fab-cat-icon" style={{ color: '#64748b' }}>
                <LayersIcon size={16} />
              </span>
              <span className="fab-cat-name">Alla PM</span>
              <span className="fab-badge">{documents.length}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
