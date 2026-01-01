import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";

interface CartItem {
  issueId: string;
  title: string;
  price: number;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (issueId: string, title: string, price: number) => void;
  removeFromCart: (issueId: string) => void;
  clearCart: () => void;
  isInCart: (issueId: string) => boolean;
  count: number;
  openCart: () => void;
  registerOpenCart: (fn: () => void) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "ff-cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
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
      if (prev.some((item) => item.issueId === issueId)) {
        return prev;
      }
      return [...prev, { issueId, title, price, addedAt: new Date() }];
    });
  }, []);

  const removeFromCart = useCallback((issueId: string) => {
    setItems((prev) => prev.filter((item) => item.issueId !== issueId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (issueId: string) => items.some((item) => item.issueId === issueId),
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
        clearCart,
        isInCart,
        count: items.length,
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
