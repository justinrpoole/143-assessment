#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const marketingRoot = path.join(root, 'src', 'app', '(marketing)');
const expected = 'Discover your Rays — free Stability Check';

const filesToCheck = [
  path.join(marketingRoot, 'upgrade-your-os', 'page.tsx'),
  path.join(marketingRoot, 'rays', '[slug]', 'RayDetailGateClient.tsx'),
];

async function run() {
  for (const filePath of filesToCheck) {
    const raw = await readFile(filePath, 'utf8');
    if (!raw.includes(expected)) {
      throw new Error(`CTA copy drift in ${path.relative(root, filePath)} (missing: "${expected}")`);
    }
  }

  console.log('qa-cta-copy: ok');
}

run().catch((error) => {
  console.error('qa-cta-copy: failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
