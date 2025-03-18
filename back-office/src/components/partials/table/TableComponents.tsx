import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TableProps {
  headings: string[];
  data: any;
}

const TableComponents: React.FC<TableProps> = ({ headings, data }) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0; // Jika tidak ada sorting, kembalikan data asli

    const { key, direction } = sortConfig;
    const valueA = a[key];
    const valueB = b[key];

    if (typeof valueA === "number" && typeof valueB === "number") {
      return direction === "asc" ? valueA - valueB : valueB - valueA;
    }

    return direction === "asc"
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) =>
      prev?.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const checkStatus = (status: string) => {
    return (
    <span
      className={`py-1 px-3 rounded-lg text-xs flex items-center gap-2 w-fit
          ${
            status === "Active" || status === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }
        `}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          status === "Active" || status === "Published" ? "bg-green-700" : "bg-red-700"
        }`}
      />
      {status}
    </span>
  )}

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headings.map((heading) => (
            <TableHead
              key={heading}
              onClick={() => handleSort(heading)}
              className="cursor-pointer select-none hover:text-red-700"
            >
              {heading}{" "}
              {sortConfig?.key === heading && (
                <span className="ml-1 inline-block">
                  {sortConfig.direction === "asc" ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  )}
                </span>
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headings.map((key) => (
              <TableCell key={`${rowIndex}-${key}`} className="p-2">
                {key == "Status" ? checkStatus(row[key]) : row[key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableComponents;
