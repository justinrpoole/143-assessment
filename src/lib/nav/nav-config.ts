export type NavLink = {
  href: string;
  label: string;
};

export type NavGroup = {
  label: string;
  children: NavLink[];
};

export type NavItem = NavLink | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

/* ── All named links ────────────────────────────────────── */

export const MARKETING_LINKS = {
  upgradeOs: { href: "/upgrade-your-os", label: "Upgrade Your OS" },
  howItWorks: { href: "/how-it-works", label: "How It Works" },
  outcomes: { href: "/outcomes", label: "Outcomes" },
  pricing: { href: "/pricing", label: "Pricing" },
  challenge: { href: "/143", label: "143 Challenge" },
  assessment: { href: "/assessment", label: "Assessment" },
  preview: { href: "/preview", label: "Stability Check" },
  sampleReport: { href: "/sample-report", label: "Sample Report" },
  framework: { href: "/framework", label: "The Framework" },
  archetypes: { href: "/archetypes", label: "Archetypes" },
  glossary: { href: "/glossary", label: "Glossary" },
  resources: { href: "/resources", label: "Resources" },
  coaches: { href: "/coaches", label: "Coaching Program" },
  about: { href: "/about", label: "About" },
  forTeams: { href: "/organizations", label: "For Organizations" },
  privacy: { href: "/privacy", label: "Privacy" },
  terms: { href: "/terms", label: "Terms" },
  login: { href: "/login", label: "Sign In" },
  portal: { href: "/portal", label: "My Portal" },
  lightDashboard: { href: "/light-dashboard", label: "Light Dashboard" },
  faq: { href: "/faq", label: "FAQ" },
  watchMe: { href: "/watch-me", label: "Watch Me" },
  goFirst: { href: "/go-first", label: "Go First" },
  beTheLight: { href: "/be-the-light", label: "Be The Light" },
} as const satisfies Record<string, NavLink>;

/* ── Primary nav with dropdown groups ───────────────────── */

export const MARKETING_NAV_ITEMS: NavItem[] = [
  {
    label: "Why 143",
    children: [
      MARKETING_LINKS.watchMe,
      MARKETING_LINKS.goFirst,
      MARKETING_LINKS.beTheLight,
      MARKETING_LINKS.howItWorks,
      MARKETING_LINKS.outcomes,
    ],
  },
  {
    label: "The Assessment",
    children: [
      MARKETING_LINKS.preview,
      MARKETING_LINKS.assessment,
      MARKETING_LINKS.sampleReport,
      MARKETING_LINKS.pricing,
    ],
  },
  {
    label: "Practice",
    children: [
      MARKETING_LINKS.challenge,
      MARKETING_LINKS.framework,
      MARKETING_LINKS.archetypes,
      MARKETING_LINKS.glossary,
    ],
  },
  MARKETING_LINKS.forTeams,
  MARKETING_LINKS.about,
];

/* ── CTA buttons ────────────────────────────────────────── */

export const MARKETING_NAV_CTAS = {
  primary: { href: "/preview", label: "Check My Stability" },
  secondary: { href: "/assessment", label: "Take the Assessment" },
} as const;

/* ── Auth toggle ────────────────────────────────────────── */

export const MARKETING_NAV_AUTH = {
  signedIn: MARKETING_LINKS.portal,
  signedOut: MARKETING_LINKS.login,
} as const;

/* ── Footer columns ─────────────────────────────────────── */

export const MARKETING_FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      MARKETING_LINKS.upgradeOs,
      MARKETING_LINKS.howItWorks,
      MARKETING_LINKS.outcomes,
      MARKETING_LINKS.sampleReport,
      MARKETING_LINKS.pricing,
    ],
  },
  {
    heading: "Practice",
    links: [
      MARKETING_LINKS.framework,
      MARKETING_LINKS.challenge,
      MARKETING_LINKS.watchMe,
      MARKETING_LINKS.goFirst,
      MARKETING_LINKS.beTheLight,
    ],
  },
  {
    heading: "Company",
    links: [
      MARKETING_LINKS.about,
      MARKETING_LINKS.forTeams,
      MARKETING_LINKS.faq,
      MARKETING_LINKS.privacy,
      MARKETING_LINKS.terms,
    ],
  },
] as const;
