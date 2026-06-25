'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, PlusCircle, Sparkles } from 'lucide-react';
import { routes } from '../lib/routes';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useOverlay } from '../contexts/OverlayContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { direction, isScrolled } = useScrollDirection(pathname);
  const { isOverlayOpen } = useOverlay();

  const isCatalogActive =
    pathname === routes.catalog || pathname.startsWith('/produto');

  const items = [
    {
      href: routes.home,
      icon: Home,
      label: 'Início',
      active: pathname === routes.home,
    },
    {
      href: routes.sell,
      icon: PlusCircle,
      label: 'Vender',
      active: pathname === routes.sell,
      accent: true,
    },
    {
      href: routes.catalog,
      icon: Package,
      label: 'Catálogo',
      active: isCatalogActive,
    },
    {
      href: routes.plans,
      icon: Sparkles,
      label: 'Planos',
      active: pathname === routes.plans,
    },
  ];

  const shouldHide = isOverlayOpen || (direction === 'down' && isScrolled);

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card border-t border-border transition-transform duration-300 ${
        shouldHide ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center justify-around h-14 px-1">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`relative flex flex-col items-center justify-center gap-0.5 min-w-0 flex-1 py-1 transition-colors duration-200 ${
              item.active
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <div className={item.accent ? '-mt-1' : undefined}>
              <item.icon size={item.accent ? 22 : 18} />
            </div>
            <span className="text-[9px] font-mono tracking-wide leading-none truncate px-0.5">
              {item.label}
            </span>
            {item.active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}