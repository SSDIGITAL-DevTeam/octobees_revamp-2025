"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Search, Trash, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableComponents from "@/components/partials/table/TableComponents";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { failedToast, successToast } from "@/utils/toast";
import { Pagination, Subscription } from "@/constrant/payload";
import { TableSubscription } from "@/components/partials/table";
import { exportSubscription } from "@/utils/exportToCSV";

type SubscriptionType = {
  data: Subscription[];
  pagination: Pagination;
};

export default function DataPage() {
  const [subscriptions, setSubscription] = useState<SubscriptionType>();
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [sort, setSort] = useState({
    key: "createdAt",
    direction: true
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    setPage(urlPage);
  }, [searchParams]);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    setPage(newPage);
  };

  const handleNext = () => {
    if (subscriptions && page < subscriptions.pagination.totalPages) {
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
        const response = await axiosInstance.get("/subscription", {
          params: { limit: 10, page, search: searchQuery, orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}` },
        });
        setSubscription(response.data);
      } catch (error: any) {
        failedToast("Failed to fetch subscriptions");
      }
    };

    fetchData();
  }, [page, refetch]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Subscription"} label={"Subscription Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">All Subscriptions</h1>
            <p>showing all subscriptions</p>
          </div>

          <div className="flex items-center">
            <div className="flex gap-3">
              {isOpen && (
                <input
                  type="text"
                  placeholder={`Cari Sesuatu disini...`}
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
                onClick={() => exportSubscription(subscriptions?.data || [])}
              >
                <Upload size={15} /> Export Data
              </Button>
            </div>
          </div>
        </div>

        <TableSubscription refetch={refetch} subscriptions={subscriptions?.data || []} setSort={setSort} sort={sort} setRefetch={setRefetch} />

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={subscriptions?.pagination.totalPages || 1}
          totalData={subscriptions?.pagination.total || 0}
        />
      </section>
    </main>
  );
}
