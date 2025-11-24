import {
    createAffiliate,
    getAllAffiliates,
    getAffiliate,
    reviewAffiliate,
    deleteAffiliate,
    exportAffiliateCsv,
    getAffiliateStats,
    approveAffiliate,
    rejectAffiliate,
} from "./affiliate.service.js";

const create = async (req, res) => {
    try {
        const created = await createAffiliate(req.body, req);
        res.status(201).json({
            status: "success",
            message: "Application submitted. We will review it shortly.",
            data: created,
        });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getall = async (req, res) => {
    try {
        const result = await getAllAffiliates(req.query);
        res.status(200).json({
            status: "success",
            data: result.data,
            pagination: {
                currentPage: result.page,
                perPage: result.limit,
                total: result.total,
                totalPages: result.totalPages,
            },
        });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getid = async (req, res) => {
    try {
        const data = await getAffiliate(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(404).json({ status: "error", message: e.message });
    }
};

const review = async (req, res) => {
    try {
        const reviewerId = req.user?.id ?? req.body?.reviewerId ?? null;
        const result = await reviewAffiliate(req.params.id, req.body, reviewerId);
        res.status(200).json({ status: "success", message: result?.message ?? "Application updated.", data: result });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const approve = async (req, res) => {
    try {
        const reviewerId = req.user?.id ?? null;
        const result = await approveAffiliate(req.params.id, reviewerId);
        res.status(200).json({ status: "success", data: result });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const reject = async (req, res) => {
    try {
        const reviewerId = req.user?.id ?? null;
        const rejectionNote = req.body?.rejectionNote || req.body?.rejection_note || req.body?.notes;
        const result = await rejectAffiliate(req.params.id, rejectionNote, reviewerId);
        res.status(200).json({ status: "success", data: result });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const remove = async (req, res) => {
    try {
        await deleteAffiliate(req.params.id);
        res.status(200).json({ status: "success", message: "Application deleted." });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const exportCsv = async (req, res) => {
    try {
        const { csv, filename } = await exportAffiliateCsv(req.query);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.status(200).send(csv);
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const stats = async (_req, res) => {
    try {
        const data = await getAffiliateStats();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

export default { create, getall, getid, review, remove, exportCsv, stats, approve, reject };
