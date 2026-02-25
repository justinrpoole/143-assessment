import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/spec-center",
          "/api/",
          "/dashboard/",
          "/portal/",
          "/account/",
          "/results/",
          "/assessment/",
          "/welcome",
          "/login",
        ],
      },
    ],
    sitemap: "https://143leadership.com/sitemap.xml",
  };
}
