import { useMemo, useState } from "react"

import type { CommissionItem } from "@/constrant/partnership"
import { commissionItems } from "@/data/partnership/commission/mock"

export const useCommissionControl = () => {
  const [search, setSearch] = useState("")

  const filtered: CommissionItem[] = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return commissionItems
    return commissionItems.filter(
      (item) =>
        item.serviceName.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.projectValue.toLowerCase().includes(keyword)
    )
  }, [search])

  return {
    search,
    setSearch,
    items: filtered,
  }
}
