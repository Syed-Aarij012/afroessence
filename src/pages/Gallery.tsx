import { useState } from "react";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";
import { X, ZoomIn } from "lucide-react";
import gallery1 from "@/assets/gallery1.jpg";
import gallery2 from "@/assets/gallery2.jpg";
import gallery3 from "@/assets/gallery3.jpg";
import gallery4 from "@/assets/gallery4.jpg";
import gallery5 from "@/assets/gallery5.jpg";
import gallery6 from "@/assets/gallery6.jpg";
import gallery11 from "@/assets/gallery11.jpg";
import gallery12 from "@/assets/gallery12.jpg";
import gallery13 from "@/assets/gallery13.jpg";
import gallery14 from "@/assets/gallery14.jpg";
import gallery15 from "@/assets/gallery15.jpg";
import gallery16 from "@/assets/gallery16.jpg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Locs with patterns and designs gallery - mixed order
  const galleryImages = [
    { id: 1, url: gallery1, alt: "Natural hair styling" },
    { id: 2, url: gallery13, alt: "Creative styling" },
    { id: 3, url: gallery2, alt: "Locs maintenance" },
    { id: 4, url: gallery14, alt: "Hair artistry" },
    { id: 5, url: gallery3, alt: "Creative hair design" },
    { id: 6, url: gallery15, alt: "Professional work" },
    { id: 7, url: gallery4, alt: "Professional styling" },
    { id: 8, url: gallery16, alt: "Beautiful design" },
    { id: 9, url: gallery5, alt: "Hair artistry" },
    { id: 10, url: gallery11, alt: "Stunning style" },
    { id: 11, url: gallery6, alt: "Beautiful locs" },
    { id: 12, url: gallery12, alt: "Expert styling" },
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="w-full">
                  <div className="overflow-hidden cursor-pointer group rounded-lg border border-border shadow-md hover:shadow-xl transition-all duration-300">
                    <div 
                      className="relative"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.alt}
                        className="w-full h-56 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIn className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
