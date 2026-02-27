/**
 * AI-Powered Practice Recommendation Engine (#20)
 *
 * Analyzes score patterns across runs and recommends the most impactful
 * daily practice. This is Netflix's recommendation algorithm applied to
 * leadership development — not "here's a random tip" but "based on YOUR
 * data pattern, THIS practice will move THIS score."
 *
 * Phase 1 (this file): Pattern analysis + rule-based recommendations.
 * Phase 2 (future): ML model trained on score-practice-outcome triples.
 */

/* ── Types ─────────────────────────────────────────────────── */

export interface RayScore {
  ray_number: number;
  ray_name: string;
  shine: number;
  access: number;
  eclipse: number;
  net_energy: number;
}

export interface ScorePattern {
  /** The primary pattern detected. */
  pattern_type: PatternType;
  /** Rays involved in the pattern. */
  involved_rays: number[];
  /** Confidence in this pattern (0-1). */
  confidence: number;
  /** Human-readable description. */
  description: string;
}

export type PatternType =
  | "stress_on_action"      // Eclipse loading on Power/Purpose while others hold
  | "relational_drain"      // Connection/BTL declining from over-giving
  | "presence_erosion"      // Attention capacity declining (Jha's research)
  | "joy_suppression"       // Joy eclipsed while other capacities mask it
  | "authenticity_gap"      // High Shine, low Access — performing but not authentic
  | "balanced_growth"       // All rays improving together
  | "plateau"               // Scores stable for 3+ runs
  | "recovery"              // Eclipse decreasing, Shine returning
  | "general_decline";      // Multiple rays declining without clear pattern

export interface PracticeRecommendation {
  /** Target ray for this practice. */
  target_ray: number;
  target_ray_name: string;
  /** The practice to do. */
  practice: string;
  /** Why this practice, given the pattern. */
  rationale: string;
  /** Estimated time commitment. */
  duration: string;
  /** When to do it. */
  timing: string;
  /** Expected impact description. */
  expected_impact: string;
  /** Priority: 1 = highest. */
  priority: number;
}

export interface WeeklyPlan {
  /** The detected score pattern. */
  pattern: ScorePattern;
  /** Ordered list of recommended practices. */
  practices: PracticeRecommendation[];
  /** Overall focus message. */
  focus_message: string;
  /** What NOT to work on right now. */
  not_yet: string;
}

/* ── Constants ─────────────────────────────────────────────── */

const RAY_NAMES: Record<number, string> = {
  1: "Intention",
  2: "Joy",
  3: "Presence",
  4: "Power",
  5: "Purpose",
  6: "Authenticity",
  7: "Connection",
  8: "Possibility",
  9: "Be The Light",
};

/* ── Pattern Detection ─────────────────────────────────────── */

/**
 * Detect the primary score pattern from current ray scores.
 * Optionally uses previous run for delta analysis.
 */
export function detectPattern(
  current: RayScore[],
  previous?: RayScore[],
): ScorePattern {
  const byRay = new Map(current.map((r) => [r.ray_number, r]));
  const deltas = new Map<number, number>();

  if (previous) {
    for (const prev of previous) {
      const curr = byRay.get(prev.ray_number);
      if (curr) {
        deltas.set(prev.ray_number, curr.net_energy - prev.net_energy);
      }
    }
  }

  // Check for stress on action capacities (R4 Power, R5 Purpose)
  const power = byRay.get(4);
  const purpose = byRay.get(5);
  const powerDelta = deltas.get(4) ?? 0;
  const purposeDelta = deltas.get(5) ?? 0;

  if (
    power && purpose &&
    (power.eclipse > 60 || purpose.eclipse > 60) &&
    (powerDelta < -3 || purposeDelta < -3)
  ) {
    return {
      pattern_type: "stress_on_action",
      involved_rays: [4, 5],
      confidence: 0.8,
      description:
        "Stress is landing on your action capacities. Power and Purpose are absorbing load while other rays hold steady.",
    };
  }

  // Check for relational drain (R7 Connection, R9 BTL)
  const connection = byRay.get(7);
  const btl = byRay.get(9);
  if (
    connection && btl &&
    (connection.eclipse > 55 || btl.eclipse > 55) &&
    connection.net_energy < 50
  ) {
    return {
      pattern_type: "relational_drain",
      involved_rays: [7, 9],
      confidence: 0.75,
      description:
        "You are giving relationally from reserves you have not replenished. Connection and Be The Light are running on borrowed energy.",
    };
  }

  // Check for presence erosion (R3)
  const presence = byRay.get(3);
  const presenceDelta = deltas.get(3) ?? 0;
  if (presence && presence.net_energy < 45 && presenceDelta < -2) {
    return {
      pattern_type: "presence_erosion",
      involved_rays: [3],
      confidence: 0.7,
      description:
        "Your attentional capacity is declining. Presence is the foundation — when it drops, other capacities become harder to access.",
    };
  }

  // Check for joy suppression (R2)
  const joy = byRay.get(2);
  if (joy && joy.eclipse > 60 && joy.shine > 55) {
    return {
      pattern_type: "joy_suppression",
      involved_rays: [2],
      confidence: 0.7,
      description:
        "Your Joy capacity exists but is being suppressed under load. The shine is there — the eclipse is covering it.",
    };
  }

  // Check for authenticity gap (R6)
  const auth = byRay.get(6);
  if (auth && auth.shine > 65 && auth.access < 45) {
    return {
      pattern_type: "authenticity_gap",
      involved_rays: [6],
      confidence: 0.65,
      description:
        "High Authenticity potential but low access under pressure. You know who you are — but stress is making it harder to show up that way.",
    };
  }

  // Check for balanced growth
  if (previous && deltas.size > 0) {
    const allImproving = [...deltas.values()].every((d) => d >= 0);
    if (allImproving) {
      return {
        pattern_type: "balanced_growth",
        involved_rays: [...deltas.keys()],
        confidence: 0.6,
        description: "All rays are holding or improving. Your system is building capacity across the board.",
      };
    }
  }

  // Check for plateau
  if (previous && deltas.size > 0) {
    const allFlat = [...deltas.values()].every((d) => Math.abs(d) < 2);
    if (allFlat) {
      return {
        pattern_type: "plateau",
        involved_rays: [],
        confidence: 0.55,
        description:
          "Scores are stable. This could mean maintenance — or it could mean your current practices have reached their ceiling. Time to adjust.",
      };
    }
  }

  // General decline
  const declining = [...deltas.entries()].filter(([, d]) => d < -2);
  if (declining.length >= 3) {
    return {
      pattern_type: "general_decline",
      involved_rays: declining.map(([r]) => r),
      confidence: 0.6,
      description:
        "Multiple rays are declining. This is a systemic load signal — not a single capacity issue.",
    };
  }

  // Default: stable
  return {
    pattern_type: "balanced_growth",
    involved_rays: [],
    confidence: 0.4,
    description: "No strong pattern detected. Continue your current practice routine.",
  };
}

/* ── Practice Mapping ──────────────────────────────────────── */

const PRACTICE_LIBRARY: Record<number, {
  practice: string;
  timing: string;
  duration: string;
}> = {
  1: {
    practice:
      "Set one clear intention before your first meeting. Write it in 8 words or fewer. Review it at noon.",
    timing: "Morning, before first meeting",
    duration: "2 minutes",
  },
  2: {
    practice:
      "Notice one moment of joy today — even micro. Name it out loud. Hand on chest optional. That is the rep.",
    timing: "Any time — set a 2:43 PM reminder",
    duration: "30 seconds",
  },
  3: {
    practice:
      "Three breaths before your next meeting. On the exhale, name what you are feeling right now. Not what you think — what you feel.",
    timing: "Before every meeting transition",
    duration: "90 seconds",
  },
  4: {
    practice:
      "Identify one small action you have been avoiding. Do it before noon. Not the big thing — the small thing you keep moving to tomorrow.",
    timing: "Morning, before noon",
    duration: "5 minutes",
  },
  5: {
    practice:
      "At the end of the day, name one thing you did that served your values — not your inbox. Write it down.",
    timing: "Evening, before closing laptop",
    duration: "2 minutes",
  },
  6: {
    practice:
      "Say one true thing today that you would normally swallow. Start with something low-stakes. Notice how your body responds.",
    timing: "During a conversation — any one",
    duration: "1 minute",
  },
  7: {
    practice:
      "Ask one genuine question in your next conversation and listen to the full answer without planning your response.",
    timing: "Next conversation",
    duration: "3 minutes",
  },
  8: {
    practice:
      "Name one possibility you dismissed this week. Do not act on it — just sit with it for 60 seconds and notice what shifts.",
    timing: "Reflection time — morning or evening",
    duration: "2 minutes",
  },
  9: {
    practice:
      "Hold space for one person today without trying to fix, advise, or redirect. Just be present. That is the capacity.",
    timing: "During a 1-on-1 or team interaction",
    duration: "5 minutes",
  },
};

/* ── Recommendation Generation ─────────────────────────────── */

/**
 * Generate a weekly practice plan based on detected pattern.
 */
export function generateWeeklyPlan(
  current: RayScore[],
  previous?: RayScore[],
): WeeklyPlan {
  const pattern = detectPattern(current, previous);
  const practices: PracticeRecommendation[] = [];

  // Find the ray with lowest net energy among involved rays
  const involvedScores = current
    .filter((r) => pattern.involved_rays.includes(r.ray_number))
    .sort((a, b) => a.net_energy - b.net_energy);

  // If no specific rays involved, find the lowest overall
  const targets =
    involvedScores.length > 0
      ? involvedScores
      : [...current].sort((a, b) => a.net_energy - b.net_energy);

  // Generate up to 2 practices (primary + secondary)
  for (let i = 0; i < Math.min(2, targets.length); i++) {
    const target = targets[i];
    const lib = PRACTICE_LIBRARY[target.ray_number];
    if (!lib) continue;

    practices.push({
      target_ray: target.ray_number,
      target_ray_name: RAY_NAMES[target.ray_number] || `Ray ${target.ray_number}`,
      practice: lib.practice,
      rationale: buildRationale(pattern, target),
      duration: lib.duration,
      timing: lib.timing,
      expected_impact: `With daily practice, ${RAY_NAMES[target.ray_number]} typically shows movement within 2-3 weeks.`,
      priority: i + 1,
    });
  }

  // Build focus message
  const focus = buildFocusMessage(pattern);

  // Build "not yet" guidance
  const highestRay = [...current].sort((a, b) => b.net_energy - a.net_energy)[0];
  const notYet = `${RAY_NAMES[highestRay?.ray_number] || "Your strongest ray"} is running well right now. Do not add practices for it this week — let the strong capacities carry while you restore the ones under load.`;

  return {
    pattern,
    practices,
    focus_message: focus,
    not_yet: notYet,
  };
}

function buildRationale(pattern: ScorePattern, target: RayScore): string {
  const name = RAY_NAMES[target.ray_number] || `Ray ${target.ray_number}`;

  switch (pattern.pattern_type) {
    case "stress_on_action":
      return `Your ${name} dropped while other capacities held. This suggests stress is landing specifically on your action capacity. One small, targeted rep breaks the pattern.`;
    case "relational_drain":
      return `${name} is running on borrowed energy. You are giving more than you are replenishing. This practice restores the reserve.`;
    case "presence_erosion":
      return `${name} is your attentional foundation. When it drops, every other capacity becomes harder to access. Restoring Presence first creates capacity for everything else.`;
    case "joy_suppression":
      return `Your ${name} capacity exists — the shine score proves it. But eclipse is covering access. This practice interrupts the suppression pattern.`;
    case "authenticity_gap":
      return `High ${name} potential with low access under pressure. The capacity is built. The practice restores access when it matters.`;
    case "plateau":
      return `Your scores have plateaued. Targeting ${name} — your current lowest — is the most likely way to unlock the next phase of growth.`;
    default:
      return `Based on your current pattern, ${name} is where targeted practice will have the most impact this week.`;
  }
}

function buildFocusMessage(pattern: ScorePattern): string {
  switch (pattern.pattern_type) {
    case "stress_on_action":
      return "Your action capacities are absorbing stress. This week: one small rep per day on Power or Purpose. Not more effort — less, but targeted.";
    case "relational_drain":
      return "You are giving from reserves you have not replenished. This week: practice receiving before giving. One moment of genuine rest per day.";
    case "presence_erosion":
      return "Your attention is the foundation. This week: restore Presence first. Three breaths before every transition. That is the whole practice.";
    case "joy_suppression":
      return "Joy is not a luxury — it is a leadership capacity. This week: notice one micro-joy per day. That is 30 seconds of practice that trains the most neglected ray.";
    case "authenticity_gap":
      return "You know who you are. Stress is making it harder to show up that way. This week: one honest moment per day. Start small.";
    case "balanced_growth":
      return "Your system is building well. Continue your current practices. Consistency is the compound interest of leadership capacity.";
    case "plateau":
      return "Your scores have stabilized — that might mean maintenance or ceiling. This week: try a new practice for your lowest ray. Fresh stimulus breaks plateaus.";
    case "recovery":
      return "Eclipse is lifting. Your system is recovering. Do not rush — recovery compounds. Keep the same practices and let the data confirm.";
    case "general_decline":
      return "Multiple capacities are under load. This is not about working harder — it is about working on the right thing. Focus on one ray this week. Just one.";
    default:
      return "Continue your current practice routine. Consistency matters more than intensity.";
  }
}
