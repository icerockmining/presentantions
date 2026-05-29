"use client";

import * as React from "react";
import type { CartLine, CartProductSnapshot } from "@/lib/cartTypes";

const CART_KEY = "cgr_cart_v1";
const COMPARE_KEY = "cgr_compare_v1";

type CartContextValue = {
  cart: CartLine[];
  compare: string[];
  hydrated: boolean;
  addToCart: (product: CartProductSnapshot, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  removeFromCart: (slug: string) => void;
  clearCart: () => void;
  toggleCompare: (slug: string) => void;
  removeCompare: (slug: string) => void;
  cartCount: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<CartLine[]>([]);
  const [compare, setCompare] = React.useState<string[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  // Load from localStorage on mount (avoids hydration mismatch: server renders empty).
  React.useEffect(() => {
    try {
      const c = localStorage.getItem(CART_KEY);
      if (c) setCart(JSON.parse(c));
      const cmp = localStorage.getItem(COMPARE_KEY);
      if (cmp) setCompare(JSON.parse(cmp));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (hydrated) localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  React.useEffect(() => {
    if (hydrated) localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [compare, hydrated]);

  const addToCart = React.useCallback((product: CartProductSnapshot, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.product.slug === product.slug);
      if (existing) {
        return prev.map((l) =>
          l.product.slug === product.slug ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { product, qty }];
    });
  }, []);

  const setQty = React.useCallback((slug: string, qty: number) => {
    setCart((prev) =>
      prev.map((l) => (l.product.slug === slug ? { ...l, qty: Math.max(1, qty) } : l))
    );
  }, []);

  const removeFromCart = React.useCallback((slug: string) => {
    setCart((prev) => prev.filter((l) => l.product.slug !== slug));
  }, []);

  const clearCart = React.useCallback(() => setCart([]), []);

  const toggleCompare = React.useCallback((slug: string) => {
    setCompare((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length >= 4 ? prev : [...prev, slug]
    );
  }, []);

  const removeCompare = React.useCallback((slug: string) => {
    setCompare((prev) => prev.filter((s) => s !== slug));
  }, []);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);

  const value: CartContextValue = {
    cart,
    compare,
    hydrated,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    toggleCompare,
    removeCompare,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
