import React, { useState } from 'react';
import { CategoryItem, DocumentItem } from '../types';
import { SearchIcon, StarIcon, CategoryIcon } from '../components/Icons';

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
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'title-asc' | 'priority'>('date-desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const catObj = categories.find((c) => c.id === currentCategory);

  // Filtrera dokument
  const filtered = documents.filter((doc) => {
    const matchesCat = currentCategory === 'ALL' || doc.category === currentCategory;
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
        .filter((d) => currentCategory === 'ALL' || d.category === currentCategory)
        .flatMap((d) => d.tags || [])
    )
  );

  return (
    <div className="documents-view-container" style={{ maxWidth: '1300px', margin: '0 auto', padding: '1rem' }}>
      {/* Kategori Header Banner */}
      <div
        className="category-banner-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.25rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {catObj?.name || (currentCategory === 'ALL' ? 'Alla Dokument & PM' : currentCategory)}
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                {catObj?.description || 'Samtliga avdelningens rutiner, protokoll och styrande dokument.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
              {sorted.length} {sorted.length === 1 ? 'dokument' : 'dokument'}
            </span>
          </div>
        </div>

        {/* Kategoriväljare (Pills) */}
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => onSelectCategory('ALL')}
            style={{
              border: 'none',
              background: currentCategory === 'ALL' ? '#0f172a' : '#f1f5f9',
              color: currentCategory === 'ALL' ? '#ffffff' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Alla ({documents.length})
          </button>
          {categories.map((c) => {
            const cCount = documents.filter((d) => d.category === c.id).length;
            const isAct = currentCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                style={{
                  border: isAct ? `1.5px solid ${c.color}` : '1px solid transparent',
                  background: isAct ? c.colorLight : '#f1f5f9',
                  color: isAct ? c.color : '#475569',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '0.4rem 0.85rem',
                  borderRadius: '9999px',
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

      {/* Sök-, Filter- & Sorteringslist */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Sök */}
        <div style={{ position: 'relative', width: '280px' }}>
          <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Sök i kategorin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.65rem 0.45rem 2.2rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
            }}
          />
        </div>

        {/* Taggar */}
        {availableTags.length > 0 && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Taggar:</span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                Rensa tagg ✕
              </button>
            )}
            {availableTags.slice(0, 6).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                style={{
                  border: 'none',
                  background: selectedTag === t ? '#0284c7' : '#f8fafc',
                  color: selectedTag === t ? '#ffffff' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.55rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                #{t}
              </button>
            ))}
          </div>
        )}

        {/* Sortering & Vy */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label htmlFor="doc_sort" style={{ display: 'none' }}>Sortera</label>
          <select
            id="doc_sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            <option value="date-desc">Nyast först</option>
            <option value="title-asc">Titel (A–Ö)</option>
            <option value="priority">Prioritet (Akut först)</option>
          </select>

          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '0.15rem' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                border: 'none',
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
              title="Rutnätsvy"
            >
              ⊞
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                border: 'none',
                background: viewMode === 'list' ? '#ffffff' : 'transparent',
                padding: '0.35rem 0.6rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
              title="Listvy"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Dokumentlista */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span style={{ fontSize: '2.5rem' }}>📄</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0.5rem 0 0.25rem', color: '#0f172a' }}>
            Inga dokument hittades
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
            {searchQuery ? `Inga PM matchar "${searchQuery}" i denna kategori.` : 'Inga dokument har laddats upp under denna kategori ännu.'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {sorted.map((doc) => {
            const isFav = favorites.includes(doc.id);
            return (
              <div
                key={doc.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: doc.isPinned ? '2px solid #f59e0b' : '1px solid #e2e8f0',
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
                {doc.isPinned && (
                  <div style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    📌 Nålat Viktigt PM
                  </div>
                )}

                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.72rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {doc.category}
                      </span>
                      <span
                        style={{
                          background: doc.priority === 'Akut' ? '#fee2e2' : doc.priority === 'Riktlinje' ? '#dbeafe' : '#f1f5f9',
                          color: doc.priority === 'Akut' ? '#b91c1c' : doc.priority === 'Riktlinje' ? '#1d4ed8' : '#334155',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                        }}
                      >
                        {doc.priority}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(doc.id);
                      }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.2rem' }}
                      title={isFav ? 'Ta bort favorit' : 'Spara som favorit'}
                    >
                      <StarIcon filled={isFav} size={20} />
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem', lineHeight: 1.4 }}>
                    {doc.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0 0 1rem', lineHeight: 1.5, flex: 1 }}>
                    {doc.description}
                  </p>

                  {/* Taggar */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {doc.tags.slice(0, 4).map((t, idx) => (
                        <span key={idx} style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.72rem', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Kort Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>{new Date(doc.dateAdded).toLocaleDateString('sv-SE')}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {canEdit && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTogglePinDoc(doc.id);
                            }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem' }}
                            title={doc.isPinned ? 'Lossa nål' : 'Nåla PM'}
                          >
                            📌
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Radera "${doc.title}"?`)) onDeleteDoc(doc.id);
                            }}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.85rem', color: '#b91c1c' }}
                            title="Ta bort PM"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                      <span style={{ color: '#0284c7', fontWeight: 700 }}>Öppna PM →</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Listvy */
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {sorted.map((doc, idx) => {
            const isFav = favorites.includes(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => onOpenDoc(doc)}
                style={{
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: idx < sorted.length - 1 ? '1px solid #f1f5f9' : 'none',
                  cursor: 'pointer',
                  background: doc.isPinned ? '#fffbeb' : '#ffffff',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(doc.id);
                    }}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                  >
                    <StarIcon filled={isFav} size={18} />
                  </button>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{doc.title}</strong>
                      {doc.isPinned && <span style={{ fontSize: '0.75rem' }}>📌</span>}
                      <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                        {doc.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                      {doc.description.substring(0, 120)}...
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(doc.dateAdded).toLocaleDateString('sv-SE')}
                  </span>
                  <span style={{ color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>Öppna →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
