import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface LockedVolumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  volumeTitle: string;
  volumeNumber: string;
}

export const LockedVolumeModal = ({
  isOpen,
  onClose,
  volumeTitle,
  volumeNumber,
}: LockedVolumeModalProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    // Store volume alert subscription in localStorage
    const subscriptions = JSON.parse(
      localStorage.getItem("volumeAlertSubscriptions") || "[]"
    );
    
    const newSubscription = {
      volume_number: volumeNumber,
      volume_title: volumeTitle,
      email,
      timestamp: new Date().toISOString(),
    };

    subscriptions.push(newSubscription);
    localStorage.setItem("volumeAlertSubscriptions", JSON.stringify(subscriptions));

    setIsSubmitting(false);
    setIsSubscribed(true);
    toast.success("You'll be notified when this Volume enters circulation.");
  };

  const handleClose = () => {
    setEmail("");
    setIsSubscribed(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader className="text-center">
          <DialogTitle className="text-display-md text-foreground">
            Archived — Not Yet In Circulation
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-4">
            <span className="text-accent">Volume {volumeNumber}: {volumeTitle}</span> is not yet available.
          </DialogDescription>
        </DialogHeader>

        {!isSubscribed ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border"
              />
              <p className="text-meta text-muted-foreground">
                Be notified when this Volume enters circulation.
              </p>
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !email}
              className="w-full"
            >
              {isSubmitting ? "Submitting..." : "Alert Me"}
            </Button>
          </form>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Subscription recorded. We'll notify you when this Volume becomes available.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
