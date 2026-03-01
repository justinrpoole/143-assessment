'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { AssessmentOutputV1 } from '@/lib/types';
import { RAY_COLORS } from '@/lib/ui/ray-colors';
import CelebrationBurst from '@/components/ui/CelebrationBurst';

interface Props {
  output: AssessmentOutputV1;
  runId: string;
  onComplete: () => void;
}

/* ─── localStorage helpers ─────────────────────────────────────── */
const STORAGE_KEY = 'reveal-seen';

function hasSeenReveal(runId: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(seen) && seen.includes(runId);
  } catch {
    return false;
  }
}

function markRevealSeen(runId: string) {
  try {
    const seen = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    if (!seen.includes(runId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, runId].slice(-20)));
    }
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([runId]));
  }
}

/* ─── Corona streamers (16, pre-defined to avoid random on render) ─ */
const CORONA = [
  { a: 0,     len: 92,  w: 2.5 },
  { a: 22.5,  len: 50,  w: 1.0 },
  { a: 45,    len: 112, w: 2.0 },
  { a: 67.5,  len: 36,  w: 1.0 },
  { a: 90,    len: 96,  w: 2.5 },
  { a: 112.5, len: 48,  w: 1.0 },
  { a: 135,   len: 118, w: 2.0 },
  { a: 157.5, len: 32,  w: 1.0 },
  { a: 180,   len: 100, w: 2.5 },
  { a: 202.5, len: 44,  w: 1.0 },
  { a: 225,   len: 108, w: 2.0 },
  { a: 247.5, len: 58,  w: 1.0 },
  { a: 270,   len: 88,  w: 2.5 },
  { a: 292.5, len: 52,  w: 1.0 },
  { a: 315,   len: 116, w: 2.0 },
  { a: 337.5, len: 40,  w: 1.0 },
];

/* ─── 9 ray positions on an ellipse (% of container) ────────────── */
// Ellipse center 50%/48%, x-radius 30%, y-radius 22%
const CIRCLE_POS = Array.from({ length: 9 }, (_, i) => {
  const angle = (i / 9) * Math.PI * 2 - Math.PI / 2; // start at top
  return {
    x: 50 + 30 * Math.cos(angle),
    y: 48 + 22 * Math.sin(angle),
  };
});

/* ─── Stage timings (ms from reveal mount) ──────────────────────── */
const STAGE_MS = [0, 2000, 5000, 9000, 11000];
const REDIRECT_MS = 12500;

type StageId = 0 | 1 | 2 | 3 | 4;

/* ─── Derived ray type ───────────────────────────────────────────── */
interface RevealRay {
  id: string;
  name: string;
  score: number;
  hex: string;
  pos: { x: number; y: number };
}

/*═══════════════════════════════════════════════════════════════════
 * STAGE 0 — ECLIPSE MOMENT
 *
 * Deep black screen. A single point of gold light appears at center
 * and corona streamers radiate out, simulating a total eclipse reveal.
 *═══════════════════════════════════════════════════════════════════*/
function StageEclipse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <svg
        viewBox="-160 -160 320 320"
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 320, height: 320,
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          {CORONA.map((r, i) => {
            const rad = (r.a * Math.PI) / 180;
            return (
              <linearGradient
                key={i}
                id={`cg${i}`}
                gradientUnits="userSpaceOnUse"
                x1="0" y1="0"
                x2={(Math.cos(rad) * r.len).toFixed(2)}
                y2={(Math.sin(rad) * r.len).toFixed(2)}
              >
                <stop offset="0%"   stopColor="#F8D011" stopOpacity="0.95" />
                <stop offset="55%"  stopColor="#F8D011" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#F8D011" stopOpacity="0"   />
              </linearGradient>
            );
          })}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFFFFF"  stopOpacity="1"   />
            <stop offset="25%"  stopColor="#FFF4A0"  stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#F8D011"  stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F8D011"  stopOpacity="0"   />
          </radialGradient>
        </defs>

        {/* Wide ambient glow pulse */}
        <motion.circle
          cx="0" cy="0" r="140"
          fill="none"
          stroke="rgba(248,208,17,0.06)"
          strokeWidth="280"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 1.8, ease: 'easeOut' }}
        />

        {/* Corona streamers — staggered pathLength */}
        {CORONA.map((r, i) => {
          const rad = (r.a * Math.PI) / 180;
          const x2 = (Math.cos(rad) * r.len).toFixed(2);
          const y2 = (Math.sin(rad) * r.len).toFixed(2);
          return (
            <motion.path
              key={i}
              d={`M 0 0 L ${x2} ${y2}`}
              stroke={`url(#cg${i})`}
              strokeWidth={r.w}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.55 + i * 0.045,
                duration: 0.75,
                type: 'spring',
                stiffness: 90,
                damping: 22,
              }}
            />
          );
        })}

        {/* Expanding pulse rings */}
        {[0.7, 1.1, 1.5].map((delay, i) => (
          <motion.circle
            key={`ring${i}`}
            cx="0" cy="0" r="20"
            fill="none"
            stroke="#F8D011"
            strokeWidth={1.2 - i * 0.3}
            initial={{ scale: 0.4, opacity: 0.7 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{
              delay,
              duration: 1.6,
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Inner glow disc */}
        <motion.circle
          cx="0" cy="0" r="22"
          fill="url(#coreGlow)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 1], opacity: 1 }}
          transition={{
            delay: 0.3,
            duration: 1.1,
            times: [0, 0.55, 1],
            type: 'spring',
            stiffness: 45,
            damping: 14,
          }}
        />

        {/* Bright core point */}
        <motion.circle
          cx="0" cy="0" r="5"
          fill="#FFFFFF"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.8, 1] }}
          transition={{ delay: 0.3, duration: 0.9, times: [0, 0.5, 1] }}
        />
      </svg>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7 }}
        style={{
          position: 'absolute',
          bottom: '28%',
          left: 0, right: 0,
          textAlign: 'center',
          fontSize: 11,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(248,208,17,0.65)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Calculating your light signature
      </motion.p>
    </div>
  );
}

/*═══════════════════════════════════════════════════════════════════
 * STAGE 1 — RAY CASCADE
 *
 * All 9 rays fly in one by one from the periphery to their positions
 * on the ellipse. Top rays are larger and brighter.
 *═══════════════════════════════════════════════════════════════════*/
function StageRayCascade({ rays }: { rays: RevealRay[] }) {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* Central sun point */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.6, type: 'spring', stiffness: 60 }}
        style={{
          position: 'absolute',
          top: '48%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 8, height: 8,
          borderRadius: '50%',
          background: '#F8D011',
          boxShadow: '0 0 30px rgba(248,208,17,0.6), 0 0 80px rgba(248,208,17,0.3)',
        }}
      />

      {rays.map((ray, i) => {
        const isTop = i < 2;
        const orbSize = isTop ? 54 : 38;
        // Fly-in from outside — diagonal based on position quadrant
        const flyX = ray.pos.x < 50 ? '-55vw' : '55vw';
        const flyY = ray.pos.y < 48 ? '-45vh' : '45vh';

        return (
          <motion.div
            key={ray.id}
            initial={{ opacity: 0, x: flyX, y: flyY }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              delay: i * 0.27,
              type: 'spring',
              stiffness: 55,
              damping: 16,
              mass: 0.9,
            }}
            style={{
              position: 'absolute',
              left: `${ray.pos.x}%`,
              top: `${ray.pos.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Outer glow ring */}
            <motion.div
              animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
              transition={{
                delay: i * 0.27 + 0.6,
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                width: orbSize + 20,
                height: orbSize + 20,
                borderRadius: '50%',
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: `radial-gradient(circle, ${ray.hex}22 0%, transparent 70%)`,
                boxShadow: `0 0 ${isTop ? 50 : 28}px ${ray.hex}${isTop ? '55' : '33'}`,
              }}
            />

            {/* Core orb */}
            <div
              style={{
                width: orbSize,
                height: orbSize,
                borderRadius: '50%',
                background: `radial-gradient(circle at 38% 38%, ${ray.hex}cc 0%, ${ray.hex}55 45%, ${ray.hex}18 70%, transparent 100%)`,
                border: `1px solid ${ray.hex}55`,
                boxShadow: `0 0 ${isTop ? 40 : 18}px ${ray.hex}55`,
              }}
            />

            {/* Label + score */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.27 + 0.35, duration: 0.5 }}
              style={{
                position: 'absolute',
                top: orbSize + 6,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  fontSize: isTop ? 12 : 10,
                  fontWeight: isTop ? 700 : 500,
                  color: ray.hex,
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-body)',
                }}
              >
                {ray.name}
              </div>
              <div
                style={{
                  fontSize: isTop ? 11 : 9,
                  color: `${ray.hex}aa`,
                  marginTop: 1,
                }}
              >
                {Math.round(ray.score)}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

/*═══════════════════════════════════════════════════════════════════
 * STAGE 2 — LIGHT SIGNATURE REVELATION
 *
 * The archetype name EXPLODES in — large gold Orbitron text, glowing
 * and pulsing. "YOUR LIGHT SIGNATURE IS:" above in small caps.
 * CelebrationBurst fires at this stage's start.
 *═══════════════════════════════════════════════════════════════════*/
function StageSignatureReveal({
  name,
  essence,
}: {
  name: string;
  essence: string;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      {/* "YOUR LIGHT SIGNATURE IS" */}
      <motion.p
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.7, type: 'spring', stiffness: 60, damping: 20 }}
        style={{
          fontSize: 10,
          letterSpacing: '0.45em',
          textTransform: 'uppercase',
          color: 'rgba(248,208,17,0.72)',
          marginBottom: 18,
          fontFamily: 'var(--font-body)',
        }}
      >
        Your Light Signature Is
      </motion.p>

      {/* Archetype name — the explosion moment */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.08, filter: 'blur(24px)' }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
        }}
        transition={{
          delay: 0.45,
          duration: 1.3,
          type: 'spring',
          stiffness: 38,
          damping: 14,
          mass: 1.6,
        }}
        style={{
          fontSize: 'clamp(38px, 9vw, 76px)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          color: 'var(--brand-gold, #F8D011)',
          textShadow:
            '0 0 30px rgba(248,208,17,0.95), 0 0 70px rgba(248,208,17,0.55), 0 0 140px rgba(248,208,17,0.28), 0 0 240px rgba(96,5,141,0.35)',
          lineHeight: 1.1,
          maxWidth: '92vw',
        }}
      >
        {name}
      </motion.h1>

      {/* Gold divider line */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ delay: 1.55, duration: 0.9, ease: 'easeOut' }}
        style={{
          height: 1,
          width: 130,
          background: 'linear-gradient(90deg, transparent, var(--brand-gold, #F8D011), transparent)',
          margin: '22px auto',
          transformOrigin: 'center',
        }}
      />

      {/* Essence text */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.1, duration: 0.7, ease: 'easeOut' }}
        style={{
          fontSize: 'clamp(14px, 2.6vw, 18px)',
          color: 'rgba(255,255,255,0.75)',
          maxWidth: 400,
          lineHeight: 1.65,
          fontFamily: 'var(--font-body)',
        }}
      >
        {essence}
      </motion.p>
    </div>
  );
}

/*═══════════════════════════════════════════════════════════════════
 * STAGE 3 — BEAM CONNECTIONS
 *
 * Top 2-3 rays re-appear, pulsing, with SVG light beams drawn
 * between them using animating pathLength.
 *═══════════════════════════════════════════════════════════════════*/
function StageBeamConnections({ beamRays }: { beamRays: RevealRay[] }) {
  const pairs: Array<[RevealRay, RevealRay]> = [];
  for (let i = 0; i < beamRays.length - 1; i++) {
    for (let j = i + 1; j < beamRays.length; j++) {
      pairs.push([beamRays[i], beamRays[j]]);
    }
  }

  return (
    <div className="absolute inset-0" aria-hidden="true">
      {/* SVG beam layer — viewBox 0 0 100 100, preserveAspectRatio=none
          maps directly to the % positions of the ray orbs */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          {pairs.map(([a, b], i) => (
            <linearGradient
              key={`bg${i}`}
              id={`bg${i}`}
              gradientUnits="userSpaceOnUse"
              x1={a.pos.x} y1={a.pos.y}
              x2={b.pos.x} y2={b.pos.y}
            >
              <stop offset="0%"   stopColor={a.hex} stopOpacity="0.85" />
              <stop offset="50%"  stopColor="#F8D011" stopOpacity="0.4" />
              <stop offset="100%" stopColor={b.hex} stopOpacity="0.85" />
            </linearGradient>
          ))}
        </defs>

        {pairs.map(([a, b], i) => (
          <g key={i}>
            {/* Wide soft beam */}
            <motion.path
              d={`M ${a.pos.x} ${a.pos.y} L ${b.pos.x} ${b.pos.y}`}
              stroke={`url(#bg${i})`}
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.35 }}
              transition={{ delay: i * 0.5 + 0.25, duration: 1.6, ease: 'easeInOut' }}
            />
            {/* Bright core beam */}
            <motion.path
              d={`M ${a.pos.x} ${a.pos.y} L ${b.pos.x} ${b.pos.y}`}
              stroke={`url(#bg${i})`}
              strokeWidth="0.35"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.9 }}
              transition={{ delay: i * 0.5 + 0.25, duration: 1.6, ease: 'easeInOut' }}
            />
          </g>
        ))}
      </svg>

      {/* Ray orbs — pulsing */}
      {beamRays.map((ray, i) => (
        <motion.div
          key={ray.id}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: i * 0.18,
            type: 'spring',
            stiffness: 55,
            damping: 16,
          }}
          style={{
            position: 'absolute',
            left: `${ray.pos.x}%`,
            top: `${ray.pos.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ delay: i * 0.18 + 0.5, duration: 2, repeat: Infinity, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: `1px solid ${ray.hex}`,
            }}
          />
          {/* Core */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ delay: i * 0.18 + 0.4, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: `radial-gradient(circle at 38% 38%, ${ray.hex}cc 0%, ${ray.hex}55 45%, ${ray.hex}18 70%, transparent 100%)`,
              border: `1.5px solid ${ray.hex}66`,
              boxShadow: `0 0 48px ${ray.hex}55, 0 0 96px ${ray.hex}28`,
            }}
          />
          {/* Name */}
          <div
            style={{
              position: 'absolute',
              top: 66,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 11,
              fontWeight: 700,
              color: ray.hex,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.06em',
            }}
          >
            {ray.name}
          </div>
        </motion.div>
      ))}

      {/* Stage label */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        style={{
          position: 'absolute',
          bottom: '18%',
          left: 0, right: 0,
          textAlign: 'center',
          fontSize: 10,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'rgba(248,208,17,0.5)',
          fontFamily: 'var(--font-body)',
        }}
      >
        Your rays, connected
      </motion.p>
    </div>
  );
}

/*═══════════════════════════════════════════════════════════════════
 * STAGE 4 — FINALE
 *
 * "You are more than your eclipse. Watch what happens next."
 *═══════════════════════════════════════════════════════════════════*/
function StageFinale() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.9, type: 'spring', stiffness: 52, damping: 18 }}
      >
        <p
          style={{
            fontSize: 'clamp(18px, 3.5vw, 26px)',
            color: 'rgba(255,255,255,0.92)',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.4,
            marginBottom: 14,
          }}
        >
          You are more than your eclipse.
        </p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7, ease: 'easeOut' }}
          style={{
            fontSize: 'clamp(15px, 2.8vw, 22px)',
            color: 'var(--brand-gold, #F8D011)',
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 24px rgba(248,208,17,0.5)',
          }}
        >
          Watch what happens next.
        </motion.p>
      </motion.div>

      {/* Subtle pulse indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ delay: 1.5, duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          marginTop: 40,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(248,208,17,0.5)',
        }}
      />
    </div>
  );
}

/*═══════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 *═══════════════════════════════════════════════════════════════════*/
export default function LightSignatureReveal({ output, runId, onComplete }: Props) {
  const prefersReduced = useReducedMotion();
  const [stage, setStage] = useState<StageId>(0);
  // Lazy init: check localStorage on mount so we never need a separate
  // useEffect that calls setVisible, avoiding the set-state-in-effect lint rule.
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return !hasSeenReveal(runId);
  });
  const [showBurst, setShowBurst] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = useCallback(() => {
    markRevealSeen(runId);
    timersRef.current.forEach(clearTimeout);
    setVisible(false);
    onComplete();
  }, [runId, onComplete]);

  /* Schedule all stage transitions once the reveal is shown */
  useEffect(() => {
    if (!visible) return;
    const ids: ReturnType<typeof setTimeout>[] = [];

    ids.push(setTimeout(() => setStage(1), STAGE_MS[1]));
    ids.push(setTimeout(() => { setStage(2); setShowBurst(true); }, STAGE_MS[2]));
    ids.push(setTimeout(() => setStage(3), STAGE_MS[3]));
    ids.push(setTimeout(() => setStage(4), STAGE_MS[4]));
    ids.push(setTimeout(finish, REDIRECT_MS));

    timersRef.current = ids;
    return () => ids.forEach(clearTimeout);
  }, [visible, finish]);

  /* Reduced motion — skip immediately in render (same pattern as original) */
  if (prefersReduced && visible) {
    markRevealSeen(runId);
    setVisible(false);
    onComplete();
    return null;
  }

  /* ── Prepare ray data ── */
  const sortedRays: RevealRay[] = Object.values(output.rays)
    .sort((a, b) => b.score - a.score)
    .map((ray, i) => ({
      id: ray.ray_id,
      name: ray.ray_name,
      score: ray.score,
      hex: RAY_COLORS[ray.ray_id]?.hex ?? '#F8D011',
      pos: CIRCLE_POS[i % 9],
    }));

  // Top 2-3 rays for beam connections
  // Prefer the light_signature top_two + just_in_ray, falling back to score order
  const topIdList: string[] = [
    ...(output.light_signature?.top_two ?? []).map(r => r.ray_id),
    ...(output.light_signature?.just_in_ray?.ray_id
      ? [output.light_signature.just_in_ray.ray_id]
      : []),
  ];
  const topIds = new Set(topIdList);

  // Map beam rays to their positions in sortedRays so positions are consistent
  const beamRays: RevealRay[] = sortedRays
    .filter(r => topIds.has(r.id))
    .slice(0, 3);

  // Fall back to top 2 by score if light_signature data is sparse
  const finalBeamRays = beamRays.length >= 2 ? beamRays : sortedRays.slice(0, 2);

  const archetype = output.light_signature?.archetype;
  const archetypeName = archetype?.name ?? 'Light Bearer';
  const archetypeEssence = archetype?.essence ?? 'A unique combination of leadership capacities at work in you.';

  if (!visible) return null;

  return (
    <>
      <CelebrationBurst trigger={showBurst} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(26,10,46,0.95) 0%, #020010 70%, #000000 100%)',
        }}
      >
        {/* Stage content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            {stage === 0 && <StageEclipse />}
            {stage === 1 && <StageRayCascade rays={sortedRays} />}
            {stage === 2 && (
              <StageSignatureReveal
                name={archetypeName}
                essence={archetypeEssence}
              />
            )}
            {stage === 3 && <StageBeamConnections beamRays={finalBeamRays} />}
            {stage === 4 && <StageFinale />}
          </motion.div>
        </AnimatePresence>

        {/* Stage progress dots */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            left: 0, right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: i === stage ? 24 : 7,
                height: 7,
                borderRadius: 4,
                background: i === stage
                  ? 'var(--brand-gold, #F8D011)'
                  : 'rgba(255,255,255,0.18)',
                boxShadow: i === stage ? '0 0 10px rgba(248,208,17,0.45)' : 'none',
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Skip button — subtle, bottom right */}
        <button
          onClick={finish}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            padding: '7px 16px',
            borderRadius: 20,
            fontSize: 11,
            color: 'rgba(255,255,255,0.42)',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            cursor: 'pointer',
            letterSpacing: '0.06em',
          }}
        >
          Skip
        </button>
      </motion.div>
    </>
  );
}
