import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Type-safe supabase client wrapper
const db = supabase as any;
import { User } from "@supabase/supabase-js";
import { Calendar, Clock, Scissors, User as UserIcon } from "lucide-react";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D, InteractiveCard } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";

// Helper function to format date for display (avoids timezone issues)
const formatDateForDisplay = (dateString: string) => {
  // dateString is in YYYY-MM-DD format
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  services: { name: string };
  professionals: { name: string };
}

const MyBookings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      loadBookings();
      
      // Set up real-time subscription for user's bookings
      const bookingsSubscription = supabase
        .channel('my-bookings-changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'bookings',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('My booking changed:', payload);
            // Reload bookings when user's bookings change
            loadBookings();
          }
        )
        .subscribe();

      return () => {
        bookingsSubscription.unsubscribe();
      };
    }
  }, [user]);

  const loadBookings = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // First, get the bookings without joins
      const { data: bookingsData, error: bookingsError } = await db
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("booking_date", { ascending: false });

      if (bookingsError) {
        console.error("Failed to load bookings:", bookingsError);
        setLoading(false);
        return;
      }

      console.log("Raw bookings data:", bookingsData);

      // Then get sub-services, primary services, categories and professionals separately
      const { data: subServicesData } = await db
        .from("sub_services")
        .select("id, name, price, primary_service_id");

      const { data: primaryServicesData } = await db
        .from("primary_services")
        .select("id, name, category_id");

      const { data: categoriesData } = await db
        .from("service_categories")
        .select("id, name");

      const { data: professionalsData } = await db
        .from("professionals")
        .select("id, name");

      console.log("MyBookings - Loaded data:", {
        subServices: subServicesData?.length,
        primaryServices: primaryServicesData?.length,
        categories: categoriesData?.length,
        professionals: professionalsData?.length
      });

      // Combine the data manually
      const enrichedBookings = (bookingsData || []).map((booking: any) => {
        // Look for sub_service_id first (new system), then fall back to service_id (old system)
        const serviceId = booking.sub_service_id || booking.service_id;
        const subService = subServicesData?.find((s: any) => s.id === serviceId);
        
        let serviceName = "Unknown Service";
        
        if (subService) {
          // Get primary service and category for full name
          const primaryService = primaryServicesData?.find((p: any) => p.id === subService.primary_service_id);
          const category = categoriesData?.find((c: any) => c.id === primaryService?.category_id);
          
          serviceName = `${subService.name}`;
          if (primaryService) {
            serviceName = `${primaryService.name} - ${subService.name}`;
          }
          if (category) {
            serviceName = `${category.name}: ${primaryService?.name || ''} - ${subService.name}`;
          }
        }
        
        const professional = professionalsData?.find((p: any) => p.id === booking.professional_id);
        
        return {
          ...booking,
          services: { name: serviceName },
          professionals: { name: professional?.name || "Unknown Professional" }
        };
      });

      console.log("Enriched bookings:", enrichedBookings);
      setBookings(enrichedBookings);
    } catch (err) {
      console.error("Exception loading bookings:", err);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-accent/10 text-accent border-accent/20";
      case "completed":
        return "bg-accent/20 text-accent border-accent/30";
      case "cancelled":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-accent/5 text-accent border-accent/10";
    }
  };

  if (loading) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <ParticleBackground />
          <FloatingElement>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
              </div>
              <p className="text-muted-foreground text-lg">Loading your bookings...</p>
            </div>
          </FloatingElement>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={350} className="top-20 right-10 opacity-15" />
        <GradientOrb size={250} color="primary" className="bottom-20 left-20 opacity-15" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FloatingElement delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                My Bookings
              </h1>
            </FloatingElement>

            {bookings.length === 0 ? (
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardContent className="pt-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                      <Scissors className="h-8 w-8 text-accent" />
                    </div>
                    <p className="text-muted-foreground mb-4 text-lg">You don't have any bookings yet.</p>
                    <a href="/booking" className="text-accent hover:text-primary transition-colors duration-300 font-medium">
                      Book your first appointment
                    </a>
                  </CardContent>
                </Card3D>
              </FloatingElement>
            ) : (
              <div className="space-y-6">
                {bookings.map((booking, index) => (
                  <FloatingElement key={booking.id} delay={index * 0.1}>
                    <Card3D className="backdrop-blur-sm bg-card/90">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl group-hover:text-accent transition-colors duration-300">
                            {booking.services.name}
                          </CardTitle>
                          <Badge className={`${getStatusColor(booking.status)} transform group-hover:scale-105 transition-transform duration-300`}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-background/30 backdrop-blur-sm">
                            <div className="p-2 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Date</p>
                              <span className="font-medium">{formatDateForDisplay(booking.booking_date)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-background/30 backdrop-blur-sm">
                            <div className="p-2 rounded-full bg-gradient-to-br from-green-500/20 to-teal-600/20">
                              <Clock className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Time</p>
                              <span className="font-medium">{booking.booking_time.substring(0, 5)}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-background/30 backdrop-blur-sm">
                            <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-red-600/20">
                              <UserIcon className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground uppercase tracking-wide">Professional</p>
                              <span className="font-medium">{booking.professionals.name}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card3D>
                  </FloatingElement>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default MyBookings;
