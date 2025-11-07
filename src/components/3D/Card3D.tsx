i import { useState } from 'react';
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
  return (
    <div className={`group relative ${className}`}>
      {/* Static glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-br from-accent/20 to-primary/20 transform scale-110" />
      
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