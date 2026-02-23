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
  challengeAlt: { href: "/143-challenge", label: "143 Challenge" },
  assessment: { href: "/assessment", label: "Assessment" },
  sampleReport: { href: "/sample-report", label: "Sample Report" },
  framework: { href: "/framework", label: "The Framework" },
  archetypes: { href: "/archetypes", label: "Archetypes" },
  glossary: { href: "/glossary", label: "Glossary" },
  resources: { href: "/resources", label: "Resources" },
  coaches: { href: "/coaches", label: "Coaching Program" },
  about: { href: "/about", label: "About" },
  justin: { href: "/justin", label: "Justin Ray" },
  forTeams: { href: "/corporate", label: "For Teams" },
  forOrganizations: { href: "/organizations", label: "For Organizations" },
  privacy: { href: "/privacy", label: "Privacy" },
  terms: { href: "/terms", label: "Terms" },
  login: { href: "/login", label: "Sign In" },
  portal: { href: "/portal", label: "My Portal" },
  faq: { href: "/faq", label: "FAQ" },
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

export const MARKETING_NAV_CTA: NavLink = {
  href: "/143",
  label: "Start 143 Challenge",
};

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
      MARKETING_LINKS.sampleReport,
      MARKETING_LINKS.outcomes,
      MARKETING_LINKS.pricing,
    ],
  },
  {
    heading: "Practice",
    links: [
      MARKETING_LINKS.framework,
      MARKETING_LINKS.challenge,
      MARKETING_LINKS.coaches,
      MARKETING_LINKS.resources,
      MARKETING_LINKS.glossary,
      MARKETING_LINKS.faq,
    ],
  },
  {
    heading: "Company",
    links: [
      MARKETING_LINKS.about,
      MARKETING_LINKS.justin,
      MARKETING_LINKS.forTeams,
      MARKETING_LINKS.privacy,
      MARKETING_LINKS.terms,
    ],
  },
] as const;
