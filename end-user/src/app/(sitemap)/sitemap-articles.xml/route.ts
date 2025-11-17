import {
  getArticleEntries,
  renderSitemapXml,
  xmlHeaders,
} from "@/lib/seo/sitemap";

export const runtime = "nodejs";
export const revalidate = 1800;

export async function GET() {
  const xml = renderSitemapXml(await getArticleEntries());
  return new Response(xml, { headers: xmlHeaders() });
}
