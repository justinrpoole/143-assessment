import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const SPEC_BUNDLE_PATH = "src/data/integrated_specs/spec_bundle.json";
const ROUTE_SPECS_PATH = "src/lib/routes/v1-route-specs.ts";
const MIDDLEWARE_PATH = "src/middleware.ts";
const TAXONOMY_PATH = "src/lib/analytics/taxonomy.ts";
const SHARECARD_API_PATH = "src/app/api/sharecards/[type]/route.ts";
const WEBHOOK_ROUTE_PATH = "src/app/api/stripe/webhook/route.ts";
const PAGE_COPY_PATH = "src/content/page_copy.v1.ts";

const ROUTE_EXPECTATIONS = [
  { route: "/", page: "src/app/page.tsx", event: "page_view_root" },
  { route: "/upgrade-your-os", page: "src/app/upgrade-your-os/page.tsx", event: "page_view_upgrade_os" },
  { route: "/143", page: "src/app/143/page.tsx", event: "page_view_143", moduleTokens: ["ToolkitDeliveryClient"] },
  { route: "/toolkit", page: "src/app/toolkit/page.tsx", event: "page_view_toolkit", moduleTokens: ["ToolkitDeliveryClient"] },
  { route: "/preview", page: "src/app/preview/page.tsx", event: "page_view_preview", moduleTokens: ["PreviewSnapshotClient"] },
  { route: "/upgrade", page: "src/app/upgrade/page.tsx", event: "page_view_upgrade", moduleTokens: ["UpgradeCheckoutClient"] },
  { route: "/sample-report", page: "src/app/sample-report/page.tsx", event: "page_view_sample_report" },
  { route: "/how-it-works", page: "src/app/how-it-works/page.tsx", event: "page_view_how_it_works" },
  { route: "/pricing", page: "src/app/pricing/page.tsx", event: "page_view_pricing" },
  { route: "/outcomes", page: "src/app/outcomes/page.tsx", event: "page_view_outcomes" },
  { route: "/justin", page: "src/app/justin/page.tsx", event: "page_view_justin" },
  { route: "/os-coaching", page: "src/app/os-coaching/page.tsx", event: "page_view_os_coaching", shell: true },
  { route: "/cohorts", page: "src/app/cohorts/page.tsx", event: "page_view_cohorts", shell: true },
  { route: "/corporate", page: "src/app/corporate/page.tsx", event: "page_view_corporate", shell: true },
  { route: "/enterprise", page: "src/app/enterprise/page.tsx", event: "page_view_enterprise", moduleTokens: ["EnterpriseSalesPage"] },
  { route: "/coach", page: "src/app/coach/page.tsx", event: "page_view_coach", moduleTokens: ["CoachWorkspaceClient"] },
  { route: "/faq", page: "src/app/faq/page.tsx", event: "page_view_faq", shell: true },
  { route: "/privacy", page: "src/app/privacy/page.tsx", event: "page_view_privacy", shell: true },
  { route: "/terms", page: "src/app/terms/page.tsx", event: "page_view_terms", shell: true },
  { route: "/login", page: "src/app/login/page.tsx", event: "page_view_login", shell: true },
  { route: "/portal", page: "src/app/portal/page.tsx", event: "page_view_portal", moduleTokens: ["PortalDashboard"] },
  { route: "/dashboard", page: "src/app/dashboard/page.tsx", event: "page_view_dashboard" },
  { route: "/morning", page: "src/app/morning/page.tsx", event: "page_view_morning", moduleTokens: ["MorningEntryClient"] },
  { route: "/micro-joy", page: "src/app/micro-joy/page.tsx", event: "page_view_microjoy", moduleTokens: ["MicroJoyClient"] },
  { route: "/account", page: "src/app/account/page.tsx", event: "page_view_account", moduleTokens: ["AccountBillingClient"] },
  { route: "/assessment", page: "src/app/assessment/page.tsx", event: "page_view_assessment", moduleTokens: ["AssessmentRunnerClient"] },
  { route: "/assessment/setup", page: "src/app/assessment/setup/page.tsx", event: "page_view_assessment_setup", moduleTokens: ["AssessmentSetupClient"] },
  { route: "/results", page: "src/app/results/page.tsx", event: "page_view_results", moduleTokens: ["ResultsClient"] },
  { route: "/reports", page: "src/app/reports/page.tsx", event: "page_view_reports", moduleTokens: ["ReportClient"] },
  { route: "/growth", page: "src/app/growth/page.tsx", event: "page_view_growth", moduleTokens: ["GrowthSummaryClient"] },
  { route: "/spec-center", page: "src/app/spec-center/page.tsx", event: "page_view_spec_center" },
];

const CTA_RULES = [
  {
    route: "/upgrade-your-os",
    anyOf: [["href=\"/143\"", "href=\"/toolkit\""]],
    allOf: ["href=\"/preview\""],
  },
  {
    route: "/how-it-works",
    allOf: ["href=\"/preview\"", "href=\"/upgrade\""],
  },
  {
    route: "/pricing",
    allOf: ["href=\"/preview\"", "href=\"/upgrade\""],
  },
  {
    route: "/preview",
    allOf: ["href=\"/sample-report\"", "href=\"/upgrade\""],
  },
  {
    route: "/sample-report",
    allOf: ["href=\"/preview\"", "href=\"/upgrade\""],
  },
];

const CTA_CONTEXT_FILES = {
  "/preview": ["src/components/retention/PreviewSnapshotClient.tsx"],
};

const PROTECTED_ROUTES = [
  "/portal",
  "/morning",
  "/micro-joy",
  "/account",
  "/assessment/:path*",
  "/results",
  "/reports",
  "/growth",
];

function readFile(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function parseCanonicalEvents() {
  const content = readFile(TAXONOMY_PATH);
  const match = content.match(
    /export\s+const\s+CANONICAL_EVENT_NAMES\s*=\s*\[([\s\S]*?)\]\s*as\s+const/,
  );
  if (!match) return new Set();
  const values = [];
  const pattern = /["'`]([a-z0-9_]+)["'`]/g;
  let m = pattern.exec(match[1]);
  while (m) {
    values.push(m[1]);
    m = pattern.exec(match[1]);
  }
  return new Set(values);
}

function parseRouteSpecMap() {
  if (!exists(ROUTE_SPECS_PATH)) return new Map();
  const content = readFile(ROUTE_SPECS_PATH);
  const routeMap = new Map();
  const routeBlockPattern = /"([^"]+)":\s*\{([\s\S]*?)\n\s*\},/g;
  let match = routeBlockPattern.exec(content);
  while (match) {
    const route = match[1];
    const block = match[2];
    const eventMatch = block.match(/pageViewEvent:\s*"([^"]+)"/);
    const modulesMatch = block.match(/modules:\s*\[([\s\S]*?)\]/);
    const modules = [];
    if (modulesMatch) {
      const modulePattern = /"([^"]+)"/g;
      let moduleMatch = modulePattern.exec(modulesMatch[1]);
      while (moduleMatch) {
        modules.push(moduleMatch[1]);
        moduleMatch = modulePattern.exec(modulesMatch[1]);
      }
    }
    routeMap.set(route, {
      pageViewEvent: eventMatch ? eventMatch[1] : null,
      modules,
    });
    match = routeBlockPattern.exec(content);
  }
  return routeMap;
}

function findExpectation(route) {
  return ROUTE_EXPECTATIONS.find((entry) => entry.route === route) ?? null;
}

function validateRoute(expectation, routeSpecMap, canonicalEvents) {
  const errors = [];
  const evidence = [];

  if (!exists(expectation.page)) {
    errors.push(`Missing page file: ${expectation.page}`);
    return { pass: false, errors, evidence };
  }

  const content = readFile(expectation.page);
  evidence.push(expectation.page);

  if (!canonicalEvents.has(expectation.event)) {
    errors.push(`Event not canonical: ${expectation.event}`);
  }

  if (expectation.shell) {
    if (!content.includes("RouteShellPage")) {
      errors.push("Expected RouteShellPage usage for shell route");
    }
    if (!content.includes(`V1_ROUTE_SPECS["${expectation.route}"]`)) {
      errors.push(`Missing V1_ROUTE_SPECS reference for ${expectation.route}`);
    }
    const routeSpec = routeSpecMap.get(expectation.route);
    if (!routeSpec) {
      errors.push(`Route not found in ${ROUTE_SPECS_PATH}: ${expectation.route}`);
    } else if (routeSpec.pageViewEvent !== expectation.event) {
      errors.push(
        `Route spec event mismatch for ${expectation.route}: expected ${expectation.event}, got ${routeSpec.pageViewEvent}`,
      );
    }
  } else {
    const eventRegex = new RegExp(`eventName:\\s*["']${expectation.event}["']`);
    if (!eventRegex.test(content)) {
      errors.push(`Missing page_view emit: ${expectation.event}`);
    }
  }

  if (Array.isArray(expectation.moduleTokens)) {
    for (const token of expectation.moduleTokens) {
      if (!content.includes(token)) {
        errors.push(`Missing module/client token: ${token}`);
      }
    }
  }

  return {
    pass: errors.length === 0,
    errors,
    evidence,
  };
}

function validateCtas() {
  const failures = [];
  const copyContent = exists(PAGE_COPY_PATH) ? readFile(PAGE_COPY_PATH) : "";

  function tokenPresent(combinedContent, token) {
    if (combinedContent.includes(token)) {
      return true;
    }
    const altToken = token.replace('href=\"', 'href: \"');
    return combinedContent.includes(altToken);
  }

  for (const rule of CTA_RULES) {
    const expectation = findExpectation(rule.route);
    if (!expectation || !exists(expectation.page)) {
      failures.push(`${rule.route}: page missing`);
      continue;
    }

    const contextFiles = [expectation.page, ...(CTA_CONTEXT_FILES[rule.route] ?? [])];
    const content = contextFiles
      .filter((filePath) => exists(filePath))
      .map((filePath) => readFile(filePath))
      .join("\n");
    const combinedContent = `${content}\n${copyContent}`;
    for (const required of rule.allOf ?? []) {
      if (!tokenPresent(combinedContent, required)) {
        failures.push(`${rule.route}: missing CTA token ${required}`);
      }
    }
    for (const group of rule.anyOf ?? []) {
      if (!group.some((token) => tokenPresent(combinedContent, token))) {
        failures.push(`${rule.route}: missing one-of CTA tokens ${group.join(" OR ")}`);
      }
    }
  }
  return failures;
}

function validateMiddleware() {
  const failures = [];
  if (!exists(MIDDLEWARE_PATH)) {
    return [`Missing middleware file: ${MIDDLEWARE_PATH}`];
  }
  const content = readFile(MIDDLEWARE_PATH);
  for (const route of PROTECTED_ROUTES) {
    if (!content.includes(`"${route}"`)) {
      failures.push(`middleware missing protected route: ${route}`);
    }
  }
  if (!content.includes("source_route")) {
    failures.push("middleware missing source_route propagation");
  }
  return failures;
}

function validateChallengeFlow() {
  const failures = [];
  const challengePagePath = "src/app/143/page.tsx";
  if (!exists(challengePagePath)) {
    return [`Missing ${challengePagePath}`];
  }
  const content = readFile(challengePagePath);
  const copyContent = exists(PAGE_COPY_PATH) ? readFile(PAGE_COPY_PATH) : "";
  const combinedContent = `${content}\n${copyContent}`;
  if (!combinedContent.includes("Start now (no email)")) {
    failures.push("/143 page missing 'Start now (no email)'");
  }
  if (!combinedContent.includes("Challenge Kit")) {
    failures.push("/143 page missing Challenge Kit gating section");
  }
  return failures;
}

function validateServerPurchaseComplete() {
  const failures = [];
  const sourceRoot = path.join(ROOT, "src");

  function walk(dirPath) {
    let entries = [];
    try {
      entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
      return [];
    }
    const files = [];
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...walk(fullPath));
      } else if (fullPath.endsWith(".ts") || fullPath.endsWith(".tsx") || fullPath.endsWith(".mjs")) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const files = walk(sourceRoot);
  for (const fullPath of files) {
    const rel = path.relative(ROOT, fullPath);
    const content = fs.readFileSync(fullPath, "utf8");
    if (!content.includes("purchase_complete")) continue;
    const isAllowed =
      rel === WEBHOOK_ROUTE_PATH ||
      rel === TAXONOMY_PATH ||
      rel === "src/data/integrated_specs/spec_bundle.json";
    if (!isAllowed) {
      failures.push(`purchase_complete referenced outside webhook/taxonomy: ${rel}`);
    }
  }

  return failures;
}

function validateSharecardEvents(canonicalEvents) {
  const failures = [];
  if (!exists(SHARECARD_API_PATH)) {
    return [`Missing ${SHARECARD_API_PATH}`];
  }
  const content = readFile(SHARECARD_API_PATH);
  const required = [
    "results_sharecard_generate",
    "growth_sharecard_generate",
    "morning_sharecard_generate",
  ];
  for (const eventName of required) {
    if (!canonicalEvents.has(eventName)) {
      failures.push(`Sharecard event not canonical: ${eventName}`);
    }
    if (!content.includes(`"${eventName}"`)) {
      failures.push(`Sharecard API missing emit mapping: ${eventName}`);
    }
  }
  return failures;
}

function validateSpecBundle() {
  const failures = [];
  if (!exists(SPEC_BUNDLE_PATH)) {
    return [`Missing spec bundle: ${SPEC_BUNDLE_PATH}`];
  }
  try {
    const bundle = JSON.parse(readFile(SPEC_BUNDLE_PATH));
    if (!bundle.markdown || typeof bundle.markdown !== "object") {
      failures.push("Spec bundle missing markdown object");
    } else {
      for (const key of ["ia", "module_library", "entitlements", "tone_lock_prompt"]) {
        if (!(key in bundle.markdown)) {
          failures.push(`Spec bundle missing markdown key: ${key}`);
        }
      }
    }
  } catch (error) {
    failures.push(`Spec bundle parse failed: ${String(error)}`);
  }
  return failures;
}

function printRouteTable(routeResults) {
  console.log("ROUTE | PAGE_VIEW | MODULE CHECK | PASS/FAIL");
  console.log("---|---|---|---");
  for (const row of routeResults) {
    const moduleStatus = row.errors.some((item) => item.includes("module") || item.includes("RouteShellPage"))
      ? "FAIL"
      : "PASS";
    console.log(
      `${row.route} | ${row.event} | ${moduleStatus} | ${row.pass ? "PASS" : "FAIL"}`,
    );
  }
}

function main() {
  const canonicalEvents = parseCanonicalEvents();
  const routeSpecMap = parseRouteSpecMap();

  const routeResults = ROUTE_EXPECTATIONS.map((expectation) => {
    const result = validateRoute(expectation, routeSpecMap, canonicalEvents);
    return {
      route: expectation.route,
      page: expectation.page,
      event: expectation.event,
      pass: result.pass,
      errors: result.errors,
      evidence: result.evidence,
    };
  });

  const specBundleFailures = validateSpecBundle();
  const ctaFailures = validateCtas();
  const middlewareFailures = validateMiddleware();
  const challengeFailures = validateChallengeFlow();
  const purchaseFailures = validateServerPurchaseComplete();
  const sharecardFailures = validateSharecardEvents(canonicalEvents);

  const failedRoutes = routeResults.filter((row) => !row.pass);
  const sections = [
    { name: "SPEC_BUNDLE", failures: specBundleFailures },
    { name: "ROUTES", failures: failedRoutes.flatMap((row) => row.errors.map((error) => `${row.route}: ${error}`)) },
    { name: "CTA_RULES", failures: ctaFailures },
    { name: "MIDDLEWARE_GATING", failures: middlewareFailures },
    { name: "CHALLENGE_SOFT_GATE", failures: challengeFailures },
    { name: "PURCHASE_WEBHOOK_TRUTH", failures: purchaseFailures },
    { name: "SHARECARD_EVENT_EMISSION", failures: sharecardFailures },
  ];

  printRouteTable(routeResults);
  console.log("");
  console.log("SECTION | PASS/FAIL | failure_count");
  console.log("---|---|---");
  for (const section of sections) {
    console.log(
      `${section.name} | ${section.failures.length === 0 ? "PASS" : "FAIL"} | ${section.failures.length}`,
    );
  }

  const allFailures = sections.flatMap((section) =>
    section.failures.map((failure) => `${section.name}: ${failure}`),
  );
  if (allFailures.length > 0) {
    console.log("");
    console.log("Failures:");
    for (const failure of allFailures) {
      console.log(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("");
  console.log("audit:experience PASS");
  console.log(`routes_checked: ${ROUTE_EXPECTATIONS.length}`);
  console.log(`canonical_events_loaded: ${canonicalEvents.size}`);
}

main();
