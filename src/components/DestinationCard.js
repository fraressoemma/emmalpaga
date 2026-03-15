'use client';

const STATUS_MAP = {
  todo: { emoji: '📌', label: 'À faire', className: 'badge-todo' },
  in_progress: { emoji: '🚀', label: 'En cours', className: 'badge-in_progress' },
  done: { emoji: '✅', label: 'Fait', className: 'badge-done' },
};

export default function DestinationCard({ destination, onClick, isSelected, categories = [] }) {
  const cat = categories.find(c => c.key === destination.category) || { emoji: '🔍', label: destination.category, color: '#00C2B2' };
  const status = STATUS_MAP[destination.status] || STATUS_MAP.todo;
  const isDone = destination.status === 'done';

  return (
    <div
      onClick={onClick}
      className={isDone ? 'card-done' : ''}
      style={{
        position: 'relative',
        background: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-light)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '0',
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 0 0 3px var(--accent-light)' : 'var(--shadow-sm)',
        opacity: isDone ? 0.75 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-light)';
          e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <div style={{ display: 'flex', gap: '0' }}>
        <div
          style={{
            width: '90px',
            minHeight: '90px',
            flexShrink: 0,
            background: destination.image_url
              ? `url(${destination.image_url}) center/cover no-repeat`
              : `linear-gradient(135deg, ${cat.color}22, ${cat.color}55)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          {!destination.image_url && cat.emoji}
        </div>

        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '15px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '6px',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {destination.name}
          </h3>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ padding: '2px 8px', borderRadius: '20px', background: `${cat.color}20`, color: cat.color, fontSize: '11px', fontWeight: 700 }}>
              {cat.emoji} {cat.label}
            </span>
            <span className={`badge ${status.className}`}>
              {status.emoji} {status.label}
            </span>
          </div>

          {destination.companions && destination.companions.length > 0 && (
            <p
              style={{
                fontSize: '12px',
                color: 'var(--text-muted)',
                marginTop: '6px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              👥 {destination.companions.join(', ')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
