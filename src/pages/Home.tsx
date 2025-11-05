import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Scissors, Clock, Award, Users, Sparkles, Star } from "lucide-react";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D, InteractiveCard } from "@/components/3D/Card3D";
import { AnimatedBackground, ParallaxSection } from "@/components/3D/AnimatedBackground";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  const features = [
    {
      icon: <Scissors className="h-8 w-8" />,
      title: "Expert Styling",
      description: "Professional locs maintenance and barbering services",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Flexible Hours",
      description: "Open 7 days a week to fit your schedule",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Quality Service",
      description: "Years of experience with exceptional results",
      color: "from-yellow-500 to-orange-600",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Trusted by Many",
      description: "Hundreds of satisfied clients in Peckham",
      color: "from-pink-500 to-red-600",
    },
  ];

  return (
    <AnimatedBackground>
      <div className="min-h-screen">
        <ParticleBackground />
        
        {/* Hero Section */}
        <section 
          className="relative h-screen flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          {/* Floating gradient orbs */}
          <GradientOrb size={300} className="top-10 left-10" />
          <GradientOrb size={200} color="primary" className="top-20 right-20" />
          <GradientOrb size={150} className="bottom-20 left-1/4" />
          
          {/* Floating decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <FloatingElement delay={0} duration={4} amplitude={15}>
              <Sparkles className="absolute top-20 left-20 h-6 w-6 text-accent/60" />
            </FloatingElement>
            <FloatingElement delay={1} duration={5} amplitude={20}>
              <Star className="absolute top-40 right-32 h-4 w-4 text-primary/60" />
            </FloatingElement>
            <FloatingElement delay={2} duration={3.5} amplitude={12}>
              <Sparkles className="absolute bottom-40 right-20 h-5 w-5 text-accent/40" />
            </FloatingElement>
          </div>

          <div className="container mx-auto px-4 text-center text-white relative z-10">
            <FloatingElement delay={0.5}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent animate-pulse">
                Premium Locs <span className="text-accent drop-shadow-2xl">Styling</span>
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={1}>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto backdrop-blur-sm bg-black/20 rounded-lg p-4">
                Expert care for your locs and exceptional barbering services in the heart of Peckham
              </p>
            </FloatingElement>
            
            <FloatingElement delay={1.5}>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/booking">
                  <Button size="lg" className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-lg px-8 shadow-2xl shadow-accent/50 transform hover:scale-105 transition-all duration-300">
                    Book Appointment
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 transform hover:scale-105 transition-all duration-300 shadow-xl">
                    Learn More
                  </Button>
                </Link>
              </div>
            </FloatingElement>
          </div>
        </section>

        {/* Features Section */}
        <ParallaxSection speed={-0.2}>
          <section className="py-20 bg-gradient-to-br from-card via-background to-muted/50 relative">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <GradientOrb size={400} className="top-0 right-0 opacity-10" />
              <GradientOrb size={300} color="primary" className="bottom-0 left-0 opacity-10" />
            </div>
            
            <div className="container mx-auto px-4 relative z-10">
              <FloatingElement delay={0}>
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                  Why Choose Us
                </h2>
              </FloatingElement>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <FloatingElement key={index} delay={index * 0.2}>
                    <Card3D className="h-full" intensity={0.8}>
                      <CardContent className="pt-6 text-center h-full flex flex-col">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground flex-grow">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card3D>
                  </FloatingElement>
                ))}
              </div>
            </div>
          </section>
        </ParallaxSection>

        {/* CTA Section */}
        <ParallaxSection speed={0.1}>
          <section className="py-20 bg-gradient-to-r from-primary via-accent to-primary text-primary-foreground relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent animate-pulse" />
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
              <FloatingElement delay={0}>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-2xl">
                  Ready for Your Transformation?
                </h2>
              </FloatingElement>
              
              <FloatingElement delay={0.5}>
                <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90 backdrop-blur-sm bg-black/10 rounded-lg p-4">
                  Book your appointment today and experience premium locs care and barbering
                </p>
              </FloatingElement>
              
              <FloatingElement delay={1}>
                <Link to="/booking">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 shadow-2xl transform hover:scale-110 transition-all duration-300 hover:shadow-white/50">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Book Now
                  </Button>
                </Link>
              </FloatingElement>
            </div>
          </section>
        </ParallaxSection>
      </div>
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}</style>
    </AnimatedBackground>
  );
};

export default Home;
