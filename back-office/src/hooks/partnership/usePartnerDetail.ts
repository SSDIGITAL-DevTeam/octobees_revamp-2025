import { useMemo } from "react"

import { partnerDetails } from "@/data/partnership/partners/details"

export const usePartnerDetail = (id: string) =>
  useMemo(() => partnerDetails.find((partner) => partner.id === id), [id])
