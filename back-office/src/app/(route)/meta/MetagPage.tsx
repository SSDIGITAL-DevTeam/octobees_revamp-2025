"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CirclePlus, ListFilter, Pencil, Search, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableComponents from "@/components/partials/table/TableComponents";
import Header from "@/components/layout/header/Header";
import { failedToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";

type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type PackagesType = {
  data: any;
  pagination: Pagination;
};

export default function DataPage() {
  const [pages, setPages] = useState<PackagesType | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);


  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    setPage(urlPage);
  }, [searchParams]);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    setPage(newPage);
  };

  const handleNext = () => {
    if (pages && page < pages.pagination.totalPages) {
      handleChangePage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      handleChangePage(page - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/page",{
          params: { limit: 4, page },
        });
        setPages(response.data);
      } catch (error: any) {
        failedToast("Error", error.response?.data?.error || error.response?.statusText || "Error processing data");
      }
    };

    fetchData();
  }, [page]);

  const headings = ["Page Name", "Action"];
  const data = pages?.data.map((item: any) => ({
    "Page Name": item.page,
    "Action": (
      <div className="flex items-center gap-5">
        <Link href={`/meta/${item.slug}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
      </div>
    ),
  }));

  return (
    <main className="w-full flex flex-col gap-12">
      <Header title={"Meta Content Management"} label={"Others"} />
      <section className="flex flex-col gap-6 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Meta Tags</h1>
          <p>showing all meta tags</p>
        </div>

        <TableComponents data={data || []} headings={headings} />
        
        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={pages?.pagination.totalPages || 1}
        />
      </section>
    </main>
  );
}
