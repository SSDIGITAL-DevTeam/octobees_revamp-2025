import { xmlHeaders } from "@/lib/sitemap";

// kalau di lib/sitemap kamu belum ada, bikin aja konstanta ini di sini:
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { origin } = new URL(req.url);

  // kita coba ambil list category service yang Active
  // asumsi endpoint: GET /service-category?status=Active&limit=100
  const url = new URL(`${API_BASE}/service-category`);
  url.searchParams.set("status", "Active");
  url.searchParams.set("limit", "200"); // biar banyak langsung

  const res = await fetch(url, { cache: "no-store" });

  let items: any[] = [];
  if (res.ok) {
    const json = await res.json();
    // banyak API-mu bentuknya { data: [...], pagination: {...} }
    if (Array.isArray(json?.data)) {
      items = json.data;
    } else if (Array.isArray(json)) {
      items = json;
    }
  }

  const urls = items
    .map((item) => {
      // di service-mu getCategoryBySlug pakai /service-category/{slug}
      // jadi di FE kita tampilkan sebagai /plans/{slug}
      const slug = item.slug ?? item.id;
      const lastmod =
        item.updatedAt || item.updated_at || item.createdAt || item.created_at;

      return `
  <url>
    <loc>${origin}/plans/${slug}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, xmlHeaders?.() ?? {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
