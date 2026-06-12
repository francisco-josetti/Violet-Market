'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useIsLoggedIn() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return loggedIn;
}
