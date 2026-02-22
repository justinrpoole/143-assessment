import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const GENERATOR = path.join(ROOT, "scripts/qa/generate-sample-report.mjs");

function ensureFile(relativePath) {
  const fullPath = path.join(ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`missing_file: ${relativePath}`);
  }
  const size = fs.statSync(fullPath).size;
  if (size <= 0) {
    throw new Error(`empty_file: ${relativePath}`);
  }
  return { fullPath, size };
}

function main() {
  execFileSync("node", [GENERATOR, "--fixture", "pair_R4_R5"], {
    cwd: ROOT,
    stdio: "inherit",
  });

  const html = ensureFile("out/sample-report.html");
  const pdf = ensureFile("out/sample-report.pdf");
  const json = ensureFile("out/sample-results.json");

  console.log("qa:sample-report PASS");
  console.log(`html_bytes: ${html.size}`);
  console.log(`pdf_bytes: ${pdf.size}`);
  console.log(`json_bytes: ${json.size}`);
}

try {
  main();
} catch (error) {
  console.error("qa:sample-report FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
