"use client"

import { CalendarDays, ChevronDown, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type LeadDateRangeFilterProps = {
  fromDate: string
  toDate: string
  onFromDateChange: (value: string) => void
  onToDateChange: (value: string) => void
}

const formatDateLabel = (value: string) => {
  if (!value) return ""

  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const buildTriggerLabel = (fromDate: string, toDate: string) => {
  if (!fromDate && !toDate) return "Select date range"
  if (fromDate && toDate) return `${formatDateLabel(fromDate)} - ${formatDateLabel(toDate)}`
  if (fromDate) return `From ${formatDateLabel(fromDate)}`
  return `Until ${formatDateLabel(toDate)}`
}

export const LeadDateRangeFilter = ({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: LeadDateRangeFilterProps) => {
  const hasValue = Boolean(fromDate || toDate)

  const applyPreset = (preset: "this-month" | "last-30-days") => {
    const now = new Date()

    if (preset === "this-month") {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      onFromDateChange(start.toISOString().slice(0, 10))
      onToDateChange(now.toISOString().slice(0, 10))
      return
    }

    const start = new Date()
    start.setDate(now.getDate() - 29)
    onFromDateChange(start.toISOString().slice(0, 10))
    onToDateChange(now.toISOString().slice(0, 10))
  }

  const clearRange = () => {
    onFromDateChange("")
    onToDateChange("")
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">Date Range</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-14 w-full justify-between rounded-xl border-gray-400 px-4 text-left text-base font-normal shadow-sm hover:bg-white",
              !hasValue && "text-muted-foreground",
            )}
          >
            <span className="flex min-w-0 items-center gap-2 overflow-hidden">
              <CalendarDays className="h-5 w-5 shrink-0 text-slate-500" />
              <span className="truncate">{buildTriggerLabel(fromDate, toDate)}</span>
            </span>
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-[360px]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Select Date Range</h4>
              <p className="mt-1 text-xs text-slate-500">
                Filter lead list by added-on date using a custom range or quick preset.
              </p>
            </div>
            {hasValue ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={clearRange}
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-slate-200 px-4 text-sm"
              onClick={() => applyPreset("this-month")}
            >
              This Month
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-10 rounded-full border-slate-200 px-4 text-sm"
              onClick={() => applyPreset("last-30-days")}
            >
              Last 30 Days
            </Button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="h-12 rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                To Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
                className="h-12 rounded-xl border-slate-200"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default LeadDateRangeFilter
