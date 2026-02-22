"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with a smooth fade-in + slight upward slide on mount.
 * Respects prefers-reduced-motion.
 *
 * Usage (in any page component):
 * ```tsx
 * <PageTransition>
 *   <main className="cosmic-page-bg">...</main>
 * </PageTransition>
 * ```
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
