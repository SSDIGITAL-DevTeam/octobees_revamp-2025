// @/hooks/partnership/useLeadsManagement.ts
"use client"

import { useEffect, useState } from "react"
import type { LeadStatus } from "@/constrant/partnership"
import {
  getPartnerLeads,
  type PartnerLeadApiItem,
} from "@/lib/api/partnership/dashboardPartnership"

// filter status yg dipakai di filter bar & hook
export type LeadsStatusFilter = LeadStatus | "all"

// struktur row yang dikirim ke <LeadsTable />
export type LeadRow = {
  id: string
  leadName: string
  partnerName: string
  serviceType: string
  status: LeadStatus
  remark: string
  actionLabel: LeadStatus
}

export const useLeadsManagement = () => {
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<LeadsStatusFilter>("all")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalData, setTotalData] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // opsi status untuk filter bar
  const statusOptions: LeadsStatusFilter[] = [
    "all",
    "Proposal Sent",
    "Follow-up",
    "Lead Created",
    "Closed",
  ]

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)

      const params: Record<string, any> = {
        page,
        limit: pageSize,
      }

      if (search) params.search = search
      if (status !== "all") params.status = status

      const res = await getPartnerLeads(params)
      const { data, pagination } = res.data

      const mapped: LeadRow[] = data.map((item: PartnerLeadApiItem) => ({
        id: item.id,
        leadName: item.leadName,
        partnerName: item.partnerName,
        serviceType: item.serviceType,
        status: item.status as LeadStatus,
        remark: item.remark,
        actionLabel: item.status as LeadStatus, // dipakai di dropdown & badge
      }))

      setLeads(mapped)

      if (pagination) {
        setTotalPages(pagination.totalPages ?? 1)
        setTotalData(pagination.total ?? mapped.length)
      } else {
        setTotalPages(1)
        setTotalData(mapped.length)
      }
    } catch (err: any) {
      console.error("Failed to fetch leads:", err)
      setError(err?.message || "Failed to load leads")
      setLeads([])
      setTotalPages(1)
      setTotalData(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search, status])

  // kalau user ubah status lewat dropdown di tabel
  const updateLeadStatus = (id: string, nextStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? { ...lead, status: nextStatus, actionLabel: nextStatus }
          : lead
      )
    )
    // NOTE: kalau nanti ada endpoint update status di backend,
    // di sini tempat panggilnya.
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
    totalData,
    pageSize,
    updateLeadStatus,
    loading,
    error,
  }
}
