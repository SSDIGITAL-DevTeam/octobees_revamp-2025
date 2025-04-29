"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { CirclePlus, ListFilter, Pencil, Search, Star, Trash } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import TableComponents from "@/components/partials/table/TableComponents";
import Header from "@/components/layout/header/Header";
import { failedToast, successToast } from "@/utils/toast";
import { axiosInstance } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponents from "@/components/partials/pagination/Pagination";

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
  const [blogs, setBlog] = useState<CategoryType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
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
    if (blogs && page < blogs.pagination.totalPages) {
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
        const response = await axiosInstance.get("/blog", {
          params: { limit: 4, page },
        });
        setBlog(response.data);
      } catch (error: any) {
        failedToast("Failed", error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };

    fetchData();
  }, [page, refetch]);



  useEffect(() => {
    const initialFavorites: { [key: string]: boolean } = {};
    blogs?.data.forEach((item: any) => {
      initialFavorites[item.id] = item.favorite;
    });
    setFavorites(initialFavorites);
  }, [blogs]);

  const handleFavorite = async (id: string, currentStatus: boolean) => {
    try {
      const response = await axiosInstance.patch(`/blog/${id}`, {
        favorite: !currentStatus,
      });
      if (response.status === 200) {
        setRefetch(prev => !prev)
      }
      successToast(
        "Success", `Blog has been ${currentStatus ? "unfavorite" : "favorite"}`
      )
    } catch (error: any) {
      failedToast(
        "Error",
        error.response?.data?.error || error.response?.statusText || "Error processing data"
      );
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/blog/${id}`);
      setRefetch(prev => !prev)
    } catch (error) {
      console.error("Failed to delete package:", error);
    }
  };
  const headings = ["Title", "Category", "Status", "Action"];
  const data = blogs?.data.map((item: any) => ({
    "Title": item.blog.title,
    "Category": item?.blogCategory?.name,
    "Status": item.blog.status,
    "Action": (
      <div className="flex items-center gap-5">
        <button
          onClick={() =>
            handleFavorite(item.blog.id, item.blog.favorite)
          }
          className="text-red-500"
        >
          <Star
            fill={item.blog.favorite ? "red" : "none"}
            color="red"
            size={15}
          />
        </button>

        <Link href={`/blog/blogs/edit?id=${item.blog.id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <button onClick={() => handleDelete(item.blog.id)} className="text-red-500">
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
    <main className="w-full flex flex-col gap-12">
      <Header title={"Blog"} label={"Blog Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">All Blog</h1>
            <p>showing all blog</p>
          </div>

          <div className="flex">

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
              <Link href="/blog/blogs/add">
                <Button
                  variant={"addData"}
                  size={"sm"}
                  className="flex gap-2 items-center"
                >
                  <CirclePlus size={15} /> Create a New Blog
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
          totalPage={blogs?.pagination.totalPages || 1}
        />
      </section>
      {/* {JSON.stringify(blogs?.data)} */}
    </main>
  );
}
