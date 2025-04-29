"use client"
import FormBlog from "@/components/layout/form/FormBlog";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const AddPage = () => {

  const [data, setData] = React.useState<any>([]);
  const [defaultValue, setDefaultValue] = React.useState<any>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get("id")

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const [category, value] = await Promise.all([
          axiosInstance.get(
            "/blog-category", {
              params: {
                status: true
              }
            }
          ),
          axiosInstance.get(
            `/blog/${query}`
          )
        ])
        setData(category.data.data);
        setDefaultValue(value.data.blog);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategory();
  }, [query]);

  // console.log({data});
  // console.log({defaultValue});
  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Blog"} label={"Blog Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Blog</h1>
          <p>Input new blog data</p>
        </div>
        <div className="w-full">
          <FormBlog data={data || []} defaultValue={defaultValue || []}/>
        </div>
      </section>
    </main>
  );
};

export default AddPage;
