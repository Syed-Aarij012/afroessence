import { useEffect, useState } from 'react';

interface FloatingElementProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  amplitude?: number;
}

export const FloatingElement = ({ 
  children, 
  delay = 0, 
  duration = 3, 
  amplitude = 10 
}: FloatingElementProps) => {
  // Disabled animations - just render children without floating effect
  return <div>{children}</div>;
};

export const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle}
          className="absolute w-1 h-1 bg-accent/20 rounded-full animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export const GradientOrb = ({ 
  size = 200, 
  color = 'accent', 
  className = '' 
}: {
  size?: number;
  color?: string;
  className?: string;
}) => {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsl(var(--${color})) 0%, transparent 70%)`,
        animation: 'float 6s ease-in-out infinite, pulse 4s ease-in-out infinite',
      }}
    />
  );
};