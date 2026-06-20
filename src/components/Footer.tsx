import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-8 w-full max-w-7xl mx-auto gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <span className="font-hanken text-xl font-bold text-primary tracking-wide">
            Violet Market
          </span>
          <p className="font-sans text-sm text-muted-foreground">
            © 2026 Violet Market. Precision performance marketplace.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
          <a
            href="#"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            id="footer-terms"
          >
            Termos de Uso
          </a>
          <a
            href="#"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            id="footer-privacy"
          >
            Política de Privacidade
          </a>
          <a
            href="#"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            id="footer-cookies"
          >
            Configurações de Cookies
          </a>
          <a
            href="#"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            id="footer-support"
          >
            Suporte
          </a>
          <a
            href="#"
            className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
            id="footer-merchant"
          >
            Portal do Vendedor
          </a>
        </nav>
      </div>
    </footer>
  );
}