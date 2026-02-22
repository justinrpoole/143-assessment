import { createHmac, timingSafeEqual } from "crypto";

import { sanitizeSourceRoute } from "@/lib/nav/source-route";

function getMagicLinkSecret(): string {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("MAGIC_LINK_SECRET is required in production");
  }
  return "dev-only-insecure-secret-do-not-use-in-prod";
}

export interface MagicLinkPayload {
  email: string;
  sourceRoute: string;
  exp: number;
}

function signPayload(payloadBase64: string): string {
  return createHmac("sha256", getMagicLinkSecret()).update(payloadBase64).digest("hex");
}

export function createMagicLinkToken(email: string, sourceRoute: string, ttlSeconds = 900): string {
  const payload: MagicLinkPayload = {
    email: email.toLowerCase().trim(),
    sourceRoute: sanitizeSourceRoute(sourceRoute),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = signPayload(payloadBase64);

  return `${payloadBase64}.${signature}`;
}

export function verifyMagicLinkToken(token: string): MagicLinkPayload | null {
  const [payloadBase64, signature] = token.split(".");

  if (!payloadBase64 || !signature) {
    return null;
  }

  const expectedSignature = signPayload(payloadBase64);
  const incoming = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (incoming.length !== expected.length || !timingSafeEqual(incoming, expected)) {
    return null;
  }

  const parsed = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8")) as MagicLinkPayload;

  if (parsed.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    email: parsed.email,
    sourceRoute: sanitizeSourceRoute(parsed.sourceRoute),
    exp: parsed.exp,
  };
}
