'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { RAY_SHORT_NAMES, RAY_VERBS } from '@/lib/types';

const LS_KEY = '143_morning_mirror_last';
const LS_DISABLED_KEY = '143_morning_mirror_disabled';

/** Micro-reps mapped to bottom ray — one per ray, actionable and short */
const BOTTOM_RAY_REPS: Record<string, string[]> = {
  R1: [
    'Name your one priority for today. Just one.',
    'Write one If/Then for the next predictable friction moment.',
    'Before your first meeting, ask: what would make this day worth it?',
  ],
  R2: [
    'Capture one "joy receipt" — a small win you usually skip past.',
    'Name something that made you smile yesterday. Let it land.',
    'Notice one thing today that works. Write it down before noon.',
  ],
  R3: [
    'Feet on floor. One long exhale. Name three things you can see.',
    'Before your next conversation, take one full breath first.',
    '10-second reset: close your eyes, feel your feet, open your eyes.',
  ],
  R4: [
    'Do the first 60 seconds of the thing you are avoiding.',
    'Name one boundary you need to hold today. Say it out loud.',
    'Choose one "no" today that makes space for a better "yes."',
  ],
  R5: [
    'Write one sentence about why today matters to you.',
    'Name one thing you are doing today that aligns with who you are becoming.',
    'Ask: is this urgent, or is it important? Choose the important thing first.',
  ],
  R6: [
    'Say one true thing you have been holding back. Even to yourself.',
    'Notice where you are performing. Choose one moment to be real instead.',
    'Name one thing you believe that you have not said out loud recently.',
  ],
  R7: [
    'Send one message to someone you have been thinking about.',
    'In your next conversation, listen one sentence longer before responding.',
    'Name one person who makes you better. Reach out today.',
  ],
  R8: [
    'Write down one idea you dismissed too quickly this week. Revisit it.',
    'Ask: what if this could work? Give yourself 60 seconds to imagine it.',
    'Name one assumption you are making. Challenge it with one question.',
  ],
  R9: [
    'Do something small today that helps someone else without being asked.',
    'Ask: where can I model what I want to see in others?',
    'Name one way you showed up for someone else this week. Let it count.',
  ],
};

/** Coaching questions that rotate daily */
const COACHING_QUESTIONS = [
  'What is the smallest rep that would make tomorrow easier?',
  'Where did I choose (or avoid) the honest boundary today?',
  'What did I reinforce that I want repeated — behavior, not vibe?',
  'What would I tell a friend in my exact situation right now?',
  'What am I carrying that is not mine to carry?',
  'Where am I waiting for permission I already have?',
  'What pattern do I keep noticing but not naming?',
  'If today were a rep, what muscle did I train?',
  'What is one thing I can let go of before tomorrow?',
  'What did I learn about myself today that I did not know yesterday?',
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning.';
  if (hour < 17) return 'Good afternoon.';
  return 'Good evening.';
}

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function shouldShowMirror(): boolean {
  if (typeof window === 'undefined') return false;
  if (localStorage.getItem(LS_DISABLED_KEY) === 'true') return false;

  const last = localStorage.getItem(LS_KEY);
  if (!last) return true;

  const lastDate = new Date(last).toDateString();
  const today = new Date().toDateString();
  return lastDate !== today;
}

function markMirrorShown() {
  localStorage.setItem(LS_KEY, new Date().toISOString());
}

interface MorningMirrorOverlayProps {
  bottomRayId: string | null;
  bottomRayName: string | null;
  streakDays: number;
}

export default function MorningMirrorOverlay({
  bottomRayId,
  bottomRayName,
  streakDays,
}: MorningMirrorOverlayProps) {
  const [visible, setVisible] = useState(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (shouldShowMirror()) {
      setVisible(true);
    }
  }, []);

  const dismiss = useCallback(() => {
    markMirrorShown();
    setVisible(false);
  }, []);

  if (!visible) return null;

  const dayOfYear = getDayOfYear();
  const rayId = bottomRayId ?? 'R3'; // default to Presence
  const reps = BOTTOM_RAY_REPS[rayId] ?? BOTTOM_RAY_REPS.R3;
  const todayRep = reps[dayOfYear % reps.length];
  const todayQuestion = COACHING_QUESTIONS[dayOfYear % COACHING_QUESTIONS.length];
  const rayVerb = RAY_VERBS[rayId] ?? 'Practice';
  const rayShort = RAY_SHORT_NAMES[rayId] ?? bottomRayName ?? 'Presence';
  const greeting = getTimeGreeting();

  const streakLine = streakDays > 0
    ? `${streakDays} day${streakDays !== 1 ? 's' : ''} in a row.`
    : null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="morning-mirror"
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ background: 'var(--overlay-heavy)' }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.5 }}
          onClick={dismiss}
          role="dialog"
          aria-label="Morning mirror — daily opening ritual"
        >
          <motion.div
            className="w-full max-w-md space-y-6"
            initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Greeting */}
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold" style={{ color: 'var(--text-on-dark)' }}>
                {greeting}
              </p>
              {streakLine && (
                <p className="text-sm font-medium" style={{ color: 'var(--brand-gold)' }}>
                  {streakLine}
                </p>
              )}
            </div>

            {/* Bottom ray + micro-rep */}
            <div
              className="glass-card p-5 space-y-3"
              style={{ borderColor: 'rgba(248, 208, 17, 0.25)' }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--brand-gold)' }}>
                {rayVerb}: {rayShort}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-on-dark)' }}>
                {todayRep}
              </p>
            </div>

            {/* Coaching question */}
            <div className="glass-card p-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-on-dark-muted)' }}>
                Today&apos;s question
              </p>
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--text-on-dark-secondary)' }}>
                &ldquo;{todayQuestion}&rdquo;
              </p>
            </div>

            {/* Dismiss */}
            <button
              type="button"
              onClick={dismiss}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide transition-all hover:brightness-110"
              style={{ background: 'var(--brand-gold)', color: 'var(--brand-black)' }}
            >
              Let&apos;s go
            </button>

            <p className="text-center text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
              Tap anywhere to dismiss
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Toggle component for disabling Morning Mirror — use in settings */
export function MorningMirrorToggle() {
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(localStorage.getItem(LS_DISABLED_KEY) === 'true');
  }, []);

  function toggle() {
    const next = !disabled;
    setDisabled(next);
    localStorage.setItem(LS_DISABLED_KEY, String(next));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-3 w-full text-left"
    >
      <div
        className="w-10 h-6 rounded-full relative transition-colors"
        style={{
          background: disabled ? 'rgba(255,255,255,0.1)' : 'var(--brand-gold)',
        }}
      >
        <div
          className="absolute top-1 w-4 h-4 rounded-full transition-transform"
          style={{
            background: disabled ? 'var(--text-on-dark-muted)' : 'var(--brand-black)',
            left: disabled ? '4px' : '22px',
          }}
        />
      </div>
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
          Morning Mirror
        </p>
        <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
          {disabled ? 'Off — no daily greeting overlay' : 'On — shows once per day on portal open'}
        </p>
      </div>
    </button>
  );
}
