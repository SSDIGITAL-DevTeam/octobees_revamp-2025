"use client";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { failedToast } from "@/utils/toast";
import FormComponents from "@/components/layout/form/FormComponents";
import { axiosInstance } from "@/lib/axios";

const EditPage = () => {
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get("id") || "");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setQuery(searchParams.get("id") || "");
        const res = await axiosInstance.get(`/role/${query}`);
        setData(res.data);
      } catch (error:any) {
        failedToast("Error", error.response?.data?.error || error.response?.statusText || "Error processing data");
      }
    };
    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"User"} label={"User Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit User</h1>
          <p>Edit user data</p>
        </div>
        <div className="w-full">
          <FormComponents defaultValue={data} />
        </div>
      </section>
    </main>
  );
};

export default EditPage;
