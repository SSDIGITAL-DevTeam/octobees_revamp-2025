'use client';

import React, { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import PaginationComponents from '../../../components/partials/Pagination/Pagination';
import { axiosInstance } from '@/lib/axios';
import BlogNotFound from '@/assets/homepage/svg/asset-blog-notfound.svg'
import { Button } from '@/components/ui/button';
import {InsightCategory, InsightCard, InsightContent} from "@/app/insights/_components"
export default function InsightLayout(): JSX.Element {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [defPage, setDefPage] = useState({ totalPages: 1 })
  const [blog, setBlog] = useState<any>([]);
  const [favBlog, setFavBlog] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const [favoriteBlogs, blogs, categories] = await Promise.all([
          axiosInstance.get("/blog", {
            params: {
              status: "Published",
              favorite: true,
            }
          }),
          axiosInstance.get("/blog", {
            params: {
              search: search,
              status: "Published",
              favorite: false,
              limit: 4,
              page
            }
          }),
          axiosInstance.get("/blog-category",{
            params: {
              status: true
            }
          })
        ]);
        setFavBlog(favoriteBlogs.data.data);
        setBlog(blogs.data.data);
        setDefPage(blogs.data.pagination)
        setCategory(categories.data.data);

      } catch (error: any) {
        console.error(error?.response?.data.error || error?.message || "Error fetching blog posts");
      }
    }
    fetchBlogPosts();
  }, [page])

  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync page dari URL params saat pertama render
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
    if (blog && page < defPage.totalPages) {
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

  // console.log(favBlog)

  return (
    <div className="lg:container lg:mx-auto flex flex-col gap-8 md:gap-16">
      {/* Hero */}
      {
        favBlog.length > 2 ? (
          <section className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 grid-rows-3 gap-6 lg:gap-4 lg:h-[60vh]">
            <InsightCard data={favBlog[0]} large={true} length={3} />
            <InsightCard data={favBlog[1]} length={3} />
            <InsightCard data={favBlog[2]} length={3} />
          </section>
        ) :
          favBlog.length > 1 ? (
            <section className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 lg:gap-4 lg:h-[60vh]">
              <InsightCard data={favBlog[0]} large={true} length={2} />
              <InsightCard data={favBlog[1]} large={true} length={2} />
            </section>
          ) :
            favBlog.length > 0 ? (
              <section className="grid grid-cols-1 lg:h-[60vh]">
                <InsightCard data={favBlog[0]} large={true} length={1} />
              </section>
            ) : null
      }

      {/* Main Content and Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Main Content */}
        <section className="w-full lg:w-2/3">
          {
            (blog.length > 0 || favBlog.length > 0) ? (
              <div className="grid grid-cols-1 gap-y-5 gap-x-4 lg:gap-x-2">
                {blog.map((article: any) => (
                  <>
                    <article key={article.id} className="py-3 lg:py-2">
                      <Link href={`/insights/${article.blog.slug}`} className="flex flex-col md:flex-row gap-4 lg:gap-6">
                        <div className="w-full md:w-1/3">
                          <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${article.blog.image}`} alt={article.blog.title} className="w-full h-52 object-cover rounded-lg border-[1px] border-gray-300 shadow-sm" width={1920} height={1080} quality={100} />
                        </div>
                        <div className="md:w-2/3 flex flex-col gap-3 lg:justify-center">
                          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-primary font-heading !leading-[130%]">{article.blog.title}</h2>
                          <h3 className="order-2 md:order-1 flex lg:items-center gap-1 md:gap-2 justify-start text-xs lg:text-base text-gray-500">
                            <span>{article.user ? article.user.name : "Anonymous"}</span>
                            <span>•  {dayjs(article.blog.createdAt).format("MMMM D, YYYY")}</span>
                          </h3>
                          <div className='order-1 md:order-2'>
                            <InsightContent content={article.blog.content} className='text-sm lg:text-base text-gray-600 line-clamp-3' />
                          </div>
                        </div>
                      </Link>
                    </article>
                  </>
                ))}
              </div>
            ) : (
              <section className='w-full flex flex-col gap-4 justify-center items-center text-gray-400 py-10'>
                <Image src={BlogNotFound} alt='Blog Not Found' className=' object-contain w-[60%] md:w-[30%]' />
                <h2 className='text-center text-2xl font-bold w-full md:w-[40%]'>Our Blog is Coming Soon</h2>
                <p className='text-center w-full sm:w-[40%] text-sm  md:text-lg'>We’re excited to start sharing insights, stories, and updates with you! Right now, this space is still empty</p>
                <Button onClick={() => router.push("/")} className='w-full md:w-[40%] rounded-3xl py-3 mt-3 font-semibold'>Back to Home Page</Button>
              </section>
            )
          }
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-10">
          {/* Search bar */}
          <div className="mb-6 lg:mb-0 lg:p-6 bg-gray-50 border-gray-200 border-[1px] shadow-sm p-4 rounded-md">
            <p className="text-sm lg:text-lg font-bold mb-4">Search</p>
            <div className='relative flex flex-col'>
              <form onSubmit={(e) => handleSearch(e)}>
                <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search blog posts" className="w-full border text-sm lg:text-base border-gray-200 rounded-lg px-4 py-2 ps-9" />
                <Search className='top-2 left-2 absolute text-gray-600 h-5 lg:h-6' />
              </form>
            </div>
          </div>
          {/* Category */}
          <InsightCategory data={category} />
        </aside>
      </div>
      {
        blog.length > 0 ? <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          className='mt-10'
          setPage={handleChangePage}
          totalPage={defPage.totalPages || 1}
        /> : null
      }
    </div>
  );
}