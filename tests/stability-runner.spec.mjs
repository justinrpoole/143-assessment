/**
 * 36-Pair Stability Runner
 *
 * Validates scoring determinism across all 36 ray-pair fixtures:
 * 1. Every fixture produces expected top_rays and ray_pair
 * 2. Scoring is state-invariant (same result across all CANONICAL_STATES)
 * 3. Scoring is deterministic (3 runs produce identical results)
 * 4. SHA-256 signature pairs are consistent
 *
 * Run: npm run qa:stability
 */

import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import {
  CANONICAL_STATES,
  loadCanonicalContent,
  scoreSeedProfile,
} from "../scripts/qa/scoring-harness.mjs";

const appRoot = process.cwd();
const contentRoot = path.join(appRoot, "src", "content");
const fixturePath = path.join(appRoot, "test_fixtures", "seed_profiles.json");

const DETERMINISM_RUNS = 3;

function computeInputHash(responses) {
  const sorted = Object.entries(responses)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([questionId, value]) => ({ q: questionId, v: value }));
  const json = JSON.stringify(sorted);
  return createHash("sha256").update(json, "utf8").digest("hex");
}

function computeOutputHash(output) {
  const json = JSON.stringify(output, Object.keys(output).sort());
  return createHash("sha256").update(json, "utf8").digest("hex");
}

function arraysEqual(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((item, idx) => item === b[idx])
  );
}

function run() {
  const { questions, rays, rayPairs } = loadCanonicalContent(contentRoot);
  const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const failures = [];
  let passed = 0;

  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    throw new Error("seed_profiles.json must be a non-empty array.");
  }

  // --- Coverage check: every expected pair has a fixture ---
  const expectedPairProfiles = new Set(
    rayPairs.map((pair) => `pair_${pair.pair_id.replace("-", "_")}`),
  );
  const actualPairProfiles = new Set(
    fixtures
      .map((f) => f.profile_id)
      .filter((id) => String(id).startsWith("pair_")),
  );

  for (const profileId of expectedPairProfiles) {
    if (!actualPairProfiles.has(profileId)) {
      failures.push({
        profile_id: "__coverage__",
        message: `Missing seed profile for ray pair fixture ${profileId}.`,
      });
    }
  }

  console.log(`\nStability Runner: ${fixtures.length} fixtures, ${DETERMINISM_RUNS} runs each`);
  console.log(`States per fixture: ${CANONICAL_STATES.length}`);
  console.log("─".repeat(60));

  const signaturePairs = [];

  for (const fixture of fixtures) {
    const expectedTopRays = fixture?.expected?.top_rays;
    const expectedPair = fixture?.expected?.ray_pair;

    try {
      // --- Run 1: Baseline ---
      const baseline = scoreSeedProfile({
        responses: fixture.responses ?? {},
        userState: "public",
        questions,
        rays,
      });

      // Validate expected top_rays
      if (!arraysEqual(baseline.top_rays, expectedTopRays)) {
        failures.push({
          profile_id: fixture.profile_id,
          message: `Expected top_rays ${JSON.stringify(expectedTopRays)} but got ${JSON.stringify(baseline.top_rays)}.`,
        });
        continue;
      }

      // Validate expected ray_pair
      if (expectedPair && baseline.ray_pair !== expectedPair) {
        failures.push({
          profile_id: fixture.profile_id,
          message: `Expected ray_pair "${expectedPair}" but got "${baseline.ray_pair}".`,
        });
        continue;
      }

      // --- State invariance ---
      let stateOk = true;
      for (const state of CANONICAL_STATES) {
        const byState = scoreSeedProfile({
          responses: fixture.responses ?? {},
          userState: state,
          questions,
          rays,
        });
        if (!arraysEqual(byState.top_rays, baseline.top_rays)) {
          failures.push({
            profile_id: fixture.profile_id,
            message: `State invariance failed for "${state}" (top_rays drifted).`,
          });
          stateOk = false;
          break;
        }
        if (byState.ray_pair !== baseline.ray_pair) {
          failures.push({
            profile_id: fixture.profile_id,
            message: `State invariance failed for "${state}" (ray_pair drifted).`,
          });
          stateOk = false;
          break;
        }
      }
      if (!stateOk) continue;

      // --- Determinism: run N times, compare output hashes ---
      const baselineHash = computeOutputHash(baseline);
      let deterministicOk = true;

      for (let i = 1; i < DETERMINISM_RUNS; i++) {
        const repeated = scoreSeedProfile({
          responses: fixture.responses ?? {},
          userState: "public",
          questions,
          rays,
        });
        const repeatedHash = computeOutputHash(repeated);

        if (repeatedHash !== baselineHash) {
          failures.push({
            profile_id: fixture.profile_id,
            message: `Determinism failed: run ${i + 1} output hash differs from baseline.`,
          });
          deterministicOk = false;
          break;
        }
      }
      if (!deterministicOk) continue;

      // --- Signature pair ---
      const inputHash = computeInputHash(fixture.responses ?? {});
      signaturePairs.push({
        profile_id: fixture.profile_id,
        input_hash: inputHash,
        output_hash: baselineHash,
        top_rays: baseline.top_rays,
        ray_pair: baseline.ray_pair,
      });

      passed += 1;
    } catch (error) {
      failures.push({
        profile_id: fixture.profile_id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // --- Report ---
  const total = fixtures.length;
  console.log("");

  if (failures.length > 0) {
    console.error("STABILITY RUNNER: FAILED");
    console.error(`Fixtures passed: ${passed}/${total}`);
    console.error(`Failures: ${failures.length}`);
    failures.forEach((failure, idx) => {
      console.error(`  ${idx + 1}. [${failure.profile_id}] ${failure.message}`);
    });
    process.exit(1);
  }

  console.log("STABILITY RUNNER: PASS");
  console.log(`Fixtures passed: ${passed}/${total}`);
  console.log(`Determinism runs per fixture: ${DETERMINISM_RUNS}`);
  console.log(`States checked per fixture: ${CANONICAL_STATES.length}`);
  console.log(`Signature pairs generated: ${signaturePairs.length}`);
  console.log(`Ray-pair coverage: ${expectedPairProfiles.size} expected, ${actualPairProfiles.size} found`);

  // Verify all input hashes are unique (each fixture has distinct responses)
  const uniqueInputHashes = new Set(signaturePairs.map((s) => s.input_hash));
  if (uniqueInputHashes.size !== signaturePairs.length) {
    console.warn(`WARNING: ${signaturePairs.length - uniqueInputHashes.size} duplicate input hashes detected.`);
  } else {
    console.log(`Input hash uniqueness: ${uniqueInputHashes.size}/${signaturePairs.length} unique`);
  }
}

run();
