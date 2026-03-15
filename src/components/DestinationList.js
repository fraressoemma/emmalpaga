'use client';

import DestinationCard from './DestinationCard';

export default function DestinationList({
    destinations,
    selectedId,
    onSelect,
    onAdd,
    categories = [],
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Add button */}
            <button
                onClick={onAdd}
                style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 'var(--radius-lg)',
                    border: '2px dashed var(--border-medium)',
                    background: 'transparent',
                    color: 'var(--accent)',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}
                onMouseEnter={(e) => {
                    e.target.style.borderColor = 'var(--accent)';
                    e.target.style.background = 'var(--accent-light)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.borderColor = 'var(--border-medium)';
                    e.target.style.background = 'transparent';
                }}
            >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>+</span>
                Ajouter une destination
            </button>

            {/* Destinations */}
            {destinations.length === 0 ? (
                <div
                    style={{
                        textAlign: 'center',
                        padding: '40px 20px',
                        color: 'var(--text-muted)',
                    }}
                >
                    <p style={{ fontSize: '40px', marginBottom: '12px' }}>🗺️</p>
                    <p style={{ fontSize: '15px', fontWeight: 500 }}>
                        Aucune destination
                    </p>
                    <p style={{ fontSize: '13px', marginTop: '4px' }}>
                        Ajoutez votre premier rêve de voyage !
                    </p>
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
