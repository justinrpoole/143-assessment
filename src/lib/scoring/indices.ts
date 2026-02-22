// 07E: Constitutional Indices — EER, BRI, LSI
// These are the system-level health indicators.

import type { BaseItem, ScoredItem, RayComposite, AssessmentIndices } from '../types';

/**
 * Energy Efficiency Ratio (EER)
 * Formula: (TotalShine + 5) / (TotalEclipse + 5)
 * - > 1.0 = generating more energy than losing
 * - < 1.0 = depleting
 * - < 0.8 = burnout risk
 * The +5 smoothing prevents division by zero and reduces noise at extremes.
 */
export function computeEER(rays: Record<string, RayComposite>): {
  eer: number | null;
  partial: boolean;
} {
  const shines: number[] = [];
  const eclipses: number[] = [];

  for (let r = 1; r <= 9; r++) {
    const ray = rays[`R${r}`];
    if (!ray) continue;
    if (ray.shine_0_4 !== null) shines.push(ray.shine_0_4);
    if (ray.eclipse_0_4 !== null) eclipses.push(ray.eclipse_0_4);
  }

  if (shines.length === 0 || eclipses.length === 0) {
    return { eer: null, partial: true };
  }

  const totalShine = shines.reduce((a, b) => a + b, 0);
  const totalEclipse = eclipses.reduce((a, b) => a + b, 0);
  const eer = (totalShine + 5) / (totalEclipse + 5);

  return {
    eer,
    partial: shines.length < 9 || eclipses.length < 9,
  };
}

/**
 * Burnout Risk Index (BRI)
 * Count of rays where Eclipse > Shine.
 * - 0-2: healthy
 * - 3-5: elevated
 * - 6+: critical
 */
export function computeBRI(rays: Record<string, RayComposite>): {
  bri: number;
  partial: boolean;
} {
  let count = 0;
  let usable = 0;

  for (let r = 1; r <= 9; r++) {
    const ray = rays[`R${r}`];
    if (!ray) continue;
    if (ray.shine_0_4 !== null && ray.eclipse_0_4 !== null) {
      usable++;
      if (ray.eclipse_0_4 > ray.shine_0_4) count++;
    }
  }

  return {
    bri: count,
    partial: usable < 9,
  };
}

/**
 * Load Snapshot Index (LSI)
 * Mean of Eclipse item scores (from the dedicated Eclipse items, not ray items).
 * Scaled 0-4 (raw) and 0-100.
 */
export function computeLSI(
  eclipseItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): {
  lsi04: number | null;
  lsi0100: number | null;
  partial: boolean;
} {
  const vals: number[] = [];

  for (const row of eclipseItems) {
    const scored = scoredItems[row.Item_ID];
    if (scored && scored.capacity_0_4 !== null) {
      vals.push(scored.capacity_0_4);
    }
  }

  if (vals.length === 0) {
    return { lsi04: null, lsi0100: null, partial: true };
  }

  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  return {
    lsi04: mean,
    lsi0100: mean * 25,
    partial: vals.length < eclipseItems.length,
  };
}

/**
 * Compute all constitutional indices.
 */
export function computeIndices(
  rays: Record<string, RayComposite>,
  eclipseItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): AssessmentIndices & { eer_partial: boolean; bri_partial: boolean; lsi_partial: boolean } {
  const { eer, partial: eerPartial } = computeEER(rays);
  const { bri, partial: briPartial } = computeBRI(rays);
  const { lsi04, lsi0100, partial: lsiPartial } = computeLSI(eclipseItems, scoredItems);

  return {
    eer,
    bri,
    lsi_0_4: lsi04,
    lsi_0_100: lsi0100,
    ppd_flag: false, // computed separately in gating.ts
    eer_partial: eerPartial,
    bri_partial: briPartial,
    lsi_partial: lsiPartial,
  };
}
