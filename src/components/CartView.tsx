'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Plus, Minus, Truck, Lock, ArrowRight, Tag, Sparkles, CheckCircle2, ShoppingCart, LogIn } from 'lucide-react';
import { COUPONS } from '../data';
import { useCart } from '../contexts/CartContext';
import { routes } from '../lib/routes';
import { useIsLoggedIn } from '../hooks/useIsLoggedIn';

export default function CartView() {
  const router = useRouter();
  const isLoggedIn = useIsLoggedIn();
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[0] | null>(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [trackerId, setTrackerId] = useState('');

  // 1. Calculations
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // VIP discount 5% automatically
  const vipDiscount = useMemo(() => {
    return subtotal * 0.05;
  }, [subtotal]);

  // Promo coupon discount (e.g. VIOLET20 gives 20% off after subtotal - vipDiscount)
  const couponDiscount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const baseValue = subtotal - vipDiscount;
    return baseValue * (appliedCoupon.discountPercentage / 100);
  }, [appliedCoupon, subtotal, vipDiscount]);

  const total = useMemo(() => {
    const val = subtotal - vipDiscount - couponDiscount;
    return val > 0 ? val : 0;
  }, [subtotal, vipDiscount, couponDiscount]);

  // 2. Coupon submission handler
  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === '') return;

    const matched = COUPONS.find(c => c.code === code);
    if (matched) {
      setAppliedCoupon(matched);
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Código inválido ou expirado');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // 3. Checkout handler
  const handleCheckout = () => {
    if (cart.length === 0) return;
    const randomTracker = `VIP-${Math.floor(100000 + Math.random() * 900000)}-XM`;
    setTrackerId(randomTracker);
    setCheckoutComplete(true);
    clearCart();
  };

  if (isLoggedIn === null) {
    return null;
  }

  if (isLoggedIn === false) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 md:px-16 py-16 text-center animate-fade-in flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-primary/10 border border-primary/25 rounded-full flex items-center justify-center text-primary">
          <Lock size={36} />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-extrabold text-on-surface">
            Carrinho de Compras
          </h1>
          <p className="font-sans text-sm text-on-surface-variant max-w-md">
            Você não está logado. Faça login para visualizar seu carrinho e finalizar
            sua compra com segurança.
          </p>
        </div>
        <Link
          href={routes.login}
          className="bg-brand-violet text-white px-8 py-4 rounded-xl font-mono text-sm font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 flex items-center justify-center gap-2"
          id="cart-login-btn"
        >
          <LogIn size={16} />
          Fazer login
        </Link>
        <Link
          href={routes.catalog}
          className="font-sans text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          Continuar comprando
        </Link>
      </div>
    );
  }

  if (checkoutComplete) {
    return (
      <div className="w-full max-w-xl mx-auto px-6 py-16 text-center animate-fade-in flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-tertiary/10 border border-tertiary/25 rounded-full flex items-center justify-center text-tertiary animate-bounce">
          <CheckCircle2 size={40} />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-hanken text-3xl font-extrabold text-on-surface">Pedido de Elite Confirmado!</h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-md">
            Parabéns! Sua requisição foi registrada com sucesso sob altíssima criptografia de segurança.
          </p>
        </div>

        <div className="bg-surface-container rounded-xl p-5 border border-white/5 w-full flex flex-col gap-3">
          <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
            <span>ID DO RASTREADOR:</span>
            <span className="text-primary font-bold">{trackerId}</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
            <span>MÉTODO DE ENTREGA:</span>
            <span className="text-tertiary font-bold">Frete Expresso Grátis ⚡</span>
          </div>
          <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant border-t border-white/5 pt-3">
            <span>STATUS ATUAL:</span>
            <span className="text-primary font-bold uppercase tracking-wider animate-pulse">Sendo Preparado</span>
          </div>
        </div>

        <Link
          href={routes.catalog}
          onClick={() => setCheckoutComplete(false)}
          className="mt-4 bg-primary text-on-primary font-mono text-xs font-bold px-8 py-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all w-full text-center"
        >
          Retornar ao Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6 md:px-16 py-8 flex flex-col lg:flex-row gap-8 animate-fade-in">
      
      {/* Back button header helper */}
      <div className="w-full lg:hidden flex items-center gap-2 mb-2">
        <Link
          href={routes.catalog}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 cursor-pointer text-sm"
        >
          <ArrowLeft size={16} /> Voltar à Loja
        </Link>
      </div>

      {/* Cart Items List */}
      <section className="flex-grow flex flex-col gap-6">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="font-hanken text-2xl sm:text-3xl font-bold text-on-surface">
            Carrinho de Compras
          </h1>
          <span className="font-mono text-sm text-on-surface-variant">{cartItemCount} Itens</span>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 bg-surface-container-lowest/30 rounded-2xl border border-white/5 gap-4">
            <ShoppingCart size={40} className="text-on-surface-variant opacity-60" />
            <h3 className="font-hanken text-lg font-bold text-on-surface">Seu carrinho está vazio</h3>
            <p className="font-sans text-sm text-on-surface-variant max-w-sm">
              Você ainda não adicionou nenhum equipamento premium ao seu carrinho de compras.
            </p>
            <Link
              href={routes.catalog}
              className="mt-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-mono text-xs font-bold cursor-pointer hover:bg-primary-container transition-all hover:shadow-[0_0_15px_rgba(208,188,255,0.4)]"
            >
              Começar a Comprar
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cart.map((item) => (
              <div
                key={item.product.id}
                className="glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center group transition-colors duration-300 hover:bg-surface-container"
              >
                {/* Thumb Photo */}
                <div className="w-full sm:w-28 h-28 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative border border-white/5">
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
                        className="font-hanken text-base sm:text-lg text-on-surface leading-tight hover:text-primary transition-colors cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <p className="font-sans text-xs text-on-surface-variant mt-1 mb-1">
                        {item.product.category}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-on-surface-variant hover:text-error transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer shrink-0"
                      title="Excluir item"
                      id={`remove-cart-${item.product.id}`}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Quantity and dynamic Price */}
                  <div className="flex justify-between items-end mt-auto pt-3 border-t border-white/5">
                    {/* Select controller */}
                    <div className="flex items-center gap-1 bg-surface-container-low rounded-lg p-1 border border-outline-variant">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary transition-colors rounded hover:bg-white/5 cursor-pointer"
                        title="Diminuir"
                      >
                        <Minus size={13} />
                      </button>
                      <input
                        type="number"
                        title="Quantidade"
                        className="w-8 text-center bg-transparent border-none text-on-surface font-mono text-xs focus:ring-0 p-0"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.product.id, Math.max(1, parseInt(e.target.value) || 1))}
                      />
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-on-surface hover:text-primary transition-colors rounded hover:bg-white/5 cursor-pointer"
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
            <div className="bg-surface-container-low border border-primary/20 rounded-xl p-4 flex items-start gap-3 mt-4 animate-pulse">
              <Truck size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-mono text-xs text-on-surface font-bold uppercase tracking-wider">
                  Frete Expresso Grátis
                </h4>
                <p className="font-sans text-xs text-on-surface-variant mt-1 leading-relaxed">
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
          <div className="glass-panel rounded-xl p-5 md:p-6 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
            <h2 className="font-hanken text-lg md:text-xl font-bold text-on-surface mb-6 border-b border-white/10 pb-3 h-8 flex items-center">
              Resumo do Pedido
            </h2>

            {/* Values overview */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between items-center text-on-surface-variant font-sans text-xs sm:text-sm">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-on-surface">
                  R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-sans text-xs sm:text-sm">
                <span>Desconto (Membro VIP 5%)</span>
                <span className="font-mono font-semibold text-tertiary">
                  - R$ {vipDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center text-on-surface-variant font-sans text-xs sm:text-sm">
                <span>Frete</span>
                <span className="font-mono font-semibold text-tertiary uppercase text-xs">Grátis</span>
              </div>

              {/* Promo applied chip */}
              {appliedCoupon && (
                <div className="flex justify-between items-center text-on-surface-variant font-sans text-xs sm:text-sm bg-primary/10 border border-primary/25 rounded-lg p-2.5">
                  <div className="flex items-center gap-1.5 text-primary font-semibold">
                    <Tag size={13} />
                    <span>{appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-primary font-bold">
                      -R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-primary hover:text-white transition-colors cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code input field */}
            <div className="mb-6">
              <label className="block font-mono text-[11px] text-on-surface-variant tracking-wider uppercase font-semibold mb-2" htmlFor="coupon-input">
                Cupom de Desconto
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon-input"
                  type="text"
                  placeholder="Insira o código"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-on-surface font-sans text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-on-surface-variant/40"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-surface-container-high hover:bg-surface-bright text-on-surface font-mono text-xs px-4 py-2 rounded-lg border border-outline-variant transition-colors cursor-pointer h-10 flex items-center justify-center shrink-0"
                  id="coupon-apply-btn"
                >
                  Aplicar
                </button>
              </div>
              {couponError && <p className="text-error text-xs mt-1.5 font-mono">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-tertiary text-xs mt-1.5 font-mono flex items-center gap-1">
                  <Sparkles size={11} /> Cupom aplicado com sucesso!
                </p>
              )}
            </div>

            {/* Total price area */}
            <div className="border-t border-white/10 pt-4 mb-6">
              <div className="flex justify-between items-end">
                <span className="font-hanken text-lg font-bold text-on-surface">Total</span>
                <div className="text-right">
                  <span className="block font-sans text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">
                    BRL
                  </span>
                  <span className="font-mono text-xl sm:text-2xl text-primary font-extrabold text-glow-primary">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Check action */}
            <button
              onClick={handleCheckout}
              className="w-full bg-brand-violet hover:bg-primary-container text-white py-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.35)] flex items-center justify-center gap-2 cursor-pointer scale-100 active:scale-[0.98]"
              id="checkout-action-btn"
            >
              Proceder para o Checkout
              <ArrowRight size={14} />
            </button>

            {/* Visual reassurance details */}
            <p className="text-center font-sans text-[10px] text-on-surface-variant mt-4 flex items-center justify-center gap-1.5 opacity-80 select-none">
              <Lock size={12} className="text-primary" /> Pagamento 100% seguro e criptografado
            </p>
          </div>
        </aside>
      )}
    </div>
  );
}
