// 07B: Subfacet Composites (scored items → subfacet-level aggregates)
// Groups items by Subfacet_Code and computes Shine/Access/Eclipse means.

import type { BaseItem, ScoredItem, SubfacetComposite } from '../types';
import { bucketOf } from './item-scoring';
import {
  SUBFACET_MIN_ITEMS_SHINE,
  SUBFACET_MIN_ITEMS_ACCESS,
  SUBFACET_MIN_ITEMS_ECLIPSE,
  SUBFACET_USABLE_FRACTION,
  SUBFACET_HIGH_CONFIDENCE_FRACTION,
} from './constants';

/** Return the per-bucket minimum items threshold.
 *  Shine has ~14 items per subfacet so we need 6.
 *  Access has ~4 items per subfacet so we only need 2.
 *  Eclipse has ~2 items per subfacet so we only need 1. */
function minItemsForBucket(bucket: 'shine' | 'access' | 'eclipse'): number {
  switch (bucket) {
    case 'shine': return SUBFACET_MIN_ITEMS_SHINE;
    case 'access': return SUBFACET_MIN_ITEMS_ACCESS;
    case 'eclipse': return SUBFACET_MIN_ITEMS_ECLIPSE;
  }
}

/** Count how many items exist in the bank for a given subfacet + bucket. */
function countItemsInBank(
  items: BaseItem[],
  subfacetCode: string,
  bucketName: 'shine' | 'access' | 'eclipse',
): number {
  return items.filter(
    (row) => row.Subfacet_Code === subfacetCode && bucketOf(row) === bucketName,
  ).length;
}

/** Safe mean of non-null numbers. Returns null if empty. */
function safeMean(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((a, b) => a + b, 0) / valid.length;
}

export interface SubfacetCoverage {
  shine: number | null;
  access: number | null;
  eclipse: number | null;
}

/**
 * Compute subfacet composites from scored items.
 *
 * For each subfacet code, groups items into Shine/Access/Eclipse buckets
 * and computes means. Applies usability threshold: a bucket is usable
 * only if answered items >= max(MIN_ITEMS, USABLE_FRACTION * total_items).
 */
export function computeSubfacetComposites(
  rayItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): {
  composites: Record<string, SubfacetComposite>;
  coverage: Record<string, SubfacetCoverage>;
} {
  // Discover all unique subfacet codes
  const subfacetCodes = new Set<string>();
  for (const row of rayItems) {
    if (row.Subfacet_Code) subfacetCodes.add(row.Subfacet_Code);
  }

  // Collect scored values by subfacet + bucket
  const buckets: Record<string, { shine: (number | null)[]; access: (number | null)[]; eclipse: (number | null)[] }> = {};
  for (const sf of subfacetCodes) {
    buckets[sf] = { shine: [], access: [], eclipse: [] };
  }

  for (const row of rayItems) {
    if (!row.Subfacet_Code) continue;
    const bucket = bucketOf(row);
    if (!bucket) continue;

    const scored = scoredItems[row.Item_ID];
    if (!scored) continue;

    if (bucket === 'shine' || bucket === 'access') {
      buckets[row.Subfacet_Code][bucket].push(scored.capacity_0_4);
    } else if (bucket === 'eclipse') {
      buckets[row.Subfacet_Code].eclipse.push(scored.eclipse_0_4);
    }
  }

  // Compute composites with usability checks
  const composites: Record<string, SubfacetComposite> = {};
  const coverage: Record<string, SubfacetCoverage> = {};

  for (const sf of subfacetCodes) {
    const sfBuckets = buckets[sf];

    // Extract ray number from subfacet code (e.g., "R1a" → 1)
    const rayMatch = sf.match(/^R(\d)/);
    const rayNumber = rayMatch ? parseInt(rayMatch[1]) : null;

    // Look up subfacet name from the first matching item
    const firstItem = rayItems.find((r) => r.Subfacet_Code === sf);
    const subfacetName = firstItem?.Subfacet_Name || sf;

    const result: SubfacetComposite = {
      subfacet_code: sf,
      subfacet_name: subfacetName,
      ray_number: rayNumber,
      shine_0_4: null,
      access_0_4: null,
      eclipse_0_4: null,
      item_count: 0,
      coverage: 0,
      usable: false,
      high_confidence: false,
    };

    const cov: SubfacetCoverage = { shine: null, access: null, eclipse: null };

    let totalItems = 0;
    let answeredItems = 0;

    for (const bucketName of ['shine', 'access', 'eclipse'] as const) {
      const vals = sfBuckets[bucketName];
      const validVals = vals.filter((v): v is number => v !== null);
      const totalInBank = countItemsInBank(rayItems, sf, bucketName);

      totalItems += totalInBank;
      answeredItems += validVals.length;

      if (totalInBank === 0) {
        cov[bucketName] = null;
        continue;
      }

      const coverageRatio = validVals.length / totalInBank;
      cov[bucketName] = coverageRatio;

      // Usability check: enough items answered?
      // Uses per-bucket minimums so Access (min 2) and Eclipse (min 1) aren't
      // blocked by Shine's higher bar (min 6)
      const threshold = Math.max(minItemsForBucket(bucketName), SUBFACET_USABLE_FRACTION * totalInBank);
      if (validVals.length >= threshold) {
        const mean = safeMean(validVals);
        if (bucketName === 'shine') result.shine_0_4 = mean;
        else if (bucketName === 'access') result.access_0_4 = mean;
        else if (bucketName === 'eclipse') result.eclipse_0_4 = mean;
      }
    }

    result.item_count = totalItems;
    result.coverage = totalItems > 0 ? answeredItems / totalItems : 0;
    result.usable = result.coverage >= SUBFACET_USABLE_FRACTION;

    // High confidence requires >= 60% coverage
    result.high_confidence = result.coverage >= SUBFACET_HIGH_CONFIDENCE_FRACTION;

    composites[sf] = result;
    coverage[sf] = cov;
  }

  return { composites, coverage };
}
