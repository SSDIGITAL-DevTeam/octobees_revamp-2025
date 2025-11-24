import { useMemo } from "react"

import type { LeadStatus } from "@/constrant/partnership"
import { leadDetails } from "@/data/partnership/leads/details"

export const useLeadDetail = (slug: string) =>
  useMemo(() => leadDetails.find((lead) => lead.slug === slug), [slug])

export const leadStatusOptions: LeadStatus[] = Array.from(
  new Set(leadDetails.map((lead) => lead.status))
) as LeadStatus[]
