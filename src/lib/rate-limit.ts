/**
 * Simple in-memory token-bucket rate limiter.
 * Production upgrade path: swap the Map for Redis (e.g. @upstash/ratelimit).
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimiterConfig {
  /** Maximum tokens (requests) allowed per window */
  maxTokens: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

const stores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(namespace: string): Map<string, RateLimitEntry> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

/** Periodically purge stale entries to prevent memory leaks. */
const PURGE_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const PURGE_STALE_MS = 10 * 60 * 1000; // 10 minutes

let purgeTimer: ReturnType<typeof setInterval> | null = null;

function ensurePurge() {
  if (purgeTimer) return;
  purgeTimer = setInterval(() => {
    const now = Date.now();
    for (const store of stores.values()) {
      for (const [key, entry] of store) {
        if (now - entry.lastRefill > PURGE_STALE_MS) {
          store.delete(key);
        }
      }
    }
  }, PURGE_INTERVAL_MS);
  // Allow process to exit without waiting for timer
  if (purgeTimer && typeof purgeTimer === "object" && "unref" in purgeTimer) {
    purgeTimer.unref();
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Create a namespaced rate limiter.
 *
 * Usage:
 * ```ts
 * const limiter = createRateLimiter("magic_link", { maxTokens: 5, windowMs: 60 * 60 * 1000 });
 * const result = limiter.check("user@example.com");
 * if (!result.allowed) return new Response("Too many requests", { status: 429 });
 * ```
 */
export function createRateLimiter(namespace: string, config: RateLimiterConfig) {
  ensurePurge();
  const store = getStore(namespace);

  return {
    check(key: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now - entry.lastRefill >= config.windowMs) {
        // New window — grant all tokens minus this request
        store.set(key, { tokens: config.maxTokens - 1, lastRefill: now });
        return { allowed: true, remaining: config.maxTokens - 1, retryAfterMs: 0 };
      }

      if (entry.tokens > 0) {
        entry.tokens -= 1;
        return { allowed: true, remaining: entry.tokens, retryAfterMs: 0 };
      }

      // Exhausted
      const retryAfterMs = config.windowMs - (now - entry.lastRefill);
      return { allowed: false, remaining: 0, retryAfterMs };
    },

    /** Reset a specific key (e.g. after successful action) */
    reset(key: string): void {
      store.delete(key);
    },
  };
}

/**
 * Extract a rate-limit key from a Request.
 * Prefers the email from JSON body; falls back to IP from headers.
 */
export function rateLimitKeyFromRequest(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";
  return ip;
}

/**
 * Build a 429 JSON response with Retry-After header.
 */
export function tooManyRequestsResponse(result: RateLimitResult): Response {
  const retryAfterSeconds = Math.ceil(result.retryAfterMs / 1000);
  return new Response(
    JSON.stringify({ error: "too_many_requests", retry_after_seconds: retryAfterSeconds }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}
