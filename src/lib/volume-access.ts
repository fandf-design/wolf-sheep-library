/**
 * Volume Access Control System
 * 
 * Only whitelisted volumes are publicly accessible.
 * All other volumes appear in the library but are locked.
 */

// Whitelist of accessible volume slugs
export const ACCESSIBLE_VOLUME_SLUGS = ["dominion"] as const;

export type AccessibleVolumeSlug = typeof ACCESSIBLE_VOLUME_SLUGS[number];

/**
 * Check if a volume is accessible by its slug
 */
export function isVolumeAccessible(slug: string): boolean {
  return ACCESSIBLE_VOLUME_SLUGS.includes(slug as AccessibleVolumeSlug);
}

/**
 * Check if a chapter is accessible (inherits from parent volume)
 */
export function isChapterAccessible(volumeSlug: string): boolean {
  return isVolumeAccessible(volumeSlug);
}

/**
 * Get SEO meta tags based on volume accessibility
 */
export function getVolumeMetaTags(isAccessible: boolean): {
  robots: string;
} {
  return {
    robots: isAccessible ? "index, follow" : "noindex, nofollow"
  };
}
