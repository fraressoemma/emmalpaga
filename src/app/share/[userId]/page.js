'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { useParams } from 'next/navigation';
import nextDynamic from 'next/dynamic';

const MapComponent = nextDynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: 'var(--bg-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)',
            }}
        >
            🗺️ Chargement...
        </div>
    ),
});

const CATEGORY_MAP = {
    dream: { emoji: '🌟', label: 'Rêve', className: 'badge-dream' },
    desire: { emoji: '✈️', label: 'Envie', className: 'badge-desire' },
    curiosity: { emoji: '🔍', label: 'Curiosité', className: 'badge-curiosity' },
};

const STATUS_MAP = {
    todo: { emoji: '📌', label: 'À faire', className: 'badge-todo' },
    in_progress: { emoji: '🚀', label: 'En cours', className: 'badge-in_progress' },
    done: { emoji: '✅', label: 'Fait', className: 'badge-done' },
};

export default function SharePage() {
    const params = useParams();
    const userId = params.userId;
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDest, setSelectedDest] = useState(null);
    const [displayName, setDisplayName] = useState('');

    useEffect(() => {
        async function fetchPublicData() {
            try {
                // Fetch profile
                const profileQuery = query(collection(db, 'profiles'), where('id', '==', userId));
                const profileSnapshot = await getDocs(profileQuery);

                if (profileSnapshot.empty || !profileSnapshot.docs[0].data().sharing_enabled) {
                    setError('Cette liste n\'est pas partagée ou n\'existe pas.');
                    setLoading(false);
                    return;
                }

                const profileData = profileSnapshot.docs[0].data();
                setDisplayName(profileData.display_name || 'Voyageur');

                // Fetch public destinations
                const destQuery = query(
                    collection(db, 'destinations'),
                    where('user_id', '==', userId),
                    where('is_public', '==', true)
                );

                // Try with ordering first, fallback if index is missing
                try {
                    const orderedQuery = query(destQuery, orderBy('created_at', 'desc'));
                    const destSnapshot = await getDocs(orderedQuery);
                    setDestinations(destSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                } catch (orderError) {
                    console.log("Index for ordering might be missing, falling back to unordered", orderError);
                    const destSnapshot = await getDocs(destQuery);
                    const data = destSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Sort locally
                    data.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
                    setDestinations(data);
                }
            } catch (err) {
                console.error("Error fetching public data:", err);
                setError('Impossible de charger les destinations.');
            }

            setLoading(false);
        }

        fetchPublicData();
    }, [userId]);

    const handleSelectDestination = useCallback((dest) => {
        setSelectedDest(dest);
    }, []);

    if (loading) {
        return (
            <div
                style={{
                    height: '100vh',
                    background: 'var(--bg-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-muted)',
                }}
            >
                <div className="animate-float" style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '48px', marginBottom: '16px' }}>🌍</p>
                    <p>Chargement de la liste...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    height: '100vh',
                    background: 'var(--bg-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-primary)',
                    textAlign: 'center',
                    padding: '20px',
                }}
            >
                <div>
                    <p style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</p>
                    <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '24px', marginBottom: '12px' }}>
                        Liste non disponible
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>{error}</p>
                    <a
                        href="/"
                        style={{
                            display: 'inline-block',
                            marginTop: '24px',
                            padding: '12px 24px',
                            background: 'var(--accent)',
                            color: 'white',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Créer ma propre liste
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
            {/* Header */}
            <nav
                style={{
                    height: '60px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 24px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '24px' }}>🌍</span>
                    <div>
                        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            Travel List de {displayName}
                        </h1>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {destinations.length} destination{destinations.length !== 1 ? 's' : ''} • Vue publique
                        </p>
                    </div>
                </div>
                <a
                    href="/"
                    style={{
                        padding: '8px 16px',
                        background: 'var(--accent)',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                >
                    Créer ma liste
                </a>
            </nav>

            {/* Content */}
            <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
                {/* Map */}
                <div style={{ flex: 1, position: 'relative' }}>
                    <MapComponent
                        destinations={destinations}
                        selectedId={selectedDest?.id}
                        onSelectDestination={handleSelectDestination}
                    />
                </div>

                {/* List */}
                <div
                    style={{
                        width: '380px',
                        background: 'var(--bg-sidebar)',
                        borderLeft: '1px solid var(--border-light)',
                        overflow: 'auto',
                        padding: '20px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {destinations.map((dest) => {
                            const cat = CATEGORY_MAP[dest.category] || CATEGORY_MAP.curiosity;
                            const status = STATUS_MAP[dest.status] || STATUS_MAP.todo;
                            const isSelected = dest.id === selectedDest?.id;

                            return (
                                <div
                                    key={dest.id}
                                    onClick={() => setSelectedDest(dest)}
                                    style={{
                                        background: isSelected ? 'var(--accent-light)' : 'var(--bg-card)',
                                        border: `1.5px solid ${isSelected ? 'var(--accent)' : 'var(--border-light)'}`,
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                    }}
                                >
                                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>
                                        {dest.name}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        <span className={`badge ${cat.className}`}>{cat.emoji} {cat.label}</span>
                                        <span className={`badge ${status.className}`}>{status.emoji} {status.label}</span>
                                    </div>
                                    {dest.notes && (
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
                                            {dest.notes.length > 100 ? dest.notes.substring(0, 100) + '...' : dest.notes}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
