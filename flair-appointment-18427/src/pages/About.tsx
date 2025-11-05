import { Card, CardContent } from "@/components/ui/card";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D, InteractiveCard } from "@/components/3D/Card3D";
import { AnimatedBackground, ParallaxSection } from "@/components/3D/AnimatedBackground";
import { Award, Users, Heart, Lightbulb, Target, Star } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={400} className="top-20 right-10 opacity-15" />
        <GradientOrb size={250} color="primary" className="bottom-40 left-20 opacity-15" />
        <GradientOrb size={180} className="top-1/2 left-1/2 opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <FloatingElement delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                About Us
              </h1>
            </FloatingElement>
            
            <ParallaxSection speed={-0.1}>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <FloatingElement delay={0.3}>
                  <Card3D className="overflow-hidden h-full">
                    <div className="relative group">
                      <img 
                        src={aboutImage} 
                        alt="Professional locs styling" 
                        className="rounded-lg w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Card3D>
                </FloatingElement>
                
                <FloatingElement delay={0.5}>
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="backdrop-blur-sm bg-card/80 rounded-lg p-6 border border-border/50">
                      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                        Our Story
                      </h2>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        Adisco Locs Stylist has been serving the Peckham community for years, 
                        providing exceptional locs maintenance and barbering services. Our passion 
                        is helping clients look and feel their best through expert styling and care.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        Located on Choumert Road, we've built a reputation for quality, 
                        professionalism, and creating a welcoming atmosphere for all our clients.
                      </p>
                    </div>
                  </div>
                </FloatingElement>
              </div>
            </ParallaxSection>

            <ParallaxSection speed={0.1}>
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                  { number: "10+", label: "Years Experience", icon: <Award className="h-8 w-8" />, color: "from-blue-500 to-purple-600", delay: 0.7 },
                  { number: "500+", label: "Happy Clients", icon: <Users className="h-8 w-8" />, color: "from-green-500 to-teal-600", delay: 0.8 },
                  { number: "100%", label: "Satisfaction", icon: <Star className="h-8 w-8" />, color: "from-yellow-500 to-orange-600", delay: 0.9 }
                ].map((stat, index) => (
                  <FloatingElement key={stat.label} delay={stat.delay}>
                    <Card3D className="backdrop-blur-sm bg-card/90">
                      <CardContent className="pt-6 text-center">
                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                          {stat.icon}
                        </div>
                        <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2 animate-pulse">
                          {stat.number}
                        </div>
                        <p className="text-muted-foreground font-medium">{stat.label}</p>
                      </CardContent>
                    </Card3D>
                  </FloatingElement>
                ))}
              </div>
            </ParallaxSection>

            <ParallaxSection speed={-0.05}>
              <div>
                <FloatingElement delay={1}>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                    Our Values
                  </h2>
                </FloatingElement>
                
                <div className="space-y-6">
                  {[
                    {
                      title: "Excellence",
                      description: "We strive for perfection in every cut, style, and service we provide.",
                      icon: <Target className="h-6 w-6" />,
                      color: "from-purple-500 to-pink-600",
                      delay: 1.1
                    },
                    {
                      title: "Community",
                      description: "We're proud to be part of the Peckham community and serve our neighbors.",
                      icon: <Heart className="h-6 w-6" />,
                      color: "from-red-500 to-rose-600",
                      delay: 1.2
                    },
                    {
                      title: "Innovation",
                      description: "We stay updated with the latest techniques and trends in hair care.",
                      icon: <Lightbulb className="h-6 w-6" />,
                      color: "from-amber-500 to-yellow-600",
                      delay: 1.3
                    }
                  ].map((value, index) => (
                    <FloatingElement key={value.title} delay={value.delay}>
                      <InteractiveCard className="backdrop-blur-sm bg-card/90">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${value.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                              {value.icon}
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                                {value.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {value.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </InteractiveCard>
                    </FloatingElement>
                  ))}
                </div>
              </div>
            </ParallaxSection>
          </div>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default About;
