import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AlertMeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productTitle: string;
  onSubmit?: (data: AlertSubscription) => void;
}

export interface AlertSubscription {
  productId: string;
  productTitle: string;
  email: string;
  timestamp: string;
}

/**
 * Minimal modal for email capture when user clicks "Alert Me"
 * Stores submissions for export (product_id, product_title, email, timestamp)
 */
export const AlertMeModal = ({
  open,
  onOpenChange,
  productId,
  productTitle,
  onSubmit,
}: AlertMeModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const subscription: AlertSubscription = {
        productId,
        productTitle,
        email,
        timestamp: new Date().toISOString(),
      };
      
      // Store in localStorage for now (can be replaced with API call)
      const existing = localStorage.getItem("fang_fleece_alerts");
      const alerts: AlertSubscription[] = existing ? JSON.parse(existing) : [];
      alerts.push(subscription);
      localStorage.setItem("fang_fleece_alerts", JSON.stringify(alerts));
      
      onSubmit?.(subscription);
      setIsSubmitted(true);
      
      // Close modal after brief delay
      setTimeout(() => {
        onOpenChange(false);
        setEmail("");
        setIsSubmitted(false);
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-display text-lg">
            {productTitle}
          </DialogTitle>
        </DialogHeader>
        
        {isSubmitted ? (
          <div className="py-8 text-center">
            <p className="text-body text-foreground">
              You'll be notified when this Issue returns.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "bg-muted/30 border-border text-foreground",
                  "placeholder:text-muted-foreground/50"
                )}
                disabled={isSubmitting}
              />
              <p className="text-body-sm text-muted-foreground">
                You'll be notified if this Issue returns to circulation.
              </p>
            </div>
            
            {error && (
              <p className="text-body-sm text-destructive">{error}</p>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "w-full px-6 py-3 text-ui transition-colors",
                "bg-foreground text-background hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? "..." : "Notify Me"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
