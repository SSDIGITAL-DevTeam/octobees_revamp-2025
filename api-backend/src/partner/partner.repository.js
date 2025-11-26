import { eq, and, desc, sql, asc, inArray } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
    partnerService,
    partnerLead,
    partnerCommission,
    affiliateApplication,
    affiliateUser,
    affiliatePasswordToken,
    affiliateLoginLog,
    affiliateReferral,
    affiliateTransaction,
} from "../../drizzle/schema.js";

// ==================== SERVICES ====================

export const getAllPartnerServices = async () => {
    return await db
        .select()
        .from(partnerService)
        .where(eq(partnerService.isActive, true))
        .orderBy(partnerService.name);
};

export const getPartnerServiceById = async (id) => {
    const result = await db
        .select()
        .from(partnerService)
        .where(eq(partnerService.id, id))
        .limit(1);
    return result[0] || null;
};

// ==================== LEADS ====================

export const getPartnerLeads = async (affiliateId, filters = {}) => {
    let query = db
        .select({
            id: partnerLead.id,
            name: partnerLead.name,
            email: partnerLead.email,
            phone: partnerLead.phone,
            serviceId: partnerLead.serviceId,
            serviceName: partnerService.name,
            projectValue: partnerLead.projectValue,
            status: partnerLead.status,
            remark: partnerLead.remark,
            createdAt: partnerLead.createdAt,
            updatedAt: partnerLead.updatedAt,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .where(eq(partnerLead.affiliateId, affiliateId));

    // Apply filters
    if (filters.status) {
        query = query.where(eq(partnerLead.status, filters.status));
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const results = await query
        .orderBy(desc(partnerLead.createdAt))
        .limit(limit)
        .offset(offset);

    // Get total count
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(partnerLead)
        .where(eq(partnerLead.affiliateId, affiliateId));

    const total = Number(countResult[0]?.count || 0);

    return {
        data: results,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getLeadById = async (leadId, affiliateId) => {
    const result = await db
        .select({
            id: partnerLead.id,
            name: partnerLead.name,
            email: partnerLead.email,
            phone: partnerLead.phone,
            serviceId: partnerLead.serviceId,
            serviceName: partnerService.name,
            projectValue: partnerLead.projectValue,
            status: partnerLead.status,
            remark: partnerLead.remark,
            createdAt: partnerLead.createdAt,
            updatedAt: partnerLead.updatedAt,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .where(
            and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId))
        )
        .limit(1);

    return result[0] || null;
};

export const createLead = async (data) => {
    const result = await db.insert(partnerLead).values(data);
    return result.insertId;
};

export const updateLead = async (leadId, affiliateId, data) => {
    const result = await db
        .update(partnerLead)
        .set({ ...data, updatedAt: new Date() })
        .where(
            and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId))
        );
    return result.affectedRows > 0;
};

export const deleteLead = async (leadId, affiliateId) => {
    const result = await db
        .delete(partnerLead)
        .where(
            and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId))
        );
    return result.affectedRows > 0;
};

// ==================== COMMISSIONS ====================

export const getCommissionHistory = async (affiliateId, filters = {}) => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const results = await db
        .select({
            id: partnerCommission.id,
            leadId: partnerCommission.leadId,
            leadName: partnerLead.name,
            serviceId: partnerCommission.serviceId,
            serviceName: partnerService.name,
            amount: partnerCommission.amount,
            status: partnerCommission.status,
            paidAt: partnerCommission.paidAt,
            createdAt: partnerCommission.createdAt,
        })
        .from(partnerCommission)
        .leftJoin(partnerLead, eq(partnerCommission.leadId, partnerLead.id))
        .leftJoin(partnerService, eq(partnerCommission.serviceId, partnerService.id))
        .where(eq(partnerCommission.affiliateId, affiliateId))
        .orderBy(desc(partnerCommission.createdAt))
        .limit(limit)
        .offset(offset);

    // Get total count
    const countResult = await db
        .select({ count: sql`count(*)` })
        .from(partnerCommission)
        .where(eq(partnerCommission.affiliateId, affiliateId));

    const total = Number(countResult[0]?.count || 0);

    return {
        data: results,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};

export const getCommissionById = async (id, affiliateId) => {
    const result = await db
        .select()
        .from(partnerCommission)
        .where(
            and(
                eq(partnerCommission.id, id),
                eq(partnerCommission.affiliateId, affiliateId)
            )
        )
        .limit(1);
    return result[0] || null;
};

// ==================== DASHBOARD STATS ====================

export const getDashboardStats = async (affiliateId) => {
    // Total commissions (all time)
    const totalCommissionResult = await db
        .select({
            total: sql`COALESCE(SUM(${partnerCommission.amount}), 0)`,
        })
        .from(partnerCommission)
        .where(eq(partnerCommission.affiliateId, affiliateId));

    // Pending commissions
    const pendingCommissionResult = await db
        .select({
            total: sql`COALESCE(SUM(${partnerCommission.amount}), 0)`,
            count: sql`COUNT(*)`,
        })
        .from(partnerCommission)
        .where(
            and(
                eq(partnerCommission.affiliateId, affiliateId),
                eq(partnerCommission.status, "Pending Transfer")
            )
        );

    // Total leads
    const totalLeadsResult = await db
        .select({
            count: sql`COUNT(*)`,
        })
        .from(partnerLead)
        .where(eq(partnerLead.affiliateId, affiliateId));

    // Closed won leads
    const closedLeadsResult = await db
        .select({
            count: sql`COUNT(*)`,
        })
        .from(partnerLead)
        .where(
            and(
                eq(partnerLead.affiliateId, affiliateId),
                eq(partnerLead.status, "Closed Won")
            )
        );

    const totalCommission = Number(totalCommissionResult[0]?.total || 0);
    const pendingCommission = Number(pendingCommissionResult[0]?.total || 0);
    const pendingCount = Number(pendingCommissionResult[0]?.count || 0);
    const totalLeads = Number(totalLeadsResult[0]?.count || 0);
    const closedLeads = Number(closedLeadsResult[0]?.count || 0);

    const conversionRate =
        totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

    return {
        totalCommission,
        pendingCommission,
        pendingCount,
        totalLeads,
        closedLeads,
        conversionRate,
    };
};

// ==================== RECENT LEADS ====================

export const getRecentLeads = async (affiliateId, limit = 5) => {
    return await db
        .select({
            id: partnerLead.id,
            name: partnerLead.name,
            email: partnerLead.email,
            phone: partnerLead.phone,
            serviceName: partnerService.name,
            status: partnerLead.status,
            remark: partnerLead.remark,
            updatedAt: partnerLead.updatedAt,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .where(eq(partnerLead.affiliateId, affiliateId))
        .orderBy(desc(partnerLead.updatedAt))
        .limit(limit);
};

// ==================== BACK OFFICE GLOBAL QUERIES ====================

export const getGlobalDashboardStats = async () => {
    // Total leads
    const totalLeadsResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(partnerLead);

    // Active Partners (approved affiliates)
    const activePartnersResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(affiliateApplication)
        .where(eq(affiliateApplication.status, "approved"));

    // Closed Leads (Closed Won)
    const closedLeadsResult = await db
        .select({ count: sql`COUNT(*)` })
        .from(partnerLead)
        .where(eq(partnerLead.status, "Closed Won"));

    // Pending Commission (Pending Transfer)
    const pendingCommissionResult = await db
        .select({
            total: sql`COALESCE(SUM(${partnerCommission.amount}), 0)`,
            count: sql`COUNT(*)`,
        })
        .from(partnerCommission)
        .where(eq(partnerCommission.status, "Pending Transfer"));

    return {
        totalLeads: Number(totalLeadsResult[0]?.count || 0),
        activePartners: Number(activePartnersResult[0]?.count || 0),
        closedLeads: Number(closedLeadsResult[0]?.count || 0),
        pendingCommission: Number(pendingCommissionResult[0]?.total || 0),
        pendingCommissionCount: Number(pendingCommissionResult[0]?.count || 0),
    };
};

export const getAllRecentLeads = async (limit = 5) => {
    return await db
        .select({
            id: partnerLead.id,
            leadName: partnerLead.name,
            partnerName: affiliateApplication.fullName,
            serviceType: partnerService.name,
            status: partnerLead.status,
            remark: partnerLead.remark,
            updatedAt: partnerLead.updatedAt,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .leftJoin(affiliateApplication, eq(partnerLead.affiliateId, affiliateApplication.id))
        .orderBy(desc(partnerLead.updatedAt))
        .limit(limit);
};

export const getAllPendingCommissions = async (limit = 5) => {
    return await db
        .select({
            id: partnerCommission.id,
            partnerName: affiliateApplication.fullName,
            service: partnerService.name,
            leadName: partnerLead.name,
            amount: partnerCommission.amount,
            status: partnerCommission.status,
            createdAt: partnerCommission.createdAt,
        })
        .from(partnerCommission)
        .leftJoin(partnerLead, eq(partnerCommission.leadId, partnerLead.id))
        .leftJoin(partnerService, eq(partnerCommission.serviceId, partnerService.id))
        .leftJoin(affiliateApplication, eq(partnerCommission.affiliateId, affiliateApplication.id))
        .where(eq(partnerCommission.status, "Pending Transfer"))
        .orderBy(desc(partnerCommission.createdAt))
        .limit(limit);
};

// ==================== BACK OFFICE PARTNER MGMT ====================

const likeInsensitive = (col, term) =>
    sql`LOWER(${col}) LIKE ${"%" + String(term).toLowerCase() + "%"}`;

const buildPartnerFilter = ({ search, status, country }) => {
    const conds = [];
    if (search) {
        conds.push(
            sql`(${likeInsensitive(affiliateApplication.fullName, search)} OR ${likeInsensitive(affiliateApplication.email, search)})`
        );
    }
    if (status) conds.push(eq(affiliateApplication.status, status));
    if (country) conds.push(likeInsensitive(affiliateApplication.country, country));
    if (!conds.length) return undefined;
    return and(...conds);
};

export const getAllPartners = async ({ page = 1, limit = 10, search, status, country, sort = "newest" }) => {
    const offset = (Number(page) - 1) * Number(limit);
    const where = buildPartnerFilter({ search, status, country });
    const orderBy = sort === "oldest" ? asc(affiliateApplication.createdAt) : desc(affiliateApplication.createdAt);

    const data = await db
        .select({
            id: affiliateApplication.id,
            fullName: affiliateApplication.fullName,
            email: affiliateApplication.email,
            phone: affiliateApplication.phone,
            country: affiliateApplication.country,
            status: affiliateApplication.status,
            createdAt: affiliateApplication.createdAt,
            updatedAt: affiliateApplication.updatedAt,
        })
        .from(affiliateApplication)
        .where(where)
        .orderBy(orderBy)
        .limit(Number(limit))
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql`COUNT(*)`.mapWith(Number) })
        .from(affiliateApplication)
        .where(where);

    return {
        data,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: count ?? 0,
            totalPages: Math.max(1, Math.ceil((count ?? 0) / Number(limit))),
        },
    };
};

export const getPartnerById = async (id) => {
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
            createdAt: affiliateApplication.createdAt,
            updatedAt: affiliateApplication.updatedAt,
        })
        .from(affiliateApplication)
        .where(eq(affiliateApplication.id, id))
        .limit(1);

    return rows[0] || null;
};

export const updatePartner = async (id, data) => {
    await db
        .update(affiliateApplication)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(affiliateApplication.id, id));
};

export const deletePartner = async (id) => {
    await db.transaction(async (tx) => {
        const affiliateUsers = await tx
            .select({ id: affiliateUser.id })
            .from(affiliateUser)
            .where(eq(affiliateUser.affiliateId, id));
        const affiliateUserIds = affiliateUsers.map((u) => u.id);

        // hapus data berelasi terlebih dahulu agar FK tidak gagal
        if (affiliateUserIds.length) {
            await tx
                .delete(affiliatePasswordToken)
                .where(inArray(affiliatePasswordToken.affiliateUserId, affiliateUserIds));
            await tx
                .delete(affiliateLoginLog)
                .where(inArray(affiliateLoginLog.affiliateUserId, affiliateUserIds));
        }
        await tx.delete(partnerCommission).where(eq(partnerCommission.affiliateId, id));
        await tx.delete(partnerLead).where(eq(partnerLead.affiliateId, id));
        await tx.delete(affiliateReferral).where(eq(affiliateReferral.affiliateId, id));
        await tx.delete(affiliateTransaction).where(eq(affiliateTransaction.affiliateId, id));
        await tx.delete(affiliateUser).where(eq(affiliateUser.affiliateId, id));
        await tx.delete(affiliateApplication).where(eq(affiliateApplication.id, id));
    });
};

// ==================== BACK OFFICE LEADS MGMT ====================

const buildLeadFilter = ({ search, status, affiliateId }) => {
    const conds = [];
    if (search) {
        conds.push(
            sql`(${likeInsensitive(partnerLead.name, search)} OR ${likeInsensitive(partnerLead.email, search)} OR ${likeInsensitive(partnerLead.phone, search)})`
        );
    }
    if (status) conds.push(eq(partnerLead.status, status));
    if (affiliateId) conds.push(eq(partnerLead.affiliateId, affiliateId));
    if (!conds.length) return undefined;
    return and(...conds);
};

export const getAllLeads = async ({ page = 1, limit = 10, search, status, affiliateId }) => {
    const offset = (Number(page) - 1) * Number(limit);
    const where = buildLeadFilter({ search, status, affiliateId });

    const data = await db
        .select({
            id: partnerLead.id,
            name: partnerLead.name,
            email: partnerLead.email,
            phone: partnerLead.phone,
            serviceId: partnerLead.serviceId,
            serviceName: partnerService.name,
            projectValue: partnerLead.projectValue,
            status: partnerLead.status,
            remark: partnerLead.remark,
            createdAt: partnerLead.createdAt,
            updatedAt: partnerLead.updatedAt,
            affiliateId: partnerLead.affiliateId,
            partnerName: affiliateApplication.fullName,
            partnerEmail: affiliateApplication.email,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .leftJoin(affiliateApplication, eq(partnerLead.affiliateId, affiliateApplication.id))
        .where(where)
        .orderBy(desc(partnerLead.createdAt))
        .limit(Number(limit))
        .offset(offset);

    const [{ count }] = await db
        .select({ count: sql`COUNT(*)`.mapWith(Number) })
        .from(partnerLead)
        .leftJoin(affiliateApplication, eq(partnerLead.affiliateId, affiliateApplication.id))
        .where(where);

    return {
        data,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: count ?? 0,
            totalPages: Math.max(1, Math.ceil((count ?? 0) / Number(limit))),
        },
    };
};

export const getLeadByIdBackOffice = async (leadId) => {
    const result = await db
        .select({
            id: partnerLead.id,
            name: partnerLead.name,
            email: partnerLead.email,
            phone: partnerLead.phone,
            serviceId: partnerLead.serviceId,
            serviceName: partnerService.name,
            projectValue: partnerLead.projectValue,
            status: partnerLead.status,
            remark: partnerLead.remark,
            createdAt: partnerLead.createdAt,
            updatedAt: partnerLead.updatedAt,
            affiliateId: partnerLead.affiliateId,
            partnerName: affiliateApplication.fullName,
            partnerEmail: affiliateApplication.email,
            partnerCountry: affiliateApplication.country,
        })
        .from(partnerLead)
        .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
        .leftJoin(affiliateApplication, eq(partnerLead.affiliateId, affiliateApplication.id))
        .where(eq(partnerLead.id, leadId))
        .limit(1);

    return result[0] || null;
};

export const updateLeadBackOffice = async (leadId, data) => {
    const result = await db
        .update(partnerLead)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(partnerLead.id, leadId));
    return result.affectedRows > 0;
};

export const deleteLeadBackOffice = async (leadId) => {
    const result = await db
        .delete(partnerLead)
        .where(eq(partnerLead.id, leadId));
    return result.affectedRows > 0;
};
