'use client';

import { createClient } from './supabase/client';

const PLAN_DISCOUNTS: Record<string, number> = {
  petala: 0.05,
  ametista: 0.10,
  ultravioleta: 0.15,
};

export function getPlanDiscount(plan: string | null | undefined): number {
  if (!plan) return 0.05;
  return PLAN_DISCOUNTS[plan] ?? 0.05;
}

export function getPlanLabel(plan: string | null | undefined): string {
  switch (plan) {
    case 'petala': return 'Pétala';
    case 'ametista': return 'Ametista';
    case 'ultravioleta': return 'Ultravioleta';
    default: return 'Básico';
  }
}

export async function selectPlan(planId: string): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Usuário não autenticado');

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, plan: planId }, { onConflict: 'id' });

  if (error) throw new Error('Erro ao salvar plano');
}
