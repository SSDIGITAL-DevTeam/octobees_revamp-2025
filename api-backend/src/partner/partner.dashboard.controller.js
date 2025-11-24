import {
    calculateDashboardStats,
    getAvailableServices,
    getCommissions,
    getRecentDashboardLeads,
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

// GET /dashboard/commissions - Get commission history
const commissions = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { page, limit } = req.query;

        const result = await getCommissions(affiliateId, {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
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

export default {
    stats,
    services,
    commissions,
    recentLeads,
};
