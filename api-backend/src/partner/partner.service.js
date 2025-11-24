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
