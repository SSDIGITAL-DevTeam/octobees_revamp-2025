// src/app/insights.xml/route.ts
import { API_BASE, wrapUrlset, xmlHeaders } from "@/lib/sitemap";

export const runtime = "nodejs";

// helper untuk ambil semua halaman /blog
async function fetchAllBlogs(origin: string) {
  const perPage = 50; // lebih besar dari 10 biar cepat
  let page = 1;
  let done = false;
  const all: any[] = [];

  while (!done) {
    const url = new URL(`${API_BASE}/blog`);
    url.searchParams.set("status", "Published");
    url.searchParams.set("limit", String(perPage));
    url.searchParams.set("orderBy", "createdAt:desc");
    url.searchParams.set("page", String(page));

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) break;

    const json = await res.json();

    // bentuknya sesuai service-mu: { data: Blog[], pagination: {...} }
    const data = Array.isArray(json?.data) ? json.data : [];
    const pagination = json?.pagination;

    all.push(...data);

    // cek apakah masih ada halaman berikutnya
    if (
      !pagination ||
      !pagination.totalPages ||
      page >= pagination.totalPages
    ) {
      done = true;
    } else {
      page += 1;
    }
  }

  return all;
}

export async function GET(req: Request) {
  const { origin } = new URL(req.url); // biar otomatis local/deploy

  const blogs = await fetchAllBlogs(origin);

  const urls = blogs
    .map((b: any) => {
      const lastmod = b.updatedAt || b.updated_at || b.createdAt || b.created_at;
      return `
  <url>
    <loc>${origin}/insights/${b.slug}</loc>
    ${lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  const xml = wrapUrlset(urls);
  return new Response(xml, xmlHeaders());
}
