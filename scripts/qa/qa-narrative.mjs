import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REQUIRED_MARKERS = [
  "SPINE:HOOK",
  "SPINE:WHY",
  "SPINE:HOW",
  "SPINE:OUTCOME",
  "SPINE:PROOF",
  "SPINE:LOOP",
];

const TARGET_FILES = [
  "src/app/upgrade-your-os/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/outcomes/page.tsx",
  "src/app/justin/page.tsx",
  "src/app/preview/page.tsx",
  "src/app/sample-report/page.tsx",
];

const PAGE_COPY_SOURCE = "src/content/page_copy.v1.ts";

const BANNED_PHRASES = [
  "you're behind",
  "you are behind",
  "sleep debt",
  "take a breath",
];

function getLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

function normalize(content) {
  return content
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .toLowerCase();
}

function hasAny(content, options) {
  return options.some((entry) => content.includes(entry));
}

async function readFile(relativePath) {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const content = await fs.readFile(fullPath, "utf8");
  return { fullPath, content };
}

function pushFailure(failures, filePath, line, reason) {
  failures.push({ filePath, line, reason });
}

function checkRequiredMarkers(filePath, content, failures) {
  for (const marker of REQUIRED_MARKERS) {
    const index = content.indexOf(marker);
    if (index < 0) {
      pushFailure(failures, filePath, 1, `Missing marker: ${marker}`);
      continue;
    }
  }
}

function checkBannedPhrases(filePath, content, failures) {
  const lowered = normalize(content);
  for (const phrase of BANNED_PHRASES) {
    const index = lowered.indexOf(phrase);
    if (index >= 0) {
      pushFailure(
        failures,
        filePath,
        getLineNumber(lowered, index),
        `Banned phrase found: "${phrase}"`,
      );
    }
  }
}

function checkPageSpecificRules(filePath, content, failures, copyLowered) {
  const lowered = normalize(content);
  const joined = `${lowered}\n${copyLowered}`;

  if (filePath.endsWith("upgrade-your-os/page.tsx")) {
    if (!content.includes('href="/preview"') && !content.includes("copy.ctas.primary.href")) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing CTA link: href="/preview"',
      );
    }
    if (
      !content.includes('href="/143"') &&
      !content.includes('href="/toolkit"') &&
      !content.includes("copy.ctas.secondary.href")
    ) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing second CTA link: href="/143" or href="/toolkit"',
      );
    }
    if (!joined.includes("why this works")) {
      pushFailure(failures, filePath, 1, 'Missing section heading: "Why this works"');
    }
    if (!joined.includes("everyday")) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing audience signal for everyday people',
      );
    }
  }

  if (filePath.endsWith("how-it-works/page.tsx")) {
    if (!joined.includes("what you get")) {
      pushFailure(failures, filePath, 1, 'Missing section heading: "What you get"');
    }
    if (!joined.includes("why take it more than once")) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing section heading: "Why take it more than once"',
      );
    }
  }

  if (filePath.endsWith("outcomes/page.tsx")) {
    const listMatch = content.match(/const\s+outcomeWins\s*=\s*\[([\s\S]*?)\]/);
    let literalCount = listMatch
      ? (listMatch[1].match(/"[^"]+"|'[^']+'/g) || []).length
      : 0;
    if (literalCount === 0 && content.includes("copy.wins.map")) {
      const copyWinsMatch = copyLowered.match(/wins:\s*\[([\s\S]*?)\],\s*howtitle:/);
      literalCount = copyWinsMatch
        ? (copyWinsMatch[1].match(/"[^"]+"|'[^']+'/g) || []).length
        : 0;
    }
    if (literalCount < 5 || literalCount > 8) {
      pushFailure(
        failures,
        filePath,
        1,
        `Outcomes list must contain 5-8 items (found ${literalCount})`,
      );
    }
  }

  if (filePath.endsWith("justin/page.tsx")) {
    if (!joined.includes("executive development")) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing credibility phrase: "executive development"',
      );
    }
    if (!hasAny(joined, ["story", "background"])) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing human credibility context ("story" or "background")',
      );
    }
  }

  if (filePath.endsWith("preview/page.tsx")) {
    if (!joined.includes("fast value")) {
      pushFailure(failures, filePath, 1, 'Missing fast value framing');
    }
    if (
      !joined.includes("included in paid tiers") &&
      !joined.includes("paid tier")
    ) {
      pushFailure(failures, filePath, 1, "Missing lock explanation for paid tier");
    }
    if (
      !joined.includes("i know you're the type of person who") &&
      !joined.includes("i know you are the type of person who")
    ) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing personal tone example: "I know you\'re the type of person who"',
      );
    }
  }

  if (filePath.endsWith("sample-report/page.tsx")) {
    if (!joined.includes("fast value")) {
      pushFailure(failures, filePath, 1, 'Missing fast value framing');
    }
    if (
      !joined.includes("included in paid tiers") &&
      !joined.includes("paid tier")
    ) {
      pushFailure(failures, filePath, 1, "Missing lock explanation for paid tier");
    }
    if (
      !joined.includes("i know you're the type of person who") &&
      !joined.includes("i know you are the type of person who")
    ) {
      pushFailure(
        failures,
        filePath,
        1,
        'Missing personal tone example: "I know you\'re the type of person who"',
      );
    }
  }
}

async function main() {
  const failures = [];
  let copyLowered = "";
  try {
    const copySourceContent = await fs.readFile(
      path.resolve(process.cwd(), PAGE_COPY_SOURCE),
      "utf8",
    );
    copyLowered = normalize(copySourceContent);
  } catch {
    copyLowered = "";
  }

  for (const relativePath of TARGET_FILES) {
    const absolutePath = path.resolve(process.cwd(), relativePath);
    try {
      const { content } = await readFile(relativePath);
      checkRequiredMarkers(absolutePath, content, failures);
      checkBannedPhrases(absolutePath, content, failures);
      checkPageSpecificRules(absolutePath, content, failures, copyLowered);
    } catch {
      pushFailure(failures, absolutePath, 1, "File missing or unreadable");
    }
  }

  if (failures.length > 0) {
    console.log("qa:narrative FAIL");
    for (const failure of failures) {
      console.log(`- ${failure.filePath}:${failure.line} ${failure.reason}`);
    }
    process.exit(1);
  }

  console.log("qa:narrative PASS");
  console.log(`files_checked: ${TARGET_FILES.length}`);
  console.log(`markers_per_file: ${REQUIRED_MARKERS.length}`);
  console.log(`banned_phrases_checked: ${BANNED_PHRASES.length}`);
}

main().catch((error) => {
  console.error("qa:narrative FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
