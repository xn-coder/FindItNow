
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';
import { createUser, getUserByEmail, initializeDefaultSettings } from '@/lib/actions';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type AuthUser = {
    id: string;
    email: string;
    isPartner?: boolean;
    isAdmin?: boolean;
    businessName?: string;
    status?: 'active' | 'suspended' | 'banned';
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser, isSuspended?: boolean) => AuthUser;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => ({} as AuthUser),
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      // Try to load user from localStorage on initial render
      if (typeof window !== 'undefined') {
          try {
              // Auto-create admin user and default settings if they don't exist
              await initializeDefaultSettings();
              const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
              if (adminEmail) {
                  const adminUser = await getUserByEmail(adminEmail);
                  if (!adminUser) {
                      console.log(`Admin user ${adminEmail} not found, creating...`);
                      await createUser({ email: adminEmail, password: 'password' });
                  }
              }

              const storedUser = localStorage.getItem('finditnow_user');
              if (storedUser) {
                  setUser(JSON.parse(storedUser));
              }
          } catch (error) {
              console.error("Failed to initialize auth state:", error);
              localStorage.removeItem('finditnow_user');
          } finally {
              setLoading(false);
          }
      } else {
          setLoading(false);
      }
    };
    
    initializeAuth();
  }, []);

  const login = (userData: AuthUser, isSuspended = false) => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const userWithAdminCheck = {
      ...userData,
      isAdmin: adminEmail && userData.email === adminEmail,
    };
    localStorage.setItem('finditnow_user', JSON.stringify(userWithAdminCheck));
    setUser(userWithAdminCheck);
    
    if (!isSuspended && userWithAdminCheck.id) {
        // Asynchronously update lastActivity without blocking the login flow
        const collectionName = userWithAdminCheck.isPartner ? 'partners' : 'users';
        const userRef = doc(db, collectionName, userWithAdminCheck.id);
        updateDoc(userRef, { lastActivity: new Date() }).catch(err => {
            console.error("Failed to update last activity:", err);
        });
    }

    return userWithAdminCheck;
  };

  const logout = () => {
    localStorage.removeItem('finditnow_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
