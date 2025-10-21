export type AffiliateRow = {
  id: string
  full_name: string
  email: string
  phone: string | null
  country: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type AffiliateDetail = {
  id: string
  fullName: string
  email: string
  phone: string | null
  country: string
  govOrBusinessId: string | null
  strategy: string
  portfolioLinks: string | null
  motivation: string | null
  otherPrograms: string | null
  status: "pending" | "approved" | "rejected"
  notes?: string | null
  reviewedAt?: string | null
  reviewerId?: string | null
  reviewerName?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: string
  updatedAt: string
}

export type AffiliateStats = {
  total: number
  pending: number
  approved: number
  rejected: number
}

export type PaginationMeta = {
  currentPage: number
  perPage: number
  total: number
  totalPages: number
}
