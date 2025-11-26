"use client"

import { useEffect, useMemo, useState } from "react"

import {
  getPartnerRecentLeads,
  type RecentLead,
} from "@/lib/api/partnership/dashboardPartnership"
import { type LeadStatus } from "@/constrant/partnership"

// 1. Tipe row yg dipakai di LeadsTable
export type LeadRow = {
  id: string
  leadName: string
  partnerName: string
  serviceType: string
  status: LeadStatus
  remark: string
  actionLabel: LeadStatus // dipakai di dropdown & badge
}

const PAGE_SIZE = 10

// sesuaikan kalau kamu punya enum/constant lain
const STATUS_OPTIONS: LeadStatus[] = [
  "Proposal Sent",
  "Follow-up",
  "Lead Created",
  "Closed",
]

// 2. Hook utama
export function useLeadsManagement() {
  const [allLeads, setAllLeads] = useState<LeadRow[]>([])
  const [loading, setLoading] = useState(false)

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LeadStatus | "All">("All")
  const [page, setPage] = useState(1)

  // --- fetch data dari endpoint yg sama dengan RecentLeadsPanel ---
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await getPartnerRecentLeads()
        const apiData = res.data.data // RecentLead[]

        const mapped: LeadRow[] = apiData.map((item: RecentLead) => ({
          id: item.id,
          leadName: item.leadName,
          partnerName: item.partnerName,
          serviceType: item.serviceType,
          status: item.status as LeadStatus,
          remark: item.remark,
          actionLabel: item.status as LeadStatus,
        }))

        setAllLeads(mapped)
      } catch (err) {
        console.error("Failed to fetch leads:", err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // --- filter by search + status ---
  const filteredLeads = useMemo(
    () =>
      allLeads.filter((lead) => {
        const q = search.toLowerCase()

        const matchSearch =
          !q ||
          lead.leadName.toLowerCase().includes(q) ||
          lead.partnerName.toLowerCase().includes(q) ||
          lead.serviceType.toLowerCase().includes(q)

        const matchStatus = status === "All" || lead.status === status

        return matchSearch && matchStatus
      }),
    [allLeads, search, status]
  )

  // --- pagination ---
  const totalData = filteredLeads.length
  const totalPages = totalData ? Math.ceil(totalData / PAGE_SIZE) : 1

  const paginatedLeads = useMemo(
    () =>
      filteredLeads.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      ),
    [filteredLeads, page]
  )

  // --- update status, pakai id agar aman walau nama sama ---
  const updateLeadStatus = (id: string, nextStatus: LeadStatus) => {
    setAllLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, status: nextStatus, actionLabel: nextStatus }
          : lead
      )
    )
  }

  return {
    loading,
    leads: paginatedLeads,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions: STATUS_OPTIONS,
    page,
    setPage,
    totalPages,
    totalData,
    pageSize: PAGE_SIZE,
    updateLeadStatus,
  }
}
