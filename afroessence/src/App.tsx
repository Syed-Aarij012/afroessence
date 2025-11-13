import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/AdminLayout";
import { ThemeProvider } from "@/components/ThemeProvider";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import Home from "./pages/Home";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import WhiteCard from "./pages/WhiteCard";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Admin-only routes and layout
  if (isAdmin) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="*" element={<Admin />} />
        </Routes>
      </AdminLayout>
    );
  }

  // Regular user routes and layout
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/white-card" element={<WhiteCard />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Auth />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="salon-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
