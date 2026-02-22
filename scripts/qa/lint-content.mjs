import fs from "node:fs";
import path from "node:path";

const appRoot = process.cwd();
const repoRoot = path.resolve(appRoot, "..");
const contentRoot = path.join(appRoot, "src", "content");
const resultsOverviewTemplatePath = path.join(contentRoot, "results_overview.json");
const legacyTemplatePath = path.join(
  contentRoot,
  "report_templates",
  "results_overview.json",
);

const REQUIRED_REPORT_BLOCKS = [
  "identity_opener",
  "micro_wins",
  "coaching_questions",
];

const BASE_BANNED_TERMS = ["behind", "sleep debt", "take a breath"];

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function normalizeTerm(term) {
  return String(term).trim().toLowerCase();
}

function collectSpecBannedTerms() {
  const terms = new Set(BASE_BANNED_TERMS.map(normalizeTerm));

  const specIntegrationPath = path.join(appRoot, "src", "lib", "spec-integration.ts");
  if (fs.existsSync(specIntegrationPath)) {
    const content = fs.readFileSync(specIntegrationPath, "utf8");
    const seedMatch = content.match(/const seed = \[([^\]]+)\]/s);
    if (seedMatch) {
      const foundTerms = seedMatch[1]
        .split(",")
        .map((token) => token.replace(/['"`]/g, "").trim())
        .filter(Boolean);
      for (const term of foundTerms) {
        terms.add(normalizeTerm(term));
      }
    }
  }

  const qaSpecPath = path.join(
    repoRoot,
    "specs",
    "143leadership_build_spec_v1_2",
    "08_QA_AND_DRIFT_CONTROL_SYSTEM.md",
  );

  if (fs.existsSync(qaSpecPath)) {
    const qaSpec = fs.readFileSync(qaSpecPath, "utf8");
    const candidates = [
      "weakness",
      "broken",
      "toxic",
      "personality",
      "diagnostic",
      "shame",
      "behind",
      "sleep debt",
      "take a breath",
    ];
    for (const term of candidates) {
      if (qaSpec.toLowerCase().includes(term.toLowerCase())) {
        terms.add(normalizeTerm(term));
      }
    }
  }

  return Array.from(terms);
}

function collectStrings(value, trail = "$") {
  const out = [];
  if (typeof value === "string") {
    out.push({ trail, value });
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item, idx) => {
      out.push(...collectStrings(item, `${trail}[${idx}]`));
    });
    return out;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      out.push(...collectStrings(child, `${trail}.${key}`));
    }
  }
  return out;
}

function extractTemplateVariables(text) {
  const vars = [];
  const regex = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
  let match = regex.exec(text);
  while (match) {
    vars.push(match[1]);
    match = regex.exec(text);
  }
  return vars;
}

function fail(errors) {
  console.error("\nqa:content FAILED\n");
  errors.forEach((err, index) => {
    console.error(`${index + 1}. ${err}`);
  });
  console.error(`\nTotal errors: ${errors.length}`);
  process.exit(1);
}

function pass(summary) {
  console.log("\nqa:content PASS");
  console.log(`Questions: ${summary.questions}`);
  console.log(`Rays: ${summary.rays}`);
  console.log(`Ray pairs: ${summary.rayPairs}`);
  console.log(`Report templates: ${summary.templates}`);
  console.log(`Banned terms checked: ${summary.bannedTerms}`);
}

const errors = [];

if (!fs.existsSync(contentRoot)) {
  fail([`Missing canonical content directory: ${contentRoot}`]);
}

const questionsPath = path.join(contentRoot, "questions.json");
const raysPath = path.join(contentRoot, "rays.json");
const rayPairsPath = path.join(contentRoot, "ray_pairs.json");

for (const filePath of [questionsPath, raysPath, rayPairsPath]) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing required content file: ${path.relative(appRoot, filePath)}`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

const questions = loadJson(questionsPath);
const rays = loadJson(raysPath);
const rayPairs = loadJson(rayPairsPath);
const templates = [];
if (fs.existsSync(resultsOverviewTemplatePath)) {
  templates.push({
    filePath: resultsOverviewTemplatePath,
    body: loadJson(resultsOverviewTemplatePath),
  });
}

if (!Array.isArray(questions) || questions.length === 0) {
  errors.push("questions.json must be a non-empty array.");
}
if (!Array.isArray(rays) || rays.length === 0) {
  errors.push("rays.json must be a non-empty array.");
}
if (!Array.isArray(rayPairs) || rayPairs.length === 0) {
  errors.push("ray_pairs.json must be a non-empty array.");
}
if (templates.length === 0) {
  errors.push("results_overview.json must exist and define report templates.");
}
if (fs.existsSync(legacyTemplatePath)) {
  errors.push(
    `Duplicate template source detected at ${path.relative(appRoot, legacyTemplatePath)}. Use src/content/results_overview.json only.`,
  );
}

const rayIdSet = new Set();
const questionIdSet = new Set();
const pairIdSet = new Set();

if (Array.isArray(rays)) {
  for (const [index, ray] of rays.entries()) {
    const prefix = `rays[${index}]`;
    if (!ray.ray_id || typeof ray.ray_id !== "string") {
      errors.push(`${prefix}.ray_id is required.`);
      continue;
    }
    if (rayIdSet.has(ray.ray_id)) {
      errors.push(`${prefix}.ray_id "${ray.ray_id}" is duplicated.`);
    }
    rayIdSet.add(ray.ray_id);

    if (!ray.definition || typeof ray.definition !== "string") {
      errors.push(`${prefix}.definition is required.`);
    }

    if (!Array.isArray(ray.required_report_blocks)) {
      errors.push(`${prefix}.required_report_blocks must be an array.`);
      continue;
    }
    for (const block of REQUIRED_REPORT_BLOCKS) {
      if (!ray.required_report_blocks.includes(block)) {
        errors.push(`${prefix} missing required_report_blocks entry "${block}".`);
      }
    }
  }
}

if (Array.isArray(questions)) {
  for (const [index, question] of questions.entries()) {
    const prefix = `questions[${index}]`;
    if (!question.id || typeof question.id !== "string") {
      errors.push(`${prefix}.id is required.`);
      continue;
    }
    if (questionIdSet.has(question.id)) {
      errors.push(`${prefix}.id "${question.id}" is duplicated.`);
    }
    questionIdSet.add(question.id);

    if (!question.ray_id || !rayIdSet.has(question.ray_id)) {
      errors.push(`${prefix}.ray_id "${question.ray_id}" is missing or not declared in rays.json.`);
    }

    const polarity = String(question.polarity || "").toLowerCase();
    if (!["normal", "reverse"].includes(polarity)) {
      errors.push(`${prefix}.polarity must be "normal" or "reverse".`);
    }

    if (!question.scale || typeof question.scale !== "object") {
      errors.push(`${prefix}.scale must be an object with min/max.`);
    } else {
      const { min, max } = question.scale;
      if (typeof min !== "number" || typeof max !== "number" || max <= min) {
        errors.push(`${prefix}.scale is invalid; expected numeric min/max with max > min.`);
      }
    }

    if (typeof question.required !== "boolean") {
      errors.push(`${prefix}.required must be boolean.`);
    }
  }
}

if (Array.isArray(rayPairs)) {
  for (const [index, pair] of rayPairs.entries()) {
    const prefix = `ray_pairs[${index}]`;
    if (!pair.pair_id || typeof pair.pair_id !== "string") {
      errors.push(`${prefix}.pair_id is required.`);
      continue;
    }
    if (pairIdSet.has(pair.pair_id)) {
      errors.push(`${prefix}.pair_id "${pair.pair_id}" is duplicated.`);
    }
    pairIdSet.add(pair.pair_id);

    if (!Array.isArray(pair.rays) || pair.rays.length !== 2) {
      errors.push(`${prefix}.rays must contain exactly 2 ray IDs.`);
    } else {
      for (const rayId of pair.rays) {
        if (!rayIdSet.has(rayId)) {
          errors.push(`${prefix}.rays contains unknown ray "${rayId}".`);
        }
      }
    }

    if (!pair.identity_opener || typeof pair.identity_opener !== "string") {
      errors.push(`${prefix}.identity_opener is required.`);
    }
    if (!Array.isArray(pair.micro_wins) || pair.micro_wins.length === 0) {
      errors.push(`${prefix}.micro_wins must be a non-empty array.`);
    }
    if (
      !Array.isArray(pair.coaching_questions) ||
      pair.coaching_questions.length === 0
    ) {
      errors.push(`${prefix}.coaching_questions must be a non-empty array.`);
    }
  }
}

for (const template of templates) {
  const rel = path.relative(appRoot, template.filePath);
  const { body } = template;
  if (!Array.isArray(body.allowed_variables) || body.allowed_variables.length === 0) {
    errors.push(`${rel}: allowed_variables must be a non-empty array.`);
    continue;
  }
  const allowed = new Set(body.allowed_variables.map(String));
  if (!Array.isArray(body.templates) || body.templates.length === 0) {
    errors.push(`${rel}: templates must be a non-empty array.`);
    continue;
  }
  for (const [index, tpl] of body.templates.entries()) {
    const prefix = `${rel} templates[${index}]`;
    if (!tpl.id || typeof tpl.id !== "string") {
      errors.push(`${prefix}.id is required.`);
    }
    if (!tpl.text || typeof tpl.text !== "string") {
      errors.push(`${prefix}.text is required.`);
      continue;
    }
    const vars = extractTemplateVariables(tpl.text);
    for (const variable of vars) {
      if (!allowed.has(variable)) {
        errors.push(`${prefix} uses disallowed variable "{{${variable}}}".`);
      }
    }
  }
}

const bannedTerms = collectSpecBannedTerms();
const allContent = [
  { source: path.relative(appRoot, questionsPath), body: questions },
  { source: path.relative(appRoot, raysPath), body: rays },
  { source: path.relative(appRoot, rayPairsPath), body: rayPairs },
  ...templates.map((entry) => ({
    source: path.relative(appRoot, entry.filePath),
    body: entry.body,
  })),
];

for (const entry of allContent) {
  const strings = collectStrings(entry.body);
  for (const str of strings) {
    const low = str.value.toLowerCase();
    for (const term of bannedTerms) {
      if (low.includes(term)) {
        errors.push(
          `${entry.source} ${str.trail} contains banned term "${term}".`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  fail(errors);
}

pass({
  questions: questions.length,
  rays: rays.length,
  rayPairs: rayPairs.length,
  templates: templates.length,
  bannedTerms: bannedTerms.length,
});
