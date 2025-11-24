import {
    getLeads,
    getLeadDetail,
    createNewLead,
    updateExistingLead,
    deleteExistingLead,
} from "./partner.service.js";

// GET /leads - Get all leads with pagination and filters
const getAll = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { page, limit, status } = req.query;

        const result = await getLeads(
            affiliateId,
            { status },
            { page: parseInt(page) || 1, limit: parseInt(limit) || 10 }
        );

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

// GET /leads/:id - Get lead detail
const getById = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { id } = req.params;

        const lead = await getLeadDetail(affiliateId, id);

        res.status(200).json({
            status: "success",
            data: lead,
        });
    } catch (error) {
        res.status(404).json({
            status: "error",
            message: error.message,
        });
    }
};

// POST /leads - Create new lead
const create = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const leadData = req.body;

        const newLead = await createNewLead(affiliateId, leadData);

        res.status(201).json({
            status: "success",
            message: "Lead created successfully",
            data: newLead,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// PUT /leads/:id - Update lead
const update = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { id } = req.params;
        const leadData = req.body;

        const updatedLead = await updateExistingLead(affiliateId, id, leadData);

        res.status(200).json({
            status: "success",
            message: "Lead updated successfully",
            data: updatedLead,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

// DELETE /leads/:id - Delete lead
const remove = async (req, res) => {
    try {
        const affiliateId = req.affiliateUser.affiliateId;
        const { id } = req.params;

        await deleteExistingLead(affiliateId, id);

        res.status(200).json({
            status: "success",
            message: "Lead deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error.message,
        });
    }
};

export default {
    getAll,
    getById,
    create,
    update,
    remove,
};
