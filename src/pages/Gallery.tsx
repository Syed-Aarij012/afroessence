import { useState } from "react";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";
import { X, ZoomIn } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Locs gallery images
  const galleryImages = [
    { id: 1, url: "https://images.unsplash.com/photo-1621607512214-68297480165e?w=800&q=80", alt: "Natural locs style" },
    { id: 2, url: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80", alt: "Styled locs" },
    { id: 3, url: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80", alt: "Locs with pattern" },
    { id: 4, url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80", alt: "Long locs style" },
    { id: 5, url: "https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=800&q=80", alt: "Colored locs" },
    { id: 6, url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&q=80", alt: "Locs updo" },
    { id: 7, url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80", alt: "Locs with accessories" },
    { id: 8, url: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80", alt: "Freeform locs" },
    { id: 9, url: "https://images.unsplash.com/photo-1560264280-88b68371db39?w=800&q=80", alt: "Locs maintenance" },
    { id: 10, url: "https://images.unsplash.com/photo-1598439210625-5067c578f3f6?w=800&q=80", alt: "Styled locs updo" },
    { id: 11, url: "https://images.unsplash.com/photo-1595475884562-073c30d45670?w=800&q=80", alt: "Locs with highlights" },
    { id: 12, url: "https://images.unsplash.com/photo-1543965170-4c01a586684e?w=800&q=80", alt: "Natural locs texture" },
  ];

  return (
    <AnimatedBackground>
      <div className="min-h-screen pt-24 pb-16 relative">
        <ParticleBackground />
        
        {/* Background decorations */}
        <GradientOrb size={350} className="top-20 left-10 opacity-15" />
        <GradientOrb size={250} color="primary" className="bottom-20 right-20 opacity-15" />
        <GradientOrb size={180} className="top-1/2 right-10 opacity-10" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <FloatingElement delay={0}>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center bg-gradient-to-r from-foreground via-accent to-foreground bg-clip-text text-transparent">
                Gallery
              </h1>
            </FloatingElement>
            
            <FloatingElement delay={0.3}>
              <p className="text-xl text-muted-foreground text-center mb-12 backdrop-blur-sm bg-background/50 rounded-lg p-4 max-w-2xl mx-auto">
                Explore our work and get inspired for your next look
              </p>
            </FloatingElement>

            <FloatingElement delay={0.5}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryImages.map((image, index) => (
                  <FloatingElement key={image.id} delay={index * 0.1}>
                    <Card3D className="overflow-hidden cursor-pointer group">
                      <div 
                        className="relative"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <img 
                          src={image.url} 
                          alt={image.alt}
                          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                            <ZoomIn className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </Card3D>
                  </FloatingElement>
                ))}
              </div>
            </FloatingElement>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            {/* Close button */}
            <button
              className="absolute -top-12 right-0 text-white hover:text-accent transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full p-2"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </button>
            
            {/* Image with 3D effect */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <img 
                src={selectedImage} 
                alt="Selected work" 
                className="relative max-w-full max-h-full object-contain rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      )}
    </AnimatedBackground>
  );
};

export default Gallery;
