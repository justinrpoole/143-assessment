/**
 * Tone Matrix v1 — Context-Specific Voice Rules
 *
 * Defines how the 143 brand voice shifts across 6 zones.
 * The core identity stays constant (fierce calm confidence),
 * but register, warmth, and directness adjust by context.
 *
 * Used by:
 * - qa:drift-scan for zone-aware validation
 * - qa:tone for positive requirement checks
 * - Voice-lock system for version-tagged copy validation
 *
 * Zones:
 *   MARKETING   — Bold, proof-heavy, conversion-oriented
 *   ASSESSMENT  — Clinical-clear, neutral, no coaching
 *   RESULTS     — Warm-direct, identity-first, no shame
 *   COACHING    — Gentle-firm, capacity language, rep-based
 *   DAILY_LOOP  — Gentle, brief, ritual cadence
 *   SYSTEM      — Neutral, technical, no brand voice
 */

export type ToneZone =
  | 'MARKETING'
  | 'ASSESSMENT'
  | 'RESULTS'
  | 'COACHING'
  | 'DAILY_LOOP'
  | 'SYSTEM';

export interface ToneRule {
  /** Human-readable label */
  label: string;
  /** What this zone sounds like */
  register: string;
  /** Warmth dial (1-5, 1=clinical, 5=intimate) */
  warmth: number;
  /** Directness dial (1-5, 1=suggestive, 5=commanding) */
  directness: number;
  /** Positive requirements — phrases/patterns that SHOULD appear */
  mustInclude: string[];
  /** Additional banned phrases specific to this zone */
  zoneBanned: string[];
  /** Example good copy for this zone */
  examples: string[];
  /** File path globs that belong to this zone */
  fileGlobs: string[];
}

/**
 * The master tone matrix. Each zone has specific rules that
 * layer on top of the global banned-phrase list.
 */
export const TONE_MATRIX: Record<ToneZone, ToneRule> = {
  MARKETING: {
    label: 'Marketing & Landing Pages',
    register: 'Bold, proof-heavy, fierce calm confidence. Short sentences. Receipts, not promises.',
    warmth: 3,
    directness: 5,
    mustInclude: [
      'capacity',           // Capacity language, not trait language
      'operating system',   // OS metaphor
      'reps',              // Rep language
    ],
    zoneBanned: [
      'we believe',        // No belief statements — show proof
      'our mission',       // Company-centric, not reader-centric
      'best in class',     // Empty superlative
      'revolutionary',     // Overpromise
      'transform your life', // Guru territory
    ],
    examples: [
      'Not a personality label. A behavioral map that changes as you do.',
      'Build through reps, not revelation.',
      'Regulation first. Results follow.',
    ],
    fileGlobs: [
      'src/app/upgrade-your-os/**',
      'src/app/how-it-works/**',
      'src/app/outcomes/**',
      'src/app/143-challenge/**',
      'src/app/143/**',
      'src/app/preview/**',
      'src/app/corporate/**',
      'src/app/organizations/**',
      'src/app/about/**',
      'src/app/justin/**',
      'src/app/pricing/**',
      'src/components/marketing/**',
      'src/content/page_copy.v1.ts',
      'src/content/marketing_copy_bible.v1.ts',
    ],
  },

  ASSESSMENT: {
    label: 'Assessment Questions & Instructions',
    register: 'Clinical-clear. Neutral. No coaching, no encouragement, no interpretation.',
    warmth: 1,
    directness: 3,
    mustInclude: [
      'last 7 days',       // Behavioral anchor
    ],
    zoneBanned: [
      'great job',         // No encouragement during measurement
      'well done',         // No encouragement during measurement
      'you should',        // No prescription during assessment
      'try to',            // No coaching during measurement
      'remember to',       // No coaching during measurement
      'the right answer',  // No right/wrong framing
      'honestly',          // Implies they might not be honest
    ],
    examples: [
      'In the last 7 days, how often did you use a specific practice like...',
      'Rate how much you agree with the following statement.',
      'There are no right or wrong answers.',
    ],
    fileGlobs: [
      'src/app/assessment/**',
      'src/components/assessment/QuestionCard*',
      'src/components/assessment/SectionIntro*',
      'src/content/questions.json',
    ],
  },

  RESULTS: {
    label: 'Results & Reports',
    register: 'Warm-direct. Identity-first, numbers below fold. No shame, no deficit framing.',
    warmth: 4,
    directness: 4,
    mustInclude: [
      'capacity',          // Capacity, not trait
      'access',            // Access level, not score
    ],
    zoneBanned: [
      'you scored',        // Score-first is wrong — identity first
      'your score is',     // Score-first is wrong
      'you failed',        // Never
      'low score',         // Deficit framing
      'poor',              // Deficit framing
      'below average',     // Deficit framing
      'needs improvement', // Corporate performance review language
      'you lack',          // Deficit framing
    ],
    examples: [
      'I know you are the type of person who leads with Intention and Joy.',
      'Your Presence access is stabilizing — your system has capacity available.',
      'This is not broken. This is covered.',
    ],
    fileGlobs: [
      'src/components/results/**',
      'src/components/assessment/ResultsClient*',
      'src/components/assessment/ReportClient*',
      'src/components/assessment/SampleReportClient*',
      'src/content/results_overview.json',
      'src/content/ray_pairs.json',
      'src/content/rays.json',
    ],
  },

  COACHING: {
    label: 'Coaching & Recommendations',
    register: 'Gentle-firm. Capacity language. Rep-based. Second person. Behavioral specificity.',
    warmth: 4,
    directness: 4,
    mustInclude: [
      'rep',               // Rep language
    ],
    zoneBanned: [
      'you must',          // Too commanding
      'you have to',       // Too commanding
      'you need to',       // Too commanding
      'you should always', // Absolutist
      'never do',          // Absolutist
      'the key is',        // Generic coach-speak
      'unlock your potential', // Guru territory
    ],
    examples: [
      'Start here: before your next meeting, name one thing you want attention to find.',
      'This is a rep, not a revelation. Run it once. Notice what happens.',
      'Where did I choose the honest boundary today?',
    ],
    fileGlobs: [
      'src/components/retention/CoachQuestion*',
      'src/components/retention/FearReframe*',
      'src/components/results/CoachingBrief*',
      'src/components/results/ThirtyDayPlan*',
      'src/data/archetype_blocks.json',
    ],
  },

  DAILY_LOOP: {
    label: 'Daily Loop & Rituals',
    register: 'Gentle, brief, ritual cadence. Present tense. Grounding, not motivating.',
    warmth: 5,
    directness: 2,
    mustInclude: [],
    zoneBanned: [
      'let\'s go',         // Hype language
      'crush it',          // Hustle culture
      'you got this',      // Performative encouragement
      'stay positive',     // Toxic positivity
      'no excuses',        // Shame-based motivation
      'rise and grind',    // Hustle culture
      'be grateful',       // Prescriptive emotion
    ],
    examples: [
      'What do you want attention to find today?',
      'One moment. One interaction. One thing that landed.',
      'Reflection converts experience into learning.',
    ],
    fileGlobs: [
      'src/components/retention/DailyLoop*',
      'src/components/retention/MorningEntry*',
      'src/components/retention/EveningReflection*',
      'src/components/retention/RasCheckIn*',
      'src/components/retention/MicroWinsLedger*',
      'src/components/portal/StreakFire*',
    ],
  },

  SYSTEM: {
    label: 'System Messages & Errors',
    register: 'Neutral, technical, helpful. No brand voice. No cosmic metaphors.',
    warmth: 2,
    directness: 3,
    mustInclude: [],
    zoneBanned: [
      'oops',              // Cutesy error language
      'uh oh',             // Cutesy error language
      'whoops',            // Cutesy error language
      'something went wrong', // Vague — be specific
    ],
    examples: [
      'Could not save your reflection. Check your connection and try again.',
      'Session expired. Sign in to continue.',
      'Your response was recorded.',
    ],
    fileGlobs: [
      'src/lib/ui/error-messages.ts',
      'src/components/ui/**',
      'src/app/api/**',
    ],
  },
};

/**
 * Resolve which tone zone a file path belongs to.
 * Returns the first matching zone, or null if no zone matches.
 * Used by QA scripts to apply zone-specific rules.
 */
export function resolveZone(filePath: string): ToneZone | null {
  // Normalize path separators
  const normalized = filePath.replace(/\\/g, '/');

  for (const [zone, rule] of Object.entries(TONE_MATRIX) as [ToneZone, ToneRule][]) {
    for (const glob of rule.fileGlobs) {
      // Simple glob matching: convert glob to regex
      const pattern = glob
        .replace(/\*\*/g, '§§')     // Preserve **
        .replace(/\*/g, '[^/]*')     // Single * = anything except /
        .replace(/§§/g, '.*')        // ** = anything including /
        .replace(/\//g, '\\/');      // Escape slashes
      const regex = new RegExp(pattern);
      if (regex.test(normalized)) {
        return zone as ToneZone;
      }
    }
  }
  return null;
}

/**
 * Get all zone-specific banned phrases for a file.
 * Returns the zone's banned list plus context for error messages.
 */
export function getZoneBannedPhrases(filePath: string): {
  zone: ToneZone;
  label: string;
  banned: string[];
} | null {
  const zone = resolveZone(filePath);
  if (!zone) return null;
  const rule = TONE_MATRIX[zone];
  return {
    zone,
    label: rule.label,
    banned: rule.zoneBanned,
  };
}

/**
 * Get positive requirements for a file's zone.
 * Used by drift-scan to check that required language appears.
 */
export function getZoneRequirements(filePath: string): {
  zone: ToneZone;
  label: string;
  mustInclude: string[];
} | null {
  const zone = resolveZone(filePath);
  if (!zone) return null;
  const rule = TONE_MATRIX[zone];
  if (rule.mustInclude.length === 0) return null;
  return {
    zone,
    label: rule.label,
    mustInclude: rule.mustInclude,
  };
}
