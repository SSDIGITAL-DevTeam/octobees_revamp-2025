"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import AvailableServicesTable from "@/components/dashboard/AvailableServicesTable";
import CommissionBreakdownModal from "@/components/dashboard/CommissionBreakdownModal";
import CommissionHistoryTable from "@/components/dashboard/CommissionHistoryTable";
import CurrentLeadsTable from "@/components/dashboard/CurrentLeadsTable";
import PartnerWarningBanner, {
  type WarningItem,
} from "@/components/dashboard/PartnerWarningBanner";
import StatsSection from "@/components/dashboard/StatsSection";
import Topbar from "@/components/layout/Topbar";
import {
  SkeletonCard,
  SkeletonStatsGrid,
  SkeletonTable,
} from "@/components/ui/Shimmer";
import type {
  CommissionHistoryEntry,
  DashboardLead,
  DashboardStat,
  ServiceOffering,
} from "@/data/dashboard";
import {
  formatCurrencyIdr,
  formatCurrencyGlobal,
  formatDate,
  formatServiceCommissionLabel,
  getPartnerToken,
  normalizePartnerLeadStatus,
  DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS,
  type PartnerCommissionItem,
  type PartnerPerformanceData,
  type PartnerLeadItem,
  type PartnerLeadPipelineStatus,
  type PartnerServiceItem,
} from "@/lib/partner-portal";
import {
  getAffiliateCommissions,
  getAffiliateDashboardStat,
  getAffiliatePipelineStatuses,
  getAffiliatePerformance,
  getAffiliateProfile,
  getAffiliateRecentLeads,
  getAffiliateServices,
} from "@/services/dashboardService";
import type { PartnerProfile } from "@/lib/partner-portal";
import { useCurrency } from "@/store/currency";

const DashboardPage = () => {
  const currency = useCurrency();
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [recentLeads, setRecentLeads] = useState<DashboardLead[]>([]);
  const [commissionHistory, setCommissionHistory] = useState<
    CommissionHistoryEntry[]
  >([]);
  const [performance, setPerformance] = useState<PartnerPerformanceData | null>(
    null,
  );
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [totalCommissionRaw, setTotalCommissionRaw] = useState(0);
  const [isCommissionDetailOpen, setIsCommissionDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");

  const uniqueSources = useMemo(() => {
    const sources = new Set(
      recentLeads.map((lead) => lead.source).filter(Boolean),
    );
    return Array.from(sources).sort();
  }, [recentLeads]);

  const commissionBreakdown = useMemo(() => {
    const initialCommissionAmount = Number(
      performance?.initialCommission?.eligibleAmount || 0,
    );
    const basicCommissionAmount = performance?.currentMonth?.basicSalaryEligible
      ? Number(performance?.policy?.basicSalaryAmount || 0)
      : 0;
    const salesCommissionAmount = Math.max(
      0,
      totalCommissionRaw - initialCommissionAmount - basicCommissionAmount,
    );

    return [
      {
        id: "initial-commission",
        label: "Initial commission",
        amount: initialCommissionAmount,
        description:
          "Commission earned after the initial onboarding requirement is fulfilled.",
      },
      {
        id: "basic-commission",
        label: "Basic commission",
        amount: basicCommissionAmount,
        description:
          "Monthly basic commission based on the active performance threshold.",
      },
      {
        id: "sales-commission",
        label: "Sales commission",
        amount: salesCommissionAmount,
        description:
          "Remaining recorded commission generated from closed partner sales.",
      },
    ];
  }, [performance, totalCommissionRaw]);

  const leaderboardPreview = useMemo(
    () => performance?.ranking?.leaderboard?.slice(0, 3) || [],
    [performance],
  );

  useEffect(() => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let active = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const [
          statsResponse,
          servicesResponse,
          leadsResponse,
          commissionResponse,
          profileResponse,
          performanceResponse,
          pipelineResponse,
        ] = await Promise.all([
          getAffiliateDashboardStat(token),
          getAffiliateServices(token),
          getAffiliateRecentLeads(token, 5),
          getAffiliateCommissions(token, 1, 5),
          getAffiliateProfile(token),
          getAffiliatePerformance(token),
          getAffiliatePipelineStatuses(token),
        ]);

        if (!active) return;

        const dashboardData = statsResponse?.data || {};
        const nextTotalCommissionRaw = Number(
          dashboardData.totalCommission?.raw || 0,
        );
        const nextStats: DashboardStat[] = [
          {
            id: "total-commission",
            title: "Total Commission",
            value: dashboardData.totalCommission?.value || formatCurrencyGlobal(0),
            subtitle: "All recorded commission",
            accentColor: "#E30613",
            images: "/assets/icons/coin-icon.svg",
            actionLabel: "View",
            actionAriaLabel: "View total commission breakdown",
            onActionClick: () => setIsCommissionDetailOpen(true),
          },
          {
            id: "pending-commission",
            title: "Pending Commission",
            value:
              dashboardData.pendingCommission?.value || formatCurrencyGlobal(0),
            subtitle: `${dashboardData.pendingCommission?.count || 0} pending transfer`,
            images: "/assets/icons/stopwatch-icon.svg",
          },
          {
            id: "total-leads",
            title: "Total Leads",
            value: String(dashboardData.totalLeads?.raw || 0),
            subtitle: "All submitted partner leads",
            images: "/assets/icons/group-icon.svg",
          },
          {
            id: "closed-leads",
            title: "Closed Leads",
            value: String(dashboardData.closedLeads?.raw || 0),
            subtitle: dashboardData.closedLeads?.conversionRate || "0%",
            images: "/assets/icons/deal-icon.svg",
          },
        ];

        const nextServices: ServiceOffering[] = (
          (servicesResponse?.data || []) as PartnerServiceItem[]
        ).map((service) => ({
          id: service.id,
          name: service.name,
          commission: formatServiceCommissionLabel(service),
          description: service.description,
        }));
        const pipelineStatuses = (
          pipelineResponse?.data || DEFAULT_PARTNER_LEAD_PIPELINE_STATUS_ITEMS
        ) as PartnerLeadPipelineStatus[];
        const pipelineLabelByValue = new Map(
          pipelineStatuses.map((status) => [
            status.value,
            status.label || status.value,
          ]),
        );

        const nextLeads: DashboardLead[] = (
          (leadsResponse?.data || []) as PartnerLeadItem[]
        ).map((lead) => {
          const normalizedStatus = normalizePartnerLeadStatus(lead.status);

          return {
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            serviceType: lead.serviceName || "-",
            status: normalizedStatus as DashboardLead["status"],
            statusLabel: pipelineLabelByValue.get(normalizedStatus) || normalizedStatus,
            remark: "-",
            lastUpdate: formatDate(lead.updatedAt || lead.createdAt),
            source: lead.source || "-",
          };
        });

        const nextCommissionHistory: CommissionHistoryEntry[] = (
          (commissionResponse?.data || []) as PartnerCommissionItem[]
        ).map((item) => ({
          id: item.id,
          date: formatDate(item.paidAt || item.createdAt),
          service: item.serviceName
            ? `${item.serviceName}${item.leadName ? ` - ${item.leadName}` : ""}`
            : item.leadName || "-",
          amount: formatCurrencyGlobal(item.amount),
          status: item.status as CommissionHistoryEntry["status"],
        }));

        setStats(nextStats);
        setServices(nextServices);
        setRecentLeads(nextLeads);
        setCommissionHistory(nextCommissionHistory);
        setProfile((profileResponse?.data || null) as PartnerProfile | null);
        setPerformance(
          (performanceResponse?.data || null) as PartnerPerformanceData | null,
        );
        setTotalCommissionRaw(nextTotalCommissionRaw);
      } catch (err: any) {
        if (!active) return;
        toast.error(err?.message || "Failed to load dashboard overview.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <Topbar />

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <SkeletonStatsGrid count={4} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <SkeletonCard rows={5} headerLines={2} />
            <SkeletonCard rows={6} headerLines={2} />
          </div>
          <SkeletonTable rows={5} columns={5} />
          <SkeletonTable rows={4} columns={4} />
          <SkeletonTable rows={5} columns={5} />
        </div>
      ) : null}

      {!isLoading ? (
        <>
          <PartnerWarningBanner
            performance={performance}
            extraWarnings={
              !profile?.bankAccountCompleted
                ? ([
                    {
                      id: "bank-account-missing",
                      severity: "warning",
                      title: "Bank account details are still missing",
                      message:
                        "Add your bank name, account holder, and account number so commission payouts can be processed without delay.",
                      cta: {
                        href: "/my-profile",
                        label: "Complete bank account",
                      },
                    },
                  ] as WarningItem[])
                : []
            }
          />
          <StatsSection stats={stats} />
          <div className="space-y-4">
            {uniqueSources.length > 0 && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="source-filter"
                  className="text-sm font-medium text-slate-700"
                >
                  Filter by Source:
                </label>
                <select
                  id="source-filter"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition hover:border-slate-400 focus:border-[#E30613] focus:outline-none focus:ring-1 focus:ring-[#E30613]"
                >
                  <option value="">All Sources</option>
                  {uniqueSources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <CurrentLeadsTable
              leads={recentLeads}
              sourceFilter={sourceFilter}
            />
          </div>
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E30613]">
                  Leaderboard
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  Monthly sales ranking
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-slate-600">
                  Track your current position, see the top performers this
                  month, and open the dedicated leaderboard page for the full
                  podium and ranking list.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-700">
                  Your current rank:{" "}
                  <span className="font-semibold text-slate-950">
                    {performance?.ranking?.partnerRank
                      ? `#${performance.ranking.partnerRank}`
                      : "-"}
                  </span>
                </div>
                <Link
                  href="/leaderboard"
                  className="inline-flex items-center justify-center rounded-full bg-[#E30613] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#bb0812]"
                >
                  Open leaderboard
                </Link>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {leaderboardPreview.length > 0 ? (
                leaderboardPreview.map((entry) => (
                  <div
                    key={entry.affiliateId}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm">
                        #{entry.rank}
                      </span>
                      <span className="text-xs text-slate-500">
                        {entry.closedClients} closed
                      </span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-slate-950">
                      {entry.partnerName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Sales {formatCurrencyGlobal(entry.salesAmount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500 md:col-span-3">
                  No ranked sales yet this month.
                </div>
              )}
            </div>
          </section>
          <AvailableServicesTable services={services} />
          <CommissionHistoryTable history={commissionHistory} />
          <CommissionBreakdownModal
            open={isCommissionDetailOpen}
            onClose={() => setIsCommissionDetailOpen(false)}
            items={commissionBreakdown}
            totalAmount={totalCommissionRaw}
          />
        </>
      ) : null}
    </div>
  );
};

export default DashboardPage;
