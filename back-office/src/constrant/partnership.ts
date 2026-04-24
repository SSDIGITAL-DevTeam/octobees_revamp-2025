import type { StaticImageData } from "next/image"

export type StatusTone = "default" | "success" | "warning" | "info" | "danger"

export type StatHighlight = {
  title: string
  value: string
  helper: string
  accent: string
  image: StaticImageData
}

export type LeadStatus =
  | "New Leads"
  | "Contacted"
  | "Follow-up Day-1"
  | "Follow-up Day-3"
  | "Follow-up Day-7"
  | "Follow-up Day-14"
  | "Closed Won"
  | "Closed Lost"

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
  "New Leads": "info",
  "Contacted": "warning",
  "Follow-up Day-1": "danger",
  "Follow-up Day-3": "danger",
  "Follow-up Day-7": "danger",
  "Follow-up Day-14": "danger",
  "Closed Won": "success",
  "Closed Lost": "danger",
}

export const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  "Pending Transfer": "warning",
}

export const leadStatusStyles: Record<LeadStatus, string> = {
  "New Leads": "border-transparent bg-[#2A399D]/10 text-[#2A399D]",
  "Contacted": "border-transparent bg-[#D4AF37]/10 text-[#D4AF37]",
  "Follow-up Day-1": "border-transparent bg-[#8026EF]/10 text-[#8026EF]",
  "Follow-up Day-3": "border-transparent bg-[#7C3AED]/10 text-[#7C3AED]",
  "Follow-up Day-7": "border-transparent bg-[#6D28D9]/10 text-[#6D28D9]",
  "Follow-up Day-14": "border-transparent bg-[#5B21B6]/10 text-[#5B21B6]",
  "Closed Won": "border-transparent bg-[#004F33]/10 text-[#004F33]",
  "Closed Lost": "border-transparent bg-[#DC2626]/10 text-[#DC2626]",
}

export type CommissionItem = {
  id: string
  serviceName: string
  projectValue: string
  commissionPercentage: number
  description: string
}
