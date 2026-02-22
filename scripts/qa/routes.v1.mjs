export const PUBLIC_ROUTES = [
  "/upgrade-your-os",
  "/143",
  "/toolkit",
  "/preview",
  "/upgrade",
  "/sample-report",
  "/how-it-works",
  "/pricing",
  "/outcomes",
  "/justin",
  "/os-coaching",
  "/cohorts",
  "/corporate",
  "/enterprise",
  "/coach",
  "/faq",
  "/privacy",
  "/terms",
  "/login",
  "/",
];

export const AUTH_REQUIRED_ROUTES = [
  "/portal",
  "/dashboard",
  "/morning",
  "/micro-joy",
  "/account",
  "/assessment",
  "/assessment/setup",
  "/results",
  "/reports",
  "/growth",
];

export const INTERNAL_ROUTES = ["/spec-center"];

export const ALL_V1_ROUTES = [
  ...PUBLIC_ROUTES,
  ...AUTH_REQUIRED_ROUTES,
  ...INTERNAL_ROUTES,
];
