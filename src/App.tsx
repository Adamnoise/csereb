
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Standings from "./pages/Standings";
import Teams from "./pages/Teams";
import TeamDetailPage from "./pages/TeamDetailPage";
import HeadToHead from "./pages/HeadToHead";
import NotFound from "./pages/NotFound";
import VirtualFootballDashboard from "./components/VirtualFootballDashboard";
import NewSidebar from "./components/NewSidebar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NewSidebar />
        <main className="ml-64">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetailPage />} />
            <Route path="/head-to-head" element={<HeadToHead />} />
            <Route path="/virtual-football" element={<VirtualFootballDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
