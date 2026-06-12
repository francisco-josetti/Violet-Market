import { notFound } from 'next/navigation';
import DetailView from '@/src/components/DetailView';
import { PRODUCTS } from '@/src/data';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <DetailView product={product} />;
}
