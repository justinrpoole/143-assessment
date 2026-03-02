import {
  PDFDocument,
  PageSizes,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";

import { supabaseRestFetch } from "@/lib/db/supabase-rest";

export interface GravitationalScores {
  intention: number;
  joy: number;
  presence: number;
  power: number;
  purpose: number;
  authenticity: number;
  connection: number;
  possibility: number;
  beTheLight: number;
}

export interface GravitationalAssessmentData {
  name: string;
  email: string;
  scores: GravitationalScores;
}

export interface RayDescriptor {
  key: keyof GravitationalScores;
  label: string;
  score: number;
  description: string;
  weeklyAction: string;
}

interface RunRow {
  id: string;
  completed_at: string | null;
}

interface ResultRow {
  ray_scores: Record<string, unknown> | null;
  results_payload: Record<string, unknown> | null;
}

interface UserRow {
  email: string;
}

const DEEP_PURPLE = rgb(6 / 255, 0, 20 / 255);
const MID_PURPLE = rgb(75 / 255, 34 / 255, 122 / 255);
const SOFT_PURPLE = rgb(227 / 255, 217 / 255, 238 / 255);
const GOLD = rgb(1, 200 / 255, 66 / 255);
const GOLD_SOFT = rgb(1, 240 / 255, 194 / 255);
const WHITE = rgb(1, 1, 1);
const BLACK = rgb(18 / 255, 14 / 255, 28 / 255);
const GRAY = rgb(112 / 255, 104 / 255, 129 / 255);

const RAY_CONTENT: ReadonlyArray<{
  key: keyof GravitationalScores;
  label: string;
  description: string;
  weeklyAction: string;
}> = [
  {
    key: "intention",
    label: "Intention",
    description:
      "Intention measures your ability to lead your day before your day leads you. High Intention means your priorities are visible, not implied. It keeps your leadership field directional under pressure.",
    weeklyAction: "Block 20 minutes each morning to define your top three non-negotiables.",
  },
  {
    key: "joy",
    label: "Joy",
    description:
      "Joy reflects your access to grounded energy, not performative positivity. A strong Joy Ray helps you stay emotionally resourced and contagious in hard seasons. It expands your team's willingness to stay engaged.",
    weeklyAction: "Schedule one restoring activity this week and protect it like a leadership commitment.",
  },
  {
    key: "presence",
    label: "Presence",
    description:
      "Presence tracks your capacity to stay fully here in real time. High Presence reduces noise, increases discernment, and raises relational trust. It is often the Ray that turns reactivity into choice.",
    weeklyAction: "Run every important conversation this week with no phone and one minute of breathing first.",
  },
  {
    key: "power",
    label: "Power",
    description:
      "Power measures your agency under tension. A strong Power Ray means you move decisions forward without waiting for perfect certainty. It protects momentum when stakes are high.",
    weeklyAction: "Identify one avoided decision and close it by Friday with a clear next step.",
  },
  {
    key: "purpose",
    label: "Purpose",
    description:
      "Purpose reflects alignment between what you say matters and how you actually move. High Purpose stabilizes your standards when demands compete. It keeps your leadership coherent over time.",
    weeklyAction: "Name one current task to delegate so your calendar better matches your core mission.",
  },
  {
    key: "authenticity",
    label: "Authenticity",
    description:
      "Authenticity tracks congruence between your private and public leadership. High Authenticity builds credibility because people feel the same person in every room. It turns integrity into culture.",
    weeklyAction: "Have one honest conversation where you name what is true and what support you need.",
  },
  {
    key: "connection",
    label: "Connection",
    description:
      "Connection measures your attunement to people and relational context. A strong Connection Ray helps you notice what is unsaid and respond with precision. It amplifies trust without overextending.",
    weeklyAction: "Reach out to one teammate with a direct check-in question and listen for what they are carrying.",
  },
  {
    key: "possibility",
    label: "Possibility",
    description:
      "Possibility reflects your openness to fresh options while staying grounded in reality. High Possibility supports adaptive thinking during uncertainty. It helps teams move from stuckness into design.",
    weeklyAction: "In your next planning session, require three options before selecting a path.",
  },
  {
    key: "beTheLight",
    label: "Be The Light",
    description:
      "Be The Light is your integrative Ray. It captures how consistently your values, energy, and leadership are felt by others. When this Ray is strong, your presence becomes a stabilizing force for the room.",
    weeklyAction: "Choose one meeting this week to model your highest standard in language, pacing, and follow-through.",
  },
];

const SCORE_ALIASES: Record<keyof GravitationalScores, string[]> = {
  intention: ["intention", "R1", "r1"],
  joy: ["joy", "R2", "r2"],
  presence: ["presence", "R3", "r3"],
  power: ["power", "R4", "r4"],
  purpose: ["purpose", "R5", "r5"],
  authenticity: ["authenticity", "R6", "r6"],
  connection: ["connection", "R7", "r7"],
  possibility: ["possibility", "R8", "r8"],
  beTheLight: ["beTheLight", "be_the_light", "be-the-light", "R9", "r9"],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function roundToTenth(value: number): number {
  return Math.round(value * 10) / 10;
}

function parseNumeric(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function deriveScale(values: number[]): number {
  const maxValue = values.reduce((max, current) => Math.max(max, current), 0);
  return maxValue > 10 ? 10 : 1;
}

function normalizeScores(input: unknown): GravitationalScores {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const collected: number[] = [];
  const sourceValues: Partial<Record<keyof GravitationalScores, number>> = {};

  for (const [key, aliases] of Object.entries(SCORE_ALIASES) as Array<
    [keyof GravitationalScores, string[]]
  >) {
    for (const alias of aliases) {
      const numeric = parseNumeric(raw[alias]);
      if (numeric != null) {
        sourceValues[key] = numeric;
        collected.push(numeric);
        break;
      }
    }
  }

  const scale = deriveScale(collected);

  const normalized = {
    intention: 0,
    joy: 0,
    presence: 0,
    power: 0,
    purpose: 0,
    authenticity: 0,
    connection: 0,
    possibility: 0,
    beTheLight: 0,
  } satisfies GravitationalScores;

  for (const key of Object.keys(normalized) as Array<keyof GravitationalScores>) {
    const value = sourceValues[key] ?? 0;
    normalized[key] = roundToTenth(clamp(value / scale, 0, 10));
  }

  return normalized;
}

function titleCase(input: string): string {
  return input
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(" ");
}

function inferNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "";
  const normalized = titleCase(local);
  return normalized.length > 0 ? normalized : "143 Leader";
}

function extractNameFromResultsPayload(
  payload: Record<string, unknown> | null,
): string | null {
  if (!payload) {
    return null;
  }

  const directCandidates = [
    payload.name,
    payload.user_name,
    payload.full_name,
  ];

  for (const candidate of directCandidates) {
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate.trim();
    }
  }

  const profile = payload.profile;
  if (profile && typeof profile === "object") {
    const profileName = (profile as Record<string, unknown>).name;
    if (typeof profileName === "string" && profileName.trim().length > 0) {
      return profileName.trim();
    }
  }

  return null;
}

export function createSampleAssessmentData(userId?: string): GravitationalAssessmentData {
  const email = userId
    ? `${userId}@preview.143leadership.com`
    : "preview@143leadership.com";

  return {
    name: "Preview Leader",
    email,
    scores: {
      intention: 8.6,
      joy: 7.8,
      presence: 8.2,
      power: 7.9,
      purpose: 8.4,
      authenticity: 7.1,
      connection: 7.5,
      possibility: 6.8,
      beTheLight: 8.8,
    },
  };
}

export function coerceAssessmentData(
  input: unknown,
  fallback?: GravitationalAssessmentData,
): GravitationalAssessmentData {
  const defaults = fallback ?? createSampleAssessmentData();

  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};

  const name =
    typeof raw.name === "string" && raw.name.trim().length > 0
      ? raw.name.trim()
      : defaults.name;

  const email =
    typeof raw.email === "string" && raw.email.trim().length > 0
      ? raw.email.trim()
      : defaults.email;

  const scores = normalizeScores(raw.scores);
  const allZero = Object.values(scores).every((score) => score === 0);

  return {
    name,
    email,
    scores: allZero ? defaults.scores : scores,
  };
}

export function getRays(data: GravitationalAssessmentData): RayDescriptor[] {
  return RAY_CONTENT.map((entry) => ({
    ...entry,
    score: data.scores[entry.key],
  }));
}

export function rankRaysDescending(data: GravitationalAssessmentData): RayDescriptor[] {
  return [...getRays(data)].sort((left, right) => right.score - left.score);
}

export function rankRaysAscending(data: GravitationalAssessmentData): RayDescriptor[] {
  return [...getRays(data)].sort((left, right) => left.score - right.score);
}

export function buildNextMoveActions(data: GravitationalAssessmentData): string[] {
  const strongest = rankRaysDescending(data)[0];
  const improving = rankRaysAscending(data)[0];
  const supporting = rankRaysAscending(data)[1];

  return [
    `Prioritize your ${improving.label} Ray (${improving.score.toFixed(1)}): ${improving.weeklyAction}`,
    `Pair ${strongest.label} with ${supporting.label}: use your strongest Ray to support one high-friction moment this week.`,
    "Set a 10-minute Friday reflection to review what shifted and lock your next leadership rep.",
  ];
}

export async function fetchGravitationalAssessmentData(
  userId: string,
): Promise<GravitationalAssessmentData | null> {
  const runRes = await supabaseRestFetch<RunRow[]>({
    restPath: "assessment_runs",
    query: {
      select: "id,completed_at",
      user_id: `eq.${userId}`,
      status: "eq.completed",
      order: "completed_at.desc",
      limit: 1,
    },
  });

  if (!runRes.ok) {
    throw new Error(runRes.error ?? "failed_to_fetch_completed_run");
  }

  const run = runRes.data?.[0];
  if (!run) {
    return null;
  }

  const [resultRes, userRes] = await Promise.all([
    supabaseRestFetch<ResultRow[]>({
      restPath: "assessment_results",
      query: {
        select: "ray_scores,results_payload",
        user_id: `eq.${userId}`,
        run_id: `eq.${run.id}`,
        limit: 1,
      },
    }),
    supabaseRestFetch<UserRow[]>({
      restPath: "app_users",
      query: {
        select: "email",
        id: `eq.${userId}`,
        limit: 1,
      },
    }),
  ]);

  if (!resultRes.ok) {
    throw new Error(resultRes.error ?? "failed_to_fetch_assessment_result");
  }
  if (!userRes.ok) {
    throw new Error(userRes.error ?? "failed_to_fetch_user_profile");
  }

  const result = resultRes.data?.[0];
  if (!result?.ray_scores) {
    return null;
  }

  const email = userRes.data?.[0]?.email ?? `${userId}@143leadership.com`;
  const payloadName = extractNameFromResultsPayload(result.results_payload);

  const seededFallback = createSampleAssessmentData(userId);
  const hydrated = coerceAssessmentData(
    {
      name: payloadName ?? inferNameFromEmail(email),
      email,
      scores: result.ray_scores,
    },
    seededFallback,
  );

  return hydrated;
}

function textWidth(font: PDFFont, text: string, size: number): number {
  return font.widthOfTextAtSize(text, size);
}

function drawCenteredText(params: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  size: number;
  y: number;
  color: ReturnType<typeof rgb>;
}) {
  const { page, font, text, size, y, color } = params;
  const width = page.getWidth();
  const x = (width - textWidth(font, text, size)) / 2;
  page.drawText(text, { x, y, size, font, color });
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current.length > 0 ? `${current} ${word}` : word;
    if (textWidth(font, next, size) <= maxWidth) {
      current = next;
      continue;
    }

    if (current.length > 0) {
      lines.push(current);
    }
    current = word;
  }

  if (current.length > 0) {
    lines.push(current);
  }

  return lines;
}

function drawWrappedText(params: {
  page: PDFPage;
  font: PDFFont;
  text: string;
  x: number;
  y: number;
  maxWidth: number;
  size: number;
  lineHeight: number;
  color: ReturnType<typeof rgb>;
}): number {
  const lines = wrapText(params.text, params.font, params.size, params.maxWidth);
  let cursor = params.y;

  for (const line of lines) {
    params.page.drawText(line, {
      x: params.x,
      y: cursor,
      size: params.size,
      font: params.font,
      color: params.color,
    });
    cursor -= params.lineHeight;
  }

  return cursor;
}

function drawPageHeader(params: {
  page: PDFPage;
  title: string;
  subtitle?: string;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, title, subtitle, headingFont, bodyFont } = params;
  const width = page.getWidth();
  const height = page.getHeight();

  page.drawRectangle({
    x: 0,
    y: height - 90,
    width,
    height: 90,
    color: DEEP_PURPLE,
  });

  page.drawText("143 LEADERSHIP", {
    x: 42,
    y: height - 42,
    size: 12,
    font: headingFont,
    color: GOLD,
  });

  page.drawText(title, {
    x: 42,
    y: height - 66,
    size: 24,
    font: headingFont,
    color: GOLD,
  });

  if (subtitle) {
    page.drawText(subtitle, {
      x: 42,
      y: height - 84,
      size: 11,
      font: bodyFont,
      color: WHITE,
    });
  }
}

function drawCoverPage(params: {
  page: PDFPage;
  data: GravitationalAssessmentData;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, data, headingFont, bodyFont } = params;
  const width = page.getWidth();
  const height = page.getHeight();

  page.drawRectangle({ x: 0, y: 0, width, height, color: DEEP_PURPLE });

  page.drawText("143 LEADERSHIP", {
    x: 42,
    y: height - 70,
    size: 14,
    font: headingFont,
    color: GOLD,
  });

  drawCenteredText({
    page,
    font: headingFont,
    text: "GRAVITATIONAL STABILITY REPORT",
    size: 33,
    y: height - 320,
    color: WHITE,
  });

  drawCenteredText({
    page,
    font: bodyFont,
    text: "Be The Light Assessment",
    size: 22,
    y: height - 360,
    color: GOLD,
  });

  drawCenteredText({
    page,
    font: headingFont,
    text: data.name,
    size: 28,
    y: height - 460,
    color: WHITE,
  });

  const generatedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  drawCenteredText({
    page,
    font: bodyFont,
    text: `Generated ${generatedDate}`,
    size: 13,
    y: height - 490,
    color: SOFT_PURPLE,
  });
}

function drawOverviewPage(params: {
  page: PDFPage;
  data: GravitationalAssessmentData;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, data, headingFont, bodyFont } = params;
  const height = page.getHeight();

  drawPageHeader({
    page,
    title: "YOUR 9 RAYS",
    subtitle: "Current leadership access profile",
    headingFont,
    bodyFont,
  });

  const rays = getRays(data);
  const topThree = new Set(
    rankRaysDescending(data)
      .slice(0, 3)
      .map((ray) => ray.key),
  );

  const labelX = 42;
  const barX = 260;
  const barWidth = 292;
  const barHeight = 16;
  const startY = height - 140;
  const rowGap = 58;

  rays.forEach((ray, index) => {
    const rowY = startY - index * rowGap;

    page.drawText(`${ray.label} — ${ray.score.toFixed(1)}`, {
      x: labelX,
      y: rowY,
      size: 14,
      font: bodyFont,
      color: BLACK,
    });

    page.drawRectangle({
      x: barX,
      y: rowY - 2,
      width: barWidth,
      height: barHeight,
      color: SOFT_PURPLE,
      borderWidth: 0.5,
      borderColor: rgb(201 / 255, 192 / 255, 217 / 255),
    });

    page.drawRectangle({
      x: barX,
      y: rowY - 2,
      width: (ray.score / 10) * barWidth,
      height: barHeight,
      color: topThree.has(ray.key) ? GOLD : MID_PURPLE,
    });
  });

  const dominant = rankRaysDescending(data)[0];
  page.drawText(`Your dominant Ray: ${dominant.label}`, {
    x: 42,
    y: 70,
    size: 16,
    font: headingFont,
    color: DEEP_PURPLE,
  });
}

function drawStrengthsPage(params: {
  page: PDFPage;
  data: GravitationalAssessmentData;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, data, headingFont, bodyFont } = params;
  const width = page.getWidth();
  const topTwo = rankRaysDescending(data).slice(0, 2);

  drawPageHeader({
    page,
    title: "YOUR STRENGTHS",
    subtitle: "Top two Rays with direct coaching actions",
    headingFont,
    bodyFont,
  });

  let cursor = page.getHeight() - 145;

  topTwo.forEach((ray) => {
    page.drawRectangle({
      x: 36,
      y: cursor - 174,
      width: width - 72,
      height: 162,
      color: rgb(248 / 255, 246 / 255, 252 / 255),
      borderColor: rgb(224 / 255, 214 / 255, 238 / 255),
      borderWidth: 1,
    });

    page.drawText(ray.label, {
      x: 52,
      y: cursor - 38,
      size: 20,
      font: headingFont,
      color: DEEP_PURPLE,
    });

    let textCursor = drawWrappedText({
      page,
      font: bodyFont,
      text: ray.description,
      x: 52,
      y: cursor - 66,
      maxWidth: width - 104,
      size: 12,
      lineHeight: 17,
      color: BLACK,
    });

    textCursor -= 6;
    textCursor = drawWrappedText({
      page,
      font: headingFont,
      text: `This week: ${ray.weeklyAction}`,
      x: 52,
      y: textCursor,
      maxWidth: width - 104,
      size: 12,
      lineHeight: 16,
      color: MID_PURPLE,
    });

    cursor = textCursor - 42;
  });
}

function drawGrowthEdgePage(params: {
  page: PDFPage;
  data: GravitationalAssessmentData;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, data, headingFont, bodyFont } = params;
  const width = page.getWidth();
  const bottomTwo = rankRaysAscending(data).slice(0, 2);

  drawPageHeader({
    page,
    title: "YOUR GROWTH EDGE",
    subtitle: "Where your light is expanding",
    headingFont,
    bodyFont,
  });

  let cursor = page.getHeight() - 150;

  bottomTwo.forEach((ray) => {
    page.drawRectangle({
      x: 36,
      y: cursor - 184,
      width: width - 72,
      height: 170,
      color: rgb(250 / 255, 247 / 255, 241 / 255),
      borderColor: GOLD_SOFT,
      borderWidth: 1,
    });

    page.drawText(ray.label, {
      x: 52,
      y: cursor - 42,
      size: 20,
      font: headingFont,
      color: DEEP_PURPLE,
    });

    const reframe = `Your ${ray.label} Ray is not a flaw to fix. It is an active growth zone where your leadership range is widening.`;

    let textCursor = drawWrappedText({
      page,
      font: bodyFont,
      text: reframe,
      x: 52,
      y: cursor - 70,
      maxWidth: width - 104,
      size: 12,
      lineHeight: 17,
      color: BLACK,
    });

    textCursor -= 6;
    textCursor = drawWrappedText({
      page,
      font: bodyFont,
      text: ray.description,
      x: 52,
      y: textCursor,
      maxWidth: width - 104,
      size: 12,
      lineHeight: 17,
      color: GRAY,
    });

    textCursor -= 4;
    textCursor = drawWrappedText({
      page,
      font: headingFont,
      text: `This week: ${ray.weeklyAction}`,
      x: 52,
      y: textCursor,
      maxWidth: width - 104,
      size: 12,
      lineHeight: 16,
      color: MID_PURPLE,
    });

    cursor = textCursor - 40;
  });
}

function drawNextStepsPage(params: {
  page: PDFPage;
  data: GravitationalAssessmentData;
  headingFont: PDFFont;
  bodyFont: PDFFont;
}) {
  const { page, data, headingFont, bodyFont } = params;
  const width = page.getWidth();

  drawPageHeader({
    page,
    title: "NEXT STEPS",
    subtitle: "Translate this report into weekly leadership reps",
    headingFont,
    bodyFont,
  });

  page.drawText("Your next move:", {
    x: 42,
    y: page.getHeight() - 150,
    size: 24,
    font: headingFont,
    color: DEEP_PURPLE,
  });

  const actions = buildNextMoveActions(data);
  let cursor = page.getHeight() - 195;

  for (const action of actions) {
    page.drawText("•", {
      x: 50,
      y: cursor,
      size: 16,
      font: headingFont,
      color: MID_PURPLE,
    });

    cursor = drawWrappedText({
      page,
      font: bodyFont,
      text: action,
      x: 70,
      y: cursor,
      maxWidth: width - 110,
      size: 13,
      lineHeight: 19,
      color: BLACK,
    });

    cursor -= 12;
  }

  page.drawRectangle({
    x: 42,
    y: 185,
    width: width - 84,
    height: 62,
    color: DEEP_PURPLE,
    borderColor: GOLD,
    borderWidth: 1,
  });

  drawCenteredText({
    page,
    font: headingFont,
    text: "Book your coaching session at 143leadership.com",
    size: 14,
    y: 220,
    color: GOLD,
  });

  drawCenteredText({
    page,
    font: bodyFont,
    text: "Be the light. Always be the light. — Justin Ray",
    size: 13,
    y: 115,
    color: DEEP_PURPLE,
  });

  drawCenteredText({
    page,
    font: bodyFont,
    text: `${data.name} • ${data.email}`,
    size: 10,
    y: 70,
    color: GRAY,
  });
}

export async function generateGravitationalStabilityPdf(
  data: GravitationalAssessmentData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const headingFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  const cover = pdf.addPage(PageSizes.A4);
  drawCoverPage({ page: cover, data, headingFont, bodyFont });

  const overview = pdf.addPage(PageSizes.A4);
  drawOverviewPage({ page: overview, data, headingFont, bodyFont });

  const strengths = pdf.addPage(PageSizes.A4);
  drawStrengthsPage({ page: strengths, data, headingFont, bodyFont });

  const growth = pdf.addPage(PageSizes.A4);
  drawGrowthEdgePage({ page: growth, data, headingFont, bodyFont });

  const nextSteps = pdf.addPage(PageSizes.A4);
  drawNextStepsPage({ page: nextSteps, data, headingFont, bodyFont });

  return pdf.save();
}
