"use client"
import FormBlog from "@/components/layout/form/FormBlog";
import Header from "@/components/layout/header/Header";
import { Blog, BlogCategory } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import { failedToast } from "@/utils/toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AddPage = () => {

  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [blog, setBlog] = useState<Blog>();
  const searchParams = useSearchParams();
  const query = searchParams.get("id")

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const [category, value] = await Promise.all([
          axiosInstance.get(
            "/blog-category"
          ),
          axiosInstance.get(
            `/blog/${query}`
          )
        ])
        setCategories(category.data.data);
        setBlog(value.data);
      } catch (error : any) {
        failedToast(
          error.response?.data?.error || error.response?.statusText || "Error fetching data"
        )
      }
    };
    fetchCategory();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Blog"} label={"Blog Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Blog</h1>
          <p>Input new blog data</p>
        </div>
        <div className="w-full">
          <FormBlog categories={categories || []} blog={blog}/>
        </div>
      </section>
    </main>
  );
};

export default AddPage;
