import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useShopifyProduct } from "@/hooks/use-shopify-products";
import { useCartStore } from "@/stores/cartStore";
import { IssueStatusBadge, IssueCTAButton } from "@/components/issue";
import { WishlistButton } from "@/components/shelf";
import { Button } from "@/components/ui/button";
import { mapShopifyToStatus } from "@/types/issue-status";
import type { ShopifyCartItem, ShopifyVariant } from "@/types/shopify";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-lg mb-4">Product Not Found</h1>
          <Link to="/" className="link-archival">Return to Library</Link>
        </div>
      </main>
    );
  }

  const variants = product.variants.edges.map((e) => e.node);
  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const images = product.images.edges.map((e) => e.node);
  const primaryImage = images[0];

  const status = mapShopifyToStatus(
    selectedVariant?.availableForSale ?? false,
    !!product.publishedAt,
    product.tags
  );

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem: ShopifyCartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.title,
      position: "top-center",
    });
  };

  const hasMultipleVariants = variants.length > 1 && variants[0]?.title !== "Default Title";

  return (
    <main className="min-h-screen pt-16">
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-12">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-accent/60">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-charcoal/50 border border-border overflow-hidden">
                {primaryImage ? (
                  <img
                    src={primaryImage.url}
                    alt={primaryImage.altText || product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-meta text-muted-foreground">No Image</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail strip */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.slice(1, 5).map((img, idx) => (
                    <div 
                      key={idx} 
                      className="w-20 h-24 flex-shrink-0 bg-charcoal/30 border border-border/50 overflow-hidden"
                    >
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <IssueStatusBadge status={status} />
                <WishlistButton 
                  issueId={product.id} 
                  issueTitle={product.title}
                  variant="compact"
                />
              </div>

              <h1 className="text-display-lg text-foreground mb-6">
                {product.title}
              </h1>

              <p className="text-body text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Variant Selector */}
              {hasMultipleVariants && (
                <div className="mb-8">
                  {product.options.map((option) => (
                    <div key={option.name} className="mb-4">
                      <span className="text-meta text-muted-foreground block mb-3">
                        {option.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const matchingVariant = variants.find((v) =>
                            v.selectedOptions.some(
                              (o) => o.name === option.name && o.value === value
                            )
                          );
                          const isSelected = selectedVariant?.selectedOptions.some(
                            (o) => o.name === option.name && o.value === value
                          );
                          const isAvailable = matchingVariant?.availableForSale;

                          return (
                            <button
                              key={value}
                              onClick={() => matchingVariant && setSelectedVariantId(matchingVariant.id)}
                              disabled={!isAvailable}
                              className={`px-4 py-2 border text-body-sm transition-colors ${
                                isSelected
                                  ? "border-accent text-accent bg-accent/10"
                                  : isAvailable
                                  ? "border-border/50 text-foreground hover:border-border"
                                  : "border-border/30 text-muted-foreground/50 cursor-not-allowed"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price & CTA */}
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-display text-2xl text-foreground">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: selectedVariant?.price.currencyCode || "USD",
                      minimumFractionDigits: 0,
                    }).format(parseFloat(selectedVariant?.price.amount || "0"))}
                  </span>
                </div>

                {status !== "vaulted" ? (
                  <IssueCTAButton
                    status={status}
                    onAcquire={handleAddToCart}
                    onReserve={handleAddToCart}
                    onAlertMe={() => toast.info("Alert functionality coming soon")}
                    className="w-full"
                  />
                ) : (
                  <div className="text-center py-4">
                    <span className="text-body text-muted-foreground italic">
                      This item has entered the Vault
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Product;
