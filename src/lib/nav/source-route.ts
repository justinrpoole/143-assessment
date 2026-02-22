const FALLBACK_ROUTE = "/upgrade-your-os";

const ALLOWED_ROUTES = new Set<string>([
  "/143",
  "/toolkit",
  "/preview",
  "/micro-joy",
  "/morning",
  "/os-coaching",
  "/cohorts",
  "/corporate",
  "/upgrade-your-os",
]);

export function sanitizeSourceRoute(value: string | null | undefined): string {
  if (!value) {
    return FALLBACK_ROUTE;
  }

  return ALLOWED_ROUTES.has(value) ? value : FALLBACK_ROUTE;
}

export function loginRouteForSource(sourceRoute: string): string {
  const nextRoute = sanitizeSourceRoute(sourceRoute);
  return `/login?next=${encodeURIComponent(nextRoute)}`;
}
