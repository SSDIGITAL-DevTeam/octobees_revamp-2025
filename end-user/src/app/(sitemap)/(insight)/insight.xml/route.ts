// src/app/(sitemap)/(insight)/insight.xml/route.ts
import {
  API_URL,
  safeJsonFetch,
  fmtDate,
  buildUrlsetXML,
  xmlHeaders,
} from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // ambil origin dari request
  const { origin } = new URL(req.url);
  const insights = (await safeJsonFetch(`${API_URL}/insights`)) as
    | Array<{ slug: string; updated_at?: string }>
    | null;

  const list = Array.isArray(insights) ? insights : [];

  const urls = list.map((item) => ({
    loc: `${origin}/insights/${item.slug}`,
    lastmod: fmtDate(item.updated_at),
    changefreq: "weekly" as const,
    priority: 0.8,
  }));

  return new Response(buildUrlsetXML(urls), xmlHeaders());
}
