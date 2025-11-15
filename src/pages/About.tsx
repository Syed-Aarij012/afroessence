import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Heart } from "lucide-react";
import aboutImage from "@/assets/about-image.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-6">
              About Us
            </h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
              <div className="order-2 md:order-1">
                <h2 className="text-4xl font-bold text-foreground mb-6">
                  Welcome to AfroEssence BY K
                </h2>
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    AfroEssence by K seamlessly blends Afro and Western beauty traditions, creating a vibrant atmosphere where everyone feels welcome. This inclusive salon caters to men, women, and children, offering an array of services from stylish hairstyles to relaxing blow dries.
                  </p>
                  <p>
                    With a commitment to exceptional service and accessibility, AfroEssence by K ensures that every visit is a celebration of individuality and style.
                  </p>
                  <p className="text-sm italic">
                    AfroEssence by K is a trading name under AFROYA STUDIO LTD.
                  </p>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl transform rotate-3"></div>
                  <img 
                    src={aboutImage} 
                    alt="AfroEssence Salon" 
                    className="relative rounded-3xl shadow-2xl shadow-amber-500/20 w-full h-[500px] object-cover border-2 border-amber-500/30"
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="mt-24">
              <h2 className="text-4xl font-bold text-center text-foreground mb-16">Our Values</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Award className="w-10 h-10" />,
                    title: "Expertise",
                    description: "Our skilled stylists bring years of experience in natural hair care, locs maintenance, and creative styling techniques.",
                    color: "from-amber-500 to-yellow-600"
                  },
                  {
                    icon: <Heart className="w-10 h-10" />,
                    title: "Passion",
                    description: "We love what we do and it shows in every style we create. Your satisfaction and confidence are our greatest rewards.",
                    color: "from-yellow-500 to-amber-500"
                  },
                  {
                    icon: <Users className="w-10 h-10" />,
                    title: "Quality",
                    description: "We use only premium products and proven techniques to ensure your hair stays healthy, strong, and beautiful.",
                    color: "from-amber-600 to-orange-600"
                  }
                ].map((value, index) => (
                  <Card key={index} className="border border-amber-500/20 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 transform hover:-translate-y-2 bg-card">
                    <CardContent className="p-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} text-black mb-6 shadow-lg shadow-amber-500/50`}>
                        {value.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-4">
                        {value.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
