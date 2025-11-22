import { useMemo, useState } from "react"

import type { CommissionItem } from "@/constrant/partnership"
import { commissionItems } from "@/data/partnership/commission/mock"

type UpsertPayload = Omit<CommissionItem, "id">

const normalizeId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export const useCommissionControl = () => {
  const [records, setRecords] = useState<CommissionItem[]>(commissionItems)
  const [search, setSearch] = useState("")

  const items: CommissionItem[] = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return records
    return records.filter(
      (item) =>
        item.serviceName.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.projectValue.toLowerCase().includes(keyword)
    )
  }, [records, search])

  const addItem = (payload: UpsertPayload) => {
    const id = `${normalizeId(payload.serviceName)}-${Date.now()}`
    setRecords((prev) => [{ id, ...payload }, ...prev])
  }

  const updateItem = (id: string, payload: UpsertPayload) => {
    setRecords((prev) => prev.map((item) => (item.id === id ? { ...item, ...payload } : item)))
  }

  return {
    search,
    setSearch,
    items,
    addItem,
    updateItem,
  }
}
