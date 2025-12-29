import { useState } from "react";
import { Link } from "react-router-dom";
import { Share2 } from "lucide-react";
import { ShelfTabs, IssueCardCompact, ShareWishlistModal } from "@/components/shelf";
import { AlertMeModal } from "@/components/issue";
import { useWishlist } from "@/hooks/use-wishlist";
import type { IssueStatus } from "@/types/issue-status";

// Sample issues database (would come from API/CMS in production)
const issuesDatabase: Record<string, {
  id: string;
  title: string;
  role: "Wolf" | "Sheep";
  status: IssueStatus;
  material: string;
  volumeTitle: string;
  chapterTitle: string;
}> = {
  "alpha-coat-001": {
    id: "alpha-coat-001",
    title: "Alpha's Burden Overcoat",
    role: "Wolf",
    status: "limited",
    material: "Wool-Cashmere",
    volumeTitle: "Dominion",
    chapterTitle: "The Alpha Principle"
  },
  "omega-shroud-001": {
    id: "omega-shroud-001",
    title: "The Yielding Knit",
    role: "Sheep",
    status: "acquire",
    material: "Merino Wool",
    volumeTitle: "Dominion",
    chapterTitle: "The Omega's Rest"
  },
  "hunt-silk-001": {
    id: "hunt-silk-001",
    title: "Predator's Silk Shirt",
    role: "Wolf",
    status: "vaulted",
    material: "Mulberry Silk",
    volumeTitle: "Dominion",
    chapterTitle: "The Hunt"
  },
  "shearing-wrap-001": {
    id: "shearing-wrap-001",
    title: "The Aftermath Wrap",
    role: "Sheep",
    status: "reserve",
    material: "Cashmere Blend",
    volumeTitle: "Dominion",
    chapterTitle: "After the Shearing"
  },
  "nocturne-cloak-001": {
    id: "nocturne-cloak-001",
    title: "Midnight Wanderer Cloak",
    role: "Wolf",
    status: "alert",
    material: "Wool-Silk",
    volumeTitle: "Dominion",
    chapterTitle: "Solitary Passage"
  }
};

// Mock acquired issues (would come from order history)
const acquiredIssues = [{
  id: "alpha-coat-001",
  acquisitionDate: "March 2024",
  edition: "037/100"
}, {
  id: "omega-shroud-001",
  acquisitionDate: "April 2024",
  edition: "089/100"
}];
const Shelf = () => {
  const [activeTab, setActiveTab] = useState<"acquired" | "wishlist">("acquired");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const {
    items: wishlistItems,
    removeFromWishlist
  } = useWishlist();

  // Get full issue data for acquired items
  const acquiredData = acquiredIssues.map(acquired => {
    const issue = issuesDatabase[acquired.id];
    if (!issue) return null;
    return {
      ...issue,
      acquisitionDate: acquired.acquisitionDate
    };
  }).filter(Boolean) as Array<typeof issuesDatabase[string] & {
    acquisitionDate: string;
  }>;

  // Get full issue data for wishlist items
  const wishlistData = wishlistItems.map(item => issuesDatabase[item.issueId]).filter(Boolean);

  // Check for Dualist badge (Wolf & Sheep from same volume)
  const hasDualistBadge = acquiredData.some(i => i.role === "Wolf") && acquiredData.some(i => i.role === "Sheep") && acquiredData.filter(i => i.role === "Wolf").some(wolf => acquiredData.filter(i => i.role === "Sheep").some(sheep => sheep.volumeTitle === wolf.volumeTitle));
  const handleAlertMe = (issue: {
    id: string;
    title: string;
  }) => {
    setSelectedIssue(issue);
    setAlertModalOpen(true);
  };
  return <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Your Archive</span>
          <h1 className="text-display-xl mb-6">The Collector's Shelf</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            Every Issue you've acquired becomes part of your personal mythology.
            Your collection tells a story about the tensions you embody.
          </p>
        </div>
      </section>

      {/* Badges Section */}
      {hasDualistBadge && <section className="py-12 px-6 md:px-12 border-b border-border bg-charcoal/10">
          <div className="max-w-4xl mx-auto">
            <span className="text-meta block mb-6">Distinctions</span>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 px-5 py-3 border border-accent/40 bg-accent/5">
                <div className="w-8 h-8 rounded-full border border-accent/60 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-accent">
                    <circle cx="6" cy="8" r="4" stroke="currentColor" strokeWidth="1" />
                    <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
                <div>
                  <span className="text-ui text-accent block">Dualist</span>
                  <span className="text-meta text-muted-foreground">Wolf & Sheep from Dominion</span>
                </div>
              </div>
            </div>
          </div>
        </section>}

      {/* Tabs & Content */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <ShelfTabs activeTab={activeTab} onTabChange={setActiveTab} acquiredCount={acquiredData.length} wishlistCount={wishlistData.length} />
            
            {activeTab === "wishlist" && wishlistData.length > 0 && <button onClick={() => setShareModalOpen(true)} className="flex items-center gap-2 text-meta text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <Share2 className="w-3.5 h-3.5" />
                Share Wishlist
              </button>}
          </div>

          {/* Acquired Tab */}
          {activeTab === "acquired" && <>
              {acquiredData.length > 0 ? <div className="space-y-4">
                  {acquiredData.map(issue => <IssueCardCompact key={issue.id} issue={issue} />)}
                </div> : <div className="text-center py-24 border border-border">
                  <p className="text-body text-muted-foreground mb-6">
                    Your shelf awaits its first artifact.
                  </p>
                  <Link to="/" className="link-archival">
                    Enter the Library
                  </Link>
                </div>}
            </>}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && <>
              {wishlistData.length > 0 ? <div className="space-y-4">
                  {wishlistData.map(issue => <IssueCardCompact key={issue.id} issue={issue} showRemoveButton showCTA onRemove={() => removeFromWishlist(issue.id)} onAcquire={() => console.log("Acquire:", issue.title)} onReserve={() => console.log("Reserve:", issue.title)} onAlertMe={() => handleAlertMe(issue)} />)}
                </div> : <div className="text-center py-24 border border-border">
                  <p className="text-body text-muted-foreground mb-6">
                    No Issues saved yet.
                  </p>
                  <Link to="/" className="link-archival">
                    Explore the Library
                  </Link>
                </div>}
            </>}
        </div>
      </section>

      {/* Account Section */}
      <section className="py-16 px-6 md:px-12 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-display-md mb-8">Account</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-border p-6">
              <span className="text-ui text-muted-foreground block mb-4">Profile</span>
              <p className="text-body text-foreground">collector@archive.myth</p>
              <p className="text-body-sm text-muted-foreground mt-2">Member since 2024</p>
            </div>
            
            <div className="border border-border p-6">
              <span className="text-ui text-muted-foreground block mb-4">Shipping Address</span>
              <p className="text-body-sm text-muted-foreground">No address on file</p>
              <button className="mt-4 text-ui text-accent/80 hover:text-accent transition-colors">
                Add Address
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Share Wishlist Modal */}
      <ShareWishlistModal open={shareModalOpen} onOpenChange={setShareModalOpen} />

      {/* Alert Me Modal */}
      {selectedIssue && <AlertMeModal open={alertModalOpen} onOpenChange={setAlertModalOpen} productId={selectedIssue.id} productTitle={selectedIssue.title} />}
    </main>;
};
export default Shelf;