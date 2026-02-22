import { NextResponse } from "next/server";

import { emitEvent } from "@/lib/analytics/emitter";
import { getRequestAuthContext } from "@/lib/auth/request-context";
import { getEntitlementByUserId } from "@/lib/db/entitlements";
import { getStripeClient, getStripeEnv } from "@/lib/stripe/stripe";

type CheckoutMode = "paid_43" | "subscription";

interface CheckoutBody {
  mode?: CheckoutMode;
  successUrl?: string;
  cancelUrl?: string;
}

const MODE_TO_PRICE_CENTS: Record<CheckoutMode, number> = {
  paid_43: 4300,
  subscription: 1433,
};

const MODE_TO_PRODUCT_SKU: Record<CheckoutMode, string> = {
  paid_43: "assessment_43",
  subscription: "os_updates_1433",
};

function parseMode(value: unknown): CheckoutMode | null {
  if (value === "paid_43" || value === "subscription") {
    return value;
  }
  return null;
}

function resolveReturnUrl(
  request: Request,
  candidate: unknown,
  fallbackPath: string,
): string {
  if (typeof candidate === "string" && candidate.length > 0) {
    if (candidate.startsWith("/")) {
      return new URL(candidate, request.url).toString();
    }

    try {
      const parsed = new URL(candidate);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.toString();
      }
    } catch {
      // Fall through to fallback.
    }
  }

  return new URL(fallbackPath, request.url).toString();
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

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const mode = parseMode(body.mode);
  if (!mode) {
    return NextResponse.json({ error: "invalid_mode" }, { status: 400 });
  }

  const successUrl = resolveReturnUrl(request, body.successUrl, "/portal");
  const cancelUrl = resolveReturnUrl(request, body.cancelUrl, "/upgrade");

  try {
    const stripe = await getStripeClient();
    const entitlement = await getEntitlementByUserId(auth.userId).catch(
      () => null,
    );
    const customerId =
      typeof entitlement?.stripe_customer_id === "string"
        ? entitlement.stripe_customer_id
        : undefined;

    const linePriceId =
      mode === "paid_43" ? env.STRIPE_PRICE_PAID_43 : env.STRIPE_PRICE_SUB_1433;
    const checkoutMode = mode === "paid_43" ? "payment" : "subscription";
    const session = await stripe.checkout.sessions.create({
      mode: checkoutMode,
      line_items: [{ price: linePriceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: auth.userId,
      customer: customerId,
      customer_creation:
        mode === "paid_43" && !customerId ? "always" : undefined,
      metadata: {
        user_id: auth.userId,
        checkout_mode: mode,
      },
      subscription_data:
        mode === "subscription"
          ? {
              metadata: {
                user_id: auth.userId,
              },
            }
          : undefined,
      allow_promotion_codes: false,
    });

    emitEvent({
      eventName: "checkout_start",
      sourceRoute: "/upgrade",
      userState: auth.userState,
      userId: auth.userId,
      extra: {
        product_sku: MODE_TO_PRODUCT_SKU[mode],
        amount_cents: MODE_TO_PRICE_CENTS[mode],
        currency: "usd",
        billing_mode: mode === "paid_43" ? "one_time" : "subscription",
        stripe_checkout_session_id: session.id,
      },
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "stripe_checkout_url_missing" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      url: session.url,
      session_id: session.id,
      mode,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "stripe_checkout_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
