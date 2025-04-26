// import { formatInTimeZone } from "date-fns-tz";

// export const formattedDate = (date: Date):string => {
//     const localDate = new Date(date);
//     const clientTimeZone = "Asia/Jakarta";
//     const utcDate = formatInTimeZone(localDate, clientTimeZone, "MMMM d, yyyy");
//     return utcDate
// }

import { formatInTimeZone } from "date-fns-tz";

export const formattedDate = (date: Date): string => {
  const clientTimeZone = "Asia/Jakarta";
  return formatInTimeZone(date, clientTimeZone, "MMMM d, yyyy");
};
