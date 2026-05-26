'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const TRIP_COLORS = [
  '#c9a96e', '#d9607a', '#4db8b0', '#9d8ff5',
  '#4ade80', '#60a5fa', '#f97316', '#e879f9',
];

export default function TripSelector({ trips, selectedTripId, onSelectTrip, onAddTrip, onDeleteTrip }) {
  const { t } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState(TRIP_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setSaving(true);
    await onAddTrip(newName.trim(), newColor);
    setNewName('');
    setNewColor(TRIP_COLORS[0]);
    setShowForm(false);
    setSaving(false);
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
          {t.trip}
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', fontWeight: 500, transition: 'color 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          {t.newTrip}
        </button>
      </div>

      {/* Pills */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
        <Pill
          active={!selectedTripId}
          color="var(--text-muted)"
          onClick={() => onSelectTrip(null)}
        >
          {t.all}
        </Pill>

        {trips.map((trip) => (
          <div key={trip.id} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Pill
              active={selectedTripId === trip.id}
              color={trip.color}
              onClick={() => onSelectTrip(trip.id)}
              paddingRight={22}
            >
              {trip.name}
            </Pill>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteTrip(trip.id); }}
              style={{
                position: 'absolute', right: '5px',
                background: 'none', border: 'none',
                fontSize: '9px', color: 'var(--text-muted)',
                cursor: 'pointer', padding: 0, lineHeight: 1,
                opacity: 0.5, transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '0.5'}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          style={{
            marginTop: '10px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}
        >
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t.tripPlaceholder}
            className="input-field"
            style={{ fontSize: '13px' }}
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            {TRIP_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setNewColor(c)}
                style={{
                  width: '18px', height: '18px',
                  borderRadius: '50%', background: c,
                  border: newColor === c ? `2px solid var(--text-primary)` : '2px solid transparent',
                  cursor: 'pointer', padding: 0, flexShrink: 0,
                  transition: 'border 0.15s',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="submit"
              disabled={saving || !newName.trim()}
              className="btn-primary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '12px', opacity: saving || !newName.trim() ? 0.5 : 1 }}
            >
              {saving ? t.creating : t.createTrip}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary" style={{ fontSize: '12px' }}>
              {t.cancel}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Pill({ children, active, color, onClick, paddingRight }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: `4px 10px`,
        paddingRight: paddingRight ? `${paddingRight}px` : '10px',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${active ? color + '50' : hover ? 'var(--border-light)' : 'var(--border-subtle)'}`,
        background: active ? `${color}14` : hover ? 'var(--bg-elevated)' : 'transparent',
        color: active ? color : hover ? 'var(--text-secondary)' : 'var(--text-muted)',
        fontSize: '12px', fontWeight: 500,
        cursor: 'pointer', transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
