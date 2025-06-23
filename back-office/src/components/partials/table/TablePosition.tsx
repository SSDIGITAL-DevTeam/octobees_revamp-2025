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
import { Position } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DialogPosition } from "../dialog/DialogPosition";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  positions: Position[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TablePosition: React.FC<TableProps> = ({ positions, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/position/${id}`);
      successToast("Position has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting position"
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  }

  const handleAction = (id: number, name: string, status: string) => {
    return (
      <div className="flex items-end gap-5">
        <DialogPosition data={{ id, name, status }} refetch={refetch} setRefetch={setRefetch}>
          <button>
            <Pencil color="red" size={15} />
          </button>
        </DialogPosition>
        <DeleteDialog deleteFunc={() => handleDelete(id)}>
          <button className="text-red-500">
            <Trash color="red" size={15} />
          </button>
        </DeleteDialog>
      </div>
    )
  }

  const formatStatus = (status: string) => {
    return (
      <span
        className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit
        ${status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
          }
      `}
      >
        <span
          className={`h-2 w-2 rounded-full ${status === "Active"
            ? "bg-green-700"
            : "bg-red-700"
            }`}
        />
        {status}
      </span>

    )
  }

  const headers = [
    {
      key: "Position Name",
      value: "name"
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
        {positions.map((position, i) => (
          <TableRow key={i}>
            <TableCell key={`data-name-${i}`} className="p-2">
              {position.name}
            </TableCell>
            <TableCell key={`data-status-${i}`} className="p-2">
              {formatStatus(position.status)}
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2">
              {handleAction(position.id, position.name, position.status)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePosition;
