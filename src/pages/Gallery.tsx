import { useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-6">
              Our Gallery
            </h1>
            <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
              Explore our work and get inspired for your next look
            </p>
            <div className="w-32 h-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 mx-auto mt-6"></div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 cursor-pointer transform hover:scale-105 border border-amber-500/20"
                onClick={() => setSelectedImage(image.url)}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="aspect-square">
                  <img 
                    src={image.url} 
                    alt={image.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-amber-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-amber-500/20 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300 border border-amber-500/50">
                    <ZoomIn className="h-8 w-8 text-amber-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white hover:text-purple-400 transition-colors duration-300 bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div className="relative max-w-6xl max-h-full">
            <img 
              src={selectedImage} 
              alt="Selected work" 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
