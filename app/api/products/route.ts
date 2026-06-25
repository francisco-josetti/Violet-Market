import { NextResponse } from 'next/server';
import { createClient } from '@/src/lib/supabase/server';
import { sellFormSchema } from '@/src/lib/sell/schemas';

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

  const parsed = sellFormSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors = parsed.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    return NextResponse.json(
      { error: 'Dados inválidos', fields: fieldErrors },
      { status: 400 },
    );
  }

  const {
    title, description, price, stock, condition, images,
    categoryId, subcategory, shippingType, sku, variants,
    weightKg, cep,
  } = parsed.data;

  const priceInCents = Math.round(price * 100);

  const insertData: Record<string, unknown> = {
    seller_id: user.id,
    title,
    description,
    price: priceInCents,
    stock,
    condition,
    images,
    shipping_type: shippingType,
  };

  if (sku) insertData.sku = sku;
  if (categoryId) insertData.category_id = categoryId;
  if (subcategory) insertData.subcategory = subcategory;
  if (variants && variants.length > 0) insertData.variants = variants;
  if (shippingType === 'calculate') {
    insertData.weight_kg = weightKg ?? null;
    insertData.cep = cep ?? null;
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