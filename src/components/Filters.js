'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function Filters({ categories = [], selectedCategories, selectedStatuses, onCategoryToggle, onStatusToggle, onManageCategories }) {
  const { t } = useLanguage();

  const STATUSES = [
    { key: 'todo',        label: t.statusTodo,       color: '#55556a', bg: 'rgba(255,255,255,0.05)' },
    { key: 'in_progress', label: t.statusInProgress, color: '#9d8ff5', bg: 'rgba(124,109,240,0.12)' },
    { key: 'done',        label: t.statusDone,       color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  ];

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Categories */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            {t.categoryLabel}
          </p>
          <button
            onClick={onManageCategories}
            style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 4px', borderRadius: '4px', fontWeight: 500 }}
          >
            {t.manage}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => onCategoryToggle(cat.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isActive ? cat.color + '60' : 'var(--border-subtle)'}`,
                  background: isActive ? `${cat.color}14` : 'transparent',
                  color: isActive ? cat.color : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Statuses */}
      <div>
        <p style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '8px' }}>
          {t.statusLabel}
        </p>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {STATUSES.map((st) => {
            const isActive = selectedStatuses.includes(st.key);
            return (
              <button
                key={st.key}
                onClick={() => onStatusToggle(st.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${isActive ? st.color + '50' : 'var(--border-subtle)'}`,
                  background: isActive ? st.bg : 'transparent',
                  color: isActive ? st.color : 'var(--text-muted)',
                  fontSize: '12px', fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {st.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
