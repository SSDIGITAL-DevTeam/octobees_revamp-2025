import { sql } from 'drizzle-orm';
import { date, mysqlTable, varchar, mysqlEnum, json, timestamp, boolean, text, int, datetime, double } from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

// Enums
export const userStatusEnum = mysqlEnum('user_status', ['Draft', 'Active', 'NonActive']);
export const blogStatusEnum = mysqlEnum('blog_status', ['Published', 'Archived', 'Draft']);

export const user = mysqlTable('user', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  status: userStatusEnum.notNull(),
  refreshToken: text('refresh_token'),
  role: varchar('role', { length: 50 }).notNull(),
  features: json('features').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const blogCategory = mysqlTable('blog_category', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  status: boolean('status').notNull(),
});

export const blog = mysqlTable('blog', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  title: varchar('title', { length: 255 }).notNull(),
  image: text('image').notNull(),
  pdf: text('pdf'),
  content: text('content').notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  status: blogStatusEnum.notNull(),
  favorite: boolean('favorite').notNull(),
  categoryId: varchar('category_id', { length: 36 })
    .notNull()
    .references(() => blogCategory.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  publishDate: timestamp('publish_date').default(null), // ⬅️ default NULL
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: varchar('user_id', { length: 36 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});


export const lead = mysqlTable('lead', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }).notNull(),
  business: varchar('business', { length: 255 }).notNull(),
  message: text('message'),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  companyWebsite: varchar('company_website', { length: 255 }),
  from: varchar('from', { length: 50 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  isAgree: boolean('is_agree').default(true), //setelah migrate akan di ubah menjadi not null
});

// Legacy order route still imports this schema export during API boot.
// Keep the table mapping available so old order endpoints do not break startup.
export const order = mysqlTable('order', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  amount: double('amount').notNull(),
  currency: mysqlEnum('currency', ['IDR', 'SGD', 'MYR']).notNull().default('IDR'),
  bussiness: varchar('bussiness', { length: 191 }).notNull(),
  categoryId: varchar('categoryId', { length: 191 }).notNull(),
  date: varchar('date', { length: 191 }).notNull(),
  email: varchar('email', { length: 191 }).notNull(),
  message: varchar('message', { length: 191 }).notNull(),
  name: varchar('name', { length: 191 }).notNull(),
  phoneNumber: varchar('phoneNumber', { length: 191 }).notNull(),
  idPlan: varchar('idPlan', { length: 191 }).notNull(),
  time: varchar('time', { length: 191 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const dpaLeadDemoRequestStatusValues = ['new', 'contacted', 'qualified', 'converted', 'lost'];
export const dpaLeadDemoRequestStatusEnum = mysqlEnum(
  'status',
  dpaLeadDemoRequestStatusValues,
);

export const dpaLeadDemoRequest = mysqlTable('dpa_lead_demo_request', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  businessType: varchar('business_type', { length: 120 }).notNull(),
  businessTypeOther: varchar('business_type_other', { length: 255 }),
  coreProblem: text('core_problem').notNull(),
  source: varchar('source', { length: 100 }).notNull().default('dpa-leads-landing-page'),
  status: dpaLeadDemoRequestStatusEnum.notNull().default('new'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const benefit = mysqlTable('benefit', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  value: varchar('value', { length: 191 }).notNull(),
  idPlan: varchar('idPlan', { length: 191 }).notNull(),
});

export const career = mysqlTable('career', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phoneNumber', { length: 255 }).notNull(),
  positionId: int('positionId'),
  resume: text('resume').notNull(),
  portfolio: varchar('portfolio', { length: 255 }).notNull(),
  message: text('message'),
  status: mysqlEnum('status', ['Rejected', 'Review', 'Accepted']).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const categoryService = mysqlTable('categoryservice', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 191 }).notNull().unique(),
  heading: varchar('heading', { length: 191 }).notNull(),
  description: varchar('description', { length: 191 }).notNull(),
  status: mysqlEnum('status', ['Draft', 'Active', 'NonActive']).notNull().default('Draft'),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const metaTag = mysqlTable('metatag', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  key: varchar('key', { length: 191 }).notNull(),
  value: varchar('value', { length: 191 }).notNull(),
  content: varchar('content', { length: 191 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const pages = mysqlTable('pages', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  page: varchar('page', { length: 191 }).notNull(),
  slug: varchar('slug', { length: 191 }).notNull().unique(),
  source: varchar('source', { length: 191 }).notNull().default('none'),
  categoryServiceId: varchar('categoryServiceId', { length: 191 }).default(null),
  blogId: varchar('blogId', { length: 191 }).default(null),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const planService = mysqlTable('planservice', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 191 }).notNull(),
  type: mysqlEnum('type', ['Standard', 'Premium']).notNull(),
  showPrice: boolean('showPrice').notNull().default(true),
  status: mysqlEnum('status', ['Draft', 'Active', 'NonActive']).notNull(),
  options: varchar('options', { length: 191 }).notNull(),
  descriptions: varchar('descriptions', { length: 191 }).notNull(),
  categoryId: varchar('categoryId', { length: 191 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const position = mysqlTable('position', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  status: mysqlEnum('status', ['Active', 'NonActive']).notNull().default('Active'),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const price = mysqlTable('price', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  curr: mysqlEnum('curr', ['IDR', 'SGR', 'MYR']).notNull(),
  amount: double('amount').notNull(),
  discount: double('discount').notNull(),
  idPlan: varchar('idPlan', { length: 191 }).notNull(),
});

export const subscription = mysqlTable('subscription', {
  id: int('id').autoincrement().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  source: varchar('source', { length: 255 }).notNull(),
  insight: varchar('insight', { length: 255 }),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt').defaultNow().notNull(),
});

export const clientOnboarding = mysqlTable('client_onboarding', {
  id: varchar('id', { length: 36 }).primaryKey().$defaultFn(() => uuidv4()),
  name: varchar('name', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  agreementGuideApproved: boolean('agreement_guide_approved').notNull().default(false),
  agreementProgramCommitment: boolean('agreement_program_commitment').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const onboardingVideos = mysqlTable('onboarding_videos', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull().unique(),
  desktopUrl: text('desktop_url'),
  mobileUrl: text('mobile_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Metas table for polymorphic SEO metadata
export const metas = mysqlTable('metas', {
  id: int('id').autoincrement().primaryKey(),
  key: varchar('key', { length: 255 }).notNull(),
  value: varchar('value', { length: 255 }).notNull(),
  content: text('content'),
  metaableId: varchar('metaable_id', { length: 36 }).notNull(), // UUID of target
  metaableType: varchar('metaable_type', { length: 50 }).notNull(), // e.g., 'blog'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Affiliate Enums
export const affiliateStatusEnum = mysqlEnum("status", ["pending", "qualified", "approved", "rejected"]);
export const affiliateTokenTypeEnum = mysqlEnum("token_type", ["initial", "reset"]);
export const affiliateReferralStatusEnum = mysqlEnum("referral_status", [
  "clicked",
  "registered",
  "qualified",
  "purchased",
]);
export const affiliateTransactionStatusEnum = mysqlEnum("transaction_status", [
  "pending",
  "processing",
  "paid",
  "failed",
]);

export const affiliateBatchStatusEnum = mysqlEnum("status", ["open", "closed", "draft"]);

export const affiliateBatch = mysqlTable("affiliate_batch", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 191 }).notNull(),
  startDate: datetime("start_date").notNull(),
  endDate: datetime("end_date").notNull(),
  status: affiliateBatchStatusEnum.notNull().default("draft"),
  registrationQuota: int("registration_quota").notNull().default(0),
  autoCurateOnQuotaReached: boolean("auto_curate_on_quota_reached").notNull().default(false),
  autoCurateOnBatchClose: boolean("auto_curate_on_batch_close").notNull().default(true),
  initialCommissionAmount: double("initial_commission_amount").notNull().default(0),
  initialCommissionFullClientThreshold: int("initial_commission_full_client_threshold").notNull().default(2),
  examPassingScore: int("exam_passing_score").notNull().default(70),
  trainingVideoUrl: text("training_video_url"),
  trainingPdfUrl: text("training_pdf_url"),
  interviewQuestionIds: json("interview_question_ids"),
  examQuestionIds: json("exam_question_ids"),
  aiScreeningSummary: text("ai_screening_summary"),
  aiScreeningDecisionRationale: text("ai_screening_decision_rationale"),
  aiScreeningTopSignals: json("ai_screening_top_signals"),
  aiScreeningRiskSignals: json("ai_screening_risk_signals"),
  aiScreeningRankedCandidates: json("ai_screening_ranked_candidates"),
  aiScreeningTrigger: varchar("ai_screening_trigger", { length: 64 }),
  aiScreeningStatus: varchar("ai_screening_status", { length: 32 }),
  aiScreeningTaskId: varchar("ai_screening_task_id", { length: 128 }),
  aiScreeningQueuedAt: datetime("ai_screening_queued_at"),
  aiScreeningStartedAt: datetime("ai_screening_started_at"),
  aiScreeningCompletedAt: datetime("ai_screening_completed_at"),
  aiScreeningFailedAt: datetime("ai_screening_failed_at"),
  aiScreeningError: text("ai_screening_error"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliateApplication = mysqlTable("affiliate_application", {
  id: varchar("id", { length: 36 }).primaryKey(),
  batchId: varchar("batch_id", { length: 36 }).references(() => affiliateBatch.id),
  initialCommissionAmount: double("initial_commission_amount").notNull().default(0),
  fullName: varchar("full_name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  countryCode: varchar("country_code", { length: 8 }),
  phone: varchar("phone", { length: 32 }),
  phoneE164: varchar("phone_e164", { length: 32 }),
  city: varchar("city", { length: 191 }),
  country: varchar("country", { length: 120 }).notNull(),
  govOrBusinessId: varchar("gov_or_business_id", { length: 191 }),
  occupation: varchar("occupation", { length: 191 }),
  salesExperience: varchar("sales_experience", { length: 20 }),
  hasSoldSaaS: varchar("has_sold_saas", { length: 10 }),
  salesStyle: varchar("sales_style", { length: 50 }),
  incomeGoal: varchar("income_goal", { length: 20 }),
  hearAboutUs: varchar("hear_about_us", { length: 50 }),
  whyChoose: text("why_choose"),
  videoUrl: text("video_url"),
  resumeUrl: text("resume_url"),
  strategy: text("strategy").notNull(),
  portfolioLinks: text("portfolio_links"),
  motivation: text("motivation"),
  otherPrograms: text("other_programs"),
  status: affiliateStatusEnum.notNull().default("pending"),
  notes: text("notes"),
  screeningScore: double("screening_score"),
  screeningPassingScore: int("screening_passing_score").default(80),
  screeningRecommendation: varchar("screening_recommendation", { length: 50 }),
  screeningSummary: text("screening_summary"),
  screeningStrengths: text("screening_strengths"),
  screeningWeaknesses: text("screening_weaknesses"),
  screeningAnalysisJson: text("screening_analysis_json"),
  screeningCompletedAt: datetime("screening_completed_at"),
  reviewedAt: datetime("reviewed_at"),
  reviewerId: varchar("reviewer_id", { length: 36 }),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  magicLinkToken: varchar("magic_link_token", { length: 255 }), // new column
  performanceAlertSentAt: datetime("performance_alert_sent_at"),
  performanceTerminationDueAt: datetime("performance_termination_due_at"),
  performanceTerminatedAt: datetime("performance_terminated_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliateUser = mysqlTable("affiliate_user", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => affiliateApplication.id),
  email: varchar("email", { length: 191 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  forcePasswordChange: boolean("force_password_change").notNull().default(true),
  tncAgreedAt: datetime("tnc_agreed_at"),
  tokenVersion: int("token_version").notNull().default(0),
  lastLoginAt: datetime("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliatePasswordToken = mysqlTable("affiliate_password_token", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateUserId: varchar("affiliate_user_id", { length: 36 })
    .notNull()
    .references(() => affiliateUser.id),
  tokenHash: varchar("token_hash", { length: 128 }).notNull().unique(),
  type: affiliateTokenTypeEnum.notNull().default("initial"),
  expiresAt: datetime("expires_at").notNull(),
  usedAt: datetime("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateLoginLog = mysqlTable("affiliate_login_log", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateUserId: varchar("affiliate_user_id", { length: 36 }).references(() => affiliateUser.id),
  ipAddress: varchar("ip_address", { length: 64 }),
  userAgent: text("user_agent"),
  status: mysqlEnum("status", ["success", "failed"]).notNull(),
  reason: varchar("reason", { length: 191 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const affiliateReferral = mysqlTable("affiliate_referral", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id),
  referralName: varchar("referral_name", { length: 191 }).notNull(),
  referralEmail: varchar("referral_email", { length: 191 }),
  status: affiliateReferralStatusEnum.notNull().default("clicked"),
  clicks: int("clicks").notNull().default(0),
  signups: int("signups").notNull().default(0),
  conversions: int("conversions").notNull().default(0),
  purchaseAmount: double("purchase_amount").notNull().default(0),
  commissionAmount: double("commission_amount").notNull().default(0),
  firstInteractionAt: datetime("first_interaction_at").default(sql`CURRENT_TIMESTAMP`),
  lastConversionAt: datetime("last_conversion_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const affiliateTransaction = mysqlTable("affiliate_transaction", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id),
  periodStart: datetime("period_start").notNull(),
  periodEnd: datetime("period_end").notNull(),
  amount: double("amount").notNull().default(0),
  status: affiliateTransactionStatusEnum.notNull().default("pending"),
  reference: varchar("reference", { length: 64 }),
  paidAt: datetime("paid_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Partner Portal Tables
export const partnerLeadStatusValues = [
  "New Leads",
  "Contacted",
  "Follow-up Day-1",
  "Follow-up Day-3",
  "Follow-up Day-7",
  "Follow-up Day-14",
  "Won",
  "Lost",
];

export const partnerLeadPipelineStatus = mysqlTable("partner_lead_pipeline_status", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  value: varchar("value", { length: 80 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull(),
  color: varchar("color", { length: 32 }).notNull().default("slate"),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isSystem: boolean("is_system").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerVerticalMarket = mysqlTable("partner_vertical_market", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 120 }).notNull().unique(),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isSystem: boolean("is_system").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerCommissionStatusValues = [
  "Pending Transfer",
  "Paid",
  "Rejected",
];

// Kept for reference / seed values — commission_type is now varchar(80) in DB
// so that rule engine can introduce custom types without a schema migration.
export const partnerCommissionTypeValues = [
  "sales",
  "initial",
  "basic_salary",
];

// ── Commission Rule Engine ──────────────────────────────────────────────────

export const commissionRule = mysqlTable("commission_rule", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  /** When this rule is triggered */
  triggerType: mysqlEnum("trigger_type", [
    "lead_won",      // fires on every lead status → Won
    "daily_cron",    // fires once per day per partner
    "monthly_cron",  // fires on monthlyPayoutDate once per month
    "manual",        // admin-triggered only
  ]).notNull(),
  /** Value stored in partnerCommission.commissionType for records this rule creates */
  commissionType: varchar("commission_type", { length: 80 }).notNull(),
  /** per_lead = one commission per lead; per_period = one commission per partner per month */
  scope: mysqlEnum("rule_scope", ["per_lead", "per_period"]).notNull().default("per_period"),
  /** Which month window counts for stats evaluation */
  periodScope: mysqlEnum("period_scope", [
    "first_month",    // only partner's very first calendar month
    "current_month",  // current calendar month
    "any_month",      // no time restriction
  ]).notNull().default("current_month"),
  /**
   * Condition tree JSON.
   * Shape: { operator: 'AND'|'OR', groups: [{ operator: 'AND'|'OR', conditions: [{ field, op, value }] }] }
   * Available fields: closed_clients, total_revenue, tenure_days, batch_id,
   *   lead_project_value, lead_service_id, lead_status, payout_day, is_first_month
   * Operators: eq, neq, gt, gte, lt, lte, in, not_in
   */
  conditions: json("conditions"),
  /**
   * Reward config JSON.
   * { type: 'fixed', value: 500 }
   * { type: 'percentage', value: 10 }           -- % of lead.projectValue
   * { type: 'percentage_of_revenue', value: 2 } -- % of period total revenue
   * { type: 'tiered', tiers: [{ min, max?, amount }] } -- uses closed_clients metric
   * { type: 'service_config' }                  -- delegates to per-service commission setting
   */
  reward: json("reward"),
  isActive: boolean("is_active").notNull().default(true),
  /** Lower priority number = evaluated first */
  priority: int("priority").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commissionRuleLog = mysqlTable("commission_rule_log", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  ruleId: varchar("rule_id", { length: 36 })
    .notNull()
    .references(() => commissionRule.id, { onDelete: "cascade" }),
  affiliateId: varchar("affiliate_id", { length: 36 }).notNull(),
  leadId: varchar("lead_id", { length: 36 }),
  period: varchar("period", { length: 7 }),
  outcome: mysqlEnum("rule_outcome", ["skipped", "created", "updated", "error"]).notNull(),
  reason: text("reason"),
  amount: double("amount"),
  evaluatedAt: timestamp("evaluated_at").defaultNow().notNull(),
});

export const salesMaterialTypeEnum = mysqlEnum("material_type", [
  "rich_text",
  "file",
  "video",
  "link",
]);

export const partnerService = mysqlTable("partner_service", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: varchar("name", { length: 191 }).notNull(),
  projectValue: double("project_value").notNull().default(0),
  commissionPercentage: double("commission_percentage").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const salesMaterial = mysqlTable("sales_material", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: varchar("title", { length: 191 }).notNull(),
  summary: text("summary"),
  materialType: salesMaterialTypeEnum.notNull().default("rich_text"),
  content: text("content"),
  externalUrl: text("external_url"),
  fileUrl: text("file_url"),
  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 120 }),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerLead = mysqlTable("partner_lead", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  serviceId: varchar("service_id", { length: 36 })
    .notNull()
    .references(() => partnerService.id),
  verticalMarketId: varchar("vertical_market_id", { length: 36 }).references(
    () => partnerVerticalMarket.id,
    { onDelete: "set null" },
  ),
  verticalMarketName: varchar("vertical_market_name", { length: 120 }),
  projectValue: double("project_value").notNull().default(0),
  isCustomProjectValue: boolean("is_custom_project_value").notNull().default(false),
  status: varchar("lead_status", { length: 80 }).notNull().default("New Leads"),
  nextFollowUpAt: datetime("next_follow_up_at"),
  lastContactAt: datetime("last_contact_at"),
  lastStatusChangedAt: datetime("last_status_changed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerLeadActivity = mysqlTable("partner_lead_activity", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  leadId: varchar("lead_id", { length: 36 })
    .notNull()
    .references(() => partnerLead.id, { onDelete: "cascade" }),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id, { onDelete: "cascade" }),
  actorType: varchar("actor_type", { length: 32 }).notNull(),
  actorId: varchar("actor_id", { length: 64 }),
  actionType: varchar("action_type", { length: 64 }).notNull(),
  fromStatus: varchar("from_status", { length: 80 }),
  toStatus: varchar("to_status", { length: 80 }),
  note: text("note"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const partnerLeadNote = mysqlTable("partner_lead_note", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  leadId: varchar("lead_id", { length: 36 })
    .notNull()
    .references(() => partnerLead.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdByType: varchar("created_by_type", { length: 20 }).notNull().default("partner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerCommission = mysqlTable("partner_commission", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id, { onDelete: "cascade" }),
  leadId: varchar("lead_id", { length: 36 }).references(
    () => partnerLead.id,
    { onDelete: "set null" },
  ),
  serviceId: varchar("service_id", { length: 36 }).references(
    () => partnerService.id,
    { onDelete: "set null" },
  ),
  amount: double("amount").notNull().default(0),
  // varchar(80) instead of enum — allows custom commission types from rule engine
  commissionType: varchar("commission_type", { length: 80 }).notNull().default("sales"),
  period: varchar("period", { length: 7 }),
  status: mysqlEnum("commission_status", partnerCommissionStatusValues).notNull().default("Pending Transfer"),
  paidAt: datetime("paid_at"),
  paidById: varchar("paid_by_id", { length: 36 }),
  proofUrl: varchar("proof_url", { length: 500 }),
  transactionReference: varchar("transaction_reference", { length: 191 }),
  rejectedAt: datetime("rejected_at"),
  rejectionReason: text("rejection_reason"),
  transactionId: varchar("transaction_id", { length: 36 }).references(
    () => affiliateTransaction.id
  ),
  /** Which commission rule generated this record (null for legacy records) */
  ruleId: varchar("rule_id", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const partnerPerformanceSetting = mysqlTable("partner_performance_setting", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  basicSalaryAmount: double("basic_salary_amount").notNull().default(3500),
  basicSalarySalesThreshold: double("basic_salary_sales_threshold").notNull().default(35000),
  firstMonthMinimumClosedClients: int("first_month_minimum_closed_clients").notNull().default(1),
  initialCommissionFullClientThreshold: int("initial_commission_full_client_threshold").notNull().default(2),
  terminationGraceDays: int("termination_grace_days").notNull().default(2),
  monthlyPayoutDate: int("monthly_payout_date").notNull().default(25),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Assessment System Tables
export const assessmentSettings = mysqlTable("assessment_settings", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  examWaitHours: int("exam_wait_hours").notNull().default(24),
  examDurationMinutes: int("exam_duration_minutes").notNull().default(60),
  // AI screening threshold used to classify applicants before interview review.
  screeningPassingScore: int("screening_passing_score").notNull().default(80),
  maxExamAttempts: int("max_exam_attempts").notNull().default(2),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentQuestionTypeEnum = mysqlEnum("question_type", [
  "video_introduction",
  "multiple_choice",
  "essay",
]);

export const assessmentQuestion = mysqlTable("assessment_question", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  questionType: assessmentQuestionTypeEnum.notNull(),
  question: text("question").notNull(),
  options: text("options"), // For multiple choice: JSON string [{label, value}]
  correctAnswer: text("correct_answer"), // Correct answer or correct option value
  points: int("points").notNull().default(1),
  orderIndex: int("order_index").notNull().default(0),
  isRequired: boolean("is_required").notNull().default(true),
  videoInstructions: text("video_instructions"), // Instructions for video questions
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentSessionStatusEnum = mysqlEnum("session_status", [
  "not_started",
  "in_progress",
  "submitted",
  "scored",
  "passed",
  "failed",
]);

export const assessmentSession = mysqlTable("assessment_session", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .references(() => affiliateApplication.id, { onDelete: "cascade" }),
  examToken: varchar("exam_token", { length: 36 }),
  tokenUsedAt: datetime("token_used_at"),
  tokenInvalidated: boolean("token_invalidated").default(false),
  expiresAt: datetime("expires_at"),
  status: varchar("session_status", { length: 20 }).notNull().default("not_started"),
  startedAt: datetime("started_at"),
  submittedAt: datetime("submitted_at"),
  scoredAt: datetime("scored_at"),
  totalDurationSeconds: int("total_duration_seconds"),
  totalScore: double("total_score").default(0),
  maxScore: double("max_score").default(0),
  percentage: double("percentage").default(0),
  passingPercentage: int("passing_percentage").notNull().default(70),
  reviewerId: varchar("reviewer_id", { length: 36 }),
  reviewerNotes: text("reviewer_notes"),
  isPassed: boolean("is_passed"),
  aiExamRecommendation: varchar("ai_exam_recommendation", { length: 50 }),
  aiExamSummary: text("ai_exam_summary"),
  aiExamStrengths: text("ai_exam_strengths"),
  aiExamWeaknesses: text("ai_exam_weaknesses"),
  aiExamDecisionRationale: text("ai_exam_decision_rationale"),
  aiExamAnalysisJson: text("ai_exam_analysis_json"),
  aiExamCompletedAt: datetime("ai_exam_completed_at"),
  aiFinalRecommendation: varchar("ai_final_recommendation", { length: 50 }),
  aiFinalSummary: text("ai_final_summary"),
  aiFinalStrengths: text("ai_final_strengths"),
  aiFinalWeaknesses: text("ai_final_weaknesses"),
  aiFinalDecisionRationale: text("ai_final_decision_rationale"),
  aiFinalAnalysisJson: text("ai_final_analysis_json"),
  aiFinalCompletedAt: datetime("ai_final_completed_at"),
  aiReviewRuntimeStatus: varchar("ai_review_runtime_status", { length: 20 }).default("idle"),
  aiReviewQueuedAt: datetime("ai_review_queued_at"),
  aiReviewStartedAt: datetime("ai_review_started_at"),
  aiReviewFailedAt: datetime("ai_review_failed_at"),
  aiReviewLastError: text("ai_review_last_error"),
  aiReviewRetryCount: int("ai_review_retry_count").notNull().default(0),
  // Security tracking
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  submitIpAddress: varchar("submit_ip_address", { length: 45 }),
  submitUserAgent: text("submit_user_agent"),
  browserFingerprint: varchar("browser_fingerprint", { length: 64 }),
  tabSwitchCount: int("tab_switch_count").default(0),
  timePerQuestion: text("time_per_question"), // JSON: { "questionId": seconds }
  answerHash: varchar("answer_hash", { length: 64 }), // SHA256 hash of answers
  answerIntegrityVerified: boolean("answer_integrity_verified").default(false),
  securityFlags: text("security_flags"), // JSON: array of flags
  securityRiskScore: int("security_risk_score").default(0),
  securityRiskLevel: varchar("security_risk_level", { length: 20 }).default("low"),
  securitySummary: text("security_summary"),
  securityAnalysisJson: text("security_analysis_json"),
  securityReviewRequired: boolean("security_review_required").default(false),
  interviewStatus: varchar("interview_status", { length: 20 }).default("not_started"),
  interviewSubmittedLink: text("interview_submitted_link"),
  interviewSubmittedAt: datetime("interview_submitted_at"),
  interviewInvitationSentAt: datetime("interview_invitation_sent_at"),
  interviewReviewedAt: datetime("interview_reviewed_at"),
  interviewReviewerId: varchar("interview_reviewer_id", { length: 36 }),
  interviewReviewNotes: text("interview_review_notes"),
  trainingInvitationSentAt: datetime("training_invitation_sent_at"),
  examInvitationSentAt: datetime("exam_invitation_sent_at"),
  // Training fields
  trainingStatus: varchar("training_status", { length: 20 }).default("not_started"),
  trainingCompletedAt: datetime("training_completed_at"),
  trainingEmbedViewed: boolean("training_embed_viewed").default(false),
  trainingVideoCompleted: boolean("training_video_completed").default(false),
  trainingVideoCompletedIds: text("training_video_completed_ids"), // JSON: array of training_content ids
  trainingPdfPagesViewed: text("training_pdf_pages_viewed"), // JSON: array of page numbers
  trainingCredentialsViewed: boolean("training_credentials_viewed").default(false),
  trainingAgreementAccepted: boolean("training_agreement_accepted").default(false),
  examMustCompleteBy: datetime("exam_must_complete_by"),
  examAttemptCount: int("exam_attempt_count").notNull().default(0),
  maxExamAttempts: int("max_exam_attempts").notNull().default(2),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const assessmentAnswer = mysqlTable("assessment_answer", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  sessionId: varchar("session_id", { length: 36 })
    .notNull()
    .references(() => assessmentSession.id, { onDelete: "cascade" }),
  questionId: varchar("question_id", { length: 36 })
    .notNull()
    .references(() => assessmentQuestion.id, { onDelete: "cascade" }),
  answerType: assessmentQuestionTypeEnum.notNull(),
  videoUrl: text("video_url"), // For video introduction answers
  selectedOption: varchar("selected_option", { length: 255 }), // For multiple choice
  essayAnswer: text("essay_answer"), // For essay answers
  score: double("score").default(0),
  maxScore: double("max_score").notNull(),
  reviewerScore: double("reviewer_score"), // Admin-assigned score for essay/video
  reviewerFeedback: text("reviewer_feedback"),
  isCorrect: boolean("is_correct"),
  answeredAt: datetime("answered_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Partner Registration Completion Data
export const partnerRegistrationData = mysqlTable("partner_registration_data", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  affiliateId: varchar("affiliate_id", { length: 36 })
    .notNull()
    .unique()
    .references(() => affiliateApplication.id, { onDelete: "cascade" }),
  gender: mysqlEnum("gender", ["male", "female", "other"]).notNull(),
  dateOfBirth: date("date_of_birth"),
  address: text("address"),
  city: varchar("city", { length: 191 }),
  postalCode: varchar("postal_code", { length: 20 }),
  idCardNumber: varchar("id_card_number", { length: 50 }),
  idCardUrl: text("id_card_url"),
  selfieWithIdUrl: text("selfie_with_id_url"),
  emergencyContactName: varchar("emergency_contact_name", { length: 191 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 32 }),
  emergencyContactRelation: varchar("emergency_contact_relation", { length: 50 }),
  bankName: varchar("bank_name", { length: 191 }),
  bankAccountNumber: varchar("bank_account_number", { length: 50 }),
  bankAccountHolder: varchar("bank_account_holder", { length: 191 }),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: datetime("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Exam Audit Log - tracks all exam events for security
export const assessmentAuditLog = mysqlTable("assessment_audit_log", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  sessionId: varchar("session_id", { length: 36 })
    .notNull()
    .references(() => assessmentSession.id, { onDelete: "cascade" }),
  eventType: varchar("event_type", { length: 50 }).notNull(), // exam_start, exam_submit, tab_switch, save_answer, etc.
  eventData: text("event_data"), // JSON with additional data
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Training Content Configuration - managed via dashboard
export const trainingContent = mysqlTable("training_content", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  contentType: varchar("content_type", { length: 50 }).notNull(), // embed_script, video_url, pdf_file
  contentValue: text("content_value").notNull(), // The actual URL or script
  orderIndex: int("order_index").default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
