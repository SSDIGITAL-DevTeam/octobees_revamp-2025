import { sql } from "drizzle-orm";
import { poolConnection } from "../../drizzle/db.js";
import { affiliateBatch } from "../../drizzle/schema.js";

const BATCH_AI_SUMMMARY_COLUMNS = [
  "ai_screening_summary",
  "ai_screening_decision_rationale",
  "ai_screening_top_signals",
  "ai_screening_risk_signals",
  "ai_screening_ranked_candidates",
  "ai_screening_trigger",
  "ai_screening_status",
  "ai_screening_task_id",
  "ai_screening_queued_at",
  "ai_screening_started_at",
  "ai_screening_completed_at",
  "ai_screening_failed_at",
  "ai_screening_error",
];

const LATEST_BATCH_AI_MIGRATION = "0032_batch_ai_screening_runtime_state";

const loadBatchAiSummarySupport = async () => {
  const [rows] = await poolConnection.query(
    `
      select column_name
      from information_schema.columns
      where table_schema = database()
        and table_name = ?
        and column_name in (${BATCH_AI_SUMMMARY_COLUMNS.map(() => "?").join(", ")})
    `,
    ["affiliate_batch", ...BATCH_AI_SUMMMARY_COLUMNS],
  );

  const availableColumns = new Set(
    (Array.isArray(rows) ? rows : [])
      .map((row) => row.COLUMN_NAME || row.column_name)
      .filter(Boolean)
      .map((columnName) => String(columnName)),
  );

  return {
    aiScreeningSummary: availableColumns.has("ai_screening_summary"),
    aiScreeningDecisionRationale: availableColumns.has(
      "ai_screening_decision_rationale",
    ),
    aiScreeningTopSignals: availableColumns.has("ai_screening_top_signals"),
    aiScreeningRiskSignals: availableColumns.has("ai_screening_risk_signals"),
    aiScreeningRankedCandidates: availableColumns.has(
      "ai_screening_ranked_candidates",
    ),
    aiScreeningTrigger: availableColumns.has("ai_screening_trigger"),
    aiScreeningStatus: availableColumns.has("ai_screening_status"),
    aiScreeningTaskId: availableColumns.has("ai_screening_task_id"),
    aiScreeningQueuedAt: availableColumns.has("ai_screening_queued_at"),
    aiScreeningStartedAt: availableColumns.has("ai_screening_started_at"),
    aiScreeningCompletedAt: availableColumns.has("ai_screening_completed_at"),
    aiScreeningFailedAt: availableColumns.has("ai_screening_failed_at"),
    aiScreeningError: availableColumns.has("ai_screening_error"),
  };
};

export const getBatchAiSummarySupport = async () => {
  return await loadBatchAiSummarySupport();
};

export const getBatchAiSummarySelectFields = async () => {
  const support = await getBatchAiSummarySupport();

  return {
    aiScreeningSummary: support.aiScreeningSummary
      ? affiliateBatch.aiScreeningSummary
      : sql`null`,
    aiScreeningDecisionRationale: support.aiScreeningDecisionRationale
      ? affiliateBatch.aiScreeningDecisionRationale
      : sql`null`,
    aiScreeningTopSignals: support.aiScreeningTopSignals
      ? affiliateBatch.aiScreeningTopSignals
      : sql`null`,
    aiScreeningRiskSignals: support.aiScreeningRiskSignals
      ? affiliateBatch.aiScreeningRiskSignals
      : sql`null`,
    aiScreeningRankedCandidates: support.aiScreeningRankedCandidates
      ? affiliateBatch.aiScreeningRankedCandidates
      : sql`null`,
    aiScreeningTrigger: support.aiScreeningTrigger
      ? affiliateBatch.aiScreeningTrigger
      : sql`null`,
    aiScreeningStatus: support.aiScreeningStatus
      ? affiliateBatch.aiScreeningStatus
      : sql`null`,
    aiScreeningTaskId: support.aiScreeningTaskId
      ? affiliateBatch.aiScreeningTaskId
      : sql`null`,
    aiScreeningQueuedAt: support.aiScreeningQueuedAt
      ? affiliateBatch.aiScreeningQueuedAt
      : sql`null`,
    aiScreeningStartedAt: support.aiScreeningStartedAt
      ? affiliateBatch.aiScreeningStartedAt
      : sql`null`,
    aiScreeningCompletedAt: support.aiScreeningCompletedAt
      ? affiliateBatch.aiScreeningCompletedAt
      : sql`null`,
    aiScreeningFailedAt: support.aiScreeningFailedAt
      ? affiliateBatch.aiScreeningFailedAt
      : sql`null`,
    aiScreeningError: support.aiScreeningError
      ? affiliateBatch.aiScreeningError
      : sql`null`,
  };
};

export const ensureBatchAiSummaryColumnsAvailable = async () => {
  const support = await getBatchAiSummarySupport();
  const fullyAvailable = Object.values(support).every(Boolean);

  if (fullyAvailable) return;

  const error = new Error(
    `Batch AI summary columns are not available yet. Run the latest database migration (${LATEST_BATCH_AI_MIGRATION}).`,
  );
  error.code = "BATCH_AI_SUMMARY_MIGRATION_REQUIRED";
  throw error;
};
