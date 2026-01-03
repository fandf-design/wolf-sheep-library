import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode, useMemo } from "react";

interface CartItem {
  issueId: string;
  title: string;
  price: number;
  quantity: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (issueId: string, title: string, price: number) => void;
  removeFromCart: (issueId: string) => void;
  updateQuantity: (issueId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (issueId: string) => boolean;
  count: number;
  subtotal: number;
  openCart: () => void;
  registerOpenCart: (fn: () => void) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "ff-cart";
const MAX_QUANTITY = 10;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          quantity: item.quantity ?? 1, // Migration: default to 1 if missing
          addedAt: new Date(item.addedAt)
        }));
      }
    } catch {
      // Invalid storage, start fresh
    }
    return [];
  });

  const openCartRef = useRef<(() => void) | null>(null);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((issueId: string, title: string, price: number) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.issueId === issueId);
      if (existing) {
        // Increment quantity if under max
        if (existing.quantity >= MAX_QUANTITY) return prev;
        return prev.map((item) =>
          item.issueId === issueId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { issueId, title, price, quantity: 1, addedAt: new Date() }];
    });
  }, []);

  const removeFromCart = useCallback((issueId: string) => {
    setItems((prev) => prev.filter((item) => item.issueId !== issueId));
  }, []);

  const updateQuantity = useCallback((issueId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.issueId !== issueId));
    } else {
      setItems((prev) =>
        prev.map((item) =>
          item.issueId === issueId
            ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
            : item
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (issueId: string) => items.some((item) => item.issueId === issueId),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const registerOpenCart = useCallback((fn: () => void) => {
    openCartRef.current = fn;
  }, []);

  const openCart = useCallback(() => {
    openCartRef.current?.();
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        count: items.length,
        subtotal,
        openCart,
        registerOpenCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
