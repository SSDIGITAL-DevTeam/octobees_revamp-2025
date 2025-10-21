"use client"

import { ChangeEvent } from "react"
import { Search, FileDown, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterValue = {
  search: string
  status: "" | "pending" | "approved" | "rejected"
  country: string
  from: string
  to: string
  sort: "newest" | "oldest"
  limit: string
}

type AffiliateFiltersProps = {
  values: FilterValue
  countries: string[]
  onChange: <K extends keyof FilterValue>(key: K, value: FilterValue[K]) => void
  onExport: () => void
  onReset?: () => void
}

const AffiliateFilters = ({ values, countries, onChange, onExport, onReset }: AffiliateFiltersProps) => {
  const handleInput =
    (key: keyof FilterValue) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(key, event.target.value)
    }

  return (
    <form
      className="flex w-full flex-col gap-6 rounded-xl border border-border bg-slate-50/60 p-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-2 xl:col-span-1">
          <Label htmlFor="affiliate-search" className="text-sm font-medium text-slate-700">
            Search (name or email)
          </Label>
          <div className="relative mt-2">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              id="affiliate-search"
              value={values.search}
              onChange={handleInput("search")}
              placeholder="Type to search..."
              className="h-12 rounded-2xl border-gray-300 pl-11"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700">Status</Label>
          <Select
            value={values.status || "all"}
            onValueChange={(value) =>
              onChange("status", value === "all" ? "" : (value as FilterValue["status"]))
            }
          >
            <SelectTrigger className="mt-2 h-12 rounded-2xl border-gray-300">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-slate-700">Country</Label>
          <Select
            value={values.country || "all"}
            onValueChange={(value) => onChange("country", value === "all" ? "" : value)}
          >
            <SelectTrigger className="mt-2 h-12 rounded-2xl border-gray-300">
              <SelectValue placeholder="All countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="affiliate-from" className="text-sm font-medium text-slate-700">
            From
          </Label>
          <Input
            id="affiliate-from"
            type="date"
            value={values.from}
            onChange={handleInput("from")}
            className="mt-2 h-12 rounded-2xl border-gray-300"
          />
        </div>
        <div>
          <Label htmlFor="affiliate-to" className="text-sm font-medium text-slate-700">
            To
          </Label>
          <Input
            id="affiliate-to"
            type="date"
            value={values.to}
            onChange={handleInput("to")}
            className="mt-2 h-12 rounded-2xl border-gray-300"
          />
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Sort by</Label>
          <Select value={values.sort} onValueChange={(value) => onChange("sort", value as FilterValue["sort"])}>
            <SelectTrigger className="mt-2 h-12 rounded-2xl border-gray-300">
              <SelectValue placeholder="Newest" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm font-medium text-slate-700">Page size</Label>
          <Select value={values.limit} onValueChange={(value) => onChange("limit", value)}>
            <SelectTrigger className="mt-2 h-12 rounded-2xl border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-slate-500">
          Filters stay in the address bar so you can share the exact view with teammates.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {onReset && (
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl border-gray-300 px-5 text-sm text-slate-700"
              onClick={onReset}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-2xl border-gray-300 px-5 text-sm text-slate-700"
            onClick={onExport}
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>
    </form>
  )
}

export type { FilterValue }
export default AffiliateFilters
