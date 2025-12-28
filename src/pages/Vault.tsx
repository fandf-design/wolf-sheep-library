import { useState } from "react";
import { IssueStatusBadge } from "@/components/issue";

interface VaultedIssue {
  id: string;
  title: string;
  volume: string;
  chapter: string;
  year: string;
  votes: number;
  hasVoted: boolean;
}

const vaultedIssues: VaultedIssue[] = [
  {
    id: "v1",
    title: "The First Fangs Coat",
    volume: "Volume I: Dominion",
    chapter: "The Alpha Principle",
    year: "2023",
    votes: 847,
    hasVoted: false
  },
  {
    id: "v2",
    title: "Omega Knit Shroud",
    volume: "Volume I: Dominion",
    chapter: "The Omega Rest",
    year: "2023",
    votes: 623,
    hasVoted: false
  },
  {
    id: "v3",
    title: "Predator's Silk",
    volume: "Volume II: Appetite",
    chapter: "The Hunt",
    year: "2024",
    votes: 1203,
    hasVoted: false
  },
  {
    id: "v4",
    title: "Midnight Wanderer Cloak",
    volume: "Volume III: Nocturne",
    chapter: "Solitary Passage",
    year: "2024",
    votes: 456,
    hasVoted: false
  },
  {
    id: "v5",
    title: "The Deception Vest",
    volume: "Volume IV: Masquerade",
    chapter: "False Alarms",
    year: "2024",
    votes: 892,
    hasVoted: false
  }
];

const Vault = () => {
  const [issues, setIssues] = useState(vaultedIssues);

  const handleVote = (id: string) => {
    setIssues(issues.map(issue => 
      issue.id === id 
        ? { ...issue, votes: issue.hasVoted ? issue.votes - 1 : issue.votes + 1, hasVoted: !issue.hasVoted }
        : issue
    ));
  };

  return (
    <main className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-24 px-6 md:px-12 border-b border-border">
        <div className="max-w-4xl mx-auto page-enter">
          <span className="text-meta block mb-6">Archive of the Inaccessible</span>
          <h1 className="text-display-xl mb-6">The Vault</h1>
          <p className="text-body text-lg text-muted-foreground max-w-2xl">
            Issues that have passed from circulation. Greyed, holographic, no longer available.
            Cast your vote to petition for their return. The most requested may be reprinted.
          </p>
        </div>
      </section>

      {/* Vault Grid */}
      <section className="py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-children">
            {issues.map((issue) => (
              <article 
                key={issue.id}
                className="group relative border border-border p-8 bg-gradient-to-br from-charcoal/30 to-transparent opacity-70 hover:opacity-100 transition-opacity"
              >
                {/* Holographic Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                {/* Vaulted Badge - using unified component */}
                <div className="absolute top-4 right-4">
                  <IssueStatusBadge status="vaulted" />
                </div>

                <div className="relative z-10">
                  <span className="text-meta text-muted-foreground block mb-2">{issue.year}</span>
                  
                  <h3 className="text-display-md text-foreground/60 group-hover:text-foreground/80 transition-colors mb-3">
                    {issue.title}
                  </h3>
                  
                  <div className="space-y-1 mb-6">
                    <p className="text-body-sm text-muted-foreground">{issue.volume}</p>
                    <p className="text-body-sm text-muted-foreground">{issue.chapter}</p>
                  </div>

                  {/* Vote Section - NO CTA for vaulted, only vote for reprint petition */}
                  <div className="flex items-center justify-between pt-6 border-t border-border/50">
                    <div>
                      <span className="text-meta text-muted-foreground">Reprint Votes</span>
                      <span className="text-display text-xl ml-3 text-accent/80">{issue.votes.toLocaleString()}</span>
                    </div>
                    
                    <button
                      onClick={() => handleVote(issue.id)}
                      className={`px-4 py-2 text-ui transition-all ${
                        issue.hasVoted 
                          ? "bg-accent/20 text-accent border border-accent/30" 
                          : "bg-transparent border border-border text-muted-foreground hover:border-accent/50 hover:text-foreground"
                      }`}
                    >
                      {issue.hasVoted ? "Voted" : "Vote"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vault Information */}
      <section className="py-24 px-6 md:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-display-md mb-6">The Reprint Protocol</h3>
          <p className="text-body text-muted-foreground leading-relaxed mb-8">
            When a vaulted Issue reaches sufficient demand, we consider its return. 
            Reprints are never exact—each return carries marks of its time in the vault. 
            New materials, altered construction, evolved mythology.
          </p>
          <p className="text-body-sm text-muted-foreground/60 italic">
            "That which returns is never quite what left."
          </p>
        </div>
      </section>
    </main>
  );
};

export default Vault;