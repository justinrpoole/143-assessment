import fs from "node:fs";
import path from "node:path";

import {
  scoreAssessment,
  type ItemBanks,
} from "../../src/lib/scoring";
import type { ExecTagMapRow } from "../../src/lib/scoring/exec-tags";
import type {
  ArchetypeBlock,
  BaseItem,
  ItemResponse,
  ReflectionPrompt,
  ResponsePacket,
} from "../../src/lib/types";
import {
  loadCanonicalContent,
  scoreSeedProfile,
} from "./scoring-harness.mjs";

type SeedFixture = {
  profile_id: string;
  responses: Record<string, number>;
  expected?: { top_rays?: string[]; ray_pair?: string };
};

function rayNumber(rayId: string): number {
  return Number(String(rayId).replace(/^R/i, ""));
}

function normalizePair(topRays: string[]): string {
  const ordered = topRays
    .slice(0, 2)
    .sort((a, b) => rayNumber(a) - rayNumber(b));
  return `${ordered[0]}-${ordered[1]}`;
}

function toBand(score: number): "HIGH" | "MEDIUM" | "LOW" {
  if (score >= 75) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function createRayItem(params: {
  itemId: string;
  rayId: string;
  rayName: string;
  subfacetCode: string;
  polarity: "Normal" | "Reverse";
  pressureMode: "Baseline" | "UnderPressure";
}): BaseItem {
  return {
    Item_ID: params.itemId,
    Domain: "Ray",
    Ray_Number: rayNumber(params.rayId),
    Ray_Name: params.rayName,
    Subfacet_Code: params.subfacetCode,
    Subfacet_Name: `Parity ${params.subfacetCode}`,
    Item_Type: "Behavior7d",
    Context: "Both",
    Polarity: params.polarity,
    Pressure_Mode: params.pressureMode,
    Eclipse_Sensitivity: "Medium",
    Executive_Tag_Link: null,
    Mechanism_Link: null,
    Coaching_Use: "TopTwoPower",
    Notes: "parity_synthetic",
    Item_Text: `Parity synthetic ${params.itemId}`,
    Response_Scale: "0-4",
    Time_Window: "Last 7 days",
    Response_Format: "Frequency_0_4",
    Friction_Rating: 1,
    Pressure_Distortion_Tag: "Parity",
    Time_Window_Source: "Item_Type",
  };
}

function buildSyntheticBanks(contentRoot: string): {
  banks: ItemBanks;
  responseBindings: Record<string, string>;
} {
  const { questions, rays } = loadCanonicalContent(contentRoot);
  const rayRecords = rays as Array<{ ray_id: string; name: string }>;
  const rayLookup = new Map<string, { ray_id: string; name: string }>(
    rayRecords.map((ray) => [ray.ray_id, ray]),
  );
  const archetypeBlocks = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "..", "data", "archetype_blocks.json"), "utf8"),
  ) as ArchetypeBlock[];

  const byRay = new Map<
    string,
    { normalQuestionId: string; reverseQuestionId: string }
  >();

  for (const question of questions) {
    const existing = byRay.get(question.ray_id) ?? {
      normalQuestionId: "",
      reverseQuestionId: "",
    };
    if (question.polarity === "normal") {
      existing.normalQuestionId = question.id;
    } else if (question.polarity === "reverse") {
      existing.reverseQuestionId = question.id;
    }
    byRay.set(question.ray_id, existing);
  }

  const responseBindings: Record<string, string> = {};
  const rayItems: BaseItem[] = [];
  const letters = ["a", "b", "c", "d"];

  for (const [rayId, binding] of byRay.entries()) {
    if (!binding.normalQuestionId || !binding.reverseQuestionId) {
      throw new Error(`Ray ${rayId} missing normal/reverse question binding.`);
    }
    const rayName = rayLookup.get(rayId)?.name ?? rayId;
    for (const letter of letters) {
      const subfacetCode = `${rayId}${letter}`;

      for (let i = 1; i <= 6; i += 1) {
        const itemId = `PARITY_${rayId}_${letter}_S${i}`;
        rayItems.push(
          createRayItem({
            itemId,
            rayId,
            rayName,
            subfacetCode,
            polarity: "Normal",
            pressureMode: "Baseline",
          }),
        );
        responseBindings[itemId] = binding.normalQuestionId;
      }

      for (let i = 1; i <= 2; i += 1) {
        const itemId = `PARITY_${rayId}_${letter}_A${i}`;
        rayItems.push(
          createRayItem({
            itemId,
            rayId,
            rayName,
            subfacetCode,
            polarity: "Normal",
            pressureMode: "UnderPressure",
          }),
        );
        responseBindings[itemId] = binding.normalQuestionId;
      }

      const eclipseId = `PARITY_${rayId}_${letter}_E1`;
      rayItems.push(
        createRayItem({
          itemId: eclipseId,
          rayId,
          rayName,
          subfacetCode,
          polarity: "Reverse",
          pressureMode: "UnderPressure",
        }),
      );
      responseBindings[eclipseId] = binding.reverseQuestionId;
    }
  }

  const banks: ItemBanks = {
    rayItems,
    toolItems: [],
    eclipseItems: [],
    validityItems: [],
    reflectionPrompts: [] as ReflectionPrompt[],
    execTagMap: [] as ExecTagMapRow[],
    archetypeBlocks,
  };

  return { banks, responseBindings };
}

function buildPacket(
  fixture: SeedFixture,
  responseBindings: Record<string, string>,
): ResponsePacket {
  const responses: Record<string, ItemResponse> = {};
  const now = Date.now();

  for (const [syntheticItemId, sourceQuestionId] of Object.entries(responseBindings)) {
    if (!(sourceQuestionId in fixture.responses)) {
      throw new Error(
        `[${fixture.profile_id}] missing source response for ${sourceQuestionId}.`,
      );
    }
    responses[syntheticItemId] = {
      item_id: syntheticItemId,
      value: fixture.responses[sourceQuestionId],
      timestamp: now,
    };
  }

  return {
    run_id: `PARITY_${fixture.profile_id}`,
    tier: "FULL_143",
    start_ts: new Date(now - 600_000).toISOString(),
    end_ts: new Date(now).toISOString(),
    responses,
    reflection_responses: {},
  };
}

function run() {
  const appRoot = process.cwd();
  const contentRoot = path.join(appRoot, "src", "content");
  const fixturesPath = path.join(appRoot, "test_fixtures", "seed_profiles.json");
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8")) as SeedFixture[];

  const { questions, rays } = loadCanonicalContent(contentRoot);
  const { banks, responseBindings } = buildSyntheticBanks(contentRoot);

  const failures: string[] = [];
  let passed = 0;

  for (const fixture of fixtures) {
    try {
      const harness = scoreSeedProfile({
        responses: fixture.responses,
        userState: "public",
        questions,
        rays,
      });

      const packet = buildPacket(fixture, responseBindings);
      const production = scoreAssessment(packet, banks);
      const productionTopRays = production.light_signature.top_two
        .slice(0, 2)
        .map((entry) => entry.ray_id);

      if (productionTopRays.length !== 2) {
        failures.push(`[${fixture.profile_id}] production top_two missing two rays.`);
        continue;
      }

      const harnessPair = normalizePair(harness.top_rays);
      const productionPair = normalizePair(productionTopRays);

      if (harness.top_rays.join("|") !== productionTopRays.join("|")) {
        failures.push(
          `[${fixture.profile_id}] top_rays mismatch harness=${harness.top_rays.join(",")} production=${productionTopRays.join(",")}`,
        );
        continue;
      }

      if (harnessPair !== productionPair) {
        failures.push(
          `[${fixture.profile_id}] ray_pair mismatch harness=${harnessPair} production=${productionPair}`,
        );
        continue;
      }

      const harnessScores = new Map<string, number>(
        harness.ray_scores.map(
          (entry: { ray_id: string; score: number }) =>
            [entry.ray_id, round2(entry.score * 25)] as [string, number],
        ),
      );

      let numericMismatch = false;
      for (const ray of rays as Array<{ ray_id: string }>) {
        const rayId = ray.ray_id;
        const hScore = harnessScores.get(rayId);
        const pScoreRaw = production.rays[rayId]?.score ?? null;
        if (hScore === undefined || pScoreRaw === null) {
          failures.push(
            `[${fixture.profile_id}] missing normalized score for ${rayId} (h=${String(
              hScore,
            )}, p=${String(pScoreRaw)}).`,
          );
          numericMismatch = true;
          break;
        }
        const pScore = round2(pScoreRaw);
        if (Math.abs(hScore - pScore) > 0.01) {
          failures.push(
            `[${fixture.profile_id}] normalized score mismatch ${rayId}: harness=${hScore} production=${pScore}`,
          );
          numericMismatch = true;
          break;
        }
      }
      if (numericMismatch) {
        continue;
      }

      const harnessTopScore = harnessScores.get(harness.top_rays[0]) ?? 0;
      const productionTopScore = round2(
        production.rays[productionTopRays[0]]?.score ?? 0,
      );
      const harnessBand = toBand(harnessTopScore);
      const productionBand = toBand(productionTopScore);

      if (harnessBand !== productionBand) {
        failures.push(
          `[${fixture.profile_id}] normalized band mismatch harness=${harnessBand} production=${productionBand}`,
        );
        continue;
      }

      passed += 1;
    } catch (error) {
      failures.push(
        `[${fixture.profile_id}] ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.log(
    "Production scoring function: scoreAssessment from src/lib/scoring/score-assessment.mjs",
  );

  if (failures.length > 0) {
    console.error("\nqa:parity FAILED");
    console.error(`Passed: ${passed}/${fixtures.length}`);
    console.error(`Failures: ${failures.length}`);
    for (const [index, failure] of failures.entries()) {
      console.error(`${index + 1}. ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nqa:parity PASS");
  console.log(`Passed: ${passed}/${fixtures.length}`);
  console.log("Compared: top_rays, ray_pair, normalized ray scores, normalized top-score band");
}

run();
