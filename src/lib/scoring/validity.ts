// 07F: Validity Flags
// All 7 validity checks: SD, inconsistency, speeding, straightlining,
// attention, infrequency, and missingness.

import type { BaseItem, ScoredItem, RayComposite, ValidityResult } from '../types';
import type { SubfacetCoverage } from './subfacet-scoring';
import {
  SD_ELEVATED,
  SD_EXTREME,
  INCONSISTENCY_PAIR_FLAG_DIFF,
  INCONSISTENCY_FLAG_PAIRS,
  ATTENTION_FLAG_MISSES,
  INFREQUENCY_HIGH_SCORE,
  INFREQUENCY_FLAG_HITS,
  SPEED_HARD_FLOOR_SECONDS,
  SPEED_FLAG_FRACTION,
  STRAIGHTLINE_FLAG,
  STRAIGHTLINE_LOW_VARIANCE,
  MISSINGNESS_NA_RAYS,
  MISSINGNESS_LOW_COVERAGE_SUBFACETS,
  SUBFACET_HIGH_CONFIDENCE_FRACTION,
  LIKERT_ANCHORS,
} from './constants';

// ═══════════════════════════════════════════
// 1. Social Desirability (SD)
// ═══════════════════════════════════════════

function computeSD(
  validityItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): { sd04: number | null; elevated: boolean; extreme: boolean } {
  const vals: number[] = [];

  for (const row of validityItems) {
    if (row.Subfacet_Code !== 'VAL_SD') continue;
    const scored = scoredItems[row.Item_ID];
    if (scored?.capacity_0_4 !== null && scored?.capacity_0_4 !== undefined) {
      vals.push(scored.capacity_0_4);
    }
  }

  const sd = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  return {
    sd04: sd,
    elevated: sd !== null && sd >= SD_ELEVATED,
    extreme: sd !== null && sd >= SD_EXTREME,
  };
}

// ═══════════════════════════════════════════
// 2. Inconsistency Pairs
// ═══════════════════════════════════════════

function computeInconsistency(
  validityItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): { meanDiff: number; flaggedPairs: number; flag: boolean } {
  // Group validity items by Pair_ID
  const pairs: Record<string, number[]> = {};

  for (const row of validityItems) {
    // Items with Pair_ID are inconsistency pairs
    const pairId = (row as BaseItem & { Pair_ID?: string | null }).Pair_ID;
    if (!pairId) continue;

    const scored = scoredItems[row.Item_ID];
    if (scored?.capacity_0_4 === null || scored?.capacity_0_4 === undefined) continue;

    if (!pairs[pairId]) pairs[pairId] = [];
    pairs[pairId].push(scored.capacity_0_4);
  }

  const diffs: number[] = [];
  let flagged = 0;

  for (const scores of Object.values(pairs)) {
    if (scores.length === 2) {
      const diff = Math.abs(scores[0] - scores[1]);
      diffs.push(diff);
      if (diff >= INCONSISTENCY_PAIR_FLAG_DIFF) flagged++;
    }
  }

  const meanDiff = diffs.length > 0 ? diffs.reduce((a, b) => a + b, 0) / diffs.length : 0;
  return {
    meanDiff,
    flaggedPairs: flagged,
    flag: flagged >= INCONSISTENCY_FLAG_PAIRS,
  };
}

// ═══════════════════════════════════════════
// 3. Attention Checks
// ═══════════════════════════════════════════

/** Parse expected answer from item Notes or Keyed_Option */
function parseExpectedScore(item: BaseItem): number | string | null {
  // Try Notes field: "KEY_SCORE=0" or "KEY=Never"
  if (item.Notes) {
    const scoreMatch = item.Notes.match(/KEY_SCORE\s*=\s*([0-4])/);
    if (scoreMatch) return parseInt(scoreMatch[1]);

    const labelMatch = item.Notes.match(/KEY\s*=\s*(Never|Rarely|Sometimes|Often|Almost always)/);
    if (labelMatch) return LIKERT_ANCHORS[labelMatch[1]];
  }

  // Fall back to Keyed_Option
  if (item.Keyed_Option) return item.Keyed_Option;
  return null;
}

function computeAttention(
  validityItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): { misses: number; total: number; flag: boolean } {
  let misses = 0;
  let total = 0;

  for (const row of validityItems) {
    if (row.Subfacet_Code !== 'VAL_ATT') continue;
    total++;

    const scored = scoredItems[row.Item_ID];
    if (!scored) continue;

    if (row.Response_Format === 'ForcedChoice_A_D') {
      const expected = row.Keyed_Option;
      if (!expected) continue;
      if (scored.chosen_option !== null && scored.chosen_option !== expected) {
        misses++;
      }
    } else {
      // Likert attention check
      const expected = parseExpectedScore(row);
      if (expected === null || typeof expected === 'string') continue;
      if (scored.normalized_0_4 !== null && scored.normalized_0_4 !== expected) {
        misses++;
      }
    }
  }

  return {
    misses,
    total,
    flag: misses >= ATTENTION_FLAG_MISSES,
  };
}

// ═══════════════════════════════════════════
// 4. Infrequency
// ═══════════════════════════════════════════

function computeInfrequency(
  validityItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): { hits: number; flag: boolean } {
  let hits = 0;

  for (const row of validityItems) {
    if (row.Subfacet_Code !== 'VAL_INF') continue;
    const scored = scoredItems[row.Item_ID];
    // Flagged if endorsed at Often (3) or Almost always (4)
    if (scored?.capacity_0_4 !== null && scored?.capacity_0_4 !== undefined &&
        scored.capacity_0_4 >= INFREQUENCY_HIGH_SCORE) {
      hits++;
    }
  }

  return { hits, flag: hits >= INFREQUENCY_FLAG_HITS };
}

// ═══════════════════════════════════════════
// 5. Speeding
// ═══════════════════════════════════════════

function computeSpeed(
  startTs: string | null,
  endTs: string | null,
  pilotMedianSeconds: number | null,
): { durationSeconds: number; flag: boolean } {
  if (!startTs || !endTs) {
    return { durationSeconds: 0, flag: false };
  }

  const start = new Date(startTs).getTime();
  const end = new Date(endTs).getTime();
  const dur = (end - start) / 1000;

  if (isNaN(dur) || dur <= 0) {
    return { durationSeconds: 0, flag: false };
  }

  let flag = dur < SPEED_HARD_FLOOR_SECONDS;

  if (pilotMedianSeconds !== null) {
    if (dur < SPEED_FLAG_FRACTION * pilotMedianSeconds) flag = true;
  }

  return { durationSeconds: dur, flag };
}

// ═══════════════════════════════════════════
// 6. Straightlining + Variance
// ═══════════════════════════════════════════

function computeStraightlining(
  scoredItems: Record<string, ScoredItem>,
): { longestRun: number; flag: boolean } {
  // Collect capacity scores in item order
  const seq: number[] = [];
  for (const scored of Object.values(scoredItems)) {
    if (scored.capacity_0_4 !== null) {
      seq.push(scored.capacity_0_4);
    }
  }

  if (seq.length === 0) {
    return { longestRun: 0, flag: false };
  }

  // Longest run of identical values
  let maxRun = 1;
  let currentRun = 1;
  for (let i = 1; i < seq.length; i++) {
    if (seq[i] === seq[i - 1]) {
      currentRun++;
      maxRun = Math.max(maxRun, currentRun);
    } else {
      currentRun = 1;
    }
  }

  // Variance check
  const mean = seq.reduce((a, b) => a + b, 0) / seq.length;
  const variance = seq.reduce((sum, v) => sum + (v - mean) ** 2, 0) / seq.length;
  const sd = Math.sqrt(variance);

  const flag = maxRun >= STRAIGHTLINE_FLAG || sd < STRAIGHTLINE_LOW_VARIANCE;

  return { longestRun: maxRun, flag };
}

// ═══════════════════════════════════════════
// 7. Missingness
// ═══════════════════════════════════════════

function computeMissingness(
  rays: Record<string, RayComposite>,
  coverage: Record<string, SubfacetCoverage>,
): { naRays: number; lowCoverageSf: number; flag: boolean; overallCoverage: number } {
  // Count rays with missing Shine or Eclipse
  let naRays = 0;
  for (let r = 1; r <= 9; r++) {
    const ray = rays[`R${r}`];
    if (!ray || ray.shine_0_4 === null || ray.eclipse_0_4 === null) {
      naRays++;
    }
  }

  // Count subfacets with low coverage
  let lowCoverageSf = 0;
  let totalCoverage = 0;
  let covCount = 0;

  for (const cov of Object.values(coverage)) {
    if (cov.shine !== null) {
      covCount++;
      totalCoverage += cov.shine;
      if (cov.shine < SUBFACET_HIGH_CONFIDENCE_FRACTION) lowCoverageSf++;
    }
  }

  const overallCoverage = covCount > 0 ? totalCoverage / covCount : 0;
  const flag = naRays >= MISSINGNESS_NA_RAYS || lowCoverageSf >= MISSINGNESS_LOW_COVERAGE_SUBFACETS;

  return { naRays, lowCoverageSf, flag, overallCoverage };
}

// ═══════════════════════════════════════════
// MAIN: Compute all validity flags
// ═══════════════════════════════════════════

export function computeAllValidity(
  validityItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
  rays: Record<string, RayComposite>,
  coverage: Record<string, SubfacetCoverage>,
  startTs: string | null,
  endTs: string | null,
  pilotMedianSeconds: number | null,
): ValidityResult {
  const sd = computeSD(validityItems, scoredItems);
  const inc = computeInconsistency(validityItems, scoredItems);
  const att = computeAttention(validityItems, scoredItems);
  const inf = computeInfrequency(validityItems, scoredItems);
  const spd = computeSpeed(startTs, endTs, pilotMedianSeconds);
  const sl = computeStraightlining(scoredItems);
  const miss = computeMissingness(rays, coverage);

  return {
    social_desirability_0_4: sd.sd04,
    sd_elevated: sd.elevated,
    sd_extreme: sd.extreme,
    inconsistency_pairs_flagged: inc.flaggedPairs,
    inconsistency_mean_diff: inc.meanDiff,
    inconsistency_flag: inc.flag,
    speeding_flag: spd.flag,
    duration_seconds: spd.durationSeconds,
    straightline_longest_run: sl.longestRun,
    straightline_flag: sl.flag,
    attention_missed: att.misses,
    attention_flag: att.flag,
    infrequency_flagged: inf.hits,
    infrequency_flag: inf.flag,
    reflection_depth_avg: null, // filled later from reflection indices
    reflection_strong: false,
    reflection_thin: false,
    reflection_missing: false,
    coverage: miss.overallCoverage,
    coverage_flag: miss.flag,
  };
}
