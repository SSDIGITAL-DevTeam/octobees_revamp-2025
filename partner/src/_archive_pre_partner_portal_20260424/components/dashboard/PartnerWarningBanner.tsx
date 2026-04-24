"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  formatCurrencyIdr,
  formatDate,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";

type Severity = "critical" | "warning" | "info";

type WarningItem = {
  id: string;
  severity: Severity;
  title: string;
  message: string;
  detail?: string;
  cta?: {
    href: string;
    label: string;
  };
};

type Props = {
  performance: PartnerPerformanceData | null;
  /** Extra non-performance warnings, e.g. missing bank account. */
  extraWarnings?: WarningItem[];
};

const DISMISSED_WARNING_STORAGE_KEY = "partner_overview_dismissed_warnings";

const severityConfig: Record<
  Severity,
  {
    wrapper: string;
    badge: string;
    iconBg: string;
    iconColor: string;
    iconPath: string;
    label: string;
  }
> = {
  critical: {
    wrapper: "border-rose-300 bg-rose-50 text-rose-950",
    badge: "bg-rose-600 text-white",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    iconPath:
      "M12 9V13M12 17.01L12.01 16.999M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z",
    label: "Critical",
  },
  warning: {
    wrapper: "border-amber-300 bg-amber-50 text-amber-950",
    badge: "bg-amber-500 text-white",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    iconPath:
      "M12 8V13M12 16V16.01M5.07 19H18.93A2 2 0 0 0 20.66 16L13.73 4A2 2 0 0 0 10.27 4L3.34 16A2 2 0 0 0 5.07 19Z",
    label: "Warning",
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50 text-blue-950",
    badge: "bg-blue-600 text-white",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    iconPath:
      "M12 8.5V12.5M12 16.5V16.51M12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22Z",
    label: "Info",
  },
};

const daysBetween = (iso?: string | null, now: Date = new Date()) => {
  if (!iso) return null;
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) return null;
  const ms = target.getTime() - now.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const formatUsd = (value?: number | null) => `$${formatCurrencyIdr(value)}`;

const buildWarningSignature = (item: WarningItem) =>
  JSON.stringify({
    severity: item.severity,
    title: item.title,
    message: item.message,
    detail: item.detail || "",
    ctaHref: item.cta?.href || "",
    ctaLabel: item.cta?.label || "",
  });

const readDismissedWarnings = (): Record<string, string> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(DISMISSED_WARNING_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeDismissedWarnings = (value: Record<string, string>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    DISMISSED_WARNING_STORAGE_KEY,
    JSON.stringify(value),
  );
};

/**
 * Build a list of partner-facing warnings from the performance dashboard payload.
 * Keeps UI dumb & pure — all thresholds come from the API.
 */
const buildPerformanceWarnings = (
  performance: PartnerPerformanceData,
): WarningItem[] => {
  const warnings: WarningItem[] = [];
  const now = new Date();

  const { policy, currentMonth, initialCommission, termination, batch } =
    performance;

  // ---------- TERMINATED (hard stop) ----------
  if (termination.status === "terminated") {
    warnings.push({
      id: "terminated",
      severity: "critical",
      title: "Your account has been terminated",
      message:
        "This means you can no longer submit new leads. Existing closed leads will still be paid according to policy.",
      detail: termination.terminatedAt
        ? `Terminated on ${formatDate(termination.terminatedAt)}.`
        : undefined,
      cta: {
        href: "/my-profile",
        label: "Contact support",
      },
    });
    return warnings;
  }

  // ---------- TERMINATION PENDING (critical) ----------
  if (termination.status === "termination_pending") {
    const daysLeft = daysBetween(termination.terminationDueAt, now);
    const needed = Math.max(
      0,
      policy.firstMonthMinimumClosedClients - initialCommission.closedClients,
    );
    warnings.push({
      id: "termination-pending",
      severity: "critical",
      title: "Termination scheduled — action required",
      message:
        daysLeft !== null && daysLeft > 0
          ? `You have ${daysLeft} day(s) left before automatic termination.`
          : "You are past the grace period and may be terminated at any time.",
      detail: `To avoid termination, close at least ${needed} more lead(s) as 'Won' before ${
        termination.terminationDueAt
          ? formatDate(termination.terminationDueAt)
          : "the grace window ends"
      }. Grace period is ${policy.terminationGraceDays} day(s).`,
      cta: {
        href: "/my-leads",
        label: "Work on my leads",
      },
    });
  }

  // ---------- FIRST-MONTH SHORTFALL (warning) ----------
  // Only relevant before the first-month minimum is reached AND still inside first month window
  const firstMonthEndDate = new Date(initialCommission.periodEnd);
  const inFirstMonthWindow =
    !Number.isNaN(firstMonthEndDate.getTime()) &&
    firstMonthEndDate.getTime() >= now.getTime();
  const needsMinimum =
    initialCommission.closedClients < policy.firstMonthMinimumClosedClients;

  if (
    inFirstMonthWindow &&
    needsMinimum &&
    termination.status !== "termination_pending"
  ) {
    const daysLeft = daysBetween(initialCommission.periodEnd, now);
    const needed =
      policy.firstMonthMinimumClosedClients - initialCommission.closedClients;
    warnings.push({
      id: "first-month-risk",
      severity: "warning",
      title: "First-month minimum not yet met",
      message: `Close at least ${needed} more lead(s) in your first month to stay in good standing.`,
      detail: `You have ${
        daysLeft !== null && daysLeft > 0 ? `${daysLeft} day(s) left` : "limited time"
      } in your first-month window (ends ${formatDate(initialCommission.periodEnd)}). Missing the minimum will start the ${policy.terminationGraceDays}-day termination grace countdown.`,
      cta: {
        href: "/my-leads",
        label: "Open my leads",
      },
    });
  }

  // ---------- INITIAL COMMISSION NEAR UNLOCK (info) ----------
  if (
    initialCommission.status === "not_eligible" &&
    initialCommission.configuredAmount > 0 &&
    inFirstMonthWindow
  ) {
    const nextTier = initialCommission.nextTier;
    const needed = nextTier
      ? nextTier.closedClients - initialCommission.closedClients
      : batch.targetClosedClients - initialCommission.closedClients;
    if (needed > 0 && needed <= 2 && nextTier) {
      warnings.push({
        id: "initial-commission-near",
        severity: "info",
        title: "Initial commission almost unlocked",
        message: `Close ${needed} more lead(s) in your first month to unlock ${formatUsd(nextTier.amount)} initial commission.`,
        detail: `Current progress: ${initialCommission.closedClients}/${nextTier.closedClients} closed for the next tier.`,
        cta: {
          href: "/my-leads",
          label: "View my leads",
        },
      });
    }
  }

  // ---------- BASIC SALARY SHORTFALL NEAR MONTH-END (warning) ----------
  const currentMonthEnd = new Date(currentMonth.periodEnd);
  const daysLeftInMonth = daysBetween(currentMonth.periodEnd, now);
  if (
    !currentMonth.basicSalaryEligible &&
    daysLeftInMonth !== null &&
    daysLeftInMonth > 0 &&
    daysLeftInMonth <= 7 &&
    !Number.isNaN(currentMonthEnd.getTime())
  ) {
    warnings.push({
      id: "basic-salary-shortfall",
      severity: "warning",
      title: "Basic salary at risk this month",
      message: `You still need ${formatUsd(currentMonth.remainingSales)} in sales to qualify for this month's ${formatUsd(policy.basicSalaryAmount)} basic salary.`,
      detail: `Only ${daysLeftInMonth} day(s) left in the current cycle (ends ${formatDate(currentMonth.periodEnd)}). Current progress: ${currentMonth.progressPercent}%.`,
      cta: {
        href: "/my-leads",
        label: "Push leads to Won",
      },
    });
  }

  // ---------- APPROACHING BASIC SALARY (info) ----------
  if (
    !currentMonth.basicSalaryEligible &&
    currentMonth.progressPercent >= 70 &&
    currentMonth.progressPercent < 100 &&
    (daysLeftInMonth === null || daysLeftInMonth > 7)
  ) {
    warnings.push({
      id: "basic-salary-close",
      severity: "info",
      title: "Close to basic salary threshold",
      message: `You're at ${currentMonth.progressPercent}% of this month's basic salary target.`,
      detail: `Need ${formatUsd(currentMonth.remainingSales)} more in sales to earn ${formatUsd(policy.basicSalaryAmount)} this cycle.`,
    });
  }

  return warnings;
};

const WarningCard = ({
  item,
  onDismiss,
}: {
  item: WarningItem;
  onDismiss: (id: string) => void;
}) => {
  const cfg = severityConfig[item.severity];
  return (
    <article
      role={item.severity === "critical" ? "alert" : "status"}
      className={`flex flex-col gap-3 rounded-2xl border px-5 py-4 shadow-sm sm:flex-row sm:items-start sm:gap-4 ${cfg.wrapper}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${cfg.iconBg} ${cfg.iconColor}`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={cfg.iconPath}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cfg.badge}`}
          >
            {cfg.label}
          </span>
          <h3 className="text-sm font-semibold sm:text-base">{item.title}</h3>
        </div>
        <p className="mt-1 text-sm leading-relaxed opacity-90">
          {item.message}
        </p>
        {item.detail ? (
          <p className="mt-1 text-xs leading-relaxed opacity-80">
            {item.detail}
          </p>
        ) : null}
      </div>

      <div className="flex flex-shrink-0 items-start gap-2 sm:self-center">
        {item.cta ? (
          <Link
            href={item.cta.href}
            className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${
              item.severity === "critical"
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : item.severity === "warning"
                  ? "bg-amber-600 text-white hover:bg-amber-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {item.cta.label}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          aria-label={`Dismiss ${item.title}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-current/15 bg-white/50 text-current/70 transition hover:bg-white/80 hover:text-current"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </article>
  );
};

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

const PartnerWarningBanner = ({ performance, extraWarnings = [] }: Props) => {
  const [dismissedWarnings, setDismissedWarnings] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    setDismissedWarnings(readDismissedWarnings());
  }, []);

  const warnings = useMemo(() => {
    const perf = performance ? buildPerformanceWarnings(performance) : [];
    return [...extraWarnings, ...perf].sort(
      (a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity],
    );
  }, [performance, extraWarnings]);

  useEffect(() => {
    if (Object.keys(dismissedWarnings).length === 0) return;

    const nextDismissedWarnings = { ...dismissedWarnings };
    let hasRemovedStaleEntries = false;

    warnings.forEach((item) => {
      const signature = buildWarningSignature(item);
      const dismissedSignature = dismissedWarnings[item.id];

      if (dismissedSignature && dismissedSignature !== signature) {
        delete nextDismissedWarnings[item.id];
        hasRemovedStaleEntries = true;
      }
    });

    if (!hasRemovedStaleEntries) return;

    setDismissedWarnings(nextDismissedWarnings);
    writeDismissedWarnings(nextDismissedWarnings);
  }, [dismissedWarnings, warnings]);

  const visibleWarnings = useMemo(() => {
    return warnings.filter((item) => {
      const signature = buildWarningSignature(item);
      return dismissedWarnings[item.id] !== signature;
    });
  }, [dismissedWarnings, warnings]);

  if (visibleWarnings.length === 0) return null;

  const dismissWarning = (id: string) => {
    const warning = warnings.find((item) => item.id === id);
    if (!warning) return;

    const next = {
      ...dismissedWarnings,
      [id]: buildWarningSignature(warning),
    };

    setDismissedWarnings(next);
    writeDismissedWarnings(next);
  };

  return (
    <section
      aria-label="Partner alerts"
      className="space-y-3"
      data-testid="partner-warning-banner"
    >
      {visibleWarnings.map((item) => (
        <WarningCard key={item.id} item={item} onDismiss={dismissWarning} />
      ))}
    </section>
  );
};

export default PartnerWarningBanner;
export type { WarningItem };
