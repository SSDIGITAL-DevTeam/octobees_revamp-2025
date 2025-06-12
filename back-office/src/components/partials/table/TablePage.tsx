import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp, Eye, Pencil, Trash } from "lucide-react";
import { Pages, Subscription } from "@/constrant/payload";
import { axiosInstance } from "@/lib/axios";
import { failedToast, successToast } from "@/utils/toast";
import { format } from "date-fns"
import DialogSubscription from "../dialog/DialogSubscription";
import Link from "next/link";

interface TableProps {
  pages: Pages[];
  setSort: (sort: { key: string; direction: boolean }) => void;
  setRefetch: (refetch: boolean) => void;
  refetch: boolean;
  sort: { key: string; direction: boolean };
}

const TablePage: React.FC<TableProps> = ({ pages, setSort, sort, setRefetch, refetch }) => {

  const handleSort = (key: string, direction: boolean) => {
    if (key !== "action") {
      setSort({ key, direction });
      setRefetch(!refetch);
    }
  }

  const selectedSubscription = (id : string) => {
    return pages.find(sub => sub.id === id) || {} as Pages;
  }

  const handleAction = (slug: string) => {
    return (
        <Link href={`/meta/${slug}`} className="text-blue-500 flex items-center px-2">
          <Pencil color="red" size={15} />
        </Link>
    )
  }

  const headers = [
    {
      key: "Page Name",
      value: "page"
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
        {pages.map((page, i) => (
          <TableRow key={i}>
            <TableCell key={`data-page-${i}`} className="p-2">
              {page.page}
            </TableCell>
            <TableCell key={`data-action-${i}`} className="p-2">
              {handleAction(page.slug)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePage;
