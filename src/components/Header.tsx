import React from 'react';
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
  onExportBackup: () => void;
  onImportBackup: (event: React.ChangeEvent<HTMLInputElement>) => void;
  canEdit: boolean;
  isOwnerOrEditor: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  userRole,
  favoritesCount,
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
  onExportBackup,
  onImportBackup,
  canEdit,
  isOwnerOrEditor,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <header className="app-header">
      <div className="header-main-bar">
        <div className="header-container">
          {/* Vänster: Avdelningslogotyp & Titel */}
          <div className="brand-section" onClick={onNavigateHome} title="Gå till Startsidan">
            <div className="brand-logo-icon">
              <HospitalIcon size={24} />
            </div>
            <div className="brand-titles">
              <h1>
                Intensivvårdsenheten Östra <span className="hospital-badge">IVA</span>
              </h1>
              <p>Kliniska riktlinjer, rutiner, PM och protokoll</p>
            </div>
          </div>

          {/* Höger: Sök, Gemini AI, Notiser, Profil & Snabbknappar */}
          <div className="header-actions">
            {/* Global sökknapp */}
            <button className="global-search-btn" onClick={onOpenGlobalSearch} title="Sök i alla PM & verktyg (Ctrl+K)">
              <SearchIcon size={16} />
              <span>Sök PM & verktyg...</span>
              <kbd>Ctrl K</kbd>
            </button>

            {/* Gemini AI Assistent knapp */}
            <button className="btn-gemini-ai" onClick={onOpenGeminiChat} title="Fråga Gemini IVA-Assistent (Ctrl+J)">
              <span className="ai-sparkle-dot"></span>
              <SparklesIcon size={16} />
              <span>Fråga Gemini</span>
            </button>

            {/* Notiser & Händelser */}
            <div className="notification-center-wrapper">
              <button
                className="btn-notification-trigger"
                title="Notiser och uppdateringar"
                onClick={onToggleNotifDropdown}
              >
                <BellIcon size={18} />
                {unreadNotifsCount > 0 && (
                  <span className="notification-badge">{unreadNotifsCount}</span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <div className="notification-dropdown-title">
                      <strong>Notiser & Ändringar</strong>
                      <span className="notif-count-tag">{unreadNotifsCount} nya</span>
                    </div>
                    <div className="notification-header-actions">
                      <button className="btn-notif-action" onClick={onMarkAllNotifsRead} title="Markera alla som lästa">
                        Markera lästa
                      </button>
                    </div>
                  </div>

                  <div className="notification-dropdown-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty" style={{ padding: '1.5rem', textAlign: 'center', color: '#64748b' }}>
                        <BellIcon size={24} />
                        <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>Inga notiser ännu</div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0' }}>
                          Notiser visas här när PM laddas upp eller ändras.
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
                            {notif.type === 'upload' ? '📥' : '✏️'}
                          </div>
                          <div className="notif-item-body">
                            <div className="notif-item-title">{notif.docTitle || notif.title}</div>
                            <div className="notif-item-meta">
                              <span className="notif-item-category">{notif.category || 'IVA'}</span>
                              <span>• {notif.type === 'upload' ? 'Nytt PM' : 'Uppdaterat'}</span>
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

            {/* Google inloggning / profil */}
            <div id="headerAuthContainer">
              {!currentUser ? (
                <button className="btn-google-login" onClick={onOpenLoginModal} title="Logga in med Google">
                  <GoogleIcon size={18} />
                  <span>Logga in</span>
                </button>
              ) : (
                <div
                  className="user-profile-badge"
                  onClick={onNavigateMyPage}
                  title={`Inloggad som ${currentUser.email}`}
                >
                  <div className="user-avatar-circle">
                    {(currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text">{currentUser.name || currentUser.email.split('@')[0]}</span>
                  {userRole === 'OWNER' && <span className="user-role-tag owner">👑 Admin</span>}
                  {userRole === 'EDITOR' && <span className="user-role-tag editor">✏️ Redaktör</span>}
                  {userRole === 'VIEWER' && <span className="user-role-tag reader">👁️ Läsare</span>}
                  <button
                    className="btn-user-logout"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogout();
                    }}
                    title="Logga ut"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Ladda upp nytt dokument */}
            {canEdit && (
              <button
                className="btn-upload-primary btn-upload-compact"
                onClick={onOpenUploadModal}
                title="Ladda upp nytt PM"
              >
                <span>+</span>
                <span>Nytt PM</span>
              </button>
            )}

            {/* Roller & Behörigheter */}
            {isOwnerOrEditor && (
              <button
                className="btn-header-secondary btn-icon-compact"
                onClick={onOpenPermissionsModal}
                title="Hantera behörigheter & bjud in redaktörer"
              >
                <span style={{ fontSize: '1rem' }}>🛡️</span>
                <span className="btn-compact-text">Roller</span>
              </button>
            )}

            {/* Säkerhetskopia Backup */}
            <button
              className="btn-header-secondary btn-icon-compact"
              onClick={onExportBackup}
              title="Spara säkerhetskopia av data"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>

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
