'use client';

import React, { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import PaginationComponents from '../../../components/partials/Pagination/Pagination';
import { axiosInstance } from '@/lib/axios';
import BlogNotFound from '@/assets/homepage/svg/asset-blog-notfound.svg'
import { Button } from '@/components/ui/button';
import { InsightCategory, InsightCard, InsightArticle, InsightSearch, InsightNotFound } from "@/app/insights/_components"
import { Blog, Pagination } from '@/constants/payload';
import { toast } from '@/hooks/use-toast';

export default function InsightLayout(): JSX.Element {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ totalPages: 0 } as Pagination)
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const [blogs] = await Promise.all([
          axiosInstance.get("/blog", {
            params: {
              search: search,
              status: "Published",
              limit: 10,
              orderBy: "createdAt:desc",
              page
            }
          }),
        ]);
        setBlogs(blogs.data.data);
        setPagination(blogs.data.pagination)
      } catch (error: any) {
        toast({
          title: "Error fetching blog posts",
          description: error?.response?.data.error || error?.message || "An error occurred while fetching blog posts.",
          variant: "destructive"
        })
      }
    }
    fetchBlogPosts();
  }, [page])


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

  const slicedBlogs = blogs.slice(2)

  return (
    <section className="md:max-w-7xl md:mx-auto flex flex-col gap-6 lg:gap-20 md:py-5">
      {
        blogs.length == 1 ? (
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
          {
            blogs.length === 0 
            ? <InsightNotFound />
            :<InsightArticle blogs={slicedBlogs} />
          }
        </div>

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
  );
}