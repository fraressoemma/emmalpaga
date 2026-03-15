'use client';

const STATUSES = [
  { key: 'todo', label: '📌 À faire', color: '#f59e0b', lightColor: '#fef3c7', textColor: '#92400e' },
  { key: 'in_progress', label: '🚀 En cours', color: '#6366f1', lightColor: '#e0e7ff', textColor: '#3730a3' },
  { key: 'done', label: '✅ Fait', color: '#22c55e', lightColor: '#dcfce7', textColor: '#166534' },
];

export default function Filters({ categories = [], selectedCategories, selectedStatuses, onCategoryToggle, onStatusToggle, onManageCategories }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Catégorie
          </p>
          <button
            onClick={onManageCategories}
            title="Gérer les catégories"
            style={{ background: 'none', border: 'none', fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 6px', borderRadius: '6px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}
          >
            ⚙️ Gérer
          </button>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map((cat) => {
            const isActive = selectedCategories.includes(cat.key);
            return (
              <button
                key={cat.key}
                onClick={() => onCategoryToggle(cat.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: `1.5px solid ${isActive ? cat.color : 'var(--border-light)'}`,
                  background: isActive ? `${cat.color}20` : 'white',
                  color: isActive ? cat.color : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px' }}>
          Statut
        </p>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {STATUSES.map((st) => {
            const isActive = selectedStatuses.includes(st.key);
            return (
              <button
                key={st.key}
                onClick={() => onStatusToggle(st.key)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: `1.5px solid ${isActive ? st.color : 'var(--border-light)'}`,
                  background: isActive ? st.lightColor : 'white',
                  color: isActive ? st.textColor : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
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
