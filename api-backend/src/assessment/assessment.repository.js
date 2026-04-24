import { eq, and, asc, desc, sql } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
  assessmentQuestion,
  assessmentSession,
  assessmentAnswer,
  assessmentAuditLog,
  partnerRegistrationData,
  affiliateApplication,
  affiliateUser,
  affiliateBatch,
  assessmentSettings,
} from "../../drizzle/schema.js";

const DEFAULT_ASSESSMENT_SETTINGS = {
  examWaitHours: 24,
  examDurationMinutes: 60,
  screeningPassingScore: 80,
  maxExamAttempts: 2,
};

const getAssessmentSettingsColumns = async () => {
  const result = await db.execute(sql`
    SELECT COLUMN_NAME
    FROM information_schema.columns
    WHERE table_schema = DATABASE()
      AND table_name = 'assessment_settings'
  `);

  const rows = Array.isArray(result) ? result : result?.rows || [];
  return new Set(
    rows
      .map((row) => row.COLUMN_NAME || row.column_name)
      .filter(Boolean)
  );
};

const normalizeAssessmentSettingsRecord = (row = {}, columns = new Set()) => ({
  id: row.id,
  examWaitHours:
    columns.has("exam_wait_hours") && row.examWaitHours != null
      ? Number(row.examWaitHours)
      : DEFAULT_ASSESSMENT_SETTINGS.examWaitHours,
  examDurationMinutes:
    columns.has("exam_duration_minutes") && row.examDurationMinutes != null
      ? Number(row.examDurationMinutes)
      : DEFAULT_ASSESSMENT_SETTINGS.examDurationMinutes,
  screeningPassingScore:
    columns.has("screening_passing_score") && row.screeningPassingScore != null
      ? Number(row.screeningPassingScore)
      : DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore,
  maxExamAttempts:
    columns.has("max_exam_attempts") && row.maxExamAttempts != null
      ? Number(row.maxExamAttempts)
      : DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts,
  updatedAt: row.updatedAt || new Date(),
});

// Assessment Settings
export const getAssessmentSettings = async () => {
  const columns = await getAssessmentSettingsColumns();

  const [settings] = await db
    .select({
      id: assessmentSettings.id,
      examWaitHours: assessmentSettings.examWaitHours,
      examDurationMinutes: assessmentSettings.examDurationMinutes,
      screeningPassingScore: columns.has("screening_passing_score")
        ? assessmentSettings.screeningPassingScore
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore}`.as("screening_passing_score"),
      maxExamAttempts: columns.has("max_exam_attempts")
        ? assessmentSettings.maxExamAttempts
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts}`.as("max_exam_attempts"),
      updatedAt: assessmentSettings.updatedAt,
    })
    .from(assessmentSettings)
    .limit(1);

  if (settings) return normalizeAssessmentSettingsRecord(settings, columns);

  const insertPayload = {
    examWaitHours: DEFAULT_ASSESSMENT_SETTINGS.examWaitHours,
    examDurationMinutes: DEFAULT_ASSESSMENT_SETTINGS.examDurationMinutes,
    updatedAt: new Date(),
  };

  if (columns.has("screening_passing_score")) {
    insertPayload.screeningPassingScore = DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore;
  }

  if (columns.has("max_exam_attempts")) {
    insertPayload.maxExamAttempts = DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts;
  }

  await db.insert(assessmentSettings).values(insertPayload);

  const [created] = await db
    .select({
      id: assessmentSettings.id,
      examWaitHours: assessmentSettings.examWaitHours,
      examDurationMinutes: assessmentSettings.examDurationMinutes,
      screeningPassingScore: columns.has("screening_passing_score")
        ? assessmentSettings.screeningPassingScore
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore}`.as("screening_passing_score"),
      maxExamAttempts: columns.has("max_exam_attempts")
        ? assessmentSettings.maxExamAttempts
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts}`.as("max_exam_attempts"),
      updatedAt: assessmentSettings.updatedAt,
    })
    .from(assessmentSettings)
    .limit(1);

  return normalizeAssessmentSettingsRecord(created, columns);
};

export const updateAssessmentSettings = async (id, payload) => {
  const columns = await getAssessmentSettingsColumns();
  const [existing] = await db
    .select()
    .from(assessmentSettings)
    .where(eq(assessmentSettings.id, id))
    .limit(1);

  const nextPayload = {
    updatedAt: new Date(),
  };

  if (payload.examWaitHours !== undefined) {
    nextPayload.examWaitHours = payload.examWaitHours;
  }

  if (payload.examDurationMinutes !== undefined) {
    nextPayload.examDurationMinutes = payload.examDurationMinutes;
  }

  if (columns.has("screening_passing_score") && payload.screeningPassingScore !== undefined) {
    nextPayload.screeningPassingScore = payload.screeningPassingScore;
  }

  if (columns.has("max_exam_attempts") && payload.maxExamAttempts !== undefined) {
    nextPayload.maxExamAttempts = payload.maxExamAttempts;
  }

  if (!existing) {
    const insertPayload = {
      id,
      examWaitHours: payload.examWaitHours ?? DEFAULT_ASSESSMENT_SETTINGS.examWaitHours,
      examDurationMinutes: payload.examDurationMinutes ?? DEFAULT_ASSESSMENT_SETTINGS.examDurationMinutes,
      updatedAt: new Date(),
    };

    if (columns.has("screening_passing_score")) {
      insertPayload.screeningPassingScore =
        payload.screeningPassingScore ?? DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore;
    }

    if (columns.has("max_exam_attempts")) {
      insertPayload.maxExamAttempts =
        payload.maxExamAttempts ?? DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts;
    }

    await db.insert(assessmentSettings).values(insertPayload);
  } else {
    await db
      .update(assessmentSettings)
      .set(nextPayload)
      .where(eq(assessmentSettings.id, id));
  }

  const [updated] = await db
    .select({
      id: assessmentSettings.id,
      examWaitHours: assessmentSettings.examWaitHours,
      examDurationMinutes: assessmentSettings.examDurationMinutes,
      screeningPassingScore: columns.has("screening_passing_score")
        ? assessmentSettings.screeningPassingScore
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.screeningPassingScore}`.as("screening_passing_score"),
      maxExamAttempts: columns.has("max_exam_attempts")
        ? assessmentSettings.maxExamAttempts
        : sql`${DEFAULT_ASSESSMENT_SETTINGS.maxExamAttempts}`.as("max_exam_attempts"),
      updatedAt: assessmentSettings.updatedAt,
    })
    .from(assessmentSettings)
    .where(eq(assessmentSettings.id, id))
    .limit(1);

  return normalizeAssessmentSettingsRecord(updated, columns);
};

// Assessment Question Repository
export const createAssessmentQuestion = async (payload) => {
  const [result] = await db.insert(assessmentQuestion).values(payload).$returningId();
  return result;
};

export const getAssessmentQuestions = async ({ type, isActive = true }) => {
  const conditions = [];
  if (type) conditions.push(eq(assessmentQuestion.questionType, type));
  if (isActive !== undefined) conditions.push(eq(assessmentQuestion.isActive, isActive));
  
  return db
    .select()
    .from(assessmentQuestion)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(asc(assessmentQuestion.orderIndex));
};

export const getAssessmentQuestionById = async (id) => {
  const [result] = await db
    .select()
    .from(assessmentQuestion)
    .where(eq(assessmentQuestion.id, id))
    .limit(1);
  return result;
};

export const updateAssessmentQuestion = async (id, payload) => {
  await db
    .update(assessmentQuestion)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(assessmentQuestion.id, id));
};

export const deleteAssessmentQuestion = async (id) => {
  await db.delete(assessmentQuestion).where(eq(assessmentQuestion.id, id));
};

export const reorderAssessmentQuestions = async (questionOrders) => {
  for (const { id, orderIndex } of questionOrders) {
    await db
      .update(assessmentQuestion)
      .set({ orderIndex, updatedAt: new Date() })
      .where(eq(assessmentQuestion.id, id));
  }
};

// Assessment Session Repository
export const createAssessmentSession = async (payload) => {
  const [result] = await db.insert(assessmentSession).values(payload).$returningId();
  return result;
};

export const getAssessmentSessionByAffiliateId = async (affiliateId) => {
  const [result] = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.affiliateId, affiliateId))
    .limit(1);
  return result;
};

export const getAssessmentSessionById = async (id) => {
  const [result] = await db
    .select({
      ...assessmentSession,
      // Include all session fields
    })
    .from(assessmentSession)
    .where(eq(assessmentSession.id, id))
    .limit(1);
  return result;
};

export const getAssessmentSessionsWithAffiliate = async ({ page = 1, limit = 10, status }) => {
  const offset = (Number(page) - 1) * Number(limit);
  const conditions = [];
  if (status) conditions.push(eq(assessmentSession.status, status));
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  const sessions = await db
    .select({
      id: assessmentSession.id,
      status: assessmentSession.status,
      totalScore: assessmentSession.totalScore,
      maxScore: assessmentSession.maxScore,
      percentage: assessmentSession.percentage,
      isPassed: assessmentSession.isPassed,
      startedAt: assessmentSession.startedAt,
      submittedAt: assessmentSession.submittedAt,
      scoredAt: assessmentSession.scoredAt,
      passingPercentage: assessmentSession.passingPercentage,
      reviewerNotes: assessmentSession.reviewerNotes,
      createdAt: assessmentSession.createdAt,
      // Security fields
      totalDurationSeconds: assessmentSession.totalDurationSeconds,
      ipAddress: assessmentSession.ipAddress,
      userAgent: assessmentSession.userAgent,
      submitIpAddress: assessmentSession.submitIpAddress,
      submitUserAgent: assessmentSession.submitUserAgent,
      browserFingerprint: assessmentSession.browserFingerprint,
      tabSwitchCount: assessmentSession.tabSwitchCount,
      securityFlags: assessmentSession.securityFlags,
      securityRiskScore: assessmentSession.securityRiskScore,
      securityRiskLevel: assessmentSession.securityRiskLevel,
      securitySummary: assessmentSession.securitySummary,
      securityAnalysisJson: assessmentSession.securityAnalysisJson,
      securityReviewRequired: assessmentSession.securityReviewRequired,
      answerIntegrityVerified: assessmentSession.answerIntegrityVerified,
      // Affiliate data
      affiliateId: affiliateApplication.id,
      affiliateFullName: affiliateApplication.fullName,
      affiliateEmail: affiliateApplication.email,
      affiliatePhone: affiliateApplication.phone,
      affiliateCountry: affiliateApplication.country,
      affiliateStatus: affiliateApplication.status,
      // Batch data
      affiliateBatchName: affiliateBatch.name,
    })
    .from(assessmentSession)
    .leftJoin(affiliateApplication, eq(assessmentSession.affiliateId, affiliateApplication.id))
    .leftJoin(affiliateBatch, eq(affiliateApplication.batchId, affiliateBatch.id))
    .where(whereClause)
    .orderBy(desc(assessmentSession.createdAt))
    .limit(Number(limit))
    .offset(offset);
  
  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(assessmentSession)
    .where(whereClause);
  
  return {
    data: sessions,
    total: count || 0,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil((count || 0) / Number(limit)),
  };
};

export const updateAssessmentSession = async (id, payload) => {
  await db
    .update(assessmentSession)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(assessmentSession.id, id));
};

export const deleteAssessmentSession = async (id) => {
  await db.delete(assessmentSession).where(eq(assessmentSession.id, id));
};

export const deleteAssessmentAnswersBySessionId = async (sessionId) => {
  await db.delete(assessmentAnswer).where(eq(assessmentAnswer.sessionId, sessionId));
};

export const deleteAssessmentAuditLogsBySessionId = async (sessionId) => {
  await db.delete(assessmentAuditLog).where(eq(assessmentAuditLog.sessionId, sessionId));
};

// Assessment Answer Repository
export const createAssessmentAnswer = async (payload) => {
  const [result] = await db.insert(assessmentAnswer).values(payload).$returningId();
  return result;
};

export const getAssessmentAnswersBySessionId = async (sessionId) => {
  return db
    .select({
      id: assessmentAnswer.id,
      questionId: assessmentAnswer.questionId,
      questionType: assessmentAnswer.questionType,
      videoUrl: assessmentAnswer.videoUrl,
      selectedOption: assessmentAnswer.selectedOption,
      essayAnswer: assessmentAnswer.essayAnswer,
      score: assessmentAnswer.score,
      maxScore: assessmentAnswer.maxScore,
      reviewerScore: assessmentAnswer.reviewerScore,
      reviewerFeedback: assessmentAnswer.reviewerFeedback,
      isCorrect: assessmentAnswer.isCorrect,
      answeredAt: assessmentAnswer.answeredAt,
      createdAt: assessmentAnswer.createdAt,
      // Question data
      question: assessmentQuestion.question,
      questionType: assessmentQuestion.questionType,
      questionOptions: assessmentQuestion.options,
      correctAnswer: assessmentQuestion.correctAnswer,
      questionPoints: assessmentQuestion.points,
      videoInstructions: assessmentQuestion.videoInstructions,
      orderIndex: assessmentQuestion.orderIndex,
    })
    .from(assessmentAnswer)
    .leftJoin(assessmentQuestion, eq(assessmentAnswer.questionId, assessmentQuestion.id))
    .where(eq(assessmentAnswer.sessionId, sessionId))
    .orderBy(asc(assessmentQuestion.orderIndex));
};

export const getAssessmentAnswerBySessionAndQuestion = async (sessionId, questionId) => {
  const [result] = await db
    .select()
    .from(assessmentAnswer)
    .where(and(
      eq(assessmentAnswer.sessionId, sessionId),
      eq(assessmentAnswer.questionId, questionId)
    ))
    .limit(1);
  return result;
};

export const updateAssessmentAnswer = async (id, payload) => {
  await db
    .update(assessmentAnswer)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(assessmentAnswer.id, id));
};

export const upsertAssessmentAnswer = async (sessionId, questionId, payload) => {
  const existing = await getAssessmentAnswerBySessionAndQuestion(sessionId, questionId);
  
  if (existing) {
    await db
      .update(assessmentAnswer)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(assessmentAnswer.id, existing.id));
    return existing.id;
  } else {
    const [result] = await db
      .insert(assessmentAnswer)
      .values({ sessionId, questionId, ...payload })
      .$returningId();
    return result;
  }
};

// Partner Registration Data Repository
export const createPartnerRegistrationData = async (payload) => {
  const [result] = await db.insert(partnerRegistrationData).values(payload).$returningId();
  return result;
};

export const getPartnerRegistrationDataByAffiliateId = async (affiliateId) => {
  const [result] = await db
    .select()
    .from(partnerRegistrationData)
    .where(eq(partnerRegistrationData.affiliateId, affiliateId))
    .limit(1);
  return result;
};

export const updatePartnerRegistrationData = async (affiliateId, payload) => {
  const existing = await getPartnerRegistrationDataByAffiliateId(affiliateId);
  
  if (existing) {
    await db
      .update(partnerRegistrationData)
      .set({ ...payload, updatedAt: new Date() })
      .where(eq(partnerRegistrationData.affiliateId, affiliateId));
    return existing.id;
  } else {
    const [result] = await db
      .insert(partnerRegistrationData)
      .values({ affiliateId, ...payload })
      .$returningId();
    return result;
  }
};

// Get full affiliate data with registration and session
export const getAffiliateWithAssessment = async (affiliateId) => {
  const [affiliate] = await db
    .select()
    .from(affiliateApplication)
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);
  
  if (!affiliate) return null;
  
  const registration = await getPartnerRegistrationDataByAffiliateId(affiliateId);
  const session = await getAssessmentSessionByAffiliateId(affiliateId);
  const answers = session ? await getAssessmentAnswersBySessionId(session.id) : [];
  
  return {
    affiliate,
    registration,
    session,
    answers,
  };
};

// Update affiliate status based on assessment result
export const updateAffiliateStatusByAssessment = async (affiliateId, isPassed) => {
  const newStatus = isPassed ? "approved" : "rejected";
  await db
    .update(affiliateApplication)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(affiliateApplication.id, affiliateId));
  
  // Also create affiliate user if passed
  if (isPassed) {
    const affiliate = await db
      .select()
      .from(affiliateApplication)
      .where(eq(affiliateApplication.id, affiliateId))
      .limit(1);
    
    if (affiliate && affiliate[0]) {
      const existingUser = await db
        .select()
        .from(affiliateUser)
        .where(eq(affiliateUser.affiliateId, affiliateId))
        .limit(1);
      
      if (!existingUser.length) {
        // User will be created in the service layer with auto-generated password
        return { needsUserCreation: true };
      }
    }
  }
  
  return { needsUserCreation: false };
};
