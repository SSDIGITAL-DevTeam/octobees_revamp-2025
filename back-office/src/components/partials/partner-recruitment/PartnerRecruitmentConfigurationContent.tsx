"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Globe, Info } from "lucide-react"
import { toast } from "sonner"
import Header from "@/components/layout/header/Header"
import {
  CURRENCY_OPTIONS,
  formatWithCurrency,
  setSharedCurrency,
  syncCurrencyFromServer,
  useCurrencyStore,
  type CurrencyCode,
} from "@/app/store/currency"
import { updatePartnerCurrencyConfig } from "@/lib/api/partnership/dashboardPartnership"

export const PartnerRecruitmentConfigurationContent = () => {
  const { currency } = useCurrencyStore()
  const [selected, setSelected] = useState<CurrencyCode>(currency)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    syncCurrencyFromServer({ force: true })
      .then((nextCurrency) => {
        setSelected(nextCurrency)
      })
      .catch(() => {
        setSelected(currency)
      })
  }, [currency])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await updatePartnerCurrencyConfig(selected)
      const nextCurrency = response.data.data.currency
      setSharedCurrency(nextCurrency)
      setSelected(nextCurrency)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      toast.success(`Currency updated to ${nextCurrency}`)
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to update currency setting",
      )
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = selected !== currency

  return (
    <main className="flex w-full flex-col gap-6 pb-12">
      <Header title="Configuration" label="Partner Recruitment System" />

      {/* Currency Section */}
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Currency Setting
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Set the display currency for all monetary values across the
              Partner Recruitment System and the Partner Portal. Default is{" "}
              <strong>US Dollar ($)</strong> if not configured.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CURRENCY_OPTIONS.map((option) => {
            const isSelected = selected === option.code
            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setSelected(option.code)}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-red-600 bg-red-50/60"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {isSelected && (
                  <CheckCircle2
                    size={18}
                    className="absolute right-4 top-4 text-red-600"
                  />
                )}
                <span className="text-2xl">{option.flag}</span>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      isSelected ? "text-red-700" : "text-slate-900"
                    }`}
                  >
                    {option.label}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Symbol:{" "}
                    <span className="font-mono font-semibold">
                      {option.symbol}
                    </span>{" "}
                    &middot; Code:{" "}
                    <span className="font-mono font-semibold">
                      {option.code}
                    </span>
                  </p>
                </div>
                <p className="text-sm font-medium text-slate-700">
                  Preview:{" "}
                  <span
                    className={
                      isSelected ? "text-red-700 font-semibold" : "text-slate-900"
                    }
                  >
                    {formatWithCurrency(12500, option.code)}
                  </span>
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs text-blue-700">
          <Info size={14} className="flex-shrink-0" />
          <span>
            This setting is saved to the shared backend configuration and then
            cached in each browser. Partner Recruitment System and Partner
            Portal pages will use the same currency.
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>

          {saved && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
              <CheckCircle2 size={16} />
              Saved successfully
            </span>
          )}

          {hasChanges && !saved && (
            <span className="text-sm text-slate-400">Unsaved changes</span>
          )}
        </div>
      </section>

      {/* Active Configuration Summary */}
      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
          Active Configuration
        </h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">Currency Code</p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900">
              {currency}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">Currency Symbol</p>
            <p className="mt-1 font-mono text-base font-bold text-slate-900">
              {CURRENCY_OPTIONS.find((o) => o.code === currency)?.symbol ?? "$"}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">Sample Format</p>
            <p className="mt-1 text-base font-bold text-slate-900">
              {formatWithCurrency(1234567, currency)}
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default PartnerRecruitmentConfigurationContent
