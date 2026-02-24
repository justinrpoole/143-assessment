// 07B: Ray Composites (subfacets → ray-level scores)
// Aggregates 4 subfacets per ray into Shine/Access/Eclipse/NetEnergy.

import type { RayComposite, SubfacetComposite } from '../types';
import { RAY_NAMES, RAY_PHASES } from '../types';
import { RAY_MIN_SUBFACETS } from './constants';

/** Get the 4 subfacet codes for a given ray number. */
function subfacetsForRay(rayNum: number): string[] {
  return ['a', 'b', 'c', 'd'].map((letter) => `R${rayNum}${letter}`);
}

/** Scale a 0-4 score to 0-100. */
function scaleTo100(x: number | null): number | null {
  return x !== null ? x * 25 : null;
}

/**
 * Compute ray composites from subfacet composites.
 *
 * For each ray (1-9):
 * - Collects its 4 subfacets (a-d)
 * - Requires >= 3 usable subfacets to produce a score
 * - Computes Shine, Access, Eclipse as means of subfacet values
 * - Scales to 0-100
 * - Computes NetEnergy: (Shine100 - Eclipse100 + 100) / 2
 */
export function computeRayComposites(
  subfacetComposites: Record<string, SubfacetComposite>,
): Record<string, RayComposite> {
  const rays: Record<string, RayComposite> = {};

  for (let r = 1; r <= 9; r++) {
    const rayId = `R${r}`;
    const sfCodes = subfacetsForRay(r);

    const composite: RayComposite = {
      ray_id: rayId,
      ray_name: RAY_NAMES[rayId] || `Ray ${r}`,
      ray_number: r,
      shine_0_4: null,
      access_0_4: null,
      eclipse_0_4: null,
      shine_0_100: null,
      access_0_100: null,
      eclipse_0_100: null,
      net_energy_0_100: null,
      subfacet_count: 0,
      partial_ray: false,
      phase: RAY_PHASES[rayId] || 'Reconnect',
    };

    // Collect values from each bucket across subfacets
    for (const bucket of ['shine', 'access', 'eclipse'] as const) {
      const key04 = `${bucket}_0_4` as 'shine_0_4' | 'access_0_4' | 'eclipse_0_4';
      const key100 = `${bucket}_0_100` as 'shine_0_100' | 'access_0_100' | 'eclipse_0_100';

      const vals: number[] = [];
      for (const sf of sfCodes) {
        const comp = subfacetComposites[sf];
        if (comp) {
          const v = comp[key04];
          if (v !== null) vals.push(v);
        }
      }

      // Count how many subfacets have data for this bucket so we can
      // cap the minimum to what's actually available in the run.
      let subfacetsWithData = 0;
      for (const sf of sfCodes) {
        const comp = subfacetComposites[sf];
        if (comp && comp[key04] !== null) subfacetsWithData++;
      }
      const effectiveMin = Math.min(RAY_MIN_SUBFACETS, subfacetsWithData);

      if (vals.length >= effectiveMin && vals.length > 0) {
        const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
        composite[key04] = mean;
        composite[key100] = scaleTo100(mean);
      }

      // Track subfacet count for the primary bucket (Shine)
      if (bucket === 'shine') {
        composite.subfacet_count = vals.length;
        composite.partial_ray = vals.length > 0 && vals.length < 4;
      }
    }

    // Net Energy: (Shine100 - Eclipse100 + 100) / 2
    // Range: 0 (all eclipse) to 100 (all shine)
    // Midpoint 50 = shine equals eclipse
    if (composite.shine_0_100 !== null && composite.eclipse_0_100 !== null) {
      const netRaw = composite.shine_0_100 - composite.eclipse_0_100; // -100 to +100
      composite.net_energy_0_100 = (netRaw + 100) / 2;
    }

    rays[rayId] = composite;
  }

  return rays;
}
