"use client"

import Header from "@/components/layout/header/Header"
import { useLeadsManagement } from "@/hooks/partnership/useLeadsManagement"
import { LeadsFilterBar } from "./LeadsFilterBar"
import { LeadsTable } from "./LeadsTable"
import { LeadsPagination } from "./LeadsPagination"

export const LeadsManagementContent = () => {
  const {
    leads,
    search,
    setSearch,
    status,
    setStatus,
    statusOptions,
    page,
    setPage,
    totalPages,
    totalData,
    pageSize,
  } = useLeadsManagement()

  const rangeStart = totalData ? (page - 1) * pageSize + 1 : 0
  const rangeEnd = totalData ? (page - 1) * pageSize + leads.length : 0

  return (
    <main className="flex w-full flex-col gap-10 pb-12">
      <Header title="Lead Management" label="Partnership Program" />

      <section className="flex flex-col gap-8">
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <LeadsFilterBar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            statusOptions={statusOptions}
          />

          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-semibold text-slate-950">All Leads</h2>
            <LeadsTable leads={leads} />
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-slate-500">
                Showing {rangeStart}-{rangeEnd} of {totalData} leads
              </p>
              <LeadsPagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LeadsManagementContent
