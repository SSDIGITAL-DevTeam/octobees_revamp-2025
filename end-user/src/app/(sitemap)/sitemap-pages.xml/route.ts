import {
  getStaticPageEntries,
  renderSitemapXml,
  xmlHeaders,
} from "@/lib/seo/sitemap";

export const runtime = "nodejs";
export const revalidate = 3600;

export async function GET() {
  const xml = renderSitemapXml(await getStaticPageEntries());
  return new Response(xml, { headers: xmlHeaders() });
}
