'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus, Tag, ShoppingBag } from 'lucide-react';
import { ProductPrereq } from '../types';
import { PRODUCTS } from '../data';
import { getProducts } from '../lib/products';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';

export default function HomeView() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const isLoggedIn = useIsLoggedIn();
  const [productList, setProductList] = useState<ProductPrereq[]>(PRODUCTS);

  useEffect(() => {
    getProducts().then(setProductList);
  }, []);

  const newArrivalIds = [
    'visor-optico-pro',
    'keyboard-tatar-x1',
    'audio-espacial-v2',
    'pad-analitico-core',
  ];
  const newArrivals = productList.filter((p) => newArrivalIds.includes(p.id));

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('VIOLET20');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handleBentoClick = (category: string) => {
    router.push(routes.catalogWithCategory(category));
  };

  const handleSelectProduct = (product: ProductPrereq) => {
    router.push(routes.product(product.id));
  };

  return (
    <div className="flex flex-col gap-y-24 pb-24 animate-fade-in">
      <section className="relative w-full h-[640px] md:h-[760px] flex items-center justify-center overflow-hidden px-6 md:px-16">
        <div className="absolute inset-0 z-0">
          <img
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35 mix-blend-luminosity scale-105 pointer-events-none"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2YdjfcQDIFzIyAVCLbzVELwxdc2G82b4zwATET4tro-vAUOb9GNOoL6EF-hiMRu11gdIlwCrIeNbVyhSCLoeW3607dQcZYaPPBVc_H1GzoX5g9LZ8iDnednCmti9BLIsyxjaNPlwSofwjgsbn4al2PlF-PYGxDIXiBAOFaO3-dbNtahxLUWgO0Ldfne4gyhz2nuFlkX8EeXc13NLI8j6rhWhdcpR_hstSEJb-tAzs94pSEWIm0eMtlDfQTOjoGJz7HEAzdrbE5sWP"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-8 px-4">
          <h1 className="font-hanken text-4xl sm:text-5xl md:text-6.5xl font-extrabold text-on-surface leading-tight tracking-tight drop-shadow-2xl">
            Descubra o Futuro do{' '}
            <span className="text-primary text-glow-primary">Comércio</span>
          </h1>
          <p className="font-sans text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
            Equipamentos de alta performance e artefatos digitais exclusivos para
            a nova era. Uma curadoria impecável com precisão de elite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
            <Link
              href={routes.catalog}
              className="bg-brand-violet text-white px-8 py-4 rounded-xl font-mono text-sm tracking-wide font-medium transition-all duration-300 hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
              id="hero-explore-cta"
            >
              <ShoppingBag size={16} />
              Explorar Agora
            </Link>
            <button
              onClick={() => handleBentoClick('Hardware')}
              className="bg-surface/20 backdrop-blur-md border border-outline/30 px-8 py-4 rounded-xl font-mono text-sm tracking-wide font-medium text-on-surface hover:bg-surface/40 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              id="hero-collections-cta"
              type="button"
            >
              Ver Coleções
            </button>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-8 border-b border-surface-container-high pb-4">
          <h2
            className="font-hanken text-2xl sm:text-3xl font-bold text-on-surface tracking-tight"
            id="section-new-arrivals"
          >
            Novidades
          </h2>
          <Link
            href={routes.catalog}
            className="font-mono text-xs sm:text-sm text-primary hover:text-brand-violet transition-colors flex items-center gap-1 group cursor-pointer"
            id="view-all-new"
          >
            Ver tudo
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <div
              key={product.id}
              className="group flex flex-col bg-surface-container-low/50 rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 relative luxury-shadow cursor-pointer"
              onClick={() => handleSelectProduct(product)}
              id={`arrival-card-${product.id}`}
            >
              <div className="aspect-square w-full bg-surface-container-highest relative overflow-hidden">
                <img
                  alt={product.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 mix-blend-luminosity opacity-80 group-hover:opacity-100"
                  src={product.imageUrl}
                />
                {product.bannerText && (
                  <div className="absolute top-3 left-3 bg-primary/15 backdrop-blur-md border border-primary/20 px-3 py-1 rounded-full">
                    <span className="font-mono text-[10px] sm:text-xs text-primary font-medium tracking-wider uppercase">
                      {product.bannerText}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-grow bg-surface-container-low/50 z-10 relative">
                <h3 className="font-hanken text-base sm:text-lg text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-on-surface-variant line-clamp-2 md:h-10 leading-normal">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                  <span className="font-mono text-sm sm:text-base font-semibold text-on-surface font-semibold">
                    R${' '}
                    {product.price.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-8 h-8 rounded-full bg-surface-container-high hover:bg-brand-violet hover:text-white flex items-center justify-center text-on-surface-variant transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    title="Adicionar ao Carrinho"
                    id={`add-btn-${product.id}`}
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 pointer-events-none transition-colors duration-500"></div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="w-full max-w-7xl mx-auto px-6 md:px-16"
        id="categories-bento-section"
      >
        <h2 className="font-hanken text-2xl sm:text-3xl font-bold text-on-surface mb-8 border-b border-surface-container-high pb-4">
          Categorias em Destaque
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[600px]">
          <div
            onClick={() => handleBentoClick('Hardware')}
            className="md:col-span-2 md:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer luxury-shadow-sm h-[320px] md:h-auto border border-white/5 hover:border-primary/20 transition-all duration-500"
            id="bento-hardware"
          >
            <img
              alt="Hardware - Componentes de Elite"
              className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-102"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj76HPKqCcHHIASrsJsCrdVQxqAUXZx1j3OBPXwN9i11WvbJvZBzIAaO_fIhi_V5IyqgT4ZVzWRtDLPBXV5NTJe0C7_jt1ylbIvv379MThrlyvW4KcDRi7tz4_XV94vXXtEmNuPX82MST761WjyZqAcTzdjznofn621FRA-Bg8snmo88Rbpe8yVhmaZklRfvubPtyT5b5EtYYoSSn9OUJsVELrjTRATnk3hkvAx6nc0CHRMHsOKg42kEjJVSGecy_CDkGNcOX7qMKg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-8 z-10 w-full flex flex-col space-y-2">
              <span className="font-mono text-xs text-primary font-medium tracking-widest uppercase mb-1">
                Hardware
              </span>
              <h3 className="font-hanken text-2xl md:text-3xl font-bold text-on-surface">
                Componentes de Elite
              </h3>
              <p className="font-sans text-sm text-on-surface-variant max-w-sm">
                O ápice do desempenho para setups rigorosos e renderização extrema.
              </p>
            </div>
          </div>

          <div
            onClick={() => handleBentoClick('Wearables')}
            className="relative rounded-2xl overflow-hidden group bg-surface-container border border-white/5 hover:border-primary/10 transition-all duration-500 flex flex-col justify-end p-6 h-[200px] md:h-auto cursor-pointer"
            id="bento-wearables"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
            <div className="relative z-10">
              <span className="font-mono text-[10px] text-primary font-medium tracking-widest uppercase mb-1 block">
                Wearables
              </span>
              <h3 className="font-hanken text-xl md:text-2xl font-semibold text-on-surface">
                Integração Pessoal
              </h3>
            </div>
          </div>

          <div
            onClick={() => handleBentoClick('Periféricos')}
            className="relative rounded-2xl overflow-hidden group bg-surface-container border border-white/5 hover:border-primary/10 transition-all duration-500 flex flex-col justify-end p-6 h-[200px] md:h-auto cursor-pointer"
            id="bento-accessories"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/12 via-transparent to-transparent z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80"></div>
            <div className="relative z-10">
              <span className="font-mono text-[10px] text-primary font-medium tracking-widest uppercase mb-1 block">
                Acessórios
              </span>
              <h3 className="font-hanken text-xl md:text-2xl font-semibold text-on-surface">
                Precisão Periférica
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-7xl mx-auto px-6 md:px-16" id="promotional-banner">
        <div className="relative w-full rounded-2xl overflow-hidden bg-surface-container-high border border-primary/20 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8 luxury-shadow">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_100%_100%,_rgba(139,92,246,0.3)_0,_transparent_50%),_radial-gradient(circle_at_0%_0%,_rgba(139,92,246,0.15)_0,_transparent_40%)]"></div>

          <div className="relative z-10 flex flex-col space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center justify-center md:justify-start gap-2 text-primary font-mono text-xs uppercase mb-1 tracking-wider">
              <Tag size={14} /> Oferta Exclusiva
            </div>
            <h2 className="font-hanken text-2xl sm:text-3xl font-bold text-on-surface">
              Vantagem Tática
            </h2>
            <p className="font-sans text-sm sm:text-base text-on-surface-variant leading-relaxed">
              Ganhe 20% de desconto na sua primeira aquisição de equipamento premium
              com o código de acesso abaixo.
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={handleCopyCoupon}
              className="bg-surface-dim border border-outline border-dashed px-8 py-3.5 rounded-xl font-mono text-sm tracking-[0.2em] font-bold text-on-surface select-all cursor-pointer hover:border-primary hover:text-primary transition-all duration-300 hover:scale-103 active:scale-97 text-center w-full sm:w-auto"
              title="Clique para copiar cupom"
              id="promo-coupon-button"
              type="button"
            >
              VIOLET20
            </button>
            <span className="font-sans text-xs text-on-surface-variant select-none">
              {copiedCoupon ? (
                <span className="text-tertiary">✓ Código Copiado!</span>
              ) : (
                'Válido até o final do ciclo atual.'
              )}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
