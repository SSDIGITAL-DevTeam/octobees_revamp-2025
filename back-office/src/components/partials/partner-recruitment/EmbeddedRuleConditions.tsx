"use client";

/**
 * EmbeddedRuleConditions
 *
 * A compact, inline conditions editor that embeds directly inside a commission
 * settings page. It finds (or creates) the matching commission rule and lets
 * the admin configure ONLY the conditions — trigger and reward are pre-set by
 * the page context.
 */

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Filter, Info, Loader2, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  listCommissionRules,
  createCommissionRule,
  updateCommissionRule,
  getPartnerLeadPipelineStatuses,
  getPartnerVerticalMarkets,
  type CommissionRule,
  type RuleCondition,
  type RuleConditionTree,
  type RuleReward,
  type RuleTriggerType,
  type RuleScope,
  type RulePeriodScope,
  type PartnerLeadPipelineStatus,
  type PartnerVerticalMarket,
} from "@/lib/api/partnership/dashboardPartnership";
import { cn } from "@/lib/utils";

// ── Field & operator labels ────────────────────────────────────────────────────

const FIELD_OPTIONS = [
  { value: "closed_clients",      label: "Number of closed deals",   numeric: true,  boolean: false },
  { value: "total_revenue",       label: "Monthly revenue (total)",  numeric: true,  boolean: false },
  { value: "tenure_days",         label: "Days as a partner",        numeric: true,  boolean: false },
  { value: "lead_project_value",  label: "Deal value",               numeric: true,  boolean: false },
  { value: "lead_service_id",     label: "Product / Service ID",     numeric: false, boolean: false },
  { value: "lead_status",         label: "Lead status",              numeric: false, boolean: false },
  { value: "lead_vertical_market_id", label: "Vertical market",       numeric: false, boolean: false },
  { value: "vertical_market_first_sale", label: "First seller in vertical market", numeric: false, boolean: true },
  { value: "batch_id",            label: "Partner batch",            numeric: false, boolean: false },
  { value: "payout_day",          label: "Day of month",             numeric: true,  boolean: false },
  { value: "is_first_month",      label: "Is partner's first month", numeric: false, boolean: true  },
];

const NUMERIC_FIELDS = new Set(FIELD_OPTIONS.filter((f) => f.numeric).map((f) => f.value));

const NUMERIC_OPS = [
  { value: "gte", label: "at least" },
  { value: "gt",  label: "more than" },
  { value: "lte", label: "at most" },
  { value: "lt",  label: "less than" },
  { value: "eq",  label: "is exactly" },
  { value: "neq", label: "is not" },
];
const TEXT_OPS = [
  { value: "eq",     label: "is" },
  { value: "neq",    label: "is not" },
  { value: "in",     label: "is one of" },
  { value: "not_in", label: "is not one of" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const condKey = (c: RuleCondition) =>
  `${c.field}:${c.op}:${JSON.stringify(c.value)}`;

/** Build a flat {logic, conditions} from a rule's condition tree. */
const extractUserConds = (
  tree: RuleConditionTree | null,
  locked: RuleCondition[],
): { logic: "AND" | "OR"; conds: RuleCondition[] } => {
  const lockedKeys = new Set(locked.map(condKey));
  const raw = tree?.groups?.[0]?.conditions ?? [];
  return {
    logic: tree?.groups?.[0]?.operator ?? "AND",
    conds: raw.filter((c) => !lockedKeys.has(condKey(c))),
  };
};

/** Build a full condition tree: locked conds first, then user conds. */
const buildTree = (
  logic: "AND" | "OR",
  userConds: RuleCondition[],
  locked: RuleCondition[],
): RuleConditionTree => {
  const all = [...locked, ...userConds];
  return {
    operator: "AND",
    groups: all.length ? [{ operator: logic, conditions: all }] : [],
  };
};

/** Find the best matching rule for this commissionType (+ locked cond match). */
const findRule = (
  rules: CommissionRule[],
  commissionType: string,
  locked: RuleCondition[],
): CommissionRule | null => {
  const candidates = rules.filter((r) => r.commissionType === commissionType);
  if (!locked.length) return candidates[0] ?? null;
  // Prefer rule that already has all locked conditions
  const exact = candidates.find((r) => {
    const allConds = r.conditions?.groups?.flatMap((g) => g.conditions) ?? [];
    const keys = new Set(allConds.map(condKey));
    return locked.every((lc) => keys.has(condKey(lc)));
  });
  return exact ?? null;
};

const toSelectedValues = (value: RuleCondition["value"]): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value) return [String(value)];
  return [];
};

// ── Condition row ──────────────────────────────────────────────────────────────

function CondRow({
  cond, index, onUpdate, onRemove, pipelineStatuses = [], verticalMarkets = [],
}: {
  cond: RuleCondition;
  index: number;
  onUpdate: (p: Partial<RuleCondition>) => void;
  onRemove: () => void;
  pipelineStatuses?: PartnerLeadPipelineStatus[];
  verticalMarkets?: PartnerVerticalMarket[];
}) {
  const isNumeric    = NUMERIC_FIELDS.has(cond.field);
  const isBool       = FIELD_OPTIONS.find((f) => f.value === cond.field)?.boolean ?? false;
  const isListOp     = cond.op === "in" || cond.op === "not_in";
  const isLeadStatus = cond.field === "lead_status";
  const isVerticalMarket = cond.field === "lead_vertical_market_id";
  const activePipelineStatuses = pipelineStatuses.filter(
    (status) => status.isActive,
  );

  const renderValue = () => {
    if (isBool) {
      return (
        <select
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700"
          value={String(cond.value)}
          onChange={(e) => onUpdate({ value: e.target.value === "true" })}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (isLeadStatus) {
      if (isListOp) {
        const selected = toSelectedValues(cond.value);
        return (
          <div className="flex flex-wrap gap-1 min-w-[200px]">
            {activePipelineStatuses.length > 0 ? (
              activePipelineStatuses.map((s) => {
                const checked = selected.includes(s.value);
                return (
                  <label
                    key={s.value}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium cursor-pointer border transition-colors select-none",
                      checked
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-400",
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() => {
                        const next = checked
                          ? selected.filter((v) => v !== s.value)
                          : [...selected, s.value];
                        onUpdate({ value: next });
                      }}
                    />
                    {s.label}
                  </label>
                );
              })
            ) : (
              <span className="rounded-lg border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                No active pipeline status
              </span>
            )}
          </div>
        );
      }
      return (
        <select
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
          disabled={activePipelineStatuses.length === 0}
        >
          <option value="">
            {activePipelineStatuses.length > 0
              ? "Select status..."
              : "No active pipeline status"}
          </option>
          {activePipelineStatuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      );
    }

    if (isVerticalMarket) {
      const activeMarkets = verticalMarkets.filter((market) => market.isActive);
      if (isListOp) {
        const selected = toSelectedValues(cond.value);
        return (
          <div className="flex min-w-[220px] flex-wrap gap-1">
            {activeMarkets.map((market) => {
              const value = String(market.id || market.name);
              const checked = selected.includes(value);
              return (
                <label
                  key={value}
                  className={cn(
                    "inline-flex cursor-pointer select-none items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors",
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
                        ? selected.filter((v) => v !== value)
                        : [...selected, value];
                      onUpdate({ value: next });
                    }}
                  />
                  {market.name}
                </label>
              );
            })}
          </div>
        );
      }
      return (
        <select
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700"
          value={String(cond.value ?? "")}
          onChange={(e) => onUpdate({ value: e.target.value })}
          disabled={activeMarkets.length === 0}
        >
          <option value="">
            {activeMarkets.length > 0 ? "Select market..." : "No active market"}
          </option>
          {activeMarkets.map((market) => (
            <option key={market.id || market.name} value={market.id}>
              {market.name}
            </option>
          ))}
        </select>
      );
    }

    if (isListOp) {
      return (
        <Input
          className="h-8 min-w-[160px] rounded-lg text-sm"
          placeholder="value1, value2…"
          value={Array.isArray(cond.value) ? (cond.value as string[]).join(", ") : String(cond.value ?? "")}
          onChange={(e) =>
            onUpdate({ value: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
        />
      );
    }

    if (isNumeric) {
      return (
        <Input
          type="number"
          className="h-8 w-24 rounded-lg text-sm text-center font-semibold"
          value={String(cond.value ?? 0)}
          onChange={(e) => onUpdate({ value: Number(e.target.value) })}
        />
      );
    }

    return (
      <Input
        className="h-8 min-w-[140px] rounded-lg text-sm"
        placeholder="value…"
        value={String(cond.value ?? "")}
        onChange={(e) => onUpdate({ value: e.target.value })}
      />
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      {/* Field */}
      <select
        className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700"
        value={cond.field}
        onChange={(e) => {
          const f = e.target.value;
          const num = NUMERIC_FIELDS.has(f);
          const bool = FIELD_OPTIONS.find((option) => option.value === f)?.boolean ?? false;
          onUpdate({
            field: f,
            op: num ? "gte" : "eq",
            value: bool ? true : num ? 0 : "",
          });
        }}
      >
        {FIELD_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Operator */}
      {!isBool && (
        <select
          className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-2 text-sm text-slate-700"
          value={cond.op}
          onChange={(e) => onUpdate({ op: e.target.value as RuleCondition["op"] })}
        >
          {(isNumeric ? NUMERIC_OPS : TEXT_OPS).map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )}

      {/* Value */}
      {renderValue()}

      <button
        type="button"
        className="ml-auto h-7 w-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export type EmbeddedRuleConditionsProps = {
  /** Used to find / create the matching rule. */
  commissionType: string;
  /** Name for the rule if it doesn't exist yet. */
  ruleName: string;
  /** Pre-set — not shown to user. */
  triggerType: RuleTriggerType;
  scope: RuleScope;
  periodScope: RulePeriodScope;
  defaultReward: RuleReward;
  /** Priority for new rules. Lower = evaluated first (default -1 so it wins over generic fallback). */
  priority?: number;
  /**
   * Conditions that are always present and hidden from the user.
   * E.g. `[{ field: "lead_service_id", op: "eq", value: serviceId }]`
   */
  lockedConditions?: RuleCondition[];
  /**
   * Human-readable label for the locked condition shown as a read-only tag.
   * E.g. "Applies only to: Product Name"
   */
  lockedLabel?: string;
  /** Section heading. Default: "Payment Conditions" */
  title?: string;
  /** Helper text below the heading. */
  description?: string;
};

export function EmbeddedRuleConditions({
  commissionType,
  ruleName,
  triggerType,
  scope,
  periodScope,
  defaultReward,
  priority = -1,
  lockedConditions = [],
  lockedLabel,
  title = "Payment Conditions",
  description = "Set extra requirements a partner must meet to receive this commission. Leave empty to always pay.",
}: EmbeddedRuleConditionsProps) {
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [dirty, setDirty]       = useState(false);
  const [ruleId, setRuleId]     = useState<string | null>(null);
  const [logic, setLogic]       = useState<"AND" | "OR">("AND");
  const [conds, setConds]       = useState<RuleCondition[]>([]);
  const [pipelineStatuses, setPipelineStatuses] = useState<PartnerLeadPipelineStatus[]>([]);
  const [verticalMarkets, setVerticalMarkets] = useState<PartnerVerticalMarket[]>([]);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rulesRes, statusesRes, verticalMarketsRes] = await Promise.all([
          listCommissionRules(true),
          getPartnerLeadPipelineStatuses({ includeInactive: false }).catch(() => null),
          getPartnerVerticalMarkets({ includeInactive: false }).catch(() => null),
        ]);
        if (cancelled) return;

        if (statusesRes?.data?.data) {
          setPipelineStatuses(statusesRes.data.data);
        }
        if (verticalMarketsRes?.data?.data) {
          setVerticalMarkets(verticalMarketsRes.data.data);
        }

        const all = rulesRes.data.data ?? [];
        const match = findRule(all, commissionType, lockedConditions);
        if (match) {
          const { logic: l, conds: c } = extractUserConds(match.conditions, lockedConditions);
          setRuleId(match.id);
          setLogic(l);
          setConds(c);
        }
      } catch {
        // Silent — user can still edit
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commissionType]);

  // ── Mutations ────────────────────────────────────────────────────────────────
  const updateCond = (i: number, patch: Partial<RuleCondition>) => {
    setConds((prev) => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
    setDirty(true);
  };
  const removeCond = (i: number) => {
    setConds((prev) => prev.filter((_, idx) => idx !== i));
    setDirty(true);
  };
  const addCond = () => {
    setConds((prev) => [...prev, { field: "closed_clients", op: "gte", value: 1 }]);
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const tree = buildTree(logic, conds, lockedConditions);
      if (ruleId) {
        await updateCommissionRule(ruleId, { conditions: tree });
      } else {
        const res = await createCommissionRule({
          name:           ruleName,
          description:    null,
          triggerType,
          commissionType,
          scope,
          periodScope,
          conditions:     tree,
          reward:         defaultReward,
          isActive:       true,
          priority,
        });
        setRuleId((res.data as { data: CommissionRule }).data?.id ?? null);
      }
      setDirty(false);
      toast.success("Conditions saved.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save conditions.");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-8 w-8 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center">
            <Filter className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500 max-w-lg">{description}</p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {loading ? (
          <div className="flex h-16 items-center justify-center text-slate-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Locked condition tag (read-only) */}
            {lockedLabel && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  <Info className="h-3 w-3" />
                  {lockedLabel}
                </span>
              </div>
            )}

            {/* AND / OR toggle (shown only when ≥ 2 conditions) */}
            {conds.length >= 2 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Match</span>
                <div className="inline-flex overflow-hidden rounded-lg border border-slate-200 text-xs">
                  {(["AND", "OR"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      className={cn(
                        "px-3 py-1 font-semibold transition-colors",
                        logic === v
                          ? "bg-slate-900 text-white"
                          : "bg-white text-slate-500 hover:bg-slate-50",
                      )}
                      onClick={() => { setLogic(v); setDirty(true); }}
                    >
                      {v === "AND" ? "All conditions" : "Any condition"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Condition rows */}
            {conds.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-4 text-center">
                <p className="text-sm text-slate-500">
                  No conditions — <span className="font-semibold text-slate-700">commission always pays</span> when triggered.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {conds.map((c, i) => (
                  <CondRow
                    key={i}
                    cond={c}
                    index={i}
                    pipelineStatuses={pipelineStatuses}
                    verticalMarkets={verticalMarkets}
                    onUpdate={(p) => updateCond(i, p)}
                    onRemove={() => removeCond(i)}
                  />
                ))}
              </div>
            )}

            {/* Add + Save row */}
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-dashed text-slate-600"
                onClick={addCond}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add condition
              </Button>

              {dirty && (
                <Button
                  type="button"
                  size="sm"
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving…</>
                    : <><Save className="mr-1.5 h-3.5 w-3.5" />Save conditions</>}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmbeddedRuleConditions;
