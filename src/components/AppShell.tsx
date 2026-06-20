'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { CartProvider, useCart } from '../contexts/CartContext';
import { OverlayProvider, useOverlay } from '../contexts/OverlayContext';
import { isAuthRoute } from '../lib/routes';

function GlobalToast() {
  const { toastMessage, dismissToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-card border border-primary/25 rounded-xl p-4 flex items-center gap-3 shadow-xl animate-bounce-short cursor-pointer max-w-sm"
      onClick={dismissToast}
      id="global-toast-msg"
    >
      <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
        <Check size={16} />
      </div>
      <span className="font-sans text-xs tracking-wide text-foreground font-semibold">
        {toastMessage}
      </span>
    </div>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authPage = isAuthRoute(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans transition-all selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      <GlobalToast />
      {!authPage && <Header />}
      <main className="flex-grow flex flex-col pb-16 md:pb-0">{children}</main>
      {!authPage && (
        <div className="hidden md:block">
          <Footer />
        </div>
      )}
      {!authPage && <MobileBottomNav />}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <OverlayProvider>
      <ShellContent>{children}</ShellContent>
    </OverlayProvider>
    </CartProvider>
  );
}