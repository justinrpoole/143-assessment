#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const argPath = process.argv.find((a) => a.startsWith('--file='))?.slice('--file='.length);
const target = argPath ? path.resolve(process.cwd(), argPath) : path.resolve(process.cwd(), 'progress.txt');

if (!fs.existsSync(target)) {
  console.log(`qa-loop-status-diagnostics: skip (missing file: ${target})`);
  process.exit(0);
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
};

console.log(`qa-loop-status-diagnostics: ${classification}`);
console.log(JSON.stringify(summary, null, 2));
