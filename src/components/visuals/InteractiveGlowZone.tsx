import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';

interface InteractiveGlowZoneProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'medium';
}

/**
 * InteractiveGlowZone
 * Uses Framer Motion's useMotionValue + useSpring to render cursor-following
 * champagne-gold and wine-velvet shimmer bubbles inside interaction-dense areas.
 */
export const InteractiveGlowZone: React.FC<InteractiveGlowZoneProps> = ({
  children,
  className = '',
  intensity = 'medium',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(360);
  const mouseY = useMotionValue(240);

  // Primary responsive shimmer bubble
  const springX = useSpring(mouseX, { stiffness: 260, damping: 28, mass: 0.45 });
  const springY = useSpring(mouseY, { stiffness: 260, damping: 28, mass: 0.45 });

  // Secondary trailing satellite micro-bubble for depth
  const trailX = useSpring(mouseX, { stiffness: 120, damping: 24, mass: 0.85 });
  const trailY = useSpring(mouseY, { stiffness: 120, damping: 24, mass: 0.85 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      if (!isHovered) {
        setIsHovered(true);
      }
    },
    [prefersReducedMotion, mouseX, mouseY, isHovered]
  );

  const primaryOpacity = intensity === 'medium' ? 0.24 : 0.14;
  const secondaryOpacity = intensity === 'medium' ? 0.16 : 0.09;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      data-testid="interactive-glow-zone"
    >
      {!prefersReducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
        >
          {/* Primary champagne-gold shimmer bubble */}
          <motion.div
            data-testid="cursor-glow-bubble"
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              opacity: isHovered ? primaryOpacity : 0.06,
              scale: isHovered ? 1 : 0.78,
            }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 h-64 w-64 rounded-full blur-2xl"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(216,185,138,0.65) 0%, rgba(191,137,67,0.28) 45%, rgba(92,16,32,0) 75%)',
              }}
            />
          </motion.div>

          {/* Secondary trailing micro-bubble */}
          <motion.div
            style={{
              x: trailX,
              y: trailY,
              translateX: '-35%',
              translateY: '-35%',
            }}
            animate={{
              opacity: isHovered ? secondaryOpacity : 0.03,
              scale: isHovered ? 1.05 : 0.7,
            }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-0 h-36 w-36 rounded-full blur-xl"
          >
            <div
              className="h-full w-full rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(244,239,230,0.45) 0%, rgba(216,185,138,0.22) 50%, transparent 80%)',
              }}
            />
          </motion.div>
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
