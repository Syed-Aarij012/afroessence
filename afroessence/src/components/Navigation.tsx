import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AdminNavigation } from "./AdminNavigation";
import { AdminLoginDialog } from "./AdminLoginDialog";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useTheme } from "@/components/ThemeProvider";

export const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { isAdmin, loading } = useAdminCheck();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show admin navigation if user is admin
  if (!loading && isAdmin) {
    return <AdminNavigation />;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/gallery", label: "Gallery" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold transform hover:scale-105 transition-transform duration-300">
            <span className="bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
              Adisco
            </span>{" "}
            <span className="text-accent drop-shadow-sm">Locs</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-foreground/80 hover:text-accent transition-all duration-300 transform hover:scale-105 group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-primary transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/bookings">
                  <Button variant="outline" className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                    My Bookings
                  </Button>
                </Link>
                <Button 
                  onClick={handleSignOut} 
                  variant="outline"
                  className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/booking">
              <Button className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-accent/25">
                Book Now
              </Button>
            </Link>
            <AdminLoginDialog />
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
            {navLinks.map((link, index) => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 text-foreground/80 hover:text-accent transition-all duration-300 transform hover:translate-x-2 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/bookings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full transform hover:scale-105 transition-all duration-300">
                    My Bookings
                  </Button>
                </Link>
                <Button 
                  onClick={() => { handleSignOut(); setMobileMenuOpen(false); }} 
                  variant="outline" 
                  className="w-full transform hover:scale-105 transition-all duration-300"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full transform hover:scale-105 transition-all duration-300">
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg">
                Book Now
              </Button>
            </Link>
            <div className="pt-2">
              <AdminLoginDialog />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
