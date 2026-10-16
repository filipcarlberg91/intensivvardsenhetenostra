import React, { useState, useEffect } from 'react';
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
  onOpenGeminiChat: () => void;
  onOpenAndroidSetup?: () => void;
  canEdit: boolean;
}

type SectionKey = 'top_cards' | 'rutiner_pm' | 'clinical_modules';

interface ClinicalToolItem {
  id: string;
  name: string;
  color: string;
  isAi?: boolean;
  showDocCount?: boolean;
}

const DEFAULT_CLINICAL_TOOLS: ClinicalToolItem[] = [
  { id: 'PAIN_SEDATION', name: 'CPOT & RASS', color: '#d946ef' },
  { id: 'DISEASES', name: 'Sjukdomar', color: '#e11d48' },
  { id: 'ACID_BASE', name: 'Syra-Bas', color: '#7c3aed' },
  { id: 'FLUID_BALANCE', name: 'Vätskor', color: '#059669' },
  { id: 'NUTRITION', name: 'Nutrition (Kalkylator)', color: '#d97706' },
  { id: 'DRUGS', name: 'Dos & CVK', color: '#0ea5e9' },
  { id: 'EQUIPMENT', name: 'Apparatur', color: '#0891b2' },
  { id: 'ALL', name: 'Alla PM', color: '#64749b', showDocCount: true },
  { id: 'GEMINI_AI', name: 'Gemini IVA Notebook (AI)', color: '#7c3aed', isAi: true },
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
  onOpenGeminiChat,
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
      case 'GEMINI_AI':
        return <SparklesIcon size={16} />;
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
            border: '1px solid rgba(255,255,255,0.2)',
            background: sectionIdx === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.14)',
            color: sectionIdx === 0 ? '#64748b' : '#f8fafc',
            borderRadius: '5px',
            fontSize: '0.68rem',
            padding: '0.1rem 0.35rem',
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
            border: '1px solid rgba(255,255,255,0.2)',
            background: sectionIdx === sectionOrder.length - 1 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.14)',
            color: sectionIdx === sectionOrder.length - 1 ? '#64748b' : '#f8fafc',
            borderRadius: '5px',
            fontSize: '0.68rem',
            padding: '0.1rem 0.35rem',
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
        <div key="top_cards" style={{ marginBottom: '0.75rem' }}>
          {isEditingLayout && (
            <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Snabbkort (Startsida & Min Sida)</span>
              {sectionHeaderControls}
            </div>
          )}
          {topCardsOrder.map((cardKey, cIdx) => {
            if (cardKey === 'HOME') {
              return (
                <div
                  key="HOME"
                  className={`fab-mypage-card ${activeCategory === 'HOME' ? 'active' : ''}`}
                  style={{
                    background:
                      activeCategory === 'HOME'
                        ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.35) 0%, rgba(14, 165, 233, 0.2) 100%)'
                        : 'rgba(255, 255, 255, 0.06)',
                    borderColor: activeCategory === 'HOME' ? '#38bdf8' : 'rgba(255, 255, 255, 0.12)',
                    marginBottom: '0.55rem',
                    position: 'relative',
                  }}
                  onClick={() => {
                    if (isEditingLayout) return;
                    onSelectCategory('HOME');
                    onClose();
                  }}
                  title="Öppna Startsidan"
                >
                  <div className="fab-mypage-icon" style={{ background: '#0284c7', color: '#ffffff' }}>
                    <HomeIcon size={20} />
                  </div>
                  <div className="fab-mypage-info">
                    <div className="fab-mypage-title" style={{ color: '#ffffff' }}>
                      Startsida
                    </div>
                    <div className="fab-mypage-sub">IVA Översikt & Verktyg</div>
                  </div>
                  {isEditingLayout ? (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTopCardsOrder((prev) => moveItemInArray(prev, cIdx, cIdx === 0 ? 1 : -1));
                        }}
                        style={{
                          background: 'rgba(56, 189, 248, 0.25)',
                          color: '#ffffff',
                          border: '1px solid #38bdf8',
                          borderRadius: '6px',
                          padding: '0.2rem 0.45rem',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                        title="Byt plats på Startsida och Min Sida"
                      >
                        ⇅ Byt plats
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '1.1rem', color: '#38bdf8', fontWeight: 700 }}>🏠</span>
                  )}
                </div>
              );
            }

            return (
              <div
                key="MY_PAGE"
                className={`fab-mypage-card ${activeCategory === 'MY_PAGE' ? 'active' : ''}`}
                style={{ marginBottom: '0.55rem' }}
                onClick={() => {
                  if (isEditingLayout) return;
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
                {isEditingLayout ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setTopCardsOrder((prev) => moveItemInArray(prev, cIdx, cIdx === 0 ? 1 : -1));
                    }}
                    style={{
                      background: 'rgba(56, 189, 248, 0.25)',
                      color: '#ffffff',
                      border: '1px solid #38bdf8',
                      borderRadius: '6px',
                      padding: '0.2rem 0.45rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    title="Byt plats på Startsida och Min Sida"
                  >
                    ⇅ Byt plats
                  </button>
                ) : (
                  <span className="fab-badge">{favoritesCount}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (sectionKey === 'rutiner_pm') {
      return (
        <div key="rutiner_pm" style={{ marginBottom: '0.75rem' }}>
          <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      border: isEditingLayout ? '1px dashed rgba(56, 189, 248, 0.6)' : undefined,
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
                    <span className="fab-cat-icon" style={{ color: isActive ? '#ffffff' : cat.color }}>
                      <CategoryIcon icon={cat.icon} size={18} color={cat.color} />
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
                        style={{
                          flex: 1,
                          border: 'none',
                          background: idx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(2, 132, 199, 0.45)',
                          color: idx === 0 ? '#475569' : '#ffffff',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          borderRadius: '4px',
                          padding: '1px 0',
                          cursor: idx === 0 ? 'default' : 'pointer',
                        }}
                        title="Flytta bakåt/upp"
                      >
                        ←
                      </button>
                      <span style={{ fontSize: '0.62rem', color: '#94a3b8', alignSelf: 'center', fontWeight: 700 }}>
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === orderedCategories.length - 1}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveCategory(idx, 1);
                        }}
                        style={{
                          flex: 1,
                          border: 'none',
                          background:
                            idx === orderedCategories.length - 1
                              ? 'rgba(255,255,255,0.05)'
                              : 'rgba(2, 132, 199, 0.45)',
                          color: idx === orderedCategories.length - 1 ? '#475569' : '#ffffff',
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          borderRadius: '4px',
                          padding: '1px 0',
                          cursor: idx === orderedCategories.length - 1 ? 'default' : 'pointer',
                        }}
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

    // clinical_modules (med Gemini AI Notebook längst ner som standard!)
    return (
      <div key="clinical_modules" style={{ marginBottom: '0.5rem' }}>
        <div className="fab-section-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Kliniska Moduler & AI</span>
          {sectionHeaderControls}
        </div>

        <div className="fab-tools-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.45rem' }}>
          {orderedTools.map((tool, idx) => {
            const isActive = activeCategory === tool.id;
            const isAi = tool.isAi;

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
                  gridColumn: isAi ? '1 / -1' : undefined,
                  marginTop: isAi ? '0.25rem' : undefined,
                  position: 'relative',
                }}
              >
                <button
                  type="button"
                  className={`fab-cat-btn ${isActive ? 'active' : ''}`}
                  style={{
                    width: '100%',
                    background: isAi ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : undefined,
                    color: isAi ? '#ffffff' : undefined,
                    border: isEditingLayout
                      ? '1px dashed rgba(167, 139, 250, 0.7)'
                      : isAi
                      ? '1px solid rgba(196, 181, 253, 0.45)'
                      : undefined,
                    padding: isAi ? '0.68rem 0.85rem' : undefined,
                    paddingBottom: isEditingLayout ? '1.6rem' : undefined,
                    cursor: isEditingLayout ? 'grab' : 'pointer',
                    boxShadow: isAi ? '0 8px 20px -4px rgba(124, 58, 237, 0.45)' : undefined,
                  }}
                  onClick={() => {
                    if (isEditingLayout) return;
                    if (tool.id === 'GEMINI_AI') {
                      onClose();
                      onOpenGeminiChat();
                    } else {
                      onSelectCategory(tool.id);
                      onClose();
                    }
                  }}
                >
                  <span className="fab-cat-icon" style={{ color: isAi ? '#ffffff' : tool.color }}>
                    {renderToolIcon(tool.id)}
                  </span>
                  <span className="fab-cat-name" style={{ flex: 1, textAlign: 'left', fontWeight: isAi ? 800 : undefined }}>
                    {tool.name}
                  </span>
                  {isAi && (
                    <span
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: '#ffffff',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '0.12rem 0.45rem',
                        borderRadius: '6px',
                      }}
                    >
                      Notebook
                    </span>
                  )}
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
                      style={{
                        flex: 1,
                        border: 'none',
                        background: idx === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(124, 58, 237, 0.5)',
                        color: idx === 0 ? '#475569' : '#ffffff',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        borderRadius: '4px',
                        padding: '1px 0',
                        cursor: idx === 0 ? 'default' : 'pointer',
                      }}
                      title="Flytta bakåt/upp"
                    >
                      ←
                    </button>
                    <span style={{ fontSize: '0.62rem', color: '#cbd5e1', alignSelf: 'center', fontWeight: 700 }}>
                      #{idx + 1}
                    </span>
                    <button
                      type="button"
                      disabled={idx === orderedTools.length - 1}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveTool(idx, 1);
                      }}
                      style={{
                        flex: 1,
                        border: 'none',
                        background:
                          idx === orderedTools.length - 1
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(124, 58, 237, 0.5)',
                        color: idx === orderedTools.length - 1 ? '#475569' : '#ffffff',
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        borderRadius: '4px',
                        padding: '1px 0',
                        cursor: idx === orderedTools.length - 1 ? 'default' : 'pointer',
                      }}
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
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 99990,
          }}
        />
      )}

      {/* M3 Expressive Squircle FAB button */}
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
          <span style={{ fontSize: '1.35rem', fontWeight: 800, lineHeight: 1 }}>✕</span>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
          </svg>
        )}
        {favoritesCount > 0 && !isOpen && (
          <span
            className="fab-badge-pill"
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#BA1A1A',
              color: 'white',
              fontSize: '0.68rem',
              fontWeight: 800,
              width: '21px',
              height: '21px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #F4F7FC',
            }}
          >
            {favoritesCount}
          </span>
        )}
      </button>

      {/* Utfällbar M3 Expressive meny-panel */}
      {isOpen && (
        <div
          className="fab-menu-panel m3-fab-sheet"
          onClick={(e) => e.stopPropagation()}
          role="menu"
        >
          <div className="fab-panel-header">
            <div className="fab-panel-title">
              <span style={{ color: '#38bdf8' }}>🏥</span>
              <span>IVA Navigering & Hubbar</span>
            </div>
            <div className="fab-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsEditingLayout((prev) => !prev)}
                style={{
                  border: isEditingLayout ? '1px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)',
                  background: isEditingLayout ? '#0284c7' : 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontSize: '0.73rem',
                  fontWeight: 700,
                  padding: '0.32rem 0.65rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
                title="Flytta runt och redigera innehållet i menyn"
              >
                <span>{isEditingLayout ? '✓ Klar' : '✏️ Redigera'}</span>
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
                  🤖
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

          {isEditingLayout && (
            <div
              style={{
                background: 'rgba(2, 132, 199, 0.2)',
                border: '1px solid rgba(56, 189, 248, 0.45)',
                borderRadius: '10px',
                padding: '0.55rem 0.75rem',
                marginBottom: '0.75rem',
                fontSize: '0.74rem',
                color: '#e0f2fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <span>
                Använd pilarna <strong>← / →</strong> (eller dra & släpp) för att ändra ordning i menyn.
              </span>
              <button
                type="button"
                onClick={handleResetLayout}
                style={{
                  border: '1px solid rgba(255,255,255,0.3)',
                  background: 'rgba(15, 23, 42, 0.7)',
                  color: '#ffffff',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
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
