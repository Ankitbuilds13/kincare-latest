import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export const InteractiveBackground: React.FC = () => {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 500);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  // Smooth springs for fluid tracking without sudden jumps
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 120 });
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 120 });

  // Floating ambient particle seeds
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; baseSpeed: number }>>([]);

  useEffect(() => {
    // Generate gentle background particles
    const items = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      baseSpeed: Math.random() * 20 + 15,
    }));
    setParticles(items);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div 
      aria-hidden="true" 
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none transition-opacity duration-700"
    >
      {/* Primary Interactive Mouse Spotlight (Follows cursor smoothly) */}
      <motion.div
        className="absolute rounded-full filter blur-[80px] sm:blur-[120px] will-change-transform"
        style={{
          width: 500,
          height: 500,
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-tr from-teal-400/20 via-emerald-400/15 to-cyan-500/10 dark:from-teal-500/15 dark:via-emerald-500/10 dark:to-teal-300/10" />
      </motion.div>

      {/* Secondary Counter-Glow (Slightly lagged and offset for depth) */}
      <motion.div
        className="absolute rounded-full filter blur-[100px] sm:blur-[140px] will-change-transform"
        style={{
          width: 400,
          height: 400,
          x: smoothX,
          y: smoothY,
          translateX: '-30%',
          translateY: '-70%',
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400/15 via-teal-300/10 to-transparent dark:from-cyan-600/15 dark:via-teal-600/10 dark:to-transparent" />
      </motion.div>

      {/* Subtle Ambient Wave Orbs in Corners */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-[90px]" />
      <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-[100px]" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-teal-600/10 dark:bg-teal-700/5 blur-[100px]" />

      {/* Ambient Micro-Particles drifting with CSS animations */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-teal-500/20 dark:bg-teal-300/20"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.15, 0.45, 0.15],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: p.baseSpeed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle fine medical dot matrix grid */}
      <div 
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
