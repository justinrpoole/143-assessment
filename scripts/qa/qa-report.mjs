import fs from "node:fs";
import path from "node:path";

import {
  loadSeedFixtures,
  normalizeHtmlForComparison,
  renderFixtureReport,
  selectPairFixtures,
} from "./render-report.mjs";

const appRoot = process.cwd();
const goldensDir = path.join(appRoot, "test_fixtures", "goldens", "reports");
const questionsPath = path.join(appRoot, "src", "content", "questions.json");

const REQUIRED_SECTIONS = [
  "overview",
  "identity-opener",
  "micro-wins",
  "coaching-questions",
  "reps",
  "ras",
];

function assertNoUnresolvedVariables(html) {
  const unresolved = html.match(/\{\{\s*[^}]+\s*\}\}/g);
  return unresolved ? unresolved : [];
}

function checkRequiredSections(html) {
  const missing = [];
  for (const section of REQUIRED_SECTIONS) {
    if (!html.includes(`data-section="${section}"`)) {
      missing.push(section);
    }
  }
  return missing;
}

function decodeHtmlEntities(value) {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");
}

function extractMicroWinsItems(html) {
  const sectionMatch = html.match(
    /<section data-section="micro-wins">([\s\S]*?)<\/section>/,
  );
  if (!sectionMatch) {
    return [];
  }
  const listItems = [];
  const listRegex = /<li>([\s\S]*?)<\/li>/g;
  let match = listRegex.exec(sectionMatch[1]);
  while (match) {
    listItems.push(decodeHtmlEntities(match[1]).trim());
    match = listRegex.exec(sectionMatch[1]);
  }
  return listItems.filter(Boolean);
}

function findFirstDiff(a, b) {
  const limit = Math.min(a.length, b.length);
  for (let i = 0; i < limit; i += 1) {
    if (a[i] !== b[i]) {
      return {
        index: i,
        actual: a.slice(Math.max(0, i - 40), i + 80),
        expected: b.slice(Math.max(0, i - 40), i + 80),
      };
    }
  }
  if (a.length !== b.length) {
    return {
      index: limit,
      actual: a.slice(Math.max(0, limit - 40), limit + 80),
      expected: b.slice(Math.max(0, limit - 40), limit + 80),
    };
  }
  return null;
}

function fail(failures, passCount, total) {
  console.error("\nqa:report FAILED");
  console.error(`Reports passed: ${passCount}/${total}`);
  console.error(`Failures: ${failures.length}`);
  failures.forEach((failure, idx) => {
    console.error(`${idx + 1}. [${failure.pair_id}] ${failure.message}`);
  });
  process.exit(1);
}

function pass(passCount, total) {
  console.log("\nqa:report PASS");
  console.log(`Reports passed: ${passCount}/${total}`);
  console.log(`Required sections checked: ${REQUIRED_SECTIONS.length}`);
  console.log("Golden comparison mode: exact or normalized-whitespace match");
}

function parseArgs(argv) {
  return {
    updateGoldens: argv.includes("--update-goldens"),
  };
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const fixtures = loadSeedFixtures();
  const pairFixtures = selectPairFixtures(fixtures);
  const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));
  const questionPromptSet = new Set(
    (Array.isArray(questions) ? questions : [])
      .map((question) => String(question?.prompt ?? "").trim())
      .filter(Boolean),
  );
  const failures = [];
  let passCount = 0;
  let updatedGoldens = 0;

  if (!fs.existsSync(goldensDir)) {
    if (args.updateGoldens) {
      fs.mkdirSync(goldensDir, { recursive: true });
    } else {
      fail(
        [{ pair_id: "__goldens__", message: `Missing goldens directory: ${goldensDir}` }],
        0,
        pairFixtures.length,
      );
    }
  }

  if (pairFixtures.length !== 36) {
    failures.push({
      pair_id: "__fixtures__",
      message: `Expected 36 pair fixtures but found ${pairFixtures.length}.`,
    });
  }

  const goldenFiles = fs
    .readdirSync(goldensDir)
    .filter((file) => file.endsWith(".html"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (goldenFiles.length !== 36) {
    failures.push({
      pair_id: "__goldens__",
      message: `Expected 36 golden HTML files but found ${goldenFiles.length}.`,
    });
  }

  for (const fixture of pairFixtures) {
    const pairId = fixture.expected?.ray_pair;
    if (!pairId) {
      failures.push({
        pair_id: "__fixture__",
        message: `Fixture ${fixture.profile_id} missing expected.ray_pair.`,
      });
      continue;
    }

    const html = renderFixtureReport(fixture);
    const unresolved = assertNoUnresolvedVariables(html);
    if (unresolved.length > 0) {
      failures.push({
        pair_id: pairId,
        message: `Unresolved template variables: ${Array.from(new Set(unresolved)).join(", ")}`,
      });
      continue;
    }

    const missingSections = checkRequiredSections(html);
    if (missingSections.length > 0) {
      failures.push({
        pair_id: pairId,
        message: `Missing required sections: ${missingSections.join(", ")}`,
      });
      continue;
    }

    const microWinsItems = extractMicroWinsItems(html);
    const promptLeak = microWinsItems.find((item) => questionPromptSet.has(item));
    if (promptLeak) {
      failures.push({
        pair_id: pairId,
        message: `Micro-Wins must not be sourced from question prompts. Matched item: "${promptLeak}"`,
      });
      continue;
    }

    const goldenPath = path.join(goldensDir, `${pairId}.html`);
    if (args.updateGoldens) {
      const normalizedGolden = `${normalizeHtmlForComparison(html)}\n`;
      const previous = fs.existsSync(goldenPath)
        ? fs.readFileSync(goldenPath, "utf8")
        : "";
      if (previous !== normalizedGolden) {
        updatedGoldens += 1;
      }
      fs.writeFileSync(goldenPath, normalizedGolden, "utf8");
      passCount += 1;
      continue;
    }

    if (!fs.existsSync(goldenPath)) {
      failures.push({
        pair_id: pairId,
        message: `Missing golden file: ${path.relative(appRoot, goldenPath)}`,
      });
      continue;
    }

    const goldenHtml = fs.readFileSync(goldenPath, "utf8");
    const exactMatch = html === goldenHtml;
    const normalizedMatch =
      normalizeHtmlForComparison(html) === normalizeHtmlForComparison(goldenHtml);

    if (!exactMatch && !normalizedMatch) {
      const diff = findFirstDiff(
        normalizeHtmlForComparison(html),
        normalizeHtmlForComparison(goldenHtml),
      );
      failures.push({
        pair_id: pairId,
        message: diff
          ? `Golden diff at char ${diff.index}. actual="${diff.actual}" expected="${diff.expected}"`
          : "Golden mismatch with unknown diff boundary.",
      });
      continue;
    }

    passCount += 1;
  }

  if (failures.length > 0) {
    fail(failures, passCount, pairFixtures.length);
  }

  pass(passCount, pairFixtures.length);
  if (args.updateGoldens) {
    console.log(`Goldens updated: ${updatedGoldens}`);
  }
}

run();
