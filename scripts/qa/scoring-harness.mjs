import fs from "node:fs";
import path from "node:path";

export const CANONICAL_STATES = [
  "public",
  "free_email",
  "paid_43",
  "sub_active",
  "sub_canceled",
  "past_due",
];

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

export function loadCanonicalContent(contentRoot) {
  const questions = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "questions.json"), "utf8"),
  );
  const rays = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "rays.json"), "utf8"),
  );
  const rayPairs = JSON.parse(
    fs.readFileSync(path.join(contentRoot, "ray_pairs.json"), "utf8"),
  );
  return { questions, rays, rayPairs };
}

export function scoreSeedProfile({
  responses,
  userState = "public",
  questions,
  rays,
}) {
  if (!CANONICAL_STATES.includes(userState)) {
    throw new Error(`Invalid user_state "${userState}" in scoring harness.`);
  }

  const rayIds = new Set(rays.map((ray) => ray.ray_id));
  const totals = new Map();
  const counts = new Map();

  for (const question of questions) {
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

  const topRay1 = ranked[0]?.ray_id;
  const topRay2 = ranked[1]?.ray_id;

  if (!topRay1 || !topRay2) {
    throw new Error("Unable to compute top two rays from responses.");
  }

  const pair = [topRay1, topRay2]
    .slice()
    .sort((a, b) => rayNumber(a) - rayNumber(b))
    .join("-");

  // TODO: Replace this QA harness with the full scoring pipeline once
  // full run persistence and deterministic fixture replay are wired.
  return {
    top_rays: [topRay1, topRay2],
    ray_pair: pair,
    ray_scores: ranked,
  };
}
