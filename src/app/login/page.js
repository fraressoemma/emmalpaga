'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { signIn, signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
                router.push('/');
            } else {
                await signUp(email, password);
                setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="auth-gradient"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <div
                className="animate-slideUp"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div
                        className="animate-float"
                        style={{ fontSize: '56px', marginBottom: '16px' }}
                    >
                        🌍
                    </div>
                    <h1
                        style={{
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '32px',
                            fontWeight: 800,
                            color: 'white',
                            marginBottom: '8px',
                            letterSpacing: '-0.03em',
                        }}
                    >
                        My Travel List
                    </h1>
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '15px',
                            fontWeight: 400,
                        }}
                    >
                        Votre bucket list de voyages personnelle
                    </p>
                </div>

                {/* Card */}
                <div
                    className="glass"
                    style={{
                        borderRadius: 'var(--radius-xl)',
                        padding: '36px',
                    }}
                >
                    {/* Tabs */}
                    <div
                        style={{
                            display: 'flex',
                            background: 'rgba(255,255,255,0.06)',
                            borderRadius: '12px',
                            padding: '4px',
                            marginBottom: '28px',
                        }}
                    >
                        <button
                            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                border: 'none',
                                background: isLogin ? 'rgba(255,255,255,0.15)' : 'transparent',
                                color: isLogin ? 'white' : 'rgba(255,255,255,0.4)',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Connexion
                        </button>
                        <button
                            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '10px',
                                border: 'none',
                                background: !isLogin ? 'rgba(255,255,255,0.15)' : 'transparent',
                                color: !isLogin ? 'white' : 'rgba(255,255,255,0.4)',
                                fontSize: '14px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Inscription
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '18px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'rgba(255,255,255,0.6)',
                                    marginBottom: '6px',
                                }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="vous@exemple.com"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '1.5px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: 'rgba(255,255,255,0.6)',
                                    marginBottom: '6px',
                                }}
                            >
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Min. 6 caractères"
                                required
                                minLength={6}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: '10px',
                                    border: '1.5px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: 'white',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                            />
                        </div>

                        {error && (
                            <div
                                style={{
                                    padding: '12px 16px',
                                    marginBottom: '16px',
                                    borderRadius: '10px',
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#fca5a5',
                                    fontSize: '13px',
                                }}
                            >
                                {error}
                            </div>
                        )}

                        {success && (
                            <div
                                style={{
                                    padding: '12px 16px',
                                    marginBottom: '16px',
                                    borderRadius: '10px',
                                    background: 'rgba(34, 197, 94, 0.15)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    color: '#86efac',
                                    fontSize: '13px',
                                }}
                            >
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '13px',
                                borderRadius: '12px',
                                border: 'none',
                                background: loading
                                    ? 'rgba(99,102,241,0.5)'
                                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
                            }}
                        >
                            {loading
                                ? '⏳ Chargement...'
                                : isLogin
                                    ? '🚀 Se connecter'
                                    : '✨ Créer mon compte'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p
                    style={{
                        textAlign: 'center',
                        marginTop: '24px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.3)',
                    }}
                >
                    Explorez le monde, une destination à la fois ✈️
                </p>
            </div>
        </div>
    );
}
