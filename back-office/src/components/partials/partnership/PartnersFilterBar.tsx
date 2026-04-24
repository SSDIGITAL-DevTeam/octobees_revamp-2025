"use client"

import type { ReactNode } from "react"
import { Filter, Search } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type PartnersFilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  status?: string
  onStatusChange?: (value: string) => void
  statusOptions?: string[]
  action?: ReactNode
}

export const PartnersFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  action,
}: PartnersFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Search partner..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      {status && onStatusChange && statusOptions.length > 0 ? (
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 w-[160px] rounded-full border-slate-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option === "all" ? "All Status" : option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  )
}
