import { toast } from "sonner";

// Shopify Storefront API Configuration
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "lovable-project-29xu6.myshopify.com";
export const SHOPIFY_STOREFRONT_TOKEN = "9a0f5a01c2fbdb7e0a90e2524b29abe9";
export const SHOPIFY_API_VERSION = "2025-07";
// Some Shopify stores return 404 for versioned Storefront endpoints; the versionless proxy is supported.
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/graphql`;

// GraphQL Queries
export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          publishedAt
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      title
      description
      descriptionHtml
      handle
      tags
      publishedAt
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

export const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Storefront API helper function
export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Your store needs an active Shopify billing plan. Visit admin.shopify.com to upgrade.",
    });
    throw new Error("Payment required");
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors) {
    throw new Error(`Shopify API error: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return data;
}

// Types for cart creation
interface CartItem {
  variantId: string;
  quantity: number;
}

interface CartCreateResponse {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
        totalQuantity: number;
        cost: {
          totalAmount: {
            amount: string;
            currencyCode: string;
          };
        };
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}

// Create checkout via Storefront API
export async function createStorefrontCheckout(items: CartItem[]): Promise<string> {
  const lines = items.map((item) => ({
    quantity: item.quantity,
    merchandiseId: item.variantId,
  }));

  const cartData = await storefrontApiRequest<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: { lines },
  });

  if (cartData.data.cartCreate.userErrors.length > 0) {
    throw new Error(
      `Cart creation failed: ${cartData.data.cartCreate.userErrors.map((e) => e.message).join(", ")}`
    );
  }

  const cart = cartData.data.cartCreate.cart;

  if (!cart?.checkoutUrl) {
    throw new Error("No checkout URL returned from Shopify");
  }

  // Add channel parameter for online store access
  const url = new URL(cart.checkoutUrl);
  url.searchParams.set("channel", "online_store");

  return url.toString();
}
