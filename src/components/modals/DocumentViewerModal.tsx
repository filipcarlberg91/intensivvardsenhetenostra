import React, { useState } from 'react';
import { DocumentItem } from '../../types';
import { StarIcon } from '../Icons';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
}) => {
  const [fontSize, setFontSize] = useState<number>(17); // px
  const [theme, setTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [lineHeight, setLineHeight] = useState<number>(1.7);

  if (!isOpen || !document) return null;

  const themeStyles = {
    light: { bg: '#ffffff', text: '#0f172a', border: '#e2e8f0', headerBg: '#f8fafc' },
    sepia: { bg: '#fbf0d9', text: '#5f4b32', border: '#ebd5b3', headerBg: '#f4e5c8' },
    dark: { bg: '#0f172a', text: '#f1f5f9', border: '#334155', headerBg: '#1e293b' },
  }[theme];

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1000,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.75)',
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
          background: themeStyles.bg,
          color: themeStyles.text,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '920px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          border: `1px solid ${themeStyles.border}`,
        }}
      >
        {/* Kontrollpanel & Topplist */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderBottom: `1px solid ${themeStyles.border}`,
            background: themeStyles.headerBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.4rem' }}>📄</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ background: '#0284c7', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                  {document.category}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8 }}>
                  {document.priority}
                </span>
              </div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: '0.15rem 0 0', maxWidth: '450px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {document.title}
              </h2>
            </div>
          </div>

          {/* Reader kontroller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Typsnittsstorlek */}
            <div style={{ display: 'flex', background: theme === 'dark' ? '#334155' : '#e2e8f0', borderRadius: '8px', padding: '0.15rem', gap: '0.15rem' }}>
              <button
                onClick={() => setFontSize((s) => Math.max(14, s - 1))}
                style={{ border: 'none', background: 'transparent', padding: '0.2rem 0.5rem', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', color: themeStyles.text }}
                title="Minska textstorlek"
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(26, s + 1))}
                style={{ border: 'none', background: 'transparent', padding: '0.2rem 0.5rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', color: themeStyles.text }}
                title="Öka textstorlek"
              >
                A+
              </button>
            </div>

            {/* Tema: Ljus, Sepia, Mörk */}
            <div style={{ display: 'flex', background: theme === 'dark' ? '#334155' : '#e2e8f0', borderRadius: '8px', padding: '0.15rem', gap: '0.2rem' }}>
              <button
                onClick={() => setTheme('light')}
                style={{ border: 'none', background: theme === 'light' ? '#fff' : 'transparent', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.75rem' }}
                title="Ljust tema"
              >
                ☀️
              </button>
              <button
                onClick={() => setTheme('sepia')}
                style={{ border: 'none', background: theme === 'sepia' ? '#f4e5c8' : 'transparent', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.75rem' }}
                title="Sepia läsläge"
              >
                📜
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{ border: 'none', background: theme === 'dark' ? '#0f172a' : 'transparent', borderRadius: '6px', width: '24px', height: '24px', cursor: 'pointer', fontSize: '0.75rem', color: '#fff' }}
                title="Mörkt tema"
              >
                🌙
              </button>
            </div>

            {/* Favorit */}
            <button
              onClick={() => onToggleFavorite(document.id)}
              style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.3rem' }}
              title={isFavorite ? 'Ta bort favorit' : 'Spara favorit'}
            >
              <StarIcon filled={isFavorite} size={20} />
            </button>

            {/* Ladda ner PDF om tillgänglig */}
            {document.filename && (
              <a
                href={document.filename}
                download={document.filename}
                style={{
                  background: '#0284c7',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                📥 PDF
              </a>
            )}

            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: theme === 'dark' ? '#334155' : '#cbd5e1',
                color: themeStyles.text,
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
        </div>

        {/* Innehåll (Reader Mode) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem 2.5rem',
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          {document.content ? (
            <div
              className="reader-content-body"
              style={{ maxWidth: '820px', margin: '0 auto' }}
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(document.content, theme) }}
            />
          ) : (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{document.title}</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.85, lineHeight: 1.6 }}>{document.description}</p>
              {document.filename && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: themeStyles.headerBg, borderRadius: '12px', border: `1px solid ${themeStyles.border}` }}>
                  <p>Bifogad fil: <strong>{document.filename}</strong></p>
                  <a
                    href={document.filename}
                    download={document.filename}
                    style={{
                      display: 'inline-block',
                      background: '#0284c7',
                      color: '#fff',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Öppna eller ladda ner PDF
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function renderMarkdownToHtml(md: string, theme: 'light' | 'sepia' | 'dark'): string {
  if (!md) return '';

  const isDark = theme === 'dark';
  const borderColor = isDark ? '#334155' : '#e2e8f0';
  const thBg = isDark ? '#1e293b' : '#f1f5f9';
  const codeBg = isDark ? '#1e293b' : '#f1f5f9';
  const codeColor = isDark ? '#38bdf8' : '#0369a1';

  const lines = md.split(/\r?\n/);
  const htmlParts: string[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let inAlert = false;
  let alertType = '';
  let alertLines: string[] = [];
  let inBlockquote = false;
  let quoteLines: string[] = [];
  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, `<code style="background:${codeBg};color:${codeColor};padding:0.15rem 0.4rem;border-radius:5px;font-size:0.9em;font-weight:700;">$1</code>`);
  };

  const flushTable = () => {
    if (!inTable) return;
    let tblHtml = `<div style="overflow-x:auto;margin:1.25rem 0;border:1px solid ${borderColor};border-radius:12px;"><table style="width:100%;border-collapse:collapse;font-size:0.92em;">`;
    if (tableHeaders.length > 0) {
      tblHtml += `<thead><tr style="background:${thBg};border-bottom:2px solid ${borderColor};">` +
        tableHeaders.map((h) => `<th style="padding:0.75rem 0.9rem;text-align:left;font-weight:800;">${h}</th>`).join('') +
        '</tr></thead>';
    }
    tblHtml += '<tbody>';
    tableRows.forEach((row, idx) => {
      const rowBg = idx % 2 === 1 ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(241,245,249,0.5)') : 'transparent';
      tblHtml += `<tr style="border-bottom:1px solid ${borderColor};background:${rowBg};">` +
        row.map((c) => `<td style="padding:0.7rem 0.9rem;vertical-align:top;">${c}</td>`).join('') +
        '</tr>';
    });
    tblHtml += '</tbody></table></div>';
    htmlParts.push(tblHtml);
    inTable = false;
    tableHeaders = [];
    tableRows = [];
  };

  const flushAlert = () => {
    if (!inAlert) return;
    const stylesMap: Record<string, { bg: string; border: string; title: string; color: string }> = {
      important: { bg: isDark ? '#1e1b4b' : '#eff6ff', border: '#3b82f6', title: '💡 Viktigt', color: isDark ? '#93c5fd' : '#1e3a8a' },
      caution: { bg: isDark ? '#450a0a' : '#fef2f2', border: '#ef4444', title: '🚨 Kritisk Säkerhetsföreskrift', color: isDark ? '#fca5a5' : '#991b1b' },
      warning: { bg: isDark ? '#451a03' : '#fffbeb', border: '#f59e0b', title: '⚠️ Varning & Försiktighet', color: isDark ? '#fcd34d' : '#92400e' },
      tip: { bg: isDark ? '#064e3b' : '#ecfdf5', border: '#10b981', title: '✓ Kliniskt Tips', color: isDark ? '#6ee7b7' : '#065f46' },
      note: { bg: isDark ? '#1e293b' : '#f8fafc', border: '#64748b', title: 'ℹ️ Notera', color: isDark ? '#cbd5e1' : '#334155' },
    };
    const st = stylesMap[alertType] || stylesMap.note;
    htmlParts.push(
      `<div style="background:${st.bg};border-left:4px solid ${st.border};color:${st.color};padding:1rem 1.25rem;border-radius:0 12px 12px 0;margin:1.25rem 0;">` +
      `<div style="font-weight:800;font-size:0.85em;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.35rem;">${st.title}</div>` +
      `<div>${alertLines.join('<br/>')}</div></div>`
    );
    inAlert = false;
    alertType = '';
    alertLines = [];
  };

  const flushBlockquote = () => {
    if (!inBlockquote) return;
    htmlParts.push(
      `<div style="background:${thBg};border-left:4px solid #0284c7;padding:0.9rem 1.25rem;border-radius:0 12px 12px 0;margin:1rem 0;font-size:0.95em;">` +
      `${quoteLines.join('<br/>')}</div>`
    );
    inBlockquote = false;
    quoteLines = [];
  };

  const flushList = () => {
    if (!inList) return;
    htmlParts.push(`</${listType}>`);
    inList = false;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Tabellrad
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      flushAlert();
      flushBlockquote();
      const cells = line.split('|').slice(1, -1).map((c) => formatInline(c.trim()));
      if (cells.every((c) => /^:?-+:?$/.test(c))) {
        continue;
      }
      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Alert callout (> [!IMPORTANT] etc.)
    const alertMatch = line.match(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (alertMatch) {
      flushList();
      flushAlert();
      flushBlockquote();
      inAlert = true;
      alertType = alertMatch[1].toLowerCase();
      continue;
    } else if (inAlert && line.startsWith('>')) {
      alertLines.push(formatInline(line.replace(/^>\s*/, '')));
      continue;
    } else if (inAlert) {
      flushAlert();
    }

    // Vanligt citatblock (> ...)
    if (line.startsWith('>')) {
      flushList();
      if (!inBlockquote) {
        inBlockquote = true;
      }
      quoteLines.push(formatInline(line.replace(/^>\s*/, '')));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Punktlista
    if (/^[-*]\s+/.test(line)) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        htmlParts.push('<ul style="margin:0.75rem 0;padding-left:1.5rem;">');
      }
      htmlParts.push(`<li style="margin-bottom:0.4rem;">${formatInline(line.replace(/^[-*]\s+/, ''))}</li>`);
      continue;
    }

    // Numrerad lista
    if (/^\d+\.\s+/.test(line)) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
        htmlParts.push('<ol style="margin:0.75rem 0;padding-left:1.5rem;">');
      }
      htmlParts.push(`<li style="margin-bottom:0.4rem;">${formatInline(line.replace(/^\d+\.\s+/, ''))}</li>`);
      continue;
    }

    if (inList) {
      flushList();
    }

    // Rubriker
    if (line.startsWith('#### ')) {
      htmlParts.push(`<h4 style="font-size:1.05em;font-weight:800;margin:1.25rem 0 0.5rem;">${formatInline(line.substring(5))}</h4>`);
      continue;
    }
    if (line.startsWith('### ')) {
      htmlParts.push(`<h3 style="font-size:1.15em;font-weight:800;margin:1.5rem 0 0.6rem;color:#0284c7;">${formatInline(line.substring(4))}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      htmlParts.push(`<h2 style="font-size:1.35em;font-weight:800;margin:1.8rem 0 0.75rem;padding-bottom:0.35rem;border-bottom:2px solid ${borderColor};">${formatInline(line.substring(3))}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      htmlParts.push(`<h1 style="font-size:1.65em;font-weight:900;margin:0 0 1rem;line-height:1.25;">${formatInline(line.substring(2))}</h1>`);
      continue;
    }

    // Horisontell linje
    if (/^---+$|^===+$/.test(line)) {
      htmlParts.push(`<hr style="border:none;border-top:1px solid ${borderColor};margin:1.75rem 0;" />`);
      continue;
    }

    if (!line) continue;

    htmlParts.push(`<p style="margin:0.75rem 0;">${formatInline(line)}</p>`);
  }

  flushTable();
  flushAlert();
  flushBlockquote();
  flushList();

  return htmlParts.join('\n');
}

