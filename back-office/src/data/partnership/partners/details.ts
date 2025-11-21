import type { PartnerDetail } from "@/constrant/partnership"
import { partnerEntries } from "./mock"
import { mockLeads } from "../leads/mock"

const defaultStats = {
  totalCommission: "IDR 42.5M",
  totalCommissionHelper: "+12% from last month",
  pendingCommission: "IDR 3.5M",
  pendingHelper: "1 pending",
  totalLeads: 24,
  totalLeadsHelper: "+3 this month",
  closedLeads: 8,
  closedHelper: "32% conversion",
}

export const partnerDetails: PartnerDetail[] = partnerEntries.map((partner) => ({
  ...partner,
  affiliateStatus: partner.status === "Active" ? "Active" : "Inactive",
  stats: { ...defaultStats },
  leads: mockLeads.slice(0, 5).map((lead) => ({
    ...lead,
    partnerName: partner.fullName,
  })),
}))
