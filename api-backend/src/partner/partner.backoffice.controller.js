import {
    getBackOfficeDashboardStats,
    getBackOfficeRecentLeads,
    getBackOfficePendingCommissions,
} from "./partner.service.js";

const stats = async (req, res) => {
    try {
        const data = await getBackOfficeDashboardStats();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const recentLeads = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const data = await getBackOfficeRecentLeads(limit);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const pendingCommissions = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const data = await getBackOfficePendingCommissions(limit);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

export default { stats, recentLeads, pendingCommissions };
