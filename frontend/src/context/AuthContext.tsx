import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '../api';
import type { User } from '../types';

type Ctx = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
};
const AuthContext = createContext<Ctx | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);
    auth.getMe().then((r) => setUser(r.user)).catch(() => localStorage.clear()).finally(() => setLoading(false));
  }, []);
  const login = async (email: string, password: string) => {
    const { token, user: u } = await auth.login({ email, password });
    localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(u)); setUser(u);
  };
  const register = async (name: string, email: string, password: string) => {
    const { token, user: u } = await auth.register({ name, email, password });
    localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(u)); setUser(u);
  };
  const logout = () => { localStorage.clear(); setUser(null); window.location.href = '/login'; };
  const updateUser = (u: User) => { setUser(u); localStorage.setItem('user', JSON.stringify(u)); };
  const value = useMemo(() => ({ user, isAuthenticated: !!user, isLoading, login, register, logout, updateUser }), [user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
