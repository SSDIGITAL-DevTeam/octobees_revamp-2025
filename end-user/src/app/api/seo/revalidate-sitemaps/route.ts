import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const TOKEN = process.env.SEO_REFRESH_TOKEN;
const SITEMAPS = [
  "/sitemap.xml",
  "/sitemap-pages.xml",
  "/sitemap-articles.xml",
  "/sitemap-products.xml",
  "/sitemap-dynamic.xml",
];

export async function POST(request: Request) {
  if (TOKEN) {
    const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
    if (headerToken !== TOKEN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  await Promise.all(SITEMAPS.map((path) => revalidatePath(path)));
  return NextResponse.json({ ok: true, revalidated: SITEMAPS });
}
