import React from 'react';
import {
  HomeIcon,
  LayersIcon,
  PillIcon,
  FlaskIcon,
  SparklesIcon,
} from './Icons';

interface M3BottomNavProps {
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenGeminiChat: () => void;
  onToggleFabMenu: () => void;
  isFabOpen: boolean;
}

const PM_CATEGORIES = [
  'Respiration',
  'Circulation',
  'Nutrition_Docs',
  'CRRT',
  'Elimination',
  'Omvårdnad',
  'Anhöriga',
  'Sedering',
  'Buk',
  'Infektion',
  'Gynekologi',
  'Avslut',
  'Donation',
  'ALL',
];

const CALC_CATEGORIES = [
  'PAIN_SEDATION',
  'DISEASES',
  'ACID_BASE',
  'FLUID_BALANCE',
  'NUTRITION',
  'DRUGS',
  'EQUIPMENT',
];

export const M3BottomNav: React.FC<M3BottomNavProps> = ({
  activeCategory,
  onSelectCategory,
  onOpenGeminiChat,
  onToggleFabMenu,
  isFabOpen,
}) => {
  const isHome = activeCategory === 'HOME';
  const isPm = PM_CATEGORIES.includes(activeCategory);
  const isMeds = activeCategory === 'Läkemedel';
  const isCalc = CALC_CATEGORIES.includes(activeCategory);

  return (
    <nav className="m3-bottom-nav-bar" aria-label="Primär bottennavigering">
      <div className="m3-bottom-nav-inner">
        {/* 1. Startsida */}
        <button
          type="button"
          className={`m3-bottom-nav-item ${isHome && !isFabOpen ? 'active' : ''}`}
          onClick={() => onSelectCategory('HOME')}
        >
          <span className="m3-nav-pill-indicator">
            <HomeIcon size={20} />
          </span>
          <span className="m3-nav-label">Hem</span>
        </button>

        {/* 2. Rutiner & PM Hubbar */}
        <button
          type="button"
          className={`m3-bottom-nav-item ${isPm && !isFabOpen ? 'active' : ''}`}
          onClick={() => onSelectCategory(isPm ? activeCategory : 'Respiration')}
        >
          <span className="m3-nav-pill-indicator">
            <LayersIcon size={20} />
          </span>
          <span className="m3-nav-label">Rutiner/PM</span>
        </button>

        {/* 3. Läkemedelsregister */}
        <button
          type="button"
          className={`m3-bottom-nav-item ${isMeds && !isFabOpen ? 'active' : ''}`}
          onClick={() => onSelectCategory('Läkemedel')}
        >
          <span className="m3-nav-pill-indicator">
            <PillIcon size={20} />
          </span>
          <span className="m3-nav-label">Läkemedel</span>
        </button>

        {/* 4. Kliniska Kalkylatorer */}
        <button
          type="button"
          className={`m3-bottom-nav-item ${isCalc && !isFabOpen ? 'active' : ''}`}
          onClick={() => onSelectCategory(isCalc ? activeCategory : 'DRUGS')}
        >
          <span className="m3-nav-pill-indicator">
            <FlaskIcon size={20} />
          </span>
          <span className="m3-nav-label">Kalkylator</span>
        </button>

        {/* 5. Gemini AI Notebook */}
        <button
          type="button"
          className="m3-bottom-nav-item ai-item"
          onClick={onOpenGeminiChat}
        >
          <span className="m3-nav-pill-indicator ai-pill">
            <SparklesIcon size={20} />
          </span>
          <span className="m3-nav-label">Notebook</span>
        </button>

        {/* 6. Meny (Alla Kategorier & Redigera) */}
        <button
          type="button"
          className={`m3-bottom-nav-item ${isFabOpen ? 'active' : ''}`}
          onClick={onToggleFabMenu}
        >
          <span className="m3-nav-pill-indicator">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isFabOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <rect x="3" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="3" width="7" height="7" rx="2" />
                  <rect x="14" y="14" width="7" height="7" rx="2" />
                  <rect x="3" y="14" width="7" height="7" rx="2" />
                </>
              )}
            </svg>
          </span>
          <span className="m3-nav-label">Alla & Meny</span>
        </button>
      </div>
    </nav>
  );
};
