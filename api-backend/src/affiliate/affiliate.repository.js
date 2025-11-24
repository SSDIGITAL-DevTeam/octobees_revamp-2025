import { and, eq, gte, lte, sql, desc, asc, isNull } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
    affiliateApplication,
    user,
    affiliateUser,
    affiliatePasswordToken,
    affiliateLoginLog,
    affiliateReferral,
    affiliateTransaction,
} from "../../drizzle/schema.js";

export const insertAffiliateApplication = async (payload) => {
    await db.insert(affiliateApplication).values(payload);
    return payload;
};

export const findPendingByEmail = async (email) => {
    const rows = await db
        .select()
        .from(affiliateApplication)
        .where(and(eq(affiliateApplication.email, email), eq(affiliateApplication.status, "pending")))
        .limit(1);
    return rows[0] || null;
};

export const findAffiliateById = async (id) => {
    const rows = await db
        .select({
            id: affiliateApplication.id,
            fullName: affiliateApplication.fullName,
            email: affiliateApplication.email,
            countryCode: affiliateApplication.countryCode,
            phone: affiliateApplication.phone,
            phoneE164: affiliateApplication.phoneE164,
            country: affiliateApplication.country,
            govOrBusinessId: affiliateApplication.govOrBusinessId,
            strategy: affiliateApplication.strategy,
            portfolioLinks: affiliateApplication.portfolioLinks,
            motivation: affiliateApplication.motivation,
            otherPrograms: affiliateApplication.otherPrograms,
            status: affiliateApplication.status,
            notes: affiliateApplication.notes,
            reviewedAt: affiliateApplication.reviewedAt,
            reviewerId: affiliateApplication.reviewerId,
            reviewerName: user.name,
            ipAddress: affiliateApplication.ipAddress,
            userAgent: affiliateApplication.userAgent,
            createdAt: affiliateApplication.createdAt,
            updatedAt: affiliateApplication.updatedAt,
        })
        .from(affiliateApplication)
        .leftJoin(user, eq(user.id, affiliateApplication.reviewerId))
        .where(eq(affiliateApplication.id, id))
        .limit(1);
    return rows[0] || null;
};

// helper LIKE insensitive
const likeInsensitive = (col, term) =>
    sql`LOWER(${col}) LIKE ${"%" + String(term).toLowerCase() + "%"}`;

const buildWhere = ({ search, status, position, country, from, to }) => {
    const conds = [];

    if (search) {
        conds.push(
            sql`(${likeInsensitive(affiliateApplication.fullName, search)}
        OR ${likeInsensitive(affiliateApplication.email, search)})`
        );
    }
    if (status) conds.push(eq(affiliateApplication.status, status));
    // kalau nanti ada kolom position:
    // if (position) conds.push(eq(affiliateApplication.position, position));
    if (country) conds.push(likeInsensitive(affiliateApplication.country, country));
    if (from) conds.push(gte(affiliateApplication.createdAt, from));
    if (to) conds.push(lte(affiliateApplication.createdAt, to));

    if (!conds.length) return undefined;
    return and(...conds);
};

export const listAffiliateApplications = async ({
    page = 1,
    limit = 10,
    search,
    status,
    position,
    country,
    sort = "newest",
    from,
    to,
}) => {
    const offset = (Number(page) - 1) * Number(limit);
    const where = buildWhere({ search, status, position, country, from, to });
    const orderBy =
        sort === "oldest" ? asc(affiliateApplication.createdAt) : desc(affiliateApplication.createdAt);

    const data = await db
        .select({
            id: affiliateApplication.id,
            full_name: affiliateApplication.fullName,
            email: affiliateApplication.email,
            phone: affiliateApplication.phone,
            country: affiliateApplication.country,
            status: affiliateApplication.status,
            created_at: affiliateApplication.createdAt,
        })
        .from(affiliateApplication)
        .where(where)
        .orderBy(orderBy)
        .limit(Number(limit))
        .offset(offset);

    return { data };
};

export const countAffiliateApplications = async ({
    search,
    status,
    position,
    country,
    from,
    to,
}) => {
    const where = buildWhere({ search, status, position, country, from, to });
    const [{ count }] = await db
        .select({ count: sql`COUNT(*)`.mapWith(Number) })
        .from(affiliateApplication)
        .where(where);
    return count ?? 0;
};

export const deleteAffiliateById = async (id) => {
    await db.delete(affiliateApplication).where(eq(affiliateApplication.id, id));
};

// ambil semua (tanpa pagination) untuk Export CSV
export const listAffiliateAllForExport = async ({
    search,
    status,
    position,
    country,
    sort = "newest",
    from,
    to,
}) => {
    const where = buildWhere({ search, status, position, country, from, to });
    const orderBy =
        sort === "oldest" ? asc(affiliateApplication.createdAt) : desc(affiliateApplication.createdAt);

    const rows = await db
        .select({
            full_name: affiliateApplication.fullName,
            email: affiliateApplication.email,
            phone: affiliateApplication.phone,
            country: affiliateApplication.country,
            status: affiliateApplication.status,
            created_at: affiliateApplication.createdAt,
        })
        .from(affiliateApplication)
        .where(where)
        .orderBy(orderBy);

    return rows;
};

// ringkasan sederhana
export const aggregateAffiliateStats = async () => {
    const [{ total }] = await db
        .select({ total: sql`COUNT(*)`.mapWith(Number) })
        .from(affiliateApplication);

    const [{ pending }] = await db
        .select({ pending: sql`SUM(${affiliateApplication.status}='pending')`.mapWith(Number) })
        .from(affiliateApplication);

    const [{ approved }] = await db
        .select({ approved: sql`SUM(${affiliateApplication.status}='approved')`.mapWith(Number) })
        .from(affiliateApplication);

    const [{ rejected }] = await db
        .select({ rejected: sql`SUM(${affiliateApplication.status}='rejected')`.mapWith(Number) })
        .from(affiliateApplication);

    return { total, pending, approved, rejected };
};

// === NAMED EXPORT YANG HILANG (FIX) ===
export const reviewAffiliateApplication = async (
    id,
    { status, notes, reviewerId, reviewedAt },
    client = db
) => {
    await client
        .update(affiliateApplication)
        .set({ status, notes, reviewerId, reviewedAt, updatedAt: new Date() })
        .where(eq(affiliateApplication.id, id));
};

export const findAffiliateUserByAffiliateId = async (affiliateId, client = db) => {
    const rows = await client
        .select({
            id: affiliateUser.id,
            affiliateId: affiliateUser.affiliateId,
            email: affiliateUser.email,
            passwordHash: affiliateUser.passwordHash,
            isActive: affiliateUser.isActive,
            forcePasswordChange: affiliateUser.forcePasswordChange,
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

export const invalidatePasswordTokensForUser = async (affiliateUserId, client = db) => {
    await client
        .update(affiliatePasswordToken)
        .set({ usedAt: new Date() })
        .where(
            and(
                eq(affiliatePasswordToken.affiliateUserId, affiliateUserId),
                isNull(affiliatePasswordToken.usedAt)
            )
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
            lastLoginAt: affiliateUser.lastLoginAt,
            affiliateStatus: affiliateApplication.status,
            affiliateFullName: affiliateApplication.fullName,
        })
        .from(affiliateUser)
        .innerJoin(affiliateApplication, eq(affiliateApplication.id, affiliateUser.affiliateId))
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
            affiliateStatus: affiliateApplication.status,
            fullName: affiliateApplication.fullName,
            phone: affiliateApplication.phone,
            country: affiliateApplication.country,
        })
        .from(affiliateUser)
        .innerJoin(affiliateApplication, eq(affiliateApplication.id, affiliateUser.affiliateId))
        .where(eq(affiliateUser.id, id))
        .limit(1);
    return rows[0] || null;
};

export const updateAffiliateUserLoginMetadata = async (id, data, client = db) => {
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
            createdAt: affiliateApplication.createdAt,
        })
        .from(affiliateUser)
        .innerJoin(affiliateApplication, eq(affiliateApplication.id, affiliateUser.affiliateId))
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

export const aggregateAffiliatePerformance = async (affiliateId, { from, to } = {}) => {
    const where = buildReferralFilter(affiliateId, from, to);
    const [referralStats] = await db
        .select({
            totalClicks: sql`COALESCE(SUM(${affiliateReferral.clicks}), 0)`.mapWith(Number),
            totalSignups: sql`COALESCE(SUM(${affiliateReferral.signups}), 0)`.mapWith(Number),
            totalConversions: sql`COALESCE(SUM(${affiliateReferral.conversions}), 0)`.mapWith(Number),
            totalCommission: sql`COALESCE(SUM(${affiliateReferral.commissionAmount}), 0)`.mapWith(Number),
        })
        .from(affiliateReferral)
        .where(where);

    const [transactionStats] = await db
        .select({
            commissionPaid: sql`COALESCE(SUM(CASE WHEN ${affiliateTransaction.status}='paid' THEN ${affiliateTransaction.amount} ELSE 0 END), 0)`.mapWith(Number),
            commissionPending: sql`COALESCE(SUM(CASE WHEN ${affiliateTransaction.status} IN ('pending','processing') THEN ${affiliateTransaction.amount} ELSE 0 END), 0)`.mapWith(Number),
        })
        .from(affiliateTransaction)
        .where(buildTransactionFilter(affiliateId, from, to));

    return { ...referralStats, ...transactionStats };
};

export const listAffiliateTransactions = async ({ affiliateId, page = 1, limit = 10 }) => {
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

export const listAffiliateReferrals = async ({ affiliateId, page = 1, limit = 10 }) => {
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
        .orderBy(desc(affiliateReferral.lastConversionAt), desc(affiliateReferral.createdAt))
        .limit(Number(limit))
        .offset(offset);

    const totalPages = Math.max(1, Math.ceil(total / Number(limit)));
    return { data, total, page: Number(page), limit: Number(limit), totalPages };
};
