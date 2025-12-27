import { Link } from "react-router-dom";

interface VolumeSpineProps {
  number: string;
  title: string;
  subtitle: string;
  tension: string;
  slug: string;
  index: number;
}

export const VolumeSpine = ({ 
  number, 
  title, 
  subtitle, 
  tension, 
  slug,
  index 
}: VolumeSpineProps) => {
  return (
    <Link 
      to={`/volume/${slug}`}
      className="volume-spine group cursor-pointer flex-shrink-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Volume Number */}
      <div className="absolute top-6 left-6">
        <span className="text-meta text-gold/60">Volume {number}</span>
      </div>

      {/* Decorative Line */}
      <div className="absolute top-16 left-6 right-6 h-px bg-gradient-to-r from-border via-gold/20 to-transparent" />

      {/* Sigil/Symbol Area */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className="text-gold">
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="2" x2="30" y2="58" stroke="currentColor" strokeWidth="0.5" />
          <line x1="2" y1="30" x2="58" y2="30" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <h3 className="text-display-md text-foreground">
          {title}
        </h3>
        <p className="text-body-sm text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
        <div className="pt-4 border-t border-border/50">
          <span className="text-meta">
            {tension}
          </span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/0 group-hover:bg-gold/40 transition-colors" />
    </Link>
  );
};
