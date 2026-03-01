'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type MarginValue = `${number}${"px" | "%"}`;
type MarginType = MarginValue | `${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue}` | `${MarginValue} ${MarginValue} ${MarginValue} ${MarginValue}`;

interface FadeInSectionProps {
  children: ReactNode;
  /** Delay in seconds before the animation starts */
  delay?: number;
  /** Direction to slide from */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none' | 'scale';
  className?: string;
  /** Trigger margin for intersection observer (default: '-60px') */
  margin?: MarginType;
  /** Apply blur-entrance effect: starts blurred and deblurs on reveal (0.8s) */
  blur?: boolean;
}

const OFFSETS: Record<string, Record<string, number>> = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 32 },
  right: { x: -32 },
  scale: { scale: 0.88 },
  none: {},
};

/* Spring physics presets — snappy with slight overshoot for premium feel */
const SPRING_SMOOTH = { type: 'spring' as const, stiffness: 80, damping: 20, mass: 0.8 };
const SPRING_BLUR = { type: 'spring' as const, stiffness: 60, damping: 18, mass: 1 };

export function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className,
  margin = '0px' as MarginType,
  blur = false,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = OFFSETS[direction];

  /* When blur is enabled, start with filter: blur(2px) and animate to blur(0px) */
  const initialState = blur
    ? { opacity: 0, filter: 'blur(2px)', ...offset }
    : { opacity: 0, ...offset };

  const animateState = isInView
    ? { opacity: 1, x: 0, y: 0, scale: 1, ...(blur ? { filter: 'blur(0px)' } : {}) }
    : initialState;

  return (
    <motion.div
      ref={ref}
      initial={initialState}
      animate={animateState}
      transition={{
        ...(blur ? SPRING_BLUR : SPRING_SMOOTH),
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  /** Base delay before stagger begins */
  baseDelay?: number;
  /** Delay between each child */
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  className,
  baseDelay = 0,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: baseDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 22, mass: 0.7 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
