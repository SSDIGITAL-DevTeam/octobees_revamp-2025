"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { MetaTag, Pages, Pagination } from "@/constrant/payload";
import { failedToast } from "@/utils/toast";
import { TableMetaTag } from "@/components/partials/table";

export default function PageMetaTag() {
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refetch, setRefecth] = useState<boolean>(false);
  const [meta, setMeta] = useState<MetaTag[]>([]);
  const [pages, setPages] = useState<Pages>();
  const [pagination, setPagination] = useState({ totalPages: 1 } as Pagination);
  const [sort, setSort] = useState({
    key: "createdAt",
    direction: true
  });

  const params = useParams();
  const slug = params?.slug as string;
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
    if (meta && page < pagination.totalPages) {
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
        if (!slug) return;
        const response = await axiosInstance.get(`/page/${slug}`, {
          params: { limit: 10, page, orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}` },
        })
        setMeta(response.data.data.meta)
        setPagination(response.data.pagination)
        setPages(response.data.data.pages)
      } catch (error: any) {
        failedToast(error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };
    fetchData();
  }, [slug, page, refetch, sort]);

  return (
    <main className="w-full flex flex-col gap-12">
      <Header title={"Meta Tag"} label={"Others"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-4 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">{pages?.page}</h1>
            <p>showing all meta tags</p>
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
              <Link href={`/meta/${slug}/add`}>
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

        <TableMetaTag metatags={meta} refetch={refetch} setRefetch={setRefecth} setSort={setSort} sort={sort} slug={slug} />

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={pagination.totalPages || 1}
          totalData={pagination.total || 0}
        />
      </section>
    </main>
  );
}
