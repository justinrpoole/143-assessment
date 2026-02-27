// hero-evolved.test.js — Playwright validation for hero supernova + logo reveal
// Ralph loop: runs assertions, reports pass/fail, iterates until 100%

const { chromium } = require('playwright');
const path = require('path');

const FILE = path.resolve(__dirname, 'hero-evolved.html');
const URL = 'file://' + FILE;

async function runValidation() {
  const results = [];
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Collect console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  await page.goto(URL, { waitUntil: 'domcontentloaded' });

  // === TEST 1: All critical DOM elements exist ===
  const elements = [
    '.site-nav', '.nav-brand', '.nav-links',
    '.hero', '.scene', '.atmosphere', '.eclipse-darkness',
    '.supernova-flash', '.grain', '.cursor-glow', '.horizon',
    '.eclipse-stage', '.sun-glow', '.rays-wrap', '.rays',
    '.sun-svg', '.brand-143', '.moon-layer', '.eclipse-ring',
    '.eclipse-bloom', '.diamond-ring', '.lens-flare',
    '.logo-reveal', '.logo-reveal img', '.hero-copy',
    '.row-1', '.row-2', '.row-3', '.cta'
  ];
  for (const sel of elements) {
    const el = await page.$(sel);
    results.push({
      name: `DOM: ${sel} exists`,
      pass: !!el
    });
  }

  // === TEST 2: Canvas is rendering (has dimensions) ===
  const canvasSize = await page.evaluate(() => {
    const c = document.querySelector('.scene');
    return { w: c.width, h: c.height };
  });
  results.push({
    name: 'Canvas has dimensions',
    pass: canvasSize.w > 0 && canvasSize.h > 0
  });

  // === TEST 3: 143 brand mark is visible initially ===
  const brandVisible = await page.evaluate(() => {
    const b = document.querySelector('.brand-143');
    const style = getComputedStyle(b);
    return parseFloat(style.opacity) > 0;
  });
  results.push({
    name: '143 brand mark visible at start',
    pass: brandVisible
  });

  // === TEST 4: Logo is hidden initially ===
  const logoHidden = await page.evaluate(() => {
    const l = document.querySelector('.logo-reveal');
    return !l.classList.contains('visible') && parseFloat(getComputedStyle(l).opacity) === 0;
  });
  results.push({
    name: 'Logo hidden initially',
    pass: logoHidden
  });

  // === TEST 5: Supernova flash is hidden initially ===
  const flashHidden = await page.evaluate(() => {
    const f = document.querySelector('.supernova-flash');
    return parseFloat(getComputedStyle(f).opacity) === 0;
  });
  results.push({
    name: 'Supernova flash hidden initially',
    pass: flashHidden
  });

  // === TEST 6: Eclipse stage is visible initially ===
  const stageVisible = await page.evaluate(() => {
    const s = document.querySelector('.eclipse-stage');
    return parseFloat(getComputedStyle(s).opacity) > 0;
  });
  results.push({
    name: 'Eclipse stage visible at start',
    pass: stageVisible
  });

  // === TEST 7: Wait for eclipse phase (at ~9s, moon should be visible) ===
  await page.waitForTimeout(9000);
  const moonDuringEclipse = await page.evaluate(() => {
    const m = document.querySelector('.moon-layer');
    return parseFloat(m.style.opacity) > 0.3;
  });
  results.push({
    name: 'Moon visible during eclipse (t=9s)',
    pass: moonDuringEclipse
  });

  // === TEST 8: Wait past supernova — logo should appear (~24s total) ===
  await page.waitForTimeout(16000); // total ~25s from start
  const logoAfterNova = await page.evaluate(() => {
    const l = document.querySelector('.logo-reveal');
    return l.classList.contains('visible');
  });
  results.push({
    name: 'Logo visible after supernova (t=25s)',
    pass: logoAfterNova
  });

  // === TEST 9: Eclipse stage should be hidden after supernova ===
  const stageHiddenAfter = await page.evaluate(() => {
    const s = document.querySelector('.eclipse-stage');
    return parseFloat(s.style.opacity) === 0;
  });
  results.push({
    name: 'Eclipse stage hidden after supernova',
    pass: stageHiddenAfter
  });

  // === TEST 10: Flash should be hidden after supernova ===
  const flashGoneAfter = await page.evaluate(() => {
    const f = document.querySelector('.supernova-flash');
    return parseFloat(f.style.opacity) === 0;
  });
  results.push({
    name: 'Flash gone after supernova',
    pass: flashGoneAfter
  });

  // === TEST 11: Moon should be hidden after eclipse ===
  const moonGoneAfter = await page.evaluate(() => {
    const m = document.querySelector('.moon-layer');
    return parseFloat(m.style.opacity) === 0;
  });
  results.push({
    name: 'Moon hidden after eclipse completes',
    pass: moonGoneAfter
  });

  // === TEST 12: Stars still rendering (canvas has pixel data) ===
  const canvasActive = await page.evaluate(() => {
    const c = document.querySelector('.scene');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, 10, 10).data;
    let nonZero = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 0 || data[i+1] > 0 || data[i+2] > 0) nonZero++;
    }
    return nonZero > 0;
  });
  results.push({
    name: 'Canvas still rendering after sequence',
    pass: canvasActive
  });

  // === TEST 13: No JS console errors ===
  results.push({
    name: 'No console errors',
    pass: consoleErrors.length === 0,
    detail: consoleErrors.length > 0 ? consoleErrors.join('; ') : undefined
  });

  // === TEST 14: No uncaught page errors ===
  results.push({
    name: 'No uncaught exceptions',
    pass: pageErrors.length === 0,
    detail: pageErrors.length > 0 ? pageErrors.join('; ') : undefined
  });

  // === TEST 15: Hero copy text is correct ===
  const heroText = await page.evaluate(() => {
    const r1 = document.querySelector('.row-1').textContent.trim();
    const r2 = document.querySelector('.row-2').textContent.trim();
    const cta = document.querySelector('.cta').textContent.trim();
    return { r1, r2, cta };
  });
  results.push({
    name: 'Headline text correct',
    pass: heroText.r1.includes('UPGRADE') && heroText.r1.includes('OS')
  });
  results.push({
    name: 'CTA text correct',
    pass: heroText.cta === 'Check My Stability'
  });

  // === TEST 16: Logo img has src attribute ===
  const logoSrc = await page.evaluate(() => {
    const img = document.querySelector('.logo-reveal img');
    return img ? img.getAttribute('src') : null;
  });
  results.push({
    name: 'Logo img has src',
    pass: !!logoSrc && logoSrc.includes('143-sun-eclipsed-logo')
  });

  await browser.close();

  // === REPORT ===
  const passed = results.filter(r => r.pass).length;
  const failed = results.filter(r => !r.pass).length;
  const total = results.length;
  const pct = Math.round((passed / total) * 100);

  console.log('\n' + '='.repeat(60));
  console.log('  HERO EVOLVED — PLAYWRIGHT VALIDATION REPORT');
  console.log('='.repeat(60));
  for (const r of results) {
    const icon = r.pass ? 'PASS' : 'FAIL';
    console.log(`  [${icon}] ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
  }
  console.log('='.repeat(60));
  console.log(`  SCORE: ${passed}/${total} (${pct}%)`);
  console.log(`  ${failed === 0 ? 'ALL TESTS PASSED' : failed + ' FAILING'}`);
  console.log('='.repeat(60) + '\n');

  return { passed, failed, total, pct, results };
}

// Ralph loop — retry until 100%
(async () => {
  let attempt = 1;
  while (true) {
    console.log(`\n--- RALPH LOOP: Attempt ${attempt} ---`);
    const result = await runValidation();
    if (result.pct === 100) {
      console.log('100% — RALPH LOOP COMPLETE. All standards met.');
      process.exit(0);
    }
    if (attempt >= 3) {
      console.log(`Stopping after ${attempt} attempts. Score: ${result.pct}%`);
      // Report failures for debugging
      for (const r of result.results) {
        if (!r.pass) console.log('  NEEDS FIX:', r.name, r.detail || '');
      }
      process.exit(1);
    }
    console.log(`Score: ${result.pct}% — retrying in 2s...`);
    await new Promise(r => setTimeout(r, 2000));
    attempt++;
  }
})();
