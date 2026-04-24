const normalizeCurrencyInput = (value: string) => {
  const sanitized = String(value || "").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = sanitized.split(".");
  const normalizedInteger = integerPart.replace(/^0+(?=\d)/, "");
  const decimalPart = decimalParts.join("").slice(0, 2);

  if (!normalizedInteger && !decimalPart) return "";
  if (sanitized.includes(".")) {
    return `${normalizedInteger || "0"}${sanitized.endsWith(".") && !decimalPart ? "." : `.${decimalPart}`}`;
  }

  return normalizedInteger || "0";
};

export const formatUsdInputValue = (rawValue: string) => {
  const normalized = normalizeCurrencyInput(rawValue);
  if (!normalized) return "";

  const hasTrailingDot = normalized.endsWith(".");
  const [integerPart = "0", decimalPart = ""] = normalized.split(".");
  const formattedInteger = Number(integerPart || 0).toLocaleString("en-US");

  if (hasTrailingDot) {
    return `$ ${formattedInteger}.`;
  }

  if (decimalPart) {
    return `$ ${formattedInteger}.${decimalPart}`;
  }

  return `$ ${formattedInteger}`;
};

export const parseUsdInputValue = (value: string) => normalizeCurrencyInput(value);
