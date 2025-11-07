// src/app/sitemap.xml/route.ts
import { fmtDate, xmlHeaders } from "@/lib/sitemap"; // kalau kamu pakai helper tadi
// kalau belum ada, nanti aku tulis versi tanpa helper juga di bawah

export const runtime = "nodejs";

export async function GET(req: Request) {
  // ambil origin dari request
  const { origin } = new URL(req.url);

  // di sini kamu tinggal daftar semua sub-sitemap yang kamu punya
  const sitemaps = [
    { loc: `${origin}/pages.xml`, lastmod: fmtDate() },
    { loc: `${origin}/plans.xml`, lastmod: fmtDate() },
    { loc: `${origin}/insights.xml`, lastmod: fmtDate() },
    { loc: `${origin}/insight/category.xml`, lastmod: fmtDate() },
  ];

  const body = sitemaps
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;

  return new Response(xml, xmlHeaders());
}
