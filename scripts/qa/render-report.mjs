import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import {
  loadCanonicalContent,
  scoreAssessment,
} from "../../src/lib/scoring/score-assessment.mjs";

/*
Micro-Wins Source Contract:
1) Use ray_pairs.json micro_wins for the resolved ray pair.
2) If pair micro_wins is empty, use rays.json micro_wins for top rays.
3) If both are empty, use a static fallback.
Never use questions.json prompts for Micro-Wins.
*/

const appRoot = process.cwd();
const contentRoot = path.join(appRoot, "src", "content");
const fixturesPath = path.join(appRoot, "test_fixtures", "seed_profiles.json");
const reportTemplatePath = path.join(
  contentRoot,
  "results_overview.json",
);

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function interpolateTemplate(text, variables) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (full, key) => {
    if (!(key in variables)) {
      return full;
    }
    return String(variables[key]);
  });
}

function normalizePairId(a, b) {
  const ordered = [a, b]
    .slice()
    .sort((left, right) => Number(left.replace("R", "")) - Number(right.replace("R", "")));
  return `${ordered[0]}-${ordered[1]}`;
}

function normalizeStringList(input) {
  if (!Array.isArray(input)) {
    return [];
  }
  return input
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function resolveMicroWins({ pair, raysById, topRays }) {
  // Locked rule: Micro-Wins come from ray_pairs/rays content only, never questions.
  const fromPair = normalizeStringList(pair?.micro_wins);
  if (fromPair.length > 0) {
    return fromPair;
  }

  const fromRays = topRays
    .flatMap((rayId) => normalizeStringList(raysById.get(rayId)?.micro_wins))
    .filter(Boolean);
  if (fromRays.length > 0) {
    return fromRays;
  }

  return ["Run one repeatable rep today."];
}

function resolveCoachingQuestions({ pair, raysById, topRays }) {
  const fromPair = normalizeStringList(pair?.coaching_questions);
  if (fromPair.length > 0) {
    return fromPair;
  }

  const fromRays = topRays
    .flatMap((rayId) => normalizeStringList(raysById.get(rayId)?.coaching_questions))
    .filter(Boolean);
  if (fromRays.length > 0) {
    return fromRays;
  }

  return [
    "What is the smallest rep that would make tomorrow easier?",
    "Where did I choose (or avoid) the honest boundary today?",
    "What did I reinforce that I want repeated: behavior, not vibe?",
  ];
}

export function loadSeedFixtures() {
  const fixtures = JSON.parse(fs.readFileSync(fixturesPath, "utf8"));
  if (!Array.isArray(fixtures)) {
    throw new Error("seed_profiles.json must contain an array.");
  }
  return fixtures;
}

export function selectPairFixtures(fixtures) {
  return fixtures
    .filter((fixture) => String(fixture.profile_id || "").startsWith("pair_"))
    .sort((a, b) =>
      String(a.expected?.ray_pair || "").localeCompare(
        String(b.expected?.ray_pair || ""),
        undefined,
        { numeric: true },
      ),
    );
}

function getTemplateMap() {
  const reportTemplate = JSON.parse(fs.readFileSync(reportTemplatePath, "utf8"));
  const templates = new Map();
  for (const entry of reportTemplate.templates || []) {
    if (entry?.id && entry?.text) {
      templates.set(entry.id, entry.text);
    }
  }
  return {
    allowedVariables: new Set(reportTemplate.allowed_variables || []),
    templates,
  };
}

function resolveFixtureByToken(fixtures, token) {
  if (!token) {
    return fixtures[0] ?? null;
  }
  return (
    fixtures.find((fixture) => fixture.profile_id === token) ||
    fixtures.find((fixture) => fixture.expected?.ray_pair === token) ||
    null
  );
}

export function renderFixtureReport(fixture) {
  const { rays, rayPairs } = loadCanonicalContent(contentRoot);
  const { templates } = getTemplateMap();
  const raysById = new Map((rays || []).map((ray) => [ray.ray_id, ray]));

  const result = scoreAssessment({
    responses: fixture.responses ?? {},
    metadata: { user_state: "public" },
  });

  const pairId = fixture.expected?.ray_pair || result.ray_pair_id;
  const pair = rayPairs.find((entry) => entry.pair_id === pairId);

  if (!pair) {
    throw new Error(`No ray pair content found for ${pairId}.`);
  }

  const topRay1 = result.top_rays[0];
  const topRay2 = result.top_rays[1];
  const normalizedPairId = normalizePairId(topRay1, topRay2);
  const confidenceBand = "STANDARD";
  const microWins = resolveMicroWins({
    pair,
    raysById,
    topRays: [topRay1, topRay2],
  });
  const nextRep = microWins[0] || "Run one repeatable rep today.";
  const coachingQuestions = resolveCoachingQuestions({
    pair,
    raysById,
    topRays: [topRay1, topRay2],
  });

  const templateVars = {
    first_name: "Leader",
    ray_pair: normalizedPairId,
    top_ray_1: topRay1,
    top_ray_2: topRay2,
    confidence_band: confidenceBand,
    next_rep: nextRep,
  };

  const identityOpener = interpolateTemplate(
    templates.get("identity_opener") || pair.identity_opener,
    templateVars,
  );
  const microWinsLead = interpolateTemplate(
    templates.get("micro_wins_block") || "Micro-win focus: {{next_rep}}.",
    templateVars,
  );
  const confidenceContext = interpolateTemplate(
    templates.get("confidence_context") ||
      "Current confidence band: {{confidence_band}}.",
    templateVars,
  );

  const raysSummary = result.ray_scores
    .filter((entry) => Number.isFinite(entry.score))
    .slice(0, 3)
    .map((entry) => `${entry.ray_id}: ${entry.score.toFixed(2)}`)
    .join(" | ");

  const microWinsItems = microWins
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");

  const coachingItems = coachingQuestions
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("\n");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>143 Leadership Report ${escapeHtml(normalizedPairId)}</title>
  </head>
  <body>
    <main data-ray-pair="${escapeHtml(normalizedPairId)}">
      <section data-section="overview">
        <h2>Overview</h2>
        <p>${escapeHtml(confidenceContext)}</p>
        <p>Top Rays: ${escapeHtml(topRay1)} + ${escapeHtml(topRay2)}</p>
        <p>Ray Score Snapshot: ${escapeHtml(raysSummary)}</p>
      </section>
      <section data-section="identity-opener">
        <h2>Identity Opener</h2>
        <p>${escapeHtml(identityOpener)}</p>
      </section>
      <section data-section="micro-wins">
        <h2>Micro-Wins</h2>
        <p>${escapeHtml(microWinsLead)}</p>
        <ul>
${microWinsItems}
        </ul>
      </section>
      <section data-section="coaching-questions">
        <h2>Coaching Questions</h2>
        <ol>
${coachingItems}
        </ol>
      </section>
      <section data-section="reps">
        <h2>REPs</h2>
        <p>Build the muscle with one repeatable rep daily. Consistency beats intensity.</p>
      </section>
      <section data-section="ras">
        <h2>RAS</h2>
        <p>Use RAS Reset to notice what is already working, then choose the next intentional action.</p>
      </section>
    </main>
  </body>
</html>
`;
}

export function normalizeHtmlForComparison(html) {
  return html
    .replace(/\r\n/g, "\n")
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

function parseArgs(argv) {
  const parsed = {
    fixture: "",
    output: "",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--fixture" && argv[i + 1]) {
      parsed.fixture = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--output" && argv[i + 1]) {
      parsed.output = argv[i + 1];
      i += 1;
      continue;
    }
  }

  return parsed;
}

function runCli() {
  const args = parseArgs(process.argv.slice(2));
  const fixtures = loadSeedFixtures();
  const fixture = resolveFixtureByToken(fixtures, args.fixture);

  if (!fixture) {
    console.error(`Fixture not found for token "${args.fixture}".`);
    process.exit(1);
  }

  const html = renderFixtureReport(fixture);

  if (args.output) {
    const outputPath = path.isAbsolute(args.output)
      ? args.output
      : path.join(appRoot, args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, html, "utf8");
  }

  process.stdout.write(html);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runCli();
}
