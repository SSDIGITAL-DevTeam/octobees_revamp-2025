import "dotenv/config";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  defaultMigrationsFolder,
  validateMigrationSet,
} from "./migrations/validation.js";

const MIGRATION_TABLE_NAME = "__drizzle_migrations";

const knownLegacyAppliedMigrations = new Map([
  [
    1745575162041,
    {
      hash: "bb7d34b36994e6f0d8ef7bfb661c248088b009688e71a487e8d6e183585a7edf",
      reason:
        "Legacy migration row from the pre-journal era. Safe to retain as historical metadata.",
    },
  ],
]);

const compatibleMigrationHashes = new Map([
  [
    "0004_cute_mockingbird",
    new Set([
      "13f4e4cb0d990a2779e6a58061a75d064d99b73b8070a370744aa79af12dad35",
    ]),
  ],
  [
    "0007_wooden_chimera",
    new Set([
      "37d8db8ff2acb0594587a832330fef3c6d5f46814e4e7a44d5d56e205beaf8e6",
    ]),
  ],
  [
    "0010_parallel_ben_parker",
    new Set([
      "b17196f7e7f4100f5bcad6ac9347f3253a8ca41d649c598bc6a4fd0d84979b8e",
    ]),
  ],
  [
    "0014_adding_security_fields",
    new Set([
      "c5b7c3f9de51ba8440d8b9d944d443010276e1ebea97a7c434e88053e9d05ce1",
    ]),
  ],
  [
    "0015_daily_mantis",
    new Set([
      "6a9b5191ffc0a907f29e3a19bf05e6779834a77302ec20c2882a855ffa8cc9f8",
      "39df1912e444c6ae5f0be06269d89c351c5f43998b8613d1890079d2f1dfaba7",
    ]),
  ],
  [
    "0017_initial_screening_ai",
    new Set([
      "e1f4998813bfdc15e24e468ccfea3f698d81dc1a83e47e82d408cdf06a3316f2",
    ]),
  ],
  [
    "0020_partner_crm_activity",
    new Set([
      "0e7a187d079d3ef569c6e572414fc6751c7ed272054089b0dc5782bbb874df63",
    ]),
  ],
  [
    "0025_batch_initial_commission",
    new Set([
      "ee403f8b708214ad251256ffc02c61cd2809f47103c7f91c1e07fa3965e645a9",
    ]),
  ],
  [
    "0029_assessment_max_exam_attempts",
    new Set([
      "44092ca6cbbd408bf171ddf2f2144e885629870e0183b3f71b2970b255b40222",
    ]),
  ],
  [
    "0035_partner_lead_status_pipeline",
    new Set([
      "f8b284d1f02abf85e2c30ee1c5166976bde8389cdeb39e75213a2aed5b179473",
    ]),
  ],
  [
    "0034_dpa_leads_demo_requests",
    new Set([
      "3e12eb161c25cf7e3628811b895f3179e3a466ef3f75fa3815dc843b4b00165c",
    ]),
  ],
  [
    "0042_commission_type_and_payout",
    new Set([
      "9d0ca386a9dff30fd1b71d2608c9a1f20f1e67158f710872c556e62893b56ff1",
    ]),
  ],
]);

const ensureMigrationTableSql = `
  create table if not exists \`${MIGRATION_TABLE_NAME}\` (
    id serial primary key,
    hash text not null,
    created_at bigint
  )
`;

const legacyReconciliationRules = [
  {
    tag: "0010_parallel_ben_parker",
    reason:
      "Detected legacy schema drift: `blog.publish_date` exists but migration row is missing.",
    isSatisfied: async (pool) => columnExists(pool, "blog", "publish_date"),
  },
  {
    tag: "0014_adding_security_fields",
    reason:
      "Detected legacy schema drift: assessment session security fields and token index already exist.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "assessment_session", [
        "exam_token",
        "token_used_at",
        "token_invalidated",
        "expires_at",
        "total_duration_seconds",
        "ip_address",
        "user_agent",
        "browser_fingerprint",
        "tab_switch_count",
        "time_per_question",
        "answer_hash",
        "answer_integrity_verified",
        "security_flags",
      ])) && (await indexExists(pool, "assessment_session", "idx_exam_token")),
  },
  {
    tag: "0017_initial_screening_ai",
    reason:
      "Detected legacy schema drift: initial screening AI columns already exist in assessment settings and affiliate applications.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "assessment_settings", [
        "screening_passing_score",
      ])) &&
      (await everyColumnExists(pool, "affiliate_application", [
        "screening_score",
        "screening_passing_score",
        "screening_recommendation",
        "screening_summary",
        "screening_strengths",
        "screening_weaknesses",
        "screening_analysis_json",
        "screening_completed_at",
      ])),
  },
  {
    tag: "0018_shiny_wraith",
    reason:
      "Detected legacy schema drift: AI exam and final recommendation columns already exist on assessment sessions.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "assessment_session", [
        "ai_exam_recommendation",
        "ai_exam_summary",
        "ai_exam_strengths",
        "ai_exam_weaknesses",
        "ai_exam_decision_rationale",
        "ai_exam_analysis_json",
        "ai_exam_completed_at",
        "ai_final_recommendation",
        "ai_final_summary",
        "ai_final_strengths",
        "ai_final_weaknesses",
        "ai_final_decision_rationale",
        "ai_final_analysis_json",
        "ai_final_completed_at",
      ]),
  },
  {
    tag: "0019_unknown_enchantress",
    reason:
      "Detected legacy schema drift: submission and security review columns already exist on assessment sessions.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "assessment_session", [
        "submit_ip_address",
        "submit_user_agent",
        "security_risk_score",
        "security_risk_level",
        "security_summary",
        "security_analysis_json",
        "security_review_required",
      ]),
  },
  {
    tag: "0020_partner_crm_activity",
    reason:
      "Detected legacy schema drift: partner CRM activity table and follow-up columns already exist.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "partner_lead", [
        "next_follow_up_at",
        "last_contact_at",
        "last_status_changed_at",
      ])) && (await tableExists(pool, "partner_lead_activity")),
  },
  {
    tag: "0021_sales_materials",
    reason:
      "Detected legacy schema drift: sales material table already exists.",
    isSatisfied: async (pool) => tableExists(pool, "sales_material"),
  },
  {
    tag: "0022_interview_stage",
    reason:
      "Detected legacy schema drift: interview stage columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "assessment_session", [
        "interview_status",
        "interview_submitted_link",
        "interview_submitted_at",
        "interview_invitation_sent_at",
        "training_invitation_sent_at",
      ]),
  },
  {
    tag: "0023_batch_auto_curate",
    reason:
      "Detected legacy schema drift: batch auto-curation columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "affiliate_batch", [
        "registration_quota",
        "auto_curate_on_quota_reached",
        "auto_curate_on_batch_close",
      ]),
  },
  {
    tag: "0024_batch_exam_passing_score",
    reason:
      "Detected legacy schema drift: batch exam passing score column already exists.",
    isSatisfied: async (pool) =>
      columnExists(pool, "affiliate_batch", "exam_passing_score"),
  },
  {
    tag: "0025_batch_initial_commission",
    reason:
      "Detected legacy schema drift: initial commission columns already exist and backfill is already satisfied.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "affiliate_batch", [
        "initial_commission_amount",
      ])) &&
      (await everyColumnExists(pool, "affiliate_application", [
        "initial_commission_amount",
      ])) &&
      (await initialCommissionBackfillSatisfied(pool)),
  },
  {
    tag: "0026_batch_question_sets",
    reason:
      "Detected legacy schema drift: batch question set columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "affiliate_batch", [
        "interview_question_ids",
        "exam_question_ids",
      ]),
  },
  {
    tag: "0027_recruitment_flow_updates",
    reason:
      "Detected legacy schema drift: recruitment flow update columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "assessment_session", [
        "interview_reviewed_at",
        "interview_reviewer_id",
        "interview_review_notes",
        "exam_invitation_sent_at",
        "exam_attempt_count",
        "max_exam_attempts",
      ]),
  },
  {
    tag: "0028_training_credentials_step",
    reason:
      "Detected legacy schema drift: training credentials step column already exists.",
    isSatisfied: async (pool) =>
      await columnExists(
        pool,
        "assessment_session",
        "training_credentials_viewed",
      ),
  },
  {
    tag: "0029_assessment_max_exam_attempts",
    reason:
      "Detected legacy schema drift: max exam attempts columns already exist and data has been normalized.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "assessment_settings", [
        "max_exam_attempts",
      ])) &&
      (await everyColumnExists(pool, "assessment_session", [
        "max_exam_attempts",
      ])) &&
      (await maxExamAttemptsNormalized(pool)),
  },
  {
    tag: "0030_partner_performance_policy",
    reason:
      "Detected legacy schema drift: partner performance policy columns and settings table already exist.",
    isSatisfied: async (pool) =>
      (await everyColumnExists(pool, "affiliate_application", [
        "performance_alert_sent_at",
        "performance_termination_due_at",
        "performance_terminated_at",
      ])) && (await tableExists(pool, "partner_performance_setting")),
  },
  {
    tag: "0031_batch_ai_screening_summary",
    reason:
      "Detected legacy schema drift: batch AI screening summary columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "affiliate_batch", [
        "ai_screening_summary",
        "ai_screening_decision_rationale",
        "ai_screening_top_signals",
        "ai_screening_risk_signals",
        "ai_screening_ranked_candidates",
        "ai_screening_trigger",
        "ai_screening_completed_at",
      ]),
  },
  {
    tag: "0032_batch_ai_screening_runtime_state",
    reason:
      "Detected legacy schema drift: batch AI screening runtime state columns already exist.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "affiliate_batch", [
        "ai_screening_status",
        "ai_screening_task_id",
        "ai_screening_queued_at",
        "ai_screening_started_at",
        "ai_screening_failed_at",
        "ai_screening_error",
      ]),
  },
  {
    tag: "0033_affiliate_user_token_version",
    reason:
      "Detected legacy schema drift: affiliate user token version column already exists.",
    isSatisfied: async (pool) =>
      await everyColumnExists(pool, "affiliate_user", ["token_version"]),
  },
  {
    tag: "0034_monthly_payout_date",
    reason:
      "Detected legacy schema drift: monthly payout date column already exists.",
    isSatisfied: async (pool) =>
      await columnExists(
        pool,
        "partner_performance_setting",
        "monthly_payout_date",
      ),
  },
  {
    tag: "0038_batch_commission_threshold",
    reason:
      "Detected legacy schema drift: batch initial commission client threshold column already exists.",
    isSatisfied: async (pool) =>
      await columnExists(
        pool,
        "affiliate_batch",
        "initial_commission_full_client_threshold",
      ),
  },
  {
    tag: "0040_lead_notes",
    reason:
      "Detected legacy schema drift: partner lead notes table already exists.",
    isSatisfied: async (pool) => await partnerLeadNotesMigrationSatisfied(pool),
  },
  {
    tag: "0041_affiliate_user_tnc",
    reason:
      "Detected legacy schema drift: affiliate user T&C agreement column already exists.",
    isSatisfied: async (pool) =>
      await columnExists(pool, "affiliate_user", "tnc_agreed_at"),
  },
  {
    tag: "0042_commission_type_and_payout",
    reason:
      "Detected legacy schema drift: commission payout columns and indexes already exist.",
    isSatisfied: async (pool) => await commissionPayoutMigrationSatisfied(pool),
  },
  {
    tag: "0043_training_video_playlist",
    reason:
      "Detected legacy schema drift: training video playlist progress column already exists.",
    isSatisfied: async (pool) =>
      await columnExists(
        pool,
        "assessment_session",
        "training_video_completed_ids",
      ),
  },
  {
    tag: "0044_exam_review_recovery",
    reason:
      "Detected legacy schema drift: exam AI review recovery columns already exist.",
    isSatisfied: async (pool) =>
      await examReviewRecoveryMigrationSatisfied(pool),
  },
  {
    tag: "0045_partner_lead_pipeline_status_master",
    reason:
      "Detected legacy schema drift: partner lead pipeline master table already exists.",
    isSatisfied: async (pool) =>
      await tableExists(pool, "partner_lead_pipeline_status"),
  },
  {
    tag: "0047_partner_lead_status_master_values",
    reason:
      "Detected legacy schema drift: partner lead status columns already use varchar.",
    isSatisfied: async (pool) =>
      await partnerLeadStatusMasterValuesSatisfied(pool),
  },
];

function asNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isCompatibleHash(tag, expectedHash, actualHash) {
  if (expectedHash === actualHash) {
    return true;
  }

  const compatibleHashes = compatibleMigrationHashes.get(tag);
  return compatibleHashes ? compatibleHashes.has(actualHash) : false;
}

function getKnownLegacyAppliedMigration(createdAt) {
  return knownLegacyAppliedMigrations.get(createdAt) ?? null;
}

async function columnExists(pool, tableName, columnName) {
  const [rows] = await pool.query(
    `
      select 1
      from information_schema.columns
      where table_schema = database()
        and table_name = ?
        and column_name = ?
      limit 1
    `,
    [tableName, columnName],
  );

  return rows.length > 0;
}

async function everyColumnExists(pool, tableName, columnNames) {
  for (const columnName of columnNames) {
    const exists = await columnExists(pool, tableName, columnName);
    if (!exists) {
      return false;
    }
  }

  return true;
}

async function anyColumnExists(pool, tableName, columnNames) {
  for (const columnName of columnNames) {
    const exists = await columnExists(pool, tableName, columnName);
    if (exists) return true;
  }

  return false;
}

async function tableExists(pool, tableName) {
  const [rows] = await pool.query(
    `
      select 1
      from information_schema.tables
      where table_schema = database()
        and table_name = ?
      limit 1
    `,
    [tableName],
  );

  return rows.length > 0;
}

async function indexExists(pool, tableName, indexName) {
  const [rows] = await pool.query(
    `
      select 1
      from information_schema.statistics
      where table_schema = database()
        and table_name = ?
        and index_name = ?
      limit 1
    `,
    [tableName, indexName],
  );

  return rows.length > 0;
}

async function columnDataType(pool, tableName, columnName) {
  const [rows] = await pool.query(
    `
      select data_type
      from information_schema.columns
      where table_schema = database()
        and table_name = ?
        and column_name = ?
      limit 1
    `,
    [tableName, columnName],
  );

  return rows[0]?.data_type ? String(rows[0].data_type).toLowerCase() : null;
}

async function partnerLeadNotesMigrationSatisfied(pool) {
  const notesTableExists = await tableExists(pool, "partner_lead_note");
  if (!notesTableExists) return false;

  const remarkExists = await columnExists(pool, "partner_lead", "remark");
  if (!remarkExists) return true;

  await pool.query(
    `
      insert into \`partner_lead_note\` (\`id\`, \`lead_id\`, \`content\`, \`created_by_type\`)
      select uuid(), pl.\`id\`, pl.\`remark\`, 'partner'
      from \`partner_lead\` pl
      left join \`partner_lead_note\` note
        on note.\`lead_id\` = pl.\`id\`
       and note.\`content\` = pl.\`remark\`
      where pl.\`remark\` is not null
        and pl.\`remark\` <> ''
        and note.\`id\` is null
    `,
  );
  await pool.query("alter table `partner_lead` drop column `remark`");

  return true;
}

async function commissionPayoutMigrationSatisfied(pool) {
  const columns = [
    "commission_type",
    "period",
    "paid_by_id",
    "proof_url",
    "transaction_reference",
    "rejected_at",
    "rejection_reason",
  ];
  const hasAnyNewColumn = await anyColumnExists(
    pool,
    "partner_commission",
    columns,
  );
  if (!hasAnyNewColumn) return false;

  await pool.query(
    "alter table `partner_commission` modify column `lead_id` varchar(36) null",
  );
  await pool.query(
    "alter table `partner_commission` modify column `service_id` varchar(36) null",
  );

  const definitions = {
    commission_type:
      "add column `commission_type` enum('sales','initial','basic_salary') not null default 'sales'",
    period:
      "add column `period` varchar(7) null comment 'YYYY-MM for initial & basic_salary idempotency'",
    paid_by_id: "add column `paid_by_id` varchar(36) null",
    proof_url: "add column `proof_url` varchar(500) null",
    transaction_reference:
      "add column `transaction_reference` varchar(191) null comment 'bank transfer reference number'",
    rejected_at: "add column `rejected_at` datetime null",
    rejection_reason: "add column `rejection_reason` text null",
  };
  const missingColumns = await getMissingColumns(
    pool,
    "partner_commission",
    columns,
  );
  const clauses = missingColumns
    .map((columnName) => definitions[columnName])
    .filter(Boolean);
  if (clauses.length > 0) {
    await pool.query(
      `alter table \`partner_commission\` ${clauses.join(", ")}`,
    );
  }

  await pool.query(
    "alter table `partner_commission` modify column `commission_status` enum('Pending Transfer','Paid','Rejected') not null default 'Pending Transfer'",
  );
  await pool.query(
    "create unique index if not exists `idx_pc_affiliate_period_type` on `partner_commission` (`affiliate_id`, `period`, `commission_type`)",
  );
  await pool.query(
    "create index if not exists `idx_pc_status` on `partner_commission` (`commission_status`)",
  );
  await pool.query(
    "create index if not exists `idx_pc_commission_type` on `partner_commission` (`commission_type`)",
  );

  return true;
}

async function examReviewRecoveryMigrationSatisfied(pool) {
  const columns = [
    "ai_review_runtime_status",
    "ai_review_queued_at",
    "ai_review_started_at",
    "ai_review_failed_at",
    "ai_review_last_error",
    "ai_review_retry_count",
  ];
  const hasAnyNewColumn = await anyColumnExists(
    pool,
    "assessment_session",
    columns,
  );
  if (!hasAnyNewColumn) return false;

  const definitions = {
    ai_review_runtime_status:
      "add column `ai_review_runtime_status` varchar(20) default 'idle'",
    ai_review_queued_at: "add column `ai_review_queued_at` datetime",
    ai_review_started_at: "add column `ai_review_started_at` datetime",
    ai_review_failed_at: "add column `ai_review_failed_at` datetime",
    ai_review_last_error: "add column `ai_review_last_error` text",
    ai_review_retry_count:
      "add column `ai_review_retry_count` int not null default 0",
  };
  const missingColumns = await getMissingColumns(
    pool,
    "assessment_session",
    columns,
  );
  const clauses = missingColumns
    .map((columnName) => definitions[columnName])
    .filter(Boolean);
  if (clauses.length > 0) {
    await pool.query(
      `alter table \`assessment_session\` ${clauses.join(", ")}`,
    );
  }

  return true;
}

async function partnerLeadStatusMasterValuesSatisfied(pool) {
  const leadStatusType = await columnDataType(
    pool,
    "partner_lead",
    "lead_status",
  );
  const fromStatusType = await columnDataType(
    pool,
    "partner_lead_activity",
    "from_status",
  );
  const toStatusType = await columnDataType(
    pool,
    "partner_lead_activity",
    "to_status",
  );

  if (
    leadStatusType !== "varchar" &&
    fromStatusType !== "varchar" &&
    toStatusType !== "varchar"
  ) {
    return false;
  }

  if (leadStatusType !== "varchar") {
    await pool.query(
      "alter table `partner_lead` modify column `lead_status` varchar(80) not null default 'New Leads'",
    );
  }
  if (fromStatusType !== "varchar") {
    await pool.query(
      "alter table `partner_lead_activity` modify column `from_status` varchar(80) null",
    );
  }
  if (toStatusType !== "varchar") {
    await pool.query(
      "alter table `partner_lead_activity` modify column `to_status` varchar(80) null",
    );
  }

  return true;
}

async function initialCommissionBackfillSatisfied(pool) {
  const [rows] = await pool.query(
    `
      select count(*) as mismatch_count
      from \`affiliate_application\` aa
      left join \`affiliate_batch\` ab on ab.\`id\` = aa.\`batch_id\`
      where coalesce(aa.\`initial_commission_amount\`, 0) <> coalesce(ab.\`initial_commission_amount\`, 0)
    `,
  );

  return asNumber(rows[0]?.mismatch_count) === 0;
}

async function maxExamAttemptsNormalized(pool) {
  const [settingsRows] = await pool.query(
    `
      select count(*) as invalid_count
      from \`assessment_settings\`
      where \`max_exam_attempts\` is null or \`max_exam_attempts\` < 1
    `,
  );

  const [sessionRows] = await pool.query(
    `
      select count(*) as invalid_count
      from \`assessment_session\`
      where \`max_exam_attempts\` is null
        or \`max_exam_attempts\` < 1
        or \`max_exam_attempts\` = 3
    `,
  );

  return (
    asNumber(settingsRows[0]?.invalid_count) === 0 &&
    asNumber(sessionRows[0]?.invalid_count) === 0
  );
}

async function getMissingColumns(pool, tableName, columnNames) {
  const missing = [];

  for (const columnName of columnNames) {
    const exists = await columnExists(pool, tableName, columnName);
    if (!exists) missing.push(columnName);
  }

  return missing;
}

async function repairBatchAiScreeningSummaryColumns(pool) {
  const missingColumns = await getMissingColumns(pool, "affiliate_batch", [
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
  ]);

  if (missingColumns.length === 0) {
    return false;
  }

  const definitions = {
    ai_screening_summary: "ADD COLUMN `ai_screening_summary` text",
    ai_screening_decision_rationale:
      "ADD COLUMN `ai_screening_decision_rationale` text",
    ai_screening_top_signals: "ADD COLUMN `ai_screening_top_signals` json",
    ai_screening_risk_signals: "ADD COLUMN `ai_screening_risk_signals` json",
    ai_screening_ranked_candidates:
      "ADD COLUMN `ai_screening_ranked_candidates` json",
    ai_screening_trigger: "ADD COLUMN `ai_screening_trigger` varchar(64)",
    ai_screening_status: "ADD COLUMN `ai_screening_status` varchar(32)",
    ai_screening_task_id: "ADD COLUMN `ai_screening_task_id` varchar(128)",
    ai_screening_queued_at: "ADD COLUMN `ai_screening_queued_at` datetime",
    ai_screening_started_at: "ADD COLUMN `ai_screening_started_at` datetime",
    ai_screening_completed_at:
      "ADD COLUMN `ai_screening_completed_at` datetime",
    ai_screening_failed_at: "ADD COLUMN `ai_screening_failed_at` datetime",
    ai_screening_error: "ADD COLUMN `ai_screening_error` text",
  };

  const clauses = missingColumns
    .map((columnName) => definitions[columnName])
    .filter(Boolean);

  if (clauses.length === 0) {
    return false;
  }

  await pool.query(`ALTER TABLE \`affiliate_batch\` ${clauses.join(", ")}`);
  return true;
}

async function repairAffiliateUserTokenVersionColumn(pool) {
  const missingColumns = await getMissingColumns(pool, "affiliate_user", [
    "token_version",
  ]);

  if (missingColumns.length === 0) {
    return false;
  }

  await pool.query(
    "ALTER TABLE `affiliate_user` ADD COLUMN `token_version` int NOT NULL DEFAULT 0",
  );
  return true;
}

async function markMigrationAsApplied(pool, entry) {
  await pool.query(
    `
      insert into \`${MIGRATION_TABLE_NAME}\` (\`hash\`, \`created_at\`)
      select ?, ?
      where not exists (
        select 1 from \`${MIGRATION_TABLE_NAME}\` where created_at = ?
      )
    `,
    [entry.hash, entry.when, entry.when],
  );
}

async function getAppliedMigrations(pool) {
  await pool.query(ensureMigrationTableSql);
  const [rows] = await pool.query(
    `select id, hash, created_at from \`${MIGRATION_TABLE_NAME}\` order by created_at asc`,
  );

  return rows.map((row) => ({
    id: asNumber(row.id),
    hash: String(row.hash),
    createdAt: asNumber(row.created_at),
  }));
}

async function reconcileLegacyDrift(pool, entries, pendingEntries) {
  const pendingByTag = new Map(
    pendingEntries.map((entry) => [entry.tag, entry]),
  );
  let reconciledCount = 0;

  for (const rule of legacyReconciliationRules) {
    const pending = pendingByTag.get(rule.tag);
    if (!pending) continue;

    const canReconcile = await rule.isSatisfied(pool);
    if (!canReconcile) continue;

    await markMigrationAsApplied(pool, pending);
    reconciledCount += 1;
    console.warn(`Reconciled ${pending.tag}. ${rule.reason}`);
  }

  return reconciledCount;
}

async function main() {
  console.log("Running migrations...");

  const { entries } = validateMigrationSet(defaultMigrationsFolder);
  console.log(`Migration set validated. Entries in journal: ${entries.length}`);

  const databaseUrl =
    process.env.DATABASE_URL ||
    (process.env.DB_HOST &&
      `mysql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_HOST}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME}`);

  if (!databaseUrl) {
    throw new Error(
      "Database connection not configured. Set DATABASE_URL or DB_HOST/DB_USER/DB_PASSWORD/DB_PORT/DB_NAME environment variables.",
    );
  }

  const poolConnection = mysql.createPool(databaseUrl);
  const db = drizzle(poolConnection);

  try {
    let appliedMigrations = await getAppliedMigrations(poolConnection);
    let appliedCreatedAtSet = new Set(
      appliedMigrations.map((item) => item.createdAt),
    );
    let pendingEntries = entries.filter(
      (entry) => !appliedCreatedAtSet.has(entry.when),
    );

    const reconciledCount = await reconcileLegacyDrift(
      poolConnection,
      entries,
      pendingEntries,
    );
    if (reconciledCount > 0) {
      appliedMigrations = await getAppliedMigrations(poolConnection);
      appliedCreatedAtSet = new Set(
        appliedMigrations.map((item) => item.createdAt),
      );
      pendingEntries = entries.filter(
        (entry) => !appliedCreatedAtSet.has(entry.when),
      );
      console.warn(
        `Applied ${reconciledCount} legacy reconciliation marker(s) before migration.`,
      );
    }

    const localByWhen = new Map(entries.map((entry) => [entry.when, entry]));
    const hashMismatches = [];
    const unknownTimestamps = [];
    const knownLegacyApplied = [];

    for (const applied of appliedMigrations) {
      const local = localByWhen.get(applied.createdAt);
      if (!local) {
        const knownLegacy = getKnownLegacyAppliedMigration(applied.createdAt);
        if (knownLegacy && knownLegacy.hash === applied.hash) {
          knownLegacyApplied.push({
            createdAt: applied.createdAt,
            reason: knownLegacy.reason,
          });
          continue;
        }

        unknownTimestamps.push(applied.createdAt);
        continue;
      }

      if (!isCompatibleHash(local.tag, local.hash, applied.hash)) {
        hashMismatches.push({
          when: applied.createdAt,
          tag: local.tag,
          expectedHash: local.hash,
          actualHash: applied.hash,
        });
      }
    }

    if (hashMismatches.length > 0) {
      throw new Error(
        [
          "Detected migration hash mismatch for already-applied entries.",
          ...hashMismatches.map(
            (item) =>
              `- ${item.tag} (${item.when}): expected ${item.expectedHash}, got ${item.actualHash}`,
          ),
          "Stop and reconcile migration history before deploying.",
        ].join("\n"),
      );
    }

    if (unknownTimestamps.length > 0) {
      const sample = unknownTimestamps.slice(0, 10).join(", ");
      console.warn(
        `Warning: found ${unknownTimestamps.length} applied migration timestamp(s) not present in current journal: ${sample}${unknownTimestamps.length > 10 ? ", ..." : ""}`,
      );
    }

    if (knownLegacyApplied.length > 0) {
      for (const item of knownLegacyApplied) {
        console.warn(
          `Recognized legacy applied migration ${item.createdAt}. ${item.reason}`,
        );
      }
    }

    console.log(
      `Applied migrations in DB: ${appliedMigrations.length}. Pending from journal: ${pendingEntries.length}.`,
    );

    if (pendingEntries.length > 0) {
      console.log(`Next pending migration: ${pendingEntries[0].tag}`);
      console.log(
        `Last pending migration: ${pendingEntries[pendingEntries.length - 1].tag}`,
      );
    }

    await migrate(db, { migrationsFolder: defaultMigrationsFolder });

    const repairedBatchAiColumns =
      await repairBatchAiScreeningSummaryColumns(poolConnection);
    if (repairedBatchAiColumns) {
      console.warn(
        "Repaired missing affiliate_batch AI screening summary columns after migration.",
      );
    }

    const repairedAffiliateUserTokenVersion =
      await repairAffiliateUserTokenVersionColumn(poolConnection);
    if (repairedAffiliateUserTokenVersion) {
      console.warn(
        "Repaired missing affiliate_user token_version column after migration.",
      );
    }

    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await poolConnection.end();
  }
}

main();
