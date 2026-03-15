'use client';

import { useState } from 'react';

export default function SearchBar({ value, onChange }) {
    const [focused, setFocused] = useState(false);

    return (
        <div
            style={{
                position: 'relative',
                marginBottom: '16px',
            }}
        >
            <span
                style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    opacity: 0.4,
                    transition: 'opacity 0.2s',
                    ...(focused && { opacity: 0.7 }),
                }}
            >
                🔍
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Rechercher une destination..."
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${focused ? 'var(--accent)' : 'var(--border-light)'}`,
                    fontSize: '14px',
                    fontFamily: "'Inter', sans-serif",
                    color: 'var(--text-primary)',
                    background: 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                    outline: 'none',
                    boxShadow: focused ? '0 0 0 3px var(--accent-light)' : 'none',
                }}
            />
        </div>
    );
}
