'use client';

import { motion, useReducedMotion } from 'framer-motion';

/* ── Seven-segment geometry ──────────────────────── */

const T = 4; // segment thickness
const HL = 14; // horizontal segment length
const VL = 16; // vertical segment length
const GAP = 1.5; // gap between segments

const DIGIT_W = T + GAP + HL + GAP + T; // 25
const DIGIT_H = T + GAP + VL + GAP + T + GAP + VL + GAP + T; // 50

// Segments: a(top), b(top-right), c(bot-right), d(bottom), e(bot-left), f(top-left), g(middle)
const DIGITS: Record<string, boolean[]> = {
  '1': [false, true, true, false, false, false, false],
  '3': [true, true, true, true, false, false, true],
  '4': [false, true, true, false, false, true, true],
};

type SegRect = { x: number; y: number; w: number; h: number };

function segmentRects(ox: number, oy: number): SegRect[] {
  const rX = ox + T + GAP + HL + GAP; // right column x
  const mY = oy + T + GAP + VL + GAP; // middle row y
  const bY = mY + T + GAP; // bottom-half start y
  const dY = bY + VL + GAP; // bottom row y

  return [
    { x: ox + T + GAP, y: oy, w: HL, h: T }, // a – top
    { x: rX, y: oy + T + GAP, w: T, h: VL }, // b – top-right
    { x: rX, y: bY, w: T, h: VL }, // c – bot-right
    { x: ox + T + GAP, y: dY, w: HL, h: T }, // d – bottom
    { x: ox, y: bY, w: T, h: VL }, // e – bot-left
    { x: ox, y: oy + T + GAP, w: T, h: VL }, // f – top-left
    { x: ox + T + GAP, y: mY, w: HL, h: T }, // g – middle
  ];
}

/* ── Layout ──────────────────────────────────────── */

const SVG_W = 240;
const SVG_H = 82;
const COLON_W = 6;
const DIGIT_GAP = 8;
const PAIR_GAP = 5;
const DIGIT_Y = 16;

const TOTAL_W =
  DIGIT_W + DIGIT_GAP + COLON_W + DIGIT_GAP + DIGIT_W + PAIR_GAP + DIGIT_W;
const START_X = (SVG_W - TOTAL_W) / 2;

const POS_1 = START_X;
const POS_COLON = POS_1 + DIGIT_W + DIGIT_GAP;
const POS_4 = POS_COLON + COLON_W + DIGIT_GAP;
const POS_3 = POS_4 + DIGIT_W + PAIR_GAP;

const COLON_CX = POS_COLON + COLON_W / 2;
const COLON_R = 3;
const COLON_Y1 = DIGIT_Y + DIGIT_H * 0.33;
const COLON_Y2 = DIGIT_Y + DIGIT_H * 0.67;

const GOLD = '#F4C430';
const GOLD_DIM = 'rgba(244,196,48,0.08)';

/* ── Component ───────────────────────────────────── */

export default function DigitalClock143() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      className="mx-auto"
      style={{ maxWidth: '280px', width: '100%' }}
      role="img"
      aria-label="Digital clock showing 1:43"
    >
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          <filter id="dc143-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="dc143-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0a2e" />
            <stop offset="100%" stopColor="#0C0118" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect
          x="0"
          y="0"
          width={SVG_W}
          height={SVG_H}
          rx="16"
          ry="16"
          fill="url(#dc143-bg)"
          stroke="rgba(244,196,48,0.15)"
          strokeWidth="1.5"
        />

        {/* Digits with glow */}
        <g filter="url(#dc143-glow)">
          <Digit char="1" x={POS_1} y={DIGIT_Y} />
          <Digit char="4" x={POS_4} y={DIGIT_Y} />
          <Digit char="3" x={POS_3} y={DIGIT_Y} />
        </g>

        {/* Colon — blinks unless reduced motion */}
        <motion.g
          initial={{ opacity: 1 }}
          animate={!prefersReduced ? { opacity: [1, 0.15, 1] } : undefined}
          transition={
            !prefersReduced
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  times: [0, 0.5, 1],
                }
              : undefined
          }
        >
          <circle cx={COLON_CX} cy={COLON_Y1} r={COLON_R} fill={GOLD} />
          <circle cx={COLON_CX} cy={COLON_Y2} r={COLON_R} fill={GOLD} />
        </motion.g>

      </svg>
    </div>
  );
}

/* ── Digit renderer ──────────────────────────────── */

function Digit({ char, x, y }: { char: string; x: number; y: number }) {
  const active = DIGITS[char];
  if (!active) return null;

  const segs = segmentRects(x, y);

  return (
    <g>
      {segs.map((s, i) => (
        <rect
          key={i}
          x={s.x}
          y={s.y}
          width={s.w}
          height={s.h}
          rx={1.5}
          fill={active[i] ? GOLD : GOLD_DIM}
        />
      ))}
    </g>
  );
}
