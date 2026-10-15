import React, { useState } from 'react';
import { DocumentItem, UserProfile, UserRole } from '../types';
import { StarIcon, SearchIcon } from '../components/Icons';

interface MyPageViewProps {
  currentUser: UserProfile | null;
  userRole: UserRole;
  favorites: string[];
  documents: DocumentItem[];
  onToggleFavorite: (docId: string) => void;
  onOpenDoc: (doc: DocumentItem) => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  simulateReadOnly: boolean;
  onToggleSimulateReadOnly: () => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  currentUser,
  userRole,
  favorites,
  documents,
  onToggleFavorite,
  onOpenDoc,
  onOpenLoginModal,
  onLogout,
  simulateReadOnly,
  onToggleSimulateReadOnly,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const favoriteDocs = documents.filter((d) => favorites.includes(d.id));

  const filtered = favoriteDocs.filter((d) => {
    const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
    const matchesSearch =
      searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const availableCategories = Array.from(new Set(favoriteDocs.map((d) => d.category)));

  return (
    <div className="mypage-view-container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '1rem' }}>
      {/* Profil- och Behörighetskort */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: userRole === 'OWNER' ? '#b45309' : '#0284c7',
                color: '#ffffff',
                fontSize: '1.5rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {currentUser ? (currentUser.name || currentUser.email).charAt(0).toUpperCase() : 'G'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {currentUser ? currentUser.name || currentUser.email : 'Gästanvändare'}
                </h1>
                {userRole === 'OWNER' && <span className="user-role-tag owner">👑 Huvudägare</span>}
                {userRole === 'EDITOR' && <span className="user-role-tag editor">✏️ Redaktör</span>}
                {userRole === 'VIEWER' && <span className="user-role-tag reader">👁️ Läsare</span>}
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                {currentUser ? currentUser.email : 'Logga in för att synkronisera dina favoriter och behörigheter'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {!currentUser ? (
              <button
                onClick={onOpenLoginModal}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Logga in med Google
              </button>
            ) : (
              <>
                <button
                  onClick={onToggleSimulateReadOnly}
                  style={{
                    background: simulateReadOnly ? '#fef3c7' : '#f1f5f9',
                    color: simulateReadOnly ? '#b45309' : '#475569',
                    border: '1px solid #cbd5e1',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                  title="Testa hur appen ser ut för vanlig personal utan redigeringsknappar"
                >
                  {simulateReadOnly ? 'Avsluta testläge ✕' : 'Testa läsbehörighet 👁️'}
                </button>
                <button
                  onClick={onLogout}
                  style={{
                    background: '#f8fafc',
                    color: '#b91c1c',
                    border: '1px solid #fecdd3',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Logga ut
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Favoriter Sektion */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StarIcon filled size={20} />
              <span>Mina Sparade Favoriter</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ca8a04', background: '#fef9c3', padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                {favoriteDocs.length} st
              </span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
              Dina personliga genvägar till de viktigaste rutinerna och PM på avdelningen.
            </p>
          </div>

          {/* Sök bland favoriter */}
          <div style={{ position: 'relative', width: '260px' }}>
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>
              <SearchIcon size={16} />
            </span>
            <input
              type="text"
              placeholder="Sök bland favoriter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.45rem 0.65rem 0.45rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Kategorifilter för favoriter */}
        {availableCategories.length > 0 && (
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategoryFilter('ALL')}
              style={{
                border: 'none',
                background: categoryFilter === 'ALL' ? '#0f172a' : '#f1f5f9',
                color: categoryFilter === 'ALL' ? '#ffffff' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                cursor: 'pointer',
              }}
            >
              Alla ({favoriteDocs.length})
            </button>
            {availableCategories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                style={{
                  border: 'none',
                  background: categoryFilter === c ? '#0284c7' : '#f1f5f9',
                  color: categoryFilter === c ? '#ffffff' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                }}
              >
                {c} ({favoriteDocs.filter((d) => d.category === c).length})
              </button>
            ))}
          </div>
        )}

        {/* Lista */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
            <StarIcon size={36} className="empty-star" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: '0.75rem 0 0.25rem' }}>
              {favoriteDocs.length === 0 ? 'Inga favoriter sparade ännu' : 'Inga favoriter matchade sökningen'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '450px', marginLeft: 'auto', marginRight: 'auto' }}>
              Klicka på stjärnikonen på något PM under sektionerna eller startsidan för att spara det här som snabbåtkomst!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
            {filtered.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onOpenDoc(doc)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      {doc.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(doc.id);
                      }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                      title="Ta bort från favoriter"
                    >
                      <StarIcon filled size={18} />
                    </button>
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.4rem' }}>
                    {doc.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0 0 0.85rem', lineHeight: 1.5 }}>
                    {doc.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '0.5rem' }}>
                  <span>{new Date(doc.dateAdded).toLocaleDateString('sv-SE')}</span>
                  <span style={{ color: '#0284c7', fontWeight: 700 }}>Öppna PM →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
