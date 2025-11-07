// src/app/(sitemap)/plans.xml/route.ts
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
  // sesuaikan endpoint ini dengan backend kamu
  const plans = (await safeJsonFetch(`${API_URL}/service-category`)) as
    | Array<{ slug: string; updated_at?: string }>
    | null;

  const list = Array.isArray(plans) ? plans : [];

  const urls = list.map((plan) => ({
    loc: `${origin}/plans/${plan.slug}`,
    lastmod: fmtDate(plan.updated_at),
    changefreq: "weekly" as const,
    priority: 0.7,
  }));

  return new Response(buildUrlsetXML(urls), xmlHeaders());
}
