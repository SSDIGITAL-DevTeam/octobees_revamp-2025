import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import {
    findAffiliateUserByEmail,
    updateAffiliateUserRecord,
    createAffiliatePasswordToken,
    findPasswordTokenByHash,
    markPasswordTokenUsed,
    invalidatePasswordTokensForUser,
    insertAffiliateLoginLog,
    findAffiliateUserById,
} from "./affiliate.repository.js";
import {
    comparePassword,
    hashPassword,
    validatePasswordStrength,
    generateOneTimeToken,
    hashToken,
} from "./affiliate.security.js";
import { sendAffiliatePasswordResetEmail } from "./affiliate.mailer.js";
import logger from "../../utils/logger.js";
import { db } from "../../drizzle/db.js";

const AFFILIATE_JWT_SECRET = process.env.AFFILIATE_JWT_SECRET;
const AFFILIATE_JWT_EXPIRES_IN = process.env.AFFILIATE_JWT_EXPIRES_IN || "4h";
const RESET_TOKEN_TTL_MINUTES = Number(process.env.AFFILIATE_RESET_TOKEN_TTL_MINUTES || 60);
const PARTNER_PORTAL_URL = (process.env.PARTNER_PORTAL_URL || "http://localhost:3002").replace(/\/$/, "");
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

const buildChangePasswordUrl = (token) => `${PARTNER_PORTAL_URL}${CHANGE_PASSWORD_PATH}?token=${token}&forced=true`;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const recordLoginAttempt = async ({ affiliateUserId, status, reason, ip, userAgent }) => {
    await insertAffiliateLoginLog({
        id: randomUUID(),
        affiliateUserId,
        status,
        reason,
        ipAddress: ip,
        userAgent,
        createdAt: new Date(),
    });
};

export const loginAffiliateAccount = async ({ email, password }, meta = {}) => {
    if (!AFFILIATE_JWT_SECRET) {
        throw new Error("Authentication is not configured");
    }
    const normalizedEmail = normalizeEmail(email);
    const account = await findAffiliateUserByEmail(normalizedEmail);
    if (!account) {
        await recordLoginAttempt({ affiliateUserId: null, status: "failed", reason: "not_found", ip: meta.ip, userAgent: meta.userAgent });
        throw new Error("Invalid credentials");
    }

    if (account.affiliateStatus !== "approved" || !account.isActive) {
        await recordLoginAttempt({ affiliateUserId: account.id, status: "failed", reason: "inactive", ip: meta.ip, userAgent: meta.userAgent });
        throw new Error("Affiliate account is not active");
    }

    const passwordMatch = await comparePassword(password, account.passwordHash);
    if (!passwordMatch) {
        await recordLoginAttempt({ affiliateUserId: account.id, status: "failed", reason: "password_mismatch", ip: meta.ip, userAgent: meta.userAgent });
        throw new Error("Invalid credentials");
    }

    const payload = {
        sub: account.id,
        affiliateId: account.affiliateId,
        email: account.email,
        tv: Number(account.tokenVersion || 0),
    };

    const token = jwt.sign(payload, AFFILIATE_JWT_SECRET, { expiresIn: AFFILIATE_JWT_EXPIRES_IN });
    await updateAffiliateUserRecord(account.id, { lastLoginAt: new Date() });
    await recordLoginAttempt({ affiliateUserId: account.id, status: "success", reason: null, ip: meta.ip, userAgent: meta.userAgent });

    // If forcePasswordChange is true, generate a change-password token
    let changePasswordToken = null;
    if (account.forcePasswordChange) {
        const { generateOneTimeToken, hashToken } = await import("./affiliate.security.js");
        const { rawToken, tokenHash } = generateOneTimeToken();
        const expiresAt = dayjs().add(60, "minute").toDate();
        
        const { invalidatePasswordTokensForUser, createAffiliatePasswordToken } = await import("./affiliate.repository.js");
        await invalidatePasswordTokensForUser(account.id);
        await createAffiliatePasswordToken({
            id: randomUUID(),
            affiliateUserId: account.id,
            tokenHash,
            // Reuse the existing reset token type in DB for forced first-login password change.
            type: "reset",
            expiresAt,
            createdAt: new Date(),
        });
        changePasswordToken = rawToken;
    }

    return {
        token,
        expiresIn: AFFILIATE_JWT_EXPIRES_IN,
        forcePasswordChange: !!account.forcePasswordChange,
        tncAgreed: account.tncAgreedAt != null,
        changePasswordToken,
        profile: {
            id: account.id,
            affiliateId: account.affiliateId,
            email: account.email,
            fullName: account.affiliateFullName,
        },
    };
};

export const changeAffiliatePassword = async ({ token, newPassword, confirmPassword }) => {
    if (!token || !newPassword || !confirmPassword) {
        throw new Error("Invalid payload");
    }
    if (newPassword !== confirmPassword) {
        throw new Error("Password confirmation mismatch");
    }

    const normalizedToken = String(token || "").trim();
    if (!normalizedToken) {
        throw new Error("Invalid token");
    }
    const hashedToken = hashToken(normalizedToken);
    const record = await findPasswordTokenByHash(hashedToken);
    if (!record) {
        throw new Error("Token not found");
    }
    if (record.usedAt) {
        throw new Error("Token already used");
    }
    if (dayjs(record.expiresAt).isBefore(dayjs())) {
        throw new Error("Token expired");
    }

    const user = await findAffiliateUserById(record.affiliateUserId);
    if (!user) throw new Error("Affiliate user not found");

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
        throw new Error("Password does not meet the policy");
    }
    const hashedPassword = await hashPassword(newPassword);

    await db.transaction(async (tx) => {
        await updateAffiliateUserRecord(
            user.id,
            {
                passwordHash: hashedPassword,
                forcePasswordChange: false,
                tokenVersion: Number(user.tokenVersion || 0) + 1,
            },
            tx
        );
        await markPasswordTokenUsed(record.id, tx);
    });

    return { message: "Password updated. Please login again." };
};

export const agreeTncForAffiliate = async (affiliateUserId) => {
    await updateAffiliateUserRecord(affiliateUserId, { tncAgreedAt: new Date() });
};

export const requestAffiliatePasswordReset = async ({ email }) => {
    const normalizedEmail = normalizeEmail(email);
    const account = await findAffiliateUserByEmail(normalizedEmail);
    if (!account) {
        return { message: "If the account exists, email has been sent." };
    }

    const { rawToken, tokenHash } = generateOneTimeToken();
    const expiresAt = dayjs().add(RESET_TOKEN_TTL_MINUTES, "minute").toDate();

    await db.transaction(async (tx) => {
        await invalidatePasswordTokensForUser(account.id, tx);
        await createAffiliatePasswordToken(
            {
                id: randomUUID(),
                affiliateUserId: account.id,
                tokenHash,
                type: "reset",
                expiresAt,
                createdAt: new Date(),
            },
            tx
        );
    });

    const resetUrl = buildChangePasswordUrl(rawToken);
    try {
        await sendAffiliatePasswordResetEmail(
            { fullName: account.affiliateFullName, email: account.email },
            resetUrl
        );
    } catch (error) {
        logger.error(`Failed to send affiliate reset password email to ${account.email}`, { error });
        throw new Error("Failed to send reset password email");
    }

    return { message: "If the account exists, email has been sent." };
};
