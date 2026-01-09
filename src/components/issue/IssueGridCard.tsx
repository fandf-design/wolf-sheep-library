import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { IssueStatusBadge } from "./IssueStatusBadge";
import type { IssueStatus } from "@/types/issue-status";

interface IssueGridCardProps {
  handle: string;
  title: string;
  price: number;
  currencyCode: string;
  status: IssueStatus;
  image?: { url: string; altText: string | null };
}

export function IssueGridCard({
  handle,
  title,
  price,
  currencyCode,
  status,
  image,
}: IssueGridCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Link
      to={`/product/${handle}`}
      className="group block"
    >
      <div className="space-y-3">
        {/* Image */}
        <AspectRatio ratio={3 / 4} className="overflow-hidden bg-charcoal/20">
          {image?.url ? (
            <img
              src={image.url}
              alt={image.altText || title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-meta text-muted-foreground/40">No Image</span>
            </div>
          )}
        </AspectRatio>

        {/* Details */}
        <div className="space-y-1">
          <h4 className="text-ui text-foreground group-hover:text-accent transition-colors line-clamp-1">
            {title}
          </h4>
          
          <div className="flex items-center justify-between gap-2">
            <span className="text-meta text-muted-foreground">
              {formatPrice(price, currencyCode)}
            </span>
            <IssueStatusBadge status={status} />
          </div>
        </div>
      </div>
    </Link>
  );
}
