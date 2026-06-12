import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 mt-auto transition-all">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-8 w-full max-w-7xl mx-auto gap-8 text-center md:text-left">
        <div className="flex flex-col gap-2">
          <span className="font-hanken text-xl font-bold text-primary tracking-wide">
            Violet Market
          </span>
          <p className="font-sans text-sm text-on-surface-variant">
            © 2026 Violet Market. Precision performance marketplace.
          </p>
        </div>

        <nav className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3">
          <a
            href="#"
            className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            id="footer-terms"
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            id="footer-privacy"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            id="footer-cookies"
          >
            Cookie Settings
          </a>
          <a
            href="#"
            className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            id="footer-support"
          >
            Contact Support
          </a>
          <a
            href="#"
            className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors opacity-80 hover:opacity-100"
            id="footer-merchant"
          >
            Merchant Portal
          </a>
        </nav>
      </div>
    </footer>
  );
}
