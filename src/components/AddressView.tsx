'use client';

import React, { useEffect, useState } from 'react';
import { X, MapPin, Trash2, Plus } from 'lucide-react';
import type { Address } from '../types';
import { loadAddresses, removeAddress } from '../lib/addresses';
import { useOverlay } from '../contexts/OverlayContext';
import AddressForm from './AddressForm';

interface AddressViewProps {
  onClose: () => void;
}

export default function AddressView({ onClose }: AddressViewProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const { setOverlayOpen } = useOverlay();

  const refresh = () => setAddresses(loadAddresses());

  useEffect(() => {
    setOverlayOpen(true);
    refresh();
    return () => setOverlayOpen(false);
  }, []);

  const handleDelete = (id: string) => {
    removeAddress(id);
    refresh();
  };

  const handleSaved = () => {
    refresh();
    setShowForm(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-end md:justify-center overflow-y-auto md:py-12"
      onClick={(e) => {
        if (e.currentTarget === e.target) onClose();
      }}
    >
      <div className="bg-card border border-border shadow-lg rounded-t-2xl md:rounded-2xl p-6 md:p-8 w-full md:w-[28rem] md:max-w-md max-h-[85vh] flex flex-col animate-fade-in md:my-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-hanken text-xl font-bold text-foreground flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Meus endereços
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary p-1 rounded-lg hover:bg-accent transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6 overflow-y-auto">
          {addresses.length === 0 && !showForm && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Você ainda não tem endereços salvos.
            </p>
          )}
          {addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-xl border border-border bg-card p-4 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="font-sans text-sm font-semibold text-foreground">
                  {address.label}
                </p>
                <p className="font-sans text-xs text-muted-foreground mt-1">
                  {address.street}, {address.number}
                  {address.complement && ` - ${address.complement}`}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {address.neighborhood} - {address.city}/{address.state}
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  CEP {address.cep}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(address.id)}
                className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer shrink-0"
                aria-label="Remover endereço"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-primary/30 text-primary font-mono text-xs font-medium hover:bg-primary/10 transition-all cursor-pointer"
          >
            <Plus size={16} />
            Adicionar endereço
          </button>
        )}

        {showForm && (
          <AddressForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}