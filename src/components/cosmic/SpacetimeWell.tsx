'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useMemo } from 'react';
import type { RayOutput } from '@/lib/types';

interface SpacetimeWellProps {
  rays: Record<string, RayOutput>;
}

/**
 * Spacetime Well (#17) — Gravitational Curvature Gauge
 *
 * Classic GR rubber-sheet gravity well with gold grid on purple.
 * 143 brand sun at the deepest point. Orbiting objects sit in grooves.
 * Arrow vectors at perimeter confirm even force distribution.
 * v3 branded: gold grid on royal purple, sun mark at center.
 */
export default function SpacetimeWell({ rays }: SpacetimeWellProps) {
  const reducedMotion = useReducedMotion();
  const W = 500;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2;

  // Gravitational depth from overall score
  const depth = useMemo(() => {
    const scores = Object.values(rays).map((r) => r.net_energy ?? r.score);
    if (scores.length === 0) return 50;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }, [rays]);

  const wellDepth = depth / 100; // 0 = shallow, 1 = deep

  // Generate grid lines that curve into the well
  const gridLines = useMemo(() => {
    const lines: Array<{ points: string; type: 'h' | 'v' }> = [];
    const gridSize = 25;
    const cols = Math.floor(W / gridSize);
    const rows = Math.floor(H / gridSize);

    // Horizontal lines
    for (let r = 0; r <= rows; r++) {
      const pts: string[] = [];
      for (let c = 0; c <= cols; c++) {
        const x = c * gridSize;
        const y = r * gridSize;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        const normDist = dist / maxDist;
        // Curvature: pull points toward center based on proximity
        const pullStrength = Math.max(0, 1 - normDist * 1.5) * wellDepth * 30;
        const newY = y + pullStrength * (1 - normDist);
        pts.push(`${x},${newY}`);
      }
      lines.push({ points: pts.join(' '), type: 'h' });
    }

    // Vertical lines
    for (let c = 0; c <= cols; c++) {
      const pts: string[] = [];
      for (let r = 0; r <= rows; r++) {
        const x = c * gridSize;
        const y = r * gridSize;
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.sqrt(cx * cx + cy * cy);
        const normDist = dist / maxDist;
        const pullStrength = Math.max(0, 1 - normDist * 1.5) * wellDepth * 30;
        const newY = y + pullStrength * (1 - normDist);
        pts.push(`${x},${newY}`);
      }
      lines.push({ points: pts.join(' '), type: 'v' });
    }

    return lines;
  }, [wellDepth, W, H, cx, cy]);

  // Orbital grooves: objects sitting at different depths
  const orbitals = useMemo(() => {
    return Object.entries(rays).slice(0, 5).map(([id, ray], idx) => {
      const angle = (idx / 5) * Math.PI * 2 - Math.PI / 2;
      const r = 60 + idx * 25;
      const normDist = r / 200;
      const yOffset = Math.max(0, 1 - normDist) * wellDepth * 15;
      return {
        id,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r + yOffset,
        score: ray.net_energy ?? ray.score,
      };
    });
  }, [rays, wellDepth, cx, cy]);

  // Perimeter arrow vectors
  const arrows = useMemo(() => {
    return Array.from({ length: 16 }).map((_, i) => {
      const angle = (i / 16) * Math.PI * 2;
      const r = 210;
      return {
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        angle,
      };
    });
  }, [cx, cy]);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Spacetime Curvature
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Spacetime gravity well — depth ${Math.round(depth)}%`}>
        <rect width={W} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

        {/* Gold grid */}
        {gridLines.map((line, i) => (
          <polyline
            key={i}
            points={line.points}
            fill="none"
            stroke="#F4C430"
            strokeWidth={0.5}
            strokeOpacity={0.25}
          />
        ))}

        {/* Center sun at deepest point */}
        <motion.circle
          cx={cx}
          cy={cy + wellDepth * 15}
          r={14}
          fill="#F4C430"
          opacity={0.8}
          filter="url(#sw-glow)"
          initial={false}
          animate={
            !reducedMotion
              ? { opacity: [0.7, 0.9, 0.7] }
              : undefined
          }
          transition={
            !reducedMotion ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined
          }
        />
        <circle cx={cx} cy={cy + wellDepth * 15} r={6} fill="#FFFFFF" opacity={0.6} />

        {/* Sun beams */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const sunY = cy + wellDepth * 15;
          return (
            <line
              key={i}
              x1={cx + Math.cos(angle) * 16}
              y1={sunY + Math.sin(angle) * 16}
              x2={cx + Math.cos(angle) * 24}
              y2={sunY + Math.sin(angle) * 24}
              stroke="#F4C430"
              strokeWidth={1.5}
              strokeOpacity={0.4}
            />
          );
        })}

        {/* Orbital objects */}
        {orbitals.map((obj) => (
          <g key={obj.id}>
            <circle cx={obj.x} cy={obj.y} r={6} fill="#FFFFFF" opacity={0.15} />
            <circle cx={obj.x} cy={obj.y} r={4} fill="#F4C430" opacity={0.7} />
          </g>
        ))}

        {/* Perimeter arrows pointing inward */}
        {arrows.map((a, i) => {
          const len = 12;
          const towardCenter = a.angle + Math.PI;
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={a.x + Math.cos(towardCenter) * len}
              y2={a.y + Math.sin(towardCenter) * len}
              stroke="#FFFFFF"
              strokeWidth={1}
              strokeOpacity={0.2}
              markerEnd="none"
            />
          );
        })}

        <defs>
          <filter id="sw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
}
