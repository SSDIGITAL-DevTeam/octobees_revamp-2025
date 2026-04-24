import { and, eq, sql, desc, asc, isNull } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
  affiliateApplication,
  assessmentSession,
  affiliateBatch,
  partnerRegistrationData,
  user,
  affiliateUser,
  affiliatePasswordToken,
  affiliateLoginLog,
  affiliateReferral,
  affiliateTransaction,
} from "../../drizzle/schema.js";
import { getBatchAiSummarySupport } from "../affiliate-batch/batch-ai-columns.js";

export const insertAffiliateApplication = async (payload) => {
  await db.insert(affiliateApplication).values(payload);
  return payload;
};

const createCapacityError = (message, meta = {}) => {
  const error = new Error(message);
  error.code = "BATCH_CAPACITY_EXHAUSTED";
  error.statusCode = 409;
  Object.assign(error, meta);
  return error;
};

const createClosedRegistrationError = (message) => {
  const error = new Error(message);
  error.code = "REGISTRATION_CLOSED";
  error.statusCode = 409;
  return error;
};

export const reserveActiveBatchSlotAndInsertAffiliateApplication = async (
  payload,
) => {
  return await db.transaction(async (tx) => {
    const activeRows = await tx
      .select()
      .from(affiliateBatch)
      .where(
        and(
          eq(affiliateBatch.status, "open"),
          sql`DATE(${affiliateBatch.startDate}) <= CURDATE()`,
          sql`DATE(${affiliateBatch.endDate}) >= CURDATE()`,
        ),
      )
      .orderBy(desc(affiliateBatch.startDate), desc(affiliateBatch.createdAt))
      .limit(10)
      .for("update");

    if (!activeRows.length) {
      throw createClosedRegistrationError(
        "We are currently closed for new affiliate applications. Please check back later.",
      );
    }

    let selectedBatch = null;
    let selectedApplicationCount = 0;
    let selectedRegistrationQuota = 0;
    let selectedRemainingSlots = null;

    for (const batch of activeRows) {
      const [{ count: currentCount }] = await tx
        .select({ count: sql`COUNT(*)`.mapWith(Number) })
        .from(affiliateApplication)
        .where(eq(affiliateApplication.batchId, batch.id));

      const registrationQuota = Number(batch.registrationQuota || 0);
      const applicationCount = Number(currentCount || 0);
      const remainingSlots =
        registrationQuota > 0
          ? Math.max(0, registrationQuota - applicationCount)
          : null;

      if (registrationQuota <= 0 || applicationCount < registrationQuota) {
        selectedBatch = batch;
        selectedApplicationCount = applicationCount;
        selectedRegistrationQuota = registrationQuota;
        selectedRemainingSlots = remainingSlots;
        break;
      }
    }

    if (!selectedBatch) {
      throw createCapacityError(
        "This affiliate batch is already full. Please wait for the next batch.",
        {
          batchId: activeRows[0].id,
          registrationQuota: Number(activeRows[0].registrationQuota || 0),
          remainingSlots: 0,
        },
      );
    }

    const existingPendingRows = await tx
      .select({ id: affiliateApplication.id })
      .from(affiliateApplication)
      .where(
        and(
          eq(affiliateApplication.email, payload.email),
          eq(affiliateApplication.status, "pending"),
        ),
      )
      .limit(1)
      .for("update");

    if (existingPendingRows[0]) {
      const error = new Error(
        "You already have a pending application with this email.",
      );
      error.code = "DUPLICATE_PENDING_APPLICATION";
      error.statusCode = 409;
      throw error;
    }

    const application = {
      ...payload,
      batchId: selectedBatch.id,
      initialCommissionAmount: Number(
        selectedBatch.initialCommissionAmount || 0,
      ),
    };

    await tx.insert(affiliateApplication).values(application);

    return {
      application,
      batch: selectedBatch,
      registrationQuota: selectedRegistrationQuota,
      previousApplicationCount: selectedApplicationCount,
      applicationCountAfterInsert: selectedApplicationCount + 1,
      remainingSlotsAfterInsert:
        selectedRemainingSlots === null
          ? null
          : Math.max(0, selectedRemainingSlots - 1),
      quotaReached:
        selectedRegistrationQuota > 0 &&
        selectedApplicationCount + 1 >= selectedRegistrationQuota,
    };
  });
};

export const findPendingByEmail = async (email) => {
  const rows = await db
    .select()
    .from(affiliateApplication)
    .where(
      and(
        eq(affiliateApplication.email, email),
        eq(affiliateApplication.status, "pending"),
      ),
    )
    .limit(1);
  return rows[0] || null;
};

export const findAffiliateById = async (id) => {
  const rows = await db
    .select({
      id: affiliateApplication.id,
      initialCommissionAmount: affiliateApplication.initialCommissionAmount,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      countryCode: affiliateApplication.countryCode,
      phone: affiliateApplication.phone,
      phoneE164: affiliateApplication.phoneE164,
      city: affiliateApplication.city,
      country: affiliateApplication.country,
      occupation: affiliateApplication.occupation,
      salesExperience: affiliateApplication.salesExperience,
      hasSoldSaaS: affiliateApplication.hasSoldSaaS,
      salesStyle: affiliateApplication.salesStyle,
      incomeGoal: affiliateApplication.incomeGoal,
      hearAboutUs: affiliateApplication.hearAboutUs,
      whyChoose: affiliateApplication.whyChoose,
      videoUrl: affiliateApplication.videoUrl,
      resumeUrl: affiliateApplication.resumeUrl,
      govOrBusinessId: affiliateApplication.govOrBusinessId,
      strategy: affiliateApplication.strategy,
      portfolioLinks: affiliateApplication.portfolioLinks,
      motivation: affiliateApplication.motivation,
      otherPrograms: affiliateApplication.otherPrograms,
      status: affiliateApplication.status,
      notes: affiliateApplication.notes,
      screeningScore: affiliateApplication.screeningScore,
      screeningPassingScore: affiliateApplication.screeningPassingScore,
      screeningRecommendation: affiliateApplication.screeningRecommendation,
      screeningSummary: affiliateApplication.screeningSummary,
      screeningStrengths: affiliateApplication.screeningStrengths,
      screeningWeaknesses: affiliateApplication.screeningWeaknesses,
      screeningAnalysisJson: affiliateApplication.screeningAnalysisJson,
      screeningCompletedAt: affiliateApplication.screeningCompletedAt,
      reviewedAt: affiliateApplication.reviewedAt,
      reviewerId: affiliateApplication.reviewerId,
      reviewerName: user.name,
      ipAddress: affiliateApplication.ipAddress,
      userAgent: affiliateApplication.userAgent,
      createdAt: affiliateApplication.createdAt,
      updatedAt: affiliateApplication.updatedAt,
      batchId: affiliateApplication.batchId,
      batchName: affiliateBatch.name,
      assessmentSessionId: assessmentSession.id,
      assessmentStatus: assessmentSession.status,
      assessmentInterviewStatus: assessmentSession.interviewStatus,
      assessmentInterviewReviewedAt: assessmentSession.interviewReviewedAt,
      assessmentInterviewReviewNotes: assessmentSession.interviewReviewNotes,
      assessmentInterviewSubmittedLink:
        assessmentSession.interviewSubmittedLink,
      assessmentInterviewSubmittedAt: assessmentSession.interviewSubmittedAt,
      assessmentTrainingStatus: assessmentSession.trainingStatus,
      assessmentExamInvitationSentAt: assessmentSession.examInvitationSentAt,
      assessmentExamAttemptCount: assessmentSession.examAttemptCount,
      assessmentMaxExamAttempts: assessmentSession.maxExamAttempts,
      assessmentStartedAt: assessmentSession.startedAt,
      assessmentSubmittedAt: assessmentSession.submittedAt,
      assessmentScoredAt: assessmentSession.scoredAt,
      assessmentScorePercentage: assessmentSession.percentage,
      assessmentIsPassed: assessmentSession.isPassed,
      assessmentTotalScore: assessmentSession.totalScore,
      assessmentMaxScore: assessmentSession.maxScore,
      assessmentExamMustCompleteBy: assessmentSession.examMustCompleteBy,
      assessmentAiExamRecommendation: assessmentSession.aiExamRecommendation,
      assessmentAiExamSummary: assessmentSession.aiExamSummary,
      assessmentAiExamStrengths: assessmentSession.aiExamStrengths,
      assessmentAiExamWeaknesses: assessmentSession.aiExamWeaknesses,
      assessmentAiExamDecisionRationale:
        assessmentSession.aiExamDecisionRationale,
      assessmentAiExamAnalysisJson: assessmentSession.aiExamAnalysisJson,
      assessmentAiExamCompletedAt: assessmentSession.aiExamCompletedAt,
      assessmentAiFinalRecommendation: assessmentSession.aiFinalRecommendation,
      assessmentAiFinalSummary: assessmentSession.aiFinalSummary,
      assessmentAiFinalStrengths: assessmentSession.aiFinalStrengths,
      assessmentAiFinalWeaknesses: assessmentSession.aiFinalWeaknesses,
      assessmentAiFinalDecisionRationale:
        assessmentSession.aiFinalDecisionRationale,
      assessmentAiFinalAnalysisJson: assessmentSession.aiFinalAnalysisJson,
      assessmentAiFinalCompletedAt: assessmentSession.aiFinalCompletedAt,
      assessmentSubmitIpAddress: assessmentSession.submitIpAddress,
      assessmentSubmitUserAgent: assessmentSession.submitUserAgent,
      assessmentSecurityRiskScore: assessmentSession.securityRiskScore,
      assessmentSecurityRiskLevel: assessmentSession.securityRiskLevel,
      assessmentSecuritySummary: assessmentSession.securitySummary,
      assessmentSecurityAnalysisJson: assessmentSession.securityAnalysisJson,
      assessmentSecurityReviewRequired:
        assessmentSession.securityReviewRequired,
    })
    .from(affiliateApplication)
    .leftJoin(user, eq(user.id, affiliateApplication.reviewerId))
    .leftJoin(
      affiliateBatch,
      eq(affiliateBatch.id, affiliateApplication.batchId),
    )
    .leftJoin(
      assessmentSession,
      eq(assessmentSession.affiliateId, affiliateApplication.id),
    )
    .where(eq(affiliateApplication.id, id))
    .limit(1);
  return rows[0] || null;
};

// helper LIKE insensitive
const likeInsensitive = (col, term) =>
  sql`LOWER(${col}) LIKE ${"%" + String(term).toLowerCase() + "%"}`;

const effectiveQualifiedCondition = sql`
    (
        ${affiliateApplication.status} = 'qualified'
        OR (
            (${affiliateApplication.status} = 'approved' OR ${affiliateApplication.status} = 'rejected')
            AND ${affiliateApplication.reviewedAt} IS NULL
        )
    )
`;

const qualificationStageCondition = sql`
    (
        ${effectiveQualifiedCondition}
        AND ${assessmentSession.trainingInvitationSentAt} IS NULL
        AND ${assessmentSession.interviewInvitationSentAt} IS NULL
        AND COALESCE(${assessmentSession.interviewStatus}, 'not_started') = 'not_started'
        AND COALESCE(${assessmentSession.trainingStatus}, 'not_started') = 'not_started'
    )
`;

const interviewStageCondition = sql`
    (
        ${effectiveQualifiedCondition}
        AND ${assessmentSession.trainingInvitationSentAt} IS NULL
        AND (
            ${assessmentSession.interviewInvitationSentAt} IS NOT NULL
            OR COALESCE(${assessmentSession.interviewStatus}, 'not_started') = 'submitted'
        )
        AND COALESCE(${assessmentSession.interviewStatus}, 'not_started') IN ('not_started', 'submitted')
        AND COALESCE(${assessmentSession.trainingStatus}, 'not_started') = 'not_started'
    )
`;

const trainingStageCondition = sql`
    (
        ${effectiveQualifiedCondition}
        AND ${assessmentSession.trainingInvitationSentAt} IS NOT NULL
        AND COALESCE(${assessmentSession.interviewStatus}, 'not_started') = 'approved'
        AND COALESCE(${assessmentSession.trainingStatus}, 'not_started') IN ('not_started', 'in_progress')
    )
`;

const buildWhere = ({ search, status, stage, position }) => {
  const conds = [];

  if (search) {
    conds.push(
      sql`(${likeInsensitive(affiliateApplication.fullName, search)}
        OR ${likeInsensitive(affiliateApplication.email, search)})`,
    );
  }
  if (status) conds.push(eq(affiliateApplication.status, status));
  if (stage === "qualified") {
    conds.push(qualificationStageCondition);
  }
  if (stage === "interview") {
    conds.push(interviewStageCondition);
  }
  if (stage === "training") {
    conds.push(trainingStageCondition);
  }
  if (stage === "certification") {
    conds.push(
      sql`COALESCE(${assessmentSession.trainingStatus}, 'not_started') = 'completed'`,
    );
    conds.push(
      sql`NOT (${affiliateApplication.status} = 'approved' AND ${affiliateApplication.reviewedAt} IS NOT NULL)`,
    );
    conds.push(
      sql`NOT (${affiliateApplication.status} = 'rejected' AND ${affiliateApplication.reviewedAt} IS NOT NULL)`,
    );
  }
  if (stage === "onboarded") {
    conds.push(eq(affiliateApplication.status, "approved"));
    conds.push(sql`${affiliateApplication.reviewedAt} IS NOT NULL`);
  }
  if (stage === "rejected") {
    conds.push(eq(affiliateApplication.status, "rejected"));
    conds.push(sql`${affiliateApplication.reviewedAt} IS NOT NULL`);
  }
  // kalau nanti ada kolom position:
  // if (position) conds.push(eq(affiliateApplication.position, position));

  if (!conds.length) return undefined;
  return and(...conds);
};

const buildSingleOrderBy = (sort = "applied_newest") => {
  switch (sort) {
    case "applied_oldest":
      return asc(affiliateApplication.createdAt);
    case "score_highest":
      return desc(sql`COALESCE(${assessmentSession.percentage}, -1)`);
    case "score_lowest":
      return asc(sql`COALESCE(${assessmentSession.percentage}, 101)`);
    case "applied_newest":
    default:
      return desc(affiliateApplication.createdAt);
  }
};

const buildOrderBy = (sort = "applied_newest") => {
  const normalized = String(sort || "applied_newest")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const uniqueSorts = [...new Set(normalized)].slice(0, 3);
  const effectiveSorts = uniqueSorts.length ? uniqueSorts : ["applied_newest"];
  const orderBy = effectiveSorts.map((item) => buildSingleOrderBy(item));

  const hasAppliedSort = effectiveSorts.some(
    (item) => item === "applied_newest" || item === "applied_oldest",
  );
  if (!hasAppliedSort) {
    orderBy.push(desc(affiliateApplication.createdAt));
  }

  return orderBy;
};

export const listAffiliateApplications = async ({
  page = 1,
  limit = 10,
  search,
  status,
  stage,
  position,
  sort = "applied_newest",
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const where = buildWhere({ search, status, stage, position });
  const orderBy = buildOrderBy(sort);
  const batchAiSummarySupport = await getBatchAiSummarySupport();

  const data = await db
    .select({
      id: affiliateApplication.id,
      batch_id: affiliateApplication.batchId,
      full_name: affiliateApplication.fullName,
      email: affiliateApplication.email,
      phone: affiliateApplication.phone,
      country: affiliateApplication.country,
      status: affiliateApplication.status,
      screening_score: affiliateApplication.screeningScore,
      screening_recommendation: affiliateApplication.screeningRecommendation,
      created_at: affiliateApplication.createdAt,
      reviewed_at: affiliateApplication.reviewedAt,
      reviewer_id: affiliateApplication.reviewerId,
      batch_name: affiliateBatch.name,
      batch_ai_screening_summary: batchAiSummarySupport.aiScreeningSummary
        ? affiliateBatch.aiScreeningSummary
        : sql`null`,
      batch_ai_screening_completed_at:
        batchAiSummarySupport.aiScreeningCompletedAt
          ? affiliateBatch.aiScreeningCompletedAt
          : sql`null`,
      initial_commission_amount: affiliateApplication.initialCommissionAmount,
      assessment_session_id: assessmentSession.id,
      assessment_status: assessmentSession.status,
      assessment_interview_status: assessmentSession.interviewStatus,
      assessment_training_status: assessmentSession.trainingStatus,
      assessment_submitted_at: assessmentSession.submittedAt,
      assessment_score_percentage: assessmentSession.percentage,
      assessment_is_passed: assessmentSession.isPassed,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateBatch,
      eq(affiliateBatch.id, affiliateApplication.batchId),
    )
    .leftJoin(
      assessmentSession,
      eq(assessmentSession.affiliateId, affiliateApplication.id),
    )
    .where(where)
    .orderBy(...orderBy)
    .limit(Number(limit))
    .offset(offset);

  return { data };
};

export const countAffiliateApplications = async ({
  search,
  status,
  stage,
  position,
}) => {
  const where = buildWhere({ search, status, stage, position });
  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(affiliateApplication)
    .where(where);
  return count ?? 0;
};

export const deleteAffiliateById = async (id) => {
  await db.delete(affiliateApplication).where(eq(affiliateApplication.id, id));
};

export const updateAffiliateApplication = async (id, data) => {
  await db
    .update(affiliateApplication)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(affiliateApplication.id, id));
};

// ambil semua (tanpa pagination) untuk Export CSV
export const listAffiliateAllForExport = async ({
  search,
  status,
  stage,
  position,
  sort = "applied_newest",
}) => {
  const where = buildWhere({ search, status, stage, position });
  const orderBy = buildOrderBy(sort);

  const rows = await db
    .select({
      full_name: affiliateApplication.fullName,
      email: affiliateApplication.email,
      phone: affiliateApplication.phone,
      country: affiliateApplication.country,
      status: affiliateApplication.status,
      created_at: affiliateApplication.createdAt,
      batch_name: affiliateBatch.name,
      initial_commission_amount: affiliateApplication.initialCommissionAmount,
      assessment_status: assessmentSession.status,
      assessment_score_percentage: assessmentSession.percentage,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateBatch,
      eq(affiliateBatch.id, affiliateApplication.batchId),
    )
    .leftJoin(
      assessmentSession,
      eq(assessmentSession.affiliateId, affiliateApplication.id),
    )
    .where(where)
    .orderBy(...orderBy);

  return rows;
};

// ringkasan sederhana
export const aggregateAffiliateStats = async () => {
  const [stats] = await db
    .select({
      total: sql`COUNT(*)`.mapWith(Number),
      pending:
        sql`SUM(CASE WHEN ${affiliateApplication.status}='pending' THEN 1 ELSE 0 END)`.mapWith(
          Number,
        ),
      approved:
        sql`SUM(CASE WHEN ${affiliateApplication.status}='approved' AND ${affiliateApplication.reviewedAt} IS NOT NULL THEN 1 ELSE 0 END)`.mapWith(
          Number,
        ),
      qualified:
        sql`SUM(CASE WHEN ${effectiveQualifiedCondition} THEN 1 ELSE 0 END)`.mapWith(
          Number,
        ),
      rejected:
        sql`SUM(CASE WHEN ${affiliateApplication.status}='rejected' AND ${affiliateApplication.reviewedAt} IS NOT NULL THEN 1 ELSE 0 END)`.mapWith(
          Number,
        ),
      qualifiedCandidates: sql`
                SUM(
                    CASE
                        WHEN ${qualificationStageCondition}
                        THEN 1
                        ELSE 0
                    END
                )
            `.mapWith(Number),
      interviewSession: sql`
                SUM(
                    CASE
                        WHEN ${interviewStageCondition}
                        THEN 1
                        ELSE 0
                    END
                )
            `.mapWith(Number),
      trainingSession: sql`
                SUM(
                    CASE
                        WHEN ${trainingStageCondition}
                        THEN 1
                        ELSE 0
                    END
                )
            `.mapWith(Number),
      certification: sql`
                SUM(
                    CASE
                        WHEN COALESCE(${assessmentSession.trainingStatus}, 'not_started') = 'completed'
                             AND NOT (${affiliateApplication.status} = 'approved' AND ${affiliateApplication.reviewedAt} IS NOT NULL)
                             AND NOT (${affiliateApplication.status} = 'rejected' AND ${affiliateApplication.reviewedAt} IS NOT NULL)
                        THEN 1
                        ELSE 0
                    END
                )
            `.mapWith(Number),
      onboarded: sql`
                SUM(
                    CASE
                        WHEN ${affiliateApplication.status}='approved' AND ${affiliateApplication.reviewedAt} IS NOT NULL
                        THEN 1
                        ELSE 0
                    END
                )
            `.mapWith(Number),
    })
    .from(affiliateApplication)
    .leftJoin(
      assessmentSession,
      eq(assessmentSession.affiliateId, affiliateApplication.id),
    );

  return {
    total: stats?.total ?? 0,
    pending: stats?.pending ?? 0,
    qualified: stats?.qualified ?? 0,
    approved: stats?.approved ?? 0,
    rejected: stats?.rejected ?? 0,
    totalCandidates: stats?.total ?? 0,
    qualifiedCandidates: stats?.qualifiedCandidates ?? 0,
    interviewSession: stats?.interviewSession ?? 0,
    trainingSession: stats?.trainingSession ?? 0,
    certification: stats?.certification ?? 0,
    onboarded: stats?.onboarded ?? 0,
  };
};

// === NAMED EXPORT YANG HILANG (FIX) ===
export const reviewAffiliateApplication = async (
  id,
  { status, notes, reviewerId, reviewedAt },
  client = db,
) => {
  await client
    .update(affiliateApplication)
    .set({ status, notes, reviewerId, reviewedAt, updatedAt: new Date() })
    .where(eq(affiliateApplication.id, id));
};

export const findAffiliateUserByAffiliateId = async (
  affiliateId,
  client = db,
) => {
  const rows = await client
    .select({
      id: affiliateUser.id,
      affiliateId: affiliateUser.affiliateId,
      email: affiliateUser.email,
      passwordHash: affiliateUser.passwordHash,
      isActive: affiliateUser.isActive,
      forcePasswordChange: affiliateUser.forcePasswordChange,
      tokenVersion: affiliateUser.tokenVersion,
      lastLoginAt: affiliateUser.lastLoginAt,
    })
    .from(affiliateUser)
    .where(eq(affiliateUser.affiliateId, affiliateId))
    .limit(1);
  return rows[0] || null;
};

export const createAffiliateUserRecord = async (payload, client = db) => {
  await client.insert(affiliateUser).values(payload);
  return payload;
};

export const updateAffiliateUserRecord = async (id, data, client = db) => {
  await client
    .update(affiliateUser)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(affiliateUser.id, id));
};

export const createAffiliatePasswordToken = async (payload, client = db) => {
  await client.insert(affiliatePasswordToken).values(payload);
  return payload;
};

export const findPasswordTokenByHash = async (tokenHash) => {
  const rows = await db
    .select({
      id: affiliatePasswordToken.id,
      affiliateUserId: affiliatePasswordToken.affiliateUserId,
      tokenHash: affiliatePasswordToken.tokenHash,
      expiresAt: affiliatePasswordToken.expiresAt,
      usedAt: affiliatePasswordToken.usedAt,
      type: affiliatePasswordToken.type,
      createdAt: affiliatePasswordToken.createdAt,
    })
    .from(affiliatePasswordToken)
    .where(eq(affiliatePasswordToken.tokenHash, tokenHash))
    .limit(1);
  return rows[0] || null;
};

export const markPasswordTokenUsed = async (id, client = db) => {
  await client
    .update(affiliatePasswordToken)
    .set({ usedAt: new Date() })
    .where(eq(affiliatePasswordToken.id, id));
};

export const invalidatePasswordTokensForUser = async (
  affiliateUserId,
  client = db,
) => {
  await client
    .update(affiliatePasswordToken)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(affiliatePasswordToken.affiliateUserId, affiliateUserId),
        isNull(affiliatePasswordToken.usedAt),
      ),
    );
};

export const findAffiliateUserByEmail = async (email, client = db) => {
  const rows = await client
    .select({
      id: affiliateUser.id,
      affiliateId: affiliateUser.affiliateId,
      email: affiliateUser.email,
      passwordHash: affiliateUser.passwordHash,
      isActive: affiliateUser.isActive,
      forcePasswordChange: affiliateUser.forcePasswordChange,
      tokenVersion: affiliateUser.tokenVersion,
      lastLoginAt: affiliateUser.lastLoginAt,
      tncAgreedAt: affiliateUser.tncAgreedAt,
      affiliateStatus: affiliateApplication.status,
      affiliateFullName: affiliateApplication.fullName,
    })
    .from(affiliateUser)
    .innerJoin(
      affiliateApplication,
      eq(affiliateApplication.id, affiliateUser.affiliateId),
    )
    .where(eq(affiliateUser.email, email))
    .limit(1);
  return rows[0] || null;
};

export const findAffiliateUserById = async (id, client = db) => {
  const rows = await client
    .select({
      id: affiliateUser.id,
      affiliateId: affiliateUser.affiliateId,
      email: affiliateUser.email,
      isActive: affiliateUser.isActive,
      forcePasswordChange: affiliateUser.forcePasswordChange,
      tokenVersion: affiliateUser.tokenVersion,
      affiliateStatus: affiliateApplication.status,
      fullName: affiliateApplication.fullName,
      phone: affiliateApplication.phone,
      country: affiliateApplication.country,
    })
    .from(affiliateUser)
    .innerJoin(
      affiliateApplication,
      eq(affiliateApplication.id, affiliateUser.affiliateId),
    )
    .where(eq(affiliateUser.id, id))
    .limit(1);
  return rows[0] || null;
};

export const updateAffiliateUserLoginMetadata = async (
  id,
  data,
  client = db,
) => {
  await client
    .update(affiliateUser)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(affiliateUser.id, id));
};

export const insertAffiliateLoginLog = async (payload) => {
  await db.insert(affiliateLoginLog).values(payload);
};

export const getAffiliateProfileByUserId = async (affiliateUserId) => {
  const rows = await db
    .select({
      affiliateId: affiliateApplication.id,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      phone: affiliateApplication.phone,
      country: affiliateApplication.country,
      status: affiliateApplication.status,
      strategy: affiliateApplication.strategy,
      bankName: partnerRegistrationData.bankName,
      bankAccountNumber: partnerRegistrationData.bankAccountNumber,
      bankAccountHolder: partnerRegistrationData.bankAccountHolder,
      createdAt: affiliateApplication.createdAt,
    })
    .from(affiliateUser)
    .innerJoin(
      affiliateApplication,
      eq(affiliateApplication.id, affiliateUser.affiliateId),
    )
    .leftJoin(
      partnerRegistrationData,
      eq(partnerRegistrationData.affiliateId, affiliateApplication.id),
    )
    .where(eq(affiliateUser.id, affiliateUserId))
    .limit(1);
  return rows[0] || null;
};

const buildReferralFilter = (affiliateId, from, to) => {
  const conds = [eq(affiliateReferral.affiliateId, affiliateId)];
  if (from) conds.push(gte(affiliateReferral.createdAt, from));
  if (to) conds.push(lte(affiliateReferral.createdAt, to));
  return and(...conds);
};

const buildTransactionFilter = (affiliateId, from, to) => {
  const conds = [eq(affiliateTransaction.affiliateId, affiliateId)];
  if (from) conds.push(gte(affiliateTransaction.periodEnd, from));
  if (to) conds.push(lte(affiliateTransaction.periodEnd, to));
  return and(...conds);
};

export const aggregateAffiliatePerformance = async (
  affiliateId,
  { from, to } = {},
) => {
  const where = buildReferralFilter(affiliateId, from, to);
  const [referralStats] = await db
    .select({
      totalClicks: sql`COALESCE(SUM(${affiliateReferral.clicks}), 0)`.mapWith(
        Number,
      ),
      totalSignups: sql`COALESCE(SUM(${affiliateReferral.signups}), 0)`.mapWith(
        Number,
      ),
      totalConversions:
        sql`COALESCE(SUM(${affiliateReferral.conversions}), 0)`.mapWith(Number),
      totalCommission:
        sql`COALESCE(SUM(${affiliateReferral.commissionAmount}), 0)`.mapWith(
          Number,
        ),
    })
    .from(affiliateReferral)
    .where(where);

  const [transactionStats] = await db
    .select({
      commissionPaid:
        sql`COALESCE(SUM(CASE WHEN ${affiliateTransaction.status}='paid' THEN ${affiliateTransaction.amount} ELSE 0 END), 0)`.mapWith(
          Number,
        ),
      commissionPending:
        sql`COALESCE(SUM(CASE WHEN ${affiliateTransaction.status} IN ('pending','processing') THEN ${affiliateTransaction.amount} ELSE 0 END), 0)`.mapWith(
          Number,
        ),
    })
    .from(affiliateTransaction)
    .where(buildTransactionFilter(affiliateId, from, to));

  return { ...referralStats, ...transactionStats };
};

export const listAffiliateTransactions = async ({
  affiliateId,
  page = 1,
  limit = 10,
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const [countRow] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(affiliateTransaction)
    .where(eq(affiliateTransaction.affiliateId, affiliateId));
  const total = countRow?.count ?? 0;

  const data = await db
    .select({
      id: affiliateTransaction.id,
      periodStart: affiliateTransaction.periodStart,
      periodEnd: affiliateTransaction.periodEnd,
      amount: affiliateTransaction.amount,
      status: affiliateTransaction.status,
      reference: affiliateTransaction.reference,
      paidAt: affiliateTransaction.paidAt,
      notes: affiliateTransaction.notes,
    })
    .from(affiliateTransaction)
    .where(eq(affiliateTransaction.affiliateId, affiliateId))
    .orderBy(desc(affiliateTransaction.periodEnd))
    .limit(Number(limit))
    .offset(offset);

  const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
  return { data, total, page: Number(page), limit: Number(limit), totalPages };
};

export const listAffiliateReferrals = async ({
  affiliateId,
  page = 1,
  limit = 10,
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const [countRow] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(affiliateReferral)
    .where(eq(affiliateReferral.affiliateId, affiliateId));
  const total = countRow?.count ?? 0;

  const data = await db
    .select({
      id: affiliateReferral.id,
      referralName: affiliateReferral.referralName,
      referralEmail: affiliateReferral.referralEmail,
      status: affiliateReferral.status,
      clicks: affiliateReferral.clicks,
      signups: affiliateReferral.signups,
      conversions: affiliateReferral.conversions,
      purchaseAmount: affiliateReferral.purchaseAmount,
      commissionAmount: affiliateReferral.commissionAmount,
      firstInteractionAt: affiliateReferral.firstInteractionAt,
      lastConversionAt: affiliateReferral.lastConversionAt,
    })
    .from(affiliateReferral)
    .where(eq(affiliateReferral.affiliateId, affiliateId))
    .orderBy(
      desc(affiliateReferral.lastConversionAt),
      desc(affiliateReferral.createdAt),
    )
    .limit(Number(limit))
    .offset(offset);

  const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
  return { data, total, page: Number(page), limit: Number(limit), totalPages };
};
