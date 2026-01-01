import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchResult {
  id: string;
  title: string;
  type: "volume" | "chapter" | "issue";
  path: string;
  subtitle?: string;
}

// Mock search data (would come from API/CMS in production)
const searchableItems: SearchResult[] = [
  { id: "v1", title: "Dominion", type: "volume", path: "/volume/1", subtitle: "Volume I" },
  { id: "c1", title: "The Alpha Principle", type: "chapter", path: "/volume/1/chapter/1", subtitle: "Chapter I" },
  { id: "c2", title: "The Omega's Rest", type: "chapter", path: "/volume/1/chapter/2", subtitle: "Chapter II" },
  { id: "c3", title: "The Hunt", type: "chapter", path: "/volume/1/chapter/3", subtitle: "Chapter III" },
  { id: "i1", title: "Alpha's Burden Overcoat", type: "issue", path: "/volume/1/chapter/1/issue/alpha-coat-001", subtitle: "Issue" },
  { id: "i2", title: "The Yielding Knit", type: "issue", path: "/volume/1/chapter/2/issue/omega-shroud-001", subtitle: "Issue" },
  { id: "i3", title: "Predator's Silk Shirt", type: "issue", path: "/volume/1/chapter/3/issue/hunt-silk-001", subtitle: "Issue" },
];

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

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
  }, [query]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

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
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    onClick={onClose}
                    className="block p-4 bg-muted/20 border border-border/30 hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-meta text-muted-foreground block mb-1">
                      {result.subtitle}
                    </span>
                    <span className="text-body text-foreground">{result.title}</span>
                  </Link>
                ))}
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
