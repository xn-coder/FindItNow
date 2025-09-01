
"use client";

import { createContext, useState, useEffect, ReactNode } from 'react';

export type AuthUser = {
    id: string;
    email: string;
    isPartner?: boolean;
    isAdmin?: boolean;
    businessName?: string;
    // You can add other user properties here
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load user from localStorage on initial render
    // This should only run on the client side
    if (typeof window !== 'undefined') {
        try {
            const storedUser = localStorage.getItem('finditnow_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('finditnow_user');
        } finally {
            setLoading(false);
        }
    } else {
        setLoading(false);
    }
  }, []);

  const login = (userData: AuthUser) => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const userWithAdminCheck = {
      ...userData,
      isAdmin: adminEmail && userData.email === adminEmail,
    };
    localStorage.setItem('finditnow_user', JSON.stringify(userWithAdminCheck));
    setUser(userWithAdminCheck);
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

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
