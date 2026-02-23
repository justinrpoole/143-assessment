import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const ROOT = process.cwd();

const REQUIRED_ROUTE_PAGES = [
  "src/app/page.tsx",
  "src/app/upgrade-your-os/page.tsx",
  "src/app/143/page.tsx",
  "src/app/toolkit/page.tsx",
  "src/app/preview/page.tsx",
  "src/app/upgrade/page.tsx",
  "src/app/sample-report/page.tsx",
  "src/app/how-it-works/page.tsx",
  "src/app/pricing/page.tsx",
  "src/app/outcomes/page.tsx",
  "src/app/justin/page.tsx",
  "src/app/os-coaching/page.tsx",
  "src/app/cohorts/page.tsx",
  "src/app/corporate/page.tsx",
  "src/app/enterprise/page.tsx",
  "src/app/coach/page.tsx",
  "src/app/faq/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
  "src/app/login/page.tsx",
  "src/app/portal/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/morning/page.tsx",
  "src/app/micro-joy/page.tsx",
  "src/app/account/page.tsx",
  "src/app/assessment/page.tsx",
  "src/app/assessment/setup/page.tsx",
  "src/app/results/page.tsx",
  "src/app/reports/page.tsx",
  "src/app/growth/page.tsx",
  "src/app/spec-center/page.tsx",
];

const REQUIRED_API_ROUTES = [
  "src/app/api/runs/draft/route.ts",
  "src/app/api/runs/[runId]/start/route.ts",
  "src/app/api/runs/[runId]/results/route.ts",
  "src/app/api/runs/[runId]/report/route.ts",
  "src/app/api/runs/[runId]/report/pdf/route.ts",
  "src/app/api/runs/[runId]/complete/route.ts",
  "src/app/api/sharecards/[type]/route.ts",
  "src/app/api/stripe/checkout/route.ts",
  "src/app/api/stripe/portal/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/toolkit/deliver/route.ts",
  "src/app/api/preview/start/route.ts",
  "src/app/api/preview/complete/route.ts",
  "src/app/api/morning/entry/route.ts",
  "src/app/api/micro-joy/suggestions/route.ts",
  "src/app/api/micro-joy/entry/route.ts",
  "src/app/api/growth/summary/route.ts",
];

const OPTIONAL_API_ROUTES = ["src/app/api/feedback/route.ts"];

const REQUIRED_CORE_LIBS = [
  "src/lib/analytics/emitter.ts",
  "src/lib/db/assessment-runs.ts",
  "src/lib/db/entitlements.ts",
  "src/lib/storage/supabase-storage.ts",
  "src/lib/report/render-report-pdf.mjs",
  "src/lib/sharecards/generate-sharecard.mjs",
  "src/lib/stripe/stripe.ts",
  "src/lib/email/email-provider.ts",
  "src/lib/email/scheduler.ts",
  "src/lib/email/templates/index.ts",
  "scripts/jobs/run-email-jobs.mjs",
];

const REQUIRED_MIGRATIONS = [
  "supabase/migrations/2026021302_phase2b_runs_results_reports.sql",
  "supabase/migrations/2026021402_phase2c_storage_buckets_and_paths.sql",
  "supabase/migrations/2026021401_phase2c_entitlements.sql",
  "supabase/migrations/2026021403_phase2d_retention_loop.sql",
];

const REQUIRED_PACKAGE_SCRIPTS = [
  "qa:all",
  "qa:content",
  "qa:score",
  "qa:report",
  "qa:smoke",
  "qa:parity",
  "qa:stripe",
  "qa:phase2d",
  "audit:build",
];

const DUPLICATE_CONTENT_PATHS = [
  "src/content/questions.updated.json",
  "src/content/report_templates/results_overview.json",
];

const REQUIRED_MARKETING_PAGES = [
  { route: "/", file: "src/app/page.tsx", tokens: ['redirect("/upgrade-your-os")'] },
  {
    route: "/upgrade-your-os",
    file: "src/app/upgrade-your-os/page.tsx",
    tokens: [
      "The problem is not your effort",
      "The 9 Rays Preview",
      "143 Challenge Teaser",
      "What leaders are saying",
      "Ready to see where your light shines?",
    ],
  },
  {
    route: "/assessment",
    file: "src/app/assessment/page.tsx",
    tokens: [
      "The 143 Be The Light Assessment",
      "What Makes This Different",
      "What You'll Discover",
      "Pricing Tiers",
      "Sample Results Preview",
      "FAQs",
    ],
  },
  {
    route: "/framework",
    file: "src/app/framework/page.tsx",
    tokens: ["The Be The Light Framework", "The Eclipse Concept"],
  },
  {
    route: "/143-challenge",
    file: "src/app/143-challenge/page.tsx",
    tokens: ["The 143 Challenge", "The Practice"],
  },
  {
    route: "/organizations",
    file: "src/app/organizations/page.tsx",
    tokens: ["For Organizations", "How We Work With Organizations"],
  },
  {
    route: "/about",
    file: "src/app/about/page.tsx",
    tokens: ["About Justin Ray"],
  },
  {
    route: "/resources",
    file: "src/app/resources/page.tsx",
    tokens: ["Resources"],
  },
];

const MARKETING_NAV_FILE = "src/components/marketing/MarketingNav.tsx";
const NAV_CONFIG_FILE = "src/lib/nav/nav-config.ts";
const PAGE_COPY_SOURCE = "src/content/page_copy.v1.ts";

function normalizeToken(value) {
  return String(value)
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .toLowerCase();
}

function exists(relativePath) {
  return fs.existsSync(path.join(ROOT, relativePath));
}

function readJson(relativePath) {
  const full = path.join(ROOT, relativePath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function missingFromList(paths) {
  return paths.filter((p) => !exists(p));
}

function collectCategory(results, category, missing) {
  results.categories.push({
    category,
    pass: missing.length === 0,
    missing,
  });

  if (missing.length > 0) {
    results.requiredFailures += 1;
  }
}

function validateObjectKeys(items, requiredKeys) {
  const failures = [];
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      failures.push(`item[${index}] is not an object`);
      continue;
    }
    for (const key of requiredKeys) {
      if (!(key in item)) {
        failures.push(`item[${index}] missing key '${key}'`);
      }
    }
  }
  return failures;
}

function runAudit() {
  const results = {
    categories: [],
    warnings: [],
    contentCounts: [],
    requiredFailures: 0,
    optionalQaEvents: { status: "SKIPPED", detail: "qa:events missing" },
  };

  collectCategory(results, "ROUTES", missingFromList(REQUIRED_ROUTE_PAGES));
  const marketingMissing = [];
  const copySourceContent = exists(PAGE_COPY_SOURCE)
    ? fs.readFileSync(path.join(ROOT, PAGE_COPY_SOURCE), "utf8")
    : "";
  for (const requirement of REQUIRED_MARKETING_PAGES) {
    if (!exists(requirement.file)) {
      marketingMissing.push(`${requirement.route}: missing file ${requirement.file}`);
      continue;
    }
    const content = fs.readFileSync(path.join(ROOT, requirement.file), "utf8");
    const combinedContent = normalizeToken(`${content}\n${copySourceContent}`);
    for (const token of requirement.tokens) {
      if (!combinedContent.includes(normalizeToken(token))) {
        marketingMissing.push(`${requirement.route}: missing token "${token}" in ${requirement.file}`);
      }
    }
  }
  if (!exists(MARKETING_NAV_FILE)) {
    marketingMissing.push(`missing file ${MARKETING_NAV_FILE}`);
  }
  if (!exists(NAV_CONFIG_FILE)) {
    marketingMissing.push(`missing file ${NAV_CONFIG_FILE}`);
  } else {
    const navConfigContent = fs.readFileSync(path.join(ROOT, NAV_CONFIG_FILE), "utf8");
    for (const token of ["Upgrade Your OS", "How It Works", "Outcomes", "Pricing", "143 Challenge"]) {
      if (!navConfigContent.toLowerCase().includes(token.toLowerCase())) {
        marketingMissing.push(`nav config missing token "${token}" in ${NAV_CONFIG_FILE}`);
      }
    }
  }
  collectCategory(results, "MARKETING_PAGES", marketingMissing);
  collectCategory(results, "API_ROUTES", missingFromList(REQUIRED_API_ROUTES));

  const optionalApiPresent = OPTIONAL_API_ROUTES.filter((p) => exists(p));
  results.warnings.push(
    optionalApiPresent.length > 0
      ? `Optional API present: ${optionalApiPresent.join(", ")}`
      : "Optional API missing: src/app/api/feedback/route.ts",
  );

  const taxonomyCandidates = [
    "src/lib/analytics/taxonomy.ts",
    "src/lib/analytics/taxonomy.mjs",
    "src/lib/analytics/taxonomy.js",
  ];
  const taxonomySource = taxonomyCandidates.find((p) => exists(p));

  const coreMissing = missingFromList(REQUIRED_CORE_LIBS);
  if (!taxonomySource) {
    coreMissing.push("src/lib/analytics/taxonomy.ts (or equivalent)");
  }
  collectCategory(results, "CORE_LIBS", coreMissing);

  const contentMissing = [];

  const questionsPath = "src/content/questions.json";
  const raysPath = "src/content/rays.json";
  const pairsPath = "src/content/ray_pairs.json";
  const resultsOverviewPath = "src/content/results_overview.json";

  if (!exists(questionsPath)) {
    contentMissing.push(questionsPath);
  }
  if (!exists(raysPath)) {
    contentMissing.push(raysPath);
  }
  if (!exists(pairsPath)) {
    contentMissing.push(pairsPath);
  }
  if (!exists(resultsOverviewPath)) {
    contentMissing.push(resultsOverviewPath);
  }

  const seedProfileCandidates = [
    "src/content/seed_profiles.json",
    "test_fixtures/seed_profiles.json",
  ];
  const seedProfilePath = seedProfileCandidates.find((p) => exists(p));
  if (!seedProfilePath) {
    contentMissing.push("src/content/seed_profiles.json OR test_fixtures/seed_profiles.json");
  }

  if (exists(questionsPath)) {
    try {
      const questions = readJson(questionsPath);
      const questionsArray = Array.isArray(questions) ? questions : [];
      const shapeIssues = validateObjectKeys(questionsArray, ["id", "ray_id", "prompt"]);
      if (questionsArray.length !== 143) {
        contentMissing.push(`${questionsPath} count=${questionsArray.length} expected=143`);
      }
      if (shapeIssues.length > 0) {
        contentMissing.push(`${questionsPath} shape issues: ${shapeIssues.slice(0, 8).join("; ")}`);
      }
      results.contentCounts.push(`questions: ${questionsArray.length} (expected 143)`);
    } catch (error) {
      contentMissing.push(`${questionsPath} parse_error: ${String(error)}`);
    }
  }

  if (exists(raysPath)) {
    try {
      const rays = readJson(raysPath);
      const raysArray = Array.isArray(rays) ? rays : [];
      const shapeIssues = validateObjectKeys(raysArray, ["ray_id", "name", "definition"]);
      if (raysArray.length !== 9) {
        contentMissing.push(`${raysPath} count=${raysArray.length} expected=9`);
      }
      if (shapeIssues.length > 0) {
        contentMissing.push(`${raysPath} shape issues: ${shapeIssues.slice(0, 8).join("; ")}`);
      }
      results.contentCounts.push(`rays: ${raysArray.length} (expected 9)`);
    } catch (error) {
      contentMissing.push(`${raysPath} parse_error: ${String(error)}`);
    }
  }

  if (exists(pairsPath)) {
    try {
      const pairs = readJson(pairsPath);
      const pairsArray = Array.isArray(pairs) ? pairs : [];
      const shapeIssues = validateObjectKeys(pairsArray, ["pair_id", "rays", "identity_opener"]);
      if (pairsArray.length !== 36) {
        contentMissing.push(`${pairsPath} count=${pairsArray.length} expected=36`);
      }
      if (shapeIssues.length > 0) {
        contentMissing.push(`${pairsPath} shape issues: ${shapeIssues.slice(0, 8).join("; ")}`);
      }
      results.contentCounts.push(`ray_pairs: ${pairsArray.length} (expected 36)`);
    } catch (error) {
      contentMissing.push(`${pairsPath} parse_error: ${String(error)}`);
    }
  }

  results.contentCounts.push(
    `results_overview: ${exists(resultsOverviewPath) ? "present" : "missing"}`,
  );
  results.contentCounts.push(
    `seed_profiles: ${seedProfilePath ? `present (${seedProfilePath})` : "missing"}`,
  );

  collectCategory(results, "CONTENT_FILES", contentMissing);

  const duplicateContentFound = DUPLICATE_CONTENT_PATHS.filter((p) => exists(p));
  collectCategory(results, "DUPLICATE_CONTENT", duplicateContentFound);

  const goldenDir = path.join(ROOT, "test_fixtures/goldens/reports");
  const goldenMissing = [];
  let goldenCount = 0;
  if (!fs.existsSync(goldenDir)) {
    goldenMissing.push("test_fixtures/goldens/reports");
  } else {
    const files = fs
      .readdirSync(goldenDir)
      .filter((entry) => entry.toLowerCase().endsWith(".html"));
    goldenCount = files.length;
    if (goldenCount !== 36) {
      goldenMissing.push(`test_fixtures/goldens/reports count=${goldenCount} expected=36`);
    }
  }
  results.contentCounts.push(`golden_reports: ${goldenCount} (expected 36)`);
  collectCategory(results, "GOLDENS", goldenMissing);

  const migrationMissing = missingFromList(REQUIRED_MIGRATIONS);
  const migrationsDir = path.join(ROOT, "supabase/migrations");
  const feedbackMigrations = fs.existsSync(migrationsDir)
    ? fs
        .readdirSync(migrationsDir)
        .filter((entry) => entry.toLowerCase().includes("feedback"))
    : [];
  const feedbackRoutePath = "src/app/api/feedback/route.ts";
  const feedbackRouteExists = exists(feedbackRoutePath);

  if (feedbackMigrations.length > 0 && !feedbackRouteExists) {
    migrationMissing.push(`${feedbackRoutePath} required because feedback migration exists`);
  }

  if (feedbackRouteExists && feedbackMigrations.length === 0) {
    results.warnings.push(
      `${feedbackRoutePath} exists but no feedback migration file found (warn only)`,
    );
  }

  collectCategory(results, "MIGRATIONS", migrationMissing);

  const scriptsMissing = [];
  let packageJson;
  try {
    packageJson = readJson("package.json");
  } catch (error) {
    scriptsMissing.push(`package.json parse_error: ${String(error)}`);
  }

  if (packageJson?.scripts) {
    for (const scriptName of REQUIRED_PACKAGE_SCRIPTS) {
      if (!Object.prototype.hasOwnProperty.call(packageJson.scripts, scriptName)) {
        scriptsMissing.push(`package.json scripts missing: ${scriptName}`);
      }
    }
  } else {
    scriptsMissing.push("package.json scripts object missing");
  }

  collectCategory(results, "PACKAGE_SCRIPTS", scriptsMissing);

  if (packageJson?.scripts && Object.prototype.hasOwnProperty.call(packageJson.scripts, "qa:events")) {
    try {
      execSync("npm run -s qa:events", {
        cwd: ROOT,
        stdio: "pipe",
        encoding: "utf8",
      });
      results.optionalQaEvents = {
        status: "PASS",
        detail: "qa:events ran successfully",
      };
    } catch (error) {
      const detail = error && typeof error === "object" && "stdout" in error
        ? String(error.stdout || error.message || "qa:events failed")
        : "qa:events failed";
      results.optionalQaEvents = {
        status: "FAIL",
        detail: detail.trim() || "qa:events failed",
      };
      results.warnings.push("qa:events failed (optional hook)");
    }
  } else {
    results.optionalQaEvents = {
      status: "SKIPPED",
      detail: "qa:events missing (skipped)",
    };
  }

  return {
    ...results,
    taxonomySource,
    optionalApiPresent,
    feedbackMigrations,
  };
}

function printReport(results) {
  console.log("CATEGORY | PASS/FAIL | missing_count");
  console.log("---|---|---");
  for (const category of results.categories) {
    console.log(`${category.category} | ${category.pass ? "PASS" : "FAIL"} | ${category.missing.length}`);
  }
  console.log(
    `OPTIONAL_QA_EVENTS | ${results.optionalQaEvents.status} | ${
      results.optionalQaEvents.status === "FAIL" ? 1 : 0
    }`,
  );

  console.log("\nMissing paths by category:");
  for (const category of results.categories) {
    if (category.missing.length === 0) {
      continue;
    }
    console.log(`\n[${category.category}]`);
    for (const missing of category.missing) {
      console.log(`- ${missing}`);
    }
  }

  console.log("\nContent counts:");
  for (const line of results.contentCounts) {
    console.log(`- ${line}`);
  }

  console.log("\nAdditional notes:");
  console.log(
    `- taxonomy_source: ${results.taxonomySource ?? "missing (required equivalent not found)"}`,
  );
  console.log(`- optional_feedback_api_present: ${results.optionalApiPresent.length > 0 ? "yes" : "no"}`);
  if (results.feedbackMigrations.length > 0) {
    console.log(`- feedback_migrations: ${results.feedbackMigrations.join(", ")}`);
  }
  console.log(`- optional_qa_events: ${results.optionalQaEvents.status} (${results.optionalQaEvents.detail})`);

  if (results.warnings.length > 0) {
    console.log("\nWarnings:");
    for (const warning of results.warnings) {
      console.log(`- ${warning}`);
    }
  }

  if (results.requiredFailures > 0) {
    console.log(`\naudit:build FAIL (required categories failing: ${results.requiredFailures})`);
    process.exit(1);
  }

  console.log("\naudit:build PASS");
}

const auditResults = runAudit();
printReport(auditResults);
