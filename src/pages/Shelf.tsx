import { Link } from "react-router-dom";

const Shelf = () => {
  // Mock data for a collector's shelf
  const collectedIssues = [
    {
      id: "1",
      title: "Alpha's Burden Overcoat",
      volume: "Dominion",
      role: "Wolf",
      purchaseDate: "March 2024",
      edition: "037/100"
    },
    {
      id: "2", 
      title: "The Yielding Knit",
      volume: "Dominion",
      role: "Sheep",
      purchaseDate: "April 2024",
      edition: "089/100"
    }
  ];

  const hasDualistBadge = collectedIssues.some(i => i.role === "Wolf") && 
                          collectedIssues.some(i => i.role === "Sheep");

  return (
    <main className="min-h-screen pt-16">
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
      <section className="py-12 px-6 md:px-12 border-b border-border bg-charcoal/10">
        <div className="max-w-4xl mx-auto">
          <span className="text-meta block mb-6">Distinctions</span>
          
          <div className="flex flex-wrap gap-4">
            {hasDualistBadge && (
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
            )}
            
            {!hasDualistBadge && (
              <div className="flex items-center gap-3 px-5 py-3 border border-border opacity-50">
                <div className="w-8 h-8 rounded-full border border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-muted-foreground">?</span>
                </div>
                <div>
                  <span className="text-ui text-muted-foreground block">Dualist</span>
                  <span className="text-meta text-muted-foreground">Collect Wolf & Sheep from same Volume</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-meta block mb-2">Collection</span>
              <h2 className="text-display-md">Acquired Issues</h2>
            </div>
            <span className="text-ui text-muted-foreground">{collectedIssues.length} Issues</span>
          </div>

          {collectedIssues.length > 0 ? (
            <div className="space-y-6">
              {collectedIssues.map((issue) => (
                <article 
                  key={issue.id}
                  className="group border border-border p-6 hover:border-accent/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-meta px-2 py-0.5 ${
                          issue.role === "Wolf" 
                            ? "bg-charcoal text-foreground" 
                            : "bg-bone/10 text-bone"
                        }`}>
                          {issue.role}
                        </span>
                        <span className="text-meta text-muted-foreground">Volume: {issue.volume}</span>
                      </div>
                      
                      <h3 className="text-display-md text-foreground">
                        {issue.title}
                      </h3>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-meta text-accent/60 block">Edition {issue.edition}</span>
                      <span className="text-meta text-muted-foreground">Acquired {issue.purchaseDate}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border border-border">
              <p className="text-body text-muted-foreground mb-6">
                Your shelf awaits its first artifact.
              </p>
              <Link to="/" className="link-archival">
                Enter the Library
              </Link>
            </div>
          )}
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
    </main>
  );
};

export default Shelf;
