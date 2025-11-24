import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
    partnerService,
    partnerLead,
    partnerCommission,
    affiliateApplication,
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
