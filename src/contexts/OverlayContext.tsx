'use client';

import React, { createContext, useContext, useState } from 'react';

interface OverlayContextValue {
  isOverlayOpen: boolean;
  setOverlayOpen: (open: boolean) => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOverlayOpen, setOverlayOpen] = useState(false);

  return (
    <OverlayContext.Provider value={{ isOverlayOpen, setOverlayOpen }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlay deve ser usado dentro de OverlayProvider');
  }
  return context;
}
