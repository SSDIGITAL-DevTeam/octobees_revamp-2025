"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { MoreHorizontal, ShieldBan, Trash2 } from "lucide-react"

import Header from "@/components/layout/header/Header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StatusBadge } from "@/components/partials/partnership/PartnershipDashboardWidgets"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  deactivatePartner as deactivatePartnerRequest,
  deletePartner as deletePartnerRequest,
  getPartnerDetail,
  getPartnerLeadPipelineStatuses,
  updatePartner as updatePartnerRequest,
  type PartnerDetailResponse,
  type PartnerLeadApiItem,
  type PartnerLeadPipelineStatus,
  type PartnerServiceApiItem,
} from "@/lib/api/partnership/dashboardPartnership"
import {
  calculatePartnerMonthlyMetrics,
  formatCurrency,
  formatDate,
  getAllPartnerLeads,
  getAllPartnerServices,
  isDateWithinRange,
  normalizePartnerLeadStatus,
  PARTNER_LEAD_SORT_OPTIONS,
  PARTNER_LEAD_STATUS_OPTIONS,
  type PartnerLeadSortValue,
} from "@/lib/partnership/partnerList"
import { cn } from "@/lib/utils"
import { LeadDateRangeFilter } from "./LeadDateRangeFilter"

const buildAddress = (partner?: PartnerDetailResponse["data"] | null) => {
  if (!partner) return "-"

  const pieces = [partner.address, partner.city, partner.postalCode].filter(Boolean)
  return pieces.length > 0 ? pieces.join(", ") : "-"
}

const getPartnerPipelineStatusClasses = (status?: string | null) => {
  const normalized = normalizePartnerLeadStatus(status)

  if (normalized === "Won") return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (normalized === "Lost") return "border-rose-200 bg-rose-50 text-rose-700"
  if (
    normalized === "Contacted" ||
    normalized === "Follow-up Day-1" ||
    normalized === "Follow-up Day-3" ||
    normalized === "Follow-up Day-7" ||
    normalized === "Follow-up Day-14"
  ) {
    return "border-purple-200 bg-purple-50 text-purple-700"
  }

  return "border-blue-200 bg-blue-50 text-blue-700"
}

const getPipelineColorFallback = (value: string) => {
  if (value === "Won") return "green"
  if (value === "Lost") return "red"
  if (value === "New Leads") return "blue"
  return "purple"
}

const FALLBACK_PIPELINE_STATUSES: PartnerLeadPipelineStatus[] =
  PARTNER_LEAD_STATUS_OPTIONS.filter((status) => status !== "all").map(
    (value, index) => ({
      value,
      label: value,
      color: getPipelineColorFallback(value),
      isActive: true,
      sortOrder: index + 1,
      isSystem: true,
    }),
  )

export const PartnerListDetailContent = ({ partnerId }: { partnerId: string }) => {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"partner-information" | "leads">(
    "leads",
  )
  const [partner, setPartner] = useState<PartnerDetailResponse["data"] | null>(null)
  const [leads, setLeads] = useState<PartnerLeadApiItem[]>([])
  const [services, setServices] = useState<PartnerServiceApiItem[]>([])
  const [pipelineStatuses, setPipelineStatuses] = useState<PartnerLeadPipelineStatus[]>(
    FALLBACK_PIPELINE_STATUSES,
  )
  const [leadStatus, setLeadStatus] = useState("all")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [sort, setSort] = useState<PartnerLeadSortValue>("newest")
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false)
  const [reactivateDialogOpen, setReactivateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteFinalDialogOpen, setDeleteFinalDialogOpen] = useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("")
  const [actionLoading, setActionLoading] = useState<
    "deactivate" | "reactivate" | "delete" | null
  >(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError("")

        const [partnerResponse, leadData, serviceData, pipelineResponse] = await Promise.all([
          getPartnerDetail(partnerId),
          getAllPartnerLeads(partnerId),
          getAllPartnerServices(),
          getPartnerLeadPipelineStatuses({ includeInactive: true }),
        ])

        setPartner(partnerResponse.data.data)
        setLeads(leadData)
        setServices(serviceData)
        setPipelineStatuses(pipelineResponse.data.data || FALLBACK_PIPELINE_STATUSES)
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load partner detail.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [partnerId])

  const monthlyMetrics = useMemo(
    () => calculatePartnerMonthlyMetrics(partnerId, leads, services),
    [leads, partnerId, services],
  )

  const orderedPipelineStatuses = useMemo(
    () =>
      (pipelineStatuses.length ? pipelineStatuses : FALLBACK_PIPELINE_STATUSES)
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [pipelineStatuses],
  )

  const activePipelineStatuses = useMemo(
    () => orderedPipelineStatuses.filter((status) => status.isActive),
    [orderedPipelineStatuses],
  )

  const pipelineLabelByValue = useMemo(
    () =>
      new Map(
        orderedPipelineStatuses.map((status) => [
          status.value,
          status.label || status.value,
        ]),
      ),
    [orderedPipelineStatuses],
  )

  const filteredLeads = useMemo(() => {
    const nextLeads = leads
      .filter(
        (lead) =>
          leadStatus === "all" ||
          normalizePartnerLeadStatus(lead.status) === leadStatus,
      )
      .filter((lead) => isDateWithinRange(lead.createdAt, fromDate, toDate))
      .slice()

    nextLeads.sort((a, b) => {
      const leftStatus = normalizePartnerLeadStatus(a.status)
      const rightStatus = normalizePartnerLeadStatus(b.status)

      if (sort === "status-asc") return leftStatus.localeCompare(rightStatus)
      if (sort === "status-desc") return rightStatus.localeCompare(leftStatus)

      const left = new Date(a.createdAt).getTime()
      const right = new Date(b.createdAt).getTime()

      return sort === "oldest" ? left - right : right - left
    })

    return nextLeads
  }, [fromDate, leadStatus, leads, sort, toDate])

  const groupedLeads = useMemo(() => {
    const normalizedStatusOrder = orderedPipelineStatuses.map((status) => status.value)

    const grouped = filteredLeads.reduce<Record<string, PartnerLeadApiItem[]>>(
      (acc, lead) => {
        const key = String(lead.status || "Unknown").trim() || "Unknown"
        const normalizedKey = normalizePartnerLeadStatus(key)
        if (!acc[normalizedKey]) acc[normalizedKey] = []
        acc[normalizedKey].push(lead)
        return acc
      },
      {},
    )

    const orderedStatuses = [
      ...normalizedStatusOrder.filter((status) => grouped[status]?.length),
      ...Object.keys(grouped).filter(
        (status) => !normalizedStatusOrder.includes(status as (typeof normalizedStatusOrder)[number]),
      ),
    ]

    return orderedStatuses.map((status) => ({
      status,
      label: pipelineLabelByValue.get(status) || status,
      leads: grouped[status] || [],
    }))
  }, [filteredLeads, orderedPipelineStatuses, pipelineLabelByValue])

  useEffect(() => {
    setCollapsedGroups((current) => {
      const next = groupedLeads.reduce<Record<string, boolean>>((acc, group) => {
        acc[group.status] = current[group.status] ?? false
        return acc
      }, {})

      const isSame =
        Object.keys(next).length === Object.keys(current).length &&
        Object.entries(next).every(([key, value]) => current[key] === value)

      return isSame ? current : next
    })
  }, [groupedLeads])

  const infoItems = useMemo(
    () => [
      { label: "Partner Name", value: partner?.fullName || "-" },
      { label: "Joined Date", value: formatDate(partner?.createdAt) },
      { label: "Bank Account", value: partner?.bankName || "-" },
      { label: "Account Number", value: partner?.bankAccountNumber || "-" },
      { label: "Phone / WhatsApp", value: partner?.phoneE164 || partner?.phone || "-" },
      { label: "Address", value: buildAddress(partner) },
    ],
    [partner],
  )

  const isPartnerInactive = partner?.isActive === false
  const deleteConfirmationLabel = "DELETE PARTNER"
  let sortLabel = "Status Sort"
  if (sort === "oldest") sortLabel = "Oldest First"
  else if (sort === "newest") sortLabel = "Newest First"

  const toggleGroup = (status: string) => {
    setCollapsedGroups((current) => ({
      ...current,
      [status]: !current[status],
    }))
  }

  const handleDeactivatePartner = async () => {
    try {
      setActionLoading("deactivate")
      const response = await deactivatePartnerRequest(partnerId)
      setPartner(response.data.data)
      setDeactivateDialogOpen(false)
      toast.success("Partner has been deactivated and can no longer access the portal.")
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to deactivate partner.",
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleReactivatePartner = async () => {
    try {
      setActionLoading("reactivate")
      await updatePartnerRequest(partnerId, {
        isActive: true,
        forcePasswordChange: false,
      })
      const response = await getPartnerDetail(partnerId)
      setPartner(response.data.data)
      setReactivateDialogOpen(false)
      toast.success("Partner has been reactivated and can access the portal again.")
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to reactivate partner.",
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeletePartner = async () => {
    try {
      setActionLoading("delete")
      await deletePartnerRequest(partnerId)
      setDeleteFinalDialogOpen(false)
      setDeleteDialogOpen(false)
      toast.success("Partner and related records have been deleted.")
      router.push("/partnership/partner-list")
      router.refresh()
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to delete partner.",
      )
    } finally {
      setActionLoading(null)
      setDeleteConfirmationText("")
    }
  }

  return (
    <main className="flex w-full flex-col gap-5 pb-12">
      <Header
        title="Partner Details"
        label="Partnership Program"
        breadcrumbItems={[
          { label: "Partnership Program" },
          { label: "Partner List", href: "/partnership/partner-list" },
          { label: partner?.fullName || "Partner Details" },
        ]}
      />

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <Link
              href="/partnership/partner-list"
              className="text-sm font-semibold text-[#2A399D] transition hover:text-[#1d2971]"
            >
              Back to Partner List
            </Link>
            <h2 className="mt-3 text-3xl font-semibold text-slate-950">
              {loading ? "Loading partner..." : partner?.fullName || "Partner detail"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Review partner identity, current month performance, and the lead list generated by this partner.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge label="Approved Partner" tone="success" />
            <StatusBadge
              label={isPartnerInactive ? "Inactive" : "Active"}
              tone={isPartnerInactive ? "warning" : "success"}
            />
            <StatusBadge label="Unpaid" tone="warning" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border-slate-200"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {!isPartnerInactive ? (
                  <DropdownMenuItem onClick={() => setDeactivateDialogOpen(true)}>
                    <ShieldBan className="mr-2 h-4 w-4 text-amber-600" />
                    <span>Deactivate Partner</span>
                  </DropdownMenuItem>
                ) : null}
                {isPartnerInactive ? (
                  <DropdownMenuItem onClick={() => setReactivateDialogOpen(true)}>
                    <ShieldBan className="mr-2 h-4 w-4 text-emerald-600" />
                    <span>Reactivate Partner</span>
                  </DropdownMenuItem>
                ) : null}
                {isPartnerInactive ? (
                  <DropdownMenuItem
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-rose-600 focus:text-rose-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Partner</span>
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {loading ? (
        <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Loading partner detail...</p>
        </section>
      ) : (
        <>
          <section className="rounded-3xl border border-border bg-white p-3 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Leads",
                  value: "leads" as const,
                },
                {
                  label: "Partner Information",
                  value: "partner-information" as const,
                },
              ].map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    "rounded-2xl px-5 py-3 text-sm font-semibold transition-colors",
                    activeTab === tab.value
                      ? "bg-red-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === "partner-information" ? (
            <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">Partner Information</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Administrative identity and payout-related information for this onboarded partner.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {infoItems.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Partner Sales
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {formatCurrency(monthlyMetrics.salesThisMonth)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">Closed Won sales in the current month.</p>
                </div>

                <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Potential Commission
                  </p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">
                    {formatCurrency(monthlyMetrics.commissionThisMonth)}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    Calculated from the service commission rules configured in Partner Recruitment System.
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Payment Status
                  </p>
                  <div className="mt-3">
                    <StatusBadge label="Unpaid" tone="warning" />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Payment flow will be connected later to the payout feature.
                  </p>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-950">Lead List</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Filter by added date and lead status, then sort the result set to inspect activity.
                    </p>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    <LeadDateRangeFilter
                      fromDate={fromDate}
                      toDate={toDate}
                      onFromDateChange={setFromDate}
                      onToDateChange={setToDate}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Lead Status</label>
                      <Select value={leadStatus} onValueChange={setLeadStatus}>
                        <SelectTrigger className="h-14 rounded-xl border-gray-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          {activePipelineStatuses.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Sort</label>
                      <Select value={sort} onValueChange={(value) => setSort(value as PartnerLeadSortValue)}>
                        <SelectTrigger className="h-14 rounded-xl border-gray-400">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PARTNER_LEAD_SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{filteredLeads.length} lead(s) found</span>
                  <span>Default summary above follows current-month Closed Won sales.</span>
                </div>

                <div className="mt-5">
                  {groupedLeads.length > 0 ? (
                    <div className="space-y-6">
                      {groupedLeads.map((group) => (
                        <div key={group.status}>
                          <button
                            type="button"
                            onClick={() => toggleGroup(group.status)}
                            className="mb-3 flex w-full items-center gap-3 text-left"
                          >
                            <span className="inline-flex h-5 w-5 items-center justify-center text-slate-400">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                className={`h-4 w-4 transition ${collapsedGroups[group.status] ? "-rotate-90" : ""}`}
                              >
                                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z" />
                              </svg>
                            </span>
                            <div
                              className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                                getPartnerPipelineStatusClasses(group.status),
                              )}
                            >
                              {group.label}
                            </div>
                            <span className="text-sm text-slate-500">{group.leads.length}</span>
                          </button>

                          {!collapsedGroups[group.status] ? (
                            <>
                              <div className="space-y-4 md:hidden">
                                {group.leads.map((lead) => (
                                  <div
                                    key={lead.id}
                                    className="border-t border-slate-200 py-4 first:border-t-0"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-slate-950">
                                          {lead.name}
                                        </p>
                                        <p className="truncate text-sm text-slate-600">
                                          {lead.email || "-"}
                                        </p>
                                      </div>
                                      <StatusBadge
                                        label={lead.status || "-"}
                                        tone="default"
                                        className={getPartnerPipelineStatusClasses(lead.status)}
                                      />
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                      <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                          Added On
                                        </p>
                                        <p className="mt-1 text-slate-700">{formatDate(lead.createdAt)}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                          Product / Service
                                        </p>
                                        <p className="mt-1 text-slate-700">{lead.serviceName || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                          Phone
                                        </p>
                                        <p className="mt-1 text-slate-700">{lead.phone || "-"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                          Current Sort
                                        </p>
                                        <p className="mt-1 text-slate-700">{sortLabel}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="hidden md:block">
                                <div className="overflow-x-auto overflow-y-visible">
                                  <table className="min-w-full text-sm">
                                    <thead>
                                      <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
                                        <th className="pb-3">Added On</th>
                                        <th className="pb-3">Product / Service</th>
                                        <th className="pb-3">Lead Name</th>
                                        <th className="pb-3">Email</th>
                                        <th className="pb-3">Phone</th>
                                        <th className="pb-3">Lead Status</th>
                                      </tr>
                                    </thead>
                                    <tbody className="text-slate-900">
                                      {group.leads.map((lead) => (
                                        <tr
                                          key={lead.id}
                                          className="border-b border-slate-100 last:border-b-0"
                                        >
                                          <td className="py-4">{formatDate(lead.createdAt)}</td>
                                          <td className="py-4">{lead.serviceName || "-"}</td>
                                          <td className="py-4 font-semibold">{lead.name}</td>
                                          <td className="py-4">{lead.email || "-"}</td>
                                          <td className="py-4">{lead.phone || "-"}</td>
                                          <td className="py-4">
                                            <StatusBadge
                                              label={lead.status || "-"}
                                              tone="default"
                                              className={getPartnerPipelineStatusClasses(lead.status)}
                                            />
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                      No leads match the current filters.
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </>
      )}

      <Dialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deactivate This Partner?</DialogTitle>
            <DialogDescription>
              This will block <strong>{partner?.fullName || "this partner"}</strong> from logging in to
              the partner portal. You can only delete the partner after this status is changed to inactive.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeactivateDialogOpen(false)}
              disabled={actionLoading === "deactivate"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeactivatePartner}
              disabled={actionLoading === "deactivate"}
            >
              {actionLoading === "deactivate" ? "Deactivating..." : "Confirm Deactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reactivateDialogOpen} onOpenChange={setReactivateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reactivate This Partner?</DialogTitle>
            <DialogDescription>
              This will restore access for <strong>{partner?.fullName || "this partner"}</strong> so they
              can log in to the partner portal again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReactivateDialogOpen(false)}
              disabled={actionLoading === "reactivate"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleReactivatePartner}
              disabled={actionLoading === "reactivate"}
            >
              {actionLoading === "reactivate" ? "Reactivating..." : "Confirm Reactivation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open)
          if (!open) {
            setDeleteFinalDialogOpen(false)
            setDeleteConfirmationText("")
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete This Partner?</DialogTitle>
            <DialogDescription>
              This action permanently removes the partner account and related data, including leads,
              commissions, login records, and registration data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading === "delete"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false)
                setDeleteFinalDialogOpen(true)
              }}
              disabled={actionLoading === "delete"}
            >
              Continue to Final Confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteFinalDialogOpen}
        onOpenChange={(open) => {
          setDeleteFinalDialogOpen(open)
          if (!open) setDeleteConfirmationText("")
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Final Delete Confirmation</DialogTitle>
            <DialogDescription>
              Type <strong>{deleteConfirmationLabel}</strong> to permanently delete{" "}
              <strong>{partner?.fullName || "this partner"}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Confirmation Text</label>
            <input
              value={deleteConfirmationText}
              onChange={(event) => setDeleteConfirmationText(event.target.value)}
              placeholder={deleteConfirmationLabel}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm outline-none transition focus:border-slate-500"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteFinalDialogOpen(false)
                setDeleteConfirmationText("")
              }}
              disabled={actionLoading === "delete"}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeletePartner}
              disabled={
                actionLoading === "delete" ||
                deleteConfirmationText.trim() !== deleteConfirmationLabel
              }
            >
              {actionLoading === "delete" ? "Deleting..." : "Delete Partner Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}

export default PartnerListDetailContent
