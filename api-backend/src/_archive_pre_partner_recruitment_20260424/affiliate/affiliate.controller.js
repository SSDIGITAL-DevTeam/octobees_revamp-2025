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
  resendApprovalEmail,
  updateAffiliate,
  revertAffiliateFinalDecision,
  approveInterviewForTraining,
  processAffiliateToOnboard,
} from "./affiliate.service.js";
import { unlink } from "node:fs/promises";

const removeUploadedFile = async (file) => {
  if (!file?.path) return;
  try {
    await unlink(file.path);
  } catch {
    // Best effort cleanup only.
  }
};

const create = async (req, res) => {
  try {
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const payload = resumeUrl ? { ...req.body, resumeUrl } : req.body;
    const created = await createAffiliate(payload, req);
    res.status(201).json({
      status: "success",
      message: "Application submitted. We will review it shortly.",
      data: created,
    });
  } catch (e) {
    await removeUploadedFile(req.file);
    const statusCode =
      e.statusCode || (e.code === "BATCH_CAPACITY_EXHAUSTED" ? 409 : 400);
    res.status(statusCode).json({
      status: "error",
      code: e.code,
      message: e.message,
      data: {
        batchId: e.batchId,
        registrationQuota: e.registrationQuota,
        applicationCount: e.applicationCount,
        remainingSlots: e.remainingSlots,
      },
    });
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
    res
      .status(200)
      .json({
        status: "success",
        message: result?.message ?? "Application updated.",
        data: result,
      });
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
    const rejectionNote =
      req.body?.rejectionNote || req.body?.rejection_note || req.body?.notes;
    const result = await rejectAffiliate(
      req.params.id,
      rejectionNote,
      reviewerId,
    );
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

const approveInterview = async (req, res) => {
  try {
    const reviewerId = req.user?.id ?? null;
    const notes = req.body?.notes || null;
    const result = await approveInterviewForTraining(
      req.params.id,
      reviewerId,
      notes,
    );
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

const processToOnboard = async (req, res) => {
  try {
    const reviewerId = req.user?.id ?? null;
    const result = await processAffiliateToOnboard(req.params.id, reviewerId);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

const remove = async (req, res) => {
  try {
    await deleteAffiliate(req.params.id);
    res
      .status(200)
      .json({ status: "success", message: "Application deleted." });
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

const resendEmail = async (req, res) => {
  try {
    const result = await resendApprovalEmail(req.params.id, req.body?.step);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

const revertFinalDecision = async (req, res) => {
  try {
    const result = await revertAffiliateFinalDecision(req.params.id);
    res.status(200).json({ status: "success", data: result });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await updateAffiliate(req.params.id, req.body);
    res.status(200).json({ status: "success", data: updated });
  } catch (e) {
    res.status(400).json({ status: "error", message: e.message });
  }
};

export default {
  create,
  getall,
  getid,
  review,
  remove,
  exportCsv,
  stats,
  approve,
  reject,
  resendEmail,
  update,
  revertFinalDecision,
  approveInterview,
  processToOnboard,
};
