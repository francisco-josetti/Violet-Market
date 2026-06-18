'use client';

import { useAuth } from '../contexts/AuthContext';

export function useIsLoggedIn() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn;
}