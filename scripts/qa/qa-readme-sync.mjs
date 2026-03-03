#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const readmePath = path.join(root, 'README.md');
const packagePath = path.join(root, 'package.json');

const REQUIRED_SCRIPTS = ['qa:gates-e2e', 'qa:capture-fallback'];

async function run() {
  const [readmeRaw, pkgRaw] = await Promise.all([
    readFile(readmePath, 'utf8'),
    readFile(packagePath, 'utf8'),
  ]);

  const pkg = JSON.parse(pkgRaw);
  const scripts = pkg?.scripts ?? {};

  for (const name of REQUIRED_SCRIPTS) {
    if (!scripts[name]) {
      throw new Error(`Missing package.json script: ${name}`);
    }
    if (!readmeRaw.includes(`npm run ${name}`)) {
      throw new Error(`README.md missing command reference: npm run ${name}`);
    }
  }

  const workflowLink = 'actions/workflows/qa-gates-e2e.yml';
  if (!readmeRaw.includes(workflowLink)) {
    throw new Error(`README.md missing QA workflow badge/link target: ${workflowLink}`);
  }

  console.log('qa-readme-sync: ok');
}

run().catch((error) => {
  console.error('qa-readme-sync: failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
