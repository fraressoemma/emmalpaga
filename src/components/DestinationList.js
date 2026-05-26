'use client';

import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import DestinationCard from './DestinationCard';

export default function DestinationList({ destinations, selectedId, onSelect, onAdd, categories = [] }) {
    const [hover, setHover] = useState(false);
    const { t } = useLanguage();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {/* Add button */}
            <button
                onClick={onAdd}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px dashed ${hover ? 'var(--accent-border)' : 'var(--border-light)'}`,
                    background: hover ? 'var(--accent-light)' : 'transparent',
                    color: hover ? 'var(--accent)' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    letterSpacing: '0.01em',
                    marginBottom: '4px',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                {t.newDestination}
            </button>

            {/* Empty state */}
            {destinations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }}>
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 8v4M12 16h.01"/>
                    </svg>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                        {t.noDestinations}
                    </p>
                    <p style={{ fontSize: '12px' }}>{t.startAdding}</p>
                </div>
            ) : (
                destinations.map((dest) => (
                    <DestinationCard
                        key={dest.id}
                        destination={dest}
                        isSelected={dest.id === selectedId}
                        onClick={() => onSelect(dest)}
                        categories={categories}
                    />
                ))
            )}
        </div>
    );
}
