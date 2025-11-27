import {
    getBackOfficeDashboardStats,
    getBackOfficeRecentLeads,
    getBackOfficePendingCommissions,
    getAllPartners,
    getPartnerDetail,
    updatePartner,
    deletePartner,
    getAllLeadsForBackOffice,
    getLeadDetailForBackOffice,
    updateLeadForBackOffice,
    deleteLeadForBackOffice,
    getAllServices,
    getServiceDetail,
    createNewService,
    updateServiceDetail,
    removeService,
    calculateDashboardStats,
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

const getPartnerStats = async (req, res) => {
    try {
        const data = await calculateDashboardStats(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
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

// ==================== LEADS MANAGEMENT ====================

const getAllLeads = async (req, res) => {
    try {
        const data = await getAllLeadsForBackOffice(req.query);
        res.status(200).json({ status: "success", data: data.data, pagination: data.pagination });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getLeadById = async (req, res) => {
    try {
        const data = await getLeadDetailForBackOffice(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(404).json({ status: "error", message: e.message });
    }
};

const updateLead = async (req, res) => {
    try {
        const data = await updateLeadForBackOffice(req.params.id, req.body);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const deleteLead = async (req, res) => {
    try {
        await deleteLeadForBackOffice(req.params.id);
        res.status(200).json({ status: "success", message: "Lead deleted" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

// ==================== SERVICES MANAGEMENT ====================

const getAllServicesList = async (req, res) => {
    try {
        const data = await getAllServices(req.query);
        res.status(200).json({ status: "success", data: data.data, pagination: data.pagination });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getServiceById = async (req, res) => {
    try {
        const data = await getServiceDetail(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(404).json({ status: "error", message: e.message });
    }
};

const createService = async (req, res) => {
    try {
        const data = await createNewService(req.body);
        res.status(201).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateService = async (req, res) => {
    try {
        const data = await updateServiceDetail(req.params.id, req.body);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const deleteService = async (req, res) => {
    try {
        await removeService(req.params.id);
        res.status(200).json({ status: "success", message: "Service deleted" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

export default {
    stats, recentLeads, pendingCommissions,
    getAll, getById, getPartnerStats, update, remove,
    getAllLeads, getLeadById, updateLead, deleteLead,
    getAllServicesList, getServiceById, createService, updateService, deleteService
};
