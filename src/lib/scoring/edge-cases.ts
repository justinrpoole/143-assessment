// 07G: Edge Case Detection
// 10 deterministic edge cases that modify confidence and coaching routing.

import type {
  EdgeCaseResult, RayComposite, ValidityResult, ProfileFlag,
} from '../types';
import type { ReflectionIndices } from './reflection';
import type { TopTwoResult } from './top-two';

/**
 * Detect all 10 edge cases and return results.
 *
 * Each edge case is either detected or not. When detected, it provides:
 * - A restriction (what to suppress or modify in the report)
 * - Required next evidence (what would resolve the ambiguity)
 *
 * Edge cases from 07G:
 * 1. Expensive Strength: high performance + high eclipse
 * 2. Truth Detector Suppressed: low Presence + high other rays
 * 3. Perfect Self-Report: very high SD + very high shine across all rays
 * 4. Contradictory Responses: inconsistency flag
 * 5. Flat Profile: undifferentiated (low SD across Net Energy)
 * 6. Missing Reflection: no reflection data
 * 7. Partial Completion: high missingness
 * 8. Extreme Polarization: one ray dominates strongly
 * 9. High Load Interference: stabilize gate + low confidence
 * 10. Unresolved Ambiguity: multiple conflicting signals
 */
export function detectEdgeCases(
  rays: Record<string, RayComposite>,
  validity: ValidityResult,
  reflectionIndices: ReflectionIndices,
  topTwo: TopTwoResult | null,
  gate: string,
  eer: number | null,
): EdgeCaseResult[] {
  const results: EdgeCaseResult[] = [];

  // ─── 1. Expensive Strength ───
  // High shine in Top Two but also high eclipse in those same rays
  let expensiveStrength = false;
  if (topTwo) {
    for (const rNum of [topTwo.topRay1, topTwo.topRay2]) {
      const ray = rays[`R${rNum}`];
      if (ray && ray.shine_0_4 !== null && ray.eclipse_0_4 !== null) {
        if (ray.shine_0_4 >= 3.0 && ray.eclipse_0_4 >= 2.5) {
          expensiveStrength = true;
        }
      }
    }
  }
  results.push({
    code: 'EXPENSIVE_STRENGTH',
    detected: expensiveStrength,
    restriction: expensiveStrength
      ? 'Add cost language to Top Two description. This strength is real but expensive under load.'
      : '',
    required_next_evidence: expensiveStrength
      ? 'Retest after load reduction to see if eclipse drops while shine holds.'
      : '',
  });

  // ─── 2. Truth Detector Suppressed ───
  // Presence (R3) low but other rays high → grounding is missing
  const presence = rays['R3'];
  let truthSuppressed = false;
  if (presence?.shine_0_4 !== null && presence?.shine_0_4 !== undefined) {
    const otherHighCount = [1, 2, 4, 5, 6, 7, 8, 9].filter((r) => {
      const ray = rays[`R${r}`];
      return ray?.shine_0_4 !== null && ray.shine_0_4 !== undefined && ray.shine_0_4 >= 3.0;
    }).length;
    if (presence.shine_0_4 < 2.0 && otherHighCount >= 4) {
      truthSuppressed = true;
    }
  }
  results.push({
    code: 'TRUTH_DETECTOR_SUPPRESSED',
    detected: truthSuppressed,
    restriction: truthSuppressed
      ? 'Flag Presence as priority regardless of NetEnergy. Other ray scores may be inflated without grounding.'
      : '',
    required_next_evidence: truthSuppressed
      ? 'Coach debrief focused on Presence access and body awareness.'
      : '',
  });

  // ─── 3. Perfect Self-Report ───
  // Very high SD + very high shine across all rays
  let perfectReport = false;
  if (validity.sd_extreme) {
    const allHigh = [1, 2, 3, 4, 5, 6, 7, 8, 9].every((r) => {
      const ray = rays[`R${r}`];
      return ray?.shine_0_4 !== null && ray.shine_0_4 !== undefined && ray.shine_0_4 >= 3.2;
    });
    if (allHigh) perfectReport = true;
  }
  results.push({
    code: 'PERFECT_SELF_REPORT',
    detected: perfectReport,
    restriction: perfectReport
      ? 'Suppress archetype language. Use hypothesis framing only. Recommend mini-interview.'
      : '',
    required_next_evidence: perfectReport
      ? 'Mini-interview or 360 feedback to validate self-report.'
      : '',
  });

  // ─── 4. Contradictory Responses ───
  results.push({
    code: 'CONTRADICTORY_RESPONSES',
    detected: validity.inconsistency_flag,
    restriction: validity.inconsistency_flag
      ? 'Use directional language. Note that response patterns suggest context-specific differences.'
      : '',
    required_next_evidence: validity.inconsistency_flag
      ? 'Retest or coach debrief to explore Work vs Life splits.'
      : '',
  });

  // ─── 5. Flat Profile ───
  const flatProfile = topTwo?.flatProfile ?? false;
  results.push({
    code: 'FLAT_PROFILE',
    detected: flatProfile,
    restriction: flatProfile
      ? 'Suppress archetype. Report "undifferentiated profile" with directional language. Use Access rays for orientation.'
      : '',
    required_next_evidence: flatProfile
      ? 'Retest after intentional reflection, or coach debrief to explore priorities.'
      : '',
  });

  // ─── 6. Missing Reflection ───
  const missingReflection = reflectionIndices.reflectionAnsweredCount === 0;
  results.push({
    code: 'MISSING_REFLECTION',
    detected: missingReflection,
    restriction: missingReflection
      ? 'Cap confidence at Moderate. Suppress reflection-dependent coaching prompts.'
      : '',
    required_next_evidence: missingReflection
      ? 'Complete reflection prompts for full confidence.'
      : '',
  });

  // ─── 7. Partial Completion ───
  const partialCompletion = validity.coverage_flag;
  results.push({
    code: 'PARTIAL_COMPLETION',
    detected: partialCompletion,
    restriction: partialCompletion
      ? 'Label results as preliminary. Suppress specific predictions. Recommend completion.'
      : '',
    required_next_evidence: partialCompletion
      ? 'Complete remaining sections for full assessment.'
      : '',
  });

  // ─── 8. Extreme Polarization ───
  // One ray dominates strongly — Net Energy > 85 and next highest < 60
  let extremePolarization = false;
  if (topTwo) {
    const top1Ne = rays[`R${topTwo.topRay1}`]?.net_energy_0_100;
    const top2Ne = rays[`R${topTwo.topRay2}`]?.net_energy_0_100;
    if (top1Ne !== null && top1Ne !== undefined &&
        top2Ne !== null && top2Ne !== undefined) {
      if (top1Ne > 85 && top2Ne < 60) {
        extremePolarization = true;
      }
    }
  }
  results.push({
    code: 'EXTREME_POLARIZATION',
    detected: extremePolarization,
    restriction: extremePolarization
      ? 'Note single-ray dominance. Second ray may not be a true strength — use directional language.'
      : '',
    required_next_evidence: extremePolarization
      ? 'Retest or debrief to confirm if second ray is genuinely resourced.'
      : '',
  });

  // ─── 9. High Load Interference ───
  // Gate = Stabilize + any validity concerns
  const highLoad = gate === 'STABILIZE' && (
    validity.sd_elevated || validity.inconsistency_flag ||
    (eer !== null && eer < 0.8)
  );
  results.push({
    code: 'HIGH_LOAD_INTERFERENCE',
    detected: highLoad,
    restriction: highLoad
      ? 'Eclipse may be amplifying noise. Prioritize stabilization tools before interpreting patterns.'
      : '',
    required_next_evidence: highLoad
      ? 'Retest after load reduction (4-6 weeks with stabilization tools).'
      : '',
  });

  // ─── 10. Unresolved Ambiguity ───
  // Multiple edge cases detected without clear resolution
  const detectedCount = results.filter((r) => r.detected).length;
  const unresolved = detectedCount >= 3;
  results.push({
    code: 'UNRESOLVED_AMBIGUITY',
    detected: unresolved,
    restriction: unresolved
      ? 'Multiple conflicting signals. Use preliminary framing for all outputs. Recommend coach debrief.'
      : '',
    required_next_evidence: unresolved
      ? '45-minute coach debrief to resolve ambiguity.'
      : '',
  });

  return results;
}

/**
 * Determine profile flag based on edge cases and top two result.
 */
export function determineProfileFlag(
  topTwo: TopTwoResult | null,
  edgeCases: EdgeCaseResult[],
  validity: ValidityResult,
): ProfileFlag {
  if (validity.coverage_flag) return 'PARTIAL';
  if (topTwo?.flatProfile) return 'UNDIFFERENTIATED';
  return 'STANDARD';
}
