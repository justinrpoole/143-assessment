import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CODE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".mjs"]);
const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "dist",
  "coverage",
  ".vercel",
]);

const TAXONOMY_TS_PATH = path.resolve(
  process.cwd(),
  "src/lib/analytics/taxonomy.ts",
);

const TAXONOMY_MD_CANDIDATES = [
  path.resolve(
    process.cwd(),
    "../specs/143leadership_build_spec_v1_2/08_Event_Taxonomy_and_Analytics.md",
  ),
  path.resolve(process.cwd(), "../08_Event_Taxonomy_and_Analytics.md"),
];

async function walk(dirPath) {
  const results = [];
  let entries;
  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".env.example") {
      continue;
    }

    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }
      results.push(...(await walk(fullPath)));
      continue;
    }

    if (CODE_EXTENSIONS.has(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }

  return results;
}

function getLineNumber(content, matchIndex) {
  return content.slice(0, matchIndex).split("\n").length;
}

function collectEventsFromContent(content, filePath) {
  const found = [];

  const objectEventPattern =
    /\b(?:emitEvent|emitPageView)\s*\(\s*\{[\s\S]*?\beventName\s*:\s*["'`]([a-z0-9_]+)["'`][\s\S]*?\}\s*\)/g;
  let match;
  while ((match = objectEventPattern.exec(content)) !== null) {
    found.push({
      eventName: match[1],
      filePath,
      line: getLineNumber(content, match.index),
    });
  }

  const directCallPattern =
    /\b(?:emitter\.emit|trackEvent|track|logEvent)\s*\(\s*["'`]([a-z0-9_]+)["'`]/g;
  while ((match = directCallPattern.exec(content)) !== null) {
    found.push({
      eventName: match[1],
      filePath,
      line: getLineNumber(content, match.index),
    });
  }

  return found;
}

function parseStringLiterals(block) {
  const values = [];
  const stringPattern = /["'`]([a-z0-9_]+)["'`]/g;
  let match;
  while ((match = stringPattern.exec(block)) !== null) {
    values.push(match[1]);
  }
  return values;
}

function parseCanonicalFromTaxonomyTs(content) {
  const canonicalEvents = new Set();

  const canonicalListMatch = content.match(
    /export\s+const\s+CANONICAL_EVENT_NAMES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/,
  );
  if (canonicalListMatch?.[1]) {
    for (const value of parseStringLiterals(canonicalListMatch[1])) {
      canonicalEvents.add(value);
    }
  }

  if (canonicalEvents.size > 0) {
    return {
      events: canonicalEvents,
      source: `${TAXONOMY_TS_PATH}#CANONICAL_EVENT_NAMES`,
    };
  }

  return null;
}

async function resolveTaxonomyMarkdownPath() {
  for (const candidate of TAXONOMY_MD_CANDIDATES) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error(
    `Canonical taxonomy not found. Tried:\n${TAXONOMY_MD_CANDIDATES.join("\n")}`,
  );
}

function parseCanonicalFromMarkdown(markdown) {
  const events = new Set();
  const tableEventPattern = /\|\s*`([a-z0-9_]+)`\s*\|/g;
  let match;
  while ((match = tableEventPattern.exec(markdown)) !== null) {
    events.add(match[1]);
  }
  return events;
}

function dedupeByEventName(records) {
  const seen = new Set();
  const deduped = [];

  for (const record of records) {
    if (seen.has(record.eventName)) {
      continue;
    }
    seen.add(record.eventName);
    deduped.push(record);
  }

  return deduped;
}

async function loadCanonicalEvents() {
  try {
    const tsContent = await fs.readFile(TAXONOMY_TS_PATH, "utf8");
    const parsed = parseCanonicalFromTaxonomyTs(tsContent);
    if (parsed) {
      return parsed;
    }
  } catch {
    // Fall through to markdown source.
  }

  const markdownPath = await resolveTaxonomyMarkdownPath();
  const markdown = await fs.readFile(markdownPath, "utf8");
  return {
    events: parseCanonicalFromMarkdown(markdown),
    source: markdownPath,
  };
}

async function main() {
  const canonical = await loadCanonicalEvents();

  const codeFiles = await walk(path.resolve(process.cwd(), "src"));
  const emittedRecords = [];

  for (const filePath of codeFiles) {
    const content = await fs.readFile(filePath, "utf8");
    emittedRecords.push(...collectEventsFromContent(content, filePath));
  }

  const uniqueEmittedRecords = dedupeByEventName(emittedRecords);
  const emittedEventNames = new Set(
    uniqueEmittedRecords.map((record) => record.eventName),
  );

  const unknown = uniqueEmittedRecords
    .filter((record) => !canonical.events.has(record.eventName))
    .sort((a, b) => a.eventName.localeCompare(b.eventName));

  const unused = Array.from(canonical.events)
    .filter((eventName) => !emittedEventNames.has(eventName))
    .sort();

  console.log("qa:events summary");
  console.log(`canonical_source: ${canonical.source}`);
  console.log(`canonical_events_count: ${canonical.events.size}`);
  console.log(`emitted_events_count: ${emittedEventNames.size}`);
  console.log(`unknown_emitted_events_count: ${unknown.length}`);
  console.log(`unused_canonical_events_count: ${unused.length}`);

  if (unknown.length > 0) {
    console.log("\nunknown_emitted_events:");
    for (const record of unknown) {
      console.log(`- ${record.eventName} @ ${record.filePath}:${record.line}`);
    }
  } else {
    console.log("\nunknown_emitted_events: none");
  }

  console.log("\nunused_canonical_events (info):");
  if (unused.length === 0) {
    console.log("- none");
  } else {
    for (const eventName of unused) {
      console.log(`- ${eventName}`);
    }
  }

  if (unknown.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error("qa:events FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
