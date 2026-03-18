'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';
import CategoryManager from '@/components/CategoryManager';
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
      🗺️ Chargement de la carte...
    </div>
  ),
});

export default function HomePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const DEFAULT_CATEGORIES = [
    { key: 'dream', emoji: '🌟', label: 'Rêve', color: '#FF3366' },
    { key: 'desire', emoji: '✈️', label: 'Envie', color: '#FF9900' },
    { key: 'curiosity', emoji: '🔍', label: 'Curiosité', color: '#00C2B2' },
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
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarTab, setSidebarTab] = useState('destinations'); // 'destinations' | 'itinerary'

  // No redirect to login needed anymore

  // Fetch destinations
  const fetchDestinations = useCallback(async () => {
    if (!user) return;

    try {
      const destRef = collection(db, 'destinations');
      const q = query(destRef, where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      setDestinations(data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  // Fetch sharing status + custom categories
  useEffect(() => {
    if (!user) return;

    async function fetchProfile() {
      try {
        const q = query(collection(db, 'profiles'), where('id', '==', user.id));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setSharingEnabled(data.sharing_enabled);
          if (data.custom_categories) setCustomCategories(data.custom_categories);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, [user]);

  // Filter destinations
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Search filter
      if (search && !dest.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(dest.category)) {
        return false;
      }
      // Status filter
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(dest.status)) {
        return false;
      }
      return true;
    });
  }, [destinations, search, selectedCategories, selectedStatuses]);

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
    try {
      if (editingDestination) {
        // Update
        const destRef = doc(db, 'destinations', editingDestination.id);
        await updateDoc(destRef, {
          ...formData,
          updated_at: new Date().toISOString(),
        });

        await fetchDestinations();
        setShowForm(false);
        setEditingDestination(null);
      } else {
        // Insert
        await addDoc(collection(db, 'destinations'), {
          ...formData,
          user_id: user.id,
          is_public: sharingEnabled,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        await fetchDestinations();
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving destination:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette destination ?')) return;

    try {
      await deleteDoc(doc(db, 'destinations', id));
      await fetchDestinations();
      setShowModal(false);
      setSelectedDestination(null);
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleToggleShare = async () => {
    const newValue = !sharingEnabled;

    try {
      // Upsert profile
      const profileRef = doc(db, 'profiles', user.id);
      await setDoc(profileRef, {
        id: user.id,
        sharing_enabled: newValue,
      }, { merge: true });

      // Update all destinations public status
      // In Firestore, we have to fetch them then update each one
      const q = query(collection(db, 'destinations'), where('user_id', '==', user.id));
      const querySnapshot = await getDocs(q);

      const updatePromises = querySnapshot.docs.map(document =>
        updateDoc(doc(db, 'destinations', document.id), { is_public: newValue })
      );
      await Promise.all(updatePromises);

      setSharingEnabled(newValue);

      if (newValue) {
        const shareUrl = `${window.location.origin}/share/${user.id}`;
        try {
          await navigator.clipboard.writeText(shareUrl);
          alert(`Lien copié !\n${shareUrl}`);
        } catch {
          alert(`Lien de partage :\n${shareUrl}`);
        }
      }
    } catch (error) {
      console.error('Error updating sharing status:', error);
      alert('Erreur lors de la mise à jour du partage');
    }
  };

  const saveCustomCategories = async (updated) => {
    try {
      const profileRef = doc(db, 'profiles', user.id);
      await setDoc(profileRef, { id: user.id, custom_categories: updated }, { merge: true });
    } catch (error) {
      console.error('Error saving categories:', error);
    }
  };

  const handleAddCategory = (cat) => {
    const updated = [...customCategories, cat];
    setCustomCategories(updated);
    saveCustomCategories(updated);
  };

  const handleDeleteCategory = (key) => {
    const updated = customCategories.filter(c => c.key !== key);
    setCustomCategories(updated);
    saveCustomCategories(updated);
  };

  const handleExportPdf = () => {
    exportToPdf(filteredDestinations);
  };

  // No loading state needed since user is provided synchronously
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
          📋 Liste
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
          🗺️ Carte
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
            title={sidebarVisible ? 'Masquer la liste' : 'Afficher la liste'}
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

          {/* Stats overlay */}
          <div
            className="glass desktop-only"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              gap: '16px',
              zIndex: 500,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
                {destinations.length}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </p>
            </div>
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-done)' }}>
                {destinations.filter((d) => d.status === 'done').length}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Faits
              </p>
            </div>
            <div style={{ width: '1px', background: 'rgba(0,0,0,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-dream)' }}>
                {destinations.filter((d) => d.category === 'dream').length}
              </p>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rêves
              </p>
            </div>
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
          {/* Sidebar logo */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexShrink: 0 }}>
            <svg width="28" height="34" viewBox="0 0 40 46" style={{ flexShrink: 0, overflow: 'visible' }}>
              <circle cx="10" cy="15" r="9" fill="#FF3366" />
              <circle cx="20" cy="11" r="10" fill="#FF9900" />
              <circle cx="30" cy="15" r="9" fill="#00C2B2" />
              <ellipse cx="7" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(-18 7 23)" />
              <ellipse cx="33" cy="23" rx="3.5" ry="5.5" fill="#F5CF80" transform="rotate(18 33 23)" />
              <ellipse cx="7" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(-18 7 23)" />
              <ellipse cx="33" cy="23" rx="1.8" ry="3.2" fill="#FFBCBC" transform="rotate(18 33 23)" />
              <ellipse cx="20" cy="27" rx="13.5" ry="12" fill="#F5CF80" />
              <circle cx="14" cy="25.5" r="3.8" fill="#1F2937" />
              <circle cx="26" cy="25.5" r="3.8" fill="#1F2937" />
              <circle cx="15.4" cy="24.1" r="1.4" fill="white" />
              <circle cx="27.4" cy="24.1" r="1.4" fill="white" />
              <ellipse cx="20" cy="33" rx="6" ry="4.2" fill="#E8AE5A" />
              <ellipse cx="17.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
              <ellipse cx="22.5" cy="33.8" rx="1.2" ry="0.9" fill="#B87840" />
              <rect x="15" y="37" width="10" height="7" rx="5" fill="#F5CF80" />
            </svg>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #FF3366 0%, #FF9900 55%, #00C2B2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.03em' }}>
              EmmAlpaga
            </span>
          </div>

          {/* Sidebar header */}
          <div style={{ padding: '16px 20px 0', flexShrink: 0 }}>
            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                padding: '4px',
                marginBottom: '16px',
                gap: '2px',
              }}
            >
              {[
                { key: 'destinations', label: '📋 Liste' },
                { key: 'itinerary', label: '🗺️ Distances' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSidebarTab(key)}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '9px',
                    border: 'none',
                    background: sidebarTab === key
                      ? 'white'
                      : 'transparent',
                    color: sidebarTab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: sidebarTab === key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {sidebarTab === 'destinations' && (
              <>
                <div style={{ marginBottom: '12px' }}>
                  <h2
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: '18px',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    Mes destinations
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
                    {search || selectedCategories.length > 0 || selectedStatuses.length > 0
                      ? ` (filtrée${filteredDestinations.length !== 1 ? 's' : ''})`
                      : ''}
                  </p>
                </div>
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
              <div style={{ marginBottom: '12px' }}>
                <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Distances
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Durées depuis votre position</p>
              </div>
            )}
          </div>

          {/* Scrollable content */}
          <div style={{ flex: 1, overflow: sidebarTab === 'assistant' ? 'hidden' : 'auto', padding: sidebarTab === 'assistant' ? '0' : '0 0 20px', display: 'flex', flexDirection: 'column' }}>
            {sidebarTab === 'destinations' && (
              loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  <p className="animate-float" style={{ fontSize: '32px' }}>🗺️</p>
                  <p style={{ marginTop: '8px' }}>Chargement...</p>
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

          {/* Sidebar footer - user actions */}
          <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 20px', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button
                onClick={handleExportPdf}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '10px', border: '1px solid var(--border-light)', background: 'var(--bg-card)', color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                📄 PDF
              </button>
              <button
                onClick={handleToggleShare}
                style={{ flex: 1, padding: '8px 10px', borderRadius: '10px', border: `1px solid ${sharingEnabled ? 'rgba(16,185,129,0.3)' : 'var(--border-light)'}`, background: sharingEnabled ? 'rgba(16,185,129,0.1)' : 'var(--bg-card)', color: sharingEnabled ? '#059669' : 'var(--text-secondary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
              >
                {sharingEnabled ? '🔗 Actif' : '🔒 Partager'}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>{user?.email}</span>
              <button
                onClick={signOut}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
              >
                ⬅️ Déconnexion
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
