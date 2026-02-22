import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const srcRoot = path.join(root, "src");
const canonicalScorerPath = path.join(srcRoot, "lib", "scoring", "score-assessment.mjs");

const ALLOWED_INDEX_USAGE = new Set([
  path.join(srcRoot, "lib", "scoring", "index.ts"),
]);

const failures = [];
const canonicalImportHits = [];

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

  if (content.includes("@/lib/scoring/score-assessment.mjs")) {
    canonicalImportHits.push(rel);
  }

  const isScoringInternals = rel.startsWith("src/lib/scoring/");

  if (!isScoringInternals) {
    if (content.includes("@/lib/scoring/pipeline") || content.includes("../scoring/pipeline")) {
      failures.push(`${rel}: imports experimental scoring pipeline in runtime path.`);
    }
    if (content.includes("@/lib/scoring-legacy") || content.includes("scoring-legacy")) {
      failures.push(`${rel}: imports legacy scorer path.`);
    }
  }

  const usesScoringBarrel =
    content.includes("from \"@/lib/scoring\"") ||
    content.includes("from '@/lib/scoring'");

  if (usesScoringBarrel && !ALLOWED_INDEX_USAGE.has(filePath)) {
    failures.push(
      `${rel}: imports scoring barrel. Use '@/lib/scoring/score-assessment.mjs' directly for runtime determinism.`,
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
