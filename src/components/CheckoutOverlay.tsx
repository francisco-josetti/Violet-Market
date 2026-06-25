'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, MapPin, ChevronRight, ChevronLeft, Plus, CheckCircle2, Truck, Lock, Tag, Sparkles, Loader2 } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOverlay } from '../contexts/OverlayContext';
import { loadAddresses, addAddress, fetchAddressByCep, formatCep, sanitizeCep } from '../lib/addresses';
import { validateCoupon } from '../lib/coupons';
import { getPlanDiscount } from '../lib/plans';
import type { Address, PromoCoupon } from '../types';

type Step = 'address' | 'review';

interface CheckoutOverlayProps {
  onClose: () => void;
}

export default function CheckoutOverlay({ onClose }: CheckoutOverlayProps) {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { setOverlayOpen } = useOverlay();
  const [step, setStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [trackerId, setTrackerId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setOverlayOpen(true);
    const list = loadAddresses();
    setAddresses(list);
    if (list.length === 1) setSelectedAddressId(list[0].id);
    return () => setOverlayOpen(false);
  }, []);

  const refreshAddresses = () => {
    const list = loadAddresses();
    setAddresses(list);
    if (list.length === 1) setSelectedAddressId(list[0].id);
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const subtotal = useMemo(() => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0), [cart]);
  const discountRate = getPlanDiscount(user?.plan);
  const memberDiscount = subtotal * discountRate;
  const couponDiscount = appliedCoupon ? (subtotal - memberDiscount) * (appliedCoupon.discountPercentage / 100) : 0;
  const total = Math.max(0, subtotal - memberDiscount - couponDiscount);

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const matched = await validateCoupon(code);
    if (matched) {
      setAppliedCoupon(matched);
      setCouponInput('');
      setCouponError('');
    } else {
      setCouponError('Código inválido ou expirado');
      setAppliedCoupon(null);
    }
  };

  const handleAddAddress = (data: Omit<Address, 'id'>) => {
    addAddress(data);
    refreshAddresses();
    setShowAddressForm(false);
  };

  const handleConfirmCheckout = async () => {
    setSaving(true);
    const id = `VM-${Math.floor(100000 + Math.random() * 900000)}-XM`;
    setTrackerId(id);

    try {
      const { createClient } = await import('../lib/supabase/client');
      const supabase = createClient();
      await supabase.from('orders').insert({
        user_id: user?.id,
        tracker_id: id,
        subtotal,
        discount: memberDiscount + couponDiscount,
        total,
        items: cart.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        address: selectedAddress ? {
          cep: selectedAddress.cep,
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement,
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
        } : null,
        coupon_code: appliedCoupon?.code ?? null,
      });
    } catch (err) {
      console.error('Erro ao salvar pedido:', err);
    }

    setSaving(false);
    setCheckoutComplete(true);
    clearCart();
  };

  if (checkoutComplete) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/80 flex items-end md:justify-center overflow-y-auto md:py-12"
        onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
      >
        <div className="bg-card border border-border shadow-xl rounded-2xl rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full md:w-[28rem] border-t md:border flex flex-col items-center gap-6 text-center animate-fade-in md:my-auto">
          <div className="w-16 h-16 bg-tertiary/10 border border-tertiary/25 rounded-full flex items-center justify-center text-tertiary animate-bounce">
            <CheckCircle2 size={32} />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-hanken text-2xl font-extrabold text-foreground">Pedido Confirmado!</h2>
            <p className="font-sans text-sm text-muted-foreground">
              Sua requisição foi registrada com sucesso.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-4 border border-border w-full flex flex-col gap-2.5 text-left">
            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>RASTREADOR:</span>
              <span className="text-primary font-bold">{trackerId}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground">
              <span>ENTREGA:</span>
              <span className="text-tertiary font-bold">Frete Expresso Gratis</span>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-muted-foreground border-t border-border pt-2">
              <span>STATUS:</span>
              <span className="text-primary font-bold uppercase tracking-wider animate-pulse">Sendo Preparado</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-primary text-primary-foreground font-mono text-xs font-bold py-4 rounded-xl cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Retornar ao Catalogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:justify-center overflow-y-auto md:py-12"
      onClick={(e) => { if (e.currentTarget === e.target) onClose(); }}
    >
      <div className="bg-card border border-border shadow-xl rounded-2xl rounded-t-2xl md:rounded-2xl w-full md:w-[32rem] border-t md:border flex flex-col max-h-[90vh] animate-fade-in md:my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            {step === 'review' && (
              <button
                type="button"
                onClick={() => setStep('address')}
                className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="font-hanken text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
              {step === 'address' ? <MapPin size={20} className="text-primary" /> : <Truck size={20} className="text-primary" />}
              {step === 'address' ? 'Endereço de Entrega' : 'Confirmar Pedido'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 px-5 md:px-6 pt-3">
          <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'address' ? 'bg-primary' : 'bg-primary'}`} />
          <div className={`h-1 flex-1 rounded-full transition-colors ${step === 'review' ? 'bg-primary' : 'bg-muted'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 md:p-6">
          {step === 'address' && (
            <AddressStep
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
              showForm={showAddressForm}
              onToggleForm={() => setShowAddressForm(!showAddressForm)}
              onAddressAdded={handleAddAddress}
            />
          )}

          {step === 'review' && (
            <ReviewStep
              cart={cart}
              selectedAddress={selectedAddress}
              subtotal={subtotal}
              memberDiscount={memberDiscount}
              couponDiscount={couponDiscount}
              total={total}
              discountRate={discountRate}
              appliedCoupon={appliedCoupon}
              couponInput={couponInput}
              couponError={couponError}
              onCouponInputChange={setCouponInput}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={() => setAppliedCoupon(null)}
            />
          )}
        </div>

        {/* Footer action */}
        <div className="p-5 md:p-6 border-t border-border">
          {step === 'address' && (
            <button
              type="button"
              disabled={!selectedAddressId}
              onClick={() => setStep('review')}
              className="w-full border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar
              <ChevronRight size={14} />
            </button>
          )}
          {step === 'review' && (
            <button
              type="button"
              onClick={handleConfirmCheckout}
              disabled={saving}
              className="w-full border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-mono text-xs font-bold uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Lock size={14} />
              )}
              {saving ? 'Salvando...' : 'Confirmar Pedido'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddressStep({
  addresses,
  selectedAddressId,
  onSelect,
  showForm,
  onToggleForm,
  onAddressAdded,
}: {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelect: (id: string) => void;
  showForm: boolean;
  onToggleForm: () => void;
  onAddressAdded: (data: Omit<Address, 'id'>) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {addresses.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Nenhum endereço cadastrado. Adicione um para continuar.
        </p>
      )}

      {addresses.map((addr) => {
        const isSelected = addr.id === selectedAddressId;
        return (
          <button
            key={addr.id}
            type="button"
            onClick={() => onSelect(addr.id)}
            className={`text-left rounded-xl border p-4 transition-all cursor-pointer ${
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:border-primary/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold text-foreground">{addr.label}</p>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {addr.street}, {addr.number}{addr.complement && ` - ${addr.complement}`}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {addr.neighborhood} - {addr.city}/{addr.state}
                </p>
                <p className="font-sans text-xs text-muted-foreground">CEP {addr.cep}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                isSelected ? 'border-primary' : 'border-outline-variant'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
            </div>
          </button>
        );
      })}

      {!showForm && (
        <button
          type="button"
          onClick={onToggleForm}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 text-primary font-mono text-xs font-medium hover:bg-primary/10 transition-all cursor-pointer"
        >
          <Plus size={16} />
          Adicionar endereco
        </button>
      )}

      {showForm && (
        <InlineAddressForm
          onSaved={(data) => onAddressAdded(data)}
          onCancel={onToggleForm}
        />
      )}
    </div>
  );
}

function InlineAddressForm({
  onSaved,
  onCancel,
}: {
  onSaved: (data: Omit<Address, 'id'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    cep: '', street: '', number: '', complement: '',
    neighborhood: '', city: '', state: '', label: '',
  });
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState('');

  const handleCepBlur = async () => {
    const digits = sanitizeCep(form.cep);
    if (digits.length !== 8) return;
    setLoadingCep(true);
    const data = await fetchAddressByCep(digits);
    setLoadingCep(false);
    if (data) {
      setForm((p) => ({ ...p, ...data }));
    } else {
      setError('CEP nao encontrado.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (sanitizeCep(form.cep).length !== 8 || !form.street || !form.number || !form.neighborhood || !form.city || !form.state) {
      setError('Preencha todos os campos obrigatorios.');
      return;
    }
    onSaved({
      cep: formatCep(form.cep),
      street: form.street,
      number: form.number,
      complement: form.complement,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      label: form.label || 'Meu endereco',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 animate-fade-in border border-border rounded-xl p-4 bg-card">
      {error && (
        <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2" role="alert">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <input
          id="checkout-cep"
          type="text"
          inputMode="numeric"
          placeholder="CEP"
          value={form.cep}
          onChange={(e) => setForm((p) => ({ ...p, cep: formatCep(e.target.value) }))}
          onBlur={handleCepBlur}
          className="flex-1 bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50"
        />
        <button
          type="button"
          onClick={handleCepBlur}
          disabled={loadingCep || sanitizeCep(form.cep).length !== 8}
          className="px-3 rounded-lg bg-card border border-border text-foreground font-mono text-xs hover:bg-muted disabled:opacity-50 cursor-pointer"
        >
          {loadingCep ? '...' : 'Buscar'}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <input id="checkout-street" type="text" placeholder="Rua" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
        </div>
        <input id="checkout-number" type="text" placeholder="Numero" value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} className="bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
      </div>
      <input id="checkout-complement" type="text" placeholder="Complemento (opcional)" value={form.complement} onChange={(e) => setForm((p) => ({ ...p, complement: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
      <input id="checkout-neighborhood" type="text" placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm((p) => ({ ...p, neighborhood: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
      <div className="grid grid-cols-2 gap-3">
        <input id="checkout-city" type="text" placeholder="Cidade" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} className="bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
        <input id="checkout-state" type="text" placeholder="UF" maxLength={2} value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase() }))} className="bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
      </div>
      <input id="checkout-label" type="text" placeholder="Identificacao (Casa, trabalho...)" value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} className="w-full bg-card border border-border rounded-lg px-3 py-2.5 text-foreground font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50" />
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel} className="flex-1 bg-card border border-border text-foreground font-mono text-xs py-3 rounded-xl hover:bg-muted transition-colors cursor-pointer">
          Cancelar
        </button>
        <button type="submit" className="flex-1 border border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground dark:bg-primary dark:text-primary-foreground py-3 rounded-xl font-mono text-xs font-medium tracking-wide transition-all cursor-pointer">
          Salvar
        </button>
      </div>
    </form>
  );
}

function ReviewStep({
  cart,
  selectedAddress,
  subtotal,
  memberDiscount,
  couponDiscount,
  total,
  discountRate,
  appliedCoupon,
  couponInput,
  couponError,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
}: {
  cart: { product: { id: string; name: string; price: number }; quantity: number }[];
  selectedAddress: Address | null;
  subtotal: number;
  memberDiscount: number;
  couponDiscount: number;
  total: number;
  discountRate: number;
  appliedCoupon: PromoCoupon | null;
  couponInput: string;
  couponError: string;
  onCouponInputChange: (v: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {/* Address summary */}
      {selectedAddress && (
        <div className="rounded-xl border border-border bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={14} className="text-primary" />
            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">Entregar em</span>
          </div>
          <p className="font-sans text-sm font-semibold text-foreground">{selectedAddress.label}</p>
          <p className="font-sans text-xs text-muted-foreground mt-0.5">
            {selectedAddress.street}, {selectedAddress.number}{selectedAddress.complement && ` - ${selectedAddress.complement}`}
          </p>
          <p className="font-sans text-xs text-muted-foreground">
            {selectedAddress.neighborhood} - {selectedAddress.city}/{selectedAddress.state}
          </p>
          <p className="font-sans text-xs text-muted-foreground">CEP {selectedAddress.cep}</p>
        </div>
      )}

      {/* Items summary */}
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Itens</h3>
        {cart.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-sans text-sm text-foreground truncate">{item.product.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">Qtd: {item.quantity}</p>
            </div>
            <span className="font-mono text-sm text-foreground shrink-0">
              R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-2 pt-3 border-t border-border">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Subtotal</span>
          <span className="text-foreground">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Desconto Membro ({Math.round(discountRate * 100)}%)</span>
          <span className="text-tertiary">-R$ {memberDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Frete</span>
          <span className="text-tertiary uppercase font-bold">Gratis</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between items-center text-xs bg-primary/10 border border-border rounded-lg p-2">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <Tag size={13} />
              <span>{appliedCoupon.code} (-{appliedCoupon.discountPercentage}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-primary font-bold">-R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              <button type="button" onClick={onRemoveCoupon} className="text-primary hover:text-foreground cursor-pointer"><X size={14} /></button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-end pt-3 border-t border-border">
          <span className="font-hanken text-lg font-bold text-foreground">Total</span>
          <div className="text-right">
            <span className="block font-sans text-[10px] text-muted-foreground uppercase tracking-wider">BRL</span>
            <span className="font-mono text-xl text-primary font-extrabold">R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>

      {/* Coupon input (only if not applied) */}
      {!appliedCoupon && (
        <div>
          <label htmlFor="checkout-coupon" className="block font-mono text-[11px] text-muted-foreground tracking-wider uppercase font-semibold mb-1.5">Cupom de Desconto</label>
          <div className="flex gap-2">
            <input
              id="checkout-coupon"
              type="text"
              placeholder="Insira o codigo"
              className="w-full bg-card border border-outline-variant rounded-lg px-3 py-2 text-foreground font-sans text-xs focus:border-primary focus:ring-1 focus:ring-primary outline-none placeholder:text-muted-foreground/40"
              value={couponInput}
              onChange={(e) => onCouponInputChange(e.target.value)}
            />
            <button
              type="button"
              onClick={onApplyCoupon}
              className="bg-accent hover:bg-accent/80 text-foreground font-mono text-xs px-4 py-2 rounded-lg border border-outline-variant transition-colors cursor-pointer shrink-0"
            >
              Aplicar
            </button>
          </div>
          {couponError && <p className="text-destructive text-xs mt-1 font-mono">{couponError}</p>}
        </div>
      )}

      {appliedCoupon && (
        <p className="text-tertiary text-xs font-mono flex items-center gap-1">
          <Sparkles size={11} /> Cupom aplicado com sucesso!
        </p>
      )}

      <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px] opacity-75 select-none uppercase">
        <Lock size={12} className="text-primary" />
        Pagamento 100% seguro e criptografado
      </div>
    </div>
  );
}