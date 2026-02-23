/**
 * load-item-banks.ts
 *
 * Loads all 7 JSON data files and returns the ItemBanks shape
 * expected by the scoring pipeline. Cached at module load.
 *
 * Server-side only — never import from client components.
 */

import type { BaseItem, ReflectionPrompt, ArchetypeBlock } from "@/lib/types";
import type { ExecTagMapRow } from "./exec-tags";
import type { ItemBanks } from "./pipeline";

import rayItemsRaw from "@/data/ray_items.json";
import toolItemsRaw from "@/data/tool_items.json";
import eclipseItemsRaw from "@/data/eclipse_items.json";
import validityItemsRaw from "@/data/validity_items.json";
import reflectionPromptsRaw from "@/data/reflection_prompts.json";
import archetypeBlocksRaw from "@/data/archetype_blocks.json";
import execTagMapRaw from "@/data/exec_tag_map.json";

const BANKS: ItemBanks = {
  rayItems: rayItemsRaw as BaseItem[],
  toolItems: toolItemsRaw as BaseItem[],
  eclipseItems: eclipseItemsRaw as BaseItem[],
  validityItems: validityItemsRaw as BaseItem[],
  reflectionPrompts: reflectionPromptsRaw as ReflectionPrompt[],
  archetypeBlocks: archetypeBlocksRaw as ArchetypeBlock[],
  execTagMap: execTagMapRaw as ExecTagMapRow[],
};

export function loadItemBanks(): ItemBanks {
  return BANKS;
}
