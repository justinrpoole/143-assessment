'use client';

import type { ReactNode } from 'react';

interface ConicBorderCardProps {
  children: ReactNode;
  /** Additional className on outer wrapper */
  className?: string;
  /** Enable glow blur on the border (default true) */
  glow?: boolean;
}

/**
 * ConicBorderCard — Glass card with animated rotating conic-gradient border.
 * Creates a spotlight sweep effect using CSS @property --conic-angle.
 * Falls back to static gold border if @property is unsupported.
 */
export default function ConicBorderCard({
  children,
  className = '',
  glow = true,
}: ConicBorderCardProps) {
  return (
    <div className={`conic-border-card ${glow ? 'conic-border-card--glow' : ''} ${className}`}>
      <div className="conic-border-card__inner glass-card p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
