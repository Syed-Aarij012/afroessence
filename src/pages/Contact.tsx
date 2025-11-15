import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D, InteractiveCard } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send the message to the backend
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={400} className="top-10 right-10 opacity-20" />
        <GradientOrb size={300} color="primary" className="bottom-20 left-10 opacity-20" />
        <GradientOrb size={200} className="top-1/2 left-1/2 opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <FloatingElement delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                Contact Us
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.3}>
              <p className="text-xl text-muted-foreground text-center mb-12 backdrop-blur-sm bg-background/50 rounded-lg p-4 max-w-2xl mx-auto">
                Get in touch with us for any questions or to book an appointment
              </p>
            </FloatingElement>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <FloatingElement delay={0.5}>
                <Card3D className="backdrop-blur-sm bg-card/90">
                  <CardHeader>
                    <CardTitle className="text-2xl bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-accent" />
                      Send Us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <FloatingElement delay={0.1}>
                        <div>
                          <Input
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                          />
                        </div>
                      </FloatingElement>
                      
                      <FloatingElement delay={0.2}>
                        <div>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                          />
                        </div>
                      </FloatingElement>
                      
                      <FloatingElement delay={0.3}>
                        <div>
                          <Input
                            type="tel"
                            placeholder="Your Phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300"
                          />
                        </div>
                      </FloatingElement>
                      
                      <FloatingElement delay={0.4}>
                        <div>
                          <Textarea
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={5}
                            required
                            className="bg-background/50 backdrop-blur-sm border-border/50 focus:border-accent transition-all duration-300 resize-none"
                          />
                        </div>
                      </FloatingElement>
                      
                      <FloatingElement delay={0.5}>
                        <Button 
                          type="submit" 
                          className="w-full bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-accent/25"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      </FloatingElement>
                    </form>
                  </CardContent>
                </Card3D>
              </FloatingElement>

              {/* Contact Information */}
              <div className="space-y-6">
                {[
                  {
                    icon: <MapPin className="h-6 w-6" />,
                    title: "Address",
                    content: (
                      <>
                        Suite 114, Phenix Salon<br />
                        1 Micklegate<br />
                        York
                      </>
                    ),
                    color: "from-blue-500 to-purple-600",
                    delay: 0.6
                  },
                  {
                    icon: <Phone className="h-6 w-6" />,
                    title: "Phone",
                    content: (
                      <a href="tel:+447823712141" className="hover:text-accent transition-colors">
                        07823 712141
                      </a>
                    ),
                    color: "from-green-500 to-teal-600",
                    delay: 0.7
                  },
                  {
                    icon: <Mail className="h-6 w-6" />,
                    title: "Email",
                    content: "hello@afroessencebyk.uk",
                    color: "from-orange-500 to-red-600",
                    delay: 0.8
                  },
                  {
                    icon: <Clock className="h-6 w-6" />,
                    title: "Opening Hours",
                    content: (
                      <>
                        Mon-Sat: 09:00 - 21:00<br />
                        Sunday: 14:00 - 19:00
                      </>
                    ),
                    color: "from-pink-500 to-purple-600",
                    delay: 0.9
                  }
                ].map((item, index) => (
                  <FloatingElement key={item.title} delay={item.delay}>
                    <InteractiveCard className="backdrop-blur-sm bg-card/90">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full bg-gradient-to-br ${item.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-lg group-hover:text-accent transition-colors duration-300">
                              {item.title}
                            </h3>
                            <div className="text-muted-foreground">
                              {item.content}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </InteractiveCard>
                  </FloatingElement>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Contact;
