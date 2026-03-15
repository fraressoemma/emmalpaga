'use client';

import { useState, useEffect } from 'react';
import { geocode } from '@/lib/geocode';

const STATUSES = [
    { key: 'todo', emoji: '📌', label: 'À faire' },
    { key: 'in_progress', emoji: '🚀', label: 'En cours' },
    { key: 'done', emoji: '✅', label: 'Fait' },
];

export default function DestinationForm({ destination, onSave, onCancel, categories = [] }) {
    const [form, setForm] = useState({
        name: '',
        image_url: '',
        category: 'desire',
        status: 'todo',
        budget: '',
        companions: [],
        notes: '',
        lat: null,
        lng: null,
    });
    const [companionInput, setCompanionInput] = useState('');
    const [geocoding, setGeocoding] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (destination) {
            setForm({
                name: destination.name || '',
                image_url: destination.image_url || '',
                category: destination.category || 'desire',
                status: destination.status || 'todo',
                budget: destination.budget || '',
                companions: destination.companions || [],
                notes: destination.notes || '',
                lat: destination.lat || null,
                lng: destination.lng || null,
            });
        }
    }, [destination]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const addCompanion = () => {
        const name = companionInput.trim();
        if (name && !form.companions.includes(name)) {
            updateField('companions', [...form.companions, name]);
            setCompanionInput('');
        }
    };

    const removeCompanion = (name) => {
        updateField('companions', form.companions.filter((c) => c !== name));
    };

    const handleCompanionKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addCompanion();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        let finalForm = { ...form };

        // Geocode if we don't have coordinates or name changed
        if (!finalForm.lat || !finalForm.lng || (destination && destination.name !== finalForm.name) || !destination) {
            setGeocoding(true);
            const result = await geocode(finalForm.name);
            if (result) {
                finalForm.lat = result.lat;
                finalForm.lng = result.lng;
            }
            setGeocoding(false);
        }

        await onSave(finalForm);
        setSaving(false);
    };

    const radioGroupStyle = {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    };

    const radioButtonStyle = (isActive, color) => ({
        padding: '8px 16px',
        borderRadius: '10px',
        border: `2px solid ${isActive ? (color || 'var(--accent)') : 'var(--border-light)'}`,
        background: isActive ? `${color || 'var(--accent)'}15` : 'white',
        color: 'var(--text-primary)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
    });

    return (
        <div
            className="animate-fadeIn"
            onClick={onCancel}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'var(--bg-modal-overlay)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
                padding: '20px',
            }}
        >
            <div
                className="animate-slideUp"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    width: '100%',
                    maxWidth: '520px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '24px 24px 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '22px',
                            fontWeight: 800,
                            color: 'var(--text-primary)',
                        }}
                    >
                        {destination ? '✏️ Modifier' : '✨ Nouvelle destination'}
                    </h2>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            padding: '4px',
                        }}
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                    {/* Name */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Destination *
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            value={form.name}
                            onChange={(e) => updateField('name', e.target.value)}
                            placeholder="Ex: Kyoto, Japon"
                            required
                        />
                    </div>

                    {/* Image URL */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Photo (URL)
                        </label>
                        <input
                            className="input-field"
                            type="url"
                            value={form.image_url}
                            onChange={(e) => updateField('image_url', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                        />
                        {form.image_url && (
                            <div
                                style={{
                                    marginTop: '8px',
                                    height: '120px',
                                    borderRadius: 'var(--radius-md)',
                                    overflow: 'hidden',
                                    background: `url(${form.image_url}) center/cover no-repeat`,
                                    border: '1px solid var(--border-light)',
                                }}
                            />
                        )}
                    </div>

                    {/* Category */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Niveau d&apos;envie
                        </label>
                        <div style={radioGroupStyle}>
                            {categories.map((cat) => (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => updateField('category', cat.key)}
                                    style={radioButtonStyle(form.category === cat.key, cat.color)}
                                >
                                    {cat.emoji} {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Statut
                        </label>
                        <div style={radioGroupStyle}>
                            {STATUSES.map((st) => (
                                <button
                                    key={st.key}
                                    type="button"
                                    onClick={() => updateField('status', st.key)}
                                    style={radioButtonStyle(
                                        form.status === st.key,
                                        st.key === 'done' ? 'var(--color-done)' : st.key === 'in_progress' ? 'var(--accent)' : 'var(--color-dream)'
                                    )}
                                >
                                    {st.emoji} {st.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            💰 Budget estimé
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            value={form.budget}
                            onChange={(e) => updateField('budget', e.target.value)}
                            placeholder="Ex: 2 000€ – 3 000€"
                        />
                    </div>

                    {/* Companions */}
                    <div style={{ marginBottom: '18px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            👥 Avec qui
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                className="input-field"
                                type="text"
                                value={companionInput}
                                onChange={(e) => setCompanionInput(e.target.value)}
                                onKeyDown={handleCompanionKeyDown}
                                placeholder="Tapez un nom + Entrée"
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                onClick={addCompanion}
                                className="btn-secondary"
                                style={{ padding: '10px 16px', flexShrink: 0 }}
                            >
                                +
                            </button>
                        </div>
                        {form.companions.length > 0 && (
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                {form.companions.map((name, i) => (
                                    <span key={i} className="tag">
                                        {name}
                                        <span className="tag-remove" onClick={() => removeCompanion(name)}>✕</span>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            📝 Notes personnelles
                        </label>
                        <textarea
                            className="input-field"
                            value={form.notes}
                            onChange={(e) => updateField('notes', e.target.value)}
                            placeholder="Vos réflexions, idées, dates souhaitées..."
                            rows={4}
                            style={{ resize: 'vertical', minHeight: '80px' }}
                        />
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={saving || !form.name}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                opacity: saving || !form.name ? 0.6 : 1,
                                cursor: saving || !form.name ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {saving
                                ? geocoding
                                    ? '📍 Géolocalisation...'
                                    : '⏳ Enregistrement...'
                                : destination
                                    ? '💾 Enregistrer'
                                    : '✨ Ajouter'}
                        </button>
                        <button type="button" className="btn-secondary" onClick={onCancel}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
