import { eq, and, desc, sql, asc, inArray, isNull, lte } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import {
  partnerService,
  salesMaterial,
  partnerLead,
  partnerLeadService,
  partnerLeadPipelineStatus,
  partnerVerticalMarket,
  partnerLeadActivity,
  partnerLeadNote,
  partnerCommission,
  affiliateApplication,
  affiliateBatch,
  affiliateUser,
  affiliatePasswordToken,
  affiliateLoginLog,
  affiliateReferral,
  affiliateTransaction,
  partnerPerformanceSetting,
  partnerRegistrationData,
  commissionRule,
} from "../../drizzle/schema.js";
import { v4 as uuidv7 } from "uuid";

export const DEFAULT_LEAD_PIPELINE_STATUSES = [
  { value: "New Leads", label: "New Leads", color: "blue", sortOrder: 1, isActive: true, isSystem: true },
  { value: "Contacted", label: "Contacted", color: "purple", sortOrder: 2, isActive: true, isSystem: true },
  { value: "Won", label: "Won", color: "green", sortOrder: 3, isActive: true, isSystem: true },
  { value: "Lost", label: "Lost", color: "red", sortOrder: 4, isActive: true, isSystem: true },
];

export const listLeadPipelineStatuses = async ({ includeInactive = true } = {}) => {
  const rows = await db
    .select()
    .from(partnerLeadPipelineStatus)
    .orderBy(asc(partnerLeadPipelineStatus.sortOrder), asc(partnerLeadPipelineStatus.label));

  return includeInactive ? rows : rows.filter((row) => row.isActive);
};

export const getLeadPipelineStatusByValue = async (value) => {
  const rows = await db
    .select()
    .from(partnerLeadPipelineStatus)
    .where(eq(partnerLeadPipelineStatus.value, value))
    .limit(1);

  return rows[0] || null;
};

export const seedDefaultLeadPipelineStatuses = async () => {
  const existing = await listLeadPipelineStatuses({ includeInactive: true });
  const existingValues = new Set(existing.map((item) => item.value));
  const missing = DEFAULT_LEAD_PIPELINE_STATUSES.filter((item) => !existingValues.has(item.value));

  if (missing.length > 0) {
    await db.insert(partnerLeadPipelineStatus).values(
      missing.map((item) => ({
        id: uuidv7(),
        ...item,
      })),
    );
  }

  return listLeadPipelineStatuses({ includeInactive: true });
};

export const updateLeadPipelineStatuses = async (statuses = []) => {
  await seedDefaultLeadPipelineStatuses();

  for (const item of statuses) {
    await db.insert(partnerLeadPipelineStatus)
      .values({
        id: uuidv7(),
        value: item.value,
        label: item.label,
        color: item.color,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        isSystem: item.isSystem,
      })
      .onDuplicateKeyUpdate({
        // Drizzle requires a `set` key — passing a plain object causes
        // "Cannot convert undefined or null to object" at runtime.
        set: {
          label: item.label,
          color: item.color,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
          isSystem: item.isSystem,
          updatedAt: new Date(),
        },
      });
  }

  return listLeadPipelineStatuses({ includeInactive: true });
};

export const DEFAULT_VERTICAL_MARKETS = [
  { name: "Digital Agency", sortOrder: 1, isActive: true, isSystem: true },
  { name: "Education", sortOrder: 2, isActive: true, isSystem: true },
  { name: "Healthcare", sortOrder: 3, isActive: true, isSystem: true },
  { name: "Real Estate", sortOrder: 4, isActive: true, isSystem: true },
  { name: "Retail & Ecommerce", sortOrder: 5, isActive: true, isSystem: true },
  { name: "Food & Beverage", sortOrder: 6, isActive: true, isSystem: true },
  { name: "Finance & Insurance", sortOrder: 7, isActive: true, isSystem: true },
  { name: "Professional Services", sortOrder: 8, isActive: true, isSystem: true },
];

export const listVerticalMarkets = async ({ includeInactive = true } = {}) => {
  const rows = await db
    .select()
    .from(partnerVerticalMarket)
    .orderBy(asc(partnerVerticalMarket.sortOrder), asc(partnerVerticalMarket.name));

  return includeInactive ? rows : rows.filter((row) => row.isActive);
};

export const seedDefaultVerticalMarkets = async () => {
  const existing = await listVerticalMarkets({ includeInactive: true });
  const existingNames = new Set(existing.map((item) => item.name.toLowerCase()));
  const missing = DEFAULT_VERTICAL_MARKETS.filter(
    (item) => !existingNames.has(item.name.toLowerCase()),
  );

  if (missing.length > 0) {
    await db.insert(partnerVerticalMarket).values(
      missing.map((item) => ({
        id: uuidv7(),
        ...item,
      })),
    );
  }

  return listVerticalMarkets({ includeInactive: true });
};

export const updateVerticalMarkets = async (markets = []) => {
  await seedDefaultVerticalMarkets();

  for (const item of markets) {
    await db
      .insert(partnerVerticalMarket)
      .values({
        id: item.id || uuidv7(),
        name: item.name,
        sortOrder: item.sortOrder,
        isActive: item.isActive,
        isSystem: item.isSystem,
      })
      .onDuplicateKeyUpdate({
        set: {
          name: item.name,
          sortOrder: item.sortOrder,
          isActive: item.isActive,
          isSystem: item.isSystem,
          updatedAt: new Date(),
        },
      });
  }

  return listVerticalMarkets({ includeInactive: true });
};

export const getVerticalMarketById = async (id) => {
  if (!id) return null;
  const rows = await db
    .select()
    .from(partnerVerticalMarket)
    .where(eq(partnerVerticalMarket.id, id))
    .limit(1);
  return rows[0] || null;
};

export const getVerticalMarketByName = async (name) => {
  const normalized = String(name || "").trim();
  if (!normalized) return null;
  const rows = await db
    .select()
    .from(partnerVerticalMarket)
    .where(sql`LOWER(${partnerVerticalMarket.name}) = LOWER(${normalized})`)
    .limit(1);
  return rows[0] || null;
};

export const createVerticalMarket = async (data) => {
  await db.insert(partnerVerticalMarket).values(data);
  return getVerticalMarketById(data.id);
};

// ==================== SERVICES ====================

export const getAllPartnerServices = async () => {
  return await db
    .select()
    .from(partnerService)
    .where(eq(partnerService.isActive, true))
    .orderBy(partnerService.name);
};

export const getAllSalesMaterials = async ({
  includeInactive = false,
} = {}) => {
  let query = db
    .select()
    .from(salesMaterial)
    .orderBy(asc(salesMaterial.sortOrder), desc(salesMaterial.createdAt));

  if (!includeInactive) {
    query = query.where(eq(salesMaterial.isActive, true));
  }

  return await query;
};

export const getSalesMaterialById = async (id) => {
  const result = await db
    .select()
    .from(salesMaterial)
    .where(eq(salesMaterial.id, id))
    .limit(1);
  return result[0] || null;
};

export const createSalesMaterial = async (data) => {
  await db.insert(salesMaterial).values(data);
  return await getSalesMaterialById(data.id);
};

export const updateSalesMaterial = async (id, data) => {
  await db
    .update(salesMaterial)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(salesMaterial.id, id));
  return await getSalesMaterialById(id);
};

export const deleteSalesMaterial = async (id) => {
  const result = await db.delete(salesMaterial).where(eq(salesMaterial.id, id));
  return result.affectedRows > 0;
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

// Fetch services for a list of lead IDs and group by leadId.
const loadServicesForLeads = async (leadIds) => {
  if (!leadIds.length) return {};
  const rows = await db
    .select({
      leadId: partnerLeadService.leadId,
      serviceId: partnerLeadService.serviceId,
      serviceName: partnerService.name,
      projectValue: partnerLeadService.projectValue,
      isCustomProjectValue: partnerLeadService.isCustomProjectValue,
    })
    .from(partnerLeadService)
    .leftJoin(partnerService, eq(partnerLeadService.serviceId, partnerService.id))
    .where(inArray(partnerLeadService.leadId, leadIds));

  return rows.reduce((acc, row) => {
    if (!acc[row.leadId]) acc[row.leadId] = [];
    acc[row.leadId].push({
      serviceId: row.serviceId,
      serviceName: row.serviceName ?? "",
      projectValue: Number(row.projectValue ?? 0),
      isCustomProjectValue: Boolean(row.isCustomProjectValue),
    });
    return acc;
  }, {});
};

export const getPartnerLeads = async (affiliateId, filters = {}) => {
  const conditions = [eq(partnerLead.affiliateId, affiliateId)];
  if (filters.status) {
    conditions.push(eq(partnerLead.status, filters.status));
  }
  const where = conditions.length > 1 ? and(...conditions) : conditions[0];

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const results = await db
    .select({
      id: partnerLead.id,
      affiliateId: partnerLead.affiliateId,
      name: partnerLead.name,
      email: partnerLead.email,
      phone: partnerLead.phone,
      verticalMarketId: partnerLead.verticalMarketId,
      verticalMarketName: partnerLead.verticalMarketName,
      status: partnerLead.status,
      nextFollowUpAt: partnerLead.nextFollowUpAt,
      lastContactAt: partnerLead.lastContactAt,
      lastStatusChangedAt: partnerLead.lastStatusChangedAt,
      createdAt: partnerLead.createdAt,
      updatedAt: partnerLead.updatedAt,
    })
    .from(partnerLead)
    .where(where)
    .orderBy(desc(partnerLead.createdAt))
    .limit(limit)
    .offset(offset);

  const servicesByLead = await loadServicesForLeads(results.map((r) => r.id));

  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(partnerLead)
    .where(eq(partnerLead.affiliateId, affiliateId));

  const total = Number(countResult[0]?.count || 0);

  return {
    data: results.map((r) => ({ ...r, services: servicesByLead[r.id] ?? [] })),
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
      affiliateId: partnerLead.affiliateId,
      name: partnerLead.name,
      email: partnerLead.email,
      phone: partnerLead.phone,
      verticalMarketId: partnerLead.verticalMarketId,
      verticalMarketName: partnerLead.verticalMarketName,
      status: partnerLead.status,
      nextFollowUpAt: partnerLead.nextFollowUpAt,
      lastContactAt: partnerLead.lastContactAt,
      lastStatusChangedAt: partnerLead.lastStatusChangedAt,
      createdAt: partnerLead.createdAt,
      updatedAt: partnerLead.updatedAt,
    })
    .from(partnerLead)
    .where(
      and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId)),
    )
    .limit(1);

  if (!result[0]) return null;
  const servicesByLead = await loadServicesForLeads([leadId]);
  return { ...result[0], services: servicesByLead[leadId] ?? [] };
};

export const createLead = async (data) => {
  const { services = [], ...leadData } = data;
  const result = await db.insert(partnerLead).values(leadData);
  if (services.length) {
    await db.insert(partnerLeadService).values(
      services.map((s) => ({
        id: uuidv7(),
        leadId: leadData.id,
        serviceId: s.serviceId,
        projectValue: Number(s.projectValue ?? 0),
        isCustomProjectValue: Boolean(s.isCustomProjectValue),
      })),
    );
  }
  return result.insertId;
};

export const createLeadActivity = async (data, client = db) => {
  const result = await client.insert(partnerLeadActivity).values(data);
  return result;
};

export const updateLead = async (leadId, affiliateId, data) => {
  await db
    .update(partnerLead)
    .set({ ...data, updatedAt: new Date() })
    .where(
      and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId)),
    );
  return true;
};

export const replaceLeadServices = async (leadId, services = []) => {
  await db.delete(partnerLeadService).where(eq(partnerLeadService.leadId, leadId));
  if (services.length) {
    await db.insert(partnerLeadService).values(
      services.map((s) => ({
        id: uuidv7(),
        leadId,
        serviceId: s.serviceId,
        projectValue: Number(s.projectValue ?? 0),
        isCustomProjectValue: Boolean(s.isCustomProjectValue),
      })),
    );
  }
};

export const countWonLeadsForVerticalMarket = async (
  verticalMarketId,
  { excludeLeadId } = {},
) => {
  if (!verticalMarketId) return 0;
  const conditions = [
    eq(partnerLead.verticalMarketId, verticalMarketId),
    eq(partnerLead.status, "Won"),
  ];
  if (excludeLeadId) {
    conditions.push(sql`${partnerLead.id} <> ${excludeLeadId}`);
  }
  const rows = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(partnerLead)
    .where(and(...conditions));
  return Number(rows[0]?.count || 0);
};

export const deleteLead = async (leadId, affiliateId) => {
  await db
    .delete(partnerLead)
    .where(
      and(eq(partnerLead.id, leadId), eq(partnerLead.affiliateId, affiliateId)),
    );
  return true;
};

// ==================== COMMISSIONS ====================

export const getCommissionHistory = async (affiliateId, filters = {}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [eq(partnerCommission.affiliateId, affiliateId)];
  if (filters.type) {
    conditions.push(eq(partnerCommission.commissionType, filters.type));
  }
  if (filters.status) {
    conditions.push(eq(partnerCommission.status, filters.status));
  }
  if (filters.period) {
    conditions.push(eq(partnerCommission.period, filters.period));
  }

  const whereClause = conditions.length > 1 ? and(...conditions) : conditions[0];

  const results = await db
    .select({
      id: partnerCommission.id,
      leadId: partnerCommission.leadId,
      leadName: partnerLead.name,
      serviceId: partnerCommission.serviceId,
      serviceName: partnerService.name,
      amount: partnerCommission.amount,
      value: partnerLead.projectValue,
      status: partnerCommission.status,
      commissionType: partnerCommission.commissionType,
      ruleId: partnerCommission.ruleId,
      ruleName: commissionRule.name,
      ruleTriggerType: commissionRule.triggerType,
      period: partnerCommission.period,
      proofUrl: partnerCommission.proofUrl,
      transactionReference: partnerCommission.transactionReference,
      rejectedAt: partnerCommission.rejectedAt,
      rejectionReason: partnerCommission.rejectionReason,
      paidAt: partnerCommission.paidAt,
      createdAt: partnerCommission.createdAt,
    })
    .from(partnerCommission)
    .leftJoin(partnerLead, eq(partnerCommission.leadId, partnerLead.id))
    .leftJoin(
      partnerService,
      eq(partnerCommission.serviceId, partnerService.id),
    )
    .leftJoin(commissionRule, eq(partnerCommission.ruleId, commissionRule.id))
    .where(whereClause)
    .orderBy(desc(partnerCommission.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const countResult = await db
    .select({ count: sql`count(*)` })
    .from(partnerCommission)
    .where(whereClause);

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
        eq(partnerCommission.affiliateId, affiliateId),
      ),
    )
    .limit(1);
  return result[0] || null;
};

export const getCommissionByLeadId = async (leadId) => {
  const result = await db
    .select()
    .from(partnerCommission)
    .where(eq(partnerCommission.leadId, leadId))
    .limit(1);
  return result[0] || null;
};

export const createCommissionForLead = async ({
  affiliateId,
  leadId,
  serviceId,
  amount,
}) => {
  const existing = await getCommissionByLeadId(leadId);
  if (existing) return existing;

  const id = uuidv7();
  await db.insert(partnerCommission).values({
    id,
    affiliateId,
    leadId,
    serviceId,
    amount,
    commissionType: "sales",
    status: "Pending Transfer",
  });
  return await getCommissionByLeadId(leadId);
};

// ==================== COMMISSION TYPE HELPERS (initial / basic_salary) ====================

export const getCommissionByTypePeriod = async (
  affiliateId,
  commissionType,
  period,
) => {
  const result = await db
    .select()
    .from(partnerCommission)
    .where(
      and(
        eq(partnerCommission.affiliateId, affiliateId),
        eq(partnerCommission.commissionType, commissionType),
        eq(partnerCommission.period, period),
      ),
    )
    .limit(1);
  return result[0] || null;
};

export const createPeriodicCommission = async ({
  affiliateId,
  commissionType,
  period,
  amount,
}) => {
  const existing = await getCommissionByTypePeriod(
    affiliateId,
    commissionType,
    period,
  );
  if (existing) return existing;

  const id = uuidv7();
  try {
    await db.insert(partnerCommission).values({
      id,
      affiliateId,
      commissionType,
      period,
      amount,
      status: "Pending Transfer",
    });
  } catch (err) {
    // In case unique index catches a race condition
    if (err?.code === "ER_DUP_ENTRY") {
      return await getCommissionByTypePeriod(
        affiliateId,
        commissionType,
        period,
      );
    }
    throw err;
  }
  return await getCommissionByTypePeriod(affiliateId, commissionType, period);
};

export const updateCommissionAmount = async (id, { amount }) => {
  await db
    .update(partnerCommission)
    .set({
      amount,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommission.id, id));

  return await getCommissionByIdBackOffice(id);
};

// ==================== BACK-OFFICE COMMISSION LIST & ACTIONS ====================

export const listCommissionsForBackOffice = async ({
  page = 1,
  limit = 20,
  type,
  status,
  period,
  affiliateId,
  search,
} = {}) => {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (type) conditions.push(eq(partnerCommission.commissionType, type));
  if (status) conditions.push(eq(partnerCommission.status, status));
  if (period) conditions.push(eq(partnerCommission.period, period));
  if (affiliateId)
    conditions.push(eq(partnerCommission.affiliateId, affiliateId));
  if (search) {
    const term = `%${String(search).toLowerCase()}%`;
    conditions.push(
      sql`LOWER(${affiliateApplication.fullName}) LIKE ${term}`,
    );
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: partnerCommission.id,
      affiliateId: partnerCommission.affiliateId,
      partnerName: affiliateApplication.fullName,
      partnerEmail: affiliateApplication.email,
      leadId: partnerCommission.leadId,
      leadName: partnerLead.name,
      serviceId: partnerCommission.serviceId,
      serviceName: partnerService.name,
      projectValue: partnerLead.projectValue,
      amount: partnerCommission.amount,
      commissionType: partnerCommission.commissionType,
      period: partnerCommission.period,
      status: partnerCommission.status,
      paidAt: partnerCommission.paidAt,
      paidById: partnerCommission.paidById,
      proofUrl: partnerCommission.proofUrl,
      transactionReference: partnerCommission.transactionReference,
      rejectedAt: partnerCommission.rejectedAt,
      rejectionReason: partnerCommission.rejectionReason,
      bankName: partnerRegistrationData.bankName,
      bankAccountNumber: partnerRegistrationData.bankAccountNumber,
      bankAccountHolder: partnerRegistrationData.bankAccountHolder,
      createdAt: partnerCommission.createdAt,
      updatedAt: partnerCommission.updatedAt,
    })
    .from(partnerCommission)
    .leftJoin(
      affiliateApplication,
      eq(partnerCommission.affiliateId, affiliateApplication.id),
    )
    .leftJoin(partnerLead, eq(partnerCommission.leadId, partnerLead.id))
    .leftJoin(
      partnerService,
      eq(partnerCommission.serviceId, partnerService.id),
    )
    .leftJoin(
      partnerRegistrationData,
      eq(partnerRegistrationData.affiliateId, affiliateApplication.id),
    )
    .leftJoin(commissionRule, eq(partnerCommission.ruleId, commissionRule.id))
    .where(whereClause)
    .orderBy(desc(partnerCommission.createdAt))
    .limit(limitNum)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(partnerCommission)
    .leftJoin(
      affiliateApplication,
      eq(partnerCommission.affiliateId, affiliateApplication.id),
    )
    .where(whereClause);

  return {
    data: rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limitNum),
    },
  };
};

export const getCommissionByIdBackOffice = async (id) => {
  const rows = await db
    .select()
    .from(partnerCommission)
    .where(eq(partnerCommission.id, id))
    .limit(1);
  return rows[0] || null;
};

export const markCommissionPaid = async (
  id,
  { paidById, proofUrl, transactionReference },
) => {
  await db
    .update(partnerCommission)
    .set({
      status: "Paid",
      paidAt: new Date(),
      paidById: paidById || null,
      proofUrl: proofUrl || null,
      transactionReference: transactionReference || null,
      rejectedAt: null,
      rejectionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommission.id, id));
};

export const revertCommissionToPending = async (id) => {
  await db
    .update(partnerCommission)
    .set({
      status: "Pending Transfer",
      paidAt: null,
      paidById: null,
      proofUrl: null,
      transactionReference: null,
      rejectedAt: null,
      rejectionReason: null,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommission.id, id));
};

export const rejectCommission = async (id, { reason, rejectedById }) => {
  await db
    .update(partnerCommission)
    .set({
      status: "Rejected",
      rejectedAt: new Date(),
      rejectionReason: reason || null,
      paidById: rejectedById || null,
      updatedAt: new Date(),
    })
    .where(eq(partnerCommission.id, id));
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
        eq(partnerCommission.status, "Pending Transfer"),
      ),
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
        inArray(partnerLead.status, ["Won", "Closed Won"]),
      ),
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

// ==================== PERFORMANCE POLICY ====================

export const getActivePerformanceSetting = async () => {
  const rows = await db
    .select()
    .from(partnerPerformanceSetting)
    .where(eq(partnerPerformanceSetting.isActive, true))
    .orderBy(desc(partnerPerformanceSetting.updatedAt))
    .limit(1);

  if (rows[0]) return rows[0];

  const defaultSetting = {
    id: uuidv7(),
    basicSalaryAmount: 3500,
    basicSalarySalesThreshold: 35000,
    firstMonthMinimumClosedClients: 1,
    initialCommissionFullClientThreshold: 2,
    terminationGraceDays: 2,
    isActive: true,
  };
  await db.insert(partnerPerformanceSetting).values(defaultSetting);
  return defaultSetting;
};

export const updateActivePerformanceSetting = async (data) => {
  const current = await getActivePerformanceSetting();
  await db
    .update(partnerPerformanceSetting)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partnerPerformanceSetting.id, current.id));
  return await getActivePerformanceSetting();
};

export const getAffiliateLifecycle = async (affiliateId) => {
  const rows = await db
    .select({
      affiliateId: affiliateApplication.id,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      status: affiliateApplication.status,
      notes: affiliateApplication.notes,
      initialCommissionAmount: affiliateApplication.initialCommissionAmount,
      batchId: affiliateBatch.id,
      batchName: affiliateBatch.name,
      batchInitialCommissionThreshold:
        affiliateBatch.initialCommissionFullClientThreshold,
      performanceAlertSentAt: affiliateApplication.performanceAlertSentAt,
      performanceTerminationDueAt:
        affiliateApplication.performanceTerminationDueAt,
      performanceTerminatedAt: affiliateApplication.performanceTerminatedAt,
      userCreatedAt: affiliateUser.createdAt,
      userId: affiliateUser.id,
      isActive: affiliateUser.isActive,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateUser,
      eq(affiliateUser.affiliateId, affiliateApplication.id),
    )
    .leftJoin(
      affiliateBatch,
      eq(affiliateBatch.id, affiliateApplication.batchId),
    )
    .where(eq(affiliateApplication.id, affiliateId))
    .limit(1);
  return rows[0] || null;
};

export const getClosedWonStatsForPeriod = async (
  affiliateId,
  periodStart,
  periodEnd,
) => {
  const [row] = await db
    .select({
      closedClients: sql`COUNT(*)`.mapWith(Number),
      salesAmount: sql`COALESCE(SUM(${partnerLead.projectValue}), 0)`.mapWith(
        Number,
      ),
    })
    .from(partnerLead)
    .where(
      and(
        eq(partnerLead.affiliateId, affiliateId),
        eq(partnerLead.status, "Won"),
        sql`${partnerLead.lastStatusChangedAt} >= ${periodStart}`,
        sql`${partnerLead.lastStatusChangedAt} < ${periodEnd}`,
      ),
    );

  return {
    closedClients: Number(row?.closedClients || 0),
    salesAmount: Number(row?.salesAmount || 0),
  };
};

export const getPerformanceLeaderboardForPeriod = async (
  periodStart,
  periodEnd,
  limit = 10,
) => {
  return await db
    .select({
      affiliateId: affiliateApplication.id,
      partnerName: affiliateApplication.fullName,
      partnerEmail: affiliateApplication.email,
      closedClients: sql`COUNT(${partnerLead.id})`.mapWith(Number),
      salesAmount: sql`COALESCE(SUM(${partnerLead.projectValue}), 0)`.mapWith(
        Number,
      ),
    })
    .from(affiliateApplication)
    .leftJoin(
      partnerLead,
      and(
        eq(partnerLead.affiliateId, affiliateApplication.id),
        eq(partnerLead.status, "Won"),
        sql`${partnerLead.lastStatusChangedAt} >= ${periodStart}`,
        sql`${partnerLead.lastStatusChangedAt} < ${periodEnd}`,
      ),
    )
    .where(eq(affiliateApplication.status, "approved"))
    .groupBy(
      affiliateApplication.id,
      affiliateApplication.fullName,
      affiliateApplication.email,
    )
    .orderBy(
      sql`COALESCE(SUM(${partnerLead.projectValue}), 0) DESC`,
      sql`COUNT(${partnerLead.id}) DESC`,
    )
    .limit(Number(limit));
};

export const getPartnersDueForPerformanceTermination = async (
  now = new Date(),
) => {
  return await db
    .select({
      affiliateId: affiliateApplication.id,
      userId: affiliateUser.id,
      email: affiliateApplication.email,
      fullName: affiliateApplication.fullName,
      performanceTerminationDueAt:
        affiliateApplication.performanceTerminationDueAt,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateUser,
      eq(affiliateUser.affiliateId, affiliateApplication.id),
    )
    .where(
      and(
        eq(affiliateApplication.status, "approved"),
        lte(affiliateApplication.performanceTerminationDueAt, now),
        isNull(affiliateApplication.performanceTerminatedAt),
      ),
    );
};

export const markPartnerPerformanceAlert = async (affiliateId, dueAt, note) => {
  await db
    .update(affiliateApplication)
    .set({
      performanceAlertSentAt: new Date(),
      performanceTerminationDueAt: dueAt,
      notes: note,
      updatedAt: new Date(),
    })
    .where(eq(affiliateApplication.id, affiliateId));
};

export const terminatePartnerForPerformance = async (
  affiliateId,
  userId,
  reason,
) => {
  await db.transaction(async (tx) => {
    if (userId) {
      await tx
        .update(affiliateUser)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(affiliateUser.id, userId));
    }
    await tx
      .update(affiliateApplication)
      .set({
        status: "rejected",
        notes: reason,
        performanceTerminatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(affiliateApplication.id, affiliateId));
  });
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
      nextFollowUpAt: partnerLead.nextFollowUpAt,
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

  // Closed Leads (Won)
  const closedLeadsResult = await db
    .select({ count: sql`COUNT(*)` })
    .from(partnerLead)
    .where(inArray(partnerLead.status, ["Won", "Closed Won"]));

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
      nextFollowUpAt: partnerLead.nextFollowUpAt,
      updatedAt: partnerLead.updatedAt,
    })
    .from(partnerLead)
    .leftJoin(partnerService, eq(partnerLead.serviceId, partnerService.id))
    .leftJoin(
      affiliateApplication,
      eq(partnerLead.affiliateId, affiliateApplication.id),
    )
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
    .leftJoin(
      partnerService,
      eq(partnerCommission.serviceId, partnerService.id),
    )
    .leftJoin(
      affiliateApplication,
      eq(partnerCommission.affiliateId, affiliateApplication.id),
    )
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
      sql`(${likeInsensitive(affiliateApplication.fullName, search)} OR ${likeInsensitive(affiliateApplication.email, search)})`,
    );
  }
  if (status) conds.push(eq(affiliateApplication.status, status));
  if (country)
    conds.push(likeInsensitive(affiliateApplication.country, country));
  if (!conds.length) return undefined;
  return and(...conds);
};

export const getAllPartners = async ({
  page = 1,
  limit = 10,
  search,
  status,
  country,
  sort = "newest",
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const where = buildPartnerFilter({ search, status, country });
  const orderBy =
    sort === "oldest"
      ? asc(affiliateApplication.createdAt)
      : desc(affiliateApplication.createdAt);

  const data = await db
    .select({
      id: affiliateApplication.id,
      fullName: affiliateApplication.fullName,
      email: affiliateApplication.email,
      phone: affiliateApplication.phone,
      country: affiliateApplication.country,
      status: affiliateApplication.status,
      isActive: affiliateUser.isActive,
      createdAt: affiliateApplication.createdAt,
      updatedAt: affiliateApplication.updatedAt,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateUser,
      eq(affiliateUser.affiliateId, affiliateApplication.id),
    )
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
      isActive: affiliateUser.isActive,
      tokenVersion: affiliateUser.tokenVersion,
      notes: affiliateApplication.notes,
      address: partnerRegistrationData.address,
      city: partnerRegistrationData.city,
      postalCode: partnerRegistrationData.postalCode,
      bankName: partnerRegistrationData.bankName,
      bankAccountNumber: partnerRegistrationData.bankAccountNumber,
      bankAccountHolder: partnerRegistrationData.bankAccountHolder,
      createdAt: affiliateApplication.createdAt,
      updatedAt: affiliateApplication.updatedAt,
    })
    .from(affiliateApplication)
    .leftJoin(
      affiliateUser,
      eq(affiliateUser.affiliateId, affiliateApplication.id),
    )
    .leftJoin(
      partnerRegistrationData,
      eq(partnerRegistrationData.affiliateId, affiliateApplication.id),
    )
    .where(eq(affiliateApplication.id, id))
    .limit(1);

  return rows[0] || null;
};

export const updatePartner = async (id, data) => {
  const { isActive, tokenVersion, forcePasswordChange, ...applicationData } =
    data;

  await db.transaction(async (tx) => {
    if (Object.keys(applicationData).length > 0) {
      await tx
        .update(affiliateApplication)
        .set({ ...applicationData, updatedAt: new Date() })
        .where(eq(affiliateApplication.id, id));
    }

    if (
      isActive !== undefined ||
      tokenVersion !== undefined ||
      forcePasswordChange !== undefined
    ) {
      await tx
        .update(affiliateUser)
        .set({
          ...(isActive !== undefined ? { isActive } : {}),
          ...(tokenVersion !== undefined ? { tokenVersion } : {}),
          ...(forcePasswordChange !== undefined ? { forcePasswordChange } : {}),
          updatedAt: new Date(),
        })
        .where(eq(affiliateUser.affiliateId, id));
    }
  });
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
        .where(
          inArray(affiliatePasswordToken.affiliateUserId, affiliateUserIds),
        );
      await tx
        .delete(affiliateLoginLog)
        .where(inArray(affiliateLoginLog.affiliateUserId, affiliateUserIds));
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
    await tx.delete(affiliateUser).where(eq(affiliateUser.affiliateId, id));
    await tx
      .delete(affiliateApplication)
      .where(eq(affiliateApplication.id, id));
  });
};

// ==================== BACK OFFICE LEADS MGMT ====================

const buildLeadFilter = ({ search, status, affiliateId }) => {
  const conds = [];
  if (search) {
    conds.push(
      sql`(${likeInsensitive(partnerLead.name, search)} OR ${likeInsensitive(partnerLead.email, search)} OR ${likeInsensitive(partnerLead.phone, search)})`,
    );
  }
  if (status) conds.push(eq(partnerLead.status, status));
  if (affiliateId) conds.push(eq(partnerLead.affiliateId, affiliateId));
  if (!conds.length) return undefined;
  return and(...conds);
};

export const getAllLeads = async ({
  page = 1,
  limit = 10,
  search,
  status,
  affiliateId,
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const where = buildLeadFilter({ search, status, affiliateId });

  const data = await db
    .select({
      id: partnerLead.id,
      name: partnerLead.name,
      email: partnerLead.email,
      phone: partnerLead.phone,
      verticalMarketId: partnerLead.verticalMarketId,
      verticalMarketName: partnerLead.verticalMarketName,
      status: partnerLead.status,
      nextFollowUpAt: partnerLead.nextFollowUpAt,
      lastContactAt: partnerLead.lastContactAt,
      lastStatusChangedAt: partnerLead.lastStatusChangedAt,
      createdAt: partnerLead.createdAt,
      updatedAt: partnerLead.updatedAt,
      affiliateId: partnerLead.affiliateId,
      partnerName: affiliateApplication.fullName,
      partnerEmail: affiliateApplication.email,
    })
    .from(partnerLead)
    .leftJoin(
      affiliateApplication,
      eq(partnerLead.affiliateId, affiliateApplication.id),
    )
    .where(where)
    .orderBy(desc(partnerLead.createdAt))
    .limit(Number(limit))
    .offset(offset);

  const servicesByLead = await loadServicesForLeads(data.map((r) => r.id));

  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(partnerLead)
    .leftJoin(
      affiliateApplication,
      eq(partnerLead.affiliateId, affiliateApplication.id),
    )
    .where(where);

  return {
    data: data.map((r) => ({ ...r, services: servicesByLead[r.id] ?? [] })),
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
      verticalMarketId: partnerLead.verticalMarketId,
      verticalMarketName: partnerLead.verticalMarketName,
      status: partnerLead.status,
      nextFollowUpAt: partnerLead.nextFollowUpAt,
      lastContactAt: partnerLead.lastContactAt,
      lastStatusChangedAt: partnerLead.lastStatusChangedAt,
      createdAt: partnerLead.createdAt,
      updatedAt: partnerLead.updatedAt,
      affiliateId: partnerLead.affiliateId,
      partnerName: affiliateApplication.fullName,
      partnerEmail: affiliateApplication.email,
      partnerCountry: affiliateApplication.country,
    })
    .from(partnerLead)
    .leftJoin(
      affiliateApplication,
      eq(partnerLead.affiliateId, affiliateApplication.id),
    )
    .where(eq(partnerLead.id, leadId))
    .limit(1);

  if (!result[0]) return null;
  const servicesByLead = await loadServicesForLeads([leadId]);
  return { ...result[0], services: servicesByLead[leadId] ?? [] };
};

export const updateLeadBackOffice = async (leadId, data) => {
  await db
    .update(partnerLead)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partnerLead.id, leadId));
  return true;
};

export const deleteLeadBackOffice = async (leadId) => {
  await db.delete(partnerLead).where(eq(partnerLead.id, leadId));
  return true;
};

export const getLeadActivities = async (leadId) => {
  return await db
    .select({
      id: partnerLeadActivity.id,
      actorType: partnerLeadActivity.actorType,
      actorId: partnerLeadActivity.actorId,
      actionType: partnerLeadActivity.actionType,
      fromStatus: partnerLeadActivity.fromStatus,
      toStatus: partnerLeadActivity.toStatus,
      note: partnerLeadActivity.note,
      metadata: partnerLeadActivity.metadata,
      createdAt: partnerLeadActivity.createdAt,
    })
    .from(partnerLeadActivity)
    .where(eq(partnerLeadActivity.leadId, leadId))
    .orderBy(desc(partnerLeadActivity.createdAt));
};

// ==================== PARTNER SERVICES (BACK OFFICE) ====================

export const getAllServicesBackOffice = async ({
  page = 1,
  limit = 10,
  search,
}) => {
  const offset = (Number(page) - 1) * Number(limit);
  const conds = [];

  if (search) {
    conds.push(likeInsensitive(partnerService.name, search));
  }

  const where = conds.length ? and(...conds) : undefined;

  const data = await db
    .select()
    .from(partnerService)
    .where(where)
    .orderBy(desc(partnerService.createdAt))
    .limit(Number(limit))
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql`COUNT(*)`.mapWith(Number) })
    .from(partnerService)
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

export const getServiceById = async (id) => {
  const result = await db
    .select()
    .from(partnerService)
    .where(eq(partnerService.id, id))
    .limit(1);
  return result[0] || null;
};

export const createService = async (data) => {
  const id = uuidv7();
  await db.insert(partnerService).values({
    id,
    ...data,
  });
  return await getServiceById(id);
};

export const updateService = async (id, data) => {
  await db
    .update(partnerService)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(partnerService.id, id));
  return await getServiceById(id);
};

export const deleteService = async (id) => {
  const result = await db
    .delete(partnerService)
    .where(eq(partnerService.id, id));
  return result.affectedRows > 0;
};

// ==================== LEAD NOTES ====================

export const findLeadById = async (leadId) => {
  const result = await db
    .select({ id: partnerLead.id, affiliateId: partnerLead.affiliateId })
    .from(partnerLead)
    .where(eq(partnerLead.id, leadId))
    .limit(1);
  return result[0] || null;
};

export const findNotesByLeadId = async (leadId) => {
  return await db
    .select()
    .from(partnerLeadNote)
    .where(eq(partnerLeadNote.leadId, leadId))
    .orderBy(desc(partnerLeadNote.createdAt));
};

export const insertLeadNote = async ({
  id,
  leadId,
  content,
  createdByType,
}) => {
  await db
    .insert(partnerLeadNote)
    .values({ id, leadId, content, createdByType });
  const result = await db
    .select()
    .from(partnerLeadNote)
    .where(eq(partnerLeadNote.id, id))
    .limit(1);
  return result[0];
};

export const updateLeadNoteById = async (leadId, noteId, content) => {
  await db
    .update(partnerLeadNote)
    .set({ content, updatedAt: new Date() })
    .where(
      and(eq(partnerLeadNote.id, noteId), eq(partnerLeadNote.leadId, leadId)),
    );
  const result = await db
    .select()
    .from(partnerLeadNote)
    .where(eq(partnerLeadNote.id, noteId))
    .limit(1);
  return result[0] || null;
};

export const deleteLeadNoteById = async (leadId, noteId) => {
  const result = await db
    .delete(partnerLeadNote)
    .where(
      and(eq(partnerLeadNote.id, noteId), eq(partnerLeadNote.leadId, leadId)),
    );
  return result.affectedRows > 0;
};
