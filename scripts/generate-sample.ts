/**
 * generate-sample.ts
 *
 * Runs the NEW modular scoring engine with simulated responses
 * using the full item bank data, and writes a sample
 * OUTPUT_SCHEMA_V1 JSON file to /data/sample_results.json.
 *
 * Usage:  npx tsx scripts/generate-sample.ts
 */

import {
  scoreAssessment,
  type ItemBanks,
} from '../src/lib/scoring';
import type {
  BaseItem, ReflectionPrompt, ResponsePacket, ItemResponse, ArchetypeBlock,
} from '../src/lib/types';
import type { ExecTagMapRow } from '../src/lib/scoring/exec-tags';

import * as fs from 'fs';
import * as path from 'path';

// ── Load all item banks from JSON ──
const DATA = path.resolve(__dirname, '../../data');

function loadJson<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(DATA, filename), 'utf-8');
  return JSON.parse(raw) as T;
}

const rayItems = loadJson<BaseItem[]>('ray_items.json');
const toolItems = loadJson<BaseItem[]>('tool_items.json');
const eclipseItems = loadJson<BaseItem[]>('eclipse_items.json');
const validityItems = loadJson<BaseItem[]>('validity_items.json');
const reflectionPrompts = loadJson<ReflectionPrompt[]>('reflection_prompts.json');
const execTagMap = loadJson<ExecTagMapRow[]>('exec_tag_map.json');
const archetypeBlocks = loadJson<ArchetypeBlock[]>('archetype_blocks.json');

const banks: ItemBanks = {
  rayItems,
  toolItems,
  eclipseItems,
  validityItems,
  reflectionPrompts,
  execTagMap,
  archetypeBlocks,
};

console.log('── Item Bank Summary ──');
console.log(`  Ray items:        ${rayItems.length}`);
console.log(`  Tool items:       ${toolItems.length}`);
console.log(`  Eclipse items:    ${eclipseItems.length}`);
console.log(`  Validity items:   ${validityItems.length}`);
console.log(`  Reflections:      ${reflectionPrompts.length}`);
console.log(`  Exec tag map:     ${execTagMap.length}`);
console.log(`  Archetype blocks: ${archetypeBlocks.length}`);

// ── Simulate responses ──
// A moderately resourced leader with:
// - Strong R5 (Purpose) and R7 (Connection) → Top Two candidates
// - Lower R3 (Presence) → Bottom Ray candidate
// - Moderate eclipse load
// - Clean validity (low SD, consistent pairs)
// - Decent reflection

const now = new Date();
const startTime = new Date(now.getTime() - 15 * 60 * 1000); // 15 minutes ago

const responses: Record<string, ItemResponse> = {};

// Helper: simulate a response for an item
function simulateResponse(item: BaseItem, targetScore: number): void {
  // For Frequency_0_4 items, use the target score directly (0-4)
  // For ForcedChoice items, choose the keyed option if target is high
  let value: number | string;

  if (item.Response_Format === 'ForcedChoice_A_D') {
    // High target → choose keyed option; low target → choose a non-keyed option
    value = targetScore >= 3 ? (item.Keyed_Option || 'A') : 'C';
  } else {
    // Clamp to 0-4 and add some noise
    const noise = (Math.random() - 0.5) * 0.8;
    value = Math.max(0, Math.min(4, Math.round(targetScore + noise)));
  }

  responses[item.Item_ID] = {
    item_id: item.Item_ID,
    value,
    timestamp: startTime.getTime() + Math.floor(Math.random() * 14 * 60 * 1000),
  };
}

// Ray target scores (0-4 scale, higher = more capacity)
const rayTargets: Record<number, number> = {
  1: 2.7,  // Intention: moderate-high
  2: 2.0,  // Joy: moderate
  3: 1.5,  // Presence: lower → bottom ray candidate
  4: 2.7,  // Power: moderate-high
  5: 3.3,  // Purpose: high → top two candidate
  6: 2.0,  // Authenticity: moderate
  7: 3.3,  // Connection: high → top two candidate
  8: 2.0,  // Possibility: moderate
  9: 2.7,  // Be The Light: moderate-high
};

// Simulate ray item responses
for (const item of rayItems) {
  const rayNum = item.Ray_Number;
  if (rayNum === null) continue;

  let target = rayTargets[rayNum] ?? 2.5;

  // Under pressure items: reduce capacity slightly
  if (item.Pressure_Mode === 'UnderPressure') {
    if (item.Polarity === 'Normal') {
      // Access items: slightly lower than baseline
      target = target * 0.8;
    } else {
      // Eclipse items (UnderPressure + Reverse): higher = more distortion
      // Invert: low capacity → high eclipse
      target = 4 - target + (Math.random() * 0.5);
    }
  }

  simulateResponse(item, target);
}

// Simulate tool items: moderate readiness across all tools
for (const item of toolItems) {
  let target = 2.2; // moderate baseline usage
  if (item.Pressure_Mode === 'UnderPressure' && item.Polarity === 'Normal') {
    target = 1.8; // slightly lower under pressure
  } else if (item.Pressure_Mode === 'UnderPressure' && item.Polarity === 'Reverse') {
    target = 2.0; // moderate distortion
  }
  simulateResponse(item, target);
}

// Simulate eclipse items: moderate load
for (const item of eclipseItems) {
  simulateResponse(item, 2.5); // moderate load
}

// Simulate validity items
for (const item of validityItems) {
  if (item.Subfacet_Code === 'VAL_SD') {
    // Low social desirability (not faking)
    simulateResponse(item, 1.0);
  } else if (item.Subfacet_Code === 'VAL_ATT') {
    // Pass attention checks — respond with expected answer
    // Use the keyed option or a low value for "Never" checks
    if (item.Response_Format === 'ForcedChoice_A_D' && item.Keyed_Option) {
      responses[item.Item_ID] = {
        item_id: item.Item_ID,
        value: item.Keyed_Option,
        timestamp: startTime.getTime() + Math.floor(Math.random() * 14 * 60 * 1000),
      };
    } else {
      simulateResponse(item, 0); // "Never" for attention checks
    }
  } else if (item.Subfacet_Code === 'VAL_INF') {
    // Low infrequency scores (not endorsing improbable items)
    simulateResponse(item, 0);
  } else {
    // Consistency pairs: answer moderately
    simulateResponse(item, 2.0);
  }
}

// Simulate reflection responses
const reflectionResponses: Record<string, string> = {};
for (const prompt of reflectionPrompts.slice(0, 6)) {
  // Give detailed responses for first 6 reflections
  reflectionResponses[prompt.Prompt_ID] =
    `Last Tuesday in a team meeting, I noticed my stomach tightening when a colleague challenged my idea. ` +
    `I paused for a few seconds using the Presence Pause tool instead of reacting defensively. ` +
    `I realized this was my pattern of protecting my position rather than staying curious. ` +
    `Next time, I want to use the 90-Second Window before responding. ` +
    `My plan for the next 7 days is to practice one intentional pause in each meeting when I feel triggered.`;
}

// Build the response packet
const packet: ResponsePacket = {
  run_id: 'SAMPLE-002',
  tier: 'FULL_143',
  start_ts: startTime.toISOString(),
  end_ts: now.toISOString(),
  responses,
  reflection_responses: reflectionResponses,
};

console.log(`\n── Simulated Responses ──`);
console.log(`  Total item responses: ${Object.keys(responses).length}`);
console.log(`  Reflection responses: ${Object.keys(reflectionResponses).length}`);
console.log(`  Duration: ${Math.round((now.getTime() - startTime.getTime()) / 1000)}s`);

// ── Run the scoring engine ──
console.log('\n── Running Scoring Engine ──');
const result = scoreAssessment(packet, banks);

// Write results
const outPath = path.resolve(DATA, 'sample_results.json');
fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
console.log(`\nResults written to: ${outPath}`);

// ── Summary ──
console.log('\n══════════════════════════════════');
console.log('         SCORING SUMMARY');
console.log('══════════════════════════════════');
console.log(`Confidence Band: ${result.data_quality.confidence_band}`);
console.log(`Eclipse Level:   ${result.eclipse.level}`);
console.log(`Gate:            ${result.eclipse.gating.mode}`);
console.log(`EER:             ${result.eclipse.derived_metrics.eer?.toFixed(2) ?? 'N/A'}`);
console.log(`BRI:             ${result.eclipse.derived_metrics.bri}`);
console.log(`Acting Status:   ${result.acting_vs_capacity.status}`);
console.log(`Priority Mode:   ${result.recommendations.priority_mode}`);
console.log(`Profile Flag:    ${result.profile_flag}`);
console.log(`Validity Flags:  ${result.data_quality.validity_flags.length === 0 ? 'NONE' : result.data_quality.validity_flags.join(', ')}`);

console.log('\n── Light Signature ──');
if (result.light_signature.archetype) {
  console.log(`Archetype:  ${result.light_signature.archetype.name} (${result.light_signature.archetype.pair_code})`);
}
console.log(`Top Two:    ${result.light_signature.top_two.map(t => `${t.ray_id} ${t.ray_name}`).join(' + ')}`);
console.log(`Just-In:    ${result.light_signature.just_in_ray.ray_id} ${result.light_signature.just_in_ray.ray_name}`);
if (result.light_signature.just_in_ray.move_score !== undefined) {
  console.log(`MoveScore:  ${result.light_signature.just_in_ray.move_score.toFixed(2)}`);
}
console.log(`Routing:    ${result.light_signature.just_in_ray.routing}`);

console.log('\n── Ray Scores (0-100) ──');
for (let i = 1; i <= 9; i++) {
  const r = result.rays[`R${i}`];
  if (!r) continue;
  const ne = r.net_energy?.toFixed(0) ?? 'N/A';
  const shine = r.score.toFixed(0);
  const access = r.access_score?.toFixed(0) ?? 'N/A';
  const eclipse = r.eclipse_score?.toFixed(0) ?? 'N/A';
  console.log(`  R${i} ${r.ray_name.padEnd(15)} Shine:${shine.padStart(3)}  Access:${access.padStart(3)}  Eclipse:${eclipse.padStart(3)}  NE:${ne.padStart(3)}  [${r.eclipse_modifier}]`);
}

console.log('\n── Edge Cases ──');
const detected = result.edge_cases?.filter(e => e.detected) || [];
if (detected.length === 0) {
  console.log('  None detected');
} else {
  for (const ec of detected) {
    console.log(`  ${ec.code}: ${ec.restriction.slice(0, 80)}`);
  }
}

console.log('\n── Executive Signals (first 5) ──');
for (const sig of result.executive_output.signals.slice(0, 5)) {
  console.log(`  ${sig.signal_id} ${sig.label.padEnd(30)} Level: ${sig.level}`);
}
