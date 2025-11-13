import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const db = supabase as any;

interface CalendarBooking {
  id: string;
  booking_date: string;
  booking_time: string;
  status: string;
  professional_id: string;
  professional_name: string;
  customer_name: string;
  service_name: string;
  duration_minutes?: number;
}

interface Professional {
  id: string;
  name: string;
}

export const AdminCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [currentDate, selectedProfessional]);

  const loadProfessionals = async () => {
    try {
      const { data, error } = await db
        .from("professionals")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error("Failed to load professionals:", error);
      toast.error("Failed to load professionals");
    }
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const startOfWeek = getStartOfWeek(currentDate);
      const endOfWeek = getEndOfWeek(currentDate);

      let query = db
        .from("bookings")
        .select("*")
        .gte("booking_date", startOfWeek.toISOString().split('T')[0])
        .lte("booking_date", endOfWeek.toISOString().split('T')[0]);

      if (selectedProfessional !== "all") {
        query = query.eq("professional_id", selectedProfessional);
      }

      const { data: bookingsData, error: bookingsError } = await query;

      if (bookingsError) throw bookingsError;

      // Load related data
      const { data: professionalsData } = await db
        .from("professionals")
        .select("id, name");

      const { data: servicesData } = await db
        .from("services")
        .select("id, name, duration_minutes");

      const { data: profilesData } = await db
        .from("profiles")
        .select("id, full_name");

      // Enrich bookings
      const enrichedBookings = (bookingsData || []).map((booking: any) => {
        const professional = professionalsData?.find((p: any) => p.id === booking.professional_id);
        const service = servicesData?.find((s: any) => s.id === booking.service_id);
        const profile = profilesData?.find((pr: any) => pr.id === booking.user_id);

        return {
          id: booking.id,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: booking.status,
          professional_id: booking.professional_id,
          professional_name: professional?.name || "Unknown",
          customer_name: profile?.full_name || "Unknown",
          service_name: service?.name || "Unknown",
          duration_minutes: service?.duration_minutes,
        };
      });

      setBookings(enrichedBookings);
    } catch (error) {
      console.error("Failed to load bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date: Date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const getDaysOfWeek = () => {
    const start = getStartOfWeek(currentDate);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const getBookingsForSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => 
      b.booking_date === dateStr && 
      b.booking_time.substring(0, 5) === time
    );
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-700 dark:text-gray-300 border-gray-500/30";
      default:
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30";
    }
  };

  const daysOfWeek = getDaysOfWeek();
  const timeSlots = getTimeSlots();
  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = getEndOfWeek(currentDate);

  // Get unique professionals from bookings for filtering
  const activeProfessionals = selectedProfessional === "all" 
    ? [...new Set(bookings.map(b => b.professional_id))]
    : [selectedProfessional];

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button onClick={goToPreviousWeek} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center min-w-[200px]">
            <h3 className="font-semibold text-lg">
              {startOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {endOfWeek.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </h3>
          </div>
          <Button onClick={goToNextWeek} variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button onClick={goToToday} variant="outline" size="sm">
            Today
          </Button>
        </div>

        <Select value={selectedProfessional} onValueChange={setSelectedProfessional}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Professionals" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Professionals</SelectItem>
            {professionals.map(prof => (
              <SelectItem key={prof.id} value={prof.id}>
                {prof.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row with Days */}
              <div className="grid grid-cols-8 border-b sticky top-0 bg-background z-10">
                <div className="p-2 border-r font-medium text-sm text-muted-foreground">
                  Time
                </div>
                {daysOfWeek.map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div 
                      key={index} 
                      className={`p-2 text-center border-r last:border-r-0 ${isToday ? 'bg-accent/10' : ''}`}
                    >
                      <div className="font-medium text-sm">
                        {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-bold ${isToday ? 'text-accent' : ''}`}>
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Loading bookings...
                </div>
              ) : (
                <div className="relative">
                  {timeSlots.map((time, timeIndex) => (
                    <div key={time} className="grid grid-cols-8 border-b min-h-[60px]">
                      <div className="p-2 border-r text-sm text-muted-foreground font-medium">
                        {time}
                      </div>
                      {daysOfWeek.map((day, dayIndex) => {
                        const slotBookings = getBookingsForSlot(day, time);
                        const isToday = day.toDateString() === new Date().toDateString();
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`p-1 border-r last:border-r-0 relative ${isToday ? 'bg-accent/5' : ''}`}
                          >
                            {slotBookings.map((booking) => (
                              <div
                                key={booking.id}
                                className={`text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(booking.status)}`}
                                title={`${booking.customer_name} - ${booking.service_name} (${booking.status})`}
                              >
                                <div className="font-medium truncate">
                                  {booking.customer_name}
                                </div>
                                <div className="truncate text-xs opacity-90">
                                  {booking.service_name}
                                </div>
                                {selectedProfessional === "all" && (
                                  <div className="truncate text-xs opacity-75">
                                    {booking.professional_name}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30"></div>
          <span className="text-sm text-muted-foreground">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500/20 border border-blue-500/30"></div>
          <span className="text-sm text-muted-foreground">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
          <span className="text-sm text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500/20 border border-gray-500/30"></div>
          <span className="text-sm text-muted-foreground">Cancelled</span>
        </div>
      </div>
    </div>
  );
};
