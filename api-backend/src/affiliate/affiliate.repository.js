import { and, eq, gte, lte, sql, desc, asc } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { affiliateApplication, user } from "../../drizzle/schema.js";

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
    { status, notes, reviewerId, reviewedAt }
) => {
    await db
        .update(affiliateApplication)
        .set({ status, notes, reviewerId, reviewedAt, updatedAt: new Date() })
        .where(eq(affiliateApplication.id, id));
};
