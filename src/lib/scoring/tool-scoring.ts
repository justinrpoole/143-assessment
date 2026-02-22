// 07H §7: Tool Composites (tool items → Usage/Access/Distortion per tool)

import type { BaseItem, ScoredItem, ToolComposite } from '../types';
import { TOOL_NAMES } from '../types';
import { bucketOf } from './item-scoring';
import { TOOL_MIN_ITEMS, TOOL_USABLE_FRACTION } from './constants';

/** All 12 tool codes. */
const TOOL_CODES = [
  'T001', 'T002', 'T003', 'T004', 'T005', 'T006',
  'T007', 'T008', 'T009', 'T010', 'T011', 'T012',
];

/**
 * Compute tool composites from scored tool items.
 *
 * For each tool (T001-T012):
 * - Usage = mean of Baseline items (scored capacity)
 * - Access = mean of UnderPressure + Normal items (capacity under load)
 * - Distortion = mean of UnderPressure + Reverse items (raw eclipse)
 *
 * Same bucket logic as ray subfacets, but keyed by tool Subfacet_Code.
 */
export function computeToolComposites(
  toolItems: BaseItem[],
  scoredItems: Record<string, ScoredItem>,
): Record<string, ToolComposite> {
  const tools: Record<string, ToolComposite> = {};

  for (const toolCode of TOOL_CODES) {
    const composite: ToolComposite = {
      tool_code: toolCode,
      tool_name: TOOL_NAMES[toolCode] || toolCode,
      usage_0_4: null,
      access_0_4: null,
      distortion_0_4: null,
      item_count: 0,
      coverage: 0,
    };

    // Collect values for this tool
    const usageVals: number[] = [];
    const accessVals: number[] = [];
    const distortionVals: number[] = [];
    let totalItems = 0;
    let answeredItems = 0;

    // Count items in bank per bucket
    let usageTotal = 0;
    let accessTotal = 0;
    let distortionTotal = 0;

    for (const row of toolItems) {
      if (row.Subfacet_Code !== toolCode) continue;
      const bucket = bucketOf(row);
      if (!bucket) continue;

      if (bucket === 'shine') usageTotal++;
      else if (bucket === 'access') accessTotal++;
      else if (bucket === 'eclipse') distortionTotal++;

      totalItems++;

      const scored = scoredItems[row.Item_ID];
      if (!scored) continue;

      if (bucket === 'shine' && scored.capacity_0_4 !== null) {
        usageVals.push(scored.capacity_0_4);
        answeredItems++;
      } else if (bucket === 'access' && scored.capacity_0_4 !== null) {
        accessVals.push(scored.capacity_0_4);
        answeredItems++;
      } else if (bucket === 'eclipse' && scored.eclipse_0_4 !== null) {
        distortionVals.push(scored.eclipse_0_4);
        answeredItems++;
      }
    }

    // Apply usability thresholds per bucket
    const usageThreshold = Math.max(TOOL_MIN_ITEMS, TOOL_USABLE_FRACTION * usageTotal);
    const accessThreshold = Math.max(TOOL_MIN_ITEMS, TOOL_USABLE_FRACTION * accessTotal);
    const distortionThreshold = Math.max(TOOL_MIN_ITEMS, TOOL_USABLE_FRACTION * distortionTotal);

    if (usageVals.length >= usageThreshold) {
      composite.usage_0_4 = usageVals.reduce((a, b) => a + b, 0) / usageVals.length;
    }
    if (accessVals.length >= accessThreshold) {
      composite.access_0_4 = accessVals.reduce((a, b) => a + b, 0) / accessVals.length;
    }
    if (distortionVals.length >= distortionThreshold) {
      composite.distortion_0_4 = distortionVals.reduce((a, b) => a + b, 0) / distortionVals.length;
    }

    composite.item_count = totalItems;
    composite.coverage = totalItems > 0 ? answeredItems / totalItems : 0;
    tools[toolCode] = composite;
  }

  return tools;
}
