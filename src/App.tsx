
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Generator from "./pages/Generator";
import Preview from "./pages/Preview";
import Kontakt from "./pages/Kontakt";
import Hilfe from "./pages/Hilfe";
import Admin from "./pages/Admin";
import PoemsLand from "./pages/PoemsLand";
import NotFound from "./pages/NotFound";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/hilfe" element={<Hilfe />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/poemsland" element={<PoemsLand />} />
          <Route path="/poemsland/:poemSlug" element={<PoemsLand />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
