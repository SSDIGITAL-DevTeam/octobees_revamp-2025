import { and, asc, desc, eq, inArray } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { commissionRule, commissionRuleLog } from "../../drizzle/schema.js";
import { v4 as uuidv4 } from "uuid";

// ── Rule CRUD ─────────────────────────────────────────────────────────────────

export const listCommissionRules = async ({ includeInactive = false } = {}) => {
  const rows = await db
    .select()
    .from(commissionRule)
    .where(includeInactive ? undefined : eq(commissionRule.isActive, true))
    .orderBy(asc(commissionRule.priority), asc(commissionRule.createdAt));
  return rows;
};

export const getCommissionRuleById = async (id) => {
  const rows = await db
    .select()
    .from(commissionRule)
    .where(eq(commissionRule.id, id))
    .limit(1);
  return rows[0] ?? null;
};

export const getRulesByTrigger = async (triggerType) => {
  return db
    .select()
    .from(commissionRule)
    .where(
      and(
        eq(commissionRule.triggerType, triggerType),
        eq(commissionRule.isActive, true),
      ),
    )
    .orderBy(asc(commissionRule.priority), asc(commissionRule.createdAt));
};

export const createCommissionRule = async (data) => {
  const id = uuidv4();
  await db.insert(commissionRule).values({
    id,
    name: data.name,
    description: data.description ?? null,
    triggerType: data.triggerType,
    commissionType: data.commissionType,
    scope: data.scope ?? "per_period",
    periodScope: data.periodScope ?? "current_month",
    conditions: data.conditions ?? null,
    reward: data.reward ?? null,
    isActive: data.isActive ?? true,
    priority: data.priority ?? 0,
  });
  return getCommissionRuleById(id);
};

export const updateCommissionRule = async (id, data) => {
  const allowed = [
    "name", "description", "triggerType", "commissionType",
    "scope", "periodScope", "conditions", "reward", "isActive", "priority",
  ];
  const patch = Object.fromEntries(
    Object.entries(data).filter(([k]) => allowed.includes(k)),
  );
  if (!Object.keys(patch).length) return getCommissionRuleById(id);
  patch.updatedAt = new Date();
  await db.update(commissionRule).set(patch).where(eq(commissionRule.id, id));
  return getCommissionRuleById(id);
};

export const deleteCommissionRule = async (id) => {
  await db.delete(commissionRule).where(eq(commissionRule.id, id));
};

export const getRuleByName = async (name) => {
  const rows = await db
    .select()
    .from(commissionRule)
    .where(eq(commissionRule.name, name))
    .limit(1);
  return rows[0] ?? null;
};

// ── Rule Log ──────────────────────────────────────────────────────────────────

export const logRuleEvaluation = async ({
  ruleId,
  affiliateId,
  leadId = null,
  period = null,
  outcome,
  reason = null,
  amount = null,
}) => {
  const id = uuidv4();
  await db.insert(commissionRuleLog).values({
    id,
    ruleId,
    affiliateId,
    leadId,
    period,
    outcome,
    reason,
    amount,
  });
  return id;
};

export const listRuleLogs = async ({
  ruleId,
  affiliateId,
  limit = 50,
  offset = 0,
} = {}) => {
  const conditions = [];
  if (ruleId) conditions.push(eq(commissionRuleLog.ruleId, ruleId));
  if (affiliateId) conditions.push(eq(commissionRuleLog.affiliateId, affiliateId));

  return db
    .select()
    .from(commissionRuleLog)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(commissionRuleLog.evaluatedAt))
    .limit(limit)
    .offset(offset);
};
