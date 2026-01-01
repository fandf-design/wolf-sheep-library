import { useParams, Link } from "react-router-dom";
import { getSharedWishlist } from "@/hooks/use-wishlist";
import { IssueStatusBadge } from "@/components/issue";
import type { IssueStatus } from "@/types/issue-status";

// Sample issues database (would come from API/CMS in production)
const issuesDatabase: Record<string, {
  id: string;
  title: string;
  status: IssueStatus;
  volumeTitle: string;
  chapterTitle: string;
}> = {
  "alpha-coat-001": {
    id: "alpha-coat-001",
    title: "Alpha's Burden Overcoat",
    status: "limited",
    volumeTitle: "Dominion",
    chapterTitle: "The Alpha Principle"
  },
  "omega-shroud-001": {
    id: "omega-shroud-001",
    title: "The Yielding Knit",
    status: "acquire",
    volumeTitle: "Dominion",
    chapterTitle: "The Omega's Rest"
  },
  "hunt-silk-001": {
    id: "hunt-silk-001",
    title: "Predator's Silk Shirt",
    status: "vaulted",
    volumeTitle: "Dominion",
    chapterTitle: "The Hunt"
  },
  "shearing-wrap-001": {
    id: "shearing-wrap-001",
    title: "The Aftermath Wrap",
    status: "reserve",
    volumeTitle: "Dominion",
    chapterTitle: "After the Shearing"
  },
  "nocturne-cloak-001": {
    id: "nocturne-cloak-001",
    title: "Midnight Wanderer Cloak",
    status: "alert",
    volumeTitle: "Dominion",
    chapterTitle: "Solitary Passage"
  }
};

const SharedWishlist = () => {
  const { token } = useParams<{ token: string }>();
  const wishlistItems = token ? getSharedWishlist(token) : null;

  if (!wishlistItems) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center page-enter">
          <h1 className="text-display-lg mb-4">Wishlist Not Found</h1>
          <p className="text-body text-muted-foreground mb-8">
            This wishlist may have been made private or the link has expired.
          </p>
          <Link to="/" className="link-archival">
            Enter the Library
          </Link>
        </div>
      </main>
    );
  }

  const issues = wishlistItems
    .map(item => issuesDatabase[item.issueId])
    .filter(Boolean);

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Shared Collection</span>
          <h1 className="text-display-xl mb-6">A Reader's Wishlist</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            {issues.length} {issues.length === 1 ? "Issue" : "Issues"} saved for future acquisition.
          </p>
        </div>
      </section>

      {/* Wishlist Items */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map((issue) => (
                <article 
                  key={issue.id}
                  className="border border-border p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <IssueStatusBadge status={issue.status} />
                      </div>
                      
                      <h3 className="text-display-md text-foreground mb-1">
                        {issue.title}
                      </h3>
                      
                      <p className="text-meta text-muted-foreground/70">
                        {issue.volumeTitle} · {issue.chapterTitle}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-border">
              <p className="text-body text-muted-foreground">
                This wishlist is empty.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-body text-muted-foreground mb-6">
            Start your own collection.
          </p>
          <Link 
            to="/"
            className="inline-block px-8 py-3 bg-foreground text-background text-ui hover:bg-foreground/90 transition-colors"
          >
            Enter the Library
          </Link>
        </div>
      </section>
    </main>
  );
};

export default SharedWishlist;
