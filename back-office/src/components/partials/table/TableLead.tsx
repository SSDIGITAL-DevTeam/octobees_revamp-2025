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

const TableLead: React.FC<TableProps> = ({
  leads,
  setSort,
  sort,
  setRefetch,
  refetch,
}) => {
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/back-office/lead/${id}`);
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
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  };

  const selectedLead = (id: string) => {
    return leads.find((lead) => lead.id === id) || ({} as Lead);
  };

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
    { key: "Company", value: "companyName" },
    { key: "From Page", value: "from" },
    { key: "Referral Code", value: "referralCode" },
    { key: "Created At", value: "createdAt" },
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
        {leads.map((lead, i) => (
          <TableRow key={i}>
            <TableCell className="p-2">{lead.name}</TableCell>
            <TableCell className="p-2">{lead.email}</TableCell>
            <TableCell className="p-2">{lead.phone}</TableCell>
            <TableCell className="p-2">{lead.companyName || "-"}</TableCell>
            <TableCell className="p-2">{lead.from || "-"}</TableCell>
            <TableCell className="p-2">{lead.referralCode || "-"}</TableCell>
            <TableCell className="p-2">
              {format(new Date(lead.createdAt), "dd MMMM yyyy HH:mm")}
            </TableCell>
            <TableCell className="p-2">{handleAction(lead.id)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLead;
