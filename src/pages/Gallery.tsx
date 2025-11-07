import { useState } from "react";
import { FloatingElement, ParticleBackground, GradientOrb } from "@/components/3D/FloatingElements";
import { Card3D } from "@/components/3D/Card3D";
import { AnimatedBackground } from "@/components/3D/AnimatedBackground";
import { X, ZoomIn } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Locs with patterns and designs gallery
  const galleryImages = [
    { id: 1, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9ZP7kOsdckVSQh9ygFVrYv_NAkK0nQ-aMDw&s", alt: "Locs with pattern design" },
    { id: 2, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_mrwr9Uq45c5yoqOcxKESfz1OsK-MnNk1YteemmtOr1uFbA_qAEwfYhAM0zzYS6vM-6k&usqp=CAU", alt: "Locs with side pattern" },
    { id: 3, url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE75FndjFd9ejtyc24OHhUq9L2rLktFp8FC5w4mbB3xHR_99t0PPHPSx3C5_sewc5ZvbU&usqp=CAU", alt: "Styled locs with design" },
    { id: 4, url: "https://i.pinimg.com/736x/8e/0f/3f/8e0f3f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs retwist pattern" },
    { id: 5, url: "https://i.pinimg.com/originals/0e/8f/3f/0e8f3f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Fresh locs with design" },
    { id: 6, url: "https://i.pinimg.com/564x/8e/0f/3f/8e0f3f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs pattern style" },
    { id: 7, url: "https://i.pinimg.com/originals/3f/8e/0f/3f8e0f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs with fade and pattern" },
    { id: 8, url: "https://i.pinimg.com/736x/3f/8e/0f/3f8e0f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Styled locs back view" },
    { id: 9, url: "https://i.pinimg.com/564x/3f/8e/0f/3f8e0f0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs with geometric pattern" },
    { id: 10, url: "https://i.pinimg.com/originals/0f/3f/8e/0f3f8e0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs updo with pattern" },
    { id: 11, url: "https://i.pinimg.com/736x/0f/3f/8e/0f3f8e0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Fresh locs retwist" },
    { id: 12, url: "https://i.pinimg.com/564x/0f/3f/8e/0f3f8e0a8c0e8f8e8f8e8f8e8f8e8f8e.jpg", alt: "Locs with creative design" },
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
