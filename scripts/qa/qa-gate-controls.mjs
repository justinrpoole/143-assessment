#!/usr/bin/env node
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

const routes = [
  {
    name: 'challenge',
    path: '/challenge',
    controls: [
      { kind: 'placeholder', value: 'Your first name' },
      { kind: 'placeholder', value: 'you@example.com' },
      { kind: 'button', value: 'Unlock the 143 Workbook' },
    ],
  },
  {
    name: 'group-coaching',
    path: '/group-coaching',
    controls: [
      { kind: 'placeholder', value: 'Your name' },
      { kind: 'placeholder', value: 'you@example.com' },
      { kind: 'button', value: 'Unlock Cohort Details' },
    ],
  },
  {
    name: 'preview',
    path: '/preview',
    controls: [
      { kind: 'placeholder', value: 'Your name' },
      { kind: 'placeholder', value: 'you@example.com' },
      { kind: 'button', value: 'Unlock Free Stability Check' },
    ],
  },
  {
    name: 'rays-intention',
    path: '/rays/intention',
    controls: [
      { kind: 'placeholder', value: 'Your name' },
      { kind: 'placeholder', value: 'you@example.com' },
      { kind: 'button', value: 'Discover your Rays — free Stability Check' },
    ],
  },
];

async function assertControl(page, control) {
  if (control.kind === 'placeholder') {
    await page.getByPlaceholder(control.value).first().waitFor({ state: 'visible', timeout: 10000 });
    return;
  }

  if (control.kind === 'button') {
    await page.getByRole('button', { name: control.value }).first().waitFor({ state: 'visible', timeout: 10000 });
    return;
  }

  throw new Error(`Unknown control kind: ${control.kind}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const route of routes) {
      const context = await browser.newContext();
      const page = await context.newPage();
      try {
        const response = await page.goto(`${baseUrl}${route.path}`, { waitUntil: 'domcontentloaded' });
        if (!response || response.status() !== 200) {
          throw new Error(`[${route.name}] expected HTTP 200 but got ${response?.status() ?? 'no response'}`);
        }

        for (const control of route.controls) {
          await assertControl(page, control);
        }

        console.log(`ok:${route.name}:gate-controls`);
      } finally {
        await context.close();
      }
    }

    console.log('qa-gate-controls: ok');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('qa-gate-controls: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
