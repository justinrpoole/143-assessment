import type { PageViewEvent } from "@/lib/analytics/taxonomy";

export type ModuleName =
  | "Justin Coach Layer"
  | "Email Gate Module"
  | "Toolkit Delivery Module"
  | "Assessment Module"
  | "Light OS Snapshot Module"
  | "Upgrade/Paywall Module"
  | "Report Artifact Module (HTML + PDF status/download)"
  | "Share Cards Module"
  | "Morning Affirmation Module"
  | "Micro Joy Generator Module"
  | "Growth Tracking Module";

export interface V1RouteSpec {
  route: string;
  heading: string;
  pageViewEvent: PageViewEvent;
  modules: ModuleName[];
  requiresFreeEmail: boolean;
}

export const V1_ROUTE_SPECS: Record<string, V1RouteSpec> = {
  "/": {
    route: "/",
    heading: "Route Shell: /",
    pageViewEvent: "page_view_root",
    modules: [],
    requiresFreeEmail: false,
  },
  "/upgrade-your-os": {
    route: "/upgrade-your-os",
    heading: "Route Shell: /upgrade-your-os",
    pageViewEvent: "page_view_upgrade_os",
    modules: ["Justin Coach Layer"],
    requiresFreeEmail: false,
  },
  "/143": {
    route: "/143",
    heading: "Route Shell: /143",
    pageViewEvent: "page_view_143",
    modules: [
      "Justin Coach Layer",
      "Email Gate Module",
      "Share Cards Module",
      "Toolkit Delivery Module",
    ],
    requiresFreeEmail: false,
  },
  "/toolkit": {
    route: "/toolkit",
    heading: "Route Shell: /toolkit",
    pageViewEvent: "page_view_toolkit",
    modules: ["Email Gate Module", "Toolkit Delivery Module"],
    requiresFreeEmail: false,
  },
  "/preview": {
    route: "/preview",
    heading: "Route Shell: /preview",
    pageViewEvent: "page_view_preview",
    modules: [
      "Assessment Module",
      "Light OS Snapshot Module",
      "Upgrade/Paywall Module",
    ],
    requiresFreeEmail: false,
  },
  "/upgrade": {
    route: "/upgrade",
    heading: "Route Shell: /upgrade",
    pageViewEvent: "page_view_upgrade",
    modules: ["Upgrade/Paywall Module"],
    requiresFreeEmail: false,
  },
  "/sample-report": {
    route: "/sample-report",
    heading: "Route Shell: /sample-report",
    pageViewEvent: "page_view_sample_report",
    modules: [
      "Report Artifact Module (HTML + PDF status/download)",
      "Share Cards Module",
    ],
    requiresFreeEmail: false,
  },
  "/micro-joy": {
    route: "/micro-joy",
    heading: "Route Shell: /micro-joy",
    pageViewEvent: "page_view_microjoy",
    modules: [
      "Email Gate Module",
      "Micro Joy Generator Module",
      "Share Cards Module",
    ],
    requiresFreeEmail: true,
  },
  "/morning": {
    route: "/morning",
    heading: "Route Shell: /morning",
    pageViewEvent: "page_view_morning",
    modules: [
      "Email Gate Module",
      "Morning Affirmation Module",
      "Share Cards Module",
    ],
    requiresFreeEmail: true,
  },
  "/os-coaching": {
    route: "/os-coaching",
    heading: "Route Shell: /os-coaching",
    pageViewEvent: "page_view_os_coaching",
    modules: ["Justin Coach Layer", "Email Gate Module"],
    requiresFreeEmail: false,
  },
  "/cohorts": {
    route: "/cohorts",
    heading: "Route Shell: /cohorts",
    pageViewEvent: "page_view_cohorts",
    modules: ["Email Gate Module"],
    requiresFreeEmail: false,
  },
  "/corporate": {
    route: "/corporate",
    heading: "Route Shell: /corporate",
    pageViewEvent: "page_view_corporate",
    modules: ["Email Gate Module"],
    requiresFreeEmail: false,
  },
  "/justin": {
    route: "/justin",
    heading: "Route Shell: /justin",
    pageViewEvent: "page_view_justin",
    modules: ["Justin Coach Layer"],
    requiresFreeEmail: false,
  },
  "/outcomes": {
    route: "/outcomes",
    heading: "Route Shell: /outcomes",
    pageViewEvent: "page_view_outcomes",
    modules: [],
    requiresFreeEmail: false,
  },
  "/faq": {
    route: "/faq",
    heading: "Route Shell: /faq",
    pageViewEvent: "page_view_faq",
    modules: [],
    requiresFreeEmail: false,
  },
  "/privacy": {
    route: "/privacy",
    heading: "Route Shell: /privacy",
    pageViewEvent: "page_view_privacy",
    modules: [],
    requiresFreeEmail: false,
  },
  "/terms": {
    route: "/terms",
    heading: "Route Shell: /terms",
    pageViewEvent: "page_view_terms",
    modules: [],
    requiresFreeEmail: false,
  },
  "/login": {
    route: "/login",
    heading: "Route Shell: /login",
    pageViewEvent: "page_view_login",
    modules: ["Email Gate Module"],
    requiresFreeEmail: false,
  },
  "/portal": {
    route: "/portal",
    heading: "Route Shell: /portal",
    pageViewEvent: "page_view_portal",
    modules: ["Justin Coach Layer"],
    requiresFreeEmail: true,
  },
  "/assessment": {
    route: "/assessment",
    heading: "Route Shell: /assessment",
    pageViewEvent: "page_view_assessment",
    modules: ["Assessment Module", "Upgrade/Paywall Module"],
    requiresFreeEmail: true,
  },
  "/results": {
    route: "/results",
    heading: "Route Shell: /results",
    pageViewEvent: "page_view_results",
    modules: [
      "Report Artifact Module (HTML + PDF status/download)",
      "Justin Coach Layer",
      "Share Cards Module",
    ],
    requiresFreeEmail: true,
  },
  "/reports": {
    route: "/reports",
    heading: "Route Shell: /reports",
    pageViewEvent: "page_view_reports",
    modules: ["Report Artifact Module (HTML + PDF status/download)"],
    requiresFreeEmail: true,
  },
  "/growth": {
    route: "/growth",
    heading: "Route Shell: /growth",
    pageViewEvent: "page_view_growth",
    modules: ["Growth Tracking Module", "Share Cards Module"],
    requiresFreeEmail: true,
  },
  "/account": {
    route: "/account",
    heading: "Route Shell: /account",
    pageViewEvent: "page_view_account",
    modules: ["Email Gate Module", "Upgrade/Paywall Module"],
    requiresFreeEmail: true,
  },
};
