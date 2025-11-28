// @/hooks/partnership/useCommissionControl.ts
"use client"

import { useEffect, useMemo, useState } from "react"
import { formatIDR } from "../../utils/formatCurrency"
import type { CommissionItem } from "@/constrant/partnership"
import {
  getPartnerServices,
  createPartnerService,
  updatePartnerService,
  deletePartnerService,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership"

// payload yang dipakai saat create / update dari FE
export type UpsertPayload = {
  serviceName: string
  projectValue: number
  commissionPercentage: number
  description: string
}

// konversi api item -> CommissionItem (dipakai di table & modal)
const mapServiceToCommissionItem = (item: PartnerServiceApiItem): CommissionItem => ({
  id: item.id,
  serviceName: item.name,
  projectValue: item.projectValue ?? 0,
  commissionPercentage: item.commissionPercentage,
  description: item.description,
})

export const useCommissionControl = () => {
  const [records, setRecords] = useState<CommissionItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ====== FETCH LIST SERVICES ======
  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await getPartnerServices({ page: 1, limit: 100 })
      const { data } = res.data

      const mapped: CommissionItem[] = data.map(mapServiceToCommissionItem)
      setRecords(mapped)
    } catch (err: any) {
      console.error("Failed to fetch services:", err)
      setError(err?.message || "Failed to load services")
      setRecords([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // ====== FILTER CLIENT-SIDE ======
  const items: CommissionItem[] = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return records

    return records.filter((item) => {
      const pv = String(item.projectValue).toLowerCase()
      return (
        item.serviceName.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        pv.includes(keyword)
      )
    })
  }, [records, search])

  // ====== CREATE / UPDATE / DELETE ======

  const addItem = async (payload: UpsertPayload) => {
    const res = await createPartnerService({
      name: payload.serviceName,
      commissionPercentage: payload.commissionPercentage,
      description: payload.description,
      isActive: true,
      projectValue: payload.projectValue,
    })

    const created = mapServiceToCommissionItem(res.data.data)
    // boleh push ke depan biar kelihatan di atas
    setRecords((prev) => [created, ...prev])
  }

  const updateItem = async (id: string, payload: UpsertPayload) => {
    const res = await updatePartnerService(id, {
      name: payload.serviceName,
      commissionPercentage: payload.commissionPercentage,
      description: payload.description,
      isActive: true,
      projectValue: payload.projectValue,
    })

    const updated = mapServiceToCommissionItem(res.data.data)

    setRecords((prev) => prev.map((item) => (item.id === id ? updated : item)))
  }

  const deleteItem = async (id: string) => {
    await deletePartnerService(id)
    setRecords((prev) => prev.filter((item) => item.id !== id))
  }

  return {
    search,
    setSearch,
    items,
    addItem,
    updateItem,
    deleteItem,
    loading,
    error,
    refetch: fetchServices,
  }
}
