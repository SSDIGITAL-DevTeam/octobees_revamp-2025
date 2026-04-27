import {
    calculateDashboardStats,
    getAvailableServices,
    getAvailableSalesMaterials,
    getCommissions,
    getPerformanceDashboard,
    getPartnerCommissionPolicyReference,
    getPartnerCurrencyConfig,
    getPartnerTermsAndConditions,
    getRecentDashboardLeads,
    getLeadPipelineStatuses,
    getVerticalMarkets,
} from "./partner.service.js";

// GET /dashboard/stats - Get dashboard statistics
const stats = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const dashboardStats = await calculateDashboardStats(affiliateId);

        res.status(200).json({
            status: "success",
            data: dashboardStats,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET /dashboard/services - Get available services
const services = async (req, res) => {
    try {
        const availableServices = await getAvailableServices();

        res.status(200).json({
            status: "success",
            data: availableServices,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET /dashboard/materials - Get sales materials
const materials = async (req, res) => {
    try {
        const salesMaterials = await getAvailableSalesMaterials();

        res.status(200).json({
            status: "success",
            data: salesMaterials,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET /dashboard/commissions - Get commission history
const commissions = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { page, limit, type, status, period } = req.query;

        const result = await getCommissions(affiliateId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            type: type ? String(type) : undefined,
            status: status ? String(status) : undefined,
            period: period ? String(period) : undefined,
        });

        res.status(200).json({
            status: "success",
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET /dashboard/recent-leads - Get recent leads
const recentLeads = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const limit = parseInt(req.query.limit) || 5;

        const leads = await getRecentDashboardLeads(affiliateId, limit);

        res.status(200).json({
            status: "success",
            data: leads,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// GET /dashboard/performance - Get salary threshold, initial commission, and ranking
const performance = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const data = await getPerformanceDashboard(affiliateId);

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const termsAndConditions = async (req, res) => {
    try {
        const data = await getPartnerTermsAndConditions();

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const currencyConfig = async (req, res) => {
    try {
        const data = await getPartnerCurrencyConfig();

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const commissionPolicy = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const data = await getPartnerCommissionPolicyReference(affiliateId);

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const pipelineStatuses = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === "true";
        const data = await getLeadPipelineStatuses({ includeInactive });

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

const verticalMarkets = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === "true";
        const data = await getVerticalMarkets({ includeInactive });

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

export default {
    stats,
    services,
    materials,
    commissions,
    recentLeads,
    performance,
    currencyConfig,
    termsAndConditions,
    commissionPolicy,
    pipelineStatuses,
    verticalMarkets,
};
