import { v4 as uuidv4 } from "uuid";
import {
    createBatch,
    updateBatch,
    syncBatchInitialCommissionToApplications,
    getBatchById,
    listBatches,
    countBatches,
    getActiveBatch,
    removeBatch,
    saveBatchRecruitmentMeta,
} from "./batch.repository.js";
import { broadcastBatchUpdate } from "./batch-sse.js";

const normalizeStartOfDay = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid start date");
    }
    date.setHours(0, 0, 0, 0);
    return date;
};

const normalizeEndOfDay = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        throw new Error("Invalid end date");
    }
    date.setHours(23, 59, 59, 999);
    return date;
};

const normalizeBoolean = (value, fallback = false) => {
    if (value === undefined) return fallback;
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
    }
    return Boolean(value);
};

const normalizeExamPassingScore = (value, fallback = 70) => {
    if (value === undefined || value === null || value === "") return fallback;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1 || parsed > 100) {
        throw new Error("Exam passing score must be between 1 and 100");
    }

    return Math.round(parsed);
};

const normalizeInitialCommissionAmount = (value, fallback = 0) => {
    if (value === undefined || value === null || value === "") return fallback;

    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
        throw new Error("Initial commission amount must be 0 or greater");
    }

    return parsed;
};

const normalizeInitialCommissionThreshold = (value, fallback = 2) => {
    if (value === undefined || value === null || value === "") return fallback;

    const parsed = Math.round(Number(value));
    if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error("Initial commission threshold must be at least 1");
    }

    return parsed;
};

const normalizeInitialCommissionTiers = (value, fallback = []) => {
    if (value === undefined) return fallback;
    if (value === null || value === "") return [];

    const raw = Array.isArray(value)
        ? value
        : typeof value === "string"
            ? (() => {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            })()
            : [];

    const normalized = raw
        .map((item) => {
            const closedClients = Math.round(
                Number(item?.closedClients ?? item?.targetClients),
            );
            const amount = Number(item?.amount);

            if (!Number.isFinite(closedClients) || closedClients < 1) {
                throw new Error("Each initial commission tier must target at least 1 closed client");
            }

            if (!Number.isFinite(amount) || amount < 0) {
                throw new Error("Each initial commission tier amount must be 0 or greater");
            }

            const normalizedTier = {
                closedClients,
                amount,
            };

            if (
                item?.conditions &&
                typeof item.conditions === "object" &&
                Array.isArray(item.conditions.groups)
            ) {
                normalizedTier.conditions = item.conditions;
            }

            return normalizedTier;
        })
        .sort((a, b) => a.closedClients - b.closedClients);

    const unique = normalized.filter(
        (item, index, list) =>
            list.findIndex(
                (candidate) => candidate.closedClients === item.closedClients,
            ) === index,
    );

    return unique;
};

const deriveInitialCommissionFromTiers = (tiers = []) => {
    if (!Array.isArray(tiers) || tiers.length === 0) {
        return {
            initialCommissionAmount: 0,
            initialCommissionFullClientThreshold: 2,
        };
    }

    const topTier = tiers[tiers.length - 1];
    return {
        initialCommissionAmount: Number(topTier.amount || 0),
        initialCommissionFullClientThreshold: Number(topTier.closedClients || 2),
    };
};

const normalizeQuestionIds = (value) => {
    if (value === undefined) return undefined;
    if (value === null || value === "") return [];

    const raw = Array.isArray(value)
        ? value
        : typeof value === "string"
            ? (() => {
                try {
                    const parsed = JSON.parse(value);
                    return Array.isArray(parsed) ? parsed : [value];
                } catch {
                    return value.split(",").map((item) => item.trim());
                }
            })()
            : [];

    return [...new Set(raw.map((item) => String(item || "").trim()).filter(Boolean))];
};

export const create = async (req, res) => {
    try {
        const {
            name,
            startDate,
            endDate,
            status,
            registrationQuota,
            autoCurateOnQuotaReached,
            autoCurateOnBatchClose,
            initialCommissionAmount,
            initialCommissionFullClientThreshold,
            examPassingScore,
            trainingVideoUrl,
            trainingPdfUrl,
            interviewQuestionIds,
            examQuestionIds,
            initialCommissionTiers,
            role,
            landingPageLink,
            trainingMaterialIds,
        } = req.body;
        const normalizedStartDate = normalizeStartOfDay(startDate);
        const normalizedEndDate = normalizeEndOfDay(endDate);

        if (normalizedEndDate < normalizedStartDate) {
            return res.status(400).json({ statusCode: 400, message: "End date cannot be earlier than start date" });
        }

        const normalizedInitialCommissionTiers = normalizeInitialCommissionTiers(
            initialCommissionTiers,
            [],
        );
        const derivedInitialCommission =
            normalizedInitialCommissionTiers.length > 0
                ? deriveInitialCommissionFromTiers(normalizedInitialCommissionTiers)
                : {
                    initialCommissionAmount: normalizeInitialCommissionAmount(initialCommissionAmount, 0),
                    initialCommissionFullClientThreshold: normalizeInitialCommissionThreshold(initialCommissionFullClientThreshold, 2),
                };

        const id = uuidv4();
        await createBatch({
            id,
            name,
            startDate: normalizedStartDate,
            endDate: normalizedEndDate,
            status: status || 'draft',
            registrationQuota: Number(registrationQuota || 0),
            autoCurateOnQuotaReached: normalizeBoolean(autoCurateOnQuotaReached, false),
            autoCurateOnBatchClose: normalizeBoolean(autoCurateOnBatchClose, true),
            initialCommissionAmount: derivedInitialCommission.initialCommissionAmount,
            initialCommissionFullClientThreshold: derivedInitialCommission.initialCommissionFullClientThreshold,
            examPassingScore: normalizeExamPassingScore(examPassingScore, 70),
            trainingVideoUrl,
            trainingPdfUrl,
            interviewQuestionIds: normalizeQuestionIds(interviewQuestionIds) ?? [],
            examQuestionIds: normalizeQuestionIds(examQuestionIds) ?? [],
        });

        await saveBatchRecruitmentMeta(id, {
            role,
            landingPageLink,
            trainingMaterialIds,
            initialCommissionTiers: normalizedInitialCommissionTiers,
        });

        // Broadcast batch change to connected SSE clients
        const activeBatch = await getActiveBatch();
        broadcastBatchUpdate(activeBatch);

        res.status(201).json({
            statusCode: 201,
            message: "Batch created successfully",
            data: { id }
        });
    } catch (e) {
        req.log.error(e);
        if (
            e.message === "Exam passing score must be between 1 and 100" ||
            e.message === "Initial commission amount must be 0 or greater" ||
            e.message === "Initial commission threshold must be at least 1" ||
            e.message === "Each initial commission tier must target at least 1 closed client" ||
            e.message === "Each initial commission tier amount must be 0 or greater"
        ) {
            return res.status(400).json({ statusCode: 400, message: e.message });
        }
        res.status(500).json({ statusCode: 500, message: e.message, stack: e.stack });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            startDate,
            endDate,
            status,
            registrationQuota,
            autoCurateOnQuotaReached,
            autoCurateOnBatchClose,
            initialCommissionAmount,
            initialCommissionFullClientThreshold,
            examPassingScore,
            trainingVideoUrl,
            trainingPdfUrl,
            interviewQuestionIds,
            examQuestionIds,
            initialCommissionTiers,
            role,
            landingPageLink,
            trainingMaterialIds,
        } = req.body;

        const existing = await getBatchById(id);
        if (!existing) {
            return res.status(404).json({ statusCode: 404, message: "Batch not found" });
        }

        const normalizedInitialCommissionTiers = normalizeInitialCommissionTiers(
            initialCommissionTiers,
            existing.initialCommissionTiers || [],
        );
        const hasInitialCommissionTierUpdate =
            initialCommissionTiers !== undefined;

        const data = {};
        if (name !== undefined) data.name = name;
        if (startDate !== undefined) data.startDate = normalizeStartOfDay(startDate);
        if (endDate !== undefined) data.endDate = normalizeEndOfDay(endDate);
        if (status !== undefined) data.status = status;
        if (registrationQuota !== undefined) data.registrationQuota = Number(registrationQuota || 0);
        if (autoCurateOnQuotaReached !== undefined) data.autoCurateOnQuotaReached = normalizeBoolean(autoCurateOnQuotaReached, false);
        if (autoCurateOnBatchClose !== undefined) data.autoCurateOnBatchClose = normalizeBoolean(autoCurateOnBatchClose, true);
        if (hasInitialCommissionTierUpdate) {
            const derivedInitialCommission = deriveInitialCommissionFromTiers(
                normalizedInitialCommissionTiers,
            );
            data.initialCommissionAmount = derivedInitialCommission.initialCommissionAmount;
            data.initialCommissionFullClientThreshold =
                derivedInitialCommission.initialCommissionFullClientThreshold;
        } else {
            if (initialCommissionAmount !== undefined) data.initialCommissionAmount = normalizeInitialCommissionAmount(initialCommissionAmount, existing.initialCommissionAmount ?? 0);
            if (initialCommissionFullClientThreshold !== undefined) data.initialCommissionFullClientThreshold = normalizeInitialCommissionThreshold(initialCommissionFullClientThreshold, existing.initialCommissionFullClientThreshold ?? 2);
        }
        if (examPassingScore !== undefined) data.examPassingScore = normalizeExamPassingScore(examPassingScore, existing.examPassingScore ?? 70);
        if (trainingVideoUrl !== undefined) data.trainingVideoUrl = trainingVideoUrl;
        if (trainingPdfUrl !== undefined) data.trainingPdfUrl = trainingPdfUrl;
        if (interviewQuestionIds !== undefined) data.interviewQuestionIds = normalizeQuestionIds(interviewQuestionIds);
        if (examQuestionIds !== undefined) data.examQuestionIds = normalizeQuestionIds(examQuestionIds);

        const effectiveStartDate = data.startDate || new Date(existing.startDate);
        const effectiveEndDate = data.endDate || new Date(existing.endDate);
        if (effectiveEndDate < effectiveStartDate) {
            return res.status(400).json({ statusCode: 400, message: "End date cannot be earlier than start date" });
        }

        await updateBatch(id, data);
        if (
            role !== undefined ||
            landingPageLink !== undefined ||
            trainingMaterialIds !== undefined ||
            initialCommissionTiers !== undefined
        ) {
            await saveBatchRecruitmentMeta(id, {
                role,
                landingPageLink,
                trainingMaterialIds,
                initialCommissionTiers: normalizedInitialCommissionTiers,
            });
        }
        if (data.initialCommissionAmount !== undefined) {
            await syncBatchInitialCommissionToApplications(id, data.initialCommissionAmount);
        }

        if ((data.status === 'closed' || effectiveEndDate < new Date()) && (data.autoCurateOnBatchClose ?? existing.autoCurateOnBatchClose)) {
            const { queueBatchScreening } = await import("../assessment/exam.service.js");
            queueBatchScreening({
                batchIds: [id],
                source: "batch_closed_or_expired",
            });
        }

        // Broadcast batch change to connected SSE clients
        const activeBatch = await getActiveBatch();
        broadcastBatchUpdate(activeBatch);

        res.status(200).json({
            statusCode: 200,
            message: "Batch updated successfully"
        });
    } catch (e) {
        req.log.error(e);
        if (
            e.message === "Exam passing score must be between 1 and 100" ||
            e.message === "Initial commission amount must be 0 or greater" ||
            e.message === "Initial commission threshold must be at least 1" ||
            e.message === "Each initial commission tier must target at least 1 closed client" ||
            e.message === "Each initial commission tier amount must be 0 or greater" ||
            e.message === "Invalid start date" ||
            e.message === "Invalid end date"
        ) {
            return res.status(400).json({ statusCode: 400, message: e.message });
        }
        res.status(500).json({ statusCode: 500, message: "Internal server error" });
    }
};

export const getList = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, status, sort } = req.query;
        const result = await listBatches({ page, limit, search, status, sort });
        const total = await countBatches({ search, status });
        
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: result.data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit)
            }
        });
    } catch (e) {
        req.log.error(e);
        res.status(500).json({ statusCode: 500, message: e.message, stack: e.stack });
    }
};

export const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const batch = await getBatchById(id);
        if (!batch) {
            return res.status(404).json({ statusCode: 404, message: "Batch not found" });
        }
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: batch
        });
    } catch (e) {
        req.log.error(e);
        res.status(500).json({ statusCode: 500, message: e.message, stack: e.stack });
    }
};

export const currentOpenBatch = async (req, res) => {
    try {
        const batch = await getActiveBatch();
        res.status(200).json({
            statusCode: 200,
            message: "Success",
            data: batch || null
        });
    } catch (e) {
        req.log.error(e);
        res.status(500).json({ statusCode: 500, message: e.message, stack: e.stack });
    }
};

export const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await getBatchById(id);
        if (!existing) {
            return res.status(404).json({ statusCode: 404, message: "Batch not found" });
        }
        await removeBatch(id);
        res.status(200).json({
            statusCode: 200,
            message: "Batch deleted successfully"
        });
    } catch (e) {
        req.log.error(e);
        if (e.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ statusCode: 400, message: "Cannot delete batch, it is already assigned to active affiliates." });
        }
        res.status(500).json({ statusCode: 500, message: e.message, stack: e.stack });
    }
};
