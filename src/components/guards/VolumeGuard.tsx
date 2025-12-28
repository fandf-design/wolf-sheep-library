import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isVolumeAccessible, isChapterAccessible } from "@/lib/volume-access";
import { volumes } from "@/data/volumes";
import { toast } from "sonner";

interface VolumeGuardProps {
  children: React.ReactNode;
}

/**
 * Route guard for Volume pages
 * Redirects to Library if volume is locked
 */
export const VolumeGuard = ({ children }: VolumeGuardProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug && !isVolumeAccessible(slug)) {
      // Check if volume exists
      const volumeExists = volumes.some(v => v.slug === slug);
      
      if (volumeExists) {
        toast.error("Volume locked", {
          description: "This Volume is not yet in circulation."
        });
      }
      
      navigate("/", { replace: true });
    }
  }, [slug, navigate]);

  // If not accessible, don't render children (will redirect)
  if (slug && !isVolumeAccessible(slug)) {
    return null;
  }

  return <>{children}</>;
};

interface ChapterGuardProps {
  children: React.ReactNode;
}

/**
 * Route guard for Chapter pages
 * Redirects to Library if parent volume is locked
 */
export const ChapterGuard = ({ children }: ChapterGuardProps) => {
  const { volumeSlug, chapterSlug } = useParams<{ volumeSlug: string; chapterSlug: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (volumeSlug && !isChapterAccessible(volumeSlug)) {
      // Check if volume and chapter exist
      const volume = volumes.find(v => v.slug === volumeSlug);
      const chapterExists = volume?.chapters.some(c => c.slug === chapterSlug);
      
      if (volume && chapterExists) {
        toast.error("Volume locked", {
          description: "This Volume is not yet in circulation."
        });
      }
      
      navigate("/", { replace: true });
    }
  }, [volumeSlug, chapterSlug, navigate]);

  // If parent volume not accessible, don't render children
  if (volumeSlug && !isChapterAccessible(volumeSlug)) {
    return null;
  }

  return <>{children}</>;
};
