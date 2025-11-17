import { load } from "cheerio";
import fs from "node:fs";
import path from "node:path";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://www.octobees.com";

async function fetchSitemapUrls(indexUrl: string): Promise<string[]> {
  try {
    const response = await fetch(indexUrl);
    if (!response.ok) {
      console.warn(`[seo-link-graph] Skip sitemap ${indexUrl} -> ${response.status}`);
      return [];
    }
    const text = await response.text();
    return Array.from(text.matchAll(/<loc>(.*?)<\/loc>/g)).map(
      ([, loc]) => loc,
    );
  } catch (error) {
    console.warn(`[seo-link-graph] Failed to fetch ${indexUrl}`, error);
    return [];
  }
}

async function crawl(url: string): Promise<string[]> {
  const response = await fetch(url);
  if (!response.ok) return [];
  const html = await response.text();
  const $ = load(html);
  const anchors = $("a[href]")
    .map((_, element) => $(element).attr("href"))
    .get()
    .filter(Boolean)
    .map((href) =>
      href!.startsWith("http") ? href! : `${siteUrl}${href!.startsWith("/") ? href : `/${href}`}`,
    )
    .filter((href) => href.startsWith(siteUrl));
  return anchors;
}

async function buildGraph() {
  const sitemapUrls = await fetchSitemapUrls(`${siteUrl}/sitemap.xml`);
  const graph = new Map<string, Set<string>>();

  for (const sitemapUrl of sitemapUrls) {
    const urls = await fetchSitemapUrls(sitemapUrl);
    for (const url of urls) {
      graph.set(url, new Set());
    }
  }

  for (const url of Array.from(graph.keys())) {
    const outgoing = await crawl(url);
    graph.set(url, new Set(outgoing));
  }

  const inbound = new Map<string, number>();
  graph.forEach((edges) => {
    edges.forEach((target) =>
      inbound.set(target, (inbound.get(target) ?? 0) + 1),
    );
  });

  const orphaned = Array.from(graph.keys()).filter(
    (url) => !inbound.has(url) || inbound.get(url) === 0,
  );

  const output = {
    generatedAt: new Date().toISOString(),
    nodes: Array.from(graph.entries()).map(([url, edges]) => ({
      url,
      outgoing: Array.from(edges),
      inbound: inbound.get(url) ?? 0,
    })),
    orphaned,
  };

  const outPath = path.join(process.cwd(), "seo-link-graph.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
  console.log(`Link graph saved to ${outPath}`);
  if (orphaned.length) {
    console.warn(`Found ${orphaned.length} orphaned URLs`);
  }
}

buildGraph().catch((error) => {
  console.error(error);
  process.exit(1);
});
