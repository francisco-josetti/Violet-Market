'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, Star, X, ChevronLeft, ChevronRight, SlidersHorizontal, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterState, ProductPrereq } from '../types';
import { PRODUCTS } from '../data';
import { getProductsPaginated } from '../lib/products';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';

const ITEMS_PER_PAGE = 8;

export default function CatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const categoriaParam = searchParams.get('categoria');

  const [productList, setProductList] = useState<ProductPrereq[]>(PRODUCTS);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(PRODUCTS.length);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: categoriaParam ? [categoriaParam] : ['Hardware'],
    priceMin: 0,
    priceMax: 15000,
    minRating: 0,
    sortBy: 'relevance',
    searchQuery: ''
  });

  useEffect(() => {
    getProductsPaginated(currentPage, ITEMS_PER_PAGE).then(({ products, total }) => {
      setProductList(products);
      setTotalProducts(total);
    });
  }, [currentPage]);

  useEffect(() => {
    if (categoriaParam) {
      setFilters((prev) => ({
        ...prev,
        categories: [categoriaParam],
      }));
    }
  }, [categoriaParam]);

  const categoriesAvailable = ['Hardware', 'Periféricos', 'Áudio High-End', 'Wearables', 'Acessórios'];

  const handleSelectProduct = (productId: string) => {
    router.push(routes.product(productId));
  };

  // Handle Category click toggles
  const handleToggleCategory = (category: string) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      let updatedCategories: string[];
      if (isSelected) {
        // Toggle off
        updatedCategories = prev.categories.filter(c => c !== category);
      } else {
        // Toggle on
        updatedCategories = [...prev.categories, category];
      }
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceMin: 0,
      priceMax: 15000,
      minRating: 0,
      sortBy: 'relevance',
      searchQuery: ''
    });
  };

  const handleRemoveCategoryChip = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  // Get display items with count helper
  const countByCategoryHelper = (category: string) => {
    return productList.filter(p => p.category === category).length;
  };

  // Process and Filter Products
  const processedProducts = useMemo(() => {
    let result = [...productList];

    // Search Query
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Price query
    result = result.filter(p => p.price >= filters.priceMin && p.price <= filters.priceMax);

    // Rating Query
    if (filters.minRating > 0) {
      result = result.filter(p => p.rating >= filters.minRating);
    }

    // Sorting query
    if (filters.sortBy === 'lowestPrice') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'highestPrice') {
      result.sort((a, b) => b.price - a.price);
    } // relevance remains as sorting layout order

    return result;
  }, [filters]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col lg:flex-row gap-8 animate-fade-in">
      
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="font-hanken text-lg font-bold text-foreground flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-primary" /> Filtros
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters((prev) => !prev)}
              className="lg:hidden font-mono text-xs text-primary hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
              aria-expanded={showMobileFilters}
              aria-controls="mobile-filters-panel"
              id="toggle-mobile-filters"
            >
              {showMobileFilters ? (
                <>
                  Ocultar <ChevronUp size={14} />
                </>
              ) : (
                <>
                  Mostrar <ChevronDown size={14} />
                </>
              )}
            </button>
            <button
              onClick={handleClearFilters}
              className="font-mono text-xs text-primary hover:text-primary transition-colors cursor-pointer"
              id="clear-all-filters"
            >
              Limpar Tudo
            </button>
          </div>
        </div>

        <div
          id="mobile-filters-panel"
          className={`flex-col gap-6 ${showMobileFilters ? 'flex' : 'hidden lg:flex'}`}
        >
        {/* Search tool */}
        <div className="bg-background border border-border rounded-xl p-3 flex items-center gap-2 focus-within:border-primary transition-colors">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="bg-transparent border-none outline-none text-sm text-foreground w-full p-0 placeholder:text-muted-foreground/50 focus:ring-0"
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            id="catalog-search"
          />
          {filters.searchQuery && (
            <button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}>
              <X size={14} className="text-muted-foreground hover:text-white" />
            </button>
          )}
        </div>

        {/* Categories Checkbox List */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase font-semibold">
            CATEGORIAS
          </h3>
          <div className="flex flex-col gap-2.5">
            {categoriesAvailable.map((category) => {
              const checked = filters.categories.includes(category);
              return (
                <label
                  key={category}
                  className="flex items-center gap-3 cursor-pointer group select-none text-sm"
                  id={`cat-label-${category}`}
                >
                  <div
                    onClick={() => handleToggleCategory(category)}
                    className={`relative flex items-center justify-center w-5 h-5 rounded border ${
                      checked
                        ? 'border-primary bg-primary'
                        : 'border-border bg-muted group-hover:border-primary'
                    } transition-colors cursor-pointer`}
                  >
                    {checked && <div className="w-2.5 h-2.5 bg-surface-dim rounded-[2px]" />}
                  </div>
                  <span className={`transition-colors ${checked ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                    {category} ({countByCategoryHelper(category)})
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Price filter section */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase font-semibold">
            FAIXA DE PREÇO
          </h3>
          <div className="flex gap-2 items-center">
            <div className="flex-1 bg-muted border border-border rounded p-2 focus-within:border-primary transition-colors flex items-center gap-1">
              <span className="font-mono text-xs text-muted-foreground">R$</span>
              <input
                type="number"
                title="Preço mínimo"
                className="bg-transparent border-none outline-none text-xs text-foreground w-full p-0 focus:ring-0"
                value={filters.priceMin}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMin: Math.max(0, parseInt(e.target.value) || 0) }))}
                id="price-min-input"
              />
            </div>
            <span className="text-muted-foreground text-xs">-</span>
            <div className="flex-1 bg-muted border border-border rounded p-2 focus-within:border-primary transition-colors flex items-center gap-1">
              <span className="font-mono text-xs text-muted-foreground">R$</span>
              <input
                type="number"
                title="Preço máximo"
                className="bg-transparent border-none outline-none text-xs text-foreground w-full p-0 focus:ring-0"
                value={filters.priceMax}
                onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Math.max(0, parseInt(e.target.value) || 0) }))}
                id="price-max-input"
              />
            </div>
          </div>
          {/* Slider input for fast touch controls */}
          <input
            type="range"
            min={0}
            max={15000}
            step={500}
            className="w-full accent-primary mt-2"
            value={filters.priceMax}
            onChange={(e) => setFilters(prev => ({ ...prev, priceMax: parseInt(e.target.value) }))}
            aria-label="Controle de preço máximo"
            id="price-range-slider"
          />
        </div>

        {/* Rating filter section */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
          <h3 className="font-mono text-[11px] text-muted-foreground tracking-wider uppercase font-semibold">
            AVALIAÇÃO MÍNIMA
          </h3>
          <div className="flex flex-col gap-3">
            {[4, 5].map((stars) => {
              const active = filters.minRating === stars;
              return (
                <label
                  key={stars}
                  className="flex items-center gap-3 cursor-pointer group text-sm select-none"
                  onClick={() => setFilters(prev => ({ ...prev, minRating: active ? 0 : stars }))}
                >
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      active
                        ? 'border-primary'
                        : 'border-border group-hover:border-primary'
                    } transition-all`}
                  >
                    {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </div>
                  <div className="flex items-center text-tertiary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={15}
                        fill={i < stars ? '#4edea3' : 'transparent'}
                        className="mr-0.5"
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground group-hover:text-primary transition-colors">
                      {stars} & Acima
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
        </div>
      </aside>

      {/* Product Grid Area */}
      <section className="flex-grow flex flex-col gap-6">
        
        {/* Grid Header / Active Filters & Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted rounded-xl p-4 border border-border">
          {/* Active Chips */}
          <div className="flex gap-2 flex-wrap">
            {filters.categories.map((cat) => (
              <div
                key={cat}
                className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-2 font-mono text-[10px] sm:text-xs font-semibold"
                id={`chip-${cat}`}
              >
                {cat}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleRemoveCategoryChip(cat)}
                />
              </div>
            ))}
            {filters.minRating > 0 && (
              <div className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-3 py-1 rounded-full flex items-center gap-2 font-mono text-[11px] font-semibold">
                ★ {filters.minRating}+ Estrelas
                <X
                  size={12}
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))}
                />
              </div>
            )}
            {filters.priceMax < 15000 && (
              <div className="bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-2 font-mono text-[11px] font-semibold">
                Até R$ {filters.priceMax}
                <X
                  size={12}
                  className="cursor-pointer hover:text-white transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, priceMax: 15000 }))}
                />
              </div>
            )}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs text-muted-foreground font-medium">Ordenar por:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-card border border-border text-foreground rounded-lg px-3 py-1.5 font-mono text-xs tracking-wide focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%23958ea0%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[position:right_8px_center] bg-no-repeat"
              id="catalog-sort-select"
            >
              <option value="relevance">Relevância</option>
              <option value="lowestPrice">Menor Preço</option>
              <option value="highestPrice">Maior Preço</option>
            </select>
          </div>
        </div>

        {/* Empty State visual */}
        {processedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-muted/50 rounded-2xl border border-border gap-4">
            <SlidersHorizontal size={40} className="text-muted-foreground opacity-60" />
            <h3 className="font-hanken text-lg font-bold text-foreground">Nenhum produto encontrado</h3>
            <p className="font-sans text-sm text-muted-foreground max-w-sm">
              Tente redefinir seus filtros ou digite um termo de pesquisa diferente.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-lg font-mono text-xs cursor-pointer"
            >
              Redefinir Filtros
            </button>
          </div>
        ) : (
          /* Products Grid matching Bento design styling */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {processedProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className="bg-card rounded-xl border border-border overflow-hidden group flex flex-col hover:-translate-y-1 transition-all duration-300 shadow-lg relative cursor-pointer"
                id={`product-card-${product.id}`}
              >
                {/* Photo Header */}
                <div className="h-64 bg-muted relative overflow-hidden">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    src={product.imageUrl}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
                  
                  {product.bannerText && (
                    <div className="absolute top-3 left-3 bg-tertiary-container/85 text-tertiary px-2 py-1 rounded text-[10px] font-mono font-bold tracking-wide uppercase border border-tertiary/20">
                      {product.bannerText}
                    </div>
                  )}
                </div>

                {/* Card description details */}
                <div className="p-4 flex flex-col flex-grow gap-2.5 bg-gradient-to-b from-card to-muted">
                  <h3 className="font-hanken text-base font-semibold text-foreground leading-tight line-clamp-2 h-10 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Rating / Pricing detail */}
                  <div className="mt-auto pt-4 flex items-end justify-between border-t border-border">
                    <div className="flex flex-col gap-0.5">
                      {product.originalPrice && (
                        <span className="font-mono text-[10px] sm:text-xs text-muted-foreground line-through opacity-50">
                          R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      )}
                      <span className="font-mono text-sm sm:text-base text-primary font-bold">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center text-tertiary bg-tertiary/10 border border-tertiary/20 px-2.5 py-1 rounded-md">
                      <Star size={13} fill="#4edea3" className="mr-1" />
                      <span className="font-mono text-xs font-bold leading-none">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Add direct Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full mt-4 bg-primary text-on-primary py-3 rounded-lg font-mono text-xs font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart size={15} />
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Custom pagination layout */}
        {totalProducts > ITEMS_PER_PAGE && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            {(() => {
              const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
              const pages: (number | string)[] = [];
              const maxVisible = 5;

              if (totalPages <= maxVisible + 2) {
                for (let i = 1; i <= totalPages; i++) pages.push(i);
              } else {
                pages.push(1);
                if (currentPage > 3) pages.push('...');
                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) pages.push(i);
                if (currentPage < totalPages - 2) pages.push('...');
                pages.push(totalPages);
              }

              return pages.map((page, idx) => {
                if (typeof page === 'string') {
                  return (
                    <span key={`ellipsis-${idx}`} className="text-muted-foreground mx-1 font-mono text-xs">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-mono text-xs cursor-pointer transition-all ${
                      page === currentPage
                        ? 'bg-primary text-on-primary font-bold shadow-lg shadow-primary/20'
                        : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
            <button
              onClick={() => setCurrentPage((p) => Math.min(Math.ceil(totalProducts / ITEMS_PER_PAGE), p + 1))}
              disabled={currentPage >= Math.ceil(totalProducts / ITEMS_PER_PAGE)}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all cursor-pointer disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}