import { IssueStatus, getStatusConfig } from "@/types/issue-status";
import { cn } from "@/lib/utils";

interface IssueStatusBadgeProps {
  status: IssueStatus;
  className?: string;
}

/**
 * Subtle pill/badge that displays status labels
 * Only renders for statuses that have a label (limited, vaulted)
 */
export const IssueStatusBadge = ({ status, className }: IssueStatusBadgeProps) => {
  const config = getStatusConfig(status);
  
  // No badge if no label
  if (!config.label) {
    return null;
  }
  
  return (
    <span
      className={cn(
        "inline-block text-meta px-3 py-1",
        "border border-border bg-muted/30 text-muted-foreground",
        "tracking-wider uppercase text-[10px]",
        status === "vaulted" && "bg-muted/50 text-muted-foreground/70 italic",
        className
      )}
    >
      {config.label}
    </span>
  );
};
