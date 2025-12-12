import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D, InteractiveCard } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";
import { CheckCircle, Clock, User as UserIcon, Calendar as CalendarIcon } from "lucide-react";
import { useWeeklySchedule } from "@/hooks/useWeeklySchedule";
import HierarchicalServiceSelector from "@/components/HierarchicalServiceSelector";

// Helper function to format date without timezone conversion
const formatDateForDatabase = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface Service {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category?: string;
  parent_id?: string;
}

interface SubService {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface PrimaryService {
  id: string;
  name: string;
  description: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

interface Professional {
  id: string;
  name: string;
  title: string;
  bio: string;
}

const Booking = () => {
  const navigate = useNavigate();
  const { getScheduleForDay } = useWeeklySchedule();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedSubService, setSelectedSubService] = useState<SubService | null>(null);
  const [selectedPrimaryService, setSelectedPrimaryService] = useState<PrimaryService | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    loadServices();
    loadProfessionals();

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedProfessional && selectedDate) {
      loadBookedSlots();
    }
  }, [selectedProfessional, selectedDate]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.log("Services loading handled gracefully");
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.log("Services error handled gracefully");
    }
  };

  const loadProfessionals = async () => {
    try {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("is_active", true);

      if (error) {
        console.log("Professionals loading handled gracefully");
        return;
      }

      setProfessionals(data || []);
    } catch (error) {
      console.log("Professionals error handled gracefully");
    }
  };

  const loadBookedSlots = async () => {
    if (!selectedDate || !selectedProfessional) return;

    const dateStr = formatDateForDatabase(selectedDate);
    
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("professional_id", selectedProfessional)
        .eq("booking_date", dateStr)
        .in("status", ["pending", "confirmed"]); // Only block pending and confirmed bookings

      if (error) {
        console.log("Booked slots loading handled gracefully");
        setBookedSlots([]);
        return;
      }

      setBookedSlots(data?.map(b => b.booking_time) || []);
    } catch (error) {
      console.log("Booked slots error handled gracefully");
      setBookedSlots([]);
    }
  };

  const generateTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daySchedule = getScheduleForDay(dayOfWeek);
    
    // If day is closed or no schedule found, return empty array
    if (!daySchedule || !daySchedule.is_open) {
      return [];
    }
    
    const slots = [];
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Parse opening and closing times from schedule
    const [openHour, openMinute] = daySchedule.opening_time.split(':').map(Number);
    const [closeHour, closeMinute] = daySchedule.closing_time.split(':').map(Number);
    const slotDuration = daySchedule.slot_duration_minutes;
    
    // Convert times to minutes for easier calculation
    const openingMinutes = openHour * 60 + openMinute;
    const closingMinutes = closeHour * 60 + closeMinute;
    
    // Generate slots based on schedule
    for (let totalMinutes = openingMinutes; totalMinutes < closingMinutes; totalMinutes += slotDuration) {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      // Skip past time slots if it's today
      if (isToday && (hour < currentHour || (hour === currentHour && minute <= currentMinute))) {
        continue;
      }
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    
    return slots;
  };

  const handleBooking = async () => {
    if (!user) {
      toast.info("Backend connection needed for booking appointments");
      navigate("/auth");
      return;
    }

    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      toast.error("Please complete all booking details");
      return;
    }

    setLoading(true);

    try {
      const formattedDate = formatDateForDatabase(selectedDate);
      
      console.log("Creating booking:", {
        date: formattedDate,
        selectedDate: selectedDate.toDateString(),
        time: selectedTime
      });

      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        sub_service_id: selectedService,
        professional_id: selectedProfessional,
        booking_date: formattedDate,
        booking_time: selectedTime,
        duration_minutes: selectedSubService?.duration_minutes,
        total_price: selectedSubService?.price,
        status: "pending",
      });

      if (error) {
        toast.info("Backend connection needed to complete booking");
        setLoading(false);
        return;
      }

      toast.success("Booking confirmed! We'll see you soon.");
      navigate("/bookings");
    } catch (error: any) {
      console.log("Booking error handled gracefully");
      toast.info("Backend connection needed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  // Generate all possible time slots based on day of week
  const timeSlots = generateTimeSlots();
  
  // Filter out slots that are already booked for this specific professional
  // This ensures no double-booking: if Professional A is booked at 12 PM,
  // that slot won't be shown to other users trying to book Professional A
  const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={300} className="top-20 left-10 opacity-20" />
        <GradientOrb size={200} color="primary" className="top-40 right-20 opacity-20" />
        <GradientOrb size={150} className="bottom-20 left-1/3 opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FloatingElement delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                Book Appointment
              </h1>
            </FloatingElement>

            {/* Progress Steps */}
            <FloatingElement delay={0.3}>
              <div className="flex justify-center mb-12">
                {[
                  { num: 1, icon: <UserIcon className="h-4 w-4" /> },
                  { num: 2, icon: <UserIcon className="h-4 w-4" /> },
                  { num: 3, icon: <CalendarIcon className="h-4 w-4" /> },
                  { num: 4, icon: <CheckCircle className="h-4 w-4" /> }
                ].map((s, index) => (
                  <div key={s.num} className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 transform ${
                        step >= s.num 
                          ? "bg-gradient-to-r from-accent to-primary text-white shadow-lg shadow-accent/50 scale-110" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > s.num ? s.icon : s.num}
                    </div>
                    {index < 3 && (
                      <div 
                        className={`w-16 h-2 rounded-full transition-all duration-500 ${
                          step > s.num ? "bg-gradient-to-r from-accent to-primary" : "bg-muted"
                        }`} 
                      />
                    )}
                  </div>
                ))}
              </div>
            </FloatingElement>

            {/* Step 1: Select Service */}
            {step === 1 && (
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                      Select a Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HierarchicalServiceSelector
                      onServiceSelect={(subService, primaryService, category) => {
                        console.log('Booking page - Service selected:', {
                          subService,
                          primaryService,
                          category,
                          subServiceId: subService.id
                        });
                        setSelectedSubService(subService);
                        setSelectedPrimaryService(primaryService);
                        setSelectedCategory(category);
                        setSelectedService(subService.id);
                        console.log('Booking page - State updated, selectedService:', subService.id);
                      }}
                      selectedServiceId={selectedService}
                    />
                    <Button
                      className="w-full mt-6 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                      onClick={() => {
                        console.log('Continue button clicked, selectedService:', selectedService);
                        setStep(2);
                      }}
                      disabled={!selectedService}
                    >
                      Continue {selectedService ? '✓' : '(Select a service)'}
                    </Button>
                  </CardContent>
                </Card3D>
              </FloatingElement>
            )}

            {/* Step 2: Select Professional */}
            {step === 2 && (
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                      Select a Professional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {professionals.map((pro, index) => (
                        <FloatingElement key={pro.id} delay={index * 0.1}>
                          <InteractiveCard
                            className={`cursor-pointer transition-all duration-300 ${
                              selectedProfessional === pro.id 
                                ? "ring-2 ring-accent shadow-lg shadow-accent/25" 
                                : ""
                            }`}
                          >
                            <CardContent 
                              className="pt-6"
                              onClick={() => setSelectedProfessional(pro.id)}
                            >
                              <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                                {pro.name}
                              </h3>
                              <p className="text-accent text-sm font-medium">{pro.title}</p>
                              <p className="text-muted-foreground text-sm mt-2">{pro.bio}</p>
                            </CardContent>
                          </InteractiveCard>
                        </FloatingElement>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(1)} 
                        className="flex-1 hover:bg-muted/50 transform hover:scale-105 transition-all duration-300"
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        onClick={() => setStep(3)}
                        disabled={!selectedProfessional}
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card3D>
              </FloatingElement>
            )}

            {/* Step 3: Select Date & Time */}
            {step === 3 && (
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                      Select Date & Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <FloatingElement delay={0.2}>
                        <div className="flex justify-center">
                          <div className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-background/50 backdrop-blur-sm border border-border/50">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              disabled={(date) => date < new Date()}
                              className="rounded-md"
                            />
                          </div>
                        </div>
                      </FloatingElement>

                      {selectedDate && (
                        <FloatingElement delay={0.4}>
                          <div>
                            <h3 className="font-semibold mb-3 text-lg">Available Time Slots</h3>
                            {availableSlots.length > 0 ? (
                              <div className="grid grid-cols-3 gap-3">
                                {availableSlots.map((time, index) => (
                                  <FloatingElement key={time} delay={index * 0.05}>
                                    <Button
                                      variant={selectedTime === time ? "default" : "outline"}
                                      onClick={() => setSelectedTime(time)}
                                      className={`transform hover:scale-105 transition-all duration-300 ${
                                        selectedTime === time 
                                          ? "bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 shadow-lg shadow-accent/25" 
                                          : "hover:bg-muted/50"
                                      }`}
                                    >
                                      {time.substring(0, 5)}
                                    </Button>
                                  </FloatingElement>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                                  <Clock className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-muted-foreground">
                                  {selectedDate.getDay() === 0 
                                    ? "We're closed on Sundays. Please select another date."
                                    : "All time slots are booked for this professional on this date. Please select another date or professional."}
                                </p>
                              </div>
                            )}
                          </div>
                        </FloatingElement>
                      )}
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)} 
                        className="flex-1 hover:bg-muted/50 transform hover:scale-105 transition-all duration-300"
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        onClick={() => setStep(4)}
                        disabled={!selectedDate || !selectedTime}
                      >
                        Continue
                      </Button>
                    </div>
                  </CardContent>
                </Card3D>
              </FloatingElement>
            )}

            {/* Step 4: Confirm Booking */}
            {step === 4 && (
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                      Confirm Your Booking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          label: "Category",
                          value: selectedCategory?.name,
                          icon: <UserIcon className="h-5 w-5" />
                        },
                        {
                          label: "Service",
                          value: selectedSubService?.name,
                          icon: <UserIcon className="h-5 w-5" />
                        },
                        {
                          label: "Professional",
                          value: professionals.find(p => p.id === selectedProfessional)?.name,
                          icon: <UserIcon className="h-5 w-5" />
                        },
                        {
                          label: "Date & Time",
                          value: `${selectedDate?.toLocaleDateString()} at ${selectedTime?.substring(0, 5)}`,
                          icon: <CalendarIcon className="h-5 w-5" />
                        },
                        {
                          label: "Duration",
                          value: `${selectedSubService?.duration_minutes} minutes`,
                          icon: <Clock className="h-5 w-5" />
                        }
                      ].map((item, index) => (
                        <FloatingElement key={item.label} delay={index * 0.1}>
                          <div className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-muted/30 to-background/30 backdrop-blur-sm border border-border/50">
                            <div className="text-accent">{item.icon}</div>
                            <div>
                              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                {item.label}
                              </h3>
                              <p className="text-lg font-medium">{item.value}</p>
                            </div>
                          </div>
                        </FloatingElement>
                      ))}
                      
                      <FloatingElement delay={0.5}>
                        <div className="p-6 rounded-lg bg-gradient-to-br from-accent/10 to-primary/10 border border-accent/20">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Total Price</h3>
                            <p className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                              £{selectedSubService?.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </FloatingElement>
                    </div>
                    
                    <div className="flex gap-4 mt-8">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(3)} 
                        className="flex-1 hover:bg-muted/50 transform hover:scale-105 transition-all duration-300"
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
                        onClick={handleBooking}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Booking...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>Confirm Booking</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card3D>
              </FloatingElement>
            )}
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Booking;
