"use client";

import React, { JSX, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackArticleButton from "@/components/partials/Button/BackArticleButton";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BlogContent from "@/components/partials/BlogLayout/BlogContent";
import dayjs from "dayjs";
import PaginationComponents from "@/components/partials/Pagination/Pagination";
import BlogCategory from "@/components/partials/BlogLayout/BlogCategory";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
  const [blog, setBlog] = useState([{ name: "" }]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [allCat, setAllCat] = useState([{name:""}]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams()
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const [response, allCat] = await Promise.all([
          axiosInstance.get(`/blog`,{
            params: {
              categoryId: id,
            }
          }),
          axiosInstance.get(`/blog-category`)
        ]);
      setBlog(response.data.data)
      setAllCat(allCat.data)
      setPagination(response.data.pagination);
    }
    fetchData();
  }, [])

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    setPage(urlPage);
  }, [searchParams]);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    setPage(newPage);
  };

  const handleNext = () => {
    if (blog && page < pagination.totalPages) {
      handleChangePage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      handleChangePage(page - 1);
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/insights/search/${search}`);
  }

const title = allCat?.find((item: any) => item.id === id)?.name

  return (
    <main className="w-full py-24 pt-44 lg:px-10 px-8 lg:max-w-7xl mx-auto relative">
      <BackArticleButton />
      <header className="flex flex-col justify-normal items-start overflow-x-hidden gap-2 lg:gap-4 xl:py-12 py-8 max-w-7xl mx-auto">
        <h1 className=" font-bold text-2xl lg:text-4xl font-heading !leading-[120%]">
          <span className="text-gray-400">Result For</span> {title}
        </h1>
        <p className="text-sm md:text-base text-gray-600 lg:text-xl !leading-[150%] w-[70%] lg:w-full ">
          {pagination?.total} articles found
        </p>
      </header>
      <div className="w-full border-b-[1.2px] border-gray-300" />
      <section className="flex flex-col overflow-x-auto lg:max-w-7xl mx-auto py-8">
        {/* component main */}
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Main Content */}
          <section className="w-full lg:w-2/3">
            {/* Articles List */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-2">
              {blog.map((article: any, i:number) => (
                <article key={`article-${article.id}`} className="py-3 lg:pb-8 lg:pt-4">
                  <Link href={`/insights/${article.id}`} className="flex flex-col md:flex-row gap-3 lg:gap-6">
                    <div className="md:w-1/3">
                      <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${article.image}`} alt={`article-${i+1}`} className="w-full h-36 object-contain rounded-lg border-[1px] border-gray-300 shadow-sm" width={1920} height={1080} quality={100} />
                    </div>
                    <div className="md:w-2/3 flex flex-col gap-2 justify-center">
                      <h2 className="text-sm md:text-xl lg:text-2xl font-bold text-primary font-heading !leading-[120%]">{article.title}</h2>
                      <h3 className="flex items-center gap-2 justify-start text-xs lg:text-base text-gray-500">
                        <span>{article.role ? article.role.name : article.name}</span>
                        <span>•  {dayjs(article.createdAt).format("MMMM D, YYYY")}</span>
                      </h3>
                      <BlogContent content={article.content} className='text-sm lg:text-base text-gray-600 line-clamp-2' />
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-10">
            {/* Search bar */}
            <div className="mb-6 lg:mb-0 lg:p-6 bg-gray-50 border-gray-200 border-[1px] shadow-sm p-4 rounded-md">
              <p className="text-sm lg:text-lg font-bold mb-4">Search</p>
              <div className='relative flex flex-col'>
                <form onSubmit={(e) => handleSearch(e)}>
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text" placeholder="Search blog posts" className="w-full border text-sm lg:text-base border-gray-200 rounded-lg px-4 py-2 ps-9" />
                  <Search className='top-2 left-2 absolute text-gray-600 h-5 lg:h-6' />
                </form>
              </div>
            </div>
            {/* Category */}
            <BlogCategory data={allCat} />
          </aside>
        </div>
        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          className='mt-10'
          setPage={handleChangePage}
          totalPage={pagination.totalPages || 1}
        />
      </section>
    </main>
  );
}