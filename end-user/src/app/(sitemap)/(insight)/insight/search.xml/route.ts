// src/app/(sitemap)/(insight)/insight/category.xml/route.ts
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
  const categories = (await safeJsonFetch(`${API_URL}/insights/categories`)) as
    | Array<{ id: string | number; slug?: string; updated_at?: string }>
    | null;

  const list = Array.isArray(categories) ? categories : [];

  const urls = list.map((cat) => {
    const seg = cat.slug ?? cat.id;
    return {
      loc: `${origin}/insights/category/${seg}`,
      lastmod: fmtDate(cat.updated_at),
      changefreq: "weekly" as const,
      priority: 0.5,
    };
  });

  return new Response(buildUrlsetXML(urls), xmlHeaders());
}
