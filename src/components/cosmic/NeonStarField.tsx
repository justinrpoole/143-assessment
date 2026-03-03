'use client';

import { useMemo } from 'react';

const RAY_COLORS = [
  'var(--text-body)', // R1 Intention — blue
  'var(--gold-primary)', // R2 Joy — gold
  'var(--neon-violet)', // R3 Presence — violet
  'var(--text-body)', // R4 Power — red
  'var(--neon-amber)', // R5 Purpose — amber
  'var(--text-body)', // R6 Authenticity — green
  'var(--text-body)', // R7 Connection — pink
  'var(--text-body)', // R8 Possibility — teal
  'var(--gold-primary)', // R9 Be The Light — bright gold
];

interface Star {
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  delay: number;
  duration: number;
  glow: number;
}

function makeStars(count: number, seed: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const s1 = ((i * 1597 + seed) * 6364136223846793005 + 1442695040888963407) % 4294967296;
    const s2 = ((s1 * 1597 + 3) * 2654435761) % 4294967296;
    const s3 = ((s2 * 1597 + 7) * 2246822519) % 4294967296;
    const s4 = ((s3 + i * 37) * 1664525) % 4294967296;
    const s5 = ((s4 * 1597 + 11) * 1013904223) % 4294967296;
    const s6 = ((s5 + seed) * 2654435761) % 4294967296;

    const isNeon = (s3 % 10) < 3; // 30% neon colored, 70% white/silver
    stars.push({
      x: (s1 % 10000) / 100,
      y: (s2 % 10000) / 100,
      size: isNeon ? 1.5 + (s3 % 30) / 10 : 0.5 + (s3 % 15) / 10,
      color: isNeon ? RAY_COLORS[s4 % RAY_COLORS.length] : `var(--surface-border) / 100})`,
      opacity: isNeon ? 0.6 + (s5 % 40) / 100 : 0.2 + (s6 % 50) / 100,
      delay: (s4 % 60) / 10,
      duration: 3 + (s5 % 50) / 10,
      glow: isNeon ? 2 + (s6 % 8) : 0,
    });
  }
  return stars;
}

interface NeonStarFieldProps {
  count?: number;
  className?: string;
  /** Render as a star chart with constellation lines between same-ray stars */
  showConstellations?: boolean;
}

export default function NeonStarField({
  count = 80,
  className,
  showConstellations = false,
}: NeonStarFieldProps) {
  const stars = useMemo(() => makeStars(count, 143), [count]);
  const neonStars = stars.filter(s => s.glow > 0);

  // Group neon stars by color for constellation lines
  const constellationGroups = useMemo(() => {
    if (!showConstellations) return [];
    const groups: Record<string, Star[]> = {};
    neonStars.forEach(star => {
      const key = star.color;
      if (!groups[key]) groups[key] = [];
      groups[key].push(star);
    });
    return Object.entries(groups).filter(([, g]) => g.length >= 2).slice(0, 5);
  }, [neonStars, showConstellations]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
      aria-hidden="true"
    >
      {/* Constellation lines */}
      {showConstellations && constellationGroups.length > 0 && (
        <svg
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.15 }}
        >
          {constellationGroups.map(([color, group]) =>
            group.slice(0, -1).map((star, i) => {
              const next = group[i + 1];
              return (
                <line
                  key={`${color}-${i}`}
                  x1={`${star.x}%`}
                  y1={`${star.y}%`}
                  x2={`${next.x}%`}
                  y2={`${next.y}%`}
                  stroke={color}
                  strokeWidth="0.5"
                  strokeDasharray="2 4"
                />
              );
            })
          )}
        </svg>
      )}

      {/* Stars */}
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            background: star.color,
            opacity: star.opacity,
            boxShadow: star.glow > 0
              ? `0 0 ${star.glow}px ${star.glow / 2}px ${star.color}`
              : 'none',
            animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            willChange: 'opacity, transform',
          }}
        />
      ))}
    </div>
  );
}
