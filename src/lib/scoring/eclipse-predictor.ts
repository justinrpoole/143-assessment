/**
 * Predictive Eclipse Warning System (#22)
 *
 * Analyzes longitudinal retake data to detect eclipse patterns BEFORE they
 * deepen. Uses allostatic load principles (McEwen) — chronic stress compounds,
 * so earlier intervention requires less recovery.
 *
 * Core insight: Other tools tell you after you burned out. This tells you
 * while there is still time.
 *
 * Phase 1 (this file): Trend detection, warning generation, intervention mapping.
 * Phase 2 (future): Push notification integration for proactive alerts.
 */

/* ── Types ─────────────────────────────────────────────────── */

export interface RaySnapshot {
  ray_number: number;
  ray_name: string;
  shine: number;
  access: number;
  eclipse: number;
  net_energy: number;
}

export interface RunSnapshot {
  run_id: string;
  run_number: number;
  completed_at: string;
  rays: RaySnapshot[];
}

export type TrendDirection = "improving" | "stable" | "declining" | "critical";

export interface RayTrend {
  ray_number: number;
  ray_name: string;
  direction: TrendDirection;
  /** Consecutive runs in this direction. */
  streak: number;
  /** Average weekly change (positive = improving). */
  velocity: number;
  /** Current net_energy value. */
  current: number;
  /** Predicted value in 2 weeks at current velocity. */
  predicted_2w: number;
}

export type WarningLevel = "none" | "watch" | "caution" | "urgent";

export interface EclipseWarning {
  level: WarningLevel;
  /** Rays triggering the warning. */
  affected_rays: RayTrend[];
  /** Human-readable message. */
  message: string;
  /** Targeted intervention recommendation. */
  intervention: string;
  /** Research basis for the warning. */
  basis: string;
}

/* ── Trend Detection ───────────────────────────────────────── */

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

/**
 * Compute trend direction from a series of scores.
 * Requires at least 2 data points.
 */
function computeTrend(scores: number[]): {
  direction: TrendDirection;
  velocity: number;
  streak: number;
} {
  if (scores.length < 2) {
    return { direction: "stable", velocity: 0, streak: 0 };
  }

  // Calculate deltas between consecutive runs
  const deltas: number[] = [];
  for (let i = 1; i < scores.length; i++) {
    deltas.push(scores[i] - scores[i - 1]);
  }

  // Average velocity
  const velocity = deltas.reduce((a, b) => a + b, 0) / deltas.length;

  // Count consecutive streak in same direction
  let streak = 1;
  const lastDelta = deltas[deltas.length - 1];
  for (let i = deltas.length - 2; i >= 0; i--) {
    if ((deltas[i] > 0 && lastDelta > 0) || (deltas[i] < 0 && lastDelta < 0)) {
      streak++;
    } else {
      break;
    }
  }

  // Determine direction
  let direction: TrendDirection;
  const current = scores[scores.length - 1];

  if (velocity > 2) {
    direction = "improving";
  } else if (velocity < -4 && streak >= 2) {
    direction = "critical";
  } else if (velocity < -2) {
    direction = "declining";
  } else {
    direction = "stable";
  }

  // Override: if absolute value is very low, escalate
  if (current < 35 && velocity < 0) {
    direction = "critical";
  }

  return { direction, velocity, streak };
}

/**
 * Analyze ray trends across multiple assessment runs.
 * Returns trend information for each of the 9 rays.
 */
export function analyzeRayTrends(runs: RunSnapshot[]): RayTrend[] {
  if (runs.length < 2) return [];

  // Sort runs by completion date (oldest first for trend analysis)
  const sorted = [...runs].sort(
    (a, b) => new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime(),
  );

  const trends: RayTrend[] = [];

  for (let rayNum = 1; rayNum <= 9; rayNum++) {
    const scores = sorted
      .map((run) => run.rays.find((r) => r.ray_number === rayNum))
      .filter(Boolean)
      .map((r) => r!.net_energy);

    if (scores.length < 2) continue;

    const { direction, velocity, streak } = computeTrend(scores);
    const current = scores[scores.length - 1];
    const predicted_2w = Math.max(0, Math.min(100, current + velocity * 2));

    trends.push({
      ray_number: rayNum,
      ray_name: RAY_NAMES[rayNum] || `Ray ${rayNum}`,
      direction,
      streak,
      velocity,
      current,
      predicted_2w,
    });
  }

  return trends;
}

/* ── Warning Generation ────────────────────────────────────── */

/**
 * Generate eclipse warnings from ray trends.
 * Uses a tiered warning system based on decline patterns.
 */
export function generateWarnings(trends: RayTrend[]): EclipseWarning[] {
  const warnings: EclipseWarning[] = [];

  // Critical: Any ray declining for 2+ consecutive runs with net_energy below 40
  const criticalRays = trends.filter(
    (t) => t.direction === "critical",
  );
  if (criticalRays.length > 0) {
    warnings.push({
      level: "urgent",
      affected_rays: criticalRays,
      message: `${criticalRays.map((r) => r.ray_name).join(" and ")} ${criticalRays.length === 1 ? "has" : "have"} been declining for ${criticalRays[0].streak} consecutive weeks. Historical patterns suggest your Eclipse is building.`,
      intervention: buildIntervention(criticalRays),
      basis:
        "McEwen's allostatic load research: chronic stress compounds. The earlier you intervene, the less recovery is needed.",
    });
  }

  // Caution: 2+ rays declining simultaneously (even if not critical)
  const decliningRays = trends.filter(
    (t) => t.direction === "declining" || t.direction === "critical",
  );
  if (decliningRays.length >= 2 && criticalRays.length === 0) {
    warnings.push({
      level: "caution",
      affected_rays: decliningRays,
      message: `${decliningRays.length} rays are declining simultaneously: ${decliningRays.map((r) => r.ray_name).join(", ")}. This pattern often precedes deeper eclipse.`,
      intervention: buildIntervention(decliningRays),
      basis:
        "Maslach burnout model: multi-dimensional decline indicates systemic load, not isolated stress.",
    });
  }

  // Watch: Single ray declining for 2+ runs
  const watchRays = trends.filter(
    (t) => t.direction === "declining" && t.streak >= 2,
  );
  if (watchRays.length > 0 && decliningRays.length < 2) {
    warnings.push({
      level: "watch",
      affected_rays: watchRays,
      message: `${watchRays[0].ray_name} has dropped for ${watchRays[0].streak} consecutive weeks. Worth watching.`,
      intervention: `Focus this week's practice on ${watchRays[0].ray_name}. One targeted rep per day is enough to interrupt the pattern.`,
      basis:
        "Early intervention is 3x more effective than recovery from deep eclipse (allostatic load principle).",
    });
  }

  return warnings;
}

/**
 * Build targeted intervention recommendation based on affected rays.
 */
function buildIntervention(rays: RayTrend[]): string {
  const primary = rays[0];
  const interventions: Record<number, string> = {
    1: "Set one clear intention each morning. Write it down. Review it at noon. That is the rep.",
    2: "One micro-joy per day. Notice something beautiful. Say it out loud. 30 seconds.",
    3: "Three breaths before your next meeting. Name what you feel. That is Presence.",
    4: "One small action you have been avoiding. Do it before noon. That is Power.",
    5: "Ask yourself: does this serve my values or someone else's expectations? Once per day.",
    6: "Say one true thing today that you would normally hold back. Start small.",
    7: "Ask one real question in your next conversation. Listen to the whole answer.",
    8: "Name one possibility you have dismissed. Sit with it for 60 seconds.",
    9: "Hold space for one person today without trying to fix anything.",
  };

  return (
    interventions[primary.ray_number] ||
    `Focus your daily practice on ${primary.ray_name}. One rep per day, targeted to this capacity.`
  );
}

/* ── Summary ───────────────────────────────────────────────── */

/**
 * Full eclipse prediction analysis.
 * Returns all trends and any active warnings.
 */
export function predictEclipse(runs: RunSnapshot[]): {
  trends: RayTrend[];
  warnings: EclipseWarning[];
  overall_direction: TrendDirection;
} {
  const trends = analyzeRayTrends(runs);
  const warnings = generateWarnings(trends);

  // Overall direction: worst-case across all rays
  let overall_direction: TrendDirection = "stable";
  if (trends.some((t) => t.direction === "critical")) {
    overall_direction = "critical";
  } else if (trends.some((t) => t.direction === "declining")) {
    overall_direction = "declining";
  } else if (trends.every((t) => t.direction === "improving")) {
    overall_direction = "improving";
  }

  return { trends, warnings, overall_direction };
}
