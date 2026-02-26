'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

interface ScrollTextRevealProps {
  /** The text to reveal word by word */
  text: string;
  /** Additional className on the paragraph */
  className?: string;
  /** Text color when fully revealed (default: white) */
  color?: string;
}

function Word({
  children,
  progress,
  range,
  color,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  color: string;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);

  return (
    <span className="relative mr-[0.3em] inline-block">
      {/* Shadow text (always visible at low opacity for layout and context) */}
      <span style={{ opacity: 0.12, color }}>{children}</span>
      {/* Animated text layered on top */}
      <motion.span
        className="absolute left-0 top-0"
        style={{ opacity, color }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/**
 * ScrollTextReveal — Text reveals word-by-word as the user scrolls.
 * Each word independently fades from 12% to 100% opacity based on scroll position.
 * Falls back to fully visible text when prefers-reduced-motion is active.
 */
export default function ScrollTextReveal({
  text,
  className = '',
  color = 'var(--text-on-dark, rgba(255,255,255,0.94))',
}: ScrollTextRevealProps) {
  const prefersReduced = useReducedMotion();
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start 0.9', 'start 0.3'],
  });

  const words = text.split(' ');

  if (prefersReduced) {
    return (
      <p className={className} style={{ color }}>
        {text}
      </p>
    );
  }

  return (
    <p
      ref={container}
      className={`flex flex-wrap ${className}`}
      style={{ lineHeight: 1.4 }}
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            color={color}
          >
            {word}
          </Word>
        );
      })}
    </p>
  );
}
