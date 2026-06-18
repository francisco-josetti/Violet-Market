'use client';

import React, { useState } from 'react';
import type { Address } from '../types';
import {
  addAddress,
  fetchAddressByCep,
  formatCep,
  sanitizeCep,
} from '../lib/addresses';

interface AddressFormProps {
  onSaved: () => void;
  onCancel: () => void;
}

interface FormState {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  label: string;
}

const emptyForm: FormState = {
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
  label: '',
};

function Input({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  inputMode,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50 focus:ring-primary/25 transition-all"
      />
    </div>
  );
}

export default function AddressForm({ onSaved, onCancel }: AddressFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [loadingCep, setLoadingCep] = useState(false);
  const [error, setError] = useState('');

  const handleCepChange = (value: string) => {
    setForm((prev) => ({ ...prev, cep: formatCep(value) }));
  };

  const handleFillByCep = async () => {
    const digits = sanitizeCep(form.cep);
    if (digits.length !== 8) return;

    setLoadingCep(true);
    setError('');
    const data = await fetchAddressByCep(digits);
    setLoadingCep(false);

    if (!data) {
      setError('CEP não encontrado.');
      return;
    }

    setForm((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (sanitizeCep(form.cep).length !== 8) {
      setError('Informe um CEP válido.');
      return;
    }
    if (!form.street || !form.number || !form.neighborhood || !form.city || !form.state) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }

    addAddress({
      cep: formatCep(form.cep),
      street: form.street,
      number: form.number,
      complement: form.complement,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      label: form.label || 'Meu endereço',
    });

    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fade-in">
      {error && (
        <div className="text-sm text-error bg-error-container/10 border border-error/20 rounded-xl px-4 py-3" role="alert">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="address-cep" className="font-mono text-xs text-on-surface-variant uppercase tracking-wider">
          CEP
        </label>
        <div className="flex gap-2">
          <input
            id="address-cep"
            type="text"
            inputMode="numeric"
            value={form.cep}
            onChange={(e) => handleCepChange(e.target.value)}
            onBlur={handleFillByCep}
            placeholder="00000-000"
            className="flex-1 bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface font-sans text-sm focus:outline-none focus:ring-1 focus:border-primary/50 focus:ring-primary/25 transition-all"
          />
          <button
            type="button"
            onClick={handleFillByCep}
            disabled={loadingCep || sanitizeCep(form.cep).length !== 8}
            className="px-4 rounded-xl bg-surface-container-low border border-white/10 text-on-surface font-mono text-xs hover:bg-surface-container disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {loadingCep ? '...' : 'Buscar'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <Input id="address-street" label="Rua" value={form.street} onChange={(v) => setForm((p) => ({ ...p, street: v }))} />
        </div>
        <Input id="address-number" label="Nº" value={form.number} onChange={(v) => setForm((p) => ({ ...p, number: v }))} />
      </div>

      <Input
        id="address-complement"
        label="Complemento"
        value={form.complement}
        onChange={(v) => setForm((p) => ({ ...p, complement: v }))}
        placeholder="Apto, bloco, sala"
      />

      <Input id="address-neighborhood" label="Bairro" value={form.neighborhood} onChange={(v) => setForm((p) => ({ ...p, neighborhood: v }))} />

      <div className="grid grid-cols-2 gap-3">
        <Input id="address-city" label="Cidade" value={form.city} onChange={(v) => setForm((p) => ({ ...p, city: v }))} />
        <Input
          id="address-state"
          label="Estado"
          value={form.state}
          maxLength={2}
          onChange={(v) => setForm((p) => ({ ...p, state: v.toUpperCase() }))}
        />
      </div>

      <Input
        id="address-label"
        label="Identificação"
        value={form.label}
        onChange={(v) => setForm((p) => ({ ...p, label: v }))}
        placeholder="Casa, trabalho, etc."
      />

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-surface-container-low border border-white/10 text-on-surface font-mono text-xs py-3.5 rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-violet text-white py-3.5 rounded-xl font-mono text-xs font-medium tracking-wide hover:shadow-[0_0_25px_rgba(139,92,246,0.35)] transition-all duration-300 cursor-pointer"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
