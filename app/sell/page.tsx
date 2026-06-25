// 1. Imports externos
'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// 2. Imports internos
import SellWizard from '@/src/components/sell/SellWizard';
import { useIsLoggedIn } from '@/src/hooks/useIsLoggedIn';
import { routes } from '@/src/lib/routes';

// 3. Tipos/interfaces locais

// 4. Constantes locais

// 5. Componente
function SellPage() {
  const router = useRouter();
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    if (loggedIn === false) {
      router.push(routes.login);
    }
  }, [loggedIn, router]);

  // Enquanto verifica o status de login, exibe um loading spinner premium
  if (loggedIn === null) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center min-h-[50vh] text-foreground">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
          Autenticando sessão...
        </p>
      </div>
    );
  }

  // Se não estiver logado, não renderiza nada para evitar flash de conteúdo
  if (loggedIn === false) {
    return null;
  }

  return (
    <article className="flex-grow py-8 px-4 md:py-12 bg-background min-h-[80vh]">
      <header className="max-w-3xl mx-auto mb-8 text-center flex flex-col gap-2">
        <h1 className="font-hanken text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Anunciar Produto
        </h1>
        <p className="font-sans text-sm md:text-base text-muted-foreground/80">
          Publique seu item no Violet Market e alcance compradores exigentes.
        </p>
      </header>
      
      <section aria-label="Wizard de Venda">
        <SellWizard />
      </section>
    </article>
  );
}

// 6. Export default
export default SellPage;
