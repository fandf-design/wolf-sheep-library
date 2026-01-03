import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
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

const formatPrice = (dollars: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(dollars);
};

export const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();

  const handleCheckout = () => {
    toast("Checkout coming soon");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-display-sm">Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 flex flex-col h-[calc(100vh-10rem)]">
          {items.length > 0 ? (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {items.map((item) => (
                  <div
                    key={item.issueId}
                    className="p-4 bg-muted/30 border border-border/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-body text-foreground">{item.title}</p>
                        <p className="text-body-sm text-muted-foreground mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.issueId)}
                        className="text-muted-foreground/60 hover:text-destructive transition-colors ml-4"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.issueId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-body text-foreground w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.issueId, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className="w-8 h-8 flex items-center justify-center border border-border/50 text-muted-foreground hover:text-foreground hover:border-border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      {item.quantity > 1 && (
                        <span className="text-body text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
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
