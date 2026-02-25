// 07D: Bottom Ray Selection + MoveScore
// Identifies the training target — the lowest ray with the best readiness to move.

import type { RayComposite, ToolComposite, BottomRayCandidate, MoveRouting } from '../types';
import type { ReflectionIndices } from './reflection';
import {
  MOVE_WEIGHTS,
  MOVE_LOW_THRESHOLD,
  MOVE_STRETCH_THRESHOLD,
  MOVE_STANDARD_THRESHOLD,
  MOVE_STABILIZE_MICRO_THRESHOLD,
  TOOL_MAPPING_FOR_RAY,
  FALLBACK_TOOLS,
  PHASE_1_RAYS,
} from './constants';

/**
 * Compute tool readiness for a specific ray.
 * Uses the two mapped tools. Prefers Access, falls back to Usage.
 */
function toolReadinessForRay(
  rayNum: number,
  toolIndices: Record<string, ToolComposite>,
): number | null {
  const tools = TOOL_MAPPING_FOR_RAY[rayNum] || FALLBACK_TOOLS;
  const vals: number[] = [];

  for (const toolCode of tools) {
    const tool = toolIndices[toolCode];
    if (!tool) continue;
    // Prefer Access (capacity under pressure), fall back to Usage (baseline)
    if (tool.access_0_4 !== null) {
      vals.push(tool.access_0_4);
    } else if (tool.usage_0_4 !== null) {
      vals.push(tool.usage_0_4);
    }
  }

  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/**
 * Compute MoveScore for a ray.
 * MoveScore = 0.45 * Access + 0.35 * ToolReadiness + 0.20 * Reflection
 *
 * If some components are missing, re-normalizes the weights across
 * available components (weighted mean of what we have).
 */
function computeMoveScore(
  rayNum: number,
  rays: Record<string, RayComposite>,
  toolIndices: Record<string, ToolComposite>,
  reflectionScaled: number | null,
): { score: number | null; partial: boolean } {
  const parts: number[] = [];
  const weights: number[] = [];

  const ray = rays[`R${rayNum}`];
  if (ray?.access_0_4 !== null && ray?.access_0_4 !== undefined) {
    parts.push(ray.access_0_4);
    weights.push(MOVE_WEIGHTS.access);
  }

  const tr = toolReadinessForRay(rayNum, toolIndices);
  if (tr !== null) {
    parts.push(tr);
    weights.push(MOVE_WEIGHTS.toolReadiness);
  }

  if (reflectionScaled !== null) {
    parts.push(reflectionScaled);
    weights.push(MOVE_WEIGHTS.reflection);
  }

  if (parts.length === 0) return { score: null, partial: true };

  // Re-normalize weights to sum to 1
  const wSum = weights.reduce((a, b) => a + b, 0);
  const normalizedWeights = weights.map((w) => w / wSum);
  const score = parts.reduce((sum, p, i) => sum + p * normalizedWeights[i], 0);

  return { score, partial: wSum < 1.0 };
}

/**
 * Determine movement routing based on MoveScore.
 */
export function determineRouting(moveScore: number | null): MoveRouting {
  if (moveScore === null) return 'STABILIZE_RETEST';
  if (moveScore >= MOVE_STRETCH_THRESHOLD) return 'STRETCH';
  if (moveScore >= MOVE_STANDARD_THRESHOLD) return 'STANDARD';
  if (moveScore >= MOVE_STABILIZE_MICRO_THRESHOLD) return 'STABILIZE_MICRO';
  return 'STABILIZE_RETEST';
}

export interface BottomRayResult {
  bottomRay: number;
  candidates: BottomRayCandidate[];
  routing: MoveRouting;
  fallback: string | null; // null = normal selection, "Phase1" or "LowestOverall" if fallback used
}

/**
 * Select the Bottom Ray (training target).
 *
 * Steps:
 * 1. Take the 3 rays with lowest Net Energy
 * 2. Compute MoveScore for each
 * 3. Pick the one with the highest MoveScore (most ready to move)
 * 4. If all MoveScores < 3.0, fall back to the lowest Phase 1 ray
 */
export function selectBottomRay(
  rays: Record<string, RayComposite>,
  toolIndices: Record<string, ToolComposite>,
  reflectionIndices: ReflectionIndices,
): BottomRayResult | null {
  // Collect eligible rays with Net Energy.
  // Ray 9 excluded — it's a state (overflow of Rays 1-8), not a trainable target.
  const eligible: Array<{ rayNum: number; netEnergy: number }> = [];
  for (let r = 1; r <= 8; r++) {
    const ray = rays[`R${r}`];
    if (ray?.net_energy_0_100 !== null && ray?.net_energy_0_100 !== undefined) {
      eligible.push({ rayNum: r, netEnergy: ray.net_energy_0_100 });
    }
  }

  if (eligible.length === 0) return null;

  // Sort ascending by Net Energy (lowest first)
  eligible.sort((a, b) => a.netEnergy - b.netEnergy);

  // Take bottom 3 (or fewer if less than 3 eligible)
  const bottom3 = eligible.slice(0, 3);

  // Compute MoveScores for each candidate
  const candidates: BottomRayCandidate[] = bottom3.map(({ rayNum }) => {
    const ray = rays[`R${rayNum}`];
    const tr = toolReadinessForRay(rayNum, toolIndices);
    const { score: ms } = computeMoveScore(
      rayNum, rays, toolIndices, reflectionIndices.reflectionScaled04,
    );

    return {
      ray_id: `R${rayNum}`,
      ray_name: ray?.ray_name || `Ray ${rayNum}`,
      net_energy: ray?.net_energy_0_100 ?? 0,
      move_score: ms ?? 0,
      access_0_4: ray?.access_0_4 ?? 0,
      tool_readiness: tr ?? 0,
      reflection_scaled: reflectionIndices.reflectionScaled04 ?? 0,
    };
  });

  // Find the best candidate: highest MoveScore among bottom 3
  const withMoveScore = candidates.filter((c) => c.move_score > 0);

  if (withMoveScore.length > 0) {
    const best = withMoveScore.sort((a, b) => b.move_score - a.move_score)[0];

    if (best.move_score >= MOVE_LOW_THRESHOLD) {
      // Normal selection: highest MoveScore
      const rayNum = parseInt(best.ray_id.slice(1));
      return {
        bottomRay: rayNum,
        candidates,
        routing: determineRouting(best.move_score),
        fallback: null,
      };
    }
  }

  // Fallback: lowest Phase 1 ray among bottom 3
  const phase1Candidates = bottom3.filter((c) => PHASE_1_RAYS.includes(c.rayNum));
  if (phase1Candidates.length > 0) {
    // Lowest Net Energy in Phase 1
    const lowest = phase1Candidates.sort((a, b) => a.netEnergy - b.netEnergy)[0];
    const ms = candidates.find((c) => c.ray_id === `R${lowest.rayNum}`)?.move_score ?? 0;
    return {
      bottomRay: lowest.rayNum,
      candidates,
      routing: determineRouting(ms),
      fallback: 'Phase1',
    };
  }

  // Final fallback: absolute lowest ray
  const lowestMs = candidates.find((c) => c.ray_id === `R${bottom3[0].rayNum}`)?.move_score ?? 0;
  return {
    bottomRay: bottom3[0].rayNum,
    candidates,
    routing: determineRouting(lowestMs),
    fallback: 'LowestOverall',
  };
}
