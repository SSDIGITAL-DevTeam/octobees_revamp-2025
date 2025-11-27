// src/hooks/partnership/useCommissionControl.ts
"use client"

import { useEffect, useMemo, useState } from "react"

import type { CommissionItem } from "@/constrant/partnership"
import {
  getPartnerServices,
  createPartnerService,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership"

type UpsertPayload = Omit<CommissionItem, "id">


export const useCommissionControl = () => {
  const [records, setRecords] = useState<CommissionItem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --- FETCH LIST SERVICES DARI API ---
  const fetchServices = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await getPartnerServices({ page: 1, limit: 100 })
      const apiData = res.data.data

      const mapped: CommissionItem[] = apiData.map(
        (item: PartnerServiceApiItem): CommissionItem => ({
          id: item.id,
          serviceName: item.name,
          // simpan sebagai string number, biar bisa diformat di table
          projectValue: item.projectValue.toString(),
          commissionPercentage: item.commissionPercentage,
          description: item.description,
        })
      )

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

  // --- FILTER BY SEARCH ---
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

  // --- CREATE SERVICE (API + UPDATE STATE) ---
  const addItem = async (payload: UpsertPayload) => {
    // projectValue di form masih string ⇒ convert ke number
    const rawNumber =
      typeof payload.projectValue === "string"
        ? Number(payload.projectValue.replace(/[^\d]/g, "")) || 0
        : Number(payload.projectValue) || 0

    await createPartnerService({
      name: payload.serviceName,
      projectValue: rawNumber,
      commissionPercentage: payload.commissionPercentage,
      description: payload.description,
      isActive: true,
    })

    // setelah sukses, refetch list supaya sinkron dengan backend
    await fetchServices()
  }

  // --- UPDATE LOCAL (kalau nanti ada endpoint PUT, bisa disambung di sini) ---
  const updateItem = (id: string, payload: UpsertPayload) => {
    setRecords((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...payload } : item
      )
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
