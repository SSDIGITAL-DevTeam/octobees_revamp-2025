import {
  getProductEntries,
  renderSitemapXml,
  xmlHeaders,
} from "@/lib/seo/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const xml = renderSitemapXml(await getProductEntries());
  return new Response(xml, { headers: xmlHeaders() });
}
