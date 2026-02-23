'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface MandalaPhasesProps {
  /** Current position (1-9) in the cycle */
  currentPosition?: number;
  /** Overall score 0-100 to auto-determine position */
  score?: number;
}

/**
 * Mandala Phases (#19) — Circular Phase Cycle
 *
 * Nine sun states arranged in a perfect circle showing the eclipse-to-sun
 * cycle and back. Center holds a persistent seed of gold light.
 * v3 branded: gold phases on royal purple, sacred geometry.
 */
export default function MandalaPhases({ currentPosition, score }: MandalaPhasesProps) {
  const reducedMotion = useReducedMotion();
  const W = 500;
  const H = 500;
  const cx = W / 2;
  const cy = H / 2;
  const R = 180; // circle radius

  // Auto-determine position from score if not explicitly set
  const activePos = currentPosition ?? Math.max(1, Math.min(9, Math.ceil((score ?? 50) / 11.2)));

  // Nine positions clockwise from 12 o'clock
  const positions = Array.from({ length: 9 }).map((_, i) => {
    const angle = (i / 9) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * R,
      y: cy + Math.sin(angle) * R,
      angle,
      index: i + 1,
    };
  });

  // Phase descriptions for each position
  const phaseData = [
    { beams: 0, fill: 0, label: 'Eclipsed' },
    { beams: 0, fill: 0.12, label: 'Crescent' },
    { beams: 0, fill: 0.25, label: 'Quarter' },
    { beams: 0, fill: 0.5, label: 'Half' },
    { beams: 2, fill: 0.75, label: 'Waxing' },
    { beams: 12, fill: 1.0, label: 'Full Sun' },
    { beams: 8, fill: 1.0, label: 'Corona' },
    { beams: 16, fill: 1.0, label: 'Nova' },
    { beams: 0, fill: 0.6, label: 'Nebula' },
  ];

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Cycle Mandala
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label={`Cycle mandala — position ${activePos} of 9`}>
        <rect width={W} height={H} rx="12" fill="var(--cosmic-svg-bg)" />

        <defs>
          <filter id="mp-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Connecting circle */}
        {positions.map((pos, i) => {
          const next = positions[(i + 1) % 9];
          return (
            <line
              key={`conn-${i}`}
              x1={pos.x}
              y1={pos.y}
              x2={next.x}
              y2={next.y}
              stroke="#F4C430"
              strokeWidth={0.6}
              strokeOpacity={0.12}
            />
          );
        })}

        {/* Center seed */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={4}
          fill="#F4C430"
          initial={false}
          animate={
            !reducedMotion
              ? { opacity: [0.4, 0.7, 0.4] }
              : { opacity: 0.5 }
          }
          transition={!reducedMotion ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
        />

        {/* Nine phase suns */}
        {positions.map((pos, i) => {
          const phase = phaseData[i];
          const isActive = activePos === pos.index;
          const sunR = 18;

          return (
            <g key={pos.index}>
              {/* Active indicator ring */}
              {isActive && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={sunR + 8}
                  fill="none"
                  stroke="#F4C430"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  initial={false}
                  animate={!reducedMotion ? { strokeOpacity: [0.2, 0.5, 0.2] } : { strokeOpacity: 0.35 }}
                  transition={!reducedMotion ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : undefined}
                />
              )}

              {/* Eclipse/dark disc for positions 1-5 */}
              {phase.fill < 1 && (
                <>
                  {/* Dark disc */}
                  <circle cx={pos.x} cy={pos.y} r={sunR} fill="#2C2C2C" opacity={0.8} />
                  {/* Partial gold fill */}
                  <clipPath id={`mp-clip-${i}`}>
                    <rect
                      x={pos.x - sunR + sunR * 2 * (1 - phase.fill)}
                      y={pos.y - sunR}
                      width={sunR * 2 * phase.fill}
                      height={sunR * 2}
                    />
                  </clipPath>
                  <circle cx={pos.x} cy={pos.y} r={sunR - 1} fill="#F4C430" opacity={isActive ? 0.8 : 0.5} clipPath={`url(#mp-clip-${i})`} />
                  {/* Corona ring for eclipsed */}
                  {phase.fill === 0 && (
                    <circle cx={pos.x} cy={pos.y} r={sunR + 1} fill="none" stroke="#8E44AD" strokeWidth={1} strokeOpacity={0.3} />
                  )}
                </>
              )}

              {/* Full sun for positions 6-9 */}
              {phase.fill === 1 && i < 8 && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={sunR} fill="#F4C430" opacity={isActive ? 0.9 : 0.6} filter={isActive ? 'url(#mp-glow)' : undefined} />
                  <circle cx={pos.x} cy={pos.y} r={sunR * 0.45} fill="#FFFFFF" opacity={0.5} />
                  {/* Beams */}
                  {Array.from({ length: phase.beams }).map((_, bi) => {
                    const bAngle = (bi / phase.beams) * Math.PI * 2;
                    const innerR = sunR + 2;
                    const outerR = sunR + (i === 7 ? 14 : 8); // Nova gets longer beams
                    return (
                      <line
                        key={bi}
                        x1={pos.x + Math.cos(bAngle) * innerR}
                        y1={pos.y + Math.sin(bAngle) * innerR}
                        x2={pos.x + Math.cos(bAngle) * outerR}
                        y2={pos.y + Math.sin(bAngle) * outerR}
                        stroke={i === 7 ? '#FFFFFF' : '#F4C430'}
                        strokeWidth={i === 7 ? 1.5 : 1}
                        strokeOpacity={isActive ? 0.6 : 0.3}
                      />
                    );
                  })}
                  {/* Corona expansion for position 7 */}
                  {i === 6 && (
                    <circle cx={pos.x} cy={pos.y} r={sunR + 10} fill="#E8A317" opacity={0.08} />
                  )}
                </>
              )}

              {/* Nebula for position 9 */}
              {i === 8 && (
                <>
                  <circle cx={pos.x} cy={pos.y} r={sunR + 5} fill="#F5E6CC" opacity={0.06} />
                  <circle cx={pos.x} cy={pos.y} r={sunR} fill="#C39BD3" opacity={0.12} />
                  <circle cx={pos.x} cy={pos.y} r={sunR * 0.6} fill="#F4C430" opacity={isActive ? 0.5 : 0.3} />
                  <circle cx={pos.x} cy={pos.y} r={3} fill="#F4C430" opacity={0.7} />
                </>
              )}

              {/* Phase label */}
              <text
                x={pos.x}
                y={pos.y + sunR + 14}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="7"
                fontWeight={isActive ? '600' : '400'}
                opacity={isActive ? 0.7 : 0.3}
              >
                {phase.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
