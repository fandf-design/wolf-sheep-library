import { cn } from "@/lib/utils";

interface ShelfTabsProps {
  activeTab: "acquired" | "wishlist";
  onTabChange: (tab: "acquired" | "wishlist") => void;
  acquiredCount: number;
  wishlistCount: number;
}

export const ShelfTabs = ({ 
  activeTab, 
  onTabChange, 
  acquiredCount, 
  wishlistCount 
}: ShelfTabsProps) => {
  return (
    <div className="flex items-center gap-8 border-b border-border">
      <button
        onClick={() => onTabChange("acquired")}
        className={cn(
          "relative py-4 text-ui tracking-wide transition-colors",
          activeTab === "acquired" 
            ? "text-foreground" 
            : "text-muted-foreground/60 hover:text-muted-foreground"
        )}
      >
        <span>Acquired</span>
        <span className="ml-2 text-meta text-muted-foreground/50">
          {acquiredCount}
        </span>
        {activeTab === "acquired" && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
        )}
      </button>
      
      <button
        onClick={() => onTabChange("wishlist")}
        className={cn(
          "relative py-4 text-ui tracking-wide transition-colors",
          activeTab === "wishlist" 
            ? "text-foreground" 
            : "text-muted-foreground/60 hover:text-muted-foreground"
        )}
      >
        <span>Wishlist</span>
        <span className="ml-2 text-meta text-muted-foreground/50">
          {wishlistCount}
        </span>
        {activeTab === "wishlist" && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
        )}
      </button>
    </div>
  );
};
