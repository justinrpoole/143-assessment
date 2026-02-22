import type Stripe from "stripe";

interface StripeEnv {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PRICE_PAID_43: string;
  STRIPE_PRICE_SUB_1433: string;
}

let cachedStripe: Stripe | null = null;

export function getStripeEnv(): StripeEnv | null {
  const env: StripeEnv = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? "",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? "",
    STRIPE_PRICE_PAID_43: process.env.STRIPE_PRICE_PAID_43 ?? "",
    STRIPE_PRICE_SUB_1433: process.env.STRIPE_PRICE_SUB_1433 ?? "",
  };

  if (
    !env.STRIPE_SECRET_KEY ||
    !env.STRIPE_WEBHOOK_SECRET ||
    !env.STRIPE_PRICE_PAID_43 ||
    !env.STRIPE_PRICE_SUB_1433
  ) {
    return null;
  }

  return env;
}

export async function getStripeClient(): Promise<Stripe> {
  const env = getStripeEnv();
  if (!env) {
    throw new Error("stripe_env_missing");
  }

  if (cachedStripe) {
    return cachedStripe;
  }

  let stripeModule: typeof import("stripe");
  try {
    stripeModule = await import("stripe");
  } catch {
    throw new Error("stripe_sdk_not_installed: install `stripe` package");
  }

  cachedStripe = new stripeModule.default(env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
  });

  return cachedStripe;
}
