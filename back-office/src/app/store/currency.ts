"use client"

import { useEffect } from "react"
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

let currencySyncPromise: Promise<CurrencyCode> | null = null
let lastCurrencySyncAt = 0

const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  value === "USD" || value === "SGD" || value === "IDR"

export const setSharedCurrency = (currency: CurrencyCode) => {
  useCurrencyStore.getState().setCurrency(currency)
  lastCurrencySyncAt = Date.now()
  currencySyncPromise = null
}

export const resetCurrencySyncCache = () => {
  lastCurrencySyncAt = 0
  currencySyncPromise = null
}

export const syncCurrencyFromServer = async (
  options: { force?: boolean } = {},
) => {
  if (typeof window === "undefined") return useCurrencyStore.getState().currency
  const now = Date.now()
  if (currencySyncPromise && !options.force) return currencySyncPromise
  if (!options.force && now - lastCurrencySyncAt < 60_000) {
    return useCurrencyStore.getState().currency
  }

  const token = sessionStorage.getItem("token")
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  if (!token || !baseUrl) return useCurrencyStore.getState().currency

  currencySyncPromise = (async () => {
    try {
      const response = await fetch(`${baseUrl}/back-office/partner/currency-config`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      })
      if (!response.ok) return useCurrencyStore.getState().currency
      const payload = await response.json().catch(() => ({}))
      const currency = payload?.data?.currency
      if (isCurrencyCode(currency)) {
        setSharedCurrency(currency)
        return currency
      }
    } catch {
      return useCurrencyStore.getState().currency
    } finally {
      currencySyncPromise = null
    }

    return useCurrencyStore.getState().currency
  })()

  return currencySyncPromise
}

export const useSharedCurrency = () => {
  const currency = useCurrencyStore((state) => state.currency)
  useEffect(() => {
    void syncCurrencyFromServer()
  }, [])
  return currency
}
