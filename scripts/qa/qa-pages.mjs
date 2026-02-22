import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const REQUIRED_ROUTE_FILES = [
  "src/app/page.tsx",
  "src/app/upgrade-your-os/page.tsx",
  "src/app/143/page.tsx",
  "src/app/toolkit/page.tsx",
  "src/app/preview/page.tsx",
  "src/app/upgrade/page.tsx",
  "src/app/sample-report/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/outcomes/page.tsx",
  "src/app/justin/page.tsx",
  "src/app/os-coaching/page.tsx",
  "src/app/cohorts/page.tsx",
  "src/app/corporate/page.tsx",
  "src/app/enterprise/page.tsx",
  "src/app/coach/page.tsx",
  "src/app/faq/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/login/page.tsx",
  "src/app/portal/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/morning/page.tsx",
  "src/app/micro-joy/page.tsx",
  "src/app/account/page.tsx",
  "src/app/assessment/page.tsx",
  "src/app/assessment/setup/page.tsx",
  "src/app/results/page.tsx",
  "src/app/reports/page.tsx",
  "src/app/growth/page.tsx",
  "src/app/spec-center/page.tsx",
];

const CENTRAL_COPY_FILE = "src/content/page_copy.v1.ts";

const REQUIRED_COPY_KEYS = {
  upgradeYourOs: ["questionBand", "problemSection", "nextStepSection", "whyThisWorks", "tiles"],
  howItWorks: ["funnelSteps", "whatYouGet", "repeatWhy", "outcome"],
  outcomes: ["wins", "howTitle", "howBody", "proof", "loop"],
  challenge143: ["startNowTitle", "kitTitle", "kitIncludes", "challengeSteps"],
  preview: ["why", "proof", "how", "outcome", "loop", "paidTierTitle"],
  sampleReport: ["samplePairId", "proofTitle", "paidTierItems", "ctas"],
  justin: ["credibilityTitle", "trustTitle", "dontDo", "do", "methodTitle"],
};

const REQUIRED_PAGE_IMPORTS = [
  "src/app/upgrade-your-os/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/outcomes/page.tsx",
  "src/app/143/page.tsx",
  "src/app/preview/page.tsx",
  "src/app/sample-report/page.tsx",
  "src/app/justin/page.tsx",
];

const REQUIRED_MARKERS_BY_PAGE = {
  "src/app/upgrade-your-os/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "questionBand",
  ],
  "src/app/how-it-works/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "copy.whatYouGet.title",
    "copy.repeatWhy.title",
  ],
  "src/app/outcomes/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "copy.wins.map",
  ],
  "src/app/143/page.tsx": [
    "copy.startNowTitle",
    "copy.kitTitle",
    "ToolkitDeliveryClient",
  ],
  "src/app/preview/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "PreviewSnapshotClient",
  ],
  "src/app/sample-report/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "renderReportHtml",
  ],
  "src/app/justin/page.tsx": [
    "SPINE:HOOK",
    "SPINE:WHY",
    "SPINE:HOW",
    "SPINE:PROOF",
    "SPINE:OUTCOME",
    "SPINE:LOOP",
    "I do not do",
    "What I do",
  ],
};

const BANNED_PHRASES = ["behind", "sleep debt", "take a breath"];

function filePath(relativePath) {
  return path.join(ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(filePath(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), "utf8");
}

function normalize(content) {
  return content
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .toLowerCase();
}

function resultRow(name, pass, missingCount) {
  return `${name.padEnd(20)} | ${pass ? "PASS" : "FAIL"} | ${String(missingCount).padStart(2, " ")}`;
}

function checkRoutes() {
  const missing = REQUIRED_ROUTE_FILES.filter((entry) => !exists(entry));
  return { pass: missing.length === 0, missing };
}

function checkCentralCopyShape() {
  if (!exists(CENTRAL_COPY_FILE)) {
    return { pass: false, missing: [CENTRAL_COPY_FILE] };
  }

  const content = read(CENTRAL_COPY_FILE);
  const missing = [];

  for (const [sectionKey, fields] of Object.entries(REQUIRED_COPY_KEYS)) {
    const sectionRegex = new RegExp(`\\b${sectionKey}\\s*:`);
    if (!sectionRegex.test(content)) {
      missing.push(`missing section: ${sectionKey}`);
      continue;
    }
    for (const field of fields) {
      const fieldRegex = new RegExp(`\\b${field}\\s*:`);
      if (!fieldRegex.test(content)) {
        missing.push(`missing field: ${sectionKey}.${field}`);
      }
    }
  }

  return { pass: missing.length === 0, missing };
}

function checkPageCentralization() {
  const missing = [];

  for (const page of REQUIRED_PAGE_IMPORTS) {
    if (!exists(page)) {
      missing.push(`${page}: file missing`);
      continue;
    }
    const content = read(page);
    if (!content.includes('from "@/content/page_copy.v1"')) {
      missing.push(`${page}: missing centralized copy import`);
    }
  }

  for (const [page, requiredTokens] of Object.entries(REQUIRED_MARKERS_BY_PAGE)) {
    if (!exists(page)) {
      missing.push(`${page}: file missing`);
      continue;
    }
    const content = read(page);
    for (const token of requiredTokens) {
      if (!content.includes(token)) {
        missing.push(`${page}: missing token \"${token}\"`);
      }
    }
  }

  return { pass: missing.length === 0, missing };
}

function checkBannedPhrases() {
  const files = [CENTRAL_COPY_FILE, ...REQUIRED_PAGE_IMPORTS];
  const failures = [];

  for (const relativePath of files) {
    if (!exists(relativePath)) {
      continue;
    }
    const content = normalize(read(relativePath));
    for (const phrase of BANNED_PHRASES) {
      if (content.includes(phrase)) {
        failures.push(`${relativePath}: banned phrase \"${phrase}\"`);
      }
    }
  }

  return { pass: failures.length === 0, missing: failures };
}

function main() {
  const routeCheck = checkRoutes();
  const copyShapeCheck = checkCentralCopyShape();
  const centralizationCheck = checkPageCentralization();
  const bannedCheck = checkBannedPhrases();

  console.log("CATEGORY             | RESULT | missing_count");
  console.log("---------------------|--------|--------------");
  console.log(resultRow("routes", routeCheck.pass, routeCheck.missing.length));
  console.log(resultRow("copy_shape", copyShapeCheck.pass, copyShapeCheck.missing.length));
  console.log(resultRow("copy_wiring", centralizationCheck.pass, centralizationCheck.missing.length));
  console.log(resultRow("banned_phrases", bannedCheck.pass, bannedCheck.missing.length));

  const allFailures = [
    ...routeCheck.missing,
    ...copyShapeCheck.missing,
    ...centralizationCheck.missing,
    ...bannedCheck.missing,
  ];

  if (allFailures.length > 0) {
    console.log("\nqa:pages FAIL");
    for (const failure of allFailures) {
      console.log(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nqa:pages PASS");
}

main();
