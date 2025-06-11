import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { Blog } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";

interface TableProps {
  blogs: Blog[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableBlog: React.FC<TableProps> = ({ blogs, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/blog/${id}`);
      successToast("Blog has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting blog"
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  }

  const handleAction = (id: string) => {
    return(
      <div className="flex items-center gap-5">
        {/* <button
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
        </button> */}

        <Link href={`/blog/blogs/edit?id=${id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <button onClick={() => handleDelete(id)} className="text-red-500">
          <Trash color="red" size={15} />
        </button>
      </div>
    )
  }

  //   const handleFavorite = async (id: string, currentStatus: boolean) => {
  //   try {
  //     const response = await axiosInstance.patch(`/blog/${id}`, {
  //       favorite: !currentStatus,
  //     });
  //     if (response.status === 200) {
  //       setRefetch(!refetch);
  //     }
  //     successToast(
  //        `Blog has been ${currentStatus ? "unfavorite" : "favorite"}`
  //     )
  //   } catch (error: any) {
  //     failedToast(
  //       error.response?.data?.error || error.response?.statusText || "Error processing data"
  //     );
  //   }
  // };

  const formatStatus = (status: string) => {
    return (
      <span
        className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit
        ${status === "Published"
            ? "bg-green-100 text-green-700"
            : status == "Takedown"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }
      `}
      >
        <span
          className={`h-2 w-2 rounded-full ${status === "Published"
            ? "bg-green-700"
            : status == "Takedown"
              ? "bg-red-700"
              : "bg-yellow-700"
            }`}
        />
        {status}
      </span>

    )
  }

  const headers = [
    {
      key: "Blog Name",
      value: "title"
    },
    {
      key: "Category",
      value: "categoryId"
    },
    {
      key: "Status",
      value: "status"
    },
    {
      key: "Action",
      value: "action"
    }
  ];

  return (
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header, i) => (
              <TableHead
                key={i}
                onClick={() => handleSort(header.value, !sort.direction)}
                className="cursor-pointer select-none text-red-900 hover:text-red-700"
              >
                {header.key}
                <span className="ml-1 inline-block">
                  { sort?.key === header.value && sort?.direction === true ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  )}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {blogs.map((blog, i) => (
            <TableRow key={i}>
              <TableCell key={`data-${i}`} className="p-2">
                {blog.title}
              </TableCell>
              <TableCell key={`data-${i}`} className="p-2">
                {blog.category.name}
              </TableCell>
              <TableCell key={`data-${i}`} className="p-2">
                {formatStatus(blog.status)}
              </TableCell>
              <TableCell key={`data-${i}`} className="p-2">
                {handleAction(blog.id)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
  );
};

export default TableBlog;
