"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import LeadStatusDropdown from "@/components/leads/LeadStatusDropdown";
import EditLeadModal from "@/components/modals/EditLeadModal";
import LeadNotesPanel from "@/components/leads/LeadNotesPanel";
import { Shimmer, SkeletonCard } from "@/components/ui/Shimmer";
import {
  formatCurrencyIdr,
  formatDate,
  formatDateTime,
  getPartnerToken,
  DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS,
  normalizePartnerLeadStatus,
  type PartnerLeadActivityItem,
  type PartnerLeadItem,
  type PartnerLeadPipelineStatus,
  type PartnerServiceItem,
} from "@/lib/partner-portal";
import {
  deleteAffiliateLead,
  getAffiliateLeadActivities,
  getAffiliateLeadDetail,
  getAffiliatePipelineStatuses,
  getAffiliateServices,
  updateAffiliateLead,
} from "@/services/dashboardService";

type LeadDetailPageProps = {
  params: {
    id: string;
  };
};

const LeadDetailPage = ({ params }: LeadDetailPageProps) => {
  const router = useRouter();
  const [lead, setLead] = useState<PartnerLeadItem | null>(null);
  const [activities, setActivities] = useState<PartnerLeadActivityItem[]>([]);
  const [services, setServices] = useState<PartnerServiceItem[]>([]);
  const [pipelineStatuses, setPipelineStatuses] = useState<
    PartnerLeadPipelineStatus[]
  >(DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  const loadLead = useCallback(async () => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading(true);
      const [leadResponse, servicesResponse, pipelineResponse] = await Promise.all([
        getAffiliateLeadDetail(token, params.id),
        getAffiliateServices(token),
        getAffiliatePipelineStatuses(token),
      ]);
      setLead((leadResponse?.data || null) as PartnerLeadItem | null);
      setServices((servicesResponse?.data || []) as PartnerServiceItem[]);
      setPipelineStatuses(
        (pipelineResponse?.data ||
          DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS) as PartnerLeadPipelineStatus[],
      );
      const activitiesResponse = await getAffiliateLeadActivities(token, params.id);
      setActivities((activitiesResponse?.data || []) as PartnerLeadActivityItem[]);
    } catch (err: any) {
      toast.error(err?.message || "Failed to load lead detail.");
    } finally {
      setIsLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const handleUpdateLead = async (payload: {
    name: string;
    email: string;
    phone: string;
    serviceId?: string;
    serviceType?: string;
    projectValue?: string;
    status?: string;
    nextFollowUpAt?: string;
  }) => {
    const token = getPartnerToken();
    if (!token || !lead) return;

    try {
      const updatePromise = updateAffiliateLead(token, lead.id, {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        serviceId: payload.serviceId || undefined,
        projectValue: payload.projectValue ? Number(payload.projectValue) : 0,
        status: payload.status || undefined,
        nextFollowUpAt: payload.nextFollowUpAt || null,
      });
      await toast.promise(updatePromise, {
        pending: "Saving lead changes...",
        success: "Lead updated successfully.",
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to update lead.";
          },
        },
      });
      setIsEditModalOpen(false);
      await loadLead();
    } catch (err: any) {
      throw err;
    }
  };

  const confirmDeleteLead = () =>
    new Promise<boolean>((resolve) => {
      const toastId = toast(
        ({ closeToast }) => (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-950">Delete this lead?</p>
            <p className="text-sm text-slate-600">
              This action will remove the lead record from your pipeline.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  resolve(false);
                  closeToast?.();
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resolve(true);
                  closeToast?.();
                }}
                className="rounded-full bg-[#E30613] px-4 py-2 text-xs font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ),
        {
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          closeButton: false,
        },
      );

      return toastId;
    });

  const handleDeleteLead = async () => {
    if (!lead) return;
    const confirmed = await confirmDeleteLead();
    if (!confirmed) return;

    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      await toast.promise(deleteAffiliateLead(token, lead.id), {
        pending: "Deleting lead...",
        success: "Lead deleted successfully.",
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to delete lead.";
          },
        },
      });
      router.push("/my-leads");
    } catch (err: any) {
      return;
    }
  };

  const handleUpdateLeadStatus = async (nextStatus: string) => {
    const token = getPartnerToken();
    if (!token || !lead || normalizePartnerLeadStatus(lead.status) === nextStatus) return;

    const previousStatus = lead.status;

    try {
      setIsStatusUpdating(true);
      setLead({ ...lead, status: nextStatus });
      const updatePromise = updateAffiliateLead(token, lead.id, { status: nextStatus });
      await toast.promise(updatePromise, {
        pending: "Updating lead status...",
        success: `Lead status updated to ${nextStatus}.`,
        error: {
          render({ data }) {
            return (data as Error)?.message || "Failed to update lead status.";
          },
        },
      });
      await loadLead();
    } catch (err: any) {
      setLead({ ...lead, status: previousStatus });
    } finally {
      setIsStatusUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Topbar title="Leads Detail" />

      <section className="rounded-2xl px-0 py-2 sm:px-2 sm:py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <nav className="mt-1 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/my-leads"
                    className="font-medium text-[#E30613] hover:text-[#b1050f]"
                  >
                    My Leads
                  </Link>
                </li>
                <li className="text-slate-300">/</li>
                <li className="text-slate-700">
                  Leads Detail {lead?.name ? `(${lead.name})` : ""}
                </li>
              </ol>
            </nav>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              disabled={!lead}
              className="inline-flex w-full items-center justify-center rounded-full border border-transparent bg-[#FFC72C] px-5 py-3 text-sm font-semibold text-[#4B0005] transition hover:bg-[#f3b40b] disabled:opacity-50 sm:w-auto"
            >
              Edit Lead
            </button>
            <button
              type="button"
              onClick={handleDeleteLead}
              disabled={!lead}
              className="inline-flex w-full items-center justify-center rounded-full border border-[#E30613] px-5 py-3 text-sm font-semibold text-[#E30613] transition hover:bg-[#fff1f2] disabled:opacity-50 sm:w-auto"
            >
              Delete Lead
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-card sm:p-6">
        {isLoading ? (
          <div aria-busy="true" aria-live="polite">
            <Shimmer className="h-6 w-2/5" />
            <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-8">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                >
                  <Shimmer className="h-3 w-24" />
                  <Shimmer className="mt-3 h-4 w-4/5" />
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SkeletonCard rows={4} headerLines={1} />
              <SkeletonCard rows={4} headerLines={1} />
            </div>
          </div>
        ) : lead ? (
          <>
            <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">Detail : {lead.name}</h3>

            <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-x-8 sm:gap-y-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 lg:gap-y-8">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Lead Name</p>
                <p className="mt-1 font-semibold text-slate-900">{lead.name}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Email Address</p>
                <p className="mt-1 break-all text-slate-900">{lead.email}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Phone No.</p>
                <p className="mt-1 text-slate-900">{lead.phone}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Service Type</p>
                <p className="mt-1 font-semibold text-[#E30613]">{lead.serviceName || "-"}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Project Value</p>
                <p className="mt-1 text-slate-900">{formatCurrencyIdr(lead.projectValue)}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Status</p>
                <p className="mt-2">
                  <LeadStatusDropdown
                    status={normalizePartnerLeadStatus(lead.status)}
                    disabled={isStatusUpdating}
                    onChange={handleUpdateLeadStatus}
                    statuses={pipelineStatuses.filter((status) => status.isActive)}
                  />
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Next Follow-up</p>
                <p className="mt-1 text-slate-900">{formatDateTime(lead.nextFollowUpAt)}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Created At</p>
                <p className="mt-1 text-slate-900">{formatDate(lead.createdAt)}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Last update</p>
                <p className="mt-1 text-slate-900">{formatDate(lead.updatedAt || lead.createdAt)}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Last Contact</p>
                <p className="mt-1 text-slate-900">{formatDateTime(lead.lastContactAt)}</p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <p className="text-sm text-slate-500">Last Status Change</p>
                <p className="mt-1 text-slate-900">{formatDateTime(lead.lastStatusChangedAt)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-slate-900">Activity Timeline</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Keep track of status changes, CRM notes, and follow-up updates for this lead.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {activity.actionType.replace(/_/g, " ")}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {activity.note || "Lead activity recorded"}
                          </p>
                          {(activity.fromStatus || activity.toStatus) ? (
                            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                              {activity.fromStatus || "No previous status"} → {activity.toStatus || "No new status"}
                            </p>
                          ) : null}
                        </div>
                        <div className="text-xs text-slate-400">
                          {formatDateTime(activity.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                    No activity has been recorded yet.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-sm text-slate-500">Lead data not found.</div>
        )}
      </section>

      {lead ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <LeadNotesPanel leadId={params.id} />
        </section>
      ) : null}

      {lead ? (
        <EditLeadModal
          open={isEditModalOpen}
          lead={{
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            serviceId: lead.serviceId,
            serviceType: lead.serviceName,
            projectValue: String(lead.projectValue ?? ""),
            status: lead.status,
            nextFollowUpAt: lead.nextFollowUpAt ? new Date(lead.nextFollowUpAt).toISOString().slice(0, 16) : "",
          }}
          services={services.map((service) => ({ id: service.id, name: service.name }))}
          pipelineStatuses={pipelineStatuses.filter((status) => status.isActive)}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateLead}
        />
      ) : null}
    </div>
  );
};

export default LeadDetailPage;
