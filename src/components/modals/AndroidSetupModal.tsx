import React, { useState, useEffect } from 'react';
import {
  usePWAInstall,
  requestAndroidNotificationPermission,
  sendAndroidNotification,
  playClinicalAlarmSound,
  checkCameraAvailability,
} from '../../utils/androidBridge';
import { CameraIcon, BellIcon } from '../Icons';

interface AndroidSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCameraScanner: () => void;
  onShowToast: (msg: string) => void;
}

const GITHUB_REPO_URL = 'https://github.com/filipcarlberg91/intensivvardsenhetenostra';
const AAB_DOWNLOAD_URL = `${GITHUB_REPO_URL}/releases/latest/download/IVA-Ostra-PlayStore-Test.aab`;
const APK_DOWNLOAD_URL = `${GITHUB_REPO_URL}/releases/latest/download/IVA-Ostra-Direct-Install.apk`;
const PRIVACY_POLICY_URL = 'https://filipcarlberg91.github.io/intensivvardsenhetenostra/privacy-policy.html';

export const AndroidSetupModal: React.FC<AndroidSetupModalProps> = ({
  isOpen,
  onClose,
  onOpenCameraScanner,
  onShowToast,
}) => {
  const { isInstallable, isInstalled, isAndroid, isIOS, installApp } = usePWAInstall();

  const [notifPerm, setNotifPerm] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const [cameraPerm, setCameraPerm] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('prompt');
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [wakeLockRef, setWakeLockRef] = useState<any>(null);
  const [showPlayStoreGuide, setShowPlayStoreGuide] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        setNotifPerm(Notification.permission);
      }
      checkCameraAvailability().then((res) => {
        setCameraPerm(res.permissionState);
      });
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      onShowToast(`${label} kopierad! 📋`);
    });
  };

  const handleEnableNotifications = async () => {
    const res = await requestAndroidNotificationPermission();
    setNotifPerm(res);
    if (res === 'granted') {
      playClinicalAlarmSound();
      await sendAndroidNotification(
        'IVA Östra — Notiser Aktiverade ✅',
        'Android-notiser, ljudlarm och vibration är nu redo för medicintider & infusionsslut!',
        { tag: 'iva-test-notif' }
      );
      onShowToast('Android-notiser och larm aktiverade! 🔔');
    } else if (res === 'denied') {
      onShowToast('Notiser är blockerade i webbläsarens/Androids inställningar.');
    }
  };

  const handleSendTestNotification = async () => {
    playClinicalAlarmSound();
    const ok = await sendAndroidNotification(
      '🔔 Testlarm: Noradrenalin 0.1 mg/ml',
      'Sprutan har 15 min kvar i CVK Brun lumen. Dags att förbereda byte!',
      { tag: 'iva-test-alarm-' + Date.now() }
    );
    if (ok) {
      onShowToast('Testnotis med ljud och vibration skickad till enheten! 📲');
    } else {
      onShowToast('Tillåt notiser först för att se systemnotisen.');
    }
  };

  const handleRequestCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onShowToast('Kamera-API stöds via HTTPS eller installerad Android-app.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      stream.getTracks().forEach((t) => t.stop());
      setCameraPerm('granted');
      onShowToast('Kamerabehörighet godkänd och klar att användas! 📸');
    } catch (err) {
      setCameraPerm('denied');
      onShowToast('Kamerabehörighet nekades eller saknas.');
    }
  };

  const handleToggleWakeLock = async () => {
    if (wakeLockActive && wakeLockRef) {
      try {
        await wakeLockRef.release();
      } catch (e) {}
      setWakeLockRef(null);
      setWakeLockActive(false);
      onShowToast('Skärmlås normalt igen.');
      return;
    }

    if ('wakeLock' in navigator) {
      try {
        const sentinel = await (navigator as any).wakeLock.request('screen');
        setWakeLockRef(sentinel);
        setWakeLockActive(true);
        onShowToast('Skärmen hålls nu vaken under passet (Wake Lock aktiv) 💡');
      } catch (e) {
        onShowToast('Kunde inte aktivera Wake Lock på denna enhet.');
      }
    } else {
      onShowToast('Wake Lock stöds i Android Chrome / installerad app.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay is-open"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '660px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.15rem 1.35rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #0284c7 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.35rem',
              }}
            >
              🤖
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                Android-App, Google Play & Enhetsbehörigheter
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#bae6fd' }}>
                Play Store Testapp (.aab), Direkt-APK, Kamera & Infusionslarm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.2)',
              color: '#ffffff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* 1. GOOGLE PLAY STORE TESTAPP (.AAB) & APK NEDLADDNING */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%)',
              border: '1.5px solid #34d399',
              borderRadius: '16px',
              padding: '1.1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>▶️</span>
                <div>
                  <strong style={{ fontSize: '0.96rem', color: '#065f46', display: 'block' }}>
                    Google Play Store (Intern Testapp) & Signerad APK
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#047857' }}>
                    Automatiskt byggd och signerad i Build Mode (Package ID: <code>com.iva.ostra</code>, minSdk 24, targetSdk 36)
                  </span>
                </div>
              </div>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '999px',
                }}
              >
                PLAY STORE REDO
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              <a
                href={AAB_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: '210px',
                  background: '#059669',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
                }}
              >
                📦 Ladda ner .AAB (För Google Play)
              </a>

              <a
                href={APK_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  minWidth: '210px',
                  background: '#0284c7',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                📲 Ladda ner .APK (Direktinstallation)
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.7rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <a
                href={`${GITHUB_REPO_URL}/actions`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 700, textDecoration: 'underline' }}
              >
                ⚙️ Se live-bygge i GitHub Actions / Releases →
              </a>
              <button
                type="button"
                onClick={() => setShowPlayStoreGuide((p) => !p)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#065f46',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {showPlayStoreGuide ? 'Dölj Play Console-guide ▲' : 'Visa Play Console-guide ▼'}
              </button>
            </div>

            {showPlayStoreGuide && (
              <div
                style={{
                  marginTop: '0.85rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid #a7f3d0',
                  fontSize: '0.78rem',
                  color: '#1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.55rem',
                }}
              >
                <div style={{ fontWeight: 800, color: '#065f46' }}>
                  Så publicerar du som Intern Testapp i Google Play Console (2 minuter):
                </div>
                <ol style={{ margin: 0, paddingLeft: '1.2rem', lineHeight: 1.55, color: '#334155' }}>
                  <li>
                    Öppna <a href="https://play.google.com/console" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', fontWeight: 700 }}>Google Play Console</a> och klicka på <strong>Skapa app</strong> (Appnamn: <em>Intensivvårdsenheten Östra</em>, Språk: <em>Svenska</em>, Typ: <em>App</em>, <em>Gratis</em>).
                  </li>
                  <li>
                    Gå till <strong>Testning → Intern testning (Internal testing)</strong> i vänstermenyn och klicka på <strong>Skapa ny version</strong>.
                  </li>
                  <li>
                    Ladda upp filen <strong><code>IVA-Ostra-PlayStore-Test.aab</code></strong> från knappen ovan och spara/publicera till intern testkanal.
                  </li>
                  <li>
                    Under fliken <strong>Testare</strong>: lägg till din och dina kollegors Gmail-adresser och kopiera inbjudningslänken — appen kan laddas ner direkt via Google Play Store utan väntetid!
                  </li>
                </ol>

                {/* Snabbkopiering för Google Play Console */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '10px',
                    padding: '0.65rem 0.8rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                  }}
                >
                  <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569' }}>
                    📋 Snabbkopiera fält som Google Play Console efterfrågar:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(PRIVACY_POLICY_URL, 'Integritetspolicy-URL')}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '7px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      🔗 Kopiera Integritetspolicy-URL (krävs för Kamera)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          'Kliniska rutiner, PM, spädningstabeller och beräkningsstöd för IVA Östra.',
                          'Kort beskrivning'
                        )
                      }
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '7px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      📝 Kopiera Kort beskrivning
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          'Kliniskt beslutsstöd och kunskapsbank för Intensivvårdsenheten Östra (IVA Östra). Innehåller strukturerade rutiner och PM, läkemedelsspädningar, infusionskalkylator, blodgastolkning med kameraskanning samt Gemini IVA Notebook.',
                          'Fullständig beskrivning'
                        )
                      }
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        borderRadius: '7px',
                        padding: '0.35rem 0.6rem',
                        fontSize: '0.73rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        cursor: 'pointer',
                      }}
                    >
                      📄 Kopiera Fullständig beskrivning
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. INSTALLERA DIREKT FRÅN WEBBLÄSAREN (PWA) */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '14px',
              padding: '0.95rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.05rem' }}>⚡</span>
                <strong style={{ fontSize: '0.9rem', color: '#0c4a6e' }}>
                  {isInstalled ? 'Installerad som App (Standalone)' : 'Snabbinstallation via Chrome (Utan Play Store)'}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#0369a1', lineHeight: 1.4 }}>
                {isInstalled
                  ? 'Appen körs i fullskärmsläge med offline-stöd.'
                  : 'Installera direkt på hemskärmen med 1 klick i väntan på Google Play-länken.'}
              </p>
            </div>
            <div>
              {isInstalled ? (
                <span
                  style={{
                    background: '#dcfce7',
                    color: '#15803d',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  ✓ Redan installerad
                </span>
              ) : isInstallable ? (
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await installApp();
                    if (ok) onShowToast('IVA Östra installerades på enheten! 🎉');
                  }}
                  style={{
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  📥 Installera Direkt
                </button>
              ) : (
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.35rem 0.7rem',
                    borderRadius: '8px',
                    fontSize: '0.73rem',
                    fontWeight: 700,
                    display: 'inline-block',
                  }}
                >
                  {isIOS
                    ? 'iOS: Dela → Lägg till på hemskärmen'
                    : 'Android Chrome: Meny (⋮) → Installera app'}
                </span>
              )}
            </div>
          </div>

          {/* 3. KAMERA-BEHÖRIGHET & SKANNER */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '0.95rem 1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#ede9fe',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CameraIcon size={19} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    Kamera & Bildskanning (Blodgas OCR & Gemini Notebook)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Status:{' '}
                    <strong
                      style={{
                        color:
                          cameraPerm === 'granted'
                            ? '#15803d'
                            : cameraPerm === 'denied'
                            ? '#b91c1c'
                            : '#d97706',
                      }}
                    >
                      {cameraPerm === 'granted'
                        ? '✓ Tillåten & Redo'
                        : cameraPerm === 'denied'
                        ? '✕ Blockerad'
                        : 'Väntar på godkännande'}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleRequestCamera}
                  style={{
                    background: cameraPerm === 'granted' ? '#dcfce7' : '#7c3aed',
                    color: cameraPerm === 'granted' ? '#15803d' : '#ffffff',
                    border: 'none',
                    padding: '0.48rem 0.8rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  {cameraPerm === 'granted' ? '✓ Kamera aktiverad' : 'Tillåt Kamera'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCameraScanner();
                  }}
                  style={{
                    background: '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.48rem 0.8rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  📸 Öppna Kameraskanner
                </button>
              </div>
            </div>
          </div>

          {/* 4. NOTISER, LJUDLARM & VIBRATION PÅ ANDROID */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '0.95rem 1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BellIcon size={19} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    Notiser, Infusionslarm & Haptisk Vibration
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Status:{' '}
                    <strong
                      style={{
                        color:
                          notifPerm === 'granted'
                            ? '#15803d'
                            : notifPerm === 'denied'
                            ? '#b91c1c'
                            : '#d97706',
                      }}
                    >
                      {notifPerm === 'granted'
                        ? '✓ Aktiverade (Service Worker + Ljud + Vibration)'
                        : notifPerm === 'denied'
                        ? '✕ Blockerade'
                        : 'Ej aktiverade ännu'}
                    </strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
                {notifPerm !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleEnableNotifications}
                    style={{
                      background: '#0284c7',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.48rem 0.8rem',
                      borderRadius: '9px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    🔔 Tillåt Notiser
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSendTestNotification}
                  style={{
                    background: '#f1f5f9',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '0.48rem 0.8rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  🔊 Testa Android-Larm & Notis
                </button>
              </div>
            </div>
          </div>

          {/* 5. HÅLL SKÄRMEN VAKEN (SCREEN WAKE LOCK) */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                💡 Håll skärmen vaken på sal (Android Wake Lock)
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                Förhindrar att mobilskärmen slocknar under pågående spädning eller akutlarm.
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleWakeLock}
              style={{
                background: wakeLockActive ? '#10b981' : '#e2e8f0',
                color: wakeLockActive ? '#ffffff' : '#334155',
                border: 'none',
                padding: '0.48rem 0.85rem',
                borderRadius: '9px',
                fontWeight: 800,
                fontSize: '0.76rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {wakeLockActive ? '✓ Skärm hålls vaken' : 'Aktivera Wake Lock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
