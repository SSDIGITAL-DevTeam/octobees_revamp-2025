import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import { PlanService } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  packages: PlanService[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TablePackage: React.FC<TableProps> = ({ packages, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/plan/${id}`);
      successToast("Package has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting package"
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
        <Link href={`/services/packages/edit?id=${id}`} className="text-blue-500">
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

  const formatStatus = (status: "Active" | "NonActive" | "Draft") => {
    return (
      <span
        className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit
        ${status == "Active"
            ? "bg-green-100 text-green-700"
            : status == "NonActive"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-500"
          }
      `}
      >
        <span
          className={`h-2 w-2 rounded-full 
            ${status == "Active"
              ? "bg-green-700"
              : status == "NonActive"
                ? "bg-red-700"
                : "bg-yellow-500"
            }`
          }
        />
        {status}
      </span>

    )
  }

  const headers = [
    {
      key: "Package Name",
      value: "name"
    },
    {
      key: "Category",
      value: "categoryId"
    },
    {
      key: "Type",
      value: "type"
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
        {packages.map((pack, i) => (
          <TableRow key={i}>
            <TableCell key={`data-name-${i}`} className="p-2">
              {pack.name}
            </TableCell>
            <TableCell key={`data-heading-${i}`} className="p-2">
              {pack.category.name}
            </TableCell>
            <TableCell key={`data-description-${i}`} className="p-2">
              {pack.type}
            </TableCell>
            <TableCell key={`data-status-${i}`} className="p-2">
              {formatStatus(pack.status)}
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2 w-24">
              {handleAction(pack.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePackage;
