import { VolumeSpine } from "@/components/library/VolumeSpine";
import { volumes } from "@/data/volumes";
import { useEffect, useRef, useState } from "react";
const Library = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const {
          scrollLeft,
          scrollWidth,
          clientWidth
        } = scrollRef.current;
        const progress = scrollLeft / (scrollWidth - clientWidth);
        setScrollProgress(progress);
      }
    };
    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener("scroll", handleScroll);
    return () => scrollEl?.removeEventListener("scroll", handleScroll);
  }, []);
  return <main className="min-h-screen pt-16">
      {/* Hero Section - Compact */}
      <section className="relative py-16 flex items-center justify-center overflow-hidden">
        {/* Background with subtle grain texture */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/10" />
        
        {/* Archival grain overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
      }} />

        <div className="relative z-10 text-center px-6 page-enter">
          
          <h1 className="text-display-xl mb-4 text-foreground">
            The Library
          </h1>
          <p className="text-body max-w-xl mx-auto text-muted-foreground/70 leading-relaxed">
            Fashion as literature. Garments as artifacts. Collections as mythic volumes.
            <br />
            <span className="text-accent/40 font-light tracking-[0.15em] text-sm">Wolf and sheep. Dominance and restraint.</span>
          </p>
        </div>
      </section>

      {/* Volumes Section - Compact */}
      <section className="relative py-12 overflow-visible">
        <div className="px-6 md:px-12 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-meta block mb-2">Collection</span>
              <h2 className="text-display-md">Volumes</h2>
            </div>
            <div className="hidden md:flex items-center gap-4 text-meta opacity-40">
              <span className="tracking-[0.12em]">Scroll</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-muted-foreground animate-[drift_3s_ease-in-out_infinite]">
                <path d="M5 12H19M19 12L14 7M19 12L14 17" stroke="currentColor" strokeWidth="0.75" />
              </svg>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div ref={scrollRef} className="scroll-horizontal gap-6 px-6 md:px-12 pb-6">
          {volumes.map((volume, index) => <VolumeSpine key={volume.slug} number={volume.number} title={volume.title} subtitle={volume.subtitle} tension={volume.tension} slug={volume.slug} index={index} />)}
          
          {/* End Spacer */}
          <div className="flex-shrink-0 w-12 md:w-24" />
        </div>

        {/* Scroll Progress Indicator */}
        <div className="px-6 md:px-12 mt-6">
          <div className="h-px bg-border relative max-w-md">
            {/* Progress bar: foreground ink, not gold */}
            <div className="absolute top-0 left-0 h-px bg-foreground/60 transition-all duration-300" style={{
            width: `${scrollProgress * 100}%`
          }} />
          </div>
        </div>
      </section>

      {/* Archive Statement - Compact */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-display-md text-foreground/90 mb-6 leading-relaxed">
            "We are all wolves wearing the wool of sheep,
            <br />
            or sheep with fangs hidden beneath soft smiles."
          </blockquote>
          <cite className="text-meta">— From the First Binding</cite>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="border-t border-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <span className="text-display text-lg tracking-wider">FANG</span>
                <span className="mx-2 text-muted-foreground">&</span>
                <span className="text-display text-lg tracking-wider">FLEECE</span>
              </div>
              <p className="text-body-sm text-muted-foreground max-w-sm">
                A digital literary archive where fashion is studied, not sold loudly. 
                Each garment is an artifact, each collection a mythic volume.
              </p>
            </div>
            
            <div>
              <h4 className="text-ui mb-6 text-foreground">Archive</h4>
              <ul className="space-y-3">
                <li><a href="/" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Library</a></li>
                <li><a href="/chronicle" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Chronicle</a></li>
                <li><a href="/vault" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Vault</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-ui mb-6 text-foreground">Information</h4>
              <ul className="space-y-3">
                <li><a href="/policies/shipping" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Shipping</a></li>
                <li><a href="/policies/returns" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Returns</a></li>
                <li><a href="/contact" className="text-body-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-meta">© MMXXV Fang & Fleece</span>
            <div className="flex items-center gap-6">
              <a href="/policies/privacy" className="text-meta text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="/policies/terms" className="text-meta text-muted-foreground hover:text-foreground transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </main>;
};
export default Library;