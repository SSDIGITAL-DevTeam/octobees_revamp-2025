"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { Suspense, lazy, useEffect, useState } from "react";
import axios from "axios";
import { axiosInstance } from "@/lib/axios";
import { FormPackage } from "@/components/layout/form";
import { CategoryService, PlanService } from "@/constrant/payload";
import { toast } from "sonner";

const EditPage = () => {
  const [categories, setCategories] = useState<CategoryService[]>([]);
  const [pack, setPackage] = useState<PlanService>();
  const searchParams = useSearchParams();
  const query = searchParams.get("id")

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!query) return;
        const [resCategory, resPlan] = await Promise.all([
          axiosInstance.get("/service-category"),
          axiosInstance.get(`/plan/${query}`)
        ]);
        setCategories(resCategory.data.data);
        setPackage(resPlan.data);

      } catch (error) {
        toast.error("Error fetching data");
      }
    };
    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Package"} label={"Service Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Package</h1>
          <p>Edit package data</p>
        </div>
        <div className="w-full">
            <FormPackage categories={categories} pack={pack} />
        </div>
      </section>
    </main>
  );
};

export default EditPage;
