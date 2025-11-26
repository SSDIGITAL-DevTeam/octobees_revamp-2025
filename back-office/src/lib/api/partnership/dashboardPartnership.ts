import { axiosInstance } from "@/lib/axios"

export type DashboardMetric<T = number | string> = {
  value: T
  subtext: string
}

export type PartnerStatusApi = "approved" | "pending" | "rejected" | string

export type PartnershipStatsResponse = {
  status: string
  data: {
    totalLeads: DashboardMetric<number>
    activePartners: DashboardMetric<number>
    closedLeads: DashboardMetric<number>
    pendingCommission: DashboardMetric<string> // "IDR 0", etc
  }
}
  
export type RecentLead = {
  // sesuaikan dengan response API-mu
  id: string,
  leadName: string
  partnerName: string
  serviceType: string
  status: string // atau LeadStatus kalau mau pakai type
  remark: string
}

export type RecentLeadsResponse = {
  status: string
  data: RecentLead[]
}

  export type PendingCommission = {
  partnerName: string
  service: string
  leadName: string
  amount: string
  status: string
}

export type PendingCommissionsResponse = {
  status: string
  data: PendingCommission[]
}

export type PartnerListParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export type PartnerApiEntry = {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  status: string        // contoh dari API: "approved"
  createdAt: string
  updatedAt: string
}

export type PartnerListResponse = {
  status: string
  data: PartnerApiEntry[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// GET /v1/back-office/partner/dashboard/stats
export const getPartnerDashboardStats = () =>
  axiosInstance.get<PartnershipStatsResponse>(
    "/back-office/partner/dashboard/stats"
  )

export const getPartnerRecentLeads = () =>
  axiosInstance.get<RecentLeadsResponse>(
    "/back-office/partner/dashboard/recent-leads"
  )

export const getPartnerPendingCommissions = () =>
  axiosInstance.get<PendingCommissionsResponse>(
    "/back-office/partner/dashboard/pending-commissions"
  )

export const getPartnerList = (params: PartnerListParams = {}) =>
  axiosInstance.get<PartnerListResponse>(
    "/back-office/partner/partners", // kalau baseURL belum ada /v1 → ganti jadi "/v1/back-office/partner/partners"
    { params }
  )