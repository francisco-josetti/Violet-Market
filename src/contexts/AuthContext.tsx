'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createClient } from '../lib/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
  plan: string | null;
  loggedAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  initialUser,
  children,
}: {
  initialUser: AuthUser | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(
    initialUser === null ? null : true,
  );

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, avatar_url, plan')
          .eq('id', session.user.id)
          .single();

        setUser({
          id: session.user.id,
          email: session.user.email ?? '',
          name: profile?.name ?? null,
          avatarUrl: profile?.avatar_url ?? null,
          plan: profile?.plan ?? null,
          provider: session.user.app_metadata?.provider ?? 'email',
          loggedAt: session.user.created_at ?? new Date().toISOString(),
        });
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('signOut error:', error);
    }
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, avatar_url, plan')
      .eq('id', session.user.id)
      .single();

    setUser({
      id: session.user.id,
      email: session.user.email ?? '',
      name: profile?.name ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      plan: profile?.plan ?? null,
      provider: session.user.app_metadata?.provider ?? 'email',
      loggedAt: session.user.created_at ?? new Date().toISOString(),
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}