import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchOverlay } from "./SearchOverlay";
import { CartSheet } from "./CartSheet";
import { useCart } from "@/hooks/use-cart";

const navItems = [{
  label: "Library",
  path: "/"
}, {
  label: "Chronicle",
  path: "/chronicle"
}, {
  label: "Vault",
  path: "/vault"
}];

export const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { count: cartCount } = useCart();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <nav className="flex items-center justify-between px-6 md:px-12 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center">
              <span className="text-display text-lg tracking-wider text-foreground">
                FANG
              </span>
              <span className="mx-2 opacity-60 text-accent">&</span>
              <span className="text-display text-lg tracking-wider text-foreground">
                FLEECE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`link-archival ${location.pathname === item.path ? "text-foreground" : item.label === "Library" ? "text-muted-foreground/90" : "text-muted-foreground/70"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/shelf" className="link-archival opacity-70">
              Shelf
            </Link>
            <button
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-muted-foreground/60 hover:text-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="flex flex-col gap-1.5 p-2" 
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-px bg-foreground transition-transform ${isMenuOpen ? "rotate-45 translate-y-1" : ""}`} />
              <span className={`w-5 h-px bg-foreground transition-opacity ${isMenuOpen ? "opacity-0" : ""}`} />
              <span className={`w-5 h-px bg-foreground transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border animate-fade-in">
            <div className="flex flex-col p-6 gap-6">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)} 
                  className={`text-ui ${location.pathname === item.path ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-border pt-6 flex flex-col gap-4">
                <Link to="/shelf" onClick={() => setIsMenuOpen(false)} className="text-ui text-muted-foreground">
                  Shelf
                </Link>
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Overlay */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart Sheet */}
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};