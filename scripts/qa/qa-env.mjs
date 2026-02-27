import process from "node:process";
import { loadEnvIfMissing } from "./load-env.mjs";

loadEnvIfMissing();

const REQUIRED_GROUPS = {
  Supabase: [
    { type: "any", keys: ["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"] },
    { type: "all", keys: ["SUPABASE_SERVICE_ROLE_KEY"] },
  ],
  Stripe: [
    {
      type: "all",
      keys: [
        "STRIPE_SECRET_KEY",
        "STRIPE_WEBHOOK_SECRET",
        "STRIPE_PRICE_PAID_43",
        "STRIPE_PRICE_SUB_1433",
      ],
    },
  ],
  Storage: [
    { type: "all", keys: [] },
  ],
  "Email provider": [
    { type: "any", keys: ["RESEND_API_KEY", "EMAIL_PROVIDER_API_KEY"] },
  ],
  "App base URL": [
    { type: "all", keys: ["APP_BASE_URL"] },
  ],
};

const RECOMMENDED_KEYS = ["MAGIC_LINK_SECRET", "ENV_SPEC_CENTER_KEY", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"];

function isTruthy(value) {
  if (!value) {
    return false;
  }
  const normalized = String(value).trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

function isSet(key) {
  const value = process.env[key];
  return typeof value === "string" && value.length > 0;
}

function validateGroups() {
  const missing = [];

  for (const [groupName, requirements] of Object.entries(REQUIRED_GROUPS)) {
    for (const requirement of requirements) {
      if (requirement.keys.length === 0) {
        continue;
      }
      if (requirement.type === "all") {
        for (const key of requirement.keys) {
          if (!isSet(key)) {
            missing.push({ groupName, key, mode: "required" });
          }
        }
        continue;
      }

      const hasAny = requirement.keys.some((key) => isSet(key));
      if (!hasAny) {
        missing.push({
          groupName,
          key: requirement.keys.join(" OR "),
          mode: "one_of",
        });
      }
    }
  }

  return missing;
}

function collectRecommendedMissing() {
  return RECOMMENDED_KEYS.filter((key) => !isSet(key));
}

function printMissing(missing, recommendedMissing) {
  if (missing.length === 0) {
    console.log("qa:env PASS");
    console.log("All required environment variables are set.");
  } else {
    console.log("qa:env MISSING REQUIRED");
    console.log("Missing required vars:");
    for (const item of missing) {
      console.log(`- [${item.groupName}] ${item.key}`);
    }
  }

  if (recommendedMissing.length > 0) {
    console.log("Missing recommended vars:");
    for (const key of recommendedMissing) {
      console.log(`- ${key}`);
    }
  }
}

function main() {
  const missing = validateGroups();
  const recommendedMissing = collectRecommendedMissing();

  printMissing(missing, recommendedMissing);

  const ciMode = isTruthy(process.env.CI);
  console.log(`CI mode: ${ciMode ? "true" : "false"}`);

  if (missing.length > 0 && !ciMode) {
    console.log("Result: SKIP (non-CI). Fill missing vars to enable full integration checks.");
    return;
  }

  if (missing.length > 0 && ciMode) {
    console.error("qa:env FAIL (missing required vars in CI mode)");
    process.exit(1);
  }
}

main();
