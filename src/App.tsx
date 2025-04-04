
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Preview from "./pages/Preview";
import Kontakt from "./pages/Kontakt";
import Hilfe from "./pages/Hilfe";
import Admin from "./pages/Admin";
import PoemsLand from "./pages/PoemsLand";
import NotFound from "./pages/NotFound";
import { LanguageProvider } from "./contexts/LanguageContext";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              {/* German routes (default) */}
              <Route path="/" element={<Index />} />
              <Route path="/generator" element={<Generator />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/kontakt" element={<Kontakt />} />
              <Route path="/hilfe" element={<Hilfe />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/poemsland" element={<PoemsLand />} />
              <Route path="/poemsland/:poemSlug" element={<PoemsLand />} />
              
              {/* English routes (these will be the same components with different language context) */}
              <Route path="/en" element={<Index />} />
              <Route path="/en/generator" element={<Generator />} />
              <Route path="/en/preview" element={<Preview />} />
              <Route path="/en/contact" element={<Kontakt />} />
              <Route path="/en/help" element={<Hilfe />} />
              <Route path="/en/admin" element={<Admin />} />
              <Route path="/en/poemsland" element={<PoemsLand />} />
              <Route path="/en/poemsland/:poemSlug" element={<PoemsLand />} />
              
              {/* Not Found route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
