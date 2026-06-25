import Link from 'next/link';
import { Search } from 'lucide-react';
import { routes } from '@/src/lib/routes';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-muted border border-border flex items-center justify-center">
          <Search size={36} className="text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl font-extrabold text-foreground">
            Pagina nao encontrada
          </h1>
          <p className="font-sans text-sm text-muted-foreground max-w-sm">
            A pagina que voce procura nao existe ou foi movida.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            href={routes.catalog}
            className="border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground px-6 py-3 rounded-xl font-mono text-xs font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
          >
            Ver catalogo
          </Link>
          <Link
            href={routes.home}
            className="bg-muted border border-border text-foreground px-6 py-3 rounded-xl font-mono text-xs font-medium tracking-wide hover:bg-accent transition-all cursor-pointer"
          >
            Voltar ao inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
