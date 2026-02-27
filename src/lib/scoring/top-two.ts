// 07C: Top Two Ray Selection with Deterministic Tie-Breaking
// Identifies the Light Signature — the two rays with highest Net Energy.

import type { RayComposite } from '../types';
import { NET_ENERGY_TIE_THRESHOLD, FLAT_PROFILE_SD } from './constants';

interface RayCandidate {
  rayNum: number;
  netEnergy: number;
}

/**
 * Deterministic tie-break: pick the "better" ray between two candidates.
 *
 * Tie-break order (from 07C):
 * 1. Higher Access under pressure
 * 2. Lower Eclipse cost
 * 3. Lower ray number (stability guarantee)
 *
 * Note: Work/Life delta and reflection depth tie-breaks are omitted in V1
 * because we don't separate work/life subfacet scores yet.
 */
function betterRay(
  a: number,
  b: number,
  rays: Record<string, RayComposite>,
): number {
  const rayA = rays[`R${a}`];
  const rayB = rays[`R${b}`];

  // 1) Higher Access
  if (rayA?.access_0_4 !== null && rayB?.access_0_4 !== null &&
      rayA.access_0_4 !== undefined && rayB.access_0_4 !== undefined &&
      rayA.access_0_4 !== rayB.access_0_4) {
    return rayA.access_0_4 > rayB.access_0_4 ? a : b;
  }

  // 2) Lower Eclipse
  if (rayA?.eclipse_0_4 !== null && rayB?.eclipse_0_4 !== null &&
      rayA.eclipse_0_4 !== undefined && rayB.eclipse_0_4 !== undefined &&
      rayA.eclipse_0_4 !== rayB.eclipse_0_4) {
    return rayA.eclipse_0_4 < rayB.eclipse_0_4 ? a : b;
  }

  // 3) Lower ray number wins for deterministic stability
  return a < b ? a : b;
}

/**
 * Check if the profile is "flat" (undifferentiated).
 * A flat profile has very low standard deviation across Net Energy scores.
 */
function checkFlatProfile(candidates: RayCandidate[]): boolean {
  if (candidates.length < 3) return false;

  const values = candidates.map((c) => c.netEnergy);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  const sd = Math.sqrt(variance);

  return sd < FLAT_PROFILE_SD;
}

export interface TopTwoResult {
  topRay1: number;      // ray number (1-9) of the strongest ray
  topRay2: number;      // ray number of the second strongest
  pairCode: string;     // e.g., "R1-R5" (always sorted ascending)
  flatProfile: boolean; // true if undifferentiated
  closeCall: boolean;   // true if tie-breaking was needed
}

/**
 * Select the Primary Rays (Light Signature top-two rays).
 *
 * Primary metric: Net Energy descending.
 * Near-ties (within 2 points on 0-100 scale) are resolved by the
 * deterministic tie-break chain.
 */
export function selectTopTwo(
  rays: Record<string, RayComposite>,
): TopTwoResult | null {
  // Collect eligible rays. Primary metric: Net Energy. If too few rays have
  // Net Energy (e.g. monthly runs without Eclipse items), fall back to Shine.
  // Ray 9 (Be The Light) is excluded — it's a STATE (the overflow of Rays 1-8),
  // not an archetype-eligible trait. Still scored separately as "Radiance Indicator."
  let eligible: RayCandidate[] = [];
  for (let r = 1; r <= 8; r++) {
    const ray = rays[`R${r}`];
    if (ray?.net_energy_0_100 !== null && ray?.net_energy_0_100 !== undefined) {
      eligible.push({ rayNum: r, netEnergy: ray.net_energy_0_100 });
    }
  }

  // Fallback: use Shine scores when Net Energy is unavailable
  if (eligible.length < 2) {
    eligible = [];
    for (let r = 1; r <= 8; r++) {
      const ray = rays[`R${r}`];
      if (ray?.shine_0_100 !== null && ray?.shine_0_100 !== undefined) {
        eligible.push({ rayNum: r, netEnergy: ray.shine_0_100 });
      }
    }
  }

  if (eligible.length < 2) return null;

  const flatProfile = checkFlatProfile(eligible);

  // Sort by Net Energy descending
  const ranked = [...eligible].sort((a, b) => b.netEnergy - a.netEnergy);

  // Select Top 1, resolving near-ties
  let top1 = ranked[0].rayNum;
  let closeCall = false;

  for (const candidate of ranked) {
    if (Math.abs(candidate.netEnergy - ranked[0].netEnergy) <= NET_ENERGY_TIE_THRESHOLD) {
      const winner = betterRay(top1, candidate.rayNum, rays);
      if (winner !== top1) closeCall = true;
      top1 = winner;
    }
  }

  // Remove top1 and select Top 2
  const remaining = ranked.filter((c) => c.rayNum !== top1);
  if (remaining.length === 0) return null;

  let top2 = remaining[0].rayNum;
  for (const candidate of remaining) {
    if (Math.abs(candidate.netEnergy - remaining[0].netEnergy) <= NET_ENERGY_TIE_THRESHOLD) {
      const winner = betterRay(top2, candidate.rayNum, rays);
      if (winner !== top2) closeCall = true;
      top2 = winner;
    }
  }

  // Pair code is always sorted ascending: "R1-R5" not "R5-R1"
  const low = Math.min(top1, top2);
  const high = Math.max(top1, top2);
  const pairCode = `R${low}-R${high}`;

  return { topRay1: top1, topRay2: top2, pairCode, flatProfile, closeCall };
}
