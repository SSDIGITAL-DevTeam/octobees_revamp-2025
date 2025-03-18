"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";
const FormComponents = lazy(() => import("@/components/layout/form/FormCategory"));

const EditPage = () => {
  const [defaultValue, setDefaultValue] = useState();
  const searchParams = useSearchParams();
  const query = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!query) return;
        const resCategory = await axiosInstance.get(`/blog-category/${query}`);
        setDefaultValue(resCategory.data);

      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Blog Category"} label={"Blog"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Blog Category</h1>
          <p>Edit Blog Category Data</p>
        </div>
        <div className="w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <FormComponents defaultValue={defaultValue} />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default EditPage;
