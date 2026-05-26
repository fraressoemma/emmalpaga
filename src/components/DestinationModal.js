'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function DestinationModal({ destination, onClose, onEdit, onDelete }) {
    const { t } = useLanguage();

    if (!destination) return null;

    const STATUS_MAP = {
        todo:        { label: t.statusTodo,       color: '#55556a', bg: 'rgba(255,255,255,0.05)' },
        in_progress: { label: t.statusInProgress, color: '#9d8ff5', bg: 'rgba(124,109,240,0.12)' },
        done:        { label: t.statusDone,       color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
    };

    const CATEGORY_MAP = {
        dream:     { label: t.catDream,     color: 'var(--color-dream)' },
        desire:    { label: t.catDesire,    color: 'var(--color-desire)' },
        curiosity: { label: t.catCuriosity, color: 'var(--color-curiosity)' },
    };

    const cat = CATEGORY_MAP[destination.category] || CATEGORY_MAP.curiosity;
    const status = STATUS_MAP[destination.status] || STATUS_MAP.todo;

    return (
        <div
            className="animate-fadeIn"
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0,
                background: 'var(--bg-modal-overlay)',
                backdropFilter: 'blur(6px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 2000, padding: '20px',
            }}
        >
            <div
                className="animate-slideUp"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-xl)',
                    width: '100%', maxWidth: '480px',
                    maxHeight: '85vh', overflow: 'auto',
                    boxShadow: 'var(--shadow-xl)',
                }}
            >
                {/* Hero */}
                <div style={{
                    width: '100%', height: '200px',
                    background: destination.image_url
                        ? `url(${destination.image_url}) center/cover no-repeat`
                        : `linear-gradient(160deg, ${cat.color}14, var(--bg-elevated))`,
                    position: 'relative', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                    display: 'flex', alignItems: 'flex-end',
                }}>
                    {/* Gradient overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(23,23,29,0.9) 0%, transparent 60%)',
                        borderRadius: 'inherit',
                    }} />

                    {/* Title inside hero */}
                    <div style={{ position: 'relative', padding: '20px 24px', zIndex: 1 }}>
                        <h2 style={{
                            fontSize: '22px', fontWeight: 700,
                            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.2,
                            marginBottom: '8px',
                        }}>
                            {destination.name}
                        </h2>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <span style={{
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: `${cat.color}20`,
                                border: `1px solid ${cat.color}40`,
                                color: cat.color,
                                fontSize: '11px', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}>
                                {cat.label}
                            </span>
                            <span style={{
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-sm)',
                                background: status.bg,
                                color: status.color,
                                fontSize: '11px', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: '0.04em',
                            }}>
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Close */}
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute', top: '14px', right: '14px',
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '14px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.15s',
                            zIndex: 2,
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px' }}>
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {destination.budget && (
                            <Field label={t.estimatedBudget} value={destination.budget} />
                        )}

                        {destination.companions?.length > 0 && (
                            <div>
                                <Label>{t.withWho}</Label>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                                    {destination.companions.map((name, i) => (
                                        <span key={i} className="tag">{name}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {destination.notes && (
                            <div>
                                <Label>{t.notes}</Label>
                                <p style={{
                                    marginTop: '6px',
                                    padding: '12px 14px',
                                    background: 'var(--bg-elevated)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-subtle)',
                                    fontSize: '13px', lineHeight: 1.65,
                                    color: 'var(--text-secondary)',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {destination.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
                        <button className="btn-primary" onClick={() => onEdit(destination)} style={{ flex: 1, justifyContent: 'center' }}>
                            {t.edit}
                        </button>
                        <button className="btn-danger" onClick={() => onDelete(destination.id)}>
                            {t.deleteBtn}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Label({ children }) {
    return (
        <p style={{
            fontSize: '11px', fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
            {children}
        </p>
    );
}

function Field({ label, value }) {
    return (
        <div>
            <Label>{label}</Label>
            <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, marginTop: '4px' }}>
                {value}
            </p>
        </div>
    );
}
