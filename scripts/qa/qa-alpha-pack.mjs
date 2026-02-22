import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const REQUIRED_DOCS = [
  "docs/ALPHA_TEST_PLAN.md",
  "docs/ALPHA_TESTER_SCRIPT.md",
  "docs/ALPHA_OUTREACH_MESSAGES.md",
  "docs/ALPHA_FEEDBACK_RUBRIC.md",
];

const REQUIRED_FEEDBACK_TYPES = [
  "question_clarity",
  "report_resonance",
  "next_step_confidence",
  "upgrade_clarity",
  "checkout_friction",
  "morning_value",
  "microjoy_value",
  "share_motivation",
  "overall_experience",
];

const PAGE_EXPECTATIONS = [
  {
    file: "src/app/preview/page.tsx",
    feedbackTypes: ["question_clarity"],
  },
  {
    file: "src/app/results/page.tsx",
    feedbackTypes: ["report_resonance", "next_step_confidence"],
  },
  {
    file: "src/app/reports/page.tsx",
    feedbackTypes: ["report_resonance"],
  },
  {
    file: "src/app/upgrade/page.tsx",
    feedbackTypes: ["upgrade_clarity", "checkout_friction"],
  },
  {
    file: "src/app/morning/page.tsx",
    feedbackTypes: ["morning_value"],
  },
  {
    file: "src/app/micro-joy/page.tsx",
    feedbackTypes: ["microjoy_value"],
  },
];

async function exists(relativePath) {
  try {
    await fs.access(path.resolve(process.cwd(), relativePath));
    return true;
  } catch {
    return false;
  }
}

async function read(relativePath) {
  return fs.readFile(path.resolve(process.cwd(), relativePath), "utf8");
}

function parseQuotedStrings(content) {
  const values = [];
  const pattern = /["'`]([a-z0-9_\-/]+)["'`]/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    values.push(match[1]);
  }
  return values;
}

async function main() {
  const failures = [];

  for (const file of REQUIRED_DOCS) {
    if (!(await exists(file))) {
      failures.push(`Missing doc: ${file}`);
    }
  }

  const feedbackTypesFile = "src/lib/feedback/feedback-types.ts";
  if (!(await exists(feedbackTypesFile))) {
    failures.push(`Missing file: ${feedbackTypesFile}`);
  } else {
    const content = await read(feedbackTypesFile);
    const strings = parseQuotedStrings(content);
    const present = new Set(strings.filter((value) => value.includes("_") || value === "overall_experience"));

    for (const type of REQUIRED_FEEDBACK_TYPES) {
      if (!present.has(type)) {
        failures.push(`Missing feedback type in list: ${type}`);
      }
    }
  }

  const widgetFile = "src/components/feedback/FeedbackWidget.tsx";
  if (!(await exists(widgetFile))) {
    failures.push(`Missing file: ${widgetFile}`);
  } else {
    const widgetContent = await read(widgetFile);
    if (!widgetContent.includes('fetch("/api/feedback"')) {
      failures.push("FeedbackWidget does not POST to /api/feedback");
    }
    if (!widgetContent.includes("maxLength={1000}")) {
      failures.push("FeedbackWidget missing free_text maxLength=1000");
    }
  }

  const routeFile = "src/app/api/feedback/route.ts";
  if (!(await exists(routeFile))) {
    failures.push(`Missing file: ${routeFile}`);
  } else {
    const routeContent = await read(routeFile);
    if (!routeContent.includes("isFeedbackType")) {
      failures.push("Feedback API route missing feedback_type guard");
    }
    if (!routeContent.includes("slice(0, 1000)")) {
      failures.push("Feedback API route missing free_text length guard to 1000");
    }
  }

  for (const page of PAGE_EXPECTATIONS) {
    if (!(await exists(page.file))) {
      failures.push(`Missing target page: ${page.file}`);
      continue;
    }

    const content = await read(page.file);
    if (!content.includes('from "@/components/feedback/FeedbackWidget"')) {
      failures.push(`FeedbackWidget import missing in ${page.file}`);
    }

    for (const feedbackType of page.feedbackTypes) {
      if (!content.includes(`feedback_type="${feedbackType}"`)) {
        failures.push(
          `Feedback type ${feedbackType} not wired in ${page.file}`,
        );
      }
    }
  }

  const rubric = await read("docs/ALPHA_FEEDBACK_RUBRIC.md").catch(() => "");
  for (const feedbackType of REQUIRED_FEEDBACK_TYPES) {
    if (!rubric.includes(feedbackType)) {
      failures.push(
        `ALPHA_FEEDBACK_RUBRIC.md missing feedback bucket: ${feedbackType}`,
      );
    }
  }

  if (failures.length > 0) {
    console.log("qa:alpha FAIL");
    for (const item of failures) {
      console.log(`- ${item}`);
    }
    process.exit(1);
  }

  console.log("qa:alpha PASS");
  console.log(`docs_checked: ${REQUIRED_DOCS.length}`);
  console.log(`pages_checked: ${PAGE_EXPECTATIONS.length}`);
  console.log(`feedback_types_checked: ${REQUIRED_FEEDBACK_TYPES.length}`);
}

main().catch((error) => {
  console.error("qa:alpha FAILED");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
