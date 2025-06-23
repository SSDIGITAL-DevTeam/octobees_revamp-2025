"use client"
import FormPackage from "@/components/layout/form/FormPackage";
import Header from "@/components/layout/header/Header";
import { CategoryService } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import React, { useEffect } from "react";

export default function AddPage(): JSX.Element {

  const [categories, setCategories] = React.useState<CategoryService[]>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const response = await axiosInstance.get(
        "/service-category"
      );
      setCategories(response.data.data);
    };
    fetchCategory();
  }, []);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Package"} label={"Service Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Add Package</h1>
          <p>Input new package data</p>
        </div>
        <div className="w-full">
          <FormPackage categories={categories} />
        </div>
      </section>
    </main>
  );
};
