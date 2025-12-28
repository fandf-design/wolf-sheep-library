import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { useState } from "react";
import { isVolumeAccessible } from "@/lib/volume-access";
import { LockedVolumeModal } from "./LockedVolumeModal";

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
  const isAccessible = isVolumeAccessible(slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isAccessible) {
      e.preventDefault();
      setIsModalOpen(true);
    }
  };

  const spineContent = (
    <>
      {/* Volume Number */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <span className={`text-meta ${isAccessible ? 'text-accent/60' : 'text-muted-foreground/40'}`}>
          Volume {number}
        </span>
        {!isAccessible && (
          <Lock className="w-3 h-3 text-muted-foreground/40" />
        )}
      </div>

      {/* Locked Badge */}
      {!isAccessible && (
        <div className="absolute top-6 right-6">
          <span className="text-meta px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] uppercase tracking-wider">
            Locked
          </span>
        </div>
      )}

      {/* Decorative Line */}
      <div className={`absolute top-16 left-6 right-6 h-px bg-gradient-to-r ${
        isAccessible 
          ? 'from-border via-accent/20 to-transparent' 
          : 'from-border/50 via-muted-foreground/10 to-transparent'
      }`} />

      {/* Sigil/Symbol Area */}
      <div className={`absolute top-24 left-1/2 -translate-x-1/2 transition-opacity ${
        isAccessible 
          ? 'opacity-10 group-hover:opacity-20' 
          : 'opacity-5'
      }`}>
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" className={isAccessible ? 'text-accent' : 'text-muted-foreground'}>
          <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="30" cy="30" r="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="30" y1="2" x2="30" y2="58" stroke="currentColor" strokeWidth="0.5" />
          <line x1="2" y1="30" x2="58" y2="30" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-3">
        <h3 className={`text-display-md ${isAccessible ? 'text-foreground' : 'text-muted-foreground/60'}`}>
          {title}
        </h3>
        <p className={`text-body-sm leading-relaxed ${isAccessible ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
          {subtitle}
        </p>
        <div className="pt-4 border-t border-border/50">
          <span className={`text-meta ${isAccessible ? '' : 'text-muted-foreground/40'}`}>
            {tension}
          </span>
        </div>
      </div>

      {/* Hover Indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-px transition-colors ${
        isAccessible 
          ? 'bg-accent/0 group-hover:bg-accent/40' 
          : 'bg-transparent'
      }`} />
    </>
  );

  if (!isAccessible) {
    return (
      <>
        <div 
          onClick={handleClick}
          className="volume-spine group cursor-pointer flex-shrink-0 opacity-70 hover:opacity-80 transition-opacity"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {spineContent}
        </div>
        <LockedVolumeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          volumeTitle={title}
          volumeNumber={number}
        />
      </>
    );
  }

  return (
    <Link 
      to={`/volume/${slug}`}
      className="volume-spine group cursor-pointer flex-shrink-0"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {spineContent}
    </Link>
  );
};
