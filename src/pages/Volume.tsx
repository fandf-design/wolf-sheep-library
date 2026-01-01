import { useParams, Link } from "react-router-dom";
import { volumes } from "@/data/volumes";

const Volume = () => {
  const { slug } = useParams();
  const volume = volumes.find(v => v.slug === slug);

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

  return (
    <main className="min-h-screen pt-16">
      {/* Volume Header */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-background to-background" />
        
        {/* Decorative Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-5">
          <svg viewBox="0 0 600 600" fill="none" className="w-full h-full text-accent">
            <circle cx="300" cy="300" r="298" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="250" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="200" stroke="currentColor" strokeWidth="0.5" />
            <line x1="300" y1="0" x2="300" y2="600" stroke="currentColor" strokeWidth="0.5" />
            <line x1="0" y1="300" x2="600" y2="300" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto page-enter">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/" className="text-meta text-muted-foreground hover:text-accent transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-accent/60">Volume {volume.number}</span>
          </div>

          <h1 className="text-display-xl mb-6">
            {volume.title}
          </h1>
          
          <p className="text-body text-xl text-muted-foreground mb-4">
            {volume.subtitle}
          </p>
          
          <div className="inline-block px-4 py-2 border border-accent/30 mt-6">
            <span className="text-ui text-accent/80">{volume.tension}</span>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <span className="text-meta block">Manifesto</span>
          </div>
          <p className="text-body text-lg text-foreground/90 leading-relaxed">
            {volume.manifesto}
          </p>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-24 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16">
            <span className="text-meta block mb-2">Contents</span>
            <h2 className="text-display-md">Chapters</h2>
          </div>

          <div className="space-y-1">
            {volume.chapters.map((chapter, index) => (
              <Link
                key={chapter.slug}
                to={`/volume/${volume.slug}/chapter/${chapter.slug}`}
                className="group block border-t border-border py-8 first:border-t-0"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
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
                    
                    <h3 className="text-display-md text-foreground group-hover:text-accent transition-colors mb-2">
                      {chapter.title}
                    </h3>
                    
                    <p className="text-body text-muted-foreground italic">
                      {chapter.tagline}
                    </p>
                  </div>
                  
                  <div className="md:text-right">
                    <span className="text-meta block">{chapter.timestamp}</span>
                    <span className="text-body-sm text-muted-foreground mt-2 block opacity-0 group-hover:opacity-100 transition-opacity">
                      Enter →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Volume Navigation */}
      <section className="py-16 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {volumes.findIndex(v => v.slug === volume.slug) > 0 ? (
            <Link 
              to={`/volume/${volumes[volumes.findIndex(v => v.slug === volume.slug) - 1].slug}`}
              className="group"
            >
              <span className="text-meta text-muted-foreground block mb-2">Previous Volume</span>
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
              <span className="text-meta text-muted-foreground block mb-2">Next Volume</span>
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
