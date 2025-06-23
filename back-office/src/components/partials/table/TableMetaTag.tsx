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
import { CategoryService, MetaTag } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  metatags: MetaTag[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
  slug: string;
}

const TableMetaTag: React.FC<TableProps> = ({ metatags = [], setSort, sort, setRefetch, refetch, slug }) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/meta/${id}`);
      successToast("Meta Tag has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting Meta Tag"
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
        <Link href={`/meta/${slug}/edit?id=${id}`} className="text-blue-500">
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

  const headers = [
    {
      key: "Key",
      value: "key"
    },
    {
      key: "Value",
      value: "value"
    },
    {
      key: "Content",
      value: "content"
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
        {metatags.map((metatag, i) => (
          <TableRow key={i}>
            <TableCell key={`data-key-${i}`} className="p-2">
              {metatag.key}
            </TableCell>
            <TableCell key={`data-value-${i}`} className="p-2">
              {metatag.value}
            </TableCell>
            <TableCell key={`data-content-${i}`} className="p-2">
              {metatag.content}
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2 w-24">
              {handleAction(metatag.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableMetaTag;
