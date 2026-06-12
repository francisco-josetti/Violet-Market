'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Shield,
  ShoppingCart,
  Package,
  Bell,
  Lock,
  LogOut,
  LogIn,
  ChevronRight,
  Sparkles,
  MapPin,
  CreditCard,
} from 'lucide-react';
import { routes } from '../lib/routes';
import {
  AuthSession,
  clearAuthSession,
  getAuthSession,
} from '../lib/auth';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import { useCart } from '../contexts/CartContext';

function getInitials(email: string): string {
  const local = email.split('@')[0] ?? '';
  const parts = local.split(/[._-]/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || 'VM';
}

function formatMemberSince(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(isoDate));
  } catch {
    return '—';
  }
}

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
}

function ProfileMenuItem({
  icon,
  label,
  description,
  href,
  onClick,
}: ProfileMenuItemProps) {
  const className =
    'w-full flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-surface-container-low/40 hover:bg-surface-container hover:border-primary/20 transition-all duration-200 text-left group cursor-pointer';

  const content = (
    <>
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-hanken text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
          {label}
        </p>
        {description && (
          <p className="font-sans text-xs text-on-surface-variant mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <ChevronRight
        size={18}
        className="text-on-surface-variant group-hover:text-primary shrink-0 transition-colors"
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}

export default function ProfileView() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { cart } = useCart();
  const [session, setSession] = useState<AuthSession | null>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (isLoggedIn) {
      getAuthSession().then(setSession);
    } else {
      setSession(null);
    }
  }, [isLoggedIn]);

  const displayName = useMemo(() => {
    if (!session?.email) return 'Membro Violet';
    const local = session.email.split('@')[0] ?? 'membro';
    return local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [session?.email]);

  const handleLogout = async () => {
    await clearAuthSession();
    router.push(routes.home);
    router.refresh();
  };

  if (isLoggedIn === null) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-16 py-12 animate-fade-in">
        <div className="h-8 w-48 bg-surface-container-high rounded-lg mb-8 animate-pulse" />
        <div className="glass-panel rounded-2xl p-8 border border-white/5 flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-surface-container-high animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-6 w-40 bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-56 bg-surface-container-high rounded animate-pulse" />
            <div className="h-4 w-32 bg-surface-container-high rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn === false || !session) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 md:px-16 py-16 text-center animate-fade-in flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary">
          <User size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-on-surface">
            Meu Perfil
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-md">
            Entre na sua conta para acessar pedidos, preferências e benefícios VIP.
          </p>
        </div>
        <Link
          href={routes.login}
          className="bg-brand-violet text-white px-8 py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 flex items-center justify-center gap-2"
          id="profile-login-btn"
        >
          <LogIn size={16} />
          Fazer login
        </Link>
        <Link
          href={routes.register}
          className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          Criar conta gratuita
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 md:px-16 py-8 md:py-12 animate-fade-in flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
            Área do membro
          </p>
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-on-surface">
            Meu Perfil
          </h1>
        </div>
        <Link
          href={routes.catalog}
          className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          Continuar comprando
        </Link>
      </div>

      <section className="glass-panel luxury-shadow rounded-2xl p-6 md:p-8 border border-primary/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-violet to-primary-container flex items-center justify-center font-hanken text-2xl font-extrabold text-white shadow-lg shadow-brand-violet/20">
            {getInitials(session.email)}
          </div>
          <span className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-tertiary-container uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={10} />
            VIP
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left flex flex-col gap-3">
          <div>
            <h2 className="font-hanken text-xl font-bold text-on-surface">
              {displayName}
            </h2>
            <p className="font-sans text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Mail size={14} className="text-primary shrink-0" />
              {session.email}
            </p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider bg-surface-container-high border border-white/10 text-on-surface-variant px-3 py-1.5 rounded-full">
              <Shield size={12} className="text-primary" />
              Conta verificada
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-3 py-1.5 rounded-full">
              Login por e-mail
            </span>
          </div>
          <p className="font-sans text-xs text-on-surface-variant">
            Membro desde {formatMemberSince(session.loggedAt)}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Carrinho
          </span>
          <span className="font-hanken text-2xl font-bold text-primary">
            {cartCount}
          </span>
          <span className="font-sans text-xs text-on-surface-variant">
            {cartCount === 1 ? 'item ativo' : 'itens ativos'}
          </span>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Desconto VIP
          </span>
          <span className="font-hanken text-2xl font-bold text-tertiary">5%</span>
          <span className="font-sans text-xs text-on-surface-variant">
            em todas as compras
          </span>
        </div>
        <div className="glass-panel rounded-xl p-4 border border-white/5 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
            Pedidos
          </span>
          <span className="font-hanken text-2xl font-bold text-on-surface">0</span>
          <span className="font-sans text-xs text-on-surface-variant">
            histórico em breve
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="font-hanken text-lg font-bold text-on-surface border-b border-white/10 pb-3">
          Atalhos
        </h3>
        <ProfileMenuItem
          icon={<ShoppingCart size={18} />}
          label="Meu carrinho"
          description={
            cartCount > 0
              ? `${cartCount} ${cartCount === 1 ? 'item' : 'itens'} aguardando checkout`
              : 'Nenhum item no momento'
          }
          href={routes.cart}
        />
        <ProfileMenuItem
          icon={<Package size={18} />}
          label="Explorar catálogo"
          description="Equipamentos premium e novidades"
          href={routes.catalog}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h3 className="font-hanken text-lg font-bold text-on-surface border-b border-white/10 pb-3">
          Configurações
        </h3>
        <ProfileMenuItem
          icon={<Bell size={18} />}
          label="Notificações"
          description="Alertas de pedidos e ofertas exclusivas"
          onClick={() => {}}
        />
        <ProfileMenuItem
          icon={<MapPin size={18} />}
          label="Endereços"
          description="Gerenciar entregas e frete expresso"
          onClick={() => {}}
        />
        <ProfileMenuItem
          icon={<CreditCard size={18} />}
          label="Pagamentos"
          description="Métodos salvos com criptografia"
          onClick={() => {}}
        />
        <ProfileMenuItem
          icon={<Lock size={18} />}
          label="Segurança"
          description="Senha e autenticação da conta"
          onClick={() => {}}
        />
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-error/30 bg-error-container/10 text-error font-mono text-sm font-medium hover:bg-error-container/20 transition-all duration-200 cursor-pointer"
        id="profile-logout-btn"
      >
        <LogOut size={16} />
        Sair da conta
      </button>
    </div>
  );
}
