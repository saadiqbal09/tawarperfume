'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { CartItem, ComboSelection, Product } from './types';

// ═══════════════════════════════════════════════
// Cart Context — combo-aware
// ═══════════════════════════════════════════════

type MixMatchItem = {
  productId: string;
  productName: string;
  fragrance: string;
  design?: string;
  price: number;
};

type AddComboPayload = {
  product: Product;
  comboSelections?: ComboSelection[];
  mixMatchProducts?: MixMatchItem[];
  unitPrice: number; // final price after any combo discount
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product) => void;
  addCombo: (payload: AddComboPayload) => void;
  removeItem: (cartItemId: string) => void;
  updateQty: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  // Offer logic
  qualifiesForFreeCard: boolean;
  hasComboInCart: boolean;
  amountToFreeCard: number;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'tawar-cart-v2';

// Build a stable cartItemId from product + selections
function buildCartItemId(
  productId: string,
  comboSelections?: ComboSelection[],
  mixMatchProducts?: MixMatchItem[]
): string {
  if (mixMatchProducts?.length) {
    const sig = mixMatchProducts
      .map((m) => `${m.productId}:${m.fragrance}:${m.design ?? ''}`)
      .join('|');
    return `${productId}__mix__${sig}`;
  }
  if (comboSelections?.length) {
    const sig = comboSelections
      .map((s) => `${s.slot}:${s.fragrance}:${s.design ?? ''}`)
      .join('|');
    return `${productId}__combo__${sig}`;
  }
  return `${productId}__single`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = (product: Product) => {
    const cartItemId = buildCartItemId(product.id);
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product,
          qty: 1,
          unitPrice: product.price,
        },
      ];
    });
  };

  const addCombo = (payload: AddComboPayload) => {
    const cartItemId = buildCartItemId(
      payload.product.id,
      payload.comboSelections,
      payload.mixMatchProducts
    );
    setItems((prev) => {
      const existing = prev.find((i) => i.cartItemId === cartItemId);
      if (existing) {
        return prev.map((i) =>
          i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          cartItemId,
          product: payload.product,
          qty: 1,
          comboSelections: payload.comboSelections,
          mixMatchProducts: payload.mixMatchProducts,
          unitPrice: payload.unitPrice,
        },
      ];
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  };

  const updateQty = (cartItemId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.cartItemId === cartItemId
            ? { ...i, qty: Math.max(0, i.qty + delta) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.unitPrice * i.qty, 0),
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.qty, 0),
    [items]
  );

  const hasComboInCart = useMemo(
    () => items.some((i) => i.product.isCombo),
    [items]
  );

  // Free card rule: subtotal ≥ 500 AND no combo in cart
  const qualifiesForFreeCard = subtotal >= 500 && !hasComboInCart;
  const amountToFreeCard = Math.max(0, 500 - subtotal);

  const value: CartContextType = {
    items,
    addItem,
    addCombo,
    removeItem,
    updateQty,
    clearCart,
    subtotal,
    totalItems,
    qualifiesForFreeCard,
    hasComboInCart,
    amountToFreeCard,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
