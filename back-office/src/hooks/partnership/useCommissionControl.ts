// src/hooks/partnership/useCommissionControl.ts
"use client"

import { useEffect, useMemo, useState } from "react"

import type { CommissionItem } from "@/constrant/partnership"
import {
  getPartnerServices,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership"

type UpsertPayload = Omit<CommissionItem, "id">

const normalizeId = (label: string) =>
  label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

export const useCommissionControl = () => {
  const [records, setRecords] = useState<CommissionItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // initial load dari API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        // kalau mau bisa kasih params (page, limit, search, dll)
        const res = await getPartnerServices({ page: 1, limit: 100 })
        const { data } = res.data

        const mapped: CommissionItem[] = data.map(
          (item: PartnerServiceApiItem): CommissionItem => ({
            id: item.id,
            serviceName: item.name,
            // API belum punya projectValue → sementara kosong / bisa ganti misal "N/A"
            projectValue: "",
            commissionPercentage: item.commissionPercentage,
            description: item.description,
          })
        )

        setRecords(mapped)
      } catch (err: any) {
        console.error("Failed to fetch partner services:", err)
        setError(err?.message || "Failed to load services")
        setRecords([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // filter berdasarkan search (nama service / description / project value)
  const items: CommissionItem[] = useMemo(() => {
    const keyword = search.toLowerCase().trim()
    if (!keyword) return records

    return records.filter((item) => {
      const serviceName = item.serviceName?.toLowerCase() ?? ""
      const description = item.description?.toLowerCase() ?? ""
      const projectValue = item.projectValue?.toLowerCase() ?? ""
      return (
        serviceName.includes(keyword) ||
        description.includes(keyword) ||
        projectValue.includes(keyword)
      )
    })
  }, [records, search])

  // masih client-side saja (belum hit API POST/PUT)
  const addItem = (payload: UpsertPayload) => {
    const id = `${normalizeId(payload.serviceName)}-${Date.now()}`
    setRecords((prev) => [{ id, ...payload }, ...prev])
  }

  const updateItem = (id: string, payload: UpsertPayload) => {
    setRecords((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...payload } : item))
    )
  }

  return {
    search,
    setSearch,
    items,
    addItem,
    updateItem,
    loading,
    error,
  }
}
