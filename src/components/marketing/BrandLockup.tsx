'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * BrandLockup — A designed visual brand mark for "143 Leadership with Justin Ray"
 * Features an eclipse icon, gradient text, and subtle animations.
 * This replaces plain text with an actual designed identity element.
 */

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

export default function BrandLockup({ className }: { className?: string }) {
  const prefersReduced = useReducedMotion();
  const animate = !prefersReduced;

  return (
    <div className={`flex flex-col items-center gap-4 ${className ?? ''}`}>
      {/* Eclipse icon mark */}
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.8 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          aria-hidden="true"
          className="drop-shadow-[0_0_20px_rgba(248,208,17,0.3)]"
        >
          <defs>
            <radialGradient id="lockup-sun" cx="45%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#FFFEF5" />
              <stop offset="30%" stopColor="#FFEC80" />
              <stop offset="60%" stopColor="#F8D011" />
              <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="lockup-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F8D011" stopOpacity="0.25" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {/* Outer glow */}
          <circle cx="32" cy="32" r="30" fill="url(#lockup-glow)" />
          {/* Sun */}
          <circle cx="30" cy="32" r="16" fill="url(#lockup-sun)" />
          {/* Moon eclipse */}
          <circle cx="38" cy="28" r="14.5" fill="#2A0440" />
          <circle cx="38" cy="28" r="14.5" fill="#60058D" opacity="0.4" />
          {/* Rim glow */}
          <circle cx="38" cy="28" r="15" fill="none" stroke="#F8D011" strokeWidth="0.8" opacity="0.2" />
          {/* Diamond flash */}
          <circle cx="25" cy="34" r="2" fill="#FFFEF5" opacity="0.6">
            {animate && (
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite" />
            )}
          </circle>
        </svg>
      </motion.div>

      {/* Brand text lockup */}
      <motion.div
        className="text-center"
        initial={animate ? { opacity: 0, y: 12 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
      >
        {/* "143" — large, gradient, cosmic display */}
        <p
          className="brand-lockup-143 text-5xl sm:text-6xl font-bold leading-none"
          style={{
            fontFamily: 'var(--font-cosmic-display)',
            background: 'linear-gradient(135deg, #FFFEF5 0%, #F8D011 40%, #E89D0C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 24px rgba(248, 208, 17, 0.25))',
          }}
        >
          143
        </p>

        {/* "LEADERSHIP" — spaced tracking */}
        <p
          className="mt-1 text-[11px] font-bold tracking-[0.35em] uppercase"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          Leadership
        </p>

        {/* Decorative line */}
        <div
          className="mx-auto mt-3 h-px w-16"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(248,208,17,0.4), transparent)',
          }}
        />

        {/* "with Justin Ray" */}
        <motion.p
          className="mt-3 text-sm font-medium tracking-wide"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          initial={animate ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        >
          with Justin Ray
        </motion.p>
      </motion.div>
    </div>
  );
}
