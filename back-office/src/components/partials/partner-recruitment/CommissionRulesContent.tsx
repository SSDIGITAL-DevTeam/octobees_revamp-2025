"use client";
/* eslint-disable no-nested-ternary, react/no-unescaped-entities */

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock3,
  DollarSign,
  Gift,
  Info,
  Layers,
  Loader2,
  Pencil,
  Percent,
  Plus,
  ScrollText,
  Settings,
  Tag,
  Trash2,
  TrendingUp,
  ToggleLeft,
  ToggleRight,
  X,
  Zap,
  Sparkles,
} from "lucide-react";

import Header from "@/components/layout/header/Header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  listCommissionRules,
  createCommissionRule,
  updateCommissionRule,
  deleteCommissionRule,
  getCommissionRuleLogs,
  getPartnerLeadPipelineStatuses,
  getPartnerServices,
  getPartnerVerticalMarkets,
  type CommissionRule,
  type RuleConditionTree,
  type RuleCondition,
  type RuleReward,
  type CommissionRuleLog,
  type PartnerLeadPipelineStatus,
  type PartnerServiceApiItem,
  type PartnerVerticalMarket,
} from "@/lib/api/partnership/dashboardPartnership";
import { cn } from "@/lib/utils";

// ── Plain-language constants ───────────────────────────────────────────────────

const TRIGGER_OPTIONS = [
  {
    value: "lead_won",
    label: "When a deal is Won",
    description: "Runs every time a lead is marked as Won",
    icon: Zap,
    color: "emerald",
  },
  {
    value: "monthly_cron",
    label: "Every month",
    description: "Auto-runs on your monthly payout date",
    icon: Calendar,
    color: "purple",
  },
  {
    value: "daily_cron",
    label: "Every day",
    description: "Auto-runs at midnight each day",
    icon: Clock3,
    color: "blue",
  },
  {
    value: "manual",
    label: "Manual only",
    description: "Only runs when triggered manually",
    icon: Settings,
    color: "slate",
  },
] as const;

const TRIGGER_COLOR: Record<string, string> = {
  lead_won:     "bg-emerald-50 text-emerald-700 border-emerald-200",
  monthly_cron: "bg-purple-50 text-purple-700 border-purple-200",
  daily_cron:   "bg-blue-50 text-blue-700 border-blue-200",
  manual:       "bg-slate-100 text-slate-600 border-slate-200",
};

const TRIGGER_ICON_BG: Record<string, string> = {
  lead_won:     "bg-emerald-50 text-emerald-600",
  monthly_cron: "bg-purple-50 text-purple-600",
  daily_cron:   "bg-blue-50 text-blue-600",
  manual:       "bg-slate-100 text-slate-500",
};

const REWARD_OPTIONS = [
  {
    type: "fixed",
    label: "Fixed Amount",
    description: "Pay a set amount per qualifying event",
    icon: DollarSign,
    color: "emerald",
  },
  {
    type: "percentage",
    label: "% of Deal Value",
    description: "A percentage of the lead's project value",
    icon: Percent,
    color: "blue",
  },
  {
    type: "percentage_of_revenue",
    label: "% of Revenue",
    description: "A percentage of the partner's total monthly revenue",
    icon: TrendingUp,
    color: "purple",
  },
  {
    type: "tiered",
    label: "Tiered by Deals",
    description: "Different amounts based on how many deals were closed",
    icon: Layers,
    color: "amber",
  },
  {
    type: "service_config",
    label: "Per-Service Rate",
    description: "Uses the commission rate set on each product/service",
    icon: Tag,
    color: "slate",
  },
  {
    type: "batch_initial_config",
    label: "Batch Welcome Bonus",
    description: "Uses the tiered welcome bonus configured per batch",
    icon: Gift,
    color: "rose",
  },
] as const;

const REWARD_CARD_BORDER: Record<string, string> = {
  emerald: "border-emerald-400 bg-emerald-50",
  blue:    "border-blue-400 bg-blue-50",
  purple:  "border-purple-400 bg-purple-50",
  amber:   "border-amber-400 bg-amber-50",
  slate:   "border-slate-400 bg-slate-50",
  rose:    "border-rose-400 bg-rose-50",
};

const REWARD_ICON_BG: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700",
  blue:    "bg-blue-100 text-blue-700",
  purple:  "bg-purple-100 text-purple-700",
  amber:   "bg-amber-100 text-amber-700",
  slate:   "bg-slate-100 text-slate-600",
  rose:    "bg-rose-100 text-rose-700",
};

const CADENCE_OPTIONS = [
  { value: "per_deal",    label: "Once per deal",         description: "Each qualifying deal gets its own commission" },
  { value: "first_month", label: "First month only",      description: "Only applies during the partner's first month" },
  { value: "monthly",     label: "Monthly (this month)",  description: "One record per partner per month" },
  { value: "any_month",   label: "Monthly (any month)",   description: "Per period, applies to any month" },
];

const COMMISSION_TYPE_PRESETS = [
  { value: "sales",        label: "Sales Commission" },
  { value: "initial",      label: "Welcome Bonus" },
  { value: "basic_salary", label: "Monthly Salary" },
  { value: "__custom__",   label: "Custom type…" },
];

const FIELD_OPTIONS = [
  { value: "closed_clients",     label: "Number of closed deals",    numeric: true },
  { value: "total_revenue",      label: "Monthly revenue (total)",   numeric: true },
  { value: "tenure_days",        label: "Days as a partner",         numeric: true },
  { value: "lead_project_value", label: "Deal value (Rp)",           numeric: true },
  { value: "lead_service_id",    label: "Product / Service ID",      numeric: false },
  { value: "lead_status",        label: "Lead status",               numeric: false },
  { value: "lead_vertical_market_id", label: "Vertical market",      numeric: false },
  { value: "vertical_market_first_sale", label: "First seller in vertical market", numeric: false, boolean: true },
  { value: "batch_id",           label: "Partner batch",             numeric: false },
  { value: "payout_day",         label: "Day of month",              numeric: true },
  { value: "is_first_month",     label: "Is partner's first month",  numeric: false, boolean: true },
];

const NUMERIC_FIELDS = new Set(FIELD_OPTIONS.filter((f) => f.numeric).map((f) => f.value));

const OP_LABELS: Record<string, string> = {
  gte: "at least",
  gt:  "more than",
  lte: "at most",
  lt:  "less than",
  eq:  "is exactly",
  neq: "is not",
  in:      "is one of",
  not_in:  "is not one of",
};

// ── Converter helpers ──────────────────────────────────────────────────────────

type Cadence = "per_deal" | "first_month" | "monthly" | "any_month";

const toCadence = (scope: string, periodScope: string): Cadence => {
  if (scope === "per_lead") return "per_deal";
  if (periodScope === "first_month") return "first_month";
  if (periodScope === "current_month") return "monthly";
  return "any_month";
};

const fromCadence = (c: Cadence): { scope: CommissionRule["scope"]; periodScope: CommissionRule["periodScope"] } => {
  if (c === "per_deal")    return { scope: "per_lead",   periodScope: "any_month" };
  if (c === "first_month") return { scope: "per_period", periodScope: "first_month" };
  if (c === "monthly")     return { scope: "per_period", periodScope: "current_month" };
  return                          { scope: "per_period", periodScope: "any_month" };
};

const treeToFlat = (tree: RuleConditionTree | null) => ({
  logic: (tree?.groups?.[0]?.operator ?? "AND") as "AND" | "OR",
  conditions: tree?.groups?.[0]?.conditions ?? [] as RuleCondition[],
});

const flatToTree = (logic: "AND" | "OR", conditions: RuleCondition[]): RuleConditionTree => ({
  operator: "AND",
  groups: conditions.length ? [{ operator: logic, conditions }] : [],
});

const toSelectedValues = (value: RuleCondition["value"]): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value) return [String(value)];
  return [];
};

// ── Human-readable summaries ───────────────────────────────────────────────────

const summarizeConditions = (tree: RuleConditionTree | null): string => {
  const all = tree?.groups?.flatMap((g) => g.conditions) ?? [];
  if (!all.length) return "Always applies — no conditions required";
  const parts = all.slice(0, 2).map((c) => {
    const field = FIELD_OPTIONS.find((f) => f.value === c.field)?.label ?? c.field;
    const op    = OP_LABELS[c.op] ?? c.op;
    const val   = c.value === true ? "Yes" : c.value === false ? "No"
      : Array.isArray(c.value) ? c.value.join(", ") : String(c.value);
    return `${field} ${op} ${val}`;
  });
  if (all.length > 2) parts.push(`+${all.length - 2} more`);
  return parts.join(" · ");
};

const summarizeReward = (reward: RuleReward | null): string => {
  if (!reward) return "Not configured";
  if (reward.type === "fixed")                return `Fixed Rp\u202f${Number((reward as { value: number }).value).toLocaleString("id-ID")}`;
  if (reward.type === "percentage")           return `${(reward as { value: number }).value}% of deal value`;
  if (reward.type === "percentage_of_revenue") return `${(reward as { value: number }).value}% of monthly revenue`;
  if (reward.type === "tiered")               return `Tiered — ${(reward as { tiers: unknown[] }).tiers?.length ?? 0} levels`;
  if (reward.type === "service_config")       return "Based on service rate";
  if (reward.type === "batch_initial_config") return "Based on batch bonus tiers";
  return "—";
};

// ── Sub-component: Condition row ───────────────────────────────────────────────

function ConditionRow({
  cond,
  index,
  onUpdate,
  onRemove,
  disableRemove,
  pipelineStatuses,
  services,
  verticalMarkets,
}: {
  cond: RuleCondition;
  index: number;
  onUpdate: (patch: Partial<RuleCondition>) => void;
  onRemove: () => void;
  disableRemove: boolean;
  pipelineStatuses: PartnerLeadPipelineStatus[];
  services: PartnerServiceApiItem[];
  verticalMarkets: PartnerVerticalMarket[];
}) {
  const fieldMeta = FIELD_OPTIONS.find((f) => f.value === cond.field);
  const isNumeric  = NUMERIC_FIELDS.has(cond.field);
  const isBoolean  = fieldMeta?.boolean ?? false;
  const isListOp   = cond.op === "in" || cond.op === "not_in";
  const isLeadStatus = cond.field === "lead_status";
  const isLeadService = cond.field === "lead_service_id";
  const isVerticalMarket = cond.field === "lead_vertical_market_id";
  const activePipelineStatuses = pipelineStatuses.filter(
    (status) => status.isActive,
  );
  const activeServices = services.filter((service) => service.isActive);
  const activeVerticalMarkets = verticalMarkets.filter((market) => market.isActive);

  const numericOps = [
    { value: "gte", label: "at least" },
    { value: "gt",  label: "more than" },
    { value: "lte", label: "at most" },
    { value: "lt",  label: "less than" },
    { value: "eq",  label: "is exactly" },
    { value: "neq", label: "is not" },
  ];
  const textOps = [
    { value: "eq",     label: "is" },
    { value: "neq",    label: "is not" },
    { value: "in",     label: "is one of" },
    { value: "not_in", label: "is not one of" },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold text-slate-400 w-4">{index + 1}.</span>

      {/* Field selector */}
      <select
        className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={cond.field}
        onChange={(e) => {
          const f = e.target.value;
          const numeric = NUMERIC_FIELDS.has(f);
          const boolean = FIELD_OPTIONS.find((option) => option.value === f)?.boolean ?? false;
          onUpdate({
            field: f,
            op: numeric ? "gte" : "eq",
            value: boolean ? true : numeric ? 0 : "",
          });
        }}
      >
        {FIELD_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Operator selector */}
      {!isBoolean && (
        <select
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={cond.op}
          onChange={(e) => onUpdate({ op: e.target.value as RuleCondition["op"] })}
        >
          {(isNumeric ? numericOps : textOps).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {/* Value input */}
      {isBoolean ? (
        <select
          className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700"
          value={String(cond.value)}
          onChange={(e) => onUpdate({ value: e.target.value === "true" })}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      ) : isLeadStatus && isListOp ? (
        <div className="flex min-w-[220px] flex-wrap gap-1">
          {activePipelineStatuses.length > 0 ? (
            activePipelineStatuses.map((status) => {
              const selected = toSelectedValues(cond.value);
              const checked = selected.includes(status.value);
              return (
                <label
                  key={status.value}
                  className={cn(
                    "inline-flex cursor-pointer select-none items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
                    checked
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => {
                      const next = checked
                        ? selected.filter((value) => value !== status.value)
                        : [...selected, status.value];
                      onUpdate({ value: next });
                    }}
                  />
                  {status.label}
                </label>
              );
            })
          ) : (
            <span className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
              No active pipeline status
            </span>
          )}
        </div>
      ) : isLeadStatus ? (
        <select
          className="h-9 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
          disabled={activePipelineStatuses.length === 0}
        >
          <option value="">
            {activePipelineStatuses.length > 0
              ? "Select status..."
              : "No active pipeline status"}
          </option>
          {activePipelineStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      ) : isLeadService && isListOp ? (
        <div className="flex min-w-[220px] flex-wrap gap-1">
          {activeServices.map((service) => {
            const selected = toSelectedValues(cond.value);
            const checked = selected.includes(service.id);
            return (
              <label
                key={service.id}
                className={cn(
                  "inline-flex cursor-pointer select-none items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
                  checked
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((value) => value !== service.id)
                      : [...selected, service.id];
                    onUpdate({ value: next });
                  }}
                />
                {service.name}
              </label>
            );
          })}
        </div>
      ) : isLeadService ? (
        <select
          className="h-9 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
          disabled={activeServices.length === 0}
        >
          <option value="">
            {activeServices.length > 0 ? "Select service..." : "No active service"}
          </option>
          {activeServices.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      ) : isVerticalMarket && isListOp ? (
        <div className="flex min-w-[220px] flex-wrap gap-1">
          {activeVerticalMarkets.map((market) => {
            const value = String(market.id || market.name);
            const selected = toSelectedValues(cond.value);
            const checked = selected.includes(value);
            return (
              <label
                key={value}
                className={cn(
                  "inline-flex cursor-pointer select-none items-center rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
                  checked
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
                )}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? selected.filter((item) => item !== value)
                      : [...selected, value];
                    onUpdate({ value: next });
                  }}
                />
                {market.name}
              </label>
            );
          })}
        </div>
      ) : isVerticalMarket ? (
        <select
          className="h-9 min-w-[180px] rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
          disabled={activeVerticalMarkets.length === 0}
        >
          <option value="">
            {activeVerticalMarkets.length > 0 ? "Select market..." : "No active market"}
          </option>
          {activeVerticalMarkets.map((market) => (
            <option key={market.id || market.name} value={market.id || market.name}>
              {market.name}
            </option>
          ))}
        </select>
      ) : isListOp ? (
        <Input
          className="h-9 min-w-[180px] rounded-xl text-sm"
          placeholder="value1, value2, value3…"
          value={Array.isArray(cond.value) ? (cond.value as string[]).join(", ") : String(cond.value ?? "")}
          onChange={(e) =>
            onUpdate({ value: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
        />
      ) : isNumeric ? (
        <Input
          type="number"
          className="h-9 w-28 rounded-xl text-sm text-center font-semibold"
          value={String(cond.value ?? 0)}
          onChange={(e) => onUpdate({ value: Number(e.target.value) })}
        />
      ) : (
        <Input
          className="h-9 min-w-[160px] rounded-xl text-sm"
          placeholder="enter value…"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
        />
      )}

      <button
        type="button"
        className="ml-auto h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors disabled:opacity-30"
        onClick={onRemove}
        disabled={disableRemove}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Sub-component: Reward value inputs ────────────────────────────────────────

function RewardValueEditor({
  reward,
  onChange,
}: {
  reward: RuleReward;
  onChange: (r: RuleReward) => void;
}) {
  if (reward.type === "fixed" || reward.type === "percentage" || reward.type === "percentage_of_revenue") {
    const val = (reward as { type: string; value: number }).value ?? 0;
    const isFixed = reward.type === "fixed";
    return (
      <div className="flex items-center gap-3 mt-4">
        <div className="relative">
          <span className="absolute left-4 top-3 text-slate-400 font-semibold">
            {isFixed ? "Rp" : "%"}
          </span>
          <Input
            type="number"
            min={0}
            className="h-12 w-44 pl-10 rounded-xl text-lg font-bold"
            value={val}
            onChange={(e) => onChange({ ...reward, value: Number(e.target.value) } as RuleReward)}
          />
        </div>
        <span className="text-sm text-slate-500">
          {reward.type === "fixed" && "paid per qualifying event"}
          {reward.type === "percentage" && "of the deal's project value"}
          {reward.type === "percentage_of_revenue" && "of the partner's total monthly revenue"}
        </span>
      </div>
    );
  }

  if (reward.type === "tiered") {
    const tiers = (reward as { type: "tiered"; tiers: { min: number; max?: number; amount: number }[] }).tiers ?? [];
    const updateTier = (i: number, patch: Partial<{ min: number; amount: number }>) => {
      const next = tiers.map((t, idx) => idx === i ? { ...t, ...patch } : t);
      onChange({ ...reward, tiers: next } as RuleReward);
    };
    const addTier = () => onChange({ ...reward, tiers: [...tiers, { min: (tiers.at(-1)?.min ?? 0) + 1, amount: 0 }] } as RuleReward);
    const removeTier = (i: number) => onChange({ ...reward, tiers: tiers.filter((_, idx) => idx !== i) } as RuleReward);

    return (
      <div className="mt-4 space-y-3">
        <p className="text-sm text-slate-500">
          Set how much a partner earns based on how many deals they closed in the period.
          The <strong>highest matching tier</strong> applies.
        </p>
        {tiers.map((tier, i) => (
          <div key={i} className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-500 w-14 shrink-0">
              Level {i + 1}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">If closed deals ≥</span>
              <Input
                type="number"
                className="h-9 w-20 rounded-xl text-center font-bold"
                min={1}
                value={tier.min}
                onChange={(e) => updateTier(i, { min: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Pay</span>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-semibold">Rp</span>
                <Input
                  type="number"
                  className="h-9 pl-9 w-36 rounded-xl font-bold"
                  min={0}
                  value={tier.amount}
                  onChange={(e) => updateTier(i, { amount: Number(e.target.value) })}
                />
              </div>
            </div>
            <button
              type="button"
              className="ml-auto h-8 w-8 flex items-center justify-center rounded-xl text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors disabled:opacity-30"
              onClick={() => removeTier(i)}
              disabled={tiers.length <= 1}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="rounded-xl border-dashed" onClick={addTier}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Level
        </Button>
      </div>
    );
  }

  if (reward.type === "service_config" || reward.type === "batch_initial_config") {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-dashed border-blue-200 bg-blue-50 px-4 py-4">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 leading-relaxed">
          {reward.type === "service_config"
            ? "The amount is automatically pulled from the commission rate you've set for each product/service (in the Sales Commission section)."
            : "The amount is automatically pulled from the welcome bonus tiers configured for each recruitment batch."}
        </p>
      </div>
    );
  }

  return null;
}

// ── Log Drawer ─────────────────────────────────────────────────────────────────

function RuleLogDrawer({
  ruleId, ruleName, open, onClose,
}: {
  ruleId: string; ruleName: string; open: boolean; onClose: () => void;
}) {
  const [logs, setLogs] = useState<CommissionRuleLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getCommissionRuleLogs(ruleId, { limit: 100 })
      .then((res) => setLogs(res.data.data ?? []))
      .catch(() => toast.error("Failed to load history"))
      .finally(() => setLoading(false));
  }, [open, ruleId]);

  if (!open) return null;

  const outcomeStyle: Record<string, string> = {
    created: "bg-emerald-50 text-emerald-700",
    updated: "bg-blue-50 text-blue-700",
    skipped: "bg-slate-100 text-slate-500",
    error:   "bg-rose-50 text-rose-700",
  };
  const outcomeLabel: Record<string, string> = {
    created: "Commission created",
    updated: "Commission updated",
    skipped: "Skipped",
    error:   "Error",
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Evaluation History
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{ruleName}</h3>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-slate-400">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
            </div>
          ) : logs.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-slate-400">
              <ScrollText className="h-8 w-8 opacity-30" />
              <p className="text-sm">No history yet — this rule hasn't been evaluated.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", outcomeStyle[log.outcome])}>
                    {outcomeLabel[log.outcome] ?? log.outcome}
                  </span>
                  {log.amount !== null && (
                    <span className="text-sm font-bold text-slate-700">
                      Rp {Number(log.amount).toLocaleString("id-ID")}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-slate-400">
                    {new Date(log.evaluatedAt).toLocaleString("id-ID")}
                  </span>
                </div>
                {log.reason && (
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{log.reason}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const CommissionRulesContent = ({
  context = "master-data",
}: {
  context?: "master-data" | "sales-portal";
}) => {
  // List state
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [logDrawer, setLogDrawer] = useState<{ id: string; name: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CommissionRule | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [pipelineStatuses, setPipelineStatuses] = useState<PartnerLeadPipelineStatus[]>([]);
  const [services, setServices] = useState<PartnerServiceApiItem[]>([]);
  const [verticalMarkets, setVerticalMarkets] = useState<PartnerVerticalMarket[]>([]);

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formSaving, setFormSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Form fields
  const [fName, setFName]                 = useState("");
  const [fDesc, setFDesc]                 = useState("");
  const [fTrigger, setFTrigger]           = useState("lead_won");
  const [fCadence, setFCadence]           = useState<Cadence>("per_deal");
  const [fTypePreset, setFTypePreset]     = useState("sales");
  const [fTypeCustom, setFTypeCustom]     = useState("");
  const [fCondLogic, setFCondLogic]       = useState<"AND" | "OR">("AND");
  const [fConds, setFConds]               = useState<RuleCondition[]>([]);
  const [fReward, setFReward]             = useState<RuleReward>({ type: "fixed", value: 0 } as RuleReward);
  const [fActive, setFActive]             = useState(true);
  const [fPriority, setFPriority]         = useState(0);

  // ── Load rules ─────────────────────────────────────────────────────────────

  const loadRules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCommissionRules(showInactive);
      setRules(res.data.data ?? []);
    } catch {
      toast.error("Failed to load commission rules");
    } finally {
      setLoading(false);
    }
  }, [showInactive]);

  useEffect(() => { void loadRules(); }, [loadRules]);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getPartnerLeadPipelineStatuses({ includeInactive: false }).catch(() => null),
      getPartnerServices({ limit: 1000 }).catch(() => null),
      getPartnerVerticalMarkets({ includeInactive: false }).catch(() => null),
    ])
      .then(([statusesRes, servicesRes, verticalMarketsRes]) => {
        if (!cancelled) {
          setPipelineStatuses(statusesRes?.data?.data ?? []);
          setServices(servicesRes?.data?.data ?? []);
          setVerticalMarkets(verticalMarketsRes?.data?.data ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("Failed to load rule reference data");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ── Form helpers ────────────────────────────────────────────────────────────

  const resetForm = () => {
    setFName(""); setFDesc(""); setFTrigger("lead_won"); setFCadence("per_deal");
    setFTypePreset("sales"); setFTypeCustom(""); setFCondLogic("AND"); setFConds([]);
    setFReward({ type: "fixed", value: 0 } as RuleReward); setFActive(true);
    setFPriority(0); setShowAdvanced(false);
  };

  const openCreate = () => { setEditingId(null); resetForm(); setFormOpen(true); };

  const openEdit = (rule: CommissionRule) => {
    setEditingId(rule.id);
    setFName(rule.name);
    setFDesc(rule.description ?? "");
    setFTrigger(rule.triggerType);
    setFCadence(toCadence(rule.scope, rule.periodScope));
    const preset = COMMISSION_TYPE_PRESETS.find(
      (p) => p.value === rule.commissionType && p.value !== "__custom__",
    );
    if (preset) { setFTypePreset(preset.value); setFTypeCustom(""); }
    else         { setFTypePreset("__custom__"); setFTypeCustom(rule.commissionType); }
    const { logic, conditions } = treeToFlat(rule.conditions);
    setFCondLogic(logic); setFConds(conditions);
    setFReward(rule.reward ?? ({ type: "fixed", value: 0 } as RuleReward));
    setFActive(rule.isActive); setFPriority(rule.priority);
    setShowAdvanced(false); setFormOpen(true);
  };

  const handleSave = async () => {
    if (!fName.trim()) { toast.error("Please enter a rule name."); return; }
    const commissionType = fTypePreset === "__custom__" ? fTypeCustom : fTypePreset;
    if (!commissionType.trim()) { toast.error("Please select a commission category."); return; }
    const { scope, periodScope } = fromCadence(fCadence);
    const payload = {
      name: fName,
      description: fDesc || null,
      triggerType: fTrigger as CommissionRule["triggerType"],
      commissionType,
      scope,
      periodScope,
      conditions: flatToTree(fCondLogic, fConds),
      reward: fReward,
      isActive: fActive,
      priority: fPriority,
    };
    setFormSaving(true);
    try {
      if (editingId) {
        await updateCommissionRule(editingId, payload);
        toast.success("Rule updated successfully.");
      } else {
        await createCommissionRule(payload);
        toast.success("Rule created successfully.");
      }
      await loadRules();
      setFormOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save rule.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleToggle = async (rule: CommissionRule) => {
    try {
      await updateCommissionRule(rule.id, { isActive: !rule.isActive });
      await loadRules();
      toast.success(rule.isActive ? "Rule disabled." : "Rule enabled.");
    } catch {
      toast.error("Failed to update rule status.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCommissionRule(deleteTarget.id);
      await loadRules();
      toast.success("Rule deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete rule.");
    } finally {
      setDeleting(false);
    }
  };

  const updateCond = (i: number, patch: Partial<RuleCondition>) =>
    setFConds((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));

  const removeCond = (i: number) =>
    setFConds((prev) => prev.filter((_, idx) => idx !== i));

  const addCond = () =>
    setFConds((prev) => [...prev, { field: "closed_clients", op: "gte", value: 1 }]);

  // ── Derived ─────────────────────────────────────────────────────────────────

  const visibleRules = rules;
  const triggerOpt = (v: string) => TRIGGER_OPTIONS.find((t) => t.value === v);
  const rewardOpt  = (v: string) => REWARD_OPTIONS.find((r) => r.type === v);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex w-full flex-col gap-5 pb-12">
      {/* Page header */}
      <Header
        title="Commission Rules"
        label={
          context === "sales-portal"
            ? "Partner Recruitment System / Sales Portal Management"
            : "Partner Recruitment System / Master Data"
        }
        breadcrumbs={
          context === "sales-portal"
            ? [
                { label: "Partner Recruitment System", href: "/partner-recruitment-system" },
                { label: "Sales Portal Management", href: "/partner-recruitment-system/sales-portal-management" },
                { label: "Commission Rules" },
              ]
            : [
                { label: "Partner Recruitment System", href: "/partner-recruitment-system" },
                { label: "Master Data" },
                { label: "Commission Rules" },
              ]
        }
      />

      {/* Intro card */}
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Commission Rules</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                Set up automatic commission payments for your partners — no technical knowledge needed.
                Each rule defines <strong>when</strong> a payment is triggered, <strong>who</strong> qualifies,
                and <strong>how much</strong> they receive.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={() => setShowInactive((v) => !v)}
            >
              {showInactive ? "Hide disabled" : "Show disabled"}
            </Button>
            <Button
              type="button"
              className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
              onClick={openCreate}
              disabled={loading}
            >
              <Plus className="mr-2 h-4 w-4" /> New Rule
            </Button>
          </div>
        </div>
      </section>

      {/* Rules list */}
      <section className="space-y-3">
        {loading ? (
          <div className="flex h-48 items-center justify-center rounded-[28px] border border-slate-200 bg-white text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading rules…
          </div>
        ) : visibleRules.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-[28px] border border-dashed border-slate-200 bg-white text-slate-400">
            <Sparkles className="h-10 w-10 opacity-30" />
            <div className="text-center">
              <p className="font-semibold text-slate-600">No commission rules yet</p>
              <p className="mt-1 text-sm">Create your first rule to start automating payments.</p>
            </div>
            <Button onClick={openCreate} className="rounded-xl bg-slate-900 text-white hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" /> Create First Rule
            </Button>
          </div>
        ) : (
          visibleRules.map((rule) => {
            const tOpt = triggerOpt(rule.triggerType);
            const TIcon = tOpt?.icon ?? Zap;
            const rOpt = rewardOpt(rule.reward?.type ?? "");
            const isExp = expanded === rule.id;

            return (
              <div
                key={rule.id}
                className={cn(
                  "rounded-[24px] border bg-white shadow-sm transition-all",
                  rule.isActive ? "border-slate-200" : "border-slate-100 opacity-60",
                )}
              >
                {/* Card header */}
                <div
                  className="flex cursor-pointer items-start gap-4 p-5"
                  onClick={() => setExpanded(isExp ? null : rule.id)}
                >
                  {/* Trigger icon */}
                  <div className={cn("h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center", TRIGGER_ICON_BG[rule.triggerType] ?? "bg-slate-100 text-slate-500")}>
                    <TIcon className="h-5 w-5" />
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-900">{rule.name}</p>
                      <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold", TRIGGER_COLOR[rule.triggerType] ?? "bg-slate-100 text-slate-600 border-slate-200")}>
                        {tOpt?.label ?? rule.triggerType}
                      </span>
                      {!rule.isActive && (
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                          Disabled
                        </span>
                      )}
                    </div>
                    {rule.description && (
                      <p className="mt-0.5 text-sm text-slate-500 truncate max-w-lg">{rule.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                      <span>
                        <strong className="text-slate-700">Pays:</strong>{" "}
                        {summarizeReward(rule.reward)}
                      </span>
                      <span className="hidden sm:inline text-slate-300">·</span>
                      <span>
                        <strong className="text-slate-700">Condition:</strong>{" "}
                        {summarizeConditions(rule.conditions)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost" size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400"
                      title="View history"
                      onClick={() => setLogDrawer({ id: rule.id, name: rule.name })}
                    >
                      <ScrollText className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-slate-100"
                      title={rule.isActive ? "Disable rule" : "Enable rule"}
                      onClick={() => handleToggle(rule)}
                    >
                      {rule.isActive
                        ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                        : <ToggleLeft  className="h-5 w-5 text-slate-300" />}
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400"
                      onClick={() => openEdit(rule)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500"
                      onClick={() => setDeleteTarget(rule)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <ChevronDown className={cn("h-4 w-4 text-slate-300 transition-transform ml-1", isExp && "rotate-180")} />
                  </div>
                </div>

                {/* Expanded detail */}
                {isExp && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 rounded-b-[24px]">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {/* Trigger */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Trigger</p>
                        <p className="text-sm font-semibold text-slate-800">{tOpt?.label ?? rule.triggerType}</p>
                        <p className="text-xs text-slate-500 mt-1">{tOpt?.description}</p>
                      </div>
                      {/* Conditions */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Conditions</p>
                        {!rule.conditions?.groups?.length ? (
                          <p className="text-sm text-slate-500">Always applies — no conditions</p>
                        ) : (
                          <div className="space-y-1">
                            {rule.conditions.groups.flatMap((g) => g.conditions).map((c, ci) => {
                              const f = FIELD_OPTIONS.find((fo) => fo.value === c.field)?.label ?? c.field;
                              const o = OP_LABELS[c.op] ?? c.op;
                              const v = Array.isArray(c.value) ? (c.value as string[]).join(", ") : c.value === true ? "Yes" : c.value === false ? "No" : String(c.value);
                              return (
                                <p key={ci} className="text-sm text-slate-700">
                                  <span className="font-medium">{f}</span>{" "}
                                  <span className="text-slate-400">{o}</span>{" "}
                                  <span className="font-semibold">{v}</span>
                                </p>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      {/* Reward */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Payment</p>
                        <p className="text-sm font-bold text-slate-800">{summarizeReward(rule.reward)}</p>
                        {rOpt && (
                          <p className="text-xs text-slate-500 mt-1">{rOpt.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* ── Create / Edit Dialog ────────────────────────────────────────────── */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && !formSaving && setFormOpen(false)}>
        <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
          {/* Dialog header */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100 sticky top-0 bg-white z-10">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {editingId ? "Edit Commission Rule" : "Create Commission Rule"}
              </DialogTitle>
              <DialogDescription className="text-slate-500">
                Fill in the details below. Only the name and payment method are required.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-6 space-y-8">
            {/* ── Section 1: Name ─────────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span>
                <h3 className="font-semibold text-slate-900">Name this rule</h3>
              </div>
              <div className="space-y-3 pl-8">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Rule Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Monthly Sales Bonus, Welcome Bonus, Deal Commission"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    disabled={formSaving}
                    className="rounded-xl h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">
                    Short description <span className="text-slate-400 font-normal">(optional)</span>
                  </Label>
                  <Input
                    placeholder="Describe when this rule applies…"
                    value={fDesc}
                    onChange={(e) => setFDesc(e.target.value)}
                    disabled={formSaving}
                    className="rounded-xl h-11"
                  />
                </div>
              </div>
            </div>

            {/* ── Section 2: Trigger ──────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
                <h3 className="font-semibold text-slate-900">When should this fire?</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 pl-8">
                {TRIGGER_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = fTrigger === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFTrigger(opt.value)}
                      className={cn(
                        "flex items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all",
                        active
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300 bg-white",
                      )}
                    >
                      <div className={cn("h-9 w-9 shrink-0 rounded-xl flex items-center justify-center", active ? "bg-slate-900 text-white" : TRIGGER_ICON_BG[opt.value])}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={cn("text-sm font-semibold", active ? "text-slate-900" : "text-slate-700")}>{opt.label}</p>
                        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{opt.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 3: Conditions ───────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</span>
                <h3 className="font-semibold text-slate-900">Who qualifies?</h3>
                <span className="text-xs text-slate-400 font-normal">(optional)</span>
              </div>
              <div className="pl-8 space-y-3">
                {fConds.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-5 text-center">
                    <p className="text-sm text-slate-500">
                      <span className="font-semibold text-slate-700">No conditions set</span> — this rule will apply to every qualifying event.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 rounded-xl"
                      onClick={addCond}
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add a condition
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Logic toggle */}
                    {fConds.length > 1 && (
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">Match</span>
                        <div className="inline-flex rounded-xl border border-slate-200 overflow-hidden">
                          <button
                            type="button"
                            className={cn("px-4 py-1.5 text-sm font-semibold transition-colors", fCondLogic === "AND" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                            onClick={() => setFCondLogic("AND")}
                          >
                            All conditions
                          </button>
                          <button
                            type="button"
                            className={cn("px-4 py-1.5 text-sm font-semibold transition-colors", fCondLogic === "OR" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                            onClick={() => setFCondLogic("OR")}
                          >
                            Any condition
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Condition rows */}
                    <div className="space-y-2">
                      {fConds.map((cond, i) => (
                        <ConditionRow
                          key={i}
                          cond={cond}
                          index={i}
                          onUpdate={(patch) => updateCond(i, patch)}
                          onRemove={() => removeCond(i)}
                          disableRemove={false}
                          pipelineStatuses={pipelineStatuses}
                          services={services}
                          verticalMarkets={verticalMarkets}
                        />
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-dashed"
                      onClick={addCond}
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add condition
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* ── Section 4: Reward ───────────────────────────────────────── */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">4</span>
                <h3 className="font-semibold text-slate-900">How much to pay?</h3>
              </div>
              <div className="pl-8 space-y-4">
                {/* Reward type cards */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {REWARD_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const active = fReward.type === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => {
                          if (opt.type === "tiered") setFReward({ type: "tiered", tiers: [{ closedClients: 1, min: 1, amount: 0 }] });
                          else if (opt.type === "service_config") setFReward({ type: "service_config" });
                          else if (opt.type === "batch_initial_config") setFReward({ type: "batch_initial_config" });
                          else setFReward({ type: opt.type as "fixed" | "percentage" | "percentage_of_revenue", value: 0 });
                        }}
                        className={cn(
                          "flex flex-col items-start rounded-2xl border-2 p-3 text-left transition-all",
                          active
                            ? REWARD_CARD_BORDER[opt.color]
                            : "border-slate-200 hover:border-slate-300 bg-white",
                        )}
                      >
                        <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-2", active ? REWARD_ICON_BG[opt.color] : "bg-slate-100 text-slate-400")}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-semibold text-slate-800">{opt.label}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500 leading-tight">{opt.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Reward value inputs */}
                <RewardValueEditor reward={fReward} onChange={setFReward} />
              </div>
            </div>

            {/* ── Advanced settings (collapsed) ───────────────────────────── */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setShowAdvanced((v) => !v)}
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700">Advanced Settings</span>
                  <span className="text-xs text-slate-400">(category, priority, frequency)</span>
                </div>
                <ChevronDown className={cn("h-4 w-4 text-slate-400 transition-transform", showAdvanced && "rotate-180")} />
              </button>

              {showAdvanced && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 pb-5 pt-4 space-y-5">
                  {/* Commission category */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Commission category</Label>
                    <p className="text-xs text-slate-400">How this commission will be labeled in payment records.</p>
                    <div className="flex gap-2 flex-wrap">
                      {COMMISSION_TYPE_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setFTypePreset(p.value)}
                          className={cn(
                            "rounded-xl border px-3 py-1.5 text-sm font-medium transition-all",
                            fTypePreset === p.value
                              ? "border-slate-900 bg-slate-900 text-white"
                              : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    {fTypePreset === "__custom__" && (
                      <Input
                        placeholder="e.g. referral_bonus, milestone_reward"
                        value={fTypeCustom}
                        onChange={(e) => setFTypeCustom(e.target.value)}
                        className="mt-2 rounded-xl h-10 font-mono text-sm"
                      />
                    )}
                  </div>

                  {/* Frequency */}
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-slate-700">Calculation frequency</Label>
                    <p className="text-xs text-slate-400">How often a partner can receive this commission.</p>
                    <Select value={fCadence} onValueChange={(v) => setFCadence(v as Cadence)}>
                      <SelectTrigger className="h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CADENCE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            <div>
                              <span className="font-medium">{o.label}</span>
                              <span className="ml-2 text-xs text-slate-400">{o.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5 max-w-[200px]">
                    <Label className="text-sm font-medium text-slate-700">Evaluation order</Label>
                    <p className="text-xs text-slate-400">Lower number = checked first. Use 0 for most rules.</p>
                    <Input
                      type="number"
                      value={fPriority}
                      onChange={(e) => setFPriority(Number(e.target.value))}
                      className="rounded-xl h-10 text-center font-bold"
                    />
                  </div>

                  {/* Active toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFActive((v) => !v)}
                      className="flex items-center gap-2"
                    >
                      {fActive
                        ? <ToggleRight className="h-6 w-6 text-emerald-500" />
                        : <ToggleLeft  className="h-6 w-6 text-slate-300" />}
                      <span className="text-sm font-medium text-slate-700">
                        {fActive ? "Rule is active" : "Rule is disabled"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dialog footer */}
          <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6"
              onClick={() => setFormOpen(false)}
              disabled={formSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-xl px-8 bg-slate-900 text-white hover:bg-slate-800"
              onClick={handleSave}
              disabled={formSaving}
            >
              {formSaving ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
              ) : editingId ? "Save Changes" : "Create Rule"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation dialog ───────────────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && !deleting && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Commission Rule?</DialogTitle>
            <DialogDescription>
              You're about to permanently delete <strong>"{deleteTarget?.name}"</strong>.
              This cannot be undone and will stop all future commission payments from this rule.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-2">
            <Button
              variant="outline"
              className="rounded-xl px-5"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl px-5"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting…</> : "Yes, Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Log Drawer ──────────────────────────────────────────────────────── */}
      {logDrawer && (
        <RuleLogDrawer
          ruleId={logDrawer.id}
          ruleName={logDrawer.name}
          open={true}
          onClose={() => setLogDrawer(null)}
        />
      )}
    </div>
  );
};

export default CommissionRulesContent;
