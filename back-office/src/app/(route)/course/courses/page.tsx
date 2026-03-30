"use client";

import { Button } from "@/components/ui/button";
import { CirclePlus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { TableCourse } from "@/components/partials/table";
import { Course, Pagination } from "@/constrant/payload";
import { failedToast } from "@/utils/toast";

type CourseType = {
  data: Course[];
  pagination: Pagination;
};

export default function CoursesPage() {
  const [coursesResponse, setCoursesResponse] = useState<CourseType>();
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    setPage(newPage);
  };

  const handleNext = () => {
    if (coursesResponse && page < coursesResponse.pagination.totalPages) {
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
        const response = await axiosInstance.get("/course", {
          params: { limit: 10, page, search: searchQuery, orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}` },
        });
        setCoursesResponse(response.data);
      } catch (error: any) {
        failedToast(error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };
    fetchData();
  }, [page, refetch, searchQuery, sort]);

  return (
    <main className="w-full flex flex-col gap-12 pb-12">
      <Header title={"Courses"} label={"Course Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">All Courses</h1>
            <p>showing all courses</p>
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
              <Link href="/course/courses/add">
                <Button variant={"addData"} size={"sm"} className="flex gap-2 items-center">
                  <CirclePlus size={15} /> Add Course
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <TableCourse courses={coursesResponse?.data || []} setSort={setSort} setRefetch={setRefetch} refetch={refetch} sort={sort}/>
        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={coursesResponse?.pagination.totalPages || 1}
          totalData={coursesResponse?.pagination.total || 0}
        />
      </section>
    </main>
  );
}
