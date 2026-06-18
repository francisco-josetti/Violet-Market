import { createClient } from './supabase/client';
import { PRODUCTS } from '../data';
import type { ProductPrereq } from '../types';

interface ProductRow {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: string;
  images: string[];
  rating: number | null;
  reviews_count: number | null;
  stock: number;
  category_id: string | null;
  subcategory: string | null;
  categories: { name: string; slug: string } | null;
}

function mapProductRow(row: ProductRow): ProductPrereq {
  const conditionLabels: Record<string, string> = {
    new: 'Novo',
    like_new: 'Quase novo',
    good: 'Bom estado',
    defective: 'Com defeito',
  };

  return {
    id: row.id,
    name: row.title,
    description: row.description,
    price: row.price / 100,
    rating: row.rating ?? 5.0,
    reviewsCount: row.reviews_count ?? 0,
    category: row.categories?.name ?? '',
    imageUrl: row.images?.[0] ?? '',
    galleryUrls: row.images?.length > 1 ? row.images : undefined,
    bannerText: conditionLabels[row.condition],
  };
}

export async function getProducts(): Promise<ProductPrereq[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, description, price, condition, images, rating, reviews_count, stock, category_id, subcategory, categories(name, slug)')
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      return PRODUCTS;
    }

    const dbProducts = (data as unknown as ProductRow[]).map(mapProductRow);
    return [...dbProducts, ...PRODUCTS];
  } catch {
    return PRODUCTS;
  }
}

export async function getProductsPaginated(
  page: number,
  pageSize: number,
): Promise<{ products: ProductPrereq[]; total: number }> {
  const supabase = createClient();

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from('products')
      .select('id, title, description, price, condition, images, rating, reviews_count, stock, category_id, subcategory, categories(name, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error || !data?.length) {
      return { products: PRODUCTS, total: PRODUCTS.length };
    }

    const dbProducts = (data as unknown as ProductRow[]).map(mapProductRow);
    const allProducts = [...dbProducts, ...PRODUCTS];
    return {
      products: allProducts,
      total: (count ?? 0) + PRODUCTS.length,
    };
  } catch {
    return { products: PRODUCTS, total: PRODUCTS.length };
  }
}

export async function getProductById(id: string): Promise<ProductPrereq | null> {
  const mockProduct = PRODUCTS.find((p) => p.id === id) ?? null;
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, title, description, price, condition, images, rating, reviews_count, stock, category_id, subcategory, categories(name, slug)')
      .eq('id', id)
      .single();

    if (error || !data) {
      return mockProduct;
    }

    return mapProductRow(data as unknown as ProductRow);
  } catch {
    return mockProduct;
  }
}