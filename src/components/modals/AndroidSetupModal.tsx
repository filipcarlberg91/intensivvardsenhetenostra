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
  const [showBuildDetails, setShowBuildDetails] = useState(false);

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
          maxWidth: '620px',
          maxHeight: '90vh',
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
                Android-App, Kamera & Notiser
              </h2>
              <p style={{ margin: 0, fontSize: '0.76rem', color: '#bae6fd' }}>
                Enhetsbehörigheter, bakgrundslarm, kameraskanning & installation
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
          {/* 1. INSTALLERA SOM ANDROID-APP */}
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '14px',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📲</span>
                <strong style={{ fontSize: '0.95rem', color: '#0c4a6e' }}>
                  {isInstalled ? 'Installerad som App (Standalone)' : 'Installera som Android-App'}
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#0369a1', lineHeight: 1.4 }}>
                {isInstalled
                  ? 'Appen körs i fullskärmsläge som en native Android-app med offline-stöd.'
                  : 'Installera direkt på hemskärmen i Android för helskärmsläge, offline-PM och systemnotiser.'}
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
                    padding: '0.6rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                  }}
                >
                  📥 Installera Android-App
                </button>
              ) : (
                <span
                  style={{
                    background: '#e0f2fe',
                    color: '#0369a1',
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'inline-block',
                  }}
                >
                  {isIOS
                    ? 'iOS: Tryck Dela → Lägg till på hemskärmen'
                    : isAndroid
                    ? 'Android Chrome: Meny (⋮) → Installera app'
                    : 'Öppna i Chrome på Android för 1-klicksinstallation'}
                </span>
              )}
            </div>
          </div>

          {/* 2. KAMERA-BEHÖRIGHET & SKANNER */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#ede9fe',
                    color: '#7c3aed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CameraIcon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                    Kamera & Bildskanning (Blodgas OCR & Gemini Notebook)
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
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
                        ? '✕ Blockerad i webbläsaren'
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
                    padding: '0.5rem 0.85rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
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
                    padding: '0.5rem 0.85rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  📸 Öppna Kameraskanner
                </button>
              </div>
            </div>
          </div>

          {/* 3. NOTISER, LJUDLARM & VIBRATION PÅ ANDROID */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#fef3c7',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BellIcon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                    Notiser, Infusionslarm & Haptisk Vibration
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
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
                      padding: '0.5rem 0.85rem',
                      borderRadius: '9px',
                      fontWeight: 700,
                      fontSize: '0.8rem',
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
                    padding: '0.5rem 0.85rem',
                    borderRadius: '9px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  🔊 Testa Android-Larm & Notis
                </button>
              </div>
            </div>
          </div>

          {/* 4. HÅLL SKÄRMEN VAKEN (SCREEN WAKE LOCK) */}
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '0.9rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                💡 Håll skärmen vaken på sal (Android Wake Lock)
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
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
                padding: '0.5rem 0.9rem',
                borderRadius: '9px',
                fontWeight: 800,
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {wakeLockActive ? '✓ Skärm hålls vaken' : 'Aktivera Wake Lock'}
            </button>
          </div>

          {/* 5. CAPACITOR / APK KONFIGURATION FÖR ANDROID STUDIO */}
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setShowBuildDetails((prev) => !prev)}
              style={{
                width: '100%',
                background: '#f1f5f9',
                border: 'none',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '0.82rem',
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <span>📦 Förberedd för Android APK / Capacitor / PWABuilder (Visa detaljer)</span>
              <span>{showBuildDetails ? '▲' : '▼'}</span>
            </button>

            {showBuildDetails && (
              <div style={{ padding: '0.9rem 1rem', background: '#0f172a', color: '#e2e8f0', fontSize: '0.76rem', lineHeight: 1.5 }}>
                <div style={{ marginBottom: '0.5rem', color: '#38bdf8', fontWeight: 700 }}>
                  Appen har nu komplett konfiguration (`capacitor.config.json`, `manifest.json` & `sw.js`) med behörigheter för:
                </div>
                <ul style={{ margin: '0 0 0.75rem 1.1rem', padding: 0 }}>
                  <li><code>android.permission.CAMERA</code> (Blodgas OCR & Notebook-foton)</li>
                  <li><code>android.permission.POST_NOTIFICATIONS</code> (Infusionsslut & Medicintider)</li>
                  <li><code>android.permission.VIBRATE</code> & <code>WAKE_LOCK</code></li>
                </ul>
                <div style={{ background: '#020617', padding: '0.6rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#a5f3fc' }}>
                  # Bygga APK via Capacitor eller PWABuilder:<br />
                  npm run build<br />
                  npx cap add android &amp;&amp; npx cap sync android<br />
                  npx cap open android
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
