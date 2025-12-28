import { IssueStatus, getStatusConfig } from "@/types/issue-status";
import { cn } from "@/lib/utils";

interface IssueCTAButtonProps {
  status: IssueStatus;
  onAcquire?: () => void;
  onReserve?: () => void;
  onAlertMe?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * Single action button per product state
 * - Acquire: adds to cart
 * - Reserve: preorder flow
 * - Alert Me: opens modal for email capture
 * - Vaulted: no button rendered
 */
export const IssueCTAButton = ({
  status,
  onAcquire,
  onReserve,
  onAlertMe,
  className,
  disabled = false,
}: IssueCTAButtonProps) => {
  const config = getStatusConfig(status);
  
  // No CTA for vaulted items
  if (!config.showCTA || !config.ctaLabel) {
    return null;
  }
  
  const handleClick = () => {
    switch (status) {
      case "acquire":
      case "limited":
        onAcquire?.();
        break;
      case "reserve":
        onReserve?.();
        break;
      case "alert":
        onAlertMe?.();
        break;
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "px-8 py-3 text-ui transition-colors",
        "bg-foreground text-background hover:bg-accent hover:text-accent-foreground",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {config.ctaLabel}
    </button>
  );
};
