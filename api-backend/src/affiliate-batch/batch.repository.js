import { eq, desc, asc, and, or, sql, getTableColumns, inArray } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { affiliateBatch, affiliateApplication } from "../../drizzle/schema.js";
import {
  deleteMetasByTarget,
  findMetasByTarget,
  upsertMeta,
} from "../meta/meta.repository.js";
import {
  ensureBatchAiSummaryColumnsAvailable,
  getBatchAiSummarySelectFields,
} from "./batch-ai-columns.js";

const RECRUITMENT_BATCH_META_TYPE = "affiliate_batch";
const BATCH_ROLE_META_KEY = "recruitment_role";
const BATCH_LANDING_PAGE_META_KEY = "recruitment_landing_page_link";
const BATCH_TRAINING_MATERIAL_IDS_META_KEY = "recruitment_training_material_ids";
const BATCH_INITIAL_COMMISSION_TIERS_META_KEY =
  "recruitment_initial_commission_tiers";

// Helper for 'LIKE' search
const likeInsensitive = (col, term) =>
  sql`LOWER(${col}) LIKE ${"%" + String(term).toLowerCase() + "%"}`;

const {
  aiScreeningSummary: _aiScreeningSummary,
  aiScreeningDecisionRationale: _aiScreeningDecisionRationale,
  aiScreeningTopSignals: _aiScreeningTopSignals,
  aiScreeningRiskSignals: _aiScreeningRiskSignals,
  aiScreeningRankedCandidates: _aiScreeningRankedCandidates,
  aiScreeningTrigger: _aiScreeningTrigger,
  aiScreeningStatus: _aiScreeningStatus,
  aiScreeningTaskId: _aiScreeningTaskId,
  aiScreeningQueuedAt: _aiScreeningQueuedAt,
  aiScreeningStartedAt: _aiScreeningStartedAt,
  aiScreeningCompletedAt: _aiScreeningCompletedAt,
  aiScreeningFailedAt: _aiScreeningFailedAt,
  aiScreeningError: _aiScreeningError,
  ...batchColumns
} = getTableColumns(affiliateBatch);

const applicationCountSql = sql`(
    SELECT COUNT(*)
    FROM affiliate_application aa
    WHERE aa.batch_id = ${affiliateBatch.id}
)`.mapWith(Number);

const quotaFullCondition = sql`${affiliateBatch.registrationQuota} > 0 AND ${applicationCountSql} >= ${affiliateBatch.registrationQuota}`;
const expiredCondition = sql`${affiliateBatch.endDate} < NOW()`;

const normalizeQuestionIdsValue = (value) => {
  if (value === null || value === undefined || value === "") return [];
  if (Array.isArray(value))
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? parsed.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
    } catch {
      return [];
    }
  }
  return [];
};

const parseJsonArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object") return [];
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const decorateBatchState = (batch) => {
  const applicationCount = Number(batch.applicationCount || 0);
  const registrationQuota = Number(batch.registrationQuota || 0);
  const isQuotaFull =
    registrationQuota > 0 && applicationCount >= registrationQuota;
  const remainingSlots =
    registrationQuota > 0
      ? Math.max(0, registrationQuota - applicationCount)
      : null;
  const isExpired = new Date(batch.endDate) < new Date();
  const effectiveStatus =
    batch.status === "draft"
      ? "draft"
      : batch.status === "closed" || isExpired || isQuotaFull
        ? "closed"
        : "open";

  let closureReason = null;
  if (effectiveStatus === "closed") {
    if (batch.status === "closed") closureReason = "manually_closed";
    else if (isQuotaFull) closureReason = "quota_full";
    else if (isExpired) closureReason = "date_passed";
  }

  return {
    ...batch,
    role: batch.role || "",
    landingPageLink: batch.landingPageLink || "",
    trainingMaterialIds: Array.isArray(batch.trainingMaterialIds)
      ? batch.trainingMaterialIds
      : [],
    initialCommissionTiers: parseInitialCommissionTiers(
      batch.initialCommissionTiers,
      batch,
    ),
    interviewQuestionIds: normalizeQuestionIdsValue(batch.interviewQuestionIds),
    examQuestionIds: normalizeQuestionIdsValue(batch.examQuestionIds),
    aiScreeningTopSignals: parseJsonArray(batch.aiScreeningTopSignals),
    aiScreeningRiskSignals: parseJsonArray(batch.aiScreeningRiskSignals),
    aiScreeningRankedCandidates: parseJsonArray(
      batch.aiScreeningRankedCandidates,
    ),
    applicationCount,
    remainingSlots,
    isQuotaFull,
    isExpired,
    effectiveStatus,
    closureReason,
  };
};

const parseTrainingMaterialIds = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map((item) => String(item || "").trim()).filter(Boolean))];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed)
        ? [...new Set(parsed.map((item) => String(item || "").trim()).filter(Boolean))]
        : [];
    } catch {
      return [];
    }
  }

  return [];
};

const normalizeInitialCommissionTier = (item) => {
  if (!item || typeof item !== "object") return null;

  const closedClients = Math.round(
    Number(item.closedClients ?? item.targetClients),
  );
  const amount = Number(item.amount);

  if (!Number.isFinite(closedClients) || closedClients < 1) return null;
  if (!Number.isFinite(amount) || amount < 0) return null;

  const normalized = {
    closedClients,
    amount,
  };

  if (
    item.conditions &&
    typeof item.conditions === "object" &&
    Array.isArray(item.conditions.groups)
  ) {
    normalized.conditions = item.conditions;
  }

  return normalized;
};

const parseInitialCommissionTiers = (value, fallbackBatch = null) => {
  let raw = [];

  if (Array.isArray(value)) {
    raw = value;
  } else if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      raw = Array.isArray(parsed) ? parsed : [];
    } catch {
      raw = [];
    }
  }

  const normalized = raw
    .map((item) => normalizeInitialCommissionTier(item))
    .filter(Boolean)
    .sort((a, b) => a.closedClients - b.closedClients)
    .filter(
      (item, index, list) =>
        list.findIndex(
          (candidate) => candidate.closedClients === item.closedClients,
        ) === index,
    );

  if (normalized.length > 0) return normalized;

  const fallbackAmount = Number(fallbackBatch?.initialCommissionAmount || 0);
  const fallbackThreshold = Number(
    fallbackBatch?.initialCommissionFullClientThreshold || 0,
  );

  if (fallbackAmount > 0 && fallbackThreshold > 0) {
    return [{ closedClients: fallbackThreshold, amount: fallbackAmount }];
  }

  return [];
};

const toBatchRecruitmentMeta = (rows = []) => {
  const roleMeta = rows.find((item) => item.key === BATCH_ROLE_META_KEY);
  const landingMeta = rows.find(
    (item) => item.key === BATCH_LANDING_PAGE_META_KEY,
  );
  const trainingMaterialsMeta = rows.find(
    (item) => item.key === BATCH_TRAINING_MATERIAL_IDS_META_KEY,
  );
  const initialCommissionTiersMeta = rows.find(
    (item) => item.key === BATCH_INITIAL_COMMISSION_TIERS_META_KEY,
  );

  return {
    role: String(roleMeta?.content || roleMeta?.value || "").trim(),
    landingPageLink: String(
      landingMeta?.content || landingMeta?.value || "",
    ).trim(),
    trainingMaterialIds: parseTrainingMaterialIds(
      trainingMaterialsMeta?.content || trainingMaterialsMeta?.value || "[]",
    ),
    initialCommissionTiers: parseInitialCommissionTiers(
      initialCommissionTiersMeta?.content ||
        initialCommissionTiersMeta?.value ||
        "[]",
    ),
  };
};

const attachBatchRecruitmentMeta = async (batch) => {
  if (!batch?.id) return batch;
  const metas = await findMetasByTarget(batch.id, RECRUITMENT_BATCH_META_TYPE);
  return decorateBatchState({
    ...batch,
    ...toBatchRecruitmentMeta(metas),
  });
};

const attachBatchRecruitmentMetas = async (batches = []) => {
  if (!Array.isArray(batches) || batches.length === 0) return [];

  const merged = await Promise.all(
    batches.map(async (batch) => attachBatchRecruitmentMeta(batch)),
  );

  return merged;
};

export const saveBatchRecruitmentMeta = async (
  batchId,
  { role, landingPageLink, trainingMaterialIds, initialCommissionTiers } = {},
) => {
  if (!batchId) return;

  if (role !== undefined) {
    await upsertMeta({
      metaableId: batchId,
      metaableType: RECRUITMENT_BATCH_META_TYPE,
      key: BATCH_ROLE_META_KEY,
      value: BATCH_ROLE_META_KEY,
      content: String(role || "").trim(),
    });
  }

  if (landingPageLink !== undefined) {
    await upsertMeta({
      metaableId: batchId,
      metaableType: RECRUITMENT_BATCH_META_TYPE,
      key: BATCH_LANDING_PAGE_META_KEY,
      value: BATCH_LANDING_PAGE_META_KEY,
      content: String(landingPageLink || "").trim(),
    });
  }

  if (trainingMaterialIds !== undefined) {
    await upsertMeta({
      metaableId: batchId,
      metaableType: RECRUITMENT_BATCH_META_TYPE,
      key: BATCH_TRAINING_MATERIAL_IDS_META_KEY,
      value: BATCH_TRAINING_MATERIAL_IDS_META_KEY,
      content: JSON.stringify(parseTrainingMaterialIds(trainingMaterialIds)),
    });
  }

  if (initialCommissionTiers !== undefined) {
    await upsertMeta({
      metaableId: batchId,
      metaableType: RECRUITMENT_BATCH_META_TYPE,
      key: BATCH_INITIAL_COMMISSION_TIERS_META_KEY,
      value: BATCH_INITIAL_COMMISSION_TIERS_META_KEY,
      content: JSON.stringify(
        parseInitialCommissionTiers(initialCommissionTiers).map((item) => ({
          closedClients: item.closedClients,
          amount: item.amount,
          ...(item.conditions ? { conditions: item.conditions } : {}),
        })),
      ),
    });
  }
};

export const createBatch = async (payload) => {
  await db.insert(affiliateBatch).values(payload);
  return payload;
};

export const updateBatch = async (id, data) => {
  await db
    .update(affiliateBatch)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(affiliateBatch.id, id));
};

export const updateBatchAiScreeningSummary = async (id, data) => {
  await ensureBatchAiSummaryColumnsAvailable();
  await db
    .update(affiliateBatch)
    .set({
      aiScreeningSummary: data.summary || null,
      aiScreeningDecisionRationale: data.decisionRationale || null,
      aiScreeningTopSignals: data.topSignals || [],
      aiScreeningRiskSignals: data.riskSignals || [],
      aiScreeningRankedCandidates: data.rankedCandidates || [],
      aiScreeningTrigger: data.trigger || null,
      aiScreeningStatus: "completed",
      aiScreeningCompletedAt: new Date(),
      aiScreeningFailedAt: null,
      aiScreeningError: null,
      updatedAt: new Date(),
    })
    .where(eq(affiliateBatch.id, id));
};

export const updateBatchAiScreeningRuntimeState = async (id, data) => {
  await ensureBatchAiSummaryColumnsAvailable();
  await db
    .update(affiliateBatch)
    .set({
      ...(data.status !== undefined ? { aiScreeningStatus: data.status } : {}),
      ...(data.taskId !== undefined ? { aiScreeningTaskId: data.taskId } : {}),
      ...(data.queuedAt !== undefined ? { aiScreeningQueuedAt: data.queuedAt } : {}),
      ...(data.startedAt !== undefined ? { aiScreeningStartedAt: data.startedAt } : {}),
      ...(data.completedAt !== undefined
        ? { aiScreeningCompletedAt: data.completedAt }
        : {}),
      ...(data.failedAt !== undefined ? { aiScreeningFailedAt: data.failedAt } : {}),
      ...(data.error !== undefined ? { aiScreeningError: data.error } : {}),
      updatedAt: new Date(),
    })
    .where(eq(affiliateBatch.id, id));
};

export const syncBatchInitialCommissionToApplications = async (
  batchId,
  initialCommissionAmount,
) => {
  await db
    .update(affiliateApplication)
    .set({
      initialCommissionAmount,
      updatedAt: new Date(),
    })
    .where(eq(affiliateApplication.batchId, batchId));
};

export const removeBatch = async (id) => {
  await db.delete(affiliateBatch).where(eq(affiliateBatch.id, id));
  await deleteMetasByTarget(id, RECRUITMENT_BATCH_META_TYPE);
};

export const getBatchById = async (id) => {
  const batchAiSummaryFields = await getBatchAiSummarySelectFields();
  const rows = await db
    .select({
      ...batchColumns,
      ...batchAiSummaryFields,
      applicationCount: applicationCountSql,
    })
    .from(affiliateBatch)
    .where(eq(affiliateBatch.id, id))
    .limit(1);
  return rows[0] ? attachBatchRecruitmentMeta(rows[0]) : null;
};

export const getBatchesByIds = async (ids = []) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (!uniqueIds.length) return [];

  const batchAiSummaryFields = await getBatchAiSummarySelectFields();
  const rows = await db
    .select({
      ...batchColumns,
      ...batchAiSummaryFields,
      applicationCount: applicationCountSql,
    })
    .from(affiliateBatch)
    .where(inArray(affiliateBatch.id, uniqueIds));

  return attachBatchRecruitmentMetas(rows);
};

export const getActiveBatch = async () => {
  const batchAiSummaryFields = await getBatchAiSummarySelectFields();
  const rows = await db
    .select({
      ...batchColumns,
      ...batchAiSummaryFields,
      applicationCount: applicationCountSql,
    })
    .from(affiliateBatch)
    .where(
      and(
        eq(affiliateBatch.status, "open"),
        sql`DATE(${affiliateBatch.startDate}) <= CURDATE()`,
        sql`DATE(${affiliateBatch.endDate}) >= CURDATE()`,
        or(
          sql`${affiliateBatch.registrationQuota} <= 0`,
          sql`${applicationCountSql} < ${affiliateBatch.registrationQuota}`,
        ),
      ),
    )
    .orderBy(desc(affiliateBatch.startDate), desc(affiliateBatch.createdAt))
    .limit(1);
  return rows[0] ? attachBatchRecruitmentMeta(rows[0]) : null;
};

export const listBatches = async ({
  page = 1,
  limit = 10,
  search,
  status,
  sort = "newest",
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const conds = [];
  if (search) conds.push(likeInsensitive(affiliateBatch.name, search));
  if (status === "draft") {
    conds.push(eq(affiliateBatch.status, "draft"));
  } else if (status === "open") {
    conds.push(eq(affiliateBatch.status, "open"));
    conds.push(sql`NOT (${expiredCondition})`);
    conds.push(sql`NOT (${quotaFullCondition})`);
  } else if (status === "closed") {
    conds.push(
      or(
        eq(affiliateBatch.status, "closed"),
        expiredCondition,
        quotaFullCondition,
      ),
    );
  }

  const where = conds.length ? and(...conds) : undefined;
  const orderBy =
    sort === "oldest"
      ? asc(affiliateBatch.createdAt)
      : desc(affiliateBatch.createdAt);
  const batchAiSummaryFields = await getBatchAiSummarySelectFields();

  const data = await db
    .select({
      ...batchColumns,
      ...batchAiSummaryFields,
      applicationCount: applicationCountSql,
    })
    .from(affiliateBatch)
    .where(where)
    .orderBy(orderBy)
    .limit(Number(limit))
    .offset(offset);

  return { data: await attachBatchRecruitmentMetas(data) };
};

export const countBatches = async ({ search, status }) => {
  const conds = [];
  if (search) conds.push(likeInsensitive(affiliateBatch.name, search));
  if (status === "draft") {
    conds.push(eq(affiliateBatch.status, "draft"));
  } else if (status === "open") {
    conds.push(eq(affiliateBatch.status, "open"));
    conds.push(sql`NOT (${expiredCondition})`);
    conds.push(sql`NOT (${quotaFullCondition})`);
  } else if (status === "closed") {
    conds.push(
      or(
        eq(affiliateBatch.status, "closed"),
        expiredCondition,
        quotaFullCondition,
      ),
    );
  }
  const where = conds.length ? and(...conds) : undefined;

  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(affiliateBatch)
    .where(where);
  return count ?? 0;
};

export const countApplicationsForBatch = async (batchId) => {
  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(affiliateApplication)
    .where(eq(affiliateApplication.batchId, batchId));

  return Number(count || 0);
};

export const listBatchesEligibleForAutoCurate = async () => {
  const now = new Date();

  return db
    .select()
    .from(affiliateBatch)
    .where(
      and(
        sql`EXISTS (
                    SELECT 1
                    FROM affiliate_application aa
                    WHERE aa.batch_id = ${affiliateBatch.id}
                      AND aa.status = 'pending'
                )`,
        sql`(
                    (${affiliateBatch.autoCurateOnBatchClose} = true AND (${affiliateBatch.status} = 'closed' OR ${affiliateBatch.endDate} < ${now}))
                    OR
                    (${affiliateBatch.autoCurateOnQuotaReached} = true AND ${affiliateBatch.registrationQuota} > 0 AND (
                        SELECT COUNT(*)
                        FROM affiliate_application aa2
                        WHERE aa2.batch_id = ${affiliateBatch.id}
                    ) >= ${affiliateBatch.registrationQuota})
                )`,
      ),
    );
};
