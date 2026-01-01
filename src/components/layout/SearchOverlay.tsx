import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, X, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { volumes } from "@/data/volumes";
import { isVolumeAccessible } from "@/lib/volume-access";
import { useToast } from "@/hooks/use-toast";

interface SearchResult {
  id: string;
  title: string;
  type: "volume" | "chapter" | "issue" | "chronicle";
  path: string;
  subtitle?: string;
  volumeSlug?: string;
}

// Chronicle entries
const chronicleEntries: SearchResult[] = [
  { id: "chr-1", title: "The Myth of the First Thread", type: "chronicle", path: "/chronicle", subtitle: "Origin" },
  { id: "chr-2", title: "Why We Use Cormorant", type: "chronicle", path: "/chronicle", subtitle: "Typography" },
  { id: "chr-3", title: "Fenrir's Binding", type: "chronicle", path: "/chronicle", subtitle: "Mythology" },
  { id: "chr-4", title: "On the Nature of Duality", type: "chronicle", path: "/chronicle", subtitle: "Philosophy" },
  { id: "chr-5", title: "The Archive Principle", type: "chronicle", path: "/chronicle", subtitle: "Method" },
];

// Sample issues data (mirrors Chapter.tsx)
const issuesData = [
  { id: "alpha-coat-001", title: "Alpha's Burden Overcoat", chapterSlug: "alpha-principle", volumeSlug: "dominion" },
  { id: "omega-shroud-001", title: "The Yielding Knit", chapterSlug: "omega-rest", volumeSlug: "dominion" },
  { id: "hunt-silk-001", title: "Predator's Silk Shirt", chapterSlug: "the-hunt", volumeSlug: "appetite" },
  { id: "shearing-wrap-001", title: "The Aftermath Wrap", chapterSlug: "after-shearing", volumeSlug: "appetite" },
  { id: "nocturne-cloak-001", title: "Midnight Wanderer Cloak", chapterSlug: "solitary-passage", volumeSlug: "nocturne" },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Build searchable items from source data
  const searchableItems = useMemo<SearchResult[]>(() => {
    const items: SearchResult[] = [];

    // Add volumes
    volumes.forEach((volume) => {
      items.push({
        id: `vol-${volume.slug}`,
        title: volume.title,
        type: "volume",
        path: `/volume/${volume.slug}`,
        subtitle: `Volume ${volume.number}`,
        volumeSlug: volume.slug,
      });

      // Add chapters
      volume.chapters.forEach((chapter) => {
        items.push({
          id: `ch-${volume.slug}-${chapter.slug}`,
          title: chapter.title,
          type: "chapter",
          path: `/volume/${volume.slug}/chapter/${chapter.slug}`,
          subtitle: `${volume.title} · Chapter`,
          volumeSlug: volume.slug,
        });
      });
    });

    // Add issues
    issuesData.forEach((issue) => {
      items.push({
        id: `issue-${issue.id}`,
        title: issue.title,
        type: "issue",
        path: `/volume/${issue.volumeSlug}/chapter/${issue.chapterSlug}`,
        subtitle: "Issue",
        volumeSlug: issue.volumeSlug,
      });
    });

    // Add chronicle entries
    items.push(...chronicleEntries);

    return items;
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const filtered = searchableItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle?.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, searchableItems]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleResultClick = (result: SearchResult, e: React.MouseEvent) => {
    // Check locked-volume gating
    if (result.volumeSlug && !isVolumeAccessible(result.volumeSlug)) {
      e.preventDefault();
      toast({
        title: "Volume Locked",
        description: "This content is not yet accessible.",
      });
      return;
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-sm animate-fade-in">
      <div className="max-w-2xl mx-auto px-6 pt-24">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Volumes, Chapters, Issues..."
            className="pl-12 pr-12 py-6 text-lg bg-muted/30 border-border/50"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        {query && (
          <div className="mt-8">
            {results.length > 0 ? (
              <div className="space-y-2">
                {results.map((result) => {
                  const isLocked = result.volumeSlug && !isVolumeAccessible(result.volumeSlug);
                  return (
                    <Link
                      key={result.id}
                      to={result.path}
                      onClick={(e) => handleResultClick(result, e)}
                      className={`block p-4 bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors ${
                        isLocked ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-meta text-muted-foreground block mb-1">
                            {result.subtitle}
                          </span>
                          <span className="text-body text-foreground">{result.title}</span>
                        </div>
                        {isLocked && (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-body text-muted-foreground text-center py-12">
                No results found for "{query}"
              </p>
            )}
          </div>
        )}

        {/* Hint */}
        {!query && (
          <p className="text-body-sm text-muted-foreground text-center mt-12">
            Press <kbd className="px-2 py-1 bg-muted/50 border border-border/50 text-xs">ESC</kbd> to close
          </p>
        )}
      </div>
    </div>
  );
};
