import { formatInTimeZone } from "date-fns-tz";

export const formattedDate = (date: Date): string => {
  const clientTimeZone = "Asia/Jakarta";
  return formatInTimeZone(date, clientTimeZone, "MMMM d, yyyy");
};
