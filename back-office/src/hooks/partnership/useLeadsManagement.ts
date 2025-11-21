import { useEffect, useMemo, useState } from "react"

import type { LeadEntry, LeadStatus } from "@/constrant/partnership"
import { mockLeads } from "@/data/partnership/leads/mock"

const PAGE_SIZE = 10

export type LeadsStatusFilter = LeadStatus | "all"

const collectStatuses = (leads: LeadEntry[]): LeadsStatusFilter[] => {
  const unique = new Set<LeadStatus>()
  leads.forEach((lead) => unique.add(lead.status))
  return ["all", ...Array.from(unique)]
}

export const useLeadsManagement = () => {
  const [records, setRecords] = useState<LeadEntry[]>(mockLeads)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LeadsStatusFilter>("all")
  const [page, setPage] = useState(1)

  const statusOptions = useMemo(() => collectStatuses(records), [records])

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return records.filter((lead) => {
      const matchesKeyword =
        !keyword ||
        lead.leadName.toLowerCase().includes(keyword) ||
        lead.partnerName.toLowerCase().includes(keyword) ||
        lead.serviceType.toLowerCase().includes(keyword)
      const matchesStatus = status === "all" || lead.status === status
      return matchesKeyword && matchesStatus
    })
  }, [records, search, status])

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

  const updateLeadStatus = (leadName: string, nextStatus: LeadStatus) => {
    setRecords((prev) =>
      prev.map((lead) =>
        lead.leadName === leadName ? { ...lead, status: nextStatus, actionLabel: nextStatus } : lead
      )
    )
  }

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
    updateLeadStatus,
  }
}
