import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface CartItem {
  issueId: string;
  title: string;
  addedAt: Date;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (issueId: string, title: string) => void;
  removeFromCart: (issueId: string) => void;
  clearCart: () => void;
  isInCart: (issueId: string) => boolean;
  count: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((issueId: string, title: string) => {
    setItems((prev) => {
      if (prev.some((item) => item.issueId === issueId)) {
        return prev;
      }
      return [...prev, { issueId, title, addedAt: new Date() }];
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

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        count: items.length,
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
