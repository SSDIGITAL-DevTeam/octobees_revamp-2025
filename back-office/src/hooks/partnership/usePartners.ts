"use client"

import { useEffect, useState } from "react"

import type { PartnerEntry, PartnerStatus } from "@/constrant/partnership"
import {
  getPartnerList as listPartners,
  type PartnerApiEntry,
  type PartnerListParams,
} from "@/lib/api/partnership/dashboardPartnership"

const STATUS_OPTIONS: (PartnerStatus | "all")[] = ["all", "Active", "Non Active"]

const mapApiPartnerToEntry = (api: PartnerApiEntry): PartnerEntry => {
  // backend kirim status "approved" dsb, FE butuh "Active" | "Non Active"
  const mappedStatus: PartnerEntry["status"] =
    api.status === "approved" ? "Active" : "Non Active"

  return {
    id: api.id,
    fullName: api.fullName,
    email: api.email,
    phone: api.phone,
    country: api.country,
    status: mappedStatus,
  }
}

export const usePartners = () => {
  const [partners, setPartners] = useState<PartnerEntry[]>([])
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<PartnerStatus | "all">("all")

  // (opsional) kalau mau pakai pagination dari backend:
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalData, setTotalData] = useState(0)

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const params: PartnerListParams = {
          page,
          limit,
          search: search || undefined,
          // sesuaikan dengan apa yang backend terima;
          // misal "approved"/"rejected" atau "active"/"inactive"
          status: status === "all" ? undefined : status.toLowerCase(),
        }

        const res = await listPartners(params)
        const { data, pagination } = res.data

        setPartners(data.map(mapApiPartnerToEntry))
        setTotalPages(pagination.totalPages)
        setTotalData(pagination.total)
      } catch (error) {
        console.error("Failed to load partners:", error)
      }
    }

    loadPartners()
  }, [search, status, page, limit])

  return {
    partners,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions: STATUS_OPTIONS,
    // kalau mau dipakai nanti:
    page,
    setPage,
    totalPages,
    totalData,
  }
}
