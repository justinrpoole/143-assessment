'use client';

import type { ReactNode } from 'react';
import { rayRamp } from '@/lib/ui/ray-colors';

interface RayGlowCardProps {
  /** Ray identifier: "R1"-"R9" or ray name */
  ray?: string;
  children: ReactNode;
  className?: string;
  /** Enable 3D tilt on hover (glass-card--magnetic) */
  magnetic?: boolean;
  /** Enable hover lift (glass-card--lift) */
  lift?: boolean;
  /** onClick handler */
  onClick?: () => void;
}

/**
 * Glass-card variant with ray-colored border, hover glow, and background tint.
 * Uses the opacity ramp from ray-colors.ts for consistent graduated color.
 */
export default function RayGlowCard({
  ray = 'R9',
  children,
  className,
  magnetic,
  lift,
  onClick,
}: RayGlowCardProps) {
  const ramp = rayRamp(ray);

  const variants = [
    'glass-card',
    magnetic && 'glass-card--magnetic',
    lift && 'glass-card--lift',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={`ray-glow-card ${variants} ${className ?? ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        '--ray-bg': ramp.bgTint,
        '--ray-border': ramp.border,
        // CSS custom properties for hover state (consumed by cosmic.css)
        '--ray-hover-border': ramp.hoverBorder,
        '--ray-glow': ramp.glow,
        '--ray-active': ramp.activeBorder,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
