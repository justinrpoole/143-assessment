// 07F: Confidence Band Computation
// Starts at MODERATE, upgrades to HIGH or downgrades to LOW based on validity flags.

import type { ConfidenceBand, ValidityResult, GateMode } from '../types';
import type { ReflectionIndices } from './reflection';
import { INCONSISTENCY_LOW_MEAN } from './constants';

/**
 * Compute the confidence band for the assessment.
 *
 * Rules (from 07H §12):
 *
 * Start: MODERATE
 *
 * Upgrade to HIGH if ALL of:
 * - No attention flag
 * - No speeding flag
 * - No straightlining flag
 * - No inconsistency flag
 * - No missingness flag
 * - SD not extreme
 * - Reflection depth average >= 2.0 (out of 3)
 *
 * Downgrade to LOW if ANY of:
 * - Attention flag
 * - Speeding flag
 * - Straightlining flag
 * - Missingness flag
 * - SD extreme AND reflection < 2.0
 * - Inconsistency flag AND mean diff >= 2.0
 *
 * Special: If gate is STABILIZE, cap at MODERATE (never HIGH under high load)
 */
export function computeConfidenceBand(
  validity: ValidityResult,
  gate: GateMode,
  reflectionIndices: ReflectionIndices,
): ConfidenceBand {
  let band: ConfidenceBand = 'MODERATE';

  const reflDepth = reflectionIndices.reflectionDepthAvg03;

  // ─── Upgrade path ───
  const noHardFlags =
    !validity.attention_flag &&
    !validity.speeding_flag &&
    !validity.straightline_flag &&
    !validity.inconsistency_flag &&
    !validity.coverage_flag &&
    !validity.sd_extreme;

  if (noHardFlags && reflDepth !== null && reflDepth >= 2.0) {
    band = 'HIGH';
  }

  // ─── Downgrade path (any one trigger = LOW) ───
  if (validity.attention_flag || validity.speeding_flag ||
      validity.straightline_flag || validity.coverage_flag) {
    band = 'LOW';
  }

  if (validity.sd_extreme && (reflDepth === null || reflDepth < 2.0)) {
    band = 'LOW';
  }

  if (validity.inconsistency_flag &&
      validity.inconsistency_mean_diff >= INCONSISTENCY_LOW_MEAN) {
    band = 'LOW';
  }

  // ─── Gate cap: Stabilize never gets HIGH ───
  if (gate === 'STABILIZE' && band === 'HIGH') {
    band = 'MODERATE';
  }

  return band;
}
