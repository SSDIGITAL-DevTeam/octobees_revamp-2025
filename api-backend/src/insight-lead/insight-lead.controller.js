import { getAllInsightLeads, createInsightLead, getInsightLeadById, deleteInsightLeadById } from "./insight-lead.service.js";
import { sendInsightPdfEmail } from "../lead/lead.mailer.js";
import logger from "../../utils/logger.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getall = async (req, res) => {
    try {
        let { page = 1, limit = 10, orderBy, search } = req.query;
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

        const data = await getAllInsightLeads({ page, limit, search, orderBy: orderByParams });
        res.status(200).json(data);
    } catch (error) {
        logger.error(`GET insight leads error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const getid = async (req, res) => {
    try {
        const data = await getInsightLeadById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        logger.error(`GET insight lead /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const create = async (req, res) => {
    try {
        const { name, email, phone, from, pdfPath, blogTitle } = req.body;

        if (!name?.trim() || !email?.trim() || !phone?.trim() || !from?.trim()) {
            return res.status(400).json({ error: "Required fields are missing" });
        }

        await createInsightLead({ name, email, phone, from });

        if (pdfPath?.trim() && blogTitle?.trim()) {
            const absolutePdfPath = path.join(__dirname, "../../upload", pdfPath);
            sendInsightPdfEmail({ to: email, name, pdfFilePath: absolutePdfPath, blogTitle })
                .catch((err) => logger.error({
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
        logger.error(`POST insight lead error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        await deleteInsightLeadById(req.params.id);
        res.status(200).json({ message: "Delete Insight Lead Successfully" });
    } catch (error) {
        logger.error(`DELETE insight lead /:id error: ${error.message}`);
        res.status(400).json({ error: error.message });
    }
};

export default { getall, getid, create, remove };
