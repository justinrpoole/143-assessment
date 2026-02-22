import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SCORER_VERSION = "1.0.0";

export const CANONICAL_STATES = [
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
];

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultContentRoot = path.resolve(moduleDir, "../../content");

let cachedContent = null;
let cachedRoot = "";

function rayNumber(rayId) {
  return Number(String(rayId).replace(/^R/i, ""));
}

function normalizeQuestionValue(rawValue, scale, questionId) {
  const value = Number(rawValue);
  if (!Number.isFinite(value)) {
    throw new Error(`Question ${questionId}: response is not numeric.`);
  }
  if (value < scale.min || value > scale.max) {
    throw new Error(
      `Question ${questionId}: response ${value} outside scale ${scale.min}-${scale.max}.`,
    );
  }
  return value;
}

function scoreQuestion(value, polarity, scale) {
  if (polarity === "reverse") {
    return scale.max + scale.min - value;
  }
  return value;
}

export function loadCanonicalContent(contentRoot = defaultContentRoot) {
  const normalizedRoot = path.resolve(contentRoot);
  if (cachedContent && cachedRoot === normalizedRoot) {
    return cachedContent;
  }

  const questions = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "questions.json"), "utf8"),
  );
  const rays = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "rays.json"), "utf8"),
  );
  const rayPairs = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "ray_pairs.json"), "utf8"),
  );

  cachedRoot = normalizedRoot;
  cachedContent = { questions, rays, rayPairs };
  return cachedContent;
}

function normalizeMetadata(metadata) {
  const userState = metadata?.user_state ?? metadata?.userState ?? "public";
  if (!CANONICAL_STATES.includes(userState)) {
    throw new Error(`Invalid user_state "${userState}".`);
  }
  return { user_state: userState };
}

/**
 * @param {{
 *   responses: Record<string, number>,
 *   questions: Array<{id: string, ray_id: string, required: boolean, scale: {min: number, max: number}, polarity: string}>,
 *   rays: Array<{ray_id: string}>,
 *   activeQuestionIds?: string[] | null,
 * }} params
 */
function buildRayScores({ responses, questions, rays, activeQuestionIds = null }) {
  const rayIds = new Set(rays.map((ray) => ray.ray_id));
  const totals = new Map();
  const counts = new Map();
  const activeSet = activeQuestionIds ? new Set(activeQuestionIds) : null;

  for (const question of questions) {
    if (activeSet && !activeSet.has(question.id)) {
      continue;
    }
    if (!rayIds.has(question.ray_id)) {
      throw new Error(
        `Question ${question.id}: unknown ray_id "${question.ray_id}".`,
      );
    }
    if (question.required && !(question.id in responses)) {
      throw new Error(`Missing required response for question ${question.id}.`);
    }
    if (!(question.id in responses)) {
      continue;
    }

    const scale = question.scale;
    if (
      !scale ||
      typeof scale.min !== "number" ||
      typeof scale.max !== "number" ||
      scale.max <= scale.min
    ) {
      throw new Error(`Question ${question.id}: invalid scale.`);
    }

    const normalized = normalizeQuestionValue(
      responses[question.id],
      scale,
      question.id,
    );
    const questionScore = scoreQuestion(normalized, question.polarity, scale);

    totals.set(question.ray_id, (totals.get(question.ray_id) ?? 0) + questionScore);
    counts.set(question.ray_id, (counts.get(question.ray_id) ?? 0) + 1);
  }

  const rayScores = rays.map((ray) => {
    const count = counts.get(ray.ray_id) ?? 0;
    const total = totals.get(ray.ray_id) ?? 0;
    const score = count > 0 ? total / count : Number.NEGATIVE_INFINITY;
    return { ray_id: ray.ray_id, score };
  });

  const ranked = rayScores.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    return rayNumber(a.ray_id) - rayNumber(b.ray_id);
  });

  return ranked;
}

function buildPairId(topRayA, topRayB) {
  return [topRayA, topRayB]
    .slice()
    .sort((a, b) => rayNumber(a) - rayNumber(b))
    .join("-");
}

/**
 * @param {{
 *   responses?: Record<string, number>,
 *   metadata?: Record<string, unknown>,
 *   questionIds?: string[] | null,
 * }} params
 */
export function scoreAssessment({ responses = {}, metadata = {}, questionIds = null }) {
  const { questions, rays, rayPairs } = loadCanonicalContent();
  const context = normalizeMetadata(metadata);
  const ranked = buildRayScores({
    responses,
    questions,
    rays,
    activeQuestionIds: questionIds,
  });

  const topRay1 = ranked[0]?.ray_id;
  const topRay2 = ranked[1]?.ray_id;

  if (!topRay1 || !topRay2) {
    throw new Error("Unable to compute top two rays from responses.");
  }

  const rayPairId = buildPairId(topRay1, topRay2);
  const hasPair = rayPairs.some((pair) => pair.pair_id === rayPairId);
  if (!hasPair) {
    throw new Error(`No ray pair content found for ${rayPairId}.`);
  }

  const rayScoresById = Object.fromEntries(
    ranked.map((entry) => [entry.ray_id, entry.score]),
  );

  return {
    user_state: context.user_state,
    ray_scores_by_id: rayScoresById,
    ray_scores: ranked,
    top_rays: [topRay1, topRay2],
    ray_pair_id: rayPairId,
    // Compatibility alias for existing QA/report tooling that still reads ray_pair.
    ray_pair: rayPairId,
  };
}
