import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

// Type-safe supabase client wrapper
const db = supabase as any;
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  User as UserIcon, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Star,
  MapPin,
  Briefcase
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { AnimatedBackground, ParallaxSection } from "@/components/3D/AnimatedBackground";
import { AdminCalendar } from "@/components/AdminCalendar";

interface Booking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  notes: string;
  user_id: string;
  created_at: string;
  service_id?: string;
  professional_id?: string;
  services: { id?: string; name: string; price: number };
  professionals: { id?: string; name: string };
  profiles: { full_name: string; phone: string; email?: string };
}

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  created_at: string;
  total_bookings: number;
  total_spent: number;
  last_booking: string;
}

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration_minutes?: number;
  is_active: boolean;
  created_at: string;
}

interface Professional {
  id: string;
  name: string;
  title?: string;
  is_active: boolean;
}

interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingBookings: number;
  todayBookings: number;
  monthlyRevenue: number;
}

const ModernAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    todayBookings: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [editingServicePrice, setEditingServicePrice] = useState<string>("");
  const [editingServiceName, setEditingServiceName] = useState<string>("");
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingBookingData, setEditingBookingData] = useState<{
    booking_date: string;
    booking_time: string;
    service_id: string;
    professional_id: string;
  } | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/auth");
      return;
    }

    setUser(session.user);

    // Check if user is admin
    const { data: roleData } = await db
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      toast.error("You don't have admin access");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    loadDashboardData();
  };

  const loadDashboardData = async () => {
    setLoading(true);
    await Promise.all([
      loadBookings(),
      loadUsers(),
      loadServices(),
      loadProfessionals(),
      loadStats()
    ]);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      // Get total users
      const { count: userCount } = await db
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get total bookings
      const { count: bookingCount } = await db
        .from("bookings")
        .select("*", { count: "exact", head: true });

      // Get pending bookings
      const { count: pendingCount } = await db
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // Get today's bookings
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await db
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("booking_date", today);

      // Get revenue data - ONLY from completed bookings
      const { data: completedBookings } = await db
        .from("bookings")
        .select("service_id, created_at")
        .eq("status", "completed");

      // Get all services to calculate prices
      const { data: servicesData } = await db
        .from("services")
        .select("id, price");

      console.log("Completed bookings for revenue:", completedBookings?.length);
      console.log("Services data:", servicesData?.length);

      // Calculate total revenue
      const totalRevenue = completedBookings?.reduce((sum, booking) => {
        const service = servicesData?.find((s: any) => s.id === booking.service_id);
        const price = service?.price || 0;
        console.log(`Adding ${price} to revenue for booking ${booking.service_id}`);
        return sum + price;
      }, 0) || 0;

      // Calculate monthly revenue (current month) - ONLY from completed bookings
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = completedBookings?.reduce((sum, booking) => {
        const bookingDate = new Date(booking.created_at);
        if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
          const service = servicesData?.find((s: any) => s.id === booking.service_id);
          return sum + (service?.price || 0);
        }
        return sum;
      }, 0) || 0;

      console.log("Total revenue calculated:", totalRevenue);
      console.log("Monthly revenue calculated:", monthlyRevenue);

      setStats({
        totalUsers: userCount || 0,
        totalBookings: bookingCount || 0,
        totalRevenue,
        pendingBookings: pendingCount || 0,
        todayBookings: todayCount || 0,
        monthlyRevenue,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadBookings = async () => {
    try {
      // Load bookings without joins to avoid 400 error
      const { data: bookingsData, error: bookingsError } = await db
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });

      if (bookingsError) {
        toast.error("Failed to load bookings");
        console.error("Bookings error:", bookingsError);
        return;
      }

      // Load services and professionals separately
      const { data: servicesData } = await db
        .from("services")
        .select("id, name, price");

      const { data: professionalsData } = await db
        .from("professionals")
        .select("id, name");

      const { data: profilesData } = await db
        .from("profiles")
        .select("id, full_name, phone, email");

      console.log("Admin - Loaded data:", {
        bookings: bookingsData?.length,
        services: servicesData?.length,
        professionals: professionalsData?.length,
        profiles: profilesData?.length
      });

      // Combine data manually
      const enrichedBookings = (bookingsData || []).map((booking: any) => {
        const service = servicesData?.find((s: any) => s.id === booking.service_id);
        const professional = professionalsData?.find((p: any) => p.id === booking.professional_id);
        const profile = profilesData?.find((pr: any) => pr.id === booking.user_id);
        
        return {
          ...booking,
          services: { 
            id: service?.id,
            name: service?.name || "Unknown Service",
            price: service?.price || 0
          },
          professionals: { 
            id: professional?.id,
            name: professional?.name || "Unknown Professional" 
          },
          profiles: {
            full_name: profile?.full_name || "Unknown Customer",
            phone: profile?.phone || "",
            email: profile?.email || ""
          }
        };
      });

      console.log("Admin - Enriched bookings:", enrichedBookings);
      setBookings(enrichedBookings);
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error("Exception loading bookings:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await db
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Load all bookings and services separately
      const { data: allBookings } = await db
        .from("bookings")
        .select("id, user_id, booking_date, service_id, status");

      const { data: servicesData } = await db
        .from("services")
        .select("id, price");

      console.log("Admin - User stats data:", {
        profiles: profiles?.length,
        bookings: allBookings?.length,
        services: servicesData?.length
      });

      const usersWithStats = (profiles || []).map((profile: any) => {
        // Get bookings for this user
        const userBookings = allBookings?.filter((b: any) => 
          b.user_id === profile.id && b.status !== "cancelled"
        ) || [];

        const totalBookings = userBookings.length;
        
        // Calculate total spent
        const totalSpent = userBookings.reduce((sum: number, booking: any) => {
          const service = servicesData?.find((s: any) => s.id === booking.service_id);
          return sum + (service?.price || 0);
        }, 0);

        // Find last booking date
        const lastBooking = userBookings.length > 0 
          ? Math.max(...userBookings.map((b: any) => new Date(b.booking_date).getTime()))
          : null;

        return {
          id: profile.id,
          full_name: profile.full_name || "Unknown",
          phone: profile.phone || "Not provided",
          email: profile.email || "Not provided",
          created_at: profile.created_at,
          total_bookings: totalBookings,
          total_spent: totalSpent,
          last_booking: lastBooking ? new Date(lastBooking).toISOString() : "Never"
        };
      });

      console.log("Admin - Users with stats:", usersWithStats);
      setUsers(usersWithStats);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load user data");
    }
  };

  const loadServices = async () => {
    try {
      const { data, error } = await db
        .from("services")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Failed to load services:", error);
      toast.error("Failed to load services");
    }
  };

  const loadProfessionals = async () => {
    try {
      const { data, error } = await db
        .from("professionals")
        .select("*")
        .order("name");

      if (error) throw error;
      // Filter out "Any professional" from the list
      const filteredProfessionals = (data || []).filter(
        (prof: any) => prof.name.toLowerCase() !== "any professional"
      );
      setProfessionals(filteredProfessionals);
    } catch (error) {
      console.error("Failed to load professionals:", error);
      toast.error("Failed to load professionals");
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    // Find the booking to get its price for the toast message
    const booking = bookings.find(b => b.id === bookingId);
    const bookingPrice = booking?.services?.price || 0;
    
    const { error } = await db
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      toast.error("Failed to update booking status");
      console.error(error);
    } else {
      // Show success message with price if completing
      if (newStatus === "completed") {
        toast.success(`Booking completed! £${bookingPrice.toFixed(2)} added to revenue 💰`);
      } else {
        toast.success(`Booking ${newStatus} successfully`);
      }
      
      // Reload both bookings and stats to get updated data from database
      await Promise.all([loadBookings(), loadStats()]);
    }
  };

  const deleteBooking = async (bookingId: string) => {
    // Confirm before deleting
    if (!confirm("Are you sure you want to remove this booking? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await db
        .from("bookings")
        .delete()
        .eq("id", bookingId);

      if (error) {
        toast.error("Failed to remove booking");
        console.error("Delete booking error:", error);
        return;
      }

      toast.success("Booking removed successfully");
      // Reload bookings and stats
      await Promise.all([loadBookings(), loadStats()]);
    } catch (error) {
      toast.error("Failed to remove booking");
      console.error("Exception deleting booking:", error);
    }
  };

  const startEditBooking = (booking: Booking) => {
    setEditingBookingId(booking.id);
    // Format time to HH:MM for the input field (remove seconds if present)
    const timeForInput = booking.booking_time.substring(0, 5);
    setEditingBookingData({
      booking_date: booking.booking_date,
      booking_time: timeForInput,
      service_id: booking.service_id || booking.services?.id || "",
      professional_id: booking.professional_id || booking.professionals?.id || "",
    });
  };

  const cancelEditBooking = () => {
    setEditingBookingId(null);
    setEditingBookingData(null);
  };

  const saveBookingChanges = async () => {
    if (!editingBookingId || !editingBookingData) return;

    // Validate the data
    if (!editingBookingData.booking_date || !editingBookingData.booking_time || 
        !editingBookingData.service_id || !editingBookingData.professional_id) {
      toast.error("Please fill in all fields");
      console.log("Validation failed:", editingBookingData);
      return;
    }

    try {
      // Ensure time is in HH:MM:SS format
      let formattedTime = editingBookingData.booking_time;
      if (formattedTime.length === 5) {
        // If time is HH:MM, add :00 for seconds
        formattedTime = `${formattedTime}:00`;
      }

      console.log("Updating booking with data:", {
        booking_id: editingBookingId,
        booking_date: editingBookingData.booking_date,
        booking_time: formattedTime,
        service_id: editingBookingData.service_id,
        professional_id: editingBookingData.professional_id,
      });

      const { data, error } = await db
        .from("bookings")
        .update({
          booking_date: editingBookingData.booking_date,
          booking_time: formattedTime,
          service_id: editingBookingData.service_id,
          professional_id: editingBookingData.professional_id
        })
        .eq("id", editingBookingId)
        .select();

      if (error) {
        toast.error(`Update failed: ${error.message}`);
        console.error("Booking update error details:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        return;
      }

      console.log("Booking updated successfully:", data);
      toast.success("Booking updated! Changes synced to user's bookings.");
      setEditingBookingId(null);
      setEditingBookingData(null);
      // Refresh bookings list to show updated data
      await loadBookings();
    } catch (error: any) {
      toast.error(`Failed to update booking: ${error?.message || 'Unknown error'}`);
      console.error("Exception updating booking:", error);
    }
  };

  const startEditService = (service: ServiceItem) => {
    setEditingServiceId(service.id);
    setEditingServicePrice(String(service.price));
    setEditingServiceName(service.name);
  };

  const cancelEditService = () => {
    setEditingServiceId(null);
    setEditingServicePrice("");
    setEditingServiceName("");
  };

  const saveServiceChanges = async () => {
    if (!editingServiceId) {
      toast.error("No service selected for editing");
      return;
    }
    
    const parsedPrice = Number(editingServicePrice);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Enter a valid non-negative price");
      return;
    }

    if (!editingServiceName.trim()) {
      toast.error("Service name cannot be empty");
      return;
    }

    try {
      console.log("Updating service:", {
        id: editingServiceId,
        name: editingServiceName.trim(),
        price: parsedPrice
      });

      // Try updating with minimal fields first
      const updateData: any = {
        price: parsedPrice,
        name: editingServiceName.trim()
      };

      console.log("Update data:", updateData);

      const { data, error } = await supabase
        .from("services")
        .update(updateData)
        .eq("id", editingServiceId)
        .select();

      if (error) {
        console.error("Service update error details:", {
          error,
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        
        // Show more specific error message
        if (error.code === '42501') {
          toast.error("Permission denied. Please check admin access.");
        } else if (error.code === '23505') {
          toast.error("A service with this name already exists.");
        } else {
          toast.error(`Update failed: ${error.message}`);
        }
        return;
      }

      console.log("Service updated successfully:", data);
      toast.success("Service updated successfully!");
      setEditingServiceId(null);
      setEditingServicePrice("");
      setEditingServiceName("");
      await loadServices(); // Refresh services list
    } catch (error: any) {
      console.error("Exception updating service:", error);
      toast.error(`Update failed: ${error?.message || 'Unknown error'}`);
    }
  };

  const toggleServiceStatus = async (serviceId: string, currentStatus: boolean) => {
    try {
      const { error } = await db
        .from("services")
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", serviceId);

      if (error) {
        toast.error("Failed to update service status");
        console.error("Service status update error:", error);
        return;
      }

      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadServices(); // Refresh services list
    } catch (error) {
      toast.error("Failed to update service status");
      console.error("Exception updating service status:", error);
    }
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <Star className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filterBookings = () => {
    let filtered = bookings;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    
    if (selectedUser && selectedUser !== "all") {
      filtered = filtered.filter(b => b.user_id === selectedUser);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(b => 
        b.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.services.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by status priority: pending > confirmed > completed > cancelled
    const statusPriority: { [key: string]: number } = {
      'pending': 1,
      'confirmed': 2,
      'completed': 3,
      'cancelled': 4
    };
    
    filtered.sort((a, b) => {
      const priorityA = statusPriority[a.status] || 999;
      const priorityB = statusPriority[b.status] || 999;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same status, sort by booking date (newest first)
      return new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime();
    });
    
    return filtered;
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  if (loading || !isAdmin) {
    return (
      <AnimatedBackground>
        <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
          <ParticleBackground />
          <FloatingElement>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-8 h-8 bg-accent rounded-full"></div>
              </div>
              <p className="text-muted-foreground text-lg">Loading admin panel...</p>
            </div>
          </FloatingElement>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground>
      <div className="min-h-screen bg-background pt-20 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={400} className="top-10 right-10 opacity-15" />
        <GradientOrb size={300} color="primary" className="bottom-20 left-20 opacity-15" />
        <GradientOrb size={200} className="top-1/2 left-1/2 opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                    Adilocs Dashboard
                  </h1>
                  <p className="text-muted-foreground text-base sm:text-lg">Manage your salon operations</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden sm:block text-right backdrop-blur-sm bg-card/50 rounded-lg p-3 border border-border/50">
                    <p className="text-sm text-muted-foreground">Welcome back,</p>
                    <p className="font-semibold text-foreground">Adilocs</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center shadow-lg">
                    <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                {
                  title: "Total Customers",
                  value: stats.totalUsers,
                  icon: <Users className="h-6 w-6 sm:h-8 sm:w-8" />,
                  color: "from-blue-500 to-purple-600"
                },
                {
                  title: "Total Revenue",
                  value: `£${stats.totalRevenue.toFixed(0)}`,
                  icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8" />,
                  color: "from-green-500 to-teal-600"
                },
                {
                  title: "Pending Bookings",
                  value: stats.pendingBookings,
                  icon: <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8" />,
                  color: "from-orange-500 to-red-600"
                },
                {
                  title: "Today's Bookings",
                  value: stats.todayBookings,
                  icon: <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />,
                  color: "from-purple-500 to-pink-600"
                }
              ].map((stat) => (
                <Card key={stat.title} className="backdrop-blur-sm bg-card border-border shadow-md">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-muted-foreground text-xs sm:text-sm font-medium truncate">{stat.title}</p>
                        <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mt-1">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-br ${stat.color} text-white shadow-lg flex-shrink-0 ml-2`}>
                        {stat.icon}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Search and Filters */}
            <Card className="mb-4 sm:mb-6 backdrop-blur-sm bg-card border-border shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search customers, bookings, or services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-48 bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

            {/* Main Content Tabs */}
            <Tabs defaultValue="bookings" className="w-full">
              <div className="flex justify-center mb-4 sm:mb-8 overflow-x-auto">
                <TabsList className="grid grid-cols-4 bg-card/80 backdrop-blur-sm border border-border/50 p-1 rounded-lg min-w-max">
                    <TabsTrigger 
                      value="bookings"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Bookings</span>
                      <span className="sm:hidden">Book</span> ({bookings.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="calendar"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Calendar</span>
                      <span className="sm:hidden">Cal</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="customers"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Customers</span>
                      <span className="sm:hidden">Cust</span> ({users.length})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="services"
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-primary data-[state=active]:text-white transition-all duration-300 text-xs sm:text-sm px-2 sm:px-4"
                    >
                      <span className="hidden sm:inline">Services</span>
                      <span className="sm:hidden">Serv</span> ({services.length})
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Bookings Tab */}
                <TabsContent value="bookings" className="w-full">
                  <div className="space-y-4 sm:space-y-6 w-full">
                    {filterBookings().map((booking) => (
                      <Card key={booking.id} className="backdrop-blur-sm bg-card border-border shadow-md">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base sm:text-lg text-foreground truncate">
                                  {booking.profiles.full_name}
                                </h3>
                                <p className="text-muted-foreground text-sm sm:text-base font-medium truncate">{booking.services.name}</p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1 truncate">
                                    <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    <span className="truncate">{booking.profiles.email}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                    {booking.profiles.phone}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 text-xs sm:text-sm flex-shrink-0`}>
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-4">
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                                Date
                              </p>
                              <p className="font-medium text-sm sm:text-base text-foreground">{new Date(booking.booking_date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                Time
                              </p>
                              <p className="font-medium text-sm sm:text-base text-foreground">{booking.booking_time.substring(0, 5)}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                                Professional
                              </p>
                              <p className="font-medium text-sm sm:text-base text-foreground truncate">{booking.professionals.name}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground">Price</p>
                              <p className="font-medium text-sm sm:text-base text-accent">£{booking.services.price.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-muted-foreground">Booked</p>
                              <p className="font-medium text-xs sm:text-sm text-foreground">{new Date(booking.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                      {booking.notes && (
                        <div className="mb-4 p-3 bg-muted rounded-lg">
                          <p className="text-sm text-muted-foreground">Notes</p>
                          <p className="text-foreground">{booking.notes}</p>
                        </div>
                      )}

                      {editingBookingId === booking.id && editingBookingData ? (
                        <div className="mb-4 space-y-3 p-4 bg-muted/50 rounded-lg border border-border">
                          <h4 className="font-semibold text-sm">Edit Booking Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs text-muted-foreground">Date</label>
                              <Input
                                type="date"
                                value={editingBookingData.booking_date}
                                onChange={(e) => setEditingBookingData({...editingBookingData, booking_date: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">Time</label>
                              <Input
                                type="time"
                                value={editingBookingData.booking_time}
                                onChange={(e) => setEditingBookingData({...editingBookingData, booking_time: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">Service</label>
                              <Select 
                                value={editingBookingData.service_id} 
                                onValueChange={(value) => setEditingBookingData({...editingBookingData, service_id: value})}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {services.map(service => (
                                    <SelectItem key={service.id} value={service.id}>
                                      {service.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">Professional</label>
                              <Select 
                                value={editingBookingData.professional_id} 
                                onValueChange={(value) => setEditingBookingData({...editingBookingData, professional_id: value})}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {professionals.map(prof => (
                                    <SelectItem key={prof.id} value={prof.id}>
                                      {prof.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={saveBookingChanges}
                              size="sm"
                              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={cancelEditBooking}
                              size="sm"
                              variant="outline"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : null}

                            <div className="flex flex-wrap gap-2">
                              {booking.status === "pending" && (
                                <Button
                                  onClick={() => updateBookingStatus(booking.id, "confirmed")}
                                  className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transition-all duration-300 shadow-lg text-xs sm:text-sm"
                                  size="sm"
                                >
                                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                  Confirm
                                </Button>
                              )}
                              {(booking.status === "pending" || booking.status === "confirmed") && (
                                <Button
                                  onClick={() => updateBookingStatus(booking.id, "completed")}
                                  variant="outline"
                                  size="sm"
                                  className="transform hover:scale-105 transition-all duration-300 hover:bg-muted/50"
                                >
                                  <Star className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              {booking.status !== "cancelled" && booking.status !== "completed" && (
                                <>
                                  <Button
                                    onClick={() => startEditBooking(booking)}
                                    variant="outline"
                                    size="sm"
                                    className="transform hover:scale-105 transition-all duration-300 hover:bg-muted/50"
                                  >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                    variant="outline"
                                    size="sm"
                                    className="transform hover:scale-105 transition-all duration-300 hover:bg-muted/50"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </>
                              )}
                              {(booking.status === "completed" || booking.status === "cancelled") && (
                                <Button
                                  onClick={() => deleteBooking(booking.id)}
                                  variant="outline"
                                  size="sm"
                                  className="transform hover:scale-105 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                    ))}

                    {filterBookings().length === 0 && (
                      <Card className="backdrop-blur-sm bg-card">
                        <CardContent className="pt-6 text-center py-12">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-background/50 flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-foreground text-lg font-medium">No bookings found</p>
                          <p className="text-muted-foreground">Try adjusting your search or filters</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Calendar Tab */}
                <TabsContent value="calendar" className="w-full">
                  <div className="w-full">
                    <Card className="backdrop-blur-sm bg-card border-border shadow-xl w-full">
                      <CardContent className="p-6 w-full">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                            Professional Booking Calendar
                          </h3>
                          <p className="text-muted-foreground">View and manage bookings by professional and time</p>
                        </div>
                        <AdminCalendar />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Customers Tab */}
                <TabsContent value="customers" className="w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {filteredUsers.map((userProfile, index) => (
                      <FloatingElement key={userProfile.id} delay={index * 0.1}>
                        <Card className="backdrop-blur-sm bg-card/90 border-border/50">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                  <UserIcon className="h-6 w-6 text-accent" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg text-foreground group-hover:text-accent transition-colors duration-300">
                                    {userProfile.full_name}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      {userProfile.email}
                                    </span>
                                    {userProfile.phone !== "Not provided" && (
                                      <span className="flex items-center gap-1">
                                        <Phone className="h-4 w-4" />
                                        {userProfile.phone}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUser(selectedUser === userProfile.id ? null : userProfile.id)}
                                className="transform hover:scale-105 transition-all duration-300 hover:bg-muted/50"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {selectedUser === userProfile.id ? "Hide" : "View"} Bookings
                              </Button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                                <p className="text-sm text-muted-foreground">Total Bookings</p>
                                <p className="font-bold text-xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                                  {userProfile.total_bookings}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                                <p className="text-sm text-muted-foreground">Total Spent</p>
                                <p className="font-bold text-xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                                  £{userProfile.total_spent.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-br from-muted/30 to-background/30 rounded-lg border border-border/50">
                                <p className="text-sm text-muted-foreground">Member Since</p>
                                <p className="font-medium text-foreground">{new Date(userProfile.created_at).toLocaleDateString()}</p>
                              </div>
                              <div className="text-center p-3 bg-gradient-to-br from-muted/30 to-background/30 rounded-lg border border-border/50">
                                <p className="text-sm text-muted-foreground">Last Booking</p>
                                <p className="font-medium text-foreground">
                                  {userProfile.last_booking !== "Never" 
                                    ? new Date(userProfile.last_booking).toLocaleDateString()
                                    : "Never"
                                  }
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </FloatingElement>
                    ))}

                    {filteredUsers.length === 0 && (
                      <div className="col-span-2">
                        <FloatingElement delay={0.5}>
                          <Card className="backdrop-blur-sm bg-card/90">
                            <CardContent className="pt-6 text-center py-12">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-background/50 flex items-center justify-center">
                                <Users className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <p className="text-foreground text-lg font-medium">No customers found</p>
                              <p className="text-muted-foreground">Try adjusting your search</p>
                            </CardContent>
                          </Card>
                        </FloatingElement>
                      </div>
                    )}
                  </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="w-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {services
                      .filter(s =>
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        String(s.price).includes(searchTerm)
                      )
                      .map((service, index) => (
                      <FloatingElement key={service.id} delay={index * 0.1}>
                        <Card className="backdrop-blur-sm bg-card/90 border-border/50">
                          <CardContent className="p-6">
                      {editingServiceId === service.id ? (
                        // Editing mode
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Service Name</label>
                            <Input
                              value={editingServiceName}
                              onChange={(e) => setEditingServiceName(e.target.value)}
                              className="mt-1"
                              placeholder="Service name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Price (£)</label>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editingServicePrice}
                              onChange={(e) => setEditingServicePrice(e.target.value)}
                              className="mt-1"
                              placeholder="0.00"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={saveServiceChanges} 
                              className="bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Save Changes
                            </Button>
                            <Button 
                              onClick={cancelEditService} 
                              variant="outline"
                              className="transform hover:scale-105 transition-all duration-300 hover:bg-muted/50"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Display mode
                        <>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
                                {service.name}
                              </h3>
                              <Badge 
                                variant={service.is_active ? "default" : "outline"} 
                                className={`mb-3 cursor-pointer transform hover:scale-105 transition-all duration-300 ${
                                  service.is_active 
                                    ? "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90" 
                                    : ""
                                }`}
                                onClick={() => toggleServiceStatus(service.id, service.is_active)}
                              >
                                {service.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => startEditService(service)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Service
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => toggleServiceStatus(service.id, service.is_active)}
                                >
                                  <Activity className="h-4 w-4 mr-2" />
                                  {service.is_active ? 'Deactivate' : 'Activate'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg border border-accent/20">
                              <span className="text-sm text-muted-foreground">Price</span>
                              <span className="font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                                £{service.price.toFixed(2)}
                              </span>
                            </div>
                            {typeof service.duration_minutes === "number" && (
                              <div className="flex justify-between items-center p-3 bg-gradient-to-br from-muted/30 to-background/30 rounded-lg border border-border/50">
                                <span className="text-sm text-muted-foreground">Duration</span>
                                <span className="font-medium text-foreground">{service.duration_minutes} min</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center p-3 bg-gradient-to-br from-muted/30 to-background/30 rounded-lg border border-border/50">
                              <span className="text-sm text-muted-foreground">Created</span>
                              <span className="font-medium text-foreground">{new Date(service.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </>
                      )}
                          </CardContent>
                        </Card>
                      </FloatingElement>
                    ))}

                    {services.length === 0 && (
                      <div className="col-span-3">
                        <FloatingElement delay={0.5}>
                          <Card className="backdrop-blur-sm bg-card/90">
                            <CardContent className="pt-6 text-center py-12">
                              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-muted/50 to-background/50 flex items-center justify-center">
                                <Briefcase className="h-8 w-8 text-muted-foreground" />
                              </div>
                              <p className="text-foreground text-lg font-medium">No services found</p>
                              <p className="text-muted-foreground">Add services to get started</p>
                            </CardContent>
                          </Card>
                        </FloatingElement>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </AnimatedBackground>
    );
  };

export default ModernAdmin;
