'use client';
import { createContext, useContext, useState } from 'react';

const translations = {
  fr: {
    // Sidebar tabs
    tabDestinations: 'Destinations',
    tabDistances: 'Distances',
    // Sidebar header
    myAccount: 'Mon compte',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    notifications: 'Notifications',
    noNotifications: 'Aucune nouvelle notification',
    // Destinations section
    destinations: 'Destinations',
    results: (n) => `${n} résultat${n !== 1 ? 's' : ''}`,
    loading: 'Chargement...',
    // Distances section
    distances: 'Distances',
    distancesSubtitle: 'Durées depuis votre position',
    // Buttons
    pdf: 'PDF',
    backup: 'Backup',
    share: 'Partager',
    linkActive: 'Lien actif',
    // Mobile
    list: 'Liste',
    map: 'Carte',
    hideSidebar: 'Masquer la liste',
    showSidebar: 'Afficher la liste',
    // Login
    tagline: 'Votre bucket list de voyages personnelle',
    login: 'Connexion',
    signup: 'Inscription',
    email: 'Email',
    emailPlaceholder: 'vous@exemple.com',
    password: 'Mot de passe',
    passwordPlaceholder: 'Min. 6 caractères',
    loginBtn: '🚀 Se connecter',
    signupBtn: '✨ Créer mon compte',
    loadingBtn: '⏳ Chargement...',
    footerTagline: 'Explorez le monde, une destination à la fois ✈️',
    accountCreated: 'Compte créé ! Vérifiez votre email pour confirmer votre inscription.',
    // Assistant
    assistantTitle: 'Assistant de voyage',
    assistantSubtitle: "Planification d'itinéraire · Gemini",
    // Categories
    catDream: 'Rêve',
    catDesire: 'Envie',
    catCuriosity: 'Curiosité',

    // --- DestinationCard / status labels ---
    statusTodo: 'À faire',
    statusInProgress: 'En cours',
    statusDone: 'Fait',

    // --- DestinationList ---
    newDestination: 'Nouvelle destination',
    noDestinations: 'Aucune destination',
    startAdding: 'Commencez par en ajouter une',

    // --- DestinationModal ---
    estimatedBudget: 'Budget estimé',
    withWho: 'Avec qui',
    notes: 'Notes',
    edit: 'Modifier',
    deleteBtn: 'Supprimer',

    // --- DestinationForm ---
    destinationLabel: 'Destination *',
    destinationPlaceholder: 'Ex: Kyoto, Japon',
    photoUrl: 'Photo (URL)',
    desireLevel: "Niveau d'envie",
    status: 'Statut',
    estimatedBudgetLabel: '💰 Budget estimé',
    budgetPlaceholder: 'Ex: 2 000€ – 3 000€',
    withWhoLabel: '👥 Avec qui',
    companionPlaceholder: 'Tapez un nom + Entrée',
    tripLabel: '✈️ Voyage',
    none: 'Aucun',
    personalNotes: '📝 Notes personnelles',
    notesPlaceholder: 'Vos réflexions, idées, dates souhaitées...',
    geolocating: '📍 Géolocalisation...',
    saving: '⏳ Enregistrement...',
    save: '💾 Enregistrer',
    add: '✨ Ajouter',
    cancel: 'Annuler',
    editTitle: '✏️ Modifier',
    newDestTitle: '✨ Nouvelle destination',

    // --- Filters ---
    categoryLabel: 'Catégorie',
    manage: 'Gérer',
    statusLabel: 'Statut',

    // --- SearchBar ---
    searchPlaceholder: 'Rechercher une destination...',

    // --- ItineraryPanel ---
    geoNotSupported: 'Géolocalisation non supportée',
    geoPermissionDenied: 'Permission de localisation refusée',
    allowLocation: 'Autorisez la localisation dans votre navigateur',
    locating: 'Localisation en cours...',
    from: 'Depuis',
    currentPosition: 'Position actuelle',
    flight: 'Vol',
    road: 'Route',
    noDestWithCoords: 'Aucune destination avec coordonnées',

    // --- TripSelector ---
    trip: 'Voyage',
    newTrip: '+ Nouveau',
    all: 'Tous',
    creating: 'Création...',
    createTrip: 'Créer le voyage',
    tripPlaceholder: 'Ex: Mancora juin',

    // --- CategoryManager ---
    manageCategories: 'Gérer les catégories',
    defaultLabel: 'Par défaut',
    defaultTag: 'par défaut',
    customLabel: 'Personnalisées',
    newCategory: 'Nouvelle catégorie',
    emojiLabel: 'Emoji',
    colorLabel: 'Couleur',
    nameLabel: 'Nom',
    categoryPlaceholder: 'Ex: Gastronomie',
    create: 'Créer',
    customColor: 'Couleur personnalisée',

    // --- FloatingAssistant ---
    whereToNext: 'Where to next? ✈️',
    assistantTooltip: 'Assistant itinéraire',

    // --- AssistantChat ---
    geminiKey: 'Clé Gemini',
    assistantGreeting: 'Bonjour ! Je suis votre assistant itinéraire 👋\n\nDites-moi où vous souhaitez aller et combien de temps vous avez — je planifie votre parcours optimal !',
    pasteApiKey: 'Merci de coller ta clé API Google (Gemini) dans le champ en haut !',
    apiError: 'Erreur API',
    noResponse: 'Aucune réponse reçue.',
    error: 'Erreur',
    itinerarySteps: (n) => `📋 Itinéraire · ${n} étape${n > 1 ? 's' : ''}`,
    chatPlaceholder: 'Ex: Je veux visiter 3 endroits en 2h...',
    gpsShareLabel: 'Partager ma position GPS pour personnaliser',
    gpsLocating: 'Localisation en cours...',
    gpsActive: 'GPS actif',
    gpsDenied: 'Permission refusée — décris ta position dans le chat',

    // --- Map ---
    mapLoading: '🗺️ Chargement de la carte...',

    // --- Navbar (legacy) ---
    exportPdf: 'Export PDF',

    // --- Confirm dialogs ---
    confirmDelete: 'Supprimer cette destination ?',
    confirmDeleteTrip: 'Supprimer ce voyage ? Les destinations resteront mais ne seront plus associées à ce voyage.',
    linkCopied: 'Lien copié !',
    shareLink: 'Lien de partage :',
  },
  en: {
    tabDestinations: 'Destinations',
    tabDistances: 'Distances',
    myAccount: 'My account',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Log out',
    notifications: 'Notifications',
    noNotifications: 'No new notifications',
    destinations: 'Destinations',
    results: (n) => `${n} result${n !== 1 ? 's' : ''}`,
    loading: 'Loading...',
    distances: 'Distances',
    distancesSubtitle: 'Travel times from your location',
    pdf: 'PDF',
    backup: 'Backup',
    share: 'Share',
    linkActive: 'Link active',
    list: 'List',
    map: 'Map',
    hideSidebar: 'Hide list',
    showSidebar: 'Show list',
    tagline: 'Your personal travel bucket list',
    login: 'Log in',
    signup: 'Sign up',
    email: 'Email',
    emailPlaceholder: 'you@example.com',
    password: 'Password',
    passwordPlaceholder: 'Min. 6 characters',
    loginBtn: '🚀 Log in',
    signupBtn: '✨ Create my account',
    loadingBtn: '⏳ Loading...',
    footerTagline: 'Explore the world, one destination at a time ✈️',
    accountCreated: 'Account created! Check your email to confirm your registration.',
    assistantTitle: 'Travel assistant',
    assistantSubtitle: 'Itinerary planning · Gemini',
    catDream: 'Dream',
    catDesire: 'Desire',
    catCuriosity: 'Curiosity',

    statusTodo: 'To do',
    statusInProgress: 'In progress',
    statusDone: 'Done',

    newDestination: 'New destination',
    noDestinations: 'No destinations',
    startAdding: 'Start by adding one',

    estimatedBudget: 'Estimated budget',
    withWho: 'With whom',
    notes: 'Notes',
    edit: 'Edit',
    deleteBtn: 'Delete',

    destinationLabel: 'Destination *',
    destinationPlaceholder: 'E.g.: Kyoto, Japan',
    photoUrl: 'Photo (URL)',
    desireLevel: 'Desire level',
    status: 'Status',
    estimatedBudgetLabel: '💰 Estimated budget',
    budgetPlaceholder: 'E.g.: $2,000 – $3,000',
    withWhoLabel: '👥 With whom',
    companionPlaceholder: 'Type a name + Enter',
    tripLabel: '✈️ Trip',
    none: 'None',
    personalNotes: '📝 Personal notes',
    notesPlaceholder: 'Your thoughts, ideas, desired dates...',
    geolocating: '📍 Geolocating...',
    saving: '⏳ Saving...',
    save: '💾 Save',
    add: '✨ Add',
    cancel: 'Cancel',
    editTitle: '✏️ Edit',
    newDestTitle: '✨ New destination',

    categoryLabel: 'Category',
    manage: 'Manage',
    statusLabel: 'Status',

    searchPlaceholder: 'Search a destination...',

    geoNotSupported: 'Geolocation not supported',
    geoPermissionDenied: 'Location permission denied',
    allowLocation: 'Allow location access in your browser',
    locating: 'Locating...',
    from: 'From',
    currentPosition: 'Current position',
    flight: 'Flight',
    road: 'Road',
    noDestWithCoords: 'No destinations with coordinates',

    trip: 'Trip',
    newTrip: '+ New',
    all: 'All',
    creating: 'Creating...',
    createTrip: 'Create trip',
    tripPlaceholder: 'E.g.: Mancora June',

    manageCategories: 'Manage categories',
    defaultLabel: 'Default',
    defaultTag: 'default',
    customLabel: 'Custom',
    newCategory: 'New category',
    emojiLabel: 'Emoji',
    colorLabel: 'Color',
    nameLabel: 'Name',
    categoryPlaceholder: 'E.g.: Gastronomy',
    create: 'Create',
    customColor: 'Custom color',

    whereToNext: 'Where to next? ✈️',
    assistantTooltip: 'Itinerary assistant',

    geminiKey: 'Gemini Key',
    assistantGreeting: "Hello! I'm your itinerary assistant 👋\n\nTell me where you want to go and how much time you have — I'll plan your optimal route!",
    pasteApiKey: 'Please paste your Google (Gemini) API key in the field above!',
    apiError: 'API Error',
    noResponse: 'No response received.',
    error: 'Error',
    itinerarySteps: (n) => `📋 Itinerary · ${n} step${n > 1 ? 's' : ''}`,
    chatPlaceholder: 'E.g.: I want to visit 3 places in 2h...',
    gpsShareLabel: 'Share my GPS location to personalize',
    gpsLocating: 'Locating...',
    gpsActive: 'GPS active',
    gpsDenied: 'Permission denied — describe your location in chat',

    mapLoading: '🗺️ Loading map...',

    exportPdf: 'Export PDF',

    confirmDelete: 'Delete this destination?',
    confirmDeleteTrip: 'Delete this trip? Destinations will remain but won\'t be associated with this trip.',
    linkCopied: 'Link copied!',
    shareLink: 'Share link:',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('fr');
  const t = translations[lang];
  const toggleLang = () => setLang(l => (l === 'fr' ? 'en' : 'fr'));
  return (
    <LanguageContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
