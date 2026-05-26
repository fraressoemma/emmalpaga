'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const { signIn, signUp } = useAuth();
    const { lang, t, toggleLang } = useLanguage();
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
                setSuccess(t.accountCreated);
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
                position: 'relative',
            }}
        >
            {/* Language toggle */}
            <button
                onClick={toggleLang}
                title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    cursor: 'pointer',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                    zIndex: 10,
                }}
            >
                {lang === 'fr' ? 'EN' : 'FR'}
            </button>

            <div
                className="animate-slideUp"
                style={{
                    width: '100%',
                    maxWidth: '420px',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <img
                        src="/wayki-logo.png"
                        alt="Wayki"
                        style={{ height: '64px', width: 'auto', marginBottom: '12px' }}
                    />
                    <p
                        style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '15px',
                            fontWeight: 400,
                        }}
                    >
                        {t.tagline}
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
                            {t.login}
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
                            {t.signup}
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
                                {t.email}
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t.emailPlaceholder}
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
                                {t.password}
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t.passwordPlaceholder}
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
                                    ? 'rgba(196,112,74,0.5)'
                                    : 'linear-gradient(135deg, #c4704a, #7a9e7e)',
                                color: 'white',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 15px rgba(196, 112, 74, 0.35)',
                            }}
                        >
                            {loading
                                ? t.loadingBtn
                                : isLogin
                                    ? t.loginBtn
                                    : t.signupBtn}
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
                    {t.footerTagline}
                </p>
            </div>
        </div>
    );
}
