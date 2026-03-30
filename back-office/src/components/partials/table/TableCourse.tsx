import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { Course } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  courses: Course[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableCourse: React.FC<TableProps> = ({ courses, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/back-office/course/${id}`);
      successToast("Course has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting course"
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
    return (
      <div className="flex items-center gap-5">
        <Link href={`/course/courses/edit?id=${id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <DeleteDialog deleteFunc={() => handleDelete(id)}>
          <button className="text-red-500">
            <Trash color="red" size={15} />
          </button>
        </DeleteDialog>
      </div>
    )
  }

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  const headers = [
    { key: "Title", value: "title" },
    { key: "Price", value: "price" },
    { key: "Status", value: "isActive" },
    { key: "Action", value: "action" }
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
                {sort?.key === header.value && sort?.direction === true ? (
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
        {courses.map((cur, i) => (
          <TableRow key={i}>
            <TableCell className="p-2">{cur.title}</TableCell>
            <TableCell className="p-2">{formatRupiah(cur.price)}</TableCell>
            <TableCell className="p-2">
                <span
                  className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit ${
                    cur.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {cur.isActive ? "Active" : "Inactive"}
                </span>
            </TableCell>
            <TableCell className="p-2 w-24">
              {handleAction(cur.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCourse;
