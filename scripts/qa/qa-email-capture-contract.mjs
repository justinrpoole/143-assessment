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

  const plusAddressingRes = await post({ name: 'QA Contract', email: `qa.plus+tag.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (plusAddressingRes.status !== 200 || plusAddressingRes.json?.ok !== true) {
    throw new Error(`plus-addressing contract failed: status=${plusAddressingRes.status} body=${JSON.stringify(plusAddressingRes.json)}`);
  }
  console.log('ok:email-capture:plus-addressing-valid');

  const underscoreLocalRes = await post({ name: 'QA Contract', email: `qa_user.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (underscoreLocalRes.status !== 200 || underscoreLocalRes.json?.ok !== true) {
    throw new Error(`underscore local-part contract failed: status=${underscoreLocalRes.status} body=${JSON.stringify(underscoreLocalRes.json)}`);
  }
  console.log('ok:email-capture:underscore-local-valid');

  const apostropheLocalRes = await post({ name: 'QA Contract', email: `oconnor.o'connor.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (apostropheLocalRes.status !== 200 || apostropheLocalRes.json?.ok !== true) {
    throw new Error(`apostrophe local-part contract failed: status=${apostropheLocalRes.status} body=${JSON.stringify(apostropheLocalRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-local-valid');

  const apostropheHyphenInternalRes = await post({ name: 'QA Contract', email: `oconnor-a.o'connor.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (apostropheHyphenInternalRes.status !== 200 || apostropheHyphenInternalRes.json?.ok !== true) {
    throw new Error(`apostrophe-hyphen internal local contract failed: status=${apostropheHyphenInternalRes.status} body=${JSON.stringify(apostropheHyphenInternalRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-hyphen-internal-valid');

  const apostropheBoundaryRes = await post({ name: 'QA Contract', email: `'oconnor@example.com`, tag: 'qa-contract' });
  if (apostropheBoundaryRes.status !== 400 || apostropheBoundaryRes.json?.error !== 'invalid_email') {
    throw new Error(`leading-apostrophe local contract failed: status=${apostropheBoundaryRes.status} body=${JSON.stringify(apostropheBoundaryRes.json)}`);
  }
  console.log('ok:email-capture:leading-apostrophe-local-invalid');

  const apostropheDotLeadingRes = await post({ name: 'QA Contract', email: `'.user@example.com`, tag: 'qa-contract' });
  if (apostropheDotLeadingRes.status !== 400 || apostropheDotLeadingRes.json?.error !== 'invalid_email') {
    throw new Error(`leading apostrophe-dot chain contract failed: status=${apostropheDotLeadingRes.status} body=${JSON.stringify(apostropheDotLeadingRes.json)}`);
  }
  console.log('ok:email-capture:leading-apostrophe-dot-chain-invalid');

  const trailingApostropheRes = await post({ name: 'QA Contract', email: `oconnor'@example.com`, tag: 'qa-contract' });
  if (trailingApostropheRes.status !== 400 || trailingApostropheRes.json?.error !== 'invalid_email') {
    throw new Error(`trailing-apostrophe local contract failed: status=${trailingApostropheRes.status} body=${JSON.stringify(trailingApostropheRes.json)}`);
  }
  console.log('ok:email-capture:trailing-apostrophe-local-invalid');

  const apostropheHyphenComboRes = await post({ name: 'QA Contract', email: `user'-@example.com`, tag: 'qa-contract' });
  if (apostropheHyphenComboRes.status !== 400 || apostropheHyphenComboRes.json?.error !== 'invalid_email') {
    throw new Error(`apostrophe-hyphen combo contract failed: status=${apostropheHyphenComboRes.status} body=${JSON.stringify(apostropheHyphenComboRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-hyphen-combo-invalid');

  const apostrophePlusComboRes = await post({ name: 'QA Contract', email: `user'+@example.com`, tag: 'qa-contract' });
  if (apostrophePlusComboRes.status !== 400 || apostrophePlusComboRes.json?.error !== 'invalid_email') {
    throw new Error(`apostrophe-plus combo contract failed: status=${apostrophePlusComboRes.status} body=${JSON.stringify(apostrophePlusComboRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-plus-combo-invalid');

  const plusApostropheComboRes = await post({ name: 'QA Contract', email: `user+'@example.com`, tag: 'qa-contract' });
  if (plusApostropheComboRes.status !== 400 || plusApostropheComboRes.json?.error !== 'invalid_email') {
    throw new Error(`plus-apostrophe combo contract failed: status=${plusApostropheComboRes.status} body=${JSON.stringify(plusApostropheComboRes.json)}`);
  }
  console.log('ok:email-capture:plus-apostrophe-combo-invalid');

  const apostropheUnderscoreComboRes = await post({ name: 'QA Contract', email: `user'_@example.com`, tag: 'qa-contract' });
  if (apostropheUnderscoreComboRes.status !== 400 || apostropheUnderscoreComboRes.json?.error !== 'invalid_email') {
    throw new Error(`apostrophe-underscore combo contract failed: status=${apostropheUnderscoreComboRes.status} body=${JSON.stringify(apostropheUnderscoreComboRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-underscore-combo-invalid');

  const underscoreApostropheComboRes = await post({ name: 'QA Contract', email: `user_'@example.com`, tag: 'qa-contract' });
  if (underscoreApostropheComboRes.status !== 400 || underscoreApostropheComboRes.json?.error !== 'invalid_email') {
    throw new Error(`underscore-apostrophe combo contract failed: status=${underscoreApostropheComboRes.status} body=${JSON.stringify(underscoreApostropheComboRes.json)}`);
  }
  console.log('ok:email-capture:underscore-apostrophe-combo-invalid');

  const apostropheDotComboRes = await post({ name: 'QA Contract', email: `user'.@example.com`, tag: 'qa-contract' });
  if (apostropheDotComboRes.status !== 400 || apostropheDotComboRes.json?.error !== 'invalid_email') {
    throw new Error(`apostrophe-dot combo contract failed: status=${apostropheDotComboRes.status} body=${JSON.stringify(apostropheDotComboRes.json)}`);
  }
  console.log('ok:email-capture:apostrophe-dot-combo-invalid');

  const dotApostropheComboRes = await post({ name: 'QA Contract', email: `user.'@example.com`, tag: 'qa-contract' });
  if (dotApostropheComboRes.status !== 400 || dotApostropheComboRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-apostrophe combo contract failed: status=${dotApostropheComboRes.status} body=${JSON.stringify(dotApostropheComboRes.json)}`);
  }
  console.log('ok:email-capture:dot-apostrophe-combo-invalid');

  const plusDotComboRes = await post({ name: 'QA Contract', email: `user+.@example.com`, tag: 'qa-contract' });
  if (plusDotComboRes.status !== 400 || plusDotComboRes.json?.error !== 'invalid_email') {
    throw new Error(`plus-dot combo contract failed: status=${plusDotComboRes.status} body=${JSON.stringify(plusDotComboRes.json)}`);
  }
  console.log('ok:email-capture:plus-dot-combo-invalid');

  const dotPlusComboRes = await post({ name: 'QA Contract', email: `user.+@example.com`, tag: 'qa-contract' });
  if (dotPlusComboRes.status !== 400 || dotPlusComboRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-plus combo contract failed: status=${dotPlusComboRes.status} body=${JSON.stringify(dotPlusComboRes.json)}`);
  }
  console.log('ok:email-capture:dot-plus-combo-invalid');

  const percentLocalRes = await post({ name: 'QA Contract', email: `qa%tag.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (percentLocalRes.status !== 400 || percentLocalRes.json?.error !== 'invalid_email') {
    throw new Error(`percent local-part contract failed: status=${percentLocalRes.status} body=${JSON.stringify(percentLocalRes.json)}`);
  }
  console.log('ok:email-capture:percent-local-invalid');

  const trailingPlusRes = await post({ name: 'QA Contract', email: 'user+@example.com', tag: 'qa-contract' });
  if (trailingPlusRes.status !== 400 || trailingPlusRes.json?.error !== 'invalid_email') {
    throw new Error(`trailing-plus local contract failed: status=${trailingPlusRes.status} body=${JSON.stringify(trailingPlusRes.json)}`);
  }
  console.log('ok:email-capture:trailing-plus-local-invalid');

  const leadingPlusRes = await post({ name: 'QA Contract', email: '+user@example.com', tag: 'qa-contract' });
  if (leadingPlusRes.status !== 400 || leadingPlusRes.json?.error !== 'invalid_email') {
    throw new Error(`leading-plus local contract failed: status=${leadingPlusRes.status} body=${JSON.stringify(leadingPlusRes.json)}`);
  }
  console.log('ok:email-capture:leading-plus-local-invalid');

  const leadingPlusDotChainRes = await post({ name: 'QA Contract', email: '+.user@example.com', tag: 'qa-contract' });
  if (leadingPlusDotChainRes.status !== 400 || leadingPlusDotChainRes.json?.error !== 'invalid_email') {
    throw new Error(`leading plus-dot chain contract failed: status=${leadingPlusDotChainRes.status} body=${JSON.stringify(leadingPlusDotChainRes.json)}`);
  }
  console.log('ok:email-capture:leading-plus-dot-chain-invalid');

  const stackedPlusRes = await post({ name: 'QA Contract', email: 'user++tag@example.com', tag: 'qa-contract' });
  if (stackedPlusRes.status !== 400 || stackedPlusRes.json?.error !== 'invalid_email') {
    throw new Error(`stacked-plus local contract failed: status=${stackedPlusRes.status} body=${JSON.stringify(stackedPlusRes.json)}`);
  }
  console.log('ok:email-capture:stacked-plus-local-invalid');

  const trailingHyphenLocalRes = await post({ name: 'QA Contract', email: 'user-@example.com', tag: 'qa-contract' });
  if (trailingHyphenLocalRes.status !== 400 || trailingHyphenLocalRes.json?.error !== 'invalid_email') {
    throw new Error(`trailing-hyphen local contract failed: status=${trailingHyphenLocalRes.status} body=${JSON.stringify(trailingHyphenLocalRes.json)}`);
  }
  console.log('ok:email-capture:trailing-hyphen-local-invalid');

  const dotHyphenBoundaryRes = await post({ name: 'QA Contract', email: 'user.-@example.com', tag: 'qa-contract' });
  if (dotHyphenBoundaryRes.status !== 400 || dotHyphenBoundaryRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-hyphen boundary contract failed: status=${dotHyphenBoundaryRes.status} body=${JSON.stringify(dotHyphenBoundaryRes.json)}`);
  }
  console.log('ok:email-capture:dot-hyphen-boundary-invalid');

  const leadingHyphenLocalRes = await post({ name: 'QA Contract', email: '-user@example.com', tag: 'qa-contract' });
  if (leadingHyphenLocalRes.status !== 400 || leadingHyphenLocalRes.json?.error !== 'invalid_email') {
    throw new Error(`leading-hyphen local contract failed: status=${leadingHyphenLocalRes.status} body=${JSON.stringify(leadingHyphenLocalRes.json)}`);
  }
  console.log('ok:email-capture:leading-hyphen-local-invalid');

  const leadingChainRes = await post({ name: 'QA Contract', email: '-.user@example.com', tag: 'qa-contract' });
  if (leadingChainRes.status !== 400 || leadingChainRes.json?.error !== 'invalid_email') {
    throw new Error(`leading-chain boundary contract failed: status=${leadingChainRes.status} body=${JSON.stringify(leadingChainRes.json)}`);
  }
  console.log('ok:email-capture:leading-chain-boundary-invalid');

  const plusHyphenSeqRes = await post({ name: 'QA Contract', email: 'user+-tag@example.com', tag: 'qa-contract' });
  if (plusHyphenSeqRes.status !== 400 || plusHyphenSeqRes.json?.error !== 'invalid_email') {
    throw new Error(`plus-hyphen sequence contract failed: status=${plusHyphenSeqRes.status} body=${JSON.stringify(plusHyphenSeqRes.json)}`);
  }
  console.log('ok:email-capture:plus-hyphen-sequence-invalid');

  const hyphenPlusSeqRes = await post({ name: 'QA Contract', email: 'user-+tag@example.com', tag: 'qa-contract' });
  if (hyphenPlusSeqRes.status !== 400 || hyphenPlusSeqRes.json?.error !== 'invalid_email') {
    throw new Error(`hyphen-plus sequence contract failed: status=${hyphenPlusSeqRes.status} body=${JSON.stringify(hyphenPlusSeqRes.json)}`);
  }
  console.log('ok:email-capture:hyphen-plus-sequence-invalid');

  const doubleHyphenRes = await post({ name: 'QA Contract', email: 'user--tag@example.com', tag: 'qa-contract' });
  if (doubleHyphenRes.status !== 400 || doubleHyphenRes.json?.error !== 'invalid_email') {
    throw new Error(`double-hyphen sequence contract failed: status=${doubleHyphenRes.status} body=${JSON.stringify(doubleHyphenRes.json)}`);
  }
  console.log('ok:email-capture:double-hyphen-sequence-invalid');

  const singleHyphenRes = await post({ name: 'QA Contract', email: `user-a.${Date.now()}@example.com`, tag: 'qa-contract' });
  if (singleHyphenRes.status !== 200 || singleHyphenRes.json?.ok !== true) {
    throw new Error(`single-hyphen local contract failed: status=${singleHyphenRes.status} body=${JSON.stringify(singleHyphenRes.json)}`);
  }
  console.log('ok:email-capture:single-hyphen-local-valid');

  const trailingUnderscoreRes = await post({ name: 'QA Contract', email: 'user_@example.com', tag: 'qa-contract' });
  if (trailingUnderscoreRes.status !== 400 || trailingUnderscoreRes.json?.error !== 'invalid_email') {
    throw new Error(`trailing-underscore local contract failed: status=${trailingUnderscoreRes.status} body=${JSON.stringify(trailingUnderscoreRes.json)}`);
  }
  console.log('ok:email-capture:trailing-underscore-local-invalid');

  const dotUnderscoreBoundaryRes = await post({ name: 'QA Contract', email: 'user._@example.com', tag: 'qa-contract' });
  if (dotUnderscoreBoundaryRes.status !== 400 || dotUnderscoreBoundaryRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-underscore boundary contract failed: status=${dotUnderscoreBoundaryRes.status} body=${JSON.stringify(dotUnderscoreBoundaryRes.json)}`);
  }
  console.log('ok:email-capture:dot-underscore-boundary-invalid');

  const underscoreDotBoundaryRes = await post({ name: 'QA Contract', email: 'user_.@example.com', tag: 'qa-contract' });
  if (underscoreDotBoundaryRes.status !== 400 || underscoreDotBoundaryRes.json?.error !== 'invalid_email') {
    throw new Error(`underscore-dot boundary contract failed: status=${underscoreDotBoundaryRes.status} body=${JSON.stringify(underscoreDotBoundaryRes.json)}`);
  }
  console.log('ok:email-capture:underscore-dot-boundary-invalid');

  const plusUnderscoreBoundaryRes = await post({ name: 'QA Contract', email: 'user+_@example.com', tag: 'qa-contract' });
  if (plusUnderscoreBoundaryRes.status !== 400 || plusUnderscoreBoundaryRes.json?.error !== 'invalid_email') {
    throw new Error(`plus-underscore boundary contract failed: status=${plusUnderscoreBoundaryRes.status} body=${JSON.stringify(plusUnderscoreBoundaryRes.json)}`);
  }
  console.log('ok:email-capture:plus-underscore-boundary-invalid');

  const dotUnderscorePlusChainRes = await post({ name: 'QA Contract', email: 'user._+@example.com', tag: 'qa-contract' });
  if (dotUnderscorePlusChainRes.status !== 400 || dotUnderscorePlusChainRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-underscore-plus chain contract failed: status=${dotUnderscorePlusChainRes.status} body=${JSON.stringify(dotUnderscorePlusChainRes.json)}`);
  }
  console.log('ok:email-capture:dot-underscore-plus-chain-invalid');

  const dotPlusUnderscoreChainRes = await post({ name: 'QA Contract', email: 'user.+_@example.com', tag: 'qa-contract' });
  if (dotPlusUnderscoreChainRes.status !== 400 || dotPlusUnderscoreChainRes.json?.error !== 'invalid_email') {
    throw new Error(`dot-plus-underscore chain contract failed: status=${dotPlusUnderscoreChainRes.status} body=${JSON.stringify(dotPlusUnderscoreChainRes.json)}`);
  }
  console.log('ok:email-capture:dot-plus-underscore-chain-invalid');

  const leadingUnderscoreRes = await post({ name: 'QA Contract', email: '_user@example.com', tag: 'qa-contract' });
  if (leadingUnderscoreRes.status !== 400 || leadingUnderscoreRes.json?.error !== 'invalid_email') {
    throw new Error(`leading-underscore local contract failed: status=${leadingUnderscoreRes.status} body=${JSON.stringify(leadingUnderscoreRes.json)}`);
  }
  console.log('ok:email-capture:leading-underscore-local-invalid');

  const underscoreDotLeadingRes = await post({ name: 'QA Contract', email: '_.user@example.com', tag: 'qa-contract' });
  if (underscoreDotLeadingRes.status !== 400 || underscoreDotLeadingRes.json?.error !== 'invalid_email') {
    throw new Error(`underscore-dot leading contract failed: status=${underscoreDotLeadingRes.status} body=${JSON.stringify(underscoreDotLeadingRes.json)}`);
  }
  console.log('ok:email-capture:underscore-dot-leading-invalid');

  const underscorePlusLeadingRes = await post({ name: 'QA Contract', email: '_+user@example.com', tag: 'qa-contract' });
  if (underscorePlusLeadingRes.status !== 400 || underscorePlusLeadingRes.json?.error !== 'invalid_email') {
    throw new Error(`underscore-plus leading contract failed: status=${underscorePlusLeadingRes.status} body=${JSON.stringify(underscorePlusLeadingRes.json)}`);
  }
  console.log('ok:email-capture:underscore-plus-leading-invalid');

  const quotedLocalRes = await post({ name: 'QA Contract', email: '"quoted"@example.com', tag: 'qa-contract' });
  if (quotedLocalRes.status !== 400 || quotedLocalRes.json?.error !== 'invalid_email') {
    throw new Error(`quoted-local contract failed: status=${quotedLocalRes.status} body=${JSON.stringify(quotedLocalRes.json)}`);
  }
  console.log('ok:email-capture:quoted-local-invalid');

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

  const leadingDotPlusChainRes = await post({ name: 'QA Contract', email: '.+user@example.com', tag: 'qa-contract' });
  if (leadingDotPlusChainRes.status !== 400 || leadingDotPlusChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading dot-plus chain contract failed: status=${leadingDotPlusChainRes.status} body=${JSON.stringify(leadingDotPlusChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-plus-chain-invalid');

  const leadingDotUnderscoreChainRes = await post({ name: 'QA Contract', email: '._user@example.com', tag: 'qa-contract' });
  if (leadingDotUnderscoreChainRes.status !== 400 || leadingDotUnderscoreChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading dot-underscore chain contract failed: status=${leadingDotUnderscoreChainRes.status} body=${JSON.stringify(leadingDotUnderscoreChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-underscore-chain-invalid');

  const leadingDotUnderscorePlusChainRes = await post({ name: 'QA Contract', email: '._+user@example.com', tag: 'qa-contract' });
  if (leadingDotUnderscorePlusChainRes.status !== 400 || leadingDotUnderscorePlusChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading dot-underscore-plus chain contract failed: status=${leadingDotUnderscorePlusChainRes.status} body=${JSON.stringify(leadingDotUnderscorePlusChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-underscore-plus-chain-invalid');

  const leadingDotHyphenChainRes = await post({ name: 'QA Contract', email: '.-user@example.com', tag: 'qa-contract' });
  if (leadingDotHyphenChainRes.status !== 400 || leadingDotHyphenChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading dot-hyphen chain contract failed: status=${leadingDotHyphenChainRes.status} body=${JSON.stringify(leadingDotHyphenChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-hyphen-chain-invalid');

  const leadingDotApostropheChainRes = await post({ name: 'QA Contract', email: ".'user@example.com", tag: 'qa-contract' });
  if (leadingDotApostropheChainRes.status !== 400 || leadingDotApostropheChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `leading dot-apostrophe chain contract failed: status=${leadingDotApostropheChainRes.status} body=${JSON.stringify(leadingDotApostropheChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:leading-dot-apostrophe-chain-invalid');

  const trailingDotPlusChainRes = await post({ name: 'QA Contract', email: 'user.+@example.com', tag: 'qa-contract' });
  if (trailingDotPlusChainRes.status !== 400 || trailingDotPlusChainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `trailing dot-plus chain contract failed: status=${trailingDotPlusChainRes.status} body=${JSON.stringify(trailingDotPlusChainRes.json)}`,
    );
  }
  console.log('ok:email-capture:trailing-dot-plus-chain-invalid');

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

  const noTldComRes = await post({ name: 'QA Contract', email: 'user@com', tag: 'qa-contract' });
  if (noTldComRes.status !== 400 || noTldComRes.json?.error !== 'invalid_email') {
    throw new Error(
      `no-tld domain contract failed: status=${noTldComRes.status} body=${JSON.stringify(noTldComRes.json)}`,
    );
  }
  console.log('ok:email-capture:no-tld-domain-invalid');

  const noTldUpperRes = await post({ name: 'QA Contract', email: 'user@COM', tag: 'qa-contract' });
  if (noTldUpperRes.status !== 400 || noTldUpperRes.json?.error !== 'invalid_email') {
    throw new Error(
      `no-tld uppercase domain contract failed: status=${noTldUpperRes.status} body=${JSON.stringify(noTldUpperRes.json)}`,
    );
  }
  console.log('ok:email-capture:no-tld-uppercase-domain-invalid');

  const localSpaceRes = await post({ name: 'QA Contract', email: 'us er@example.com', tag: 'qa-contract' });
  if (localSpaceRes.status !== 400 || localSpaceRes.json?.error !== 'invalid_email') {
    throw new Error(
      `local-space email contract failed: status=${localSpaceRes.status} body=${JSON.stringify(localSpaceRes.json)}`,
    );
  }
  console.log('ok:email-capture:local-space-invalid');

  const domainSpaceRes = await post({ name: 'QA Contract', email: 'user@exa mple.com', tag: 'qa-contract' });
  if (domainSpaceRes.status !== 400 || domainSpaceRes.json?.error !== 'invalid_email') {
    throw new Error(
      `domain-space email contract failed: status=${domainSpaceRes.status} body=${JSON.stringify(domainSpaceRes.json)}`,
    );
  }
  console.log('ok:email-capture:domain-space-invalid');

  const localTabRes = await post({ name: 'QA Contract', email: 'us\ter@example.com', tag: 'qa-contract' });
  if (localTabRes.status !== 400 || localTabRes.json?.error !== 'invalid_email') {
    throw new Error(
      `local-tab email contract failed: status=${localTabRes.status} body=${JSON.stringify(localTabRes.json)}`,
    );
  }
  console.log('ok:email-capture:local-tab-invalid');

  const domainNewlineRes = await post({ name: 'QA Contract', email: 'user@exa\nmple.com', tag: 'qa-contract' });
  if (domainNewlineRes.status !== 400 || domainNewlineRes.json?.error !== 'invalid_email') {
    throw new Error(
      `domain-newline email contract failed: status=${domainNewlineRes.status} body=${JSON.stringify(domainNewlineRes.json)}`,
    );
  }
  console.log('ok:email-capture:domain-newline-invalid');

  const unicodeWhitespaceWrappedRes = await post({
    name: 'QA Contract',
    email: '\u00A0\u2003user.unicodews@example.com\u00A0',
    tag: 'qa-contract',
  });
  if (unicodeWhitespaceWrappedRes.status !== 200 || unicodeWhitespaceWrappedRes.json?.ok !== true) {
    throw new Error(
      `unicode-whitespace wrapped email contract failed: status=${unicodeWhitespaceWrappedRes.status} body=${JSON.stringify(unicodeWhitespaceWrappedRes.json)}`,
    );
  }
  console.log('ok:email-capture:unicode-whitespace-trimmed-valid');

  const zeroWidthSepRes = await post({ name: 'QA Contract', email: `user\u200B@example.com`, tag: 'qa-contract' });
  if (zeroWidthSepRes.status !== 400 || zeroWidthSepRes.json?.error !== 'invalid_email') {
    throw new Error(
      `zero-width separator email contract failed: status=${zeroWidthSepRes.status} body=${JSON.stringify(zeroWidthSepRes.json)}`,
    );
  }
  console.log('ok:email-capture:zero-width-separator-invalid');

  const bomCharRes = await post({ name: 'QA Contract', email: `user\uFEFF@example.com`, tag: 'qa-contract' });
  if (bomCharRes.status !== 400 || bomCharRes.json?.error !== 'invalid_email') {
    throw new Error(
      `BOM-char email contract failed: status=${bomCharRes.status} body=${JSON.stringify(bomCharRes.json)}`,
    );
  }
  console.log('ok:email-capture:bom-char-invalid');

  const underscoreDomainRes = await post({ name: 'QA Contract', email: 'user@bad_domain.com', tag: 'qa-contract' });
  if (underscoreDomainRes.status !== 400 || underscoreDomainRes.json?.error !== 'invalid_email') {
    throw new Error(
      `underscore-domain email contract failed: status=${underscoreDomainRes.status} body=${JSON.stringify(underscoreDomainRes.json)}`,
    );
  }
  console.log('ok:email-capture:underscore-domain-invalid');

  console.log('qa-email-capture-contract: ok');
}

run().catch((error) => {
  console.error('qa-email-capture-contract: failed');
  console.error(error instanceof Error ? error.stack || error.message : error);
  process.exit(1);
});
