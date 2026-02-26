'use client';

import { motion, useReducedMotion } from 'framer-motion';

interface EclipseHeroProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

const EASE: [number, number, number, number] = [0.2, 0.8, 0.2, 1];

/* ────────────────────────────────────────────────────────────
 * EclipseHero — Signature animated header for 143 Leadership.
 * A golden sun enters from the left, then a purple moon slides
 * in from the right to partially eclipse it. Text fades up:
 *   "143"  →  "with Justin Ray"  →  "we upgrade your operating system"
 *
 * Reuses SunCore / HeroEclipseVisual gradient and filter patterns.
 * Respects prefers-reduced-motion (static eclipsed state).
 * ──────────────────────────────────────────────────────────── */

export default function EclipseHero({ variant = 'hero', className }: EclipseHeroProps) {
  const prefersReduced = useReducedMotion();

  if (variant === 'compact') {
    return <CompactEclipse className={className} />;
  }

  return <HeroVariant className={className} animate={!prefersReduced} />;
}

/* ── Hero Variant ─────────────────────────────────────────── */

function HeroVariant({ className, animate }: { className?: string; animate: boolean }) {
  const uid = 'eclipse-hero';

  // Sun geometry
  const sunCx = 480;
  const sunCy = 165;
  const sunR = 65;

  // Moon geometry — ~40% coverage from upper-right
  const moonCx = sunCx + sunR * 0.55;
  const moonCy = sunCy - sunR * 0.35;
  const moonR = sunR * 0.92;

  // Diamond-ring flash point
  const diamondX = moonCx - moonR * 0.75;
  const diamondY = moonCy + moonR * 0.5;

  // Corona wisps
  const wisps = [
    { angle: 200, sx: 1.6, sy: 0.3, o: 0.4 },
    { angle: 240, sx: 1.5, sy: 0.28, o: 0.35 },
    { angle: 170, sx: 1.4, sy: 0.25, o: 0.3 },
    { angle: 130, sx: 1.7, sy: 0.32, o: 0.4 },
    { angle: 280, sx: 1.3, sy: 0.26, o: 0.3 },
    { angle: 320, sx: 1.5, sy: 0.3, o: 0.35 },
  ];

  return (
    <div
      className={className}
      role="img"
      aria-label="143 with Justin Ray — we upgrade your operating system"
    >
      <div className="relative overflow-hidden" style={{ minHeight: 'min(420px, 56vw)' }}>
        {/* ── SVG Celestial Visual ── */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 960 420"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            {/* Photosphere — white-hot core through gold to amber */}
            <radialGradient id={`${uid}-photo`} cx="46%" cy="44%" r="52%">
              <stop offset="0%" stopColor="#FFFEF5" />
              <stop offset="15%" stopColor="#FFF8D6" />
              <stop offset="30%" stopColor="#FFEC80" />
              <stop offset="50%" stopColor="#F8D011" />
              <stop offset="68%" stopColor="#F0B800" />
              <stop offset="82%" stopColor="#E89D0C" />
              <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
            </radialGradient>

            {/* Corona — warm wide haze */}
            <radialGradient id={`${uid}-corona`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.5" />
              <stop offset="15%" stopColor="#F8D011" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#F8D011" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#F0B800" stopOpacity="0.06" />
              <stop offset="75%" stopColor="#E89D0C" stopOpacity="0.02" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Outer bloom gradient */}
            <radialGradient id={`${uid}-outer`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F8D011" stopOpacity="0.18" />
              <stop offset="25%" stopColor="#F0B800" stopOpacity="0.07" />
              <stop offset="55%" stopColor="#E89D0C" stopOpacity="0.02" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Wisp gradient */}
            <radialGradient id={`${uid}-wisp`} cx="50%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#FFF8D6" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#F8D011" stopOpacity="0.15" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>

            {/* Bloom filter — multi-pass gaussian for soft glow */}
            <filter id={`${uid}-bloom`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="12" result="b1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b2" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b3" />
              <feMerge>
                <feMergeNode in="b1" />
                <feMergeNode in="b1" />
                <feMergeNode in="b2" />
                <feMergeNode in="b3" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Wisp blur */}
            <filter id={`${uid}-wisp-blur`} x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="7" result="s1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="s2" />
              <feMerge>
                <feMergeNode in="s1" />
                <feMergeNode in="s2" />
              </feMerge>
            </filter>

            {/* Diamond flash filter */}
            <filter id={`${uid}-diamond-bloom`} x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="4" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── SUN GROUP — slides in from left ── */}
          <motion.g
            initial={animate ? { opacity: 0, x: -220 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: EASE }}
          >
            {/* Outer ambient bloom */}
            <motion.circle
              cx={sunCx}
              cy={sunCy}
              r={sunR * 3.5}
              fill={`url(#${uid}-outer)`}
              opacity={0.65}
              initial={false}
              animate={
                animate
                  ? { opacity: [0.5, 0.85, 0.5] }
                  : undefined
              }
              transition={
                animate
                  ? { duration: 9, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />

            {/* Corona haze */}
            <motion.circle
              cx={sunCx}
              cy={sunCy}
              r={sunR * 2.2}
              fill={`url(#${uid}-corona)`}
              opacity={0.8}
              initial={false}
              animate={
                animate
                  ? { opacity: [0.6, 1, 0.6] }
                  : undefined
              }
              transition={
                animate
                  ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />

            {/* Corona wisps — streaks radiating around the sun */}
            {wisps.map((w, i) => (
              <motion.ellipse
                key={i}
                cx={sunCx}
                cy={sunCy - sunR * 0.6}
                rx={sunR * w.sx}
                ry={sunR * w.sy}
                fill={`url(#${uid}-wisp)`}
                filter={`url(#${uid}-wisp-blur)`}
                opacity={w.o}
                transform={`rotate(${w.angle}, ${sunCx}, ${sunCy})`}
                initial={false}
                animate={
                  animate
                    ? { opacity: [w.o * 0.6, w.o, w.o * 0.6] }
                    : undefined
                }
                transition={
                  animate
                    ? {
                        duration: 5 + (i % 3) * 1.2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1.5 + i * 0.3,
                      }
                    : undefined
                }
              />
            ))}

            {/* Inner glow halo */}
            <circle
              cx={sunCx}
              cy={sunCy}
              r={sunR * 1.4}
              fill={`url(#${uid}-corona)`}
              opacity={0.6}
            />

            {/* Main photosphere — the sun disc */}
            <motion.circle
              cx={sunCx}
              cy={sunCy}
              r={sunR}
              fill={`url(#${uid}-photo)`}
              filter={`url(#${uid}-bloom)`}
              initial={false}
              animate={
                animate ? { scale: [1, 1.015, 1] } : undefined
              }
              transition={
                animate
                  ? { duration: 6, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
              style={{ transformOrigin: `${sunCx}px ${sunCy}px` }}
            />
          </motion.g>

          {/* ── MOON — slides in from right to create eclipse ── */}
          <motion.g
            initial={animate ? { opacity: 0, x: 500 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, delay: 1.5, ease: EASE }}
          >
            {/* Moon body — deep brand purple */}
            <circle cx={moonCx} cy={moonCy} r={moonR} fill="#2A0440" />
            <circle
              cx={moonCx}
              cy={moonCy}
              r={moonR}
              fill="#60058D"
              opacity={0.4}
            />

            {/* Gold rim glow — light leaking around the moon edge */}
            <motion.circle
              cx={moonCx}
              cy={moonCy}
              r={moonR + 1.5}
              fill="none"
              stroke="#F8D011"
              strokeWidth="1.5"
              initial={false}
              animate={
                animate
                  ? { opacity: [0.06, 0.18, 0.06] }
                  : { opacity: 0.1 }
              }
              transition={
                animate
                  ? { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                  : undefined
              }
            />
          </motion.g>

          {/* Diamond-ring flash — peak moment of eclipse */}
          <motion.circle
            cx={diamondX}
            cy={diamondY}
            r={5}
            fill="#FFFEF5"
            filter={`url(#${uid}-diamond-bloom)`}
            initial={animate ? { opacity: 0 } : { opacity: 0.3 }}
            animate={
              animate
                ? { opacity: [0, 0.9, 0.35], scale: [0.3, 2.5, 1] }
                : undefined
            }
            transition={
              animate
                ? { duration: 0.8, delay: 2.5, ease: EASE }
                : undefined
            }
            style={{
              transformOrigin: `${diamondX}px ${diamondY}px`,
            }}
          />
        </svg>

        {/* ── Text Content ── */}
        <div
          className="relative z-10 flex flex-col items-center justify-end text-center px-4"
          style={{
            minHeight: 'inherit',
            paddingTop: 'min(230px, 32vw)',
            paddingBottom: '1.5rem',
          }}
        >
          <motion.p
            className="text-5xl sm:text-6xl lg:text-7xl font-bold"
            style={{
              fontFamily: 'var(--font-cosmic-display)',
              color: '#F8D011',
              textShadow: '0 0 40px rgba(248, 208, 17, 0.3)',
            }}
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.0, ease: EASE }}
          >
            143
          </motion.p>

          <motion.p
            className="mt-2 text-lg sm:text-xl font-medium"
            style={{ color: 'var(--text-on-dark, rgba(255,255,255,0.92))' }}
            initial={animate ? { opacity: 0, y: 16 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3.3, ease: EASE }}
          >
            with Justin Ray
          </motion.p>

          <motion.p
            className="mt-1 text-sm sm:text-base tracking-wide uppercase"
            style={{
              color: 'var(--text-on-dark-secondary, rgba(255,255,255,0.70))',
              letterSpacing: '0.12em',
            }}
            initial={animate ? { opacity: 0, y: 12 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3.6, ease: EASE }}
          >
            we upgrade your operating system
          </motion.p>
        </div>
      </div>
    </div>
  );
}

/* ── Compact Variant ──────────────────────────────────────── */

function CompactEclipse({ className }: { className?: string }) {
  const uid = 'eclipse-compact';
  const cx = 30;
  const cy = 30;
  const r = 18;
  const moonCx = cx + r * 0.55;
  const moonCy = cy - r * 0.35;
  const moonR = r * 0.92;

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <svg
        viewBox="0 0 60 60"
        width="48"
        height="48"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`${uid}-photo`} cx="46%" cy="44%" r="52%">
            <stop offset="0%" stopColor="#FFFEF5" />
            <stop offset="30%" stopColor="#FFEC80" />
            <stop offset="60%" stopColor="#F8D011" />
            <stop offset="100%" stopColor="#D4770B" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Faint glow */}
        <circle cx={cx} cy={cy} r={r * 1.5} fill="#F8D011" opacity={0.08} />

        {/* Sun disc */}
        <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}-photo)`} />

        {/* Moon body */}
        <circle cx={moonCx} cy={moonCy} r={moonR} fill="#2A0440" />
        <circle cx={moonCx} cy={moonCy} r={moonR} fill="#60058D" opacity={0.4} />

        {/* Rim glow */}
        <circle
          cx={moonCx}
          cy={moonCy}
          r={moonR + 0.5}
          fill="none"
          stroke="#F8D011"
          strokeWidth="0.5"
          opacity={0.12}
        />
      </svg>

      <div>
        <p
          className="text-sm font-bold"
          style={{
            fontFamily: 'var(--font-cosmic-display)',
            color: '#F8D011',
          }}
        >
          143
        </p>
        <p
          className="text-xs"
          style={{ color: 'var(--text-on-dark-secondary)' }}
        >
          with Justin Ray
        </p>
      </div>
    </div>
  );
}
