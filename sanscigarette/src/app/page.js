'use client';
import { useState, useEffect } from 'react';
import Onboarding from './Onboarding';
import Dashboard from './Dashboard';

const STORAGE_KEY = 'sanscigarette_v1';

export default function App() {
  const [state, setState] = useState({ profile: null, loading: true });

  useEffect(() => {
    let profile = null;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) profile = JSON.parse(saved);
    } catch {}
    setState({ profile, loading: false });
  }, []);

  const { profile, loading } = state;

  const save = (p) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    setState({ profile: p, loading: false });
  };

  const handleSetup = (data) => save({ ...data, cravings: [], setupAt: Date.now() });
  const handleUpdate = (updates) => save({ ...profile, ...updates });
  const handleReset = () => {
    if (window.confirm('Réinitialiser complètement ? Toutes tes données seront perdues.')) {
      localStorage.removeItem(STORAGE_KEY);
      setState({ profile: null, loading: false });
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: '#070d0a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '48px' }}>🚭</span>
      </div>
    );
  }

  return !profile
    ? <Onboarding onSetup={handleSetup} />
    : <Dashboard profile={profile} onUpdate={handleUpdate} onReset={handleReset} />;
}
