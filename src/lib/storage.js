/**
 * LocalStorage-based storage module.
 * Replaces Firestore to eliminate network errors and work completely offline.
 */

// Helper for local storage
const readLocal = (key, defaultVal) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
};

const writeLocal = (key, val) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(val));
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// ─── Destinations ───
export async function getDestinations() {
  const dests = readLocal('wayki_destinations', []);
  return dests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function addDestination(data) {
  const now = new Date().toISOString();
  const id = generateId();
  const newDest = { ...data, created_at: now, updated_at: now, id };
  const dests = readLocal('wayki_destinations', []);
  writeLocal('wayki_destinations', [...dests, newDest]);
  return newDest;
}

export async function updateDestination(id, data) {
  const dests = readLocal('wayki_destinations', []);
  const idx = dests.findIndex(d => d.id === id);
  if (idx === -1) throw new Error('Not found');
  const updated = { ...dests[idx], ...data, updated_at: new Date().toISOString() };
  dests[idx] = updated;
  writeLocal('wayki_destinations', dests);
  return updated;
}

export async function deleteDestination(id) {
  const dests = readLocal('wayki_destinations', []);
  writeLocal('wayki_destinations', dests.filter(d => d.id !== id));
  return true;
}

// ─── Profile / Preferences ───
const DEFAULT_PROFILE = { sharing_enabled: false, custom_categories: [] };

export async function getProfile() {
  return readLocal('wayki_profile', DEFAULT_PROFILE);
}

export async function updateProfile(data) {
  const current = await getProfile();
  const updated = { ...current, ...data };
  writeLocal('wayki_profile', updated);
  return updated;
}

// ─── Trips ───
export async function getTrips() {
  const trips = readLocal('wayki_trips', []);
  return trips.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}

export async function addTrip(name, color = '#6366f1') {
  const now = new Date().toISOString();
  const id = generateId();
  const trip = { id, name, color, created_at: now };
  const trips = readLocal('wayki_trips', []);
  writeLocal('wayki_trips', [...trips, trip]);
  return trip;
}

export async function updateTrip(id, data) {
  const trips = readLocal('wayki_trips', []);
  const idx = trips.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Not found');
  const updated = { ...trips[idx], ...data };
  trips[idx] = updated;
  writeLocal('wayki_trips', trips);
  return updated;
}

export async function deleteTrip(id) {
  const trips = readLocal('wayki_trips', []);
  writeLocal('wayki_trips', trips.filter(t => t.id !== id));
  return true;
}

// ─── Export / Import ───
export async function exportAllData() {
  const destinations = await getDestinations();
  const profile = await getProfile();
  const trips = await getTrips();
  return { destinations, profile, trips, exported_at: new Date().toISOString() };
}

export async function importAllData(data) {
  if (data.destinations) writeLocal('wayki_destinations', data.destinations);
  if (data.profile) writeLocal('wayki_profile', data.profile);
  if (data.trips) writeLocal('wayki_trips', data.trips);
}
