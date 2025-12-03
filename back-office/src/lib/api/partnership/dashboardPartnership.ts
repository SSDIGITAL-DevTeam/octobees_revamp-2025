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

  export type PartnerLeadsParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
}

export type PartnerLeadApiItem = {
  id: string
  name: string
  partnerName: string
  serviceName: string
  status: string
  remark: string
}

export type PartnerLeadsResponse = {
  status: string
  data: PartnerLeadApiItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UpdatePartnerLeadPayload = {
  status?: string
  remark?: string
  projectValue?: number
}

export type PartnerServiceParams = {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export type PartnerServiceApiItem = {
  id: string
  name: string
  projectValue: number
  commissionPercentage: number
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type CreatePartnerServicePayload = {
  name: string
  projectValue: number
  commissionPercentage: number
  description: string
  isActive: boolean
}

export type PartnerServicesResponse = {
  status: string
  data: PartnerServiceApiItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UpdateServicePayload = {
  name: string
  commissionPercentage: number
  description: string
  isActive: boolean
  projectValue: number
}

  export type PartnerLeadDetailApi = {
  id: string
  name: string
  email: string
  phone: string
  serviceId: string
  serviceName: string
  projectValue: number
  status: string
  remark: string
  createdAt: string
  updatedAt: string
  affiliateId: string
  partnerName: string
  partnerEmail: string
  partnerCountry: string
}

export type PartnerLeadDetailResponse = {
  status: string
  data: PartnerLeadDetailApi
}

export type PartnerDetailApi = {
  id: string
  fullName: string
  email: string
  countryCode: string
  phone: string
  phoneE164: string
  country: string
  govBusinessId: string | null
  strategy: string | null
  portfolioLinks: string | null
  motivation: string | null
  otherPrograms: string | null
  status: string
  createdAt: string
  updatedAt: string
}

export type PartnerDetailResponse = {
  status: string
  data: PartnerDetailApi
}

export type PartnerStatsApiData = {
  totalCommission: {
    value: string // "IDR 0"
    raw: number
  }
  pendingCommission: {
    value: string // "IDR 0"
    raw: number
    count: number
  }
  totalLeads: {
    value: string // "1"
    raw: number
  }
  closedLeads: {
    value: string // "0"
    raw: number
    conversionRate: string // "0%"
  }
}

export type PartnerStatsApiResponse = {
  status: string
  data: PartnerStatsApiData
}

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

export const getPartnerLeads = (params: PartnerLeadsParams) =>
  axiosInstance.get<PartnerLeadsResponse>("/back-office/partner/leads", {
    params,
  }
)

export const getPartnerServices = (params: PartnerServiceParams = {}) =>
  axiosInstance.get<PartnerServicesResponse>(
    "/back-office/partner/services",
    { params }
  )

export const createPartnerService = (payload: CreatePartnerServicePayload) =>
  axiosInstance.post("/back-office/partner/services", payload)

export const updatePartnerService = (id: string, payload: UpdateServicePayload) =>
  axiosInstance.patch<{ status: string; data: PartnerServiceApiItem }>(
    `/back-office/partner/services/${id}`,
    payload
  )

export const deletePartnerService = (id: string) =>
  axiosInstance.delete<{ status: string }>(
    `/back-office/partner/services/${id}`
  )

export const getPartnerLeadDetail = (id: string) =>
  axiosInstance.get<PartnerLeadDetailResponse>(
    `/back-office/partner/leads/${id}`
  )

export const getPartnerById = (id: string) =>
  axiosInstance.get<PartnerDetailResponse>(
    `/back-office/partner/partners/${id}`
  )

export const getPartnerStatsById = (id: string) =>
  axiosInstance.get<PartnerStatsApiResponse>(
    `/back-office/partner/partners/${id}/stats`
  )

export const updatePartnerLead = (id: string, payload: UpdatePartnerLeadPayload) =>
  axiosInstance.patch(`/back-office/partner/leads/${id}`, payload)

export const getPartnerLeadsByPartnerId = (
  partnerId: string,
  params: PartnerLeadsParams = {}
) =>
  axiosInstance.get<PartnerLeadsResponse>(
    `/back-office/partner/partners/${partnerId}/leads`,
    { params }
  )