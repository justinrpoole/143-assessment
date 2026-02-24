const FALLBACK_ROUTE = "/upgrade-your-os";

/**
 * Routes that are valid post-login destinations.
 * Any path starting with one of these prefixes is allowed.
 */
const ALLOWED_PREFIXES = [
  "/143",
  "/toolkit",
  "/preview",
  "/micro-joy",
  "/morning",
  "/os-coaching",
  "/cohorts",
  "/corporate",
  "/upgrade-your-os",
  "/assessment",
  "/portal",
  "/results",
  "/reports",
  "/upgrade",
  "/dashboard",
  "/growth",
  "/energy",
  "/reflect",
  "/reps",
  "/weekly",
  "/spec-center",
  "/light-dashboard",
];

export function sanitizeSourceRoute(value: string | null | undefined): string {
  if (!value || !value.startsWith("/")) {
    return FALLBACK_ROUTE;
  }

  // Block protocol-relative URLs and paths with encoded characters
  if (value.startsWith("//") || value.includes("\\") || value.includes("%")) {
    return FALLBACK_ROUTE;
  }

  return ALLOWED_PREFIXES.some((prefix) => value === prefix || value.startsWith(prefix + "/"))
    ? value
    : FALLBACK_ROUTE;
}

export function loginRouteForSource(sourceRoute: string): string {
  const nextRoute = sanitizeSourceRoute(sourceRoute);
  return `/login?next=${encodeURIComponent(nextRoute)}`;
}
