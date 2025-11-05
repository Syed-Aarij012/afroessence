import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

export const Card3D = ({ 
  children, 
  className = '', 
  glowColor = 'accent',
  intensity = 1 
}: Card3DProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const transform = isHovered
    ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 20 * intensity}deg) rotateY(${(mousePosition.x - 0.5) * -20 * intensity}deg) translateZ(20px)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';

  return (
    <div
      className={`group relative transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ transform }}
    >
      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, hsl(var(--${glowColor})) 0%, transparent 70%)`,
          transform: 'scale(1.1)',
        }}
      />
      
      {/* Glass morphism overlay */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <Card className="relative border-border/50 group-hover:border-accent/50 transition-all duration-300 backdrop-blur-sm bg-card/80">
        {children}
      </Card>
    </div>
  );
};

export const InteractiveCard = ({ 
  children, 
  className = '',
  hoverScale = 1.05 
}: {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}) => {
  return (
    <div
      className={`group relative transition-all duration-500 hover:scale-${Math.round(hoverScale * 100)} ${className}`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform group-hover:scale-110" />
      <Card className="relative border-border/50 group-hover:border-accent/50 transition-all duration-500 backdrop-blur-sm bg-card/90 group-hover:shadow-2xl group-hover:shadow-accent/25">
        {children}
      </Card>
    </div>
  );
};