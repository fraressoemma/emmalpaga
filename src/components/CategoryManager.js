'use client';
import { useState } from 'react';

const COLOR_PRESETS = [
  '#FF3366', '#FF6B35', '#FF9900', '#FFCC00',
  '#22C55E', '#00C2B2', '#3B82F6', '#6366F1',
  '#8B5CF6', '#EC4899',
];

const EMOJI_PRESETS = ['🏖️','🏔️','🍜','🎭','🏛️','🌿','🎵','🌊','🏕️','🎪','🦁','🌺','🎿','🏄','🗿','🦙'];

export default function CategoryManager({ categories, defaultCategories, onAdd, onDelete, onClose }) {
  const [emoji, setEmoji] = useState('🏖️');
  const [label, setLabel] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const customCategories = categories.filter(c => !defaultCategories.find(d => d.key === c.key));

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({ key: `custom_${Date.now()}`, emoji, label: label.trim(), color });
    setLabel('');
  };

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: '20px' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '440px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
      >
        <div style={{ padding: '22px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>Gérer les catégories</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#999' }}>✕</button>
        </div>

        <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#aaa', marginBottom: '8px' }}>Par défaut</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {defaultCategories.map(cat => (
                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.color, flexShrink: 0, display: 'inline-block' }} />
                  <span style={{ fontSize: '16px' }}>{cat.emoji}</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, flex: 1, color: '#0f172a' }}>{cat.label}</span>
                  <span style={{ fontSize: '11px', color: '#cbd5e1', fontStyle: 'italic' }}>par défaut</span>
                </div>
              ))}
            </div>
          </div>

          {customCategories.length > 0 && (
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#aaa', marginBottom: '8px' }}>Personnalisées</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {customCategories.map(cat => (
                  <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', background: '#f8fafc', borderRadius: '10px' }}>
                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: cat.color, flexShrink: 0, display: 'inline-block' }} />
                    <span style={{ fontSize: '16px' }}>{cat.emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 600, flex: 1, color: '#0f172a' }}>{cat.label}</span>
                    <button onClick={() => onDelete(cat.key)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px', padding: '2px 4px', borderRadius: '6px', lineHeight: 1 }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ border: '1.5px dashed #e2e8f0', borderRadius: '14px', padding: '16px' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '14px' }}>Nouvelle catégorie</p>

            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>Emoji</p>
            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {EMOJI_PRESETS.map(e => (
                <button key={e} onClick={() => setEmoji(e)} style={{ width: '34px', height: '34px', borderRadius: '8px', border: `2px solid ${emoji === e ? '#334155' : '#e2e8f0'}`, background: emoji === e ? '#f1f5f9' : 'white', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{e}</button>
              ))}
              <input value={emoji} onChange={e => setEmoji(e.target.value)} maxLength={2} style={{ width: '34px', height: '34px', borderRadius: '8px', border: '2px solid #e2e8f0', textAlign: 'center', fontSize: '18px', outline: 'none' }} placeholder="?" />
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>Couleur</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '12px' }}>
              {COLOR_PRESETS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: `3px solid ${color === c ? '#0f172a' : 'transparent'}`, cursor: 'pointer', outline: color === c ? `2px solid ${c}` : 'none', outlineOffset: '2px' }} />
              ))}
              <input type="color" value={color} onChange={e => setColor(e.target.value)} title="Couleur personnalisée" style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid #e2e8f0', cursor: 'pointer', padding: '0', background: 'none' }} />
            </div>

            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, marginBottom: '6px' }}>Nom</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                value={label}
                onChange={e => setLabel(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Ex: Gastronomie"
                style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={handleAdd}
                disabled={!label.trim()}
                style={{ padding: '9px 18px', borderRadius: '10px', background: color, color: 'white', border: 'none', fontWeight: 700, cursor: label.trim() ? 'pointer' : 'not-allowed', opacity: label.trim() ? 1 : 0.5, fontSize: '14px', whiteSpace: 'nowrap' }}
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
