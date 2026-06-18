'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { CartItem, ProductPrereq } from '../types';
import { createClient } from '../lib/supabase/client';
import { getProductById } from '../lib/products';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

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

  useEffect(() => {
    if (!user) {
      setCart([]);
      setInitialized(true);
      return;
    }

    async function loadCartFromDB() {
      const supabase = createClient();
      const { data: cartRows } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', user!.id);

      if (!cartRows?.length) {
        setCart([]);
        setInitialized(true);
        return;
      }

      const items: CartItem[] = [];
      for (const row of cartRows) {
        const product = await getProductById(row.product_id);
        if (product) {
          items.push({ product, quantity: row.quantity });
        }
      }
      setCart(items);
      setInitialized(true);
    }

    loadCartFromDB();
  }, [user]);

  const syncToDB = useCallback(
    async (items: CartItem[]) => {
      if (!user) return;
      const supabase = createClient();
      for (const item of items) {
        await supabase.from('cart_items').upsert(
          {
            user_id: user.id,
            product_id: item.product.id,
            quantity: item.quantity,
          },
          { onConflict: 'user_id, product_id' },
        );
      }
    },
    [user],
  );

  const removeFromDB = useCallback(
    async (productId: string) => {
      if (!user) return;
      const supabase = createClient();
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    },
    [user],
  );

  const clearDB = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    await supabase.from('cart_items').delete().eq('user_id', user.id);
  }, [user]);

  const addToCart = useCallback(
    (product: ProductPrereq) => {
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.product.id === product.id,
        );
        let next: CartItem[];
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: updated[existingIdx].quantity + 1,
          };
          next = updated;
        } else {
          next = [...prev, { product, quantity: 1 }];
        }
        syncToDB(next);
        return next;
      });
      showToast(`✓ "${product.name}" adicionado ao carrinho!`);
    },
    [showToast, syncToDB],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        const next = prev.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(1, quantity) }
            : item,
        );
        syncToDB(next);
        return next;
      });
    },
    [syncToDB],
  );

  const removeItem = useCallback(
    (productId: string) => {
      setCart((prev) => {
        const targetItem = prev.find((item) => item.product.id === productId);
        if (targetItem) {
          showToast(`Removido: "${targetItem.product.name}" do carrinho.`);
        }
        removeFromDB(productId);
        return prev.filter((item) => item.product.id !== productId);
      });
    },
    [showToast, removeFromDB],
  );

  const clearCart = useCallback(() => {
    setCart([]);
    clearDB();
  }, [clearDB]);

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
