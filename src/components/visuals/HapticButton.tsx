import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

interface RippleInstance {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface HapticButtonProps {
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'data-testid'?: string;
  rippleTone?: 'dark' | 'champagne';
}

/**
 * Core BoL Button with Physics-Simulated Micro-Haptic Feedback & Visual Click Ripple.
 * - Uses Framer Motion spring dynamics for press/release and a damped micro-vibration impulse.
 * - Spawns a coordinate-anchored radial click ripple clipped cleanly to the button surface.
 * - Respects `prefers-reduced-motion`.
 */
export const HapticButton: React.FC<HapticButtonProps> = ({
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  children,
  'aria-label': ariaLabel,
  'aria-pressed': ariaPressed,
  'data-testid': dataTestId,
  rippleTone = 'dark',
}) => {
  const prefersReducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const [pulseCount, setPulseCount] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Trigger native light haptic pulse on supported touch/mobile devices
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore vibration permission errors on desktop browsers
      }
    }

    // Trigger physics-simulated micro-vibration state
    setPulseCount((c) => c + 1);
    setIsPulsing(true);
    window.setTimeout(() => {
      setIsPulsing(false);
    }, 220);

    // Compute ripple origin relative to button bounds
    if (buttonRef.current && !prefersReducedMotion) {
      const rect = buttonRef.current.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.15;
      const clientX = e.clientX || rect.left + rect.width / 2;
      const clientY = e.clientY || rect.top + rect.height / 2;
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;
      const newRipple: RippleInstance = {
        id: Date.now() + Math.random(),
        x,
        y,
        size,
      };
      setRipples((prev) => [...prev.slice(-2), newRipple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 540);
    }

    onClick?.(e);
  };

  const rippleColorClass =
    rippleTone === 'champagne'
      ? 'bg-[#D8B98A]/35'
      : 'bg-[#0B0B0C]/25';

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      data-testid={dataTestId}
      data-haptic-button="true"
      data-haptic-pulsing={isPulsing ? 'true' : 'false'}
      data-haptic-count={pulseCount}
      onClick={handleClick}
      whileHover={
        !disabled && !prefersReducedMotion
          ? { scale: 1.015, y: -1 }
          : undefined
      }
      whileTap={
        !disabled && !prefersReducedMotion
          ? { scale: 0.962, y: 1 }
          : undefined
      }
      animate={
        !prefersReducedMotion && isPulsing
          ? {
              x: [0, -1.6, 1.6, -0.9, 0.5, 0],
              transition: { duration: 0.18, ease: 'easeInOut' },
            }
          : { x: 0 }
      }
      transition={{
        type: 'spring',
        stiffness: 520,
        damping: 22,
        mass: 0.6,
      }}
      className={`bol-haptic-btn relative overflow-hidden select-none ${className}`}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            data-testid="haptic-ripple"
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0.48 }}
            animate={{ scale: 3.1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{
              left: r.x,
              top: r.y,
              width: r.size,
              height: r.size,
            }}
            className={`bol-haptic-ripple pointer-events-none absolute rounded-full ${rippleColorClass}`}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10 inline-flex items-center justify-center gap-inherit">
        {children}
      </span>
    </motion.button>
  );
};
