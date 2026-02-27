'use client';

import { motion, useReducedMotion } from 'framer-motion';
import SunCore from '@/components/cosmic/SunCore';
import CosmicRing from '@/components/cosmic/CosmicRing';

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/* ── 9-Ray orbital configuration (module-level, zero per-render cost) ── */
const ORBIT_RINGS = [
  { id: 'R1', color: '#60A5FA', radius: 90,  smoothness: 0.78, opacity: 0.40 },
  { id: 'R2', color: '#F4C430', radius: 112, smoothness: 0.85, opacity: 0.38 },
  { id: 'R3', color: '#8E44AD', radius: 134, smoothness: 0.72, opacity: 0.35 },
  { id: 'R4', color: '#C0392B', radius: 156, smoothness: 0.90, opacity: 0.32 },
  { id: 'R5', color: '#D4770B', radius: 178, smoothness: 0.68, opacity: 0.28 },
  { id: 'R6', color: '#2ECC71', radius: 200, smoothness: 0.82, opacity: 0.25 },
  { id: 'R7', color: '#E74C8B', radius: 222, smoothness: 0.75, opacity: 0.22 },
  { id: 'R8', color: '#1ABC9C', radius: 244, smoothness: 0.88, opacity: 0.18 },
  { id: 'R9', color: '#F8D011', radius: 266, smoothness: 0.95, opacity: 0.15 },
];

/* ── Geometry constants ── */
const CX = 480;
const CY = 260;
const SUN_R = 55;
const MOON_R = SUN_R * 0.92;
const MOON_CX = CX + SUN_R * 0.55;
const MOON_CY = CY - SUN_R * 0.35;
const DIAMOND_X = MOON_CX - MOON_R * 0.75;
const DIAMOND_Y = MOON_CY + MOON_R * 0.5;

/* ────────────────────────────────────────────────────────────
 * CosmicHero — Release hero for 143 Leadership.
 *
 * Composes existing SunCore (7-layer realistic sun) and
 * CosmicRing (coherence-mapped orbital rings) with the
 * signature eclipse animation. 9 rings expand outward,
 * the moon slides in, diamond-ring flashes, text reveals.
 *
 * Stars are handled by page-level StarfieldBackground.
 * All geometry is module-level (no per-render allocation).
 * Respects prefers-reduced-motion via useReducedMotion.
 * ──────────────────────────────────────────────────────────── */

export default function CosmicHero({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const anim = !prefersReduced;

  return (
    <div
      className={className}
      role="img"
      aria-label="143 Leadership — 9 Rays of trainable leadership capacity — with Justin Ray"
    >
      <div className="relative overflow-hidden" style={{ minHeight: 'min(520px, 80vw)' }}>

        {/* ── SVG — Sun + 9 Orbits + Eclipse ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 960 520"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Diamond flash filter */}
            <filter id="hero-diamond-bloom" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── 9 Orbital Rings — expand outward in sequence ── */}
          {ORBIT_RINGS.map((ring, i) => (
            <motion.g
              key={ring.id}
              initial={anim ? { opacity: 0, scale: 0.3 } : false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.7,
                delay: 0.8 + i * 0.1,
                ease: EASE,
              }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
            >
              <CosmicRing
                cx={CX}
                cy={CY}
                radius={ring.radius}
                color={ring.color}
                smoothness={ring.smoothness}
                rotate={anim}
                opacity={ring.opacity}
                strokeWidth={1.2}
              />
            </motion.g>
          ))}

          {/* ── Sun — SunCore with 7-layer realistic rendering ── */}
          <motion.g
            initial={anim ? { opacity: 0, scale: 0.5 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          >
            <SunCore cx={CX} cy={CY} radius={SUN_R} animate={anim} />
          </motion.g>

          {/* ── Moon — slides in from right to create eclipse ── */}
          <motion.g
            initial={anim ? { opacity: 0, x: 400 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 2.2, ease: EASE }}
          >
            <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R} fill="#2A0440" />
            <circle cx={MOON_CX} cy={MOON_CY} r={MOON_R} fill="#60058D" opacity={0.4} />

            {/* Gold rim glow — light leaking around moon edge */}
            <motion.circle
              cx={MOON_CX}
              cy={MOON_CY}
              r={MOON_R + 1.5}
              fill="none"
              stroke="#F8D011"
              strokeWidth="1.5"
              initial={false}
              animate={anim ? { opacity: [0.06, 0.18, 0.06] } : { opacity: 0.1 }}
              transition={anim ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : undefined}
            />
          </motion.g>

          {/* ── Diamond-ring flash — peak moment of eclipse ── */}
          <motion.circle
            cx={DIAMOND_X}
            cy={DIAMOND_Y}
            r={5}
            fill="#FFFEF5"
            filter="url(#hero-diamond-bloom)"
            initial={{ opacity: 0 }}
            animate={anim ? { opacity: [0, 0.9, 0.35], scale: [0.3, 2.5, 1] } : undefined}
            transition={anim ? { duration: 0.8, delay: 2.8, ease: EASE } : undefined}
            style={{ transformOrigin: `${DIAMOND_X}px ${DIAMOND_Y}px` }}
          />

          {/* ── Supernova flash — radial burst at eclipse moment ── */}
          <motion.circle
            cx={CX}
            cy={CY}
            r={SUN_R * 2.5}
            fill="white"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={anim ? { opacity: [0, 0.5, 0], scale: [0.3, 1.8, 2.5] } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 2.8, ease: EASE }}
            style={{ transformOrigin: `${CX}px ${CY}px`, mixBlendMode: 'screen' }}
          />
        </svg>

        {/* ── Text overlay — Supernova Sequence ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-end text-center px-4"
          style={{ minHeight: 'inherit', paddingTop: 'min(300px, 42vw)', paddingBottom: '1.5rem' }}
        >
          {/* Phase 1: "143" — purple outline burst → gold settle */}
          <div style={{ position: 'relative', overflow: 'visible' }}>
            <motion.p
              className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold pointer-events-none"
              style={{
                fontFamily: 'var(--font-cosmic-display)',
                color: 'transparent',
                WebkitTextStroke: '2px #8b5bff',
                textShadow: '0 0 20px rgba(139,91,255,0.8), 0 0 50px rgba(139,91,255,0.4), 0 0 80px rgba(139,91,255,0.2)',
              }}
              initial={anim ? { opacity: 0, scale: 0.4 } : { opacity: 0 }}
              animate={anim ? { opacity: [0, 1, 1, 0], scale: [0.4, 1.8, 1.6, 0.8] } : { opacity: 0 }}
              transition={{ duration: 1.6, delay: 1.2, times: [0, 0.15, 0.7, 1], ease: EASE }}
              aria-hidden="true"
            >
              143
            </motion.p>

            <motion.p
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
              style={{
                fontFamily: 'var(--font-cosmic-display)',
                color: '#F8D011',
                textShadow: '0 0 40px rgba(248, 208, 17, 0.3)',
              }}
              initial={anim ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.6, ease: EASE }}
            >
              143
            </motion.p>
          </div>

          {/* Phase 2: "LEADERSHIP" stamp */}
          <motion.p
            className="mt-1 font-black text-xl sm:text-2xl md:text-3xl uppercase"
            style={{
              fontFamily: 'var(--font-body)',
              color: '#FFFEF5',
              letterSpacing: '0.15em',
              transformOrigin: 'center top',
            }}
            initial={anim ? { opacity: 0, scaleY: 0 } : false}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ duration: 0.4, delay: 1.6, ease: [0.34, 1.56, 0.64, 1] }}
          >
            LEADERSHIP
          </motion.p>

          {/* Phase 3: Neon tagline */}
          <motion.p
            className={`mt-3 text-sm sm:text-base md:text-lg font-extrabold uppercase${anim ? ' neon-shimmer-text' : ''}`}
            style={{ letterSpacing: '0.08em', color: anim ? undefined : 'var(--cosmic-purple-light, #7B4FA2)' }}
            initial={anim ? { opacity: 0, scale: 0.9 } : false}
            animate={anim ? { opacity: [0, 1, 1], scale: [0.9, 1.05, 1.0] } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 2.0, times: [0, 0.3, 1], ease: EASE }}
          >
            Live just in a ray of light
          </motion.p>

          {/* Phase 4: Attribution + mission */}
          <motion.p
            className="mt-3 text-base sm:text-lg md:text-xl font-medium"
            style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}
            initial={anim ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3.0, ease: EASE }}
          >
            with Justin Ray
          </motion.p>

          <motion.p
            className="mt-1 text-xs sm:text-sm md:text-base tracking-wide uppercase"
            style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))', letterSpacing: '0.12em' }}
            initial={anim ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3.3, ease: EASE }}
          >
            we upgrade your operating system
          </motion.p>
        </div>
      </div>
    </div>
  );
}
