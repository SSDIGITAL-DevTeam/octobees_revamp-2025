const endpoint =
  process.env.SEO_REFRESH_ENDPOINT ||
  "/api/seo/revalidate-sitemaps";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

async function refresh() {
  const target = endpoint.startsWith("http")
    ? endpoint
    : `${siteUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(target, {
    method: "POST",
    headers: {
      Authorization: process.env.SEO_REFRESH_TOKEN
        ? `Bearer ${process.env.SEO_REFRESH_TOKEN}`
        : "",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh sitemaps: ${response.status}`);
  }

  const payload = await response.json();
  console.log("Revalidated:", payload.revalidated);
}

refresh().catch((error) => {
  console.error(error);
  process.exit(1);
});

export {};
