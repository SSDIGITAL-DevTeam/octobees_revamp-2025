"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Edit, Filter, Gift, Loader2, Plus, Save, Trash2, X } from "lucide-react";

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AffiliateBatch } from "@/hooks/partnership/useBatches";
import {
  createCommissionRule,
  getPartnerLeadPipelineStatuses,
  listCommissionRules,
  updateCommissionRule,
  type CommissionRule,
  type PartnerLeadPipelineStatus,
  type RuleCondition,
  type RuleConditionTree,
} from "@/lib/api/partnership/dashboardPartnership";
import { cn } from "@/lib/utils";

type TierDraft = {
  closedClients: number;
  amount: number;
  conditions: RuleConditionTree | null;
};

type DialogDraft = {
  batchId: string;
  tiers: TierDraft[];
};

type DialogMode = "add" | "edit";

type WelcomeBonusRow = {
  batch: AffiliateBatch;
  rule: CommissionRule | null;
  tiers: TierDraft[];
};

const FIELD_OPTIONS = [
  { value: "closed_clients", label: "Number of closed deals", numeric: true, boolean: false },
  { value: "total_revenue", label: "Monthly revenue (total)", numeric: true, boolean: false },
  { value: "tenure_days", label: "Days as a partner", numeric: true, boolean: false },
  { value: "lead_project_value", label: "Deal value", numeric: true, boolean: false },
  { value: "lead_status", label: "Lead status", numeric: false, boolean: false },
  { value: "payout_day", label: "Day of month", numeric: true, boolean: false },
  { value: "is_first_month", label: "Is partner's first month", numeric: false, boolean: true },
];

const NUMERIC_FIELDS = new Set(
  FIELD_OPTIONS.filter((field) => field.numeric).map((field) => field.value),
);

const NUMERIC_OPS = [
  { value: "gte", label: "at least" },
  { value: "gt", label: "more than" },
  { value: "lte", label: "at most" },
  { value: "lt", label: "less than" },
  { value: "eq", label: "is exactly" },
  { value: "neq", label: "is not" },
];

const TEXT_OPS = [
  { value: "eq", label: "is" },
  { value: "neq", label: "is not" },
  { value: "in", label: "is one of" },
  { value: "not_in", label: "is not one of" },
];

const closedDealsCondition = (closedClients: number): RuleCondition => ({
  field: "closed_clients",
  op: "gte",
  value: Math.max(1, Math.round(Number(closedClients || 1))),
});

const defaultTier = (closedClients = 2): TierDraft => ({
  closedClients,
  amount: 0,
  conditions: buildTierConditionTree("AND", [closedDealsCondition(closedClients)]),
});

const lockedBatchCondition = (batchId: string): RuleCondition => ({
  field: "batch_id",
  op: "eq",
  value: batchId,
});

const conditionKey = (condition: RuleCondition) =>
  `${condition.field}:${condition.op}:${JSON.stringify(condition.value)}`;

const toSelectedValues = (value: RuleCondition["value"]): string[] => {
  if (Array.isArray(value)) return value.map(String);
  if (value) return [String(value)];
  return [];
};

const getTierConditions = (tier: Record<string, unknown>): RuleConditionTree | null => {
  const value = tier.conditions;
  if (!value || typeof value !== "object") return null;
  const tree = value as RuleConditionTree;
  if (!Array.isArray(tree.groups)) return null;
  return tree;
};

const getClosedDealsFromConditions = (
  tree: RuleConditionTree | null,
): number | null => {
  const conditions = tree?.groups?.flatMap((group) => group.conditions) ?? [];
  const values = conditions
    .filter(
      (condition) =>
        condition.field === "closed_clients" &&
        ["gte", "gt", "eq"].includes(condition.op),
    )
    .map((condition) => {
      const value = Math.round(Number(condition.value));
      if (!Number.isFinite(value) || value < 1) return null;
      return condition.op === "gt" ? value + 1 : value;
    })
    .filter((value): value is number => value !== null);

  return values.length > 0 ? Math.max(...values) : null;
};

const ensureClosedDealsCondition = (
  conditions: RuleConditionTree | null,
  closedClients: number,
): RuleConditionTree => {
  const extracted = extractConditions(conditions);
  const hasClosedDeals = extracted.conditions.some(
    (condition) => condition.field === "closed_clients",
  );
  const nextConditions = hasClosedDeals
    ? extracted.conditions
    : [closedDealsCondition(closedClients), ...extracted.conditions];

  return buildTierConditionTree(extracted.logic, nextConditions) as RuleConditionTree;
};

const normalizeTiers = (
  raw: unknown,
  fallbackConditions: RuleConditionTree | null = null,
): TierDraft[] => {
  if (!Array.isArray(raw) || raw.length === 0) return [defaultTier()];

  const normalized: Array<TierDraft | null> = (raw as Record<string, unknown>[])
    .map((tier) => {
      const rawClosedClients = Math.round(
        Number(tier.closedClients ?? tier.min ?? 1),
      );
      const amount = Number(tier.amount ?? 0);
      if (!Number.isFinite(rawClosedClients) || rawClosedClients < 1) return null;
      if (!Number.isFinite(amount) || amount < 0) return null;
      const conditions = ensureClosedDealsCondition(
        getTierConditions(tier) ?? fallbackConditions,
        rawClosedClients,
      );
      const closedClients =
        getClosedDealsFromConditions(conditions) ?? rawClosedClients;

      return {
        closedClients,
        amount,
        conditions,
      };
    });

  return normalized
    .filter((tier): tier is TierDraft => Boolean(tier))
    .sort((a, b) => a.closedClients - b.closedClients);
};

const buildLockedRuleTree = (batchId: string): RuleConditionTree => ({
  operator: "AND",
  groups: [{ operator: "AND", conditions: [lockedBatchCondition(batchId)] }],
});

const buildTierConditionTree = (
  logic: "AND" | "OR",
  conditions: RuleCondition[],
): RuleConditionTree | null => {
  if (conditions.length === 0) return null;
  return {
    operator: "AND",
    groups: [{ operator: logic, conditions }],
  };
};

const extractConditions = (
  tree: RuleConditionTree | null,
  batchId?: string,
): { logic: "AND" | "OR"; conditions: RuleCondition[] } => {
  const raw = tree?.groups?.[0]?.conditions ?? [];
  const lockedKey = batchId ? conditionKey(lockedBatchCondition(batchId)) : null;

  return {
    logic: (tree?.groups?.[0]?.operator as "AND" | "OR") ?? "AND",
    conditions: lockedKey
      ? raw.filter((condition) => conditionKey(condition) !== lockedKey)
      : raw,
  };
};

const findRuleForBatch = (rules: CommissionRule[], batchId: string) => {
  const lockedKey = conditionKey(lockedBatchCondition(batchId));
  return (
    rules.find((rule) => {
      if (rule.commissionType !== "initial") return false;
      const allConditions =
        rule.conditions?.groups?.flatMap((group) => group.conditions) ?? [];
      return allConditions.some(
        (condition) => conditionKey(condition) === lockedKey,
      );
    }) ?? null
  );
};

function ConditionRow({
  condition,
  onUpdate,
  onRemove,
  pipelineStatuses,
}: {
  condition: RuleCondition;
  onUpdate: (patch: Partial<RuleCondition>) => void;
  onRemove: () => void;
  pipelineStatuses: PartnerLeadPipelineStatus[];
}) {
  const isNumeric = NUMERIC_FIELDS.has(condition.field);
  const isBoolean =
    FIELD_OPTIONS.find((field) => field.value === condition.field)?.boolean ??
    false;
  const isLeadStatus = condition.field === "lead_status";
  const isListOp = condition.op === "in" || condition.op === "not_in";
  const activePipelineStatuses = pipelineStatuses.filter(
    (status) => status.isActive,
  );

  const renderValue = () => {
    if (isBoolean) {
      return (
        <select
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={String(condition.value)}
          onChange={(event) =>
            onUpdate({ value: event.target.value === "true" })
          }
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    if (isLeadStatus && isListOp) {
      const selected = toSelectedValues(condition.value);
      return (
        <div className="flex min-w-[220px] flex-wrap gap-1">
          {activePipelineStatuses.length > 0 ? (
            activePipelineStatuses.map((status) => {
              const checked = selected.includes(status.value);
              return (
                <label
                  key={status.value}
                  className={cn(
                    "inline-flex cursor-pointer select-none rounded-full border px-2.5 py-1 text-xs font-semibold",
                    checked
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600",
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
      );
    }

    if (isLeadStatus) {
      return (
        <select
          className="h-9 min-w-[180px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={String(condition.value ?? "")}
          onChange={(event) => onUpdate({ value: event.target.value })}
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
      );
    }

    if (isListOp) {
      return (
        <Input
          className="h-9 min-w-[180px] rounded-xl"
          value={
            Array.isArray(condition.value)
              ? condition.value.join(", ")
              : String(condition.value ?? "")
          }
          onChange={(event) =>
            onUpdate({
              value: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            })
          }
          placeholder="value1, value2..."
        />
      );
    }

    if (isNumeric) {
      return (
        <Input
          type="number"
          className="h-9 w-28 rounded-xl text-center font-semibold"
          value={String(condition.value ?? 0)}
          onChange={(event) => onUpdate({ value: Number(event.target.value) })}
        />
      );
    }

    return (
      <Input
        className="h-9 min-w-[160px] rounded-xl"
        value={String(condition.value ?? "")}
        onChange={(event) => onUpdate({ value: event.target.value })}
        placeholder="value..."
      />
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
      <select
        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
        value={condition.field}
        onChange={(event) => {
          const field = event.target.value;
          const numeric = NUMERIC_FIELDS.has(field);
          onUpdate({
            field,
            op: numeric ? "gte" : "eq",
            value: numeric ? 0 : "",
          });
        }}
      >
        {FIELD_OPTIONS.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      {!isBoolean ? (
        <select
          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm"
          value={condition.op}
          onChange={(event) =>
            onUpdate({ op: event.target.value as RuleCondition["op"] })
          }
        >
          {(isNumeric ? NUMERIC_OPS : TEXT_OPS).map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      ) : null}

      {renderValue()}

      <button
        type="button"
        className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function TierConditionsEditor({
  tier,
  onChange,
  pipelineStatuses,
}: {
  tier: TierDraft;
  onChange: (conditions: RuleConditionTree | null) => void;
  pipelineStatuses: PartnerLeadPipelineStatus[];
}) {
  const { logic, conditions } = extractConditions(tier.conditions);

  const updateCondition = (index: number, patch: Partial<RuleCondition>) => {
    const next = conditions.map((condition, conditionIndex) =>
      conditionIndex === index ? { ...condition, ...patch } : condition,
    );
    onChange(buildTierConditionTree(logic, next));
  };

  const removeCondition = (index: number) => {
    const next = conditions.filter((_, conditionIndex) => conditionIndex !== index);
    onChange(buildTierConditionTree(logic, next));
  };

  const addCondition = () => {
    onChange(
      buildTierConditionTree(logic, [
        ...conditions,
        { field: "closed_clients", op: "gte", value: tier.closedClients },
      ]),
    );
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Conditions for ${tier.amount.toLocaleString("en-US")} bonus
          </p>
          <p className="text-xs text-slate-500">
            These rules apply only to this tier.
          </p>
        </div>

        {conditions.length >= 2 ? (
          <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 text-xs font-semibold">
            {(["AND", "OR"] as const).map((value) => (
              <button
                key={value}
                type="button"
                className={cn(
                  "px-3 py-2",
                  logic === value
                    ? "bg-slate-900 text-white"
                    : "bg-white text-slate-500",
                )}
                onClick={() => onChange(buildTierConditionTree(value, conditions))}
              >
                {value === "AND" ? "All" : "Any"}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {conditions.length === 0 ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          No extra conditions for this tier. It unlocks when the minimum closed
          deals is reached.
        </div>
      ) : (
        <div className="space-y-2">
          {conditions.map((condition, index) => (
            <ConditionRow
              key={`${condition.field}-${index}`}
              condition={condition}
              pipelineStatuses={pipelineStatuses}
              onUpdate={(patch) => updateCondition(index, patch)}
              onRemove={() => removeCondition(index)}
            />
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-3 rounded-xl border-dashed"
        onClick={addCondition}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Condition
      </Button>
    </div>
  );
}

export function WelcomeBonusRuleTable({
  batches,
  onTiersSaved,
}: {
  batches: AffiliateBatch[];
  onTiersSaved?: (batchId: string, tiers: TierDraft[]) => Promise<unknown>;
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [pipelineStatuses, setPipelineStatuses] = useState<PartnerLeadPipelineStatus[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("add");
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DialogDraft | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [rulesRes, statusesRes] = await Promise.all([
        listCommissionRules(true),
        getPartnerLeadPipelineStatuses({ includeInactive: false }),
      ]);
      setRules(rulesRes.data.data ?? []);
      setPipelineStatuses(statusesRes.data.data ?? []);
    } catch {
      toast.error("Failed to load welcome bonus rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const rows = useMemo<WelcomeBonusRow[]>(() => {
    return batches.map((batch) => {
      const rule = findRuleForBatch(rules, batch.id);
      const fallback = rule ? extractConditions(rule.conditions, batch.id) : null;
      const fallbackTree =
        fallback && fallback.conditions.length > 0
          ? buildTierConditionTree(fallback.logic, fallback.conditions)
          : null;
      const rawTiers =
        rule?.reward?.type === "tiered"
          ? rule.reward.tiers
          : batch.initialCommissionTiers;

      return {
        batch,
        rule,
        tiers: normalizeTiers(rawTiers, fallbackTree),
      };
    });
  }, [batches, rules]);

  const openAdd = () => {
    const firstAvailable =
      rows.find((row) => !row.rule)?.batch ?? rows[0]?.batch ?? null;
    if (!firstAvailable) {
      toast.error("Create a batch first before adding welcome bonus config.");
      return;
    }

    setDialogMode("add");
    setEditingRuleId(null);
    setDraft({
      batchId: firstAvailable.id,
      tiers: normalizeTiers(firstAvailable.initialCommissionTiers),
    });
    setDialogOpen(true);
  };

  const openEdit = (row: WelcomeBonusRow) => {
    setDialogMode("edit");
    setEditingRuleId(row.rule?.id ?? null);
    setDraft({
      batchId: row.batch.id,
      tiers: row.tiers,
    });
    setDialogOpen(true);
  };

  const selectedBatch = draft
    ? batches.find((batch) => batch.id === draft.batchId)
    : null;

  const updateDraftTier = (index: number, patch: Partial<TierDraft>) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            tiers: current.tiers.map((tier, tierIndex) =>
              tierIndex === index ? { ...tier, ...patch } : tier,
            ),
          }
        : current,
    );
  };

  const addDraftTier = () => {
    setDraft((current) => {
      if (!current) return current;
      const normalized = normalizeTiers(current.tiers);
      const lastClosedClients = normalized.at(-1)?.closedClients ?? 1;
      const nextClosedClients = lastClosedClients + 1;
      return {
        ...current,
        tiers: [
          ...normalized,
          defaultTier(nextClosedClients),
        ],
      };
    });
  };

  const removeDraftTier = (index: number) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            tiers: current.tiers.filter((_, tierIndex) => tierIndex !== index),
          }
        : current,
    );
  };

  const handleSave = async () => {
    if (!draft) return;
    const batch = batches.find((item) => item.id === draft.batchId);
    if (!batch) {
      toast.error("Please select a batch.");
      return;
    }

    const normalizedTiers = normalizeTiers(draft.tiers).map((tier) => {
      const closedClients =
        getClosedDealsFromConditions(tier.conditions) ?? tier.closedClients;
      return {
        closedClients,
        amount: tier.amount,
        conditions: ensureClosedDealsCondition(tier.conditions, closedClients),
      };
    });

    if (normalizedTiers.length === 0) {
      toast.error("At least one tier is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: `Welcome Bonus - ${batch.name}`,
        description: null,
        triggerType: "daily_cron" as const,
        commissionType: "initial",
        scope: "per_period" as const,
        periodScope: "first_month" as const,
        conditions: buildLockedRuleTree(batch.id),
        reward: { type: "tiered" as const, tiers: normalizedTiers },
        isActive: true,
        priority: 10,
      };

      const existingRule = findRuleForBatch(rules, batch.id);
      const targetRuleId = editingRuleId ?? existingRule?.id ?? null;

      if (targetRuleId) {
        await updateCommissionRule(targetRuleId, payload);
      } else {
        await createCommissionRule(payload);
      }

      if (onTiersSaved) {
        await onTiersSaved(batch.id, normalizedTiers);
      }

      await loadData();
      setDialogOpen(false);
      setDraft(null);
      setDialogMode("add");
      setEditingRuleId(null);
      toast.success("Welcome bonus config saved.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save welcome bonus config.",
      );
    } finally {
      setSaving(false);
    }
  };

  const renderTableContent = () => {
    if (loading) {
      return (
        <div className="flex h-56 items-center justify-center text-slate-400">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading welcome bonus rules...
        </div>
      );
    }

    if (rows.length === 0) {
      return (
        <div className="flex h-56 flex-col items-center justify-center gap-2 text-slate-400">
          <Gift className="h-8 w-8 opacity-40" />
          <p className="text-sm">No recruitment batches found.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tiered Bonus Rules</TableHead>
            <TableHead>Highest Bonus</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const highestBonus = Math.max(
              0,
              ...row.tiers.map((tier) => Number(tier.amount || 0)),
            );
            const configured = Boolean(row.rule) || highestBonus > 0;

            return (
              <TableRow key={row.batch.id}>
                <TableCell>
                  <div className="font-semibold text-slate-900">
                    {row.batch.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {row.batch.role || "No role assigned"}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      configured
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700",
                    )}
                  >
                    {configured ? "Configured" : "Not configured"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {row.tiers.map((tier) => {
                      const conditionCount =
                        tier.conditions?.groups?.flatMap(
                          (group) => group.conditions,
                        ).length ?? 0;
                      return (
                        <span
                          key={`${row.batch.id}-${tier.closedClients}-${tier.amount}`}
                          className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {tier.closedClients} deal(s) / $
                          {tier.amount.toLocaleString("en-US")}
                          {conditionCount > 0
                            ? ` / ${conditionCount} condition(s)`
                            : ""}
                        </span>
                      );
                    })}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-slate-900">
                  ${highestBonus.toLocaleString("en-US")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={() => openEdit(row)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Welcome Bonus Configurations
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Manage per-batch welcome bonus tiers. Dynamic conditions are attached
            to each bonus tier, not globally to the batch.
          </p>
        </div>
        <Button
          type="button"
          className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
          onClick={openAdd}
          disabled={loading || batches.length === 0}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Config
        </Button>
      </div>

      {renderTableContent()}

      <Dialog open={dialogOpen} onOpenChange={(open) => !saving && setDialogOpen(open)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit"
                ? "Edit Welcome Bonus Config"
                : "Add Welcome Bonus Config"}
            </DialogTitle>
            <DialogDescription>
              Configure bonus tiers and attach dynamic conditions to each tier.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <Label className="mb-2 block text-sm font-semibold text-slate-700">
                  Recruitment Batch
                </Label>
                <Select
                  value={draft.batchId}
                  onValueChange={(batchId) => {
                    const existingRule = findRuleForBatch(rules, batchId);
                    const batch = batches.find((item) => item.id === batchId);
                    setEditingRuleId(existingRule?.id ?? null);
                    setDraft({
                      batchId,
                      tiers: normalizeTiers(
                        existingRule?.reward?.type === "tiered"
                          ? existingRule.reward.tiers
                          : batch?.initialCommissionTiers,
                      ),
                    });
                  }}
                  disabled={dialogMode === "edit"}
                >
                  <SelectTrigger className="h-11 rounded-xl bg-white">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      Tiered Bonus Rules
                    </p>
                    <p className="text-sm text-slate-500">
                      Each bonus amount can have its own conditions.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl border-dashed"
                    onClick={addDraftTier}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tier
                  </Button>
                </div>

                {draft.tiers.map((tier, index) => (
                  <div
                    key={`${index}-${tier.closedClients}-${tier.amount}`}
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                  >
                    <div className="flex flex-col gap-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white p-5 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-slate-950">
                            Tier {index + 1}
                          </p>
                          <p className="text-sm text-slate-500">
                            Closed deals requirement is managed from this tier&apos;s conditions.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="min-w-[220px]">
                          <Label className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                            Bonus Amount
                          </Label>
                          <div className="relative">
                            <span className="absolute left-4 top-3 text-sm font-semibold text-slate-400">
                              $
                            </span>
                            <Input
                              type="number"
                              min={0}
                              className="h-12 rounded-2xl border-slate-200 bg-white pl-8 text-lg font-bold text-slate-950"
                              value={tier.amount}
                              onChange={(event) =>
                                updateDraftTier(index, {
                                  amount: Math.max(
                                    0,
                                    Number(event.target.value || 0),
                                  ),
                                })
                              }
                            />
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-12 w-12 rounded-2xl text-rose-600 hover:bg-rose-50"
                          onClick={() => removeDraftTier(index)}
                          disabled={draft.tiers.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          <Filter className="h-3.5 w-3.5" />
                          Tier Conditions
                        </div>
                        <span className="inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          Closed deals source: dynamic condition
                        </span>
                      </div>
                      <TierConditionsEditor
                        tier={tier}
                        pipelineStatuses={pipelineStatuses}
                        onChange={(conditions) =>
                          updateDraftTier(index, {
                            conditions,
                            closedClients:
                              getClosedDealsFromConditions(conditions) ??
                              tier.closedClients,
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="rounded-xl bg-slate-900 text-white hover:bg-slate-800"
                  onClick={handleSave}
                  disabled={saving || !selectedBatch}
                >
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Config
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default WelcomeBonusRuleTable;
