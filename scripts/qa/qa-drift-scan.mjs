/**
 * qa-drift-scan.mjs
 *
 * Drift Scan Checklist — authoritative source: 00_CANON_LOCK/00_MASTER_CONSTITUTION.md
 *
 * Checks (run across all relevant src files unless otherwise noted):
 *   1. Wrong/old Ray labels & numbering
 *   2. Banned phrases (constitutional + tone-layer)
 *   3. Story-language leaking into assessment-context files
 *   4. Fixed-identity language (traits vs. states/skills)
 */

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

// ---------------------------------------------------------------------------
// Canonical Ray table (00_MASTER_CONSTITUTION.md §5, resolution §9)
// ---------------------------------------------------------------------------
const CANONICAL_RAYS = {
  1: "Intention",
  2: "Joy",
  3: "Presence",
  4: "Power",
  5: "Purpose",
  6: "Authenticity",
  7: "Connection",
  8: "Possibility",
  9: "Be The Light",
};

// Wrong Ray→name pairings documented in §9 resolution notes.
// Pattern: [rayNumber, wrongName]
const WRONG_RAY_PAIRINGS = [
  [6, "Possibility"],     // old order had Ray 6 = Possibility
  [7, "Authenticity"],    // old order had Ray 7 = Authenticity
  [7, "Magnetize Possibilities"], // Story Database label
  [8, "Connection"],      // old order had Ray 8 = Connection
  [8, "Spark the Light"], // Story Database label
];

// Deprecated Ray names that should never appear in the app (any Ray number)
const DEPRECATED_RAY_NAMES = [
  "Magnetize Possibilities",
  "Spark the Light",
];

// ---------------------------------------------------------------------------
// 1. RAY LABEL RULES
// ---------------------------------------------------------------------------
// Patterns: "Ray N: WrongName" or "Ray N — WrongName" or "Ray N (WrongName)"
function buildWrongRayPairingPatterns() {
  return WRONG_RAY_PAIRINGS.map(([num, wrongName]) => ({
    pattern: new RegExp(
      `Ray\\s+${num}[:\\s—–-]+${escapeRegex(wrongName)}`,
      "i"
    ),
    message: `Wrong Ray label: "Ray ${num}: ${wrongName}" — canonical is "Ray ${num}: ${CANONICAL_RAYS[num]}"`,
  }));
}

// Flag any occurrence of deprecated Ray names regardless of Ray number
function buildDeprecatedNamePatterns() {
  return DEPRECATED_RAY_NAMES.map((name) => ({
    pattern: new RegExp(escapeRegex(name), "i"),
    message: `Deprecated Ray name: "${name}" — check canon for correct label`,
  }));
}

// ---------------------------------------------------------------------------
// 2. BANNED PHRASES
// All sources: 00_MASTER_CONSTITUTION.md §8, TONE_LAYER.md, existing qa:tone list
// ---------------------------------------------------------------------------
const BANNED_PHRASES = [
  // Hustle / masculine language (Constitution Commandment 5 & 6)
  "crush it",
  "kill it",
  "alpha",
  "man up",
  "hustle",
  "grind",
  // Shame / deficit framing (Commandment 1 & 6)
  "weakness",
  "broken",
  "failure",
  // Corporate jargon (TONE_LAYER §MODE B avoid)
  "synergy",
  "leverage",
  "world-class",
  "game-changer",
  "cutting-edge",
  "next-level",
  "deep dive",
  "circle back",
  "unpack",
  "bandwidth",
  // Guru / woo (TONE_LAYER §MODE A avoid)
  "guru",
  "spiritual bypass",
  // Negative framing (TONE_LAYER)
  "sleep debt",
  "take a breath",
  "you're behind",
  "you are behind",
  "falling behind",
  "too late",
  // Absolutes forbidden by tone layer
  "you always",
  "you never",
  // Personality/diagnostic framing (Constitution Commandment 10)
  "personality test",
  "personality type",
  "personality profile",
  "diagnostic tool",
];

const BANNED_REGEX = [
  /\bbehind\b/i, // single-word "behind" in scoring/results context
];

// ---------------------------------------------------------------------------
// 3. STORY-LANGUAGE PATTERNS (forbidden inside assessment-context files)
// Per CLAUDE.md: "No 'story' content inside the assessment experience."
// ---------------------------------------------------------------------------
const STORY_LANGUAGE_PATTERNS = [
  // Named personal stories from constitution §1 origin section
  /Troy Bolton/i,
  /Hallway Moment/i,
  /Perfect Storm/i,
  /Anti.Oppressor Vision/i,
  /\bstory bank\b/i,
  /\borigin story\b/i,
  /\bStory Database\b/i,
  // Book-context leakage
  /\bIn (?:this )?chapter\b/i,
  /\bIn the book\b/i,
  /\bRead more in\b/i,
  /\bSPINE:/i, // narrative spine markers from qa-narrative
  // Narrative opener patterns
  /\bOnce upon\b/i,
  /\bBack in \d{4}\b/i,
  /\bIt was (?:a|the) (?:day|moment|time)\b/i,
];

// ---------------------------------------------------------------------------
// 4. FIXED-IDENTITY LANGUAGE (trait vs. state/skill)
// Constitution Commandment 3 (TONE_LAYER): "No fixed identity language"
// "We speak in states, capacities, and skills — never traits."
// ---------------------------------------------------------------------------
const FIXED_IDENTITY_PATTERNS = [
  /\byour personality\b/i,
  /\bit'?s who you are\b/i,
  /\bborn to be\b/i,
  /\bnatural(?:ly)? (?:a |an )?leader\b/i,
  /\byou(?:'re| are) (?:a |an )?(?:introvert|extrovert|type [a-z])\b/i,
  /\byou(?:'re| are) (?:just )?(?:wired|built|made) (?:that way|this way|to be)\b/i,
  /\bpersonality (?:trait|type|profile|test|assessment)\b/i,
  /\bthat'?s (?:just )?(?:who|how) you are\b/i,
];

// ---------------------------------------------------------------------------
// EXEMPT_PATHS — paths where banned-phrase + fixed-identity checks are suppressed.
// Ray label checks remain active everywhere (no exemption for wrong Ray names).
// Technical uses of words like "failure" (API errors), "leverage" (variable),
// "alpha" (CSS token), "bandwidth" (network) are expected in these paths.
// ---------------------------------------------------------------------------
const EXEMPT_PATH_FRAGMENTS = [
  "src/lib/",
  "src/app/api/",
  // Item bank files are canon-locked assessment questions — terms like
  // "grind", "sleep debt", "failure", "behind" appear in item text legitimately.
  // Do not edit item bank without explicit canon-owner instruction.
  "src/data/ray_items.json",
  "src/data/tool_items.json",
  "src/data/eclipse_items.json",
  "src/data/reflection_prompts.json",
  "src/data/archetype_blocks.json",
  "src/data/validity_items.json",
  "src/data/integrated_specs/",
  "scripts/",
];

function isExemptPath(relPath) {
  return EXEMPT_PATH_FRAGMENTS.some((fragment) =>
    relPath.replaceAll("\\", "/").includes(fragment)
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(text) {
  return text
    .replaceAll("\u2019", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"');
}

/**
 * Collect files under `baseDir` whose paths match any of the given suffix lists.
 * `includes` is an array of { dir, exts } objects where:
 *   dir  — subdirectory relative to cwd (e.g. "src")
 *   exts — Set of extensions to allow (e.g. new Set([".ts", ".tsx"]))
 *   prefix — optional path prefix filter (e.g. "app/assessment")
 */
async function collectFiles(includes, cwd) {
  const results = new Set();
  for (const { dir, exts, prefix } of includes) {
    const base = path.join(cwd, dir);
    let entries;
    try {
      entries = await fs.readdir(base, { recursive: true });
    } catch {
      continue;
    }
    for (const rel of entries) {
      const ext = path.extname(rel);
      if (!exts.has(ext)) continue;
      if (prefix && !rel.startsWith(prefix)) continue;
      results.add(path.join(base, rel));
    }
  }
  return [...results].sort();
}

function scanLines(lines, checks) {
  const hits = [];
  lines.forEach((raw, idx) => {
    const line = normalize(raw);
    const lineNo = idx + 1;
    for (const { pattern, phrase, message } of checks) {
      const matched = pattern
        ? pattern.test(line)
        : line.toLowerCase().includes(phrase.toLowerCase());
      if (matched) {
        hits.push({ lineNo, message });
      }
    }
  });
  return hits;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const cwd = process.cwd();
  const failures = [];

  const wrongRayChecks = buildWrongRayPairingPatterns();
  const deprecatedNameChecks = buildDeprecatedNamePatterns();

  const bannedPhraseChecks = BANNED_PHRASES.map((phrase) => ({
    phrase,
    message: `Banned phrase: "${phrase}"`,
  }));
  const bannedRegexChecks = BANNED_REGEX.map((pattern) => ({
    pattern,
    message: `Banned pattern: ${pattern}`,
  }));

  const storyChecks = STORY_LANGUAGE_PATTERNS.map((pattern) => ({
    pattern,
    message: `Story-language in assessment context: ${pattern}`,
  }));

  const identityChecks = FIXED_IDENTITY_PATTERNS.map((pattern) => ({
    pattern,
    message: `Fixed-identity language (use states/skills, not traits): ${pattern}`,
  }));

  // -- PASS 1: Ray labels + banned phrases + fixed-identity — all src files --
  const srcExts = new Set([".ts", ".tsx", ".js", ".mjs", ".json"]);
  const allSrcFiles = await collectFiles(
    [{ dir: "src", exts: srcExts }],
    cwd
  );

  for (const filePath of allSrcFiles) {
    const rel = path.relative(cwd, filePath);
    let text;
    try {
      text = await fs.readFile(filePath, "utf8");
    } catch {
      failures.push({ file: rel, lineNo: 0, message: "Could not read file" });
      continue;
    }
    const lines = text.split("\n");

    // Ray label checks apply everywhere; banned-phrase + identity checks
    // are suppressed for infrastructure paths (API routes, lib, data specs).
    const exempt = isExemptPath(rel);
    const allChecks = [
      ...wrongRayChecks,
      ...deprecatedNameChecks,
      ...(exempt ? [] : bannedPhraseChecks),
      ...(exempt ? [] : bannedRegexChecks),
      ...(exempt ? [] : identityChecks),
    ];

    for (const hit of scanLines(lines, allChecks)) {
      failures.push({ file: rel, ...hit });
    }
  }

  // -- PASS 2: Story-language — assessment-context files only --
  const assessmentIncludes = [
    { dir: "src/app/assessment", exts: srcExts },
    { dir: "src/app/results",    exts: srcExts },
    { dir: "src/lib",            exts: srcExts },
    { dir: "src/components",     exts: srcExts },
    { dir: "src/content",        exts: new Set([".json", ".ts"]) },
  ];
  const assessmentFiles = await collectFiles(assessmentIncludes, cwd);

  for (const filePath of assessmentFiles) {
    const rel = path.relative(cwd, filePath);
    let text;
    try {
      text = await fs.readFile(filePath, "utf8");
    } catch {
      continue;
    }
    const lines = text.split("\n");

    for (const hit of scanLines(lines, storyChecks)) {
      failures.push({ file: rel, ...hit });
    }
  }

  // -- Report --
  if (failures.length === 0) {
    console.log("qa:drift-scan PASS");
    console.log(`  src files scanned (ray/banned/identity): ${allSrcFiles.length}`);
    console.log(`  assessment files scanned (story-language): ${assessmentFiles.length}`);
    console.log(`  wrong-Ray-pairing patterns: ${wrongRayChecks.length}`);
    console.log(`  deprecated-Ray-name patterns: ${deprecatedNameChecks.length}`);
    console.log(`  banned phrases: ${BANNED_PHRASES.length}`);
    console.log(`  fixed-identity patterns: ${identityChecks.length}`);
    console.log(`  story-language patterns: ${storyChecks.length}`);
    process.exit(0);
  }

  console.log(`qa:drift-scan FAIL — ${failures.length} issue(s)\n`);

  // Group by category for readability
  const sections = {
    "Wrong Ray labels": [],
    "Deprecated Ray names": [],
    "Banned phrases": [],
    "Fixed-identity language": [],
    "Story-language in assessment context": [],
    Other: [],
  };

  for (const f of failures) {
    const prefix = `  ${f.file}:${f.lineNo}  ${f.message}`;
    if (f.message.startsWith("Wrong Ray label")) {
      sections["Wrong Ray labels"].push(prefix);
    } else if (f.message.startsWith("Deprecated Ray name")) {
      sections["Deprecated Ray names"].push(prefix);
    } else if (f.message.startsWith("Banned phrase") || f.message.startsWith("Banned pattern")) {
      sections["Banned phrases"].push(prefix);
    } else if (f.message.startsWith("Fixed-identity")) {
      sections["Fixed-identity language"].push(prefix);
    } else if (f.message.startsWith("Story-language")) {
      sections["Story-language in assessment context"].push(prefix);
    } else {
      sections["Other"].push(prefix);
    }
  }

  for (const [section, lines] of Object.entries(sections)) {
    if (lines.length === 0) continue;
    console.log(`\n[${section}] (${lines.length})`);
    for (const line of lines) {
      console.log(line);
    }
  }

  process.exit(1);
}

main().catch((err) => {
  console.error("qa:drift-scan ERROR:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
