import {
  getPartnerLeads,
  getPartnerList,
  getPartnerServices,
  type PartnerApiEntry,
  type PartnerLeadApiItem,
  type PartnerLeadsParams,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership"

const PAGE_LIMIT = 100
const SALES_ELIGIBLE_STATUS = "Won"

export const PARTNER_PAYMENT_STATUS = "Unpaid" as const

export type PartnerPaymentStatus = typeof PARTNER_PAYMENT_STATUS
export type PartnerLeadSortValue = "newest" | "oldest" | "status-asc" | "status-desc"

export const PARTNER_LEAD_STATUS_OPTIONS = [
  "all",
  "New Leads",
  "Contacted",
  SALES_ELIGIBLE_STATUS,
  "Lost",
] as const

export const normalizePartnerLeadStatus = (status?: string | null) => {
  if (!status) return "New Leads"
  if (status === "Lead Created") return "New Leads"
  if (status === "Proposal Sent") return "Contacted"
  if (status === "Follow-up") return "Follow-up Day-1"
  if (status === "Closed Won") return SALES_ELIGIBLE_STATUS
  if (status === "Closed Lost") return "Lost"
  return status
}

export const PARTNER_LEAD_SORT_OPTIONS: {
  label: string
  value: PartnerLeadSortValue
}[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Status A-Z", value: "status-asc" },
  { label: "Status Z-A", value: "status-desc" },
]

const normalizeServiceKey = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase()

const getLeadSalesDate = (lead: PartnerLeadApiItem) =>
  lead.lastStatusChangedAt || lead.updatedAt || lead.createdAt

const isValidDate = (value?: string | null) => {
  if (!value) return false
  return !Number.isNaN(new Date(value).getTime())
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0))

export const formatDate = (value?: string | null) => {
  if (!isValidDate(value)) return "-"
  return new Date(value as string).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export const getAllApprovedPartners = async () => {
  let page = 1
  let totalPages = 1
  const items: PartnerApiEntry[] = []

  while (page <= totalPages) {
    const response = await getPartnerList({
      page,
      limit: PAGE_LIMIT,
      status: "approved",
    })

    items.push(...(response.data.data || []))
    totalPages = Math.max(response.data.pagination?.totalPages || 1, 1)
    page += 1
  }

  return items
}

export const getAllPartnerLeads = async (affiliateId?: string) => {
  let page = 1
  let totalPages = 1
  const items: PartnerLeadApiItem[] = []

  while (page <= totalPages) {
    const params: PartnerLeadsParams = {
      page,
      limit: PAGE_LIMIT,
      affiliateId,
    }

    const response = await getPartnerLeads(params)
    items.push(...(response.data.data || []))
    totalPages = Math.max(response.data.pagination?.totalPages || 1, 1)
    page += 1
  }

  return items
}

export const getAllPartnerServices = async () => {
  const response = await getPartnerServices({
    page: 1,
    limit: PAGE_LIMIT,
  })

  return response.data.data || []
}

export const isDateWithinRange = (
  value?: string | null,
  fromDate?: string,
  toDate?: string,
) => {
  if (!isValidDate(value)) return false

  const target = new Date(value as string)
  const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null
  const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null

  if (from && target < from) return false
  if (to && target > to) return false
  return true
}

const isInCurrentMonth = (value?: string | null, referenceDate = new Date()) => {
  if (!isValidDate(value)) return false

  const date = new Date(value as string)
  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth()
  )
}

export const getLeadCommissionAmount = (
  lead: PartnerLeadApiItem,
  services: PartnerServiceApiItem[],
) => {
  const matchedService = services.find(
    (service) => normalizeServiceKey(service.name) === normalizeServiceKey(lead.serviceName),
  )

  if (!matchedService) return 0

  const commissionMode = matchedService.commissionMode || "percentage"
  const commissionValue =
    Number(
      matchedService.commissionValue ?? matchedService.commissionPercentage ?? 0,
    ) || 0

  if (commissionMode === "fixed") {
    return commissionValue
  }

  return Number(lead.projectValue || 0) * (commissionValue / 100)
}

export const calculatePartnerMonthlyMetrics = (
  affiliateId: string,
  leads: PartnerLeadApiItem[],
  services: PartnerServiceApiItem[],
  referenceDate = new Date(),
) => {
  const monthlyClosedWonLeads = leads.filter(
    (lead) =>
      lead.affiliateId === affiliateId &&
      lead.status === SALES_ELIGIBLE_STATUS &&
      isInCurrentMonth(getLeadSalesDate(lead), referenceDate),
  )

  const salesThisMonth = monthlyClosedWonLeads.reduce(
    (total, lead) => total + Number(lead.projectValue || 0),
    0,
  )

  const commissionThisMonth = monthlyClosedWonLeads.reduce(
    (total, lead) => total + getLeadCommissionAmount(lead, services),
    0,
  )

  return {
    salesThisMonth,
    commissionThisMonth,
    paymentStatus: PARTNER_PAYMENT_STATUS,
    monthlyClosedWonLeads,
  }
}
