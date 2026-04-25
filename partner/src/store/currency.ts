"use client"

import { useEffect, useState } from "react"

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

export function getStoredCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "USD"
  const stored = localStorage.getItem(CURRENCY_STORAGE_KEY)
  if (stored === "USD" || stored === "SGD" || stored === "IDR") return stored
  return "USD"
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD")

  useEffect(() => {
    setCurrencyState(getStoredCurrency())

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CURRENCY_STORAGE_KEY) {
        setCurrencyState(getStoredCurrency())
      }
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [])

  return currency
}

export function formatWithCurrency(
  value: number,
  currency: CurrencyCode = "USD",
): string {
  const option =
    CURRENCY_OPTIONS.find((o) => o.code === currency) ?? CURRENCY_OPTIONS[0]
  return new Intl.NumberFormat(option.locale, {
    style: "currency",
    currency: option.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))
}

export function getCurrencySymbol(currency: CurrencyCode = "USD"): string {
  return CURRENCY_OPTIONS.find((o) => o.code === currency)?.symbol ?? "$"
}
