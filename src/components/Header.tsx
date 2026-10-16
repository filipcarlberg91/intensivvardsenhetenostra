import React, { useState, useRef, useEffect } from 'react';
import { HospitalIcon, SearchIcon, SparklesIcon, BellIcon, GoogleIcon } from './Icons';
import { UserProfile, UserRole, NotificationItem } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  userRole: UserRole;
  favoritesCount: number;
  unreadNotifsCount: number;
  notifications: NotificationItem[];
  notifDropdownOpen: boolean;
  onToggleNotifDropdown: () => void;
  onMarkAllNotifsRead: () => void;
  onClearAllNotifs: () => void;
  onOpenNotifDoc: (notifId: string, docId: string) => void;
  onNavigateHome: () => void;
  onNavigateMyPage: () => void;
  onOpenGlobalSearch: () => void;
  onOpenGeminiChat: () => void;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onOpenUploadModal: () => void;
  onOpenPermissionsModal: () => void;
  onOpenAndroidSetup?: () => void;
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  canEdit: boolean;
  isOwnerOrEditor: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  userRole,
  unreadNotifsCount,
  notifications,
  notifDropdownOpen,
  onToggleNotifDropdown,
  onMarkAllNotifsRead,
  onClearAllNotifs,
  onOpenNotifDoc,
  onNavigateHome,
  onNavigateMyPage,
  onOpenGlobalSearch,
  onOpenGeminiChat,
  onOpenLoginModal,
  onLogout,
  onOpenUploadModal,
  onOpenPermissionsModal,
  onOpenAndroidSetup,
  onExportBackup,
  onImportBackup,
  canEdit,
  isOwnerOrEditor,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(false);
      }
    };
    if (moreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [moreMenuOpen]);

  return (
    <header className="app-header m3-top-app-bar">
      <div className="header-main-bar">
        <div className="header-container">
          {/* Vänster: M3 Expressive Brand Identity (Aldrig kapad till "I...") */}
          <div className="brand-section" onClick={onNavigateHome} title="Gå till Startsidan">
            <div className="brand-logo-icon m3-squircle-logo">
              <HospitalIcon size={22} />
            </div>
            <div className="brand-titles">
              <h1>
                <span className="brand-title-full">Intensivvårdsenheten Östra</span>
                <span className="brand-title-compact">IVA Östra</span>
                <span className="hospital-badge">SU • 343</span>
              </h1>
              <p>Kliniska riktlinjer, rutiner, PM & beräkningar</p>
            </div>
          </div>

          {/* Höger: Adaptiva M3 Expressive Actions */}
          <div className="header-actions">
            {/* Global sökknapp (M3 Tonal Search Pill på tablet/desktop, cirkelknapp på mobil) */}
            <button
              className="global-search-btn m3-tonal-search-trigger"
              onClick={onOpenGlobalSearch}
              title="Sök i alla PM, läkemedel & verktyg (Ctrl+K)"
              aria-label="Sök i appen"
            >
              <SearchIcon size={18} />
              <span className="search-btn-label">Sök PM, läkemedel & verktyg...</span>
              <kbd>Ctrl K</kbd>
            </button>

            {/* Gemini IVA Notebook (M3 Expressive Tertiary Pill) */}
            <button
              className="btn-gemini-ai m3-tertiary-pill-btn"
              onClick={onOpenGeminiChat}
              title="Öppna Gemini IVA Notebook (Ctrl+J)"
              aria-label="Öppna Gemini Notebook"
            >
              <span className="ai-sparkle-dot"></span>
              <SparklesIcon size={17} />
              <span className="gemini-btn-text-full">Gemini Notebook</span>
              <span className="gemini-btn-text-compact">AI</span>
            </button>

            {/* Desktop/Tablet snabba knappar (Döljs på kompakta telefoner och läggs i profil/mer-menyn för ren M3-layout) */}
            {onOpenAndroidSetup && (
              <button
                className="btn-header-secondary btn-icon-compact hide-on-compact"
                onClick={onOpenAndroidSetup}
                title="Android-App, Kamera & Notiser"
              >
                <span style={{ fontSize: '0.95rem' }}>📱</span>
                <span className="btn-compact-text">App & Kamera</span>
              </button>
            )}

            {canEdit && (
              <button
                className="btn-upload-primary btn-upload-compact hide-on-compact"
                onClick={onOpenUploadModal}
                title="Ladda upp nytt PM"
              >
                <span>+</span>
                <span>Nytt PM</span>
              </button>
            )}

            {/* Notiser & Händelser */}
            <div className="notification-center-wrapper">
              <button
                className="btn-notification-trigger m3-icon-btn"
                title="Notiser och larm"
                aria-label="Notiser"
                onClick={onToggleNotifDropdown}
              >
                <BellIcon size={19} />
                {unreadNotifsCount > 0 && (
                  <span className="notification-badge">{unreadNotifsCount}</span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="notification-dropdown m3-expressive-popover">
                  <div className="notification-dropdown-header">
                    <div className="notification-dropdown-title">
                      <strong>Notiser & Kliniska Larm</strong>
                      <span className="notif-count-tag">{unreadNotifsCount} nya</span>
                    </div>
                    <div className="notification-header-actions">
                      <button
                        className="btn-notif-action"
                        onClick={onMarkAllNotifsRead}
                        title="Markera alla som lästa"
                      >
                        Markera lästa
                      </button>
                    </div>
                  </div>

                  <div className="notification-dropdown-list">
                    {notifications.length === 0 ? (
                      <div
                        className="notification-empty"
                        style={{ padding: '1.75rem 1.25rem', textAlign: 'center', color: '#64748b' }}
                      >
                        <BellIcon size={26} />
                        <div style={{ marginTop: '0.5rem', fontWeight: 700, color: '#0f172a' }}>
                          Inga nya notiser
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.25rem 0 0' }}>
                          Infusionslarm och uppdaterade PM visas här.
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`notification-item ${notif.read ? '' : 'unread'}`}
                          onClick={() => onOpenNotifDoc(notif.id, notif.docId)}
                        >
                          <div className={`notif-item-icon ${notif.type}`}>
                            {notif.type === 'upload' ? '📥' : notif.type === 'alert' ? '🔔' : '✏️'}
                          </div>
                          <div className="notif-item-body">
                            <div className="notif-item-title">{notif.docTitle || notif.title}</div>
                            <div className="notif-item-meta">
                              <span className="notif-item-category">{notif.category || 'IVA'}</span>
                              <span>• {notif.timestamp || 'Nyligen'}</span>
                            </div>
                          </div>
                          {!notif.read && <div className="notif-unread-dot" title="Oläst" />}
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="notification-dropdown-footer">
                      <button className="btn-clear-notifs" onClick={onClearAllNotifs}>
                        Rensa historik
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* M3 Expressive Användarprofil & Verktygsmeny */}
            <div className="m3-profile-menu-wrapper" ref={moreMenuRef} style={{ position: 'relative' }}>
              {!currentUser ? (
                <button
                  className="btn-google-login m3-pill-btn"
                  onClick={onOpenLoginModal}
                  title="Logga in"
                >
                  <GoogleIcon size={17} />
                  <span className="hide-on-xs">Logga in</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="user-profile-badge m3-avatar-chip"
                  onClick={() => setMoreMenuOpen((prev) => !prev)}
                  title={`Konto & verktyg (${currentUser.email})`}
                  aria-expanded={moreMenuOpen}
                >
                  <div className="user-avatar-circle">
                    {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text hide-on-compact">
                    {currentUser.name || currentUser.email.split('@')[0]}
                  </span>
                  {userRole === 'OWNER' && (
                    <span className="user-role-tag owner hide-on-medium">Admin</span>
                  )}
                  {userRole === 'EDITOR' && (
                    <span className="user-role-tag editor hide-on-medium">Redaktör</span>
                  )}
                </button>
              )}

              {/* M3 Expressive Dropdown för Profil, Kamera, Nytt PM, Roller & Backup */}
              {moreMenuOpen && (
                <div className="m3-user-dropdown-sheet">
                  {currentUser && (
                    <div className="m3-user-sheet-header">
                      <div className="user-avatar-circle" style={{ width: '40px', height: '40px', fontSize: '1rem' }}>
                        {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {currentUser.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {currentUser.email}
                        </div>
                      </div>
                      <span className="m3-role-chip">
                        {userRole === 'OWNER' ? '👑 Admin' : userRole === 'EDITOR' ? '✏️ Redaktör' : '👁️ Läsare'}
                      </span>
                    </div>
                  )}

                  <div className="m3-sheet-actions-list">
                    <button
                      type="button"
                      className="m3-sheet-item"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        onNavigateMyPage();
                      }}
                    >
                      <span className="m3-sheet-icon">⭐</span>
                      <div className="m3-sheet-text">
                        <strong>Min Sida & Favoriter</strong>
                        <span>Sparade PM, läkemedel & inställningar</span>
                      </div>
                    </button>

                    {onOpenAndroidSetup && (
                      <button
                        type="button"
                        className="m3-sheet-item"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onOpenAndroidSetup();
                        }}
                      >
                        <span className="m3-sheet-icon">📱</span>
                        <div className="m3-sheet-text">
                          <strong>Android-App, Kamera & Notiser</strong>
                          <span>Kameraskanner, larm & Play Store-status</span>
                        </div>
                      </button>
                    )}

                    {canEdit && (
                      <button
                        type="button"
                        className="m3-sheet-item"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onOpenUploadModal();
                        }}
                      >
                        <span className="m3-sheet-icon">➕</span>
                        <div className="m3-sheet-text">
                          <strong>Ladda upp nytt PM / Rutin</strong>
                          <span>Publicera dokument i valfri kategori</span>
                        </div>
                      </button>
                    )}

                    {isOwnerOrEditor && (
                      <button
                        type="button"
                        className="m3-sheet-item"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onOpenPermissionsModal();
                        }}
                      >
                        <span className="m3-sheet-icon">🛡️</span>
                        <div className="m3-sheet-text">
                          <strong>Roller & Behörigheter</strong>
                          <span>Hantera redaktörer och åtkomst</span>
                        </div>
                      </button>
                    )}

                    <button
                      type="button"
                      className="m3-sheet-item"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        onExportBackup();
                      }}
                    >
                      <span className="m3-sheet-icon">💾</span>
                      <div className="m3-sheet-text">
                        <strong>Exportera säkerhetskopia</strong>
                        <span>Ladda ner lokal JSON-backup</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className="m3-sheet-item"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        fileInputRef.current?.click();
                      }}
                    >
                      <span className="m3-sheet-icon">📂</span>
                      <div className="m3-sheet-text">
                        <strong>Importera säkerhetskopia</strong>
                        <span>Återställ sparad JSON-backup</span>
                      </div>
                    </button>

                    {currentUser && (
                      <button
                        type="button"
                        className="m3-sheet-item danger"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onLogout();
                        }}
                      >
                        <span className="m3-sheet-icon">🚪</span>
                        <div className="m3-sheet-text">
                          <strong>Logga ut</strong>
                          <span>Avsluta sessionen</span>
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Återställ backup dold filinput */}
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              style={{ display: 'none' }}
              onChange={onImportBackup}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
