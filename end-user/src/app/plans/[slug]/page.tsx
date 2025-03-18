"use client";

import { JSX, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import HeaderComponents from "@/app/plans/_components/HeaderComponents";
import PlanComponents from "@/app/plans/_components/PlanComponents";
import { axiosInstance } from "@/lib/axios";

export default function Page(): JSX.Element {
  const { slug } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;
    const fetchCategory = async () => {
      try {
        const response = await axiosInstance.get(`/service-category/${slug}`,{
          params : {status : "Active"}
        });
        setData(response.data);
      } catch (e) {
        console.error("Error fetching category:", e);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
   <main className="w-full">
      {/* Header */}
      <HeaderComponents 
        breadcrump={`Octobees,Plans,${data?.name || "..."} `} 
        desc={data?.description || "..."} 
        title={data?.heading || "..."}
      />

      {/* Section 2 */}
      <section className="flex flex-col overflow-x-auto py-[10px] xl:py-[20px]">
        <div className="container">
          {data ? <PlanComponents data={data?.plans} /> : <p>...</p>}
        </div>
      </section>
    </main>
  );
}

