const DEFAULT_SITEMAPS = [
  "/sitemap.xml",
  "/sitemap-pages.xml",
  "/sitemap-articles.xml",
  "/sitemap-products.xml",
  "/sitemap-dynamic.xml",
];

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

const targets = process.argv.slice(2);
const sitemapTargets =
  targets.length > 0
    ? targets
    : DEFAULT_SITEMAPS.map((slug) => `${siteUrl}${slug}`);

async function ping(url: string) {
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(
    url,
  )}`;
  const response = await fetch(pingUrl);
  if (!response.ok) {
    throw new Error(`Failed to ping ${url}: ${response.status}`);
  }
  console.log(`Pinged ${url}`);
}

Promise.all(sitemapTargets.map((url) => ping(url)))
  .then(() => {
    console.log("All sitemaps pinged successfully");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

export {};
