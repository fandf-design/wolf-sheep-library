import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { ThemeProvider } from "@/hooks/use-theme";
import { WishlistProvider } from "@/hooks/use-wishlist";
import { VolumeGuard, ChapterGuard } from "@/components/guards/VolumeGuard";
import Library from "./pages/Library";
import Volume from "./pages/Volume";
import Chapter from "./pages/Chapter";
import Chronicle from "./pages/Chronicle";
import ChronicleEntry from "./pages/ChronicleEntry";
import Vault from "./pages/Vault";
import Shelf from "./pages/Shelf";
import SharedWishlist from "./pages/SharedWishlist";
import Product from "./pages/Product";
import Contact from "./pages/Contact";
import Policies from "./pages/Policies";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <WishlistProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipToContent />
            <Navigation />
            <div id="main-content">
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
                <Route path="/product/:handle" element={<Product />} />
                <Route path="/chronicle" element={<Chronicle />} />
                <Route path="/chronicle/:slug" element={<ChronicleEntry />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/shelf" element={<Shelf />} />
                <Route path="/shelf/wishlist/:token" element={<SharedWishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/policies/:type" element={<Policies />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </WishlistProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
