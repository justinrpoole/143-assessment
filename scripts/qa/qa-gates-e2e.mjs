#!/usr/bin/env node
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

const cases = [
  {
    name: 'challenge',
    path: '/challenge',
    preText: 'Unlock the 143 Workbook',
    fill: async (page) => {
      await page.getByPlaceholder('Your first name').fill('QA Loop');
      await page.getByPlaceholder('you@example.com').fill(`qa.challenge.${Date.now()}@gmail.com`);
      await page.getByRole('button', { name: 'Unlock the 143 Workbook' }).click();
    },
    postText: 'Your workbook is ready.',
  },
  {
    name: 'group-coaching',
    path: '/group-coaching',
    preText: 'Unlock Cohort Details',
    fill: async (page) => {
      await page.getByPlaceholder('Your name').fill('QA Loop');
      await page.getByPlaceholder('you@example.com').fill(`qa.gc.${Date.now()}@gmail.com`);
      await page.getByRole('button', { name: 'Unlock Cohort Details' }).click();
    },
    postText: 'Apply for the Next Cohort',
  },
  {
    name: 'preview',
    path: '/preview',
    preText: 'Unlock Free Stability Check',
    fill: async (page) => {
      await page.getByPlaceholder('Your name').fill('QA Loop');
      await page.getByPlaceholder('you@example.com').fill(`qa.preview.${Date.now()}@gmail.com`);
      await page.getByRole('button', { name: 'Unlock Free Stability Check' }).click();
    },
    postText: '3 questions. See where your light is strongest.',
  },
  {
    name: 'rays-intention',
    path: '/rays/intention',
    preText: 'Discover your Rays — free Stability Check',
    fill: async (page) => {
      await page.getByPlaceholder('Your name').fill('QA Loop');
      await page.getByPlaceholder('you@example.com').fill(`qa.ray.${Date.now()}@gmail.com`);
      await page.getByRole('button', { name: 'Discover your Rays — free Stability Check' }).click();
    },
    postText: 'Train your Intention this week',
  },
];

async function assertVisible(page, text, label) {
  await page.getByText(text, { exact: false }).first().waitFor({ state: 'visible', timeout: 10000 });
  console.log(`ok:${label}:${text}`);
}

async function runCase(browser, spec) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}${spec.path}`, { waitUntil: 'domcontentloaded' });
    await assertVisible(page, spec.preText, `${spec.name}:pre`);
    await spec.fill(page);
    await assertVisible(page, spec.postText, `${spec.name}:post`);
  } finally {
    await context.close();
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  try {
    for (const spec of cases) {
      await runCase(browser, spec);
    }
    console.log('qa-gates-e2e: ok');
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error('qa-gates-e2e: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
