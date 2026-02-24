export type NavLink = {
  href: string;
  label: string;
};

export const MARKETING_LINKS = {
  upgradeOs: { href: "/upgrade-your-os", label: "Upgrade Your OS" },
  howItWorks: { href: "/how-it-works", label: "How It Works" },
  outcomes: { href: "/outcomes", label: "Outcomes" },
  pricing: { href: "/pricing", label: "Pricing" },
  challenge: { href: "/143", label: "143 Challenge" },
  assessment: { href: "/assessment", label: "Assessment" },
  sampleReport: { href: "/sample-report", label: "Sample Report" },
  framework: { href: "/framework", label: "The Framework" },
  archetypes: { href: "/archetypes", label: "Archetypes" },
  glossary: { href: "/glossary", label: "Glossary" },
  resources: { href: "/resources", label: "Resources" },
  coaches: { href: "/coaches", label: "Coaching Program" },
  about: { href: "/about", label: "About" },
  forTeams: { href: "/corporate", label: "For Teams" },
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

export const MARKETING_NAV_LINKS: NavLink[] = [
  MARKETING_LINKS.upgradeOs,
  MARKETING_LINKS.howItWorks,
  MARKETING_LINKS.outcomes,
  MARKETING_LINKS.pricing,
  MARKETING_LINKS.challenge,
  MARKETING_LINKS.forTeams,
  MARKETING_LINKS.about,
];

export const MARKETING_NAV_CTAS = {
  primary: { href: "/143", label: "Start 143" },
  secondary: { href: "/assessment", label: "Take the Assessment" },
} as const;

export const MARKETING_NAV_AUTH = {
  signedIn: MARKETING_LINKS.portal,
  signedOut: MARKETING_LINKS.login,
} as const;

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
