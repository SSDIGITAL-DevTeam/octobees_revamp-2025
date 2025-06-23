"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye, Search, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TableCareer } from "@/components/partials/table";
import Header from "@/components/layout/header/Header";
import { useSearchParams, useRouter } from "next/navigation";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { axiosInstance } from "@/lib/axios";
import { Career, Pagination } from "@/constrant/payload";
import { exportCareer } from "@/utils/exportToCSV";
import { failedToast } from "@/utils/toast";

type CareerType = {
  data: Career[];
  pagination: Pagination;
};

export default function PageCareer() {
  const [career, setCareer] = useState<CareerType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [sort, setSort] = useState({ key: "createdAt", direction: true });
  const searchParams = useSearchParams();
  const router = useRouter();

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
    if (career && page < career.pagination.totalPages) {
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
        const response = await axiosInstance.get("/career", {
          params: { limit: 10, page, search: searchQuery, orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}` },
        });
        setCareer(response.data);
      } catch (error: any) {
        failedToast(error.response?.data?.error || error.response?.statusText || "Error processing data");
      }
    };

    fetchData();
  }, [page, searchQuery, sort, refetch]);

  return (
    <main className="w-full flex flex-col gap-12">
      <Header title={"Applicant Data"} label={"Career Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">Applicant Data</h1>
          </div>

          <div className="flex items-center">
            <div className="flex gap-3">
              {isOpen && (
                <input
                  type="text"
                  placeholder={`Search something...`}
                  className="border rounded-lg px-3 py-2 focus:outline-none w-full min-w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              )}
              <Button
                variant={"outline"}
                onClick={() => setIsOpen((prev) => !prev)}
                className="h-12 w-12 rounded-full p-3"
              >
                <Search size={23} />
              </Button>


              <Button
                variant={"addData"}
                size={"sm"}
                type="button"
                className="flex gap-2 items-center"
                onClick={() => exportCareer(career?.data || [])}
              >
                <Upload size={15} /> Export Data
              </Button>
            </div>
          </div>
        </div>

        <TableCareer careers={career?.data || []} refetch={refetch} setRefetch={setRefetch} setSort={setSort} sort={sort} />

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={career?.pagination.totalPages || 1}
          totalData={career?.pagination.total || 0}
        />

      </section>
    </main>
  );
}
