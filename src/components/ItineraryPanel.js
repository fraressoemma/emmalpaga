'use client';
import { useState, useEffect } from 'react';

function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDuration(seconds) {
    if (seconds == null || seconds < 0) return null;
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

function formatDistance(km) {
    if (km < 100) return `${km.toFixed(0)} km`;
    return `${Math.round(km).toLocaleString('fr-FR')} km`;
}

function estimateFlightSeconds(distKm) {
    const speed = distKm < 1500 ? 700 : 880; // km/h
    const overhead = distKm < 800 ? 3600 : distKm < 4000 ? 5400 : 7200; // boarding + taxi
    return (distKm / speed) * 3600 + overhead;
}

export default function ItineraryPanel({ destinations, categories = [] }) {
    const [position, setPosition] = useState(null);
    const [locationName, setLocationName] = useState(null);
    const [geoLoading, setGeoLoading] = useState(true);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    // Geolocation + reverse geocode
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Géolocalisation non supportée');
            setGeoLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const { latitude: lat, longitude: lng } = coords;
                setPosition({ lat, lng });
                setGeoLoading(false);
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
                        { headers: { 'Accept-Language': 'fr' } }
                    );
                    const data = await res.json();
                    const city =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county;
                    const country = data.address?.country;
                    setLocationName(city ? `${city}, ${country}` : country || 'Position actuelle');
                } catch {
                    setLocationName('Position actuelle');
                }
            },
            () => {
                setError('Permission de localisation refusée');
                setGeoLoading(false);
            },
            { timeout: 10000 }
        );
    }, []);

    // Compute distances then fetch car routes via OSRM
    useEffect(() => {
        if (!position) return;

        const destsWithCoords = destinations.filter((d) => d.lat && d.lng);

        const initial = destsWithCoords
            .map((dest) => {
                const distKm = haversine(position.lat, position.lng, dest.lat, dest.lng);
                return {
                    dest,
                    distKm,
                    flightSeconds: estimateFlightSeconds(distKm),
                    carSeconds: null,
                };
            })
            .sort((a, b) => a.distKm - b.distKm);

        setResults(initial);

        const fetchRoutes = async () => {
            for (let i = 0; i < initial.length; i++) {
                const { distKm, dest } = initial[i];

                // Skip cross-ocean routes (no road possible)
                if (distKm > 4000) {
                    setResults((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], carSeconds: -1 };
                        return next;
                    });
                    continue;
                }

                try {
                    const res = await fetch(
                        `https://router.project-osrm.org/route/v1/driving/${position.lng},${position.lat};${dest.lng},${dest.lat}?overview=false`,
                        { signal: AbortSignal.timeout(8000) }
                    );
                    const data = await res.json();
                    const duration =
                        data.code === 'Ok' ? (data.routes?.[0]?.duration ?? -1) : -1;
                    setResults((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], carSeconds: duration };
                        return next;
                    });
                } catch {
                    setResults((prev) => {
                        const next = [...prev];
                        next[i] = { ...next[i], carSeconds: -1 };
                        return next;
                    });
                }

                await new Promise((r) => setTimeout(r, 150));
            }
        };

        fetchRoutes();
    }, [position, destinations]);

    if (geoLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>📍</div>
                <p style={{ fontSize: '14px' }}>Localisation en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>🚫</div>
                <p style={{ fontSize: '14px', color: '#dc2626', fontWeight: 600 }}>{error}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Autorisez la localisation dans votre navigateur
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '0 20px 20px' }}>
            {/* Current location chip */}
            <div
                style={{
                    background: 'linear-gradient(135deg, rgba(255,51,102,0.06), rgba(0,194,178,0.06))',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <span style={{ fontSize: '20px' }}>📍</span>
                <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Depuis
                    </p>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {locationName || 'Position actuelle'}
                    </p>
                </div>
            </div>

            {/* Destination list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {results.map(({ dest, distKm, flightSeconds, carSeconds }, i) => {
                    const catColor = (categories.find(c => c.key === dest.category) || { color: '#00C2B2' }).color;
                    const flightLabel = formatDuration(flightSeconds);
                    const carLabel = formatDuration(carSeconds);

                    return (
                        <div
                            key={dest.id}
                            style={{
                                background: 'var(--bg-card)',
                                border: '1.5px solid var(--border-light)',
                                borderRadius: '14px',
                                padding: '12px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '9px',
                            }}
                        >
                            {/* Name row */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                    style={{
                                        width: '22px',
                                        height: '22px',
                                        borderRadius: '50%',
                                        background: catColor,
                                        color: 'white',
                                        fontSize: '10px',
                                        fontWeight: 800,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <p
                                    style={{
                                        fontFamily: "'Outfit', sans-serif",
                                        fontSize: '14px',
                                        fontWeight: 700,
                                        color: 'var(--text-primary)',
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {dest.name}
                                </p>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', flexShrink: 0 }}>
                                    {formatDistance(distKm)}
                                </span>
                            </div>

                            {/* Duration chips */}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {/* Flight */}
                                <div
                                    style={{
                                        flex: 1,
                                        background: 'rgba(255,153,0,0.07)',
                                        border: '1px solid rgba(255,153,0,0.25)',
                                        borderRadius: '10px',
                                        padding: '7px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                    }}
                                >
                                    <span style={{ fontSize: '16px' }}>✈️</span>
                                    <div>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Vol</p>
                                        <p style={{ fontSize: '13px', fontWeight: 800, color: '#B36A00' }}>{flightLabel}</p>
                                    </div>
                                </div>

                                {/* Car */}
                                <div
                                    style={{
                                        flex: 1,
                                        background: carLabel ? 'rgba(0,194,178,0.07)' : 'rgba(0,0,0,0.03)',
                                        border: `1px solid ${carLabel ? 'rgba(0,194,178,0.25)' : 'rgba(0,0,0,0.07)'}`,
                                        borderRadius: '10px',
                                        padding: '7px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '7px',
                                    }}
                                >
                                    <span style={{ fontSize: '16px' }}>🚗</span>
                                    <div>
                                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Route</p>
                                        <p
                                            style={{
                                                fontSize: '13px',
                                                fontWeight: 800,
                                                color: carLabel ? '#007A72' : 'var(--text-muted)',
                                            }}
                                        >
                                            {carSeconds === null ? '…' : carLabel || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {results.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px', padding: '40px 0' }}>
                        Aucune destination avec coordonnées
                    </p>
                )}
            </div>
        </div>
    );
}
