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
      className={`${variants} ${className ?? ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        background: ramp.bgTint,
        borderColor: ramp.border,
        borderWidth: '1px',
        borderStyle: 'solid',
        // CSS custom properties for hover state (consumed by cosmic.css)
        '--ray-hover-border': ramp.hoverBorder,
        '--ray-glow': ramp.glow,
        '--ray-active': ramp.activeBorder,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = ramp.hoverBorder;
        e.currentTarget.style.boxShadow = `0 0 20px ${ramp.glow}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = ramp.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {children}
    </div>
  );
}
