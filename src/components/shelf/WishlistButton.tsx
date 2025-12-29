import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface WishlistButtonProps {
  issueId: string;
  issueTitle?: string;
  variant?: "default" | "compact" | "icon-only";
  className?: string;
}

export const WishlistButton = ({ 
  issueId, 
  issueTitle,
  variant = "default",
  className 
}: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(issueId);

  const handleClick = () => {
    toggleWishlist(issueId);
    if (!saved) {
      toast.success("Added to Wishlist", {
        description: issueTitle ? `${issueTitle} saved for later` : "Issue saved for later"
      });
    } else {
      toast.success("Removed from Wishlist");
    }
  };

  if (variant === "icon-only") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-2 transition-colors",
          saved 
            ? "text-accent" 
            : "text-muted-foreground/50 hover:text-muted-foreground",
          className
        )}
        aria-label={saved ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart 
          className="w-4 h-4" 
          fill={saved ? "currentColor" : "none"} 
        />
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-1.5 text-meta transition-colors",
          saved 
            ? "text-accent" 
            : "text-muted-foreground/60 hover:text-muted-foreground",
          className
        )}
      >
        <Heart 
          className="w-3.5 h-3.5" 
          fill={saved ? "currentColor" : "none"} 
        />
        <span>{saved ? "Saved" : "Save"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 border transition-colors",
        saved 
          ? "border-accent/30 text-accent bg-accent/5" 
          : "border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground",
        className
      )}
    >
      <Heart 
        className="w-4 h-4" 
        fill={saved ? "currentColor" : "none"} 
      />
      <span className="text-ui">{saved ? "Saved to Wishlist" : "Save to Wishlist"}</span>
    </button>
  );
};
