// 1. Imports externos
'use client';
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, PlusCircle } from 'lucide-react';

// 2. Imports internos
import { routes } from '@/src/lib/routes';

// 3. Tipos/interfaces locais

// 4. Constantes locais

// Subcomponente que consome useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('id') || 'desconhecido';

  return (
    <div className="glass-panel border border-tertiary/20 rounded-2xl p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6 shadow-[0_0_50px_rgba(78,222,163,0.1)]">
      <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary animate-pulse">
        <CheckCircle2 size={48} className="drop-shadow-[0_0_10px_rgba(78,222,163,0.4)]" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-hanken text-2xl md:text-3xl font-extrabold text-white">
          Anúncio Publicado!
        </h1>
        <p className="font-sans text-sm text-on-surface-variant/80">
          Seu produto foi publicado com sucesso e já está disponível para visualização no catálogo.
        </p>
      </div>

      <div className="bg-surface-container-low/60 border border-white/5 rounded-xl px-4 py-3 font-mono text-xs w-full flex justify-between items-center text-left">
        <span className="text-on-surface-variant/60">ID do Anúncio:</span>
        <span className="text-primary font-bold">{productId}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
        <Link
          href={routes.catalog}
          className="flex-1 bg-surface-container-low hover:bg-surface-container border border-white/10 hover:border-white/20 text-on-surface font-mono text-xs font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-center"
        >
          <ShoppingBag size={14} />
          Ver Catálogo
        </Link>
        <Link
          href="/sell"
          className="flex-1 bg-brand-violet hover:bg-brand-violet/90 text-white font-mono text-xs font-semibold py-3.5 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] flex items-center justify-center gap-2 cursor-pointer text-center"
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
          <div className="glass-panel border border-white/5 rounded-2xl p-8 max-w-lg w-full text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-t-brand-violet border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-on-surface-variant/70">
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
