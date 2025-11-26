import {
    getAllPartnerServices,
    getPartnerServiceById,
    getPartnerLeads,
    getLeadById,
    createLead,
    updateLead,
    deleteLead,
    getCommissionHistory,
    getDashboardStats,
    getRecentLeads,
    getGlobalDashboardStats,
    getAllRecentLeads,
    getAllPendingCommissions,
    getAllPartners as getAllPartnersRepo,
    getPartnerById as getPartnerByIdRepo,
    updatePartner as updatePartnerRepo,
    deletePartner as deletePartnerRepo,
    getAllLeads,
    getLeadByIdBackOffice,
    updateLeadBackOffice,
    deleteLeadBackOffice,
    getAllServicesBackOffice,
    getServiceById,
    createService,
    updateService,
    deleteService,
} from "./partner.repository.js";
import { v4 as uuidv7 } from "uuid";

// ==================== SERVICES ====================

export const getAvailableServices = async () => {
    return await getAllPartnerServices();
};

// ==================== LEADS ====================

export const getLeads = async (affiliateId, filters = {}, pagination = {}) => {
    const { page = 1, limit = 10, status } = { ...filters, ...pagination };
    return await getPartnerLeads(affiliateId, { page, limit, status });
};

export const getLeadDetail = async (affiliateId, leadId) => {
    const lead = await getLeadById(leadId, affiliateId);
    if (!lead) {
        throw new Error("Lead not found or you don't have permission to access it");
    }
    return lead;
};

export const createNewLead = async (affiliateId, leadData) => {
    const serviceId = leadData.serviceId || leadData.service_id;
    const projectValue = leadData.projectValue || leadData.project_value;

    // Validate required fields
    if (!leadData.name || !leadData.email || !leadData.phone || !serviceId) {
        throw new Error("Missing required fields: name, email, phone, serviceId");
    }

    // Validate service exists
    const service = await getPartnerServiceById(serviceId);
    if (!service) {
        throw new Error("Invalid service ID");
    }

    // Create lead
    const data = {
        id: uuidv7(),
        affiliateId,
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        serviceId: serviceId,
        projectValue: projectValue || 0,
        status: leadData.status || "Lead Created",
        remark: leadData.remark || null,
    };

    await createLead(data);
    return data;
};

export const updateExistingLead = async (affiliateId, leadId, leadData) => {
    // Check if lead exists and belongs to affiliate
    const existingLead = await getLeadById(leadId, affiliateId);
    if (!existingLead) {
        throw new Error("Lead not found or you don't have permission to update it");
    }

    const serviceId = leadData.serviceId || leadData.service_id;
    const projectValue = leadData.projectValue || leadData.project_value;

    // Validate service if provided
    if (serviceId) {
        const service = await getPartnerServiceById(serviceId);
        if (!service) {
            throw new Error("Invalid service ID");
        }
    }

    // Update lead
    const updateData = {};
    if (leadData.name !== undefined) updateData.name = leadData.name;
    if (leadData.email !== undefined) updateData.email = leadData.email;
    if (leadData.phone !== undefined) updateData.phone = leadData.phone;
    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (projectValue !== undefined) updateData.projectValue = projectValue;
    if (leadData.status !== undefined) updateData.status = leadData.status;
    if (leadData.remark !== undefined) updateData.remark = leadData.remark;

    const success = await updateLead(leadId, affiliateId, updateData);
    if (!success) {
        throw new Error("Failed to update lead");
    }

    return await getLeadById(leadId, affiliateId);
};

export const deleteExistingLead = async (affiliateId, leadId) => {
    // Check if lead exists and belongs to affiliate
    const existingLead = await getLeadById(leadId, affiliateId);
    if (!existingLead) {
        throw new Error("Lead not found or you don't have permission to delete it");
    }

    const success = await deleteLead(leadId, affiliateId);
    if (!success) {
        throw new Error("Failed to delete lead");
    }

    return true;
};

// ==================== COMMISSIONS ====================

export const getCommissions = async (affiliateId, pagination = {}) => {
    const { page = 1, limit = 10 } = pagination;
    return await getCommissionHistory(affiliateId, { page, limit });
};

// ==================== DASHBOARD ====================

export const calculateDashboardStats = async (affiliateId) => {
    const stats = await getDashboardStats(affiliateId);

    // Format for frontend
    return {
        totalCommission: {
            value: `IDR ${stats.totalCommission.toLocaleString('id-ID')}`,
            raw: stats.totalCommission,
        },
        pendingCommission: {
            value: `IDR ${stats.pendingCommission.toLocaleString('id-ID')}`,
            raw: stats.pendingCommission,
            count: stats.pendingCount,
        },
        totalLeads: {
            value: stats.totalLeads.toString(),
            raw: stats.totalLeads,
        },
        closedLeads: {
            value: stats.closedLeads.toString(),
            raw: stats.closedLeads,
            conversionRate: `${stats.conversionRate}%`,
        },
    };
};

export const getRecentDashboardLeads = async (affiliateId, limit = 5) => {
    return await getRecentLeads(affiliateId, limit);
};

// ==================== PROFILE ====================

export const updateAffiliateProfile = async (affiliateId, profileData) => {
    // This would typically update the affiliate_application table
    // For now, we'll just validate the data
    const allowedFields = ['fullName', 'phone', 'country'];
    const updateData = {};

    // Support snake_case
    if (profileData.full_name) profileData.fullName = profileData.full_name;

    for (const field of allowedFields) {
        if (profileData[field] !== undefined) {
            updateData[field] = profileData[field];
        }
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("No valid fields to update");
    }

    // TODO: Implement actual update to affiliate_application table
    // For now, return success
    return { success: true, message: "Profile updated successfully" };
};

// ==================== BACK OFFICE ====================

export const getBackOfficeDashboardStats = async () => {
    const stats = await getGlobalDashboardStats();

    // Calculate conversion rate (Closed Leads / Total Leads)
    // Note: The image shows "32% conversion" under Closed Leads.
    // Assuming calculation is Closed / Total * 100
    const conversionRate =
        stats.totalLeads > 0
            ? Math.round((stats.closedLeads / stats.totalLeads) * 100)
            : 0;

    return {
        totalLeads: {
            value: stats.totalLeads,
            subtext: "+3 this month", // Placeholder or implement monthly diff
        },
        activePartners: {
            value: stats.activePartners,
            subtext: "All verified",
        },
        closedLeads: {
            value: stats.closedLeads,
            subtext: `${conversionRate}% conversion`,
        },
        pendingCommission: {
            value: `IDR ${stats.pendingCommission.toLocaleString("id-ID")}`,
            subtext: `${stats.pendingCommissionCount} pending`,
        },
    };
};

export const getBackOfficeRecentLeads = async (limit = 5) => {
    return await getAllRecentLeads(limit);
};

export const getBackOfficePendingCommissions = async (limit = 5) => {
    return await getAllPendingCommissions(limit);
};

// ==================== BACK OFFICE PARTNER MGMT ====================

const trim = (val) => (val == null ? val : String(val).trim());

export const getAllPartners = async (query = {}) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = trim(query.search) || undefined;
    const status = trim(query.status) || undefined;
    const country = trim(query.country) || undefined;
    const sort = (trim(query.sort) || "newest").toLowerCase();
    const allowedStatus = ["pending", "approved", "rejected"];
    if (status && !allowedStatus.includes(status)) {
        throw new Error("Invalid status filter");
    }
    return await getAllPartnersRepo({
        page,
        limit,
        search,
        status,
        country,
        sort,
    });
};

export const getPartnerDetail = async (id) => {
    const data = await getPartnerByIdRepo(id);
    if (!data) throw new Error("Partner not found");
    return data;
};

export const updatePartner = async (id, raw = {}) => {
    const existing = await getPartnerByIdRepo(id);
    if (!existing) throw new Error("Partner not found");

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

    if (payload.phone !== undefined || payload.countryCode !== undefined) {
        const cc = (payload.countryCode ?? existing.countryCode ?? "").replace(/^\+/, "");
        const ph = (payload.phone ?? existing.phone ?? "").replace(/\D+/g, "");
        payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;
    }

    if (!Object.keys(payload).length) throw new Error("No valid fields to update");

    await updatePartnerRepo(id, payload);
    return await getPartnerByIdRepo(id);
};

export const deletePartner = async (id) => {
    const existing = await getPartnerByIdRepo(id);
    if (!existing) throw new Error("Partner not found");
    await deletePartnerRepo(id);
    return true;
};

// ==================== BACK OFFICE LEADS MGMT ====================

export const getAllLeadsForBackOffice = async (query = {}) => {
    const { page = 1, limit = 10, search, status, affiliateId } = query;
    return await getAllLeads({ page, limit, search, status, affiliateId });
};

export const getLeadDetailForBackOffice = async (id) => {
    const lead = await getLeadByIdBackOffice(id);
    if (!lead) throw new Error("Lead not found");
    return lead;
};

export const updateLeadForBackOffice = async (id, data) => {
    await updateLeadBackOffice(id, data);
    return await getLeadByIdBackOffice(id);
};

export const deleteLeadForBackOffice = async (id) => {
    const lead = await getLeadByIdBackOffice(id);
    if (!lead) throw new Error("Lead not found");
    await deleteLeadBackOffice(id);
    return true;
};

// ==================== PARTNER SERVICES (BACK OFFICE) ====================

export const getAllServices = async (query = {}) => {
    const { page = 1, limit = 10, search } = query;
    return await getAllServicesBackOffice({ page, limit, search });
};

export const getServiceDetail = async (id) => {
    const service = await getServiceById(id);
    if (!service) throw new Error("Service not found");
    return service;
};

export const createNewService = async (data) => {
    // Validate required fields
    if (!data.name || data.commissionPercentage === undefined || !data.description) {
        throw new Error("Missing required fields: name, commissionPercentage, description");
    }
    return await createService(data);
};

export const updateServiceDetail = async (id, data) => {
    const service = await getServiceById(id);
    if (!service) throw new Error("Service not found");
    return await updateService(id, data);
};

export const removeService = async (id) => {
    const service = await getServiceById(id);
    if (!service) throw new Error("Service not found");
    await deleteService(id);
    return true;
};
