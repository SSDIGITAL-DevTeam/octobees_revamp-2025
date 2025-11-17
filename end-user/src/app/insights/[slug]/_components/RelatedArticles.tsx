import { Blog } from "@/constants/payload";
import Link from "next/link";

export default function RelatedArticles({
  articles,
  currentSlug,
}: {
  articles: Blog[];
  currentSlug: string;
}) {
  const related = articles.filter((article) => article.slug !== currentSlug);
  if (!related.length) return null;

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="mt-12 border-t border-gray-200 pt-8"
    >
      <h2
        id="related-articles-heading"
        className="text-xl font-semibold text-primary"
      >
        Related insights
      </h2>
      <ul className="mt-4 space-y-4">
        {related.map((article) => (
          <li key={article.id} className="flex flex-col gap-1">
            <Link
              href={`/insights/${article.slug}`}
              className="text-lg font-semibold hover:underline"
            >
              {article.title}
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">
              {article.content.replace(/<[^>]+>/g, "").slice(0, 160)}...
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
