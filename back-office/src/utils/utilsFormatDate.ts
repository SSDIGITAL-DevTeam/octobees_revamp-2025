import { format } from "date-fns";

export default function formatDate(dateString: string | Date): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // Invalid Date

  return format(date, "dd/MM/yyyy HH:mm");
}
