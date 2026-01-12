import { useParams, Link, Navigate } from "react-router-dom";
import { getChronicleBySlug, chronicles } from "@/data/chronicles";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ChronicleEntry = () => {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? getChronicleBySlug(slug) : undefined;

  if (!entry) {
    return <Navigate to="/chronicle" replace />;
  }

  // Find adjacent entries for navigation
  const currentIndex = chronicles.findIndex(c => c.slug === slug);
  const prevEntry = currentIndex > 0 ? chronicles[currentIndex - 1] : null;
  const nextEntry = currentIndex < chronicles.length - 1 ? chronicles[currentIndex + 1] : null;

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-3xl mx-auto page-enter">
          {/* Back link: ink-based hover */}
          <Link 
            to="/chronicle" 
            className="inline-flex items-center gap-2 text-meta text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chronicle
          </Link>

          <div className="flex items-center gap-4 mb-6">
            {/* Category: muted, not gold */}
            <span className="text-meta text-muted-foreground">{entry.category}</span>
            <span className="text-meta text-muted-foreground/60">•</span>
            <span className="text-meta text-muted-foreground/60">{entry.date}</span>
            <span className="text-meta text-muted-foreground/60">•</span>
            <span className="text-meta text-muted-foreground/60">{entry.readTime}</span>
          </div>
          
          <h1 className="text-display-xl mb-6">{entry.title}</h1>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            {entry.content.map((paragraph, index) => (
              <p 
                key={index} 
                className="text-body text-foreground/90 leading-relaxed mb-6 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>

      {/* Navigation */}
      <section className="py-16 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-start gap-8">
            {/* Prev/Next: ink-based hover, not gold */}
            {prevEntry ? (
              <Link 
                to={`/chronicle/${prevEntry.slug}`}
                className="group flex-1"
              >
                <span className="text-meta text-muted-foreground mb-2 block">Previous</span>
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-body text-foreground/80 group-hover:text-foreground transition-colors">
                    {prevEntry.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextEntry ? (
              <Link 
                to={`/chronicle/${nextEntry.slug}`}
                className="group flex-1 text-right"
              >
                <span className="text-meta text-muted-foreground mb-2 block">Next</span>
                <div className="flex items-center justify-end gap-2">
                  <span className="text-body text-foreground/80 group-hover:text-foreground transition-colors">
                    {nextEntry.title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ChronicleEntry;
