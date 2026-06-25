'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { routes } from '@/src/lib/routes';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center flex flex-col items-center gap-6 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
          <AlertTriangle size={36} className="text-destructive" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl font-extrabold text-foreground">
            Algo deu errado
          </h1>
          <p className="font-sans text-sm text-muted-foreground max-w-sm">
            Ocorreu um erro inesperado. Tente novamente ou volte para o inicio.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground px-6 py-3 rounded-xl font-mono text-xs font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            Tentar novamente
          </button>
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
