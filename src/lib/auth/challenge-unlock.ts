import { createHmac, timingSafeEqual } from "crypto";

import { sanitizeSourceRoute } from "@/lib/nav/source-route";

export interface ChallengeUnlockPayload {
  email: string;
  sourceRoute: string;
  exp: number;
}

function getChallengeUnlockSecret(): string {
  const secret = process.env.CHALLENGE_UNLOCK_SECRET ?? process.env.MAGIC_LINK_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("CHALLENGE_UNLOCK_SECRET is required in production");
  }
  return "dev-only-challenge-unlock-secret";
}

function signPayload(payloadBase64: string): string {
  return createHmac("sha256", getChallengeUnlockSecret())
    .update(payloadBase64)
    .digest("hex");
}

export function createChallengeUnlockToken(
  email: string,
  sourceRoute: string,
  ttlSeconds = 60 * 60 * 24 * 14,
): string {
  const payload: ChallengeUnlockPayload = {
    email: email.toLowerCase().trim(),
    sourceRoute: sanitizeSourceRoute(sourceRoute),
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${payloadBase64}.${signPayload(payloadBase64)}`;
}

export function verifyChallengeUnlockToken(token: string): ChallengeUnlockPayload | null {
  const [payloadBase64, signature] = token.split(".");
  if (!payloadBase64 || !signature) return null;

  const expectedSignature = signPayload(payloadBase64);
  const incoming = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");
  if (incoming.length !== expected.length || !timingSafeEqual(incoming, expected)) {
    return null;
  }

  const parsed = JSON.parse(
    Buffer.from(payloadBase64, "base64url").toString("utf8"),
  ) as ChallengeUnlockPayload;

  if (!parsed?.email || !parsed?.sourceRoute || !parsed?.exp) {
    return null;
  }

  if (parsed.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return {
    email: parsed.email,
    sourceRoute: sanitizeSourceRoute(parsed.sourceRoute),
    exp: parsed.exp,
  };
}

