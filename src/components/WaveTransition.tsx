import React from 'react';
import { motion } from 'motion/react';

interface WaveTransitionProps {
  position?: 'top' | 'bottom';
  className?: string;
  fillColor?: string;
  secondaryFillColor?: string;
  variant?: 'gentle' | 'crest' | 'layered';
  animated?: boolean;
}

export const WaveTransition: React.FC<WaveTransitionProps> = ({
  position = 'bottom',
  className = '',
  fillColor = 'currentColor',
  secondaryFillColor,
  variant = 'layered',
  animated = true,
}) => {
  const isTop = position === 'top';

  return (
    <div 
      aria-hidden="true"
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        isTop ? 'rotate-180' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block"
      >
        {/* Layer 1: Background Soft Flow Wave */}
        {secondaryFillColor && (
          <motion.path
            d={
              variant === 'crest'
                ? "M0,64L48,58.7C96,53,192,43,288,48C384,53,480,75,576,80C672,85,768,75,864,64C960,53,1056,43,1152,48C1248,53,1344,75,1392,85.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                : "M0,32L48,42.7C96,53,192,75,288,74.7C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            }
            fill={secondaryFillColor}
            initial={animated ? { opacity: 0.35, y: 4 } : false}
            animate={animated ? { 
              y: [0, -4, 0],
              opacity: [0.3, 0.5, 0.3]
            } : false}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Layer 2: Foreground Crisp Wave */}
        <motion.path
          d={
            variant === 'crest'
              ? "M0,32L48,42.7C96,53,192,75,288,69.3C384,64,480,32,576,32C672,32,768,64,864,69.3C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              : "M0,48L48,58.7C96,69,192,91,288,85.3C384,80,480,48,576,42.7C672,37,768,59,864,64C960,69,1056,59,1152,53.3C1248,48,1344,48,1392,48L1440,48L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          }
          fill={fillColor}
          initial={animated ? { opacity: 0.95, y: 0 } : false}
          animate={animated ? { 
            y: [0, 3, 0],
          } : false}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
      </svg>
    </div>
  );
};
