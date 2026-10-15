import React, { useState, useMemo } from 'react';
import { CategoryItem, DocumentItem, DrugCategory, DrugItem } from '../types';
import { IVA_DRUGS, DRUG_CATEGORIES } from '../data/drugsData';
import { SearchIcon, StarIcon, CategoryIcon, PillIcon } from '../components/Icons';
import { DrugDetailModal } from '../components/modals/DrugDetailModal';
import { CategoryHubSection } from '../components/CategoryHubSection';

interface MedicationCatalogViewProps {
  categories: CategoryItem[];
  documents: DocumentItem[];
  favoriteDrugs: string[];
  onToggleFavoriteDrug: (drugId: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenInCalculator: (drugId: string) => void;
  onOpenDoc: (doc: DocumentItem) => void;
  customDrugs?: DrugItem[];
  onAddCustomDrug?: (drug: DrugItem) => void;
}

export const MedicationCatalogView: React.FC<MedicationCatalogViewProps> = ({
  categories,
  documents,
  favoriteDrugs,
  onToggleFavoriteDrug,
  onSelectCategory,
  onOpenInCalculator,
  onOpenDoc,
  customDrugs = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<DrugCategory | 'ALL' | 'FAVORITES'>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'favorites'>('category');
  const [selectedDrug, setSelectedDrug] = useState<DrugItem | null>(null);
  const [showHubOverview, setShowHubOverview] = useState<boolean>(true);

  const allDrugs = useMemo(() => [...IVA_DRUGS, ...customDrugs], [customDrugs]);

  const catObj = categories.find((c) => c.id === 'Läkemedel');
  const categoryDocs = documents.filter((d) => d.category === 'Läkemedel');

  const filteredDrugs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allDrugs
      .filter((drug) => {
        if (selectedSubCategory === 'FAVORITES' && !favoriteDrugs.includes(drug.id)) {
          return false;
        }
        if (selectedSubCategory !== 'ALL' && selectedSubCategory !== 'FAVORITES' && drug.category !== selectedSubCategory) {
          return false;
        }
        if (!q) return true;
        return (
          drug.name.toLowerCase().includes(q) ||
          drug.tradeNames.toLowerCase().includes(q) ||
          drug.class.toLowerCase().includes(q) ||
          drug.shortEffect.toLowerCase().includes(q) ||
          drug.sideEffects.toLowerCase().includes(q) ||
          drug.indications.toLowerCase().includes(q) ||
          drug.halfLife.toLowerCase().includes(q) ||
          drug.category.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sortBy === 'favorites') {
          const aFav = favoriteDrugs.includes(a.id) ? 0 : 1;
          const bFav = favoriteDrugs.includes(b.id) ? 0 : 1;
          if (aFav !== bFav) return aFav - bFav;
          return a.name.localeCompare(b.name, 'sv');
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'sv');
        }
        // Default: Favoriter överst om lika kategori, annars kategoriordning
        const aFav = favoriteDrugs.includes(a.id) ? 0 : 1;
        const bFav = favoriteDrugs.includes(b.id) ? 0 : 1;
        if (aFav !== bFav) return aFav - bFav;
        return 0;
      });
  }, [allDrugs, searchQuery, selectedSubCategory, sortBy, favoriteDrugs]);

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '1rem' }}>
      {/* Kategori Header Banner */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.15rem 1.4rem',
          marginBottom: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: catObj?.colorLight || '#f5f3ff',
                color: catObj?.color || '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryIcon icon={catObj?.icon || 'syringe'} size={24} color={catObj?.color || '#7c3aed'} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Läkemedel (IVA & PostOp)
                </h1>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed' }}>
                  • {allDrugs.length} preparat & Klinisk Hubb
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#64748b', margin: '0.15rem 0 0' }}>
                Klinisk farmakologihubb (normalvärden, antidoter, CVK-skänklar) samt kompakt läkemedelsregister och styrande PM.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowHubOverview((prev) => !prev)}
              style={{
                background: showHubOverview ? '#f5f3ff' : '#f1f5f9',
                color: showHubOverview ? '#6d28d9' : '#475569',
                border: showHubOverview ? '1px solid #ddd6fe' : '1px solid #cbd5e1',
                padding: '0.55rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {showHubOverview ? 'Dölj Normalvärden & Antidoter ▲' : 'Visa Normalvärden & Antidoter ▼'}
            </button>
            <button
              onClick={() => onOpenInCalculator(allDrugs[0]?.id || 'noradrenalin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <PillIcon size={16} />
              <span>Öppna Dos & CVK-kalkylator →</span>
            </button>
          </div>
        </div>

        {/* Kategoriväljare (Rutiner/PM) */}
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
          <button
            onClick={() => onSelectCategory('ALL')}
            style={{
              border: 'none',
              background: '#f1f5f9',
              color: '#475569',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.38rem 0.8rem',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Alla Rutiner/PM ({documents.length})
          </button>
          {categories.map((c) => {
            const isAct = c.id === 'Läkemedel';
            const cCount = c.id === 'Läkemedel' ? allDrugs.length : documents.filter((d) => d.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                style={{
                  border: isAct ? `1.5px solid ${c.color}` : '1px solid transparent',
                  background: isAct ? c.colorLight : '#f1f5f9',
                  color: isAct ? c.color : '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.38rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name} ({cCount})
              </button>
            );
          })}
        </div>
      </div>

      {/* KATEGORI-STARTSIDA / HUBB FÖR LÄKEMEDEL */}
      {showHubOverview && (
        <CategoryHubSection
          categoryId="Läkemedel"
          categoryObj={catObj}
          onSelectCategory={onSelectCategory}
          pmCount={categoryDocs.length}
        />
      )}

      {/* Sök, Favoritfilter & Underkategorier */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.15rem',
          marginBottom: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          {/* Sökfält */}
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '520px' }}>
            <span style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>
              <SearchIcon size={16} />
            </span>
            <input
              type="text"
              placeholder="Sök läkemedel, varunamn (t.ex. Ultiva, Furix), vad det gör, biverkning..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 2rem 0.5rem 2.25rem',
                borderRadius: '9px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 500,
                color: '#0f172a',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Favoriter & Sortering */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedSubCategory(selectedSubCategory === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                border: selectedSubCategory === 'FAVORITES' ? '1.5px solid #f59e0b' : '1px solid #cbd5e1',
                background: selectedSubCategory === 'FAVORITES' ? '#fffbeb' : '#ffffff',
                color: selectedSubCategory === 'FAVORITES' ? '#b45309' : '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <StarIcon filled={selectedSubCategory === 'FAVORITES' || favoriteDrugs.length > 0} size={15} />
              <span>Favoriter ({favoriteDrugs.length})</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '0.45rem 0.7rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#334155',
                background: '#ffffff',
              }}
            >
              <option value="category">Sortera: Favoriter & Grupp</option>
              <option value="name">Sortera: Bokstavsordning (A–Ö)</option>
              <option value="favorites">Sortera: Favoriter överst (A–Ö)</option>
            </select>

            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginLeft: '0.25rem' }}>
              Visar {filteredDrugs.length} av {allDrugs.length}
            </span>
          </div>
        </div>

        {/* Farmakologiska grupper (Snabbfilter) */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedSubCategory('ALL')}
            style={{
              border: selectedSubCategory === 'ALL' ? '1.5px solid #0f172a' : '1px solid #e2e8f0',
              background: selectedSubCategory === 'ALL' ? '#0f172a' : '#f8fafc',
              color: selectedSubCategory === 'ALL' ? '#ffffff' : '#475569',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Alla grupper ({allDrugs.length})
          </button>
          {DRUG_CATEGORIES.map((cat) => {
            const count = allDrugs.filter((d) => d.category === cat).length;
            const active = selectedSubCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedSubCategory(active ? 'ALL' : cat)}
                style={{
                  border: active ? '1.5px solid #7c3aed' : '1px solid #e2e8f0',
                  background: active ? '#f5f3ff' : '#f8fafc',
                  color: active ? '#6d28d9' : '#475569',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.65rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Väldigt kompakt läkemedelslista */}
      {filteredDrugs.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '3rem 1rem',
            textAlign: 'center',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💊</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.25rem' }}>
            Inga läkemedel matchade ditt filter
          </h3>
          <p style={{ fontSize: '0.82rem', margin: 0 }}>
            Prova att söka på ett annat namn, substans eller återställ filtret.
          </p>
        </div>
      ) : (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #cbd5e1',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}
        >
          {/* Kompakt Tabell-Header (dold på riktigt smala skärmar via flex/grid anpassning) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '32px minmax(190px, 1.3fr) minmax(220px, 1.8fr) minmax(180px, 1.4fr) minmax(130px, 1fr) minmax(140px, 1.1fr) 74px',
              gap: '0.65rem',
              padding: '0.5rem 0.85rem',
              background: '#f1f5f9',
              borderBottom: '1px solid #cbd5e1',
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#475569',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              alignItems: 'center',
            }}
            className="compact-drug-header"
          >
            <div style={{ textAlign: 'center' }}>★</div>
            <div>Läkemedel & Klass</div>
            <div>Vad det gör (Effekt & Indikation)</div>
            <div>Biverkningar (Urval)</div>
            <div>T½ & Anslag</div>
            <div>Styrka & Dosering</div>
            <div style={{ textAlign: 'right' }}>Detaljer</div>
          </div>

          {/* Kompakta Rader */}
          <div>
            {filteredDrugs.map((drug, idx) => {
              const isFav = favoriteDrugs.includes(drug.id);
              return (
                <div
                  key={drug.id}
                  onClick={() => setSelectedDrug(drug)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px minmax(190px, 1.3fr) minmax(220px, 1.8fr) minmax(180px, 1.4fr) minmax(130px, 1fr) minmax(140px, 1.1fr) 74px',
                    gap: '0.65rem',
                    padding: '0.48rem 0.85rem',
                    borderBottom: idx < filteredDrugs.length - 1 ? '1px solid #f1f5f9' : 'none',
                    borderLeft: `4px solid ${drug.color}`,
                    background: isFav ? '#fffdf5' : idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.12s ease',
                    fontSize: '0.78rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isFav ? '#fffdf5' : idx % 2 === 0 ? '#ffffff' : '#fafbfc';
                  }}
                >
                  {/* 1. Favoritknapp */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavoriteDrug(drug.id);
                      }}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: '0.15rem',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      title={isFav ? 'Ta bort favorit' : 'Favoritmarkera'}
                    >
                      <StarIcon filled={isFav} size={16} />
                    </button>
                  </div>

                  {/* 2. Namn, Varunamn & Kategori */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {drug.name}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drug.tradeNames} • <span style={{ color: drug.color, fontWeight: 700 }}>{drug.category}</span>
                    </div>
                  </div>

                  {/* 3. Vad det gör (Kort effekt) */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.77rem',
                        color: '#1e293b',
                        fontWeight: 600,
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {drug.shortEffect}
                    </div>
                  </div>

                  {/* 4. Biverkningar */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.73rem',
                        color: '#9f1239',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {drug.sideEffects}
                    </div>
                  </div>

                  {/* 5. Halveringstid & Anslag */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#4c1d95', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      T½: {drug.halfLife}
                    </div>
                    <div style={{ fontSize: '0.69rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Anslag: {drug.onset}
                    </div>
                  </div>

                  {/* 6. Koncentration & Dosering */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.73rem', fontWeight: 700, color: '#0369a1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drug.standardConc}
                    </div>
                    <div style={{ fontSize: '0.69rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {drug.standardDoseRange}
                    </div>
                  </div>

                  {/* 7. Öppna-knapp */}
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        background: '#f1f5f9',
                        color: '#0284c7',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      Visa info
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kompakt lista med Rutiner & PM under Läkemedel */}
      {categoryDocs.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.6rem' }}>
            Rutiner & PM – Läkemedel ({categoryDocs.length})
          </h3>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
            }}
          >
            {categoryDocs.map((doc, idx) => (
              <div
                key={doc.id}
                onClick={() => onOpenDoc(doc)}
                style={{
                  padding: '0.65rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderBottom: idx < categoryDocs.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  background: idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '0.86rem', color: '#0f172a' }}>{doc.title}</strong>
                    <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700 }}>
                      · {doc.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.1rem' }}>
                    {doc.description}
                  </div>
                </div>
                <span style={{ color: '#0284c7', fontWeight: 800, fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  Läs PM →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detaljfönster (Modal) när man klickar på ett läkemedel */}
      <DrugDetailModal
        drug={selectedDrug}
        onClose={() => setSelectedDrug(null)}
        isFavorite={selectedDrug ? favoriteDrugs.includes(selectedDrug.id) : false}
        onToggleFavorite={onToggleFavoriteDrug}
        onOpenInCalculator={(drugId) => {
          setSelectedDrug(null);
          onOpenInCalculator(drugId);
        }}
      />
    </div>
  );
};
