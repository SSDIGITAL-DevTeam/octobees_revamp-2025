import { axiosInstance } from "@/lib/axios"

export type AffiliateListParams = Record<string, string | number | undefined | null>

export const listApplications = (params: AffiliateListParams) =>
  axiosInstance.get("/back-office/affiliate/applications", { params })

export const getApplication = (id: string) =>
  axiosInstance.get(`/back-office/affiliate/applications/${id}`)

export const reviewApplication = (
  id: string,
  data: { status: "approved" | "rejected"; notes?: string; reviewerId?: string }
) => axiosInstance.patch(`/back-office/affiliate/applications/${id}/review`, data)

export const deleteApplication = (id: string) =>
  axiosInstance.delete(`/back-office/affiliate/applications/${id}`)

export const getStats = () =>
  axiosInstance.get("/back-office/affiliate/applications/stats")

export const exportApplicationsCsv = (params: AffiliateListParams) => {
  const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "")
  const url = new URL(
    `${base}/back-office/affiliate/applications/export/csv`,
    window.location.origin
  )

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value))
    }
  })

  window.open(url.toString(), "_blank", "noopener,noreferrer")
}
