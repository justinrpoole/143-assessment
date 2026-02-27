'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const RAYS = [
  { name: 'Intention',    angle: -90,  arc: 'Reconnect' },
  { name: 'Joy',          angle: -50,  arc: 'Reconnect' },
  { name: 'Presence',     angle: -10,  arc: 'Reconnect' },
  { name: 'Power',        angle: 30,   arc: 'Radiate' },
  { name: 'Purpose',      angle: 70,   arc: 'Radiate' },
  { name: 'Authenticity', angle: 110,  arc: 'Radiate' },
  { name: 'Connection',   angle: 150,  arc: 'Become' },
  { name: 'Possibility',  angle: 190,  arc: 'Become' },
  { name: 'Be The Light', angle: 230,  arc: 'Become' },
] as const;

const ARC_COLORS: Record<string, string> = {
  Reconnect: 'rgba(248, 208, 17, 0.9)',
  Radiate:   'rgba(232, 163, 23, 0.9)',
  Become:    'rgba(167, 139, 250, 0.9)',
};

const ARC_COLORS_DIM: Record<string, string> = {
  Reconnect: 'rgba(248, 208, 17, 0.25)',
  Radiate:   'rgba(232, 163, 23, 0.25)',
  Become:    'rgba(167, 139, 250, 0.25)',
};

/**
 * 9-ray sun diagram — names only, no descriptions.
 * Central sun with 9 labeled rays radiating outward.
 * Three arcs: Reconnect (R1-3), Radiate (R4-6), Become (R7-9).
 * Rays draw in sequentially on scroll.
 */
export default function SunRayDiagram({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const prefersReduced = useReducedMotion();

  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const sunR = 36;
  const rayLength = 120;
  const labelOffset = 148;

  return (
    <div ref={ref} className={className}>
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" overflow="hidden" style={{ maxWidth: 480, margin: '0 auto', display: 'block' }}>
        <defs>
          {/* Sun core gradient */}
          <radialGradient id="srd-sun" cx="46%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="25%" stopColor="#FFF8D6" />
            <stop offset="50%" stopColor="#F8D011" />
            <stop offset="75%" stopColor="#F0B800" />
            <stop offset="100%" stopColor="#E89D0C" stopOpacity="0" />
          </radialGradient>

          {/* Corona */}
          <radialGradient id="srd-corona" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.35" />
            <stop offset="30%" stopColor="#F8D011" stopOpacity="0.12" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Bloom */}
          <filter id="srd-bloom" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Corona glow */}
        <circle cx={cx} cy={cy} r={sunR * 2.8} fill="url(#srd-corona)" />

        {/* Sun core */}
        <circle cx={cx} cy={cy} r={sunR} fill="url(#srd-sun)" filter="url(#srd-bloom)" />

        {/* Rays */}
        {RAYS.map((ray, i) => {
          const rad = (ray.angle * Math.PI) / 180;
          const x1 = cx + Math.cos(rad) * (sunR + 6);
          const y1 = cy + Math.sin(rad) * (sunR + 6);
          const x2 = cx + Math.cos(rad) * rayLength;
          const y2 = cy + Math.sin(rad) * rayLength;
          const lx = cx + Math.cos(rad) * labelOffset;
          const ly = cy + Math.sin(rad) * labelOffset;

          const color = ARC_COLORS[ray.arc];
          const colorDim = ARC_COLORS_DIM[ray.arc];

          // Text anchor based on angle quadrant
          const angleDeg = ((ray.angle % 360) + 360) % 360;
          const anchor = angleDeg > 90 && angleDeg < 270 ? 'end' : 'start';
          const textDx = anchor === 'end' ? -6 : 6;

          return (
            <g key={ray.name}>
              {/* Ray line */}
              <motion.line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                initial={prefersReduced ? { opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isInView ? { pathLength: 1, opacity: 1 } : undefined}
                transition={prefersReduced ? undefined : {
                  duration: 0.6,
                  delay: 0.15 * i,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
              />

              {/* Dot at ray tip */}
              <motion.circle
                cx={x2} cy={y2} r={3}
                fill={color}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : undefined}
                transition={prefersReduced ? undefined : {
                  duration: 0.3,
                  delay: 0.15 * i + 0.5,
                  ease: 'easeOut',
                }}
                style={{ transformOrigin: `${x2}px ${y2}px` }}
              />

              {/* Ray name label */}
              <motion.text
                x={lx + textDx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="central"
                fill={color}
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-body, Inter, sans-serif)"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={isInView ? { opacity: 1 } : undefined}
                transition={prefersReduced ? undefined : {
                  duration: 0.4,
                  delay: 0.15 * i + 0.6,
                }}
              >
                {ray.name}
              </motion.text>

              {/* Arc label — only on the middle ray of each group */}
              {(i === 1 || i === 4 || i === 7) && (
                <motion.text
                  x={lx + textDx}
                  y={ly + 16}
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fill={colorDim}
                  fontSize="9"
                  fontWeight="500"
                  fontFamily="var(--font-body, Inter, sans-serif)"
                  textDecoration="none"
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                  animate={isInView ? { opacity: 0.7 } : undefined}
                  transition={prefersReduced ? undefined : {
                    duration: 0.4,
                    delay: 0.15 * i + 0.8,
                  }}
                >
                  {ray.arc}
                </motion.text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
