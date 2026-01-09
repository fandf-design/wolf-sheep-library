import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Minus, Plus } from "lucide-react";
import { useShopifyProduct } from "@/hooks/use-shopify-products";
import { useCartStore } from "@/stores/cartStore";
import { IssueStatusBadge, IssueCTAButton } from "@/components/issue";
import { WishlistButton } from "@/components/shelf";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { mapShopifyToStatus } from "@/types/issue-status";
import type { ShopifyCartItem } from "@/types/shopify";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const { data: product, isLoading, error } = useShopifyProduct(handle || "");
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
  const activeImage = images[activeImageIndex] || images[0];

  const status = mapShopifyToStatus(
    selectedVariant?.availableForSale ?? false,
    !!product.publishedAt,
    product.tags
  );

  // Check if product has size options
  const sizeOption = product.options.find(
    (opt) => opt.name.toLowerCase() === "size"
  );
  const hasSizeOptions = sizeOption && sizeOption.values.length > 0;
  const hasMultipleVariants = variants.length > 1 && variants[0]?.title !== "Default Title";

  const handleAddToCart = () => {
    // Enforce size selection if size options exist
    if (hasSizeOptions && !selectedSize) {
      toast.error("Select a size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    const cartItem: ShopifyCartItem = {
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity,
      selectedOptions: selectedVariant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.title}${quantity > 1 ? ` × ${quantity}` : ""}`,
      position: "top-center",
    });
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Find matching variant for this size
    const matchingVariant = variants.find((v) =>
      v.selectedOptions.some(
        (o) => o.name.toLowerCase() === "size" && o.value === size
      )
    );
    if (matchingVariant) {
      setSelectedVariantId(matchingVariant.id);
    }
  };

  return (
    <main className="min-h-screen pt-16">
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-accent/60">{product.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Gallery */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="aspect-[3/4] bg-charcoal/50 border border-border overflow-hidden">
                {activeImage ? (
                  <img
                    src={activeImage.url}
                    alt={activeImage.altText || product.title}
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
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-20 flex-shrink-0 border overflow-hidden transition-colors ${
                        idx === activeImageIndex
                          ? "border-accent"
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.altText || `${product.title} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Details */}
            <div className="flex flex-col">
              {/* Title */}
              <h1 className="text-display-lg text-foreground mb-4">
                {product.title}
              </h1>

              {/* Price */}
              <span className="text-display text-2xl text-foreground mb-6">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: selectedVariant?.price.currencyCode || "USD",
                  minimumFractionDigits: 0,
                }).format(parseFloat(selectedVariant?.price.amount || "0"))}
              </span>

              {/* Edition & Status */}
              <div className="flex items-center gap-4 mb-6">
                <IssueStatusBadge status={status} />
                <WishlistButton 
                  issueId={product.id} 
                  issueTitle={product.title}
                  variant="compact"
                />
              </div>

              {/* Size Selection (mandatory before acquisition) */}
              {hasSizeOptions && (
                <div className="mb-6">
                  <span className="text-meta text-muted-foreground block mb-3">
                    Size
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sizeOption.values.map((size) => {
                      const matchingVariant = variants.find((v) =>
                        v.selectedOptions.some(
                          (o) => o.name.toLowerCase() === "size" && o.value === size
                        )
                      );
                      const isAvailable = matchingVariant?.availableForSale;
                      const isSelected = selectedSize === size;

                      return (
                        <button
                          key={size}
                          onClick={() => handleSizeSelect(size)}
                          disabled={!isAvailable}
                          className={`min-w-[48px] px-4 py-2 border text-body-sm transition-colors ${
                            isSelected
                              ? "border-accent text-accent bg-accent/10"
                              : isAvailable
                              ? "border-border/50 text-foreground hover:border-border"
                              : "border-border/30 text-muted-foreground/50 cursor-not-allowed line-through"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Other Variant Options (non-size) */}
              {hasMultipleVariants && !hasSizeOptions && (
                <div className="mb-6">
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

              {/* Quantity Selector */}
              <div className="mb-6">
                <span className="text-meta text-muted-foreground block mb-3">
                  Quantity
                </span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-body w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* CTA */}
              <div className="mb-8">
                {status !== "vaulted" ? (
                  <IssueCTAButton
                    status={status}
                    onAcquire={handleAddToCart}
                    onReserve={handleAddToCart}
                    onAlertMe={() => toast.info("Alert functionality coming soon")}
                    className="w-full"
                  />
                ) : (
                  <div className="text-center py-4 border border-border">
                    <span className="text-body text-muted-foreground italic">
                      This item has entered the Vault
                    </span>
                  </div>
                )}
              </div>

              {/* Expandable Sections */}
              <Accordion type="single" collapsible className="border-t border-border">
                <AccordionItem value="story" className="border-b border-border">
                  <AccordionTrigger className="text-ui py-4">Issue</AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground pb-4">
                    {product.description || "No story available."}
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="materials" className="border-b border-border">
                  <AccordionTrigger className="text-ui py-4">Materials</AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground pb-4">
                    Premium materials selected for durability and comfort. Refer to product tags for specific composition.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="care" className="border-b border-border">
                  <AccordionTrigger className="text-ui py-4">Care</AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground pb-4">
                    Professional dry clean only. Store in a cool, dry place away from direct sunlight.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="shipping" className="border-b border-border">
                  <AccordionTrigger className="text-ui py-4">Shipping & Returns</AccordionTrigger>
                  <AccordionContent className="text-body text-muted-foreground pb-4">
                    Standard delivery within 5-7 business days. Returns accepted within 14 days of delivery in original condition.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Product;
