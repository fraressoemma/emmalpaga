'use client';
import { useState } from 'react';
import AssistantChat from './AssistantChat';
import { useLanguage } from '@/context/LanguageContext';

export default function FloatingAssistant() {
    const [open, setOpen] = useState(false);
    const [bubbleDismissed, setBubbleDismissed] = useState(false);
    const { t } = useLanguage();

    const showBubble = !open && !bubbleDismissed;

    return (
        <>
            <style>{`
                @keyframes floatLlama {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                }
                @keyframes slideUpChat {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes popBubble {
                    from { opacity: 0; transform: translateY(6px) scale(0.95); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            {/* Chat window */}
            {open && (
                <div style={{
                    position: 'fixed',
                    bottom: '108px',
                    left: '20px',
                    width: '360px',
                    height: '510px',
                    background: 'white',
                    borderRadius: '20px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    animation: 'slideUpChat 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                    {/* Chat header */}
                    <div style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid #f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(135deg, rgba(255,51,102,0.06), rgba(0,194,178,0.06))',
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                                <img src="/lama.png" alt="Lama" style={{ width: '120%', height: '120%', marginLeft: '-10%', marginTop: '-10%', display: 'block' }} />
                            </div>
                            <div>
                                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                                    {t.assistantTitle}
                                </p>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                                    {t.assistantSubtitle}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '8px', lineHeight: 1, display: 'flex', alignItems: 'center' }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Chat content */}
                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <AssistantChat />
                    </div>
                </div>
            )}

            {/* Floating alpaca button + speech bubble */}
            <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>

                {/* Speech bubble */}
                {showBubble && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'white',
                        borderRadius: '14px',
                        padding: '9px 14px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                        animation: 'popBubble 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        position: 'relative',
                        border: '1px solid rgba(0,0,0,0.06)',
                    }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap' }}>
                            {t.whereToNext}
                        </span>
                        <button
                            onClick={e => { e.stopPropagation(); setBubbleDismissed(true); }}
                            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '12px', padding: '0 0 0 4px', lineHeight: 1 }}
                        >
                            ✕
                        </button>
                        {/* Bubble tail */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-7px',
                            left: '22px',
                            width: '14px',
                            height: '7px',
                            overflow: 'hidden',
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '-7px',
                                left: '0',
                                width: '14px',
                                height: '14px',
                                background: 'white',
                                border: '1px solid rgba(0,0,0,0.06)',
                                transform: 'rotate(45deg)',
                                boxShadow: '2px 2px 4px rgba(0,0,0,0.06)',
                            }} />
                        </div>
                    </div>
                )}

                {/* Lama button */}
                <button
                    onClick={() => { setOpen(v => !v); setBubbleDismissed(true); }}
                    title={t.assistantTooltip}
                    style={{
                        background: 'none',
                        border: 'none',
                        borderRadius: '50%',
                        width: '72px',
                        height: '72px',
                        cursor: 'pointer',
                        padding: 0,
                        overflow: 'hidden',
                        boxShadow: 'none',
                        transition: 'transform 0.2s ease',
                        animation: open ? 'none' : 'floatLlama 3s ease-in-out infinite',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {/* zoom 88% pour cadrer juste le cercle et couper le blanc */}
                    <img src="/lama.png" alt="Lama" style={{ width: '120%', height: '120%', marginLeft: '-10%', marginTop: '-10%', display: 'block' }} />
                </button>
            </div>
        </>
    );
}
