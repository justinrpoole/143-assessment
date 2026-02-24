/**
 * Copy Library v1 — Centralized access to all user-facing strings.
 *
 * This module provides a single import point for all copy used across
 * the 143 Leadership app. It consolidates:
 *
 * 1. PAGE_COPY_V1 (page_copy.v1.ts) — landing page / marketing copy
 * 2. MARKETING_COPY_BIBLE (marketing_copy_bible.v1.ts) — headlines + promises
 * 3. LOCKED_STRINGS (voice-lock.v1.ts) — voice-locked canonical strings
 * 4. ECLIPSE_COPY (cosmic-copy.ts) — eclipse level labels + coaching
 * 5. RAY_NAMES — canonical ray naming (replicated from multiple sources)
 *
 * Zone-aware: every string group is tagged with its ToneZone from
 * tone-matrix.v1.ts so QA scripts can validate copy in context.
 *
 * Usage:
 *   import { COPY, RAY_NAMES, getEclipseLabel } from '@/content/copy-library.v1';
 *   const headline = COPY.marketing.upgradeYourOs.headline;
 */

import type { ToneZone } from './tone-matrix.v1';

// ─── Ray Names (canonical, §5/§9) ──────────────────────────────────────

export const RAY_NAMES: Record<string, string> = {
  R1: 'Intention',
  R2: 'Joy',
  R3: 'Presence',
  R4: 'Power',
  R5: 'Purpose',
  R6: 'Authenticity',
  R7: 'Connection',
  R8: 'Possibility',
  R9: 'Be The Light',
};

export const RAY_IDS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9'] as const;
export type RayId = (typeof RAY_IDS)[number];

// ─── Eclipse Level Labels ───────────────────────────────────────────────

export type EclipseLevel = 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';

export const ECLIPSE_LABELS: Record<EclipseLevel, string> = {
  LOW: 'Your system is stable. Energy is available for growth.',
  MODERATE: 'Some load near the edge — normal operating range.',
  ELEVATED: 'Your system is managing real pressure. Capacity is partially eclipsed.',
  HIGH: 'Your system is conserving energy right now. Your capacity is eclipsed, not gone.',
};

export function getEclipseLabel(level: EclipseLevel): string {
  return ECLIPSE_LABELS[level] ?? ECLIPSE_LABELS.MODERATE;
}

// ─── Confidence Band Labels ─────────────────────────────────────────────

export type ConfidenceBand = 'HIGH' | 'MODERATE' | 'LOW';

export const CONFIDENCE_LABELS: Record<ConfidenceBand, {
  label: string;
  description: string;
  color: string;
}> = {
  HIGH: {
    label: 'High Confidence',
    description: 'Strong data quality. Your results reflect a clear, consistent signal.',
    color: '#34D399',
  },
  MODERATE: {
    label: 'Moderate Confidence',
    description: 'Good data quality with minor variability. Your core profile is reliable.',
    color: 'var(--brand-gold, #F8D011)',
  },
  LOW: {
    label: 'Lower Confidence',
    description: 'Some data quality concerns detected. Consider a retake for sharper accuracy.',
    color: '#FB923C',
  },
};

// ─── Stability Labels ───────────────────────────────────────────────────

export const STABILITY_LABELS = {
  HIGHLY_STABLE: { label: 'Highly stable', threshold: 85 },
  MODERATE: { label: 'Moderately stable', threshold: 65 },
  EVOLVING: { label: 'Evolving', threshold: 0 },
} as const;

export function getStabilityLabel(pct: number): string {
  if (pct >= STABILITY_LABELS.HIGHLY_STABLE.threshold) return STABILITY_LABELS.HIGHLY_STABLE.label;
  if (pct >= STABILITY_LABELS.MODERATE.threshold) return STABILITY_LABELS.MODERATE.label;
  return STABILITY_LABELS.EVOLVING.label;
}

// ─── Daily Loop Copy ────────────────────────────────────────────────────

export const DAILY_LOOP_COPY = {
  zone: 'DAILY_LOOP' as ToneZone,

  rasCheckIn: {
    header: 'RAS Focus',
    prompt: 'What do you want attention to find today?',
    hint: 'One word or phrase. Your RAS uses this as a filter all day.',
    science: 'Your reticular activating system filters 11 million bits of sensory data per second. This prompt tells it what to keep.',
  },

  eveningReflection: {
    header: 'Evening Reflection',
    description: 'Close the day. Name what happened, what you did about it, and what you will try next.',
    time: '3 min',
    steps: [
      {
        id: 'what_happened',
        label: 'Notice',
        prompt: 'What happened today that mattered?',
        hint: 'One moment. One interaction. One thing that landed.',
      },
      {
        id: 'what_i_did',
        label: 'Own It',
        prompt: 'What did you do about it?',
        hint: 'The rep you ran, the tool you used, the choice you made. Even a pause counts.',
      },
      {
        id: 'what_next',
        label: 'Next',
        prompt: 'What will you try differently tomorrow?',
        hint: 'One small adjustment. Specific enough that you will recognize it when the moment arrives.',
      },
    ],
    postSave: [
      {
        id: 'signal_noise',
        label: 'Signal vs Noise',
        prompt: 'What signal did you follow today? What noise did you let pass?',
      },
      {
        id: 'ras_notice',
        label: 'RAS Notice',
        prompt: 'What did your RAS notice today that it would have missed last month?',
      },
    ],
    footer: 'Reflection converts experience into learning.',
  },

  qualityLabels: ['—', 'Surface', 'Specific', 'Actionable'],
} as const;

// ─── Coaching Copy ──────────────────────────────────────────────────────

export const COACHING_COPY = {
  zone: 'COACHING' as ToneZone,

  coachQuestion: {
    header: 'Coach Question',
    instruction: 'Sit with this for 30 seconds. You do not need to write anything — just notice what comes up.',
    expandLabel: 'See all 9 questions',
    collapseLabel: 'Show less',
  },

  fearReframe: {
    header: 'Eclipse Reframe',
    steps: [
      { label: 'Notice', prompt: 'What am I afraid of right now?' },
      { label: 'Name', prompt: 'What capacity is this fear protecting?' },
      { label: 'Reframe', prompt: 'What would I do if this fear were information, not instruction?' },
      { label: 'Rep', prompt: 'What is one small action I can take in the next 10 minutes?' },
    ],
    completion: 'The eclipse is not the absence of light — it is the thing that temporarily covers it.',
  },

  repPhilosophy: 'This is a rep, not a revelation. Run it once. Notice what happens.',
} as const;

// ─── Results Copy ───────────────────────────────────────────────────────

export const RESULTS_COPY = {
  zone: 'RESULTS' as ToneZone,

  identityOpenerPrefix: 'I know you are the type of person who',
  eclipseReframe: 'This is not broken. This is covered.',

  stabilitySection: {
    header: 'Results Stability',
    stableMessage: (count: number) =>
      `${count} of 9 rays are reliably consistent across your last two assessments.`,
    highStability: 'Your profile is settling — these patterns are real.',
    moderateStability: 'Some rays are stabilizing while others are still developing. This is normal during active growth.',
    lowStability: 'Your profile is evolving significantly. This suggests real change, context shifts, or assessment conditions that differed.',
    multiRunNote: (count: number) =>
      `Based on ${count} completed assessments. Stability improves with more data points.`,
  },

  retakeSection: {
    headerRetake: 'Retake Recommended',
    headerConsider: 'Consider Retaking',
    explanation: 'This does not mean your results are wrong — it means the scoring engine cannot be as precise as it would like. A retake with the adjustments below would sharpen the picture significantly.',
    guidanceHeader: 'What to do differently',
    ctaRetake: 'Start retake',
    ctaFirst: 'Retake assessment',
    ctaTime: '~8 min',
  },
} as const;

// ─── Marketing Copy ─────────────────────────────────────────────────────

export const MARKETING_COPY = {
  zone: 'MARKETING' as ToneZone,

  tagline: 'Regulation first. Results follow.',
  notPersonality: 'Not a personality label. A behavioral map that changes as you do.',
  repsNotRevelation: 'Build through reps, not revelation.',
  lightNotGone: 'Your light is not gone. It is covered.',
  nineRays: 'Nine capacities. Each one trainable. Together, they map your internal operating system.',
  biologyNotFailure: 'That is not a personal failure. That is biology.',
} as const;

// ─── System Copy ────────────────────────────────────────────────────────

export const SYSTEM_COPY = {
  zone: 'SYSTEM' as ToneZone,

  saveFailed: 'Could not save. Check your connection and try again.',
  sessionExpired: 'Session expired. Sign in to continue.',
  loading: 'Loading...',
} as const;

// ─── Unified Access ─────────────────────────────────────────────────────

export const COPY = {
  daily: DAILY_LOOP_COPY,
  coaching: COACHING_COPY,
  results: RESULTS_COPY,
  marketing: MARKETING_COPY,
  system: SYSTEM_COPY,
  rays: RAY_NAMES,
  eclipse: ECLIPSE_LABELS,
  confidence: CONFIDENCE_LABELS,
} as const;
