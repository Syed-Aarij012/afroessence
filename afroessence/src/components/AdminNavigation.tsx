import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/components/ThemeProvider";

export const AdminNavigation = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/admin" className="text-2xl font-bold transform hover:scale-105 transition-transform duration-300">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Admin</span> 
            <span className="text-foreground">Panel</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="flex items-center gap-2 transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="transform hover:scale-110 transition-all duration-300 hover:bg-accent/10"
            >
              {theme === "light" ? 
                <Moon className="h-5 w-5 transition-all duration-300" /> : 
                <Sun className="h-5 w-5 transition-all duration-300" />
              }
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="transform hover:scale-110 transition-all duration-300"
            >
              {theme === "light" ? 
                <Moon className="h-5 w-5 transition-all duration-300" /> : 
                <Sun className="h-5 w-5 transition-all duration-300" />
              }
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="transform hover:scale-110 transition-all duration-300"
            >
              {mobileMenuOpen ? 
                <X className="h-5 w-5 transition-all duration-300" /> : 
                <Menu className="h-5 w-5 transition-all duration-300" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border/50 backdrop-blur-sm bg-background/95 animate-slide-in-up">
            <div className="py-2 text-foreground/60 text-sm bg-gradient-to-r from-muted/30 to-background/30 rounded-lg p-3">
              Admin Panel - Manage Users & Bookings
            </div>
            <Button 
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} 
              variant="outline" 
              className="w-full flex items-center gap-2 transform hover:scale-105 transition-all duration-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};