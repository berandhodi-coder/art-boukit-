"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { getProductBySlug, type Product } from "@/lib/products";

const STORAGE_KEY = "art_bouquet_cart_v1";
const MAX_QUANTITY_PER_ITEM = 10;
const CART_UPDATE_EVENT = "art-bouquet-cart-updated";

export interface RawCartItem {
  id: string;
  quantity: number;
}

export interface ResolvedCartItem {
  product: Product;
  quantity: number;
  lineTotalMad: number;
}

interface CartContextType {
  items: ResolvedCartItem[];
  rawItems: RawCartItem[];
  totalItems: number;
  subtotalMad: number;
  isLoaded: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// External store subscription for localStorage synchronization across tabs and components
function subscribeToCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener(CART_UPDATE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CART_UPDATE_EVENT, callback);
  };
}

function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  try {
    return localStorage.getItem(STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getCartServerSnapshot(): string {
  return "[]";
}

function dispatchCartUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATE_EVENT));
  }
}

function writeCartToStorage(items: RawCartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    dispatchCartUpdate();
  } catch {
    // Storage quota or privacy restriction fallback
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Synchronize with external localStorage using React's useSyncExternalStore
  const cartJson = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getCartServerSnapshot
  );

  // Parse and validate items
  const rawItems = useMemo<RawCartItem[]>(() => {
    try {
      const parsed = JSON.parse(cartJson);
      if (!Array.isArray(parsed)) return [];

      const validated: RawCartItem[] = [];
      for (const item of parsed) {
        if (
          item &&
          typeof item.id === "string" &&
          typeof item.quantity === "number" &&
          item.quantity > 0
        ) {
          const clampedQuantity = Math.min(
            MAX_QUANTITY_PER_ITEM,
            Math.max(1, Math.round(item.quantity))
          );
          const product = getProductBySlug(item.id);
          if (product) {
            validated.push({
              id: product.id,
              quantity: clampedQuantity,
            });
          }
        }
      }
      return validated;
    } catch {
      return [];
    }
  }, [cartJson]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const product = getProductBySlug(productId);
      if (!product) return;

      const safeQty = Math.max(1, Math.round(quantity));
      const currentItems = [...rawItems];
      const existingIndex = currentItems.findIndex((item) => item.id === product.id);

      if (existingIndex > -1) {
        const newQty = Math.min(
          MAX_QUANTITY_PER_ITEM,
          currentItems[existingIndex].quantity + safeQty
        );
        currentItems[existingIndex] = {
          ...currentItems[existingIndex],
          quantity: newQty,
        };
      } else {
        currentItems.push({
          id: product.id,
          quantity: Math.min(MAX_QUANTITY_PER_ITEM, safeQty),
        });
      }

      writeCartToStorage(currentItems);
    },
    [rawItems]
  );

  const removeItem = useCallback(
    (productId: string) => {
      const updated = rawItems.filter((item) => item.id !== productId);
      writeCartToStorage(updated);
    },
    [rawItems]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQty = Math.round(quantity);
      if (safeQty <= 0) {
        const updated = rawItems.filter((item) => item.id !== productId);
        writeCartToStorage(updated);
        return;
      }

      const clampedQty = Math.min(MAX_QUANTITY_PER_ITEM, safeQty);
      const updated = rawItems.map((item) =>
        item.id === productId ? { ...item, quantity: clampedQty } : item
      );
      writeCartToStorage(updated);
    },
    [rawItems]
  );

  const clearCart = useCallback(() => {
    writeCartToStorage([]);
  }, []);

  // Dynamically resolve products and derive pricing from catalog
  const items = useMemo<ResolvedCartItem[]>(() => {
    const resolved: ResolvedCartItem[] = [];
    for (const item of rawItems) {
      const product = getProductBySlug(item.id);
      if (product) {
        resolved.push({
          product,
          quantity: item.quantity,
          lineTotalMad: product.priceMad * item.quantity,
        });
      }
    }
    return resolved;
  }, [rawItems]);

  const totalItems = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const subtotalMad = useMemo(() => {
    return items.reduce((acc, item) => acc + item.lineTotalMad, 0);
  }, [items]);

  const value = useMemo<CartContextType>(
    () => ({
      items,
      rawItems,
      totalItems,
      subtotalMad,
      isLoaded: true,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      rawItems,
      totalItems,
      subtotalMad,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
