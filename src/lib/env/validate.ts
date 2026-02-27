/**
 * Startup environment validation.
 * Import at the top of root layout (server component) to catch missing vars early.
 */

const REQUIRED_ENV_VARS = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "MAGIC_LINK_SECRET",
  "NEXT_PUBLIC_SITE_URL",
] as const;

const OPTIONAL_BILLING_VARS = [
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_ASSESSMENT",
  "STRIPE_PRICE_SUBSCRIPTION",
] as const;

const OPTIONAL_OAUTH_VARS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
] as const;

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  validated = true;

  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  for (const key of OPTIONAL_BILLING_VARS) {
    if (!process.env[key]) {
      warnings.push(`${key} not set — Stripe billing will be disabled`);
    }
  }

  for (const key of OPTIONAL_OAUTH_VARS) {
    if (!process.env[key]) {
      warnings.push(`${key} not set — Google login will be disabled`);
    }
  }

  if (warnings.length > 0) {
    console.warn(`[env] ${warnings.length} optional var(s) missing:\n  ${warnings.join("\n  ")}`);
  }

  if (missing.length > 0) {
    const message = `[env] FATAL: ${missing.length} required env var(s) missing:\n  ${missing.join("\n  ")}`;
    console.error(message);
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
  }
}
