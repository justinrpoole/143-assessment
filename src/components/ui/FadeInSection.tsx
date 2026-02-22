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
}

const OFFSETS: Record<string, Record<string, number>> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  scale: { scale: 0.92 },
  none: {},
};

export function FadeInSection({
  children,
  delay = 0,
  direction = 'up',
  className,
  margin = '-60px' as MarginType,
}: FadeInSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin });
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const offset = OFFSETS[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...offset }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
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
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
