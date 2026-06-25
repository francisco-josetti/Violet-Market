import { notFound } from 'next/navigation';
import DetailView from '@/src/components/DetailView';
import { getProductById } from '@/src/lib/products';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <DetailView product={product} />;
}
