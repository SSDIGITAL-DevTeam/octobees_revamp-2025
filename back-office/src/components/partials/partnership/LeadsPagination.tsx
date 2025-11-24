"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type LeadsPaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

const buildPages = (page: number, total: number): Array<number | "..."> => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const pages: Array<number | "..."> = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(total - 1, page + 1)

  if (start > 2) pages.push("...")

  for (let current = start; current <= end; current += 1) {
    pages.push(current)
  }

  if (end < total - 1) pages.push("...")
  pages.push(total)
  return pages
}

export const LeadsPagination = ({ page, totalPages, onChange }: LeadsPaginationProps) => {
  const goTo = (next: number) => {
    if (next < 1 || next > totalPages || next === page) return
    onChange(next)
  }

  const items = buildPages(page, totalPages)

  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full border border-slate-200"
        disabled={page === 1}
        onClick={() => goTo(1)}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full border border-slate-200"
        disabled={page === 1}
        onClick={() => goTo(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {items.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className="px-3 text-sm text-slate-400">
            ...
          </span>
        ) : (
          <Button
            key={item}
            variant="ghost"
            className={cn(
              "h-9 rounded-full px-4 text-sm font-semibold",
              page === item ? "bg-red-600 text-white hover:bg-red-600" : "text-slate-600"
            )}
            onClick={() => goTo(item)}
          >
            {item}
          </Button>
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full border border-slate-200"
        disabled={page === totalPages}
        onClick={() => goTo(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full border border-slate-200"
        disabled={page === totalPages}
        onClick={() => goTo(totalPages)}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
