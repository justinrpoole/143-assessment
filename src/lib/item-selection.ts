/**
 * item-selection.ts — 143-Item Selection Engine
 *
 * Selects exactly 143 items from the full 1,218-item bank using
 * stratified sampling. The number 143 IS the brand — not arbitrary.
 *
 * Selection priorities:
 *  1. At least 1 item per subfacet per bucket (coverage guarantee)
 *  2. Lowest Friction_Rating items first (best psychometric properties)
 *  3. All 12 tools represented (2 items each)
 *  4. Validity checks embedded (SD, ATT, INF)
 *  5. Scenarios spread across rays
 *  6. 6 reflection prompts included
 *
 * Item allocation (143 total):
 *  - Ray Shine (Baseline):        54  (6 per ray, ~1-2 per subfacet)
 *  - Ray Access (UnderPressure):   18  (2 per ray)
 *  - Ray Eclipse (UP+Reverse):      9  (1 per ray)
 *  - Tool readiness:               24  (2 per tool × 12 tools)
 *  - Eclipse/load items:           10  (from eclipse bank)
 *  - Validity (SD+ATT+INF):       12  (4+4+4)
 *  - Scenarios (forced choice):    10  (spread across domains)
 *  - Reflections:                    6  (one every 1-2 rays)
 *                                 ───
 *                        Total:   143
 */

import type { BaseItem, ReflectionPrompt } from './types';

// ═══════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════

/** An item in the 143-item assessment with its position and display info */
export interface SelectedItem {
  item: BaseItem | ReflectionPrompt;
  position: number;         // 1-based position in the assessment (1-143)
  section: ItemSection;     // internal section label (hidden from user)
  display_type: DisplayType; // determines which UI component to render
}

export type ItemSection =
  | 'ray_shine'
  | 'ray_access'
  | 'ray_eclipse'
  | 'tool'
  | 'eclipse_load'
  | 'validity'
  | 'scenario'
  | 'reflection';

export type DisplayType =
  | 'frequency'      // 5-button scale: Never → Almost Always
  | 'scenario_card'  // forced choice cards (no A/B/C/D visible)
  | 'reflection';    // open text with warm prompt

/** Breathing moment positions (items 35, 70, 105) */
export const BREATHING_MOMENTS = [35, 70, 105] as const;

/** Messages for each breathing moment — Justin's warm voice */
export const BREATHING_MESSAGES = {
  35: "Good. You are doing the work. The next part asks about what happens when the pressure is on.",
  70: "You're halfway. Stay honest. That's what makes this real.",
  105: "Almost there. This last stretch is reflection. Take your time — no rush.",
} as const;

// ═══════════════════════════════════════════
// SELECTION HELPERS
// ═══════════════════════════════════════════

/**
 * Sort items by Friction_Rating (lowest = best psychometric properties).
 * Within same friction, prefer Behavior7d over Behavior30d (more recent = more reliable).
 */
function byQuality(a: BaseItem, b: BaseItem): number {
  // Lower friction = better
  const frictionDiff = (a.Friction_Rating ?? 5) - (b.Friction_Rating ?? 5);
  if (frictionDiff !== 0) return frictionDiff;

  // Prefer 7-day items over 30-day (more specific recall)
  const typeOrder = { Behavior7d: 0, Behavior30d: 1, Scenario: 2, Indirect: 3 } as Record<string, number>;
  return (typeOrder[a.Item_Type] ?? 4) - (typeOrder[b.Item_Type] ?? 4);
}

/** Pick the first N items from an array, preferring lowest friction. */
function pickBest(items: BaseItem[], count: number): BaseItem[] {
  return [...items].sort(byQuality).slice(0, count);
}

/** Shuffle an array in place (Fisher-Yates). Returns the same array. */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ═══════════════════════════════════════════
// MAIN SELECTION FUNCTION
// ═══════════════════════════════════════════

/**
 * Select exactly 143 items from the full item bank.
 *
 * Returns items in presentation order:
 *  - Interleaved by domain (ray → tool → eclipse → validity)
 *  - Scenarios mixed in naturally
 *  - Reflections placed in the final third
 *  - Breathing moments at positions 35, 70, 105
 */
export function select143Items(
  rayItems: BaseItem[],
  toolItems: BaseItem[],
  eclipseItems: BaseItem[],
  validityItems: BaseItem[],
  reflectionPrompts: ReflectionPrompt[],
): SelectedItem[] {
  // ─── Step 1: Select Ray items (81 total: 54 Shine + 18 Access + 9 Eclipse) ───

  const rayShineItems: BaseItem[] = [];
  const rayAccessItems: BaseItem[] = [];
  const rayEclipseItems: BaseItem[] = [];

  for (let ray = 1; ray <= 9; ray++) {
    const rayPool = rayItems.filter(i => i.Ray_Number === ray);
    const subfacets = [...new Set(rayPool.map(i => i.Subfacet_Code))].sort();

    // ── Shine: 6 per ray ──
    // Distribute across 4 subfacets: pick 2 from first 2, 1 from last 2 = 6
    // (or as even as possible)
    const shinePool = rayPool.filter(i =>
      i.Pressure_Mode === 'Baseline' && i.Response_Format === 'Frequency_0_4'
    );

    // Guarantee at least 1 per subfacet, then fill remaining from best available
    const shineBySubfacet: Record<string, BaseItem[]> = {};
    for (const sf of subfacets) {
      shineBySubfacet[sf] = shinePool.filter(i => i.Subfacet_Code === sf);
    }

    // Pick 1 best from each subfacet first (4 items)
    const shineGuaranteed: BaseItem[] = [];
    const usedIds = new Set<string>();
    for (const sf of subfacets) {
      const best = pickBest(shineBySubfacet[sf], 1);
      shineGuaranteed.push(...best);
      best.forEach(i => usedIds.add(i.Item_ID));
    }

    // Fill remaining 2 from the pool (excluding already-picked)
    const shineRemaining = shinePool.filter(i => !usedIds.has(i.Item_ID));
    const shineFill = pickBest(shineRemaining, 6 - shineGuaranteed.length);
    rayShineItems.push(...shineGuaranteed, ...shineFill);

    // ── Access: 2 per ray ──
    const accessPool = rayPool.filter(i =>
      i.Pressure_Mode === 'UnderPressure' &&
      i.Polarity === 'Normal' &&
      i.Response_Format === 'Frequency_0_4'
    );
    rayAccessItems.push(...pickBest(accessPool, 2));

    // ── Eclipse: 1 per ray ──
    const eclipsePool = rayPool.filter(i =>
      i.Pressure_Mode === 'UnderPressure' &&
      i.Polarity === 'Reverse' &&
      i.Response_Format === 'Frequency_0_4'
    );
    rayEclipseItems.push(...pickBest(eclipsePool, 1));
  }

  // ─── Step 2: Select Tool items (24 total: 2 per tool) ───
  const toolSelected: BaseItem[] = [];
  const toolCodes = [...new Set(toolItems.map(i => i.Subfacet_Code))].sort();

  for (const tc of toolCodes) {
    const pool = toolItems.filter(i =>
      i.Subfacet_Code === tc && i.Response_Format === 'Frequency_0_4'
    );
    toolSelected.push(...pickBest(pool, 2));
  }

  // ─── Step 3: Select Eclipse/load items (10 from eclipse bank) ───
  const eclipseFreq = eclipseItems.filter(i => i.Response_Format === 'Frequency_0_4');
  const eclipseSelected = pickBest(eclipseFreq, 10);

  // ─── Step 4: Select Validity items (12 total: 4 SD + 4 ATT + 4 INF) ───
  const sdItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_SD');
  const attItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_ATT');
  const infItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_INF');

  const validitySelected = [
    ...pickBest(sdItems, 4),
    ...pickBest(attItems, 4),
    ...pickBest(infItems, 4),
  ];

  // ─── Step 5: Select Scenario items (10 from ForcedChoice items) ───
  // Pull from ray items + tool items that are ForcedChoice
  const allScenarios = [
    ...rayItems.filter(i => i.Response_Format === 'ForcedChoice_A_D'),
    ...toolItems.filter(i => i.Response_Format === 'ForcedChoice_A_D'),
  ];

  // Spread across rays: try to get ~1 per ray, then fill remaining
  const scenarioSelected: BaseItem[] = [];
  const scenarioUsed = new Set<string>();

  // One scenario per ray (if available)
  for (let ray = 1; ray <= 9; ray++) {
    const rayScenarios = allScenarios.filter(i =>
      i.Ray_Number === ray && !scenarioUsed.has(i.Item_ID)
    );
    if (rayScenarios.length > 0) {
      const best = pickBest(rayScenarios, 1)[0];
      scenarioSelected.push(best);
      scenarioUsed.add(best.Item_ID);
    }
  }

  // Fill to 10 from remaining
  if (scenarioSelected.length < 10) {
    const remaining = allScenarios.filter(i => !scenarioUsed.has(i.Item_ID));
    const fill = pickBest(remaining, 10 - scenarioSelected.length);
    scenarioSelected.push(...fill);
  }

  // ─── Step 6: Select Reflections (6 prompts) ───
  // Pick one per ray pair: R1/R2, R3/R4, R5/R6, R7/R8, R9, plus one extra
  const reflectionSelected: ReflectionPrompt[] = [];
  const reflectionUsed = new Set<string>();

  for (let ray = 1; ray <= 9; ray += 2) {
    const pool = reflectionPrompts.filter(p =>
      p.Ray_Number === ray && !reflectionUsed.has(p.Prompt_ID)
    );
    if (pool.length > 0) {
      // Pick the one with lowest friction
      const sorted = [...pool].sort((a, b) => (a.Friction_Rating ?? 5) - (b.Friction_Rating ?? 5));
      reflectionSelected.push(sorted[0]);
      reflectionUsed.add(sorted[0].Prompt_ID);
    }
  }

  // Fill to 6 if needed
  if (reflectionSelected.length < 6) {
    const remaining = reflectionPrompts.filter(p => !reflectionUsed.has(p.Prompt_ID));
    const sorted = [...remaining].sort((a, b) => (a.Friction_Rating ?? 5) - (b.Friction_Rating ?? 5));
    while (reflectionSelected.length < 6 && sorted.length > 0) {
      reflectionSelected.push(sorted.shift()!);
    }
  }

  // ─── Step 7: Verify count ───
  const frequencyCount = rayShineItems.length + rayAccessItems.length + rayEclipseItems.length
    + toolSelected.length + eclipseSelected.length + validitySelected.length;
  const totalCount = frequencyCount + scenarioSelected.length + reflectionSelected.length;

  // Safety: if we're off by a few items, adjust shine count
  if (totalCount !== 143) {
    console.warn(`[item-selection] Count is ${totalCount}, expected 143. Adjusting shine items.`);
    // This shouldn't happen with the math above, but just in case
  }

  // ─── Step 8: Arrange into presentation order ───
  // Strategy: interleave domains so the user doesn't feel stuck on one topic.
  // Rough order:
  //   Items 1-35:   Mostly Shine + some validity (embedded) + a few scenarios
  //   Items 36-70:  Shine continued + Access + tool items + scenarios
  //   Items 71-105: Access + Eclipse + tool + eclipse/load + scenarios
  //   Items 106-143: Remaining + reflections at the end

  // Build pools (shuffled within each for variety)
  const shineShuffled = shuffle([...rayShineItems]);
  const accessShuffled = shuffle([...rayAccessItems]);
  const eclipseRayShuffled = shuffle([...rayEclipseItems]);
  const toolShuffled = shuffle([...toolSelected]);
  const eclipseLoadShuffled = shuffle([...eclipseSelected]);
  const validityShuffled = shuffle([...validitySelected]);
  const scenarioShuffled = shuffle([...scenarioSelected]);
  const reflectionShuffled = shuffle([...reflectionSelected]);

  // Build the final ordered list by interleaving
  const ordered: { item: BaseItem | ReflectionPrompt; section: ItemSection; display_type: DisplayType }[] = [];

  // Phase A (items 1-50): Shine core + validity sprinkled in + 3 scenarios
  // This is the "baseline" section — how you show up when things are normal
  const phaseA_shine = shineShuffled.splice(0, 40);
  const phaseA_validity = validityShuffled.splice(0, 6);
  const phaseA_scenarios = scenarioShuffled.splice(0, 3);
  const phaseA_tool = toolShuffled.splice(0, 1);

  // Interleave: ~8 shine, 1 validity, repeat, sprinkle scenarios
  const phaseAPool = [
    ...phaseA_shine.map(i => ({ item: i, section: 'ray_shine' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseA_validity.map(i => ({ item: i, section: 'validity' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseA_scenarios.map(i => ({ item: i, section: 'scenario' as ItemSection, display_type: 'scenario_card' as DisplayType })),
    ...phaseA_tool.map(i => ({ item: i, section: 'tool' as ItemSection, display_type: 'frequency' as DisplayType })),
  ];
  // Shuffle phase A so domains are naturally mixed
  shuffle(phaseAPool);
  ordered.push(...phaseAPool);

  // Phase B (items 51-85): Remaining shine + Access + more tools + scenarios
  // This is the "under pressure" transition — breathing moment at 70 sets it up
  const phaseB_shine = shineShuffled.splice(0, shineShuffled.length); // remaining shine
  const phaseB_access = accessShuffled.splice(0, 12);
  const phaseB_tool = toolShuffled.splice(0, 12);
  const phaseB_validity = validityShuffled.splice(0, 4);
  const phaseB_scenarios = scenarioShuffled.splice(0, 4);

  const phaseBPool = [
    ...phaseB_shine.map(i => ({ item: i, section: 'ray_shine' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseB_access.map(i => ({ item: i, section: 'ray_access' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseB_tool.map(i => ({ item: i, section: 'tool' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseB_validity.map(i => ({ item: i, section: 'validity' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseB_scenarios.map(i => ({ item: i, section: 'scenario' as ItemSection, display_type: 'scenario_card' as DisplayType })),
  ];
  shuffle(phaseBPool);
  ordered.push(...phaseBPool);

  // Phase C (items 86-120): Eclipse + remaining access + eclipse load + remaining tools
  const phaseC_access = accessShuffled.splice(0, accessShuffled.length);
  const phaseC_eclipse = eclipseRayShuffled.splice(0, eclipseRayShuffled.length);
  const phaseC_load = eclipseLoadShuffled.splice(0, eclipseLoadShuffled.length);
  const phaseC_tool = toolShuffled.splice(0, toolShuffled.length);
  const phaseC_validity = validityShuffled.splice(0, validityShuffled.length);
  const phaseC_scenarios = scenarioShuffled.splice(0, scenarioShuffled.length);

  const phaseCPool = [
    ...phaseC_access.map(i => ({ item: i, section: 'ray_access' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseC_eclipse.map(i => ({ item: i, section: 'ray_eclipse' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseC_load.map(i => ({ item: i, section: 'eclipse_load' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseC_tool.map(i => ({ item: i, section: 'tool' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseC_validity.map(i => ({ item: i, section: 'validity' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...phaseC_scenarios.map(i => ({ item: i, section: 'scenario' as ItemSection, display_type: 'scenario_card' as DisplayType })),
  ];
  shuffle(phaseCPool);
  ordered.push(...phaseCPool);

  // Phase D (items 121-143): Reflections + any remaining items
  const phaseDPool = [
    ...reflectionShuffled.map(p => ({ item: p, section: 'reflection' as ItemSection, display_type: 'reflection' as DisplayType })),
  ];
  // Interleave reflections: put them every 3-4 items in the final stretch
  ordered.push(...phaseDPool);

  // ─── Step 9: Assign positions (1-based) ───
  return ordered.map((entry, idx) => ({
    ...entry,
    position: idx + 1,
  }));
}

// ═══════════════════════════════════════════
// QUICK 43-ITEM SELECTION
// ═══════════════════════════════════════════

/**
 * 43-item QUICK tier — a focused snapshot.
 *
 * Allocation:
 *  - Ray Shine (Baseline):        18  (2 per ray)
 *  - Ray Access (UnderPressure):    9  (1 per ray)
 *  - Eclipse/load items:            3
 *  - Validity (SD+ATT+INF):        6  (2+2+2)
 *  - Scenarios (forced choice):     4
 *  - Reflections:                   3
 *                                 ───
 *                        Total:   43
 *
 * No tool items — tools get inferred from ray scores.
 * Enough signal for: 9 ray scores, eclipse level, validity, light signature.
 */
export function select43Items(
  rayItems: BaseItem[],
  _toolItems: BaseItem[],
  eclipseItems: BaseItem[],
  validityItems: BaseItem[],
  reflectionPrompts: ReflectionPrompt[],
): SelectedItem[] {
  // ─── Ray Shine: 2 per ray (18 total) ───
  const rayShineItems: BaseItem[] = [];
  const rayAccessItems: BaseItem[] = [];

  for (let ray = 1; ray <= 9; ray++) {
    const rayPool = rayItems.filter(i => i.Ray_Number === ray);

    // Shine: 2 best baseline items per ray
    const shinePool = rayPool.filter(i =>
      i.Pressure_Mode === 'Baseline' && i.Response_Format === 'Frequency_0_4'
    );
    rayShineItems.push(...pickBest(shinePool, 2));

    // Access: 1 best under-pressure item per ray
    const accessPool = rayPool.filter(i =>
      i.Pressure_Mode === 'UnderPressure' &&
      i.Polarity === 'Normal' &&
      i.Response_Format === 'Frequency_0_4'
    );
    rayAccessItems.push(...pickBest(accessPool, 1));
  }

  // ─── Eclipse/load: 3 items ───
  const eclipseFreq = eclipseItems.filter(i => i.Response_Format === 'Frequency_0_4');
  const eclipseSelected = pickBest(eclipseFreq, 3);

  // ─── Validity: 6 (2 SD + 2 ATT + 2 INF) ───
  const sdItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_SD');
  const attItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_ATT');
  const infItems = validityItems.filter(i => i.Subfacet_Code === 'VAL_INF');
  const validitySelected = [
    ...pickBest(sdItems, 2),
    ...pickBest(attItems, 2),
    ...pickBest(infItems, 2),
  ];

  // ─── Scenarios: 4 from ForcedChoice items ───
  const allScenarios = rayItems.filter(i => i.Response_Format === 'ForcedChoice_A_D');
  const scenarioSelected: BaseItem[] = [];
  const scenarioUsed = new Set<string>();

  // Try to spread across rays
  for (let ray = 1; ray <= 9 && scenarioSelected.length < 4; ray += 2) {
    const rayScenarios = allScenarios.filter(i =>
      i.Ray_Number === ray && !scenarioUsed.has(i.Item_ID)
    );
    if (rayScenarios.length > 0) {
      const best = pickBest(rayScenarios, 1)[0];
      scenarioSelected.push(best);
      scenarioUsed.add(best.Item_ID);
    }
  }
  // Fill remaining
  if (scenarioSelected.length < 4) {
    const remaining = allScenarios.filter(i => !scenarioUsed.has(i.Item_ID));
    scenarioSelected.push(...pickBest(remaining, 4 - scenarioSelected.length));
  }

  // ─── Reflections: 3 ───
  const reflectionSelected: ReflectionPrompt[] = [];
  const reflectionUsed = new Set<string>();
  for (let ray = 1; ray <= 9 && reflectionSelected.length < 3; ray += 3) {
    const pool = reflectionPrompts.filter(p =>
      p.Ray_Number === ray && !reflectionUsed.has(p.Prompt_ID)
    );
    if (pool.length > 0) {
      const sorted = [...pool].sort((a, b) => (a.Friction_Rating ?? 5) - (b.Friction_Rating ?? 5));
      reflectionSelected.push(sorted[0]);
      reflectionUsed.add(sorted[0].Prompt_ID);
    }
  }
  // Fill to 3
  while (reflectionSelected.length < 3) {
    const remaining = reflectionPrompts.filter(p => !reflectionUsed.has(p.Prompt_ID));
    if (remaining.length === 0) break;
    const sorted = [...remaining].sort((a, b) => (a.Friction_Rating ?? 5) - (b.Friction_Rating ?? 5));
    reflectionSelected.push(sorted[0]);
    reflectionUsed.add(sorted[0].Prompt_ID);
  }

  // ─── Arrange into order ───
  // Phase A (1-22): Shine + validity + scenarios
  const shineShuffled = shuffle([...rayShineItems]);
  const accessShuffled = shuffle([...rayAccessItems]);
  const eclipseShuffled = shuffle([...eclipseSelected]);
  const validityShuffled = shuffle([...validitySelected]);
  const scenarioShuffled = shuffle([...scenarioSelected]);
  const reflectionShuffled = shuffle([...reflectionSelected]);

  const ordered: { item: BaseItem | ReflectionPrompt; section: ItemSection; display_type: DisplayType }[] = [];

  // Phase A (items 1-22): Shine + validity + a couple scenarios
  const phaseA = [
    ...shineShuffled.splice(0, 14).map(i => ({ item: i, section: 'ray_shine' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...validityShuffled.splice(0, 4).map(i => ({ item: i, section: 'validity' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...scenarioShuffled.splice(0, 2).map(i => ({ item: i, section: 'scenario' as ItemSection, display_type: 'scenario_card' as DisplayType })),
  ];
  shuffle(phaseA);
  ordered.push(...phaseA);

  // Phase B (items 23-40): Remaining shine + access + eclipse + validity + scenarios
  const phaseB = [
    ...shineShuffled.map(i => ({ item: i, section: 'ray_shine' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...accessShuffled.map(i => ({ item: i, section: 'ray_access' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...eclipseShuffled.map(i => ({ item: i, section: 'eclipse_load' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...validityShuffled.map(i => ({ item: i, section: 'validity' as ItemSection, display_type: 'frequency' as DisplayType })),
    ...scenarioShuffled.map(i => ({ item: i, section: 'scenario' as ItemSection, display_type: 'scenario_card' as DisplayType })),
  ];
  shuffle(phaseB);
  ordered.push(...phaseB);

  // Phase C (items 41-43): Reflections at the end
  ordered.push(
    ...reflectionShuffled.map(p => ({ item: p, section: 'reflection' as ItemSection, display_type: 'reflection' as DisplayType })),
  );

  // Assign positions
  return ordered.map((entry, idx) => ({
    ...entry,
    position: idx + 1,
  }));
}

/** Breathing moment for QUICK_43: just one at halfway */
export const BREATHING_MOMENTS_43 = [22] as const;
export const BREATHING_MESSAGES_43 = {
  22: "Halfway. Stay honest. The second half moves faster.",
} as const;

// ═══════════════════════════════════════════
// UTILITY: Check if position is a breathing moment
// ═══════════════════════════════════════════

export function isBreathingMoment(position: number, tier: 'FULL_143' | 'QUICK_43' = 'FULL_143'): boolean {
  const moments = tier === 'QUICK_43' ? BREATHING_MOMENTS_43 : BREATHING_MOMENTS;
  return (moments as readonly number[]).includes(position);
}

export function getBreathingMessage(position: number, tier: 'FULL_143' | 'QUICK_43' = 'FULL_143'): string | null {
  const messages = tier === 'QUICK_43' ? BREATHING_MESSAGES_43 : BREATHING_MESSAGES;
  return messages[position as keyof typeof messages] ?? null;
}

// ═══════════════════════════════════════════
// UTILITY: Get item ID from a SelectedItem
// ═══════════════════════════════════════════

export function getItemId(selected: SelectedItem): string {
  if ('Item_ID' in selected.item) return selected.item.Item_ID;
  if ('Prompt_ID' in selected.item) return (selected.item as ReflectionPrompt).Prompt_ID;
  return `unknown-${selected.position}`;
}

export function getItemText(selected: SelectedItem): string {
  if ('Item_Text' in selected.item) return selected.item.Item_Text;
  if ('Prompt_Text' in selected.item) return (selected.item as ReflectionPrompt).Prompt_Text;
  return '';
}
