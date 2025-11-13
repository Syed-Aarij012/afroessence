import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, Award, Heart } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Screen with Overlay */}
      <section 
        className="relative min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(0, 0, 0, 0.85) 100%), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="inline-block">
              <Sparkles className="w-16 h-16 mx-auto mb-4 animate-pulse text-amber-400" />
            </div>
            
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 bg-clip-text text-transparent">
                AfroEssence
              </span>
              <span className="block text-5xl md:text-7xl mt-2 font-light text-white">BY K</span>
            </h1>
            
            <p className="text-xl md:text-3xl font-light max-w-2xl mx-auto leading-relaxed text-gray-200">
              Where Natural Beauty Meets Expert Care
            </p>
            
            <div className="pt-8 flex gap-6 justify-center flex-wrap">
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black text-xl px-12 py-7 rounded-full font-bold shadow-2xl shadow-amber-500/50 transform hover:scale-105 transition-all">
                  Book Now
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline" className="border-2 border-amber-400 text-amber-400 hover:bg-amber-400/20 text-xl px-12 py-7 rounded-full font-semibold backdrop-blur-sm">
                  View Gallery
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-foreground mb-4">Why Choose Us</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-yellow-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Award className="w-12 h-12" />,
                title: "Expert Stylists",
                description: "Certified professionals with years of experience in natural hair care",
                gradient: "from-amber-500 to-yellow-600"
              },
              {
                icon: <Calendar className="w-12 h-12" />,
                title: "Flexible Booking",
                description: "Easy online booking system with flexible scheduling options",
                gradient: "from-amber-600 to-orange-600"
              },
              {
                icon: <Heart className="w-12 h-12" />,
                title: "Premium Care",
                description: "We use only the finest products for your hair's health and beauty",
                gradient: "from-yellow-500 to-amber-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="border border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 bg-card">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} text-black mb-6 shadow-lg shadow-amber-500/50`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-black via-amber-950 to-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Ready to Transform Your Look?
          </h2>
          <p className="text-2xl mb-10 max-w-2xl mx-auto font-light text-gray-300">
            Book your appointment today and experience the AfroEssence difference
          </p>
          <Link to="/booking">
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-black text-2xl px-16 py-8 rounded-full font-bold shadow-2xl shadow-amber-500/50 transform hover:scale-110 transition-all">
              <Sparkles className="mr-3 h-6 w-6" />
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Home;
