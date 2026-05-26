'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  getDestinations,
  addDestination,
  updateDestination,
  deleteDestination,
  getProfile,
  updateProfile,
  exportAllData,
  getTrips,
  addTrip,
  deleteTrip,
} from '@/lib/storage';
import CategoryManager from '@/components/CategoryManager';
import TripSelector from '@/components/TripSelector';
import SearchBar from '@/components/SearchBar';
import Filters from '@/components/Filters';
import DestinationList from '@/components/DestinationList';
import ItineraryPanel from '@/components/ItineraryPanel';
import FloatingAssistant from '@/components/FloatingAssistant';
import DestinationModal from '@/components/DestinationModal';
import DestinationForm from '@/components/DestinationForm';
import { exportToPdf } from '@/components/PdfExport';
import nextDynamic from 'next/dynamic';

// Dynamic import for map (no SSR)
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
        color: 'var(--text-muted)',
        fontSize: '14px',
      }}
    >
      🗺️ Loading map...
    </div>
  ),
});

export default function HomePage() {
  const { user, signOut } = useAuth();
  const { lang, t, toggleLang } = useLanguage();

  const DEFAULT_CATEGORIES = [
    { key: 'dream', emoji: '🌟', label: t.catDream, color: '#c4704a' },
    { key: 'desire', emoji: '🤩', label: t.catDesire, color: '#7a9e7e' },
    { key: 'curiosity', emoji: '🔍', label: t.catCuriosity, color: '#9b7ec8' },
  ];

  // State
  const [destinations, setDestinations] = useState([]);
  const [customCategories, setCustomCategories] = useState([]);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [sharingEnabled, setSharingEnabled] = useState(false);
  const [mobileView, setMobileView] = useState('list'); // 'list' or 'map'
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('destinations'); // 'destinations' | 'itinerary'
  const [showAccount, setShowAccount] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load destinations from Firestore
  const fetchDestinations = useCallback(async () => {
    const data = await getDestinations();
    setDestinations(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Load trips
  useEffect(() => {
    getTrips().then(setTrips);
  }, []);

  // Load profile (sharing status + custom categories)
  useEffect(() => {
    getProfile().then((profile) => {
      setSharingEnabled(profile.sharing_enabled || false);
      if (profile.custom_categories) {
        setCustomCategories(profile.custom_categories);
      }
    });
  }, []);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Trip filter
      if (selectedTripId && dest.tripId !== selectedTripId) return false;
      // Search filter
      if (search && !dest.name.toLowerCase().includes(search.toLowerCase())) return false;
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(dest.category)) return false;
      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(dest.status)) return false;
      return true;
    });
  }, [destinations, search, selectedCategories, selectedStatuses, selectedTripId]);

  // Handlers
  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleSelectDestination = useCallback((dest) => {
    setSelectedDestination(dest);
    setShowModal(true);
  }, []);

  const handleAddNew = () => {
    setEditingDestination(null);
    setShowForm(true);
  };

  const handleEdit = (dest) => {
    setShowModal(false);
    setEditingDestination(dest);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    if (editingDestination) {
      await updateDestination(editingDestination.id, formData);
    } else {
      await addDestination(formData);
    }
    fetchDestinations();
    setShowForm(false);
    setEditingDestination(null);
  };

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return;

    await deleteDestination(id);
    fetchDestinations();
    setShowModal(false);
    setSelectedDestination(null);
  };

  const handleToggleShare = async () => {
    const newValue = !sharingEnabled;
    await updateProfile({ sharing_enabled: newValue });
    setSharingEnabled(newValue);

    if (newValue) {
      const shareUrl = `${window.location.origin}/share/${user.id}`;
      try {
        navigator.clipboard.writeText(shareUrl);
        alert(`${t.linkCopied}\n${shareUrl}`);
      } catch {
        alert(`${t.shareLink}\n${shareUrl}`);
      }
    }
  };

  const handleAddTrip = async (name, color) => {
    const trip = await addTrip(name, color);
    setTrips((prev) => [...prev, trip]);
    setSelectedTripId(trip.id);
  };

  const handleDeleteTrip = async (id) => {
    if (!confirm(t.confirmDeleteTrip)) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
    if (selectedTripId === id) setSelectedTripId(null);
  };

  const handleAddCategory = async (cat) => {
    const updated = [...customCategories, cat];
    setCustomCategories(updated);
    await updateProfile({ custom_categories: updated });
  };

  const handleDeleteCategory = async (key) => {
    const updated = customCategories.filter(c => c.key !== key);
    setCustomCategories(updated);
    await updateProfile({ custom_categories: updated });
  };

  const handleExportPdf = () => {
    exportToPdf(filteredDestinations);
  };

  const handleExportJSON = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile view toggle */}
      <div
        className="mobile-only"
        style={{
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          padding: '8px 16px',
          gap: '8px',
          flexShrink: 0,
          zIndex: 999,
        }}
      >
        <button
          onClick={() => setMobileView('list')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: mobileView === 'list' ? 'var(--accent)' : 'var(--bg-card)',
            color: mobileView === 'list' ? 'white' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          📋 {t.list}
        </button>
        <button
          onClick={() => setMobileView('map')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: mobileView === 'map' ? 'var(--accent)' : 'var(--bg-card)',
            color: mobileView === 'map' ? 'white' : 'var(--text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🗺️ {t.map}
        </button>
      </div>

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Map (left) */}
        <div
          className={mobileView === 'list' ? 'desktop-only' : ''}
          style={{
            flex: 1,
            position: 'relative',
            background: 'var(--bg-dark)',
          }}
        >
          <MapComponent
            destinations={filteredDestinations}
            selectedId={selectedDestination?.id}
            onSelectDestination={handleSelectDestination}
            sidebarVisible={sidebarVisible}
            categories={allCategories}
            mobileView={mobileView}
          />

          {/* Sidebar toggle button */}
          <button
            className="desktop-only"
            onClick={() => setSidebarVisible(v => !v)}
            title={sidebarVisible ? t.hideSidebar : t.showSidebar}
            style={{
              position: 'absolute',
              top: '50%',
              right: '0',
              transform: 'translateY(-50%)',
              zIndex: 600,
              width: '24px',
              height: '56px',
              borderRadius: '8px 0 0 8px',
              border: '1px solid var(--border-light)',
              borderRight: 'none',
              background: 'var(--bg-sidebar)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-sidebar)'}
          >
            {sidebarVisible ? '›' : '‹'}
          </button>

          {/* Wayki logo overlay */}
          <div
            className="desktop-only"
            style={{ position: 'absolute', top: '0px', left: '8px', zIndex: 500 }}
          >
            <img src="/wayki-logo.png" alt="Wayki" style={{ height: '120px', width: 'auto' }} />
          </div>
        </div>

        {/* Sidebar (right) */}
        <div
          className={mobileView === 'map' ? 'desktop-only' : ''}
          style={{
            width: sidebarVisible ? '420px' : '0',
            maxWidth: '100%',
            background: 'var(--bg-sidebar)',
            borderLeft: sidebarVisible ? '1px solid var(--border-light)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            flexShrink: 0,
          }}
        >
          {/* Compte & notifications */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative' }}>
            {/* Avatar + nom */}
            <button
              onClick={() => { setShowAccount(v => !v); setShowNotifications(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 'var(--radius-md)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-light)', border: '1px solid var(--accent-border)', color: 'var(--accent)', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email?.split('@')[0]}
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Actions droite : langue + cloche */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {/* Toggle langue */}
              <button
                onClick={toggleLang}
                title={lang === 'fr' ? 'Switch to English' : 'Passer en français'}
                style={{ background: 'none', border: '1px solid var(--border-light)', cursor: 'pointer', padding: '3px 7px', borderRadius: 'var(--radius-sm)', fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.04em', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.color = 'var(--accent)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {lang === 'fr' ? 'EN' : 'FR'}
              </button>

              {/* Cloche notifications */}
              <button
                onClick={() => { setShowNotifications(v => !v); setShowAccount(false); }}
                style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                title={t.notifications}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </button>
            </div>

            {/* Dropdown compte */}
            {showAccount && (
              <div className="animate-slideUp" style={{ position: 'absolute', top: '52px', left: '12px', right: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '6px', zIndex: 900 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.myAccount}</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{user?.email}</p>
                </div>
                <AccountMenuBtn onClick={() => setShowAccount(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                  {t.profile}
                </AccountMenuBtn>
                <AccountMenuBtn onClick={() => setShowAccount(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  {t.settings}
                </AccountMenuBtn>
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '4px', paddingTop: '4px' }}>
                  <AccountMenuBtn onClick={() => { signOut(); setShowAccount(false); }} danger>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    {t.logout}
                  </AccountMenuBtn>
                </div>
              </div>
            )}

            {/* Dropdown notifications */}
            {showNotifications && (
              <div className="animate-slideUp" style={{ position: 'absolute', top: '52px', left: '12px', right: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-xl)', padding: '6px', zIndex: 900 }}>
                <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.notifications}</p>
                </div>
                <div style={{ padding: '20px 12px', textAlign: 'center' }}>
                  <p style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</p>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.noNotifications}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar header */}
          <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '20px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0' }}>
              {[
                { key: 'destinations', label: t.tabDestinations },
                { key: 'itinerary', label: t.tabDistances },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSidebarTab(key)}
                  style={{
                    padding: '8px 14px',
                    border: 'none',
                    background: 'transparent',
                    color: sidebarTab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: sidebarTab === key ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    borderBottom: `2px solid ${sidebarTab === key ? 'var(--accent)' : 'transparent'}`,
                    marginBottom: '-1px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {sidebarTab === 'destinations' && (
              <>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    {t.destinations}
                  </h2>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {t.results(filteredDestinations.length)}
                  </span>
                </div>
                <TripSelector
                  trips={trips}
                  selectedTripId={selectedTripId}
                  onSelectTrip={setSelectedTripId}
                  onAddTrip={handleAddTrip}
                  onDeleteTrip={handleDeleteTrip}
                />
                <SearchBar value={search} onChange={setSearch} />
                <Filters
                  categories={allCategories}
                  selectedCategories={selectedCategories}
                  selectedStatuses={selectedStatuses}
                  onCategoryToggle={handleCategoryToggle}
                  onStatusToggle={handleStatusToggle}
                  onManageCategories={() => setShowCategoryManager(true)}
                />
              </>
            )}

            {sidebarTab === 'itinerary' && (
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '2px' }}>
                  {t.distances}
                </h2>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.distancesSubtitle}</p>
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflow: sidebarTab === 'assistant' ? 'hidden' : 'auto', padding: sidebarTab === 'assistant' ? '0' : '0 0 20px', display: 'flex', flexDirection: 'column' }}>
            {sidebarTab === 'destinations' && (
              loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p className="animate-float" style={{ fontSize: '32px' }}>🗺️</p>
                  <p style={{ marginTop: '8px' }}>{t.loading}</p>
                </div>
              ) : (
                <div style={{ padding: '0 20px' }}>
                  <DestinationList
                    destinations={filteredDestinations}
                    selectedId={selectedDestination?.id}
                    onSelect={handleSelectDestination}
                    onAdd={handleAddNew}
                    categories={allCategories}
                  />
                </div>
              )
            )}
            {sidebarTab === 'itinerary' && (
              <ItineraryPanel destinations={destinations} categories={allCategories} />
            )}
          </div>

          {/* Sidebar footer */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '12px 20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <button onClick={handleExportPdf} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '7px 10px' }}>
                {t.pdf}
              </button>
              <button onClick={handleExportJSON} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '12px', padding: '7px 10px' }}>
                {t.backup}
              </button>
              <button
                onClick={handleToggleShare}
                style={{
                  flex: 1, padding: '7px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${sharingEnabled ? 'var(--accent-border)' : 'var(--border-light)'}`,
                  background: sharingEnabled ? 'var(--accent-light)' : 'transparent',
                  color: sharingEnabled ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}
              >
                {sharingEnabled ? t.linkActive : t.share}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => {
            setShowModal(false);
            setSelectedDestination(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showForm && (
        <DestinationForm
          destination={editingDestination}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingDestination(null);
          }}
          categories={allCategories}
          trips={trips}
          defaultTripId={selectedTripId}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={allCategories}
          defaultCategories={DEFAULT_CATEGORIES}
          onAdd={handleAddCategory}
          onDelete={handleDeleteCategory}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      <FloatingAssistant />
    </div>
  );
}

function AccountMenuBtn({ children, onClick, danger }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '7px 12px',
        background: hover ? 'var(--bg-card-hover)' : 'none',
        border: 'none',
        fontSize: '13px',
        fontWeight: 500,
        cursor: 'pointer',
        borderRadius: 'var(--radius-md)',
        color: danger ? '#f87171' : 'var(--text-secondary)',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {children}
    </button>
  );
}
