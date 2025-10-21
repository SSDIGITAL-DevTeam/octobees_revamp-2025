"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/layout/header/Header"
import AffiliateFilters, { type FilterValue } from "@/components/partials/form/affiliate-filters"
import { AffiliateTable } from "@/components/partials/table"
import PaginationComponents from "@/components/partials/pagination/Pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { AffiliateRow, AffiliateStats, PaginationMeta } from "@/constrant/affiliate"
import { exportApplicationsCsv, getStats, listApplications } from "@/lib/api/affiliate"
import { failedToast } from "@/utils/toast"

type AffiliateListResponse = {
  status: string
  data: AffiliateRow[]
  pagination: PaginationMeta
}

const DEFAULT_FILTERS: FilterValue = {
  search: "",
  status: "",
  country: "",
  from: "",
  to: "",
  sort: "newest",
  limit: "10",
}

const parseFilters = (params: URLSearchParams): FilterValue => {
  const limit = params.get("limit")
  const sort = params.get("sort")
  const status = params.get("status")

  return {
    search: params.get("search") ?? "",
    status: status === "pending" || status === "approved" || status === "rejected" ? status : "",
    country: params.get("country") ?? "",
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    sort: sort === "oldest" ? "oldest" : "newest",
    limit: limit === "25" || limit === "50" ? limit : "10",
  }
}

const AffiliateProgramPage = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const [filters, setFilters] = useState<FilterValue>(() => parseFilters(new URLSearchParams(searchParams.toString())))
  const [applications, setApplications] = useState<AffiliateRow[]>([])
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [countries, setCountries] = useState<string[]>([])
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isStatsLoading, setIsStatsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState<number>(0)
  const hasLoadedStats = useRef(false)

  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page")
    const parsed = Number(pageParam)
    if (!pageParam || Number.isNaN(parsed) || parsed < 1) {
      return 1
    }
    return parsed
  }, [searchParams])

  const queryString = useMemo(() => searchParams.toString(), [searchParams])

  const updateRoute = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const handleFilterChange = <K extends keyof FilterValue>(key: K, value: FilterValue[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    updateRoute((params) => {
      if (!value) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
      params.set("page", "1")
    })
  }

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    const params = new URLSearchParams()
    params.set("page", "1")
    params.set("limit", DEFAULT_FILTERS.limit)
    params.set("sort", DEFAULT_FILTERS.sort)
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  const handlePageChange = (page: number) => {
    updateRoute((params) => {
      params.set("page", String(page))
    })
  }

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const buildRequestParams = (parsedFilters: FilterValue) => {
    const params: Record<string, string> = {
      page: String(currentPage),
      limit: parsedFilters.limit,
      sort: parsedFilters.sort,
    }

    if (parsedFilters.search.trim()) params.search = parsedFilters.search.trim()
    if (parsedFilters.status) params.status = parsedFilters.status
    if (parsedFilters.country) params.country = parsedFilters.country
    if (parsedFilters.from) params.from = parsedFilters.from
    if (parsedFilters.to) params.to = parsedFilters.to

    return params
  }

  const fetchStats = async () => {
    const shouldShowLoading = !hasLoadedStats.current
    try {
      if (shouldShowLoading) {
        setIsStatsLoading(true)
      }
      const response = await getStats()
      setStats(response.data.data)
      hasLoadedStats.current = true
    } catch (err) {
      failedToast("Failed to load affiliate stats")
    } finally {
      if (shouldShowLoading) {
        setIsStatsLoading(false)
      }
    }
  }

  const fetchApplications = async (parsedFilters: FilterValue) => {
    try {
      setIsLoading(true)
      setError(null)
      const params = buildRequestParams(parsedFilters)
      const response = await listApplications(params)
      const payload = response.data as AffiliateListResponse
      setApplications(payload.data)
      setPagination(payload.pagination)
      const uniqueCountries = Array.from(
        new Set(payload.data.map((item) => item.country).filter(Boolean))
      ).sort((a, b) => a.localeCompare(b))
      setCountries(uniqueCountries)
    } catch (err) {
      setError("Unable to load affiliate applications.")
      failedToast("Failed to load affiliate applications")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const parsed = parseFilters(new URLSearchParams(searchParams.toString()))
    setFilters(parsed)
    fetchApplications(parsed)
    fetchStats()
  }, [searchParams, refreshKey])

  const handleRetry = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const handleExport = () => {
    const params = buildRequestParams(filters)
    exportApplicationsCsv(params)
  }

  const statsItems = [
    {
      label: "Total Applications",
      value: stats?.total ?? 0,
      accent: "bg-slate-100 text-slate-900 border-slate-200",
    },
    {
      label: "Pending Review",
      value: stats?.pending ?? 0,
      accent: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      label: "Approved",
      value: stats?.approved ?? 0,
      accent: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Rejected",
      value: stats?.rejected ?? 0,
      accent: "bg-rose-50 text-rose-700 border-rose-200",
    },
  ]

  return (
    <main className="flex w-full flex-col gap-12 pb-12">
      <Header title="Affiliate Program" label="Subscription Management" />
      <section className="flex min-h-[60vh] w-full flex-col gap-10 rounded-3xl border border-border bg-white p-8 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statsItems.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-border bg-slate-50 p-6 shadow-sm"
            >
              {isStatsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-7 w-20" />
                </div>
              ) : (
                <div className={`space-y-2 rounded-2xl border p-4 ${item.accent}`}>
                  <p className="text-sm font-medium text-slate-600">{item.label}</p>
                  <p className="text-3xl font-bold">{item.value}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <AffiliateFilters
          values={filters}
          countries={countries}
          onChange={handleFilterChange}
          onExport={handleExport}
          onReset={handleResetFilters}
        />

        {error ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-rose-200 bg-rose-50/40 p-16 text-center">
            <div>
              <p className="text-lg font-semibold text-rose-700">Something went wrong</p>
              <p className="text-sm text-rose-600">{error}</p>
            </div>
            <Button variant="outline" className="rounded-2xl border-rose-200 text-rose-700" onClick={handleRetry}>
              Try again
            </Button>
          </div>
        ) : (
          <>
            <AffiliateTable
              data={applications}
              isLoading={isLoading}
              emptyMessage="Try adjusting the filters above or invite more partners to apply."
              queryString={queryString}
            />

            {pagination && pagination.totalPages > 0 && (
              <PaginationComponents
                handleNext={handleNextPage}
                handlePrev={handlePrevPage}
                page={currentPage}
                setPage={handlePageChange}
                totalPage={pagination.totalPages}
                totalData={pagination.total}
              />
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default AffiliateProgramPage
