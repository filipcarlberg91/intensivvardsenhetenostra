import React, { useState, useEffect, useCallback } from 'react';
import { ClockIcon } from '../Icons';

export interface MedicationReminder {
  id: string;
  type: 'infusion' | 'medication' | 'sampling' | 'care';
  name: string;
  targetTime: string; // ISO string or HH:MM
  dueTimestamp: number; // epoch ms
  volumeRemainingMl?: number;
  rateMlH?: number;
  location?: string; // t.ex. CVK Lumen 1 Brun
  notes?: string;
  completed: boolean;
  notified?: boolean;
}

interface MedicationReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotification: (title: string, desc: string) => void;
}

export const MedicationReminderModal: React.FC<MedicationReminderModalProps> = ({
  isOpen,
  onClose,
  onAddNotification,
}) => {
  const [reminders, setReminders] = useState<MedicationReminder[]>(() => {
    try {
      const stored = localStorage.getItem('iva_med_reminders');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    // Standardexempel vid start
    const now = Date.now();
    return [
      {
        id: 'rem-1',
        type: 'infusion',
        name: 'Noradrenalin 40 µg/ml',
        targetTime: new Date(now + 45 * 60000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
        dueTimestamp: now + 45 * 60000,
        volumeRemainingMl: 15,
        rateMlH: 5.0,
        location: 'CVK Brun lumen',
        notes: 'Dra upp ny 50 ml spruta i god tid',
        completed: false,
      },
      {
        id: 'rem-2',
        type: 'medication',
        name: 'Piperacillin/Tazobactam 4g',
        targetTime: new Date(now + 120 * 60000).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
        dueTimestamp: now + 120 * 60000,
        location: 'PVK höger underarm',
        notes: 'Infusionstid 3 timmar',
        completed: false,
      },
    ];
  });

  // Formulär
  const [type, setType] = useState<'infusion' | 'medication' | 'sampling' | 'care'>('infusion');
  const [name, setName] = useState('');
  const [timeChoice, setTimeChoice] = useState<'calc' | 'exact' | 'quick'>('calc');
  const [exactTime, setExactTime] = useState('');
  const [quickMins, setQuickMins] = useState(30);

  // Infusionskalkylator för slut
  const [volRemainingStr, setVolRemainingStr] = useState('20');
  const [rateStr, setRateStr] = useState('5.0');
  const [alertOffsetMins, setAlertOffsetMins] = useState(15); // larma 15 min innan slut

  const [location, setLocation] = useState('CVK');
  const [notes, setNotes] = useState('');
  const [nowTime, setNowTime] = useState(Date.now());

  // Ljud & Notislarm
  const triggerAlarm = useCallback((rem: MedicationReminder) => {
    // 1. Spela ljud via Web Audio API (enkelt kliniskt tvåtonsljud)
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {}

    // 2. Vibration på mobil
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch (e) {}
    }

    // 3. Web Notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`IVA Larm: ${rem.name}`, {
          body: `Dags för ${rem.type === 'infusion' ? 'infusionsbyte' : 'läkemedelsadministrering'}! (${rem.location || ''})`,
          icon: './icon-192.png',
        });
      } catch (e) {}
    }

    // 4. Lägg till i appens notiscenter
    onAddNotification(
      `Påminnelse: ${rem.name}`,
      `Dags för ${rem.type === 'infusion' ? 'infusionsbyte' : 'läkemedel/åtgärd'} vid ${rem.targetTime}. ${rem.notes || ''}`
    );
  }, [onAddNotification]);

  const requestNotificationPermission = useCallback(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  // Klockuppdatering för nedräkning
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(Date.now());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Larmövervakning
  useEffect(() => {
    const checkAlarms = () => {
      const current = Date.now();
      reminders.forEach((rem) => {
        if (!rem.completed && !rem.notified && rem.dueTimestamp <= current) {
          triggerAlarm(rem);
          // Markera som aviserad
          setReminders((prev) =>
            prev.map((r) => (r.id === rem.id ? { ...r, notified: true } : r))
          );
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [reminders, triggerAlarm]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_med_reminders', JSON.stringify(reminders));
    } catch (e) {}
  }, [reminders]);

  // Beräkna återstående tid i minuter från sprutpump
  const vol = parseFloat(volRemainingStr) || 0;
  const rate = parseFloat(rateStr) || 0;
  const hoursRemaining = rate > 0 ? vol / rate : 0;
  const totalMinsRemaining = Math.round(hoursRemaining * 60);

  const calculatedEmptyTime = new Date(Date.now() + totalMinsRemaining * 60000);
  const calculatedAlertTime = new Date(Date.now() + Math.max(1, totalMinsRemaining - alertOffsetMins) * 60000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let dueTime = Date.now();
    let timeLabel = '';

    if (type === 'infusion' && timeChoice === 'calc') {
      dueTime = calculatedAlertTime.getTime();
      timeLabel = calculatedAlertTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } else if (timeChoice === 'quick') {
      dueTime = Date.now() + quickMins * 60000;
      timeLabel = new Date(dueTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    } else if (exactTime) {
      const [h, m] = exactTime.split(':').map((x) => parseInt(x, 10));
      const target = new Date();
      target.setHours(h, m, 0, 0);
      if (target.getTime() < Date.now()) {
        target.setDate(target.getDate() + 1); // imorgon
      }
      dueTime = target.getTime();
      timeLabel = exactTime;
    } else {
      dueTime = Date.now() + 30 * 60000;
      timeLabel = new Date(dueTime).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
    }

    const newReminder: MedicationReminder = {
      id: 'rem-' + Date.now(),
      type,
      name: name.trim(),
      targetTime: timeLabel,
      dueTimestamp: dueTime,
      volumeRemainingMl: type === 'infusion' ? vol : undefined,
      rateMlH: type === 'infusion' ? rate : undefined,
      location: location.trim(),
      notes: notes.trim(),
      completed: false,
    };

    setReminders((prev) => [newReminder, ...prev]);
    setName('');
    setNotes('');

    // Fråga om notisbehörighet om ej godkänd
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleToggleComplete = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
    );
  };

  const handleSnooze = (id: string, mins: number) => {
    setReminders((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const nextTimestamp = Date.now() + mins * 60000;
          return {
            ...r,
            dueTimestamp: nextTimestamp,
            targetTime: new Date(nextTimestamp).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            notified: false,
            completed: false,
          };
        }
        return r;
      })
    );
  };

  const handleDelete = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const activeReminders = reminders.filter((r) => !r.completed);
  const completedReminders = reminders.filter((r) => r.completed);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1100,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.4rem' }}>⏰</span>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Medicintider & Infusionsslut (Påminnelser)
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                Håll koll på när sprutor tar slut och få notislarm vid läkemedelsgivning
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {'Notification' in window && Notification.permission !== 'granted' && (
              <button
                type="button"
                onClick={requestNotificationPermission}
                style={{
                  background: '#fef3c7',
                  color: '#b45309',
                  border: '1px solid #fde68a',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                🔔 Tillåt webbläsarnotiser
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: '#e2e8f0',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                fontWeight: 800,
                color: '#334155',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Innehåll */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Lägg till ny påminnelse / formulär */}
          <form
            onSubmit={handleSubmit}
            style={{
              background: '#f8fafc',
              border: '1.5px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                ➕ Registrera Ny Påminnelse
              </div>

              {/* Typ av påminnelse */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {[
                  { id: 'infusion' as const, label: '💉 Infusionsbyte / Spruta' },
                  { id: 'medication' as const, label: '💊 Läkemedel' },
                  { id: 'sampling' as const, label: '🧪 Provtagning' },
                  { id: 'care' as const, label: '🔄 Omvårdnad' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    style={{
                      padding: '0.3rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: type === t.id ? '#0284c7' : '#ffffff',
                      color: type === t.id ? '#ffffff' : '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Läkemedel / Åtgärd Namn & Snabbval */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Läkemedel / Åtgärd *</label>
              <input
                type="text"
                required
                placeholder={type === 'infusion' ? 't.ex. Noradrenalin 40 µg/ml' : 't.ex. Piperacillin/Tazobactam 4g'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, marginTop: '0.2rem', boxSizing: 'border-box' }}
              />

              {/* Snabbvalsknappar */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Snabbval:</span>
                {['Noradrenalin', 'Propofol', 'Ultiva', 'Dexdor', 'Kaliumdropp', 'Fosfatdropp', 'Insulin', 'Antibiotika', 'Kontrollblodgas'].map((drug) => (
                  <button
                    key={drug}
                    type="button"
                    onClick={() => setName(drug)}
                    style={{
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      color: '#0369a1',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    +{drug}
                  </button>
                ))}
              </div>
            </div>

            {/* Infusionsberäkning (om typ är infusion) */}
            {type === 'infusion' && (
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.5rem' }}>
                  ⏳ Automatisk beräkning av när sprutan tar slut
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Kvarvarande volym (ml)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={volRemainingStr}
                      onChange={(e) => setVolRemainingStr(e.target.value)}
                      placeholder="20"
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Infusionshastighet (ml/h)</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={rateStr}
                      onChange={(e) => setRateStr(e.target.value)}
                      placeholder="5.0"
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 800, fontSize: '0.95rem', background: '#fff', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1' }}>Larma i förväg</label>
                    <select
                      value={alertOffsetMins}
                      onChange={(e) => setAlertOffsetMins(parseInt(e.target.value, 10))}
                      style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #93c5fd', fontWeight: 700, fontSize: '0.85rem', background: '#fff', boxSizing: 'border-box' }}
                    >
                      <option value={15}>15 min innan slut (Rekommenderat)</option>
                      <option value={30}>30 min innan slut</option>
                      <option value={5}>5 min innan slut</option>
                      <option value={0}>Vid exakt sluttid</option>
                    </select>
                  </div>
                </div>

                {rate > 0 && vol > 0 && (
                  <div style={{ marginTop: '0.75rem', background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #bfdbfe', fontSize: '0.8rem', color: '#1e3a8a' }}>
                    Sprutan är helt tom om: <strong>{Math.floor(hoursRemaining)} h {Math.round((hoursRemaining % 1) * 60)} min</strong> (klockan <strong>{calculatedEmptyTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</strong>).<br />
                    Larm sätts klockan: <strong>{calculatedAlertTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</strong> ({alertOffsetMins} min innan slut).
                  </div>
                )}
              </div>
            )}

            {/* Tidsval om ej beräknat */}
            {type !== 'infusion' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Exakt Klockslag (HH:MM)</label>
                  <input
                    type="time"
                    value={exactTime}
                    onChange={(e) => {
                      setExactTime(e.target.value);
                      setTimeChoice('exact');
                    }}
                    style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>eller Snabb-timer</label>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {[15, 30, 60, 120].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setQuickMins(m);
                          setTimeChoice('quick');
                          setExactTime('');
                        }}
                        style={{
                          padding: '0.45rem 0.6rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: timeChoice === 'quick' && quickMins === m ? '#0284c7' : '#ffffff',
                          color: timeChoice === 'quick' && quickMins === m ? '#ffffff' : '#334155',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        +{m} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Infart / Lumen</label>
                <input
                  type="text"
                  placeholder="t.ex. CVK Brun lumen / PVK höger"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>Kommentar / Instruktion</label>
                <input
                  type="text"
                  placeholder="t.ex. Dra upp 40 µg/ml, kontrollera MAP"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                alignSelf: 'flex-start',
                padding: '0.65rem 1.4rem',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(2, 132, 199, 0.25)',
              }}
            >
              🔔 Spara & Aktivera Påminnelse
            </button>
          </form>

          {/* Aktiva påminnelser */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                Aktiva Påminnelser ({activeReminders.length})
              </h3>
            </div>

            {activeReminders.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.85rem' }}>
                Inga aktiva påminnelser just nu. Skapa en ny ovan för att övervaka infusioner och medicintider!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {activeReminders.map((rem) => {
                  const msLeft = rem.dueTimestamp - nowTime;
                  const minsLeft = Math.round(msLeft / 60000);
                  const isOverdue = msLeft < 0;
                  const isUrgent = msLeft >= 0 && minsLeft <= 15;

                  return (
                    <div
                      key={rem.id}
                      style={{
                        background: '#ffffff',
                        border: `1.5px solid ${isOverdue ? '#f87171' : isUrgent ? '#fbbf24' : '#e2e8f0'}`,
                        borderRadius: '12px',
                        padding: '1rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <span style={{ fontSize: '1.6rem' }}>
                          {rem.type === 'infusion' ? '💉' : rem.type === 'medication' ? '💊' : rem.type === 'sampling' ? '🧪' : '🔄'}
                        </span>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{rem.name}</strong>
                            <span style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 700 }}>
                              {rem.location || 'IVA'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                            Klockslag: <strong>{rem.targetTime}</strong>
                            {rem.volumeRemainingMl && rem.rateMlH && (
                              <span> • {rem.volumeRemainingMl} ml kvar ({rem.rateMlH} ml/h)</span>
                            )}
                          </div>

                          {rem.notes && (
                            <div style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.15rem' }}>
                              📝 {rem.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        {/* Nedräkningsbadge */}
                        <span
                          style={{
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            padding: '0.3rem 0.65rem',
                            borderRadius: '999px',
                            background: isOverdue ? '#fee2e2' : isUrgent ? '#fef3c7' : '#e0f2fe',
                            color: isOverdue ? '#b91c1c' : isUrgent ? '#b45309' : '#0369a1',
                          }}
                        >
                          {isOverdue ? `🚨 Försenad ${Math.abs(minsLeft)} min` : `⏳ Om ${minsLeft} min`}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleSnooze(rem.id, 10)}
                          title="Snooza 10 minuter"
                          style={{
                            padding: '0.35rem 0.65rem',
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          💤 +10m
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleComplete(rem.id)}
                          style={{
                            padding: '0.45rem 0.85rem',
                            background: '#16a34a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                          }}
                        >
                          ✓ Bytt / Klart
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(rem.id)}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            fontSize: '1rem',
                            cursor: 'pointer',
                          }}
                          title="Ta bort"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Genomförda påminnelser */}
          {completedReminders.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>
                Genomförda åtgärder under arbetspasset ({completedReminders.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {completedReminders.map((rem) => (
                  <div
                    key={rem.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      opacity: 0.7,
                      fontSize: '0.8rem',
                    }}
                  >
                    <div>
                      <span style={{ textDecoration: 'line-through', fontWeight: 600 }}>{rem.name}</span>
                      <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>({rem.targetTime})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(rem.id)}
                      style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      Ta bort
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
