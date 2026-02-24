import type { MetadataRoute } from "next";

const BASE_URL = "https://143leadership.com";

/**
 * Dynamic sitemap for search engine crawlers.
 * Includes all public marketing and content pages.
 * Excludes: authenticated portal pages, admin, dev tools, noindexed pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const publicRoutes = [
    { path: "/upgrade-your-os", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/preview", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/upgrade", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/pricing", priority: 0.8, changeFrequency: "weekly" as const },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/framework", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/outcomes", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/143", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/143-challenge", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/justin", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/organizations", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/corporate", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/enterprise", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/coaches", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/cohorts", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/os-coaching", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/sample-report", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/faq", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/glossary", priority: 0.4, changeFrequency: "monthly" as const },
    { path: "/resources", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/watch-me", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/go-first", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/be-the-light", priority: 0.5, changeFrequency: "monthly" as const },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return publicRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
