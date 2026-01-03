// Shopify Storefront API Types

export interface ShopifyImage {
  url: string;
  altText: string | null;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale: boolean;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyProductOption {
  name: string;
  values: string[];
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  handle: string;
  tags: string[];
  publishedAt: string | null;
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  options: ShopifyProductOption[];
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

export interface ShopifyProductsResponse {
  data: {
    products: {
      edges: ShopifyProduct[];
    };
  };
}

export interface ShopifyProductByHandleResponse {
  data: {
    productByHandle: ShopifyProductNode | null;
  };
}

// Cart item for Zustand store
export interface ShopifyCartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: ShopifyPrice;
  quantity: number;
  selectedOptions: ShopifySelectedOption[];
}
