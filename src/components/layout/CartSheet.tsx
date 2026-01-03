import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatPrice = (amount: number, currencyCode: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const createCheckout = useCartStore((state) => state.createCheckout);
  const isLoading = useCartStore((state) => state.isLoading);

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
    0
  );
  const currencyCode = items[0]?.price.currencyCode || "USD";

  const handleCheckout = async () => {
    try {
      const checkoutUrl = await createCheckout();
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
        onOpenChange(false);
      } else {
        toast.error("Unable to create checkout");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Checkout failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-display-sm">Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col flex-1 min-h-0">
          {items.length > 0 ? (
            <>
              {/* Scrollable items area */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
                {items.map((item) => {
                  const productImage = item.product.node.images.edges[0]?.node;
                  const itemTotal = parseFloat(item.price.amount) * item.quantity;

                  return (
                    <div
                      key={item.variantId}
                      className="p-4 bg-muted/30 border border-border/50"
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        {productImage ? (
                          <div className="w-16 h-20 flex-shrink-0 bg-charcoal/30 overflow-hidden">
                            <img
                              src={productImage.url}
                              alt={productImage.altText || item.product.node.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-20 flex-shrink-0 bg-charcoal/50 flex items-center justify-center">
                            <span className="text-meta text-muted-foreground/50">—</span>
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-body text-foreground truncate">
                                {item.product.node.title}
                              </p>
                              {item.variantTitle !== "Default Title" && (
                                <p className="text-meta text-muted-foreground mt-0.5">
                                  {item.selectedOptions.map((o) => o.value).join(" / ")}
                                </p>
                              )}
                              <p className="text-body-sm text-muted-foreground mt-1">
                                {formatPrice(parseFloat(item.price.amount), item.price.currencyCode)}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.variantId)}
                              className="text-muted-foreground/60 hover:text-destructive transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-body text-foreground w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                disabled={item.quantity >= 10}
                                className="w-7 h-7 flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {item.quantity > 1 && (
                              <span className="text-body text-foreground">
                                {formatPrice(itemTotal, item.price.currencyCode)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fixed checkout section */}
              <div className="flex-shrink-0 border-t border-border/50 pt-6 mt-6 space-y-4 bg-background">
                <div className="flex justify-between text-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal, currencyCode)}</span>
                </div>
                <p className="text-meta text-muted-foreground/60">
                  Taxes and shipping calculated at checkout
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isLoading || items.length === 0}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Checkout...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </Button>
                <button
                  onClick={clearCart}
                  className="w-full text-center text-ui text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <p className="text-body text-muted-foreground mb-6">
                Your cart is empty
              </p>
              <Link
                to="/"
                onClick={() => onOpenChange(false)}
                className="link-archival"
              >
                Explore the Library
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
