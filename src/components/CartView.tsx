'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus, Minus, Truck, Lock, ArrowRight, Tag, Sparkles, CheckCircle2, ShoppingCart, LogIn } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';
import CheckoutOverlay from './CheckoutOverlay';

export default function CartView() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { cart, updateQuantity, removeItem } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const vipDiscount = subtotal * 0.05;
  const total = Math.max(0, subtotal - vipDiscount);

  if (isLoggedIn === null) {
    return null;
  }

if (isLoggedIn === false) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 md:px-16 py-16 text-center animate-fade-in flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 border border-border rounded-full flex items-center justify-center text-primary">
          <Lock size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-foreground">
            Carrinho de Compras
          </h1>
          <p className="font-sans text-sm text-muted-foreground max-w-md">
            Você não está logado. Faça login para visualizar seu carrinho e finalizar
            sua compra com segurança.
          </p>
        </div>
        <Link
          href={routes.login}
          className="bg-primary text-white px-8 py-4 rounded-xl font-mono text-sm font-medium tracking-wide transition-all duration-300 flex items-center justify-center gap-2"
          id="cart-login-btn"
        >
          <LogIn size={16} />
          Fazer login
        </Link>
        <Link
          href={routes.catalog}
          className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  return (
    <>
      {showCheckout && <CheckoutOverlay onClose={() => setShowCheckout(false)} />}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col lg:flex-row gap-8 animate-fade-in">
      
      {/* Back button header helper */}
      <div className="w-full lg:hidden flex items-center gap-2 mb-2">
        <Link
          href={routes.catalog}
          className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-sm"
        >
          <ArrowLeft size={16} /> Voltar à Loja
        </Link>
      </div>

      {/* Cart Items List */}
      <section className="flex-grow flex flex-col gap-6">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-bold text-foreground">
            Carrinho de Compras
          </h1>
          <span className="font-mono text-sm text-muted-foreground">{cartItemCount} Itens</span>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-muted rounded-2xl border border-border gap-4">
            <ShoppingCart size={40} className="text-muted-foreground opacity-60" />
            <h3 className="font-hanken text-lg font-bold text-foreground">Seu carrinho está vazio</h3>
            <p className="font-sans text-sm text-muted-foreground max-w-sm">
              Você ainda não adicionou nenhum equipamento premium ao seu carrinho de compras.
            </p>
            <Link
              href={routes.catalog}
              className="mt-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-primary-container transition-all"
            >
              Começar a Comprar
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center group transition-colors duration-300 hover:bg-muted"
              >
                {/* Thumb Photo */}
                <div className="w-full sm:w-28 h-28 rounded-lg bg-accent overflow-hidden shrink-0 relative border border-border">
                  <img
                    alt={item.product.name}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-300"
                    src={item.product.imageUrl}
                  />
                </div>

                {/* Desc with Quantity controls */}
                <div className="flex-1 flex flex-col gap-2 w-full">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3
                        onClick={() => router.push(routes.product(item.product.id))}
                        className="font-hanken text-base sm:text-lg text-foreground leading-tight hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <p className="font-sans text-xs text-muted-foreground mt-1 mb-1">
                        {item.product.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-full hover:bg-accent cursor-pointer shrink-0"
                      title="Excluir item"
                      id={`remove-cart-${item.product.id}`}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Quantity and dynamic Price */}
                  <div className="flex justify-between items-end mt-auto pt-3 border-t border-border">
                    {/* Select controller */}
                    <div className="flex items-center gap-1 bg-card rounded-lg p-1 border border-outline-variant">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-foreground hover:text-primary transition-colors rounded hover:bg-accent cursor-pointer"
                        title="Diminuir"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        title="Quantidade"
                        className="w-8 text-center bg-transparent border-none text-foreground font-mono text-xs focus:ring-0 p-0"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-foreground hover:text-primary transition-colors rounded hover:bg-accent cursor-pointer"
                        title="Aumentar"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    {/* Subtotal representing quantity times unit price */}
                    <span className="font-mono text-sm sm:text-base text-primary font-semibold tracking-wide">
                      R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Delivery Info Banner */}
            <div className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 mt-4 animate-pulse">
              <Truck size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-mono text-xs text-foreground font-bold uppercase tracking-wider">
                  Frete Expresso Grátis
                </h4>
                <p className="font-sans text-xs text-muted-foreground mt-1 leading-relaxed">
                  Você atingiu o valor mínimo para entrega prioritária com rastreamento de satélite.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Order Summary Sidebar */}
      {cart.length > 0 && (
        <aside className="w-full lg:w-[400px] shrink-0 mt-8 lg:mt-0">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="font-hanken text-lg md:text-xl font-bold text-foreground mb-6 border-b border-border pb-3 h-8 flex items-center">
              Resumo do Pedido
            </h2>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-muted-foreground font-sans text-xs sm:text-sm">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-foreground">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-sans text-xs sm:text-sm">
                <span>Desconto (Membro VIP 5%)</span>
                <span className="font-mono font-semibold text-tertiary">
                  - R$ {vipDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground font-sans text-xs sm:text-sm">
                <span>Frete</span>
                <span className="font-mono font-semibold text-tertiary uppercase text-xs">Grátis</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-hanken text-lg font-bold text-foreground">Total</span>
                <div className="text-right">
                  <span className="block font-sans text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    BRL
                  </span>
                  <span className="font-mono text-xl sm:text-2xl text-primary font-extrabold">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary hover:bg-primary-container text-white py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer scale-100 active:scale-[0.98]"
              id="checkout-action-btn"
            >
              Proceder para o Checkout
              <ArrowRight size={14} />
            </button>

            <p className="text-center font-sans text-[10px] text-muted-foreground mt-4 flex items-center justify-center gap-1.5 opacity-80 select-none">
              <Lock size={12} className="text-primary" /> Pagamento 100% seguro e criptografado
            </p>
          </div>
        </aside>
      )}
    </div>
    </>
  );
}