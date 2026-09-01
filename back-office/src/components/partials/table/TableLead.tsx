import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Eye, Pencil, Trash } from "lucide-react";
import { Lead, LeadStatus } from "@/constrant/payload";
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
  onUpdateStatus?: (id: string, status: LeadStatus) => void;
}

const TableLead: React.FC<TableProps> = ({
  leads,
  setSort,
  sort,
  setRefetch,
  refetch,
  onUpdateStatus,
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

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, newStatus);
      return;
    }
    try {
      await axiosInstance.patch(`/back-office/lead/${id}`, { status: newStatus });
      successToast("Lead status updated successfully");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(error.response?.data?.error || "Failed to update status");
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
      <div className="flex items-center gap-3">
        <DialogLead refetch={setRefetch} lead={lead}>
          <button title="View Detail" className="p-1 hover:bg-red-50 rounded transition-colors">
            <Eye color="red" size={15} />
          </button>
        </DialogLead>

        <DialogLead refetch={setRefetch} lead={lead}>
          <button title="Edit Lead" className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
            <Pencil color="red" size={15} />
          </button>
        </DialogLead>

        <DeleteDialog deleteFunc={() => handleDelete(id)}>
          <button title="Delete Lead" className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors">
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
    { key: "Status", value: "status" },
    { key: "From Page", value: "from" },
    { key: "Referral Code", value: "referralCode" },
    { key: "Voucher", value: "voucherCode" },
    { key: "Created At", value: "createdAt" },
    { key: "Action", value: "action" },
  ];

  const statusBadgeStyle: Record<string, string> = {
    new: "bg-amber-100 text-amber-800 border-amber-300",
    contacted: "bg-blue-100 text-blue-800 border-blue-300",
    in_progress: "bg-purple-100 text-purple-800 border-purple-300",
    won: "bg-emerald-100 text-emerald-800 border-emerald-300",
    lost: "bg-rose-100 text-rose-800 border-rose-300",
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, i) => (
            <TableHead
              key={i}
              onClick={() => handleSort(header.value, !sort.direction)}
              className="cursor-pointer select-none text-red-900 hover:text-red-700 font-semibold"
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
        {leads.map((lead, i) => {
          const st = (lead.status || "new") as LeadStatus;
          return (
            <TableRow key={i}>
              <TableCell className="p-2 font-medium text-gray-900">{lead.name}</TableCell>
              <TableCell className="p-2">{lead.email}</TableCell>
              <TableCell className="p-2">{lead.phone}</TableCell>
              <TableCell className="p-2">{lead.companyName || "-"}</TableCell>
              <TableCell className="p-2">
                <select
                  value={st}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer ${statusBadgeStyle[st] || statusBadgeStyle.new}`}
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="won">Closed Won</option>
                  <option value="lost">Closed Lost</option>
                </select>
              </TableCell>
              <TableCell className="p-2">{lead.from || "-"}</TableCell>
              <TableCell className="p-2">{lead.referralCode || "-"}</TableCell>
              <TableCell className="p-2">
                {lead.voucherCode ? (
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-red-800 bg-red-100 px-2 py-0.5 rounded text-xs w-fit">{lead.voucherCode}</span>
                    {lead.voucher && (
                      <span className="text-xs text-gray-500 capitalize">{lead.voucher.type}</span>
                    )}
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="p-2">
                {format(new Date(lead.createdAt), "dd MMMM yyyy HH:mm")}
              </TableCell>
              <TableCell className="p-2">{handleAction(lead.id)}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TableLead;
