"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CirclePlus, ListFilter, Pencil, Search, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableComponents from "@/components/partials/table/TableComponents";
import Header from "@/components/layout/header/Header";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";

type Pagination = {
  currentPage: number;
  perPage: number;
  total: number;
  totalPages: number;
};

type PackagesType = {
  data: any;
  pages: any;
  pagination: Pagination;
};


export default function DataPage() {
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [meta, setMeta] = useState<PackagesType | null>(null);
  const [refetch, setRefecth] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);

  const params = useParams();
  const pages = params?.slug as string;
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
    if (meta && page < meta.pagination.totalPages) {
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
        if (!pages) return;
        const meta = await axiosInstance.get(`/page/${pages}`, {
          params: { limit: 10, page }
        })
        setMeta(meta.data)
      } catch (error: any) {
        setErr(error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };
    fetchData();
  }, [pages, page, refetch]);

  // console.log(meta);

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/meta/${id}`);
      setRefecth((prev) => !prev);
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };

  const headings = ["Key", "Value", "Content", "Action"];
  const data = meta?.data.map((item: any) => ({
    "Key": item.key,
    "Value": item.value,
    "Content": item.content,
    "Action": (
      <div className="flex items-center gap-5">
        <Link href={`/meta/${pages}/edit?id=${item.id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <button onClick={() => handleDelete(item.id)} className="text-red-500">
          <Trash color="red" size={15} />
        </button>
      </div>
    ),
  }))

  // const filteredData = data?.filter((row: any) =>
  //   headings.some((key) =>
  //     String(row[key]).toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );

  console.log(meta);

  return (
    <main className="w-full flex flex-col gap-12">
      <Header title={"Meta Tag"} label={"Others"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">{meta?.pages.page}</h1>
            <p>showing all meta tags</p>
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
              <Link href={`/meta/${pages}/add`}>
                <Button
                  variant={"addData"}
                  size={"sm"}
                  className="flex gap-2 items-center"
                >
                  <CirclePlus size={15} /> Add Meta Tag
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <TableComponents headings={headings} data={data || []} />

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={meta?.pagination.totalPages || 1}
          totalData={meta?.pagination.total || 0}
        />
      </section>
    </main>
  );
}
