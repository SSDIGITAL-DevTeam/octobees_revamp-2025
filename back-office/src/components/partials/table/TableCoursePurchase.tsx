import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { CoursePurchase } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";

interface TableProps {
  purchases: CoursePurchase[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TableCoursePurchase: React.FC<TableProps> = ({ purchases, setSort, sort, setRefetch, refetch }) => {
  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED") => {
    try {
      await axiosInstance.patch(`/back-office/course-purchase/${id}/status`, { status });
      successToast(`Purchase status updated to ${status}`);
      setRefetch(!refetch);
    } catch (error: any) {
      failedToast(
        error.response?.data?.error || error.response?.statusText || "Error updating status"
      );
    }
  };

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  }

  const formatStatus = (status: "PENDING" | "APPROVED" | "REJECTED") => {
    return (
      <span
        className={`py-1 px-3 rounded-lg text-xs flex items-center justify-center gap-2 max-w-28
        ${status == "APPROVED"
            ? "bg-green-100 text-green-700"
            : status == "REJECTED"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-500"
          }
      `}
      >
        {status}
      </span>
    )
  }

  const headers = [
    { key: "Date", value: "createdAt" },
    { key: "Customer Email", value: "customerEmail" },
    { key: "Customer Phone", value: "customerPhone" },
    { key: "Course", value: "courseId" },
    { key: "Proof", value: "paymentProofUrl" },
    { key: "Status", value: "status" },
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
        {purchases.map((cur, i) => (
          <TableRow key={i}>
             <TableCell className="p-2">{new Date(cur.createdAt).toLocaleDateString()}</TableCell>
            <TableCell className="p-2">
                <p>{cur.customerName}</p>
                <p className="text-xs text-gray-500">{cur.customerEmail}</p>
            </TableCell>
            <TableCell className="p-2">{cur.customerPhone}</TableCell>
            <TableCell className="p-2">{cur.course.title}</TableCell>
            <TableCell className="p-2">
                 <a href={`${process.env.NEXT_PUBLIC_BASE_URL_FILE}${cur.paymentProofUrl}`} target="_blank" className="text-blue-500 text-sm underline">View Proof</a>
            </TableCell>
            <TableCell className="p-2">
              {formatStatus(cur.status)}
            </TableCell>
            <TableCell className="p-2 w-28">
               <div className="flex gap-2">
                 {cur.status === "PENDING" && (
                     <>
                        <button onClick={() => handleUpdateStatus(cur.id, 'APPROVED')} className="text-green-500 hover:text-green-700" title="Approve">
                             <CheckCircle size={20} />
                        </button>
                        <button onClick={() => handleUpdateStatus(cur.id, 'REJECTED')} className="text-red-500 hover:text-red-700" title="Reject">
                            <XCircle size={20} />
                        </button>
                     </>
                 )}
               </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableCoursePurchase;
