/**
 * commission-rule.seed.js
 *
 * Seeds the three original hardcoded commission types as rows in `commission_rule`.
 * Safe to run multiple times — uses rule name as the idempotency key.
 *
 * Called once on server start (from index.js or migrate.js).
 */

import {
  createCommissionRule,
  getRuleByName,
  updateCommissionRule,
} from "./commission-rule.repository.js";
import { getActivePerformanceSetting } from "./partner.repository.js";

const SEED_RULES = [
  // ── 1. Sales Commission ─────────────────────────────────────────────────────
  // Fires on every lead that reaches "Won". Amount is resolved per-service
  // from the `metas` table (the existing service_config settings).
  // No extra conditions needed — the lead_won trigger already requires status = Won.
  {
    name: "Sales Commission",
    description:
      "Generated automatically when a lead is marked as Won. " +
      "Commission amount is resolved from the per-service configuration.",
    triggerType: "lead_won",
    commissionType: "sales",
    scope: "per_lead",
    periodScope: "any_month",
    conditions: { operator: "AND", groups: [] },
    reward: { type: "service_config" },
    priority: 0,
  },

  // ── 2. Initial Commission ───────────────────────────────────────────────────
  // Daily cron evaluates whether a partner crossed the closed-client threshold
  // in their very first calendar month. Uses global settings as defaults;
  // batch-level overrides are handled by the per-service config fallback.
  {
    name: "Initial Commission",
    description:
      "Awarded when a partner closes the required number of clients during " +
      "their first calendar month. Amount and threshold are configured in " +
      "Performance Settings.",
    triggerType: "daily_cron",
    commissionType: "initial",
    scope: "per_period",
    periodScope: "first_month",
    conditions: {
      operator: "AND",
      groups: [
        {
          operator: "AND",
          conditions: [
            {
              field: "closed_clients",
              op: "gte",
              // Threshold is read from partnerPerformanceSetting at seed time
              // and embedded into the rule. Admin can edit it via the UI.
              value: 2,
            },
            { field: "is_first_month", op: "eq", value: true },
          ],
        },
      ],
    },
    // Kept as an inactive legacy fallback. Real welcome-bonus rules are now
    // created per batch so each batch owns its own tiers and conditions.
    reward: { type: "batch_initial_config" },
    isActive: false,
    priority: 10,
  },

  // ── 3. Basic Salary ─────────────────────────────────────────────────────────
  // Monthly cron (runs on payout date). Awards a fixed amount when the
  // partner's total project value for the month meets the threshold.
  {
    name: "Basic Salary",
    description:
      "Monthly bonus awarded when a partner's total closed revenue in the " +
      "current month meets or exceeds the sales threshold. Runs on the " +
      "configured payout date each month.",
    triggerType: "monthly_cron",
    commissionType: "basic_salary",
    scope: "per_period",
    periodScope: "current_month",
    conditions: {
      operator: "AND",
      groups: [
        {
          operator: "AND",
          conditions: [
            {
              field: "total_revenue",
              op: "gte",
              value: 35000, // synced from settings at seed time
            },
          ],
        },
      ],
    },
    reward: {
      type: "fixed",
      value: 3500, // synced from settings at seed time
    },
    priority: 20,
  },
];

export const seedCommissionRules = async () => {
  const results = { created: 0, skipped: 0 };

  // Sync threshold / amount values from the live performance settings
  let setting = null;
  try {
    setting = await getActivePerformanceSetting();
  } catch {
    // No settings yet — leave defaults from SEED_RULES
  }

  for (const template of SEED_RULES) {
    const existing = await getRuleByName(template.name);
    if (existing) {
      if (
        template.name === "Initial Commission" &&
        existing.isActive &&
        existing.reward?.type === "batch_initial_config"
      ) {
        await updateCommissionRule(existing.id, {
          isActive: false,
          description:
            "Legacy global welcome bonus fallback. Per-batch welcome bonus rules are now the active source of truth.",
        });
      }
      results.skipped++;
      continue;
    }

    const rule = structuredClone(template);

    // Sync Initial Commission threshold from live settings
    if (rule.name === "Initial Commission" && setting) {
      const threshold = Number(setting.initialCommissionFullClientThreshold || 2);
      rule.conditions.groups[0].conditions[0].value = threshold;
    }

    // Sync Basic Salary values from live settings
    if (rule.name === "Basic Salary" && setting) {
      rule.conditions.groups[0].conditions[0].value = Number(
        setting.basicSalarySalesThreshold || 35000,
      );
      rule.reward.value = Number(setting.basicSalaryAmount || 3500);
    }

    await createCommissionRule(rule);
    results.created++;
  }

  return results;
};
