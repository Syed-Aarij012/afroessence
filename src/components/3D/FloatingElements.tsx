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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        '--amplitude': `${amplitude}px`,
      } as React.CSSProperties}
    >
      {children}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--amplitude));
          }
        }
      `}</style>
    </div>
  );
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