import React, { useState, useEffect, useRef } from 'react';
import { DocumentItem } from '../../types';
import {
  compileClinicalContext,
  generateLocalExpertResponse,
  NotebookCustomSource,
  NotebookNote,
} from '../../data/geminiKnowledge';
import { SparklesIcon, CameraIcon } from '../Icons';
import { CameraScannerModal } from './CameraScannerModal';

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentItem[];
  initialPrompt?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imagePreview?: string;
  studioBadge?: string;
}

const BUILTIN_SOURCE_MODULES = [
  { id: 'PMS', label: 'Styrande Rutiner & Vård-PM', icon: '📄', desc: 'Alla avdelningens PM & protokoll' },
  { id: 'DRUGS', label: 'Läkemedelsregister & Dos/CVK', icon: '💉', desc: '41 läkemedel, spädningar & Y-koppling' },
  { id: 'DISEASES', label: 'Sjukdomstillstånd på IVA', icon: '🩺', desc: '15 intensivvårdstillstånd & åtgärder' },
  { id: 'ACID_BASE', label: 'Syra-Bas & Blodgastolkning', icon: '🧪', desc: 'Radiometer ABL, AG & Winters formel' },
  { id: 'FLUIDS', label: 'Vätsketerapi & ROSE', icon: '💧', desc: 'Kristalloider, kolloider & % Fluid Overload' },
  { id: 'NUTRITION', label: 'ESPEN Nutrition & IVA 343', icon: '🥗', desc: 'Kalorimål, protein & Propofol-avdrag' },
];

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  initialPrompt = '',
}) => {
  const [activeTab, setActiveTab] = useState<'notebook' | 'sources' | 'notes'>('notebook');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Valda inbyggda källmoduler
  const [enabledModules, setEnabledModules] = useState<string[]>(() =>
    BUILTIN_SOURCE_MODULES.map((m) => m.id)
  );

  // Egna källor i Notebooken
  const [customSources, setCustomSources] = useState<NotebookCustomSource[]>(() => {
    try {
      const saved = localStorage.getItem('iva_notebook_custom_sources');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  // Sparade Anteckningar i Notebooken
  const [savedNotes, setSavedNotes] = useState<NotebookNote[]>(() => {
    try {
      const saved = localStorage.getItem('iva_notebook_saved_notes');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'note-default-1',
        title: 'Snabbkomihåg: CVK Inkompatibilitet',
        content: '• Furosemid får ALDRIG gå i samma skänkel som Noradrenalin, Adrenalin eller Amiodaron.\n• Fosfat får ALDRIG gå i samma skänkel som Kalcium.',
        tag: 'Läkemedelssäkerhet',
        createdAt: 'Idag',
        pinned: true,
      },
      {
        id: 'note-default-2',
        title: 'Lungprotektiv Ventilation (ARDS)',
        content: '• Tidalvolym: 6 ml/kg PBW (4–8 ml/kg)\n• Pplat < 30 cmH2O\n• Driving Pressure (ΔP) < 15 cmH2O\n• Bukläge minst 16h/dygn vid PaO2/FiO2 < 20 kPa (< 150 mmHg).',
        tag: 'Respiration',
        createdAt: 'Idag',
        pinned: true,
      },
    ];
  });

  // Formulär för ny egen källa
  const [showAddSourceForm, setShowAddSourceForm] = useState(false);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceContent, setNewSourceContent] = useState('');

  // Formulär för ny egen anteckning
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Klinisk notis');

  // Kamera och bild i chatten
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<'chat' | 'source'>('chat');
  const [attachedImage, setAttachedImage] = useState<{ base64: string; mimeType: string } | null>(null);

  // Audio-uppläsning (Notebook Audio Overview)
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('iva_gemini_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: `Välkommen till **Gemini IVA Notebook** för Intensivvårdsenheten Östra! 📓✨\n\nHär arbetar du precis som i **NotebookLM**:\n• **📚 Källor:** Välj vilka IVA-moduler som ska ingå eller lägg till egna anteckningar & kamerabilder.\n• **✨ Notebook Studio:** Skapa *Sammanfattning*, *Instuderingsfrågor*, *SBAR-rondstöd* eller lyssna på *Audio-översikt* med ett klick.\n• **📌 Anteckningar:** Spara valfritt AI-svar direkt till din personliga anslagstavla.`,
        timestamp: new Date().toISOString(),
      },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setInputVal(initialPrompt);
      setActiveTab('notebook');
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (isOpen && activeTab === 'notebook') {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages, activeTab]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_notebook_custom_sources', JSON.stringify(customSources));
    } catch (e) {}
  }, [customSources]);

  useEffect(() => {
    try {
      localStorage.setItem('iva_notebook_saved_notes', JSON.stringify(savedNotes));
    } catch (e) {}
  }, [savedNotes]);

  // Stoppa eventuell röstuppläsning när fönstret stängs
  useEffect(() => {
    if (!isOpen && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
    }
  }, [isOpen]);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem('iva_gemini_chat_history', JSON.stringify(msgs.slice(-30)));
    } catch (e) {}
  };

  const toggleModuleSource = (modId: string) => {
    setEnabledModules((prev) =>
      prev.includes(modId) ? prev.filter((x) => x !== modId) : [...prev, modId]
    );
  };

  const handleAddCustomSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceTitle.trim() || !newSourceContent.trim()) return;
    const src: NotebookCustomSource = {
      id: 'src-' + Date.now(),
      title: newSourceTitle.trim(),
      type: 'text',
      content: newSourceContent.trim(),
      selected: true,
      createdAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
    };
    setCustomSources((prev) => [src, ...prev]);
    setNewSourceTitle('');
    setNewSourceContent('');
    setShowAddSourceForm(false);
  };

  const handleAddNoteManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
    const note: NotebookNote = {
      id: 'note-' + Date.now(),
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      tag: newNoteTag.trim() || 'Anteckning',
      createdAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
      pinned: true,
    };
    setSavedNotes((prev) => [note, ...prev]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNoteForm(false);
  };

  const handleSaveMessageAsNote = (msg: ChatMessage) => {
    const firstLine = msg.text
      .split('\n')[0]
      .replace(/[#*]/g, '')
      .trim()
      .slice(0, 55);
    const note: NotebookNote = {
      id: 'note-' + Date.now(),
      title: firstLine || 'Sparad insikt från Gemini Notebook',
      content: msg.text,
      tag: msg.studioBadge || 'Notebook AI',
      createdAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
      pinned: true,
    };
    setSavedNotes((prev) => [note, ...prev]);
  };

  const handleSpeakText = (id: string, rawText: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = rawText
      .replace(/[#*`_~]/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'sv-SE';
    utterance.rate = 1.02;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (
    customPrompt?: string,
    studioMode?: 'chat' | 'summary' | 'study_guide' | 'sbar' | 'audio_script',
    studioLabel?: string
  ) => {
    const textToSend = customPrompt !== undefined ? customPrompt : inputVal;
    if (!textToSend.trim() && !studioMode && !attachedImage) return;
    if (loading) return;

    const displayUserText =
      studioLabel ||
      textToSend.trim() ||
      (attachedImage ? '📸 Analysera bifogad kamerabild' : '');

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: displayUserText,
      timestamp: new Date().toISOString(),
      imagePreview: attachedImage?.base64,
      studioBadge: studioLabel,
    };

    const currentImage = attachedImage;
    const newMsgs = [...messages, userMsg];
    saveMessages(newMsgs);
    setInputVal('');
    setAttachedImage(null);
    setLoading(true);
    setActiveTab('notebook');

    const clinicalContext = compileClinicalContext(documents, enabledModules, customSources);

    try {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend.trim() || 'Analysera valda källor och eventuell bifogad bild.',
          context: clinicalContext,
          history: newMsgs.slice(-6),
          imageBase64: currentImage?.base64,
          mimeType: currentImage?.mimeType,
          studioMode: studioMode || 'chat',
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.text) {
          const aiMsgId = 'ai-' + Date.now();
          const aiMsg: ChatMessage = {
            id: aiMsgId,
            role: 'assistant',
            text: data.text,
            timestamp: new Date().toISOString(),
            studioBadge: studioLabel,
          };
          saveMessages([...newMsgs, aiMsg]);
          setLoading(false);

          if (studioMode === 'audio_script') {
            handleSpeakText(aiMsgId, data.text);
          }
          return;
        }
      }
    } catch (e) {
      console.warn('Backend Gemini anrop misslyckades, använder lokal Notebook-motor:', e);
    }

    const offlineReply = generateLocalExpertResponse(textToSend.trim(), studioMode);
    const aiMsgId = 'ai-' + Date.now();
    const aiMsg: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      text: offlineReply,
      timestamp: new Date().toISOString(),
      studioBadge: studioLabel,
    };
    saveMessages([...newMsgs, aiMsg]);
    setLoading(false);

    if (studioMode === 'audio_script') {
      handleSpeakText(aiMsgId, offlineReply);
    }
  };

  const clearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        text: `Notebook-konversationen rensades. Dina valda källor och sparade anteckningar ligger kvar. Vad vill du analysera?`,
        timestamp: new Date().toISOString(),
      },
    ];
    saveMessages(initial);
  };

  const totalActiveSources =
    enabledModules.length + customSources.filter((s) => s.selected).length;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="gemini-chat-drawer is-open"
        style={{
          zIndex: 1200,
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
        onClick={onClose}
      >
        <div
          className="gemini-drawer-panel"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: isExpanded ? '1120px' : '560px',
            height: '100%',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-12px 0 35px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            transition: 'max-width 0.25s ease',
          }}
        >
          {/* 1. NOTEBOOK HEADER */}
          <div
            style={{
              padding: '0.85rem 1.15rem',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 55%, #6d28d9 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  padding: '0.45rem',
                  borderRadius: '11px',
                  display: 'flex',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                <SparklesIcon size={20} />
              </span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                    Gemini IVA Notebook
                  </h2>
                  <span
                    style={{
                      background: 'rgba(56, 189, 248, 0.25)',
                      border: '1px solid rgba(56, 189, 248, 0.5)',
                      color: '#e0f2fe',
                      fontSize: '0.66rem',
                      fontWeight: 800,
                      padding: '0.1rem 0.45rem',
                      borderRadius: '6px',
                      textTransform: 'uppercase',
                    }}
                  >
                    NotebookLM-läge
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#c7d2fe' }}>
                  {totalActiveSources} aktiva källor • {savedNotes.length} sparade anteckningar
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                style={{
                  border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.32rem 0.6rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                title="Växla bred Notebook-vy"
              >
                {isExpanded ? '⤡ Kompakt' : '⤢ Bred vy'}
              </button>

              <button
                type="button"
                onClick={clearChat}
                style={{
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.12)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.32rem 0.6rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
                title="Rensa chatt"
              >
                Rensa
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  border: 'none',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 2. FLIKVAL FÖR NOTEBOOK (KÄLLOR / CHATT & STUDIO / ANTECKNINGAR) */}
          <div
            style={{
              display: 'flex',
              background: '#ffffff',
              borderBottom: '1px solid #e2e8f0',
              padding: '0.35rem 0.75rem',
              gap: '0.4rem',
              flexShrink: 0,
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('notebook')}
              style={{
                flex: 1,
                padding: '0.5rem 0.65rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'notebook' ? '#eef2ff' : 'transparent',
                color: activeTab === 'notebook' ? '#4338ca' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>💬</span>
              <span>Notebook & Studio</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sources')}
              style={{
                flex: 1,
                padding: '0.5rem 0.65rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'sources' ? '#eef2ff' : 'transparent',
                color: activeTab === 'sources' ? '#4338ca' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>📚</span>
              <span>Källor ({totalActiveSources})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              style={{
                flex: 1,
                padding: '0.5rem 0.65rem',
                borderRadius: '9px',
                border: 'none',
                background: activeTab === 'notes' ? '#eef2ff' : 'transparent',
                color: activeTab === 'notes' ? '#4338ca' : '#64748b',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
              }}
            >
              <span>📌</span>
              <span>Anteckningar ({savedNotes.length})</span>
            </button>
          </div>

          {/* 3. HUVUDYTA */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* VY A: KÄLLOR (SOURCES) */}
            {activeTab === 'sources' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        📚 Inbyggda IVA-Källor
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                        Välj vilka kunskapsområden Gemini Notebook ska basera sina svar på
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => setEnabledModules(BUILTIN_SOURCE_MODULES.map((m) => m.id))}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Markera alla
                      </button>
                      <button
                        type="button"
                        onClick={() => setEnabledModules([])}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#f8fafc',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        Avmarkera
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '0.55rem' }}>
                    {BUILTIN_SOURCE_MODULES.map((mod) => {
                      const checked = enabledModules.includes(mod.id);
                      return (
                        <div
                          key={mod.id}
                          onClick={() => toggleModuleSource(mod.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.65rem 0.8rem',
                            borderRadius: '10px',
                            border: checked ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                            background: checked ? '#eef2ff' : '#f8fafc',
                            cursor: 'pointer',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {}}
                            style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                          />
                          <span style={{ fontSize: '1.2rem' }}>{mod.icon}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                              {mod.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{mod.desc}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* EGNA KÄLLOR & KAMERASKANNING */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                        ➕ Egna Källor, Labbvärden & Kamerabilder
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>
                        Lägg in egna patientdata, rondsammanfattning eller fota med kameran
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddSourceForm((prev) => !prev)}
                        style={{
                          background: '#4f46e5',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.42rem 0.75rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                        }}
                      >
                        + Lägg till textkälla
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCameraTarget('source');
                          setCameraModalOpen(true);
                        }}
                        style={{
                          background: '#0284c7',
                          color: '#ffffff',
                          border: 'none',
                          padding: '0.42rem 0.75rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.76rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <CameraIcon size={14} />
                        <span>Fota källa</span>
                      </button>
                    </div>
                  </div>

                  {showAddSourceForm && (
                    <form
                      onSubmit={handleAddCustomSource}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        borderRadius: '10px',
                        padding: '0.85rem',
                        marginBottom: '0.85rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.55rem',
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Titel på källa (t.ex. Sal 4 Blodgas & Värden, eller Eget PM)..."
                        value={newSourceTitle}
                        onChange={(e) => setNewSourceTitle(e.target.value)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.84rem',
                        }}
                      />
                      <textarea
                        rows={4}
                        placeholder="Klistra in text, labbsvar, respiratorinställningar eller anteckningar som Gemini Notebook ska använda som källa..."
                        value={newSourceContent}
                        onChange={(e) => setNewSourceContent(e.target.value)}
                        style={{
                          padding: '0.55rem 0.75rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.84rem',
                          fontFamily: 'inherit',
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                        <button
                          type="button"
                          onClick={() => setShowAddSourceForm(false)}
                          style={{
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          Avbryt
                        </button>
                        <button
                          type="submit"
                          style={{
                            border: 'none',
                            background: '#4f46e5',
                            color: '#ffffff',
                            padding: '0.4rem 0.85rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                          }}
                        >
                          Spara källa
                        </button>
                      </div>
                    </form>
                  )}

                  {customSources.length === 0 ? (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '1.25rem',
                        color: '#64748b',
                        fontSize: '0.8rem',
                        background: '#f8fafc',
                        borderRadius: '10px',
                      }}
                    >
                      Inga egna källor tillagda ännu. Klicka på <strong>+ Lägg till textkälla</strong> eller{' '}
                      <strong>Fota källa</strong> för att lägga in eget material i Notebooken.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {customSources.map((src) => (
                        <div
                          key={src.id}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '0.65rem',
                            padding: '0.7rem 0.85rem',
                            borderRadius: '10px',
                            border: src.selected ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                            background: src.selected ? '#f0f9ff' : '#f8fafc',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.6rem', flex: 1 }}>
                            <input
                              type="checkbox"
                              checked={src.selected}
                              onChange={() =>
                                setCustomSources((prev) =>
                                  prev.map((x) => (x.id === src.id ? { ...x, selected: !x.selected } : x))
                                )
                              }
                              style={{ marginTop: '0.2rem', accentColor: '#0284c7' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a' }}>
                                {src.title}{' '}
                                <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                                  ({src.createdAt})
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: '0.76rem',
                                  color: '#334155',
                                  marginTop: '0.2rem',
                                  whiteSpace: 'pre-line',
                                }}
                              >
                                {src.content}
                              </div>
                              {src.imageBase64 && (
                                <img
                                  src={src.imageBase64}
                                  alt={src.title}
                                  style={{
                                    marginTop: '0.4rem',
                                    maxHeight: '90px',
                                    borderRadius: '8px',
                                    border: '1px solid #cbd5e1',
                                  }}
                                />
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCustomSources((prev) => prev.filter((x) => x.id !== src.id))
                            }
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#ef4444',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                            }}
                            title="Ta bort källa"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VY B: ANTECKNINGAR (NOTES PINBOARD) */}
            {activeTab === 'notes' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      📌 Sparade Anteckningar & Kliniska Kort
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                      Spara svar från chatten med ett klick eller skriv egna minnesanteckningar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddNoteForm((prev) => !prev)}
                    style={{
                      background: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.45rem 0.85rem',
                      borderRadius: '9px',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                    }}
                  >
                    + Ny anteckning
                  </button>
                </div>

                {showAddNoteForm && (
                  <form
                    onSubmit={handleAddNoteManual}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '12px',
                      padding: '0.9rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.55rem',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Rubrik på anteckning..."
                        value={newNoteTitle}
                        onChange={(e) => setNewNoteTitle(e.target.value)}
                        style={{
                          flex: 2,
                          minWidth: '180px',
                          padding: '0.5rem 0.7rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.84rem',
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Kategori/Tagg"
                        value={newNoteTag}
                        onChange={(e) => setNewNoteTag(e.target.value)}
                        style={{
                          flex: 1,
                          minWidth: '120px',
                          padding: '0.5rem 0.7rem',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.84rem',
                        }}
                      />
                    </div>
                    <textarea
                      rows={4}
                      placeholder="Skriv din anteckning här..."
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      style={{
                        padding: '0.55rem 0.7rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.84rem',
                        fontFamily: 'inherit',
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => setShowAddNoteForm(false)}
                        style={{
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          padding: '0.4rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Avbryt
                      </button>
                      <button
                        type="submit"
                        style={{
                          border: 'none',
                          background: '#4f46e5',
                          color: '#ffffff',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        Spara anteckning
                      </button>
                    </div>
                  </form>
                )}

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {savedNotes.map((note) => (
                    <div
                      key={note.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderTop: '4px solid #4f46e5',
                        borderRadius: '12px',
                        padding: '0.9rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.6rem',
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.4rem',
                            marginBottom: '0.35rem',
                          }}
                        >
                          <span
                            style={{
                              background: '#eef2ff',
                              color: '#4338ca',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '0.15rem 0.45rem',
                              borderRadius: '5px',
                            }}
                          >
                            {note.tag}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                            {note.createdAt}
                          </span>
                        </div>
                        <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                          {note.title}
                        </h4>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#334155',
                            lineHeight: 1.45,
                            whiteSpace: 'pre-line',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {note.content}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '0.45rem',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleSpeakText(note.id, `${note.title}. ${note.content}`)}
                          style={{
                            border: 'none',
                            background: speakingId === note.id ? '#fef3c7' : '#f8fafc',
                            color: speakingId === note.id ? '#b45309' : '#475569',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '0.25rem 0.55rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          {speakingId === note.id ? '⏹ Stoppa ljud' : '🔊 Lyssna'}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSavedNotes((prev) => prev.filter((x) => x.id !== note.id))
                          }
                          style={{
                            border: 'none',
                            background: 'transparent',
                            color: '#94a3b8',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                          }}
                          title="Ta bort anteckning"
                        >
                          Ta bort
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VY C: NOTEBOOK & STUDIO (CHATT + STUDIO ACTIONS) */}
            {activeTab === 'notebook' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* NOTEBOOK STUDIO VERKTYGSFÄLT */}
                <div
                  style={{
                    background: '#ffffff',
                    padding: '0.65rem 1rem',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#4f46e5',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    <span>✨ Notebook Studio (Generera från {totalActiveSources} valda källor)</span>
                    {speakingId && (
                      <button
                        type="button"
                        onClick={() => {
                          window.speechSynthesis.cancel();
                          setSpeakingId(null);
                        }}
                        style={{
                          border: 'none',
                          background: '#fee2e2',
                          color: '#b91c1c',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                        }}
                      >
                        ⏹ Stoppa Audio
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.15rem' }}>
                    <button
                      type="button"
                      onClick={() =>
                        handleSend('', 'summary', '📋 Skapa Sammanfattning av valda källor')
                      }
                      style={{
                        border: '1px solid #c7d2fe',
                        background: '#eef2ff',
                        color: '#3730a3',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.38rem 0.7rem',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      📋 Sammanfattning
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSend('', 'study_guide', '❓ Generera Instuderingsfrågor & Quiz')
                      }
                      style={{
                        border: '1px solid #ddd6fe',
                        background: '#f5f3ff',
                        color: '#5b21b6',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.38rem 0.7rem',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      ❓ Instuderingsfrågor
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSend('', 'sbar', '🏥 Skapa SBAR Rond- & Överlämningsstöd')
                      }
                      style={{
                        border: '1px solid #bae6fd',
                        background: '#f0f9ff',
                        color: '#0369a1',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.38rem 0.7rem',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      🏥 SBAR Rondstöd
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleSend('', 'audio_script', '🎙️ Audio-Översikt (Muntlig genomgång)')
                      }
                      style={{
                        border: '1px solid #fde68a',
                        background: '#fffbeb',
                        color: '#b45309',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '0.38rem 0.7rem',
                        borderRadius: '8px',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      🎙️ Audio-Översikt
                    </button>
                  </div>
                </div>

                {/* MEDDELANDELISTA */}
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.9rem',
                  }}
                >
                  {messages.map((m) => {
                    const isUser = m.role === 'user';
                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isUser ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            maxWidth: isExpanded ? '82%' : '90%',
                            padding: '0.85rem 1.05rem',
                            borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            background: isUser ? '#4f46e5' : '#ffffff',
                            color: isUser ? '#ffffff' : '#0f172a',
                            border: isUser ? 'none' : '1px solid #e2e8f0',
                            fontSize: '0.875rem',
                            lineHeight: 1.55,
                            whiteSpace: 'pre-line',
                            boxShadow: '0 2px 5px rgba(15, 23, 42, 0.05)',
                          }}
                        >
                          {m.imagePreview && (
                            <img
                              src={m.imagePreview}
                              alt="Bifogad bild"
                              style={{
                                maxHeight: '140px',
                                borderRadius: '8px',
                                marginBottom: '0.5rem',
                                display: 'block',
                              }}
                            />
                          )}
                          {m.text}
                        </div>

                        {/* Verktygsrad under AI-svar: Spara som anteckning, Lyssna, Kopiera */}
                        {!isUser && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '0.4rem',
                              marginTop: '0.3rem',
                              paddingLeft: '0.2rem',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                handleSaveMessageAsNote(m);
                              }}
                              style={{
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                color: '#4338ca',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                              title="Fäst detta svar under Anteckningar i Notebooken"
                            >
                              📌 Spara som anteckning
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSpeakText(m.id, m.text)}
                              style={{
                                border: '1px solid #e2e8f0',
                                background: speakingId === m.id ? '#fef3c7' : '#ffffff',
                                color: speakingId === m.id ? '#b45309' : '#475569',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              {speakingId === m.id ? '⏹ Stoppa' : '🔊 Lyssna'}
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(m.text);
                              }}
                              style={{
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                color: '#64748b',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                              }}
                            >
                              📋 Kopiera
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid #e2e8f0',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          fontSize: '0.84rem',
                          color: '#4338ca',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <span className="pulse-dot"></span>
                        <span>Gemini Notebook syntetiserar dina valda IVA-källor...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* BIFOGAD BILD FÖRHANDSVISNING */}
                {attachedImage && (
                  <div
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#eef2ff',
                      borderTop: '1px solid #c7d2fe',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img
                        src={attachedImage.base64}
                        alt="Vald bild"
                        style={{ height: '38px', borderRadius: '6px', border: '1px solid #818cf8' }}
                      />
                      <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#3730a3' }}>
                        📸 Kamerabild redo att analyseras i Notebooken
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachedImage(null)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#ef4444',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* INMATNINGSFÄLT MED KAMERA-KNAPP */}
                <div
                  style={{
                    padding: '0.85rem 1rem',
                    borderTop: '1px solid #e2e8f0',
                    background: '#ffffff',
                    flexShrink: 0,
                  }}
                >
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCameraTarget('chat');
                        setCameraModalOpen(true);
                      }}
                      style={{
                        background: '#f1f5f9',
                        color: '#0284c7',
                        border: '1px solid #cbd5e1',
                        padding: '0.65rem 0.75rem',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      title="Ta bild med kameran (blodgas, sprutpump, PM) och fråga Notebook"
                    >
                      <CameraIcon size={18} />
                    </button>

                    <input
                      type="text"
                      placeholder="Fråga Notebook om dina källor, läkemedel, PM eller bifoga kamerabild..."
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.85rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                      }}
                    />

                    <button
                      type="submit"
                      disabled={loading || (!inputVal.trim() && !attachedImage)}
                      style={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.65rem 1.1rem',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor:
                          loading || (!inputVal.trim() && !attachedImage)
                            ? 'not-allowed'
                            : 'pointer',
                        opacity: loading || (!inputVal.trim() && !attachedImage) ? 0.6 : 1,
                      }}
                    >
                      Fråga
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Kameraskanner för att fota till Notebook-källa eller direkt i chatten */}
      <CameraScannerModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        title="Fota till Gemini IVA Notebook"
        subtitle="Ta bild av blodgas, respirator, sprutpump eller PM för direkt AI-analys"
        onCaptureImage={(base64, mimeType) => {
          if (cameraTarget === 'source') {
            const src: NotebookCustomSource = {
              id: 'src-img-' + Date.now(),
              title: 'Kamerabild (' + new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }) + ')',
              type: 'image',
              content: 'Kamerabild inläst i Notebooken.',
              imageBase64: base64,
              mimeType,
              selected: true,
              createdAt: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }),
            };
            setCustomSources((prev) => [src, ...prev]);
            setAttachedImage({ base64, mimeType });
            setActiveTab('notebook');
          } else {
            setAttachedImage({ base64, mimeType });
            setActiveTab('notebook');
          }
        }}
      />
    </>
  );
};
