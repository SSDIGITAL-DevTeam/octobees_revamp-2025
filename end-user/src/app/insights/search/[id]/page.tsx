import { notFound } from "next/navigation";
import BackArticleButton from "@/components/partials/Button/ButtonBackArticle";
import { InsightArticle, InsightCategory, InsightNotFound, InsightPagination, InsightSearch } from "@/app/insights/_components";
import { Blog, BlogCategory, Pagination } from "@/constants/payload";
import { getAllCategories, getInsightBySearch } from "@/services/insight.service";

type Props = {
  params: { id: string };
  searchParams: { page?: string };
};

export default async function SearchPage({ params, searchParams }: Props) {
  const blogSearch = decodeURIComponent(params.id);
  const page = Number(searchParams.page) || 1;

  let blogs: Blog[] = [];
  let categories: BlogCategory[] = [];
  let pagination: Pagination = { totalPages: 1, total: 0, currentPage: 0, perPage: 0 };

  try {
    const blog_response = await getInsightBySearch(blogSearch, 10, page);
    const blog_category_response = await getAllCategories();
    blogs = blog_response.data
    pagination = blog_response.pagination;
    categories = blog_category_response.data
  } catch (error) {
    return notFound();
  }

    return (
        <main className="w-full py-24 pt-28 md:pt-44 lg:px-10 px-8 lg:max-w-7xl mx-auto relative">
            <BackArticleButton />
            <header className="flex flex-col justify-normal items-start overflow-x-hidden gap-3 lg:gap-4 py-8">
                <h1 className="font-bold text-2xl lg:text-4xl !leading-[130%]">
                    <span className="text-gray-400">Result For</span> {blogSearch}
                </h1>
                <p className="text-base text-primary lg:text-lg !leading-[150%] w-[80%] lg:w-full ">
                    {pagination?.total} articles found
                </p>
            </header>
            <div className="w-full border-b-[1.2px] border-gray-300" />
            <section className="flex flex-col overflow-x-auto lg:max-w-7xl mx-auto py-8">
                <div className="flex flex-col lg:flex-row gap-x-16 gap-y-10">
                    <section className="w-full lg:w-2/3">
                        {
                            (blogs.length > 0) ? (
                                <InsightArticle blogs={blogs} />
                            ) : (
                                <InsightNotFound/>
                            )
                        }
                    </section>

                    <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-10">
                        <InsightSearch />
                        <InsightCategory categories={categories} />
                    </aside>
                </div>
                <InsightPagination
                    page={page}
                    totalPage={pagination.totalPages}
                />
            </section>
        </main>
    );
}