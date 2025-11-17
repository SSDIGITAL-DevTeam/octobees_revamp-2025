import { Blog, BlogCategory, CategoryService } from "@/constants/payload";
import path from "node:path";
import { promises as fs } from "node:fs";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
const DEFAULT_LASTMOD = new Date().toISOString();
const MAX_URLS_PER_SITEMAP = 10_000;

export type SitemapEntry = {
  loc: string;
  lastmod?: string;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

type PaginatedResponse<T> = {
  data: T[];
  pagination?: { currentPage: number; totalPages: number };
};

const STATIC_PAGES: Array<{ path: string; file: string; priority?: number }> = [
  { path: "/", file: "src/app/page.tsx", priority: 0.9 },
  { path: "/about", file: "src/app/about/page.tsx", priority: 0.7 },
  {
    path: "/increase-my-sales",
    file: "src/app/increase-my-sales/page.tsx",
    priority: 0.8,
  },
  { path: "/contact-us", file: "src/app/contact-us/page.tsx", priority: 0.6 },
  { path: "/career", file: "src/app/career/page.tsx", priority: 0.5 },
  { path: "/affiliate", file: "src/app/affiliate/page.tsx", priority: 0.5 },
  { path: "/seminar", file: "src/app/seminar/page.tsx", priority: 0.4 },
  { path: "/thanks", file: "src/app/thanks/page.tsx", priority: 0.3 },
  { path: "/insights", file: "src/app/insights/page.tsx", priority: 0.7 },
];

const PROJECT_ROOT = path.join(process.cwd());

const toAbsoluteUrl = (slug: string) => {
  if (!slug) return SITE_URL;
  const normalized = slug.startsWith("/") ? slug : `/${slug}`;
  return `${SITE_URL}${normalized}`.replace(/(?<!:)\/{2,}/g, "/").replace("https:/", "https://");
};

const toIsoString = (value?: string | Date | null) => {
  if (!value) return DEFAULT_LASTMOD;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return DEFAULT_LASTMOD;
  return date.toISOString();
};

async function getFileTimestamp(relativePath: string) {
  try {
    const filePath = path.join(PROJECT_ROOT, relativePath);
    const stats = await fs.stat(filePath);
    return stats.mtime.toISOString();
  } catch {
    return DEFAULT_LASTMOD;
  }
}

async function fetchJson<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<T | null> {
  if (!API_URL) return null;
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  const url = `${API_URL}${endpoint}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  return (await response.json()) as T;
}

async function fetchPaginatedCollection<T>(
  endpoint: string,
  params: Record<string, string | number | boolean> = {},
) {
  const results: T[] = [];
  let nextPage = 1;
  const limit = Number(params.limit ?? 100);

  while (results.length < MAX_URLS_PER_SITEMAP) {
    const payload = await fetchJson<PaginatedResponse<T>>(endpoint, {
      ...params,
      page: nextPage,
      limit,
    });
    if (!payload) break;

    const chunk = payload.data ?? [];
    results.push(...chunk);

    const pagination = payload.pagination;
    if (!pagination || nextPage >= pagination.totalPages) {
      break;
    }

    nextPage += 1;
  }

  return results.slice(0, MAX_URLS_PER_SITEMAP);
}

export async function getStaticPageEntries(): Promise<SitemapEntry[]> {
  return Promise.all(
    STATIC_PAGES.map(async ({ path: slug, file, priority }) => ({
      loc: toAbsoluteUrl(slug),
      lastmod: await getFileTimestamp(file),
      changefreq: "monthly" as const,
      priority,
    })),
  );
}

export async function getArticleEntries(): Promise<SitemapEntry[]> {
  const blogs =
    (await fetchPaginatedCollection<Blog>("/blog", {
      status: "Published",
      orderBy: "updatedAt:desc",
      limit: 100,
    })) ?? [];

  return blogs.map((blog) => ({
    loc: toAbsoluteUrl(`/insights/${blog.slug}`),
    lastmod: toIsoString(blog.updatedAt ?? blog.createdAt),
    changefreq: "weekly",
    priority: 0.8,
  }));
}

export async function getProductEntries(): Promise<SitemapEntry[]> {
  const categories =
    (await fetchPaginatedCollection<CategoryService>("/service-category", {
      status: "Active",
      orderBy: "updatedAt:desc",
      limit: 50,
    })) ?? [];

  return categories.map((category) => ({
    loc: toAbsoluteUrl(`/plans/${category.slug}`),
    lastmod: toIsoString((category as any).updatedAt ?? (category as any).createdAt),
    changefreq: "weekly",
    priority: 0.7,
  }));
}

export async function getDynamicEntries(): Promise<SitemapEntry[]> {
  const categories =
    (await fetchPaginatedCollection<BlogCategory>("/blog-category", {
      status: true,
      orderBy: "updatedAt:desc",
      limit: 50,
    })) ?? [];

  return categories.map((category) => ({
    loc: toAbsoluteUrl(`/insights/category/${category.slug}`),
    lastmod: toIsoString(category.updatedAt ?? category.createdAt),
    changefreq: "weekly",
    priority: 0.5,
  }));
}

export function renderSitemapXml(urls: SitemapEntry[]) {
  const items = urls
    .map(
      (url) => `<url>
  <loc>${url.loc}</loc>
  ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
  ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ""}
  ${typeof url.priority === "number" ? `<priority>${url.priority.toFixed(1)}</priority>` : ""}
</url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>`;
}

export function renderSitemapIndex(
  items: Array<{ loc: string; lastmod?: string }>,
) {
  const body = items
    .map(
      (item) => `<sitemap>
  <loc>${item.loc}</loc>
  ${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}
</sitemap>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}

export const SITEMAP_ENDPOINTS = [
  "pages",
  "articles",
  "products",
  "dynamic",
] as const;

export function xmlHeaders() {
  return {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };
}

export function getChildSitemapUrl(slug: (typeof SITEMAP_ENDPOINTS)[number]) {
  return `${SITE_URL}/sitemap-${slug}.xml`;
}
