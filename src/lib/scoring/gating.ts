// 07E: Eclipse Gating and PPD (Performance vs Presence Delta)
// Determines whether the system gates to Stabilize or allows Proceed/Stretch.

import type { RayComposite, GateMode } from '../types';
import {
  EER_DEPLETING,
  BRI_ELEVATED,
  LSI_HIGH,
  PRESENCE_ACCESS_LOW,
  PRESENCE_ECLIPSE_HIGH,
  OUTPUT_RAY_HIGH,
  PHASE_1_RAYS,
} from './constants';

/**
 * Determine coaching gate: Stabilize or Proceed.
 *
 * Stabilize triggers:
 * 1. Phase 1 depletion: any R1-R3 has Eclipse > Shine or Access <= 2.2
 * 2. System-wide load: EER < 1.0, BRI >= 3, LSI >= 3.0, or Presence Access <= 2.2
 */
export function computeGate(
  rays: Record<string, RayComposite>,
  eer: number | null,
  bri: number,
  lsi04: number | null,
): GateMode {
  // Check Phase 1 depletion (R1-R3)
  let phase1Depleted = false;
  for (const r of PHASE_1_RAYS) {
    const ray = rays[`R${r}`];
    if (!ray) continue;

    // Eclipse > Shine = energy leak in foundation
    if (ray.shine_0_4 !== null && ray.eclipse_0_4 !== null && ray.eclipse_0_4 > ray.shine_0_4) {
      phase1Depleted = true;
    }

    // Low access under pressure = foundation not holding
    if (ray.access_0_4 !== null && ray.access_0_4 <= PRESENCE_ACCESS_LOW) {
      phase1Depleted = true;
    }
  }

  // Check system-wide load gate
  let highLoad = false;
  if (eer !== null && eer < EER_DEPLETING) highLoad = true;
  if (bri >= BRI_ELEVATED) highLoad = true;
  if (lsi04 !== null && lsi04 >= LSI_HIGH) highLoad = true;

  // Specific check: Presence (R3) Access
  const presence = rays['R3'];
  if (presence?.access_0_4 !== null && presence?.access_0_4 !== undefined && presence.access_0_4 <= PRESENCE_ACCESS_LOW) {
    highLoad = true;
  }

  if (phase1Depleted || highLoad) return 'STABILIZE';
  return 'STRETCH'; // Will be refined by bottom ray routing
}

/**
 * Performance vs Presence Delta (PPD)
 *
 * Flagged when output rays (R4 Power, R5 Purpose, R9 Be The Light) show
 * high Shine BUT Presence (R3) shows low Access or high Eclipse.
 * This means the person is performing well but may not be grounded.
 */
export function computePPD(rays: Record<string, RayComposite>): {
  ppd: 'Elevated' | 'NotElevated' | 'Unknown';
  ppdFlag: boolean;
} {
  // Gather output ray shine values
  const outputVals: number[] = [];
  for (const r of [4, 5, 9]) {
    const ray = rays[`R${r}`];
    if (ray?.shine_0_4 !== null && ray?.shine_0_4 !== undefined) {
      outputVals.push(ray.shine_0_4);
    }
  }

  if (outputVals.length === 0) {
    return { ppd: 'Unknown', ppdFlag: false };
  }

  const outputMean = outputVals.reduce((a, b) => a + b, 0) / outputVals.length;
  const presence = rays['R3'];
  const presenceAccess = presence?.access_0_4;
  const presenceEclipse = presence?.eclipse_0_4;

  if (presenceAccess === null && presenceEclipse === null) {
    return { ppd: 'Unknown', ppdFlag: false };
  }

  // High output + low presence access OR high presence eclipse
  if (
    outputMean >= OUTPUT_RAY_HIGH &&
    (
      (presenceAccess !== null && presenceAccess !== undefined && presenceAccess <= PRESENCE_ACCESS_LOW) ||
      (presenceEclipse !== null && presenceEclipse !== undefined && presenceEclipse >= PRESENCE_ECLIPSE_HIGH)
    )
  ) {
    return { ppd: 'Elevated', ppdFlag: true };
  }

  return { ppd: 'NotElevated', ppdFlag: false };
}
