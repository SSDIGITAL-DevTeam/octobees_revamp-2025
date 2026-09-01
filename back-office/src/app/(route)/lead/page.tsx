"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Kanban as KanbanIcon,
  List as ListIcon,
  Mail,
  MoveLeft,
  MoveRight,
  Phone,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import Header from "@/components/layout/header/Header";
import { axiosInstance } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";
import PaginationComponents from "@/components/partials/pagination/Pagination";
import { failedToast } from "@/utils/toast";
import { Lead, LeadStatus, Pagination } from "@/constrant/payload";
import TableLead from "@/components/partials/table/TableLead";
import CreateLeadModal from "@/components/partials/modal/CreateLeadModal";
import { ToastContainer, type ToastMessage } from "@/components/ui/Toast";

type ViewMode = "pipeline" | "table";

interface ColumnConfig {
  id: LeadStatus;
  title: string;
  subtitle: string;
  icon: typeof AlertCircle;
  bgHeader: string;
  textHeader: string;
  badgeBorder: string;
}

const columns: ColumnConfig[] = [
  {
    id: "new",
    title: "New Leads",
    subtitle: "Freshly received inquiries",
    icon: Clock,
    bgHeader: "bg-amber-500/10 border-amber-500/20",
    textHeader: "text-amber-700",
    badgeBorder: "border-amber-200 text-amber-800 bg-amber-50",
  },
  {
    id: "contacted",
    title: "Contacted",
    subtitle: "Initial response sent",
    icon: Mail,
    bgHeader: "bg-blue-500/10 border-blue-500/20",
    textHeader: "text-blue-700",
    badgeBorder: "border-blue-200 text-blue-800 bg-blue-50",
  },
  {
    id: "in_progress",
    title: "In Progress",
    subtitle: "Active discussion / demo",
    icon: Building2,
    bgHeader: "bg-purple-500/10 border-purple-500/20",
    textHeader: "text-purple-700",
    badgeBorder: "border-purple-200 text-purple-800 bg-purple-50",
  },
  {
    id: "won",
    title: "Closed Won",
    subtitle: "Successfully onboarded",
    icon: CheckCircle2,
    bgHeader: "bg-emerald-500/10 border-emerald-500/20",
    textHeader: "text-emerald-700",
    badgeBorder: "border-emerald-200 text-emerald-800 bg-emerald-50",
  },
  {
    id: "lost",
    title: "Closed Lost",
    subtitle: "Cancelled or disqualified",
    icon: XCircle,
    bgHeader: "bg-rose-500/10 border-rose-500/20",
    textHeader: "text-rose-700",
    badgeBorder: "border-rose-200 text-rose-800 bg-rose-50",
  },
];

const statusLabels: Record<LeadStatus, string> = {
  new: "New Lead",
  contacted: "Contacted",
  in_progress: "In Progress",
  won: "Closed Won",
  lost: "Closed Lost",
};

export default function LeadPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("pipeline");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [refetch, setRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<LeadStatus>("new");
  const [draggingLeadId, setDraggingLeadId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [sort, setSort] = useState({
    key: "createdAt",
    direction: true,
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const urlPage = Number(searchParams.get("page")) || 1;
    setPage(urlPage);
  }, [searchParams]);

  const handleChangePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
    setPage(newPage);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const isPipeline = viewMode === "pipeline";
      const response = await axiosInstance.get("/back-office/lead", {
        params: {
          limit: isPipeline ? "all" : 10,
          page: isPipeline ? 1 : page,
          search: searchQuery || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          orderBy: `${sort.key}:${sort.direction ? "desc" : "asc"}`,
        },
      });
      setLeads(response.data?.data || []);
      setPagination(response.data?.pagination || null);
    } catch (error: any) {
      failedToast("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [viewMode, page, searchQuery, statusFilter, sort, refetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find((l) => l.id === leadId);
    const leadName = lead?.name ?? `Lead #${leadId}`;
    const targetLabel = statusLabels[newStatus] || newStatus;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
    );

    addToast({
      title: "Pipeline Updated",
      description: `${leadName} moved to ${targetLabel}`,
      type: "success",
    });

    try {
      await axiosInstance.patch(`/back-office/lead/${leadId}`, { status: newStatus });
    } catch (err: any) {
      fetchData();
      const msg = err.response?.data?.error || err.message || "Failed to update status.";
      addToast({
        title: "Update Failed",
        description: msg,
        type: "error",
      });
    }
  };

  const handleLeadCreated = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
    addToast({
      title: "New Lead Created",
      description: `Lead '${newLead.name}' has been added successfully`,
      type: "success",
    });
    fetchData();
  };

  const getLeadsByStatus = (st: LeadStatus) => {
    return leads.filter((l) => (l.status || "new") === st);
  };

  const moveStage = (currentStatus: LeadStatus, direction: "prev" | "next"): LeadStatus | null => {
    const order: LeadStatus[] = ["new", "contacted", "in_progress", "won", "lost"];
    const idx = order.indexOf(currentStatus);
    if (idx === -1) return null;
    const targetIdx = direction === "next" ? idx + 1 : idx - 1;
    if (targetIdx < 0 || targetIdx >= order.length) return null;
    return order[targetIdx];
  };

  return (
    <main className="w-full flex flex-col gap-8 pb-12">
      <Header title={"Leads"} label={"Lead Management"} />
      <section className="flex flex-col gap-6 p-6 sm:p-8 rounded-3xl bg-white border border-border shadow-sm w-full min-h-[50vh]">
        {/* Header Control Row */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 text-sm text-gray-600">
            <h1 className="text-3xl font-bold text-gray-900">Leads Pipeline</h1>
            <p className="text-xs text-gray-500">Manage and track your lead conversion funnel</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {/* View Switcher */}
            <div className="inline-flex rounded-xl border border-gray-200 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setViewMode("pipeline")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "pipeline"
                    ? "bg-white text-red-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <KanbanIcon className="h-3.5 w-3.5" />
                <span>Pipeline</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === "table"
                    ? "bg-white text-red-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ListIcon className="h-3.5 w-3.5" />
                <span>List View</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 pl-9 pr-3 py-2 text-xs transition-colors focus:border-red-500 focus:outline-none"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition-colors focus:border-red-500 focus:outline-none cursor-pointer"
              >
                <option value="all">Filter: All Statuses</option>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="in_progress">In Progress</option>
                <option value="won">Closed Won</option>
                <option value="lost">Closed Lost</option>
              </select>
            </div>

            {/* Create Lead Button */}
            <button
              onClick={() => {
                setCreateInitialStatus("new");
                setCreateModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-red-700 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-red-800 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create Lead</span>
            </button>
          </div>
        </div>

        {/* View Mode: Pipeline (Kanban) */}
        {viewMode === "pipeline" ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 w-full items-start">
            {columns.map((col) => {
              const colLeads = getLeadsByStatus(col.id);
              const Icon = col.icon;
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggingLeadId) {
                      handleUpdateStatus(draggingLeadId, col.id);
                      setDraggingLeadId(null);
                    }
                  }}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50/60 p-3 min-h-[500px]"
                >
                  {/* Column Header */}
                  <div className={`flex items-center justify-between rounded-xl border px-3 py-2.5 mb-3 ${col.bgHeader}`}>
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${col.textHeader}`} />
                      <span className={`text-xs font-bold truncate ${col.textHeader}`}>{col.title}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${col.badgeBorder}`}>
                        {colLeads.length}
                      </span>
                      <button
                        onClick={() => {
                          setCreateInitialStatus(col.id);
                          setCreateModalOpen(true);
                        }}
                        className="rounded-lg p-1 text-gray-500 hover:bg-white hover:text-gray-900 transition-colors"
                        title={`Add lead to ${col.title}`}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Cards Container */}
                  <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[650px] pr-0.5">
                    {colLeads.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-6 text-center text-xs text-gray-400">
                        <span>No leads here</span>
                      </div>
                    ) : (
                      colLeads.map((item) => {
                        const currentSt = (item.status || "new") as LeadStatus;
                        const prevSt = moveStage(currentSt, "prev");
                        const nextSt = moveStage(currentSt, "next");

                        return (
                          <div
                            key={item.id}
                            draggable
                            onDragStart={() => setDraggingLeadId(item.id)}
                            className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-3 shadow-xs hover:shadow-md hover:border-red-300 transition-all cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-gray-900 group-hover:text-red-700 transition-colors line-clamp-1">
                                {item.name}
                              </span>
                            </div>

                            <div className="mt-1 flex flex-col gap-1 text-[11px] text-gray-500">
                              <div className="flex items-center gap-1.5 truncate">
                                <Mail className="h-3 w-3 shrink-0 text-gray-400" />
                                <span className="truncate">{item.email}</span>
                              </div>

                              <div className="flex items-center gap-1.5 truncate">
                                <Phone className="h-3 w-3 shrink-0 text-gray-400" />
                                <span className="truncate">{item.phone}</span>
                              </div>

                              {item.companyName && (
                                <div className="flex items-center gap-1.5 truncate">
                                  <Building2 className="h-3 w-3 shrink-0 text-gray-400" />
                                  <span className="truncate">{item.companyName}</span>
                                </div>
                              )}
                            </div>

                            {item.message && (
                              <p className="mt-2 rounded-lg bg-gray-50 p-2 text-[10px] text-gray-600 line-clamp-2 italic">
                                "{item.message}"
                              </p>
                            )}

                            {/* Card Footer */}
                            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400">
                              <span className="truncate">Src: {item.from || "manual"}</span>
                              <div className="flex items-center gap-1">
                                {prevSt && (
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, prevSt)}
                                    className="rounded p-1 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                    title={`Move to ${statusLabels[prevSt]}`}
                                  >
                                    <MoveLeft className="h-3 w-3" />
                                  </button>
                                )}
                                {nextSt && (
                                  <button
                                    onClick={() => handleUpdateStatus(item.id, nextSt)}
                                    className="rounded p-1 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                                    title={`Move to ${statusLabels[nextSt]}`}
                                  >
                                    <MoveRight className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode: Table List */
          <div className="w-full flex flex-col gap-6">
            <TableLead
              refetch={refetch}
              leads={leads}
              setSort={setSort}
              sort={sort}
              setRefetch={setRefetch}
              onUpdateStatus={handleUpdateStatus}
            />

            {pagination && (
              <PaginationComponents
                handleNext={() => {
                  if (page < pagination.totalPages) handleChangePage(page + 1);
                }}
                handlePrev={() => {
                  if (page > 1) handleChangePage(page - 1);
                }}
                page={page}
                setPage={handleChangePage}
                totalPage={pagination.totalPages || 1}
                totalData={pagination.total || 0}
              />
            )}
          </div>
        )}
      </section>

      {/* Modals & Toasts */}
      <CreateLeadModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleLeadCreated}
        initialStatus={createInitialStatus}
      />

      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </main>
  );
}
