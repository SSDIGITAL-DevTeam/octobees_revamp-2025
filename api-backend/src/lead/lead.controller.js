import {
    createLead,
    deleteLeadById,
    getAllLeads,
    getLeadById,
    updateLead,
} from "./lead.service.js";
import { sendInsightPdfEmail } from "./lead.mailer.js";
import logger from "../../utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";
import voucherService from "../voucher/voucher.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getall = async (req, res) => {
    try {
        let { page = 1, limit = 10, orderBy, search, createdAt, fromPrefix, status } = req.query;
        page = Math.max(parseInt(page) || 1, 1);
        if (limit !== "all") {
            limit = Math.max(parseInt(limit) || 10, 1);
        }

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
            fromPrefix,
            status,
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
        let { name, email, phone, business, companyName, from, referralCode, pdfPath, blogTitle, message, voucherCode, status } = req.body;

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
        await createLead({ name, email, phone, business: business || '', companyName: companyName || '', from, referralCode, message: message || '', voucherCode: voucherCode || null, status: status || 'new' });

        if (voucherCode) {
            await voucherService.incrementVoucherUsage(voucherCode);
        }

        if (pdfPath?.trim() && blogTitle?.trim()) {
            const absolutePdfPath = path.join(__dirname, "../../upload", pdfPath);
            sendInsightPdfEmail({
                to: email,
                name,
                pdfFilePath: absolutePdfPath,
                blogTitle,
            }).catch((err) => logger.error({
                code: err.code,
                command: err.command,
                response: err.response,
                responseCode: err.responseCode,
                pdfPath: absolutePdfPath,
                to: email,
            }, `PDF email failed: ${err.message}`));
        }

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
