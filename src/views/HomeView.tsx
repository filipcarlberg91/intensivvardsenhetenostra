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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
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
      bg: '#FCE7F3',
      color: '#BE185D',
      icon: <HeartPulseIcon size={26} />,
      onClick: () => onSelectCategory('PAIN_SEDATION'),
    },
    {
      id: 'DISEASES',
      label: 'Sjukdomar',
      bg: '#FFE4E6',
      color: '#BE123C',
      icon: <StethoscopeIcon size={26} />,
      onClick: () => onSelectCategory('DISEASES'),
    },
    {
      id: 'ACID_BASE',
      label: 'Blodgas & Syra-Bas',
      bg: '#EDE9FE',
      color: '#5B21B6',
      icon: <FlaskIcon size={26} />,
      onClick: () => onSelectCategory('ACID_BASE'),
    },
    {
      id: 'FLUID_BALANCE',
      label: 'Vätskor & ROSE',
      bg: '#CCFBF1',
      color: '#0F766E',
      icon: <DropletIcon size={26} />,
      onClick: () => onSelectCategory('FLUID_BALANCE'),
    },
    {
      id: 'NUTRITION',
      label: 'Nutrition',
      bg: '#FEF3C7',
      color: '#B45309',
      icon: <NutritionIcon size={26} />,
      onClick: () => onSelectCategory('NUTRITION'),
    },
    {
      id: 'DRUGS',
      label: 'Dos & CVK',
      bg: '#D4E8FF',
      color: '#005689',
      icon: <PillIcon size={26} />,
      onClick: () => onSelectCategory('DRUGS'),
    },
    {
      id: 'Läkemedel',
      label: 'Läkemedel',
      bg: '#EBDDFF',
      color: '#583596',
      icon: <PillIcon size={26} />,
      onClick: () => onSelectCategory('Läkemedel'),
    },
    {
      id: 'EQUIPMENT',
      label: 'Apparatur',
      bg: '#CFFAFE',
      color: '#0E7490',
      icon: <VentilatorIcon size={26} />,
      onClick: () => onSelectCategory('EQUIPMENT'),
    },
    {
      id: 'GEMINI_NOTEBOOK',
      label: 'Gemini Notebook',
      bg: '#E0E7FF',
      color: '#3730A3',
      icon: <SparklesIcon size={26} />,
      onClick: () => onQuickAskGemini(''),
    },
    {
      id: 'ANDROID_CAMERA',
      label: 'Kamera & Notiser',
      bg: '#E2E8F0',
      color: '#1E293B',
      icon: <CameraIcon size={26} />,
      onClick: () => {
        if (onOpenAndroidSetup) onOpenAndroidSetup();
      },
    },
  ];

  return (
    <div className="home-view-container m3-adaptive-container">
      {/* 1. MATERIAL 3 EXPRESSIVE HERO CARD */}
      <section className="m3-expressive-hero">
        <div className="m3-hero-inner">
          {/* Topp-rad med statuschip och datum */}
          <div className="m3-hero-top-row">
            <span className="m3-hero-status-chip">
              <span className="pulse-dot"></span>
              <span>IVA Östra • Sahlgrenska</span>
            </span>
            <span className="m3-hero-date-chip">{currentDateStr}</span>
          </div>

          {/* Titel & Underrubrik */}
          <div className="m3-hero-heading-group">
            <h1 className="m3-hero-display-title">Intensivvårdsenheten Östra</h1>
            <p className="m3-hero-subtitle">
              Kliniska kalkylatorer, spädningar, rutiner/PM, arbetspass och larm.
            </p>
          </div>

          {/* M3 Expressive Pill Search Bar (Alltid horisontell pill-form på alla skärmar!) */}
          <form onSubmit={handleSearchSubmit} className="m3-expressive-search-pill">
            <span className="m3-search-pill-icon">
              <SearchIcon size={20} />
            </span>
            <input
              type="text"
              className="m3-search-pill-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Sök rutiner/PM, läkemedel, doser..."
            />
            <button type="submit" className="m3-search-pill-btn">
              Sök
            </button>
          </form>

          {/* Dubbla M3 Expressive Action Cards (Adaptiv Bento Grid: 1 kolumn på smal mobil, 2 på vikbar/surfplatta/desktop) */}
          <div className="m3-hero-bento-grid">
            {/* KORT 1: START AV ARBETSPASS */}
            <div className="m3-bento-action-card primary-bento" onClick={onOpenShiftModal} role="button" tabIndex={0}>
              <div className="m3-bento-top">
                <span className="m3-bento-kicker">📋 Skiftöverlämning</span>
                <span className={`m3-bento-status-badge ${shiftChecked === shiftTotal && shiftTotal > 0 ? 'done' : ''}`}>
                  {shiftChecked}/{shiftTotal} ({shiftPercent}%)
                </span>
              </div>
              <div className="m3-bento-body">
                <div className="m3-bento-text">
                  <h2>Start av arbetspass</h2>
                  <p>12 punkter: RLS, pupiller, auskultation, infarter, respirator & RASS.</p>
                </div>
                <button
                  type="button"
                  className="m3-bento-cta-btn primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenShiftModal();
                  }}
                >
                  <span>Checklista</span>
                  <span>→</span>
                </button>
              </div>
              <div className="m3-bento-progress-track">
                <div className="m3-bento-progress-fill" style={{ width: `${shiftPercent}%` }} />
              </div>
            </div>

            {/* KORT 2: MEDICINTIDER & INFUSIONSSLUT */}
            <div className="m3-bento-action-card tertiary-bento" onClick={onOpenMedicationModal} role="button" tabIndex={0}>
              <div className="m3-bento-top">
                <span className="m3-bento-kicker tertiary">⏰ Sprutbyte & Larm</span>
                <span className={`m3-bento-status-badge tertiary ${activeReminderCount > 0 ? 'active-alarm' : ''}`}>
                  {activeReminderCount > 0 ? `🔔 ${activeReminderCount} aktiva` : 'Inga larm'}
                </span>
              </div>
              <div className="m3-bento-body">
                <div className="m3-bento-text">
                  <h2>Medicintider & Infusionsslut</h2>
                  <p>Beräkna när sprutor tar slut (ml kvar & ml/h) med automatiskt larm.</p>
                </div>
                <button
                  type="button"
                  className="m3-bento-cta-btn tertiary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenMedicationModal();
                  }}
                >
                  <span>Medicintider</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KLINISKA VERKTYG — MATERIAL 3 EXPRESSIVE SQUIRCLE ICON TILES */}
      <section className="m3-tools-section">
        <div className="m3-section-header">
          <div className="m3-section-title-group">
            <span className="m3-section-indicator"></span>
            <h2 className="m3-section-title">Kliniska Verktyg</h2>
          </div>
          <span className="m3-section-subtitle">Snabbval</span>
        </div>

        <div className="m3-expressive-tools-grid">
          {clinicalTools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              className="m3-tool-squircle-card"
              onClick={tool.onClick}
            >
              <div
                className="m3-tool-squircle-icon"
                style={{
                  background: tool.bg,
                  color: tool.color,
                }}
              >
                {tool.icon}
              </div>
              <span className="m3-tool-squircle-label">{tool.label}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
