import { Link } from "react-router-dom";
import { X, Trash2 } from "lucide-react";
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

export const CartSheet = ({ open, onOpenChange }: CartSheetProps) => {
  const { items, removeFromCart, clearCart } = useCart();

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
                    className="flex items-center justify-between p-4 bg-muted/30 border border-border/50"
                  >
                    <div>
                      <p className="text-body text-foreground">{item.title}</p>
                      <p className="text-body-sm text-muted-foreground mt-1">
                        Issue
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.issueId)}
                      className="text-muted-foreground/60 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/50 pt-6 mt-6 space-y-4">
                <div className="flex justify-between text-body">
                  <span className="text-muted-foreground">Items</span>
                  <span className="text-foreground">{items.length}</span>
                </div>
                <Button className="w-full" size="lg">
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
