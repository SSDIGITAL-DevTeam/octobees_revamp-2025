// src/app/(sitemap)/pages.xml/route.ts
import { buildUrlsetXML, fmtDate, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // ambil origin dari request
  const { origin } = new URL(req.url);
  const pages = [
    "/about",
    "/career",
    "/contact-us",
    "/insights",
    "/increase-my-sales",
    "/seminar",
    "/affiliate"
  ].map((p) => ({
    loc: `${origin}${p}`,
    lastmod: fmtDate(),
    changefreq: "monthly" as const,
    priority: 0.6,
  }));

  return new Response(buildUrlsetXML(pages), xmlHeaders());
}
