import React, { useState, useEffect } from 'react';
import {
  DocumentItem,
  UserProfile,
  UserRole,
  AuthorizedEditor,
  NotificationItem,
  ShiftChecklistItem,
} from './types';
import { CATEGORIES, SAMPLE_DOCUMENTS } from './data/sampleDocs';
import { IVA_SHIFT_CHECKLIST } from './data/clinicalData';

// Komponenter
import { Header } from './components/Header';
import { ClinicalSubnav } from './components/ClinicalSubnav';
import { FloatingMenu } from './components/FloatingMenu';

// Vyer
import { HomeView } from './views/HomeView';
import { PainSedationView } from './views/PainSedationView';
import { DiseasesView } from './views/DiseasesView';
import { AcidBaseView } from './views/AcidBaseView';
import { FluidBalanceView } from './views/FluidBalanceView';
import { NutritionView } from './views/NutritionView';
import { DrugsView } from './views/DrugsView';
import { MedicationCatalogView } from './views/MedicationCatalogView';
import { EquipmentView } from './views/EquipmentView';
import { DocumentsView } from './views/DocumentsView';
import { MyPageView } from './views/MyPageView';
import { IVA_DRUGS } from './data/drugsData';

// Modaler
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';
import { GeminiChatDrawer } from './components/modals/GeminiChatDrawer';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';
import { PocketguideModal } from './components/modals/PocketguideModal';
import { ShiftChecklistModal } from './components/modals/ShiftChecklistModal';
import { UploadModal } from './components/modals/UploadModal';
import { LoginModal } from './components/modals/LoginModal';
import { PermissionsModal } from './components/modals/PermissionsModal';
import { MedicationReminderModal } from './components/modals/MedicationReminderModal';

const OWNER_EMAIL = 'filipcarlberg91@gmail.com';

const INITIAL_EDITORS: AuthorizedEditor[] = [
  { email: OWNER_EMAIL, name: 'Filip Carlberg', role: 'OWNER', addedAt: '2026-01-01' },
  { email: 'iva.lakare@vgregion.se', name: 'IVA Specialistläkare', role: 'EDITOR', addedAt: '2026-01-10' },
  { email: 'iva.ssk@vgregion.se', name: 'IVA Specialistsjuksköterska', role: 'EDITOR', addedAt: '2026-01-15' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'upload',
    title: 'Nytt akutprotokoll publicerat',
    docTitle: 'Akut Ventilationssvikt & Ventilator-asynkroni',
    category: 'Respiration',
    docId: 'doc-resp-1',
    timestamp: 'Idag 07:15',
    read: false,
  },
  {
    id: 'notif-2',
    type: 'edit',
    title: 'Uppdaterat doseringsprotokoll',
    docTitle: 'Noradrenalin & Vasopressin Titrering',
    category: 'Circulation',
    docId: 'doc-circ-1',
    timestamp: 'Igår 14:30',
    read: true,
  },
];

export const App: React.FC = () => {
  // Navigation / Aktiv kategori
  const [activeCategory, setActiveCategory] = useState<string>('HOME');

  // Användarens valda ordning på kategorier (Rutiner/PM)
  const [orderedCategories, setOrderedCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('iva_fab_menu_layout_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.categoryIdsOrder) && parsed.categoryIdsOrder.length > 0) {
          const ordered = parsed.categoryIdsOrder
            .map((id: string) => CATEGORIES.find((c) => c.id === id))
            .filter(Boolean);
          const missing = CATEGORIES.filter((c) => !parsed.categoryIdsOrder.includes(c.id));
          return [...ordered, ...missing];
        }
      }
    } catch (e) {}
    return CATEGORIES;
  });

  const handleReorderCategories = (newOrderIds: string[]) => {
    const ordered = newOrderIds
      .map((id) => CATEGORIES.find((c) => c.id === id))
      .filter((c): c is (typeof CATEGORIES)[0] => Boolean(c));
    const missing = CATEGORIES.filter((c) => !newOrderIds.includes(c.id));
    setOrderedCategories([...ordered, ...missing]);
  };

  // Dokument
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const stored = localStorage.getItem('iva_documents');
      if (stored) {
        const parsed: DocumentItem[] = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const sampleIds = new Set(SAMPLE_DOCUMENTS.map((d) => d.id));
          const userUploaded = parsed.filter((d) => !sampleIds.has(d.id));
          return [...SAMPLE_DOCUMENTS, ...userUploaded];
        }
      }
    } catch (e) {}
    return SAMPLE_DOCUMENTS;
  });

  // Användarhantering
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('iva_google_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {
      name: 'Filip Carlberg',
      email: OWNER_EMAIL,
    };
  });

  // Behöriga redaktörer
  const [editors, setEditors] = useState<AuthorizedEditor[]>(() => {
    try {
      const stored = localStorage.getItem('iva_authorized_editors');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_EDITORS;
  });

  // Simulera skrivskyddat läge
  const [simulateReadOnly, setSimulateReadOnly] = useState<boolean>(() => {
    try {
      return localStorage.getItem('iva_simulate_readonly') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Beräkna användarroll
  const getUserRole = (): UserRole => {
    if (!currentUser) return 'VIEWER';
    const email = currentUser.email.toLowerCase();
    if (email === OWNER_EMAIL.toLowerCase()) return 'OWNER';
    const match = editors.find((ed) => ed.email.toLowerCase() === email);
    if (match) return match.role;
    return 'VIEWER';
  };

  const userRole = getUserRole();
  const canEdit = !simulateReadOnly && (userRole === 'OWNER' || userRole === 'EDITOR');
  const isOwnerOrEditor = userRole === 'OWNER' || userRole === 'EDITOR';

  // Favoriter (PM & Dokument)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const userKey = currentUser ? `iva_favorites_${currentUser.email}` : 'iva_favorites_guest';
      const stored = localStorage.getItem(userKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return ['doc-resp-1', 'doc-circ-1', 'doc-crrt-1'];
  });

  // Favoritläkemedel
  const [favoriteDrugs, setFavoriteDrugs] = useState<string[]>(() => {
    try {
      const userKey = currentUser ? `iva_fav_drugs_${currentUser.email}` : 'iva_fav_drugs_guest';
      const stored = localStorage.getItem(userKey);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return ['noradrenalin', 'propofol', 'remifentanil', 'furosemid'];
  });

  const [selectedCalculatorDrugId, setSelectedCalculatorDrugId] = useState<string | null>(null);

  // Notiser
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem('iva_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  });

  // Arbetspass-checklista
  const [shiftChecklist, setShiftChecklist] = useState<ShiftChecklistItem[]>(() => {
    try {
      const stored = localStorage.getItem('iva_shift_checklist');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return IVA_SHIFT_CHECKLIST;
  });

  // Modaltillstånd
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [pocketguideModalOpen, setPocketguideModalOpen] = useState(false);
  const [geminiChatOpen, setGeminiChatOpen] = useState(false);
  const [geminiInitialPrompt, setGeminiInitialPrompt] = useState('');
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [medicationModalOpen, setMedicationModalOpen] = useState(false);
  const [floatingMenuOpen, setFloatingMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Räkna aktiva medicinpåminnelser med aktiv bakgrundsövervakning
  const [activeReminderCount, setActiveReminderCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('iva_med_reminders');
      if (stored) {
        const list = JSON.parse(stored);
        return Array.isArray(list) ? list.filter((r: any) => !r.completed).length : 0;
      }
    } catch (e) {}
    return 2;
  });

  // Skapa notifikation i notifikationscentret
  const handleCreateNotification = (title: string, desc: string, docId?: string) => {
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type: 'alert',
      title,
      docTitle: desc,
      category: 'Larm',
      docId: docId || '',
      timestamp: 'Just nu',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Global bakgrundsövervakning av medicin- & infusionslarm
  useEffect(() => {
    const checkReminders = () => {
      try {
        const stored = localStorage.getItem('iva_med_reminders');
        if (!stored) return;
        const list = JSON.parse(stored);
        if (!Array.isArray(list)) return;

        const now = Date.now();
        let updated = false;

        list.forEach((rem: any) => {
          if (!rem.completed && !rem.notified && rem.dueTimestamp <= now) {
            rem.notified = true;
            updated = true;

            // 1. Kliniskt varningsljud via Web Audio API
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(587.33, ctx.currentTime);
              osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
              gain.gain.setValueAtTime(0.3, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } catch (e) {}

            // 2. Vibration på mobil
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 300]);
            }

            // 3. Web Notification API
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`IVA Larm: ${rem.name}`, {
                body: `Dags för ${rem.type === 'infusion' ? 'infusionsbyte' : 'läkemedelsadministrering'}! (${rem.location || ''})`,
                icon: '/icon-192.png',
              });
            }

            // 4. Toast & In-App Notification
            showToast(`🔔 IVA Larm: ${rem.name} (${rem.location || 'Dags för byte/dosering'})`);
            handleCreateNotification(
              `Larm: ${rem.name}`,
              `Tid uppnådd för ${rem.name}. Plats: ${rem.location || 'IVA-patient'}. Kontrollera infusion/läkemedel.`
            );
          }
        });

        if (updated) {
          localStorage.setItem('iva_med_reminders', JSON.stringify(list));
        }

        const activeCount = list.filter((r: any) => !r.completed).length;
        setActiveReminderCount(activeCount);
      } catch (e) {}
    };

    const interval = setInterval(checkReminders, 10000);
    checkReminders();
    return () => clearInterval(interval);
  }, []);

  // Spara ändringar i localStorage
  useEffect(() => {
    try {
      localStorage.setItem('iva_documents', JSON.stringify(documents));
    } catch (e) {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_authorized_editors', JSON.stringify(editors));
    } catch (e) {}
  }, [editors]);

  useEffect(() => {
    try {
      const userKey = currentUser ? `iva_favorites_${currentUser.email}` : 'iva_favorites_guest';
      localStorage.setItem(userKey, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites, currentUser]);

  useEffect(() => {
    try {
      const userKey = currentUser ? `iva_fav_drugs_${currentUser.email}` : 'iva_fav_drugs_guest';
      localStorage.setItem(userKey, JSON.stringify(favoriteDrugs));
    } catch (e) {}
  }, [favoriteDrugs, currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_notifications', JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_shift_checklist', JSON.stringify(shiftChecklist));
    } catch (e) {}
  }, [shiftChecklist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Kortkommandon
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setGeminiChatOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSelectedDoc(null);
        setShiftModalOpen(false);
        setPocketguideModalOpen(false);
        setGlobalSearchOpen(false);
        setUploadModalOpen(false);
        setPermissionsModalOpen(false);
        setLoginModalOpen(false);
        setNotifDropdownOpen(false);
        setFloatingMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Favorithantering
  const handleToggleFavorite = (docId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(docId);
      const next = exists ? prev.filter((id) => id !== docId) : [...prev, docId];
      const doc = documents.find((d) => d.id === docId);
      const title = doc ? doc.title : 'Dokumentet';
      showToast(exists ? `Tog bort "${title}" från favoriter` : `Lade till "${title}" i favoriter ⭐`);
      return next;
    });
  };

  const handleToggleFavoriteDrug = (drugId: string) => {
    setFavoriteDrugs((prev) => {
      const exists = prev.includes(drugId);
      const next = exists ? prev.filter((id) => id !== drugId) : [...prev, drugId];
      const drug = IVA_DRUGS.find((d) => d.id === drugId);
      const name = drug ? drug.name : 'Läkemedlet';
      showToast(exists ? `Tog bort "${name}" från favoritläkemedel` : `Lade till "${name}" i favoritläkemedel ⭐`);
      return next;
    });
  };

  // Dokumenthantering
  const handleSaveDoc = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    // Skapa notis
    const newNotif: NotificationItem = {
      id: 'notif-' + Date.now(),
      type: 'upload',
      title: 'Nytt dokument sparat',
      docTitle: newDoc.title,
      category: newDoc.category,
      docId: newDoc.id,
      timestamp: 'Just nu',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Dokumentet "${newDoc.title}" har sparats! 🎉`);
  };

  const handleDeleteDoc = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    setFavorites((prev) => prev.filter((id) => id !== docId));
    if (selectedDoc?.id === docId) setSelectedDoc(null);
    showToast(`Tog bort "${doc?.title || 'Dokumentet'}"`);
  };

  const handleTogglePinDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, isPinned: !d.isPinned } : d))
    );
    showToast('Nålningsstatus uppdaterad 📌');
  };

  // Checklisthantering
  const handleToggleChecklistItem = (id: string) => {
    setShiftChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleUpdateChecklistNote = (id: string, notes: string) => {
    setShiftChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes } : item))
    );
  };

  const handleResetChecklist = () => {
    setShiftChecklist((prev) => prev.map((item) => ({ ...item, checked: false, notes: '' })));
    showToast('Checklistan för arbetspasset har nollställts');
  };

  // Notishantering
  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Alla notiser har markerats som lästa');
  };

  const handleClearAllNotifs = () => {
    setNotifications([]);
    setNotifDropdownOpen(false);
    showToast('Notishistorik rensad');
  };

  const handleOpenNotifDoc = (notifId: string, docId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
    setNotifDropdownOpen(false);
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      setSelectedDoc(doc);
    } else {
      showToast('Kunde inte hitta dokumentet.');
    }
  };

  // Roller & Behörigheter
  const handleAddEditor = (email: string, name: string, role: 'OWNER' | 'EDITOR') => {
    setEditors((prev) => [...prev, { email, name, role, addedAt: new Date().toISOString() }]);
    showToast(`Lade till ${name} (${role === 'OWNER' ? 'Ägare' : 'Redaktör'})! 🛡️`);
  };

  const handleRemoveEditor = (email: string) => {
    setEditors((prev) => prev.filter((ed) => ed.email.toLowerCase() !== email.toLowerCase()));
    showToast(`Tog bort behörighet för ${email}`);
  };

  // Inloggning
  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('iva_google_user', JSON.stringify(user));
    } catch (e) {}
    // Ladda användarens favoriter
    try {
      const storedFavs = localStorage.getItem(`iva_favorites_${user.email}`);
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
    } catch (e) {}
    showToast(`Inloggad som ${user.name}! 🏥`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('iva_google_user');
    } catch (e) {}
    showToast('Du har loggats ut.');
  };

  // Backup exportering & importering
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      documents,
      shiftChecklist,
      editors,
      favorites,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iva_ostra_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Säkerhetskopia har laddats ner! 💾');
  };

  const handleImportBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.documents && Array.isArray(parsed.documents)) {
          setDocuments(parsed.documents);
        }
        if (parsed.shiftChecklist && Array.isArray(parsed.shiftChecklist)) {
          setShiftChecklist(parsed.shiftChecklist);
        }
        if (parsed.favorites && Array.isArray(parsed.favorites)) {
          setFavorites(parsed.favorites);
        }
        if (parsed.editors && Array.isArray(parsed.editors)) {
          setEditors(parsed.editors);
        }
        showToast('Säkerhetskopia har återställts framgångsrikt! ✅');
      } catch (err) {
        showToast('Kunde inte läsa säkerhetskopian. Ogiltig JSON-fil.');
      }
    };
    reader.readAsText(file);
    // Återställ input
    event.target.value = '';
  };

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="app-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast-notifiering */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 9999,
            background: '#0f172a',
            color: '#ffffff',
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              fontSize: '1rem',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Toppheader */}
      <Header
        currentUser={currentUser}
        userRole={userRole}
        favoritesCount={favorites.length}
        unreadNotifsCount={unreadNotifsCount}
        notifications={notifications}
        notifDropdownOpen={notifDropdownOpen}
        onToggleNotifDropdown={() => setNotifDropdownOpen((prev) => !prev)}
        onMarkAllNotifsRead={handleMarkAllNotifsRead}
        onClearAllNotifs={handleClearAllNotifs}
        onOpenNotifDoc={handleOpenNotifDoc}
        onNavigateHome={() => setActiveCategory('HOME')}
        onNavigateMyPage={() => setActiveCategory('MY_PAGE')}
        onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        onOpenGeminiChat={() => {
          setGeminiInitialPrompt('');
          setGeminiChatOpen(true);
        }}
        onOpenLoginModal={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenUploadModal={() => setUploadModalOpen(true)}
        onOpenPermissionsModal={() => setPermissionsModalOpen(true)}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        canEdit={canEdit}
        isOwnerOrEditor={isOwnerOrEditor}
      />

      {/* Klinisk sektionsnavigering */}
      <ClinicalSubnav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        favoritesCount={favorites.length}
      />

      {/* Huvudinnehåll / Aktiv Vy */}
      <main className="main-content" style={{ flex: 1, paddingBottom: '5rem' }}>
        {activeCategory === 'HOME' && (
          <HomeView
            documents={documents}
            shiftChecklist={shiftChecklist}
            onOpenShiftModal={() => setShiftModalOpen(true)}
            onOpenPocketguideModal={() => setPocketguideModalOpen(true)}
            onOpenMedicationModal={() => setMedicationModalOpen(true)}
            activeReminderCount={activeReminderCount}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDoc={(doc) => setSelectedDoc(doc)}
            onGlobalSearch={(q) => {
              setGlobalSearchOpen(true);
            }}
            onQuickAskGemini={(prompt) => {
              setGeminiInitialPrompt(prompt);
              setGeminiChatOpen(true);
            }}
          />
        )}

        {activeCategory === 'PAIN_SEDATION' && <PainSedationView />}

        {activeCategory === 'DISEASES' && <DiseasesView />}

        {activeCategory === 'ACID_BASE' && <AcidBaseView />}

        {activeCategory === 'FLUID_BALANCE' && <FluidBalanceView />}

        {activeCategory === 'NUTRITION' && <NutritionView />}

        {activeCategory === 'DRUGS' && (
          <DrugsView
            initialDrugId={selectedCalculatorDrugId}
            favoriteDrugs={favoriteDrugs}
            onToggleFavoriteDrug={handleToggleFavoriteDrug}
            onOpenMedicationCatalog={() => {
              setActiveCategory('Läkemedel');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeCategory === 'Läkemedel' && (
          <MedicationCatalogView
            categories={orderedCategories}
            documents={documents}
            favoriteDrugs={favoriteDrugs}
            onToggleFavoriteDrug={handleToggleFavoriteDrug}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenInCalculator={(drugId) => {
              setSelectedCalculatorDrugId(drugId);
              setActiveCategory('DRUGS');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDoc={(doc) => setSelectedDoc(doc)}
          />
        )}

        {activeCategory === 'EQUIPMENT' && <EquipmentView />}

        {activeCategory === 'MY_PAGE' && (
          <MyPageView
            currentUser={currentUser}
            userRole={userRole}
            favorites={favorites}
            documents={documents}
            onToggleFavorite={handleToggleFavorite}
            onOpenDoc={(doc) => setSelectedDoc(doc)}
            onOpenLoginModal={() => setLoginModalOpen(true)}
            onLogout={handleLogout}
            simulateReadOnly={simulateReadOnly}
            onToggleSimulateReadOnly={() => {
              setSimulateReadOnly((prev) => {
                const next = !prev;
                try {
                  localStorage.setItem('iva_simulate_readonly', String(next));
                } catch (e) {}
                showToast(next ? 'Skrivskyddat läge aktiverat 🔒' : 'Full behörighet återställd ✏️');
                return next;
              });
            }}
          />
        )}

        {/* Om kategorin är en av Rutiner/PM-kategorierna */}
        {[
          'Respiration',
          'Circulation',
          'Nutrition',
          'Nutrition_Docs',
          'CRRT',
          'Elimination',
          'Omvårdnad',
          'Anhöriga',
          'Sedering',
          'Buk',
          'Infektion',
          'Gynekologi',
          'Avslut',
          'Donation',
          'ALL',
        ].includes(activeCategory) && (
          <DocumentsView
            currentCategory={activeCategory}
            categories={orderedCategories}
            documents={documents}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onOpenDoc={(doc) => setSelectedDoc(doc)}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDeleteDoc={handleDeleteDoc}
            onTogglePinDoc={handleTogglePinDoc}
            canEdit={canEdit}
          />
        )}
      </main>

      {/* Flytande snabbmeny & drawer */}
      <FloatingMenu
        isOpen={floatingMenuOpen}
        onToggle={() => setFloatingMenuOpen((prev) => !prev)}
        onClose={() => setFloatingMenuOpen(false)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setFloatingMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        categories={orderedCategories}
        onReorderCategories={handleReorderCategories}
        documents={documents}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        onOpenGlobalSearch={() => setGlobalSearchOpen(true)}
        onOpenUploadModal={() => setUploadModalOpen(true)}
        onOpenGeminiChat={() => {
          setGeminiInitialPrompt('');
          setGeminiChatOpen(true);
        }}
        canEdit={canEdit}
      />

      {/* Modaler */}
      <DocumentViewerModal
        document={selectedDoc}
        isOpen={selectedDoc !== null}
        onClose={() => setSelectedDoc(null)}
        isFavorite={selectedDoc ? favorites.includes(selectedDoc.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />

      <PocketguideModal
        isOpen={pocketguideModalOpen}
        onClose={() => setPocketguideModalOpen(false)}
      />

      <ShiftChecklistModal
        isOpen={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        checklist={shiftChecklist}
        onToggleItem={handleToggleChecklistItem}
        onUpdateNote={handleUpdateChecklistNote}
        onResetChecklist={handleResetChecklist}
      />

      <GlobalSearchModal
        isOpen={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
        documents={documents}
        onOpenDoc={(doc) => setSelectedDoc(doc)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setGlobalSearchOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <GeminiChatDrawer
        isOpen={geminiChatOpen}
        onClose={() => setGeminiChatOpen(false)}
        documents={documents}
        initialPrompt={geminiInitialPrompt}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        categories={CATEGORIES}
        onSaveDoc={handleSaveDoc}
      />

      <PermissionsModal
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
        editors={editors}
        ownerEmail={OWNER_EMAIL}
        onAddEditor={handleAddEditor}
        onRemoveEditor={handleRemoveEditor}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <MedicationReminderModal
        isOpen={medicationModalOpen}
        onClose={() => setMedicationModalOpen(false)}
        onAddNotification={(title, desc) => {
          handleCreateNotification(title, desc);
        }}
      />
    </div>
  );
};
