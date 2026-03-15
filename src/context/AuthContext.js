'use client';

import { createContext, useContext, useState } from 'react';

const AuthContext = createContext({});

// Use a consistent UUID for the local default user so data isn't lost
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export function AuthProvider({ children }) {
    // We bypass Supabase Auth entirely and always provide a logged-in user
    const [user, setUser] = useState({
        id: DEFAULT_USER_ID,
        email: 'local@voyageur.com',
        user_metadata: { full_name: 'Voyageur' }
    });
    const [loading, setLoading] = useState(false);

    const signUp = async () => { };
    const signIn = async () => { };
    const signOut = async () => { };

    return (
        <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
