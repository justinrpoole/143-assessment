#!/usr/bin/env node
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const expected = 'Discover your Rays — free Stability Check';

const routes = [
  { name: 'upgrade-your-os', path: '/upgrade-your-os' },
  { name: 'rays-intention-gate', path: '/rays/intention' },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const route of routes) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded' });
        await page.getByText(expected, { exact: false }).first().waitFor({ state: 'visible', timeout: 10000 });
        console.log(`ok:${route.name}:${expected}`);
      } finally {
        await context.close();
      }
    }

    console.log('qa-cta-copy: ok');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('qa-cta-copy: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
