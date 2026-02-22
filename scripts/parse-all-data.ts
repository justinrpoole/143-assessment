/**
 * parse-all-data.ts
 *
 * One-time script to parse all Excel and Markdown source files
 * into JSON data files the app can import.
 *
 * Reads:
 *   - 05_DATASETS/STEP5B_ItemBank_Hardened_MASTER.xlsx
 *   - 05_DATASETS/STEP4B_ARCHETYPE_QUALIFICATION_RULES.xlsx
 *   - 05_DATASETS/STEP4C_EXECUTIVE_METADATA_MASTER.xlsx
 *   - 02_LIBRARIES/STEP4B_36_LIGHT_SIGNATURE_ARCHETYPES_MASTER.md
 *
 * Writes:
 *   - data/ray_items.json         (720 items)
 *   - data/tool_items.json        (300 items)
 *   - data/eclipse_items.json     (40 items)
 *   - data/validity_items.json    (102 items)
 *   - data/reflection_prompts.json (60 prompts)
 *   - data/scoring_rules.json     (15 rules)
 *   - data/exec_tag_map.json      (24 signals)
 *   - data/archetype_rules.json   (36 archetype qualification rules)
 *   - data/exec_metadata.json     (24 signals + 72 training focus + 14 readiness)
 *   - data/archetype_blocks.json  (36 archetype narrative blocks)
 *
 * Usage: npx tsx scripts/parse-all-data.ts
 */

import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const DATASETS = path.resolve(__dirname, '../../05_DATASETS');
const LIBRARIES = path.resolve(__dirname, '../../02_LIBRARIES');
const OUT = path.resolve(__dirname, '../../data');

// Helper: write JSON with count logging
function writeJson(filename: string, data: unknown[]) {
  const filepath = path.join(OUT, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ${filename}: ${data.length} rows`);
}

// Helper: clean up Excel row values
// - Convert "NA" strings to null
// - Trim whitespace from string values
function cleanRow(row: Record<string, unknown>): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(row)) {
    if (val === 'NA' || val === 'N/A' || val === 'na') {
      cleaned[key] = null;
    } else if (typeof val === 'string') {
      cleaned[key] = val.trim();
    } else {
      cleaned[key] = val;
    }
  }
  return cleaned;
}

// ═══════════════════════════════════════════
// 1. STEP5B: Item Bank (6 sheets)
// ═══════════════════════════════════════════
console.log('\n1. Parsing STEP5B_ItemBank_Hardened_MASTER.xlsx...');

const step5b = XLSX.readFile(path.join(DATASETS, 'STEP5B_ItemBank_Hardened_MASTER.xlsx'));

// Ray items (720)
const rayItems = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['RAY_ITEMS_HARDENED'])
  .map(cleanRow);
writeJson('ray_items.json', rayItems);

// Tool items (300)
const toolItems = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['TOOL_ITEMS_HARDENED'])
  .map(cleanRow);
writeJson('tool_items.json', toolItems);

// Eclipse items (40)
const eclipseItems = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['ECLIPSE_ITEMS_HARDENED'])
  .map(cleanRow);
writeJson('eclipse_items.json', eclipseItems);

// Validity items (102)
const validityItems = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['VALIDITY_ITEMS_HARDENED'])
  .map(cleanRow);
writeJson('validity_items.json', validityItems);

// Reflection prompts (60)
const reflectionPrompts = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['REFLECTION_PROMPTS_HARDENED'])
  .map(cleanRow);
writeJson('reflection_prompts.json', reflectionPrompts);

// Scoring rules (15)
const scoringRules = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['SCORING_RULES_HARDENED'])
  .map(cleanRow);
writeJson('scoring_rules.json', scoringRules);

// Exec tag map (24)
const execTagMap = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step5b.Sheets['EXEC_TAG_MAP_HARDENED'])
  .map(cleanRow);
writeJson('exec_tag_map.json', execTagMap);

// ═══════════════════════════════════════════
// 2. STEP4B: Archetype Qualification Rules
// ═══════════════════════════════════════════
console.log('\n2. Parsing STEP4B_ARCHETYPE_QUALIFICATION_RULES.xlsx...');

const step4b = XLSX.readFile(path.join(DATASETS, 'STEP4B_ARCHETYPE_QUALIFICATION_RULES.xlsx'));

// Pair identification (36 rows)
const pairLogic = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4b.Sheets['Pair Identification Logic'])
  .map(cleanRow);

// Archetype metadata mapping (36 rows)
const archetypeMapping = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4b.Sheets['Archetype ↔ Metadata Mapping'])
  .map(cleanRow);

// Combine pair logic with archetype mapping by index (both are 36 rows, same order)
const archetypeRules = pairLogic.map((pair, i) => {
  const mapping = archetypeMapping[i] || {};
  return {
    // From pair logic
    ray_a: pair['Ray A'],
    ray_b: pair['Ray B'],
    qualification_thresholds: pair['Qualification Thresholds'],
    tie_break_rules: pair['Tie-Break Rules'],
    disqualifiers: pair['Disqualifiers (state/load related)'],
    // From metadata mapping
    archetype_name: mapping['Archetype Name'],
    technical_label: mapping['Technical Label'],
    top_two_rays: mapping['Top Two Rays'],
    common_bottom_rays: mapping['Common Bottom Rays (training targets)'],
    exec_signals_predicted: mapping['Executive Signals Predicted (O-tags)'],
    eclipse_sensitivity: mapping['Eclipse Sensitivity Level'],
  };
});
writeJson('archetype_rules.json', archetypeRules);

// ═══════════════════════════════════════════
// 3. STEP4C: Executive Metadata
// ═══════════════════════════════════════════
console.log('\n3. Parsing STEP4C_EXECUTIVE_METADATA_MASTER.xlsx...');

const step4c = XLSX.readFile(path.join(DATASETS, 'STEP4C_EXECUTIVE_METADATA_MASTER.xlsx'));

// Metadata definitions (24 signals)
const metaDefs = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4c.Sheets['Metadata Definitions'])
  .map(cleanRow);

// Predictive inputs (24 signals)
const metaInputs = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4c.Sheets['Predictive Inputs'])
  .map(cleanRow);

// Training focus outputs (72 rows = 24 signals × 3 levels)
const metaTraining = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4c.Sheets['Training Focus Outputs'])
  .map(cleanRow);

// Leadership readiness index (14 components)
const readinessIndex = XLSX.utils
  .sheet_to_json<Record<string, unknown>>(step4c.Sheets['Leadership Readiness Index'])
  .map(cleanRow);

// Combine definitions + inputs into one record per signal
const execMetadata = metaDefs.map((def) => {
  const signalId = def['Signal ID'] as string;
  const input = metaInputs.find((i) => i['Signal ID'] === signalId) || {};
  const training = metaTraining.filter((t) => t['Signal ID'] === signalId);

  return {
    signal_id: signalId,
    signal_name: def['Signal Name'],
    definition: def['Definition (plain)'],
    why_executives_care: def['Why Executives Care (template)'],
    predictors: input['Rays/Subfacets Involved (predictors)'],
    modifiers: input['Tool readiness + Eclipse/Validity Modifiers'],
    training_focus: training.map((t) => ({
      level: t['Signal Level'],
      recommended_focus: t['Recommended Focus'],
      tools_first: t['Tools First'],
      ray_second: t['Ray Second'],
    })),
  };
});
writeJson('exec_metadata.json', execMetadata);

// Also save readiness index separately
writeJson('leadership_readiness_index.json', readinessIndex);

// ═══════════════════════════════════════════
// 4. STEP4B Archetypes Markdown → JSON
// ═══════════════════════════════════════════
console.log('\n4. Parsing STEP4B_36_LIGHT_SIGNATURE_ARCHETYPES_MASTER.md...');

const mdPath = path.join(LIBRARIES, 'STEP4B_36_LIGHT_SIGNATURE_ARCHETYPES_MASTER.md');
const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Parse archetype blocks from markdown
// Headings look like: ## 01. Strategic Optimist
// Ray pair info is inside the Essence Statement like: (R1 Intention + R2 Joy)
const archetypeBlocks: Array<Record<string, unknown>> = [];

// Split by ## headings (each archetype is a ## section)
const sections = mdContent.split(/\n## /);

for (const section of sections) {
  if (!section.trim()) continue;
  const firstLine = section.split('\n')[0].trim();

  // Match headings like "01. Strategic Optimist"
  const archetypeMatch = firstLine.match(/^(\d+)\.\s+(.+)$/);
  if (!archetypeMatch) continue;

  const index = parseInt(archetypeMatch[1]);
  const name = archetypeMatch[2].trim();
  const body = section.split('\n').slice(1).join('\n').trim();

  // Extract ray pair from the Essence Statement body
  // Pattern: (R1 Intention + R2 Joy) or (R3 Presence + R9 Be The Light)
  const rayMatch = body.match(/\(R(\d)\s+[\w\s]+?\+\s*R(\d)\s+[\w\s]+?\)/);
  const ray_a = rayMatch ? `R${rayMatch[1]}` : '';
  const ray_b = rayMatch ? `R${rayMatch[2]}` : '';
  const pairCode = ray_a && ray_b ? `${ray_a}-${ray_b}` : '';

  // Extract key structured sections from the body
  const extractSection = (label: string): string => {
    const regex = new RegExp(`\\d+\\.\\s+\\*\\*${label}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\d+\\.\\s+\\*\\*|$)`, 'i');
    const match = body.match(regex);
    return match ? match[1].trim() : '';
  };

  archetypeBlocks.push({
    index,
    name,
    pair_code: pairCode,
    ray_a,
    ray_b,
    essence: extractSection('Essence Statement'),
    work_expression: extractSection('How This Shows Up in Work'),
    life_expression: extractSection('How This Shows Up in Life'),
    strengths: extractSection('Signature Strengths When Regulated'),
    stress_distortion: extractSection('Stress Distortion Pattern \\(Eclipse-Driven\\)'),
    ppd_risk: extractSection('Performance vs Presence Risk \\(if applicable\\)'),
    coaching_logic: extractSection('Top Two → Bottom Ray Coaching Logic'),
    starting_tools: extractSection('Best Starting Tools \\(Tools-First Rule\\)'),
    bottom_ray_focus: extractSection('Bottom Ray Training Focus \\(skill language\\)'),
    micro_reps: extractSection('First 3 Micro-Reps \\(work \\+ life blended\\)'),
    reflection_prompts: extractSection('Reflection Prompts \\(required\\)'),
    exec_signals: extractSection('Executive Outcome Signals Influenced \\(metadata tags\\)'),
  });
}

writeJson('archetype_blocks.json', archetypeBlocks);

// ═══════════════════════════════════════════
// Summary
// ═══════════════════════════════════════════
console.log('\n─── PARSE COMPLETE ───');
console.log(`Output directory: ${OUT}`);
const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.json'));
console.log(`JSON files: ${files.length}`);
for (const f of files) {
  const stat = fs.statSync(path.join(OUT, f));
  console.log(`  ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
}
