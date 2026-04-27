"use client";

import { useMemo, useState } from "react";

import {
  formatCurrencyGlobal,
  formatDate,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";
import { useCurrency } from "@/store/currency";

type PerformanceRankingPanelProps = {
  performance: PartnerPerformanceData | null;
  showInsights?: boolean;
};

const statusCopy: Record<
  PartnerPerformanceData["initialCommission"]["status"],
  string
> = {
  eligible: "Initial commission eligible from this batch setting",
  not_eligible: "Initial commission not eligible yet",
  disabled: "Initial commission is not enabled for this batch",
};

const terminationCopy: Record<
  PartnerPerformanceData["termination"]["status"],
  string
> = {
  good_standing: "Good standing",
  termination_pending: "Termination pending",
  terminated: "Terminated",
};

const formatCurrency = (value?: number | null) => formatCurrencyGlobal(value);

const getFirstName = (text: string) => {
  if (!text) return "";
  return text.trim().split(/\s+/)[0] || text;
};

const censorAmount = (amount: number) => {
  if (!amount) return formatCurrency(0);

  let digitCount = 0;
  return formatCurrency(amount).replace(/\d/g, (match) => {
    digitCount += 1;
    return digitCount === 1 ? match : "x";
  });
};

const podiumCardStyles = {
  1: {
    container:
      "order-2 md:order-2 md:-mt-8 border-amber-300 bg-gradient-to-b from-amber-50 to-white",
    badge: "bg-amber-500 text-white",
    pillar: "h-36 bg-amber-500/90",
  },
  2: {
    container:
      "order-1 md:order-1 border-slate-300 bg-gradient-to-b from-slate-50 to-white",
    badge: "bg-slate-500 text-white",
    pillar: "h-28 bg-slate-400/90",
  },
  3: {
    container:
      "order-3 md:order-3 border-orange-200 bg-gradient-to-b from-orange-50 to-white",
    badge: "bg-orange-500 text-white",
    pillar: "h-20 bg-orange-400/90",
  },
} as const;

const PerformanceRankingPanel = ({
  performance,
  showInsights = true,
}: PerformanceRankingPanelProps) => {
  useCurrency();
  const [rankingView, setRankingView] = useState<"podium" | "list">("podium");
  const leaderboard = useMemo(
    () => performance?.ranking?.leaderboard ?? [],
    [performance?.ranking?.leaderboard],
  );
  const podiumLeaders = useMemo(
    () => leaderboard.filter((entry) => entry.rank <= 3),
    [leaderboard],
  );
  const remainingLeaders = useMemo(
    () => leaderboard.filter((entry) => entry.rank > 3),
    [leaderboard],
  );

  if (!performance) return null;

  const {
    policy,
    currentMonth,
    initialCommission,
    ranking,
    termination,
    batch,
  } = performance;
  const displayedInitialCommission = initialCommission.configuredAmount;
  const nextInitialTier = initialCommission.nextTier;
  const nextTierRemaining = nextInitialTier
    ? Math.max(
        0,
        nextInitialTier.closedClients - initialCommission.closedClients,
      )
    : 0;

  const renderLeaderboardTable = (
    entries: typeof leaderboard,
    emptyMessage: string,
  ) => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase text-[#4B0005]">
            <th className="pb-3">Rank</th>
            <th className="pb-3">Partner</th>
            <th className="pb-3">Closed</th>
            <th className="pb-3">Sales</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-900">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr key={entry.affiliateId}>
                <td className="py-4 font-semibold">#{entry.rank}</td>
                <td className="py-4">
                  <p className="font-semibold">
                    {getFirstName(entry.partnerName)}
                  </p>
                </td>
                <td className="py-4">{entry.closedClients}</td>
                <td className="py-4">{censorAmount(entry.salesAmount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="py-6 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="space-y-4">
      {showInsights ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-lg bg-white p-5 shadow-card">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E30613]">
                  Threshold Basic Salary
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-950">
                  {formatCurrency(policy.basicSalaryAmount)}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Minimum sales {formatCurrency(policy.basicSalarySalesThreshold)}{" "}
                  per month
                </p>
              </div>
              <div className="space-y-2">
                <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  Current Rank in this Month:{" "}
                  <span className="font-semibold text-slate-950">
                    {ranking.partnerRank ? `#${ranking.partnerRank}` : "-"}
                  </span>
                </div>
                {policy.monthlyPayoutDate ? (
                  <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
                    Payout date:{" "}
                    <span className="font-semibold text-blue-900">
                      Every {policy.monthlyPayoutDate}
                      {policy.monthlyPayoutDate === 1
                        ? "st"
                        : policy.monthlyPayoutDate === 2
                          ? "nd"
                          : policy.monthlyPayoutDate === 3
                            ? "rd"
                            : "th"}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  Sales progress
                </span>
                <span className="font-semibold text-slate-950">
                  {currentMonth.progressPercent}%
                </span>
              </div>
              <div className="mt-2 h-3 rounded-md bg-slate-100">
                <div
                  className="h-3 rounded-md bg-[#E30613]"
                  style={{ width: `${currentMonth.progressPercent}%` }}
                />
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-slate-500">Closed clients</p>
                  <p className="font-semibold text-slate-950">
                    {currentMonth.closedClients}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Sales amount</p>
                  <p className="font-semibold text-slate-950">
                    {formatCurrency(currentMonth.salesAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Remaining</p>
                  <p className="font-semibold text-slate-950">
                    {formatCurrency(currentMonth.remainingSales)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E30613]">
              Initial Commission
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              {formatCurrency(displayedInitialCommission)}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {initialCommission.status === "disabled"
                ? statusCopy.disabled
                : initialCommission.status === "not_eligible"
                  ? nextInitialTier
                    ? `Next tier unlocks at ${nextInitialTier.closedClients} closed client(s) in month one`
                    : `Available after ${batch.targetClosedClients} closed client(s) in month one`
                  : statusCopy[initialCommission.status]}
            </p>

            <div className="mt-5 space-y-3 text-sm">
              {batch.name && (
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Batch</span>
                  <span className="font-semibold text-slate-950">
                    {batch.name}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">
                  First month closed clients
                </span>
                <span className="font-semibold text-slate-950">
                  {initialCommission.closedClients}/
                  {nextInitialTier?.closedClients || batch.targetClosedClients}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Configured from batch</span>
                <span className="font-semibold text-slate-950">
                  {formatCurrency(initialCommission.configuredAmount)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Current eligible amount</span>
                <span className="font-semibold text-slate-950">
                  {formatCurrency(initialCommission.eligibleAmount)}
                </span>
              </div>
              {nextInitialTier ? (
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">Next tier</span>
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(nextInitialTier.amount)} after{" "}
                    {nextTierRemaining} more close
                    {nextTierRemaining === 1 ? "" : "s"}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold text-slate-950">
                  {terminationCopy[termination.status]}
                </span>
              </div>
              {termination.terminationDueAt ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                  Auto termination date:{" "}
                  {formatDate(termination.terminationDueAt)}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      <div className="rounded-lg bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#E30613]">
              Ranking Board
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-950">
              Monthly leaderboard
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <p className="text-sm text-slate-500">
              Period {formatDate(currentMonth.periodStart)} -{" "}
              {formatDate(currentMonth.periodEnd)}
            </p>
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setRankingView("podium")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  rankingView === "podium"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Podium
              </button>
              <button
                type="button"
                onClick={() => setRankingView("list")}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  rankingView === "list"
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {rankingView === "podium" ? (
          <div className="mt-14 space-y-6">
            {podiumLeaders.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-end">
                {podiumLeaders
                  .slice()
                  .sort((a, b) => {
                    const order = { 2: 0, 1: 1, 3: 2 } as Record<
                      number,
                      number
                    >;
                    return (
                      (order[a.rank] ?? a.rank) - (order[b.rank] ?? b.rank)
                    );
                  })
                  .map((entry) => {
                    const style =
                      podiumCardStyles[
                        entry.rank as keyof typeof podiumCardStyles
                      ] || podiumCardStyles[3];

                    return (
                      <div key={entry.affiliateId} className={style.container}>
                        <div className="overflow-hidden rounded-[28px] border p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${style.badge}`}
                              >
                                #{entry.rank}
                              </p>
                              <h3 className="mt-3 text-lg font-bold text-slate-950">
                                {getFirstName(entry.partnerName)}
                              </h3>
                            </div>
                            <div className="text-right text-xs text-slate-500">
                              <div>{entry.closedClients} closed</div>
                              <div className="mt-1 font-semibold text-slate-900">
                                {censorAmount(entry.salesAmount)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-5 flex items-end">
                            <div
                              className={`w-full rounded-t-[22px] ${style.pillar}`}
                            >
                              <div className="flex h-full items-end justify-center px-4 pb-4 text-center text-sm font-semibold text-white">
                                Rank {entry.rank}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No ranked sales yet this month.
              </div>
            )}

            {remainingLeaders.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Other Rankings
                  </h3>
                  <p className="text-xs text-slate-400">Rank 4 and below</p>
                </div>
                {renderLeaderboardTable(
                  remainingLeaders,
                  "No additional ranked partners this month.",
                )}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="mt-5">
            {renderLeaderboardTable(
              leaderboard,
              "No ranked sales yet this month.",
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PerformanceRankingPanel;
