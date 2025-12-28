import { cn } from "@/lib/utils";

interface ReserveConfirmationProps {
  visible: boolean;
  className?: string;
}

/**
 * Muted confirmation message shown after reservation
 */
export const ReserveConfirmation = ({ visible, className }: ReserveConfirmationProps) => {
  if (!visible) return null;
  
  return (
    <p className={cn("text-body-sm text-muted-foreground italic", className)}>
      Reservation recorded.
    </p>
  );
};
