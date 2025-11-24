"use client"

import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PartnersFilterBarProps = {
  search: string
  onSearchChange: (value: string) => void
  status: string
  onStatusChange: (value: string) => void
  statusOptions: string[]
}

export const PartnersFilterBar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions,
}: PartnersFilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search affiliator"
          className="w-full rounded-full border border-slate-200 bg-white py-6 pl-12 pr-6 text-base"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full rounded-full border-slate-200 bg-white py-6 pl-5 pr-10 text-base md:w-52">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="rounded-2xl">
          {statusOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {option === "all" ? "All Status" : option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
