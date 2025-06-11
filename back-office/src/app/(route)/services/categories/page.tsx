"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil, Search, Trash } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import TableComponents from "@/components/partials/table/TableComponents";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";


type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type CategoryType = {
  data: [];
  pagination: Pagination;
};


export default function DataPage() {
  const [packages, setPackages] = useState<CategoryType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);
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
    if (packages && page < packages.pagination.totalPages) {
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
        const response = await axiosInstance.get("/service-category", {
          params: { limit: 10, page},
        });
        setPackages(response.data);
      } catch (error: any) {
        setErr(error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };

    fetchData();
  }, [page, refetch]);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/service-category/${id}`);
      setRefetch(prev => !prev)
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const headings = ["Category Name", "Heading", "Description", "Status", "Action"];
  const data = packages?.data.map((item: any) => ({
    "Category Name": item.name,
    "Heading": item.heading,
    "Description": item.description,
    "Status": item.status,
    "Action": (
      <div className="flex items-center gap-5">
        <Link href={`/services/categories/edit?id=${item.id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <button onClick={() => handleDelete(item.id)} className="text-red-500">
          <Trash color="red" size={15} />
        </button>
      </div>
    ),
  }));

  const filteredData = data?.filter((row: any) =>
    headings.some((key) =>
      String(row[key]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Services Category"} label={"Services Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">All Category</h1>
            <p>showing all category</p>
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
              <Link href="/services/categories/add">
                <Button
                  variant={"addData"}
                  size={"sm"}
                  className="flex gap-2 items-center"
                >
                  <CirclePlus size={15} /> Add Category
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <TableComponents headings={headings} data={filteredData || []} />
        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={packages?.pagination.totalPages || 1}
          totalData={packages?.pagination.total || 0}
        />
      </section>
    </main>
  );
}
