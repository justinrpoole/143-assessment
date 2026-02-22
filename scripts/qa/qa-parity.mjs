import fs from "node:fs";
import path from "node:path";

import {
  CANONICAL_STATES,
  scoreAssessment as scoreAssessmentProduction,
} from "../../src/lib/scoring/score-assessment.mjs";
import {
  loadCanonicalContent,
  scoreSeedProfile,
} from "./scoring-harness.mjs";

const SCORE_TOLERANCE = 1e-9;

function arraysEqual(left, right) {
  if (!Array.isArray(left) || !Array.isArray(right)) {
    return false;
  }
  if (left.length !== right.length) {
    return false;
  }
  return left.every((value, index) => value === right[index]);
}

function roughlyEqual(left, right, tolerance = SCORE_TOLERANCE) {
  if (left === right) {
    return true;
  }
  if (!Number.isFinite(left) && !Number.isFinite(right)) {
    return true;
  }
  return Math.abs(left - right) <= tolerance;
}

function mapHarnessScores(rayScores) {
  return Object.fromEntries(
    rayScores.map((entry) => [entry.ray_id, entry.score]),
  );
}

function compareScoresByRay({
  fixtureId,
  harnessScoresByRay,
  productionScoresByRay,
  rayIds,
  mismatches,
}) {
  for (const rayId of rayIds) {
    const harnessScore = harnessScoresByRay[rayId];
    const productionScore = productionScoresByRay[rayId];
    if (!roughlyEqual(harnessScore, productionScore)) {
      mismatches.push(
        `[${fixtureId}] ray_scores_by_id mismatch for ${rayId}: harness=${String(
          harnessScore,
        )} production=${String(productionScore)}`,
      );
      return false;
    }
  }
  return true;
}

function compareStateInvariance({
  fixture,
  baselineProduction,
  rayIds,
  mismatches,
}) {
  for (const state of CANONICAL_STATES) {
    const byState = scoreAssessmentProduction({
      responses: fixture.responses ?? {},
      metadata: { user_state: state },
    });

    if (!arraysEqual(byState.top_rays, baselineProduction.top_rays)) {
      mismatches.push(
        `[${fixture.profile_id}] state invariance failed for "${state}" (top_rays drifted).`,
      );
      return false;
    }

    if (byState.ray_pair_id !== baselineProduction.ray_pair_id) {
      mismatches.push(
        `[${fixture.profile_id}] state invariance failed for "${state}" (ray_pair_id drifted).`,
      );
      return false;
    }

    const stable = compareScoresByRay({
      fixtureId: `${fixture.profile_id}:${state}`,
      harnessScoresByRay: baselineProduction.ray_scores_by_id,
      productionScoresByRay: byState.ray_scores_by_id,
      rayIds,
      mismatches,
    });
    if (!stable) {
      return false;
    }
  }
  return true;
}

function run() {
  const appRoot = process.cwd();
  const contentRoot = path.join(appRoot, "src", "content");
  const fixturesPath = path.join(appRoot, "test_fixtures", "seed_profiles.json");

  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
  const { questions, rays } = loadCanonicalContent(contentRoot);
  const rayIds = rays.map((ray) => ray.ray_id);

  const mismatches = [];
  let checked = 0;

  for (const fixture of fixtures) {
    checked += 1;

    const harness = scoreSeedProfile({
      responses: fixture.responses ?? {},
      userState: "public",
      questions,
      rays,
    });

    const production = scoreAssessmentProduction({
      responses: fixture.responses ?? {},
      metadata: { user_state: "public" },
    });

    if (!arraysEqual(harness.top_rays, production.top_rays)) {
      mismatches.push(
        `[${fixture.profile_id}] top_rays mismatch harness=${JSON.stringify(
          harness.top_rays,
        )} production=${JSON.stringify(production.top_rays)}`,
      );
      continue;
    }

    if (harness.ray_pair !== production.ray_pair_id) {
      mismatches.push(
        `[${fixture.profile_id}] ray_pair mismatch harness=${harness.ray_pair} production=${production.ray_pair_id}`,
      );
      continue;
    }

    const harnessScoresByRay = mapHarnessScores(harness.ray_scores);
    const scoresMatch = compareScoresByRay({
      fixtureId: fixture.profile_id,
      harnessScoresByRay,
      productionScoresByRay: production.ray_scores_by_id,
      rayIds,
      mismatches,
    });
    if (!scoresMatch) {
      continue;
    }

    compareStateInvariance({
      fixture,
      baselineProduction: production,
      rayIds,
      mismatches,
    });
  }

  if (mismatches.length > 0) {
    console.error("\nqa:parity FAILED");
    console.error(`Fixtures checked: ${checked}`);
    console.error(`Mismatches: ${mismatches.length}`);
    mismatches.forEach((entry, index) => {
      console.error(`${index + 1}. ${entry}`);
    });
    process.exit(1);
  }

  console.log("\nqa:parity PASS");
  console.log(`Fixtures checked: ${checked}`);
  console.log("Mismatches: 0");
}

run();
