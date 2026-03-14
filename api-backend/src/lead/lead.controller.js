import {
    createLead,
    deleteLeadById,
    getAllLeads,
    getLeadById,
    updateLead,
} from "./lead.service.js";
import logger from "../../utils/logger.js";

const getall = async (req, res) => {
    try {
        let { page = 1, limit = 10, orderBy, search, createdAt } = req.query;
        page = Math.max(parseInt(page) || 1, 1);
        limit = Math.max(parseInt(limit) || 10, 1);

        let orderByParams = [];
        if (orderBy) {
            orderByParams = String(orderBy)
                .split(",")
                .map((order) => {
                    const [field, dir] = order.split(":");
                    return { [field]: dir === "desc" ? "desc" : "asc" };
                });
        }

        const filters = {
            page,
            limit,
            search,
            orderBy: orderByParams,
            createdAt,
        };

        const data = await getAllLeads(filters);
        res.status(200).json(data);
    } catch (error) {
        logger.error(`GET / error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const getid = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getLeadById(id);
        res.status(200).json(data);
    } catch (error) {
        logger.error(`GET /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        let { name, email, phone, business, companyName, from, referralCode } = req.body;

        // If email is not provided, generate a dummy one since it's required in DB
        if (!email?.trim()) {
            email = `no-email-${Date.now()}@example.com`;
        }

        if (
            !name?.trim() ||
            !email?.trim() ||
            !phone?.trim() ||
            !from?.trim()
        ) {
            return res.status(400).json({ error: "Required fields are missing" });
        }
        await createLead({ name, email, phone, business, companyName, from, referralCode });

        res.status(201).json({ message: "Lead created successfully" });
    } catch (error) {
        logger.error(`POST / error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const id = req.params.id;
        await deleteLeadById(id);
        res.status(200).json({ message: "Delete Lead Successfully" });
    } catch (error) {
        logger.error(`DELETE /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const put = async (req, res) => {
    try {
        const id = req.params.id;
        await updateLead(id, req.body);
        res.status(200).json({ message: "Lead edited successfully" });
    } catch (error) {
        logger.error(`PUT /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const patch = async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error("Nothing to update");
        }
        await updateLead(id, req.body);
        res.status(200).json({ message: "Lead edited successfully" });
    } catch (error) {
        logger.error(`PATCH /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

export default { getall, getid, create, remove, put, patch };
