"use client"
import FormBlog from "@/components/layout/form/FormBlog";
import Header from "@/components/layout/header/Header";
import { BlogCategory } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import React, { useEffect } from "react";

const AddPage = () => {

  const [categories, setCategories] = React.useState<BlogCategory[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axiosInstance.get(
        "/blog-category",
        { params: { status: true } }
      );
      setCategories(res.data.data);
    };
    fetchCategory();
  }, []);


  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Blog"} label={"Blog Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Add Blog</h1>
          <p>Input new blog data</p>
        </div>
        <div className="w-full">
          <FormBlog categories={categories} />
        </div>
      </section>
    </main>
  );
};

export default AddPage;
