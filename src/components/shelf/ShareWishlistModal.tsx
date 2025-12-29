import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link2, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";

interface ShareWishlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ShareWishlistModal = ({ open, onOpenChange }: ShareWishlistModalProps) => {
  const { shareEnabled, shareToken, enableSharing, disableSharing, regenerateShareToken } = useWishlist();
  const [copied, setCopied] = useState(false);

  const shareUrl = shareToken 
    ? `${window.location.origin}/shelf/wishlist/${shareToken}` 
    : null;

  const handleEnableSharing = () => {
    enableSharing();
    toast.success("Wishlist sharing enabled");
  };

  const handleDisableSharing = () => {
    disableSharing();
    toast.success("Wishlist sharing disabled");
  };

  const handleRegenerateToken = () => {
    regenerateShareToken();
    toast.success("Share link regenerated");
  };

  const handleCopyLink = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-background">
        <DialogHeader>
          <DialogTitle className="text-display-md">Share Wishlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4 overflow-hidden">
          {!shareEnabled ? (
            <>
              <p className="text-body-sm text-muted-foreground">
                Generate a link to share your Wishlist. Only Issue titles and statuses 
                will be visible—no personal information.
              </p>
              
              <button
                onClick={handleEnableSharing}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-foreground text-background text-ui hover:bg-foreground/90 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Enable Sharing
              </button>
            </>
          ) : (
            <>
              <div className="space-y-3 overflow-hidden">
                <span className="text-meta text-muted-foreground block">Your Share Link</span>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex-1 min-w-0 px-3 py-2 bg-charcoal/30 border border-border text-body-sm text-foreground/80 truncate overflow-hidden">
                    {shareUrl}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 px-4 py-2 border border-border text-ui text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors"
                  >
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleRegenerateToken}
                  className="flex items-center gap-1.5 text-meta text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate Link
                </button>
                
                <button
                  onClick={handleDisableSharing}
                  className="flex items-center gap-1.5 text-meta text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                  Disable Sharing
                </button>
              </div>

              <p className="text-meta text-muted-foreground/50 pt-2">
                Disabling will invalidate the current link. You can regenerate a new one anytime.
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
