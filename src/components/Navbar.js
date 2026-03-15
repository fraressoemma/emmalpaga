'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar({ onExportPdf, onToggleShare, sharingEnabled }) {
    const { user, signOut } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60px',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
                zIndex: 1000,
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            }}
        >
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* EmmAlpaga SVG logo */}
                <svg width="36" height="42" viewBox="0 0 40 46" style={{ flexShrink: 0, overflow: 'visible' }}>
                    {/* Fluffy colorful hair puffs */}
                    <circle cx="10" cy="15" r="9" fill="#FF3366" />
                    <circle cx="20" cy="11" r="10" fill="#FF9900" />
                    <circle cx="30" cy="15" r="9" fill="#00C2B2" />

                    {/* Ears */}
                    <ellipse cx="7" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(-18 7 23)" />
                    <ellipse cx="33" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(18 33 23)" />
                    <ellipse cx="7" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(-18 7 23)" />
                    <ellipse cx="33" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(18 33 23)" />

                    {/* Face */}
                    <ellipse cx="20" cy="27" rx="13.5" ry="12" fill="#F5CF80" />

                    {/* Eyes */}
                    <circle cx="14" cy="25.5" r="3.8" fill="#1F2937" />
                    <circle cx="26" cy="25.5" r="3.8" fill="#1F2937" />
                    {/* Eye shine */}
                    <circle cx="15.4" cy="24.1" r="1.4" fill="white" />
                    <circle cx="27.4" cy="24.1" r="1.4" fill="white" />

                    {/* Muzzle */}
                    <ellipse cx="20" cy="33" rx="6" ry="4.2" fill="#E8AE5A" />
                    {/* Nostrils */}
                    <ellipse cx="17.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
                    <ellipse cx="22.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />

                    {/* Neck */}
                    <rect x="15" y="37" width="10" height="7" rx="5" fill="#F5CF80" />
                </svg>

                <h1
                    style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '22px',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #FF3366 0%, #FF9900 55%, #00C2B2 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.03em',
                        lineHeight: 1,
                    }}
                >
                    EmmAlpaga
                </h1>
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Export PDF */}
                <button
                    onClick={onExportPdf}
                    style={{
                        background: 'rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        color: 'var(--text-primary)',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(0,0,0,0.06)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(0,0,0,0.03)';
                    }}
                    className="desktop-only"
                >
                    📄 Export PDF
                </button>

                {/* Share toggle */}
                <button
                    onClick={onToggleShare}
                    style={{
                        background: sharingEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${sharingEnabled ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0,0,0,0.05)'}`,
                        color: sharingEnabled ? '#059669' : 'var(--text-primary)',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                    }}
                    className="desktop-only"
                >
                    {sharingEnabled ? '🔗 Lien actif' : '🔒 Partager'}
                </button>

                {/* User menu */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            background: 'var(--accent)',
                            border: 'none',
                            color: 'white',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            fontSize: '14px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </button>

                    {showMenu && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '46px',
                                right: 0,
                                background: 'white',
                                borderRadius: '12px',
                                boxShadow: 'var(--shadow-xl)',
                                padding: '8px',
                                minWidth: '200px',
                                zIndex: 1001,
                            }}
                            className="animate-slideUp"
                        >
                            <div
                                style={{
                                    padding: '10px 14px',
                                    fontSize: '12px',
                                    color: 'var(--text-muted)',
                                    borderBottom: '1px solid var(--border-light)',
                                    marginBottom: '4px',
                                }}
                            >
                                {user?.email}
                            </div>

                            {/* Mobile-only buttons */}
                            <button
                                onClick={() => { onExportPdf(); setShowMenu(false); }}
                                className="mobile-only"
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 14px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-card-hover)'}
                                onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                                📄 Export PDF
                            </button>

                            <button
                                onClick={() => { onToggleShare(); setShowMenu(false); }}
                                className="mobile-only"
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 14px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'var(--bg-card-hover)'}
                                onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                                {sharingEnabled ? '🔗 Lien actif' : '🔒 Partager'}
                            </button>

                            <button
                                onClick={() => { signOut(); setShowMenu(false); }}
                                style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '10px 14px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    transition: 'background 0.15s',
                                }}
                                onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                                onMouseLeave={(e) => e.target.style.background = 'none'}
                            >
                                ⬅️ Déconnexion
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
