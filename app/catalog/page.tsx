import { Suspense } from 'react';
import CatalogView from '@/src/components/CatalogView';

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogView />
    </Suspense>
  );
}
