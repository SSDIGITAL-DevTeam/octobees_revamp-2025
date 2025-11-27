"use client"

import { useEffect, useState } from "react"
import {
  getPartnerById,
  type PartnerDetailApi,
} from "@/lib/api/partnership/dashboardPartnership"
import type { LeadStatus } from "@/constrant/partnership"

// tipe yang dipakai di PartnerDetailPage
export type PartnerDetail = {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  affiliateStatus: "Active" | "Non Active"

  // sementara stats & leads masih dummy / placeholder,
  // supaya layout lama tetap bisa jalan
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

        const res = await getPartnerById(id)
        const data: PartnerDetailApi = res.data.data

        const mapped: PartnerDetail = {
          id: data.id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          affiliateStatus: data.status === "approved" ? "Active" : "Non Active",

          // TODO: nanti bisa diisi dari endpoint stats & leads khusus partner
          stats: {
            totalCommission: "IDR 0",
            totalCommissionHelper: "",
            pendingCommission: "IDR 0",
            pendingHelper: "",
            totalLeads: "0",
            totalLeadsHelper: "",
            closedLeads: "0",
            closedHelper: "",
          },
          leads: [], // sementara kosong → tabel akan kosong
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
