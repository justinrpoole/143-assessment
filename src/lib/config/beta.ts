/**
 * Beta mode configuration.
 *
 * When BETA_FREE_MODE=true, all payment gates are bypassed.
 * Users with `free_email` state get full assessment access
 * without needing to purchase or subscribe.
 */

export function isBetaFreeMode(): boolean {
  return process.env.BETA_FREE_MODE === "true";
}

function normalizeEmail(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function getBetaPreviewEmail(): string | null {
  const raw =
    process.env.BETA_PREVIEW_EMAIL ??
    process.env.NEXT_PUBLIC_BETA_PREVIEW_EMAIL ??
    "";
  const normalized = normalizeEmail(raw);
  return normalized ? normalized : null;
}

export function isBetaPreviewEmail(email: string | null | undefined): boolean {
  const preview = getBetaPreviewEmail();
  if (!preview) return false;
  return normalizeEmail(email) === preview;
}
