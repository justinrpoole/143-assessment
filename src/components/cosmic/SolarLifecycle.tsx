'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface SolarLifecycleProps {
  /** Current phase (1-5) */
  currentPhase?: number;
}

function seededRandom(seed: number): number {
  return ((seed * 1597 + 51749) % 244944) / 244944;
}

const PHASES = [
  { label: 'I', name: 'Molecular Cloud', desc: 'Something is here but doesn\'t know it yet' },
  { label: 'II', name: 'Proto-Star', desc: 'First heat, brightness breaking through' },
  { label: 'III', name: 'Young Star', desc: 'Learning through intensity' },
  { label: 'IV', name: 'Mature Sun', desc: 'Embodied leadership, mature power' },
  { label: 'V', name: 'Supergiant', desc: 'Influence reaching others' },
];

/**
 * Solar Lifecycle (#18) — Framework Phases as Stellar Evolution
 *
 * Five celestial bodies horizontal left-to-right showing progression from
 * molecular cloud to supergiant. Current phase highlighted.
 * v3 branded: cooler left to warmer right on purple canvas.
 */
export default function SolarLifecycle({ currentPhase = 4 }: SolarLifecycleProps) {
  const reducedMotion = useReducedMotion();
  const W = 900;
  const H = 300;

  const phaseSpacing = W / (PHASES.length + 1);

  return (
    <div className="glass-card p-5">
      <p
        className="mb-3"
        style={{ color: 'var(--text-on-dark-secondary)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        Solar Lifecycle
      </p>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Solar lifecycle phases">
        <defs>
          <linearGradient id="sl-bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3A0A5E" />
            <stop offset="50%" stopColor="#4A0E78" />
            <stop offset="100%" stopColor="#5B2C8E" />
          </linearGradient>
          <filter id="sl-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Cloud turbulence */}
          <filter id="sl-cloud">
            <feTurbulence baseFrequency="0.03" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>

        <rect width={W} height={H} rx="12" fill="url(#sl-bg)" />

        {/* Warm haze on right side */}
        <rect x={W * 0.65} y={0} width={W * 0.35} height={H} fill="#F4C430" opacity={0.03} rx="0" />

        {/* Connecting threads */}
        {PHASES.map((_, i) => {
          if (i === 0) return null;
          const x1 = phaseSpacing * i;
          const x2 = phaseSpacing * (i + 1);
          return (
            <line
              key={`thread-${i}`}
              x1={x1}
              y1={H / 2}
              x2={x2}
              y2={H / 2}
              stroke="#F4C430"
              strokeWidth={0.8}
              strokeOpacity={0.12}
              strokeDasharray="4 6"
            />
          );
        })}

        {/* Phase I — Molecular Cloud */}
        {(() => {
          const x = phaseSpacing;
          const y = H / 2;
          const isCurrent = currentPhase === 1;
          return (
            <g>
              {/* Dense cloud blob */}
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx={x + (seededRandom(i * 5) - 0.5) * 30}
                  cy={y + (seededRandom(i * 5 + 1) - 0.5) * 25}
                  r={12 + seededRandom(i * 5 + 2) * 15}
                  fill="#3A0A5E"
                  opacity={0.6 + seededRandom(i * 5 + 3) * 0.3}
                />
              ))}
              {/* Faint gold point within */}
              <circle cx={x} cy={y} r={2} fill="#F4C430" opacity={isCurrent ? 0.5 : 0.15} />
              {isCurrent && <circle cx={x} cy={y} r={30} fill="none" stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="3 3" />}
            </g>
          );
        })()}

        {/* Phase II — Proto-Star */}
        {(() => {
          const x = phaseSpacing * 2;
          const y = H / 2;
          const isCurrent = currentPhase === 2;
          return (
            <g>
              {/* Collapsing cloud */}
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i / 4) * Math.PI * 2;
                return (
                  <motion.ellipse
                    key={i}
                    cx={x + Math.cos(angle) * 18}
                    cy={y + Math.sin(angle) * 14}
                    rx={10}
                    ry={8}
                    fill="#3A0A5E"
                    opacity={0.5}
                    initial={false}
                    animate={
                      !reducedMotion
                        ? { cx: x + Math.cos(angle) * 12, cy: y + Math.sin(angle) * 9 }
                        : undefined
                    }
                    transition={!reducedMotion ? { duration: 3, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } : undefined}
                  />
                );
              })}
              {/* Warm center */}
              <circle cx={x} cy={y} r={10} fill="#E8A317" opacity={isCurrent ? 0.7 : 0.4} />
              <circle cx={x} cy={y} r={4} fill="#F4C430" opacity={0.6} />
              {isCurrent && <circle cx={x} cy={y} r={30} fill="none" stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="3 3" />}
            </g>
          );
        })()}

        {/* Phase III — Young Star */}
        {(() => {
          const x = phaseSpacing * 3;
          const y = H / 2;
          const isCurrent = currentPhase === 3;
          return (
            <g>
              <circle cx={x} cy={y} r={16} fill="#F4C430" opacity={isCurrent ? 0.85 : 0.6} filter="url(#sl-glow)" />
              <circle cx={x} cy={y} r={8} fill="#FFFFFF" opacity={0.5} />
              {/* Solar flares */}
              {[45, 135, 270].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                return (
                  <motion.path
                    key={i}
                    d={`M ${x + Math.cos(rad) * 16} ${y + Math.sin(rad) * 16} Q ${x + Math.cos(rad) * 35} ${y + Math.sin(rad) * 35 - 10} ${x + Math.cos(rad) * 28} ${y + Math.sin(rad) * 28 + 8}`}
                    fill="none"
                    stroke="#F4C430"
                    strokeWidth={2}
                    strokeOpacity={0.5}
                    initial={false}
                    animate={!reducedMotion ? { strokeOpacity: [0.3, 0.6, 0.3] } : undefined}
                    transition={!reducedMotion ? { duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
                  />
                );
              })}
              {/* Ejecta particles */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = seededRandom(i * 9) * Math.PI * 2;
                const dist = 22 + seededRandom(i * 9 + 1) * 20;
                return <circle key={i} cx={x + Math.cos(angle) * dist} cy={y + Math.sin(angle) * dist} r={1} fill="#F4C430" opacity={0.4} />;
              })}
              {isCurrent && <circle cx={x} cy={y} r={35} fill="none" stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="3 3" />}
            </g>
          );
        })()}

        {/* Phase IV — Mature Sun (the 143 icon) */}
        {(() => {
          const x = phaseSpacing * 4;
          const y = H / 2;
          const isCurrent = currentPhase === 4;
          return (
            <g>
              <circle cx={x} cy={y} r={20} fill="#F4C430" opacity={isCurrent ? 0.9 : 0.65} filter="url(#sl-glow)" />
              <circle cx={x} cy={y} r={10} fill="#FFFFFF" opacity={0.6} />
              {/* 12 sharp beam points */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i / 12) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={x + Math.cos(angle) * 22}
                    y1={y + Math.sin(angle) * 22}
                    x2={x + Math.cos(angle) * 34}
                    y2={y + Math.sin(angle) * 34}
                    stroke="#F4C430"
                    strokeWidth={2}
                    strokeOpacity={isCurrent ? 0.7 : 0.4}
                  />
                );
              })}
              {/* Five ray-colored beams */}
              {['#F4C430', '#C0392B', '#8E44AD', '#1ABC9C', '#D4770B'].map((color, i) => {
                const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
                return (
                  <line
                    key={`ray-${i}`}
                    x1={x + Math.cos(angle) * 36}
                    y1={y + Math.sin(angle) * 36}
                    x2={x + Math.cos(angle) * 55}
                    y2={y + Math.sin(angle) * 55}
                    stroke={color}
                    strokeWidth={2.5}
                    strokeOpacity={0.5}
                  />
                );
              })}
              {isCurrent && <circle cx={x} cy={y} r={40} fill="none" stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="3 3" />}
            </g>
          );
        })()}

        {/* Phase V — Supergiant */}
        {(() => {
          const x = phaseSpacing * 5;
          const y = H / 2;
          const isCurrent = currentPhase === 5;
          return (
            <g>
              {/* Vast warm glow */}
              <circle cx={x} cy={y} r={60} fill="#D4770B" opacity={0.08} />
              <circle cx={x} cy={y} r={40} fill="#E8A317" opacity={0.12} />
              <circle cx={x} cy={y} r={28} fill="#D4770B" opacity={isCurrent ? 0.7 : 0.5} filter="url(#sl-glow)" />
              <circle cx={x} cy={y} r={14} fill="#E8A317" opacity={0.6} />
              <circle cx={x} cy={y} r={7} fill="#FFFFFF" opacity={0.4} />
              {/* Orbiting smaller objects */}
              {[40, 52].map((r, i) => {
                const angle = seededRandom(i * 23) * Math.PI * 2;
                return <circle key={i} cx={x + Math.cos(angle) * r} cy={y + Math.sin(angle) * r} r={3} fill="#F4C430" opacity={0.5} />;
              })}
              {isCurrent && <circle cx={x} cy={y} r={50} fill="none" stroke="#F4C430" strokeWidth={1.5} strokeOpacity={0.3} strokeDasharray="3 3" />}
            </g>
          );
        })()}

        {/* Phase labels */}
        {PHASES.map((phase, i) => {
          const x = phaseSpacing * (i + 1);
          return (
            <g key={phase.label}>
              <text x={x} y={H - 30} textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700" opacity={currentPhase === i + 1 ? 0.9 : 0.3}>
                {phase.label}
              </text>
              <text x={x} y={H - 15} textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="400" opacity={currentPhase === i + 1 ? 0.6 : 0.2}>
                {phase.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
