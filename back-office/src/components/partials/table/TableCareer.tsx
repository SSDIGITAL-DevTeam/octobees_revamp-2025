import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Download, Eye, Pencil, Trash } from "lucide-react";
import { Career } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DialogPosition } from "../dialog/DialogPosition";
import formatDate from "@/utils/utilsFormatDate";

interface TableProps {
  careers: Career[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableCategory: React.FC<TableProps> = ({ careers, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/career/${id}`);
      successToast("Applicant data has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting apllicant data"
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
      <div className="min-w-32">
      <Link href={`/career/applicants-data/${id}`} className="text-red-800 flex items-center gap-2 font-semibold">
        <Eye size={15} /> <span>See Details</span>
      </Link>
      </div>
    )
  }

  const headers = [
    {
      key: "Name",
      value: "name"
    },
    {
      key: "Email",
      value: "email"
    },
    {
      key: "Position",
      value: "positionId"
    },
    {
      key: "Submitted At",
      value: "createdAt"
    },
    {
      key: "Resume/CV",
      value: "resume"
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
        {careers.map((career, i) => (
          <TableRow key={i}>
            <TableCell key={`data-name-${i}`} className="p-2">
              {career.name}
            </TableCell>
            <TableCell key={`data-email-${i}`} className="p-2">
              {career.email}
            </TableCell>
            <TableCell key={`data-position-${i}`} className="p-2">
              {career.position.name}
            </TableCell>
            <TableCell key={`data-submitted-at-${i}`} className="p-2">
              {formatDate(career.createdAt)}
            </TableCell>
            <TableCell key={`data-submitted-at-${i}`} className="p-2">
              <button className="flex items-center gap-2 font-semibold text-red-800" onClick={() => window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/resume/${career.resume}`, "_blank")}>
                <Download size={15} /><span>Download Resume/CV</span>
              </button>
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2 w-24">
              {handleAction(career.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCategory;
