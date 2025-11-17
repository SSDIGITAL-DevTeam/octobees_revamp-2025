import type { Blog } from "@/constants/payload";

export default function ArticleSchema({ article }: { article: Blog }) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.octobees.com";

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.content.replace(/<[^>]+>/g, "").slice(0, 320),
    image: [
      article.image?.startsWith("http")
        ? article.image
        : `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${article.image}`,
    ],
    author: {
      "@type": "Person",
      name: article.user?.name || "Octobees",
    },
    publisher: {
      "@type": "Organization",
      name: "Octobees",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/assets/png/asset-logo-opengraph-octobees.png`,
      },
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt ?? article.createdAt,
    mainEntityOfPage: `${siteUrl}/insights/${article.slug}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
