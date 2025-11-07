// src/lib/sitemap.ts
export const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://octobees.example.com";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "https://api.octobees.example.com";

export async function safeJsonFetch<T = any>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (err) {
    console.warn("[sitemap] fetch gagal:", url, err);
    return null;
  }
}

export function fmtDate(date?: string | Date | null) {
  if (!date) return new Date().toISOString();
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
};

export function buildUrlsetXML(urls: UrlEntry[]) {
  const body = urls
    .map(
      (u) => `
  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}
    ${u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : ""}
    ${typeof u.priority === "number" ? `<priority>${u.priority}</priority>` : ""}
  </url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;
}

export function buildIndexXML(locs: Array<{ loc: string; lastmod?: string }>) {
  const body = locs
    .map(
      (s) => `
  <sitemap>
    <loc>${s.loc}</loc>
    ${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ""}
  </sitemap>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:8080"; // ganti sesuai backendmu

export function nowISO() {
  return new Date().toISOString();
}

export function wrapUrlset(urls: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function xmlHeaders() {
  return {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  };
}
