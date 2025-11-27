// @/hooks/partnership/useLeadDetail.ts
"use client"

import { useEffect, useState } from "react"
import type { LeadStatus } from "@/constrant/partnership"
import {
  getPartnerLeadDetail,
  type PartnerLeadDetailApi,
} from "@/lib/api/partnership/dashboardPartnership"

// opsi status yang dipakai di dropdown
export const leadStatusOptions: LeadStatus[] = [
  "Proposal Sent",
  "Follow-up",
  "Lead Created",
  "Closed",
]

// shape data yang dipakai di page detail
export type LeadDetail = {
  id: string
  leadName: string
  email: string
  phone: string
  serviceType: string
  projectValue: string // sudah diformat IDR
  status: LeadStatus
  remark: string
  lastUpdate: string
  partnerAllotment: string
  partnerName: string
}

const formatIdr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0)

export const useLeadDetail = (id: string) => {
  const [lead, setLead] = useState<LeadDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await getPartnerLeadDetail(id)
        const api: PartnerLeadDetailApi = res.data.data

        const mapped: LeadDetail = {
          id: api.id,
          leadName: api.name,
          email: api.email,
          phone: api.phone,
          serviceType: api.serviceName,
          projectValue: formatIdr(api.projectValue),
          status: api.status as LeadStatus,
          remark: api.remark,
          lastUpdate: api.updatedAt,
          partnerAllotment: api.partnerCountry,
          partnerName: api.partnerName,
        }

        setLead(mapped)
      } catch (err: any) {
        console.error("Failed to fetch lead detail:", err)
        setError(err?.message || "Failed to load lead detail")
        setLead(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  return { lead, loading, error }
}
