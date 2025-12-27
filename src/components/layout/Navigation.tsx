import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Library", path: "/" },
  { label: "Chronicle", path: "/chronicle" },
  { label: "Vault", path: "/vault" },
];

export const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav className="flex items-center justify-between px-6 md:px-12 h-16">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group"
        >
          <div className="flex items-center">
            <span className="text-display text-lg tracking-wider text-foreground">
              FANG
            </span>
            <span className="mx-2 text-gold opacity-60">&</span>
            <span className="text-display text-lg tracking-wider text-foreground">
              FLEECE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`link-archival ${
                location.pathname === item.path ? "text-foreground" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Account & Theme Toggle */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/shelf" className="link-archival">
            Shelf
          </Link>
          <button className="text-ui text-muted-foreground hover:text-foreground transition-colors">
            Account
          </button>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-px bg-foreground transition-transform ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-5 h-px bg-foreground transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
          <span className={`w-5 h-px bg-foreground transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-fade-in">
          <div className="flex flex-col p-6 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-ui ${
                  location.pathname === item.path 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-border pt-6 flex flex-col gap-4">
              <Link to="/shelf" onClick={() => setIsMenuOpen(false)} className="text-ui text-muted-foreground">
                Shelf
              </Link>
              <button className="text-ui text-muted-foreground text-left">
                Account
              </button>
              <div className="pt-2">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
