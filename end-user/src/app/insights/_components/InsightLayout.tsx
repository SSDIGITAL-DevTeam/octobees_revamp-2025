import { InsightCard, InsightArticle, InsightCategory, InsightNotFound, InsightSearch, InsightPagination } from "@/app/insights/_components";
import { Blog, BlogCategory, Pagination } from '@/constants/payload';
import { notFound } from 'next/navigation';
import { getAllCategories, getAllInsights } from '@/services/insight.service';

type Props = {
  searchParams: {
    page?: string;
    search?: string;
  };
};

export default async function InsightLayout({ searchParams }: Props) : Promise<JSX.Element> {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  let blogs: Blog[] = []
  let pagination: Pagination = { totalPages: 0, total: 0, currentPage: 0, perPage: 0 };
  let categories: BlogCategory[] = []

  try {
    const blog_response = await getAllInsights({ search, page });
    const cat_response = await getAllCategories();
    categories = cat_response.data;
    blogs = blog_response.data;
    pagination = blog_response.pagination;
  } catch (error) {
    return notFound();
  }

  const slicedBlogs = blogs.slice(2);

  return (
    <section className="md:max-w-7xl md:mx-auto flex flex-col gap-6 lg:gap-20 md:py-5">
      {
        blogs.length === 1 ? (
          <div className="grid grid-cols-1">
            <InsightCard data={blogs[0]} />
          </div>
        ) : blogs.length > 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <InsightCard data={blogs[0]} />
            <InsightCard data={blogs[1]} />
          </div>
        ) : null
      }

      <div className="flex flex-col lg:flex-row gap-x-16 gap-y-10">
        <div className="w-full lg:w-2/3">
          {blogs.length === 0 ? <InsightNotFound /> : <InsightArticle blogs={slicedBlogs} />}
        </div>
        <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-10">
          <InsightSearch />
          <InsightCategory categories={categories} />
        </aside>
      </div>

      <InsightPagination
        page={page}
        totalPage={pagination.totalPages || 1}
      />
    </section>
  );
}
