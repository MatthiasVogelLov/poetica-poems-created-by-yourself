
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

// English Pages
import EnIndex from "./pages/en/Index";
import EnGenerator from "./pages/en/Generator";
import EnPreview from "./pages/en/Preview";
import EnContact from "./pages/en/Contact";
import EnHelp from "./pages/en/Help";
import EnPoemsLand from "./pages/en/PoemsLand";

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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* German Routes (Original) */}
            <Route path="/" element={<Index />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/preview" element={<Preview />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/hilfe" element={<Hilfe />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/poemsland" element={<PoemsLand />} />
            <Route path="/poemsland/:poemSlug" element={<PoemsLand />} />
            
            {/* English Routes */}
            <Route path="/en" element={<EnIndex />} />
            <Route path="/en/generator" element={<EnGenerator />} />
            <Route path="/en/preview" element={<EnPreview />} />
            <Route path="/en/contact" element={<EnContact />} />
            <Route path="/en/help" element={<EnHelp />} />
            <Route path="/en/poemsland" element={<EnPoemsLand />} />
            <Route path="/en/poemsland/:poemSlug" element={<EnPoemsLand />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
