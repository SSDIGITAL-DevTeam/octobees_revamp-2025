"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Topbar from "@/components/layout/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import Badge from "@/components/ui/Badge";
import {
  SkeletonStatsGrid,
  SkeletonTable,
} from "@/components/ui/Shimmer";
import {
  formatCurrencyGlobal,
  formatDate,
  getCommissionStatusVariant,
  getCommissionTypeLabel,
  getCommissionTypeBadgeClass,
  getPartnerToken,
  type PartnerCommissionItem,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";
import { useCurrency } from "@/store/currency";
import {
  getAffiliateCommissions,
  getAffiliatePerformance,
} from "@/services/dashboardService";

type CommissionTypeFilter = "all" | "sales" | "initial" | "basic_salary";
type CommissionStatusFilter = "all" | "Paid" | "Pending Transfer" | "Rejected";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";
const API_ORIGIN = BASE_URL.replace(/\/api\/v\d+\/?$/, "");

const buildProofAbsoluteUrl = (proofUrl?: string | null) => {
  if (!proofUrl) return "";
  if (/^https?:\/\//i.test(proofUrl)) return proofUrl;
  return `${API_ORIGIN}${proofUrl}`;
};

const formatAmount = (value?: number | null) => {
  return formatCurrencyGlobal(value);
};

const ordinalSuffix = (day: number) => {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const formatPeriodLabel = (
  commissionType?: string | null,
  period?: string | null,
  createdAt?: string | null,
) => {
  if (period && /^\d{4}-\d{2}$/.test(period)) {
    const [yearStr, monthStr] = period.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const date = new Date(Date.UTC(year, month, 1));
    return date.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }
  if (commissionType === "sales" && createdAt) {
    return formatDate(createdAt);
  }
  return "-";
};

const MyCommissionsPage = () => {
  useCurrency(); // re-render when currency changes
  const [typeFilter, setTypeFilter] = useState<CommissionTypeFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<CommissionStatusFilter>("all");
  const [commissions, setCommissions] = useState<PartnerCommissionItem[]>([]);
  const [performance, setPerformance] = useState<PartnerPerformanceData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [proofModal, setProofModal] = useState<{
    open: boolean;
    item: PartnerCommissionItem | null;
  }>({ open: false, item: null });

  useEffect(() => {
    const token = getPartnerToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    let active = true;

    const loadData = async () => {
      try {
        setIsLoading(true);

        const [commissionResponse, performanceResponse] = await Promise.all([
          getAffiliateCommissions(token, { page: 1, limit: 200 }),
          getAffiliatePerformance(token).catch(() => null),
        ]);

        if (!active) return;

        setCommissions(
          (commissionResponse?.data || []) as PartnerCommissionItem[],
        );
        setPerformance(
          (performanceResponse?.data || null) as PartnerPerformanceData | null,
        );
      } catch (err: any) {
        if (!active) return;
        toast.error(err?.message || "Failed to load commission data.");
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return commissions.filter((entry) => {
      if (typeFilter !== "all" && entry.commissionType !== typeFilter) {
        return false;
      }
      if (statusFilter !== "all" && entry.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [commissions, typeFilter, statusFilter]);

  const summary = useMemo(() => {
    let totalPaid = 0;
    let totalPending = 0;
    let totalRejected = 0;
    let countSales = 0;
    let countInitial = 0;
    let countBasic = 0;

    for (const entry of commissions) {
      const amount = Number(entry.amount || 0);
      if (entry.status === "Paid") totalPaid += amount;
      else if (entry.status === "Pending Transfer") totalPending += amount;
      else if (entry.status === "Rejected") totalRejected += amount;

      if (entry.commissionType === "sales") countSales += 1;
      else if (entry.commissionType === "initial") countInitial += 1;
      else if (entry.commissionType === "basic_salary") countBasic += 1;
    }

    return {
      totalPaid,
      totalPending,
      totalRejected,
      countSales,
      countInitial,
      countBasic,
    };
  }, [commissions]);

  const commissionStats = useMemo(
    () => [
      {
        id: "paid",
        title: "Total Paid",
        value: formatAmount(summary.totalPaid),
        subtitle: "Already disbursed",
        accentColor: "#059669",
        images: "/assets/icons/coin-icon.svg",
      },
      {
        id: "pending",
        title: "Pending Transfer",
        value: formatAmount(summary.totalPending),
        subtitle: "Awaiting disbursement",
        images: "/assets/icons/stopwatch-icon.svg",
      },
      {
        id: "sales",
        title: "Sales Commissions",
        value: String(summary.countSales),
        subtitle: "Per closed lead",
        images: "/assets/icons/deal-icon.svg",
      },
      {
        id: "periodic",
        title: "Initial + Basic Salary",
        value: String(summary.countInitial + summary.countBasic),
        subtitle: `${summary.countInitial} initial · ${summary.countBasic} basic`,
        images: "/assets/icons/group-icon.svg",
      },
    ],
    [summary],
  );

  const payoutDate = performance?.policy?.monthlyPayoutDate;

  const handleExportCSV = () => {
    const headers = [
      "Type",
      "Period / Date",
      "Lead / Reference",
      "Service",
      "Amount",
      "Status",
      "Paid Date",
      "Transaction Ref",
    ];

    const rows = filtered.map((entry) => [
      getCommissionTypeLabel(entry.commissionType),
      formatPeriodLabel(entry.commissionType, entry.period, entry.createdAt),
      entry.leadName || (entry.commissionType === "sales" ? "-" : "Monthly payout"),
      entry.serviceName || "-",
      formatAmount(entry.amount),
      entry.status,
      formatDate(entry.paidAt),
      entry.transactionReference || "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "my-commissions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderTypeBadge = (type?: string | null) => (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getCommissionTypeBadgeClass(type)}`}
    >
      {getCommissionTypeLabel(type)}
    </span>
  );

  return (
    <div className="space-y-6">
      <Topbar title="My Commissions" />

      {payoutDate ? (
        <section className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 px-5 py-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-900">
              Disbursement Schedule
            </p>
            <p className="mt-0.5 text-sm text-blue-700">
              Commission payouts are processed every{" "}
              <strong>
                {payoutDate}
                {ordinalSuffix(Number(payoutDate))}
              </strong>{" "}
              of the month. Initial, sales, and basic salary records appear
              here once eligibility is confirmed.
            </p>
          </div>
        </section>
      ) : null}

      {isLoading ? (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          <SkeletonStatsGrid count={4} />
          <SkeletonTable rows={6} columns={6} />
        </div>
      ) : (
      <>
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {commissionStats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-card sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none sm:w-auto"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as CommissionTypeFilter)
              }
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="initial">Initial</option>
              <option value="basic_salary">Basic Salary</option>
            </select>

            <select
              className="w-full rounded-full border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-[#E30613] focus:outline-none sm:w-auto"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as CommissionStatusFilter)
              }
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending Transfer">Pending Transfer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex w-full items-center justify-center rounded-full bg-[#E30613] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b1050f] sm:w-auto"
          >
            Export report
          </button>
        </div>

        <div className="mt-6">
            <>
              {/* Mobile cards */}
              <div className="space-y-4 md:hidden">
                {filtered.length > 0 ? (
                  filtered.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          {renderTypeBadge(entry.commissionType)}
                          <h3 className="truncate text-sm font-semibold text-slate-900">
                            {entry.commissionType === "sales"
                              ? entry.leadName || "-"
                              : formatPeriodLabel(
                                  entry.commissionType,
                                  entry.period,
                                  entry.createdAt,
                                )}
                          </h3>
                          <p className="truncate text-sm text-slate-600">
                            {entry.commissionType === "sales"
                              ? entry.serviceName || "-"
                              : entry.commissionType === "initial"
                                ? "Initial onboarding bonus"
                                : "Monthly basic salary"}
                          </p>
                        </div>
                        <Badge
                          category="payment"
                          variant={getCommissionStatusVariant(entry.status)}
                        >
                          {entry.status}
                        </Badge>
                      </div>
                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>
                          <span className="font-medium text-slate-800">
                            Amount:
                          </span>{" "}
                          {formatAmount(entry.amount)}
                        </p>
                        <p>
                          <span className="font-medium text-slate-800">
                            Recorded:
                          </span>{" "}
                          {formatDate(entry.createdAt)}
                        </p>
                        <p>
                          <span className="font-medium text-slate-800">
                            Paid Date:
                          </span>{" "}
                          {formatDate(entry.paidAt)}
                        </p>
                        {entry.transactionReference ? (
                          <p>
                            <span className="font-medium text-slate-800">
                              Reference:
                            </span>{" "}
                            {entry.transactionReference}
                          </p>
                        ) : null}
                        {entry.status === "Rejected" &&
                        entry.rejectionReason ? (
                          <p className="rounded-lg bg-rose-50 p-2 text-xs text-rose-700">
                            <span className="font-semibold">Reason:</span>{" "}
                            {entry.rejectionReason}
                          </p>
                        ) : null}
                        {entry.proofUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              setProofModal({ open: true, item: entry })
                            }
                            className="text-sm font-semibold text-blue-600 underline"
                          >
                            View proof
                          </button>
                        ) : null}
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                    No commission records found.
                  </div>
                )}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Period / Date</th>
                      <th className="pb-3">Reference</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Paid Date</th>
                      <th className="pb-3">Proof</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-900">
                    {filtered.length > 0 ? (
                      filtered.map((entry) => (
                        <tr key={entry.id}>
                          <td className="py-4">
                            {renderTypeBadge(entry.commissionType)}
                          </td>
                          <td className="py-4">
                            {formatPeriodLabel(
                              entry.commissionType,
                              entry.period,
                              entry.createdAt,
                            )}
                          </td>
                          <td className="py-4">
                            <div className="font-semibold text-slate-900">
                              {entry.commissionType === "sales"
                                ? entry.leadName || "-"
                                : entry.commissionType === "initial"
                                  ? "Initial onboarding bonus"
                                  : "Monthly basic salary"}
                            </div>
                            {entry.commissionType === "sales" &&
                            entry.serviceName ? (
                              <div className="text-xs text-slate-500">
                                {entry.serviceName}
                              </div>
                            ) : null}
                            {entry.transactionReference ? (
                              <div className="text-xs text-slate-500">
                                Ref: {entry.transactionReference}
                              </div>
                            ) : null}
                            {entry.status === "Rejected" &&
                            entry.rejectionReason ? (
                              <div className="mt-1 text-xs text-rose-600">
                                Reason: {entry.rejectionReason}
                              </div>
                            ) : null}
                          </td>
                          <td className="py-4 font-semibold">
                            {formatAmount(entry.amount)}
                          </td>
                          <td className="py-4">
                            <Badge
                              category="payment"
                              variant={getCommissionStatusVariant(entry.status)}
                            >
                              {entry.status}
                            </Badge>
                          </td>
                          <td className="py-4">{formatDate(entry.paidAt)}</td>
                          <td className="py-4">
                            {entry.proofUrl ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setProofModal({ open: true, item: entry })
                                }
                                className="text-sm font-semibold text-blue-600 underline"
                              >
                                View
                              </button>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-6 text-center text-sm text-slate-500"
                        >
                          No commission records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
        </div>
      </section>
      </>
      )}

      {proofModal.open && proofModal.item ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
          onClick={() => setProofModal({ open: false, item: null })}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Payment Proof
                </h3>
                <p className="text-xs text-slate-500">
                  {getCommissionTypeLabel(proofModal.item.commissionType)} ·{" "}
                  {formatAmount(proofModal.item.amount)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setProofModal({ open: false, item: null })}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 6L18 18M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto bg-slate-50 p-4">
              {proofModal.item.proofUrl ? (
                /\.pdf(\?|$)/i.test(proofModal.item.proofUrl) ? (
                  <iframe
                    src={buildProofAbsoluteUrl(proofModal.item.proofUrl)}
                    className="h-[70vh] w-full rounded-lg border"
                    title="Commission proof"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={buildProofAbsoluteUrl(proofModal.item.proofUrl)}
                    alt="Payment proof"
                    className="mx-auto max-h-[70vh] rounded-lg object-contain"
                  />
                )
              ) : (
                <p className="text-center text-sm text-slate-500">
                  No proof uploaded.
                </p>
              )}
            </div>
            {proofModal.item.proofUrl ? (
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-3">
                <a
                  href={buildProofAbsoluteUrl(proofModal.item.proofUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Open in new tab
                </a>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default MyCommissionsPage;
