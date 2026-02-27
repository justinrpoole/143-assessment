/**
 * IRT Calibration Foundation (#18)
 *
 * Lays the groundwork for Computerized Adaptive Testing (CAT) by implementing
 * Item Response Theory parameter estimation. When sufficient response data
 * accumulates, this module enables:
 *
 * 1. Item difficulty (b) and discrimination (a) parameter estimation
 * 2. Information function computation for adaptive item selection
 * 3. Precision-targeted short forms (15-25 items per domain vs current counts)
 *
 * Phase 1 (this file): Type definitions, 2PL model, and information functions.
 * Phase 2 (future): Parameter estimation from response data.
 * Phase 3 (future): Adaptive item selection engine.
 */

/* ── Types ─────────────────────────────────────────────────── */

export interface IRTParameters {
  item_id: string;
  /** Discrimination parameter (slope). Higher = more informative at threshold. */
  a: number;
  /** Difficulty parameter (location on ability scale). */
  b: number;
  /** Pseudo-guessing parameter (lower asymptote). Fixed at 0 for Likert items. */
  c: number;
}

export interface ItemInformation {
  item_id: string;
  /** Theta (ability level) at which info was computed. */
  theta: number;
  /** Fisher information at this theta. */
  information: number;
}

export interface CATSelectionResult {
  /** Items selected for this administration. */
  selected_item_ids: string[];
  /** Estimated theta after current responses. */
  theta_estimate: number;
  /** Standard error of theta estimate. */
  se_theta: number;
  /** Whether precision threshold is met. */
  precision_met: boolean;
}

/* ── 2PL Model ─────────────────────────────────────────────── */

/**
 * Two-Parameter Logistic (2PL) probability function.
 * P(X=1 | theta, a, b) = 1 / (1 + exp(-a * (theta - b)))
 *
 * For polytomous items (Likert 0-4), we use the Graded Response Model
 * extension, but the 2PL is the building block.
 */
export function probability2PL(
  theta: number,
  a: number,
  b: number,
): number {
  const exponent = -a * (theta - b);
  return 1 / (1 + Math.exp(exponent));
}

/**
 * Fisher information for a single item at a given theta.
 * I(theta) = a^2 * P(theta) * (1 - P(theta))
 *
 * Items provide maximum information near their difficulty parameter (b).
 */
export function itemInformation(
  theta: number,
  a: number,
  b: number,
): number {
  const p = probability2PL(theta, a, b);
  return a * a * p * (1 - p);
}

/**
 * Test information function — sum of item information across all items.
 * Higher total information = more precise measurement at this theta.
 */
export function testInformation(
  theta: number,
  items: IRTParameters[],
): number {
  return items.reduce(
    (sum, item) => sum + itemInformation(theta, item.a, item.b),
    0,
  );
}

/**
 * Standard error of theta estimate.
 * SE(theta) = 1 / sqrt(I(theta))
 */
export function standardError(
  theta: number,
  items: IRTParameters[],
): number {
  const info = testInformation(theta, items);
  if (info <= 0) return Infinity;
  return 1 / Math.sqrt(info);
}

/* ── Adaptive Selection ────────────────────────────────────── */

/**
 * Select the next most informative item given current theta estimate.
 * This is the core CAT item selection algorithm: maximum information criterion.
 *
 * @param theta_estimate Current ability estimate
 * @param available_items Items not yet administered
 * @returns The item that provides maximum information at current theta
 */
export function selectNextItem(
  theta_estimate: number,
  available_items: IRTParameters[],
): IRTParameters | null {
  if (available_items.length === 0) return null;

  let best_item = available_items[0];
  let best_info = -Infinity;

  for (const item of available_items) {
    const info = itemInformation(theta_estimate, item.a, item.b);
    if (info > best_info) {
      best_info = info;
      best_item = item;
    }
  }

  return best_item;
}

/**
 * Maximum Likelihood Estimation of theta from response pattern.
 * Uses Newton-Raphson iteration on the log-likelihood.
 *
 * @param responses Array of { item, response } (response: 0 or 1 for dichotomous)
 * @param max_iter Maximum iterations (default 25)
 * @param tolerance Convergence threshold (default 0.001)
 */
export function estimateTheta(
  responses: Array<{ item: IRTParameters; response: number }>,
  max_iter = 25,
  tolerance = 0.001,
): { theta: number; se: number; converged: boolean } {
  let theta = 0; // Start at population mean

  for (let iter = 0; iter < max_iter; iter++) {
    let numerator = 0;
    let denominator = 0;

    for (const { item, response } of responses) {
      const p = probability2PL(theta, item.a, item.b);
      numerator += item.a * (response - p);
      denominator += item.a * item.a * p * (1 - p);
    }

    if (denominator === 0) break;

    const delta = numerator / denominator;
    theta += delta;

    if (Math.abs(delta) < tolerance) {
      const items = responses.map((r) => r.item);
      return {
        theta,
        se: standardError(theta, items),
        converged: true,
      };
    }
  }

  const items = responses.map((r) => r.item);
  return {
    theta,
    se: standardError(theta, items),
    converged: false,
  };
}

/* ── Calibration Utilities ─────────────────────────────────── */

/**
 * Default IRT parameters for uncalibrated items.
 * Uses moderate discrimination and centered difficulty.
 * These will be replaced with estimated parameters as response data accumulates.
 */
export function defaultParameters(item_id: string): IRTParameters {
  return {
    item_id,
    a: 1.0, // Moderate discrimination
    b: 0.0, // Average difficulty
    c: 0.0, // No guessing (Likert scale)
  };
}

/**
 * Precision threshold check for CAT termination.
 * Standard error below 0.3 is considered "adequate" for most purposes.
 * Below 0.2 is "high precision."
 */
export function precisionMet(
  se: number,
  threshold = 0.3,
): boolean {
  return se <= threshold;
}
