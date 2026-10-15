import React, { useState, useEffect, useRef } from 'react';
import { CameraIcon } from '../Icons';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onCaptureImage: (base64DataUrl: string, mimeType: string) => void;
}

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({
  isOpen,
  onClose,
  title = 'Kameraskanning (Android / Mobil)',
  subtitle = 'Rikta kameran mot blodgasremsa, respirator, sprutpump eller PM-dokument',
  onCaptureImage,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  };

  const startCamera = async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setCameraError(null);
    setCapturedPreview(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Din webbläsare stödjer inte direkt kameraström. Använd knappen nedan för att ta bild med systemkameran.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      // Kontrollera om ficklampa (torch) stöds på Android-enheten
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack && 'getCapabilities' in videoTrack) {
        try {
          const caps = (videoTrack as unknown as { getCapabilities: () => { torch?: boolean } }).getCapabilities();
          setTorchSupported(Boolean(caps && caps.torch));
        } catch (e) {
          setTorchSupported(false);
        }
      }
    } catch (err: any) {
      setCameraError(
        'Kunde inte starta live-kameran (kontrollera att kamerabehörighet är tillåten i Android/webbläsaren, eller välj "Öppna Systemkamera / Galleri" nedan).'
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
      setCapturedPreview(null);
      setCameraError(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const handleToggleFacingMode = () => {
    const next = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    startCamera(next);
  };

  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;
    try {
      const nextTorch = !torchOn;
      await track.applyConstraints({
        advanced: [{ torch: nextTorch } as unknown as MediaTrackConstraintSet],
      });
      setTorchOn(nextTorch);
    } catch (e) {}
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedPreview(dataUrl);
    stopCamera();
  };

  const handleConfirmCapture = () => {
    if (!capturedPreview) return;
    onCaptureImage(capturedPreview, 'image/jpeg');
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onCaptureImage(base64, file.type || 'image/jpeg');
      onClose();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay is-open"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100005,
        background: 'rgba(15, 23, 42, 0.82)',
        backdropFilter: 'blur(6px)',
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
          maxWidth: '560px',
          background: '#0f172a',
          color: '#f8fafc',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #0284c7 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '0.45rem',
                borderRadius: '10px',
                display: 'flex',
              }}
            >
              <CameraIcon size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>{title}</h3>
              <p style={{ margin: 0, fontSize: '0.73rem', color: '#e0f2fe' }}>{subtitle}</p>
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

        {/* Viewfinder / Preview */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 3',
              background: '#020617',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {capturedPreview ? (
              <img
                src={capturedPreview}
                alt="Tagen bild"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  autoPlay
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: cameraActive ? 'block' : 'none',
                  }}
                />
                {cameraActive && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: '12%',
                      border: '2px dashed rgba(56, 189, 248, 0.75)',
                      borderRadius: '12px',
                      pointerEvents: 'none',
                      boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.25)',
                    }}
                  />
                )}
                {!cameraActive && (
                  <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {cameraError ? (
                      <>
                        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                        <div>{cameraError}</div>
                      </>
                    ) : (
                      <div>Startar kameran...</div>
                    )}
                  </div>
                )}
              </>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>

          {/* Knappar för kamera */}
          {!capturedPreview ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {cameraActive && (
                <>
                  <button
                    type="button"
                    onClick={handleTakeSnapshot}
                    style={{
                      flex: 2,
                      minWidth: '170px',
                      padding: '0.75rem 1.2rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 6px 16px rgba(2, 132, 199, 0.45)',
                    }}
                  >
                    <span>📸</span>
                    <span>Ta bild nu</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#f8fafc',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                    title="Växla mellan bakre och främre kamera"
                  >
                    🔄 Växla kamera
                  </button>

                  {torchSupported && (
                    <button
                      type="button"
                      onClick={handleToggleTorch}
                      style={{
                        padding: '0.75rem 0.9rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(250, 204, 21, 0.4)',
                        background: torchOn ? '#eab308' : 'rgba(255,255,255,0.08)',
                        color: torchOn ? '#0f172a' : '#fef08a',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      🔦 Blixt
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: 1,
                  minWidth: '170px',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  background: 'rgba(14, 165, 233, 0.15)',
                  color: '#bae6fd',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>📱</span>
                <span>Systemkamera / Välj foto</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                ↺ Ta ny bild
              </button>
              <button
                type="button"
                onClick={handleConfirmCapture}
                style={{
                  flex: 2,
                  padding: '0.75rem 1.2rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                ✓ Använd bild & Analysera
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
