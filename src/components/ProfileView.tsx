'use client';

import React, { useMemo, useState, useEffect } from 'react';
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
  Edit3,
} from 'lucide-react';
import { routes } from '../lib/routes';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getPlanDiscount, getPlanLabel } from '../lib/plans';
import { createClient } from '../lib/supabase/client';
import ProfileEditView from './ProfileEditView';
import AddressView from './AddressView';

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
    'w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-muted hover:bg-accent hover:border-border transition-all duration-200 text-left group cursor-pointer';

  const content = (
    <>
      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-border flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-hanken text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        {description && (
          <p className="font-sans text-xs text-muted-foreground mt-0.5 truncate">
            {description}
          </p>
        )}
      </div>
      <ChevronRight
        size={18}
        className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
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
  const { isLoggedIn, user, signOut, refreshUser } = useAuth();
  const { cart } = useCart();
  const [showEdit, setShowEdit] = useState(false);
  const [showAddresses, setShowAddresses] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const discountRate = getPlanDiscount(user?.plan);
  const planLabel = getPlanLabel(user?.plan);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .then(({ count }) => setOrderCount(count ?? 0));
  }, [user]);

  const displayName = useMemo(() => {
    if (user?.name) return user.name;
    if (!user?.email) return 'Membro Violet';
    const local = user.email.split('@')[0] ?? 'membro';
    return local
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }, [user?.name, user?.email]);

  const handleLogout = async () => {
    try {
      await signOut();
      await fetch('/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Falha ao sair da conta:', error);
      return;
    }
    router.push(routes.home);
    router.refresh();
  };

  if (isLoggedIn === null) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 md:px-16 py-12 animate-fade-in">
        <div className="h-8 w-48 bg-accent rounded-lg mb-8 animate-pulse" />
        <div className="bg-card border border-border rounded-2xl p-8 flex gap-6">
          <div className="w-24 h-24 rounded-2xl bg-accent animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-6 w-40 bg-accent rounded animate-pulse" />
            <div className="h-4 w-56 bg-accent rounded animate-pulse" />
            <div className="h-4 w-32 bg-accent rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn === false || !user) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 md:px-16 py-16 text-center animate-fade-in flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 border border-border rounded-full flex items-center justify-center text-primary">
          <User size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-foreground">
            Meu Perfil
          </h1>
          <p className="font-sans text-sm text-muted-foreground max-w-md">
            Entre na sua conta para acessar pedidos, seu plano e benefícios de membro.
          </p>
        </div>
        <Link
          href={routes.login}
          className="border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground px-8 py-4 rounded-xl font-mono text-sm font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
          id="profile-login-btn"
        >
          <LogIn size={16} />
          Fazer login
        </Link>
        <Link
          href={routes.register}
          className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
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
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-foreground">
            Meu Perfil
          </h1>
        </div>
        <Link
          href={routes.catalog}
          className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Continuar comprando
        </Link>
      </div>

      <section className="bg-card border border-border shadow-lg rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center font-hanken text-2xl font-extrabold text-white shadow-lg overflow-hidden">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              getInitials(user.email)
            )}
          </div>
          <span className="absolute -bottom-2 -right-2 bg-tertiary text-on-tertiary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-tertiary-container uppercase tracking-wider flex items-center gap-1">
            <Sparkles size={10} />
            {planLabel}
          </span>
        </div>

        <div className="flex-1 text-center sm:text-left flex flex-col gap-3">
          <div>
            <h2 className="font-hanken text-xl font-bold text-foreground">
              {displayName}
            </h2>
            <p className="font-sans text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-2 mt-1">
              <Mail size={14} className="text-primary shrink-0" />
              {user.email}
            </p>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider bg-accent border border-border text-muted-foreground px-3 py-1.5 rounded-full">
              <Shield size={12} className="text-primary" />
              Conta verificada
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider bg-primary/10 border border-border text-primary px-3 py-1.5 rounded-full">
              Login por e-mail
            </span>
          </div>
          <p className="font-sans text-xs text-muted-foreground">
            Membro desde {formatMemberSince(user.loggedAt)}
          </p>
          <button
            type="button"
            onClick={() => setShowEdit(true)}
            className="inline-flex items-center gap-2 mt-2 font-sans text-xs text-primary hover:text-primary transition-colors cursor-pointer"
          >
            <Edit3 size={14} />
            Editar perfil
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Carrinho
          </span>
          <span className="font-hanken text-2xl font-bold text-primary">
            {cartCount}
          </span>
          <span className="font-sans text-xs text-muted-foreground">
            {cartCount === 1 ? 'item ativo' : 'itens ativos'}
          </span>
        </div>
        <Link
          href={routes.plans}
          className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1 hover:border-primary/30 transition-all cursor-pointer"
        >
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Plano {planLabel}
          </span>
          <span className="font-hanken text-2xl font-bold text-tertiary">{Math.round(discountRate * 100)}%</span>
          <span className="font-sans text-xs text-muted-foreground">
            desconto em compras
          </span>
        </Link>
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1">
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Pedidos
          </span>
          <span className="font-hanken text-2xl font-bold text-foreground">{orderCount}</span>
          <span className="font-sans text-xs text-muted-foreground">
            {orderCount === 1 ? 'pedido realizado' : 'pedidos realizados'}
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="font-hanken text-lg font-bold text-foreground border-b border-border pb-3">
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
        <h3 className="font-hanken text-lg font-bold text-foreground border-b border-border pb-3">
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
          onClick={() => setShowAddresses(true)}
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
        className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-border bg-muted text-muted-foreground font-mono text-sm font-medium hover:bg-accent hover:text-foreground transition-all duration-200 cursor-pointer"
        id="profile-logout-btn"
      >
        <LogOut size={16} />
        Sair da conta
      </button>

      {showEdit && (
        <ProfileEditView
          onClose={() => setShowEdit(false)}
          onSaved={() => refreshUser()}
        />
      )}

      {showAddresses && <AddressView onClose={() => setShowAddresses(false)} />}
    </div>
  );
}