'use client';
import { useState, useEffect, useRef } from 'react';

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans la planification d'itinéraires de voyage et de visites. Tu aides les utilisateurs à organiser leur parcours de manière optimale.

Quand tu planifies un itinéraire, tu DOIS inclure un bloc JSON dans ta réponse en respectant EXACTEMENT ce format :
<itinerary>
{
  "steps": [
    {"name": "Nom du lieu", "detail": "Description courte, conseil pratique", "duration": "Xh", "type": "musée|restaurant|monument|parc|shopping|transport"},
    ...
  ],
  "total_duration": "Xh total",
  "mode": "à pied|voiture|transports en commun"
}
</itinerary>

Règles : optimise l'ordre géographiquement, inclus des conseils pratiques, tiens compte de la position GPS si fournie. Si tu réponds à une question sans planifier, ne mets PAS de bloc <itinerary>.`;

const TYPE_EMOJI = { musée: '🏛', restaurant: '🍽', monument: '🗿', parc: '🌿', shopping: '🛍', transport: '🚇' };

function parseItinerary(text) {
    const match = text.match(/<itinerary>([\s\S]*?)<\/itinerary>/);
    if (!match) return null;
    try { return JSON.parse(match[1].trim()); } catch { return null; }
}

function formatTime() {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function AssistantChat() {
    const [apiKey, setApiKey] = useState('');
    const [apiStatus, setApiStatus] = useState(null); // null | 'ok' | 'err'
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Bonjour ! Je suis votre assistant itinéraire 👋\n\nDites-moi où vous souhaitez aller et combien de temps vous avez — je planifie votre parcours optimal !', time: formatTime() }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [itinerary, setItinerary] = useState(null);
    const [showItinerary, setShowItinerary] = useState(false);
    const [gpsStatus, setGpsStatus] = useState('idle'); // idle | loading | active | denied
    const [userLocation, setUserLocation] = useState(null);

    const messagesRef = useRef(null);
    const historyRef = useRef([]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const checkKey = (val) => {
        setApiKey(val);
        if (val.startsWith('AIza') && val.length > 20) setApiStatus('ok');
        else if (val.length > 0) setApiStatus('err');
        else setApiStatus(null);
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        if (!apiKey || !apiKey.startsWith('AIza')) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Merci de coller ta clé API Google (Gemini) dans le champ en haut !', time: formatTime() }]);
            return;
        }

        historyRef.current.push({ role: 'user', content: text });
        setMessages(prev => [...prev, { role: 'user', text, time: formatTime() }]);
        setInput('');
        setLoading(true);

        const contents = historyRef.current.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
        }));

        if (userLocation) {
            contents[contents.length - 1].parts[0].text +=
                `\n\n[Position GPS: lat ${userLocation.lat.toFixed(4)}, lng ${userLocation.lng.toFixed(4)}]`;
        }

        try {
            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                        contents
                    })
                }
            );
            const data = await res.json();
            if (data.error) {
                setMessages(prev => [...prev, { role: 'assistant', text: `Erreur API : ${data.error.message}`, time: formatTime() }]);
                setLoading(false);
                return;
            }
            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Aucune réponse reçue.';
            const clean = reply.replace(/<itinerary>[\s\S]*?<\/itinerary>/g, '').trim();
            historyRef.current.push({ role: 'assistant', content: reply });
            if (clean) setMessages(prev => [...prev, { role: 'assistant', text: clean, time: formatTime() }]);
            const parsed = parseItinerary(reply);
            if (parsed) { setItinerary(parsed); setShowItinerary(true); }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'assistant', text: `Erreur : ${e.message}`, time: formatTime() }]);
        }
        setLoading(false);
    };

    const getGPS = () => {
        if (!navigator.geolocation) { setGpsStatus('denied'); return; }
        setGpsStatus('loading');
        navigator.geolocation.getCurrentPosition(
            pos => { setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGpsStatus('active'); },
            () => setGpsStatus('denied')
        );
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* API key bar */}
            <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px', background: '#fafafa', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, whiteSpace: 'nowrap' }}>Clé Gemini</span>
                <input
                    type="password"
                    value={apiKey}
                    onChange={e => checkKey(e.target.value)}
                    placeholder="AIzaSy..."
                    style={{
                        flex: 1, border: `1px solid ${apiStatus === 'ok' ? '#22c55e' : apiStatus === 'err' ? '#ef4444' : 'var(--border-light)'}`,
                        borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontFamily: 'monospace', outline: 'none', background: 'white', minWidth: 0
                    }}
                />
                {apiStatus === 'ok' && <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, whiteSpace: 'nowrap' }}>✓ OK</span>}
                {apiStatus === 'err' && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: 700, whiteSpace: 'nowrap' }}>❌</span>}
            </div>

            {/* Messages */}
            <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {messages.map((msg, i) => (
                    <div key={i} style={{
                        display: 'flex', flexDirection: 'column', gap: '3px',
                        maxWidth: '88%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start'
                    }}>
                        <div style={{
                            padding: '9px 13px',
                            borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            fontSize: '13px', lineHeight: 1.5,
                            background: msg.role === 'user'
                                ? 'linear-gradient(135deg, #FF3366, #FF9900)'
                                : '#f3f4f6',
                            color: msg.role === 'user' ? 'white' : '#111',
                        }}>
                            {msg.text.split('\n').map((line, j, arr) => (
                                <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                            ))}
                        </div>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', padding: '0 4px' }}>{msg.time}</span>
                    </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                    <div style={{ alignSelf: 'flex-start' }}>
                        <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: '#f3f4f6', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            {[0, 200, 400].map((delay, i) => (
                                <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#aaa', animation: `assistantBounce 1.2s ease-in-out ${delay}ms infinite` }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Itinerary panel (collapsible) */}
            {itinerary && (
                <div style={{ borderTop: '1px solid var(--border-light)', flexShrink: 0 }}>
                    <button
                        onClick={() => setShowItinerary(v => !v)}
                        style={{ width: '100%', padding: '9px 16px', background: '#fafafa', border: 'none', borderBottom: showItinerary ? '1px solid var(--border-light)' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'inherit' }}
                    >
                        <span>📋 Itinéraire · {itinerary.steps.length} étape{itinerary.steps.length > 1 ? 's' : ''}</span>
                        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontSize: '11px', background: '#eee', padding: '1px 7px', borderRadius: '20px' }}>{itinerary.total_duration}</span>
                            {showItinerary ? '▲' : '▼'}
                        </span>
                    </button>
                    {showItinerary && (
                        <div style={{ maxHeight: '220px', overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {itinerary.steps.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: '8px', padding: '8px 10px', border: '1px solid var(--border-light)', borderRadius: '10px', alignItems: 'flex-start' }}>
                                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF3366, #FF9900)', color: 'white', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {TYPE_EMOJI[s.type] || '📍'} {s.name}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{s.detail}</div>
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap', flexShrink: 0 }}>{s.duration}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Input row */}
            <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border-light)', background: '#fafafa', display: 'flex', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Ex: Je veux visiter 3 endroits en 2h..."
                    rows={1}
                    style={{ flex: 1, border: '1px solid var(--border-light)', borderRadius: '16px', padding: '8px 12px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', resize: 'none', minHeight: '36px', maxHeight: '80px', lineHeight: 1.4, background: 'white' }}
                />
                <button
                    onClick={sendMessage}
                    disabled={loading || !input.trim()}
                    style={{ width: '34px', height: '34px', borderRadius: '50%', border: 'none', background: loading || !input.trim() ? '#ddd' : 'linear-gradient(135deg, #FF3366, #FF9900)', color: 'white', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
                    </svg>
                </button>
            </div>

            {/* GPS bar */}
            <button
                onClick={getGPS}
                style={{ padding: '9px 16px', background: '#f9f9f9', border: 'none', borderTop: '1px solid var(--border-light)', cursor: 'pointer', fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontFamily: 'inherit', flexShrink: 0, transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                onMouseLeave={e => e.currentTarget.style.background = '#f9f9f9'}
            >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, background: gpsStatus === 'active' ? '#22c55e' : gpsStatus === 'denied' ? '#ef4444' : '#ccc' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {gpsStatus === 'idle' && 'Partager ma position GPS pour personnaliser'}
                    {gpsStatus === 'loading' && 'Localisation en cours...'}
                    {gpsStatus === 'active' && `GPS actif · ${userLocation?.lat.toFixed(3)}, ${userLocation?.lng.toFixed(3)}`}
                    {gpsStatus === 'denied' && 'Permission refusée — décris ta position dans le chat'}
                </span>
            </button>

            <style>{`
                @keyframes assistantBounce {
                    0%, 60%, 100% { transform: translateY(0) }
                    30% { transform: translateY(-5px) }
                }
            `}</style>
        </div>
    );
}
