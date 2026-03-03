#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const outPath = path.join(process.cwd(), '.qa-artifacts', 'gate-hero-copy.current.json');
const diffPath = path.join(process.cwd(), '.qa-artifacts', 'gate-hero-copy.diff.txt');
const baselinePath = path.join(process.cwd(), 'qa', 'baselines', 'gate-hero-copy.baseline.json');
const updateBaseline = process.env.QA_UPDATE_BASELINE === '1';

const checks = [
  {
    name: 'challenge',
    path: '/challenge',
    mustInclude: [
      '143 means I love you. Here is the challenge.',
      'Enter your name and email to unlock the workbook instantly.',
      'Unlock the 143 Workbook',
    ],
  },
  {
    name: 'group-coaching',
    path: '/group-coaching',
    mustInclude: [
      'Enter your name and email to unlock full cohort details.',
      'Quick gate first. Full coaching details and application appear right after.',
      'Unlock Cohort Details',
    ],
  },
  {
    name: 'preview',
    path: '/preview',
    mustInclude: [
      'Enter your name and email to unlock your 3-question check.',
      '3 questions. 3 minutes. Free Stability Check with email unlock.',
      'Unlock Free Stability Check',
    ],
  },
  {
    name: 'rays-intention',
    path: '/rays/intention',
    mustInclude: [
      'Discover your Rays',
      'Unlock the full Intention breakdown.',
      'Get a quick Stability Check first, then access the full ray science and coaching reps.',
    ],
  },
];

function excerpt(value) {
  return String(value || '').slice(0, 160).replace(/\s+/g, ' ');
}

function wrapLines(value, width = 110) {
  const text = String(value || '');
  const out = [];
  for (let i = 0; i < text.length; i += width) {
    out.push(text.slice(i, i + width));
  }
  return out;
}

function compactLineDiff(baselineText, currentText) {
  const base = wrapLines(baselineText);
  const curr = wrapLines(currentText);
  const max = Math.max(base.length, curr.length);
  const lines = [];

  for (let i = 0; i < max; i += 1) {
    const b = base[i] ?? '';
    const c = curr[i] ?? '';
    if (b !== c) {
      lines.push(`  line ${i + 1}`);
      lines.push(`    - ${b}`);
      lines.push(`    + ${c}`);
    }
    if (lines.length >= 12) break;
  }

  return lines.join('\n');
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const snapshot = { generatedAt: new Date().toISOString(), routes: {} };

  try {
    for (const check of checks) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        await page.goto(`${baseUrl}${check.path}`, { waitUntil: 'domcontentloaded' });
        const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ').trim();
        snapshot.routes[check.name] = text.slice(0, 700);

        for (const expected of check.mustInclude) {
          if (!text.includes(expected)) {
            throw new Error(`[${check.name}] missing expected copy: ${expected}`);
          }
        }

        console.log(`ok:${check.name}:hero-copy`);
      } finally {
        await context.close();
      }
    }

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, JSON.stringify(snapshot, null, 2), 'utf8');

    const normalized = { routes: snapshot.routes };

    if (updateBaseline) {
      await fs.mkdir(path.dirname(baselinePath), { recursive: true });
      await fs.writeFile(baselinePath, JSON.stringify(normalized, null, 2), 'utf8');
      console.log(`qa-gate-hero-snapshot: baseline updated (${baselinePath})`);
      console.log(`qa-gate-hero-snapshot: ok (${outPath})`);
      return;
    }

    const baselineRaw = await fs.readFile(baselinePath, 'utf8');
    const baseline = JSON.parse(baselineRaw);

    const drifts = [];
    for (const check of checks) {
      const routeName = check.name;
      const currentText = normalized.routes[routeName] ?? '';
      const baselineText = baseline?.routes?.[routeName] ?? '';
      if (currentText !== baselineText) {
        drifts.push(
          `- ${routeName}\n  baseline: ${excerpt(baselineText)}\n  current:  ${excerpt(currentText)}\n${compactLineDiff(baselineText, currentText)}`,
        );
      }
    }

    if (drifts.length > 0) {
      const report = `Gate hero copy drift detected (compact diff).\n${drifts.join('\n')}`;
      await fs.writeFile(diffPath, `${report}\n`, 'utf8');
      throw new Error(report);
    }

    await fs.writeFile(diffPath, 'No gate-hero copy drift detected.\n', 'utf8');
    console.log(`qa-gate-hero-snapshot: ok (${outPath})`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('qa-gate-hero-snapshot: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
