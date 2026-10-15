import React, { useState, useRef } from 'react';
import { CategoryItem, DocumentItem } from '../types';
import { SearchIcon, StarIcon, CategoryIcon } from '../components/Icons';
import { CategoryHubSection } from '../components/CategoryHubSection';

interface DocumentsViewProps {
  currentCategory: string;
  categories: CategoryItem[];
  documents: DocumentItem[];
  favorites: string[];
  onToggleFavorite: (docId: string) => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onSelectCategory: (cat: string) => void;
  onDeleteDoc: (docId: string) => void;
  onTogglePinDoc: (docId: string) => void;
  canEdit: boolean;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  currentCategory,
  categories,
  documents,
  favorites,
  onToggleFavorite,
  onOpenDoc,
  onSelectCategory,
  onDeleteDoc,
  onTogglePinDoc,
  canEdit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'title-asc' | 'priority'>('priority');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const pmSectionRef = useRef<HTMLDivElement | null>(null);

  const normalizedCategory = currentCategory === 'Nutrition_Docs' ? 'Nutrition' : currentCategory;
  const catObj = categories.find((c) => c.id === normalizedCategory);

  // Filtrera dokument
  const filtered = documents.filter((doc) => {
    const matchesCat = normalizedCategory === 'ALL' || doc.category === normalizedCategory;
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesTag = !selectedTag || (doc.tags && doc.tags.includes(selectedTag));
    return matchesCat && matchesSearch && matchesTag;
  });

  // Sortera: fästa dokument alltid först, därefter vald sortering
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;

    if (sortOrder === 'title-asc') {
      return a.title.localeCompare(b.title, 'sv');
    }
    if (sortOrder === 'priority') {
      const pOrder: Record<string, number> = { Akut: 1, Riktlinje: 2, Rutin: 3 };
      return (pOrder[a.priority] || 4) - (pOrder[b.priority] || 4);
    }
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  // Samla alla unika taggar för aktuell kategori
  const availableTags = Array.from(
    new Set(
      documents
        .filter((d) => normalizedCategory === 'ALL' || d.category === normalizedCategory)
        .flatMap((d) => d.tags || [])
    )
  );

  const scrollToPmSection = () => {
    if (pmSectionRef.current) {
      pmSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="documents-view-container" style={{ maxWidth: '1340px', margin: '0 auto', padding: '1rem' }}>
      {/* Kategori Header Banner */}
      <div
        className="category-banner-card"
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
                background: catObj?.colorLight || '#e0f2fe',
                color: catObj?.color || '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CategoryIcon icon={catObj?.icon || 'lungs'} size={24} color={catObj?.color} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {catObj?.name || (normalizedCategory === 'ALL' ? 'Alla Rutiner/PM' : normalizedCategory)}
                </h1>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: catObj?.color || '#0284c7' }}>
                  • Klinisk Startsida & Rutiner/PM
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                {catObj?.description || 'Normalvärden, inställningar, bra saker att veta samt kompakt lista över avdelningens rutiner och PM.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569' }}>
              {sorted.length} {sorted.length === 1 ? 'rutin/PM' : 'rutiner/PM'}
            </span>
          </div>
        </div>

        {/* Kategoriväljare (Rutiner/PM) */}
        <div style={{ display: 'flex', gap: '0.35rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => onSelectCategory('ALL')}
            style={{
              border: normalizedCategory === 'ALL' ? '1.5px solid #0f172a' : '1px solid transparent',
              background: normalizedCategory === 'ALL' ? '#0f172a' : '#f1f5f9',
              color: normalizedCategory === 'ALL' ? '#ffffff' : '#475569',
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
            const cCount = documents.filter((d) => d.category === c.id).length;
            const isAct = normalizedCategory === c.id;
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

      {/* KATEGORI-STARTSIDA / HUBB: Normalvärden, Inställningar & Bra saker att veta */}
      {normalizedCategory !== 'ALL' && (
        <CategoryHubSection
          categoryId={normalizedCategory}
          categoryObj={catObj}
          onSelectCategory={onSelectCategory}
          pmCount={sorted.length}
          onScrollToPmList={scrollToPmSection}
        />
      )}

      {/* LÄNGRE NER: KOMPAKT LISTA MED ALLA RUTINER OCH PM */}
      <div ref={pmSectionRef} id="category-pm-list-section" style={{ scrollMarginTop: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Rutiner & PM – {catObj?.name || 'Alla Kategorier'} ({sorted.length})
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.1rem 0 0' }}>
              Kompakt lista över styrande rutiner, riktlinjer och PM. Klicka på en rad för att öppna dokumentet i helskärm.
            </p>
          </div>
        </div>

        {/* Sök-, Filter- & Sorteringslist för PM */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '0.7rem 1rem',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {/* Sök */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: '400px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <SearchIcon size={15} />
            </span>
            <input
              type="text"
              placeholder={`Sök rutin eller PM under ${catObj?.name || 'alla kategorier'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.42rem 0.65rem 0.42rem 2.1rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.82rem',
              }}
            />
          </div>

          {/* Taggar */}
          {availableTags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Filter:</span>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  style={{
                    border: 'none',
                    background: '#f1f5f9',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  Rensa ✕
                </button>
              )}
              {availableTags.slice(0, 7).map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                  style={{
                    border: selectedTag === t ? '1px solid #0284c7' : '1px solid #e2e8f0',
                    background: selectedTag === t ? '#0284c7' : '#f8fafc',
                    color: selectedTag === t ? '#ffffff' : '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.18rem 0.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                  }}
                >
                  #{t}
                </button>
              ))}
            </div>
          )}

          {/* Sortering & Vy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <label htmlFor="doc_sort" style={{ display: 'none' }}>Sortera</label>
            <select
              id="doc_sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              style={{
                padding: '0.4rem 0.6rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#334155',
              }}
            >
              <option value="priority">Prioritet & Nålat först</option>
              <option value="date-desc">Nyast först</option>
              <option value="title-asc">Titel (A–Ö)</option>
            </select>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '0.15rem' }}>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  border: 'none',
                  background: viewMode === 'list' ? '#ffffff' : 'transparent',
                  padding: '0.3rem 0.55rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: viewMode === 'list' ? '#0f172a' : '#64748b',
                }}
                title="Kompakt listvy"
              >
                ☰ Kompakt
              </button>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  border: 'none',
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  padding: '0.3rem 0.55rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: viewMode === 'grid' ? '#0f172a' : '#64748b',
                }}
                title="Kortvy"
              >
                ⊞ Kort
              </button>
            </div>
          </div>
        </div>

        {/* Dokumentlista */}
        {sorted.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem', color: '#0f172a' }}>
              Inga rutiner/PM hittades
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
              {searchQuery ? `Inga PM matchar "${searchQuery}" i denna kategori.` : 'Inga dokument har laddats upp under denna kategori ännu.'}
            </p>
          </div>
        ) : viewMode === 'list' ? (
          /* KOMPAKT LISTVY (Standard) */
          <div
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #cbd5e1',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            {/* Kompakt Tabell-Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '32px minmax(220px, 1.6fr) minmax(240px, 2.2fr) minmax(130px, 0.9fr) 110px',
                gap: '0.75rem',
                padding: '0.5rem 0.9rem',
                background: '#f1f5f9',
                borderBottom: '1px solid #cbd5e1',
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                alignItems: 'center',
              }}
            >
              <div style={{ textAlign: 'center' }}>★</div>
              <div>Rutin / PM & Kategori</div>
              <div>Kort sammanfattning & Innehåll</div>
              <div>Taggar & Typ</div>
              <div style={{ textAlign: 'right' }}>Åtgärd</div>
            </div>

            {sorted.map((doc, idx) => {
              const isFav = favorites.includes(doc.id);
              const docCatObj = categories.find((c) => c.id === doc.category);
              return (
                <div
                  key={doc.id}
                  onClick={() => onOpenDoc(doc)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '32px minmax(220px, 1.6fr) minmax(240px, 2.2fr) minmax(130px, 0.9fr) 110px',
                    gap: '0.75rem',
                    padding: '0.55rem 0.9rem',
                    alignItems: 'center',
                    borderBottom: idx < sorted.length - 1 ? '1px solid #f1f5f9' : 'none',
                    cursor: 'pointer',
                    background: doc.isPinned ? '#fffdf5' : idx % 2 === 0 ? '#ffffff' : '#fafbfc',
                    transition: 'background 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f0f9ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = doc.isPinned ? '#fffdf5' : idx % 2 === 0 ? '#ffffff' : '#fafbfc';
                  }}
                >
                  {/* 1. Favorit */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(doc.id);
                      }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.15rem' }}
                      title={isFav ? 'Ta bort favorit' : 'Spara som favorit'}
                    >
                      <StarIcon filled={isFav} size={16} />
                    </button>
                  </div>

                  {/* 2. Titel & Kategori */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 800,
                          color: '#0f172a',
                          lineHeight: 1.3,
                        }}
                      >
                        {doc.title}
                      </strong>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{ color: docCatObj?.color || '#0284c7', fontWeight: 700 }}>
                        {docCatObj?.name || doc.category}
                      </span>
                      <span>·</span>
                      <span
                        style={{
                          color: doc.priority === 'Akut' ? '#b91c1c' : doc.priority === 'Riktlinje' ? '#1d4ed8' : '#475569',
                          fontWeight: 700,
                        }}
                      >
                        {doc.priority}
                      </span>
                      {doc.isPinned && (
                        <>
                          <span>·</span>
                          <span style={{ color: '#b45309', fontWeight: 700 }}>Nålat PM</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 3. Beskrivning */}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.77rem',
                        color: '#334155',
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {doc.description}
                    </div>
                  </div>

                  {/* 4. Taggar & Datum */}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.71rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {doc.tags && doc.tags.length > 0 ? doc.tags.slice(0, 3).map((t) => `#${t}`).join(' · ') : 'Rutin/PM'}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                      {new Date(doc.dateAdded).toLocaleDateString('sv-SE')}
                    </div>
                  </div>

                  {/* 5. Åtgärder */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                    {canEdit && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePinDoc(doc.id);
                          }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', padding: '0.15rem' }}
                          title={doc.isPinned ? 'Lossa nål' : 'Nåla PM'}
                        >
                          📌
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteDoc(doc.id);
                          }}
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.8rem', color: '#b91c1c', padding: '0.15rem' }}
                          title="Ta bort PM"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                    <span
                      style={{
                        background: '#f1f5f9',
                        color: '#0284c7',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        padding: '0.28rem 0.55rem',
                        borderRadius: '6px',
                        border: '1px solid #e2e8f0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Läs PM →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* KORTVY (Grid) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.1rem' }}>
            {sorted.map((doc) => {
              const isFav = favorites.includes(doc.id);
              const docCatObj = categories.find((c) => c.id === doc.category);
              return (
                <div
                  key={doc.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: doc.isPinned ? '1.5px solid #f59e0b' : '1px solid #e2e8f0',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    position: 'relative',
                  }}
                  onClick={() => onOpenDoc(doc)}
                >
                  <div style={{ padding: '1.15rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', fontSize: '0.74rem', color: '#64748b' }}>
                        <span style={{ color: docCatObj?.color || '#0369a1', fontWeight: 700 }}>
                          {docCatObj?.name || doc.category}
                        </span>
                        <span>·</span>
                        <span style={{ fontWeight: 700, color: doc.priority === 'Akut' ? '#b91c1c' : '#1d4ed8' }}>
                          {doc.priority}
                        </span>
                        {doc.isPinned && (
                          <>
                            <span>·</span>
                            <span style={{ color: '#b45309', fontWeight: 700 }}>Nålat</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(doc.id);
                        }}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.2rem' }}
                        title={isFav ? 'Ta bort favorit' : 'Spara som favorit'}
                      >
                        <StarIcon filled={isFav} size={18} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.45rem', lineHeight: 1.35 }}>
                      {doc.title}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.85rem', lineHeight: 1.45, flex: 1 }}>
                      {doc.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.65rem', borderTop: '1px solid #f1f5f9', fontSize: '0.74rem', color: '#94a3b8' }}>
                      <span>{new Date(doc.dateAdded).toLocaleDateString('sv-SE')}</span>
                      <span style={{ color: '#0284c7', fontWeight: 800 }}>Öppna PM →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
