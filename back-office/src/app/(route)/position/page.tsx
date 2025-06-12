"use client";

import { Button } from "@/components/ui/button";
import { Download, Eye, Pencil, Plus, Search, Trash, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TableCareer } from "@/components/partials/table";
import Header from "@/components/layout/header/Header";
import { useSearchParams, useRouter } from "next/navigation";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { axiosInstance } from "@/lib/axios";
import { Pagination, Position } from "@/constrant/payload";
import { DialogPosition } from "@/components/partials/dialog/DialogPosition";
import { failedToast, successToast } from "@/utils/toast";
import { exportPosition } from "@/utils/exportToCSV";

type PositionType = {
  data: Position[];
  pagination: Pagination;
};

export default function PagePosition() {
  const [position, setPosition] = useState<PositionType | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
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
    if (position && page < position.pagination.totalPages) {
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
        const response = await axiosInstance.get("/position", {
          params: { limit: 10, page },
        });
        setPosition(response.data);
      } catch (error: any) {
        failedToast(error.response?.data?.error || error.response?.statusText || "Error fetching data");
      }
    };

    fetchData();
  }, [page, refetch]);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/position/${id}`);
      setRefetch(prev => !prev)
      successToast("Position has been deleted");
    } catch (error) {
      failedToast("Failed to delete position");
    }
  };

  const headings = ["Position Name", "Status", "Action"];
  const data = position?.data.map((item) => ({
    "Position Name": item.name,
    "Status": item.status,
    "Action": (
      <div className="flex items-end gap-5">
        <DialogPosition data={{id: item.id, name: item.name, status: item.status}} refetch={setRefetch}>
          <button>
            <Pencil color="red" size={15} />
          </button>
        </DialogPosition>
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
      <Header title={"Applicant Data"} label={"Career Management"} />
      <section className="flex flex-col gap-16 p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh] items-center">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-1 text-sm text-gray-600 justify-start w-full">
            <h1 className="text-4xl font-semibold text-black">Position</h1>
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
                className="flex gap-2 items-center"
                onClick={()=>exportPosition(position?.data || [])}
                
              >
                <Upload size={15} /> Export Data
              </Button>
            </div>
          </div>
        </div>

        <TableCareer headings={headings} data={filteredData || []} />

        <DialogPosition refetch={setRefetch}>
          <button className="w-full rounded-md border-red-700 border-[1px] text-red-700 font-semibold bg-red-700/10 shadow-md py-2 hover:bg-red-700/30 duration-300 transition-all flex items-center justify-center gap-2">
            <Plus size={15} /> <span>Add Position</span>
          </button>
        </DialogPosition>

        <PaginationComponents
          handleNext={handleNext}
          handlePrev={handlePrevious}
          page={page}
          setPage={handleChangePage}
          totalPage={position?.pagination.totalPages || 1}
          totalData={position?.pagination.total || 0}
        />

      </section>
    </main>
  );
}
