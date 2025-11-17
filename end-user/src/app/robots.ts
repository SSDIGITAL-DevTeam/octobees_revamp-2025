import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

const isStaging = process.env.NEXT_PUBLIC_STAGE === "staging";

const DISALLOW_PATHS = [
  "/search",
  "/insights?*",
  "/preview",
  "/draft",
  "/admin",
  "/api/private",
];

export default function robots(): MetadataRoute.Robots {
  if (isStaging) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  const sitemapPrefix = `${SITE_URL}`;
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image/", "/.well-known/"],
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: [
      `${sitemapPrefix}/sitemap.xml`,
      `${sitemapPrefix}/sitemap-pages.xml`,
      `${sitemapPrefix}/sitemap-articles.xml`,
      `${sitemapPrefix}/sitemap-products.xml`,
      `${sitemapPrefix}/sitemap-dynamic.xml`,
    ],
  };
}
