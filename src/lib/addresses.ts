import type { Address, ViaCepResponse } from '../types';

const ADDRESSES_KEY = 'violet_market_addresses';

export function sanitizeCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8);
}

export function formatCep(value: string): string {
  const digits = sanitizeCep(value);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export async function fetchAddressByCep(cep: string): Promise<Omit<Address, 'id' | 'number' | 'complement' | 'label'> | null> {
  const digits = sanitizeCep(cep);

  if (digits.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return null;
    }

    return {
      cep: formatCep(data.cep),
      street: data.logradouro,
      neighborhood: data.bairro,
      city: data.localidade,
      state: data.uf,
    };
  } catch {
    return null;
  }
}

export function loadAddresses(): Address[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(ADDRESSES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Address[];
  } catch {
    return [];
  }
}

export function saveAddresses(addresses: Address[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(ADDRESSES_KEY, JSON.stringify(addresses));
  } catch {
    // ignore storage errors
  }
}

export function addAddress(address: Omit<Address, 'id'>): Address {
  const addresses = loadAddresses();
  const newAddress: Address = {
    ...address,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  };
  saveAddresses([...addresses, newAddress]);
  return newAddress;
}

export function updateAddress(id: string, updates: Partial<Address>): Address | null {
  const addresses = loadAddresses();
  const index = addresses.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const updated = { ...addresses[index], ...updates };
  addresses[index] = updated;
  saveAddresses(addresses);
  return updated;
}

export function removeAddress(id: string): void {
  const addresses = loadAddresses();
  saveAddresses(addresses.filter((a) => a.id !== id));
}
