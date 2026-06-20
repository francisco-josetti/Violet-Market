'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '../Footer';
import { routes } from '../../lib/routes';

interface AuthPageShellProps {
  children: React.ReactNode;
}

export default function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="flex flex-col min-h-full flex-grow">
      <div className="flex-grow flex flex-col">
        <div className="px-6 md:px-16 pt-8 pb-4 w-full max-w-7xl mx-auto">
          <Link
            href={routes.home}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-sans text-sm transition-colors"
            id="auth-back-home"
          >
            <ArrowLeft size={16} />
            Voltar à loja
          </Link>
        </div>

        <div className="flex-grow flex items-start justify-center px-6 pt-8 pb-12 md:pt-12 md:pb-16">
          <div className="w-full max-w-md animate-fade-in">{children}</div>
        </div>
      </div>

      <Footer />
    </div>
  );
}