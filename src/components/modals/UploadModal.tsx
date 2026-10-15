import React, { useState } from 'react';
import { CategoryItem, DocumentItem } from '../../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryItem[];
  onSaveDoc: (doc: DocumentItem) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSaveDoc,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Respiration');
  const [priority, setPriority] = useState<'Riktlinje' | 'Akut' | 'Rutin'>('Riktlinje');
  const [tagsStr, setTagsStr] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Vänligen ange en titel för dokumentet.');
      return;
    }
    setErrorMessage('');

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const newDoc: DocumentItem = {
      id: 'doc-user-' + Date.now(),
      title: title.trim(),
      category,
      priority,
      tags: tags.length > 0 ? tags : [category],
      description: description.trim() || title.trim(),
      content: content.trim() || `# ${title.trim()}\n\n${description.trim()}`,
      dateAdded: new Date().toISOString(),
      type: 'text/markdown',
    };

    onSaveDoc(newDoc);
    onClose();
  };

  return (
    <div
      className="modal-backdrop is-open"
      onClick={onClose}
      style={{
        zIndex: 1100,
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            ➕ Skapa / Ladda upp nytt PM & Protokoll
          </h2>
          <button onClick={onClose} style={{ border: 'none', background: '#e2e8f0', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {errorMessage && (
            <div style={{ padding: '0.65rem 0.85rem', background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', fontWeight: 600 }}>
              ⚠️ {errorMessage}
            </div>
          )}
          <div>
            <label htmlFor="upload_title" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Dokumentets Titel *</label>
            <input
              id="upload_title"
              type="text"
              required
              placeholder="t.ex. Riktlinje för Bukläge vid Svår ARDS"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 600, marginTop: '0.25rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label htmlFor="upload_cat" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Kategori</label>
              <select
                id="upload_cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="upload_priority" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Prioritetsgrad</label>
              <select
                id="upload_priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.25rem' }}
              >
                <option value="Riktlinje">Riktlinje</option>
                <option value="Akut">Akut / Livsuppehållande</option>
                <option value="Rutin">Rutin / Vårdhandling</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="upload_desc" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Kort sammanfattning / Beskrivning</label>
            <textarea
              id="upload_desc"
              rows={2}
              placeholder="Kortfattad beskrivning för kortvyn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '0.25rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="upload_tags" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Taggar (kommatecken-separerade)</label>
            <input
              id="upload_tags"
              type="text"
              placeholder="ARDS, Bukläge, Ventilation, PEEP"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', marginTop: '0.25rem', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label htmlFor="upload_content" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Protokoll / Text (Markdown)</label>
            <textarea
              id="upload_content"
              rows={8}
              placeholder="# Klinisk Rutin&#10;&#10;## 1. Indikationer&#10;- Punkt 1...&#10;&#10;## 2. Åtgärder&#10;1. Första steget..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontFamily: 'monospace', marginTop: '0.25rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: '#f1f5f9', border: 'none', padding: '0.55rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              Avbryt
            </button>
            <button
              type="submit"
              style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '0.55rem 1.25rem', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Spara och Publicera PM
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
