#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const nArg = process.argv.find((a) => a.startsWith('--n='));
const n = Math.max(2, Number.parseInt(nArg?.slice(4) ?? '5', 10) || 5);
const dir = path.resolve(process.cwd(), '.qa-artifacts');

if (!fs.existsSync(dir)) {
  console.log('qa-loop-status-trend: steady (no summaries found)');
  process.exit(0);
}

const files = fs
  .readdirSync(dir)
  .filter((name) => /^loop-status-summary\..+\.json$/.test(name))
  .sort()
  .slice(-n);

if (files.length === 0) {
  console.log('qa-loop-status-trend: steady (no summaries found)');
  process.exit(0);
}

const classes = files.map((name) => {
  const payload = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
  return payload.classification || 'UNKNOWN';
});

const unique = [...new Set(classes)];
const signal = unique.length === 1 ? 'steady' : 'flapping';
console.log(`qa-loop-status-trend: ${signal} (${classes.join(' -> ')})`);
