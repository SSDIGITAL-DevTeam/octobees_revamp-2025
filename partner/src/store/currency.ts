"use client"

import { useEffect, useState } from "react"

export type CurrencyCode = "USD" | "SGD" | "IDR"

export const CURRENCY_STORAGE_KEY = "octobees:currency"
export const CURRENCY_CHANGE_EVENT = "octobees:currency-change"

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

export function setStoredCurrency(currency: CurrencyCode) {
  if (typeof window === "undefined") return
  localStorage.setItem(CURRENCY_STORAGE_KEY, currency)
  window.dispatchEvent(
    new CustomEvent(CURRENCY_CHANGE_EVENT, { detail: { currency } }),
  )
}

const isCurrencyCode = (value: unknown): value is CurrencyCode =>
  value === "USD" || value === "SGD" || value === "IDR"

let currencySyncPromise: Promise<CurrencyCode> | null = null
let lastCurrencySyncAt = 0

async function syncCurrencyFromServer() {
  if (typeof window === "undefined") return getStoredCurrency()
  const now = Date.now()
  if (currencySyncPromise) return currencySyncPromise
  if (now - lastCurrencySyncAt < 60_000) return getStoredCurrency()

  const token = localStorage.getItem("partner_token")
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  if (!token || !baseUrl) return getStoredCurrency()

  currencySyncPromise = (async () => {
    try {
    const response = await fetch(`${baseUrl}/partner/dashboard/currency-config`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
    if (!response.ok) return getStoredCurrency()
    const payload = await response.json().catch(() => ({}))
    const currency = payload?.data?.currency
    if (isCurrencyCode(currency)) {
      setStoredCurrency(currency)
      lastCurrencySyncAt = Date.now()
      return currency
    }
    } catch {
      return getStoredCurrency()
    } finally {
      currencySyncPromise = null
    }

    return getStoredCurrency()
  })()

  return currencySyncPromise
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD")

  useEffect(() => {
    setCurrencyState(getStoredCurrency())

    void syncCurrencyFromServer().then(setCurrencyState)

    const handleStorage = (e: StorageEvent) => {
      if (e.key === CURRENCY_STORAGE_KEY) setCurrencyState(getStoredCurrency())
    }
    const handleCurrencyChange = () => setCurrencyState(getStoredCurrency())

    window.addEventListener("storage", handleStorage)
    window.addEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange)
    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener(CURRENCY_CHANGE_EVENT, handleCurrencyChange)
    }
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
