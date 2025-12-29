import { Link } from "react-router-dom";
import { IssueStatusBadge, IssueCTAButton } from "@/components/issue";
import { WishlistButton } from "./WishlistButton";
import type { IssueStatus } from "@/types/issue-status";

interface IssueCardCompactProps {
  issue: {
    id: string;
    title: string;
    role: "Wolf" | "Sheep";
    status: IssueStatus;
    material?: string;
    volumeTitle?: string;
    chapterTitle?: string;
    acquisitionDate?: string;
  };
  showWishlistButton?: boolean;
  showRemoveButton?: boolean;
  showCTA?: boolean;
  onRemove?: () => void;
  onAcquire?: () => void;
  onReserve?: () => void;
  onAlertMe?: () => void;
}

export const IssueCardCompact = ({
  issue,
  showWishlistButton = false,
  showRemoveButton = false,
  showCTA = false,
  onRemove,
  onAcquire,
  onReserve,
  onAlertMe
}: IssueCardCompactProps) => {
  return (
    <article className="group border border-border p-6 hover:border-accent/20 transition-colors">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Left: Issue Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className={`text-meta px-2 py-0.5 ${
              issue.role === "Wolf" 
                ? "bg-charcoal text-foreground" 
                : "bg-bone/10 text-bone"
            }`}>
              {issue.role}
            </span>
            <IssueStatusBadge status={issue.status} />
          </div>
          
          <h3 className="text-display-md text-foreground mb-2">
            {issue.title}
          </h3>
          
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-meta text-muted-foreground/70">
            {issue.volumeTitle && (
              <span>{issue.volumeTitle}</span>
            )}
            {issue.chapterTitle && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span>{issue.chapterTitle}</span>
              </>
            )}
            {issue.material && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span>{issue.material}</span>
              </>
            )}
            {issue.acquisitionDate && (
              <>
                <span className="text-muted-foreground/30">·</span>
                <span>Acquired {issue.acquisitionDate}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {showWishlistButton && (
            <WishlistButton issueId={issue.id} variant="compact" />
          )}
          
          {showRemoveButton && onRemove && (
            <button
              onClick={onRemove}
              className="text-meta text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              Remove
            </button>
          )}
          
          {showCTA && issue.status !== "vaulted" && (
            <IssueCTAButton
              status={issue.status}
              onAcquire={onAcquire}
              onReserve={onReserve}
              onAlertMe={onAlertMe}
              size="sm"
            />
          )}
        </div>
      </div>
    </article>
  );
};
