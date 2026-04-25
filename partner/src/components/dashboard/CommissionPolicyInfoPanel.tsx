"use client";

import {
  formatCurrencyIdr,
  type PartnerCommissionPolicyReference,
  type PartnerCommissionRuleCondition,
  type PartnerCommissionRuleConditionTree,
  type PartnerCommissionPolicyRule,
  type PartnerPerformanceData,
} from "@/lib/partner-portal";

type Props = {
  performance: PartnerPerformanceData | null;
  commissionPolicy?: PartnerCommissionPolicyReference | null;
};

const formatUsd = (value?: number | null) => `$${formatCurrencyIdr(value)}`;

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

const commissionTypeLabel: Record<string, string> = {
  initial: "Initial Commission",
  basic_salary: "Basic Commission",
  sales: "Sales Commission",
};

const triggerLabel: Record<string, string> = {
  lead_won: "When a lead becomes Won",
  daily_cron: "Checked daily",
  monthly_cron: "Checked monthly",
  manual: "Manual admin review",
};

const periodLabel: Record<string, string> = {
  first_month: "First active month",
  current_month: "Current month",
  any_month: "Any time",
};

const opLabel: Record<string, string> = {
  eq: "is",
  neq: "is not",
  gt: "is more than",
  gte: "is at least",
  lt: "is less than",
  lte: "is at most",
  in: "is one of",
  not_in: "is not one of",
};

const fieldLabel: Record<string, string> = {
  closed_clients: "Closed deals",
  total_revenue: "Monthly revenue",
  tenure_days: "Days as partner",
  lead_project_value: "Deal value",
  lead_service_id: "Product / service",
  lead_status: "Lead status",
  lead_vertical_market_id: "Vertical market",
  vertical_market_first_sale: "First seller in vertical market",
  batch_id: "Assigned batch",
  payout_day: "Payout day",
  is_first_month: "First active month",
};

const formatConditionValue = (
  condition: PartnerCommissionRuleCondition,
  policy?: PartnerCommissionPolicyReference | null,
) => {
  const dictionaries = policy?.dictionaries;
  const formatSingle = (value: unknown) => {
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (condition.field === "lead_project_value" || condition.field === "total_revenue") {
      return formatUsd(Number(value || 0));
    }
    if (condition.field === "lead_service_id") {
      return dictionaries?.services?.[String(value)] || String(value ?? "—");
    }
    if (condition.field === "lead_status") {
      return dictionaries?.pipelineStatuses?.[String(value)] || String(value ?? "—");
    }
    if (condition.field === "lead_vertical_market_id") {
      return dictionaries?.verticalMarkets?.[String(value)] || String(value ?? "—");
    }
    if (condition.field === "batch_id") {
      return policy?.batchName || "Your assigned batch";
    }
    return String(value ?? "—");
  };

  if (Array.isArray(condition.value)) {
    return condition.value.map(formatSingle).join(", ");
  }
  return formatSingle(condition.value);
};

const formatCondition = (
  condition: PartnerCommissionRuleCondition,
  policy?: PartnerCommissionPolicyReference | null,
) =>
  `${fieldLabel[condition.field] || condition.field} ${
    opLabel[condition.op] || condition.op
  } ${formatConditionValue(condition, policy)}`;

const flattenConditions = (
  tree?: PartnerCommissionRuleConditionTree | null,
): Array<{ logic: "AND" | "OR"; condition: PartnerCommissionRuleCondition }> => {
  if (!tree?.groups?.length) return [];
  return tree.groups.flatMap((group) =>
    (group.conditions || []).map((condition) => ({
      logic: group.operator || "AND",
      condition,
    })),
  );
};

const describeReward = (
  rule: PartnerCommissionPolicyRule,
  policy?: PartnerCommissionPolicyReference | null,
) => {
  const reward = rule.reward;
  if (!reward || typeof reward !== "object") return "Configured by admin";
  if (reward.type === "fixed") return `${formatUsd(Number(reward.value || 0))} fixed payout`;
  if (reward.type === "percentage") return `${Number(reward.value || 0)}% of deal value`;
  if (reward.type === "percentage_of_revenue") return `${Number(reward.value || 0)}% of monthly revenue`;
  if (reward.type === "service_config") return "Uses product/service commission rate";
  if (reward.type === "batch_initial_config") return "Uses your batch welcome bonus tiers";
  if (reward.type === "tiered") {
    const tiers = Array.isArray(reward.tiers) ? reward.tiers : [];
    if (!tiers.length) return "Tiered payout";
    return tiers
      .map((tier) => {
        const threshold = Number(tier.closedClients ?? tier.min ?? 0);
        return `${threshold}+ closed: ${formatUsd(Number(tier.amount || 0))}`;
      })
      .join(" · ");
  }
  return "Configured by admin";
};

const policyToneByType: Record<string, string> = {
  initial: "border-purple-100 bg-purple-50/50",
  basic_salary: "border-amber-100 bg-amber-50/50",
  sales: "border-blue-100 bg-blue-50/50",
};

type PolicyCardProps = {
  iconPath: string;
  iconBg: string;
  iconColor: string;
  label: string;
  headline: string;
  description: string;
  footer?: React.ReactNode;
};

const PolicyCard = ({
  iconPath,
  iconBg,
  iconColor,
  label,
  headline,
  description,
  footer,
}: PolicyCardProps) => (
  <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
    <div className="flex items-start gap-4">
      <div
        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d={iconPath}
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          {label}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-950">{headline}</h3>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
      </div>
    </div>
    {footer ? (
      <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2.5 text-xs text-slate-700">
        {footer}
      </div>
    ) : null}
  </div>
);

const CommissionPolicyInfoPanel = ({ performance, commissionPolicy }: Props) => {
  if (!performance) return null;

  const { policy, batch } = performance;
  const initialTiers = performance.initialCommission.tiers || [];
  const hasTieredInitialCommission = initialTiers.length > 1;
  const highestInitialTier =
    initialTiers.length > 0 ? initialTiers[initialTiers.length - 1] : null;

  const payoutDay = Number(policy.monthlyPayoutDate || 0);
  const payoutSuffix = payoutDay ? ordinalSuffix(payoutDay) : "";

  const batchThreshold =
    typeof batch.initialCommissionFullClientThreshold === "number" &&
    batch.initialCommissionFullClientThreshold > 0
      ? batch.initialCommissionFullClientThreshold
      : null;
  const defaultThreshold = Number(
    policy.defaultInitialCommissionFullClientThreshold ||
      policy.initialCommissionFullClientThreshold ||
      0,
  );
  const resolvedThreshold = Number(
    policy.initialCommissionFullClientThreshold || defaultThreshold,
  );
  const usesBatchSpecific =
    batchThreshold !== null && batchThreshold !== defaultThreshold;

  return (
    <section className="space-y-4 rounded-[28px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-card sm:p-8">
      <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#E30613]">
            Commission Policy Reference
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            How your commissions are calculated
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            These values govern every payout decision on the platform. Numbers
            below are the currently active thresholds — always sync with the
            Terms &amp; Conditions below for the full legal context.
          </p>
        </div>
        {batch.name ? (
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-[#E30613]">
            <span className="h-2 w-2 rounded-full bg-[#E30613]" />
            Batch: {batch.name}
          </div>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Monthly Payout Date */}
        <PolicyCard
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          iconPath="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"
          label="Monthly Payout Date"
          headline={
            payoutDay ? `Every ${payoutDay}${payoutSuffix} of the month` : "—"
          }
          description="Approved and eligible commissions (sales, initial, and basic salary) are disbursed on this date each month."
          footer={
            <>
              Commissions recorded after this date will be paid in the next
              monthly cycle.
            </>
          }
        />

        {/* Initial Commission Threshold (with batch + fallback context) */}
        <PolicyCard
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          iconPath="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
          label="Initial Commission"
          headline={
            hasTieredInitialCommission
              ? "Tiered milestones in your first active month"
              : resolvedThreshold
                ? `${resolvedThreshold} closed client(s) in the first month`
                : "—"
          }
          description={
            hasTieredInitialCommission
              ? "Your initial commission follows milestone tiers. The highest milestone you reach from closed 'Won' leads in your first active month becomes the initial commission amount you can receive."
              : "Minimum number of 'Won' leads you must close in your first active month to unlock the initial onboarding commission."
          }
          footer={
            <div className="space-y-1.5">
              {initialTiers.length > 0 ? (
                <div className="space-y-1.5">
                  {hasTieredInitialCommission ? (
                    <div className="rounded-lg border border-purple-100 bg-white/90 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.12em] text-purple-700">
                      Active milestone tiers
                    </div>
                  ) : null}
                  {initialTiers.map((tier) => (
                    <div
                      key={`${tier.closedClients}-${tier.amount}`}
                      className="flex items-start gap-2"
                    >
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                      <span>
                        Close {tier.closedClients} client
                        {tier.closedClients > 1 ? "s" : ""}:{" "}
                        <strong className="text-slate-900">
                          {formatUsd(tier.amount)}
                        </strong>
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
              {hasTieredInitialCommission && highestInitialTier ? (
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                  <span>
                    The highest tier currently available for your batch is{" "}
                    <strong className="text-slate-900">
                      {formatUsd(highestInitialTier.amount)}
                    </strong>{" "}
                    at{" "}
                    <strong className="text-slate-900">
                      {highestInitialTier.closedClients}
                    </strong>{" "}
                    closed client
                    {highestInitialTier.closedClients > 1 ? "s" : ""}.
                  </span>
                </div>
              ) : null}
              {usesBatchSpecific ? (
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-500" />
                  <span>
                    {hasTieredInitialCommission ? (
                      <>
                        These tiers are specific to your batch
                        {batch.name ? (
                          <span className="font-medium"> “{batch.name}”</span>
                        ) : null}
                        .
                      </>
                    ) : (
                      <>
                        <strong className="text-slate-900">
                          {batchThreshold}
                        </strong>{" "}
                        — specific to your batch
                        {batch.name ? (
                          <span className="font-medium"> “{batch.name}”</span>
                        ) : null}
                      </>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                  <span>
                    {hasTieredInitialCommission
                      ? "Your batch inherits the default initial commission structure."
                      : "Your batch inherits the global default threshold."}
                  </span>
                </div>
              )}
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                <span>
                  {hasTieredInitialCommission ? (
                    "Initial commission is evaluated only during your first active month."
                  ) : (
                    <>
                      Global fallback:{" "}
                      <strong className="text-slate-900">
                        {defaultThreshold}
                      </strong>{" "}
                      closed client(s)
                    </>
                  )}
                </span>
              </div>
            </div>
          }
        />

        {/* Basic Salary Threshold */}
        <PolicyCard
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          iconPath="M12 6V18M9 9.5C9 8.12 10.12 7 11.5 7H13C14.66 7 16 8.34 16 10C16 11.66 14.66 13 13 13H11C9.34 13 8 14.34 8 16C8 17.66 9.34 19 11 19H13.5C14.88 19 16 17.88 16 16.5"
          label="Basic Salary"
          headline={`${formatUsd(policy.basicSalaryAmount)} per month`}
          description={`Awarded when your monthly closed-lead sales reach the threshold. Min. sales to qualify: ${formatUsd(policy.basicSalarySalesThreshold)}.`}
          footer={
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                <span>
                  Minimum monthly sales:{" "}
                  <strong className="text-slate-900">
                    {formatUsd(policy.basicSalarySalesThreshold)}
                  </strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                <span>
                  Evaluated monthly; credited on the payout date of the next
                  cycle.
                </span>
              </div>
            </div>
          }
        />

        {/* Termination Grace Period */}
        <PolicyCard
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
          iconPath="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 7V13M12 16.5V17"
          label="Termination Grace Period"
          headline={`${policy.terminationGraceDays} day(s) grace`}
          description={`If you miss the minimum performance requirement (≥ ${policy.firstMonthMinimumClosedClients} closed clients in your first active month), the system will flag your account and schedule auto-termination after the grace window.`}
          footer={
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                <span>
                  Min. closed clients required in month one:{" "}
                  <strong className="text-slate-900">
                    {policy.firstMonthMinimumClosedClients}
                  </strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-500" />
                <span>
                  Once the grace window ends, your account will be terminated
                  automatically. Reach out to admin before the due date to
                  appeal.
                </span>
              </div>
            </div>
          }
        />
      </div>

      {commissionPolicy?.rules?.length ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Active Commission Rules
            </p>
            <h3 className="text-lg font-bold text-slate-950">
              Detailed earning conditions
            </h3>
            <p className="text-sm text-slate-600">
              These are the active rules currently used by the system. A
              commission is created only when the trigger and every required
              condition are met.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {commissionPolicy.rules.map((rule) => {
              const conditions = flattenConditions(rule.conditions);
              return (
                <article
                  key={rule.id}
                  className={`rounded-2xl border p-4 ${
                    policyToneByType[rule.commissionType] ||
                    "border-slate-100 bg-slate-50/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {commissionTypeLabel[rule.commissionType] || rule.name}
                      </p>
                      <h4 className="mt-1 text-base font-bold text-slate-950">
                        {rule.name}
                      </h4>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                      {periodLabel[rule.periodScope] || rule.periodScope}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {rule.description || "Commission rule configured by admin."}
                  </p>

                  <div className="mt-4 rounded-xl bg-white/85 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Payout
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {describeReward(rule, commissionPolicy)}
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-white/85 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Trigger
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {triggerLabel[rule.triggerType] || rule.triggerType}
                    </p>
                  </div>

                  <div className="mt-3 rounded-xl bg-white/85 p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                      Conditions
                    </p>
                    {conditions.length ? (
                      <div className="mt-2 space-y-2">
                        {conditions.map(({ condition }, index) => (
                          <div
                            key={`${rule.id}-${condition.field}-${index}`}
                            className="flex gap-2 text-sm leading-5 text-slate-700"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                            <span>{formatCondition(condition, commissionPolicy)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-600">
                        No extra condition. The trigger is enough to qualify.
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <footer className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 sm:px-5">
        Values are pulled live from the platform settings and your assigned
        batch. Contact support if any number here conflicts with what you see
        on your <strong className="text-slate-700">Overview</strong> page.
      </footer>
    </section>
  );
};

export default CommissionPolicyInfoPanel;
