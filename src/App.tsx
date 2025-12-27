import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/layout/Navigation";
import { ThemeProvider } from "@/hooks/use-theme";
import Library from "./pages/Library";
import Volume from "./pages/Volume";
import Chapter from "./pages/Chapter";
import Chronicle from "./pages/Chronicle";
import Vault from "./pages/Vault";
import Shelf from "./pages/Shelf";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Library />} />
            <Route path="/volume/:slug" element={<Volume />} />
            <Route path="/volume/:volumeSlug/chapter/:chapterSlug" element={<Chapter />} />
            <Route path="/chronicle" element={<Chronicle />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/shelf" element={<Shelf />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
