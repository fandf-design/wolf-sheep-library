import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { ThemeProvider } from "@/hooks/use-theme";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { CartProvider } from "@/hooks/use-cart";
import { VolumeGuard, ChapterGuard } from "@/components/guards/VolumeGuard";
import Library from "./pages/Library";
import Volume from "./pages/Volume";
import Chapter from "./pages/Chapter";
import Chronicle from "./pages/Chronicle";
import ChronicleEntry from "./pages/ChronicleEntry";
import Vault from "./pages/Vault";
import Shelf from "./pages/Shelf";
import SharedWishlist from "./pages/SharedWishlist";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navigation />
              <Routes>
                <Route path="/" element={<Library />} />
                <Route 
                  path="/volume/:slug" 
                  element={
                    <VolumeGuard>
                      <Volume />
                    </VolumeGuard>
                  } 
                />
                <Route 
                  path="/volume/:volumeSlug/chapter/:chapterSlug" 
                  element={
                    <ChapterGuard>
                      <Chapter />
                    </ChapterGuard>
                  } 
                />
                <Route path="/chronicle" element={<Chronicle />} />
                <Route path="/chronicle/:slug" element={<ChronicleEntry />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/shelf" element={<Shelf />} />
                <Route path="/shelf/wishlist/:token" element={<SharedWishlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
