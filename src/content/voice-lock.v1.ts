/**
 * Voice Lock System v1
 *
 * Every user-facing string that passes through the voice-lock
 * system gets a version tag and zone assignment. This enables:
 *
 * 1. Drift detection: QA scripts can verify strings haven't
 *    been edited without bumping the version
 * 2. Zone validation: strings are checked against their zone's
 *    tone rules (from tone-matrix.v1.ts)
 * 3. Audit trail: know when copy was last reviewed
 *
 * Usage:
 *   import { LOCKED_STRINGS, getString } from '@/content/voice-lock.v1';
 *   const text = getString('results.identity_opener_prefix');
 *
 * Adding new strings:
 *   1. Add entry to LOCKED_STRINGS with zone + version 1
 *   2. Run qa:voice-lock to validate against zone rules
 *   3. On edit: bump version, update reviewedAt
 */

import type { ToneZone } from './tone-matrix.v1';

export interface LockedString {
  /** Unique key for this string */
  key: string;
  /** The actual copy */
  value: string;
  /** Which tone zone this belongs to */
  zone: ToneZone;
  /** Version number — bump on every edit */
  version: number;
  /** ISO date of last review */
  reviewedAt: string;
  /** Status: draft strings skip validation, canonical are enforced */
  status: 'draft' | 'canonical' | 'deprecated';
  /** Optional note about context or usage */
  note?: string;
}

/**
 * Master registry of voice-locked strings.
 *
 * Organized by zone, then by component/feature.
 * Every string here has been reviewed against the tone matrix.
 */
export const LOCKED_STRINGS: LockedString[] = [
  // ─── RESULTS ZONE ────────────────────────────────────────────────

  {
    key: 'results.identity_opener_prefix',
    value: 'I know you are the type of person who',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
    note: 'Prefix for all 36 ray-pair identity openers',
  },
  {
    key: 'results.confidence_high',
    value: 'Strong data quality. Your results reflect a clear, consistent signal.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.confidence_moderate',
    value: 'Good data quality with minor variability. Your core profile is reliable.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.confidence_low',
    value: 'Some data quality concerns detected. Consider a retake for sharper accuracy.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.stability_highly_stable',
    value: 'Highly stable',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.stability_moderate',
    value: 'Moderately stable',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.stability_evolving',
    value: 'Evolving',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.retake_header',
    value: 'Your results have a wider confidence interval than ideal.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.retake_explanation',
    value: 'This does not mean your results are wrong — it means the scoring engine cannot be as precise as it would like. A retake with the adjustments below would sharpen the picture significantly.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'results.eclipse_not_broken',
    value: 'This is not broken. This is covered.',
    zone: 'RESULTS',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
    note: 'Core eclipse reframe — never implies deficit',
  },

  // ─── COACHING ZONE ───────────────────────────────────────────────

  {
    key: 'coaching.rep_not_revelation',
    value: 'This is a rep, not a revelation. Run it once. Notice what happens.',
    zone: 'COACHING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
    note: 'Core coaching philosophy statement',
  },
  {
    key: 'coaching.coach_question_instruction',
    value: 'Sit with this for 30 seconds. You do not need to write anything — just notice what comes up.',
    zone: 'COACHING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'coaching.fear_reframe_header',
    value: 'Eclipse Reframe',
    zone: 'COACHING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },

  // ─── DAILY LOOP ZONE ─────────────────────────────────────────────

  {
    key: 'daily.ras_checkin_prompt',
    value: 'What do you want attention to find today?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
    note: 'Morning RAS focus prompt',
  },
  {
    key: 'daily.ras_checkin_hint',
    value: 'One word or phrase. Your RAS uses this as a filter all day.',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_notice_prompt',
    value: 'What happened today that mattered?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_notice_hint',
    value: 'One moment. One interaction. One thing that landed.',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_own_prompt',
    value: 'What did you do about it?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_own_hint',
    value: 'The rep you ran, the tool you used, the choice you made. Even a pause counts.',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_next_prompt',
    value: 'What will you try differently tomorrow?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.evening_next_hint',
    value: 'One small adjustment. Specific enough that you will recognize it when the moment arrives.',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.reflection_converts',
    value: 'Reflection converts experience into learning.',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.signal_noise_prompt',
    value: 'What signal did you follow today? What noise did you let pass?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'daily.ras_notice_prompt',
    value: 'What did your RAS notice today that it would have missed last month?',
    zone: 'DAILY_LOOP',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },

  // ─── MARKETING ZONE ──────────────────────────────────────────────

  {
    key: 'marketing.os_tagline',
    value: 'Regulation first. Results follow.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
    note: 'Primary brand positioning line',
  },
  {
    key: 'marketing.not_personality',
    value: 'Not a personality label. A behavioral map that changes as you do.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'marketing.reps_not_revelation',
    value: 'Build through reps, not revelation.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'marketing.light_not_gone',
    value: 'Your light is not gone. It is covered.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'marketing.nine_rays',
    value: 'Nine capacities. Each one trainable. Together, they map your internal operating system.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'marketing.biology_not_failure',
    value: 'That is not a personal failure. That is biology.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'marketing.justin_ray_wordplay',
    value: 'My name is Justin Ray. Just in a ray of light. This framework is built from lived experience and peer-reviewed science.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Justin Ray name = brand wordplay — use on About page and homepage intro',
  },
  {
    key: 'marketing.three_tools',
    value: 'Watch me. Then go first. Then be the light.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'The three tools spine — should appear on every funnel page',
  },
  {
    key: 'marketing.self_love_primary',
    value: '143 means I love you. Not a slogan. A mechanism. When you train yourself to say it and mean it, your brain starts looking for evidence that it is true.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Self-love as primary benefit — use on 143 Challenge page and homepage',
  },
  {
    key: 'marketing.dual_audience_bridge',
    value: 'Whether you lead a team or lead your own life, the work is the same. Align your inner stars. Be the light for others.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Bridges executive + everyday audience — Mel Robbins model',
  },
  {
    key: 'marketing.founder_built_it',
    value: 'Justin Ray built this because he needed it first. Performing well and coming home empty. That gap is the whole framework.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Founder credibility — use early in funnel, not just on About page',
  },
  {
    key: 'marketing.watch_me_entry',
    value: 'Start with Watch me. The 143 Challenge is free. Three days. Three minutes. You will know what this is before you spend a dollar.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'First tool CTA — entry point for the funnel',
  },
  {
    key: 'marketing.then_go_first',
    value: 'Then go first. Take the assessment. See your 9 Rays. Understand what is covered and what is ready to shine.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Second tool CTA — assessment as the map',
  },
  {
    key: 'marketing.then_be_the_light',
    value: 'Then be the light. When your inner stars align, you cannot help but light the way for others.',
    zone: 'MARKETING',
    version: 1,
    reviewedAt: '2026-03-04',
    status: 'canonical',
    note: 'Third tool CTA — coaching/portal as the destination',
  },

  // ─── SYSTEM ZONE ─────────────────────────────────────────────────

  {
    key: 'system.save_failed',
    value: 'Could not save. Check your connection and try again.',
    zone: 'SYSTEM',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'system.session_expired',
    value: 'Session expired. Sign in to continue.',
    zone: 'SYSTEM',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
  {
    key: 'system.loading',
    value: 'Loading...',
    zone: 'SYSTEM',
    version: 1,
    reviewedAt: '2026-02-23',
    status: 'canonical',
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────

const _stringMap = new Map(LOCKED_STRINGS.map((s) => [s.key, s]));

/**
 * Get a voice-locked string by key.
 * Returns the string value, or the key itself if not found (fail-open).
 */
export function getString(key: string): string {
  return _stringMap.get(key)?.value ?? key;
}

/**
 * Get the full LockedString entry for inspection or validation.
 */
export function getLockedEntry(key: string): LockedString | undefined {
  return _stringMap.get(key);
}

/**
 * Get all strings for a given zone.
 */
export function getStringsByZone(zone: ToneZone): LockedString[] {
  return LOCKED_STRINGS.filter((s) => s.zone === zone);
}

/**
 * Get all canonical (non-draft, non-deprecated) strings.
 */
export function getCanonicalStrings(): LockedString[] {
  return LOCKED_STRINGS.filter((s) => s.status === 'canonical');
}
