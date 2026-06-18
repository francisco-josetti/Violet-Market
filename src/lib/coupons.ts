import { createClient } from './supabase/client';
import { COUPONS } from '../data';
import type { PromoCoupon } from '../types';

export async function getCoupons(): Promise<PromoCoupon[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('code, discount_percentage, description')
      .eq('is_active', true);

    if (error || !data?.length) {
      return COUPONS;
    }

    return data.map((row) => ({
      code: row.code,
      discountPercentage: row.discount_percentage,
      description: row.description,
    }));
  } catch {
    return COUPONS;
  }
}

export async function validateCoupon(code: string): Promise<PromoCoupon | null> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('coupons')
      .select('code, discount_percentage, description')
      .eq('code', code.toUpperCase().trim())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      const localMatch = COUPONS.find(
        (c) => c.code === code.toUpperCase().trim(),
      );
      return localMatch ?? null;
    }

    return {
      code: data.code,
      discountPercentage: data.discount_percentage,
      description: data.description,
    };
  } catch {
    const localMatch = COUPONS.find((c) => c.code === code.toUpperCase().trim());
    return localMatch ?? null;
  }
}
