'use client';
import { useState } from 'react';
import AssistantChat from './AssistantChat';

export default function FloatingAssistant() {
    const [open, setOpen] = useState(false);
    const [bubbleDismissed, setBubbleDismissed] = useState(false);

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
                            {/* Mini alpaca */}
                            <svg width="34" height="40" viewBox="0 0 40 46" style={{ flexShrink: 0, overflow: 'visible' }}>
                                <circle cx="10" cy="15" r="9" fill="#FF3366" />
                                <circle cx="20" cy="11" r="10" fill="#FF9900" />
                                <circle cx="30" cy="15" r="9" fill="#00C2B2" />
                                <ellipse cx="7" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(-18 7 23)" />
                                <ellipse cx="33" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(18 33 23)" />
                                <ellipse cx="7" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(-18 7 23)" />
                                <ellipse cx="33" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(18 33 23)" />
                                <ellipse cx="20" cy="27" rx="13.5" ry="12" fill="#F5CF80" />
                                <circle cx="14" cy="25.5" r="3.8" fill="#1F2937" />
                                <circle cx="26" cy="25.5" r="3.8" fill="#1F2937" />
                                <circle cx="15.4" cy="24.1" r="1.4" fill="white" />
                                <circle cx="27.4" cy="24.1" r="1.4" fill="white" />
                                <ellipse cx="20" cy="33" rx="6" ry="4.2" fill="#E8AE5A" />
                                <ellipse cx="17.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
                                <ellipse cx="22.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
                                <rect x="15" y="37" width="10" height="7" rx="5" fill="#F5CF80" />
                            </svg>
                            <div>
                                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '14px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                                    Assistant EmmAlpaga
                                </p>
                                <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                                    Planification d'itinéraire · Gemini
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
                            I can help you ✨
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

                {/* Alpaca button */}
                <button
                    onClick={() => { setOpen(v => !v); setBubbleDismissed(true); }}
                    title="Assistant itinéraire"
                    style={{
                        background: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '72px',
                        height: '72px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: open
                            ? '0 8px 32px rgba(255,51,102,0.3), 0 2px 8px rgba(0,0,0,0.1)'
                            : '0 8px 24px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08)',
                        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
                        animation: open ? 'none' : 'floatLlama 3s ease-in-out infinite',
                        padding: 0,
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <svg width="52" height="60" viewBox="0 0 40 46" style={{ overflow: 'visible' }}>
                        <circle cx="10" cy="15" r="9" fill="#FF3366" />
                        <circle cx="20" cy="11" r="10" fill="#FF9900" />
                        <circle cx="30" cy="15" r="9" fill="#00C2B2" />
                        <ellipse cx="7" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(-18 7 23)" />
                        <ellipse cx="33" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(18 33 23)" />
                        <ellipse cx="7" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(-18 7 23)" />
                        <ellipse cx="33" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(18 33 23)" />
                        <ellipse cx="20" cy="27" rx="13.5" ry="12" fill="#F5CF80" />
                        <circle cx="14" cy="25.5" r="3.8" fill="#1F2937" />
                        <circle cx="26" cy="25.5" r="3.8" fill="#1F2937" />
                        <circle cx="15.4" cy="24.1" r="1.4" fill="white" />
                        <circle cx="27.4" cy="24.1" r="1.4" fill="white" />
                        <ellipse cx="20" cy="33" rx="6" ry="4.2" fill="#E8AE5A" />
                        <ellipse cx="17.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
                        <ellipse cx="22.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
                        <rect x="15" y="37" width="10" height="7" rx="5" fill="#F5CF80" />
                    </svg>
                </button>
            </div>
        </>
    );
}
