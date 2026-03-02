#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const baseUrl = process.env.QA_BASE_URL || 'http://localhost:3000';
const fallbackPath = path.join(process.cwd(), '.next', 'email-captures-fallback.jsonl');

async function postCapture({ email, name, tag, forceFallback = false }) {
  const headers = { 'content-type': 'application/json' };
  if (forceFallback) headers['x-force-capture-fallback'] = '1';

  const res = await fetch(`${baseUrl}/api/email/capture`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email, name, tag }),
  });

  const body = await res.json().catch(() => ({}));
  return { status: res.status, body };
}

async function run() {
  // Baseline path should succeed.
  const normal = await postCapture({
    email: `qa.normal.${Date.now()}@example.com`,
    name: 'QA Normal',
    tag: 'qa-email-capture-normal',
  });

  if (normal.status !== 200 || normal.body?.ok !== true) {
    throw new Error(`Normal capture failed: ${normal.status} ${JSON.stringify(normal.body)}`);
  }

  // Fallback path should write JSONL record.
  await fs.rm(fallbackPath, { force: true });

  const forcedEmail = `qa.fallback.${Date.now()}@example.com`;
  const forcedTag = 'qa-email-capture-fallback';
  const forcedName = 'QA Fallback';

  const forced = await postCapture({
    email: forcedEmail,
    name: forcedName,
    tag: forcedTag,
    forceFallback: true,
  });

  if (forced.status !== 200 || forced.body?.ok !== true) {
    throw new Error(`Forced fallback capture failed: ${forced.status} ${JSON.stringify(forced.body)}`);
  }

  const raw = await fs.readFile(fallbackPath, 'utf8');
  const line = raw.trim().split('\n').at(-1);
  const record = JSON.parse(line || '{}');

  if (record.email !== forcedEmail) throw new Error('Fallback record email mismatch');
  if (record.source !== `${forcedTag}:${forcedName}`) throw new Error('Fallback record source mismatch');
  if (!record.captured_at) throw new Error('Fallback record missing captured_at');

  console.log('qa-email-capture-fallback: ok');
}

run().catch((error) => {
  console.error('qa-email-capture-fallback: failed');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
