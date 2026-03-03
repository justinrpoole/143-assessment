#!/usr/bin/env node

const baseUrl = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';

async function post(body) {
  const res = await fetch(`${baseUrl}/api/email/capture`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function postRaw(rawBody) {
  const res = await fetch(`${baseUrl}/api/email/capture`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: rawBody,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function postText(rawBody) {
  const res = await fetch(`${baseUrl}/api/email/capture`, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: rawBody,
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function run() {
  const valid = await post({ name: 'QA Contract', email: `qa.contract.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (valid.status !== 200 || valid.json?.ok !== true) {
    throw new Error(`valid payload contract failed: status=${valid.status} body=${JSON.stringify(valid.json)}`);
  }
  console.log('ok:email-capture:valid');

  const invalid = await post({ name: 'QA Contract', email: 'not-an-email', tag: 'qa-contract' });
  if (invalid.status !== 400 || invalid.json?.error !== 'invalid_email') {
    throw new Error(`invalid payload contract failed: status=${invalid.status} body=${JSON.stringify(invalid.json)}`);
  }
  console.log('ok:email-capture:invalid-email');

  const malformed = await postRaw('{"email":');
  if (malformed.status !== 400 || malformed.json?.error !== 'invalid_email') {
    throw new Error(`malformed json contract failed: status=${malformed.status} body=${JSON.stringify(malformed.json)}`);
  }
  console.log('ok:email-capture:malformed-json');

  const missingEmail = await post({ name: 'QA Contract', tag: 'qa-contract' });
  if (missingEmail.status !== 400 || missingEmail.json?.error !== 'invalid_email') {
    throw new Error(`missing email contract failed: status=${missingEmail.status} body=${JSON.stringify(missingEmail.json)}`);
  }
  console.log('ok:email-capture:missing-email');

  const nonJson = await postText('email=qa@example.com');
  if (nonJson.status !== 400 || nonJson.json?.error !== 'invalid_email') {
    throw new Error(`non-json content-type contract failed: status=${nonJson.status} body=${JSON.stringify(nonJson.json)}`);
  }
  console.log('ok:email-capture:non-json-content-type');

  console.log('qa-email-capture-contract: ok');
}

run().catch((error) => {
  console.error('qa-email-capture-contract: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
