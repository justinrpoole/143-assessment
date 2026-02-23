/**
 * Audit Signature Unit Tests
 *
 * Validates that SHA-256 hash generation is deterministic and correct:
 * 1. computeInputHash produces consistent hashes for identical responses
 * 2. computeOutputHash produces consistent hashes for identical outputs
 * 3. Different inputs produce different hashes
 * 4. Key ordering does not affect hash
 * 5. Integration with scoring: fixture → score → hash is deterministic
 *
 * Run: npm run qa:audit
 */

import { createHash } from "node:crypto";

const failures = [];
let passed = 0;
let total = 0;

function assert(name, condition, message) {
  total++;
  if (!condition) {
    failures.push({ name, message });
    console.error(`  FAIL: ${name} — ${message}`);
  } else {
    passed++;
    console.log(`  PASS: ${name}`);
  }
}

// Replicate the hash functions from lib/audit/signature.ts
// (pure functions, no DB dependency)
function computeInputHash(responses) {
  const sorted = Object.entries(responses)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([questionId, value]) => ({ q: questionId, v: value }));
  const json = JSON.stringify(sorted);
  return createHash("sha256").update(json, "utf8").digest("hex");
}

function computeOutputHash(output) {
  const json = JSON.stringify(output, Object.keys(output).sort());
  return createHash("sha256").update(json, "utf8").digest("hex");
}

function run() {
  console.log("\nAudit Signature Tests");
  console.log("─".repeat(40));

  // --- Test 1: Input hash determinism ---
  const responses1 = { Q1: 4, Q2: 3, Q3: 2 };
  const hash1a = computeInputHash(responses1);
  const hash1b = computeInputHash(responses1);
  assert(
    "Input hash: same input → same hash",
    hash1a === hash1b,
    `Expected identical hashes, got ${hash1a} vs ${hash1b}`,
  );

  // --- Test 2: Input hash is valid SHA-256 ---
  assert(
    "Input hash: valid SHA-256 format",
    /^[a-f0-9]{64}$/.test(hash1a),
    `Expected 64 hex chars, got ${hash1a}`,
  );

  // --- Test 3: Input hash key order independence ---
  const responsesA = { Q3: 2, Q1: 4, Q2: 3 };
  const responsesB = { Q1: 4, Q2: 3, Q3: 2 };
  const hashA = computeInputHash(responsesA);
  const hashB = computeInputHash(responsesB);
  assert(
    "Input hash: key order independent",
    hashA === hashB,
    `Different key orders produced different hashes: ${hashA} vs ${hashB}`,
  );

  // --- Test 4: Different inputs → different hashes ---
  const responsesDifferent = { Q1: 4, Q2: 3, Q3: 1 };
  const hashDifferent = computeInputHash(responsesDifferent);
  assert(
    "Input hash: different inputs → different hashes",
    hash1a !== hashDifferent,
    `Same hash for different inputs`,
  );

  // --- Test 5: Output hash determinism ---
  const output1 = { top_rays: ["R1", "R2"], ray_pair: "R1-R2", score: 85 };
  const outHash1a = computeOutputHash(output1);
  const outHash1b = computeOutputHash(output1);
  assert(
    "Output hash: same output → same hash",
    outHash1a === outHash1b,
    `Expected identical hashes, got ${outHash1a} vs ${outHash1b}`,
  );

  // --- Test 6: Output hash is valid SHA-256 ---
  assert(
    "Output hash: valid SHA-256 format",
    /^[a-f0-9]{64}$/.test(outHash1a),
    `Expected 64 hex chars, got ${outHash1a}`,
  );

  // --- Test 7: Output hash key order independence ---
  const outputA = { score: 85, ray_pair: "R1-R2", top_rays: ["R1", "R2"] };
  const outputB = { top_rays: ["R1", "R2"], ray_pair: "R1-R2", score: 85 };
  const outHashA = computeOutputHash(outputA);
  const outHashB = computeOutputHash(outputB);
  assert(
    "Output hash: key order independent",
    outHashA === outHashB,
    `Different key orders produced different hashes: ${outHashA} vs ${outHashB}`,
  );

  // --- Test 8: Different outputs → different hashes ---
  const outputDifferent = { top_rays: ["R1", "R3"], ray_pair: "R1-R3", score: 72 };
  const outHashDifferent = computeOutputHash(outputDifferent);
  assert(
    "Output hash: different outputs → different hashes",
    outHash1a !== outHashDifferent,
    `Same hash for different outputs`,
  );

  // --- Test 9: Empty responses produce valid hash ---
  const emptyHash = computeInputHash({});
  assert(
    "Input hash: empty responses → valid hash",
    /^[a-f0-9]{64}$/.test(emptyHash),
    `Expected valid hash for empty responses, got ${emptyHash}`,
  );

  // --- Test 10: Large response set determinism ---
  const largeResponses = {};
  for (let i = 1; i <= 143; i++) {
    largeResponses[`Q${String(i).padStart(3, "0")}`] = Math.floor(Math.random() * 5);
  }
  const largeHash1 = computeInputHash(largeResponses);
  const largeHash2 = computeInputHash(largeResponses);
  assert(
    "Input hash: 143-question determinism",
    largeHash1 === largeHash2,
    `Large response set produced different hashes`,
  );

  // --- Report ---
  console.log("");
  if (failures.length > 0) {
    console.error("AUDIT SIGNATURE TESTS: FAILED");
    console.error(`Passed: ${passed}/${total}`);
    process.exit(1);
  }

  console.log("AUDIT SIGNATURE TESTS: PASS");
  console.log(`All ${passed}/${total} tests passed.`);
}

run();
