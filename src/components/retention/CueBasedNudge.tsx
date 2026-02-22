'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { DetectedPhase } from '@/lib/retention/phase-checkin';

interface ToolNudge {
  emoji: string;
  name: string;
  cue: string;
  time: string;
  rasHook: string;
}

/**
 * Phase-matched tool nudges.
 * Orbit = stretch tools. Gravity Shift = stabilize. Eclipse = ground only.
 * Science: Cue-behavior association (BJ Fogg, Tiny Habits).
 */
const PHASE_TOOL_NUDGES: Record<DetectedPhase, ToolNudge[]> = {
  orbit: [
    {
      emoji: '🚀',
      name: 'Go First',
      cue: 'Your system is clear. Lead before you feel ready.',
      time: '1 min',
      rasHook: 'Your RAS has capacity. Use it for growth reps.',
    },
    {
      emoji: '🎯',
      name: 'Watch Me',
      cue: 'Redirect your attention. Choose what to lock onto.',
      time: '30 sec',
      rasHook: 'Train your attention filter while it\'s receptive.',
    },
    {
      emoji: '⚡',
      name: '143 Challenge',
      cue: 'Hand over heart. "I love you." Reprogram your threat filter.',
      time: '3 min',
      rasHook: '143 = I love you. Self-directed compassion gives your RAS new search instructions.',
    },
  ],
  gravity_shift: [
    {
      emoji: '🗺️',
      name: 'If/Then Planning',
      cue: 'Load is building. Pre-commit your response to friction.',
      time: '5 min',
      rasHook: 'Pre-loaded plans bypass the amygdala under pressure.',
    },
    {
      emoji: '🌬️',
      name: 'Presence Pause',
      cue: 'Steady the base. Feet on floor before your next move.',
      time: '30 sec',
      rasHook: 'Grounding interrupts the drift before it compounds.',
    },
    {
      emoji: '🧠',
      name: 'RAS Reset',
      cue: 'Name 3 things you want your brain to notice today.',
      time: '30 sec',
      rasHook: 'Redirect your attention filter before it defaults to threat.',
    },
  ],
  eclipse_onset: [
    {
      emoji: '🌬️',
      name: 'Presence Pause',
      cue: 'Ground first. Nothing to solve right now.',
      time: '30 sec',
      rasHook: 'Your RAS needs stability before it can process clearly.',
    },
    {
      emoji: '⏱️',
      name: '90-Second Window',
      cue: 'The activation wave lasts 90 seconds. Ride it. Do not respond yet.',
      time: '90 sec',
      rasHook: 'Waiting through the chemical wave is the rep. Your RAS learns that pausing works.',
    },
  ],
  full_eclipse: [
    {
      emoji: '🌬️',
      name: 'Presence Pause',
      cue: 'One breath. That counts.',
      time: '30 sec',
      rasHook: 'Recovery is the rep today. Your RAS rebuilds capacity through rest.',
    },
  ],
};

interface PhaseResponse {
  has_checkin: boolean;
  detected_phase: string | null;
}

export default function CueBasedNudge() {
  const prefersReduced = useReducedMotion();
  const [nudges, setNudges] = useState<ToolNudge[] | null>(null);
  const [phase, setPhase] = useState<DetectedPhase | null>(null);

  useEffect(() => {
    let canceled = false;
    async function load() {
      try {
        const res = await fetch('/api/phase-checkin');
        if (!res.ok) return;
        const data = (await res.json()) as PhaseResponse;
        if (canceled) return;
        if (data.has_checkin && data.detected_phase) {
          const p = data.detected_phase as DetectedPhase;
          setPhase(p);
          setNudges(PHASE_TOOL_NUDGES[p] ?? null);
        }
      } catch {
        // Silently fail — nudges are supplementary
      }
    }
    void load();
    return () => { canceled = true; };
  }, []);

  if (!nudges || !phase) return null;

  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: 'var(--text-on-dark)' }}>
          Tools for today
        </p>
        <Link
          href="/toolkit"
          className="text-xs underline"
          style={{ color: 'var(--brand-gold, #F8D011)' }}
        >
          All tools →
        </Link>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-on-dark-muted)' }}>
        Matched to your check-in. The right tool at the right load level.
      </p>

      <div className="space-y-2">
        {nudges.map((nudge, i) => (
          <motion.div
            key={nudge.name}
            initial={prefersReduced ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: prefersReduced ? 0 : i * 0.08, duration: prefersReduced ? 0 : 0.3 }}
          >
            <Link
              href="/reps"
              className="glass-card flex items-start gap-3 p-3 transition-all group"
              style={{ borderColor: 'rgba(96, 5, 141, 0.15)' }}
            >
              <span className="text-xl">{nudge.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text-on-dark)' }}>
                  {nudge.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-on-dark-secondary)' }}>
                  {nudge.cue}
                </p>
                <p className="text-xs mt-1 italic" style={{ color: 'var(--text-on-dark-muted)' }}>
                  🧠 {nudge.rasHook}
                </p>
              </div>
              <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-on-dark-muted)' }}>
                {nudge.time}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
