'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { CartProvider, useCart } from '../contexts/CartContext';
import { isAuthRoute } from '../lib/routes';

function GlobalToast() {
  const { toastMessage, dismissToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 bg-surface-container-high border border-primary/25 rounded-xl p-4 flex items-center gap-3 shadow-2xl animate-bounce-short cursor-pointer max-w-sm"
      onClick={dismissToast}
      id="global-toast-msg"
    >
      <div className="bg-primary/10 p-2 rounded-full text-primary shrink-0">
        <Check size={16} />
      </div>
      <span className="font-sans text-xs tracking-wide text-on-surface font-semibold">
        {toastMessage}
      </span>
    </div>
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authPage = isAuthRoute(pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-sans transition-all selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      <GlobalToast />
      {!authPage && <Header />}
      <main className="flex-grow flex flex-col">{children}</main>
      {!authPage && <Footer />}
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ShellContent>{children}</ShellContent>
    </CartProvider>
  );
}
