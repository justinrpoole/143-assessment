import { NextResponse } from "next/server";

import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { getStripeClient, getStripeEnv } from "@/lib/stripe/stripe";

function resolveReturnUrl(request: Request): string {
  return new URL("/account", request.url).toString();
}

export async function POST(request: Request) {
  const env = getStripeEnv();
  if (!env) {
    return NextResponse.json({ error: "stripe_env_missing" }, { status: 503 });
  }

  const auth = await getRequestAuthContext();
  if (!auth.isAuthenticated || !auth.userId) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
  }

  try {
    const entitlement = await getEntitlementByUserId(auth.userId);
    const customerId = entitlement?.stripe_customer_id;
    if (!customerId) {
      return NextResponse.json(
        { error: "stripe_customer_missing" },
        { status: 409 },
      );
    }

    const stripe = await getStripeClient();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: resolveReturnUrl(request),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error: "stripe_portal_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
