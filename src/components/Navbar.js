'use client';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

export default function Navbar({ onExportPdf, onToggleShare, sharingEnabled }) {
    const { user, signOut } = useAuth();
    const { t } = useLanguage();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            height: '52px',
            background: 'rgba(11,11,15,0.88)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 1000,
        }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/wayki-logo.png" alt="Wayki" style={{ height: '28px', width: 'auto' }} />
            </div>

            {/* Right actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                    onClick={onExportPdf}
                    className="desktop-only"
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-light)',
                        color: 'var(--text-secondary)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        letterSpacing: '0.01em',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                    {t.exportPdf}
                </button>

                <button
                    onClick={onToggleShare}
                    className="desktop-only"
                    style={{
                        background: sharingEnabled ? 'var(--accent-light)' : 'transparent',
                        border: `1px solid ${sharingEnabled ? 'var(--accent-border)' : 'var(--border-light)'}`,
                        color: sharingEnabled ? 'var(--accent)' : 'var(--text-secondary)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                    }}
                >
                    {sharingEnabled ? t.linkActive : t.share}
                </button>

                {/* User avatar */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: 'var(--accent-light)',
                            border: '1px solid var(--accent-border)',
                            color: 'var(--accent)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </button>

                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            top: '42px',
                            right: 0,
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border-light)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-xl)',
                            padding: '6px',
                            minWidth: '200px',
                            zIndex: 1001,
                        }} className="animate-slideUp">
                            <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                                {user?.email}
                            </div>

                            {/* Mobile-only items */}
                            <MenuButton className="mobile-only" onClick={() => { onExportPdf(); setShowMenu(false); }}>
                                {t.exportPdf}
                            </MenuButton>
                            <MenuButton className="mobile-only" onClick={() => { onToggleShare(); setShowMenu(false); }}>
                                {sharingEnabled ? t.linkActive : t.share}
                            </MenuButton>

                            <MenuButton onClick={() => { signOut(); setShowMenu(false); }} danger>
                                {t.logout}
                            </MenuButton>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function MenuButton({ children, onClick, danger, className }) {
    const [hover, setHover] = useState(false);
    return (
        <button
            onClick={onClick}
            className={className}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                background: hover ? 'var(--bg-card-hover)' : 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: 'var(--radius-md)',
                color: danger ? '#f87171' : 'var(--text-secondary)',
                transition: 'all 0.15s',
                display: 'block',
            }}
        >
            {children}
        </button>
    );
}
