import { useMemo, useState } from "react"

import type { PartnerEntry, PartnerStatus } from "@/constrant/partnership"
import { partnerEntries } from "@/data/partnership/partners/mock"

type StatusFilter = PartnerStatus | "all"

export const usePartners = () => {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")

  const statusOptions: StatusFilter[] = ["all", "Active", "Non Active"]

  const partners: PartnerEntry[] = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    return partnerEntries.filter((partner) => {
      const matchesKeyword =
        !keyword ||
        partner.fullName.toLowerCase().includes(keyword) ||
        partner.email.toLowerCase().includes(keyword) ||
        partner.phone.toLowerCase().includes(keyword) ||
        partner.country.toLowerCase().includes(keyword)
      const matchesStatus = status === "all" || partner.status === status
      return matchesKeyword && matchesStatus
    })
  }, [search, status])

  return {
    partners,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions,
  }
}
