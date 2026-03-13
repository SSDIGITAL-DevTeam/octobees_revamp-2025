import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";
import type { ClientOnboarding } from "@/constrant/payload";
import Link from "next/link";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  clients: ClientOnboarding[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableClientOnboarding: React.FC<TableProps> = ({
  clients,
  setSort,
  sort,
  setRefetch,
  refetch,
}) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/client-onboarding/${id}`);
      successToast("Client onboarding has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error ||
          error.response?.statusText ||
          "Error deleting client onboarding",
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  };

  const handleAction = (id: string) => {
    return (
      <div className="flex items-center gap-5">
        <Link href={`/lead/client-onboarding/edit?id=${id}`} className="text-blue-500">
          <Pencil color="red" size={15} />
        </Link>
        <DeleteDialog deleteFunc={() => handleDelete(id)}>
          <button className="text-red-500">
            <Trash color="red" size={15} />
          </button>
        </DeleteDialog>
      </div>
    );
  };

  const statusBadge = (isChecked: boolean) => {
    return (
      <span
        className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit ${
          isChecked ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
        }`}
      >
        <span className={`h-2 w-2 rounded-full ${isChecked ? "bg-green-700" : "bg-slate-500"}`} />
        {isChecked ? "Checked" : "Pending"}
      </span>
    );
  };

  const headers = [
    { key: "Name", value: "name" },
    { key: "Company", value: "companyName" },
    { key: "Email", value: "email" },
    { key: "Agreement 1", value: "agreementGuideApproved" },
    { key: "Agreement 2", value: "agreementProgramCommitment" },
    { key: "Action", value: "action" },
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
        {clients.map((client, i) => (
          <TableRow key={i}>
            <TableCell className="p-2">{client.name}</TableCell>
            <TableCell className="p-2">{client.companyName}</TableCell>
            <TableCell className="p-2">{client.email}</TableCell>
            <TableCell className="p-2">{statusBadge(client.agreementGuideApproved)}</TableCell>
            <TableCell className="p-2">{statusBadge(client.agreementProgramCommitment)}</TableCell>
            <TableCell className="p-2 w-24">{handleAction(client.id)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableClientOnboarding;
