import { Career, Position, Subscription } from "@/constrant/payload";
import { failedToast } from "./toast";

export function exportCareer(
  data: Career[],
) {
  if (!data || data.length === 0) return failedToast("No data to export");
  const filename = `careers-${new Date().toISOString()}.csv`

  const headers = [
    "ID",
    "Name",
    "Email",
    "Phone Number",
    "Position ID",
    "Position Name",
    "Resume",
    "Portfolio",
    "Message",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = data.map((career) => [
    career.id,
    career.name,
    career.email,
    career.phoneNumber,
    career.positionId,
    career.position.name,
    career.resume,
    career.portfolio,
    career.message ?? "",
    career.status,
    career.createdAt,
    career.updatedAt,
  ]);

  exportToCSV({ headers, rows, filename });
}

export function exportPosition(
  data: Position[],
) {
  if (!data || data.length === 0) return failedToast("No data to export");
  const filename = `position-${new Date().toISOString()}.csv`

  const headers = ["ID", "Name", "Status", "Created At", "Updated At"];

  const rows = data.map((career) => [
    career.id,
    career.name,
    career.status,
    career.createdAt,
    career.updatedAt,
  ]);

  exportToCSV({ headers, rows, filename });
}

export function exportSubscription(
  data: Subscription[],
) {
  if (!data || data.length === 0) return failedToast("No data to export");
  const filename = `subscription-${new Date().toISOString()}.csv`
  
  const headers = [
    "ID",
    "Email",
    "Source",
    "Insight",
    "Created At",
    "Updated At",
  ];

  const rows = data.map((sub) => [
    sub.id,
    sub.email,
    sub.source,
    sub.insight ?? "",
    sub.createdAt,
    sub.updatedAt,
  ]);

  exportToCSV({ headers, rows, filename });
}

const exportToCSV = ({
  headers,
  rows,
  filename,
}: {
  headers: string[];
  rows: any[][];
  filename: string;
}) => {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
