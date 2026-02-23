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

function pairProfileId(pairId) {
  return `pair_${pairId.replace("-", "_")}`;
}

function arraysEqual(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((item, idx) => item === b[idx]);
}

function run() {
  const { questions, rays, rayPairs } = loadCanonicalContent(contentRoot);
  const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  const failures = [];
  let passed = 0;

  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    throw new Error("seed_profiles.json must be a non-empty array.");
  }

  const expectedPairProfiles = new Set(rayPairs.map((pair) => pairProfileId(pair.pair_id)));
  const actualPairProfiles = new Set(
    fixtures
      .map((fixture) => fixture.profile_id)
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

  for (const fixture of fixtures) {
    const expectedTopRays = fixture?.expected?.top_rays;
    const expectedPair = fixture?.expected?.ray_pair;

    try {
      const baseline = scoreSeedProfile({
        responses: fixture.responses ?? {},
        userState: "public",
        questions,
        rays,
      });

      if (!arraysEqual(baseline.top_rays, expectedTopRays)) {
        failures.push({
          profile_id: fixture.profile_id,
          message: `Expected top_rays ${JSON.stringify(expectedTopRays)} but got ${JSON.stringify(
            baseline.top_rays,
          )}.`,
        });
        continue;
      }

      if (expectedPair && baseline.ray_pair !== expectedPair) {
        failures.push({
          profile_id: fixture.profile_id,
          message: `Expected ray_pair "${expectedPair}" but got "${baseline.ray_pair}".`,
        });
        continue;
      }

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
          break;
        }
        if (byState.ray_pair !== baseline.ray_pair) {
          failures.push({
            profile_id: fixture.profile_id,
            message: `State invariance failed for "${state}" (ray_pair drifted).`,
          });
          break;
        }
      }

      passed += 1;
    } catch (error) {
      failures.push({
        profile_id: fixture.profile_id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const total = fixtures.length;

  if (failures.length > 0) {
    console.error("\nqa:score FAILED");
    console.error(`Fixtures passed: ${passed}/${total}`);
    console.error(`Failures: ${failures.length}`);
    failures.forEach((failure, idx) => {
      console.error(`${idx + 1}. [${failure.profile_id}] ${failure.message}`);
    });
    process.exit(1);
  }

  console.log("\nqa:score PASS");
  console.log(`Fixtures passed: ${passed}/${total}`);
  console.log(`States checked per fixture: ${CANONICAL_STATES.length}`);
  console.log(`Ray-pair coverage checks: ${expectedPairProfiles.size}`);
}

run();
