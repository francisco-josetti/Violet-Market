import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const {
    title, description, price, stock, condition, images,
    categoryId, subcategory, shippingType, sku, variants,
    weightKg, cep,
  } = body;

  if (!title || !description || price == null || !stock || !condition || !images || !shippingType) {
    return NextResponse.json(
      { error: 'Campos obrigatórios faltando' },
      { status: 400 },
    );
  }

  const priceInCents = Math.round(Number(price) * 100);

  const insertData: Record<string, unknown> = {
    seller_id: user.id,
    title: String(title),
    description: String(description),
    price: priceInCents,
    stock: Number(stock),
    condition: String(condition),
    images,
    shipping_type: String(shippingType),
  };

  if (sku) insertData.sku = String(sku);
  if (categoryId) insertData.category_id = String(categoryId);
  if (subcategory) insertData.subcategory = String(subcategory);
  if (Array.isArray(variants) && variants.length > 0) insertData.variants = variants;
  if (shippingType === 'calculate') {
    insertData.weight_kg = weightKg ? Number(weightKg) : null;
    insertData.cep = cep ? String(cep) : null;
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert(insertData)
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ productId: product.id }, { status: 201 });
}