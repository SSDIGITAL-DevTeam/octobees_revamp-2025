// src/app/insight/category.xml/route.ts
import { API_BASE, wrapUrlset, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { origin } = new URL(req.url);

  const url = new URL(`${API_BASE}/blog-category`);
  url.searchParams.set("status", "true");

  const res = await fetch(url, { cache: "no-store" });

  let categories: any[] = [];
  if (res.ok) {
    const json = await res.json();
    categories = Array.isArray(json?.data) ? json.data : [];
  }

  const urls = categories
    .map((c: any) => {
      const lastmod =
        c.updatedAt || c.updated_at || c.createdAt || c.created_at;
      // di service-mu kategori diakses pakai id, jadi kita pakai id
      return `
  <url>
    <loc>${origin}/insights/category/${c.slug}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
    })
    .join("");

  const xml = wrapUrlset(urls);
  return new Response(xml, xmlHeaders());
}
