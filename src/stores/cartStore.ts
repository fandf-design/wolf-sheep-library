import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createStorefrontCheckout } from "@/lib/shopify";
import type { ShopifyCartItem } from "@/types/shopify";

interface CartStore {
  items: ShopifyCartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;

  // Actions
  addItem: (item: ShopifyCartItem) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  setCartId: (cartId: string) => void;
  setCheckoutUrl: (url: string) => void;
  setLoading: (loading: boolean) => void;
  createCheckout: () => Promise<string | null>;

  // Computed-like getters
  getCount: () => number;
  getSubtotal: () => number;
  isInCart: (variantId: string) => boolean;
}

const MAX_QUANTITY = 10;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.variantId === item.variantId);

        if (existingItem) {
          if (existingItem.quantity >= MAX_QUANTITY) return;
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, MAX_QUANTITY) }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, MAX_QUANTITY) }
              : item
          ),
        });
      },

      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },

      clearCart: () => {
        set({ items: [], cartId: null, checkoutUrl: null });
      },

      setCartId: (cartId) => set({ cartId }),
      setCheckoutUrl: (checkoutUrl) => set({ checkoutUrl }),
      setLoading: (isLoading) => set({ isLoading }),

      createCheckout: async () => {
        const { items, setLoading, setCheckoutUrl } = get();
        if (items.length === 0) return null;

        setLoading(true);
        try {
          const cartItems = items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          }));
          const checkoutUrl = await createStorefrontCheckout(cartItems);
          setCheckoutUrl(checkoutUrl);
          return checkoutUrl;
        } catch (error) {
          console.error("Failed to create checkout:", error);
          return null;
        } finally {
          setLoading(false);
        }
      },

      getCount: () => get().items.length,
      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
          0
        ),
      isInCart: (variantId) => get().items.some((item) => item.variantId === variantId),
    }),
    {
      name: "ff-shopify-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
