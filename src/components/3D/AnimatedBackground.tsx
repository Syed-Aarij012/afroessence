import { useEffect, useState } from 'react';

export const AnimatedBackground = ({ children }: { children: React.ReactNode }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="fixed inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, 
              hsl(var(--accent)) 0%, 
              hsl(var(--primary)) 25%, 
              transparent 50%),
            linear-gradient(45deg, 
              hsl(var(--background)) 0%, 
              hsl(var(--muted)) 100%)
          `,
          transition: 'background 0.3s ease',
        }}
      />

      {/* Floating geometric shapes */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-10"
            style={{
              left: `${10 + (i * 12)}%`,
              top: `${20 + (i * 8)}%`,
              animation: `float ${4 + (i * 0.5)}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <div className="w-16 h-16 border-2 border-accent rotate-45" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export const ParallaxSection = ({ 
  children, 
  speed = 0.5,
  className = '' 
}: {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{
        transform: `translateY(${scrollY * speed}px)`,
      }}
    >
      {children}
    </div>
  );
};