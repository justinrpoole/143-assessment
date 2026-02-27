import { createHash } from "node:crypto";

import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { emitEvent } from "@/lib/analytics/emitter";
import {
  getEntitlementByCustomerId,
  getEntitlementByUserId,
  markWebhookEventProcessed,
  markWebhookEventProcessing,
  upsertEntitlement,
} from "@/lib/db/entitlements";
import { queueEmailJob } from "@/lib/email/scheduler";
import { getStripeClient, getStripeEnv } from "@/lib/stripe/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUB_ACTIVE_STATUSES = new Set(["active", "trialing"]);
const SUB_PAST_DUE_STATUSES = new Set(["past_due", "unpaid", "incomplete"]);

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function toIsoFromUnix(value: number | null | undefined): string | null {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return null;
  }
  return new Date(value * 1000).toISOString();
}

function payloadHash(payload: string): string {
  return createHash("sha256").update(payload).digest("hex");
}

function subscriptionPeriodEndIso(subscription: Stripe.Subscription): string | null {
  const values = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");
  if (values.length === 0) {
    return null;
  }
  return toIsoFromUnix(Math.max(...values));
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const direct = asString(
    (invoice as unknown as { subscription?: unknown }).subscription,
  );
  if (direct) {
    return direct;
  }

  const nested = asString(
    (
      invoice as unknown as {
        parent?: { subscription_details?: { subscription?: unknown } };
      }
    ).parent?.subscription_details?.subscription,
  );
  return nested;
}

async function queueEmailJobSafe(params: {
  userId: string;
  type:
    | "subscription_renewal"
    | "subscription_reactivation"
    | "subscription_past_due";
  payload: Record<string, unknown>;
}): Promise<void> {
  try {
    await queueEmailJob({
      userId: params.userId,
      type: params.type,
      payload: params.payload,
    });
  } catch (error) {
    console.error(
      "[email_job_queue_failed]",
      error instanceof Error ? error.message : String(error),
    );
  }
}

async function resolveUserId(params: {
  metadataUserId?: string | null;
  fallbackCustomerId?: string | null;
}): Promise<string | null> {
  const metadataUserId = asString(params.metadataUserId);
  if (metadataUserId) {
    return metadataUserId;
  }

  const customerId = asString(params.fallbackCustomerId);
  if (!customerId) {
    return null;
  }

  const entitlement = await getEntitlementByCustomerId(customerId);
  return entitlement?.user_id ?? null;
}

function deriveSubscriptionState(subscription: Stripe.Subscription):
  | "sub_active"
  | "sub_canceled"
  | "past_due" {
  if (subscription.status === "canceled") {
    return "sub_canceled";
  }
  if (SUB_ACTIVE_STATUSES.has(subscription.status)) {
    return "sub_active";
  }
  if (SUB_PAST_DUE_STATUSES.has(subscription.status)) {
    return "past_due";
  }
  return "sub_canceled";
}

async function handleCheckoutCompleted(event: Stripe.Event): Promise<void> {
  const session = event.data.object as Stripe.Checkout.Session;
  const mode = session.mode;
  const metadataMode = asString(session.metadata?.checkout_mode);
  const checkoutMode = metadataMode ?? mode ?? "payment";
  const userId = await resolveUserId({
    metadataUserId:
      asString(session.metadata?.user_id) ?? asString(session.client_reference_id),
    fallbackCustomerId: asString(session.customer),
  });

  if (!userId) {
    throw new Error("checkout_completed_user_unresolved");
  }

  const existing = await getEntitlementByUserId(userId);
  const customerId = asString(session.customer);

  if (checkoutMode === "paid_43" || mode === "payment") {
    const nextState = existing?.user_state === "sub_active" ? "sub_active" : "paid_43";
    await upsertEntitlement({
      user_id: userId,
      user_state: nextState,
      stripe_customer_id: customerId ?? existing?.stripe_customer_id ?? null,
      paid_43_at: new Date().toISOString(),
    });

    emitEvent({
      eventName: "purchase_complete",
      sourceRoute: "/upgrade",
      userState: nextState,
      userId,
      extra: {
        product_sku: "assessment_43",
        amount_cents: session.amount_total ?? 4300,
        currency: session.currency ?? "usd",
        stripe_checkout_session_id: session.id,
      },
    });
    return;
  }

  await upsertEntitlement({
    user_id: userId,
    user_state: existing?.user_state ?? "free_email",
    stripe_customer_id: customerId ?? existing?.stripe_customer_id ?? null,
  });
}

async function handleSubscriptionUpsert(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = asString(subscription.customer);
  const userId = await resolveUserId({
    metadataUserId: asString(subscription.metadata?.user_id),
    fallbackCustomerId: customerId,
  });
  if (!userId || !customerId) {
    throw new Error("subscription_user_unresolved");
  }

  const previous = await getEntitlementByUserId(userId);
  const nextState = deriveSubscriptionState(subscription);
  await upsertEntitlement({
    user_id: userId,
    user_state: nextState,
    stripe_customer_id: customerId,
    sub_status: subscription.status,
    sub_current_period_end: subscriptionPeriodEndIso(subscription),
  });

  if (nextState === "sub_active") {
    const isReactivation =
      previous?.user_state === "sub_canceled" || previous?.user_state === "past_due";
    emitEvent({
      eventName: isReactivation ? "reactivated" : "subscription_started",
      sourceRoute: "/upgrade",
      userState: "sub_active",
      userId,
      extra: isReactivation
        ? {
            stripe_subscription_id: subscription.id,
            reactivation_source: "webhook",
          }
        : {
            stripe_subscription_id: subscription.id,
            price_id: asString(subscription.items.data[0]?.price?.id),
            billing_cycle_anchor: toIsoFromUnix(subscription.billing_cycle_anchor),
          },
    });
    await queueEmailJobSafe({
      userId,
      type: "subscription_renewal",
      payload: {
        account_route: "/account",
        billing_state: "sub_active",
      },
    });
    return;
  }

  if (nextState === "sub_canceled") {
    emitEvent({
      eventName: "subscription_canceled",
      sourceRoute: "/account",
      userState: "sub_canceled",
      userId,
      extra: {
        stripe_subscription_id: subscription.id,
        effective_at: toIsoFromUnix(subscription.ended_at) ?? new Date().toISOString(),
        reason_code: "subscription_status_canceled",
      },
    });
    await queueEmailJobSafe({
      userId,
      type: "subscription_reactivation",
      payload: {
        account_route: "/account",
        upgrade_route: "/upgrade",
      },
    });
    return;
  }

  emitEvent({
    eventName: "payment_failed",
    sourceRoute: "/account",
    userState: "past_due",
    userId,
    extra: {
      stripe_subscription_id: subscription.id,
      invoice_id: null,
      attempt_count: null,
    },
  });
  await queueEmailJobSafe({
    userId,
    type: "subscription_past_due",
    payload: {
      account_route: "/account",
      upgrade_route: "/upgrade",
    },
  });
}

async function handleSubscriptionDeleted(event: Stripe.Event): Promise<void> {
  const subscription = event.data.object as Stripe.Subscription;
  const customerId = asString(subscription.customer);
  const userId = await resolveUserId({
    metadataUserId: asString(subscription.metadata?.user_id),
    fallbackCustomerId: customerId,
  });
  if (!userId || !customerId) {
    throw new Error("subscription_deleted_user_unresolved");
  }

  await upsertEntitlement({
    user_id: userId,
    user_state: "sub_canceled",
    stripe_customer_id: customerId,
    sub_status: "canceled",
    sub_current_period_end: subscriptionPeriodEndIso(subscription),
  });

  emitEvent({
    eventName: "subscription_canceled",
    sourceRoute: "/account",
    userState: "sub_canceled",
    userId,
    extra: {
      stripe_subscription_id: subscription.id,
      effective_at: toIsoFromUnix(subscription.ended_at) ?? new Date().toISOString(),
      reason_code: "webhook_deleted",
    },
  });
  await queueEmailJobSafe({
    userId,
    type: "subscription_reactivation",
    payload: {
      account_route: "/account",
      upgrade_route: "/upgrade",
    },
  });
}

async function handleInvoicePaid(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = asString(invoice.customer);
  const userId = await resolveUserId({
    metadataUserId: asString(invoice.parent?.subscription_details?.metadata?.user_id),
    fallbackCustomerId: customerId,
  });
  if (!userId || !customerId) {
    throw new Error("invoice_paid_user_unresolved");
  }

  const previous = await getEntitlementByUserId(userId);
  await upsertEntitlement({
    user_id: userId,
    user_state: "sub_active",
    stripe_customer_id: customerId,
    sub_status: "active",
  });

  if (previous?.user_state === "past_due" || previous?.user_state === "sub_canceled") {
    emitEvent({
      eventName: "reactivated",
      sourceRoute: "/account",
      userState: "sub_active",
      userId,
      extra: {
        stripe_subscription_id: invoiceSubscriptionId(invoice),
        reactivation_source: "invoice_paid",
      },
    });
    await queueEmailJobSafe({
      userId,
      type: "subscription_renewal",
      payload: {
        account_route: "/account",
        billing_state: "sub_active",
      },
    });
  }
}

async function handleInvoicePaymentFailed(event: Stripe.Event): Promise<void> {
  const invoice = event.data.object as Stripe.Invoice;
  const customerId = asString(invoice.customer);
  const userId = await resolveUserId({
    metadataUserId: asString(invoice.parent?.subscription_details?.metadata?.user_id),
    fallbackCustomerId: customerId,
  });
  if (!userId || !customerId) {
    throw new Error("invoice_failed_user_unresolved");
  }

  await upsertEntitlement({
    user_id: userId,
    user_state: "past_due",
    stripe_customer_id: customerId,
    sub_status: "past_due",
  });

  emitEvent({
    eventName: "payment_failed",
    sourceRoute: "/account",
    userState: "past_due",
    userId,
    extra: {
      stripe_subscription_id: invoiceSubscriptionId(invoice),
      invoice_id: invoice.id,
      attempt_count: invoice.attempt_count ?? 1,
    },
  });
  await queueEmailJobSafe({
    userId,
    type: "subscription_past_due",
    payload: {
      account_route: "/account",
      upgrade_route: "/upgrade",
    },
  });
}

async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event);
      return;
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleSubscriptionUpsert(event);
      return;
    case "customer.subscription.deleted":
      await handleSubscriptionDeleted(event);
      return;
    case "invoice.paid":
      await handleInvoicePaid(event);
      return;
    case "invoice.payment_failed":
      await handleInvoicePaymentFailed(event);
      return;
    default:
      return;
  }
}

export async function POST(request: Request) {
  const env = getStripeEnv();
  if (!env) {
    return NextResponse.json({ error: "stripe_env_missing" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "stripe_signature_missing" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = await getStripeClient();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (signatureError) {
    // Signature verification failed — bad request, do NOT retry
    return NextResponse.json(
      {
        error: "stripe_signature_invalid",
        detail: signatureError instanceof Error ? signatureError.message : String(signatureError),
      },
      { status: 400 },
    );
  }

  try {
    const processing = await markWebhookEventProcessing({
      eventId: event.id,
      eventType: event.type,
      payloadHash: payloadHash(body),
    });
    if (processing === "already_processed") {
      return NextResponse.json({ received: true, deduplicated: true });
    }

    try {
      await processWebhookEvent(event);
      await markWebhookEventProcessed({ eventId: event.id, success: true });
      return NextResponse.json({ received: true });
    } catch (processingError) {
      await markWebhookEventProcessed({
        eventId: event.id,
        success: false,
        failureReason:
          processingError instanceof Error
            ? processingError.message
            : String(processingError),
      });
      throw processingError;
    }
  } catch (error) {
    // Processing error — return 500 so Stripe will retry
    return NextResponse.json(
      {
        error: "stripe_webhook_processing_failed",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
