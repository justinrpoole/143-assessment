#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const argPath = process.argv.find((a) => a.startsWith('--file='))?.slice('--file='.length);
const strictUnclassified = process.argv.includes('--strict-unclassified');
const expectClassification = process.argv.find((a) => a.startsWith('--expect='))?.slice('--expect='.length);
const writeJson = process.argv.includes('--write-json');
const checkDrift = process.argv.includes('--check-drift');
let target = argPath
  ? path.resolve(process.cwd(), argPath)
  : path.resolve(process.cwd(), '.qa-artifacts/loop-status.current.log');

if (!fs.existsSync(target)) {
  const fallback = path.resolve(process.cwd(), 'progress.txt');
  if (argPath || !fs.existsSync(fallback)) {
    console.log(`qa-loop-status-diagnostics: skip (missing file: ${target})`);
    process.exit(0);
  }
  console.log(`qa-loop-status-diagnostics: fallback -> ${path.relative(process.cwd(), fallback)}`);
  target = fallback;
}

const text = fs.readFileSync(target, 'utf8');
const lines = text.split(/\r?\n/);

const unknownLines = lines.filter((l) => /\bunknown\s+—/.test(l) || /\bunknown\b/i.test(l));
const timeoutFlakeLines = lines.filter(
  (l) =>
    /locator\.click:\s*Timeout\s*30000ms\s*exceeded/i.test(l) ||
    /qa:gates-e2e/i.test(l) ||
    /qa-gates-e2e\.mjs/i.test(l)
);

let classification = 'UNKNOWN_ABSENT';
if (unknownLines.length > 0 && timeoutFlakeLines.length > 0) classification = 'UNKNOWN_LIKELY_FLAKE';
if (unknownLines.length > 0 && timeoutFlakeLines.length === 0) classification = 'UNKNOWN_UNCLASSIFIED';

const summary = {
  file: path.relative(process.cwd(), target),
  unknownCount: unknownLines.length,
  timeoutFlakeSignalCount: timeoutFlakeLines.length,
  classification,
  createdAt: new Date().toISOString(),
};

if (writeJson || checkDrift) {
  const outDir = path.resolve(process.cwd(), '.qa-artifacts');
  fs.mkdirSync(outDir, { recursive: true });
  const timestamp = summary.createdAt.replace(/[.:]/g, '-');
  const outFile = path.join(outDir, `loop-status-summary.${timestamp}.json`);
  fs.writeFileSync(outFile, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
  summary.summaryFile = path.relative(process.cwd(), outFile);

  if (checkDrift) {
    const previous = fs
      .readdirSync(outDir)
      .filter((name) => /^loop-status-summary\..+\.json$/.test(name) && name !== path.basename(outFile))
      .sort();
    const latestPrev = previous.at(-1);
    if (latestPrev) {
      const prevSummary = JSON.parse(fs.readFileSync(path.join(outDir, latestPrev), 'utf8'));
      summary.previousSummaryFile = path.relative(process.cwd(), path.join(outDir, latestPrev));
      summary.driftDetected = prevSummary.classification !== summary.classification;
      if (summary.driftDetected) {
        console.error(
          `qa-loop-status-diagnostics: classification drift ${prevSummary.classification} -> ${summary.classification}`
        );
        process.exit(1);
      }
    }
  }
}

console.log(`qa-loop-status-diagnostics: ${classification}`);
console.log(JSON.stringify(summary, null, 2));

if (expectClassification && classification !== expectClassification) {
  console.error(
    `qa-loop-status-diagnostics: expected ${expectClassification} but got ${classification}`
  );
  process.exit(1);
}

if (strictUnclassified && classification === 'UNKNOWN_UNCLASSIFIED') {
  console.error('qa-loop-status-diagnostics: strict mode failed on UNKNOWN_UNCLASSIFIED');
  process.exit(1);
}
