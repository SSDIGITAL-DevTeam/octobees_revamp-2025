import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import {
  reserveActiveBatchSlotAndInsertAffiliateApplication,
  listAffiliateApplications,
  countAffiliateApplications,
  findAffiliateById,
  reviewAffiliateApplication,
  deleteAffiliateById,
  listAffiliateAllForExport,
  aggregateAffiliateStats,
  findAffiliateUserByAffiliateId,
  createAffiliateUserRecord,
  updateAffiliateUserRecord,
  createAffiliatePasswordToken,
  invalidatePasswordTokensForUser,
  updateAffiliateApplication,
} from "./affiliate.repository.js";
import { getAffiliateWithAssessment } from "../assessment/assessment.repository.js";
import {
  getActiveBatch,
  getBatchById,
} from "../affiliate-batch/batch.repository.js";
import { broadcastBatchUpdate } from "../affiliate-batch/batch-sse.js";
import {
  generateTemporaryPassword,
  hashPassword,
  generateOneTimeToken,
} from "./affiliate.security.js";
import {
  sendAffiliateApprovedEmail,
  sendAffiliateRejectedEmail,
} from "./affiliate.mailer.js";
import logger from "../../utils/logger.js";
import { queueBackgroundTask } from "../utils/background-task.js";
import { db } from "../../drizzle/db.js";
import {
  affiliateApplication,
  affiliateUser,
  affiliatePasswordToken,
  affiliateLoginLog,
  affiliateReferral,
  affiliateTransaction,
  partnerLead,
  partnerCommission,
  assessmentSession,
} from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const normDigits = (s) => (s || "").toString().replace(/\D+/g, "");
const trim = (s) => (s == null ? s : String(s).trim());
const getClientIp = (req) => {
  const forwardedFor = req.headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return String(forwardedFor[0]).trim();
  }
  const realIp = req.headers?.["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim()) {
    return realIp.trim();
  }
  return req.ip || null;
};
const PARTNER_PORTAL_URL = (
  process.env.PARTNER_PORTAL_URL || "http://localhost:3002"
).replace(/\/$/, "");
const normalizeChangePasswordPath = (value) => {
  const path = String(value || "").trim();
  if (!path || path === "/affiliate/change-password" || path === "affiliate/change-password") {
    return "/forgot-password";
  }
  return path.startsWith("/") ? path : `/${path}`;
};
const CHANGE_PASSWORD_PATH = normalizeChangePasswordPath(
  process.env.AFFILIATE_CHANGE_PASSWORD_PATH || "/forgot-password"
);
const CHANGE_PASSWORD_TOKEN_TTL_HOURS = Number(
  process.env.AFFILIATE_CHANGE_PASSWORD_TOKEN_TTL_HOURS || 24,
);
const AI_TRAINING_BASE_URL = (
  process.env.AI_TRAINING_BASE_URL || "http://localhost:3006"
).replace(/\/$/, "");

const buildChangePasswordUrl = (token) =>
  `${PARTNER_PORTAL_URL}${CHANGE_PASSWORD_PATH}?token=${token}&forced=true`;
const buildInterviewUrl = (examToken) =>
  `${AI_TRAINING_BASE_URL}/interview/${examToken}`;
const buildTrainingUrl = (examToken) =>
  `${AI_TRAINING_BASE_URL}/training/${examToken}`;
const buildExamUrl = (examToken) => `${AI_TRAINING_BASE_URL}/exam/${examToken}`;

async function verifyRecaptchaToken(token, remoteIp) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Security verification is not configured.");
  }

  const params = new URLSearchParams();
  params.append("secret", secretKey);
  params.append("response", token);
  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  const response = await fetch(
    "https://www.google.com/recaptcha/api/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    },
  );

  const data = await response.json();
  if (!data.success || data.score < 0.5) {
    logger.warn("reCAPTCHA verification failed:", data);
    throw new Error("Security verification failed. Please try again.");
  }

  return data;
}

export const createAffiliate = async (raw, req) => {
  // Verify reCAPTCHA in production. In development we allow a safe bypass
  // to keep local testing from depending on third-party verification.
  const recaptchaToken = raw.recaptcha_token || raw.recaptchaToken || raw.token;
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    if (recaptchaToken) {
      try {
        await verifyRecaptchaToken(recaptchaToken, getClientIp(req));
      } catch (recaptchaError) {
        logger.error("reCAPTCHA error:", recaptchaError);
        throw new Error("Security verification failed. Please try again.");
      }
    } else {
      throw new Error("Security verification required");
    }
  } else {
    logger.info("Skipping reCAPTCHA verification in development mode");
  }

  const payload = {
    id: randomUUID(),
    fullName: trim(raw.fullName || raw.full_name),
    email: trim(raw.email),
    countryCode: trim(raw.countryCode || raw.country_code) || "+62",
    phone: trim(raw.phone),
    city: trim(raw.city) || null,
    country: trim(raw.country) || "Indonesia",
    govOrBusinessId:
      trim(raw.govOrBusinessId || raw.gov_or_business_id) || null,
    occupation: trim(raw.occupation) || null,
    salesExperience: trim(raw.salesExperience || raw.sales_experience) || null,
    hasSoldSaaS: trim(raw.hasSoldSaaS || raw.has_sold_saas) || null,
    salesStyle: trim(raw.salesStyle || raw.sales_style) || null,
    incomeGoal: trim(raw.incomeGoal || raw.income_goal) || null,
    hearAboutUs: trim(raw.hearAboutUs || raw.hear_about_us) || null,
    whyChoose: trim(raw.whyChoose || raw.why_choose) || null,
    videoUrl: trim(raw.videoUrl || raw.video_url) || null,
    resumeUrl: trim(raw.resumeUrl || raw.resume_url || raw.resume) || null,
    strategy: trim(raw.strategy) || "To be completed",
    portfolioLinks: trim(raw.portfolioLinks || raw.portfolio_links) || null,
    motivation: trim(raw.motivation) || "To be completed",
    otherPrograms: trim(raw.otherPrograms || raw.other_programs) || null,
    phoneE164: null,
    status: "pending",
    ipAddress: getClientIp(req),
    userAgent: req.get("user-agent") || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  if (!payload.fullName || !payload.email) {
    throw new Error("Name and email are required");
  }

  // Normalisasi E.164
  const cc = (payload.countryCode || "").replace(/^\+/, "");
  const ph = normDigits(payload.phone);
  payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;

  const reservation =
    await reserveActiveBatchSlotAndInsertAffiliateApplication(payload);
  const activeBatch = reservation.batch;
  const application = reservation.application;

  const waitsForBatchCuration =
    Boolean(activeBatch.autoCurateOnQuotaReached) ||
    Boolean(activeBatch.autoCurateOnBatchClose);

  try {
    if (!waitsForBatchCuration) {
      await queueBackgroundTask(
        "single-affiliate-screening",
        async () => {
          const { processSingleScreening } =
            await import("../assessment/exam.service.js");
          await processSingleScreening(payload.id);
        },
        {
          affiliateId: payload.id,
          email: payload.email,
          batchId: activeBatch.id,
        },
      );
    }

    if (
      activeBatch.autoCurateOnQuotaReached &&
      Number(activeBatch.registrationQuota || 0) > 0
    ) {
      const { queueBatchScreening } =
        await import("../assessment/exam.service.js");
      if (reservation.quotaReached) {
        await queueBatchScreening({
          batchIds: [activeBatch.id],
          source: "quota_reached_after_application_submit",
        });
      }
    }

    const currentBatch = reservation.quotaReached
      ? await getBatchById(activeBatch.id)
      : await getActiveBatch();
    broadcastBatchUpdate(currentBatch);
  } catch (postSubmitError) {
    logger.error(
      `Post-submit onboarding setup failed for ${payload.email}:`,
      postSubmitError,
    );
  }

  return {
    ...application,
    screeningStatus: "pending",
    screeningScore: null,
    interviewEmailSent: false,
    batchQuota: reservation.registrationQuota,
    batchApplicationCount: reservation.applicationCountAfterInsert,
    batchRemainingSlots: reservation.remainingSlotsAfterInsert,
    nextStep: waitsForBatchCuration
      ? "waiting_for_batch_ai_screening"
      : "waiting_for_ai_screening",
  };
};

export const getAllAffiliates = async (query = {}) => {
  const page = Number(query.page ?? 1);
  const limit = Number(query.limit ?? 10);
  const search = trim(query.search) || "";
  const status = trim(query.status) || "";
  const stage = trim(query.stage) || "";
  const position = trim(query.position) || ""; // future: jika tambahkan kolom position
  const sort = (trim(query.sort) || "applied_newest").toLowerCase();

  const { data } = await listAffiliateApplications({
    page,
    limit,
    search,
    status,
    stage,
    position,
    sort,
  });
  const total = await countAffiliateApplications({
    search,
    status,
    stage,
    position,
  });
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return { data, page, limit, total, totalPages };
};

export const getAffiliate = async (id) => {
  const row = await findAffiliateById(id);
  if (!row) throw new Error("Application not found");
  return row;
};

export const reviewAffiliate = async () => {
  throw new Error(
    "Final admin approve/reject is no longer available. After interview approval, the remaining steps are processed automatically by AI.",
  );
};

export const deleteAffiliate = async (id) => {
  const row = await findAffiliateById(id);
  if (!row) throw new Error("Application not found");

  await db.transaction(async (tx) => {
    const affiliateUserRecord = await findAffiliateUserByAffiliateId(id, tx);

    if (affiliateUserRecord) {
      await tx
        .delete(affiliatePasswordToken)
        .where(
          eq(affiliatePasswordToken.affiliateUserId, affiliateUserRecord.id),
        );
      await tx
        .delete(affiliateLoginLog)
        .where(eq(affiliateLoginLog.affiliateUserId, affiliateUserRecord.id));
      await tx
        .delete(affiliateUser)
        .where(eq(affiliateUser.id, affiliateUserRecord.id));
    }

    await tx
      .delete(partnerCommission)
      .where(eq(partnerCommission.affiliateId, id));
    await tx.delete(partnerLead).where(eq(partnerLead.affiliateId, id));
    await tx
      .delete(affiliateReferral)
      .where(eq(affiliateReferral.affiliateId, id));
    await tx
      .delete(affiliateTransaction)
      .where(eq(affiliateTransaction.affiliateId, id));
    await tx
      .delete(affiliateApplication)
      .where(eq(affiliateApplication.id, id));
  });
};

export const updateAffiliate = async (id, raw = {}) => {
  const existing = await findAffiliateById(id);
  if (!existing) throw new Error("Application not found");

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

  // recompute E164 when phone or country code provided
  if (payload.phone !== undefined || payload.countryCode !== undefined) {
    const cc = (payload.countryCode ?? existing.countryCode ?? "").replace(
      /^\+/,
      "",
    );
    const ph = normDigits(payload.phone ?? existing.phone ?? "");
    payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;
  }

  if (!Object.keys(payload).length) {
    throw new Error("No valid fields to update");
  }

  await updateAffiliateApplication(id, payload);
  return await findAffiliateById(id);
};

const toCsv = (rows) => {
  if (!rows?.length) return "full_name,email,phone,country,status,created_at\n";
  const header = Object.keys(rows[0]);
  const esc = (v) => String(v ?? "").replace(/"/g, '""');
  const lines = rows
    .map((r) => header.map((h) => `"${esc(r[h])}"`).join(","))
    .join("\n");
  return `${header.join(",")}\n${lines}\n`;
};

export const exportAffiliateCsv = async (query = {}) => {
  const sort = (trim(query.sort) || "applied_newest").toLowerCase();

  const rows = await listAffiliateAllForExport({
    search: trim(query.search) || "",
    status: trim(query.status) || "",
    stage: trim(query.stage) || "",
    position: trim(query.position) || "",
    sort,
  });

  const csv = toCsv(rows);
  return {
    csv,
    filename: `affiliate_program_${dayjs().format("YYYYMMDD_HHmmss")}.csv`,
  };
};

export const getAffiliateStats = async () => {
  return await aggregateAffiliateStats();
};

export const approveAffiliate = async (id, reviewerId, options = {}) => {
  const source = options?.source || "admin";
  if (source !== "automation") {
    throw new Error(
      "Manual onboarding is disabled. Candidates are onboarded automatically after passing the AI certification flow.",
    );
  }

  const application = await findAffiliateById(id);
  if (!application) throw new Error("Application not found");

  const existingUser = await findAffiliateUserByAffiliateId(id);
  const alreadyFinallyApproved =
    application.status === "approved" &&
    !!application.reviewedAt &&
    !!application.reviewerId &&
    !!existingUser;

  if (alreadyFinallyApproved) {
    return {
      message: "Application already approved",
      emailSent: false,
      alreadyApproved: true,
    };
  }

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);
  const { rawToken, tokenHash } = generateOneTimeToken();
  const tokenExpiresAt = dayjs()
    .add(CHANGE_PASSWORD_TOKEN_TTL_HOURS, "hour")
    .toDate();
  let userRecord = existingUser;

  await db.transaction(async (tx) => {
    await reviewAffiliateApplication(
      id,
      {
        status: "approved",
        notes: null,
        reviewerId,
        reviewedAt: dayjs().toDate(),
      },
      tx,
    );

    if (!existingUser) {
      userRecord = {
        id: randomUUID(),
        affiliateId: id,
        email: application.email,
        passwordHash,
        isActive: true,
        forcePasswordChange: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await createAffiliateUserRecord(userRecord, tx);
    } else {
      await updateAffiliateUserRecord(
        existingUser.id,
        { passwordHash, forcePasswordChange: true, isActive: true },
        tx,
      );
      await invalidatePasswordTokensForUser(existingUser.id, tx);
    }

    await createAffiliatePasswordToken(
      {
        id: randomUUID(),
        affiliateUserId: userRecord.id,
        tokenHash,
        type: "initial",
        expiresAt: tokenExpiresAt,
        createdAt: new Date(),
      },
      tx,
    );
  });

  const changePasswordUrl = buildChangePasswordUrl(rawToken);
  let emailSent = true;
  try {
    logger.info(`Sending approval email to ${application.email}`, {
      email: application.email,
      changePasswordUrl,
    });
    emailSent = await sendAffiliateApprovedEmail(
      application,
      changePasswordUrl,
    );
  } catch (error) {
    emailSent = false;
    logger.error(
      `Failed to send affiliate approval email for ${application.email}`,
      {
        error: error.message,
        code: error.code,
        stack: error.stack,
      },
    );
  }

  return {
    message: "Affiliate approved",
    emailSent,
    changePasswordUrl,
  };
};

export const rejectAffiliate = async (
  id,
  rejectionNote,
  reviewerId,
  options = {},
) => {
  const source = options?.source || "admin";
  if (source !== "automation") {
    throw new Error(
      "Manual final rejection is disabled. Final failed outcomes are handled automatically by the AI certification flow.",
    );
  }

  if (!rejectionNote) throw new Error("Rejection note is required");
  const application = await findAffiliateById(id);
  if (!application) throw new Error("Application not found");
  const existingUser = await findAffiliateUserByAffiliateId(id);
  const alreadyFinallyApproved =
    application.status === "approved" &&
    !!application.reviewedAt &&
    !!application.reviewerId;

  if (alreadyFinallyApproved)
    throw new Error("Approved application cannot be rejected");

  await db.transaction(async (tx) => {
    await reviewAffiliateApplication(
      id,
      {
        status: "rejected",
        notes: rejectionNote,
        reviewerId,
        reviewedAt: dayjs().toDate(),
      },
      tx,
    );

    if (existingUser) {
      await updateAffiliateUserRecord(existingUser.id, { isActive: false }, tx);
      await invalidatePasswordTokensForUser(existingUser.id, tx);
    }
  });

  let emailSent = true;
  try {
    await sendAffiliateRejectedEmail(application, rejectionNote);
  } catch (error) {
    emailSent = false;
    logger.error(
      `Failed to send affiliate rejection email for ${application.email}`,
      { error },
    );
  }

  return { message: "Affiliate rejected", emailSent };
};

export const resendApprovalEmail = async (id, step = "approval") => {
  const normalizedStep = String(step || "approval")
    .trim()
    .toLowerCase();

  if (normalizedStep === "interview_invitation") {
    const application = await findAffiliateById(id);
    if (!application) throw new Error("Application not found");

    const { createOrRefreshOnboardingSession } =
      await import("../assessment/exam.service.js");
    const { sendVideoInterviewInvitationEmail } =
      await import("../email/email.service.js");

    const session = await createOrRefreshOnboardingSession(id);

    await sendVideoInterviewInvitationEmail(application, {
      interviewUrl: buildInterviewUrl(session.examToken),
      expiresAt: session.expiresAt,
    });

    await db
      .update(assessmentSession)
      .set({
        interviewInvitationSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, session.id));

    return {
      step: normalizedStep,
      message: "Video interview invitation email resent",
      emailSent: true,
    };
  }

  if (normalizedStep === "training_invitation") {
    const details = await getAffiliateWithAssessment(id);
    if (!details?.affiliate) throw new Error("Application not found");
    if (!details?.session) throw new Error("Assessment session not found");
    if (details.session.interviewStatus !== "approved") {
      throw new Error(
        "Training invitation can only be resent after the interview has been approved",
      );
    }

    const { sendTrainingInvitationEmail } =
      await import("../email/email.service.js");

    await sendTrainingInvitationEmail(details.affiliate, {
      examUrl: buildTrainingUrl(details.session.examToken),
      expiresAt: details.session.expiresAt,
    });

    await db
      .update(assessmentSession)
      .set({
        trainingInvitationSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, details.session.id));

    return {
      step: normalizedStep,
      message: "AI training invitation email resent",
      emailSent: true,
    };
  }

  if (normalizedStep === "exam_invitation") {
    const details = await getAffiliateWithAssessment(id);
    if (!details?.affiliate) throw new Error("Application not found");
    if (!details?.session) throw new Error("Assessment session not found");
    if (details.session.trainingStatus !== "completed") {
      throw new Error(
        "Exam invitation can only be resent after the training has been completed",
      );
    }

    const { sendExamInvitationEmail } =
      await import("../email/email.service.js");

    await sendExamInvitationEmail(details.affiliate, {
      examUrl: buildExamUrl(details.session.examToken),
      expiresAt: details.session.examMustCompleteBy,
    });

    await db
      .update(assessmentSession)
      .set({
        examInvitationSentAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(assessmentSession.id, details.session.id));

    return {
      step: normalizedStep,
      message: "Certification email resent",
      emailSent: true,
    };
  }

  if (normalizedStep === "assessment_result") {
    const details = await getAffiliateWithAssessment(id);
    if (!details?.affiliate) throw new Error("Application not found");
    if (!details?.session) throw new Error("Assessment session not found");
    if (!["passed", "failed"].includes(String(details.session.status || ""))) {
      throw new Error(
        "Assessment result email can only be resent after the assessment has been scored",
      );
    }

    const percentage = Number(details.session.percentage || 0);
    const passingPercentage = Number(details.session.passingPercentage || 0);
    const maxAttempts = Number(details.session.maxExamAttempts || 2);
    const attemptCount = Number(details.session.examAttemptCount || 0);

    if (Boolean(details.session.isPassed)) {
      const { sendExamPassedEmail } = await import("../email/email.service.js");
      await sendExamPassedEmail(details.affiliate, {
        percentage,
        passingPercentage,
      });
    } else if (attemptCount >= maxAttempts) {
      const { sendExamFailedFinalEmail } =
        await import("../email/email.service.js");
      await sendExamFailedFinalEmail(details.affiliate, {
        percentage,
        passingPercentage,
        maxAttempts,
      });
    } else {
      throw new Error(
        "Result email is only available after a passed exam or a final failed attempt",
      );
    }

    return {
      step: normalizedStep,
      message: "Assessment result email resent",
      emailSent: true,
    };
  }

  if (normalizedStep === "rejection") {
    const application = await findAffiliateById(id);
    if (!application) throw new Error("Application not found");
    if (application.status !== "rejected") {
      throw new Error(
        "Only rejected affiliates can receive rejection email resend",
      );
    }

    await sendAffiliateRejectedEmail(application, application.notes || "");

    return {
      step: normalizedStep,
      message: "Rejection email resent",
      emailSent: true,
    };
  }

  if (normalizedStep !== "approval") {
    throw new Error("Invalid resend email step");
  }

  const application = await findAffiliateById(id);
  if (!application) throw new Error("Application not found");
  if (application.status !== "approved")
    throw new Error("Only approved affiliates can receive email resend");

  const existingUser = await findAffiliateUserByAffiliateId(id);
  if (!existingUser) throw new Error("Affiliate user not found");

  const tempPassword = generateTemporaryPassword();
  const passwordHash = await hashPassword(tempPassword);
  const { rawToken, tokenHash } = generateOneTimeToken();
  const tokenExpiresAt = dayjs()
    .add(CHANGE_PASSWORD_TOKEN_TTL_HOURS, "hour")
    .toDate();

  await db.transaction(async (tx) => {
    await updateAffiliateUserRecord(
      existingUser.id,
      { passwordHash, forcePasswordChange: true },
      tx,
    );
    await invalidatePasswordTokensForUser(existingUser.id, tx);
    await createAffiliatePasswordToken(
      {
        id: randomUUID(),
        affiliateUserId: existingUser.id,
        tokenHash,
        // Keep compatibility with the current DB enum values.
        type: "reset",
        expiresAt: tokenExpiresAt,
        createdAt: new Date(),
      },
      tx,
    );
  });

  const changePasswordUrl = buildChangePasswordUrl(rawToken);
  let emailSent = true;
  try {
    logger.info(`Resending approval email to ${application.email}`, {
      email: application.email,
      changePasswordUrl,
    });
    emailSent = await sendAffiliateApprovedEmail(
      application,
      changePasswordUrl,
    );
  } catch (error) {
    emailSent = false;
    logger.error(
      `Failed to resend affiliate approval email for ${application.email}`,
      {
        error: error.message,
        code: error.code,
        stack: error.stack,
      },
    );
  }

  return {
    step: normalizedStep,
    message: "Approval email resent with a new password setup link",
    emailSent,
    changePasswordUrl,
  };
};

export const approveInterviewForTraining = async (
  id,
  reviewerId,
  notes = null,
) => {
  const details = await getAffiliateWithAssessment(id);
  if (!details?.affiliate) throw new Error("Application not found");
  if (!details?.session) throw new Error("Assessment session not found");
  if (details.session.interviewStatus !== "submitted") {
    throw new Error("Only submitted interviews can be approved for training");
  }

  const { sendTrainingInvitationEmail } =
    await import("../email/email.service.js");

  await db
    .update(assessmentSession)
    .set({
      interviewStatus: "approved",
      interviewReviewedAt: new Date(),
      interviewReviewerId: reviewerId,
      interviewReviewNotes: notes || null,
      updatedAt: new Date(),
    })
    .where(eq(assessmentSession.id, details.session.id));

  await sendTrainingInvitationEmail(details.affiliate, {
    examUrl: buildTrainingUrl(details.session.examToken),
    expiresAt: details.session.expiresAt,
  });

  await db
    .update(assessmentSession)
    .set({
      trainingInvitationSentAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(assessmentSession.id, details.session.id));

  return {
    message: "Interview approved and training invitation sent",
    emailSent: true,
  };
};

export const processAffiliateToOnboard = async (id, reviewerId) => {
  throw new Error(
    "Manual onboarding is disabled. Candidates are onboarded automatically after passing the AI certification flow.",
  );
};

export const revertAffiliateFinalDecision = async (id) => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("This action is only available in development mode");
  }

  const application = await findAffiliateById(id);
  if (!application) throw new Error("Application not found");

  if (!["approved", "rejected"].includes(application.status)) {
    throw new Error(
      "Only approved or rejected applications can be returned to review",
    );
  }

  const existingUser = await findAffiliateUserByAffiliateId(id);

  await db.transaction(async (tx) => {
    await reviewAffiliateApplication(
      id,
      {
        status: "qualified",
        notes: application.notes ?? null,
        reviewerId: null,
        reviewedAt: null,
      },
      tx,
    );

    if (existingUser) {
      await updateAffiliateUserRecord(
        existingUser.id,
        {
          isActive: false,
          forcePasswordChange: true,
        },
        tx,
      );
      await invalidatePasswordTokensForUser(existingUser.id, tx);
    }
  });

  return {
    message: "Final decision reverted to review state",
    status: "qualified",
  };
};
