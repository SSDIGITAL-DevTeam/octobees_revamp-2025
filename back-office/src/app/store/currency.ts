import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CurrencyCode = "USD" | "SGD" | "IDR"

export const CURRENCY_STORAGE_KEY = "octobees:currency"

export const CURRENCY_OPTIONS: {
  code: CurrencyCode
  label: string
  symbol: string
  locale: string
  flag: string
}[] = [
  { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US", flag: "🇺🇸" },
  { code: "SGD", label: "Singapore Dollar", symbol: "SGD", locale: "en-SG", flag: "🇸🇬" },
  { code: "IDR", label: "Indonesian Rupiah", symbol: "Rp", locale: "id-ID", flag: "🇮🇩" },
]

interface CurrencyState {
  currency: CurrencyCode
  setCurrency: (code: CurrencyCode) => void
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "USD",
      setCurrency: (code) => set({ currency: code }),
    }),
    {
      name: CURRENCY_STORAGE_KEY,
    },
  ),
)

export const formatWithCurrency = (
  value: number,
  currency: CurrencyCode = "USD",
): string => {
  const option =
    CURRENCY_OPTIONS.find((o) => o.code === currency) ?? CURRENCY_OPTIONS[0]
  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

export const getCurrencySymbol = (currency: CurrencyCode = "USD"): string =>
  CURRENCY_OPTIONS.find((option) => option.code === currency)?.symbol ?? "$"
