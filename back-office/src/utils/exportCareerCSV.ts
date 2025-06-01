import { Career } from "@/constrant/payload";

export default function exportToCSV(data: Career[], filename = "careers.csv") {
  if (!data || data.length === 0) return;

  // Header
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
    "Updated At"
  ];

  // Rows
  const rows = data.map(career => [
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
    career.updatedAt
  ]);

  // Convert to CSV string
  const csvContent = [
    headers.join(","),                // header
    ...rows.map(row => row.map(val =>
      `"${String(val).replace(/"/g, '""')}"` // Escape quotes
    ).join(","))
  ].join("\n");

  // Download the CSV
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
