import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const Gate = () => {
  const { session, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Laden…</div>;
  }
  if (!session) return <Login />;
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Gate />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
