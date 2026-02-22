/**
 * item-selection-runner.ts
 *
 * Bridges the full item bank (src/data/) and the selection engine (item-selection.ts)
 * to produce a per-run question list in the QuestionDefinition format.
 *
 * Called server-side only (API routes). Never import this from client components.
 */

import type { BaseItem, ReflectionPrompt } from "@/lib/types";
import {
  select143Items,
  select43Items,
  type SelectedItem,
} from "@/lib/item-selection";
import { isMonthlyRetakeRun } from "@/lib/scoring/question-set";

// Static imports — bundled at build time (Next.js JSON import)
import rayItemsRaw from "@/data/ray_items.json";
import toolItemsRaw from "@/data/tool_items.json";
import eclipseItemsRaw from "@/data/eclipse_items.json";
import validityItemsRaw from "@/data/validity_items.json";
import reflectionPromptsRaw from "@/data/reflection_prompts.json";

// ---------------------------------------------------------------------------
// Typed item banks (cast once at module load)
// ---------------------------------------------------------------------------
const RAY_ITEMS = rayItemsRaw as BaseItem[];
const TOOL_ITEMS = toolItemsRaw as BaseItem[];
const ECLIPSE_ITEMS = eclipseItemsRaw as BaseItem[];
const VALIDITY_ITEMS = validityItemsRaw as BaseItem[];
const REFLECTION_PROMPTS = reflectionPromptsRaw as ReflectionPrompt[];

// ---------------------------------------------------------------------------
// Output type — extends QuestionDefinition with display_type for the client
// ---------------------------------------------------------------------------
export interface DynamicQuestionDefinition {
  id: string;
  ray_id: string | null;       // null for tool/eclipse/validity items
  polarity: "normal" | "reverse";
  scale: { min: number; max: number };
  required: boolean;
  display_type: "frequency" | "scenario_card" | "reflection";
  prompt: string;
  /** Scenario options — only present when display_type === "scenario_card" */
  options?: { a: string; b: string; c: string; d: string };
}

// ---------------------------------------------------------------------------
// Conversion helpers
// ---------------------------------------------------------------------------

function baseItemToQuestion(
  item: BaseItem,
  display_type: "frequency" | "scenario_card",
): DynamicQuestionDefinition {
  const rayId =
    item.Ray_Number !== null ? `R${item.Ray_Number}` : null;

  const polarity: "normal" | "reverse" =
    item.Polarity === "Reverse" ? "reverse" : "normal";

  if (display_type === "scenario_card") {
    return {
      id: item.Item_ID,
      ray_id: rayId,
      polarity,
      scale: { min: 0, max: 3 }, // A=0, B=1, C=2, D=3
      required: true,
      display_type: "scenario_card",
      prompt: item.Item_Text,
      options: {
        a: item.Option_A ?? "",
        b: item.Option_B ?? "",
        c: item.Option_C ?? "",
        d: item.Option_D ?? "",
      },
    };
  }

  return {
    id: item.Item_ID,
    ray_id: rayId,
    polarity,
    scale: { min: 0, max: 4 },
    required: true,
    display_type: "frequency",
    prompt: item.Item_Text,
  };
}

function reflectionToQuestion(
  prompt: ReflectionPrompt,
): DynamicQuestionDefinition {
  return {
    id: prompt.Prompt_ID,
    ray_id: `R${prompt.Ray_Number}`,
    polarity: "normal",
    scale: { min: 0, max: 3 }, // rubric anchors 0–3
    required: false,
    display_type: "reflection",
    prompt: prompt.Prompt_Text,
  };
}

function selectedItemToQuestion(
  selected: SelectedItem,
): DynamicQuestionDefinition {
  if (selected.display_type === "reflection") {
    return reflectionToQuestion(selected.item as ReflectionPrompt);
  }
  return baseItemToQuestion(
    selected.item as BaseItem,
    selected.display_type === "scenario_card" ? "scenario_card" : "frequency",
  );
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Run the stratified item selection for a given run number and return
 * the ordered question list in DynamicQuestionDefinition format.
 *
 * run_number 1 → full 143-item selection
 * run_number > 1 → quick 43-item retake
 */
export function runItemSelection(runNumber: number): DynamicQuestionDefinition[] {
  const selected: SelectedItem[] = isMonthlyRetakeRun(runNumber)
    ? select43Items(RAY_ITEMS, TOOL_ITEMS, ECLIPSE_ITEMS, VALIDITY_ITEMS, REFLECTION_PROMPTS)
    : select143Items(RAY_ITEMS, TOOL_ITEMS, ECLIPSE_ITEMS, VALIDITY_ITEMS, REFLECTION_PROMPTS);

  return selected.map(selectedItemToQuestion);
}

/**
 * Given a stored ordered array of item IDs, rebuild the DynamicQuestionDefinition[]
 * by looking up each item in the banks. Used by the /questions API endpoint for
 * resuming an in-progress run.
 */
export function questionsFromItemIds(
  itemIds: string[],
): DynamicQuestionDefinition[] {
  // Build lookup maps across all banks
  const byId = new Map<string, DynamicQuestionDefinition>();

  for (const item of RAY_ITEMS) {
    byId.set(item.Item_ID, baseItemToQuestion(
      item,
      item.Response_Format === "ForcedChoice_A_D" ? "scenario_card" : "frequency",
    ));
  }
  for (const item of TOOL_ITEMS) {
    byId.set(item.Item_ID, baseItemToQuestion(
      item,
      item.Response_Format === "ForcedChoice_A_D" ? "scenario_card" : "frequency",
    ));
  }
  for (const item of ECLIPSE_ITEMS) {
    byId.set(item.Item_ID, baseItemToQuestion(item, "frequency"));
  }
  for (const item of VALIDITY_ITEMS) {
    byId.set(item.Item_ID, baseItemToQuestion(item, "frequency"));
  }
  for (const prompt of REFLECTION_PROMPTS) {
    byId.set(prompt.Prompt_ID, reflectionToQuestion(prompt));
  }

  return itemIds
    .map((id) => byId.get(id))
    .filter((q): q is DynamicQuestionDefinition => q !== undefined);
}
