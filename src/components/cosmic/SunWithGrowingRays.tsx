'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { rayHex } from '@/lib/ui/ray-colors';

interface SunWithGrowingRaysProps {
  /** Score values per ray ID (0-100). Drives ray beam length. */
  scores?: Record<string, number>;
  /** SVG viewport size in pixels */
  size?: number;
  /** Override className on the wrapper */
  className?: string;
}

const RAY_CONFIG = [
  { id: 'R1', label: 'Intention', angleDeg: 0 },
  { id: 'R2', label: 'Joy', angleDeg: 45 },
  { id: 'R3', label: 'Presence', angleDeg: 90 },
  { id: 'R4', label: 'Power', angleDeg: 135 },
  { id: 'R5', label: 'Purpose', angleDeg: 180 },
  { id: 'R6', label: 'Authenticity', angleDeg: 225 },
  { id: 'R7', label: 'Connection', angleDeg: 270 },
  { id: 'R8', label: 'Possibility', angleDeg: 315 },
];

/**
 * SunWithGrowingRays — SVG sun at center with 8 directional ray beams.
 * Beam length maps to score (0-100 → 20%-100% of max length).
 * Idle animation: sun breathes (scale 1.0→1.015, 6s cycle).
 * Reduced motion: static, all beams at full target length.
 */
export default function SunWithGrowingRays({
  scores,
  size = 200,
  className = '',
}: SunWithGrowingRaysProps) {
  const prefersReduced = useReducedMotion();

  const center = size / 2;
  const sunRadius = size * 0.14;
  const maxRayLen = size * 0.32;
  const minRayLen = maxRayLen * 0.2; // Minimum beam length even at score 0
  const rayWidth = Math.max(3, size * 0.025);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label="Sun with 8 rays representing leadership capacities"
    >
      <defs>
        <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="rayGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <radialGradient id="sunGrad" cx="40%" cy="40%">
          <stop offset="0%" stopColor="#FFFEF5" />
          <stop offset="40%" stopColor="#F8D011" />
          <stop offset="100%" stopColor="#D4770B" />
        </radialGradient>
      </defs>

      {/* Ambient corona glow */}
      <motion.circle
        cx={center}
        cy={center}
        r={sunRadius * 2.2}
        fill="none"
        stroke="rgba(248,208,17,0.08)"
        strokeWidth={sunRadius * 0.8}
        animate={
          prefersReduced
            ? undefined
            : {
                r: [sunRadius * 2, sunRadius * 2.4, sunRadius * 2],
                opacity: [0.4, 0.7, 0.4],
              }
        }
        transition={
          prefersReduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* 8 ray beams */}
      {RAY_CONFIG.map((ray, i) => {
        const hex = rayHex(ray.id);
        const score = scores?.[ray.id] ?? 60; // Default 60 if no data
        const rayLen = minRayLen + (maxRayLen - minRayLen) * (score / 100);
        const angleRad = (ray.angleDeg - 90) * (Math.PI / 180); // -90 to start from top

        const x1 = center + Math.cos(angleRad) * (sunRadius + 2);
        const y1 = center + Math.sin(angleRad) * (sunRadius + 2);
        const x2 = center + Math.cos(angleRad) * (sunRadius + rayLen);
        const y2 = center + Math.sin(angleRad) * (sunRadius + rayLen);

        return (
          <g key={ray.id}>
            {/* Ray beam line */}
            <motion.line
              x1={x1}
              y1={y1}
              x2={prefersReduced ? x2 : undefined}
              y2={prefersReduced ? y2 : undefined}
              stroke={hex}
              strokeWidth={rayWidth}
              strokeLinecap="round"
              filter="url(#rayGlow)"
              opacity={0.85}
              initial={prefersReduced ? undefined : { x2: x1, y2: y1 }}
              whileInView={prefersReduced ? undefined : { x2, y2 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.0,
                delay: i * 0.08,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            />

            {/* Ray tip dot */}
            <motion.circle
              r={rayWidth * 0.7}
              fill={hex}
              opacity={0.9}
              initial={prefersReduced ? { cx: x2, cy: y2 } : { cx: x1, cy: y1, opacity: 0 }}
              whileInView={prefersReduced ? undefined : { cx: x2, cy: y2, opacity: 0.9 }}
              viewport={{ once: true }}
              transition={{
                duration: 1.0,
                delay: i * 0.08,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            />
          </g>
        );
      })}

      {/* Sun core */}
      <motion.circle
        cx={center}
        cy={center}
        r={sunRadius}
        fill="url(#sunGrad)"
        filter="url(#sunGlow)"
        animate={
          prefersReduced
            ? undefined
            : { r: [sunRadius, sunRadius * 1.04, sunRadius] }
        }
        transition={
          prefersReduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
      />

      {/* Inner highlight */}
      <circle
        cx={center - sunRadius * 0.2}
        cy={center - sunRadius * 0.2}
        r={sunRadius * 0.35}
        fill="rgba(255,255,255,0.25)"
      />
    </svg>
  );
}
