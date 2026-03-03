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

  const normalized = await post({ name: 'QA Contract', email: '  QA.Normalize+Loop@Example.COM  ', tag: 'qa-contract' });
  if (normalized.status !== 200 || normalized.json?.ok !== true) {
    throw new Error(`normalized email contract failed: status=${normalized.status} body=${JSON.stringify(normalized.json)}`);
  }
  console.log('ok:email-capture:normalized-email');

  const dupEmail = `qa.dup.${Date.now()}@example.com`;
  const firstDup = await post({ name: 'QA Contract', email: dupEmail, tag: 'qa-contract' });
  const secondDup = await post({ name: 'QA Contract', email: dupEmail, tag: 'qa-contract' });
  if (firstDup.status !== 200 || firstDup.json?.ok !== true || secondDup.status !== 200 || secondDup.json?.ok !== true) {
    throw new Error(
      `duplicate email contract failed: first=${firstDup.status}/${JSON.stringify(firstDup.json)} second=${secondDup.status}/${JSON.stringify(secondDup.json)}`,
    );
  }
  console.log('ok:email-capture:duplicate-idempotent');

  const longName = 'Q'.repeat(1024);
  const longNameRes = await post({ name: longName, email: `qa.longname.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (longNameRes.status !== 200 || longNameRes.json?.ok !== true) {
    throw new Error(`long name contract failed: status=${longNameRes.status} body=${JSON.stringify(longNameRes.json)}`);
  }
  console.log('ok:email-capture:long-name');

  const longTag = 'tag-' + 'x'.repeat(2048);
  const longTagRes = await post({ name: 'QA Contract', email: `qa.longtag.${Date.now()}@example.com`, tag: longTag });
  if (longTagRes.status !== 200 || longTagRes.json?.ok !== true) {
    throw new Error(`long tag contract failed: status=${longTagRes.status} body=${JSON.stringify(longTagRes.json)}`);
  }
  console.log('ok:email-capture:long-tag');

  const missingTagRes = await post({ name: 'QA Contract', email: `qa.missingtag.${Date.now()}@example.com` });
  if (missingTagRes.status !== 200 || missingTagRes.json?.ok !== true) {
    throw new Error(`missing tag contract failed: status=${missingTagRes.status} body=${JSON.stringify(missingTagRes.json)}`);
  }
  console.log('ok:email-capture:missing-tag-default');

  const emptyTagRes = await post({ name: 'QA Contract', email: `qa.emptytag.${Date.now()}@example.com`, tag: '' });
  if (emptyTagRes.status !== 200 || emptyTagRes.json?.ok !== true) {
    throw new Error(`empty tag contract failed: status=${emptyTagRes.status} body=${JSON.stringify(emptyTagRes.json)}`);
  }
  console.log('ok:email-capture:empty-tag-default');

  const whitespaceTagRes = await post({ name: 'QA Contract', email: `qa.whitespacetag.${Date.now()}@example.com`, tag: '    ' });
  if (whitespaceTagRes.status !== 200 || whitespaceTagRes.json?.ok !== true) {
    throw new Error(`whitespace tag contract failed: status=${whitespaceTagRes.status} body=${JSON.stringify(whitespaceTagRes.json)}`);
  }
  console.log('ok:email-capture:whitespace-tag-default');

  const unicodeRes = await post({
    name: 'Jústin 🚀 光',
    email: `qa.unicode.${Date.now()}@example.com`,
    tag: 'ünicode-✨-タグ',
  });
  if (unicodeRes.status !== 200 || unicodeRes.json?.ok !== true) {
    throw new Error(`unicode input contract failed: status=${unicodeRes.status} body=${JSON.stringify(unicodeRes.json)}`);
  }
  console.log('ok:email-capture:unicode-name-tag');

  const longLocal = 'l'.repeat(64);
  const longDomainLabel = 'd'.repeat(63);
  const boundaryEmail = `${longLocal}@${longDomainLabel}.${longDomainLabel}.com`;
  const boundaryRes = await post({ name: 'QA Contract', email: boundaryEmail, tag: 'qa-contract' });
  if (boundaryRes.status !== 200 || boundaryRes.json?.ok !== true) {
    throw new Error(`email boundary contract failed: status=${boundaryRes.status} body=${JSON.stringify(boundaryRes.json)}`);
  }
  console.log('ok:email-capture:boundary-email-shape');

  const overlongLocalEmail = `${'x'.repeat(65)}@${longDomainLabel}.com`;
  const overlongLocalRes = await post({ name: 'QA Contract', email: overlongLocalEmail, tag: 'qa-contract' });
  if (overlongLocalRes.status !== 400 || overlongLocalRes.json?.error !== 'invalid_email') {
    throw new Error(`overlong local-part contract failed: status=${overlongLocalRes.status} body=${JSON.stringify(overlongLocalRes.json)}`);
  }
  console.log('ok:email-capture:overlong-local-invalid');

  const overlongDomainLabelEmail = `qa@${'y'.repeat(64)}.com`;
  const overlongDomainLabelRes = await post({ name: 'QA Contract', email: overlongDomainLabelEmail, tag: 'qa-contract' });
  if (overlongDomainLabelRes.status !== 400 || overlongDomainLabelRes.json?.error !== 'invalid_email') {
    throw new Error(
      `overlong domain-label contract failed: status=${overlongDomainLabelRes.status} body=${JSON.stringify(overlongDomainLabelRes.json)}`,
    );
  }
  console.log('ok:email-capture:overlong-domain-label-invalid');

  const singleLabelDomainRes = await post({ name: 'QA Contract', email: 'user@localhost', tag: 'qa-contract' });
  if (singleLabelDomainRes.status !== 400 || singleLabelDomainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `single-label domain contract failed: status=${singleLabelDomainRes.status} body=${JSON.stringify(singleLabelDomainRes.json)}`,
    );
  }
  console.log('ok:email-capture:single-label-domain-invalid');

  const leadingHyphenLabelRes = await post({ name: 'QA Contract', email: 'user@-bad.com', tag: 'qa-contract' });
  if (leadingHyphenLabelRes.status !== 400 || leadingHyphenLabelRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading-hyphen label contract failed: status=${leadingHyphenLabelRes.status} body=${JSON.stringify(leadingHyphenLabelRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-hyphen-label-invalid');

  const trailingHyphenLabelRes = await post({ name: 'QA Contract', email: 'user@bad-.com', tag: 'qa-contract' });
  if (trailingHyphenLabelRes.status !== 400 || trailingHyphenLabelRes.json?.error !== 'invalid_email') {
    throw new Error(
      `trailing-hyphen label contract failed: status=${trailingHyphenLabelRes.status} body=${JSON.stringify(trailingHyphenLabelRes.json)}`,
    );
  }
  console.log('ok:email-capture:trailing-hyphen-label-invalid');

  const consecutiveDotRes = await post({ name: 'QA Contract', email: 'user@bad..com', tag: 'qa-contract' });
  if (consecutiveDotRes.status !== 400 || consecutiveDotRes.json?.error !== 'invalid_email') {
    throw new Error(
      `consecutive-dot domain contract failed: status=${consecutiveDotRes.status} body=${JSON.stringify(consecutiveDotRes.json)}`,
    );
  }
  console.log('ok:email-capture:consecutive-dot-domain-invalid');

  const consecutiveDotLocalRes = await post({ name: 'QA Contract', email: 'us..er@example.com', tag: 'qa-contract' });
  if (consecutiveDotLocalRes.status !== 400 || consecutiveDotLocalRes.json?.error !== 'invalid_email') {
    throw new Error(
      `consecutive-dot local contract failed: status=${consecutiveDotLocalRes.status} body=${JSON.stringify(consecutiveDotLocalRes.json)}`,
    );
  }
  console.log('ok:email-capture:consecutive-dot-local-invalid');

  const leadingDotLocalRes = await post({ name: 'QA Contract', email: '.user@example.com', tag: 'qa-contract' });
  if (leadingDotLocalRes.status !== 400 || leadingDotLocalRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading-dot local contract failed: status=${leadingDotLocalRes.status} body=${JSON.stringify(leadingDotLocalRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-local-invalid');

  const trailingDotLocalRes = await post({ name: 'QA Contract', email: 'user.@example.com', tag: 'qa-contract' });
  if (trailingDotLocalRes.status !== 400 || trailingDotLocalRes.json?.error !== 'invalid_email') {
    throw new Error(
      `trailing-dot local contract failed: status=${trailingDotLocalRes.status} body=${JSON.stringify(trailingDotLocalRes.json)}`,
    );
  }
  console.log('ok:email-capture:trailing-dot-local-invalid');

  const whitespaceEmailRes = await post({ name: 'QA Contract', email: '    ', tag: 'qa-contract' });
  if (whitespaceEmailRes.status !== 400 || whitespaceEmailRes.json?.error !== 'invalid_email') {
    throw new Error(
      `whitespace-only email contract failed: status=${whitespaceEmailRes.status} body=${JSON.stringify(whitespaceEmailRes.json)}`,
    );
  }
  console.log('ok:email-capture:whitespace-only-email-invalid');

  console.log('qa-email-capture-contract: ok');
}

run().catch((error) => {
  console.error('qa-email-capture-contract: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
