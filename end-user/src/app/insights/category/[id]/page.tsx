"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import BackArticleButton from "@/components/partials/Button/ButtonBackArticle";
import PaginationComponents from "@/components/partials/Pagination/Pagination";
import { InsightArticle, InsightCategory, InsightNotFound, InsightSearch } from "@/app/insights/_components";
import { axiosInstance } from "@/lib/axios";
import { Blog, Pagination } from "@/constants/payload";

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1 } as Pagination);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const searchParams = useSearchParams()
  const router = useRouter()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const categoryResponse = await axiosInstance.get(`/blog-category/${id}`)
      const blogResponse = await axiosInstance.get(`/blog`, {
        params: {
          categoryId: categoryResponse.data.id,
          limit: 5,
          page,
          orderBy: "createdAt:desc",
          status: "Published"
        }
      })
      setBlogs(blogResponse.data.data);
      setPagination(blogResponse.data.pagination);
      setTitle(categoryResponse.data.name)
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
    if (blogs && page < pagination.totalPages) {
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

  return (
    <main className="w-full py-24 pt-28 md:pt-44 lg:px-10 px-8 lg:max-w-7xl mx-auto relative">
      <BackArticleButton />
      <header className="flex flex-col justify-normal items-start overflow-x-hidden gap-3 lg:gap-4 py-8">
        <h1 className="font-bold text-primary text-2xl md:text-4xl !leading-[130%]">
          <span className="text-gray-400">Blog About</span>{" "}{title}
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
            <InsightSearch handleSearch={handleSearch} setSearch={setSearch} />
            <InsightCategory />
          </aside>
        </div>
          <PaginationComponents
            handleNext={handleNext}
            handlePrev={handlePrevious}
            page={page}
            setPage={handleChangePage}
            totalPage={pagination.totalPages || 1}
          />
      </section>
    </main>
  );
}