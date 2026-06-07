'use client';
import { useState, useEffect } from 'react';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';

const STORAGE_KEY = 'sanscigarette_v1';

export default function SmokePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProfile(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  const save = (p) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setProfile(p);
  };

  const handleSetup = (data) => {
    save({ ...data, cravings: [], setupAt: Date.now() });
  };

  const handleUpdate = (updates) => {
    save({ ...profile, ...updates });
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser complètement ? Toutes tes données seront perdues.')) {
      localStorage.removeItem(STORAGE_KEY);
      setProfile(null);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070d0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: '40px' }}>🚭</span>
      </div>
    );
  }

  return !profile
    ? <Onboarding onSetup={handleSetup} />
    : <Dashboard profile={profile} onUpdate={handleUpdate} onReset={handleReset} />;
}
