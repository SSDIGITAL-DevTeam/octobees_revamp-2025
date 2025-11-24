import type { LeadDetail } from "@/constrant/partnership"
import { mockLeads } from "./mock"
import { slugify } from "@/utils/slugify"

const customDetails: Partial<Record<string, Partial<LeadDetail>>> = {
  "pt-tech-solutions": {
    projectValue: "IDR 45,000,000",
    partnerAllotment: "IDR 5,000,000",
    phone: "+62 3234-2345-232",
    email: "john@gmail.com",
    lastUpdate: "Oct 15, 2025",
  },
}

export const leadDetails: LeadDetail[] = mockLeads.map((lead, index) => {
  const slug = slugify(lead.leadName)
  const custom = customDetails[slug] ?? {}

  return {
    ...lead,
    slug,
    projectValue: custom.projectValue ?? "IDR 5,000,000",
    partnerAllotment: custom.partnerAllotment ?? "IDR 1,500,000",
    phone: custom.phone ?? "+62 812-0000-0000",
    email: custom.email ?? `${slug}@mail.com`,
    lastUpdate: custom.lastUpdate ?? "Oct 15, 2025",
    actionLabel: lead.actionLabel,
  }
})
