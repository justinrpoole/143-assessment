'use client';

import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* ── Ray data with teaser descriptions (open-loop: enough to intrigue, not resolve) ── */

const RAYS = [
  {
    name: 'Intention',
    phase: 'Reconnect',
    teaser: 'Where your attention goes before you choose',
    color: 'var(--ray-intention, #60A5FA)',
    fillPercent: 0.72,
  },
  {
    name: 'Joy',
    phase: 'Reconnect',
    teaser: 'The fuel you forgot was a skill',
    color: 'var(--ray-joy, #F4C430)',
    fillPercent: 0.58,
  },
  {
    name: 'Presence',
    phase: 'Reconnect',
    teaser: 'The truth detector behind every other score',
    color: 'var(--ray-presence, #8E44AD)',
    fillPercent: 0.65,
  },
  {
    name: 'Power',
    phase: 'Expand',
    teaser: 'Movement before the feeling arrives',
    color: 'var(--ray-power, #C0392B)',
    fillPercent: 0.80,
  },
  {
    name: 'Purpose',
    phase: 'Expand',
    teaser: 'When your calendar matches your values',
    color: 'var(--ray-purpose, #D4770B)',
    fillPercent: 0.62,
  },
  {
    name: 'Authenticity',
    phase: 'Expand',
    teaser: 'Being the same person in every room',
    color: 'var(--ray-authenticity, #2ECC71)',
    fillPercent: 0.70,
  },
  {
    name: 'Connection',
    phase: 'Become',
    teaser: 'Trust that makes honesty safe',
    color: 'var(--ray-connection, #E74C8B)',
    fillPercent: 0.55,
  },
  {
    name: 'Possibility',
    phase: 'Become',
    teaser: 'Doors where others see walls',
    color: 'var(--ray-possibility, #1ABC9C)',
    fillPercent: 0.68,
  },
  {
    name: 'Be The Light',
    phase: 'Become',
    teaser: 'The capacity that holds the room steady',
    color: 'var(--ray-btl, #F8D011)',
    fillPercent: 0.75,
  },
] as const;

const PHASE_LABELS: Record<string, { color: string; border: string }> = {
  Reconnect: { color: 'rgba(248, 208, 17, 0.85)', border: 'rgba(248, 208, 17, 0.15)' },
  Expand: { color: 'rgba(232, 163, 23, 0.85)', border: 'rgba(232, 163, 23, 0.15)' },
  Become: { color: 'rgba(167, 139, 250, 0.85)', border: 'rgba(167, 139, 250, 0.15)' },
};

/* ── Eclipse icon (crescent moon / covered sun) ── */
function EclipseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" fill="rgba(96, 5, 141, 0.6)" stroke="rgba(148, 80, 200, 0.4)" strokeWidth="1" />
      <circle cx="12" cy="7" r="6" fill="var(--cosmic-purple-deep, #1A0A2E)" />
    </svg>
  );
}

/* ── Sun icon (radiant) ── */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5" fill="var(--brand-gold, #F8D011)" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1={9 + Math.cos(rad) * 6.5}
            y1={9 + Math.sin(rad) * 6.5}
            x2={9 + Math.cos(rad) * 8}
            y2={9 + Math.sin(rad) * 8}
            stroke="var(--brand-gold, #F8D011)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

/**
 * RaySpectrumBar — 9 rays stacked vertically.
 *
 * Each ray shows an eclipse-to-sun gradient bar that animates on scroll.
 * Left side = eclipsed (dark, covered). Right side = shining (bright, accessible).
 * A pulsing marker shows a sample position on the spectrum.
 *
 * The fill positions are illustrative (not real user data) — designed to create
 * intrigue about "where would MY marker land?"
 */
export default function RaySpectrumBar({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();

  let lastPhase = '';

  return (
    <div ref={ref} className={`space-y-1 ${className ?? ''}`}>
      {/* Header row: Eclipse ← → Shine */}
      <div className="flex items-center justify-between px-1 mb-3">
        <div className="flex items-center gap-1.5">
          <EclipseIcon />
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(148, 80, 200, 0.7)' }}
          >
            Eclipsed
          </span>
        </div>
        <span
          className="text-[10px] font-medium tracking-wide"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}
        >
          Where does your light land?
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: 'rgba(248, 208, 17, 0.8)' }}
          >
            Shining
          </span>
          <SunIcon />
        </div>
      </div>

      {RAYS.map((ray, i) => {
        const showPhaseLabel = ray.phase !== lastPhase;
        lastPhase = ray.phase;
        const phaseStyle = PHASE_LABELS[ray.phase];

        return (
          <div key={ray.name}>
            {/* Phase separator */}
            {showPhaseLabel && (
              <motion.div
                className="flex items-center gap-2 mt-3 mb-1.5 px-1"
                initial={prefersReduced ? false : { opacity: 0 }}
                animate={isInView ? { opacity: 1 } : undefined}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <div
                  className="h-px flex-1"
                  style={{ background: phaseStyle.border }}
                />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: phaseStyle.color }}
                >
                  {ray.phase}
                </span>
                <div
                  className="h-px flex-1"
                  style={{ background: phaseStyle.border }}
                />
              </motion.div>
            )}

            {/* Ray row */}
            <motion.div
              className="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors"
              style={{ background: 'transparent' }}
              whileHover={{
                background: 'rgba(96, 5, 141, 0.12)',
              }}
              initial={prefersReduced ? false : { opacity: 0, x: -12 }}
              animate={isInView ? { opacity: 1, x: 0 } : undefined}
              transition={{
                duration: 0.45,
                delay: prefersReduced ? 0 : 0.08 * i + 0.2,
                ease: [0.2, 0.8, 0.2, 1],
              }}
            >
              {/* Ray name + teaser */}
              <div className="w-[130px] shrink-0">
                <p
                  className="text-xs font-semibold leading-tight"
                  style={{ color: ray.color }}
                >
                  {ray.name}
                </p>
                <p
                  className="text-[10px] leading-snug mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}
                >
                  {ray.teaser}
                </p>
              </div>

              {/* The spectrum bar */}
              <div className="relative flex-1 h-[18px]">
                {/* Track background: eclipse → sun gradient */}
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--cosmic-purple-deep, #1A0A2E) 0%, var(--cosmic-purple-mid, #2D1450) 25%, var(--cosmic-amber, #E8A317) 70%, var(--brand-gold, #F8D011) 100%)',
                    opacity: 0.3,
                  }}
                />

                {/* Active fill: animates from left */}
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, rgba(96, 5, 141, 0.6) 0%, ${ray.color} 60%, var(--brand-gold, #F8D011) 100%)`,
                    boxShadow: `0 0 12px ${ray.color}33`,
                  }}
                  initial={prefersReduced ? { width: `${ray.fillPercent * 100}%` } : { width: '0%' }}
                  animate={isInView ? { width: `${ray.fillPercent * 100}%` } : undefined}
                  transition={{
                    duration: prefersReduced ? 0 : 1.2,
                    delay: prefersReduced ? 0 : 0.08 * i + 0.4,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                />

                {/* Pulsing marker at fill position */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full"
                  style={{
                    background: ray.color,
                    boxShadow: `0 0 8px ${ray.color}88, 0 0 20px ${ray.color}44`,
                    left: `${ray.fillPercent * 100}%`,
                    marginLeft: '-5px',
                  }}
                  initial={prefersReduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: [1, 1.3, 1],
                        }
                      : undefined
                  }
                  transition={{
                    opacity: {
                      duration: 0.3,
                      delay: prefersReduced ? 0 : 0.08 * i + 1.4,
                    },
                    scale: {
                      duration: 2,
                      delay: prefersReduced ? 0 : 0.08 * i + 1.4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }}
                />
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Bottom callout — open loop */}
      <motion.p
        className="text-center text-[11px] mt-4 pt-3"
        style={{
          color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))',
          borderTop: '1px solid rgba(148, 80, 200, 0.12)',
        }}
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={isInView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        These are illustrative positions.{' '}
        <span style={{ color: 'var(--brand-gold, #F8D011)', fontWeight: 600 }}>
          Your Light Signature is unique.
        </span>
      </motion.p>
    </div>
  );
}
