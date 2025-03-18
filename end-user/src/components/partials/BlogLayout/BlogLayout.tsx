'use client';

import React, { JSX, useEffect, useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import BlogCard from './HeaderGrid';
import BlogContent from './BlogContent';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import PaginationComponents from '../Pagination/Pagination';
import BlogCategory from './BlogCategory';
import { axiosInstance } from '@/lib/axios';

export default function BlogLayout(): JSX.Element {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [defPage, setDefPage] = useState({totalPages: 1})
  const [blog, setBlog]= useState<any>([]);
  const [favBlog, setFavBlog]= useState<any>([]);
  const [category, setCategory]= useState<any>([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const [favoriteBlogs, blogs, categories] = await Promise.all([
          axiosInstance.get("/blog",{
            params: {
              status: "Published",
              favorite: true,
            }
          }),
          axiosInstance.get("/blog",{
            params: {
              search: search,
              status: "Published",
              favorite: false,
              limit: 1,
              page
            }
          }),
          axiosInstance.get("/blog-category")
        ]);
        setFavBlog(favoriteBlogs.data.data);
        setBlog(blogs.data.data);
        setDefPage(blogs.data.pagination)
        setCategory(categories.data);

      } catch (error:any) {
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

  return (
    <div className="lg:container lg:mx-auto flex flex-col gap-8">
      {/* Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 grid-rows-3 gap-6 lg:gap-4 min-h-screen lg:min-h-0 lg:h-[70vh]">
        <BlogCard data={favBlog[0]} size="large" />
        <BlogCard data={favBlog[1]} size="medium" />
        <BlogCard data={favBlog[2]} size="small" />
      </section>

      {/* Main Content and Sidebar Layout */}
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Main Content */}
        <section className="w-full lg:w-2/3">
          {/* Articles List */}
          <h1 className='text-2xl lg:text-4xl font-bold lg:mt-4 mb-4 text-primary'>Related Articles</h1>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-2">
            {blog.map((article: any) => (
              <article key={article.id} className="py-3 lg:pb-8 lg:pt-4">
                <Link href={`/insights/${article.id}`} className="flex flex-col md:flex-row gap-3 lg:gap-6">
                  <div className="md:w-1/3">
                    <Image src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${article.image}`} alt={article.title} className="w-full h-36 object-contain rounded-lg border-[1px] border-gray-300 shadow-sm" width={1920} height={1080} quality={100} />
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
              <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search blog posts" className="w-full border text-sm lg:text-base border-gray-200 rounded-lg px-4 py-2 ps-9" />
              <Search className='top-2 left-2 absolute text-gray-600 h-5 lg:h-6' />
              </form>
            </div>
          </div>
          {/* Category */}
          <BlogCategory data={category} />
        </aside>
      </div>

      <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          className='mt-10'
          setPage={handleChangePage}
          totalPage={defPage.totalPages || 1}
        />
    </div>
  );
}