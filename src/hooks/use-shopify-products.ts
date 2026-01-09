import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import type { ShopifyProductsResponse, ShopifyProductByHandleResponse, ShopifyProduct, ShopifyProductNode } from "@/types/shopify";

export function useShopifyProducts(first: number = 50, query?: string) {
  return useQuery({
    queryKey: ["shopify-products", first, query],
    queryFn: async (): Promise<ShopifyProduct[]> => {
      try {
        const response = await storefrontApiRequest<ShopifyProductsResponse>(PRODUCTS_QUERY, {
          first,
          query: query || null,
        });
        return response.data.products.edges;
      } catch (error) {
        console.error("Failed to fetch Shopify products:", error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

export function useShopifyProduct(handle: string) {
  return useQuery({
    queryKey: ["shopify-product", handle],
    queryFn: async (): Promise<ShopifyProductNode | null> => {
      const response = await storefrontApiRequest<ShopifyProductByHandleResponse>(
        PRODUCT_BY_HANDLE_QUERY,
        { handle }
      );
      return response.data.productByHandle;
    },
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
  });
}
