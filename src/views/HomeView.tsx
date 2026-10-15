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
} from '../components/Icons';

interface HomeViewProps {
  documents: DocumentItem[];
  shiftChecklist: ShiftChecklistItem[];
  onOpenShiftModal: () => void;
  onOpenPocketguideModal: () => void;
  onOpenMedicationModal: () => void;
  activeReminderCount?: number;
  onSelectCategory: (cat: string) => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onGlobalSearch: (q: string) => void;
  onQuickAskGemini: (prompt: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  documents,
  shiftChecklist,
  onOpenShiftModal,
  onOpenPocketguideModal,
  onOpenMedicationModal,
  activeReminderCount = 0,
  onSelectCategory,
  onOpenDoc,
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
    if (searchInput.trim()) {
      onGlobalSearch(searchInput.trim());
    }
  };

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
            Kliniskt beslutsstöd, interaktiva kalkylatorer, läkemedelsspädningar, styrande rutiner och evidensbaserade PM för IVA-läkare och intensivvårdssjuksköterskor.
          </p>

          {/* DUBBLA ÅTGÄRDSKORT: START AV ARBETSPASS & MEDICINTIDER/INFUSIONSSLUT */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
            {/* KORT 1: START AV ARBETSPASS */}
            <div className="shift-start-hero-card" style={{ margin: 0 }}>
              <div className="shift-hero-left">
                <div className="shift-hero-badge">📋 Skiftöverlämning</div>
                <h2 className="shift-hero-title">Start av arbetspass</h2>
                <p className="shift-hero-desc">
                  Strukturerad checklista i 12 punkter: RLS, pupiller, auskultation, buk, hud, infarter, KAD, V-sond, respirator och RASS.
                </p>
                <div className="shift-hero-status-row">
                  <span className={`shift-status-pill ${shiftChecked === shiftTotal && shiftTotal > 0 ? 'complete' : ''}`}>
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
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600 }}>(12 punkter)</span>
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
                <div className="shift-hero-badge" style={{ background: 'rgba(238, 242, 255, 0.2)', color: '#e0e7ff', borderColor: 'rgba(238, 242, 255, 0.3)' }}>
                  ⏰ Påminnelser & Sprutbyte
                </div>
                <h2 className="shift-hero-title">Medicintider & Infusionsslut</h2>
                <p className="shift-hero-desc">
                  Räkna ut när sprutor tar slut (ml kvar & ml/h) och få automatiska notislarm i god tid före byte!
                </p>
                <div className="shift-hero-status-row">
                  <span
                    className="shift-status-pill"
                    style={{
                      background: activeReminderCount > 0 ? '#4338ca' : 'rgba(255,255,255,0.15)',
                      color: '#ffffff',
                    }}
                  >
                    {activeReminderCount > 0 ? `🔔 ${activeReminderCount} aktiva larm` : 'Inga aktiva larm'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#c7d2fe' }}>Larm & notis</span>
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
                  <span style={{ fontSize: '0.72rem', opacity: 0.85, fontWeight: 600 }}>& Infusionsslut</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sökruta i Hero */}
          <div className="home-hero-search-box" style={{ marginTop: '1.25rem' }}>
            <form onSubmit={handleSearchSubmit} className="home-search-input-wrapper">
              <span className="home-search-icon">
                <SearchIcon size={18} />
              </span>
              <input
                type="text"
                className="home-search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Sök bland PM, kalkylatorer, doser (t.ex. Befuktare 950, Noradrenalin, ARDS, CPOT)..."
              />
              <button type="submit" className="home-search-submit-btn">
                Sök i hubben
              </button>
            </form>
            <div className="home-quick-tags">
              <span className="home-quick-label">Snabbval:</span>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Läkemedel')}>
                #Läkemedel (IVA-Register)
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('PAIN_SEDATION')}>
                #CPOT & RASS
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Sedering')}>
                #Sedering
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Buk')}>
                #Buk & IAP
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Infektion')}>
                #Sepsis & Infektion
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Gynekologi')}>
                #Preeklampsi
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Avslut')}>
                #Avslut & Palliation
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('Donation')}>
                #Organdonation
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('ACID_BASE')}>
                #Blodgas & Ventilator
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('FLUID_BALANCE')}>
                #Vätskebalans & Diures
              </button>
              <button className="home-tag-btn" onClick={() => onSelectCategory('DRUGS')}>
                #Dos & CVK
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. KLINISKA MODULER & INTERAKTIVA VERKTYG */}
      <section className="home-modules-section">
        <div className="home-section-header">
          <div className="home-section-title-wrap">
            <span className="home-section-dot blue"></span>
            <h2 className="home-section-title">Kliniska Moduler & Interaktiva Verktyg</h2>
          </div>
          <span className="home-section-hint">Välj modul för att starta</span>
        </div>

        <div className="home-modules-grid">
          {/* Modul 1: Smärta & Sedering */}
          <div className="home-module-card" onClick={() => onSelectCategory('PAIN_SEDATION')}>
            <div className="module-card-icon" style={{ background: '#fae8ff', color: '#d946ef', borderColor: '#f5d0fe' }}>
              <HeartPulseIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Smärta & Sedering (CPOT & RASS)</h3>
              <p className="module-card-desc">
                Validerad smärtskattning med CPOT (0–8 poäng) och sederingsbedömning med RASS (+4 till -5). Interaktiva poängkalkylatorer och titreringsråd.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#fdf4ff', color: '#c026d3' }}>CPOT 0–8</span>
                <span className="module-pill-tag" style={{ background: '#fdf4ff', color: '#c026d3' }}>RASS -5 till +4</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 2: Sjukdomar på IVA */}
          <div className="home-module-card" onClick={() => onSelectCategory('DISEASES')}>
            <div className="module-card-icon" style={{ background: '#ffe4e6', color: '#e11d48', borderColor: '#fecdd3' }}>
              <StethoscopeIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Sjukdomstillstånd på IVA</h3>
              <p className="module-card-desc">
                15 fördjupade intensivvårdstillstånd: Septisk chock, Kardiogen chock, ARDS typ 1 & 2, KDIGO AKI, Status Epilepticus, ACS, Malign hypertermi m.fl.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#fff1f2', color: '#be123c' }}>15 Tillstånd</span>
                <span className="module-pill-tag" style={{ background: '#fff1f2', color: '#be123c' }}>Patofysiologi</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 3: Syra-Bas & Blodgas */}
          <div className="home-module-card" onClick={() => onSelectCategory('ACID_BASE')}>
            <div className="module-card-icon" style={{ background: '#f3e8ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
              <FlaskIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Syra-Bas & Blodgaskalkylator</h3>
              <p className="module-card-desc">
                Mata in 16 Radiometer ABL-parametrar direkt från remsan. Automatisk beräkning av Anjongap, albuminkorrigering, Winters formel, Delta Ratio och PaO2/FiO2.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#faf5ff', color: '#6d28d9' }}>Radiometer ABL</span>
                <span className="module-pill-tag" style={{ background: '#faf5ff', color: '#6d28d9' }}>Winters Formel</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 4: Vätskor & ROSE */}
          <div className="home-module-card" onClick={() => onSelectCategory('FLUID_BALANCE')}>
            <div className="module-card-icon" style={{ background: '#d1fae5', color: '#059669', borderColor: '#a7f3d0' }}>
              <DropletIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Vätsketerapi, ROSE & Dropptakt</h3>
              <p className="module-card-desc">
                Östra Excel-vätskebalans, % Fluid Overload kumulativ riskkalkylator, dropptaktsomräknare samt jämförelse mellan Ringer-Acetat, Plasmalyte, NaCl och Albumin.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#ecfdf5', color: '#047857' }}>Östra Excel</span>
                <span className="module-pill-tag" style={{ background: '#ecfdf5', color: '#047857' }}>% Fluid Overload</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 5: Nutrition */}
          <div className="home-module-card" onClick={() => onSelectCategory('NUTRITION')}>
            <div className="module-card-icon" style={{ background: '#fef3c7', color: '#d97706', borderColor: '#fde68a' }}>
              <NutritionIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Nutritionskalkylator & Kaloritabell IVA 343</h3>
              <p className="module-card-desc">
                ESPEN energimål (20–30 kcal/kg) och proteinmål (1.2–2.0 g/kg). Automatisk avräkning för Propofol och citratdialys. Autentisk kaloritabell från IVA 343 Östra sjukhuset.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#fffbeb', color: '#b45309' }}>ESPEN Mål</span>
                <span className="module-pill-tag" style={{ background: '#fffbeb', color: '#b45309' }}>IVA 343 Meny</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 6: Dos & CVK */}
          <div className="home-module-card" onClick={() => onSelectCategory('DRUGS')}>
            <div className="module-card-icon" style={{ background: '#e0f2fe', color: '#0284c7', borderColor: '#bae6fd' }}>
              <PillIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Doskalkylator & Blandbarhet i CVK</h3>
              <p className="module-card-desc">
                Komplett infusions- och doseringsstöd för samtliga IVA- och PostOp-läkemedel (Vasoaktiva, Sedation, Opioider, Antibiotika m.fl.) samt CVK Y-kopplingsmatris.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#f0f9ff', color: '#0369a1' }}>Alla IVA/PostOp Läkemedel</span>
                <span className="module-pill-tag" style={{ background: '#f0f9ff', color: '#0369a1' }}>Y-Koppling</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 6B: Rutiner/PM Läkemedel */}
          <div className="home-module-card" onClick={() => onSelectCategory('Läkemedel')}>
            <div className="module-card-icon" style={{ background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}>
              <PillIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Läkemedel (Klinisk Hubb & Kompakt Register)</h3>
              <p className="module-card-desc">
                Kompakt och sökbar läkemedelslista med favoritmarkering, vad läkemedlet gör, biverkningar, halveringstid, anslagstid och spädning. Tryck för helskärmsinfo.
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#f5f3ff', color: '#6d28d9' }}>Sök & Favoriter ★</span>
                <span className="module-pill-tag" style={{ background: '#f5f3ff', color: '#6d28d9' }}>Effekt, Biverkningar & T½</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>

          {/* Modul 7: Apparatur */}
          <div className="home-module-card" onClick={() => onSelectCategory('EQUIPMENT')}>
            <div className="module-card-icon" style={{ background: '#cffafe', color: '#0891b2', borderColor: '#a5f3fc' }}>
              <VentilatorIcon size={24} />
            </div>
            <div className="module-card-content">
              <h3 className="module-card-title">Servo-U Ventilator & Apparatur</h3>
              <p className="module-card-desc">
                Ventilationsmoder (PRVC, PC, PS, NAVA), diagnostiska manövrar (Pplat, Auto-PEEP, ΔP drivtryck), larmlista och PBW-kalkylator för tidalvolym (4–8 ml/kg).
              </p>
              <div className="module-card-footer">
                <span className="module-pill-tag" style={{ background: '#ecfeff', color: '#0e7490' }}>Servo-U</span>
                <span className="module-pill-tag" style={{ background: '#ecfeff', color: '#0e7490' }}>PBW & ΔP</span>
                <span className="module-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SENASTE PM & PROTOKOLL */}
      <section className="home-recent-section" style={{ marginTop: '2rem' }}>
        <div className="home-section-header">
          <div className="home-section-title-wrap">
            <span className="home-section-dot green"></span>
            <h2 className="home-section-title">Styrande Rutiner & PM</h2>
          </div>
          <button className="btn-view-all-docs" onClick={() => onSelectCategory('Respiration')}>
            Visa alla ({documents.length} st) →
          </button>
        </div>

        <div className="home-docs-preview-grid">
          {documents.slice(0, 3).map((doc) => (
            <div key={doc.id} className="home-doc-card" onClick={() => onOpenDoc(doc)}>
              <div className="home-doc-header">
                <span className="home-doc-category">{doc.category}</span>
                <span className="home-doc-priority">{doc.priority}</span>
              </div>
              <h4 className="home-doc-title">{doc.title}</h4>
              <p className="home-doc-desc">{doc.description}</p>
              <div className="home-doc-footer">
                <span className="home-doc-tag">PDF & Protokoll</span>
                <span className="home-doc-read-cta">Läs PM →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SNABBFRÅGOR TILL GEMINI IVA */}
      <section className="home-ai-quick-section" style={{ marginTop: '2.5rem' }}>
        <div className="home-ai-card">
          <div className="home-ai-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span className="ai-sparkle-dot"></span>
              <span style={{ fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                Gemini IVA-Assistent
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.35rem 0', color: '#0f172a' }}>
              Fråga kliniska expertassistenten
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1rem' }}>
              Få omedelbara svar om läkemedelsspädningar, Y-kopplingsblandbarhet, syra-baskorrigering eller Servo-U ventilatorlarm.
            </p>
            <div className="home-ai-quick-buttons">
              <button
                className="btn-ai-prompt"
                onClick={() => onQuickAskGemini('Vad är standardspädning och dosering för Noradrenalin på IVA Östra?')}
              >
                💉 Hur späds Noradrenalin?
              </button>
              <button
                className="btn-ai-prompt"
                onClick={() => onQuickAskGemini('Kan Noradrenalin och Furosemid gå i samma skänkel i CVK?')}
              >
                ⚡ Noradrenalin + Furosemid blandbarhet?
              </button>
              <button
                className="btn-ai-prompt"
                onClick={() => onQuickAskGemini('Hur tolkar jag Högt Luftvägstryck (High Paw) på Servo-U?')}
              >
                🫁 Felsök High Paw på Servo-U
              </button>
              <button
                className="btn-ai-prompt"
                onClick={() => onQuickAskGemini('Hur räknar jag av kalorier för Propofol 10 mg/ml?')}
              >
                🥗 Kalorier från Propofol
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
