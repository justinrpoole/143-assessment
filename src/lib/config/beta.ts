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
