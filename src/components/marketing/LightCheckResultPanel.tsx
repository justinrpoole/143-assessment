'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';

const RAY_CALLOUTS: Record<string, string> = {
  Joy:
    'Your Joy capacity showed up first. That is not small. Joy is the ray most leaders lose earliest under load — and the one that changes everything else when it comes back online.',
  Purpose:
    'Your Purpose signal is clear. When a leader can check decisions against what actually matters — not what looks right, but what they care about — that is a sign the internal compass is still calibrated.',
  Possibility:
    'Your Possibility capacity is active. You are still seeing paths that others are not noticing yet. That ability to imagine forward under pressure is rarer than most leaders realize.',
};

interface LightCheckResultPanelProps {
  answers: Record<string, number>;
  visible: boolean;
}

/**
 * Coaching debrief panel — renders after all 3 Gravitational Stability Check
 * questions are answered. Shows ray-specific identity callout, small eclipse
 * visual based on score, and bridge to full assessment.
 *
 * Voice: Justin Ray coaching debrief — "here is what I noticed."
 */
export default function LightCheckResultPanel({ answers, visible }: LightCheckResultPanelProps) {
  const prefersReduced = useReducedMotion();

  if (!visible) return null;

  const values = Object.values(answers);
  const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

  // Find strongest ray
  const rayMap: Record<string, string> = {
    'preview-r2': 'Joy',
    'preview-r5': 'Purpose',
    'preview-r8': 'Possibility',
  };

  let strongestRay = 'Joy';
  let highestScore = 0;
  for (const [id, val] of Object.entries(answers)) {
    if (val > highestScore) {
      highestScore = val;
      strongestRay = rayMap[id] ?? 'Joy';
    }
  }

  const callout = RAY_CALLOUTS[strongestRay] ?? RAY_CALLOUTS.Joy;

  // Eclipse percentage inversely proportional to average score (0-4 scale)
  const eclipsePercent = Math.max(0.1, 1 - avg / 4);

  return (
    <motion.section
      className="mt-8"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReduced ? undefined : { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <p
        className="mb-4 text-xs font-bold uppercase tracking-widest"
        style={{ color: 'var(--brand-gold, #F8D011)' }}
      >
        What Your Answers Suggest
      </p>

      <div className="grid gap-6 md:grid-cols-[160px,1fr]">
        {/* Mini eclipse visual */}
        <div className="flex justify-center md:justify-start" aria-hidden="true">
          <MiniEclipse eclipsePercent={eclipsePercent} animate={!prefersReduced} />
        </div>

        {/* Coaching debrief */}
        <div
          className="glass-card p-5"
          style={{ borderLeft: '3px solid var(--brand-gold, #F8D011)' }}
        >
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark, #FFFEF5)' }}
          >
            {callout}
          </p>
          <p
            className="mt-4 text-sm leading-relaxed"
            style={{ color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))' }}
          >
            Measurement is the first rep. The assessment does not just tell you where you are — it
            starts training your attention to notice capacity in real time. That is how the operating
            system updates.
          </p>
          <div className="mt-5">
            <Link href="/upgrade" className="btn-primary">
              Map My Full Light Signature
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Mini Eclipse (internal) ──────────────────────────────── */

function MiniEclipse({
  eclipsePercent,
  animate,
}: {
  eclipsePercent: number;
  animate: boolean;
}) {
  const size = 140;
  const cx = size / 2;
  const cy = size / 2;
  const r = 28;
  const brightness = 1 - eclipsePercent * 0.6;

  const moonCx = cx + r * (0.3 + eclipsePercent * 0.35);
  const moonCy = cy - r * 0.2;
  const moonR = r * 0.95;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <defs>
        <radialGradient id="lcr-photo" cx="46%" cy="44%" r="52%">
          <stop offset="0%" stopColor="#FFFEF5" />
          <stop offset="30%" stopColor="#FFEC80" />
          <stop offset="55%" stopColor="#F8D011" />
          <stop offset="80%" stopColor="#E89D0C" />
          <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="lcr-corona" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#F8D011" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <filter id="lcr-bloom" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
          <feMerge>
            <feMergeNode in="b1" />
            <feMergeNode in="b2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {eclipsePercent > 0 && (
          <mask id="lcr-mask">
            <rect width={size} height={size} fill="white" />
            <circle cx={moonCx} cy={moonCy} r={moonR} fill="black" />
          </mask>
        )}
      </defs>

      {/* Corona */}
      <circle cx={cx} cy={cy} r={r * 2.5} fill="url(#lcr-corona)" opacity={brightness} />

      {/* Sun body */}
      <g mask={eclipsePercent > 0 ? 'url(#lcr-mask)' : undefined}>
        <motion.circle
          cx={cx} cy={cy} r={r}
          fill="url(#lcr-photo)"
          filter="url(#lcr-bloom)"
          opacity={brightness}
          initial={false}
          animate={animate ? { scale: [1, 1.015, 1] } : undefined}
          transition={animate ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : undefined}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />
      </g>

      {/* Moon */}
      {eclipsePercent > 0 && (
        <circle
          cx={moonCx} cy={moonCy} r={moonR}
          fill="var(--bg-deep, #1A0A2E)"
          opacity={0.97}
        />
      )}
    </svg>
  );
}
