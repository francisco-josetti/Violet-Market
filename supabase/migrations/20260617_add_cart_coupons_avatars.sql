-- Migration: add_cart_coupons_avatars
-- Data: 2026-06-17
-- Descrição: Cria tabelas cart_items, coupons e bucket avatars

-- Tabela de itens do carrinho
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items" ON public.cart_items
  FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own cart items" ON public.cart_items
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own cart items" ON public.cart_items
  FOR UPDATE USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own cart items" ON public.cart_items
  FOR DELETE USING ((select auth.uid()) = user_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);

-- Tabela de cupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  description TEXT NOT NULL DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons" ON public.coupons
  FOR SELECT USING (is_active = true);

INSERT INTO public.coupons (code, discount_percentage, description)
VALUES ('VIOLET20', 20, '20% de Desconto na primeira aquisição')
ON CONFLICT (code) DO NOTHING;

-- Bucket avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Políticas do storage para avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND (select auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND (select auth.uid())::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND (select auth.uid())::text = (storage.foldername(name))[1]);
