"use client";

import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/header/Header";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { FormClientOnboarding } from "@/components/layout/form";
import { failedToast } from "@/utils/toast";
import type { ClientOnboarding } from "@/constrant/payload";

const EditPage = () => {
  const [client, setClient] = useState<ClientOnboarding>();
  const searchParams = useSearchParams();
  const query = searchParams.get("id");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!query) return;
        const response = await axiosInstance.get(`/client-onboarding/${query}`);
        setClient(response.data);
      } catch (error: any) {
        failedToast(
          error?.response?.data?.error ||
            error?.response?.statusText ||
            "Failed to fetch client onboarding data",
        );
      }
    };

    fetchData();
  }, [query]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Client Onboarding"} label={"Lead Management"} />
      <section className="flex flex-col gap-10 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Edit Client Onboarding</h1>
          <p>Edit client onboarding data</p>
        </div>
        <div className="w-full">
          <FormClientOnboarding client={client} />
        </div>
      </section>
    </main>
  );
};

export default EditPage;
