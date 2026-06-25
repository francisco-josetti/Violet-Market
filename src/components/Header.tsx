'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Bell, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { cart } = useCart();
  const pathname = usePathname();
  const { isScrolled } = useScrollDirection(pathname);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const isLoggedIn = useIsLoggedIn();
  const { theme, toggleTheme } = useTheme();
  const isCatalogActive =
    pathname === routes.catalog || pathname.startsWith('/produto');
  const isProfileActive = pathname === routes.profile;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? 'bg-card border-border shadow-lg'
          : 'bg-background border-border'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 py-4 w-full max-w-7xl mx-auto">
        <Link
          href={routes.home}
          className="font-hanken text-2xl font-extrabold tracking-tight text-primary hover:text-foreground transition-all cursor-pointer select-none flex items-center"
          id="brand-logo"
        >
          <span className="text-2xl font-extrabold tracking-tight text-primary transition-all cursor-pointer select-none">Violet Market</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href={routes.catalog}
            className={`font-sans text-sm tracking-wide transition-all duration-200 cursor-pointer rounded-lg px-3 py-2 hover:text-primary ${
              isCatalogActive
                ? 'text-primary font-semibold border-b-2 border-primary rounded-none px-1 py-1'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            id="nav-catalog"
          >
            Catálogo
          </Link>
          <Link
            href={routes.sell}
            className="text-muted-foreground font-sans text-sm tracking-wide hover:text-primary hover:bg-accent transition-all duration-200 rounded-lg px-3 py-2 cursor-pointer active:scale-90"
            id="nav-sell"
          >
            Vender
          </Link>
          <Link
            href={routes.plans}
            className={`font-sans text-sm tracking-wide transition-all duration-200 cursor-pointer rounded-lg px-3 py-2 hover:text-primary ${
              pathname === routes.plans
                ? 'text-primary font-semibold border-b-2 border-primary rounded-none px-1 py-1'
                : 'text-muted-foreground hover:bg-accent'
            }`}
            id="nav-plans"
          >
            Planos
          </Link>
          {isLoggedIn === true && (
            <Link
              href={routes.profile}
              className={`font-sans text-sm tracking-wide transition-all duration-200 cursor-pointer rounded-lg px-3 py-2 hover:text-primary ${
                isProfileActive
                  ? 'text-primary font-semibold border-b-2 border-primary rounded-none px-1 py-1'
                  : 'text-muted-foreground hover:bg-accent'
              }`}
              id="nav-profile"
            >
              Meu Perfil
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3 text-primary">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-all duration-200 cursor-pointer flex items-center justify-center text-muted-foreground hover:text-primary"
            aria-label={theme === 'dark' ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
            id="header-theme-btn"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            href={routes.cart}
            className="p-2 rounded-full hover:bg-accent transition-all duration-200 relative cursor-pointer flex items-center justify-center text-muted-foreground hover:text-primary"
            aria-label="Carrinho"
            id="header-cart-btn"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold leading-none w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            className="p-2 rounded-full hover:bg-accent transition-all duration-200 cursor-pointer flex items-center justify-center text-muted-foreground hover:text-primary"
            aria-label="Notificações"
            id="header-notif-btn"
            type="button"
          >
            <Bell size={22} />
          </button>

          <Link
            href={isLoggedIn === true ? routes.profile : routes.login}
            className={`p-2 rounded-full hover:bg-accent transition-all duration-200 cursor-pointer flex items-center justify-center hover:text-primary ${
              isProfileActive ? 'text-primary bg-primary/10' : 'text-muted-foreground'
            }`}
            aria-label={isLoggedIn === true ? 'Meu perfil' : 'Entrar'}
            id="header-profile-btn"
          >
            <User size={22} />
          </Link>
        </div>
      </div>
    </header>
  );
}