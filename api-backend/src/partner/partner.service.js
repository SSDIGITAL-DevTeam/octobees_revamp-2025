import {
  getAllPartnerServices,
  getAllSalesMaterials as getAllSalesMaterialsRepo,
  getSalesMaterialById,
  createSalesMaterial as createSalesMaterialRepo,
  updateSalesMaterial as updateSalesMaterialRepo,
  deleteSalesMaterial as deleteSalesMaterialRepo,
  getPartnerServiceById,
  getPartnerLeads,
  getLeadById,
  createLead,
  createLeadActivity,
  updateLead,
  deleteLead,
  getCommissionHistory,
  createCommissionForLead,
  getDashboardStats,
  getActivePerformanceSetting,
  updateActivePerformanceSetting,
  getAffiliateLifecycle,
  getClosedWonStatsForPeriod,
  getPerformanceLeaderboardForPeriod,
  getRecentLeads,
  getGlobalDashboardStats,
  getAllRecentLeads,
  getAllPendingCommissions,
  getAllPartners as getAllPartnersRepo,
  getPartnerById as getPartnerByIdRepo,
  updatePartner as updatePartnerRepo,
  deletePartner as deletePartnerRepo,
  getAllLeads,
  getLeadByIdBackOffice,
  updateLeadBackOffice,
  deleteLeadBackOffice,
  getLeadActivities,
  getAllServicesBackOffice,
  getPartnersDueForPerformanceTermination,
  markPartnerPerformanceAlert,
  terminatePartnerForPerformance,
  getServiceById,
  createService,
  updateService,
  deleteService,
  findLeadById,
  findNotesByLeadId,
  insertLeadNote,
  updateLeadNoteById,
  deleteLeadNoteById,
  listCommissionsForBackOffice,
  getCommissionByIdBackOffice,
  markCommissionPaid,
  revertCommissionToPending,
  rejectCommission,
  createPeriodicCommission,
  getCommissionByTypePeriod,
  updateCommissionAmount,
  DEFAULT_LEAD_PIPELINE_STATUSES,
  getLeadPipelineStatusByValue,
  listLeadPipelineStatuses,
  seedDefaultLeadPipelineStatuses,
  updateLeadPipelineStatuses as updateLeadPipelineStatusesRepo,
  DEFAULT_VERTICAL_MARKETS,
  listVerticalMarkets,
  seedDefaultVerticalMarkets,
  updateVerticalMarkets as updateVerticalMarketsRepo,
  getVerticalMarketById,
  getVerticalMarketByName,
  createVerticalMarket,
  replaceLeadServices,
} from "./partner.repository.js";
import {
  findMetasByTarget,
  replaceMetaByKey,
  upsertMeta,
} from "../meta/meta.repository.js";
import { cleanupRemovedContentImages } from "../blog/blog.service.js";
import {
  getBatchById,
  saveBatchRecruitmentMeta,
} from "../affiliate-batch/batch.repository.js";
import {
  createCommissionRule,
  getRuleByName,
  listCommissionRules,
  updateCommissionRule,
} from "./commission-rule.repository.js";

const normalizeLeadStatus = (status) => {
  switch (status) {
    case "Lead Created":
      return "New Leads";
    case "Proposal Sent":
      return "Contacted";
    case "Follow-up":
      return "Follow-up Day-1";
    default:
      return status;
  }
};
import { v4 as uuidv7 } from "uuid";
import { updateAffiliateApplication } from "../affiliate/affiliate.repository.js";
import { updatePartnerRegistrationData } from "../assessment/assessment.repository.js";
import { requestAffiliatePasswordReset } from "../affiliate/affiliate.auth.service.js";

const PARTNER_RECRUITMENT_SETTINGS_ID = "partner-recruitment-system";
const PARTNER_RECRUITMENT_SETTINGS_TYPE = "partner_settings";
const PARTNER_TERMS_META_KEY = "terms_and_conditions_html";
const PARTNER_SALES_COMMISSION_META_KEY = "sales_commission_settings_json";
const PARTNER_CURRENCY_META_KEY = "currency_code";
const PARTNER_CURRENCY_CODES = new Set(["USD", "SGD", "IDR"]);
const DEFAULT_PARTNER_TERMS_HTML =
  "<p>Input Terms &amp; Conditions for partners here.</p>";
const DEFAULT_PARTNER_CURRENCY = "USD";

const DEFAULT_LEAD_PIPELINE_STATUS_VALUES = new Set(
  DEFAULT_LEAD_PIPELINE_STATUSES.map((status) => status.value),
);
const PIPELINE_STATUS_COLORS = new Set(["blue", "purple", "green", "red", "slate"]);

const normalizeVerticalMarketItem = (item, fallback = {}, index = 0) => {
  const rawName = String(item?.name || fallback.name || "").trim();
  const name = rawName.slice(0, 120);
  if (!name) throw new Error("Vertical market name is required.");

  return {
    id: item?.id || fallback.id,
    name,
    sortOrder: Number.isFinite(Number(item?.sortOrder ?? fallback.sortOrder))
      ? Number(item?.sortOrder ?? fallback.sortOrder)
      : index + 1,
    isActive: parseBooleanInput(item?.isActive, fallback.isActive ?? true),
    isSystem: parseBooleanInput(item?.isSystem, fallback.isSystem ?? false),
  };
};

const normalizeVerticalMarkets = (markets = DEFAULT_VERTICAL_MARKETS) =>
  (Array.isArray(markets) ? markets : [])
    .map((item, index) => normalizeVerticalMarketItem(item, {}, index))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

const syncBasicSalaryRuleWithSettings = async (setting) => {
  const rule =
    (await getRuleByName("Basic Salary")) ||
    (await listCommissionRules({ includeInactive: true })).find(
      (item) => item.commissionType === "basic_salary",
    );
  if (!rule) return;

  const threshold = Number(setting.basicSalarySalesThreshold || 35000);
  const amount = Number(setting.basicSalaryAmount || 0);
  const conditionTree =
    rule.conditions &&
    typeof rule.conditions === "object" &&
    Array.isArray(rule.conditions.groups)
      ? structuredClone(rule.conditions)
      : { operator: "AND", groups: [{ operator: "AND", conditions: [] }] };

  if (!Array.isArray(conditionTree.groups) || conditionTree.groups.length === 0) {
    conditionTree.groups = [{ operator: "AND", conditions: [] }];
  }

  let thresholdSynced = false;
  conditionTree.groups = conditionTree.groups.map((group) => {
    const conditions = Array.isArray(group.conditions) ? group.conditions : [];
    return {
      ...group,
      conditions: conditions.map((condition) => {
        if (condition.field !== "total_revenue") return condition;
        thresholdSynced = true;
        return { ...condition, op: condition.op || "gte", value: threshold };
      }),
    };
  });

  if (!thresholdSynced) {
    conditionTree.groups[0].conditions = [
      ...(conditionTree.groups[0].conditions || []),
      { field: "total_revenue", op: "gte", value: threshold },
    ];
  }

  await updateCommissionRule(rule.id, {
    conditions: conditionTree,
    reward: {
      ...(rule.reward && typeof rule.reward === "object" ? rule.reward : {}),
      type: "fixed",
      value: amount,
    },
  });
};

const getRuleConditions = (conditions) => {
  if (!conditions || typeof conditions !== "object") return [];
  if (!Array.isArray(conditions.groups)) return [];
  return conditions.groups.flatMap((group) =>
    Array.isArray(group?.conditions) ? group.conditions : [],
  );
};

const getRuleConditionValue = (conditions, field) => {
  const condition = getRuleConditions(conditions).find(
    (item) => item?.field === field,
  );
  return condition?.value;
};

const getSalesRuleServiceId = (rule) => {
  if (rule?.commissionType !== "sales") return null;
  const serviceId = getRuleConditionValue(rule.conditions, "lead_service_id");
  return serviceId ? String(serviceId) : null;
};

const getInitialRuleBatchId = (rule) => {
  if (rule?.commissionType !== "initial") return null;
  const batchId = getRuleConditionValue(rule.conditions, "batch_id");
  return batchId ? String(batchId) : null;
};

const getBasicSalaryThreshold = (rule) => {
  const condition = getRuleConditions(rule?.conditions).find(
    (item) => item?.field === "total_revenue",
  );
  const value = Number(condition?.value);
  return Number.isFinite(value) && value > 0 ? value : null;
};

const normalizeRuleRewardToServiceConfig = (reward = {}) => {
  if (reward?.type === "fixed") {
    const value = normalizeSalesCommissionValue(reward.value);
    return { mode: "fixed", value };
  }
  if (reward?.type === "percentage") {
    const value = normalizeSalesCommissionValue(reward.value);
    return { mode: "percentage", value };
  }
  return null;
};

const buildServiceSalesRuleConditions = (serviceId) => ({
  operator: "AND",
  groups: [
    {
      operator: "AND",
      conditions: [{ field: "lead_service_id", op: "eq", value: serviceId }],
    },
  ],
});

const buildServiceSalesRuleReward = ({ mode, value }) => ({
  type: mode === "fixed" ? "fixed" : "percentage",
  value: normalizeSalesCommissionValue(value),
});

const findSalesRuleForService = async (serviceId) => {
  const rules = await listCommissionRules({ includeInactive: true });
  return (
    rules.find((rule) => getSalesRuleServiceId(rule) === String(serviceId)) ||
    null
  );
};

const syncSalesCommissionRuleForService = async (service, config) => {
  if (!service?.id) return null;

  const existingRule = await findSalesRuleForService(service.id);
  const payload = {
    name: `Sales Commission - ${service.name}`,
    description: `Sales commission for ${service.name}.`,
    triggerType: "lead_won",
    commissionType: "sales",
    scope: "per_lead",
    periodScope: "any_month",
    conditions:
      existingRule?.conditions || buildServiceSalesRuleConditions(service.id),
    reward: buildServiceSalesRuleReward(config),
    isActive: existingRule?.isActive ?? true,
    priority: existingRule?.priority ?? -1,
  };

  if (existingRule) {
    return updateCommissionRule(existingRule.id, payload);
  }

  return createCommissionRule(payload);
};

export const syncCommissionRuleToSource = async (rule) => {
  if (!rule) return;

  if (rule.commissionType === "basic_salary") {
    const payload = {};
    const amount = Number(rule.reward?.type === "fixed" ? rule.reward.value : NaN);
    const threshold = getBasicSalaryThreshold(rule);

    if (Number.isFinite(amount) && amount >= 0) {
      payload.basicSalaryAmount = amount;
    }
    if (threshold !== null) {
      payload.basicSalarySalesThreshold = threshold;
    }
    if (Object.keys(payload).length) {
      await updateActivePerformanceSetting(payload);
    }
    return;
  }

  if (rule.commissionType === "initial") {
    const batchId = getInitialRuleBatchId(rule);
    const tiers = Array.isArray(rule.reward?.tiers) ? rule.reward.tiers : null;
    if (batchId && tiers) {
      await saveBatchRecruitmentMeta(batchId, {
        initialCommissionTiers: tiers,
      });
    }
    return;
  }

  if (rule.commissionType === "sales") {
    const serviceId = getSalesRuleServiceId(rule);
    const config = normalizeRuleRewardToServiceConfig(rule.reward);
    if (serviceId && config) {
      await updateServiceCommissionSetting(serviceId, config, {
        syncRule: false,
      });
    }
  }
};

const parseOptionalDate = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid follow-up date");
  }
  return date;
};

const stringifyMetadata = (value) => {
  if (!value || typeof value !== "object") return null;
  return JSON.stringify(value);
};

const parseJsonContent = (value, fallback) => {
  if (typeof value !== "string" || !value.trim()) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizePipelineStatusItem = (item, fallback = {}, index = 0) => {
  const rawValue = String(item?.value || item?.label || fallback.value || "").trim();
  const value = rawValue.slice(0, 80);
  if (!value) {
    throw new Error("Pipeline status value is required.");
  }

  const rawLabel = String(item?.label || fallback.label || value).trim();
  const rawColor = String(item?.color || fallback.color || "slate").trim();
  const order = Number(item?.sortOrder ?? item?.order ?? fallback.sortOrder ?? index + 1);
  const isDefault = DEFAULT_LEAD_PIPELINE_STATUS_VALUES.has(value);

  return {
    value,
    label: (rawLabel || value).slice(0, 120),
    color: PIPELINE_STATUS_COLORS.has(rawColor) ? rawColor : "slate",
    isActive: item?.isActive === undefined ? fallback.isActive ?? true : Boolean(item.isActive),
    sortOrder: Number.isFinite(order) && order > 0 ? order : index + 1,
    isSystem: isDefault ? true : Boolean(item?.isSystem || fallback.isSystem),
  };
};

const normalizePipelineStatuses = (statuses = DEFAULT_LEAD_PIPELINE_STATUSES) => {
  const normalizedMap = new Map();

  DEFAULT_LEAD_PIPELINE_STATUSES.forEach((fallback, index) => {
    normalizedMap.set(
      fallback.value,
      normalizePipelineStatusItem(fallback, fallback, index),
    );
  });

  (Array.isArray(statuses) ? statuses : []).forEach((item, index) => {
    const normalized = normalizePipelineStatusItem(item, {}, index);
    normalizedMap.set(normalized.value, normalized);
  });

  return [...normalizedMap.values()].sort(
    (a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label),
  );
};

export const getLeadPipelineStatuses = async ({ includeInactive = true } = {}) => {
  let statuses = await listLeadPipelineStatuses({ includeInactive: true });

  if (!statuses.length) {
    statuses = await seedDefaultLeadPipelineStatuses();
  }

  const normalized = normalizePipelineStatuses(statuses);
  return includeInactive ? normalized : normalized.filter((status) => status.isActive);
};

export const updateLeadPipelineStatuses = async (statuses = []) => {
  const normalized = normalizePipelineStatuses(statuses);
  return updateLeadPipelineStatusesRepo(normalized);
};

export const getVerticalMarkets = async ({ includeInactive = true } = {}) => {
  let markets = await listVerticalMarkets({ includeInactive: true });
  if (!markets.length) {
    markets = await seedDefaultVerticalMarkets();
  }
  const normalized = normalizeVerticalMarkets(markets);
  return includeInactive ? normalized : normalized.filter((market) => market.isActive);
};

export const updateVerticalMarkets = async (markets = []) => {
  const normalized = normalizeVerticalMarkets(markets);
  if (normalized.filter((market) => market.isActive).length === 0) {
    throw new Error("At least one vertical market must remain active.");
  }
  const names = normalized.map((market) => market.name.toLowerCase());
  if (new Set(names).size !== names.length) {
    throw new Error("Vertical market names must be unique.");
  }
  return updateVerticalMarketsRepo(normalized);
};

const resolveLeadVerticalMarket = async (leadData = {}) => {
  const rawId = leadData.verticalMarketId ?? leadData.vertical_market_id;
  const rawName =
    leadData.verticalMarketName ??
    leadData.vertical_market_name ??
    leadData.businessMarket ??
    leadData.business_market;

  if (rawId) {
    const market = await getVerticalMarketById(rawId);
    if (!market || !market.isActive) {
      throw new Error("Selected vertical market is disabled or unavailable.");
    }
    return { verticalMarketId: market.id, verticalMarketName: market.name };
  }

  const name = String(rawName || "").trim();
  if (!name) {
    throw new Error("Vertical market is required.");
  }

  let market = await getVerticalMarketByName(name);
  if (!market) {
    market = await createVerticalMarket({
      id: uuidv7(),
      name: name.slice(0, 120),
      sortOrder: (await getVerticalMarkets({ includeInactive: true })).length + 1,
      isActive: true,
      isSystem: false,
    });
  }
  if (!market?.isActive) {
    throw new Error("Selected vertical market is disabled or unavailable.");
  }

  return { verticalMarketId: market.id, verticalMarketName: market.name };
};

const assertLeadStatusCanBeSelected = async (status) => {
  const normalized = normalizeLeadStatus(status);
  let statusRow = await getLeadPipelineStatusByValue(normalized);
  if (!statusRow) {
    await seedDefaultLeadPipelineStatuses();
    statusRow = await getLeadPipelineStatusByValue(normalized);
  }
  const allowed = Boolean(statusRow?.isActive);

  if (!allowed) {
    throw new Error(`Pipeline status "${normalized}" is disabled or unavailable.`);
  }

  return normalized;
};

const getDefaultSelectableLeadStatus = async () => {
  const statuses = await getLeadPipelineStatuses({ includeInactive: false });
  const defaultStatus =
    statuses.find((status) => status.value === "New Leads") || statuses[0];

  if (!defaultStatus) {
    throw new Error("At least one active pipeline status is required.");
  }

  return defaultStatus.value;
};

const parseBooleanInput = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const startOfMonth = (date = new Date()) =>
  new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);

const addMonths = (date, months) =>
  new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const normalizeSalesCommissionMode = (value) =>
  value === "fixed" ? "fixed" : "percentage";

const normalizeSalesCommissionValue = (value) => {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
};

const getDefaultSalesCommissionConfig = (service) => ({
  mode: "percentage",
  value: normalizeSalesCommissionValue(service?.commissionPercentage ?? 0),
});

const normalizeInitialCommissionTiers = (tiers = [], fallback = []) => {
  const source =
    Array.isArray(tiers) && tiers.length > 0
      ? tiers
      : Array.isArray(fallback)
        ? fallback
        : [];

  return source
    .map((item) => {
      const closedClients = Math.round(
        Number(item?.closedClients ?? item?.targetClients),
      );
      const amount = Number(item?.amount);

      if (!Number.isFinite(closedClients) || closedClients < 1) return null;
      if (!Number.isFinite(amount) || amount < 0) return null;

      return {
        closedClients,
        amount,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.closedClients - b.closedClients)
    .filter(
      (item, index, list) =>
        list.findIndex(
          (candidate) => candidate.closedClients === item.closedClients,
        ) === index,
    );
};

const getLegacyInitialCommissionTier = (lifecycle, setting) => {
  const amount = Number(lifecycle?.initialCommissionAmount || 0);
  const batchThresholdRaw = Number(
    lifecycle?.batchInitialCommissionThreshold || 0,
  );
  const fallbackThreshold = Number(
    setting?.initialCommissionFullClientThreshold || 2,
  );
  const threshold = batchThresholdRaw > 0 ? batchThresholdRaw : fallbackThreshold;

  if (amount <= 0 || threshold <= 0) return [];

  return [{ closedClients: threshold, amount }];
};

const resolveInitialCommissionProgress = (closedClients, tiers = []) => {
  const normalizedTiers = normalizeInitialCommissionTiers(tiers);
  const currentTier =
    normalizedTiers.filter((tier) => closedClients >= tier.closedClients).at(-1) ||
    null;
  const nextTier =
    normalizedTiers.find((tier) => closedClients < tier.closedClients) || null;
  const maxTier = normalizedTiers.at(-1) || null;

  return {
    tiers: normalizedTiers,
    currentTier,
    nextTier,
    maxTier,
    eligibleAmount: Number(currentTier?.amount || 0),
    configuredAmount: Number(maxTier?.amount || 0),
    targetClosedClients: Number(maxTier?.closedClients || 0),
  };
};

export const getPartnerSalesCommissionSettings = async () => {
  const metas = await findMetasByTarget(
    PARTNER_RECRUITMENT_SETTINGS_ID,
    PARTNER_RECRUITMENT_SETTINGS_TYPE,
  );

  const settingsMeta = metas.find(
    (item) => item.key === PARTNER_SALES_COMMISSION_META_KEY,
  );

  const rawSettings = parseJsonContent(settingsMeta?.content, {});

  if (!rawSettings || typeof rawSettings !== "object") {
    return {};
  }

  return Object.entries(rawSettings).reduce((acc, [serviceId, item]) => {
    if (!serviceId || !item || typeof item !== "object") return acc;

    acc[serviceId] = {
      mode: normalizeSalesCommissionMode(item.mode),
      value: normalizeSalesCommissionValue(item.value),
    };

    return acc;
  }, {});
};

// Exported so the commission rule engine can use it for `service_config` reward type
export const resolveServiceCommissionConfig = (service, settings = {}) => {
  if (!service?.id) return getDefaultSalesCommissionConfig(service);

  const savedConfig = settings[service.id];
  if (!savedConfig) return getDefaultSalesCommissionConfig(service);

  return {
    mode: normalizeSalesCommissionMode(savedConfig.mode),
    value:
      normalizeSalesCommissionMode(savedConfig.mode) === "fixed"
        ? normalizeSalesCommissionValue(savedConfig.value)
        : normalizeSalesCommissionValue(
            savedConfig.value ?? service?.commissionPercentage,
          ),
  };
};

const decorateServiceCommission = (service, settings = {}) => {
  if (!service) return service;

  const commissionConfig = resolveServiceCommissionConfig(service, settings);

  return {
    ...service,
    commissionMode: commissionConfig.mode,
    commissionValue: commissionConfig.value,
  };
};

const decorateServicesCommission = (services = [], settings = {}) =>
  services.map((service) => decorateServiceCommission(service, settings));

const calculateCommissionAmount = async (lead, service) => {
  const projectValue = Number(lead.projectValue ?? service?.projectValue ?? 0);
  const salesCommissionSettings = await getPartnerSalesCommissionSettings();
  const commissionConfig = resolveServiceCommissionConfig(
    service,
    salesCommissionSettings,
  );

  if (commissionConfig.mode === "fixed") {
    return Math.max(0, commissionConfig.value);
  }

  return Math.max(0, (projectValue * commissionConfig.value) / 100);
};

/**
 * ensureCommissionForClosedWonLead
 * Delegates to the commission rule engine so all active `lead_won` rules
 * are evaluated (including any custom rules admins create).
 * Falls back to direct insertion if no rules are seeded yet.
 */
const ensureCommissionForClosedWonLead = async (lead) => {
  if (!lead || lead.status !== "Won") return null;

  // Lazy import to avoid circular dependency (engine imports back from this module)
  const { evaluateLeadWonRules } = await import("./commission-rule.engine.js");
  const result = await evaluateLeadWonRules(lead);

  // If the engine evaluated 0 rules (not yet seeded), fall back to legacy behaviour
  if (result?.evaluated === 0) {
    const service = await getPartnerServiceById(lead.serviceId);
    if (!service) return null;
    return createCommissionForLead({
      affiliateId: lead.affiliateId,
      leadId: lead.id,
      serviceId: lead.serviceId,
      amount: await calculateCommissionAmount(lead, service),
    });
  }

  return result;
};

// ==================== SERVICES ====================

export const getAvailableServices = async () => {
  const [services, settings] = await Promise.all([
    getAllPartnerServices(),
    getPartnerSalesCommissionSettings(),
  ]);

  return decorateServicesCommission(services, settings);
};

export const getAvailableSalesMaterials = async () => {
  return await getAllSalesMaterialsRepo({ includeInactive: false });
};

export const getPartnerTermsAndConditions = async () => {
  const metas = await findMetasByTarget(
    PARTNER_RECRUITMENT_SETTINGS_ID,
    PARTNER_RECRUITMENT_SETTINGS_TYPE,
  );

  const termsMeta = metas.find((item) => item.key === PARTNER_TERMS_META_KEY);

  return {
    html:
      typeof termsMeta?.content === "string" && termsMeta.content.trim()
        ? termsMeta.content
        : DEFAULT_PARTNER_TERMS_HTML,
  };
};

export const getPartnerCurrencyConfig = async () => {
  const metas = await findMetasByTarget(
    PARTNER_RECRUITMENT_SETTINGS_ID,
    PARTNER_RECRUITMENT_SETTINGS_TYPE,
  );

  const currencyMeta = metas
    .filter((item) => item.key === PARTNER_CURRENCY_META_KEY)
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))[0];
  const currency = String(currencyMeta?.value || currencyMeta?.content || "")
    .trim()
    .toUpperCase();

  return {
    currency: PARTNER_CURRENCY_CODES.has(currency)
      ? currency
      : DEFAULT_PARTNER_CURRENCY,
  };
};

export const updatePartnerCurrencyConfig = async (rawCurrency) => {
  const currency = String(rawCurrency || "").trim().toUpperCase();
  if (!PARTNER_CURRENCY_CODES.has(currency)) {
    throw new Error("Invalid currency code");
  }

  await replaceMetaByKey({
    metaableId: PARTNER_RECRUITMENT_SETTINGS_ID,
    metaableType: PARTNER_RECRUITMENT_SETTINGS_TYPE,
    key: PARTNER_CURRENCY_META_KEY,
    value: currency,
    content: currency,
  });

  return { currency };
};

export const getPartnerCommissionPolicyReference = async (affiliateId) => {
  const [rules, services, pipelineStatuses, verticalMarkets, lifecycle] =
    await Promise.all([
      listCommissionRules({ includeInactive: false }),
      getAvailableServices(),
      getLeadPipelineStatuses({ includeInactive: false }),
      getVerticalMarkets({ includeInactive: false }),
      getAffiliateLifecycle(affiliateId).catch(() => null),
    ]);

  const batchId = lifecycle?.batchId || null;
  const isRelevantForPartnerBatch = (rule) => {
    const allConditions =
      rule.conditions?.groups?.flatMap((group) => group.conditions || []) || [];
    const batchConditions = allConditions.filter(
      (condition) => condition.field === "batch_id",
    );
    if (!batchConditions.length) return true;
    return batchConditions.some(
      (condition) => String(condition.value) === String(batchId),
    );
  };

  return {
    batchId,
    batchName: lifecycle?.batchName || null,
    dictionaries: {
      services: Object.fromEntries(services.map((item) => [item.id, item.name])),
      pipelineStatuses: Object.fromEntries(
        pipelineStatuses.map((item) => [item.value, item.label || item.value]),
      ),
      verticalMarkets: Object.fromEntries(
        verticalMarkets.map((item) => [item.id, item.name]),
      ),
    },
    rules: rules
      .filter((rule) => rule.commissionType !== "initial" || isRelevantForPartnerBatch(rule))
      .map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        triggerType: rule.triggerType,
        commissionType: rule.commissionType,
        scope: rule.scope,
        periodScope: rule.periodScope,
        conditions: rule.conditions,
        reward: rule.reward,
        priority: rule.priority,
      })),
  };
};

export const updatePartnerTermsAndConditions = async (html) => {
  if (typeof html !== "string" || !html.trim()) {
    throw new Error("Terms & Conditions content is required");
  }

  const currentTerms = await getPartnerTermsAndConditions();

  if (currentTerms.html && currentTerms.html !== html) {
    cleanupRemovedContentImages(currentTerms.html, html);
  }

  await upsertMeta({
    metaableId: PARTNER_RECRUITMENT_SETTINGS_ID,
    metaableType: PARTNER_RECRUITMENT_SETTINGS_TYPE,
    key: PARTNER_TERMS_META_KEY,
    value: PARTNER_TERMS_META_KEY,
    content: html,
  });

  return {
    html,
  };
};

export const getAllSalesMaterialsForBackOffice = async () => {
  return await getAllSalesMaterialsRepo({ includeInactive: true });
};

export const createSalesMaterial = async (raw = {}) => {
  if (!raw.title?.trim()) {
    throw new Error("Sales material title is required");
  }

  const materialType = raw.materialType || "rich_text";
  const isUrlType = materialType === "video" || materialType === "link";
  const isFileType = materialType === "file";
  const isRichTextType = materialType === "rich_text";

  if (isRichTextType && !raw.content?.trim()) {
    throw new Error("Content is required for rich text material");
  }

  if (isUrlType && !raw.externalUrl?.trim()) {
    throw new Error("External URL is required for this material type");
  }

  if (isFileType && !raw.fileUrl?.trim()) {
    throw new Error("File upload is required for file material");
  }

  return await createSalesMaterialRepo({
    id: uuidv7(),
    title: raw.title.trim(),
    summary: raw.summary?.trim() || null,
    materialType,
    content: raw.content ?? null,
    externalUrl: raw.externalUrl?.trim() || null,
    fileUrl: raw.fileUrl?.trim() || null,
    fileName: raw.fileName?.trim() || null,
    mimeType: raw.mimeType?.trim() || null,
    sortOrder: Number(raw.sortOrder ?? 0),
    isActive: parseBooleanInput(raw.isActive, true),
  });
};

export const updateSalesMaterial = async (id, raw = {}) => {
  const existing = await getSalesMaterialById(id);
  if (!existing) throw new Error("Sales material not found");

  const nextMaterialType = raw.materialType ?? existing.materialType;
  const payload = {};

  if (raw.title !== undefined) payload.title = raw.title.trim();
  if (raw.summary !== undefined) payload.summary = raw.summary?.trim() || null;
  if (raw.materialType !== undefined) payload.materialType = raw.materialType;
  if (raw.content !== undefined) payload.content = raw.content || null;
  if (raw.externalUrl !== undefined)
    payload.externalUrl = raw.externalUrl?.trim() || null;
  if (raw.fileUrl !== undefined) payload.fileUrl = raw.fileUrl?.trim() || null;
  if (raw.fileName !== undefined)
    payload.fileName = raw.fileName?.trim() || null;
  if (raw.mimeType !== undefined)
    payload.mimeType = raw.mimeType?.trim() || null;
  if (raw.sortOrder !== undefined)
    payload.sortOrder = Number(raw.sortOrder ?? 0);
  if (raw.isActive !== undefined)
    payload.isActive = parseBooleanInput(raw.isActive, true);

  const contentValue = payload.content ?? existing.content;
  const externalUrlValue = payload.externalUrl ?? existing.externalUrl;
  const fileUrlValue = payload.fileUrl ?? existing.fileUrl;

  if (nextMaterialType === "rich_text" && !String(contentValue || "").trim()) {
    throw new Error("Content is required for rich text material");
  }
  if (
    (nextMaterialType === "video" || nextMaterialType === "link") &&
    !String(externalUrlValue || "").trim()
  ) {
    throw new Error("External URL is required for this material type");
  }
  if (nextMaterialType === "file" && !String(fileUrlValue || "").trim()) {
    throw new Error("File upload is required for file material");
  }

  return await updateSalesMaterialRepo(id, payload);
};

export const removeSalesMaterial = async (id) => {
  const existing = await getSalesMaterialById(id);
  if (!existing) throw new Error("Sales material not found");
  await deleteSalesMaterialRepo(id);
  return true;
};

// ==================== LEADS ====================

export const getLeads = async (affiliateId, filters = {}, pagination = {}) => {
  const { page = 1, limit = 10, status } = { ...filters, ...pagination };
  return await getPartnerLeads(affiliateId, { page, limit, status });
};

export const getLeadDetail = async (affiliateId, leadId) => {
  const lead = await getLeadById(leadId, affiliateId);
  if (!lead) {
    throw new Error("Lead not found or you don't have permission to access it");
  }
  return lead;
};

export const createNewLead = async (affiliateId, leadData) => {
  // Support both legacy single-service (serviceId) and new multi-service (services[])
  const rawServices = Array.isArray(leadData.services) ? leadData.services : null;
  const legacyServiceId = leadData.serviceId ?? leadData.service_id;
  const nextFollowUpAt = parseOptionalDate(
    leadData.nextFollowUpAt ?? leadData.next_follow_up_at,
  );
  const notes = String(leadData.notes ?? leadData.note ?? "").trim();
  const now = new Date();

  // Validate required fields
  if (!leadData.name || !leadData.email || !leadData.phone) {
    throw new Error("Missing required fields: name, email, phone");
  }

  // Resolve & validate services
  let resolvedServices;
  if (rawServices && rawServices.length > 0) {
    resolvedServices = await Promise.all(
      rawServices.map(async (s) => {
        const service = await getPartnerServiceById(s.serviceId);
        if (!service) throw new Error(`Invalid service ID: ${s.serviceId}`);
        const base = Number(service.projectValue || 0);
        const isCustom = parseBooleanInput(s.isCustomProjectValue, false);
        const pv = isCustom ? Number(s.projectValue || 0) : base;
        if (!Number.isFinite(pv) || pv < base) {
          throw new Error(
            `Project value for "${service.name}" must be at least ${base.toLocaleString("en-US")}.`,
          );
        }
        return { serviceId: s.serviceId, projectValue: pv, isCustomProjectValue: isCustom };
      }),
    );
  } else if (legacyServiceId) {
    const service = await getPartnerServiceById(legacyServiceId);
    if (!service) throw new Error("Invalid service ID");
    const isCustom = parseBooleanInput(leadData.isCustomProjectValue ?? leadData.is_custom_project_value, false);
    const base = Number(service.projectValue || 0);
    const pv = isCustom ? Number(leadData.projectValue ?? leadData.project_value ?? 0) : base;
    if (!Number.isFinite(pv) || pv < base) {
      throw new Error(`Project value must be at least ${base.toLocaleString("en-US")}.`);
    }
    resolvedServices = [{ serviceId: legacyServiceId, projectValue: pv, isCustomProjectValue: isCustom }];
  } else {
    throw new Error("At least one service is required");
  }

  const verticalMarket = await resolveLeadVerticalMarket(leadData);
  const normalizedStatus = await assertLeadStatusCanBeSelected(
    leadData.status || await getDefaultSelectableLeadStatus(),
  );

  const data = {
    id: uuidv7(),
    affiliateId,
    name: leadData.name,
    email: leadData.email,
    phone: leadData.phone,
    verticalMarketId: verticalMarket.verticalMarketId,
    verticalMarketName: verticalMarket.verticalMarketName,
    status: normalizedStatus,
    nextFollowUpAt,
    lastContactAt: now,
    lastStatusChangedAt: now,
    services: resolvedServices,
  };

  await createLead(data);
  if (notes) {
    await insertLeadNote({
      id: uuidv7(),
      leadId: data.id,
      content: notes,
      createdByType: "partner",
    });
  }
  await createLeadActivity({
    id: uuidv7(),
    leadId: data.id,
    affiliateId,
    actorType: "partner",
    actorId: affiliateId,
    actionType: "created",
    toStatus: data.status,
    note: "Lead created",
    metadata: stringifyMetadata({
      services: resolvedServices,
      verticalMarketId: data.verticalMarketId,
      verticalMarketName: data.verticalMarketName,
      nextFollowUpAt: data.nextFollowUpAt,
    }),
  });
  const leadForCommission = { ...data, services: resolvedServices };
  await ensureCommissionForClosedWonLead(leadForCommission);
  return { ...data, services: resolvedServices };
};

export const updateExistingLead = async (affiliateId, leadId, leadData) => {
  const existingLead = await getLeadById(leadId, affiliateId);
  if (!existingLead) {
    throw new Error("Lead not found or you don't have permission to update it");
  }

  const nextFollowUpAt = parseOptionalDate(
    leadData.nextFollowUpAt ?? leadData.next_follow_up_at,
  );

  // Resolve & validate new services if provided
  let resolvedServices = null;
  const rawServices = Array.isArray(leadData.services) ? leadData.services : null;
  const legacyServiceId = leadData.serviceId ?? leadData.service_id;

  if (rawServices !== null) {
    if (rawServices.length === 0) throw new Error("At least one service is required");
    resolvedServices = await Promise.all(
      rawServices.map(async (s) => {
        const service = await getPartnerServiceById(s.serviceId);
        if (!service) throw new Error(`Invalid service ID: ${s.serviceId}`);
        const base = Number(service.projectValue || 0);
        const isCustom = parseBooleanInput(s.isCustomProjectValue, false);
        const pv = isCustom ? Number(s.projectValue || 0) : base;
        if (!Number.isFinite(pv) || pv < base) {
          throw new Error(
            `Project value for "${service.name}" must be at least ${base.toLocaleString("en-US")}.`,
          );
        }
        return { serviceId: s.serviceId, projectValue: pv, isCustomProjectValue: isCustom };
      }),
    );
  } else if (legacyServiceId !== undefined) {
    // Legacy single-service path
    const service = await getPartnerServiceById(legacyServiceId);
    if (!service) throw new Error("Invalid service ID");
    const base = Number(service.projectValue || 0);
    const isCustom = parseBooleanInput(leadData.isCustomProjectValue ?? leadData.is_custom_project_value, false);
    const pv = isCustom
      ? Number(leadData.projectValue ?? leadData.project_value ?? 0)
      : base;
    if (!Number.isFinite(pv) || pv < base) {
      throw new Error(`Project value must be at least ${base.toLocaleString("en-US")}.`);
    }
    resolvedServices = [{ serviceId: legacyServiceId, projectValue: pv, isCustomProjectValue: isCustom }];
  }

  // Build lead-level update payload
  const updateData = {};
  if (leadData.name !== undefined) updateData.name = leadData.name;
  if (leadData.email !== undefined) updateData.email = leadData.email;
  if (leadData.phone !== undefined) updateData.phone = leadData.phone;
  if (
    leadData.verticalMarketId !== undefined ||
    leadData.vertical_market_id !== undefined ||
    leadData.verticalMarketName !== undefined ||
    leadData.vertical_market_name !== undefined ||
    leadData.businessMarket !== undefined ||
    leadData.business_market !== undefined
  ) {
    Object.assign(updateData, await resolveLeadVerticalMarket(leadData));
  }
  if (leadData.status !== undefined) {
    const requestedStatus = normalizeLeadStatus(leadData.status);
    const currentStatus = normalizeLeadStatus(existingLead.status);
    updateData.status =
      requestedStatus === currentStatus
        ? currentStatus
        : await assertLeadStatusCanBeSelected(requestedStatus);
  }
  if (nextFollowUpAt !== undefined) updateData.nextFollowUpAt = nextFollowUpAt;

  const touchedFields =
    leadData.name !== undefined ||
    leadData.email !== undefined ||
    leadData.phone !== undefined ||
    resolvedServices !== null ||
    updateData.verticalMarketId !== undefined ||
    nextFollowUpAt !== undefined;

  if (touchedFields) updateData.lastContactAt = new Date();
  if (leadData.status !== undefined && updateData.status !== existingLead.status) {
    updateData.lastStatusChangedAt = new Date();
  }

  await updateLead(leadId, affiliateId, updateData);

  if (resolvedServices !== null) {
    await replaceLeadServices(leadId, resolvedServices);
  }

  const noteParts = [];
  if (resolvedServices !== null) noteParts.push("Services updated");
  if (nextFollowUpAt !== undefined)
    noteParts.push(nextFollowUpAt ? "Follow-up schedule updated" : "Follow-up cleared");

  await createLeadActivity({
    id: uuidv7(),
    leadId,
    affiliateId,
    actorType: "partner",
    actorId: affiliateId,
    actionType:
      leadData.status !== undefined && updateData.status !== existingLead.status
        ? "status_changed"
        : "updated",
    fromStatus: normalizeLeadStatus(existingLead.status),
    toStatus:
      leadData.status !== undefined
        ? updateData.status
        : normalizeLeadStatus(existingLead.status),
    note: noteParts.join(". ") || "Lead record updated",
    metadata: stringifyMetadata({
      nextFollowUpAt: updateData.nextFollowUpAt,
      services: resolvedServices,
      verticalMarketId: updateData.verticalMarketId,
      verticalMarketName: updateData.verticalMarketName,
    }),
  });

  const updatedLead = await getLeadById(leadId, affiliateId);
  await ensureCommissionForClosedWonLead(updatedLead);
  return updatedLead;
};

export const deleteExistingLead = async (affiliateId, leadId) => {
  // Check if lead exists and belongs to affiliate
  const existingLead = await getLeadById(leadId, affiliateId);
  if (!existingLead) {
    throw new Error("Lead not found or you don't have permission to delete it");
  }

  const success = await deleteLead(leadId, affiliateId);
  if (!success) {
    throw new Error("Failed to delete lead");
  }

  return true;
};

// ==================== COMMISSIONS ====================

export const getCommissions = async (affiliateId, options = {}) => {
  const { page = 1, limit = 10, type, status, period } = options;
  const filters = { page, limit };
  if (type) filters.type = type;
  if (status) filters.status = status;
  if (period) filters.period = period;
  return await getCommissionHistory(affiliateId, filters);
};

// ==================== DASHBOARD ====================

export const calculateDashboardStats = async (affiliateId) => {
  const stats = await getDashboardStats(affiliateId);

  // Format for frontend
  return {
    totalCommission: {
      value: `$${stats.totalCommission.toLocaleString("EN")}`,
      raw: stats.totalCommission,
    },
    pendingCommission: {
      value: `$${stats.pendingCommission.toLocaleString("EN")}`,
      raw: stats.pendingCommission,
      count: stats.pendingCount,
    },
    totalLeads: {
      value: stats.totalLeads.toString(),
      raw: stats.totalLeads,
    },
    closedLeads: {
      value: stats.closedLeads.toString(),
      raw: stats.closedLeads,
      conversionRate: `${stats.conversionRate}%`,
    },
  };
};

export const getRecentDashboardLeads = async (affiliateId, limit = 5) => {
  const leads = await getRecentLeads(affiliateId, limit);
  return leads.map((lead) => ({
    ...lead,
    status: normalizeLeadStatus(lead.status),
  }));
};

export const getPerformanceDashboard = async (affiliateId, options = {}) => {
  const now = options.now || new Date();
  const setting = await getActivePerformanceSetting();
  const lifecycle = await getAffiliateLifecycle(affiliateId);
  if (!lifecycle) throw new Error("Partner not found");
  const batch =
    lifecycle.batchId ? await getBatchById(lifecycle.batchId).catch(() => null) : null;

  const currentPeriodStart = startOfMonth(now);
  const currentPeriodEnd = addMonths(currentPeriodStart, 1);
  const userStart = lifecycle.userCreatedAt
    ? new Date(lifecycle.userCreatedAt)
    : currentPeriodStart;
  const firstMonthStart = startOfMonth(userStart);
  const firstMonthEnd = addMonths(firstMonthStart, 1);

  const [currentMonth, firstMonth, leaderboardRows] = await Promise.all([
    getClosedWonStatsForPeriod(
      affiliateId,
      currentPeriodStart,
      currentPeriodEnd,
    ),
    getClosedWonStatsForPeriod(affiliateId, firstMonthStart, firstMonthEnd),
    getPerformanceLeaderboardForPeriod(
      currentPeriodStart,
      currentPeriodEnd,
      10,
    ),
  ]);

  const rankedLeaderboard = leaderboardRows.map((item, index) => ({
    rank: index + 1,
    affiliateId: item.affiliateId,
    partnerName: item.partnerName,
    partnerEmail: item.partnerEmail,
    closedClients: Number(item.closedClients || 0),
    salesAmount: Number(item.salesAmount || 0),
    basicSalaryEligible:
      Number(item.salesAmount || 0) >=
      Number(setting.basicSalarySalesThreshold || 0),
  }));

  const partnerRank =
    rankedLeaderboard.find((item) => item.affiliateId === affiliateId)?.rank ||
    null;

  const firstMonthClosedClients = Number(firstMonth.closedClients || 0);
  const defaultInitialThreshold = Number(
    setting.initialCommissionFullClientThreshold || 2,
  );
  const initialCommissionProgress = resolveInitialCommissionProgress(
    firstMonthClosedClients,
    normalizeInitialCommissionTiers(
      batch?.initialCommissionTiers,
      getLegacyInitialCommissionTier(lifecycle, setting),
    ),
  );
  const batchInitialThreshold = initialCommissionProgress.maxTier
    ? Number(initialCommissionProgress.maxTier.closedClients || 0)
    : null;
  const fullInitialThreshold = batchInitialThreshold || defaultInitialThreshold;
  const minimumClosedClients = Number(
    setting.firstMonthMinimumClosedClients || 1,
  );
  const initialCommissionEnabled = initialCommissionProgress.configuredAmount > 0;
  const initialCommissionEligible =
    initialCommissionEnabled && initialCommissionProgress.eligibleAmount > 0;

  const basicSalaryThreshold = Number(
    setting.basicSalarySalesThreshold || 35000,
  );
  const salesAmount = Number(currentMonth.salesAmount || 0);
  const progressPercent =
    basicSalaryThreshold > 0
      ? Math.min(100, Math.round((salesAmount / basicSalaryThreshold) * 100))
      : 0;

  return {
    policy: {
      basicSalaryAmount: Number(setting.basicSalaryAmount || 3500),
      basicSalarySalesThreshold: basicSalaryThreshold,
      firstMonthMinimumClosedClients: minimumClosedClients,
      initialCommissionFullClientThreshold: fullInitialThreshold,
      defaultInitialCommissionFullClientThreshold: defaultInitialThreshold,
      terminationGraceDays: Number(setting.terminationGraceDays || 2),
      monthlyPayoutDate: Number(setting.monthlyPayoutDate || 25),
    },
    currentMonth: {
      periodStart: currentPeriodStart,
      periodEnd: currentPeriodEnd,
      closedClients: Number(currentMonth.closedClients || 0),
      salesAmount,
      basicSalaryEligible: salesAmount >= basicSalaryThreshold,
      progressPercent,
      remainingSales: Math.max(0, basicSalaryThreshold - salesAmount),
    },
    initialCommission: {
      periodStart: firstMonthStart,
      periodEnd: firstMonthEnd,
      closedClients: firstMonthClosedClients,
      configuredAmount: initialCommissionProgress.configuredAmount,
      eligibleAmount: initialCommissionProgress.eligibleAmount,
      tiers: initialCommissionProgress.tiers,
      nextTier: initialCommissionProgress.nextTier,
      status: !initialCommissionEnabled
        ? "disabled"
        : initialCommissionEligible
          ? "eligible"
          : "not_eligible",
    },
    batch: {
      id: lifecycle.batchId || null,
      name: lifecycle.batchName || null,
      targetClosedClients:
        initialCommissionProgress.targetClosedClients || fullInitialThreshold,
      initialCommissionFullClientThreshold: batchInitialThreshold,
      usesDefaultThreshold: batchInitialThreshold === null,
    },
    termination: {
      status: lifecycle.performanceTerminatedAt
        ? "terminated"
        : lifecycle.performanceTerminationDueAt
          ? "termination_pending"
          : "good_standing",
      alertSentAt: lifecycle.performanceAlertSentAt,
      terminationDueAt: lifecycle.performanceTerminationDueAt,
      terminatedAt: lifecycle.performanceTerminatedAt,
    },
    ranking: {
      partnerRank,
      leaderboard: rankedLeaderboard,
    },
  };
};

// ==================== PROFILE ====================

export const updateAffiliateProfile = async (affiliateId, profileData) => {
  const allowedFields = ["fullName", "phone", "country"];
  const updateData = {};
  const bankData = {};

  // Support snake_case
  if (profileData.full_name) profileData.fullName = profileData.full_name;
  if (profileData.username) profileData.fullName = profileData.username;
  if (profileData.phoneNumber) profileData.phone = profileData.phoneNumber;
  if (profileData.bank_name) profileData.bankName = profileData.bank_name;
  if (profileData.bank_account_number)
    profileData.bankAccountNumber = profileData.bank_account_number;
  if (profileData.bank_account_holder)
    profileData.bankAccountHolder = profileData.bank_account_holder;

  for (const field of allowedFields) {
    if (profileData[field] !== undefined) {
      updateData[field] = profileData[field];
    }
  }

  if (profileData.bankName !== undefined)
    bankData.bankName = profileData.bankName || null;
  if (profileData.bankAccountNumber !== undefined)
    bankData.bankAccountNumber = profileData.bankAccountNumber || null;
  if (profileData.bankAccountHolder !== undefined)
    bankData.bankAccountHolder = profileData.bankAccountHolder || null;

  if (
    Object.keys(updateData).length === 0 &&
    Object.keys(bankData).length === 0
  ) {
    throw new Error("No valid fields to update");
  }

  if (Object.keys(updateData).length > 0) {
    await updateAffiliateApplication(affiliateId, updateData);
  }

  if (Object.keys(bankData).length > 0) {
    await updatePartnerRegistrationData(affiliateId, bankData);
  }

  return { success: true, message: "Profile updated successfully" };
};

// ==================== BACK OFFICE ====================

export const getBackOfficeDashboardStats = async () => {
  const stats = await getGlobalDashboardStats();

  // Calculate conversion rate (Closed Leads / Total Leads)
  // Note: The image shows "32% conversion" under Closed Leads.
  // Assuming calculation is Closed / Total * 100
  const conversionRate =
    stats.totalLeads > 0
      ? Math.round((stats.closedLeads / stats.totalLeads) * 100)
      : 0;

  return {
    totalLeads: {
      value: stats.totalLeads,
      subtext: "+3 this month", // Placeholder or implement monthly diff
    },
    activePartners: {
      value: stats.activePartners,
      subtext: "All verified",
    },
    closedLeads: {
      value: stats.closedLeads,
      subtext: `${conversionRate}% conversion`,
    },
    pendingCommission: {
      value: `$${stats.pendingCommission.toLocaleString("EN")}`,
      subtext: `${stats.pendingCommissionCount} pending`,
    },
  };
};

export const getBackOfficeRecentLeads = async (limit = 5) => {
  return await getAllRecentLeads(limit);
};

export const getBackOfficePendingCommissions = async (limit = 5) => {
  return await getAllPendingCommissions(limit);
};

// ==================== BACK OFFICE COMMISSION DISBURSEMENT ====================

const VALID_COMMISSION_STATUSES = ["Pending Transfer", "Paid", "Rejected"];

export const listBackOfficeCommissions = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 20);
  const type = query.type ? String(query.type).trim() : undefined;
  const status = query.status ? String(query.status).trim() : undefined;
  const period = query.period ? String(query.period).trim() : undefined;
  const affiliateId = query.affiliateId
    ? String(query.affiliateId).trim()
    : undefined;
  const search = query.search ? String(query.search).trim() : undefined;

  if (type && !/^[a-z0-9_-]{1,80}$/i.test(type)) {
    throw new Error("Invalid commission type");
  }
  if (status && !VALID_COMMISSION_STATUSES.includes(status)) {
    throw new Error(
      `Invalid status. Must be one of: ${VALID_COMMISSION_STATUSES.join(", ")}`,
    );
  }
  if (period && !/^\d{4}-\d{2}$/.test(period)) {
    throw new Error("Invalid period. Format must be YYYY-MM");
  }

  return await listCommissionsForBackOffice({
    page,
    limit,
    type,
    status,
    period,
    affiliateId,
    search,
  });
};

export const markBackOfficeCommissionPaid = async (
  id,
  { proofUrl, transactionReference, paidById } = {},
) => {
  const existing = await getCommissionByIdBackOffice(id);
  if (!existing) {
    throw new Error("Commission not found");
  }
  if (existing.status === "Paid") {
    throw new Error("Commission is already marked as paid");
  }
  if (existing.status === "Rejected") {
    throw new Error(
      "Commission is rejected. Revert to pending before marking as paid.",
    );
  }
  if (!proofUrl || !String(proofUrl).trim()) {
    throw new Error("Proof of payment URL is required");
  }

  await markCommissionPaid(id, {
    paidById: paidById || null,
    proofUrl: String(proofUrl).trim(),
    transactionReference: transactionReference
      ? String(transactionReference).trim()
      : null,
  });
  return await getCommissionByIdBackOffice(id);
};

export const revertBackOfficeCommission = async (id) => {
  const existing = await getCommissionByIdBackOffice(id);
  if (!existing) {
    throw new Error("Commission not found");
  }
  if (existing.status === "Pending Transfer") {
    throw new Error("Commission is already pending");
  }
  await revertCommissionToPending(id);
  return await getCommissionByIdBackOffice(id);
};

export const rejectBackOfficeCommission = async (
  id,
  { reason, rejectedById } = {},
) => {
  const existing = await getCommissionByIdBackOffice(id);
  if (!existing) {
    throw new Error("Commission not found");
  }
  if (existing.status === "Rejected") {
    throw new Error("Commission is already rejected");
  }
  if (existing.status === "Paid") {
    throw new Error(
      "Commission is already paid. Revert before rejecting.",
    );
  }
  if (!reason || !String(reason).trim()) {
    throw new Error("Rejection reason is required");
  }
  await rejectCommission(id, {
    reason: String(reason).trim(),
    rejectedById: rejectedById || null,
  });
  return await getCommissionByIdBackOffice(id);
};

export const getPerformanceSettings = async () => {
  return await getActivePerformanceSetting();
};

export const updatePerformanceSettings = async (raw = {}) => {
  const numericFields = {
    basicSalaryAmount: { min: 0 },
    basicSalarySalesThreshold: { min: 1 },
    firstMonthMinimumClosedClients: { min: 1, integer: true },
    initialCommissionFullClientThreshold: { min: 1, integer: true },
    terminationGraceDays: { min: 1, max: 30, integer: true },
    monthlyPayoutDate: { min: 1, max: 31, integer: true },
  };
  const payload = {};

  for (const [field, rule] of Object.entries(numericFields)) {
    if (raw[field] === undefined) continue;
    const value = Number(raw[field]);
    if (
      !Number.isFinite(value) ||
      value < rule.min ||
      (rule.max !== undefined && value > rule.max)
    ) {
      const maxLabel = rule.max !== undefined ? ` and <= ${rule.max}` : "";
      throw new Error(
        `${field} must be a valid number >= ${rule.min}${maxLabel}`,
      );
    }
    payload[field] = rule.integer ? Math.round(value) : value;
  }

  if (
    payload.firstMonthMinimumClosedClients !== undefined ||
    payload.initialCommissionFullClientThreshold !== undefined
  ) {
    const current = await getActivePerformanceSetting();
    const effectiveMinimum = Number(
      payload.firstMonthMinimumClosedClients ??
        current.firstMonthMinimumClosedClients ??
        1,
    );
    const effectiveFullThreshold = Number(
      payload.initialCommissionFullClientThreshold ??
        current.initialCommissionFullClientThreshold ??
        2,
    );
    if (effectiveFullThreshold < effectiveMinimum) {
      throw new Error(
        "initialCommissionFullClientThreshold must be greater than or equal to firstMonthMinimumClosedClients",
      );
    }
  }

  if (!Object.keys(payload).length)
    throw new Error("No valid fields to update");
  const updated = await updateActivePerformanceSetting(payload);
  if (
    payload.basicSalaryAmount !== undefined ||
    payload.basicSalarySalesThreshold !== undefined
  ) {
    await syncBasicSalaryRuleWithSettings(updated);
  }
  return updated;
};

export const evaluatePartnerPerformanceTerminations = async ({
  notifyAdmin,
} = {}) => {
  const setting = await getActivePerformanceSetting();
  const now = new Date();
  const graceDays = Number(setting.terminationGraceDays || 2);
  const minimumClosedClients = Number(
    setting.firstMonthMinimumClosedClients || 1,
  );
  const previousMonthEnd = startOfMonth(now);
  const previousMonthStart = addMonths(previousMonthEnd, -1);

  const approvedPartners = await getPerformanceLeaderboardForPeriod(
    previousMonthStart,
    previousMonthEnd,
    10000,
  );

  for (const partner of approvedPartners) {
    const lifecycle = await getAffiliateLifecycle(partner.affiliateId);
    if (
      !lifecycle ||
      lifecycle.performanceAlertSentAt ||
      lifecycle.performanceTerminatedAt
    ) {
      continue;
    }
    const joinedMonth = lifecycle.userCreatedAt
      ? startOfMonth(new Date(lifecycle.userCreatedAt))
      : previousMonthStart;
    if (joinedMonth >= previousMonthStart) continue;

    const closedClients = Number(partner.closedClients || 0);
    if (closedClients >= minimumClosedClients) continue;

    const dueAt = addDays(now, graceDays);
    const note = `Performance alert: ${closedClients} closed client(s) in previous month. Auto termination due at ${dueAt.toISOString()} if not resolved.`;
    await markPartnerPerformanceAlert(partner.affiliateId, dueAt, note);

    if (notifyAdmin) {
      await notifyAdmin({
        partnerName: partner.partnerName,
        partnerEmail: partner.partnerEmail,
        closedClients,
        minimumClosedClients,
        dueAt,
      });
    }
  }

  const duePartners = await getPartnersDueForPerformanceTermination(now);
  for (const partner of duePartners) {
    await terminatePartnerForPerformance(
      partner.affiliateId,
      partner.userId,
      "Auto terminated after missing partner closed-client threshold for the previous month.",
    );
  }

  return {
    checkedPeriodStart: previousMonthStart,
    checkedPeriodEnd: previousMonthEnd,
    terminated: duePartners.length,
  };
};

// ==================== PERIODIC COMMISSION EVALUATORS ====================

const formatPeriod = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

/**
 * Evaluate initial commissions for partners who have met the full-client
 * threshold in their first month. Idempotent via (affiliateId, period,
 * commission_type) unique index. Returns list of created commissions.
 *
 * Should be run daily (or per-hour) as part of the same evaluator cron that
 * handles performance terminations.
 */
export const evaluateInitialCommissions = async ({ now = new Date() } = {}) => {
  const setting = await getActivePerformanceSetting();
  const created = [];

  // Look at every approved & active partner – for each, inspect their
  // first-month Won clients and compare against the batch-specific threshold
  // (falling back to the global setting).
  const firstMonthStartCutoff = startOfMonth(now);
  // We evaluate partners whose first month is already in the past OR ongoing
  // (so we can grant commission as soon as the threshold is reached).

  // Pull every approved partner via the existing leaderboard mechanism with a
  // very wide time range so we get the full list. We then filter using
  // lifecycle.userCreatedAt when reading first-month stats per partner.
  const approvedPartners = await getPerformanceLeaderboardForPeriod(
    new Date(2000, 0, 1),
    addMonths(firstMonthStartCutoff, 2),
    10000,
  );

  for (const partner of approvedPartners) {
    const lifecycle = await getAffiliateLifecycle(partner.affiliateId);
    if (!lifecycle || !lifecycle.userCreatedAt) continue;
    const batch =
      lifecycle.batchId
        ? await getBatchById(lifecycle.batchId).catch(() => null)
        : null;
    const initialCommissionTiers = normalizeInitialCommissionTiers(
      batch?.initialCommissionTiers,
      getLegacyInitialCommissionTier(lifecycle, setting),
    );
    const configuredInitialAmount = Number(
      initialCommissionTiers.at(-1)?.amount || 0,
    );
    if (configuredInitialAmount <= 0) continue;

    const firstMonthStart = startOfMonth(new Date(lifecycle.userCreatedAt));
    const firstMonthEnd = addMonths(firstMonthStart, 1);

    const stats = await getClosedWonStatsForPeriod(
      partner.affiliateId,
      firstMonthStart,
      firstMonthEnd,
    );
    const closedClients = Number(stats.closedClients || 0);
    const initialCommissionProgress = resolveInitialCommissionProgress(
      closedClients,
      initialCommissionTiers,
    );
    if (initialCommissionProgress.eligibleAmount <= 0) continue;

    const period = formatPeriod(firstMonthStart);
    const existing = await getCommissionByTypePeriod(
      partner.affiliateId,
      "initial",
      period,
    );
    if (existing) {
      if (
        existing.status === "Pending Transfer" &&
        Number(existing.amount || 0) !==
          Number(initialCommissionProgress.eligibleAmount || 0)
      ) {
        await updateCommissionAmount(existing.id, {
          amount: initialCommissionProgress.eligibleAmount,
        });
        created.push(
          await getCommissionByTypePeriod(
            partner.affiliateId,
            "initial",
            period,
          ),
        );
      }
      continue;
    }

    const commission = await createPeriodicCommission({
      affiliateId: partner.affiliateId,
      commissionType: "initial",
      period,
      amount: initialCommissionProgress.eligibleAmount,
    });
    if (commission) created.push(commission);
  }

  return { created: created.length, commissions: created };
};

/**
 * Evaluate basic salary commissions. Runs on monthlyPayoutDate and creates
 * basic_salary commission records for partners who met the sales threshold in
 * the current month. Idempotent via unique index.
 */
export const evaluateBasicSalaries = async ({ now = new Date() } = {}) => {
  const setting = await getActivePerformanceSetting();
  const basicSalaryAmount = Number(setting.basicSalaryAmount || 0);
  const salesThreshold = Number(setting.basicSalarySalesThreshold || 0);

  if (basicSalaryAmount <= 0 || salesThreshold <= 0) {
    return { created: 0, commissions: [], skipped: "disabled" };
  }

  const periodStart = startOfMonth(now);
  const periodEnd = addMonths(periodStart, 1);
  const period = formatPeriod(periodStart);
  const created = [];

  const leaderboard = await getPerformanceLeaderboardForPeriod(
    periodStart,
    periodEnd,
    10000,
  );

  for (const row of leaderboard) {
    const salesAmount = Number(row.salesAmount || 0);
    if (salesAmount < salesThreshold) continue;

    const lifecycle = await getAffiliateLifecycle(row.affiliateId);
    if (!lifecycle || lifecycle.performanceTerminatedAt) continue;

    const existing = await getCommissionByTypePeriod(
      row.affiliateId,
      "basic_salary",
      period,
    );
    if (existing) continue;

    const commission = await createPeriodicCommission({
      affiliateId: row.affiliateId,
      commissionType: "basic_salary",
      period,
      amount: basicSalaryAmount,
    });
    if (commission) created.push(commission);
  }

  return { created: created.length, commissions: created, period };
};

// ==================== BACK OFFICE PARTNER MGMT ====================

const trim = (val) => (val == null ? val : String(val).trim());

export const getAllPartners = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const search = trim(query.search) || undefined;
  const status = trim(query.status) || undefined;
  const country = trim(query.country) || undefined;
  const sort = (trim(query.sort) || "newest").toLowerCase();
  const allowedStatus = ["pending", "approved", "rejected"];
  if (status && !allowedStatus.includes(status)) {
    throw new Error("Invalid status filter");
  }
  return await getAllPartnersRepo({
    page,
    limit,
    search,
    status,
    country,
    sort,
  });
};

export const getPartnerDetail = async (id) => {
  const data = await getPartnerByIdRepo(id);
  if (!data) throw new Error("Partner not found");
  return data;
};

export const updatePartner = async (id, raw = {}) => {
  const existing = await getPartnerByIdRepo(id);
  if (!existing) throw new Error("Partner not found");

  const allowedStatus = ["pending", "approved", "rejected"];
  const payload = {};
  const maybe = (key, alt) => {
    const val = raw[key] ?? raw[alt];
    return val === undefined ? undefined : trim(val);
  };

  const fullName = maybe("fullName", "full_name");
  if (fullName !== undefined) payload.fullName = fullName;

  const email = maybe("email");
  if (email !== undefined) payload.email = email;

  const countryCode = maybe("countryCode", "country_code");
  if (countryCode !== undefined) payload.countryCode = countryCode;

  const phone = maybe("phone");
  if (phone !== undefined) payload.phone = phone;

  const country = maybe("country");
  if (country !== undefined) payload.country = country;

  const govOrBusinessId = maybe("govOrBusinessId", "gov_or_business_id");
  if (govOrBusinessId !== undefined)
    payload.govOrBusinessId = govOrBusinessId || null;

  const strategy = maybe("strategy");
  if (strategy !== undefined) payload.strategy = strategy;

  const portfolioLinks = maybe("portfolioLinks", "portfolio_links");
  if (portfolioLinks !== undefined)
    payload.portfolioLinks = portfolioLinks || null;

  const motivation = maybe("motivation");
  if (motivation !== undefined) payload.motivation = motivation || null;

  const otherPrograms = maybe("otherPrograms", "other_programs");
  if (otherPrograms !== undefined)
    payload.otherPrograms = otherPrograms || null;

  const notes = maybe("notes");
  if (notes !== undefined) payload.notes = notes || null;

  const status = maybe("status");
  if (status !== undefined) {
    if (!allowedStatus.includes(status)) throw new Error("Invalid status");
    payload.status = status;
  }

  const isActiveInput = raw.isActive ?? raw.is_active;
  if (isActiveInput !== undefined) {
    payload.isActive = parseBooleanInput(isActiveInput, true);
  }

  if (payload.phone !== undefined || payload.countryCode !== undefined) {
    const cc = (payload.countryCode ?? existing.countryCode ?? "").replace(
      /^\+/,
      "",
    );
    const ph = (payload.phone ?? existing.phone ?? "").replace(/\D+/g, "");
    payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;
  }

  if (!Object.keys(payload).length)
    throw new Error("No valid fields to update");

  await updatePartnerRepo(id, payload);
  return await getPartnerByIdRepo(id);
};

export const deletePartner = async (id) => {
  const existing = await getPartnerByIdRepo(id);
  if (!existing) throw new Error("Partner not found");
  if (existing.isActive !== false) {
    throw new Error("Partner must be deactivated before deletion");
  }
  await deletePartnerRepo(id);
  return true;
};

export const deactivatePartner = async (id) => {
  const existing = await getPartnerByIdRepo(id);
  if (!existing) throw new Error("Partner not found");

  await updatePartnerRepo(id, {
    isActive: false,
    forcePasswordChange: true,
    tokenVersion: Number(existing.tokenVersion || 0) + 1,
  });

  return await getPartnerByIdRepo(id);
};

export const sendPartnerResetPasswordEmail = async (id) => {
  const existing = await getPartnerByIdRepo(id);
  if (!existing) throw new Error("Partner not found");
  await requestAffiliatePasswordReset({ email: existing.email });
  return { message: "Reset password email has been sent." };
};

// ==================== BACK OFFICE LEADS MGMT ====================

export const getAllLeadsForBackOffice = async (query = {}) => {
  const { page = 1, limit = 10, search, status, affiliateId } = query;
  return await getAllLeads({ page, limit, search, status, affiliateId });
};

export const getLeadDetailForBackOffice = async (id) => {
  const lead = await getLeadByIdBackOffice(id);
  if (!lead) throw new Error("Lead not found");
  return lead;
};

export const getLeadActivitiesForPartner = async (affiliateId, leadId) => {
  const lead = await getLeadById(leadId, affiliateId);
  if (!lead)
    throw new Error("Lead not found or you don't have permission to access it");
  return await getLeadActivities(leadId);
};

export const getLeadActivitiesForBackOffice = async (leadId) => {
  const lead = await getLeadByIdBackOffice(leadId);
  if (!lead) throw new Error("Lead not found");
  return await getLeadActivities(leadId);
};

export const updateLeadForBackOffice = async (id, data) => {
  const existingLead = await getLeadByIdBackOffice(id);
  if (!existingLead) throw new Error("Lead not found");

  const updateData = { ...data };
  const nextFollowUpAt = parseOptionalDate(
    data.nextFollowUpAt ?? data.next_follow_up_at,
  );
  if (nextFollowUpAt !== undefined) updateData.nextFollowUpAt = nextFollowUpAt;
  if (data.status !== undefined) {
    const requestedStatus = normalizeLeadStatus(data.status);
    const currentStatus = normalizeLeadStatus(existingLead.status);
    updateData.status =
      requestedStatus === currentStatus
        ? currentStatus
        : await assertLeadStatusCanBeSelected(requestedStatus);
  }
  if (
    data.status !== undefined ||
    data.projectValue !== undefined ||
    data.serviceId !== undefined ||
    nextFollowUpAt !== undefined
  ) {
    updateData.lastContactAt = new Date();
  }
  if (data.status !== undefined && updateData.status !== existingLead.status) {
    updateData.lastStatusChangedAt = new Date();
  }

  await updateLeadBackOffice(id, updateData);
  await createLeadActivity({
    id: uuidv7(),
    leadId: id,
    affiliateId: existingLead.affiliateId,
    actorType: "admin",
    actorId: "back-office",
    actionType:
      data.status !== undefined && updateData.status !== existingLead.status
        ? "status_changed"
        : "admin_updated",
    fromStatus: existingLead.status,
    toStatus: data.status !== undefined ? updateData.status : existingLead.status,
    note: "Lead updated by admin",
    metadata: stringifyMetadata({
      nextFollowUpAt: updateData.nextFollowUpAt,
      projectValue: updateData.projectValue,
      serviceId: updateData.serviceId,
    }),
  });
  const updatedLead = await getLeadByIdBackOffice(id);
  await ensureCommissionForClosedWonLead(updatedLead);
  return updatedLead;
};

export const deleteLeadForBackOffice = async (id) => {
  const lead = await getLeadByIdBackOffice(id);
  if (!lead) throw new Error("Lead not found");
  await deleteLeadBackOffice(id);
  return true;
};

// ==================== PARTNER SERVICES (BACK OFFICE) ====================

export const getAllServices = async (query = {}) => {
  const { page = 1, limit = 10, search } = query;
  const [result, settings] = await Promise.all([
    getAllServicesBackOffice({ page, limit, search }),
    getPartnerSalesCommissionSettings(),
  ]);

  return {
    ...result,
    data: decorateServicesCommission(result.data || [], settings),
  };
};

export const getServiceDetail = async (id) => {
  const [service, settings] = await Promise.all([
    getServiceById(id),
    getPartnerSalesCommissionSettings(),
  ]);
  if (!service) throw new Error("Service not found");
  return decorateServiceCommission(service, settings);
};

export const createNewService = async (data) => {
  // Validate required fields
  if (!data.name || data.projectValue === undefined || !data.description) {
    throw new Error("Missing required fields: name, projectValue, description");
  }

  // Validate projectValue is a valid number
  if (typeof data.projectValue !== "number" || data.projectValue < 0) {
    throw new Error("projectValue must be a valid number >= 0");
  }

  const createdService = await createService({
    ...data,
    commissionPercentage:
      data.commissionPercentage === undefined
        ? 0
        : Number(data.commissionPercentage),
  });

  return decorateServiceCommission(createdService);
};

export const updateServiceDetail = async (id, data) => {
  const service = await getServiceById(id);
  if (!service) throw new Error("Service not found");
  const updatedService = await updateService(id, data);
  const settings = await getPartnerSalesCommissionSettings();
  return decorateServiceCommission(updatedService, settings);
};

export const updateServiceCommissionSetting = async (
  id,
  data = {},
  options = {},
) => {
  const service = await getServiceById(id);
  if (!service) throw new Error("Service not found");

  const mode = normalizeSalesCommissionMode(data.mode);
  const value = normalizeSalesCommissionValue(data.value);
  const currentSettings = await getPartnerSalesCommissionSettings();
  const nextSettings = {
    ...currentSettings,
    [id]: {
      mode,
      value,
    },
  };

  await upsertMeta({
    metaableId: PARTNER_RECRUITMENT_SETTINGS_ID,
    metaableType: PARTNER_RECRUITMENT_SETTINGS_TYPE,
    key: PARTNER_SALES_COMMISSION_META_KEY,
    value: PARTNER_SALES_COMMISSION_META_KEY,
    content: JSON.stringify(nextSettings),
  });

  if (mode === "percentage") {
    await updateService(id, { commissionPercentage: value });
  }

  const updatedService = await getServiceById(id);
  if (options.syncRule !== false) {
    await syncSalesCommissionRuleForService(updatedService, { mode, value });
  }

  return decorateServiceCommission(updatedService, nextSettings);
};

export const removeService = async (id) => {
  const service = await getServiceById(id);
  if (!service) throw new Error("Service not found");
  await deleteService(id);
  return true;
};

// ==================== LEAD NOTES ====================

const makeNotFoundError = (message, statusCode = 404) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

export const assertLeadBelongsToAffiliate = async (affiliateId, leadId) => {
  const lead = await findLeadById(leadId);
  if (!lead) throw makeNotFoundError("Lead not found");
  if (lead.affiliateId !== affiliateId)
    throw makeNotFoundError("Lead not found");
};

export const assertLeadExistsForBackOffice = async (leadId) => {
  const lead = await findLeadById(leadId);
  if (!lead) throw makeNotFoundError("Lead not found");
};

export const getLeadNotes = async (leadId) => {
  return await findNotesByLeadId(leadId);
};

export const createLeadNote = async (
  leadId,
  content,
  createdByType = "partner",
) => {
  const id = uuidv7();
  return await insertLeadNote({ id, leadId, content, createdByType });
};

export const updateLeadNote = async (leadId, noteId, content) => {
  const note = await updateLeadNoteById(leadId, noteId, content);
  if (!note) throw makeNotFoundError("Note not found");
  return note;
};

export const deleteLeadNote = async (leadId, noteId) => {
  const deleted = await deleteLeadNoteById(leadId, noteId);
  if (!deleted) throw makeNotFoundError("Note not found");
};

// Re-exported for the commission rule engine
export { getPartnerServiceById };
