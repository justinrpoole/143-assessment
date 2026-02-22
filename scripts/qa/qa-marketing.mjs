import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();

const REQUIRED_ROUTES = {
  "/": {
    file: "src/app/page.tsx",
    tokens: ['redirect("/upgrade-your-os")'],
  },
  "/assessment": {
    file: "src/app/assessment/page.tsx",
    tokens: [
      "The 143 Be The Light Assessment",
      "What Makes This Different",
      "What You'll Discover",
      "Pricing Tiers",
      "Sample Results Preview",
      "FAQs",
      "Ready to see where your light shines?",
    ],
  },
  "/framework": {
    file: "src/app/framework/page.tsx",
    tokens: [
      "The Be The Light Framework",
      "The Problem With Most Leadership Development",
      "How the Framework Works",
      "The Eclipse Concept",
    ],
  },
  "/143-challenge": {
    file: "src/app/143-challenge/page.tsx",
    tokens: ["The 143 Challenge", "The Practice", "Why it works", "Start now"],
  },
  "/organizations": {
    file: "src/app/organizations/page.tsx",
    tokens: ["For Organizations", "How We Work With Organizations"],
  },
  "/about": {
    file: "src/app/about/page.tsx",
    tokens: ["About Justin Ray", "Credibility", "Method and invitation"],
  },
  "/resources": {
    file: "src/app/resources/page.tsx",
    tokens: ["Resources", "Stay in the loop"],
  },
};

const HOME_SEQUENCE_TOKENS = [
  "Upgrade your internal operating system",
  "The problem is not your effort",
  "Choose your entry point",
  "The 9 Rays Preview",
  "143 Challenge Teaser",
  "What leaders are saying",
  "About Justin",
  "Ready to see where your light shines?",
];

const NAV_FILE = "src/components/marketing/MarketingNav.tsx";
const PAGE_COPY_FILE = "src/content/page_copy.v1.ts";

function abs(relativePath) {
  return path.join(ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(abs(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(abs(relativePath), "utf8");
}

function normalize(value) {
  return value
    .replaceAll("&apos;", "'")
    .replaceAll("&ldquo;", '"')
    .replaceAll("&rdquo;", '"')
    .replaceAll("\u2019", "'")
    .toLowerCase();
}

function findMissingTokens(content, tokens) {
  const lowered = normalize(content);
  return tokens.filter((token) => !lowered.includes(normalize(token)));
}

function main() {
  const failures = [];

  console.log("ROUTE | FILE_EXISTS | TOKENS_OK | PASS/FAIL");
  console.log("---|---|---|---");

  for (const [route, rule] of Object.entries(REQUIRED_ROUTES)) {
    const fileExists = exists(rule.file);
    const content = fileExists ? read(rule.file) : "";
    const missingTokens = fileExists ? findMissingTokens(content, rule.tokens) : rule.tokens;
    const pass = fileExists && missingTokens.length === 0;

    console.log(`${route} | ${fileExists ? "PASS" : "FAIL"} | ${missingTokens.length === 0 ? "PASS" : "FAIL"} | ${pass ? "PASS" : "FAIL"}`);

    if (!fileExists) {
      failures.push(`${route}: missing file ${rule.file}`);
      continue;
    }

    for (const token of missingTokens) {
      failures.push(`${route}: missing token \"${token}\" in ${rule.file}`);
    }
  }

  const homeFile = "src/app/upgrade-your-os/page.tsx";
  if (!exists(homeFile)) {
    failures.push(`HOME sequence check: missing ${homeFile}`);
  } else {
    const combinedHomeContent = `${read(homeFile)}\n${exists(PAGE_COPY_FILE) ? read(PAGE_COPY_FILE) : ""}`;
    const missingHomeTokens = findMissingTokens(combinedHomeContent, HOME_SEQUENCE_TOKENS);
    for (const token of missingHomeTokens) {
      failures.push(`HOME sequence: missing token \"${token}\" in ${homeFile}`);
    }
  }

  if (!exists(NAV_FILE)) {
    failures.push(`navigation missing file ${NAV_FILE}`);
  } else {
    const navContent = read(NAV_FILE);
    const missingNavTokens = findMissingTokens(navContent, [
      "Take the Assessment",
      "Home",
      "Assessment",
      "Framework",
      "143 Challenge",
      "For Organizations",
      "About",
      "Resources",
    ]);
    for (const token of missingNavTokens) {
      failures.push(`navigation: missing token \"${token}\" in ${NAV_FILE}`);
    }
  }

  if (failures.length > 0) {
    console.log("\nqa:marketing FAIL");
    for (const failure of failures) {
      console.log(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("\nqa:marketing PASS");
  console.log(`routes_checked: ${Object.keys(REQUIRED_ROUTES).length}`);
  console.log(`home_sequence_tokens_checked: ${HOME_SEQUENCE_TOKENS.length}`);
}

main();
