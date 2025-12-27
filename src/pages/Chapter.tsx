import { useParams, Link } from "react-router-dom";
import { volumes, Issue } from "@/data/volumes";

// Sample issues for demonstration
const sampleIssues: Issue[] = [
  {
    id: "alpha-coat-001",
    title: "Alpha's Burden Overcoat",
    story: "Forged for shoulders that carry more than fabric. This overcoat was designed in the depths of winter, when the studio was silent and the weight of leadership felt heaviest. Every stitch carries the tension of decisions made alone.",
    fabricNotes: "Heavy wool-cashmere blend from Scottish highlands. Lined with silk charmeuse that whispers against movement.",
    craftsmanship: "Hand-finished buttonholes. Horn buttons sourced from ethical farms. Each coat requires 40 hours of construction.",
    edition: "037/100",
    material: "Wool-Cashmere Blend",
    role: "Wolf",
    status: "Low Stock",
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
    edition: "Open Edition",
    material: "Fine Merino Wool",
    role: "Sheep",
    status: "Circulating",
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
    edition: "Limited — 24hr Drop",
    material: "Mulberry Silk",
    role: "Wolf",
    status: "Vaulted",
    price: 680,
    images: [],
    chapterSlug: "the-hunt"
  }
];

const Chapter = () => {
  const { volumeSlug, chapterSlug } = useParams();
  
  const volume = volumes.find(v => v.slug === volumeSlug);
  const chapter = volume?.chapters.find(c => c.slug === chapterSlug);
  const issues = sampleIssues.filter(i => i.chapterSlug === chapterSlug);

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

  return (
    <main className="min-h-screen pt-16">
      {/* Chapter Header */}
      <section className="relative min-h-[60vh] flex items-center justify-center border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-background to-background" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto page-enter">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link to="/" className="text-meta text-muted-foreground hover:text-gold transition-colors">
              Library
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <Link to={`/volume/${volume.slug}`} className="text-meta text-muted-foreground hover:text-gold transition-colors">
              {volume.title}
            </Link>
            <span className="text-meta text-muted-foreground mx-3">/</span>
            <span className="text-meta text-gold/60">Chapter {String(chapterIndex + 1).padStart(2, "0")}</span>
          </div>

          <span className={`inline-block text-meta px-3 py-1 mb-6 ${
            chapter.status === "published" 
              ? "bg-charcoal text-foreground"
              : chapter.status === "upcoming"
              ? "border border-gold/30 text-gold/80"
              : "border border-muted-foreground/30 text-muted-foreground"
          }`}>
            {chapter.status === "out-of-print" ? "Out of Print" : chapter.status}
          </span>

          <h1 className="text-display-xl mb-4">
            {chapter.title}
          </h1>
          
          <p className="text-body text-xl text-muted-foreground italic mb-6">
            {chapter.tagline}
          </p>
          
          <span className="text-meta text-muted-foreground">{chapter.timestamp}</span>
        </div>
      </section>

      {/* Narrative */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <span className="text-meta block mb-6">Narrative Arc</span>
          <p className="text-body text-lg text-foreground/90 leading-relaxed mb-12">
            {chapter.narrativeArc}
          </p>
          
          <div className="border-l-2 border-gold/30 pl-6">
            <span className="text-meta text-gold/60 block mb-2">Drop Logic</span>
            <p className="text-body text-muted-foreground">
              {chapter.dropLogic}
            </p>
          </div>
        </div>
      </section>

      {/* Issues */}
      {issues.length > 0 && (
        <section className="py-24 px-6 md:px-12 border-t border-border">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16">
              <span className="text-meta block mb-2">Artifacts</span>
              <h2 className="text-display-md">Issues</h2>
            </div>

            <div className="space-y-16">
              {issues.map((issue) => (
                <article key={issue.id} className="group">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Placeholder */}
                    <div className="aspect-[3/4] bg-charcoal/50 border border-border flex items-center justify-center">
                      <span className="text-meta text-muted-foreground">Editorial Image</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-meta px-2 py-0.5 ${
                          issue.role === "Wolf" 
                            ? "bg-charcoal text-foreground" 
                            : "bg-bone/10 text-bone"
                        }`}>
                          {issue.role}
                        </span>
                        <span className={`${
                          issue.status === "Circulating" ? "status-circulating" :
                          issue.status === "Low Stock" ? "status-low-stock" :
                          "status-vaulted"
                        }`}>
                          {issue.status}
                        </span>
                      </div>
                      
                      <h3 className="text-display-md text-foreground mb-4">
                        {issue.title}
                      </h3>
                      
                      <p className="text-body text-muted-foreground leading-relaxed mb-6">
                        {issue.story}
                      </p>
                      
                      {/* Metadata */}
                      <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-border mb-6">
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
                      {issue.status !== "Vaulted" ? (
                        <div className="flex items-center justify-between">
                          <span className="text-display text-xl text-foreground">
                            ${issue.price.toLocaleString()}
                          </span>
                          <button className="px-8 py-3 bg-foreground text-background text-ui hover:bg-gold transition-colors">
                            {issue.status === "Pre-Order" ? "Pre-Order" : "Acquire"}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-body text-muted-foreground italic">
                            This issue has entered the Vault
                          </span>
                          <Link to="/vault" className="text-ui text-gold/80 hover:text-gold transition-colors">
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
      <section className="py-16 px-6 md:px-12 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <Link 
            to={`/volume/${volume.slug}`}
            className="inline-flex items-center gap-2 text-ui text-muted-foreground hover:text-gold transition-colors"
          >
            <span>←</span>
            <span>Back to {volume.title}</span>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Chapter;
