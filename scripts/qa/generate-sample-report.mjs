import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { renderReportHtml } from "../../src/lib/report/render-report-html.mjs";
import { renderReportPdf } from "../../src/lib/report/render-report-pdf.mjs";
import { scoreAssessment } from "../../src/lib/scoring/score-assessment.mjs";

const ROOT = process.cwd();
const FIXTURE_PATH = path.join(ROOT, "test_fixtures/seed_profiles.json");
const RAY_PAIRS_PATH = path.join(ROOT, "src/content/ray_pairs.json");

const REQUIRED_SECTION_IDS = [
  "overview",
  "identity-opener",
  "micro-wins",
  "coaching-questions",
  "reps",
  "ras",
];

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    fixture: null,
    pair: null,
  };

  for (let i = 0; i < args.length; i += 1) {
    const value = args[i];
    if (value === "--fixture") {
      result.fixture = args[i + 1] ?? null;
      i += 1;
    } else if (value === "--pair") {
      result.pair = args[i + 1] ?? null;
      i += 1;
    }
  }

  return result;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function buildPairPayload(pairId) {
  const pairs = readJson(RAY_PAIRS_PATH);
  if (!Array.isArray(pairs)) {
    throw new Error("ray_pairs.json is invalid");
  }

  const pair = pairs.find((entry) => entry?.pair_id === pairId);
  if (!pair) {
    throw new Error(`pair_not_found: ${pairId}`);
  }
  if (!Array.isArray(pair.rays) || pair.rays.length < 2) {
    throw new Error(`pair_missing_rays: ${pairId}`);
  }

  const topRayA = String(pair.rays[0]);
  const topRayB = String(pair.rays[1]);
  const rayScores = {};
  for (let i = 1; i <= 9; i += 1) {
    rayScores[`R${i}`] = 1;
  }
  rayScores[topRayA] = 4;
  rayScores[topRayB] = 4;

  return {
    source_type: "pair",
    source_id: pairId,
    results_payload: {
      user_state: "public",
      ray_scores_by_id: rayScores,
      top_rays: [topRayA, topRayB],
      ray_pair_id: pairId,
      ray_pair: pairId,
      confidence_band: "STANDARD",
    },
  };
}

function buildFixturePayload(fixtureId) {
  const fixtures = readJson(FIXTURE_PATH);
  if (!Array.isArray(fixtures)) {
    throw new Error("seed_profiles.json is invalid");
  }

  const fixture = fixtureId
    ? fixtures.find((entry) => entry?.profile_id === fixtureId)
    : fixtures[0];

  if (!fixture) {
    throw new Error(`fixture_not_found: ${fixtureId}`);
  }

  const scored = scoreAssessment({
    responses: fixture.responses ?? {},
    metadata: { user_state: "public" },
  });

  return {
    source_type: "fixture",
    source_id: fixture.profile_id,
    results_payload: {
      ...scored,
      confidence_band: "STANDARD",
    },
  };
}

function assertRenderedHtml(html) {
  const unresolved = html.match(/\{\{\s*[^}]+\s*\}\}/g) ?? [];
  if (unresolved.length > 0) {
    throw new Error(`unresolved_variables: ${unresolved.join(", ")}`);
  }

  const missingSections = REQUIRED_SECTION_IDS.filter(
    (sectionId) => !html.includes(`data-section=\"${sectionId}\"`),
  );
  if (missingSections.length > 0) {
    throw new Error(`missing_sections: ${missingSections.join(", ")}`);
  }
}

async function main() {
  const args = parseArgs();

  const selected = args.pair
    ? buildPairPayload(args.pair)
    : buildFixturePayload(args.fixture);

  const html = renderReportHtml({
    resultsPayload: selected.results_payload,
    firstName: "Leader",
  });

  assertRenderedHtml(html);

  let pdfBytes;
  try {
    pdfBytes = await renderReportPdf({ html });
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`pdf_generation_failed: ${reason}`);
  }

  const outDir = path.join(ROOT, "out");
  fs.mkdirSync(outDir, { recursive: true });

  const htmlPath = path.join(outDir, "sample-report.html");
  const pdfPath = path.join(outDir, "sample-report.pdf");
  const jsonPath = path.join(outDir, "sample-results.json");

  fs.writeFileSync(htmlPath, html, "utf8");
  fs.writeFileSync(pdfPath, pdfBytes);

  const resultsJson = {
    source_type: selected.source_type,
    source_id: selected.source_id,
    top_rays: selected.results_payload.top_rays,
    ray_pair_id: selected.results_payload.ray_pair_id,
    confidence_band: selected.results_payload.confidence_band,
    required_sections: REQUIRED_SECTION_IDS,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(resultsJson, null, 2), "utf8");

  const stats = {
    html_bytes: fs.statSync(htmlPath).size,
    pdf_bytes: fs.statSync(pdfPath).size,
    json_bytes: fs.statSync(jsonPath).size,
  };

  if (stats.html_bytes === 0 || stats.pdf_bytes === 0 || stats.json_bytes === 0) {
    throw new Error("empty_output_file_detected");
  }

  console.log("qa:sample-report generator PASS");
  console.log(`source_type: ${selected.source_type}`);
  console.log(`source_id: ${selected.source_id}`);
  console.log(`out_html: ${htmlPath}`);
  console.log(`out_pdf: ${pdfPath}`);
  console.log(`out_json: ${jsonPath}`);
  console.log(`top_rays: ${(selected.results_payload.top_rays ?? []).join(",")}`);
  console.log(`ray_pair_id: ${selected.results_payload.ray_pair_id}`);
}

main().catch((error) => {
  console.error("qa:sample-report generator FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
