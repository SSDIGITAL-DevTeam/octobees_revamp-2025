import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import {
    insertAffiliateApplication,
    findPendingByEmail,
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
import { generateTemporaryPassword, hashPassword, generateOneTimeToken } from "./affiliate.security.js";
import { sendAffiliateApprovedEmail, sendAffiliateRejectedEmail } from "./affiliate.mailer.js";
import logger from "../../utils/logger.js";
import { db } from "../../drizzle/db.js";
import { 
    affiliateApplication,
    affiliateUser, 
    affiliatePasswordToken, 
    affiliateLoginLog, 
    affiliateReferral, 
    affiliateTransaction,
    partnerLead,
    partnerCommission
} from "../../drizzle/schema.js";
import { eq } from "drizzle-orm";

const normDigits = (s) => (s || "").toString().replace(/\D+/g, "");
const trim = (s) => (s == null ? s : String(s).trim());
const APP_BASE_URL = (process.env.APP_BASE_URL || "https://octobees.com").replace(/\/$/, "");
const CHANGE_PASSWORD_PATH = process.env.AFFILIATE_CHANGE_PASSWORD_PATH || "/affiliate/change-password";
const CHANGE_PASSWORD_TOKEN_TTL_HOURS = Number(process.env.AFFILIATE_CHANGE_PASSWORD_TOKEN_TTL_HOURS || 24);

const buildChangePasswordUrl = (token) => `${APP_BASE_URL}${CHANGE_PASSWORD_PATH}?token=${token}`;

export const createAffiliate = async (raw, req) => {
    const payload = {
        id: randomUUID(),
        fullName: trim(raw.fullName || raw.full_name),
        email: trim(raw.email),
        countryCode: trim(raw.countryCode || raw.country_code) || "+62",
        phone: trim(raw.phone),
        country: trim(raw.country),
        govOrBusinessId: trim(raw.govOrBusinessId || raw.gov_or_business_id) || null,
        strategy: trim(raw.strategy),
        portfolioLinks: trim(raw.portfolioLinks || raw.portfolio_links) || null,
        motivation: trim(raw.motivation) || null,
        otherPrograms: trim(raw.otherPrograms || raw.other_programs) || null,
        phoneE164: null,
        status: "pending",
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    if (!payload.fullName || !payload.email || !payload.country || !payload.strategy || !payload.motivation) {
        throw new Error("Missing required fields");
    }

    // Normalisasi E.164
    const cc = (payload.countryCode || "").replace(/^\+/, "");
    const ph = normDigits(payload.phone);
    payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;

    // tolak duplikat pending per email
    const exists = await findPendingByEmail(payload.email);
    if (exists) throw new Error("You already have a pending application with this email.");

    await insertAffiliateApplication(payload);
    return payload;
};

export const getAllAffiliates = async (query = {}) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = trim(query.search) || "";
    const status = trim(query.status) || "";
    const position = trim(query.position) || ""; // future: jika tambahkan kolom position
    const country = trim(query.country) || "";
    const sort = (trim(query.sort) || "newest").toLowerCase();
    const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
    const to = query.to ? dayjs(query.to).endOf("day").toDate() : null;

    const { data } = await listAffiliateApplications({
        page, limit, search, status, position, country, sort, from, to,
    });
    const total = await countAffiliateApplications({ search, status, position, country, from, to });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { data, page, limit, total, totalPages };
};

export const getAffiliate = async (id) => {
    const row = await findAffiliateById(id);
    if (!row) throw new Error("Application not found");
    return row;
};

export const reviewAffiliate = async (id, payload, reviewerId) => {
    const { status, reviewerId: payloadReviewerId } = payload;
    const notes = payload.notes || payload.rejectionNote || payload.rejection_note;

    if (!["approved", "rejected"].includes(status)) throw new Error("Invalid status");
    const finalReviewerId = reviewerId ?? payloadReviewerId ?? null;
    if (status === "approved") {
        return approveAffiliate(id, finalReviewerId);
    }
    return rejectAffiliate(id, notes, finalReviewerId);
};

export const deleteAffiliate = async (id) => {
    const row = await findAffiliateById(id);
    if (!row) throw new Error("Application not found");
    
    await db.transaction(async (tx) => {
        const affiliateUserRecord = await findAffiliateUserByAffiliateId(id, tx);
        
        if (affiliateUserRecord) {
            await tx.delete(affiliatePasswordToken).where(eq(affiliatePasswordToken.affiliateUserId, affiliateUserRecord.id));
            await tx.delete(affiliateLoginLog).where(eq(affiliateLoginLog.affiliateUserId, affiliateUserRecord.id));
            await tx.delete(affiliateUser).where(eq(affiliateUser.id, affiliateUserRecord.id));
        }
        
        await tx.delete(partnerCommission).where(eq(partnerCommission.affiliateId, id));
        await tx.delete(partnerLead).where(eq(partnerLead.affiliateId, id));
        await tx.delete(affiliateReferral).where(eq(affiliateReferral.affiliateId, id));
        await tx.delete(affiliateTransaction).where(eq(affiliateTransaction.affiliateId, id));
        await tx.delete(affiliateApplication).where(eq(affiliateApplication.id, id));
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
    if (govOrBusinessId !== undefined) payload.govOrBusinessId = govOrBusinessId || null;

    const strategy = maybe("strategy");
    if (strategy !== undefined) payload.strategy = strategy;

    const portfolioLinks = maybe("portfolioLinks", "portfolio_links");
    if (portfolioLinks !== undefined) payload.portfolioLinks = portfolioLinks || null;

    const motivation = maybe("motivation");
    if (motivation !== undefined) payload.motivation = motivation || null;

    const otherPrograms = maybe("otherPrograms", "other_programs");
    if (otherPrograms !== undefined) payload.otherPrograms = otherPrograms || null;

    const notes = maybe("notes");
    if (notes !== undefined) payload.notes = notes || null;

    const status = maybe("status");
    if (status !== undefined) {
        if (!allowedStatus.includes(status)) throw new Error("Invalid status");
        payload.status = status;
    }

    // recompute E164 when phone or country code provided
    if (payload.phone !== undefined || payload.countryCode !== undefined) {
        const cc = (payload.countryCode ?? existing.countryCode ?? "").replace(/^\+/, "");
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
    const lines = rows.map(r => header.map(h => `"${esc(r[h])}"`).join(",")).join("\n");
    return `${header.join(",")}\n${lines}\n`;
};

export const exportAffiliateCsv = async (query = {}) => {
    const sort = (trim(query.sort) || "newest").toLowerCase();
    const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
    const to = query.to ? dayjs(query.to).endOf("day").toDate() : null;

    const rows = await listAffiliateAllForExport({
        search: trim(query.search) || "",
        status: trim(query.status) || "",
        position: trim(query.position) || "",
        country: trim(query.country) || "",
        sort, from, to,
    });

    const csv = toCsv(rows);
    return { csv, filename: `affiliate_program_${dayjs().format("YYYYMMDD_HHmmss")}.csv` };
};

export const getAffiliateStats = async () => {
    return await aggregateAffiliateStats();
};

export const approveAffiliate = async (id, reviewerId) => {
    const application = await findAffiliateById(id);
    if (!application) throw new Error("Application not found");

    const existingUser = await findAffiliateUserByAffiliateId(id);
    if (application.status === "approved" && existingUser) {
        return { message: "Application already approved", emailSent: false, alreadyApproved: true };
    }

    const tempPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(tempPassword);
    const { rawToken, tokenHash } = generateOneTimeToken();
    const tokenExpiresAt = dayjs().add(CHANGE_PASSWORD_TOKEN_TTL_HOURS, "hour").toDate();
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
            tx
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
                tx
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
            tx
        );
    });

    const changePasswordUrl = buildChangePasswordUrl(rawToken);
    let emailSent = true;
    try {
        logger.info(`Sending approval email to ${application.email}`, {
            email: application.email,
            tempPassword,
            changePasswordUrl,
            passwordLength: tempPassword.length
        });
        await sendAffiliateApprovedEmail(application, tempPassword, changePasswordUrl);
    } catch (error) {
        emailSent = false;
        logger.error(`Failed to send affiliate approval email for ${application.email}`, {
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    }

    return {
        message: "Affiliate approved",
        emailSent,
        changePasswordUrl,
    };
};

export const rejectAffiliate = async (id, rejectionNote, reviewerId) => {
    if (!rejectionNote) throw new Error("Rejection note is required");
    const application = await findAffiliateById(id);
    if (!application) throw new Error("Application not found");
    if (application.status === "approved") throw new Error("Approved application cannot be rejected");

    await reviewAffiliateApplication(
        id,
        {
            status: "rejected",
            notes: rejectionNote,
            reviewerId,
            reviewedAt: dayjs().toDate(),
        }
    );

    let emailSent = true;
    try {
        await sendAffiliateRejectedEmail(application, rejectionNote);
    } catch (error) {
        emailSent = false;
        logger.error(`Failed to send affiliate rejection email for ${application.email}`, { error });
    }

    return { message: "Affiliate rejected", emailSent };
};

export const resendApprovalEmail = async (id) => {
    const application = await findAffiliateById(id);
    if (!application) throw new Error("Application not found");
    if (application.status !== "approved") throw new Error("Only approved affiliates can receive email resend");

    const existingUser = await findAffiliateUserByAffiliateId(id);
    if (!existingUser) throw new Error("Affiliate user not found");

    const tempPassword = generateTemporaryPassword();
    const passwordHash = await hashPassword(tempPassword);
    const { rawToken, tokenHash } = generateOneTimeToken();
    const tokenExpiresAt = dayjs().add(CHANGE_PASSWORD_TOKEN_TTL_HOURS, "hour").toDate();

    await db.transaction(async (tx) => {
        await updateAffiliateUserRecord(
            existingUser.id,
            { passwordHash, forcePasswordChange: true },
            tx
        );
        await invalidatePasswordTokensForUser(existingUser.id, tx);
        await createAffiliatePasswordToken(
            {
                id: randomUUID(),
                affiliateUserId: existingUser.id,
                tokenHash,
                type: "resend",
                expiresAt: tokenExpiresAt,
                createdAt: new Date(),
            },
            tx
        );
    });

    const changePasswordUrl = buildChangePasswordUrl(rawToken);
    let emailSent = true;
    try {
        logger.info(`Resending approval email to ${application.email}`, {
            email: application.email,
            tempPassword,
            changePasswordUrl,
        });
        await sendAffiliateApprovedEmail(application, tempPassword, changePasswordUrl);
    } catch (error) {
        emailSent = false;
        logger.error(`Failed to resend affiliate approval email for ${application.email}`, {
            error: error.message,
            code: error.code,
            stack: error.stack
        });
    }

    return {
        message: "Approval email resent with new password",
        emailSent,
        changePasswordUrl,
    };
};
