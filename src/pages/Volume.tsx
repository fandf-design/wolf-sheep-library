import { useParams, Link } from "react-router-dom";
import { volumes } from "@/data/volumes";
import { isVolumeAccessible } from "@/lib/volume-access";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { usePageTitle } from "@/hooks/use-page-title";
import { IssueGridCard } from "@/components/issue";
import { mapShopifyToStatus } from "@/types/issue-status";
import { Skeleton } from "@/components/ui/skeleton";

const Volume = () => {
  const { slug } = useParams();
  const volume = volumes.find(v => v.slug === slug);
  const isAccessible = slug ? isVolumeAccessible(slug) : false;

  // Fetch all products (no query filter - Storefront API has limited query support)
  const { data: shopifyProducts, isLoading } = useShopifyProducts(100);

  // Dynamic page title
  usePageTitle(volume?.title ? `${volume.title} — Volume ${volume.number}` : undefined);

  // Get products for a specific chapter by filtering tags client-side
  const getProductsForChapter = (chapterSlug: string) => {
    if (!shopifyProducts) return [];
    return shopifyProducts.filter(product =>
      product.node.tags.some(tag => tag === `chapter:${chapterSlug}`)
    );
  };

  if (!volume) {
    return (
      <main className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display-lg mb-4">Volume Not Found</h1>
          <Link to="/" className="link-archival">Return to Library</Link>
        </div>
      </main>
    );
  }

  // Locked Volume - Ruins presentation
  if (!isAccessible) {
    return (
      <main className="min-h-screen pt-16">
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4">
              <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
                Library
              </Link>
              <span className="text-meta text-muted-foreground mx-3">/</span>
              <span className="text-meta text-muted-foreground/50">Volume {volume.number}</span>
            </div>
            
            <h1 className="text-display-xl text-muted-foreground/30 mb-6">
              {volume.title}
            </h1>
            
            <span className="text-meta text-muted-foreground/20 tracking-[0.3em]">
              SEALED
            </span>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      {/* Volume Header - Compact */}
      <section className="relative py-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-background to-background" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto page-enter">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-accent/60">Volume {volume.number}</span>
          </div>

          <h1 className="text-display-xl mb-3">
            {volume.title}
          </h1>
          
          <p className="text-body text-lg text-muted-foreground mb-3">
            {volume.subtitle}
          </p>
          
          <div className="inline-block px-4 py-2 border border-accent/30">
            <span className="text-ui text-accent/80">{volume.tension}</span>
          </div>
        </div>
      </section>

      {/* Manifesto - Compact */}
      <section className="py-8 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-3">
            <span className="text-meta block">Manifesto</span>
          </div>
          <p className="text-body text-lg text-foreground/90 leading-relaxed">
            {volume.manifesto}
          </p>
        </div>
      </section>

      {/* Chapters with Issues Grid */}
      <section className="py-12 px-6 md:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="text-meta block mb-2">Contents</span>
            <h2 className="text-display-md">Chapters</h2>
          </div>

          <div className="space-y-16">
            {volume.chapters.map((chapter, index) => {
              const chapterProducts = getProductsForChapter(chapter.slug);
              
              return (
                <section key={chapter.slug} className="border-t border-border pt-8 first:border-t-0 first:pt-0">
                  {/* Chapter Header */}
                  <Link
                    to={`/volume/${volume.slug}/chapter/${chapter.slug}`}
                    className="group block mb-6"
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-meta text-accent/60">
                        Chapter {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`text-meta px-2 py-0.5 ${
                        chapter.status === "published" 
                          ? "bg-secondary text-secondary-foreground border border-border"
                          : chapter.status === "upcoming"
                          ? "border border-accent/30 text-accent/80"
                          : "border border-muted-foreground/30 text-muted-foreground"
                      }`}>
                        {chapter.status === "out-of-print" ? "Out of Print" : chapter.status}
                      </span>
                    </div>
                    
                    <h3 className="text-display-md text-foreground group-hover:text-accent transition-colors mb-1">
                      {chapter.title}
                    </h3>
                    
                    <p className="text-body text-muted-foreground italic">
                      {chapter.tagline}
                    </p>
                  </Link>

                  {/* Issues Grid */}
                  <div className="mt-6">
                    {isLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="space-y-3">
                            <Skeleton className="aspect-[3/4] w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        ))}
                      </div>
                    ) : chapterProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {chapterProducts.map((product) => {
                          const variant = product.node.variants.edges[0]?.node;
                          if (!variant) return null;
                          
                          return (
                            <IssueGridCard
                              key={product.node.id}
                              handle={product.node.handle}
                              title={product.node.title}
                              price={parseFloat(variant.price.amount)}
                              currencyCode={variant.price.currencyCode}
                              status={mapShopifyToStatus(
                                variant.availableForSale,
                                !!product.node.publishedAt,
                                product.node.tags
                              )}
                              image={product.node.images.edges[0]?.node}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-4">
                        <p className="text-meta text-muted-foreground/60 mb-2">No issues available</p>
                        <Link
                          to={`/volume/${volume.slug}/chapter/${chapter.slug}`}
                          className="inline-flex items-center gap-2 text-ui text-muted-foreground hover:text-accent transition-colors"
                        >
                          <span>View Chapter →</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volume Navigation - Compact */}
      <section className="py-12 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {volumes.findIndex(v => v.slug === volume.slug) > 0 ? (
            <Link 
              to={`/volume/${volumes[volumes.findIndex(v => v.slug === volume.slug) - 1].slug}`}
              className="group"
            >
              <span className="text-meta text-muted-foreground block mb-1">Previous Volume</span>
              <span className="text-display-md text-foreground group-hover:text-accent transition-colors">
                {volumes[volumes.findIndex(v => v.slug === volume.slug) - 1].title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          
          {volumes.findIndex(v => v.slug === volume.slug) < volumes.length - 1 ? (
            <Link 
              to={`/volume/${volumes[volumes.findIndex(v => v.slug === volume.slug) + 1].slug}`}
              className="group text-right"
            >
              <span className="text-meta text-muted-foreground block mb-1">Next Volume</span>
              <span className="text-display-md text-foreground group-hover:text-accent transition-colors">
                {volumes[volumes.findIndex(v => v.slug === volume.slug) + 1].title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </main>
  );
};

export default Volume;
