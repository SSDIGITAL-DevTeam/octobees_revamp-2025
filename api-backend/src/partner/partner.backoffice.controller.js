import {
    getBackOfficeDashboardStats,
    getBackOfficeRecentLeads,
    getBackOfficePendingCommissions,
    getAllPartners,
    getPartnerDetail,
    updatePartner,
    deletePartner,
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

const getAll = async (req, res) => {
    try {
        const data = await getAllPartners(req.query);
        res.status(200).json({ status: "success", data: data.data, pagination: data.pagination });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getById = async (req, res) => {
    try {
        const data = await getPartnerDetail(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(404).json({ status: "error", message: e.message });
    }
};

const update = async (req, res) => {
    try {
        const data = await updatePartner(req.params.id, req.body);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const remove = async (req, res) => {
    try {
        await deletePartner(req.params.id);
        res.status(200).json({ status: "success", message: "Partner deleted" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

export default { stats, recentLeads, pendingCommissions, getAll, getById, update, remove };
