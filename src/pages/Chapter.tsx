import { useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { volumes, Issue } from "@/data/volumes";
import { IssueStatusBadge, IssueCTAButton, AlertMeModal } from "@/components/issue";
import { WishlistButton } from "@/components/shelf";
import { useCartStore } from "@/stores/cartStore";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { mapShopifyToStatus } from "@/types/issue-status";
import type { ShopifyProduct, ShopifyCartItem } from "@/types/shopify";

// Sample issues with unified status system (fallback when no Shopify products)
const sampleIssues: Issue[] = [
  {
    id: "alpha-coat-001",
    title: "Alpha's Burden Overcoat",
    story: "Forged for shoulders that carry more than fabric. This overcoat was designed in the depths of winter, when the studio was silent and the weight of leadership felt heaviest. Every stitch carries the tension of decisions made alone.",
    fabricNotes: "Heavy wool-cashmere blend from Scottish highlands. Lined with silk charmeuse that whispers against movement.",
    craftsmanship: "Hand-finished buttonholes. Horn buttons sourced from ethical farms. Each coat requires 40 hours of construction.",
    edition: "Origin",
    material: "Wool-Cashmere Blend",
    status: "limited",
    price: 2400,
    images: [],
    chapterSlug: "alpha-principle"
  },
  {
    id: "omega-shroud-001",
    title: "The Yielding Knit",
    story: "To follow is not weakness—it is strategic patience. This knit envelops the wearer in softness that borders on surrender, yet its construction is rigid, precise, uncompromising in its gentleness.",
    fabricNotes: "Merino wool from New Zealand, spun to 18 microns. Cloud-weight yet structured.",
    craftsmanship: "Seamless construction. Three weeks of hand-knitting per piece. Each carries a unique tension pattern.",
    edition: "Offering",
    material: "Fine Merino Wool",
    status: "acquire",
    price: 890,
    images: [],
    chapterSlug: "omega-rest"
  },
  {
    id: "hunt-silk-001",
    title: "Predator's Silk Shirt",
    story: "The hunt begins before dawn. This shirt moves like shadow, catches light like intention. Worn by those who know what they want and move toward it without apology.",
    fabricNotes: "Mulberry silk, 22 momme weight. Deep obsidian with subtle sheen that reveals itself only in motion.",
    craftsmanship: "Mother-of-pearl buttons. French seams throughout. Collar designed to frame without constricting.",
    edition: "Relic",
    material: "Mulberry Silk",
    status: "vaulted",
    price: 680,
    images: [],
    chapterSlug: "the-hunt"
  },
  {
    id: "shearing-wrap-001",
    title: "The Aftermath Wrap",
    story: "What remains after you've given everything away? This wrap is both shield and surrender, designed for the moment between ending and beginning.",
    fabricNotes: "Lightweight cashmere blend. Intentionally unfinished edges.",
    craftsmanship: "Single-piece construction. No seams, no closures, only drape.",
    edition: "Essence",
    material: "Cashmere Blend",
    status: "reserve",
    price: 1200,
    images: [],
    chapterSlug: "after-shearing"
  },
  {
    id: "nocturne-cloak-001",
    title: "Midnight Wanderer Cloak",
    story: "For the insomniac, the wanderer, the one who finds peace only in empty streets at 3am. This cloak was designed to disappear into darkness.",
    fabricNotes: "Matte black wool. Interior lined with deep navy silk.",
    craftsmanship: "Hand-stitched hem. Weighted corners for dramatic drape.",
    edition: "Essence",
    material: "Wool-Silk",
    status: "alert",
    price: 1800,
    images: [],
    chapterSlug: "solitary-passage"
  }
];

const Chapter = () => {
  const { volumeSlug, chapterSlug } = useParams();
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);
  
  // Fetch Shopify products
  const { data: shopifyProducts, isLoading: productsLoading } = useShopifyProducts(50);
  
  const volume = volumes.find(v => v.slug === volumeSlug);
  const chapter = volume?.chapters.find(c => c.slug === chapterSlug);
  
  // Use sample issues as fallback when no Shopify products
  const issues = sampleIssues.filter(i => i.chapterSlug === chapterSlug);

  const handleAlertMe = (issue: Issue) => {
    setSelectedIssue(issue);
    setAlertModalOpen(true);
  };

  const handleAcquireShopify = useCallback((product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) {
      toast.error("Product unavailable");
      return;
    }

    const cartItem: ShopifyCartItem = {
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    };

    addItem(cartItem);
    toast.success("Added to cart", {
      description: product.node.title,
      position: "top-center",
    });
  }, [addItem]);

  const handleAcquireFallback = (issue: Issue) => {
    toast.info("Connect Shopify products to enable checkout", {
      position: "top-center",
    });
  };

  const handleReserve = (issue: Issue) => {
    toast.info("Reservation flow coming soon", {
      position: "top-center",
    });
  };

  if (!volume || !chapter) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-lg mb-4">Chapter Not Found</h1>
          <Link to="/" className="link-archival">Return to Library</Link>
        </div>
      </main>
    );
  }

  const chapterIndex = volume.chapters.findIndex(c => c.slug === chapterSlug);

  // Convert Shopify products to display format
  const shopifyIssues = shopifyProducts?.map((product) => {
    const variant = product.node.variants.edges[0]?.node;
    const status = mapShopifyToStatus(
      variant?.availableForSale ?? false,
      !!product.node.publishedAt,
      product.node.tags
    );

    return {
      product,
      id: product.node.id,
      title: product.node.title,
      description: product.node.description,
      price: variant?.price.amount ? parseFloat(variant.price.amount) : 0,
      currencyCode: variant?.price.currencyCode || "USD",
      status,
      image: product.node.images.edges[0]?.node,
      handle: product.node.handle,
    };
  }) || [];

  const hasShopifyProducts = shopifyIssues.length > 0;

  return (
    <main className="min-h-screen pt-16">
      {/* Chapter Header - Compact */}
      <section className="relative py-16 flex items-center justify-center border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-background to-background" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto page-enter">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <Link to={`/volume/${volume.slug}`} className="text-meta text-muted-foreground hover:text-accent transition-colors">
              {volume.title}
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-accent/60">Chapter {String(chapterIndex + 1).padStart(2, "0")}</span>
          </div>

          <span className={`inline-block text-meta px-3 py-1 mb-4 ${
            chapter.status === "published" 
              ? "bg-charcoal text-foreground"
              : chapter.status === "upcoming"
              ? "border border-accent/30 text-accent/80"
              : "border border-muted-foreground/30 text-muted-foreground"
          }`}>
            {chapter.status === "out-of-print" ? "Out of Print" : chapter.status}
          </span>

          <h1 className="text-display-lg mb-3">
            {chapter.title}
          </h1>
          
          <p className="text-body text-lg text-muted-foreground italic mb-4">
            {chapter.tagline}
          </p>
          
          <span className="text-meta text-muted-foreground">{chapter.timestamp}</span>
        </div>
      </section>

      {/* Narrative - Compact */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <span className="text-meta block mb-4">Narrative Arc</span>
          <p className="text-body text-lg text-foreground/90 leading-relaxed">
            {chapter.narrativeArc}
          </p>
        </div>
      </section>

      {/* Shopify Products */}
      {hasShopifyProducts && (
        <section className="py-12 px-6 md:px-12 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <span className="text-meta block mb-2">From the Archive</span>
              <h2 className="text-display-md">Available Issues</h2>
            </div>

            <div className="space-y-12">
              {shopifyIssues.map((item) => (
                <article key={item.id} className="group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <Link 
                      to={`/product/${item.handle}`}
                      className="aspect-[3/4] bg-charcoal/50 border border-border overflow-hidden block"
                    >
                      {item.image ? (
                        <img
                          src={item.image.url}
                          alt={item.image.altText || item.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-meta text-muted-foreground">No Image</span>
                        </div>
                      )}
                    </Link>
                    
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-3">
                        <IssueStatusBadge status={item.status} />
                        <WishlistButton 
                          issueId={item.id} 
                          issueTitle={item.title}
                          variant="compact"
                        />
                      </div>
                      <Link to={`/product/${item.handle}`}>
                        <h3 className="text-display-md text-foreground mb-3 hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <p className="text-body text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      
                      {/* Price & Action */}
                      {item.status !== "vaulted" ? (
                        <div className="flex items-center justify-between">
                          <span className="text-display text-xl text-foreground">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: item.currencyCode,
                              minimumFractionDigits: 0,
                            }).format(item.price)}
                          </span>
                          <IssueCTAButton
                            status={item.status}
                            onAcquire={() => handleAcquireShopify(item.product)}
                            onReserve={() => handleReserve(sampleIssues[0])}
                            onAlertMe={() => handleAlertMe(sampleIssues[0])}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-body text-muted-foreground italic">
                            This issue has entered the Vault
                          </span>
                          <Link to="/vault" className="text-ui text-accent/80 hover:text-accent transition-colors">
                            View in Vault →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fallback Sample Issues */}
      {!hasShopifyProducts && issues.length > 0 && (
        <section className="py-12 px-6 md:px-12 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <span className="text-meta block mb-2">Artifacts</span>
              <h2 className="text-display-md">Issues</h2>
            </div>

            <div className="space-y-12">
              {issues.map((issue) => (
                <article key={issue.id} className="group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Image Placeholder */}
                    <div className="aspect-[3/4] bg-charcoal/50 border border-border flex items-center justify-center">
                      <span className="text-meta text-muted-foreground">Editorial Image</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-3">
                        <IssueStatusBadge status={issue.status} />
                        <WishlistButton 
                          issueId={issue.id} 
                          issueTitle={issue.title}
                          variant="compact"
                        />
                      </div>
                      <h3 className="text-display-md text-foreground mb-3">
                        {issue.title}
                      </h3>
                      
                      <p className="text-body text-muted-foreground leading-relaxed mb-4">
                        {issue.story}
                      </p>
                      
                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border mb-4">
                        <div>
                          <span className="text-meta text-muted-foreground block mb-1">Edition</span>
                          <span className="text-body-sm text-foreground">{issue.edition}</span>
                        </div>
                        <div>
                          <span className="text-meta text-muted-foreground block mb-1">Material</span>
                          <span className="text-body-sm text-foreground">{issue.material}</span>
                        </div>
                      </div>
                      
                      {/* Price & Action */}
                      {issue.status !== "vaulted" ? (
                        <div className="flex items-center justify-between">
                          <span className="text-display text-xl text-foreground">
                            ${issue.price.toLocaleString()}
                          </span>
                          <IssueCTAButton
                            status={issue.status}
                            onAcquire={() => handleAcquireFallback(issue)}
                            onReserve={() => handleReserve(issue)}
                            onAlertMe={() => handleAlertMe(issue)}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-body text-muted-foreground italic">
                            This issue has entered the Vault
                          </span>
                          <Link to="/vault" className="text-ui text-accent/80 hover:text-accent transition-colors">
                            View in Vault →
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chapter Navigation */}
      <section className="py-12 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <Link 
            to={`/volume/${volume.slug}`}
            className="inline-flex items-center gap-2 text-ui text-muted-foreground hover:text-accent transition-colors"
          >
            <span>←</span>
            <span>Back to {volume.title}</span>
          </Link>
        </div>
      </section>

      {/* Alert Me Modal */}
      {selectedIssue && (
        <AlertMeModal
          open={alertModalOpen}
          onOpenChange={setAlertModalOpen}
          productId={selectedIssue.id}
          productTitle={selectedIssue.title}
        />
      )}
    </main>
  );
};

export default Chapter;