'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { rayHex, rayRamp } from '@/lib/ui/ray-colors';
import SunWithGrowingRays from '@/components/cosmic/SunWithGrowingRays';

interface RayData {
  id: string;
  name: string;
  phase: string;
  description?: string;
}

interface RayProgressionStackProps {
  /** Optional score values per ray (0-100) — drives ray beam lengths on the sun */
  scores?: Record<string, number>;
  /** Show interactive expand-on-click */
  interactive?: boolean;
  /** Override className */
  className?: string;
}

const RAYS_ABOVE: RayData[] = [
  { id: 'R1', name: 'Intention', phase: 'Reconnect', description: 'You wake up and already know your one thing.' },
  { id: 'R2', name: 'Joy', phase: 'Reconnect', description: 'Your energy comes from something deeper.' },
  { id: 'R3', name: 'Presence', phase: 'Reconnect', description: 'The space between what happens and what you do is yours.' },
  { id: 'R4', name: 'Power', phase: 'Expand', description: 'You move before you feel ready — and trust yourself after.' },
];

const RAYS_BELOW: RayData[] = [
  { id: 'R5', name: 'Purpose', phase: 'Expand', description: 'Your calendar matches your values.' },
  { id: 'R6', name: 'Authenticity', phase: 'Expand', description: 'You are the same person in every room.' },
  { id: 'R7', name: 'Connection', phase: 'Become', description: 'People feel safe enough to be honest around you.' },
  { id: 'R8', name: 'Possibility', phase: 'Become', description: 'You see options where others see walls.' },
];

function RayCard({
  ray,
  index,
  score,
}: {
  ray: RayData;
  index: number;
  score?: number;
}) {
  const ramp = rayRamp(ray.id);
  const hex = rayHex(ray.id);

  return (
    <motion.div
      className="glass-card glass-card--lift relative p-4 sm:p-5"
      style={{
        borderLeft: `3px solid ${ramp.hoverBorder}`,
        background: ramp.bgTint,
      }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.2, 0.8, 0.2, 1],
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: hex, opacity: 0.7 }}
          >
            {ray.phase}
          </p>
          <p className="mt-0.5 text-sm font-semibold sm:text-base" style={{ color: hex }}>
            {ray.name}
          </p>
          {ray.description && (
            <p
              className="mt-1 text-xs leading-relaxed"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              {ray.description}
            </p>
          )}
        </div>

        {/* Score indicator (when data is available) */}
        {score !== undefined && (
          <div className="flex flex-col items-center">
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: hex, textShadow: `0 0 16px ${ramp.glow}` }}
            >
              {score}
            </span>
            <span
              className="text-[9px] uppercase tracking-widest"
              style={{ color: 'var(--text-on-dark-muted)' }}
            >
              score
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * RayProgressionStack — Vertical stacked progression of 8 rays
 * with Be The Light (R9) at the center as a sun with growing beams.
 *
 * Layout:
 *   R1 → R4 (Reconnect → Expand)
 *   ═══ ☀ BE THE LIGHT ═══
 *   R5 → R8 (Expand → Become)
 */
export default function RayProgressionStack({
  scores,
  className = '',
}: RayProgressionStackProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className={`mx-auto max-w-[640px] ${className}`}>
      {/* Vertical connecting line */}
      <div className="relative">
        {/* Gold gradient line behind the cards */}
        <div
          className="pointer-events-none absolute left-[14px] top-0 bottom-0 w-[2px] sm:left-[18px]"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(248,208,17,0.3) 15%, rgba(248,208,17,0.3) 85%, transparent)',
          }}
        />

        {/* Upper rays: R1 → R4 */}
        <div className="relative space-y-3 pl-8 sm:pl-10">
          {RAYS_ABOVE.map((ray, i) => (
            <RayCard
              key={ray.id}
              ray={ray}
              index={i}
              score={scores?.[ray.id]}
            />
          ))}
        </div>

        {/* CENTER: Be The Light with Sun */}
        <motion.div
          className="relative z-10 my-6"
          initial={prefersReduced ? undefined : { opacity: 0, scale: 0.9 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div
            className="glass-card relative overflow-hidden p-6 text-center sm:p-8"
            style={{
              border: '1.5px solid rgba(248,208,17,0.4)',
              background: 'rgba(248,208,17,0.06)',
            }}
          >
            {/* Sun visualization */}
            <div className="mx-auto mb-4 flex items-center justify-center">
              <SunWithGrowingRays
                scores={scores}
                size={200}
              />
            </div>

            <p
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#F8D011' }}
            >
              The Center
            </p>
            <p
              className="mt-1 text-xl font-bold sm:text-2xl"
              style={{
                color: '#F8D011',
                fontFamily: 'var(--font-cosmic-display)',
                textShadow: '0 0 24px rgba(248,208,17,0.3)',
              }}
            >
              Be The Light
            </p>
            <p
              className="mx-auto mt-2 max-w-[400px] text-xs leading-relaxed sm:text-sm"
              style={{ color: 'var(--text-on-dark-secondary)' }}
            >
              Your presence lowers the noise in a room. You hold steady.
              And somehow that is enough.
            </p>

            {scores?.R9 !== undefined && (
              <div className="mt-3">
                <span
                  className="text-2xl font-bold tabular-nums"
                  style={{
                    color: '#F8D011',
                    textShadow: '0 0 20px rgba(248,208,17,0.4)',
                  }}
                >
                  {scores.R9}
                </span>
                <span
                  className="ml-1 text-xs uppercase tracking-widest"
                  style={{ color: 'var(--text-on-dark-muted)' }}
                >
                  score
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Lower rays: R5 → R8 */}
        <div className="relative space-y-3 pl-8 sm:pl-10">
          {RAYS_BELOW.map((ray, i) => (
            <RayCard
              key={ray.id}
              ray={ray}
              index={i + 4}
              score={scores?.[ray.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
