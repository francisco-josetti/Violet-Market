import Link from 'next/link';
import { routes } from '@/src/lib/routes';

export default function ProductNotFound() {
  return (
    <div className="w-full max-w-xl mx-auto px-6 py-24 text-center flex flex-col items-center gap-6">
      <h1 className="font-hanken text-3xl font-extrabold text-on-surface">
        Produto não encontrado
      </h1>
      <p className="font-sans text-sm text-on-surface-variant">
        O item que você procura não existe ou foi removido do catálogo.
      </p>
      <Link
        href={routes.catalog}
        className="bg-primary text-on-primary font-mono text-xs font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
      >
        Voltar ao catálogo
      </Link>
    </div>
  );
}
