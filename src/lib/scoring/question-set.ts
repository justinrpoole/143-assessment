import questions from "@/content/questions.json";

export type AssessmentQuestionSet = "full_143" | "monthly_43";

export interface QuestionDefinition {
  id: string;
  ray_id: string;
  polarity: "normal" | "reverse";
  scale: { min: number; max: number };
  required: boolean;
  source: string;
  prompt: string;
}

export const FULL_ASSESSMENT_QUESTION_COUNT = 143;
export const MONTHLY_RETAKE_QUESTION_COUNT = 43;

const FULL_QUESTION_SET = Object.freeze(
  [...(questions as QuestionDefinition[])].sort((left, right) =>
    left.id.localeCompare(right.id, undefined, { numeric: true }),
  ),
) as readonly QuestionDefinition[];

const MONTHLY_RETAKE_TARGETS: Record<string, number> = {
  R1: 5,
  R2: 5,
  R3: 5,
  R4: 5,
  R5: 5,
  R6: 5,
  R7: 5,
  R8: 4,
  R9: 4,
};

function pickSpread<T>(items: T[], count: number): T[] {
  if (count <= 0 || items.length === 0) {
    return [];
  }
  if (count >= items.length) {
    return [...items];
  }
  if (count === 1) {
    return [items[0]];
  }

  const picked: T[] = [];
  const lastIndex = items.length - 1;
  const step = lastIndex / (count - 1);
  for (let index = 0; index < count; index += 1) {
    picked.push(items[Math.round(index * step)]);
  }
  return picked;
}

function pickRetakeQuestionsForRay(rayQuestions: QuestionDefinition[], target: number) {
  const normal = rayQuestions.filter((question) => question.polarity === "normal");
  const reverse = rayQuestions.filter((question) => question.polarity === "reverse");

  const reverseTarget = target >= 5 ? 2 : 1;
  const normalTarget = Math.max(0, target - reverseTarget);

  const picks = [
    ...pickSpread(normal, normalTarget),
    ...pickSpread(reverse, reverseTarget),
  ];

  if (picks.length < target) {
    const pickedIds = new Set(picks.map((question) => question.id));
    const fill = rayQuestions.filter((question) => !pickedIds.has(question.id));
    for (const question of fill) {
      picks.push(question);
      if (picks.length === target) {
        break;
      }
    }
  }

  return picks
    .slice(0, target)
    .sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true }));
}

function buildMonthlyRetakeSet(allQuestions: readonly QuestionDefinition[]) {
  const byRay = new Map<string, QuestionDefinition[]>();

  for (const question of allQuestions) {
    if (!byRay.has(question.ray_id)) {
      byRay.set(question.ray_id, []);
    }
    byRay.get(question.ray_id)?.push(question);
  }

  const selected: QuestionDefinition[] = [];

  for (let ray = 1; ray <= 9; ray += 1) {
    const rayId = `R${ray}`;
    const rayQuestions = [...(byRay.get(rayId) ?? [])].sort((left, right) =>
      left.id.localeCompare(right.id, undefined, { numeric: true }),
    );
    const target = MONTHLY_RETAKE_TARGETS[rayId] ?? 0;
    const picks = pickRetakeQuestionsForRay(rayQuestions, target);

    if (picks.length !== target) {
      throw new Error(
        `Retake set selection failed for ${rayId}: expected ${target}, got ${picks.length}.`,
      );
    }

    selected.push(...picks);
  }

  const deduped = selected.filter((question, index, source) => {
    return source.findIndex((candidate) => candidate.id === question.id) === index;
  });

  if (deduped.length !== MONTHLY_RETAKE_QUESTION_COUNT) {
    throw new Error(
      `Retake set size mismatch: expected ${MONTHLY_RETAKE_QUESTION_COUNT}, got ${deduped.length}.`,
    );
  }

  return Object.freeze(
    deduped.sort((left, right) => left.id.localeCompare(right.id, undefined, { numeric: true })),
  ) as readonly QuestionDefinition[];
}

if (FULL_QUESTION_SET.length !== FULL_ASSESSMENT_QUESTION_COUNT) {
  throw new Error(
    `Full question set mismatch: expected ${FULL_ASSESSMENT_QUESTION_COUNT}, got ${FULL_QUESTION_SET.length}.`,
  );
}

const MONTHLY_RETAKE_SET = buildMonthlyRetakeSet(FULL_QUESTION_SET);

export function isMonthlyRetakeRun(runNumber: number): boolean {
  return Number.isFinite(runNumber) && runNumber > 1;
}

export function questionSetForRun(runNumber: number): AssessmentQuestionSet {
  return isMonthlyRetakeRun(runNumber) ? "monthly_43" : "full_143";
}

export function getQuestionsForRun(runNumber: number): QuestionDefinition[] {
  return questionSetForRun(runNumber) === "monthly_43"
    ? [...MONTHLY_RETAKE_SET]
    : [...FULL_QUESTION_SET];
}

export function getQuestionIdsForRun(runNumber: number): string[] {
  return getQuestionsForRun(runNumber).map((question) => question.id);
}

export function getQuestionMapForRun(runNumber: number): Map<string, QuestionDefinition> {
  return new Map(getQuestionsForRun(runNumber).map((question) => [question.id, question]));
}

export function getQuestionCountsForRun(runNumber: number) {
  return {
    full: FULL_ASSESSMENT_QUESTION_COUNT,
    run: getQuestionsForRun(runNumber).length,
    mode: questionSetForRun(runNumber),
  };
}
