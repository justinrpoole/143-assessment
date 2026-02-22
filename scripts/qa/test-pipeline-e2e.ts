// Full pipeline end-to-end test
import fs from 'fs';
import path from 'path';
import { scoreAssessment } from '../../src/lib/scoring/pipeline';
import type { ItemBanks } from '../../src/lib/scoring/pipeline';
import type { ResponsePacket } from '../../src/lib/types';

const ROOT = path.resolve(__dirname, '..');

function readJson(p: string) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
}

// Load item banks
const banks: ItemBanks = {
  rayItems: readJson('src/data/ray_items.json'),
  toolItems: readJson('src/data/tool_items.json'),
  eclipseItems: readJson('src/data/eclipse_items.json'),
  validityItems: readJson('src/data/validity_items.json'),
  reflectionPrompts: readJson('src/data/reflection_prompts.json'),
  execTagMap: readJson('src/data/exec_tag_map.json'),
  archetypeBlocks: readJson('src/data/archetype_blocks.json'),
};

// Test multiple profiles
const TEST_PROFILES = ['pair_R1_R2', 'pair_R4_R5', 'pair_R3_R7', 'pair_R2_R9', 'pair_R5_R6'];

const fixtures = readJson('test_fixtures/seed_profiles.json') as Array<{
  profile_id: string;
  responses: Record<string, number>;
  expected: { top_rays: string[] };
}>;
let passed = 0;
let failed = 0;
type PipelineResult = {
  profileId: string;
  topRays: string;
  bottomRay: string;
  eclipse: string;
  gate: string;
  confidence: string;
  archetype: string;
  flags: string[];
  match: boolean;
};
const results: PipelineResult[] = [];

for (const profileId of TEST_PROFILES) {
  const fixture = fixtures.find((f) => f.profile_id === profileId);
  if (!fixture) { console.log(`SKIP: ${profileId} not found`); continue; }

  // Build response packet
  const responses: ResponsePacket['responses'] = {};
  for (const [id, val] of Object.entries(fixture.responses as Record<string, number>)) {
    responses[id] = {
      item_id: id,
      value: val,
      timestamp: Date.now(),
    };
  }

  const packet: ResponsePacket = {
    run_id: `test-${profileId}`,
    tier: 'FULL_143',
    responses,
    reflection_responses: {},
    start_ts: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    end_ts: new Date().toISOString(),
  };

  try {
    const output = scoreAssessment(packet, banks);
    
    const topRays = output.light_signature.top_two.map(t => t.ray_id);
    const expectedTopRays = fixture.expected.top_rays;
    const match = JSON.stringify(topRays) === JSON.stringify(expectedTopRays);
    
    results.push({
      profileId,
      topRays: topRays.join(','),
      bottomRay: output.light_signature.just_in_ray.ray_id,
      eclipse: output.eclipse.level,
      gate: output.eclipse.gating.mode,
      confidence: output.data_quality.confidence_band,
      archetype: output.light_signature.archetype?.name || 'none',
      flags: output.data_quality.validity_flags,
      match,
    });
    
    if (match) passed++;
    else failed++;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e);
    console.error(`ERROR ${profileId}:`, message);
    failed++;
  }
}

// Print results table
console.log('\n=== FULL PIPELINE TEST RESULTS ===\n');
console.log('Profile'.padEnd(20), 'Top 2'.padEnd(8), 'Bottom'.padEnd(8), 'Eclipse'.padEnd(10), 'Gate'.padEnd(12), 'Conf'.padEnd(10), 'Archetype');
console.log('-'.repeat(110));

for (const r of results) {
  const status = r.match ? '✓' : '✗';
  console.log(
    `${status} ${r.profileId}`.padEnd(22),
    r.topRays.padEnd(8),
    r.bottomRay.padEnd(8),
    r.eclipse.padEnd(10),
    r.gate.padEnd(12),
    r.confidence.padEnd(10),
    r.archetype,
  );
  if (r.flags.length > 0) {
    console.log('   Validity flags:', r.flags.join(', '));
  }
}

console.log('\n' + `Result: ${passed}/${passed + failed} profiles passed full pipeline`);

if (failed > 0) process.exit(1);
