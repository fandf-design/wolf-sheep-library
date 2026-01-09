import { useParams, Link } from "react-router-dom";
import { volumes } from "@/data/volumes";
import { isVolumeAccessible } from "@/lib/volume-access";

const Volume = () => {
  const { slug } = useParams();
  const volume = volumes.find(v => v.slug === slug);
  const isAccessible = slug ? isVolumeAccessible(slug) : false;

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
      <section className="relative py-16 flex items-center justify-center">
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

          <h1 className="text-display-xl mb-4">
            {volume.title}
          </h1>
          
          <p className="text-body text-xl text-muted-foreground mb-3">
            {volume.subtitle}
          </p>
          
          <div className="inline-block px-4 py-2 border border-accent/30">
            <span className="text-ui text-accent/80">{volume.tension}</span>
          </div>
        </div>
      </section>

      {/* Manifesto - Compact */}
      <section className="py-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-4">
            <span className="text-meta block">Manifesto</span>
          </div>
          <p className="text-body text-lg text-foreground/90 leading-relaxed">
            {volume.manifesto}
          </p>
        </div>
      </section>

      {/* Chapters with Issues inline */}
      <section className="py-12 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-meta block mb-2">Contents</span>
            <h2 className="text-display-md">Chapters</h2>
          </div>

          <div className="space-y-12">
            {volume.chapters.map((chapter, index) => (
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
                        ? "bg-charcoal text-foreground"
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

                {/* Issues placeholder - would be populated from Shopify */}
                <div className="pl-0 md:pl-8">
                  <Link
                    to={`/volume/${volume.slug}/chapter/${chapter.slug}`}
                    className="inline-flex items-center gap-2 text-ui text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span>View Issues →</span>
                  </Link>
                </div>
              </section>
            ))}
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