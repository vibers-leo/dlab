'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export interface PortalUser {
  id: number;
  login_id: string;
  name: string;
  email: string | null;
  role: string;
  entity_id: number | null;
  credits: number;
}

interface AuthCtx {
  user: PortalUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function PortalAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const r = await fetch('/api/portal/auth/me');
      const data = await r.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  const logout = async () => {
    await fetch('/api/portal/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/portal/login';
  };

  const isAdmin = user?.role === 'admin';

  return (
    <Ctx.Provider value={{ user, loading, isAdmin, logout, refresh: fetchMe }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePortalAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('usePortalAuth는 PortalAuthProvider 안에서 사용해야 합니다');
  return ctx;
}
