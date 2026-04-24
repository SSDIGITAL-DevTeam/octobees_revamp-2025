import { axiosInstance } from "@/lib/axios"
import { type AffiliateRow, type AffiliateDetail, type AffiliateStats, type PaginationMeta } from "@/constrant/affiliate"

type ListParams = {
  page?: string
  limit?: string
  sort?: string
  search?: string
  status?: string
  stage?: string
}

type ListResponse = {
  status: string
  data: AffiliateRow[]
  pagination: PaginationMeta
}

type DetailResponse = {
  status: string
  data: AffiliateDetail
}

type StatsResponse = {
  status: string
  data: AffiliateStats
}

export const listApplications = (params: ListParams) =>
  axiosInstance.get<ListResponse>("/back-office/affiliate/applications", { params })

export const getApplication = (id: string) =>
  axiosInstance.get<DetailResponse>(`/back-office/affiliate/applications/${id}`)

export const getStats = () =>
  axiosInstance.get<StatsResponse>("/back-office/affiliate/applications/stats")

export const reviewApplication = (
  id: string,
  data: { status: string; notes?: string; reviewerId?: string }
) =>
  axiosInstance.patch(`/back-office/affiliate/applications/${id}/review`, data)

export const approveApplication = (id: string) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/approve`)

export const rejectApplication = (id: string, data: { rejectionNote: string }) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/reject`, data)

export const approveInterviewApplication = (id: string, data?: { notes?: string }) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/approve-interview`, data || {})

export const processApplicationToOnboard = (id: string) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/process-to-onboard`)

export const resendApplicationEmail = (
  id: string,
  step: "interview_invitation" | "training_invitation" | "exam_invitation" | "assessment_result" | "approval" | "rejection"
) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/resend-email`, { step })

export const revertFinalDecision = (id: string) =>
  axiosInstance.post(`/back-office/affiliate/applications/${id}/revert-final-decision`)

export const deleteApplication = (id: string) =>
  axiosInstance.delete(`/back-office/affiliate/applications/${id}`)

export const updateApplication = (id: string, data: Partial<AffiliateDetail>) =>
  axiosInstance.patch(`/back-office/affiliate/applications/${id}`, data)

export const exportApplicationsCsv = (params: ListParams) => {
  const query = new URLSearchParams(params as Record<string, string>).toString()
  const url = `${process.env.NEXT_PUBLIC_API_URL}/back-office/affiliate/applications/export/csv${query ? `?${query}` : ""}`
  window.open(url, "_blank")
}
