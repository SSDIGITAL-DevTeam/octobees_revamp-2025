"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import dayjs from "dayjs"

import Header from "@/components/layout/header/Header"
import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets"
import { listApplications } from "@/lib/api/affiliate"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useBatches } from "@/hooks/partnership/useBatches"

export const PartnerRecruitmentDashboardContent = () => {
  const { batches, loading } = useBatches()
  const [appliedCountsByBatchId, setAppliedCountsByBatchId] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    let mounted = true

    const fetchAppliedCounts = async () => {
      try {
        const response = await listApplications({ page: "1", limit: "1000" })
        const rows = Array.isArray(response.data?.data) ? response.data.data : []

        if (!mounted) return

        const nextCounts = rows.reduce<Record<string, number>>((acc, row) => {
          const batchId = String(row.batch_id || "").trim()
          if (!batchId) return acc
          acc[batchId] = (acc[batchId] || 0) + 1
          return acc
        }, {})

        setAppliedCountsByBatchId(nextCounts)
      } catch {
        if (mounted) {
          setAppliedCountsByBatchId({})
        }
      }
    }

    void fetchAppliedCounts()

    return () => {
      mounted = false
    }
  }, [])

  const publishedBatches = useMemo(
    () =>
      batches
        .filter((batch) => batch.status !== "draft")
        .sort(
          (a, b) =>
            new Date(b.createdAt || b.startDate).getTime() -
            new Date(a.createdAt || a.startDate).getTime(),
        ),
    [batches],
  )

  let publishedBatchContent: React.ReactNode

  if (loading) {
    publishedBatchContent = (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
        Loading recruitment batches...
      </div>
    )
  } else if (publishedBatches.length === 0) {
    publishedBatchContent = (
      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-12 text-center text-sm text-slate-500">
        There are no batch at this moment
      </div>
    )
  } else {
    publishedBatchContent = (
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Batch No.</TableHead>
              <TableHead>Partner Role</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Start From</TableHead>
              <TableHead>Expire On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {publishedBatches.map((batch) => {
              const appliedCount = Math.max(
                Number(batch.applicationCount || 0),
                Number(appliedCountsByBatchId[batch.id] || 0),
                Array.isArray(batch.aiScreeningRankedCandidates)
                  ? batch.aiScreeningRankedCandidates.length
                  : 0,
              )
              return (
                <TableRow key={batch.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {batch.name}
                  </TableCell>
                  <TableCell>{batch.role || "-"}</TableCell>
                  <TableCell>{appliedCount}</TableCell>
                  <TableCell>{dayjs(batch.startDate).format("DD MMM YYYY")}</TableCell>
                  <TableCell>{dayjs(batch.endDate).format("DD MMM YYYY")}</TableCell>
                  <TableCell>
                    <StatusBadge
                      label={(batch.effectiveStatus || batch.status) === "open" ? "Open" : "Closed"}
                      tone={(batch.effectiveStatus || batch.status) === "open" ? "success" : "default"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/partner-recruitment-system/batches/${batch.id}`}
                      className="text-sm font-semibold text-[#2A399D] transition hover:text-[#1d2971]"
                    >
                      See details
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header
        title="Partner Recruitment System"
        label="Partner Recruitment System"
        breadcrumbs={[{ label: "Partner Recruitment System" }]}
      />

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Monitor currently published recruitment batches, inspect candidate progress, and open detail pages to manage closing dates, training references, exam references, and admin review visibility.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">Published Batches</h3>
            <p className="mt-1 text-sm text-slate-500">
              Open and closed batches currently managed in the recruitment system.
            </p>
          </div>
        </div>

        {publishedBatchContent}
      </section>
    </main>
  )
}

export default PartnerRecruitmentDashboardContent
