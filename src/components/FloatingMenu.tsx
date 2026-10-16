import React, { useState, useEffect } from 'react';
import { CategoryItem, DocumentItem, UserProfile } from '../types';
import {
  HomeIcon,
  StarIcon,
  SearchIcon,
  HeartPulseIcon,
  StethoscopeIcon,
  FlaskIcon,
  DropletIcon,
  NutritionIcon,
  PillIcon,
  VentilatorIcon,
  LayersIcon,
  CategoryIcon,
} from './Icons';

interface FloatingMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: CategoryItem[];
  onReorderCategories?: (newOrderIds: string[]) => void;
  documents: DocumentItem[];
  favoritesCount: number;
  currentUser: UserProfile | null;
  onOpenGlobalSearch: () => void;
  onOpenUploadModal: () => void;
  onOpenAndroidSetup?: () => void;
  canEdit: boolean;
}

type SectionKey = 'top_cards' | 'rutiner_pm' | 'clinical_modules';

interface ClinicalToolItem {
  id: string;
  name: string;
  color: string;
  showDocCount?: boolean;
}

const DEFAULT_CLINICAL_TOOLS: ClinicalToolItem[] = [
  { id: 'PAIN_SEDATION', name: 'CPOT & RASS', color: '#B4236C' },
  { id: 'DISEASES', name: 'Sjukdomar', color: '#B3261E' },
  { id: 'ACID_BASE', name: 'Syra-Bas', color: '#5E35B1' },
  { id: 'FLUID_BALANCE', name: 'Vätskor', color: '#006A60' },
  { id: 'NUTRITION', name: 'Nutrition (Kalkylator)', color: '#B25E00' },
  { id: 'DRUGS', name: 'Dos & CVK', color: '#0B57D0' },
  { id: 'EQUIPMENT', name: 'Apparatur', color: '#00677F' },
  { id: 'ALL', name: 'Alla PM', color: '#444746', showDocCount: true },
];

const DEFAULT_SECTION_ORDER: SectionKey[] = ['top_cards', 'rutiner_pm', 'clinical_modules'];
const DEFAULT_TOP_CARDS: ('HOME' | 'MY_PAGE')[] = ['HOME', 'MY_PAGE'];

const STORAGE_KEY_FAB_CONFIG = 'iva_fab_menu_layout_v2';

export const FloatingMenu: React.FC<FloatingMenuProps> = ({
  isOpen,
  onToggle,
  onClose,
  activeCategory,
  onSelectCategory,
  categories,
  onReorderCategories,
  documents,
  favoritesCount,
  currentUser,
  onOpenGlobalSearch,
  onOpenUploadModal,
  onOpenAndroidSetup,
  canEdit,
}) => {
  const [isEditingLayout, setIsEditingLayout] = useState(false);

  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAB_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.sectionOrder) && parsed.sectionOrder.length === 3) {
          return parsed.sectionOrder;
        }
      }
    } catch (e) {}
    return DEFAULT_SECTION_ORDER;
  });

  const [topCardsOrder, setTopCardsOrder] = useState<('HOME' | 'MY_PAGE')[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAB_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.topCardsOrder) && parsed.topCardsOrder.length === 2) {
          return parsed.topCardsOrder;
        }
      }
    } catch (e) {}
    return DEFAULT_TOP_CARDS;
  });

  const [categoryIdsOrder, setCategoryIdsOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAB_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.categoryIdsOrder) && parsed.categoryIdsOrder.length > 0) {
          const allIds = categories.map((c) => c.id);
          const validSaved = parsed.categoryIdsOrder.filter((id: string) => allIds.includes(id));
          const missing = allIds.filter((id) => !validSaved.includes(id));
          return [...validSaved, ...missing];
        }
      }
    } catch (e) {}
    return categories.map((c) => c.id);
  });

  const [toolIdsOrder, setToolIdsOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAB_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.toolIdsOrder) && parsed.toolIdsOrder.length > 0) {
          const allIds = DEFAULT_CLINICAL_TOOLS.map((t) => t.id);
          const validSaved = parsed.toolIdsOrder.filter((id: string) => allIds.includes(id));
          const missing = allIds.filter((id) => !validSaved.includes(id));
          return [...validSaved, ...missing];
        }
      }
    } catch (e) {}
    return DEFAULT_CLINICAL_TOOLS.map((t) => t.id);
  });

  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);
  const [draggedToolId, setDraggedToolId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_FAB_CONFIG,
        JSON.stringify({
          sectionOrder,
          topCardsOrder,
          categoryIdsOrder,
          toolIdsOrder,
        })
      );
    } catch (e) {}
  }, [sectionOrder, topCardsOrder, categoryIdsOrder, toolIdsOrder]);

  const orderedCategories = categoryIdsOrder
    .map((id) => categories.find((c) => c.id === id))
    .filter((c): c is CategoryItem => Boolean(c));

  const orderedTools = toolIdsOrder
    .map((id) => DEFAULT_CLINICAL_TOOLS.find((t) => t.id === id))
    .filter((t): t is ClinicalToolItem => Boolean(t));

  const moveItemInArray = <T,>(arr: T[], index: number, direction: -1 | 1): T[] => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= arr.length) return arr;
    const next = [...arr];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    return next;
  };

  const handleMoveCategory = (index: number, direction: -1 | 1) => {
    const next = moveItemInArray(categoryIdsOrder, index, direction);
    setCategoryIdsOrder(next);
    if (onReorderCategories) onReorderCategories(next);
  };

  const handleDropCategory = (targetId: string) => {
    if (!draggedCatId || draggedCatId === targetId) return;
    const fromIdx = categoryIdsOrder.indexOf(draggedCatId);
    const toIdx = categoryIdsOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...categoryIdsOrder];
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, draggedCatId);
    setCategoryIdsOrder(next);
    if (onReorderCategories) onReorderCategories(next);
    setDraggedCatId(null);
  };

  const handleMoveTool = (index: number, direction: -1 | 1) => {
    setToolIdsOrder((prev) => moveItemInArray(prev, index, direction));
  };

  const handleDropTool = (targetId: string) => {
    if (!draggedToolId || draggedToolId === targetId) return;
    const fromIdx = toolIdsOrder.indexOf(draggedToolId);
    const toIdx = toolIdsOrder.indexOf(targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const next = [...toolIdsOrder];
    next.splice(fromIdx, 1);
    next.splice(toIdx, 0, draggedToolId);
    setToolIdsOrder(next);
    setDraggedToolId(null);
  };

  const handleMoveSection = (index: number, direction: -1 | 1) => {
    setSectionOrder((prev) => moveItemInArray(prev, index, direction));
  };

  const handleResetLayout = () => {
    const defaultCatIds = categories.map((c) => c.id);
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setTopCardsOrder(DEFAULT_TOP_CARDS);
    setCategoryIdsOrder(defaultCatIds);
    setToolIdsOrder(DEFAULT_CLINICAL_TOOLS.map((t) => t.id));
    if (onReorderCategories) onReorderCategories(defaultCatIds);
  };

  const renderToolIcon = (toolId: string) => {
    switch (toolId) {
      case 'PAIN_SEDATION':
        return <HeartPulseIcon size={16} />;
      case 'DISEASES':
        return <StethoscopeIcon size={16} />;
      case 'ACID_BASE':
        return <FlaskIcon size={16} />;
      case 'FLUID_BALANCE':
        return <DropletIcon size={16} />;
      case 'NUTRITION':
        return <NutritionIcon size={16} />;
      case 'DRUGS':
        return <PillIcon size={16} />;
      case 'EQUIPMENT':
        return <VentilatorIcon size={16} />;
      case 'ALL':
      default:
        return <LayersIcon size={16} />;
    }
  };

  const renderSection = (sectionKey: SectionKey, sectionIdx: number) => {
    const sectionHeaderControls = isEditingLayout && (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleMoveSection(sectionIdx, -1);
          }}
          disabled={sectionIdx === 0}
          style={{
            border: '1px solid #C4C7C5',
            background: sectionIdx === 0 ? '#F0F4F9' : '#FFFFFF',
            color: sectionIdx === 0 ? '#8E918F' : '#1F1F1F',
            borderRadius: '8px',
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '0.12rem 0.45rem',
            cursor: sectionIdx === 0 ? 'default' : 'pointer',
          }}
          title="Flytta sektion uppåt"
        >
          ↑ Sektion
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleMoveSection(sectionIdx, 1);
          }}
          disabled={sectionIdx === sectionOrder.length - 1}
          style={{
            border: '1px solid #C4C7C5',
            background: sectionIdx === sectionOrder.length - 1 ? '#F0F4F9' : '#FFFFFF',
            color: sectionIdx === sectionOrder.length - 1 ? '#8E918F' : '#1F1F1F',
            borderRadius: '8px',
            fontSize: '0.68rem',
            fontWeight: 600,
            padding: '0.12rem 0.45rem',
            cursor: sectionIdx === sectionOrder.length - 1 ? 'default' : 'pointer',
          }}
          title="Flytta sektion nedåt"
        >
          ↓ Sektion
        </button>
      </div>
    );

    if (sectionKey === 'top_cards') {
      return (
        <div key="top_cards" style={{ marginBottom: '0.85rem' }}>
          {isEditingLayout && (
            <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span>Snabbkort (Startsida & Min Sida)</span>
              {sectionHeaderControls}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {topCardsOrder.map((cardKey, cIdx) => {
              if (cardKey === 'HOME') {
                const isHomeActive = activeCategory === 'HOME';
                return (
                  <div
                    key="HOME"
                    className={`google-fab-top-card ${isHomeActive ? 'active' : ''}`}
                    onClick={() => {
                      if (isEditingLayout) return;
                      onSelectCategory('HOME');
                      onClose();
                    }}
                    title="Öppna Startsidan"
                  >
                    <div className="google-fab-top-icon" style={{ background: isHomeActive ? '#0B57D0' : '#D3E3FD', color: isHomeActive ? '#FFFFFF' : '#0B57D0' }}>
                      <HomeIcon size={18} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isHomeActive ? '#001D35' : '#1F1F1F' }}>
                        Startsida
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#444746', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Översikt & Verktyg
                      </div>
                    </div>
                    {isEditingLayout && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopCardsOrder((prev) => moveItemInArray(prev, cIdx, cIdx === 0 ? 1 : -1));
                        }}
                        className="google-swap-mini-btn"
                        title="Byt plats"
                      >
                        ⇄
                      </button>
                    )}
                  </div>
                );
              }

              const isMyPageActive = activeCategory === 'MY_PAGE';
              return (
                <div
                  key="MY_PAGE"
                  className={`google-fab-top-card ${isMyPageActive ? 'active' : ''}`}
                  onClick={() => {
                    if (isEditingLayout) return;
                    onSelectCategory('MY_PAGE');
                    onClose();
                  }}
                  title="Öppna Min Sida med dina sparade favoriter"
                >
                  <div className="google-fab-top-icon" style={{ background: isMyPageActive ? '#0B57D0' : '#FEF7E0', color: isMyPageActive ? '#FFFFFF' : '#B06000' }}>
                    <StarIcon filled size={18} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: isMyPageActive ? '#001D35' : '#1F1F1F' }}>
                      Min Sida
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#444746', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {favoritesCount} favoriter
                    </div>
                  </div>
                  {isEditingLayout && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTopCardsOrder((prev) => moveItemInArray(prev, cIdx, cIdx === 0 ? 1 : -1));
                      }}
                      className="google-swap-mini-btn"
                      title="Byt plats"
                    >
                      ⇄
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (sectionKey === 'rutiner_pm') {
      return (
        <div key="rutiner_pm" style={{ marginBottom: '0.85rem' }}>
          <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span>Rutiner/PM</span>
            {sectionHeaderControls}
          </div>
          <div className="fab-category-grid">
            {orderedCategories.map((cat, idx) => {
              const count = documents.filter((d) => d.category === cat.id).length;
              const isActive = activeCategory === cat.id;

              return (
                <div
                  key={cat.id}
                  draggable={isEditingLayout}
                  onDragStart={() => setDraggedCatId(cat.id)}
                  onDragOver={(e) => {
                    if (isEditingLayout) e.preventDefault();
                  }}
                  onDrop={() => {
                    if (isEditingLayout) handleDropCategory(cat.id);
                  }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <button
                    type="button"
                    className={`fab-cat-btn ${isActive ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      border: isEditingLayout ? '1.5px dashed #0B57D0' : undefined,
                      cursor: isEditingLayout ? 'grab' : 'pointer',
                      paddingBottom: isEditingLayout ? '1.6rem' : undefined,
                    }}
                    onClick={() => {
                      if (isEditingLayout) return;
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    title={`${cat.name} (${cat.subtitle})`}
                  >
                    <span className="fab-cat-icon" style={{ color: isActive ? '#001D35' : cat.color }}>
                      <CategoryIcon icon={cat.icon} size={18} color={isActive ? '#001D35' : cat.color} />
                    </span>
                    <span className="fab-cat-name">{cat.name}</span>
                    <span className="fab-badge">{count}</span>
                  </button>

                  {isEditingLayout && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '3px',
                        left: '4px',
                        right: '4px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '2px',
                        zIndex: 5,
                      }}
                    >
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCategory(idx, -1);
                        }}
                        className="google-reorder-arrow-btn"
                        title="Flytta bakåt/upp"
                      >
                        ←
                      </button>
                      <span style={{ fontSize: '0.62rem', color: '#444746', alignSelf: 'center', fontWeight: 700 }}>
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === orderedCategories.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCategory(idx, 1);
                        }}
                        className="google-reorder-arrow-btn"
                        title="Flytta framåt/ner"
                      >
                        →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // clinical_modules (Utan Gemini AI!)
    return (
      <div key="clinical_modules" style={{ marginBottom: '0.35rem' }}>
        <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span>Kliniska Moduler</span>
          {sectionHeaderControls}
        </div>

        <div className="fab-tools-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
          {orderedTools.map((tool, idx) => {
            const isActive = activeCategory === tool.id;

            return (
              <div
                key={tool.id}
                draggable={isEditingLayout}
                onDragStart={() => setDraggedToolId(tool.id)}
                onDragOver={(e) => {
                  if (isEditingLayout) e.preventDefault();
                }}
                onDrop={() => {
                  if (isEditingLayout) handleDropTool(tool.id);
                }}
                style={{
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  className={`fab-cat-btn ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    border: isEditingLayout ? '1.5px dashed #0B57D0' : undefined,
                    paddingBottom: isEditingLayout ? '1.6rem' : undefined,
                    cursor: isEditingLayout ? 'grab' : 'pointer',
                  }}
                  onClick={() => {
                    if (isEditingLayout) return;
                    onSelectCategory(tool.id);
                    onClose();
                  }}
                >
                  <span className="fab-cat-icon" style={{ color: isActive ? '#001D35' : tool.color }}>
                    {renderToolIcon(tool.id)}
                  </span>
                  <span className="fab-cat-name" style={{ flex: 1, textAlign: 'left' }}>
                    {tool.name}
                  </span>
                  {tool.showDocCount && <span className="fab-badge">{documents.length}</span>}
                </button>

                {isEditingLayout && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '3px',
                      left: '4px',
                      right: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '2px',
                      zIndex: 5,
                    }}
                  >
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTool(idx, -1);
                      }}
                      className="google-reorder-arrow-btn"
                      title="Flytta bakåt/upp"
                    >
                      ←
                    </button>
                    <span style={{ fontSize: '0.62rem', color: '#444746', alignSelf: 'center', fontWeight: 700 }}>
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === orderedTools.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTool(idx, 1);
                      }}
                      className="google-reorder-arrow-btn"
                      title="Flytta framåt/ner"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      id="floatingMenuContainer"
      className={`fab-container m3-fab-wrapper ${isOpen ? 'is-open' : ''}`}
    >
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fab-backdrop"
          onClick={() => {
            setIsEditingLayout(false);
            onClose();
          }}
        />
      )}

      {/* Google Material 3 Tonal Squircle FAB */}
      <button
        className="fab-main-btn m3-expressive-fab"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title="Öppna IVA-menyn (Rutiner/PM & Verktyg)"
        aria-label="Öppna navigationsmeny"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span style={{ fontSize: '1.25rem', fontWeight: 600, lineHeight: 1 }}>✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
          </svg>
        )}
      </button>

      {/* Google Material 3 Meny-panel (Ljus, matt tonal yta) */}
      {isOpen && (
        <div
          className="fab-menu-panel m3-fab-sheet"
          onClick={(e) => e.stopPropagation()}
          role="menu"
        >
          <div className="fab-panel-header">
            <div className="fab-panel-title">
              <span>IVA Navigering</span>
            </div>
            <div className="fab-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsEditingLayout((prev) => !prev)}
                className={`google-fab-edit-btn ${isEditingLayout ? 'active' : ''}`}
                title="Flytta runt och redigera innehållet i menyn"
              >
                <span>{isEditingLayout ? '✓ Klar' : 'Redigera'}</span>
              </button>

              {onOpenAndroidSetup && (
                <button
                  type="button"
                  className="fab-mini-btn"
                  onClick={() => {
                    onClose();
                    onOpenAndroidSetup();
                  }}
                  title="Android-App, Kamera & Notiser"
                >
                  📱
                </button>
              )}

              <button
                className="fab-mini-btn"
                onClick={() => {
                  onClose();
                  onOpenGlobalSearch();
                }}
                title="Sök i hela appen (Ctrl+K)"
              >
                <SearchIcon size={15} />
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

          {isEditingLayout && (
            <div className="google-fab-edit-banner">
              <span>
                Använd pilarna <strong>← / →</strong> eller dra & släpp för att ändra ordning.
              </span>
              <button
                type="button"
                onClick={handleResetLayout}
                className="google-fab-reset-btn"
                title="Återställ standardordning"
              >
                Återställ
              </button>
            </div>
          )}

          {/* Rendera sektioner i användarens valda ordning */}
          {sectionOrder.map((secKey, idx) => renderSection(secKey, idx))}
        </div>
      )}
    </div>
  );
};
