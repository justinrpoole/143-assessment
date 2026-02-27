/**
 * Celebration trigger definitions — maps milestones to messages.
 *
 * Identity-based messaging: "You ARE" language (2.7x habit retention
 * vs goal-based "I want to"). Messages are NOT "Good job!" — they are
 * identity-reinforcing statements that make the user feel seen.
 */

export type CelebrationTier = 'micro' | 'standard' | 'milestone' | 'epic';

export interface CelebrationTrigger {
  /** Unique trigger key */
  key: string;
  /** Display message — identity-based, not praise-based */
  message: string;
  /** Which tier of celebration (controls animation intensity) */
  tier: CelebrationTier;
  /** Duration in ms — longer for bigger moments */
  duration: number;
  /** Whether to trigger haptic feedback */
  haptic: boolean;
}

// ---------------------------------------------------------------------------
// Daily Practice Celebrations
// ---------------------------------------------------------------------------
export const DAILY_LOOP_SAVED: CelebrationTrigger = {
  key: 'daily_loop_saved',
  message: 'Loop locked in. You just chose your direction.',
  tier: 'micro',
  duration: 2200,
  haptic: true,
};

export const REP_LOGGED: CelebrationTrigger = {
  key: 'rep_logged',
  message: 'Rep logged. Your brain just updated its predictions.',
  tier: 'micro',
  duration: 2200,
  haptic: true,
};

export const MORNING_ENTRY_SAVED: CelebrationTrigger = {
  key: 'morning_entry_saved',
  message: 'Intention set. The day just got a direction.',
  tier: 'micro',
  duration: 2200,
  haptic: true,
};

export const ENERGY_AUDIT_SAVED: CelebrationTrigger = {
  key: 'energy_audit_saved',
  message: 'Audit logged. Now you can see what your energy is doing.',
  tier: 'micro',
  duration: 2200,
  haptic: true,
};

export const REFLECTION_SAVED: CelebrationTrigger = {
  key: 'reflection_saved',
  message: 'Reflection filed. The pattern is becoming visible.',
  tier: 'micro',
  duration: 2200,
  haptic: true,
};

// ---------------------------------------------------------------------------
// Streak Milestones
// ---------------------------------------------------------------------------
export function streakMilestone(days: number): CelebrationTrigger | null {
  const milestones: Record<number, CelebrationTrigger> = {
    3: {
      key: 'streak_3',
      message: '3 days in. You showed up when it was still new. That takes something.',
      tier: 'standard',
      duration: 3000,
      haptic: true,
    },
    7: {
      key: 'streak_7',
      message: "7 days. You're not building a habit — you're proving who you've always been.",
      tier: 'milestone',
      duration: 3500,
      haptic: true,
    },
    14: {
      key: 'streak_14',
      message: "14 days. Most people stop at 7. You didn't. That's not discipline — that's identity.",
      tier: 'milestone',
      duration: 3500,
      haptic: true,
    },
    21: {
      key: 'streak_21',
      message: '21 days. The neural pathways are forming. This is who you are now.',
      tier: 'milestone',
      duration: 4000,
      haptic: true,
    },
    30: {
      key: 'streak_30',
      message: '30 days. A month of showing up. Your brain has rewritten its default.',
      tier: 'epic',
      duration: 4500,
      haptic: true,
    },
    66: {
      key: 'streak_66',
      message: "66 days. Science says this is where habits become automatic. You're there.",
      tier: 'epic',
      duration: 5000,
      haptic: true,
    },
    100: {
      key: 'streak_100',
      message: "100 days. Triple digits. You didn't just build a practice — you became a practitioner.",
      tier: 'epic',
      duration: 5000,
      haptic: true,
    },
  };

  return milestones[days] ?? null;
}

// ---------------------------------------------------------------------------
// First-Time Celebrations
// ---------------------------------------------------------------------------
export const FIRST_REP_EVER: CelebrationTrigger = {
  key: 'first_rep_ever',
  message: "First rep logged. Every transformation starts with a single rep. This is yours.",
  tier: 'milestone',
  duration: 3500,
  haptic: true,
};

export const FIRST_LOOP_EVER: CelebrationTrigger = {
  key: 'first_loop_ever',
  message: "First loop. Name it, ground it, move. You just activated the system.",
  tier: 'milestone',
  duration: 3500,
  haptic: true,
};

// ---------------------------------------------------------------------------
// Variable Rewards (Hook Model — unpredictable positive reinforcement)
// ---------------------------------------------------------------------------
const VARIABLE_MESSAGES = [
  "You're building something invisible and unstoppable.",
  "Consistency is the loudest form of commitment.",
  "This rep matters more than you think. Trust the process.",
  "You showed up. Again. That's the whole thing.",
  "Small reps. Big rewiring. Keep going.",
  "The light doesn't forget who feeds it.",
];

/**
 * Returns a variable-reward celebration ~20% of the time.
 * Hook Model: unpredictable rewards create stronger habit loops.
 */
export function maybeVariableReward(): CelebrationTrigger | null {
  if (Math.random() > 0.2) return null;
  const msg = VARIABLE_MESSAGES[Math.floor(Math.random() * VARIABLE_MESSAGES.length)];
  return {
    key: 'variable_reward',
    message: msg,
    tier: 'micro',
    duration: 2500,
    haptic: false,
  };
}

// ---------------------------------------------------------------------------
// Eclipse / High-Load Grounding Messages
// ---------------------------------------------------------------------------
export const ECLIPSE_GROUNDING: CelebrationTrigger = {
  key: 'eclipse_grounding',
  message: "Rest is not retreat. Your light is dimmed, not gone.",
  tier: 'micro',
  duration: 3000,
  haptic: false,
};
