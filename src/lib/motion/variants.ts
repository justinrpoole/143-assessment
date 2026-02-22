/**
 * Shared Framer Motion variants for the 143 Leadership cosmic design system.
 *
 * All durations use the cosmic timing scale:
 *   fast   = 160ms (micro-interactions)
 *   base   = 300ms (standard transitions)
 *   slow   = 500ms (entrance animations)
 *   reveal = 800ms (dramatic reveals)
 *
 * Easing: custom cubic-bezier [0.2, 0.8, 0.2, 1] — smooth deceleration.
 */

import type { Variants, Transition } from "framer-motion";

/* ── Easing ── */

export const COSMIC_EASE = [0.2, 0.8, 0.2, 1] as const;
export const COSMIC_SPRING = { type: "spring" as const, stiffness: 120, damping: 20 };
export const COSMIC_SPRING_SOFT = { type: "spring" as const, stiffness: 60, damping: 18 };

/* ── Timing ── */

export const TIMING = {
  fast: 0.16,
  base: 0.3,
  slow: 0.5,
  reveal: 0.8,
} as const;

/* ── Fade Variants ── */

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: TIMING.slow, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.slow, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.slow, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const fadeInScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: TIMING.reveal, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/* ── Stagger Container ── */

export function staggerContainer(
  staggerDelay = 0.08,
  delayChildren = 0,
): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
  },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/* ── Page Transition ── */

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: TIMING.base, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: [0.2, 0.8, 0.2, 1] },
  },
};

/* ── Score Count-Up ── */

export const scoreReveal: Transition = {
  duration: 1.2,
  ease: [0.16, 1, 0.3, 1], // aggressive deceleration for count-up feel
};

/* ── Card Hover (for whileHover/whileTap) ── */

export const cardHover = {
  y: -2,
  transition: { duration: TIMING.fast, ease: [0.2, 0.8, 0.2, 1] },
};

export const cardTap = {
  y: 0,
  scale: 0.99,
  transition: { duration: 0.1 },
};

/* ── Modal / Panel ── */

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: TIMING.base, ease: [0.2, 0.8, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 16,
    transition: { duration: 0.2 },
  },
};

/* ── Slide Panels ── */

export const slideUp: Variants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ...COSMIC_SPRING },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.2 },
  },
};

export const slideRight: Variants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: 0,
    transition: { ...COSMIC_SPRING },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: { duration: 0.2 },
  },
};
