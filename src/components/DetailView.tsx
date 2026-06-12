'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Video, BatteryCharging, Gauge, Eye, Heart, ShieldCheck, Star, Play, ChevronRight, ShoppingBag } from 'lucide-react';
import { ProductPrereq } from '../types';
import { PRODUCTS } from '../data';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';

interface DetailViewProps {
  product: ProductPrereq;
}

export default function DetailView({ product }: DetailViewProps) {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleBuyNow = () => {
    addToCart(product);
    router.push(routes.cart);
  };

  const handleSelectProduct = (related: ProductPrereq) => {
    router.push(routes.product(related.id));
  };
  // Setup primary active gallery image
  const defaultGallery = product.galleryUrls && product.galleryUrls.length > 0
    ? product.galleryUrls
    : [product.imageUrl];

  const [activeImage, setActiveImage] = useState(defaultGallery[0]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isWished, setIsWished] = useState(false);

  // Generate real related accessories based on Category, excluding self
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 4);

  const handleThumbnailClick = (url: string) => {
    setActiveImage(url);
    setIsVideoPlaying(false);
  };

  const handleVideoThumbClick = () => {
    setIsVideoPlaying(true);
  };

  const handleToggleWishlist = () => {
    setIsWished(!isWished);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 animate-fade-in flex flex-col gap-12">
      
      {/* Breadcrumbs matching image navigation */}
      <nav aria-label="Breadcrumb" className="flex text-on-surface-variant font-mono text-xs mb-2">
        <ol className="inline-flex items-center space-x-2">
          <li>
            <Link
              href={routes.home}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Home
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight size={12} className="opacity-65" />
            <Link
              href={routes.catalog}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Categorias
            </Link>
          </li>
          <li className="flex items-center gap-1.5">
            <ChevronRight size={12} className="opacity-65" />
            <Link
              href={routes.catalogWithCategory(product.category)}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              {product.category}
            </Link>
          </li>
          <li aria-current="page" className="flex items-center gap-1.5 text-on-surface truncate max-w-[200px] sm:max-w-xs font-semibold">
            <ChevronRight size={12} className="opacity-65" />
            <span>{product.name}</span>
          </li>
        </ol>
      </nav>

      {/* Main product setup card layout splits 12 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        
        {/* Gallery Section columns (Left-side 7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass-panel relative group border border-white/5 flex items-center justify-center">
            {isVideoPlaying ? (
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-3">
                <span className="animate-ping absolute w-4 h-4 bg-primary rounded-full" />
                <span className="font-mono text-xs text-primary font-bold tracking-wider animate-pulse">
                  Conectando Transmissão Holográfica em 8K...
                </span>
                <button
                  onClick={() => setIsVideoPlaying(false)}
                  className="mt-4 bg-primary/10 border border-primary/25 hover:bg-primary/20 text-xs font-mono text-primary px-4 py-2 rounded-lg cursor-pointer"
                >
                  Voltar à Galeria
                </button>
              </div>
            ) : (
              <img
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                src={activeImage}
                referrerPolicy="no-referrer"
              />
            )}

            {/* Static labels tags */}
            {product.bannerText && (
              <div className="absolute top-4 left-4 z-10">
                <span className="bg-primary/15 text-primary border border-primary/20 font-mono text-[10px] sm:text-xs px-3.5 py-1.5 rounded-full backdrop-blur-md uppercase font-semibold tracking-wider">
                  {product.bannerText}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnails row underneath */}
          <div className="grid grid-cols-4 gap-3">
            {defaultGallery.map((url, index) => {
              const active = url === activeImage && !isVideoPlaying;
              return (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(url)}
                  className={`aspect-square rounded-xl overflow-hidden glass-panel shrink-0 border relative cursor-pointer ${
                    active ? 'border-primary' : 'border-outline-variant hover:border-primary/50'
                  } transition-all`}
                  id={`thumb-btn-${index}`}
                >
                  <img
                    alt={`Thumbnail view ${index + 1}`}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100"
                    src={url}
                    referrerPolicy="no-referrer"
                  />
                </button>
              );
            })}

            {/* Simulated Live broadcast video thumbnail */}
            <button
              onClick={handleVideoThumbClick}
              className={`aspect-square rounded-xl overflow-hidden glass-panel shrink-0 border relative cursor-pointer flex flex-col items-center justify-center gap-1 bg-surface-container-high hover:border-primary ${
                isVideoPlaying ? 'border-primary bg-primary/5' : 'border-outline-variant'
              } transition-all`}
              aria-label="Assistir Transmissão"
              id="drone-video-thumb-trigger"
            >
              <Play size={20} className={isVideoPlaying ? 'text-primary animate-pulse' : 'text-on-surface-variant'} />
              <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider hidden sm:block">
                Vídeo Pro
              </span>
            </button>
          </div>
        </div>

        {/* Specs and action layout columns (Right-side 5 cols) */}
        <div className="lg:col-span-5 flex flex-col pt-1">
          {/* Star review metric details */}
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center text-[#ffb400] text-xs font-semibold bg-[#ffb400]/10 px-2 py-0.5 rounded-md">
              <Star size={13} fill="#ffb400" className="mr-0.5" />
              {product.rating.toFixed(1)}
            </span>
            <span className="text-on-surface-variant text-xs font-medium">({product.reviewsCount} avaliações de prestígio)</span>
          </div>

          <h1 className="font-hanken text-2xl sm:text-3xl md:text-3.5xl font-extrabold text-on-surface leading-tight tracking-tight mb-4">
            {product.name}
          </h1>

          <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-white/10">
            <span className="font-mono text-3xl sm:text-4xl font-black text-glow-primary text-primary">
              R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
            {product.originalPrice && (
              <span className="font-mono text-sm sm:text-base text-on-surface-variant line-through opacity-50">
                R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {/* Core tech specs grid from JSON properties mapped nicely layout */}
          {product.specs && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {Object.entries(product.specs).map(([key, val], idx) => {
                // Return descriptive styled elements
                let iconComponent = <Eye size={16} className="text-primary mb-1" />;
                if (key.toLowerCase().includes('resolu')) iconComponent = <Video size={16} className="text-primary mb-1" />;
                else if (key.toLowerCase().includes('autono')) iconComponent = <BatteryCharging size={16} className="text-primary mb-1" />;
                else if (key.toLowerCase().includes('velocid')) iconComponent = <Gauge size={16} className="text-primary mb-1" />;
                else if (key.toLowerCase().includes('sensor') || key.toLowerCase().includes('conex')) iconComponent = <Eye size={16} className="text-primary mb-1" />;

                return (
                  <div key={idx} className="glass-panel p-3.5 rounded-xl flex flex-col gap-0.5 border border-white/5 h-20 justify-center">
                    {iconComponent}
                    <span className="font-mono text-[9px] sm:text-[10px] text-on-surface-variant uppercase tracking-wider">{key}</span>
                    <span className="font-sans text-xs sm:text-sm font-semibold text-on-surface">{val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Triggers */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Direct purchase */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-[#8B5CF6] hover:bg-brand-violet text-white font-mono text-xs font-bold uppercase tracking-wider h-14 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] cursor-pointer active:scale-98"
              id="buy-now-cta"
            >
              <ShoppingBag size={15} />
              Comprar Agora
            </button>

            {/* Standard Cart add */}
            <button
              onClick={() => addToCart(product)}
              className="w-full border border-primary hover:bg-primary/5 text-primary font-mono text-xs font-bold uppercase tracking-wider h-14 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              id="add-to-cart-detail-cta"
            >
              Adicionar ao Carrinho
            </button>

            {/* Add to Wishlist toggle */}
            <button
              onClick={handleToggleWishlist}
              className={`w-full border py-3 rounded-lg text-xs font-mono tracking-wide hover:bg-white/5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                isWished
                  ? 'border-tertiary text-tertiary bg-tertiary/5'
                  : 'border-outline-variant text-on-surface-variant hover:text-white'
              }`}
            >
              <Heart size={14} fill={isWished ? '#4edea3' : 'transparent'} />
              {isWished ? 'Adicionado aos Desejos!' : 'Adicionar aos Desejos'}
            </button>
          </div>

          {/* Trust reassurance detail labels */}
          <div className="mt-6 flex items-center gap-2 text-on-surface-variant font-mono text-[10px] tracking-wide select-none uppercase justify-center opacity-75">
            <ShieldCheck size={14} className="text-primary mt-0.5" />
            Garantia Violet Market - 12 Meses Inclusa
          </div>
        </div>
      </div>

      {/* Connected Related Accessories matching mockup bottom */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-white/5">
          <h2 className="font-hanken text-lg md:text-xl font-bold text-on-surface tracking-tight">
            Produtos Relacionados
          </h2>
          <button
            onClick={() => router.push(routes.catalog)}
            className="text-primary font-mono text-xs sm:text-sm hover:text-brand-violet flex items-center gap-1 group cursor-pointer"
          >
            Ver todos
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <div
              key={related.id}
              onClick={() => {
                handleSelectProduct(related);
                setActiveImage(related.imageUrl);
                setIsVideoPlaying(false);
              }}
              className="glass-panel rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-white/5"
            >
              <div className="w-full aspect-[4/3] overflow-hidden relative bg-surface-container border-b border-white/5">
                <img
                  alt={related.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103 opacity-95 group-hover:opacity-100"
                  src={related.imageUrl}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-hanken text-xs sm:text-sm font-semibold text-on-surface mb-2 group-hover:text-primary transition-colors line-clamp-1">
                  {related.name}
                </h3>
                <span className="font-mono text-xs font-bold text-primary text-glow-primary mt-auto">
                  R$ {related.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
