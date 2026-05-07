import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Eye, Trash } from "lucide-react";
import { Lead } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { format } from "date-fns";
import DialogLead from "../dialog/DialogLead";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  leads: Lead[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableInsightLead: React.FC<TableProps> = ({
  leads,
  setSort,
  sort,
  setRefetch,
  refetch,
}) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/back-office/insight-lead/${id}`);
      successToast("Lead has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error ||
          error.response?.statusText ||
          "Error deleting lead",
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") setSort({ key, direction });
  };

  const selectedLead = (id: string) => leads.find((l) => l.id === id) || ({} as Lead);

  const handleAction = (id: string) => {
    const lead = selectedLead(id);
    return (
      <div className="flex items-center gap-5">
        <DialogLead refetch={setRefetch} lead={lead}>
          <Eye color="red" size={15} />
        </DialogLead>
        <DeleteDialog deleteFunc={() => handleDelete(id)}>
          <button className="text-red-500">
            <Trash color="red" size={15} />
          </button>
        </DeleteDialog>
      </div>
    );
  };

  const headers = [
    { key: "Name", value: "name" },
    { key: "Email", value: "email" },
    { key: "Phone", value: "phone" },
    { key: "Insight Article", value: "from" },
    { key: "Created At", value: "createdAt" },
    { key: "Action", value: "action" },
  ];

  const getInsightSlug = (from: string | null | undefined) => {
    if (!from) return "-";
    return from.replace(/^insight\//i, "");
  };

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
                {sort?.key === header.value && sort?.direction ? (
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
        {leads.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-gray-400 py-10">
              No insight download leads found
            </TableCell>
          </TableRow>
        ) : (
          leads.map((lead, i) => (
            <TableRow key={i}>
              <TableCell className="p-2">{lead.name}</TableCell>
              <TableCell className="p-2">{lead.email}</TableCell>
              <TableCell className="p-2">{lead.phone}</TableCell>
              <TableCell className="p-2">
                <span className="text-sm text-red-700 font-medium">
                  {getInsightSlug(lead.from)}
                </span>
              </TableCell>
              <TableCell className="p-2">
                {format(new Date(lead.createdAt), "dd MMMM yyyy HH:mm")}
              </TableCell>
              <TableCell className="p-2">{handleAction(lead.id)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableInsightLead;
