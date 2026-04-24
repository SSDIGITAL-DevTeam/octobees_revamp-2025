"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { KanbanSquare, List } from "lucide-react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import LeadStatusDropdown from "@/components/leads/LeadStatusDropdown";
import AddLeadModal from "@/components/modals/AddLeadModal";
import SelectServiceModal, {
  type ServiceOption,
} from "@/components/modals/SelectServiceModal";
import Badge from "@/components/ui/Badge";
import { SkeletonTable, SkeletonList } from "@/components/ui/Shimmer";
import {
  formatServiceCommissionLabel,
  getPartnerToken,
  normalizePartnerLeadStatus,
  DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS,
  type PartnerLeadItem,
  type PartnerLeadPipelineStatus,
  type PartnerServiceItem,
  formatCurrencyIdr,
  formatDateTime,
} from "@/lib/partner-portal";
import {
  createAffiliateLead,
  getAffiliateLeads,
  getAffiliatePipelineStatuses,
  getAffiliateServices,
  updateAffiliateLead,
} from "@/services/dashboardService";

const LEAD_VIEW_STORAGE_KEY = "partner_my_leads_view_mode";

const getInitialLeadViewMode = (): "list" | "kanban" => {
  if (typeof window === "undefined") return "list";

  const savedViewMode = window.localStorage.getItem(LEAD_VIEW_STORAGE_KEY);
  return savedViewMode === "kanban" ? "kanban" : "list";
};

const MyLeadsPage = () => {
  const [leads, setLeads] = useState<PartnerLeadItem[]>([]);
  const [services, setServices] = useState<PartnerServiceItem[]>([]);
  const [pipelineStatuses, setPipelineStatuses] = useState<
    PartnerLeadPipelineStatus[]
  >(DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS);
  const [viewMode, setViewMode] = useState<"list" | "kanban">(
    getInitialLeadViewMode,
  );
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  );
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({});
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  const serviceOptions: ServiceOption[] = useMemo(
    () =>
      services.map((service) => ({
        id: service.id,
        label: `${service.name}, ${formatServiceCommissionLabel(service)} Commission`,
      })),
    [services],
  );

  const orderedPipelineStatuses = useMemo(
    () =>
      (pipelineStatuses.length
        ? pipelineStatuses
        : DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS
      )
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [pipelineStatuses],
  );

  const activePipelineStatuses = useMemo(
    () => orderedPipelineStatuses.filter((status) => status.isActive),
    [orderedPipelineStatuses],
  );

  const selectedServiceLabel = useMemo(() => {
    return (
      services.find((service) => service.id === selectedServiceId)?.name ?? ""
    );
  }, [selectedServiceId, services]);

  const leadStats = useMemo(() => {
    const total = leads.length;
    const activePipeline = leads.filter(
      (lead) =>
        normalizePartnerLeadStatus(lead.status) !== "Won" &&
        normalizePartnerLeadStatus(lead.status) !== "Lost",
    ).length;
    const followUpDay1 = leads.filter(
      (lead) => normalizePartnerLeadStatus(lead.status) === "Follow-up Day-1",
    ).length;
    const followUpDay3 = leads.filter(
      (lead) => normalizePartnerLeadStatus(lead.status) === "Follow-up Day-3",
    ).length;
    const followUpDay7 = leads.filter(
      (lead) => normalizePartnerLeadStatus(lead.status) === "Follow-up Day-7",
    ).length;
    const followUpDay14 = leads.filter(
      (lead) => normalizePartnerLeadStatus(lead.status) === "Follow-up Day-14",
    ).length;
    const closedWon = leads.filter(
      (lead) => normalizePartnerLeadStatus(lead.status) === "Won",
    ).length;
    const overdueFollowUp = leads.filter((lead) => {
      if (!lead.nextFollowUpAt) return false;
      const normalizedStatus = normalizePartnerLeadStatus(lead.status);
      if (normalizedStatus === "Won" || normalizedStatus === "Lost")
        return false;
      return new Date(lead.nextFollowUpAt).getTime() < Date.now();
    }).length;
    return {
      total,
      activePipeline,
      followUpDay1,
      followUpDay3,
      followUpDay7,
      followUpDay14,
      closedWon,
      overdueFollowUp,
    };
  }, [leads]);

  const summaryCards = [
    {
      title: "Total Leads",
      value: leadStats.total,
      tone: "default" as const,
    },
    {
      title: "Active Pipeline",
      value: leadStats.activePipeline,
      tone: "default" as const,
    },
    {
      title: "Won",
      value: leadStats.closedWon,
      tone: "default" as const,
    },
    {
      title: "Overdue Follow-up",
      value: leadStats.overdueFollowUp,
      tone: "warning" as const,
    },
  ];

  const followUpCards = [
    { title: "Follow-up Day-1", value: leadStats.followUpDay1 },
    { title: "Follow-up Day-3", value: leadStats.followUpDay3 },
    { title: "Follow-up Day-7", value: leadStats.followUpDay7 },
    { title: "Follow-up Day-14", value: leadStats.followUpDay14 },
  ];

  const filteredLeads = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const normalizedStatus = normalizePartnerLeadStatus(lead.status);
      const matchesNormalizedStatus = statusFilter
        ? normalizedStatus === statusFilter
        : true;
      const matchesSearch = keyword
        ? [lead.name, lead.email, lead.phone, lead.serviceName]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))
        : true;

      return matchesNormalizedStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const groupedLeads = useMemo(() => {
    const grouped = new Map<string, PartnerLeadItem[]>();

    orderedPipelineStatuses.forEach((status) => {
      grouped.set(status.value, []);
    });

    filteredLeads.forEach((lead) => {
      const normalizedStatus = normalizePartnerLeadStatus(lead.status);
      const current = grouped.get(normalizedStatus) || [];
      current.push(lead);
      grouped.set(normalizedStatus, current);
    });

    const knownGroups = orderedPipelineStatuses.map((status) => ({
      status: status.value,
      label: status.label,
      isActive: status.isActive,
      leads: grouped.get(status.value) || [],
    }));
    const knownStatusValues = new Set(orderedPipelineStatuses.map((status) => status.value));
    const unknownGroups = [...grouped.entries()]
      .filter(([status]) => !knownStatusValues.has(status))
      .map(([status, groupLeads]) => ({
        status,
        label: status,
        isActive: false,
        leads: groupLeads,
      }));

    return [...knownGroups, ...unknownGroups].filter(
      (group) => group.leads.length > 0,
    );
  }, [filteredLeads, orderedPipelineStatuses]);

  const toggleGroup = (status: string) => {
    setCollapsedGroups((current) => ({
      ...current,
      [status]: !current[status],
    }));
  };

  const loadData = async (options?: { silent?: boolean }) => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      if (options?.silent) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [leadsResponse, servicesResponse, pipelineResponse] =
        await Promise.all([
        getAffiliateLeads(token, 1, 100),
        getAffiliateServices(token),
        getAffiliatePipelineStatuses(token),
      ]);

      setLeads((leadsResponse?.data || []) as PartnerLeadItem[]);
      setServices((servicesResponse?.data || []) as PartnerServiceItem[]);
      setPipelineStatuses(
        (pipelineResponse?.data ||
          DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS) as PartnerLeadPipelineStatus[],
      );
    } catch (err: any) {
      toast.error(err?.message || "Failed to load leads.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const syncViewport = () => setIsDesktop(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LEAD_VIEW_STORAGE_KEY, viewMode);
  }, [viewMode]);

  const handleCreateLead = async (payload: {
    name: string;
    email: string;
    phone: string;
    projectValue: string;
    nextFollowUpAt: string;
  }) => {
    const token = getPartnerToken();
    if (!token || !selectedServiceId) return;

    try {
      const createPromise = createAffiliateLead(token, {
        ...payload,
        serviceId: selectedServiceId,
        projectValue: payload.projectValue ? Number(payload.projectValue) : 0,
        nextFollowUpAt: payload.nextFollowUpAt || null,
      });
      await toast.promise(createPromise, {
        pending: "Creating lead...",
        success: "Lead created successfully.",
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to create lead.";
          },
        },
      });
      setIsAddLeadModalOpen(false);
      await loadData({ silent: true });
    } catch (err: any) {
      throw err;
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, nextStatus: string) => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const currentLead = leads.find((item) => item.id === leadId);
    if (
      !currentLead ||
      normalizePartnerLeadStatus(currentLead.status) === nextStatus
    )
      return;

    const previousStatus = currentLead.status;

    try {
      setUpdatingLeadId(leadId);

      setLeads((current) =>
        current.map((item) =>
          item.id === leadId ? { ...item, status: nextStatus } : item,
        ),
      );

      const updatePromise = updateAffiliateLead(token, leadId, {
        status: nextStatus,
      });
      await toast.promise(updatePromise, {
        pending: "Updating lead status...",
        success: `Lead status updated to ${nextStatus}.`,
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to update lead status.";
          },
        },
      });
      await loadData({ silent: true });
    } catch (err: any) {
      setLeads((current) =>
        current.map((item) =>
          item.id === leadId ? { ...item, status: previousStatus } : item,
        ),
      );
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleKanbanDrop = async (targetStatus: string) => {
    if (!draggingLeadId) return;

    const draggedLead = leads.find((lead) => lead.id === draggingLeadId);
    const currentStatus = normalizePartnerLeadStatus(draggedLead?.status);

    setDragOverStatus(null);
    setDraggingLeadId(null);

    if (!draggedLead || currentStatus === targetStatus) return;
    await handleUpdateLeadStatus(draggingLeadId, targetStatus);
  };

  return (
    <div className="space-y-6">
      <Topbar title="My Leads" />

      <section>
        {/* <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-card">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <div className="grid gap-4 md:grid-cols-2">
              {summaryCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-[22px] px-5 py-5 ${
                    card.tone === "warning"
                      ? "border border-amber-200 bg-amber-50"
                      : "border border-slate-200 bg-slate-50"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      card.tone === "warning" ? "text-amber-700" : "text-slate-500"
                    }`}
                  >
                    {card.title}
                  </p>
                  <p
                    className={`mt-3 text-2xl font-semibold ${
                      card.tone === "warning" ? "text-amber-950" : "text-slate-950"
                    }`}
                  >
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-5 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Follow-up Stages</p>
                  <p className="mt-1 text-sm text-slate-500">Current lead cadence by pipeline day.</p>
                </div>
                <div className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#E30613] sm:inline-flex">
                  Pipeline
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {followUpCards.map((card) => (
                  <div
                    key={card.title}
                    className="rounded-[18px] border border-slate-200 bg-white px-4 py-3"
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      {card.title.replace("Follow-up ", "")}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-xl font-semibold text-slate-950">{card.value}</p>
                      <span className="text-xs text-slate-400">leads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L16.65 16.65M19 11.5C19 15.6421 15.6421 19 11.5 19C7.35786 19 4 15.6421 4 11.5C4 7.35786 7.35786 4 11.5 4C15.6421 4 19 7.35786 19 11.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search leads"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-full border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#E30613] focus:outline-none"
              />
            </div>

            <div className="flex max-md:flex-1 gap-4">
              <select
                className="w-full max-md:flex-1 rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none md:w-auto"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="">All Status</option>
                {activePipelineStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>

              <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="Switch to list view"
                  title="List view"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                    viewMode === "list"
                      ? "bg-[#E30613] text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("kanban")}
                  aria-label="Switch to kanban view"
                  title="Kanban view"
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
                    viewMode === "kanban"
                      ? "bg-[#E30613] text-white"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <KanbanSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSelectModalOpen(true)}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] lg:w-auto"
          >
            Add New Lead
          </button>
        </div>
      </section>

      <section className="w-full min-w-0 overflow-visible rounded-2xl bg-white p-6 shadow-card">
        {isLoading ? (
          <div aria-busy="true" aria-live="polite">
            {viewMode === "list" ? (
              <SkeletonTable
                rows={6}
                columns={6}
                showHeader={false}
                className="!p-0 shadow-none"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonList key={i} items={3} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {viewMode === "list" ? (
              <>
                <div className="space-y-4 md:hidden">
                  {groupedLeads.length > 0 ? (
                    groupedLeads.map((group) => (
                      <div key={group.status}>
                        <button
                          type="button"
                          onClick={() => toggleGroup(group.status)}
                          className="mb-3 flex w-full items-center justify-between gap-3 text-left"
                        >
                          <div className="flex items-center gap-3">
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
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                              {group.label}
                            </div>
                            <span className="text-sm text-slate-500">
                              {group.leads.length}
                            </span>
                          </div>
                        </button>

                        {!collapsedGroups[group.status] ? (
                          <div className="border-t border-slate-200">
                            {group.leads.map((lead) => (
                              <div
                                key={lead.id}
                                className="border-b border-slate-100 py-4 last:border-b-0"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-950">
                                      {lead.name}
                                    </p>
                                    <p className="truncate text-sm text-slate-600">
                                      {lead.email}
                                    </p>
                                  </div>
                                  <LeadStatusDropdown
                                    status={normalizePartnerLeadStatus(
                                      lead.status,
                                    )}
                                    disabled={updatingLeadId === lead.id}
                                    onChange={(nextStatus) =>
                                      handleUpdateLeadStatus(
                                        lead.id,
                                        nextStatus,
                                      )
                                    }
                                    statuses={activePipelineStatuses}
                                  />
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                      Phone
                                    </p>
                                    <p className="mt-1 text-slate-700">
                                      {lead.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                      Service
                                    </p>
                                    <p className="mt-1 text-slate-700">
                                      {lead.serviceName || "-"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                      Value
                                    </p>
                                    <p className="mt-1 text-slate-700">
                                      {formatCurrencyIdr(lead.projectValue)}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-[0.12em] text-slate-400">
                                      Next Follow-up
                                    </p>
                                    <p className="mt-1 text-slate-700">
                                      {formatDateTime(lead.nextFollowUpAt)}
                                    </p>
                                  </div>
                                </div>

                                <div className="mt-3 flex items-center justify-end">
                                  <Link
                                    href={`/my-leads/${lead.id}`}
                                    className="shrink-0 text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
                                  >
                                    View Detail
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                      {isRefreshing ? "Refreshing leads..." : "No leads found."}
                    </div>
                  )}
                </div>

                <div className="hidden md:block">
                  {groupedLeads.length > 0 ? (
                    <div className="space-y-8">
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
                            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700">
                              {group.label}
                            </div>
                            <span className="text-sm text-slate-500">
                              {group.leads.length}
                            </span>
                          </button>

                          {!collapsedGroups[group.status] ? (
                            <div className="overflow-x-auto overflow-y-visible">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
                                    <th className="pb-3">Lead Name</th>
                                    <th className="pb-3">Email</th>
                                    <th className="pb-3">Phone No.</th>
                                    <th className="pb-3">Service Type</th>
                                    <th className="pb-3">Project Value</th>
                                    <th className="pb-3">Next Follow-up</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Notes</th>
                                    <th className="pb-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="text-slate-900">
                                  {group.leads.map((lead) => (
                                    <tr
                                      key={lead.id}
                                      className="border-b border-slate-100 last:border-b-0"
                                    >
                                      <td className="py-4 font-semibold">
                                        {lead.name}
                                      </td>
                                      <td className="py-4">{lead.email}</td>
                                      <td className="py-4">{lead.phone}</td>
                                      <td className="py-4">
                                        {lead.serviceName || "-"}
                                      </td>
                                      <td className="py-4">
                                        {formatCurrencyIdr(lead.projectValue)}
                                      </td>
                                      <td className="py-4">
                                        {formatDateTime(lead.nextFollowUpAt)}
                                      </td>
                                      <td className="py-4">
                                        <LeadStatusDropdown
                                          status={normalizePartnerLeadStatus(
                                            lead.status,
                                          )}
                                          disabled={updatingLeadId === lead.id}
                                          onChange={(nextStatus) =>
                                            handleUpdateLeadStatus(
                                              lead.id,
                                              nextStatus,
                                            )
                                          }
                                          statuses={activePipelineStatuses}
                                        />
                                      </td>
                                      <td className="py-4 text-slate-600">
                                        <Link
                                          href={`/my-leads/${lead.id}`}
                                          className="text-xs font-semibold text-[#E30613] hover:text-[#b1050f]"
                                        >
                                          View Notes
                                        </Link>
                                      </td>
                                      <td className="py-4 text-right">
                                        <Link
                                          href={`/my-leads/${lead.id}`}
                                          className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
                                        >
                                          View Detail
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                      {isRefreshing ? "Refreshing leads..." : "No leads found."}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="max-w-full min-w-0 overflow-hidden">
                <div className="max-w-full overflow-x-auto overflow-y-hidden pb-2">
                  <div className="flex w-max min-w-max items-start gap-4">
                    {activePipelineStatuses.map((statusItem) => {
                      const status = statusItem.value;
                      const columnLeads =
                        groupedLeads.find((group) => group.status === status)
                          ?.leads || [];
                      const isActiveDropZone = dragOverStatus === status;

                      return (
                        <div
                          key={status}
                          className={`flex h-[720px] w-[320px] shrink-0 flex-col rounded-[24px] border p-4 transition ${
                            isActiveDropZone
                              ? "border-[#E30613] bg-rose-50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                          onDragOver={(event) => {
                            if (!isDesktop) return;
                            event.preventDefault();
                            setDragOverStatus(status);
                          }}
                          onDragLeave={() => {
                            if (!isDesktop) return;
                            setDragOverStatus((current) =>
                              current === status ? null : current,
                            );
                          }}
                          onDrop={(event) => {
                            if (!isDesktop) return;
                            event.preventDefault();
                            void handleKanbanDrop(status);
                          }}
                        >
                          <div className="mb-4 flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                {statusItem.label}
                              </p>
                              <p className="text-xs text-slate-500">
                                {columnLeads.length} lead
                                {columnLeads.length > 1 ? "s" : ""}
                              </p>
                            </div>
                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
                              {columnLeads.length}
                            </span>
                          </div>

                          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                            {columnLeads.map((lead) => (
                              <article
                                key={lead.id}
                                draggable={isDesktop}
                                onDragStart={() => setDraggingLeadId(lead.id)}
                                onDragEnd={() => {
                                  setDraggingLeadId(null);
                                  setDragOverStatus(null);
                                }}
                                className={`rounded-[20px] border border-slate-200 bg-white p-4 ${
                                  isDesktop
                                    ? "cursor-grab active:cursor-grabbing"
                                    : ""
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-950">
                                      {lead.name}
                                    </p>
                                    <p className="truncate text-xs text-slate-500">
                                      {lead.email}
                                    </p>
                                  </div>
                                  {!isDesktop ? (
                                    <LeadStatusDropdown
                                      status={normalizePartnerLeadStatus(
                                        lead.status,
                                      )}
                                      disabled={updatingLeadId === lead.id}
                                      onChange={(nextStatus) =>
                                        handleUpdateLeadStatus(
                                          lead.id,
                                          nextStatus,
                                        )
                                      }
                                      triggerMode="button"
                                      buttonLabel="Move"
                                      statuses={activePipelineStatuses}
                                    />
                                  ) : null}
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                  <p className="truncate">
                                    <span className="font-medium text-slate-800">
                                      Phone:
                                    </span>{" "}
                                    {lead.phone}
                                  </p>
                                  <p className="truncate">
                                    <span className="font-medium text-slate-800">
                                      Service:
                                    </span>{" "}
                                    {lead.serviceName || "-"}
                                  </p>
                                  <p>
                                    <span className="font-medium text-slate-800">
                                      Value:
                                    </span>{" "}
                                    {formatCurrencyIdr(lead.projectValue)}
                                  </p>
                                  <p>
                                    <span className="font-medium text-slate-800">
                                      Follow-up:
                                    </span>{" "}
                                    {formatDateTime(lead.nextFollowUpAt)}
                                  </p>
                                </div>

                                <div className="mt-4 flex items-center justify-between gap-3">
                                  <LeadStatusDropdown
                                    status={normalizePartnerLeadStatus(
                                      lead.status,
                                    )}
                                    disabled={updatingLeadId === lead.id}
                                    onChange={(nextStatus) =>
                                      handleUpdateLeadStatus(
                                        lead.id,
                                        nextStatus,
                                      )
                                    }
                                    statuses={activePipelineStatuses}
                                  />
                                  <Link
                                    href={`/my-leads/${lead.id}`}
                                    className="text-sm font-semibold text-[#E30613] hover:text-[#b1050f]"
                                  >
                                    View
                                  </Link>
                                </div>
                              </article>
                            ))}

                            {columnLeads.length === 0 ? (
                              <div className="rounded-[18px] border border-dashed border-slate-200 bg-white px-3 py-5 text-center text-sm text-slate-400">
                                No leads
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <SelectServiceModal
        open={isSelectModalOpen}
        services={serviceOptions}
        selectedServiceId={selectedServiceId}
        onClose={() => setIsSelectModalOpen(false)}
        onConfirm={(serviceId) => {
          setSelectedServiceId(serviceId);
          setIsSelectModalOpen(false);
          setIsAddLeadModalOpen(true);
        }}
        onSelectionChange={(serviceId) => setSelectedServiceId(serviceId)}
      />

      <AddLeadModal
        open={isAddLeadModalOpen}
        serviceName={selectedServiceLabel}
        onClose={() => setIsAddLeadModalOpen(false)}
        onSubmit={handleCreateLead}
      />
    </div>
  );
};

export default MyLeadsPage;
