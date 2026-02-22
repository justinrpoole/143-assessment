// 07A: Raw Item → Scored Item
// Handles Likert (0-4), reverse-keying, scenario forced-choice, and missing data

import type { BaseItem, ScoredItem } from '../types';
import { LIKERT_ANCHORS } from './constants';

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

/** Map a raw response to 0-4 scale. Accepts number (0-4) or label string. */
function mapLikertTo04(raw: number | string | null): number | null {
  if (raw === null || raw === undefined) return null;

  // Numeric input already on 0-4
  if (typeof raw === 'number') {
    if (raw >= 0 && raw <= 4) return raw;
    return null;
  }

  // String label lookup
  const trimmed = raw.trim();
  if (trimmed in LIKERT_ANCHORS) return LIKERT_ANCHORS[trimmed];

  // Try parsing as number string
  const num = Number(trimmed);
  if (!isNaN(num) && num >= 0 && num <= 4) return num;

  return null;
}

/** Reverse a 0-4 capacity score: 4-x */
function reverseCapacity(x: number | null): number | null {
  if (x === null) return null;
  return 4 - x;
}

/**
 * Determine which scoring bucket an item falls into based on
 * Pressure_Mode and Polarity.
 *
 * - Baseline items → Shine bucket (capacity at rest)
 * - UnderPressure + Normal polarity → Access bucket (capacity under load)
 * - UnderPressure + Reverse polarity → Eclipse bucket (distortion measure)
 */
export function bucketOf(item: BaseItem): 'shine' | 'access' | 'eclipse' | null {
  if (item.Pressure_Mode === 'Baseline') return 'shine';
  if (item.Pressure_Mode === 'UnderPressure') {
    if (item.Polarity === 'Normal') return 'access';
    if (item.Polarity === 'Reverse') return 'eclipse';
  }
  return null;
}

/**
 * Parse per-option scoring from item Notes field.
 * Expected pattern: "A=4;B=3;C=1;D=0" or "A=4, B=3, C=2, D=1"
 */
function parseOptionScoring(notes: string | null): Record<string, number> | null {
  if (!notes) return null;
  const pairs = notes.match(/([ABCD])\s*=\s*([0-4])/g);
  if (!pairs || pairs.length === 0) return null;

  const result: Record<string, number> = {};
  for (const pair of pairs) {
    const match = pair.match(/([ABCD])\s*=\s*([0-4])/);
    if (match) {
      result[match[1]] = parseInt(match[2]);
    }
  }
  return result;
}

/**
 * Score a forced-choice scenario item.
 * If Notes has explicit A=4;B=3;C=1;D=0 scoring, use that.
 * Otherwise, use Keyed_Option: keyed option = 4, all others = 2 (conservative).
 */
function scoreScenario(item: BaseItem, chosenOption: string): number | null {
  const explicit = parseOptionScoring(item.Notes);
  if (explicit) {
    return explicit[chosenOption] ?? null;
  }

  // Conservative default
  if (!item.Keyed_Option) return null;
  return chosenOption === item.Keyed_Option ? 4 : 2;
}

// ═══════════════════════════════════════════
// MAIN: scoreItem
// ═══════════════════════════════════════════

/**
 * Score a single item given its bank definition and the participant's response.
 * Returns a ScoredItem with all fields populated.
 *
 * Routing rules (from 07A + 07H §3):
 * - Baseline + Normal → Capacity_0_4 = raw normalized
 * - Baseline + Reverse → Capacity_0_4 = reverse(raw)  (shine, but reversed)
 * - UnderPressure + Normal → Capacity_0_4 = raw  (access under load)
 * - UnderPressure + Reverse → Eclipse_0_4 = raw  (do NOT reverse — this IS the distortion)
 */
export function scoreItem(
  item: BaseItem,
  rawResponse: number | string | null | undefined,
): ScoredItem {
  const isMissing = rawResponse === null || rawResponse === undefined || rawResponse === '';
  const bucket = bucketOf(item);

  const result: ScoredItem = {
    item_id: item.Item_ID,
    raw_value: rawResponse ?? null,
    normalized_0_4: null,
    capacity_0_4: null,
    eclipse_0_4: null,
    chosen_option: null,
    applied_option_score: null,
    missing_flag: isMissing,
    scoring_bucket: bucket,
  };

  if (isMissing) return result;

  // ─── Frequency / Likert items (0-4 scale) ───
  if (item.Response_Format === 'Frequency_0_4') {
    const x = mapLikertTo04(rawResponse!);
    result.normalized_0_4 = x;

    if (x === null) {
      result.missing_flag = true;
      return result;
    }

    // Route to capacity or eclipse based on Pressure_Mode + Polarity
    if (item.Pressure_Mode === 'Baseline') {
      // Shine bucket: reverse if Reverse polarity
      result.capacity_0_4 = item.Polarity === 'Reverse' ? reverseCapacity(x) : x;
    } else if (item.Pressure_Mode === 'UnderPressure') {
      if (item.Polarity === 'Normal') {
        // Access bucket: capacity under pressure, no reversal
        result.capacity_0_4 = x;
      } else if (item.Polarity === 'Reverse') {
        // Eclipse bucket: distortion measure — use raw, do NOT reverse
        result.eclipse_0_4 = x;
      }
    }

    return result;
  }

  // ─── Forced-Choice Scenario items ───
  if (item.Response_Format === 'ForcedChoice_A_D') {
    const chosen = String(rawResponse).trim().toUpperCase();
    if (!['A', 'B', 'C', 'D'].includes(chosen)) {
      result.missing_flag = true;
      return result;
    }

    result.chosen_option = chosen;
    const score = scoreScenario(item, chosen);
    result.normalized_0_4 = score;
    result.capacity_0_4 = score;
    result.applied_option_score = score;
    return result;
  }

  // Unknown format — treat as missing
  result.missing_flag = true;
  return result;
}
