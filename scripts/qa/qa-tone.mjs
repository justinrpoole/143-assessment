import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const MARKETING_PAGE_FILES = [
  "src/app/upgrade-your-os/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/outcomes/page.tsx",
  "src/app/justin/page.tsx",
  "src/app/preview/page.tsx",
  "src/app/sample-report/page.tsx",
  "src/app/framework/page.tsx",
  "src/app/143-challenge/page.tsx",
  "src/app/organizations/page.tsx",
  "src/app/about/page.tsx",
  "src/app/resources/page.tsx",
  "src/app/assessment/page.tsx",
];

const COPY_SOURCE_FILES = [
  "src/content/page_copy.v1.ts",
  "src/content/marketing_copy_bible.v1.ts",
  "src/content/questions.json",
  "src/content/rays.json",
  "src/content/ray_pairs.json",
  "src/content/results_overview.json",
];

const BANNED_PHRASES = [
  "behind",
  "sleep debt",
  "take a breath",
  "synergy",
  "leverage",
  "world-class",
  "game-changer",
  "cutting-edge",
  "next-level",
  "crush it",
  "kill it",
  "alpha",
  "man up",
  "hustle",
  "grind",
  "broken",
  "guru",
  "bandwidth",
  "deep dive",
  "circle back",
  "unpack",
];

const GLOSSARY_VIOLATION_PATTERNS = [
  /\bclient\b/i,
  /\bcoachee\b/i,
  /\bparticipant\b/i,
  /\bhomework\b/i,
  /\bexercises?\b/i,
  /\bcourse\b/i,
  /\bclasses?\b/i,
  /\blessons?\b/i,
];

const NEGATIVE_FRAMING_PATTERNS = [
  /\byou(?:'|’)?re behind\b/i,
  /\byou are behind\b/i,
  /\bfalling behind\b/i,
  /\byou are late\b/i,
  /\byou(?:'|’)?re late\b/i,
  /\btoo late\b/i,
  /\byou should\b/i,
];

const REQUIRED_OS_MARKERS = ["upgrade your os", "internal operating system"];

function normalize(value) {
  return value
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .toLowerCase();
}

async function maybeRead(relativePath) {
  const filePath = path.resolve(process.cwd(), relativePath);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return { ok: true, filePath, content };
  } catch {
    return { ok: false, filePath, content: "" };
  }
}

function lineFailuresForLine(line, normalizedLine) {
  const failures = [];

  for (const phrase of BANNED_PHRASES) {
    if (normalizedLine.includes(phrase)) {
      failures.push(`Banned phrase found: \"${phrase}\"`);
    }
  }

  for (const pattern of GLOSSARY_VIOLATION_PATTERNS) {
    if (pattern.test(line)) {
      failures.push(`Glossary violation found: ${pattern}`);
    }
  }

  for (const pattern of NEGATIVE_FRAMING_PATTERNS) {
    if (pattern.test(line)) {
      failures.push(`Negative framing found: ${pattern}`);
    }
  }

  return failures;
}

async function lintFile(relativePath) {
  const readResult = await maybeRead(relativePath);
  const failures = [];

  if (!readResult.ok) {
    failures.push({
      filePath: readResult.filePath,
      line: 1,
      reason: "File missing or unreadable",
    });
    return failures;
  }

  const lines = readResult.content.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const normalizedLine = normalize(line);
    const lineFailures = lineFailuresForLine(line, normalizedLine);
    for (const reason of lineFailures) {
      failures.push({
        filePath: readResult.filePath,
        line: i + 1,
        reason,
      });
    }
  }

  return failures;
}

async function checkRequiredOsMarkers() {
  const failures = [];
  const markerFiles = [
    "src/app/upgrade-your-os/page.tsx",
    "src/content/page_copy.v1.ts",
  ];

  const chunks = [];
  for (const relativePath of markerFiles) {
    const readResult = await maybeRead(relativePath);
    if (readResult.ok) {
      chunks.push(normalize(readResult.content));
    }
  }

  const joined = chunks.join("\n");
  if (!REQUIRED_OS_MARKERS.some((marker) => joined.includes(marker))) {
    failures.push({
      filePath: path.resolve(process.cwd(), markerFiles[0]),
      line: 1,
      reason: `Missing OS framing phrase (expected one of: ${REQUIRED_OS_MARKERS.join(", ")})`,
    });
  }

  return failures;
}

async function main() {
  const filesToLint = [...MARKETING_PAGE_FILES, ...COPY_SOURCE_FILES];
  const failures = [];

  for (const relativePath of filesToLint) {
    failures.push(...(await lintFile(relativePath)));
  }

  failures.push(...(await checkRequiredOsMarkers()));

  if (failures.length > 0) {
    console.log("qa:tone FAIL");
    for (const failure of failures) {
      console.log(`- ${failure.filePath}:${failure.line} ${failure.reason}`);
    }
    process.exit(1);
  }

  console.log("qa:tone PASS");
  console.log(`marketing_page_files_checked: ${MARKETING_PAGE_FILES.length}`);
  console.log(`copy_source_files_checked: ${COPY_SOURCE_FILES.length}`);
  console.log(`banned_phrases_checked: ${BANNED_PHRASES.length}`);
  console.log(`glossary_patterns_checked: ${GLOSSARY_VIOLATION_PATTERNS.length}`);
  console.log(`negative_patterns_checked: ${NEGATIVE_FRAMING_PATTERNS.length}`);
}

main().catch((error) => {
  console.error("qa:tone FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
