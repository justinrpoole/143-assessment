'use client';

import { useEffect, useState } from 'react';
import { useCosmicMotion } from '@/lib/motion/use-cosmic-motion';

interface CompletionRevealProps {
  /** The two ray names for the Light Signature, e.g. ["Power", "Connection"] */
  topRayNames: [string, string];
  /** Callback after the reveal auto-dismisses */
  onComplete: () => void;
}

/**
 * Full-screen celebration overlay shown after assessment submission.
 * Shows a cosmic burst, then reveals the user's Light Signature archetype.
 * Auto-redirects after 4 seconds. Respects useReducedMotion.
 */
export default function CompletionReveal({ topRayNames, onComplete }: CompletionRevealProps) {
  const shouldAnimate = useCosmicMotion();
  const [phase, setPhase] = useState<'burst' | 'reveal'>('burst');

  const archetypeName = `The ${topRayNames[0]}-${topRayNames[1]}`;

  useEffect(() => {
    if (!shouldAnimate) {
      // Reduced motion: skip burst, go straight to reveal, shorter wait
      setPhase('reveal');
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }

    // Phase 1: burst for 1.2s, then reveal
    const revealTimer = setTimeout(() => setPhase('reveal'), 1200);
    // Phase 2: auto-dismiss after 4s total
    const dismissTimer = setTimeout(onComplete, 4000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(dismissTimer);
    };
  }, [shouldAnimate, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-deep, #1A0A2E)' }}
      role="status"
      aria-live="assertive"
      aria-label={`Assessment complete. Your Light Signature is ${archetypeName}`}
    >
      {/* Particle burst */}
      {shouldAnimate && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * 360;
            const delay = Math.random() * 0.3;
            const distance = 120 + Math.random() * 200;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 block h-1.5 w-1.5 rounded-full"
                style={{
                  background: i % 3 === 0 ? '#F8D011' : i % 3 === 1 ? '#F4C430' : 'rgba(255,255,255,0.7)',
                  animation: `completionParticle 1.5s ${delay}s ease-out forwards`,
                  '--angle': `${angle}deg`,
                  '--distance': `${distance}px`,
                  opacity: 0,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* Central glow */}
      {shouldAnimate && phase === 'burst' && (
        <div
          className="absolute h-40 w-40 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(248,208,17,0.6) 0%, rgba(248,208,17,0) 70%)',
            animation: 'completionGlow 1.2s ease-out forwards',
          }}
        />
      )}

      {/* Text content */}
      <div
        className="relative z-10 text-center px-6"
        style={{
          opacity: phase === 'reveal' ? 1 : 0,
          transform: phase === 'reveal' ? 'translateY(0)' : 'translateY(12px)',
          transition: shouldAnimate ? 'opacity 0.8s ease, transform 0.8s ease' : 'none',
        }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          Your Light Signature
        </p>
        <h1
          className="mt-4 text-4xl font-bold sm:text-5xl"
          style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
        >
          {archetypeName}
        </h1>
        <p
          className="mt-4 text-sm"
          style={{ color: 'var(--text-on-dark-muted, rgba(255,255,255,0.5))' }}
        >
          Your full report is loading&hellip;
        </p>
      </div>

      <style>{`
        @keyframes completionParticle {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1));
          }
        }
        @keyframes completionGlow {
          0% { transform: scale(0.2); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
