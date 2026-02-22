// STEP4C: Executive Metadata Signal Computation
// Computes the 24 executive signals (M001-M024) from ray and tool composites.

import type { RayComposite, ToolComposite, ConfidenceBand, GateMode, ExecutiveSignal } from '../types';
import { TOOL_NAME_TO_CODE } from './constants';

/**
 * Raw exec tag map row from the parsed JSON data.
 * These come from data/exec_tag_map.json.
 */
export interface ExecTagMapRow {
  Meta_ID: string;
  Meta_Name: string;
  Meta_Category: string;
  Definition: string;
  Primary_Predictors: string;
  Moderators: string;
  Rays_Involved: string;
  Ray_Item_Count: number;
  Tool_Item_Count: number;
  Eclipse_Item_Count: number;
  Validity_Item_Count: number;
  Reflection_Prompt_Count: number;
  Notes: string;
}

// ═══════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════

const RAY_NAME_MAP: Record<string, number> = {
  'Intention': 1, 'Joy': 2, 'Presence': 3, 'Power': 4,
  'Purpose': 5, 'Authenticity': 6, 'Connection': 7,
  'Possibility': 8, 'Be The Light': 9, 'Light': 9,
};

function rayNameToNumber(name: string): number | null {
  const trimmed = name.trim();
  for (const [key, num] of Object.entries(RAY_NAME_MAP)) {
    if (trimmed.includes(key)) return num;
  }
  return null;
}

function splitByCommas(text: string | null | undefined): string[] {
  if (!text) return [];
  return text.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
}

interface Predictors {
  rays: number[];
  tools: string[];
}

/** Parse predictor rays and tools from the exec tag map row. */
function parsePredictors(row: ExecTagMapRow): Predictors {
  const rays: number[] = [];
  const tools: string[] = [];

  // Parse ray names from Rays_Involved field
  for (const name of splitByCommas(row.Rays_Involved)) {
    const num = rayNameToNumber(name);
    if (num !== null && !rays.includes(num)) rays.push(num);
  }

  // Parse tool names from Primary_Predictors field
  // Pattern: "Tool: Watch Me" or "Tool: If/Then"
  const toolMatches = row.Primary_Predictors?.match(/Tool:\s*([^,;]+)/g) || [];
  for (const match of toolMatches) {
    const toolName = match.replace(/^Tool:\s*/, '').trim();
    const code = TOOL_NAME_TO_CODE[toolName];
    if (code && !tools.includes(code)) tools.push(code);
  }

  return { rays, tools };
}

/** Compute base score (0-4) for a signal from its ray and tool predictors. */
function metaBaseScore(
  rays: Record<string, RayComposite>,
  toolIndices: Record<string, ToolComposite>,
  pred: Predictors,
): number | null {
  const vals: number[] = [];

  for (const r of pred.rays) {
    const ray = rays[`R${r}`];
    if (!ray) continue;
    // Prefer Access (capacity under pressure), fall back to Shine
    if (ray.access_0_4 !== null) vals.push(ray.access_0_4);
    else if (ray.shine_0_4 !== null) vals.push(ray.shine_0_4);
  }

  for (const t of pred.tools) {
    const tool = toolIndices[t];
    if (!tool) continue;
    if (tool.access_0_4 !== null) vals.push(tool.access_0_4);
    else if (tool.usage_0_4 !== null) vals.push(tool.usage_0_4);
  }

  return vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

/** Band a 0-4 score into Low / Moderate / Elevated / High per OUTPUT_SCHEMA_V1. */
function bandFrom04(x: number | null): 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH' {
  if (x === null) return 'LOW';
  if (x < 1.5) return 'LOW';
  if (x < 2.5) return 'MODERATE';
  if (x < 3.5) return 'ELEVATED';
  return 'HIGH';
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

/**
 * Compute all 24 executive signals.
 */
export function computeExecTags(
  execTagMap: ExecTagMapRow[],
  rays: Record<string, RayComposite>,
  toolIndices: Record<string, ToolComposite>,
  gate: GateMode,
  confidenceBand: ConfidenceBand,
  sdElevated: boolean,
  inconsistencyFlag: boolean,
): ExecutiveSignal[] {
  const signals: ExecutiveSignal[] = [];

  for (const row of execTagMap) {
    const pred = parsePredictors(row);
    const base = metaBaseScore(rays, toolIndices, pred);
    let level = bandFrom04(base);

    // Moderator constraints:
    // If system is in Stabilize mode, cap at Moderate (potential is there but gated by load)
    if (gate === 'STABILIZE' && level === 'HIGH') {
      level = 'MODERATE';
    }

    // Build driver descriptions
    const drivers: string[] = [];
    if (pred.rays.length > 0) {
      drivers.push(`Rays: ${pred.rays.map((r) => `R${r}`).join(', ')}`);
    }
    if (pred.tools.length > 0) {
      drivers.push(`Tools: ${pred.tools.join(', ')}`);
    }

    // Add moderator notes
    const moderators: { eclipse?: string; validity?: string } = {};
    if (sdElevated) {
      moderators.validity = 'SD elevated — scores may be inflated';
    }
    if (inconsistencyFlag) {
      moderators.validity = (moderators.validity ? moderators.validity + '; ' : '') +
        'Inconsistency detected';
    }

    signals.push({
      signal_id: row.Meta_ID,
      label: row.Meta_Name,
      level,
      confidence_band: confidenceBand,
      drivers,
      moderators,
      tools_first: [], // populated from archetype data in Phase 5
      reps: [],        // populated from archetype data in Phase 5
    });
  }

  return signals;
}
