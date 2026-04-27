import * as ruleRepo from "./commission-rule.repository.js";
import { evaluateManualRule } from "./commission-rule.engine.js";

import {
    getBackOfficeDashboardStats,
    getBackOfficeRecentLeads,
    getBackOfficePendingCommissions,
    getAllPartners,
    getPartnerDetail,
    updatePartner,
    deletePartner,
    deactivatePartner,
    sendPartnerResetPasswordEmail,
    getAllLeadsForBackOffice,
    getLeadDetailForBackOffice,
    getLeadActivitiesForBackOffice,
    updateLeadForBackOffice,
    deleteLeadForBackOffice,
    getAllServices,
    getServiceDetail,
    createNewService,
    updateServiceDetail,
    updateServiceCommissionSetting,
    removeService,
    getAllSalesMaterialsForBackOffice,
    createSalesMaterial,
    updateSalesMaterial,
    removeSalesMaterial,
    calculateDashboardStats,
    getPerformanceSettings,
    getPartnerCurrencyConfig,
    getPartnerTermsAndConditions,
    updatePerformanceSettings,
    updatePartnerCurrencyConfig,
    updatePartnerTermsAndConditions,
    listBackOfficeCommissions,
    markBackOfficeCommissionPaid,
    revertBackOfficeCommission,
    rejectBackOfficeCommission,
    getLeadPipelineStatuses,
    updateLeadPipelineStatuses,
    getVerticalMarkets,
    updateVerticalMarkets,
    syncCommissionRuleToSource,
} from "./partner.service.js";
import { uploadContentImage as uploadBlogContentImage } from "../blog/blog.service.js";

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

const performanceSettings = async (req, res) => {
    try {
        const data = await getPerformanceSettings();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updatePerformanceSetting = async (req, res) => {
    try {
        const data = await updatePerformanceSettings(req.body);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const currencyConfig = async (req, res) => {
    try {
        const data = await getPartnerCurrencyConfig();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateCurrencyConfig = async (req, res) => {
    try {
        const data = await updatePartnerCurrencyConfig(req.body?.currency);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const leadPipelineStatuses = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive !== "false";
        const data = await getLeadPipelineStatuses({ includeInactive });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateLeadPipelineStatusList = async (req, res) => {
    try {
        const data = await updateLeadPipelineStatuses(req.body?.statuses || []);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const verticalMarkets = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive !== "false";
        const data = await getVerticalMarkets({ includeInactive });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateVerticalMarketList = async (req, res) => {
    try {
        const data = await updateVerticalMarkets(req.body?.markets || []);
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

const deactivate = async (req, res) => {
    try {
        const data = await deactivatePartner(req.params.id);
        res.status(200).json({ status: "success", data, message: "Partner deactivated" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const data = await sendPartnerResetPasswordEmail(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getPartnerLeads = async (req, res) => {
    try {
        const { id } = req.params;
        const query = { ...req.query, affiliateId: id };
        const data = await getAllLeadsForBackOffice(query);
        res.status(200).json({ status: "success", data: data.data, pagination: data.pagination });
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

const getLeadActivities = async (req, res) => {
    try {
        const data = await getLeadActivitiesForBackOffice(req.params.id);
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

const updateServiceCommission = async (req, res) => {
    try {
        const data = await updateServiceCommissionSetting(req.params.id, req.body);
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

// ==================== SALES MATERIALS MANAGEMENT ====================

const getAllSalesMaterials = async (req, res) => {
    try {
        const data = await getAllSalesMaterialsForBackOffice();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const createMaterial = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            fileUrl: req.file ? `/uploads/sales-materials/${req.file.filename}` : req.body.fileUrl,
            fileName: req.file ? req.file.originalname : req.body.fileName,
            mimeType: req.file ? req.file.mimetype : req.body.mimeType,
        };
        const data = await createSalesMaterial(payload);
        res.status(201).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateMaterial = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            fileUrl: req.file ? `/uploads/sales-materials/${req.file.filename}` : req.body.fileUrl,
            fileName: req.file ? req.file.originalname : req.body.fileName,
            mimeType: req.file ? req.file.mimetype : req.body.mimeType,
        };
        const data = await updateSalesMaterial(req.params.id, payload);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const deleteMaterial = async (req, res) => {
    try {
        await removeSalesMaterial(req.params.id);
        res.status(200).json({ status: "success", message: "Sales material deleted" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getTermsAndConditions = async (req, res) => {
    try {
        const data = await getPartnerTermsAndConditions();
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateTermsAndConditions = async (req, res) => {
    try {
        const data = await updatePartnerTermsAndConditions(req.body?.html);
        
        const io = req.app.get("io");
        if (io) {
            io.emit("partner:terms-updated", data);
        }

        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const uploadContentImage = async (req, res) => {
    try {
        if (!req.files || !req.files.image || !req.files.image[0]) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const result = uploadBlogContentImage(req.files.image[0]);
        res.status(200).json(result);
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

// ==================== COMMISSION DISBURSEMENT ====================

const listCommissions = async (req, res) => {
    try {
        const data = await listBackOfficeCommissions(req.query);
        res.status(200).json({
            status: "success",
            data: data.data,
            pagination: data.pagination,
        });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const markCommissionPaid = async (req, res) => {
    try {
        const { proofUrl, transactionReference } = req.body || {};
        const paidById = req.user?.id || req.user?.userId || null;
        const data = await markBackOfficeCommissionPaid(req.params.id, {
            proofUrl,
            transactionReference,
            paidById,
        });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const revertCommission = async (req, res) => {
    try {
        const data = await revertBackOfficeCommission(req.params.id);
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const rejectCommissionHandler = async (req, res) => {
    try {
        const { reason } = req.body || {};
        const rejectedById = req.user?.id || req.user?.userId || null;
        const data = await rejectBackOfficeCommission(req.params.id, {
            reason,
            rejectedById,
        });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const uploadCommissionProof = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: "error",
                message: "Proof file is required",
            });
        }
        const proofUrl = `/upload/${req.file.filename}`;
        res.status(200).json({
            status: "success",
            data: {
                proofUrl,
                fileName: req.file.originalname,
                mimeType: req.file.mimetype,
                size: req.file.size,
            },
        });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

// ==================== COMMISSION RULE ENGINE ====================

const listCommissionRulesHandler = async (req, res) => {
    try {
        const includeInactive = req.query.includeInactive === "true";
        const data = await ruleRepo.listCommissionRules({ includeInactive });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const getCommissionRuleHandler = async (req, res) => {
    try {
        const rule = await ruleRepo.getCommissionRuleById(req.params.id);
        if (!rule) return res.status(404).json({ status: "error", message: "Rule not found" });
        res.status(200).json({ status: "success", data: rule });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const createCommissionRuleHandler = async (req, res) => {
    try {
        const { name, description, triggerType, commissionType, scope, periodScope, conditions, reward, isActive, priority } = req.body || {};
        if (!name || !triggerType || !commissionType) {
            return res.status(400).json({ status: "error", message: "name, triggerType and commissionType are required" });
        }
        const rule = await ruleRepo.createCommissionRule({
            name, description, triggerType, commissionType, scope, periodScope,
            conditions, reward, isActive, priority,
        });
        await syncCommissionRuleToSource(rule);
        res.status(201).json({ status: "success", data: rule });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const updateCommissionRuleHandler = async (req, res) => {
    try {
        const rule = await ruleRepo.updateCommissionRule(req.params.id, req.body || {});
        if (!rule) return res.status(404).json({ status: "error", message: "Rule not found" });
        await syncCommissionRuleToSource(rule);
        res.status(200).json({ status: "success", data: rule });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const deleteCommissionRuleHandler = async (req, res) => {
    try {
        await ruleRepo.deleteCommissionRule(req.params.id);
        res.status(200).json({ status: "success", message: "Rule deleted" });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const listCommissionRuleLogsHandler = async (req, res) => {
    try {
        const limit = req.query.limit ? Math.min(parseInt(req.query.limit), 200) : 50;
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const data = await ruleRepo.listRuleLogs({
            ruleId: req.params.id,
            limit,
            offset,
        });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

const runManualCommissionRuleHandler = async (req, res) => {
    try {
        const data = await evaluateManualRule({
            ruleId: req.params.id,
            affiliateId: req.body?.affiliateId,
            leadId: req.body?.leadId || null,
        });
        res.status(200).json({ status: "success", data });
    } catch (e) {
        res.status(400).json({ status: "error", message: e.message });
    }
};

export default {
    stats, recentLeads, pendingCommissions, performanceSettings, updatePerformanceSetting,
    currencyConfig, updateCurrencyConfig,
    leadPipelineStatuses, updateLeadPipelineStatusList,
    verticalMarkets, updateVerticalMarketList,
    getAll, getById, getPartnerStats, getPartnerLeads, update, remove, deactivate, resetPassword,
    getAllLeads, getLeadById, getLeadActivities, updateLead, deleteLead,
    getAllServicesList, getServiceById, createService, updateService, deleteService,
    updateServiceCommission,
    getAllSalesMaterials, createMaterial, updateMaterial, deleteMaterial,
    getTermsAndConditions, updateTermsAndConditions, uploadContentImage,
    listCommissions, markCommissionPaid, revertCommission, rejectCommission: rejectCommissionHandler,
    uploadCommissionProof,
    listCommissionRules: listCommissionRulesHandler,
    getCommissionRule: getCommissionRuleHandler,
    createCommissionRule: createCommissionRuleHandler,
    updateCommissionRule: updateCommissionRuleHandler,
    deleteCommissionRule: deleteCommissionRuleHandler,
    listCommissionRuleLogs: listCommissionRuleLogsHandler,
    runManualCommissionRule: runManualCommissionRuleHandler,
};
