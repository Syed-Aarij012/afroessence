import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date: Date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const getDaysOfWeek = (): Date[] => {
    const start = getStartOfWeek(currentDate);
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getTimeSlots = (): string[] => {
    const slots: string[] = [];
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

  // Check if a booking spans this time slot
  const isBookingInSlot = (booking: CalendarBooking, date: Date, time: string): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    if (booking.booking_date !== dateStr) return false;

    const bookingStartTime = booking.booking_time.substring(0, 5);
    const [bookingHour, bookingMinute] = bookingStartTime.split(':').map(Number);
    const bookingStartMinutes = bookingHour * 60 + bookingMinute;

    const [slotHour, slotMinute] = time.split(':').map(Number);
    const slotStartMinutes = slotHour * 60 + slotMinute;

    // Always use 120 minutes (2 hours) for all bookings
    const duration = 120;
    const bookingEndMinutes = bookingStartMinutes + duration;

    return slotStartMinutes >= bookingStartMinutes && slotStartMinutes < bookingEndMinutes;
  };

  // Check if this is the first slot of a booking (to render the booking card)
  const isFirstSlotOfBooking = (booking: CalendarBooking, time: string): boolean => {
    return booking.booking_time.substring(0, 5) === time;
  };

  // Calculate how many slots a booking spans
  const getBookingSpanSlots = (booking: CalendarBooking): number => {
    // Always use 120 minutes (2 hours) = 4 slots of 30 minutes each
    return 4;
  };

  // Calculate the end time of a booking
  const getBookingEndTime = (booking: CalendarBooking): string => {
    const startTime = booking.booking_time.substring(0, 5);
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMinute;
    
    // Always use 120 minutes (2 hours) for all bookings
    const duration = 120;
    const endMinutes = startMinutes + duration;
    
    const endHour = Math.floor(endMinutes / 60);
    const endMinute = endMinutes % 60;
    
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
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

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
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
        </div>

        {/* Professional Filter - Avatar Style */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedProfessional("all")}
            className={`flex flex-col items-center gap-2 min-w-fit transition-all duration-300 ${
              selectedProfessional === "all" ? "scale-110" : "opacity-60 hover:opacity-100"
            }`}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
              selectedProfessional === "all" 
                ? "bg-gradient-to-br from-accent to-primary text-white shadow-lg ring-4 ring-accent/30" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}>
              All
            </div>
            <span className={`text-sm font-medium ${
              selectedProfessional === "all" ? "text-accent" : "text-muted-foreground"
            }`}>
              All Professionals
            </span>
          </button>

          {professionals.map(prof => {
            // Get first letter of the name
            const firstLetter = prof.name.trim()[0].toUpperCase();
            
            return (
              <button
                key={prof.id}
                onClick={() => setSelectedProfessional(prof.id)}
                className={`flex flex-col items-center gap-2 min-w-fit transition-all duration-300 ${
                  selectedProfessional === prof.id ? "scale-110" : "opacity-60 hover:opacity-100"
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                  selectedProfessional === prof.id 
                    ? "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg ring-4 ring-blue-400/30" 
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 border-2 border-blue-300"
                }`}>
                  {firstLetter}
                </div>
                <span className={`text-sm font-medium ${
                  selectedProfessional === prof.id ? "text-blue-600" : "text-muted-foreground"
                }`}>
                  {prof.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden border-2 shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row with Days */}
              <div className="grid grid-cols-8 border-b-2 sticky top-0 bg-card z-[1]">
                <div className="p-3 border-r-2 font-bold text-sm text-muted-foreground bg-muted/50">
                  Time
                </div>
                {daysOfWeek.map((day, index) => {
                  const isToday = day.toDateString() === new Date().toDateString();
                  return (
                    <div 
                      key={index} 
                      className={`p-3 text-center border-r-2 last:border-r-0 ${isToday ? 'bg-accent/20 border-accent' : 'bg-muted/30'}`}
                    >
                      <div className="font-bold text-sm">
                        {day.toLocaleDateString('en-GB', { weekday: 'short' })}
                      </div>
                      <div className={`text-xl font-bold ${isToday ? 'text-accent' : ''}`}>
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
                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b min-h-[70px]">
                      <div className="p-2 border-r-2 text-sm text-muted-foreground font-semibold bg-muted/20">
                        {time}
                      </div>
                      {daysOfWeek.map((day, dayIndex) => {
                        const slotBookings = getBookingsForSlot(day, time);
                        const isToday = day.toDateString() === new Date().toDateString();
                        
                        // Find all bookings that span this slot
                        const spanningBookings = bookings.filter(b => isBookingInSlot(b, day, time));
                        
                        return (
                          <div 
                            key={dayIndex} 
                            className={`p-1 border-r last:border-r-0 relative ${isToday ? 'bg-accent/5' : ''}`}
                          >
                            {slotBookings.map((booking) => {
                              const spanSlots = getBookingSpanSlots(booking);
                              const heightInPixels = spanSlots * 70 - 8; // 70px per slot minus padding
                              
                              return (
                                <div
                                  key={booking.id}
                                  className={`text-xs p-2 rounded-md mb-1 cursor-pointer hover:opacity-80 transition-all border ${getStatusColor(booking.status)} shadow-sm hover:shadow-md absolute left-1 right-1 z-10`}
                                  style={{ height: `${heightInPixels}px` }}
                                  title={`${booking.professional_name} - ${booking.service_name} - ${booking.booking_time.substring(0, 5)} - ${booking.customer_name} (${booking.status})`}
                                >
                                  <div className="font-bold truncate text-sm">
                                    {booking.booking_time.substring(0, 5)} - {getBookingEndTime(booking)}
                                  </div>
                                  <div className="truncate text-xs opacity-90 mt-1">
                                    👤 {booking.professional_name}
                                  </div>
                                  <div className="truncate text-xs opacity-90">
                                    {booking.service_name}
                                  </div>
                                  <div className="truncate text-xs opacity-75 mt-1">
                                    {booking.customer_name}
                                  </div>
                                </div>
                              );
                            })}
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
      <div className="flex flex-wrap gap-4 justify-center p-4 bg-muted/30 rounded-lg border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-yellow-500/20 border-2 border-yellow-500/30"></div>
          <span className="text-sm font-medium">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-blue-500/20 border-2 border-blue-500/30"></div>
          <span className="text-sm font-medium">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-green-500/20 border-2 border-green-500/30"></div>
          <span className="text-sm font-medium">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-500/20 border-2 border-gray-500/30"></div>
          <span className="text-sm font-medium">Cancelled</span>
        </div>
      </div>
    </div>
  );
};
