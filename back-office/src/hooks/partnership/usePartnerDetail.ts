"use client"

import { useEffect, useState } from "react"
import {
  getPartnerById,
  getPartnerStatsById,
  getPartnerLeadsByPartnerId,
  PartnerLeadApiItem,
  PartnerStatsApiData,
  PartnerDetailApi,
} from "@/lib/api/partnership/dashboardPartnership" // sesuaikan path service-mu

type PartnerStatsUI = {
  totalCommission: string
  totalCommissionHelper: string
  pendingCommission: string
  pendingHelper: string
  totalLeads: string
  totalLeadsHelper: string
  closedLeads: string
  closedHelper: string
}

export type PartnerDetailUI = {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  affiliateStatus: string
  stats: PartnerStatsUI
  leads: PartnerLeadApiItem[]
}

type UsePartnerDetailState = {
  partner: PartnerDetailUI | null
  loading: boolean
  error: string | null
}

const mapAffiliateStatus = (apiStatus: string): string => {
  switch (apiStatus) {
    case "approved":
      return "Active"
    case "pending":
      return "Pending"
    case "rejected":
      return "Inactive"
    default:
      return apiStatus
  }
}

const mapStatsToUI = (stats: PartnerStatsApiData): PartnerStatsUI => {
  return {
    totalCommission: stats.totalCommission.value,
    totalCommissionHelper: `Total commission: ${stats.totalCommission.raw.toLocaleString(
      "id-ID"
    )}`,

    pendingCommission: stats.pendingCommission.value,
    pendingHelper: `${stats.pendingCommission.count} commission on hold`,

    totalLeads: stats.totalLeads.value,
    totalLeadsHelper: `${stats.totalLeads.raw} total leads`,

    closedLeads: stats.closedLeads.value,
    closedHelper: `Conversion rate ${stats.closedLeads.conversionRate}`,
  }
}

export const usePartnerDetail = (id: string): UsePartnerDetailState => {
  const [state, setState] = useState<UsePartnerDetailState>({
    partner: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const fetchAll = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }))

        const [detailRes, statsRes, leadsRes] = await Promise.all([
          getPartnerById(id),
          getPartnerStatsById(id),
          getPartnerLeadsByPartnerId(id, {
            page: 1,
            limit: 50, // bebas, nanti kalau perlu pagination bisa diubah
          }),
        ])

        if (cancelled) return

        const detail: PartnerDetailApi = detailRes.data.data
        const stats: PartnerStatsApiData = statsRes.data.data
        const leads: PartnerLeadApiItem[] = leadsRes.data.data

        const partner: PartnerDetailUI = {
          id: detail.id,
          fullName: detail.fullName,
          email: detail.email,
          phone: detail.phone,
          country: detail.country,
          affiliateStatus: mapAffiliateStatus(detail.status),
          stats: mapStatsToUI(stats),
          leads,
        }

        setState({
          partner,
          loading: false,
          error: null,
        })
      } catch (err: any) {
        if (cancelled) return
        const message =
          err?.response?.data?.message ??
          err?.message ??
          "Gagal memuat detail partner"

        setState({
          partner: null,
          loading: false,
          error: message,
        })
      }
    }

    fetchAll()

    return () => {
      cancelled = true
    }
  }, [id])

  return state
}
