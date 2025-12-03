// src/hooks/partnership/usePartnerDetail.ts
"use client"

import { useEffect, useState } from "react"
import type { LeadStatus } from "@/constrant/partnership"
import {
  getPartnerById,
  type PartnerDetailApi,
  getPartnerStatsById,
  type PartnerStatsApiResponse,
} from "@/lib/api/partnership/dashboardPartnership"

// tipe yang dipakai di PartnerDetailPage
export type PartnerDetail = {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  affiliateStatus: "Active" | "Non Active"
  stats: {
    totalCommission: string
    totalCommissionHelper: string
    pendingCommission: string
    pendingHelper: string
    totalLeads: string
    totalLeadsHelper: string
    closedLeads: string
    closedHelper: string
  }
  leads: {
    id: string
    leadName: string
    partnerName: string
    serviceType: string
    status: LeadStatus
    remark: string
    actionLabel: string
  }[]
}

type UsePartnerDetailResult = {
  partner: PartnerDetail | null
  loading: boolean
  error: string | null
}

export const usePartnerDetail = (id: string): UsePartnerDetailResult => {
  const [partner, setPartner] = useState<PartnerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchDetail = async () => {
      try {
        setLoading(true)
        setError(null)

        // panggil detail + stats paralel
        const [detailRes, statsRes] = await Promise.all([
          getPartnerById(id),
          getPartnerStatsById(id),
        ])

        const detail: PartnerDetailApi = detailRes.data.data
        const statsApi: PartnerStatsApiResponse["data"] = statsRes.data.data

        const mapped: PartnerDetail = {
          id: detail.id,
          fullName: detail.fullName,
          email: detail.email,
          phone: detail.phone,
          country: detail.country,
          affiliateStatus: detail.status === "approved" ? "Active" : "Non Active",

          stats: {
            totalCommission: statsApi.totalCommission.value, // contoh: "IDR 0"
            totalCommissionHelper:
              statsApi.totalCommission.raw > 0
                ? `Raw: ${statsApi.totalCommission.raw.toLocaleString("id-ID")}`
                : "",
            pendingCommission: statsApi.pendingCommission.value,
            pendingHelper:
              statsApi.pendingCommission.count > 0
                ? `${statsApi.pendingCommission.count} pending`
                : "",
            totalLeads: statsApi.totalLeads.value,
            totalLeadsHelper:
              statsApi.totalLeads.raw > 0
                ? `${statsApi.totalLeads.raw} total leads`
                : "",
            closedLeads: statsApi.closedLeads.value,
            closedHelper: statsApi.closedLeads.conversionRate
              ? `${statsApi.closedLeads.conversionRate} conversion`
              : "",
          },

          // sementara masih kosong / bisa diisi dari endpoint leads by partner kalau nanti ada
          leads: [],
        }

        setPartner(mapped)
      } catch (err: any) {
        console.error("Failed to fetch partner detail:", err)
        setError(err?.message || "Failed to load partner detail")
        setPartner(null)
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id])

  return { partner, loading, error }
}