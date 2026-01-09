/**
 * Unified product availability/status system for Fang & Fleece
 * 
 * Status mapping:
 * - acquire: Available, open run
 * - limited: Available, capped run
 * - reserve: Not yet released, preorder open
 * - alert: Temporarily unavailable, restock possible
 * - vaulted: Permanently unavailable
 */

export type IssueStatus = "acquire" | "limited" | "reserve" | "alert" | "vaulted";

/**
 * Edition Tier System
 * Artifact classification, not quantity
 */
export type EditionTier = "Origin" | "Essence" | "Offering" | "Relic";

export const EDITION_TIER_CONFIG: Record<EditionTier, { description: string }> = {
  Origin: { description: "First manifestation" },
  Essence: { description: "Core expression" },
  Offering: { description: "Open access" },
  Relic: { description: "Archived artifact" },
};

export interface IssueStatusConfig {
  label: string | null; // Badge label (null = no badge)
  ctaLabel: string | null; // Button label (null = no CTA)
  showCTA: boolean;
}

export const ISSUE_STATUS_CONFIG: Record<IssueStatus, IssueStatusConfig> = {
  acquire: {
    label: null,
    ctaLabel: "Acquire",
    showCTA: true,
  },
  limited: {
    label: "Limited Quantity",
    ctaLabel: "Acquire",
    showCTA: true,
  },
  reserve: {
    label: null,
    ctaLabel: "Reserve",
    showCTA: true,
  },
  alert: {
    label: null,
    ctaLabel: "Alert Me",
    showCTA: true,
  },
  vaulted: {
    label: "Vaulted",
    ctaLabel: null,
    showCTA: false,
  },
};

/**
 * Forbidden terms that must NEVER appear anywhere in product displays
 */
export const FORBIDDEN_TERMS = [
  "out of stock",
  "low stock",
  "only",
  "left",
  "sold out",
  "backorder",
  "preorder", // use "Reserve" instead
  "countdown",
  "hurry",
  "limited time",
  "selling fast",
  "almost gone",
  "last chance",
  "running out",
  "drop", // deprecated concept
] as const;

/**
 * Check if text contains forbidden terms (case-insensitive)
 */
export function containsForbiddenTerm(text: string): boolean {
  const lowerText = text.toLowerCase();
  return FORBIDDEN_TERMS.some(term => lowerText.includes(term));
}

/**
 * Get the status configuration for a given status
 */
export function getStatusConfig(status: IssueStatus): IssueStatusConfig {
  return ISSUE_STATUS_CONFIG[status];
}

/**
 * Map Shopify product data to IssueStatus
 * Use this when connected to Shopify
 */
export function mapShopifyToStatus(
  availableForSale: boolean,
  isPublished: boolean,
  tags: string[]
): IssueStatus {
  const normalizedTags = tags.map(t => t.toLowerCase());
  
  // Vaulted: unpublished/archived OR tagged "vaulted"
  if (!isPublished || normalizedTags.includes("vaulted")) {
    return "vaulted";
  }
  
  // Reserve: tagged "reserve" (preorder)
  if (normalizedTags.includes("reserve")) {
    return "reserve";
  }
  
  // Limited: available AND tagged "limited"
  if (availableForSale && normalizedTags.includes("limited")) {
    return "limited";
  }
  
  // Acquire: available without special tags
  if (availableForSale) {
    return "acquire";
  }
  
  // Alert: not available but published
  return "alert";
}
