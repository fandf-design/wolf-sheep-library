import { Link } from "react-router-dom";
import { chronicles } from "@/data/chronicles";

const Chronicle = () => {
  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Essays & Lore</span>
          <h1 className="text-display-xl mb-6">The Chronicle</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            Written words from the archive. Essays on mythology, craft, philosophy, 
            and the tensions that define us. Each piece is a thread in the larger tapestry.
          </p>
        </div>
      </section>

      {/* Chronicle List */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="stagger-children">
            {chronicles.map((chronicle) => (
              <article 
                key={chronicle.slug}
                className="group border-b border-border py-12 first:pt-0"
              >
                <Link to={`/chronicle/${chronicle.slug}`} className="block">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-meta text-gold/60">{chronicle.category}</span>
                    <span className="text-meta text-muted-foreground">•</span>
                    <span className="text-meta text-muted-foreground">{chronicle.date}</span>
                    <span className="text-meta text-muted-foreground">•</span>
                    <span className="text-meta text-muted-foreground">{chronicle.readTime}</span>
                  </div>
                  
                  <h2 className="text-display-md text-foreground group-hover:text-gold transition-colors mb-4">
                    {chronicle.title}
                  </h2>
                  
                  <p className="text-body text-muted-foreground leading-relaxed max-w-2xl">
                    {chronicle.excerpt}
                  </p>
                  
                  <span className="inline-block mt-6 text-ui text-muted-foreground group-hover:text-gold transition-colors">
                    Read Entry →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-24 px-6 md:px-12 border-t border-border bg-charcoal/20">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-meta block mb-4">Stay Informed</span>
          <h3 className="text-display-md mb-6">Receive New Entries</h3>
          <p className="text-body text-muted-foreground mb-8">
            When new essays are added to the Chronicle, receive them directly. 
            No noise. Only signal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-border px-4 py-3 text-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button className="px-6 py-3 bg-foreground text-background text-ui hover:bg-gold hover:text-background transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Chronicle;
