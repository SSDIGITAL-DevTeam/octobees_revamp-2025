"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import {  useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { FormCategory } from "@/components/layout/form";
import { failedToast } from "@/utils/toast";

const EditPage = () => {
  const [category, setCategory] = useState();
  const searchParams = useSearchParams();
  const query = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!query) return;
        const resCategory = await axiosInstance.get(`/service-category/${query}`);
        setCategory(resCategory.data);

      } catch (error) {
        failedToast(
          "Failed to fetch category data. Please try again later."
        )
      }
    };
    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Services Category"} label={"Services Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit category</h1>
          <p>Edit Category Data</p>
        </div>
        <div className="w-full">
            <FormCategory category={category} />
        </div>
      </section>
    </main>
  );
};

export default EditPage;
