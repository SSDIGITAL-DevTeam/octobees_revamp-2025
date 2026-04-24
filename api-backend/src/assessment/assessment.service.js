import {
  createAssessmentQuestion,
  getAssessmentQuestions,
  getAssessmentQuestionById,
  updateAssessmentQuestion,
  deleteAssessmentQuestion,
  reorderAssessmentQuestions,
  createAssessmentSession,
  getAssessmentSessionByAffiliateId,
  getAssessmentSessionById,
  getAssessmentSessionsWithAffiliate,
  updateAssessmentSession,
  deleteAssessmentSession,
  createAssessmentAnswer,
  getAssessmentAnswersBySessionId,
  upsertAssessmentAnswer,
  getPartnerRegistrationDataByAffiliateId,
  updatePartnerRegistrationData,
  createPartnerRegistrationData,
  getAffiliateWithAssessment,
  getAssessmentSettings as getAssessmentSettingsRepo,
  updateAssessmentSettings as updateAssessmentSettingsRepo
} from "./assessment.repository.js";
import { findAffiliateById } from "../affiliate/affiliate.repository.js";
import { sendAssessmentResultEmail } from "../email/email.service.js";
import { db } from "../../drizzle/db.js";
import {
  affiliateApplication,
  assessmentSession,
  assessmentAnswer,
  assessmentAuditLog,
  affiliatePasswordToken,
  affiliateLoginLog,
  partnerLead,
  partnerCommission,
  affiliateReferral,
  affiliateTransaction,
} from "../../drizzle/schema.js";
import { eq, inArray } from "drizzle-orm";
import logger from "../../utils/logger.js";
import { getBatchById } from "../affiliate-batch/batch.repository.js";

const VALID_QUESTION_TYPES = new Set(["video_introduction", "multiple_choice", "essay"]);
const MULTIPLE_CHOICE_OPTION_LIMIT = {
  min: 2,
  max: 6,
};

const serializeAssessmentQuestion = (question) => {
  if (!question) return null;

  let parsedOptions = question.options ?? null;
  if (typeof parsedOptions === "string") {
    try {
      parsedOptions = JSON.parse(parsedOptions);
    } catch {
      parsedOptions = null;
    }
  }

  const normalizedType = question.questionType || question.type;

  return {
    ...question,
    type: normalizedType,
    questionType: normalizedType,
    options: parsedOptions,
  };
};

const normalizeQuestionPayload = (payload = {}, existingQuestion = null) => {
  const normalizedType =
    payload.questionType ||
    payload.type ||
    existingQuestion?.questionType ||
    existingQuestion?.type;

  if (!VALID_QUESTION_TYPES.has(normalizedType)) {
    throw new Error("Invalid question type");
  }

  const baseOptions =
    payload.options !== undefined
      ? payload.options
      : existingQuestion?.options ?? null;

  const normalizedOptions =
    normalizedType === "multiple_choice"
      ? baseOptions == null
        ? null
        : typeof baseOptions === "string"
          ? baseOptions
          : JSON.stringify(baseOptions)
      : null;

  return {
    questionType: normalizedType,
    question: payload.question ?? existingQuestion?.question,
    options: normalizedOptions,
    correctAnswer:
      payload.correctAnswer !== undefined
        ? payload.correctAnswer
        : existingQuestion?.correctAnswer ?? null,
    points: payload.points ?? existingQuestion?.points,
    orderIndex: payload.orderIndex ?? existingQuestion?.orderIndex,
    isRequired: payload.isRequired ?? existingQuestion?.isRequired,
    videoInstructions:
      normalizedType === "video_introduction"
        ? payload.videoInstructions ?? existingQuestion?.videoInstructions ?? null
        : null,
    isActive: payload.isActive ?? existingQuestion?.isActive,
  };
};

const parseMultipleChoiceOptions = (options) => {
  if (options == null) return null;
  return typeof options === "string" ? JSON.parse(options) : options;
};

const validateMultipleChoiceOptions = (options) => {
  if (!Array.isArray(options)) {
    throw new Error("Multiple choice questions require options");
  }

  if (options.length < MULTIPLE_CHOICE_OPTION_LIMIT.min) {
    throw new Error(
      `Multiple choice questions require at least ${MULTIPLE_CHOICE_OPTION_LIMIT.min} options`,
    );
  }

  if (options.length > MULTIPLE_CHOICE_OPTION_LIMIT.max) {
    throw new Error(
      `Multiple choice questions allow a maximum of ${MULTIPLE_CHOICE_OPTION_LIMIT.max} options`,
    );
  }

  const hasBlankOption = options.some(
    (option) => !option || typeof option.label !== "string" || !option.label.trim(),
  );
  if (hasBlankOption) {
    throw new Error("Multiple choice options cannot be empty");
  }
};

const getExamPassingScoreForAffiliate = async (affiliate) => {
  if (!affiliate?.batchId) return 70;

  const batch = await getBatchById(affiliate.batchId);
  return Number(batch?.examPassingScore || 70);
};

// Assessment Settings
export const getAssessmentSettings = async () => {
  return getAssessmentSettingsRepo();
};

export const updateAssessmentSettings = async (id, payload) => {
  const examWaitHours = Number(payload.examWaitHours);
  const examDurationMinutes = Number(payload.examDurationMinutes);
  const screeningPassingScore = Number(payload.screeningPassingScore);
  const maxExamAttempts = Number(payload.maxExamAttempts);

  if (!Number.isFinite(examWaitHours) || examWaitHours < 1) {
    throw new Error("Exam wait hours must be at least 1");
  }

  if (!Number.isFinite(examDurationMinutes) || examDurationMinutes < 1) {
    throw new Error("Exam duration minutes must be at least 1");
  }

  if (!Number.isFinite(screeningPassingScore) || screeningPassingScore < 1 || screeningPassingScore > 100) {
    throw new Error("Screening passing score must be between 1 and 100");
  }

  if (!Number.isFinite(maxExamAttempts) || maxExamAttempts < 1 || maxExamAttempts > 10) {
    throw new Error("Max exam attempts must be between 1 and 10");
  }

  return updateAssessmentSettingsRepo(id, payload);
};

// Assessment Question Service
export const createQuestion = async (payload) => {
  const normalizedPayload = normalizeQuestionPayload(payload);

  // Validate multiple choice has options
  if (normalizedPayload.questionType === "multiple_choice") {
    const options = parseMultipleChoiceOptions(normalizedPayload.options);
    validateMultipleChoiceOptions(options);
  }
  
  // Validate correct answer format
  if (normalizedPayload.questionType === "multiple_choice" && normalizedPayload.correctAnswer) {
    const options = parseMultipleChoiceOptions(normalizedPayload.options);
    const validValues = options.map((o) => o.value);
    if (!validValues.includes(normalizedPayload.correctAnswer)) {
      throw new Error("Correct answer must match one of the option values");
    }
  }
  
  const created = await createAssessmentQuestion(normalizedPayload);
  const question = await getAssessmentQuestionById(created.id);
  return serializeAssessmentQuestion(question);
};

export const listQuestions = async (filters = {}) => {
  const questions = await getAssessmentQuestions(filters);
  return questions.map(serializeAssessmentQuestion);
};

export const getQuestion = async (id) => {
  const question = await getAssessmentQuestionById(id);
  if (!question) throw new Error("Question not found");
  return serializeAssessmentQuestion(question);
};

export const editQuestion = async (id, payload) => {
  const question = await getAssessmentQuestionById(id);
  if (!question) throw new Error("Question not found");
  const normalizedPayload = normalizeQuestionPayload(payload, question);

  if (normalizedPayload.questionType === "multiple_choice") {
    const options = parseMultipleChoiceOptions(normalizedPayload.options);
    validateMultipleChoiceOptions(options);
  }
  
  // Validate correct answer for multiple choice
  if (
    normalizedPayload.questionType === "multiple_choice" ||
    (normalizedPayload.options && normalizedPayload.correctAnswer !== undefined)
  ) {
    if (normalizedPayload.correctAnswer) {
      const options = parseMultipleChoiceOptions(
        normalizedPayload.options || question.options,
      );
      const validValues = options.map((o) => o.value);
      if (!validValues.includes(normalizedPayload.correctAnswer)) {
        throw new Error("Correct answer must match one of the option values");
      }
    }
  }
  
  await updateAssessmentQuestion(id, normalizedPayload);
  return getQuestion(id);
};

export const removeQuestion = async (id) => {
  const question = await getAssessmentQuestionById(id);
  if (!question) throw new Error("Question not found");
  await deleteAssessmentQuestion(id);
  return { success: true };
};

export const reorderQuestions = async (questionOrders) => {
  await reorderAssessmentQuestions(questionOrders);
  return { success: true };
};

// Assessment Session Service
export const startAssessment = async (affiliateId) => {
  // Check if affiliate exists
  const affiliate = await findAffiliateById(affiliateId);
  if (!affiliate) throw new Error("Affiliate application not found");
  
  // Check if session already exists
  const existingSession = await getAssessmentSessionByAffiliateId(affiliateId);
  if (existingSession && existingSession.status !== "not_started") {
    // Return existing session for continuing
    if (["in_progress", "submitted", "scored"].includes(existingSession.status)) {
      return existingSession;
    }
  }
  
  // Get all active questions to calculate max score
  const questions = await getAssessmentQuestions({ isActive: true });
  const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
  const passingPercentage = await getExamPassingScoreForAffiliate(affiliate);
  
  // Create new session
  const session = await createAssessmentSession({
    affiliateId,
    status: "in_progress",
    startedAt: new Date(),
    maxScore,
    passingPercentage,
  });
  
  return session;
};

export const getSession = async (sessionId) => {
  const session = await getAssessmentSessionById(sessionId);
  if (!session) throw new Error("Assessment session not found");
  
  // Get full details
  const details = await getAffiliateWithAssessment(session.affiliateId);
  return details;
};

export const getSessionByAffiliate = async (affiliateId) => {
  const session = await getAssessmentSessionByAffiliateId(affiliateId);
  if (!session) return null;
  
  const details = await getAffiliateWithAssessment(affiliateId);
  return details;
};

export const listSessions = async (filters = {}) => {
  return getAssessmentSessionsWithAffiliate(filters);
};

export const removeSessionSubmission = async (sessionId) => {
  const session = await getAssessmentSessionById(sessionId);
  if (!session) throw new Error("Assessment session not found");

  await deleteAssessmentSession(sessionId);
  return { success: true };
};

export const resetSessionSubmission = async (sessionId) => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Reset submission is only available in development mode");
  }

  const session = await getAssessmentSessionById(sessionId);
  if (!session) throw new Error("Assessment session not found");

  const resetExpiresAt = new Date(
    Date.now() + (Number(process.env.EXAM_EXPIRY_HOURS) || 48) * 60 * 60 * 1000
  );

  await db.transaction(async (tx) => {
    const affiliateUsers = await tx
      .select({ id: affiliateUser.id })
      .from(affiliateUser)
      .where(eq(affiliateUser.affiliateId, session.affiliateId));

    const affiliateUserIds = affiliateUsers.map((user) => user.id);

    if (affiliateUserIds.length > 0) {
      await tx
        .delete(affiliatePasswordToken)
        .where(inArray(affiliatePasswordToken.affiliateUserId, affiliateUserIds));
      await tx
        .delete(affiliateLoginLog)
        .where(inArray(affiliateLoginLog.affiliateUserId, affiliateUserIds));
    }

    await tx.delete(partnerCommission).where(eq(partnerCommission.affiliateId, session.affiliateId));
    await tx.delete(partnerLead).where(eq(partnerLead.affiliateId, session.affiliateId));
    await tx.delete(affiliateReferral).where(eq(affiliateReferral.affiliateId, session.affiliateId));
    await tx.delete(affiliateTransaction).where(eq(affiliateTransaction.affiliateId, session.affiliateId));
    await tx.delete(affiliateUser).where(eq(affiliateUser.affiliateId, session.affiliateId));

    await tx.delete(assessmentAnswer).where(eq(assessmentAnswer.sessionId, sessionId));
    await tx.delete(assessmentAuditLog).where(eq(assessmentAuditLog.sessionId, sessionId));

    await tx
      .update(assessmentSession)
      .set({
        status: "not_started",
        tokenUsedAt: null,
        tokenInvalidated: false,
        expiresAt: resetExpiresAt,
        startedAt: null,
        submittedAt: null,
        scoredAt: null,
        totalDurationSeconds: null,
        totalScore: 0,
        percentage: 0,
        reviewerId: null,
        reviewerNotes: null,
        isPassed: null,
        aiExamRecommendation: null,
        aiExamSummary: null,
        aiExamStrengths: null,
        aiExamWeaknesses: null,
        aiExamDecisionRationale: null,
        aiExamAnalysisJson: null,
        aiExamCompletedAt: null,
        aiFinalRecommendation: null,
        aiFinalSummary: null,
        aiFinalStrengths: null,
        aiFinalWeaknesses: null,
        aiFinalDecisionRationale: null,
        aiFinalAnalysisJson: null,
        aiFinalCompletedAt: null,
        ipAddress: null,
        userAgent: null,
        submitIpAddress: null,
        submitUserAgent: null,
        browserFingerprint: null,
        tabSwitchCount: 0,
        timePerQuestion: null,
        answerHash: null,
        answerIntegrityVerified: false,
        securityFlags: null,
        securityRiskScore: 0,
        securityRiskLevel: "low",
        securitySummary: null,
        securityAnalysisJson: null,
        securityReviewRequired: false,
        interviewStatus: "not_started",
        interviewSubmittedLink: null,
        interviewSubmittedAt: null,
        interviewInvitationSentAt: null,
        trainingInvitationSentAt: null,
        trainingStatus: "not_started",
        trainingCompletedAt: null,
        trainingEmbedViewed: false,
        trainingVideoCompleted: false,
        trainingPdfPagesViewed: null,
        trainingAgreementAccepted: false,
        examMustCompleteBy: null,
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, sessionId));

    await tx
      .update(affiliateApplication)
      .set({
        status: "qualified",
        updatedAt: new Date(),
      })
      .where(eq(affiliateApplication.id, session.affiliateId));
  });

  return getSession(sessionId);
};

export const submitAssessment = async (sessionId) => {
  const session = await getAssessmentSessionById(sessionId);
  if (!session) throw new Error("Assessment session not found");
  if (session.status === "submitted" || session.status === "scored") {
    throw new Error("Assessment already submitted");
  }
  
  // Get all questions and answers
  const questions = await getAssessmentQuestions({ isActive: true });
  const answers = await getAssessmentAnswersBySessionId(sessionId);
  
  // Check if all required questions are answered
  const requiredQuestions = questions.filter((q) => q.isRequired);
  const answeredQuestionIds = answers.map((a) => a.questionId);
  
  for (const q of requiredQuestions) {
    if (!answeredQuestionIds.includes(q.id)) {
      throw new Error(`Required question not answered: ${q.question.substring(0, 50)}...`);
    }
  }
  
  // Calculate auto-score for multiple choice
  let totalAutoScore = 0;
  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    
    if (question.type === "multiple_choice") {
      const isCorrect = answer.selectedOption === question.correctAnswer;
      const score = isCorrect ? question.points : 0;
      const reviewerScore = null; // Will be scored manually for essay/video
      
      await updateAssessmentAnswer(answer.id, {
        score,
        maxScore: question.points,
        isCorrect,
        answeredAt: new Date(),
      });
      
      totalAutoScore += score;
    } else {
      // Video and essay need manual scoring
      await updateAssessmentAnswer(answer.id, {
        maxScore: question.points,
        answeredAt: new Date(),
      });
    }
  }
  
  // Update session status
  await updateAssessmentSession(sessionId, {
    status: "submitted",
    submittedAt: new Date(),
    totalScore: totalAutoScore,
    // percentage will be calculated after manual scoring
  });
  
  return getSession(sessionId);
};

// Admin Scoring
export const scoreAssessment = async (sessionId, scores, reviewerId, reviewerNotes) => {
  const session = await getAssessmentSessionById(sessionId);
  if (!session) throw new Error("Assessment session not found");
  if (session.status !== "submitted") {
    throw new Error("Can only score submitted assessments");
  }
  
  const questions = await getAssessmentQuestions({ isActive: true });
  const answers = await getAssessmentAnswersBySessionId(sessionId);
  
  let totalScore = 0;
  
  for (const scoreData of scores) {
    const { answerId, score, feedback } = scoreData;
    const answer = answers.find((a) => a.id === answerId);
    const question = questions.find((q) => q.id === answer?.questionId);
    
    if (!answer || !question) continue;
    
    // Validate score doesn't exceed max
    const maxScore = question.points;
    const finalScore = Math.min(score, maxScore);
    
    await updateAssessmentAnswer(answer.id, {
      reviewerScore: finalScore,
      reviewerFeedback: feedback,
    });
    
    // For multiple choice, use auto score; for essay/video, use reviewer score
    if (question.type === "multiple_choice") {
      totalScore += answer.score || 0;
    } else {
      totalScore += finalScore;
    }
  }
  
  // Calculate percentage
  const percentage = session.maxScore > 0 ? (totalScore / session.maxScore) * 100 : 0;
  const isPassed = percentage >= session.passingPercentage;
  
  // Update session
  await updateAssessmentSession(sessionId, {
    status: isPassed ? "passed" : "failed",
    scoredAt: new Date(),
    totalScore,
    percentage,
    isPassed,
    reviewerId,
    reviewerNotes,
  });
  
  // Get full details for email
  const details = await getAffiliateWithAssessment(session.affiliateId);
  
  // Send result email
  try {
    await sendAssessmentResultEmail(details, {
      isPassed,
      totalScore,
      maxScore: session.maxScore,
      percentage,
      passingPercentage: session.passingPercentage,
      reviewerNotes,
    });
  } catch (emailError) {
    logger.error("Failed to send assessment result email:", emailError);
    // Don't throw - assessment was successful even if email failed
  }
  
  return getSession(sessionId);
};

// Partner Registration Data Service
export const saveRegistrationData = async (affiliateId, payload) => {
  const affiliate = await findAffiliateById(affiliateId);
  if (!affiliate) throw new Error("Affiliate application not found");
  
  const existing = await getPartnerRegistrationDataByAffiliateId(affiliateId);
  
  if (existing) {
    await updatePartnerRegistrationData(affiliateId, {
      ...payload,
      updatedAt: new Date(),
    });
  } else {
    await createPartnerRegistrationData({
      affiliateId,
      ...payload,
    });
  }
  
  return getPartnerRegistrationDataByAffiliateId(affiliateId);
};

export const getRegistrationData = async (affiliateId) => {
  return getPartnerRegistrationDataByAffiliateId(affiliateId);
};

export const regenerateAiReview = async (affiliateId, phase = "all") => {
  const affiliate = await findAffiliateById(affiliateId);
  if (!affiliate) throw new Error("Affiliate application not found");

  const normalizedPhase = String(phase || "all").toLowerCase();
  if (!["initial", "exam", "final", "all"].includes(normalizedPhase)) {
    throw new Error("Invalid AI review phase");
  }

  const result = {
    phase: normalizedPhase,
    initial: null,
    exam: null,
    final: null,
  };

  const [session] = await db
    .select()
    .from(assessmentSession)
    .where(eq(assessmentSession.affiliateId, affiliateId))
    .limit(1);

  if (normalizedPhase === "initial" || normalizedPhase === "all") {
    const { analyzeApplicantWithAI } = await import("./ai-screening.service.js");
    const score = await analyzeApplicantWithAI(affiliateId);
    const settings = await getAssessmentSettingsRepo();

    await db
      .update(affiliateApplication)
      .set({
        screeningScore: score.percentage,
        screeningPassingScore: Number(settings?.screeningPassingScore || 80),
        screeningRecommendation: score.recommendation || null,
        screeningSummary: score.summary || null,
        screeningStrengths: JSON.stringify(score.strengths || []),
        screeningWeaknesses: JSON.stringify(score.weaknesses || []),
        screeningAnalysisJson: JSON.stringify(score.analysisJson || {}),
        screeningCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(affiliateApplication.id, affiliateId));

    result.initial = score;
  }

  if ((normalizedPhase === "exam" || normalizedPhase === "final" || normalizedPhase === "all") && !session) {
    throw new Error("Assessment session not found for this candidate");
  }

  let latestExamAnalysis = null;

  if (normalizedPhase === "exam" || normalizedPhase === "all") {
    const { evaluateExamPhaseWithAI } = await import("./ai-assessment-evaluation.service.js");
    latestExamAnalysis = await evaluateExamPhaseWithAI(session.id);

    await db
      .update(assessmentSession)
      .set({
        aiExamRecommendation: latestExamAnalysis.recommendation || null,
        aiExamSummary: latestExamAnalysis.summary || null,
        aiExamStrengths: JSON.stringify(latestExamAnalysis.strengths || []),
        aiExamWeaknesses: JSON.stringify(latestExamAnalysis.weaknesses || []),
        aiExamDecisionRationale: latestExamAnalysis.decisionRationale || null,
        aiExamAnalysisJson: JSON.stringify({
          provider: latestExamAnalysis.provider,
          ...latestExamAnalysis.analysisJson,
        }),
        aiExamCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, session.id));

    result.exam = latestExamAnalysis;
  }

  if (normalizedPhase === "final" || normalizedPhase === "all") {
    const { compileFinalAssessmentDecision, evaluateExamPhaseWithAI } = await import("./ai-assessment-evaluation.service.js");

    if (!latestExamAnalysis) {
      latestExamAnalysis = await evaluateExamPhaseWithAI(session.id);

      await db
        .update(assessmentSession)
        .set({
          aiExamRecommendation: latestExamAnalysis.recommendation || null,
          aiExamSummary: latestExamAnalysis.summary || null,
          aiExamStrengths: JSON.stringify(latestExamAnalysis.strengths || []),
          aiExamWeaknesses: JSON.stringify(latestExamAnalysis.weaknesses || []),
          aiExamDecisionRationale: latestExamAnalysis.decisionRationale || null,
          aiExamAnalysisJson: JSON.stringify({
            provider: latestExamAnalysis.provider,
            ...latestExamAnalysis.analysisJson,
          }),
          aiExamCompletedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(assessmentSession.id, session.id));
    }

    const finalAnalysis = await compileFinalAssessmentDecision(affiliateId, latestExamAnalysis, {
      percentage: session.percentage,
      totalScore: session.totalScore,
      maxScore: session.maxScore,
      status: session.status,
    });

    await db
      .update(assessmentSession)
      .set({
        aiFinalRecommendation: finalAnalysis.recommendation || null,
        aiFinalSummary: finalAnalysis.summary || null,
        aiFinalStrengths: JSON.stringify(finalAnalysis.strengths || []),
        aiFinalWeaknesses: JSON.stringify(finalAnalysis.weaknesses || []),
        aiFinalDecisionRationale: finalAnalysis.decisionRationale || null,
        aiFinalAnalysisJson: JSON.stringify({
          provider: finalAnalysis.provider,
          ...finalAnalysis.analysisJson,
        }),
        aiFinalCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, session.id));

    result.final = finalAnalysis;
  }

  return result;
};

// Get assessment questions for user (without correct answers)
export const getAssessmentForUser = async (affiliateId) => {
  const session = await getAssessmentSessionByAffiliateId(affiliateId);
  if (!session) {
    // Auto-create session if not exists
    return startAssessment(affiliateId);
  }
  
  const questions = await getAssessmentQuestions({ isActive: true });
  const answers = session.id ? await getAssessmentAnswersBySessionId(session.id) : [];
  
  // Remove correct answers from questions for user
  const questionsForUser = questions.map((q) => ({
    id: q.id,
    type: q.type,
    question: q.question,
    options: q.options,
    points: q.points,
    isRequired: q.isRequired,
    videoInstructions: q.videoInstructions,
    orderIndex: q.orderIndex,
  }));
  
  // Map existing answers
  const answersMap = answers.reduce((acc, a) => {
    acc[a.questionId] = {
      id: a.id,
      videoUrl: a.videoUrl,
      selectedOption: a.selectedOption,
      essayAnswer: a.essayAnswer,
    };
    return acc;
  }, {});
  
  return {
    session,
    questions: questionsForUser,
    answers: answersMap,
  };
};

// Submit individual answer
export const submitAnswer = async (affiliateId, questionId, answerData) => {
  const session = await getAssessmentSessionByAffiliateId(affiliateId);
  if (!session) throw new Error("Assessment session not found");
  if (session.status === "submitted" || session.status === "passed" || session.status === "failed") {
    throw new Error("Cannot modify submitted assessment");
  }
  
  const question = await getAssessmentQuestionById(questionId);
  if (!question) throw new Error("Question not found");
  
  // Validate answer based on type
  if (question.type === "video_introduction" && !answerData.videoUrl) {
    throw new Error("Video URL is required for video introduction");
  }
  if (question.type === "multiple_choice" && !answerData.selectedOption) {
    throw new Error("Please select an option");
  }
  if (question.type === "essay" && (!answerData.essayAnswer || answerData.essayAnswer.trim().length < 10)) {
    throw new Error("Essay answer must be at least 10 characters");
  }
  
  await upsertAssessmentAnswer(session.id, questionId, {
    answerType: question.type,
    videoUrl: answerData.videoUrl || null,
    selectedOption: answerData.selectedOption || null,
    essayAnswer: answerData.essayAnswer || null,
    answeredAt: new Date(),
  });
  
  return { success: true };
};
