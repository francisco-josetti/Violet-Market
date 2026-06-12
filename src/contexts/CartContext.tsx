'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CartItem, ProductPrereq } from '../types';
import { PRODUCTS } from '../data';

interface CartContextValue {
  cart: CartItem[];
  addToCart: (product: ProductPrereq) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  toastMessage: string | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const quantumShoes = PRODUCTS.find((p) => p.id === 'quantum-velocity-shoes');
    const auraHeadset = PRODUCTS.find((p) => p.id === 'aura-noise-headset');

    const initialList: CartItem[] = [];
    if (quantumShoes) {
      initialList.push({ product: quantumShoes, quantity: 1 });
    }
    if (auraHeadset) {
      initialList.push({ product: auraHeadset, quantity: 2 });
    }
    return initialList;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = useCallback(
    (product: ProductPrereq) => {
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.product.id === product.id,
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += 1;
          return updated;
        }
        return [...prev, { product, quantity: 1 }];
      });
      showToast(`✓ "${product.name}" adicionado ao carrinho!`);
    },
    [showToast],
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const targetItem = prev.find((item) => item.product.id === productId);
        if (targetItem) {
          showToast(`Removido: "${targetItem.product.name}" do carrinho.`);
        }
        return prev.filter((item) => item.product.id !== productId);
      });
    },
    [showToast],
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        toastMessage,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}
