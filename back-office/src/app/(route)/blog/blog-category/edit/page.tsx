"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { useEffect, useState } from "react";
import { FormBlogCategory } from "@/components/layout/form";
import { failedToast } from "@/utils/toast";

export default function PageEditBlogCategory() {

  const [blogcategory, setBlogCategory] = useState();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const responseCategories = await axiosInstance.get(`/blog-category/${id}`);
        setBlogCategory(responseCategories.data);
      } catch (error) {
        failedToast("Failed to fetch blog category data. Please try again later.");
      }
    };
    fetchData();
  }, [id]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Blog Category"} label={"Blog"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Blog Category</h1>
          <p>Edit Blog Category Data</p>
        </div>
        <div className="w-full">
          <FormBlogCategory categories={blogcategory} />
        </div>
      </section>
    </main>
  );
};

