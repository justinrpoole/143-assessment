/**
 * qa-voice-lock.mjs
 *
 * Validates the voice-lock string registry (voice-lock.v1.ts) against
 * tone-matrix zone rules. Checks:
 *
 * 1. No locked string contains a globally banned phrase
 * 2. No locked string violates its zone's banned phrases
 * 3. Canonical strings are not empty
 * 4. Reports string counts per zone + status
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// ---------------------------------------------------------------------------
// Load the voice-lock registry by parsing the TypeScript source.
// We extract string values from the LOCKED_STRINGS array.
// ---------------------------------------------------------------------------

async function loadLockedStrings(cwd) {
  const filePath = path.join(cwd, "src/content/voice-lock.v1.ts");
  const text = await fs.readFile(filePath, "utf8");

  // Parse entries: extract key, value, zone, version, status
  const entries = [];
  const entryRegex = /\{\s*key:\s*'([^']+)',\s*value:\s*'([^']*)',\s*zone:\s*'([^']+)',\s*version:\s*(\d+),[^}]*status:\s*'([^']+)'/g;
  let match;
  while ((match = entryRegex.exec(text)) !== null) {
    entries.push({
      key: match[1],
      value: match[2],
      zone: match[3],
      version: parseInt(match[4], 10),
      status: match[5],
    });
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Global banned phrases (subset from qa-drift-scan.mjs)
// ---------------------------------------------------------------------------
const GLOBAL_BANNED = [
  "crush it", "kill it", "alpha", "man up", "hustle", "grind",
  "weakness", "broken", "failure",
  "synergy", "leverage", "world-class", "game-changer", "cutting-edge",
  "next-level", "deep dive", "circle back", "unpack", "bandwidth",
  "guru", "spiritual bypass",
  "sleep debt", "take a breath", "you're behind", "you are behind",
  "falling behind", "too late", "you always", "you never",
  "personality test", "personality type", "personality profile", "diagnostic tool",
];

// ---------------------------------------------------------------------------
// Zone-specific banned phrases
// ---------------------------------------------------------------------------
const ZONE_BANNED = {
  MARKETING: ["we believe", "our mission", "best in class", "revolutionary", "transform your life"],
  ASSESSMENT: ["great job", "well done", "you should", "try to", "remember to", "the right answer", "honestly"],
  RESULTS: ["you scored", "your score is", "you failed", "low score", "below average", "needs improvement", "you lack"],
  COACHING: ["you must", "you have to", "you need to", "you should always", "never do", "the key is", "unlock your potential"],
  DAILY_LOOP: ["let's go", "you got this", "stay positive", "no excuses", "rise and grind", "be grateful"],
  SYSTEM: ["oops", "uh oh", "whoops", "something went wrong"],
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const cwd = process.cwd();
  const entries = await loadLockedStrings(cwd);

  if (entries.length === 0) {
    console.error("qa:voice-lock ERROR: Could not parse any entries from voice-lock.v1.ts");
    process.exit(1);
  }

  const failures = [];

  for (const entry of entries) {
    const lower = entry.value.toLowerCase();

    // Skip deprecated or empty-value entries
    if (entry.status === "deprecated") continue;

    // Check: canonical strings must not be empty
    if (entry.status === "canonical" && entry.value.trim() === "") {
      failures.push(`  ${entry.key}  Canonical string is empty`);
      continue;
    }

    // Check: global banned phrases
    // Allow negation reframes: "not broken", "not a failure" are intentional
    for (const banned of GLOBAL_BANNED) {
      const bannedLower = banned.toLowerCase();
      if (!lower.includes(bannedLower)) continue;
      // Check for negation context: "not [a|an]? [adjective]? <banned>"
      const negationPattern = new RegExp(`\\bnot\\s+(?:a\\s+|an\\s+)?(?:\\w+\\s+)?${bannedLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (negationPattern.test(lower)) continue; // Negation reframe — allowed
      failures.push(`  ${entry.key}  Contains globally banned phrase: "${banned}"`);
    }

    // Check: zone-specific banned phrases
    const zoneBanned = ZONE_BANNED[entry.zone] ?? [];
    for (const banned of zoneBanned) {
      const bannedLower = banned.toLowerCase();
      if (!lower.includes(bannedLower)) continue;
      const negationPattern = new RegExp(`\\bnot\\s+(?:a\\s+|an\\s+)?${bannedLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
      if (negationPattern.test(lower)) continue;
      failures.push(`  ${entry.key}  Contains zone [${entry.zone}] banned phrase: "${banned}"`);
    }
  }

  // Stats
  const byZone = {};
  const byStatus = {};
  for (const entry of entries) {
    byZone[entry.zone] = (byZone[entry.zone] ?? 0) + 1;
    byStatus[entry.status] = (byStatus[entry.status] ?? 0) + 1;
  }

  if (failures.length === 0) {
    console.log("qa:voice-lock PASS");
    console.log(`  total entries: ${entries.length}`);
    console.log(`  by zone: ${Object.entries(byZone).map(([z, n]) => `${z}=${n}`).join(", ")}`);
    console.log(`  by status: ${Object.entries(byStatus).map(([s, n]) => `${s}=${n}`).join(", ")}`);
    process.exit(0);
  }

  console.log(`qa:voice-lock FAIL — ${failures.length} issue(s)\n`);
  for (const f of failures) {
    console.log(f);
  }
  console.log(`\n  total entries: ${entries.length}`);
  console.log(`  by zone: ${Object.entries(byZone).map(([z, n]) => `${z}=${n}`).join(", ")}`);
  console.log(`  by status: ${Object.entries(byStatus).map(([s, n]) => `${s}=${n}`).join(", ")}`);
  process.exit(1);
}

main().catch((err) => {
  console.error("qa:voice-lock ERROR:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
