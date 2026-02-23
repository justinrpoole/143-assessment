// Content Loader — reads display content (questions, rays, ray_pairs) from disk.
// Extracted from score-assessment.mjs during scoring engine consolidation.
// Used by render-report-html.mjs and QA scripts for content access.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const moduleDir = path.dirname(fileURLToPath(import.meta.url));
const defaultContentRoot = path.resolve(moduleDir, "../../content");

let cachedContent = null;
let cachedRoot = "";

/**
 * Load canonical display content (questions, rays, ray_pairs) from disk.
 * Cached after first load for performance.
 *
 * @param {string} [contentRoot] — path to the content directory
 * @returns {{ questions: object[], rays: object[], rayPairs: object[] }}
 */
export function loadCanonicalContent(contentRoot = defaultContentRoot) {
  const normalizedRoot = path.resolve(contentRoot);
  if (cachedContent && cachedRoot === normalizedRoot) {
    return cachedContent;
  }

  const questions = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "questions.json"), "utf8"),
  );
  const rays = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "rays.json"), "utf8"),
  );
  const rayPairs = JSON.parse(
    fs.readFileSync(path.join(normalizedRoot, "ray_pairs.json"), "utf8"),
  );

  cachedRoot = normalizedRoot;
  cachedContent = { questions, rays, rayPairs };
  return cachedContent;
}
