#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const artifactDir = process.env.QA_ARTIFACTS_DIR || path.join(process.cwd(), '.qa-artifacts', 'gates-e2e');

const cases = [
  {
    name: 'challenge',
    path: '/challenge',
    preText: 'Unlock the 143 Workbook',
    preAbsentText: 'Your workbook is ready.',
    fill: async (page) => {
      await page.getByPlaceholder('Your first name').fill('QA Loop');
      await page.getByPlaceholder('you@example.com').fill(`qa.challenge.${Date.now()}@gmail.com`);
      await page.getByPlaceholder('you@example.com').press('Enter');
      const unlock = page.getByRole('button', { name: 'Unlock the 143 Workbook' });
      if (await unlock.isVisible().catch(() => false)) {
        await unlock.click().catch(() => {});
      }
    },
    postText: 'Your workbook is ready.',
  },
  {
    name: 'group-coaching',
    path: '/group-coaching',
    preText: 'Unlock Cohort Details',
    preAbsentText: 'Apply for the Next Cohort',
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
    preAbsentText: '3 questions. See where your light is strongest.',
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
    preAbsentText: 'Train your Intention this week',
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

async function assertHidden(page, text, label) {
  const locator = page.getByText(text, { exact: false }).first();
  const count = await locator.count();
  if (count > 0) {
    const visible = await locator.isVisible().catch(() => false);
    if (visible) {
      throw new Error(`Expected hidden text but found visible: ${text}`);
    }
  }
  console.log(`ok:${label}:hidden:${text}`);
}

function safeName(name) {
  return name.replace(/[^a-z0-9_-]/gi, '-').toLowerCase();
}

async function captureFailureArtifacts(page, spec, error) {
  await fs.mkdir(artifactDir, { recursive: true });
  const stamp = `${Date.now()}-${safeName(spec.name)}`;
  const screenshotPath = path.join(artifactDir, `${stamp}.png`);
  const htmlPath = path.join(artifactDir, `${stamp}.html`);
  const logPath = path.join(artifactDir, `${stamp}.txt`);

  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});
  const html = await page.content().catch(() => '<!-- failed to capture html -->');
  await fs.writeFile(htmlPath, html, 'utf8').catch(() => {});
  await fs.writeFile(logPath, String(error?.stack || error?.message || error), 'utf8').catch(() => {});
}

async function runCase(browser, spec) {
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}${spec.path}`, { waitUntil: 'domcontentloaded' });
    await assertVisible(page, spec.preText, `${spec.name}:pre`);
    if (spec.preAbsentText) {
      await assertHidden(page, spec.preAbsentText, `${spec.name}:pre-absent`);
    }
    await spec.fill(page);
    await assertVisible(page, spec.postText, `${spec.name}:post`);
  } catch (error) {
    await captureFailureArtifacts(page, spec, error);
    throw error;
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
  console.error(`qa-gates-e2e: artifacts -> ${artifactDir}`);
  process.exit(1);
});
