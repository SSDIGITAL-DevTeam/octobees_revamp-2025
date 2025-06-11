"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { failedToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { Pages, Pagination } from "@/constrant/payload";
import { TablePage } from "@/components/partials/table";

type PageType = {
  data: Pages[];
  pagination: Pagination;
};

export default function DataPage() {
  const [pages, setPages] = useState<PageType>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [sort, setSort] = useState({
    key: "createdAt",
    direction: true
  });


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
        const response = await axiosInstance.get("/page", {
          params: { limit: 10, page, orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}` },
        });
        setPages(response.data);
      } catch (error: any) {
        failedToast(error.response?.data?.error || error.response?.statusText || "Error processing data");
      }
    };

    fetchData();
  }, [page, refetch, sort]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Meta Content Management"} label={"Others"} />
      <section className="flex flex-col gap-6 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
          <h1 className="text-4xl font-semibold text-black">Meta Tags</h1>
          <p>showing all meta tags</p>
        </div>

        <TablePage pages={pages?.data || []} refetch={refetch} setRefetch={setRefetch} setSort={setSort} sort={sort} />

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={pages?.pagination.totalPages || 1}
          totalData={pages?.pagination.total || 0}
        />
      </section>
    </main>
  );
}
