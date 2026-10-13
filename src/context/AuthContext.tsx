import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';
import { api, setToken, removeToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'farmer';
    phone?: string;
    address?: string;
    farmLocation?: Record<string, unknown>;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  loginWithDemoAccount: (role: 'farmer' | 'customer' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('farmconnect_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('farmconnect_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          removeToken();
          setTokenState(null);
        }
      } catch (err) {
        console.warn('Session verification failed:', err);
        removeToken();
        setTokenState(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login({ email, password });
    if (res.success && res.token) {
      setToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: 'customer' | 'farmer';
    phone?: string;
    address?: string;
    farmLocation?: Record<string, unknown>;
  }) => {
    const res = await api.auth.register(data);
    if (res.success && res.token) {
      setToken(res.token);
      setTokenState(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const loginWithDemoAccount = async (role: 'farmer' | 'customer' | 'admin') => {
    let email = 'customer@farmconnect.org';
    if (role === 'farmer') email = 'ramesh.farmer@farmconnect.org';
    if (role === 'admin') email = 'admin@farmconnect.org';

    await login(email, 'password123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        loginWithDemoAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
