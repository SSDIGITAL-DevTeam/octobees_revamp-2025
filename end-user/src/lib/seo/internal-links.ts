import { load } from "cheerio";

export type InternalLinkEntry = {
  keyword: string;
  href: string;
  limit?: number;
};

export const INTERNAL_LINK_MAP: InternalLinkEntry[] = [
  { keyword: "marketing automation", href: "/increase-my-sales" },
  { keyword: "digital marketing agency", href: "/increase-my-sales" },
  { keyword: "seo services", href: "/plans/website" },
  { keyword: "social media strategy", href: "/plans/social-media-management" },
  { keyword: "martech", href: "/plans/digital-squad-as-a-service-new" },
  { keyword: "branding", href: "/about" },
  { keyword: "lead generation", href: "/contact-us" },
];

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function injectInternalLinks(
  html: string,
  map: InternalLinkEntry[] = INTERNAL_LINK_MAP,
) {
  if (!html) return html;
  const $ = load(`<div id="__internal-link-root">${html}</div>`);
  const root = $("#__internal-link-root");

  map.forEach(({ keyword, href, limit = 1 }) => {
    let inserted = 0;
    const regex = new RegExp(`\\b(${escapeRegExp(keyword)})\\b`, "i");
    const textNodes = root
      .find("*")
      .contents()
      .filter((_, node) => {
        const parentTag =
          (((node.parent as unknown as { tagName?: string })?.tagName ||
            "") as string).toLowerCase();
        return (
          node.type === "text" &&
          parentTag !== "a" &&
          regex.test(node.data ?? "")
        );
      });

    textNodes.each((_, node) => {
      if (inserted >= limit) return;
      const textNode = node as unknown as { data?: string };
      const textValue = textNode.data ?? "";
      if (!textValue) return;
      const match = textValue.match(regex);
      if (!match) return;
      const before = textValue.slice(0, match.index);
      const after = textValue.slice((match.index ?? 0) + match[0].length);
      const anchor = `<a data-internal-link="true" href="${href}" class="text-primary hover:underline">${match[0]}</a>`;
      const replacement = `${before}${anchor}${after}`;
      $(node).replaceWith(replacement);
      inserted += 1;
    });
  });

  return root.html() ?? html;
}
