'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_META = {
    todo:        { emoji: '📌', label: 'À faire' },
    in_progress: { emoji: '🚀', label: 'En cours' },
    done:        { emoji: '✅', label: 'Fait' },
};

// Modern flat map pin with Peruvian colors
function createCircleIcon(color, isDone, currentZoom = 4) {
    const zoomScale = Math.max(0.5, Math.min(1.0, currentZoom / 8));
    const finalScale = (isDone ? 0.8 : 1.0) * zoomScale;
    const opacity = isDone ? 0.6 : 1.0;
    const uid = color.replace('#', '');

    const svgContent = `
      <svg width="32" height="42" viewBox="0 0 32 42" style="overflow: visible; filter: drop-shadow(0px 4px 6px rgba(0,0,0,0.3)); transform: scale(${finalScale}); transform-origin: center bottom; opacity: ${opacity}; transition: transform 0.2s ease;">
        <defs>
          <radialGradient id="glow_${uid}" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stop-color="#fff" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Teardrop body -->
        <path d="M16,2 C8.3,2 2,8.3 2,16 C2,24.5 16,40 16,40 C16,40 30,24.5 30,16 C30,8.3 23.7,2 16,2 Z" fill="${color}" />

        <!-- Glossy overlay -->
        <path d="M16,2 C8.3,2 2,8.3 2,16 C2,24.5 16,40 16,40 C16,40 30,24.5 30,16 C30,8.3 23.7,2 16,2 Z" fill="url(#glow_${uid})" />

        <!-- Inner circle / checkmark -->
        ${isDone
            ? `<circle cx="16" cy="15" r="7" fill="rgba(255,255,255,0.25)" />
               <text x="16" y="20" font-family="sans-serif" font-size="11" font-weight="900" fill="white" text-anchor="middle">✓</text>`
            : `<circle cx="16" cy="15" r="5" fill="rgba(255,255,255,0.9)" />`
        }
      </svg>
    `;

    return L.divIcon({
        className: 'custom-pin-marker',
        html: svgContent,
        iconSize: [32, 42],
        iconAnchor: [16, 40],
        popupAnchor: [0, -42],
    });
}

export default function MapComponent({ destinations, selectedId, onSelectDestination, sidebarVisible, categories = [] }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const [zoomLevel, setZoomLevel] = useState(6);
    const [hoveredDest, setHoveredDest] = useState(null); // { dest, x, y }

    // Resize map canvas after sidebar transition (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            mapInstanceRef.current?.invalidateSize();
        }, 320);
        return () => clearTimeout(timer);
    }, [sidebarVisible]);

    // Initialize map
    useEffect(() => {
        if (mapInstanceRef.current) return;

        mapInstanceRef.current = L.map(mapRef.current, {
            center: [-9.5, -75], // Focused on Peru
            zoom: 6,
            minZoom: 3,
            maxZoom: 18,
            zoomControl: false,
            attributionControl: false,
        });

        // Vibrant light basemap tile layer (CartoDB Voyager)
        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
                maxZoom: 19,
            }
        ).addTo(mapInstanceRef.current);

        // Zoom control bottom-right
        L.control.zoom({ position: 'bottomright' }).addTo(mapInstanceRef.current);

        // Attribution bottom-left
        L.control.attribution({ position: 'bottomleft', prefix: false })
            .addAttribution('© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>')
            .addTo(mapInstanceRef.current);

        // Listen for zoom changes
        mapInstanceRef.current.on('zoomend', () => {
            if (mapInstanceRef.current) {
                setZoomLevel(mapInstanceRef.current.getZoom());
            }
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update markers when destinations change
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map) return;

        // Remove old markers
        Object.values(markersRef.current).forEach((m) => map.removeLayer(m));
        markersRef.current = {};

        // Add new markers
        destinations.forEach((dest) => {
            if (dest.lat && dest.lng) {
                const catObj = categories.find(c => c.key === dest.category) || categories[0] || { color: '#00C2B2' };
                const color = catObj.color;
                const isDone = dest.status === 'done';
                const icon = createCircleIcon(color, isDone, zoomLevel);

                const marker = L.marker([dest.lat, dest.lng], { icon })
                    .addTo(map)
                    .on('click', () => onSelectDestination(dest))
                    .on('mouseover', () => {
                        const pt = map.latLngToContainerPoint([dest.lat, dest.lng]);
                        setHoveredDest({ dest, x: pt.x, y: pt.y });
                    })
                    .on('mouseout', () => setHoveredDest(null));

                markersRef.current[dest.id] = marker;
            }
        });
    }, [destinations, onSelectDestination, zoomLevel]);

    // Fly to selected destination
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedId) return;

        const dest = destinations.find((d) => d.id === selectedId);
        if (dest && dest.lat && dest.lng) {
            map.flyTo([dest.lat, dest.lng], 6, {
                duration: 1.5,
                easeLinearity: 0.25,
            });

            // Pulse the selected marker
            const marker = markersRef.current[selectedId];
            if (marker) {
                const el = marker.getElement();
                if (el) {
                    el.style.transform = `${el.style.transform} scale(1.3)`;
                    setTimeout(() => {
                        el.style.transform = el.style.transform.replace('scale(1.3)', '');
                    }, 600);
                }
            }
        }
    }, [selectedId, destinations]);

    return (
        <>
            {/* Pin hover quick-view card */}
            {hoveredDest && (() => {
                const { dest, x, y } = hoveredDest;
                const cat = categories.find(c => c.key === dest.category) || { emoji: '🔍', label: dest.category || 'Curiosité', color: '#00C2B2' };
                const status = STATUS_META[dest.status] || STATUS_META.todo;
                return (
                    <div
                        style={{
                            position: 'absolute',
                            left: x,
                            top: y - 16,
                            transform: 'translate(-50%, -100%)',
                            zIndex: 1000,
                            pointerEvents: 'none',
                            background: 'rgba(255,255,255,0.97)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '14px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            border: `2px solid ${cat.color}30`,
                            width: '220px',
                            overflow: 'hidden',
                            animation: 'fadeInUp 0.15s ease',
                        }}
                    >
                        {/* Image */}
                        <div style={{
                            height: '100px',
                            background: dest.image_url
                                ? `url(${dest.image_url}) center/cover no-repeat`
                                : `linear-gradient(135deg, ${cat.color}22, ${cat.color}55)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                        }}>
                            {!dest.image_url && cat.emoji}
                        </div>
                        {/* Info */}
                        <div style={{ padding: '10px 12px 12px' }}>
                            <p style={{
                                fontFamily: "'Outfit', sans-serif",
                                fontSize: '14px',
                                fontWeight: 800,
                                color: '#1a1a2e',
                                marginBottom: '6px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>{dest.name}</p>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    background: `${cat.color}20`,
                                    color: cat.color,
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}>{cat.emoji} {cat.label}</span>
                                <span style={{
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                    background: 'rgba(0,0,0,0.06)',
                                    color: '#555',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                }}>{status.emoji} {status.label}</span>
                            </div>
                            {dest.note && (
                                <p style={{
                                    fontSize: '11px',
                                    color: '#888',
                                    marginTop: '6px',
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    lineHeight: '1.4',
                                }}>{dest.note}</p>
                            )}
                        </div>
                    </div>
                );
            })()}

            <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, calc(-100% + 8px)); }
          to   { opacity: 1; transform: translate(-50%, -100%); }
        }
        .map-tooltip {
          background: rgba(255, 255, 255, 0.95) !important;
          backdrop-filter: blur(8px);
          color: var(--text-primary) !important;
          border: 1px solid var(--border-light) !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15) !important;
        }
        .map-tooltip::before {
          border-top-color: rgba(255, 255, 255, 0.95) !important;
        }
        .custom-marker {
          background: none !important;
          border: none !important;
        }
      `}</style>
            <div
                ref={mapRef}
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    inset: 0,
                }}
            />
        </>
    );
}
