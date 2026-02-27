'use client';

import type { ReactNode } from 'react';
import { rayRamp, resolveRay } from '@/lib/ui/ray-colors';

interface RayAccentSectionProps {
  /** Ray identifier: "R1"-"R9" or ray name like "Presence" */
  ray?: string;
  /** Optional label shown above children in the ray's color */
  label?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section wrapper that themes its content with a ray color.
 * Applies: left border accent, subtle background tint, label color.
 * Falls back to brand gold (R9) if no ray specified.
 */
export default function RayAccentSection({
  ray = 'R9',
  label,
  children,
  className,
}: RayAccentSectionProps) {
  const ramp = rayRamp(ray);
  const info = resolveRay(ray);

  return (
    <section
      className={`rounded-lg ${className ?? ''}`}
      style={{
        background: ramp.bgTint,
        borderLeft: `3px solid ${ramp.activeBorder}`,
        padding: '1.25rem 1.5rem',
      }}
    >
      {label && (
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: ramp.full }}
        >
          {label}
        </p>
      )}
      {children}
    </section>
  );
}
