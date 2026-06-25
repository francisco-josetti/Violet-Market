'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Star, Gem, ArrowRight, Shield, Zap, Truck, Clock, BadgePercent, MessageCircle, Camera, Crown, Loader2 } from 'lucide-react';
import { routes } from '@/src/lib/routes';
import { useAuth } from '@/src/contexts/AuthContext';
import { selectPlan } from '@/src/lib/plans';

interface PlanFeature {
  text: string;
  icon: React.ReactNode;
}

interface Plan {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  monthlyPrice: number;
  annualPrice: number;
  discountPercent: number;
  features: PlanFeature[];
  highlighted?: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'petala',
    name: 'Pétala',
    icon: <Sparkles size={22} />,
    color: 'text-primary',
    borderColor: 'border-primary/30',
    monthlyPrice: 9.90,
    annualPrice: 99.90,
    discountPercent: 5,
    features: [
      { text: '5% de desconto em todas as compras', icon: <BadgePercent size={14} /> },
      { text: 'Frete grátis em compras acima de R$ 100', icon: <Truck size={14} /> },
      { text: 'Suporte por email em até 24h', icon: <MessageCircle size={14} /> },
    ],
  },
  {
    id: 'ametista',
    name: 'Ametista',
    icon: <Gem size={22} />,
    color: 'text-tertiary',
    borderColor: 'border-tertiary/30',
    monthlyPrice: 24.90,
    annualPrice: 249.90,
    discountPercent: 10,
    highlighted: true,
    features: [
      { text: '10% de desconto em todas as compras', icon: <BadgePercent size={14} /> },
      { text: 'Frete grátis em todas as compras', icon: <Truck size={14} /> },
      { text: 'Acesso antecipado a lançamentos (24h)', icon: <Clock size={14} /> },
      { text: 'Suporte prioritário em até 4h', icon: <Zap size={14} /> },
      { text: 'Badge exclusivo no perfil', icon: <Shield size={14} /> },
    ],
  },
  {
    id: 'ultravioleta',
    name: 'Ultravioleta',
    icon: <Crown size={22} />,
    color: 'text-chart-4',
    borderColor: 'border-chart-4/30',
    monthlyPrice: 49.90,
    annualPrice: 499.90,
    discountPercent: 15,
    features: [
      { text: '15% de desconto em todas as compras', icon: <BadgePercent size={14} /> },
      { text: 'Frete grátis expresso em todo Brasil', icon: <Truck size={14} /> },
      { text: 'Acesso antecipado a lançamentos (48h)', icon: <Clock size={14} /> },
      { text: 'Produtos exclusivos para membros', icon: <Star size={14} /> },
      { text: 'Suporte VIP 24/7 via chat', icon: <MessageCircle size={14} /> },
      { text: '2 anúncios grátis por mês', icon: <Camera size={14} /> },
      { text: 'Badge dourado no perfil', icon: <Crown size={14} /> },
    ],
  },
];

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default function PlansPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      router.push(routes.register);
      return;
    }
    setLoadingPlan(planId);
    try {
      await selectPlan(planId);
      await refreshUser();
      router.push(routes.catalog);
    } catch {
      setLoadingPlan(null);
    }
  };

  return (
    <article className="flex-grow py-8 px-4 md:py-12 bg-background min-h-[80vh]">
      <header className="max-w-3xl mx-auto mb-8 text-center flex flex-col gap-3">
        <p className="font-mono text-xs text-primary uppercase tracking-widest">
          Planos Violet
        </p>
        <h1 className="font-hanken text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Escolha seu plano de membro
        </h1>
        <p className="font-sans text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
          Desbloqueie descontos, frete grátis e benefícios exclusivos como membro do Violet Market.
        </p>
      </header>

      <div className="flex justify-center mb-10">
        <div className="bg-card border border-border rounded-xl p-1 flex gap-1">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              billing === 'monthly'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={`px-6 py-2.5 rounded-lg font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-2 ${
              billing === 'annual'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Anual
            <span className="text-[10px] bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded-full font-bold">
              -17%
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative bg-card border rounded-2xl p-6 md:p-8 flex flex-col gap-6 transition-all duration-300 hover:shadow-xl ${
              plan.highlighted
                ? 'border-tertiary/40 shadow-lg shadow-tertiary/5 scale-[1.02] md:scale-105'
                : `${plan.borderColor} hover:border-primary/20`
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-tertiary text-on-tertiary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Mais popular
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-card border ${plan.borderColor} flex items-center justify-center ${plan.color}`}>
                {plan.icon}
              </div>
              <h2 className={`font-hanken text-xl font-bold ${plan.color}`}>
                {plan.name}
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-sm text-muted-foreground">R$</span>
                <span className="font-hanken text-4xl font-extrabold text-foreground">
                  {billing === 'monthly' ? formatPrice(plan.monthlyPrice) : formatPrice(plan.annualPrice / 12)}
                </span>
                <span className="font-sans text-sm text-muted-foreground">/mês</span>
              </div>
              {billing === 'annual' && (
                <p className="font-sans text-xs text-muted-foreground">
                  R$ {formatPrice(plan.annualPrice)} cobrados anualmente
                </p>
              )}
            </div>

            <ul className="flex flex-col gap-3 flex-1">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 font-sans text-sm text-foreground/80">
                  <span className={`shrink-0 mt-0.5 ${plan.color}`}>
                    {feature.icon}
                  </span>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleSelectPlan(plan.id)}
              disabled={loadingPlan !== null}
              className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer text-center disabled:opacity-50 ${
                plan.highlighted
                  ? 'border border-tertiary text-tertiary bg-transparent hover:bg-tertiary hover:text-on-tertiary dark:bg-tertiary dark:text-on-tertiary dark:hover:bg-tertiary/90'
                  : `border ${plan.borderColor} ${plan.color} bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 dark:border-primary`
              }`}
            >
              {loadingPlan === plan.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  Começar agora
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <footer className="max-w-3xl mx-auto mt-16 text-center flex flex-col gap-3">
        <p className="font-sans text-xs text-muted-foreground">
          Todos os planos incluem garantia de 7 dias para reembolso. Cancele quando quiser.
        </p>
        <Link
          href={routes.catalog}
          className="inline-flex items-center gap-2 font-sans text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowRight size={14} className="rotate-180" />
          Continuar comprando sem plano
        </Link>
      </footer>
    </article>
  );
}
