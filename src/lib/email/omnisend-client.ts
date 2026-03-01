/**
 * Omnisend REST API v3 client.
 *
 * Marketing-layer integration: subscriber sync, event forwarding, and
 * revenue attribution.  Resend stays for transactional email; Omnisend
 * handles newsletters, automation workflows, and segmentation.
 *
 * Docs: https://api-docs.omnisend.com/reference
 */

const OMNISEND_BASE = "https://api.omnisend.com/v3";

function getApiKey(): string | null {
  return process.env.OMNISEND_API_KEY ?? null;
}

function headers(apiKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "X-API-KEY": apiKey,
  };
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OmnisendContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  /** Omnisend custom properties — flat key/value pairs */
  customProperties?: Record<string, string>;
  /** "subscribed" | "nonSubscribed" | "unsubscribed" */
  status?: string;
}

export interface OmnisendEventInput {
  email: string;
  eventID: string;
  fields?: Record<string, string>;
}

export interface OmnisendOrderInput {
  email: string;
  orderId: string;
  currency: string;
  orderSum: number; // cents
  createdAt: string; // ISO 8601
  products?: Array<{
    productID: string;
    title: string;
    quantity: number;
    price: number; // cents
  }>;
}

export interface OmnisendResult {
  ok: boolean;
  status?: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function omnisendFetch(
  path: string,
  method: "POST" | "PUT" | "PATCH" | "GET",
  body?: unknown,
): Promise<OmnisendResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    // Omnisend is optional — silently skip when not configured
    return { ok: true, status: 0, error: "omnisend_not_configured" };
  }

  try {
    const res = await fetch(`${OMNISEND_BASE}${path}`, {
      method,
      headers: headers(apiKey),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (res.ok || res.status === 409) {
      // 409 = contact already exists (acceptable for upserts)
      return { ok: true, status: res.status };
    }

    const text = await res.text().catch(() => "");
    console.error("[omnisend]", method, path, res.status, text.slice(0, 300));
    return { ok: false, status: res.status, error: text.slice(0, 300) };
  } catch (err) {
    console.error(
      "[omnisend]",
      method,
      path,
      err instanceof Error ? err.message : String(err),
    );
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Add or update a contact in Omnisend.
 *
 * Uses POST /v3/contacts which creates OR updates when the email already
 * exists (Omnisend deduplicates by email).
 */
export async function addContact(
  input: OmnisendContactInput,
): Promise<OmnisendResult> {
  const identifiers = [
    {
      type: "email" as const,
      id: input.email,
      channels: {
        email: {
          status: input.status ?? "subscribed",
          statusDate: new Date().toISOString(),
        },
      },
    },
  ];

  const payload: Record<string, unknown> = {
    identifiers,
    ...(input.firstName ? { firstName: input.firstName } : {}),
    ...(input.lastName ? { lastName: input.lastName } : {}),
    ...(input.tags && input.tags.length > 0 ? { tags: input.tags } : {}),
    ...(input.customProperties
      ? { customProperties: input.customProperties }
      : {}),
  };

  return omnisendFetch("/contacts", "POST", payload);
}

/**
 * Add tags to an existing contact.
 */
export async function addContactTags(
  email: string,
  tags: string[],
): Promise<OmnisendResult> {
  if (tags.length === 0) return { ok: true };

  // Omnisend identifies contacts by contactID (their internal ID) or email.
  // The PATCH /contacts endpoint requires contactID, so we use POST with
  // just tags — Omnisend merges tags on existing contacts.
  return addContact({ email, tags });
}

/**
 * Send a custom event to Omnisend (triggers automations).
 *
 * Docs: https://api-docs.omnisend.com/reference/post-events
 */
export async function sendEvent(
  input: OmnisendEventInput,
): Promise<OmnisendResult> {
  return omnisendFetch("/events", "POST", {
    email: input.email,
    eventID: input.eventID,
    ...(input.fields ? { fields: input.fields } : {}),
  });
}

/**
 * Send an order event for revenue attribution.
 *
 * Docs: https://api-docs.omnisend.com/reference/post-orders
 */
export async function sendOrder(
  input: OmnisendOrderInput,
): Promise<OmnisendResult> {
  const products = input.products ?? [
    {
      productID: "assessment_43",
      title: "Be The Light Assessment",
      quantity: 1,
      price: input.orderSum,
    },
  ];

  return omnisendFetch("/orders", "POST", {
    orderID: input.orderId,
    email: input.email,
    currency: input.currency,
    orderSum: input.orderSum,
    createdAt: input.createdAt,
    paymentStatus: "paid",
    fulfillmentStatus: "fulfilled",
    products: products.map((p) => ({
      productID: p.productID,
      title: p.title,
      quantity: p.quantity,
      price: p.price,
      currency: input.currency,
    })),
  });
}
