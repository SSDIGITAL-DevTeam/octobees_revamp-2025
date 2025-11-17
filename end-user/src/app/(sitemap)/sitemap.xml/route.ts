import {
  getChildSitemapUrl,
  renderSitemapIndex,
  SITEMAP_ENDPOINTS,
  xmlHeaders,
} from "@/lib/seo/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const xml = renderSitemapIndex(
    SITEMAP_ENDPOINTS.map((slug) => ({
      loc: getChildSitemapUrl(slug),
      lastmod: now,
    })),
  );

  return new Response(xml, { headers: xmlHeaders() });
}
