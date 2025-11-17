import Link from "next/link";
import { getAllInsights } from "@/services/insight.service";

export default async function RelatedInsightsRail({
  searchTerm,
}: {
  searchTerm: string;
}) {
  const { data } = await getAllInsights({ search: searchTerm, page: 1 });
  const articles = data.slice(0, 3);

  if (!articles.length) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-semibold text-primary">
        Related articles & resources
      </h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-xs uppercase text-gray-500">
              {article.category?.name}
            </p>
            <Link
              href={`/insights/${article.slug}`}
              className="mt-2 block text-base font-semibold hover:underline"
            >
              {article.title}
            </Link>
            <p className="mt-1 text-sm text-gray-600 line-clamp-3">
              {article.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
