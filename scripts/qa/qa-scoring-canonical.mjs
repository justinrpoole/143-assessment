import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcRoot = path.join(root, "src");
const canonicalScorerPath = path.join(srcRoot, "lib", "scoring", "pipeline.ts");

const ALLOWED_INDEX_USAGE = new Set([
  path.join(srcRoot, "lib", "scoring", "index.ts"),
]);

// Files that are allowed to import the legacy scorer (e.g., backfill scripts)
const LEGACY_IMPORT_ALLOWLIST = new Set([
  "scripts/backfill-pipeline-scores.mjs",
]);

const failures = [];
const canonicalImportHits = [];
const legacyImportHits = [];

function walk(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }
    if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx") || fullPath.endsWith(".mjs")) {
      files.push(fullPath);
    }
  }
  return files;
}

function relative(filePath) {
  return path.relative(root, filePath);
}

if (!fs.existsSync(canonicalScorerPath)) {
  failures.push(`Missing canonical scorer: ${relative(canonicalScorerPath)}`);
}

const files = walk(srcRoot);
for (const filePath of files) {
  const rel = relative(filePath);
  const content = fs.readFileSync(filePath, "utf8");

  // Track runtime imports of the canonical pipeline scorer
  if (content.includes("@/lib/scoring/pipeline")) {
    canonicalImportHits.push(rel);
  }

  // Flag runtime imports of the legacy scorer (should no longer be used)
  if (content.includes("@/lib/scoring/score-assessment.mjs")) {
    if (!LEGACY_IMPORT_ALLOWLIST.has(rel)) {
      legacyImportHits.push(rel);
      failures.push(`${rel}: imports legacy score-assessment.mjs — should use pipeline.ts`);
    }
  }

  if (content.includes("@/lib/scoring-legacy") || content.includes("scoring-legacy")) {
    failures.push(`${rel}: imports deprecated legacy scorer path.`);
  }

  const usesScoringBarrel =
    content.includes("from \"@/lib/scoring\"") ||
    content.includes("from '@/lib/scoring'");

  if (usesScoringBarrel && !ALLOWED_INDEX_USAGE.has(filePath)) {
    failures.push(
      `${rel}: imports scoring barrel. Use '@/lib/scoring/pipeline' directly for runtime determinism.`,
    );
  }
}

if (failures.length > 0) {
  console.error("\nqa:scoring-canonical FAILED");
  console.error(`Failures: ${failures.length}`);
  failures.forEach((entry, index) => {
    console.error(`${index + 1}. ${entry}`);
  });
  process.exit(1);
}

console.log("\nqa:scoring-canonical PASS");
console.log(`Canonical scorer: ${relative(canonicalScorerPath)}`);
console.log(`Runtime imports using canonical scorer: ${canonicalImportHits.length}`);
if (canonicalImportHits.length > 0) {
  canonicalImportHits.sort((left, right) => left.localeCompare(right));
  canonicalImportHits.forEach((entry) => console.log(`- ${entry}`));
}
if (legacyImportHits.length > 0) {
  console.log(`Legacy scorer imports (allowlisted): ${legacyImportHits.length}`);
  legacyImportHits.forEach((entry) => console.log(`- ${entry}`));
}
