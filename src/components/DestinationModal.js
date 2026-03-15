'use client';

const CATEGORY_MAP = {
    dream: { emoji: '🌟', label: 'Rêve', className: 'badge-dream', color: 'var(--color-dream)' },
    desire: { emoji: '✈️', label: 'Envie', className: 'badge-desire', color: 'var(--color-desire)' },
    curiosity: { emoji: '🔍', label: 'Curiosité', className: 'badge-curiosity', color: 'var(--color-curiosity)' },
};

const STATUS_MAP = {
    todo: { emoji: '📌', label: 'À faire', className: 'badge-todo' },
    in_progress: { emoji: '🚀', label: 'En cours', className: 'badge-in_progress' },
    done: { emoji: '✅', label: 'Fait', className: 'badge-done' },
};

export default function DestinationModal({ destination, onClose, onEdit, onDelete }) {
    if (!destination) return null;

    const cat = CATEGORY_MAP[destination.category] || CATEGORY_MAP.curiosity;
    const status = STATUS_MAP[destination.status] || STATUS_MAP.todo;

    return (
        <div
            className="animate-fadeIn"
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--bg-modal-overlay)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '20px',
            }}
        >
            <div
                className="animate-slideUp"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    width: '100%',
                    maxWidth: '520px',
                    maxHeight: '85vh',
                    overflow: 'auto',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                }}
            >
                {/* Hero image */}
                <div
                    style={{
                        width: '100%',
                        height: '220px',
                        background: destination.image_url
                            ? `url(${destination.image_url}) center/cover no-repeat`
                            : `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {!destination.image_url && (
                        <span style={{ fontSize: '64px', opacity: 0.5 }}>🗺️</span>
                    )}

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '14px',
                            right: '14px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(8px)',
                            border: 'none',
                            color: 'white',
                            fontSize: '18px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(0,0,0,0.6)'}
                        onMouseLeave={(e) => e.target.style.background = 'rgba(0,0,0,0.4)'}
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {/* Title + badges */}
                    <h2
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '24px',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                            marginBottom: '12px',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        {destination.name}
                    </h2>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <span className={`badge ${cat.className}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                            {cat.emoji} {cat.label}
                        </span>
                        <span className={`badge ${status.className}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
                            {status.emoji} {status.label}
                        </span>
                    </div>

                    {/* Details grid */}
                    <div
                        style={{
                            display: 'grid',
                            gap: '16px',
                            marginBottom: '20px',
                        }}
                    >
                        {destination.budget && (
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                    💰 Budget estimé
                                </p>
                                <p style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: 500 }}>
                                    {destination.budget}
                                </p>
                            </div>
                        )}

                        {destination.companions && destination.companions.length > 0 && (
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                                    👥 Avec qui
                                </p>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {destination.companions.map((name, i) => (
                                        <span key={i} className="tag">{name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {destination.notes && (
                            <div>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                                    📝 Notes personnelles
                                </p>
                                <div
                                    style={{
                                        padding: '14px',
                                        background: '#f8fafc',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '14px',
                                        lineHeight: 1.6,
                                        color: 'var(--text-secondary)',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {destination.notes}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                        <button className="btn-primary" onClick={() => onEdit(destination)} style={{ flex: 1 }}>
                            ✏️ Modifier
                        </button>
                        <button className="btn-danger" onClick={() => onDelete(destination.id)}>
                            🗑️ Supprimer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
