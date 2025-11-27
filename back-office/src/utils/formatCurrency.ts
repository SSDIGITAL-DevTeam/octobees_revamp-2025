export const formatIDR = (value: number | string): string => {
  const num = typeof value === "string" ? Number(value) : value;

  if (isNaN(num)) return "IDR 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};
