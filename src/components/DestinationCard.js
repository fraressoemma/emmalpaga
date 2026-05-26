'use client';

import { useLanguage } from '@/context/LanguageContext';

const STATUS_DOT = {
  todo:        '#55556a',
  in_progress: '#9d8ff5',
  done:        '#4ade80',
};

export default function DestinationCard({ destination, onClick, isSelected, categories = [] }) {
  const { t } = useLanguage();

  const STATUS_LABEL = {
    todo:        t.statusTodo,
    in_progress: t.statusInProgress,
    done:        t.statusDone,
  };

  const cat = categories.find(c => c.key === destination.category)
    || { label: destination.category, color: 'var(--color-curiosity)' };
  const isDone = destination.status === 'done';
  const dotColor = STATUS_DOT[destination.status] || STATUS_DOT.todo;
  const statusLabel = STATUS_LABEL[destination.status] || destination.status;

  return (
    <div
      onClick={onClick}
      className={isDone ? 'card-done' : ''}
      style={{
        position: 'relative',
        background: isSelected ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${isSelected ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        overflow: 'hidden',
        boxShadow: isSelected ? `0 0 0 1px var(--accent-border), var(--shadow-md)` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-medium)';
          e.currentTarget.style.background = 'var(--bg-card-hover)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
          e.currentTarget.style.background = 'var(--bg-card)';
        }
      }}
    >
      <div style={{ display: 'flex', gap: '0' }}>
        {/* Thumbnail */}
        <div style={{
          width: '80px',
          minHeight: '80px',
          flexShrink: 0,
          background: destination.image_url
            ? `url(${destination.image_url}) center/cover no-repeat`
            : `linear-gradient(160deg, ${cat.color}18, ${cat.color}08)`,
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {!destination.image_url && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              <circle cx="12" cy="10" r="3"/>
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
            </svg>
          )}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '12px 14px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              lineHeight: 1.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '-0.01em',
            }}>
              {destination.name}
            </h3>
            {/* Status dot */}
            <div style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
              marginTop: '4px',
              boxShadow: `0 0 6px ${dotColor}`,
            }} title={statusLabel} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: cat.color,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              opacity: 0.85,
            }}>
              {cat.label}
            </span>

            {destination.companions?.length > 0 && (
              <>
                <span style={{ color: 'var(--border-medium)', fontSize: '10px' }}>·</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {destination.companions.join(', ')}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
