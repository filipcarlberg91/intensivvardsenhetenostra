import React, { useState } from 'react';
import { DocumentItem, ShiftChecklistItem } from '../types';
import {
  HeartPulseIcon,
  StethoscopeIcon,
  FlaskIcon,
  DropletIcon,
  NutritionIcon,
  PillIcon,
  VentilatorIcon,
  SearchIcon,
  SparklesIcon,
  CameraIcon,
} from '../components/Icons';

interface HomeViewProps {
  documents: DocumentItem[];
  shiftChecklist: ShiftChecklistItem[];
  onOpenShiftModal: () => void;
  onOpenPocketguideModal: () => void;
  onOpenMedicationModal: () => void;
  onOpenAndroidSetup?: () => void;
  activeReminderCount?: number;
  onSelectCategory: (cat: string) => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onGlobalSearch: (q: string) => void;
  onQuickAskGemini: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  shiftChecklist,
  onOpenShiftModal,
  onOpenMedicationModal,
  onOpenAndroidSetup,
  activeReminderCount = 0,
  onSelectCategory,
  onGlobalSearch,
  onQuickAskGemini,
}) => {
  const [searchInput, setSearchInput] = useState('');

  const currentDateStr = new Date().toLocaleDateString('sv-SE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shiftChecked = shiftChecklist.filter((x) => x.checked).length;
  const shiftTotal = shiftChecklist.length;
  const shiftPercent = shiftTotal > 0 ? Math.round((shiftChecked / shiftTotal) * 100) : 0;

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onGlobalSearch(searchInput.trim());
  };

  const clinicalTools = [
    {
      id: 'PAIN_SEDATION',
      label: 'CPOT & RASS',
      bg: '#fae8ff',
      color: '#d946ef',
      border: '#f5d0fe',
      icon: <HeartPulseIcon size={26} />,
      onClick: () => onSelectCategory('PAIN_SEDATION'),
    },
    {
      id: 'DISEASES',
      label: 'Sjukdomar',
      bg: '#ffe4e6',
      color: '#e11d48',
      border: '#fecdd3',
      icon: <StethoscopeIcon size={26} />,
      onClick: () => onSelectCategory('DISEASES'),
    },
    {
      id: 'ACID_BASE',
      label: 'Blodgas & Syra-Bas',
      bg: '#f3e8ff',
      color: '#7c3aed',
      border: '#ddd6fe',
      icon: <FlaskIcon size={26} />,
      onClick: () => onSelectCategory('ACID_BASE'),
    },
    {
      id: 'FLUID_BALANCE',
      label: 'Vätskor & ROSE',
      bg: '#d1fae5',
      color: '#059669',
      border: '#a7f3d0',
      icon: <DropletIcon size={26} />,
      onClick: () => onSelectCategory('FLUID_BALANCE'),
    },
    {
      id: 'NUTRITION',
      label: 'Nutrition',
      bg: '#fef3c7',
      color: '#d97706',
      border: '#fde68a',
      icon: <NutritionIcon size={26} />,
      onClick: () => onSelectCategory('NUTRITION'),
    },
    {
      id: 'DRUGS',
      label: 'Dos & CVK',
      bg: '#e0f2fe',
      color: '#0284c7',
      border: '#bae6fd',
      icon: <PillIcon size={26} />,
      onClick: () => onSelectCategory('DRUGS'),
    },
    {
      id: 'Läkemedel',
      label: 'Läkemedel',
      bg: '#f5f3ff',
      color: '#6d28d9',
      border: '#ddd6fe',
      icon: <PillIcon size={26} />,
      onClick: () => onSelectCategory('Läkemedel'),
    },
    {
      id: 'EQUIPMENT',
      label: 'Apparatur',
      bg: '#cffafe',
      color: '#0891b2',
      border: '#a5f3fc',
      icon: <VentilatorIcon size={26} />,
      onClick: () => onSelectCategory('EQUIPMENT'),
    },
    {
      id: 'GEMINI_NOTEBOOK',
      label: 'Gemini Notebook',
      bg: '#eef2ff',
      color: '#4f46e5',
      border: '#c7d2fe',
      icon: <SparklesIcon size={26} />,
      onClick: () => onQuickAskGemini(''),
    },
    {
      id: 'ANDROID_CAMERA',
      label: 'Kamera & Notiser',
      bg: '#f1f5f9',
      color: '#0f172a',
      border: '#cbd5e1',
      icon: <CameraIcon size={26} />,
      onClick: () => {
        if (onOpenAndroidSetup) onOpenAndroidSetup();
      },
    },
  ];

  return (
    <div className="home-view-container">
      {/* 1. HERO SECTION */}
      <section className="home-hero-card">
        <div className="home-hero-content">
          <div className="home-hero-badge-row">
            <span className="home-hero-pill">
              <span className="pulse-dot"></span> IVA Östra Sjukhuset • Sahlgrenska Universitetssjukhuset
            </span>
            <span className="home-hero-date">{currentDateStr}</span>
          </div>
          <h1 className="home-hero-title">Intensivvårdsenheten Östra</h1>
          <p className="home-hero-subtitle">
            Snabbåtkomst till kliniska kalkylatorer, spädningar, arbetspass och larm.
          </p>

          {/* DUBBLA ÅTGÄRDSKORT: START AV ARBETSPASS & MEDICINTIDER/INFUSIONSSLUT */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
              gap: '0.85rem',
              marginTop: '1.1rem',
            }}
          >
            {/* KORT 1: START AV ARBETSPASS */}
            <div className="shift-start-hero-card" style={{ margin: 0 }}>
              <div className="shift-hero-left">
                <div className="shift-hero-badge">📋 Skiftöverlämning</div>
                <h2 className="shift-hero-title">Start av arbetspass</h2>
                <p className="shift-hero-desc">
                  Checklista i 12 punkter: RLS, pupiller, auskultation, buk, infarter, respirator och RASS.
                </p>
                <div className="shift-hero-status-row">
                  <span
                    className={`shift-status-pill ${
                      shiftChecked === shiftTotal && shiftTotal > 0 ? 'complete' : ''
                    }`}
                  >
                    {shiftChecked} av {shiftTotal} ({shiftPercent}%)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#bae6fd' }}>Sparat lokalt</span>
                </div>
              </div>
              <div className="shift-hero-right">
                <button
                  className="btn-shift-start-cta"
                  onClick={onOpenShiftModal}
                  title="Öppna checklistan för start av arbetspass"
                >
                  <span style={{ fontSize: '1.3rem' }}>📋</span>
                  <span>Checklista</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600 }}>
                    (12 punkter)
                  </span>
                </button>
              </div>
            </div>

            {/* KORT 2: MEDICINTIDER & INFUSIONSSLUT */}
            <div
              className="shift-start-hero-card"
              style={{
                margin: 0,
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
                borderColor: '#6366f1',
              }}
            >
              <div className="shift-hero-left">
                <div
                  className="shift-hero-badge"
                  style={{
                    background: 'rgba(238, 242, 255, 0.2)',
                    color: '#e0e7ff',
                    borderColor: 'rgba(238, 242, 255, 0.3)',
                  }}
                >
                  ⏰ Påminnelser & Sprutbyte
                </div>
                <h2 className="shift-hero-title">Medicintider & Infusionsslut</h2>
                <p className="shift-hero-desc">
                  Räkna ut när sprutor tar slut (ml kvar & ml/h) och få automatiska notislarm före byte.
                </p>
                <div className="shift-hero-status-row">
                  <span
                    className="shift-status-pill"
                    style={{
                      background:
                        activeReminderCount > 0 ? '#4338ca' : 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                    }}
                  >
                    {activeReminderCount > 0
                      ? `🔔 ${activeReminderCount} aktiva larm`
                      : 'Inga aktiva larm'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Android-notis</span>
                </div>
              </div>
              <div className="shift-hero-right">
                <button
                  className="btn-shift-start-cta"
                  onClick={onOpenMedicationModal}
                  title="Fyll i medicintider och sätt larm för infusionsslut"
                  style={{
                    background: 'linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>⏰</span>
                  <span>Medicintider</span>
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600 }}>
                    & Infusionsslut
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Sökruta i Hero (utan taggar under) */}
          <div className="home-hero-search-box" style={{ marginTop: '1.1rem' }}>
            <form onSubmit={handleSearchSubmit} className="home-search-input-wrapper">
              <span className="home-search-icon">
                <SearchIcon size={18} />
              </span>
              <input
                type="text"
                className="home-search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Sök bland rutiner/PM, läkemedel och kalkylatorer..."
              />
              <button type="submit" className="home-search-submit-btn">
                Sök
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. KLINISKA VERKTYG — ENBART IKONER MED TEXT UNDER */}
      <section className="home-modules-section" style={{ marginTop: '1.5rem' }}>
        <div className="home-section-header" style={{ marginBottom: '0.85rem' }}>
          <div className="home-section-title-wrap">
            <span className="home-section-dot blue"></span>
            <h2 className="home-section-title">Kliniska Verktyg</h2>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(112px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {clinicalTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={tool.onClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.55rem',
                padding: '0.95rem 0.5rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = tool.color;
                e.currentTarget.style.boxShadow = '0 8px 18px rgba(15, 23, 42, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(15, 23, 42, 0.04)';
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: tool.bg,
                  color: tool.color,
                  border: `1.5px solid ${tool.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {tool.icon}
              </div>
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  textAlign: 'center',
                  lineHeight: 1.25,
                }}
              >
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
