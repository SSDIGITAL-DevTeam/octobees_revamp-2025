import { useEffect, useMemo, useState } from "react"

import type { LeadEntry, LeadStatus } from "@/constrant/partnership"
import { mockLeads } from "@/data/partnership/leads/mock"

const PAGE_SIZE = 10

type StatusFilter = LeadStatus | "all"

const collectStatuses = (leads: LeadEntry[]): StatusFilter[] => {
  const unique = new Set<LeadStatus>()
  leads.forEach((lead) => unique.add(lead.status))
  return ["all", ...Array.from(unique)]
}

export const useLeadsManagement = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [page, setPage] = useState(1)

  const statusOptions = useMemo(() => collectStatuses(mockLeads), [])

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return mockLeads.filter((lead) => {
      const matchesKeyword =
        !keyword ||
        lead.leadName.toLowerCase().includes(keyword) ||
        lead.partnerName.toLowerCase().includes(keyword) ||
        lead.serviceType.toLowerCase().includes(keyword)
      const matchesStatus = status === "all" || lead.status === status
      return matchesKeyword && matchesStatus
    })
  }, [search, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const leads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  return {
    leads,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions,
    page,
    setPage,
    totalPages,
    totalData: filtered.length,
    pageSize: PAGE_SIZE,
  }
}
