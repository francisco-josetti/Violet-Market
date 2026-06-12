'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  clearFormDraft,
  loadFormDraft,
  saveFormDraft,
} from '../lib/formStorage';

export function usePersistedForm<T extends Record<string, unknown>>(
  storageKey: string,
  initialValues: T,
  options?: { skipPersist?: readonly (keyof T)[] },
) {
  const [values, setValues] = useState<T>(initialValues);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFormDraft<T>(storageKey);
    if (stored) {
      setValues((prev) => ({ ...prev, ...stored }));
    }
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    const skip = options?.skipPersist;
    if (skip && skip.length > 0) {
      const persistable = { ...values };
      for (const key of skip) {
        delete persistable[key];
      }
      saveFormDraft(storageKey, persistable);
    } else {
      saveFormDraft(storageKey, values);
    }
  }, [values, storageKey, hydrated]);

  const setField = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetDraft = useCallback(() => {
    clearFormDraft(storageKey);
    setValues(initialValues);
  }, [storageKey, initialValues]);

  return {
    values,
    setValues,
    setField,
    hydrated,
    resetDraft,
  };
}
