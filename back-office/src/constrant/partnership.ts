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

export const leadStatusTone: Record<LeadStatus, StatusTone> = {
  "Proposal Sent": "warning",
  "Follow-up": "info",
  "Lead Created": "info",
  Closed: "success",
}

export const paymentStatusTone: Record<PaymentStatus, StatusTone> = {
  "Pending Transfer": "warning",
}
