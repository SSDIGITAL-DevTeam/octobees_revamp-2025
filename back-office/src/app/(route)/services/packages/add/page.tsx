"use client"
import FormComponents from "@/components/layout/form/FormPackage";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import axios from "axios";
import React, { useEffect } from "react";

export default function AddPage() : JSX.Element {

  const [data, setData] = React.useState<any>([]);
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await axiosInstance.get(
        "/service-category"
      );
      setData(res.data.data);
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
          <FormComponents data={data}/>
        </div>
      </section>
    </main>
  );
};
