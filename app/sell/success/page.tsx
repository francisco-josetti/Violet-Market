// 1. Imports externos
'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, PlusCircle } from 'lucide-react';
import { routes } from '@/src/lib/routes';
import { getProductById } from '@/src/lib/products';
import type { ProductPrereq } from '@/src/types';

function SuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || '';
  const [product, setProduct] = useState<ProductPrereq | null>(null);

  useEffect(() => {
    if (!productId) return;
    getProductById(productId).then(setProduct);
  }, [productId]);

  return (
    <div className="bg-card shadow-lg border border-tertiary/20 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6">
      <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary animate-pulse">
        <CheckCircle2 size={48} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-hanken text-2xl md:text-3xl font-extrabold text-foreground">
          Anúncio Publicado!
        </h1>
        {product ? (
          <div className="flex flex-col gap-1">
            <p className="font-hanken text-lg font-semibold text-primary">
              {product.name}
            </p>
            <p className="font-sans text-sm text-muted-foreground/80">
              Seu produto foi publicado com sucesso e já está disponível no catálogo.
            </p>
            <p className="font-mono text-xs text-muted-foreground/60 mt-1">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {product.bannerText && (
                <span className="ml-2 text-tertiary">| {product.bannerText}</span>
              )}
            </p>
          </div>
        ) : (
          <p className="font-sans text-sm text-muted-foreground/80">
            Seu produto foi publicado com sucesso e já está disponível para visualização no catálogo.
          </p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl px-4 py-3 font-mono text-xs w-full flex justify-between items-center text-left">
        <span className="text-muted-foreground/60">ID do Anúncio:</span>
        <span className="text-primary font-bold">{productId || '—'}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <Link
          href={routes.catalog}
          className="flex-1 bg-card hover:bg-accent border border-border hover:border-border text-foreground font-mono text-xs font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <ShoppingBag size={14} />
          Ver Catálogo
        </Link>
        <Link
          href="/sell"
          className="flex-1 border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-mono text-xs font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <PlusCircle size={14} />
          Novo Anúncio
        </Link>
      </div>
    </div>
  );
}

// 5. Componente Principal
function SellSuccessPage() {
  return (
    <article className="flex-grow flex items-center justify-center py-12 px-4 bg-background min-h-[85vh]">
      <Suspense
        fallback={
          <div className="bg-card shadow-lg border border-border rounded-2xl p-8 max-w-lg w-full text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
              Processando confirmação...
            </p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </article>
  );
}

// 6. Export default
export default SellSuccessPage;