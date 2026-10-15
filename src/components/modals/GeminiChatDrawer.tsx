import React, { useState, useEffect, useRef } from 'react';
import { DocumentItem } from '../../types';
import { compileClinicalContext, generateLocalExpertResponse } from '../../data/geminiKnowledge';
import { SparklesIcon } from '../Icons';

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
}

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  documents,
  initialPrompt = '',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('iva_gemini_chat_history');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [
      {
        id: 'welcome',
        role: 'assistant',
        text: `Hej! Jag är **Gemini IVA-Assistenten** för Intensivvårdsenheten Östra.\n\nJag har full tillgång till sjukhusets alla styrande PM, spädningsregister, CVK-blandbarhet, syra-baskalkylatorer, ROSE-vätsketerapi och Servo-U manualer.\n\nVad kan jag hjälpa dig med under passet?`,
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
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  const saveMessages = (msgs: ChatMessage[]) => {
    setMessages(msgs);
    try {
      localStorage.setItem('iva_gemini_chat_history', JSON.stringify(msgs.slice(-30)));
    } catch (e) {}
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputVal;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMsgs = [...messages, userMsg];
    saveMessages(newMsgs);
    setInputVal('');
    setLoading(true);

    const clinicalContext = compileClinicalContext(documents);

    try {
      // 1. Prova backend Gemini proxy
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg.text,
          context: clinicalContext,
          history: newMsgs.slice(-6),
        }),
      });

      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.text) {
          const aiMsg: ChatMessage = {
            id: 'ai-' + Date.now(),
            role: 'assistant',
            text: data.text,
            timestamp: new Date().toISOString(),
          };
          saveMessages([...newMsgs, aiMsg]);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend Gemini anrop misslyckades, använder expert IVA offline-motor:', e);
    }

    // 2. Intelligent lokal expert IVA-motor fallback
    const offlineReply = generateLocalExpertResponse(userMsg.text);
    const aiMsg: ChatMessage = {
      id: 'ai-' + Date.now(),
      role: 'assistant',
      text: offlineReply,
      timestamp: new Date().toISOString(),
    };
    saveMessages([...newMsgs, aiMsg]);
    setLoading(false);
  };

  const clearChat = () => {
    const initial: ChatMessage[] = [
      {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        text: `Chatthistoriken rensades. Hur kan jag hjälpa dig?`,
        timestamp: new Date().toISOString(),
      },
    ];
    saveMessages(initial);
  };

  if (!isOpen) return null;

  return (
    <div
      className="gemini-chat-drawer is-open"
      style={{
        zIndex: 1200,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
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
          maxWidth: '520px',
          height: '100%',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 25px rgba(0,0,0,0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1rem 1.25rem',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '10px', display: 'flex' }}>
              <SparklesIcon size={20} />
            </span>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                Gemini IVA-Assistent
              </h2>
              <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                Kliniskt beslutsstöd • Östra sjukhuset
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={clearChat}
              style={{
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '0.3rem 0.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
              title="Rensa chatthistorik"
            >
              Rensa
            </button>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
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

        {/* Snabbvalsförslag */}
        <div style={{ background: '#f8fafc', padding: '0.65rem 1rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '0.35rem', overflowX: 'auto', flexShrink: 0 }}>
          <button
            onClick={() => handleSend('Hur späds Noradrenalin och vad är standardkoncentrationen?')}
            style={{ border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', color: '#1e293b' }}
          >
            💉 Noradrenalin spädning
          </button>
          <button
            onClick={() => handleSend('Kan Furosemid och Noradrenalin gå tillsammans i CVK?')}
            style={{ border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', color: '#1e293b' }}
          >
            ⚡ Furosemid + Noradrenalin?
          </button>
          <button
            onClick={() => handleSend('Vad är kriterierna för bukläge vid ARDS?')}
            style={{ border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '0.72rem', padding: '0.25rem 0.55rem', borderRadius: '9999px', whiteSpace: 'nowrap', cursor: 'pointer', color: '#1e293b' }}
          >
            🫁 Bukläge vid ARDS
          </button>
        </div>

        {/* Meddelandelista */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: isUser ? '#0284c7' : '#f1f5f9',
                    color: isUser ? '#ffffff' : '#0f172a',
                    fontSize: '0.875rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-line',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  {m.text}
                </div>
              </div>
            );
          })}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: '#f1f5f9', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="pulse-dot"></span>
                <span>Gemini tänker och analyserar IVA-rutiner...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Inputfält */}
        <div style={{ padding: '0.85rem 1rem', borderTop: '1px solid #e2e8f0', background: '#ffffff', flexShrink: 0 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            <input
              type="text"
              placeholder="Fråga om läkemedel, syra-bas, respirator..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              style={{
                flex: 1,
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              style={{
                background: '#4f46e5',
                color: '#ffffff',
                border: 'none',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: loading || !inputVal.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !inputVal.trim() ? 0.6 : 1,
              }}
            >
              Skicka
            </button>
          </form>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.4rem' }}>
            Kliniskt beslutsstöd. Medicinska ordinationer beslutas alltid av patientansvarig läkare.
          </div>
        </div>
      </div>
    </div>
  );
};
