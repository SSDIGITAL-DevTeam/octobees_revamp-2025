import type { StaticImageData } from "next/image"

export type StatusTone = "default" | "success" | "warning" | "info" | "danger"

export type StatHighlight = {
  title: string
  value: string
  helper: string
  accent: string
  image: StaticImageData
}

export type LeadStatus = "Proposal Sent" | "Follow-up" | "Lead Created" | "Closed"

export type LeadEntry = {
  leadName: string
  partnerName: string
  serviceType: string
  status: LeadStatus
  remark: string
  actionLabel: string
}

export type LeadDetail = LeadEntry & {
  slug: string
  projectValue: string
  email: string
  phone: string
  partnerAllotment: string
  lastUpdate: string
}

export type PaymentStatus = "Pending Transfer"

export type CommissionPayment = {
  partnerName: string
  service: string
  leadName: string
  amount: string
  status: PaymentStatus
}

export type TopPartner = {
  name: string
  totalLeads: number
  closedLeads: number
  totalCommission: string
  performance: number
}

export type PartnerStatus = "Active" | "Non Active"

export type PartnerEntry = {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  status: PartnerStatus
}

export type PartnerDetail = PartnerEntry & {
  affiliateStatus: "Active" | "Inactive"
  stats: {
    totalCommission: string
    pendingCommission: string
    totalLeads: number
    closedLeads: number
    totalCommissionHelper?: string
    pendingHelper?: string
    totalLeadsHelper?: string
    closedHelper?: string
  }
  leads: LeadEntry[]
}

export const leadStatusTone: Record<LeadStatus, StatusTone> = {
  "Proposal Sent": "warning",
  "Follow-up": "info",
  "Lead Created": "info",
  "Closed": "success",
}

export const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  "Pending Transfer": "warning",
}

export const leadStatusStyles: Record<LeadStatus, string> = {
  "Proposal Sent": "border-transparent bg-[#D4AF37]/10 text-[#D4AF37]",
  "Follow-up": "border-transparent bg-[#8026EF]/10 text-[#8026EF]",
  "Lead Created": "border-transparent bg-[#2A399D]/10 text-[#2A399D]",
  "Closed": "border-transparent bg-[#004F33]/10 text-[#004F33]",
}

export type CommissionItem = {
  id: string
  serviceName: string
  projectValue: string
  commissionPercentage: number
  description: string
}
