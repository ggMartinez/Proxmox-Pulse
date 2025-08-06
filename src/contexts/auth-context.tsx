'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { checkAuthStatus, logoutAction } from '@/app/login/login-v2/actions';
import Cookies from 'js-cookie';

type AuthContextType = {
  isAuthenticated: boolean;
  user: { username: string } | null;
  isLoading: boolean;
  login: (username: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const status = await checkAuthStatus();
      setIsAuthenticated(status.isAuthenticated);
      setUser(status.user);
    } catch (error) {
      console.error("Failed to check auth status", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  const login = (username: string) => {
    // When login is successful, we verify auth again to get the user from the cookie
    verifyAuth();
  };

  const logout = async () => {
    await logoutAction();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
