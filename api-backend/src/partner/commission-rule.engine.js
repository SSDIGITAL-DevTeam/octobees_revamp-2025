/**
 * commission-rule.engine.js
 *
 * Dynamic commission rule engine.
 * Rules are stored in the `commission_rule` table and evaluated here
 * against a runtime context without any hardcoded logic.
 */

import { and, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { partnerCommission } from "../../drizzle/schema.js";
import {
  getRulesByTrigger,
  logRuleEvaluation,
} from "./commission-rule.repository.js";
import {
  getAffiliateLifecycle,
  getClosedWonStatsForPeriod,
  getActivePerformanceSetting,
  countWonLeadsForVerticalMarket,
} from "./partner.repository.js";
import {
  getPartnerServiceById,
  getPartnerSalesCommissionSettings,
  resolveServiceCommissionConfig,
} from "./partner.service.js";
import { getBatchById } from "../affiliate-batch/batch.repository.js";

// ── Batch-level tier helpers (mirrors partner.service.js logic) ───────────────

const _normalizeBatchTiers = (tiers = [], fallback = []) => {
  const src = Array.isArray(tiers) && tiers.length > 0 ? tiers : fallback ?? [];
  return src
    .map((item) => {
      const closedClients = Math.round(Number(item?.closedClients ?? item?.targetClients));
      const amount = Number(item?.amount);
      if (!Number.isFinite(closedClients) || closedClients < 1) return null;
      if (!Number.isFinite(amount) || amount < 0) return null;
      const conditions =
        item?.conditions &&
        typeof item.conditions === "object" &&
        Array.isArray(item.conditions.groups)
          ? item.conditions
          : null;
      return { closedClients, amount, conditions };
    })
    .filter(Boolean)
    .sort((a, b) => a.closedClients - b.closedClients)
    .filter((item, i, list) => list.findIndex((c) => c.closedClients === item.closedClients) === i);
};

const _getLegacyTier = (lifecycle, setting) => {
  const amount = Number(lifecycle?.initialCommissionAmount || 0);
  const rawThreshold = Number(lifecycle?.batchInitialCommissionThreshold || 0);
  const threshold = rawThreshold > 0 ? rawThreshold : Number(setting?.initialCommissionFullClientThreshold || 2);
  if (amount <= 0 || threshold <= 0) return [];
  return [{ closedClients: threshold, amount }];
};
import { v4 as uuidv4 } from "uuid";

// ── Date helpers ──────────────────────────────────────────────────────────────

export const formatPeriod = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);

// ── Context builder ───────────────────────────────────────────────────────────
// Lazy-loads expensive stats only when a condition actually needs them.

const buildContext = (affiliateId, { lead = null, period = null, now = new Date() } = {}) => {
  let _affiliate = null;
  let _stats = {};     // keyed by "YYYY-MM_YYYY-MM"
  let _tenureDays = null;

  const resolvedPeriod = period ?? formatPeriod(now);

  const getPeriodBounds = (scope, affiliate) => {
    if (scope === "first_month") {
      const userCreated = affiliate?.userCreatedAt ? new Date(affiliate.userCreatedAt) : now;
      const start = startOfMonth(userCreated);
      return { start, end: addMonths(start, 1) };
    }
    if (scope === "current_month") {
      const start = startOfMonth(now);
      return { start, end: addMonths(start, 1) };
    }
    // any_month — use current month as default
    const start = startOfMonth(now);
    return { start, end: addMonths(start, 1) };
  };

  return {
    affiliateId,
    lead,
    period: resolvedPeriod,
    now,

    async getAffiliate() {
      if (!_affiliate) {
        _affiliate = await getAffiliateLifecycle(affiliateId);
      }
      return _affiliate;
    },

    async getStats(periodScope) {
      const aff = await this.getAffiliate();
      const { start, end } = getPeriodBounds(periodScope, aff);
      const key = `${start.getTime()}_${end.getTime()}`;
      if (!_stats[key]) {
        _stats[key] = await getClosedWonStatsForPeriod(affiliateId, start, end);
      }
      return _stats[key];
    },

    async getClosedClients(periodScope = "current_month") {
      const stats = await this.getStats(periodScope);
      return Number(stats?.closedClients ?? 0);
    },

    async getTotalRevenue(periodScope = "current_month") {
      const stats = await this.getStats(periodScope);
      return Number(stats?.salesAmount ?? 0);
    },

    async getTenureDays() {
      if (_tenureDays !== null) return _tenureDays;
      const aff = await this.getAffiliate();
      if (!aff?.userCreatedAt) return (_tenureDays = 0);
      _tenureDays = Math.floor(
        (now.getTime() - new Date(aff.userCreatedAt).getTime()) / 86_400_000,
      );
      return _tenureDays;
    },

    async isFirstMonth() {
      const aff = await this.getAffiliate();
      if (!aff?.userCreatedAt) return false;
      const userCreated = new Date(aff.userCreatedAt);
      const firstMonthEnd = addMonths(startOfMonth(userCreated), 1);
      return now < firstMonthEnd;
    },

    async isFirstVerticalMarketSeller() {
      if (!lead?.verticalMarketId) return false;
      const existingWonCount = await countWonLeadsForVerticalMarket(
        lead.verticalMarketId,
        { excludeLeadId: lead.id },
      );
      return existingWonCount === 0;
    },
  };
};

// ── Condition evaluator ───────────────────────────────────────────────────────

const NUMERIC_FIELDS = new Set([
  "closed_clients", "total_revenue", "tenure_days", "lead_project_value", "payout_day",
]);

const resolveField = async (field, ctx, rule) => {
  const scope = rule.periodScope ?? "current_month";
  switch (field) {
    case "closed_clients":       return ctx.getClosedClients(scope);
    case "total_revenue":        return ctx.getTotalRevenue(scope);
    case "tenure_days":          return ctx.getTenureDays();
    case "batch_id":             return (await ctx.getAffiliate())?.batchId ?? null;
    case "lead_project_value":   return ctx.lead ? Number(ctx.lead.projectValue) : 0;
    case "lead_service_id":      return ctx.lead?.serviceId ?? null;
    case "lead_status":          return ctx.lead?.status ?? null;
    case "lead_vertical_market_id": return ctx.lead?.verticalMarketId ?? null;
    case "lead_vertical_market_name": return ctx.lead?.verticalMarketName ?? null;
    case "vertical_market_first_sale": return ctx.isFirstVerticalMarketSeller();
    case "payout_day":           return ctx.now.getDate();
    case "is_first_month":       return ctx.isFirstMonth();
    default:                     return null;
  }
};

const compare = (actual, op, expected) => {
  const num = (v) => Number(v);
  const str = (v) => String(v ?? "");
  switch (op) {
    case "eq":      return str(actual) === str(expected);
    case "neq":     return str(actual) !== str(expected);
    case "gt":      return num(actual) > num(expected);
    case "gte":     return num(actual) >= num(expected);
    case "lt":      return num(actual) < num(expected);
    case "lte":     return num(actual) <= num(expected);
    case "in":      return Array.isArray(expected) && expected.map(String).includes(str(actual));
    case "not_in":  return Array.isArray(expected) && !expected.map(String).includes(str(actual));
    default:        return false;
  }
};

const evaluateSingleCondition = async (condition, ctx, rule) => {
  const actual = await resolveField(condition.field, ctx, rule);
  return compare(actual, condition.op, condition.value);
};

const evaluateGroup = async (group, ctx, rule) => {
  const { operator = "AND", conditions = [] } = group;
  if (operator === "OR") {
    for (const c of conditions) {
      if (await evaluateSingleCondition(c, ctx, rule)) return true;
    }
    return false;
  }
  for (const c of conditions) {
    if (!(await evaluateSingleCondition(c, ctx, rule))) return false;
  }
  return true;
};

/**
 * Evaluates the full condition tree.
 * Tree shape: { operator: 'AND'|'OR', groups: [...] }
 * Empty / null conditions tree = always passes.
 */
export const evaluateConditions = async (conditionTree, ctx, rule) => {
  if (!conditionTree || !Array.isArray(conditionTree.groups) || !conditionTree.groups.length) {
    return true;
  }
  const { operator = "AND", groups } = conditionTree;
  if (operator === "OR") {
    for (const group of groups) {
      if (await evaluateGroup(group, ctx, rule)) return true;
    }
    return false;
  }
  for (const group of groups) {
    if (!(await evaluateGroup(group, ctx, rule))) return false;
  }
  return true;
};

// ── Reward calculator ─────────────────────────────────────────────────────────

export const calculateReward = async (reward, ctx, rule) => {
  if (!reward) return 0;
  const scope = rule.periodScope ?? "current_month";

  switch (reward.type) {
    case "fixed":
      return Math.max(0, Number(reward.value ?? 0));

    case "percentage": {
      const projectValue = ctx.lead ? Number(ctx.lead.projectValue ?? 0) : 0;
      return Math.max(0, (projectValue * Number(reward.value ?? 0)) / 100);
    }

    case "percentage_of_revenue": {
      const revenue = await ctx.getTotalRevenue(scope);
      return Math.max(0, (revenue * Number(reward.value ?? 0)) / 100);
    }

    case "tiered": {
      const tiers = Array.isArray(reward.tiers) ? reward.tiers : [];
      const metric = await ctx.getClosedClients(scope);
      // Support both `closedClients` (welcome-bonus style) and `min/max` (range style).
      // Last qualifying tier (sorted ascending) wins.
      let amount = 0;
      for (const tier of [...tiers].sort((a, b) => {
        const aThreshold = Number(a.closedClients ?? a.min ?? 0);
        const bThreshold = Number(b.closedClients ?? b.min ?? 0);
        return aThreshold - bThreshold;
      })) {
        const threshold = Number(tier.closedClients ?? tier.min ?? 0);
        const withinMax = tier.max === undefined || tier.max === null || metric <= Number(tier.max);
        const tierConditionsPassed = tier.conditions
          ? await evaluateConditions(tier.conditions, ctx, rule)
          : true;
        if (metric >= threshold && withinMax && tierConditionsPassed) {
          amount = Number(tier.amount ?? 0);
        }
      }
      return Math.max(0, amount);
    }

    /**
     * batch_initial_config — resolves tiered initial commission amount using
     * the partner's batch-specific tiers (or legacy single-tier from the
     * affiliateApplication) with fallback to global performance settings.
     * Used by the seeded "Initial Commission" rule.
     */
    case "batch_initial_config": {
      const aff = await ctx.getAffiliate();
      const batch = aff?.batchId
        ? await getBatchById(aff.batchId).catch(() => null)
        : null;
      const setting = await getActivePerformanceSetting();
      const closedClients = await ctx.getClosedClients(scope);

      const tiers = _normalizeBatchTiers(
        batch?.initialCommissionTiers,
        _getLegacyTier(aff, setting),
      );
      let amount = 0;
      for (const tier of tiers) {
        if (closedClients < tier.closedClients) continue;
        const tierConditionsPassed = tier.conditions
          ? await evaluateConditions(tier.conditions, ctx, rule)
          : true;
        if (tierConditionsPassed) {
          amount = Number(tier.amount || 0);
        }
      }
      return Math.max(0, amount);
    }

    /**
     * service_config — delegates to the per-service commission settings
     * stored in the `metas` table. Used by the seeded "Sales Commission" rule
     * for backward compatibility.
     */
    case "service_config": {
      if (!ctx.lead) return 0;
      const service = await getPartnerServiceById(ctx.lead.serviceId);
      if (!service) return 0;
      const projectValue = Number(ctx.lead.projectValue ?? service.projectValue ?? 0);
      const settings = await getPartnerSalesCommissionSettings();
      const config = resolveServiceCommissionConfig(service, settings);
      if (config.mode === "fixed") return Math.max(0, config.value);
      return Math.max(0, (projectValue * config.value) / 100);
    }

    default:
      return 0;
  }
};

// ── Idempotency helpers ───────────────────────────────────────────────────────

const findExistingByLeadAndRule = async (leadId, ruleId) => {
  const rows = await db
    .select({ id: partnerCommission.id })
    .from(partnerCommission)
    .where(and(eq(partnerCommission.leadId, leadId), eq(partnerCommission.ruleId, ruleId)))
    .limit(1);
  return rows[0] ?? null;
};

const findExistingByPeriodAndType = async (affiliateId, commissionType, period) => {
  const rows = await db
    .select({ id: partnerCommission.id, amount: partnerCommission.amount, status: partnerCommission.status })
    .from(partnerCommission)
    .where(
      and(
        eq(partnerCommission.affiliateId, affiliateId),
        eq(partnerCommission.commissionType, commissionType),
        eq(partnerCommission.period, period),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
};

const insertCommission = async ({
  affiliateId, leadId, serviceId, amount, commissionType, period, ruleId,
}) => {
  const id = uuidv4();
  await db.insert(partnerCommission).values({
    id,
    affiliateId,
    leadId: leadId ?? null,
    serviceId: serviceId ?? null,
    amount,
    commissionType,
    period: period ?? null,
    status: "Pending Transfer",
    ruleId: ruleId ?? null,
  });
  return id;
};

const updateCommissionAmountById = async (id, amount) => {
  await db
    .update(partnerCommission)
    .set({ amount, updatedAt: new Date() })
    .where(eq(partnerCommission.id, id));
};

// ── Engine entry points ───────────────────────────────────────────────────────

/**
 * evaluateLeadWonRules
 * Called every time a lead transitions to "Won".
 * Evaluates all active `lead_won` rules for this lead's affiliate.
 */
export const evaluateLeadWonRules = async (lead) => {
  if (!lead || lead.status !== "Won") return { evaluated: 0 };

  const rules = await getRulesByTrigger("lead_won");
  if (!rules.length) return { evaluated: 0 };

  const period = formatPeriod(new Date(lead.updatedAt ?? lead.createdAt));
  const ctx = buildContext(lead.affiliateId, { lead, period });
  let evaluated = 0;

  for (const rule of rules) {
    try {
      const passed = await evaluateConditions(rule.conditions, ctx, rule);
      if (!passed) {
        await logRuleEvaluation({
          ruleId: rule.id, affiliateId: lead.affiliateId, leadId: lead.id, period,
          outcome: "skipped", reason: "conditions not met",
        });
        continue;
      }

      const amount = await calculateReward(rule.reward, ctx, rule);
      if (amount <= 0) {
        await logRuleEvaluation({
          ruleId: rule.id, affiliateId: lead.affiliateId, leadId: lead.id, period,
          outcome: "skipped", reason: "reward calculated as 0",
        });
        continue;
      }

      // Per-lead scope: idempotency by (leadId, ruleId)
      const existing = await findExistingByLeadAndRule(lead.id, rule.id);
      if (existing) {
        await logRuleEvaluation({
          ruleId: rule.id, affiliateId: lead.affiliateId, leadId: lead.id, period,
          outcome: "skipped", reason: "commission already exists for this lead and rule",
        });
        continue;
      }

      await insertCommission({
        affiliateId: lead.affiliateId,
        leadId: lead.id,
        serviceId: lead.serviceId ?? null,
        amount,
        commissionType: rule.commissionType,
        period,
        ruleId: rule.id,
      });

      await logRuleEvaluation({
        ruleId: rule.id, affiliateId: lead.affiliateId, leadId: lead.id, period,
        outcome: "created", amount,
      });
      evaluated++;
    } catch (err) {
      await logRuleEvaluation({
        ruleId: rule.id, affiliateId: lead.affiliateId, leadId: lead.id, period,
        outcome: "error", reason: err?.message ?? String(err),
      }).catch(() => {});
    }
  }

  return { evaluated };
};

/**
 * evaluatePeriodicRules
 * Called by daily/monthly cron for each partner.
 * triggerType: 'daily_cron' | 'monthly_cron'
 */
export const evaluatePeriodicRules = async (affiliateId, { triggerType, now = new Date() } = {}) => {
  const rules = await getRulesByTrigger(triggerType);
  if (!rules.length) return { created: 0 };

  const period = formatPeriod(now);
  const ctx = buildContext(affiliateId, { now, period });
  let created = 0;

  for (const rule of rules) {
    try {
      const passed = await evaluateConditions(rule.conditions, ctx, rule);
      if (!passed) {
        await logRuleEvaluation({
          ruleId: rule.id, affiliateId, period,
          outcome: "skipped", reason: "conditions not met",
        });
        continue;
      }

      const amount = await calculateReward(rule.reward, ctx, rule);
      if (amount <= 0) {
        await logRuleEvaluation({
          ruleId: rule.id, affiliateId, period,
          outcome: "skipped", reason: "reward calculated as 0",
        });
        continue;
      }

      // Per-period scope: idempotency by (affiliateId, commissionType, period)
      const existing = await findExistingByPeriodAndType(affiliateId, rule.commissionType, period);

      if (existing) {
        // If it's Pending Transfer and the amount changed, update it (tiered progress)
        if (
          existing.status === "Pending Transfer" &&
          Number(existing.amount) !== amount
        ) {
          await updateCommissionAmountById(existing.id, amount);
          await logRuleEvaluation({
            ruleId: rule.id, affiliateId, period,
            outcome: "updated", amount, reason: `amount updated from ${existing.amount}`,
          });
          created++;
        } else {
          await logRuleEvaluation({
            ruleId: rule.id, affiliateId, period,
            outcome: "skipped", reason: "commission already exists for this period and type",
          });
        }
        continue;
      }

      await insertCommission({
        affiliateId,
        amount,
        commissionType: rule.commissionType,
        period,
        ruleId: rule.id,
      });

      await logRuleEvaluation({ ruleId: rule.id, affiliateId, period, outcome: "created", amount });
      created++;
    } catch (err) {
      await logRuleEvaluation({
        ruleId: rule.id, affiliateId, period,
        outcome: "error", reason: err?.message ?? String(err),
      }).catch(() => {});
    }
  }

  return { created };
};

/**
 * runDailyCronRules
 * Evaluates all daily_cron rules for every approved partner.
 */
export const runDailyCronRules = async ({ partners, now = new Date() } = {}) => {
  let total = 0;
  for (const partner of partners ?? []) {
    const result = await evaluatePeriodicRules(partner.affiliateId, {
      triggerType: "daily_cron",
      now,
    });
    total += result.created;
  }
  return { created: total };
};

/**
 * runMonthlyCronRules
 * Evaluates all monthly_cron rules for every approved partner.
 */
export const runMonthlyCronRules = async ({ partners, now = new Date() } = {}) => {
  let total = 0;
  for (const partner of partners ?? []) {
    const result = await evaluatePeriodicRules(partner.affiliateId, {
      triggerType: "monthly_cron",
      now,
    });
    total += result.created;
  }
  return { created: total };
};
