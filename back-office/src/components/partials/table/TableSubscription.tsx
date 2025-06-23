import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Eye, Trash } from "lucide-react";
import { Subscription } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { format } from "date-fns"
import DialogSubscription from "../dialog/DialogSubscription";
import { DeleteDialog } from "../dialog/DialogDelete";

interface TableProps {
  subscriptions: Subscription[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableSubscription: React.FC<TableProps> = ({ subscriptions, setSort, sort, setRefetch, refetch }) => {
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/subscription/${id}`);
      successToast("Subscription has been deleted");
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error deleting subscription"
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  }

  const selectedSubscription = (id: number) => {
    return subscriptions.find(sub => sub.id === id) || {} as Subscription;
  }

  const handleAction = (id: number) => {
    const subscription = selectedSubscription(id);
    return (
      <div className="flex items-center gap-5">
        <DialogSubscription refetch={setRefetch} subscription={subscription}>
          <Eye color="red" size={15} />
        </DialogSubscription>
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
      key: "Subscription Email",
      value: "email"
    },
    {
      key: "Source",
      value: "source"
    },
    {
      key: "Created At",
      value: "createdAt"
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
        {subscriptions.map((sub, i) => (
          <TableRow key={i}>
            <TableCell key={`data-email-${i}`} className="p-2">
              {sub.email}
            </TableCell>
            <TableCell key={`data-source-${i}`} className="p-2">
              {sub.source}
            </TableCell>
            <TableCell key={`data-create-at-${i}`} className="p-2">
              {format(new Date(sub.createdAt), "dd MMMM yyyy HH:mm")}
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2">
              {handleAction(sub.id)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableSubscription;
