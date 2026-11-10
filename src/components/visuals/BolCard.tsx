import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface BolCardProps {
  as?: 'div' | 'article';
  delay?: number;
  hoverElevation?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLElement>) => void;
  'data-testid'?: string;
}

/**
 * Reusable BoL Editorial Luxury Card powered by Framer Motion (`motion/react`).
 * Provides entrance fade-in reveal (`whileInView`) and tactile hover elevation (`whileHover`),
 * while strictly respecting `prefers-reduced-motion`.
 */
export const BolCard: React.FC<BolCardProps> = ({
  as = 'div',
  delay = 0,
  hoverElevation = true,
  className = '',
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  'data-testid': dataTestId,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionComponent = as === 'article' ? motion.article : motion.div;

  const initialProps = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 18 };

  const whileInViewProps = { opacity: 1, y: 0 };

  const whileHoverProps =
    !prefersReducedMotion && hoverElevation
      ? {
          y: -5,
          scale: 1.005,
          boxShadow:
            '0 20px 44px -14px rgba(216, 185, 138, 0.18), 0 0 0 1px rgba(216, 185, 138, 0.45)',
        }
      : undefined;

  return (
    <MotionComponent
      initial={initialProps}
      whileInView={whileInViewProps}
      viewport={{ once: true, amount: 0.1 }}
      whileHover={whileHoverProps}
      transition={{
        duration: 0.48,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-testid={dataTestId}
      className={`bol-card ${className}`}
    >
      {children}
    </MotionComponent>
  );
};
