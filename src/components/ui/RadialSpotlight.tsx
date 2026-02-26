'use client';

import { useRef, useState, useCallback, type ReactNode } from 'react';

interface RadialSpotlightProps {
  children: ReactNode;
  /** Spotlight color (default: subtle gold glow) */
  color?: string;
  /** Spotlight radius in px */
  radius?: number;
  /** Additional className */
  className?: string;
}

/**
 * RadialSpotlight — Wrapper that shows a mouse-following radial gradient glow.
 * The spotlight follows the cursor within the section, fading in on enter and out on leave.
 */
export default function RadialSpotlight({
  children,
  color = 'rgba(248,208,17,0.06)',
  radius = 300,
  className = '',
}: RadialSpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          opacity,
          transition: 'opacity 0.4s ease',
          background: `radial-gradient(${radius}px circle at ${pos.x}px ${pos.y}px, ${color}, transparent 70%)`,
        }}
      />
      {/* Content — above spotlight */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
