import express from "express";
import fs from "fs";
import multer from "multer";
import path from "path";
import { contentImageUpload } from "../middleware/uploadFile.js";
import { affiliateJwtGuard } from "../affiliate/affiliate.auth.middleware.js";
import partnerLeads from "./partner.leads.controller.js";
import partnerDashboard from "./partner.dashboard.controller.js";
import partnerProfile from "./partner.profile.controller.js";
import partnerBackOffice from "./partner.backoffice.controller.js";
import * as partnerNotes from "./partner.lead-notes.controller.js";

const router = express.Router();
const salesMaterialsDir = "upload/sales-materials/";
const commissionProofDir = "upload/commission-proofs/";

if (!fs.existsSync(salesMaterialsDir)) {
  fs.mkdirSync(salesMaterialsDir, { recursive: true });
}
if (!fs.existsSync(commissionProofDir)) {
  fs.mkdirSync(commissionProofDir, { recursive: true });
}

const salesMaterialStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, salesMaterialsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `sales-material-${uniqueSuffix}${ext}`);
  },
});

const salesMaterialUpload = multer({
  storage: salesMaterialStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
});

const commissionProofStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, commissionProofDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `commission-proof-${uniqueSuffix}${ext}`);
  },
});

const commissionProofUpload = multer({
  storage: commissionProofStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG/PNG/GIF/WEBP/PDF files are allowed"));
  },
});

// All partner routes are protected with affiliate JWT
router.use(affiliateJwtGuard);

// ==================== DASHBOARD ROUTES ====================
router.get("/dashboard/stats", partnerDashboard.stats);
router.get("/dashboard/services", partnerDashboard.services);
router.get("/dashboard/materials", partnerDashboard.materials);
router.get("/dashboard/commissions", partnerDashboard.commissions);
router.get("/dashboard/recent-leads", partnerDashboard.recentLeads);
router.get("/dashboard/performance", partnerDashboard.performance);
router.get("/dashboard/terms-and-conditions", partnerDashboard.termsAndConditions);
router.get("/dashboard/commission-policy", partnerDashboard.commissionPolicy);
router.get("/dashboard/pipeline-statuses", partnerDashboard.pipelineStatuses);
router.get("/dashboard/vertical-markets", partnerDashboard.verticalMarkets);

// ==================== LEADS ROUTES ====================
router.get("/leads", partnerLeads.getAll);
router.get("/leads/:id", partnerLeads.getById);
router.get("/leads/:id/activities", partnerLeads.getActivities);
router.get("/leads/:id/notes", partnerNotes.partnerGetNotes);
router.post("/leads/:id/notes", partnerNotes.partnerCreateNote);
router.put("/leads/:id/notes/:noteId", partnerNotes.partnerUpdateNote);
router.delete("/leads/:id/notes/:noteId", partnerNotes.partnerDeleteNote);
router.post("/leads", partnerLeads.create);
router.put("/leads/:id", partnerLeads.update);
router.delete("/leads/:id", partnerLeads.remove);

// ==================== PROFILE ROUTES ====================
router.get("/profile", partnerProfile.get);
router.put("/profile", partnerProfile.update);
router.post("/profile/change-email", partnerProfile.changeEmail);

// ==================== BACK OFFICE ROUTES ====================
const backOffice = express.Router();
backOffice.get("/dashboard/stats", partnerBackOffice.stats);
backOffice.get("/dashboard/recent-leads", partnerBackOffice.recentLeads);
backOffice.get("/dashboard/pending-commissions", partnerBackOffice.pendingCommissions);
backOffice.get("/performance-settings", partnerBackOffice.performanceSettings);
backOffice.patch("/performance-settings", partnerBackOffice.updatePerformanceSetting);
backOffice.get("/pipeline-statuses", partnerBackOffice.leadPipelineStatuses);
backOffice.put("/pipeline-statuses", express.json(), partnerBackOffice.updateLeadPipelineStatusList);
backOffice.get("/vertical-markets", partnerBackOffice.verticalMarkets);
backOffice.put("/vertical-markets", express.json(), partnerBackOffice.updateVerticalMarketList);

// Partner Management
backOffice.get("/partners", partnerBackOffice.getAll);
backOffice.get("/partners/:id", partnerBackOffice.getById);
backOffice.get("/partners/:id/stats", partnerBackOffice.getPartnerStats);
backOffice.get("/partners/:id/leads", partnerBackOffice.getPartnerLeads);
backOffice.post("/partners/:id/reset-password", partnerBackOffice.resetPassword);
backOffice.post("/partners/:id/deactivate", partnerBackOffice.deactivate);
backOffice.patch("/partners/:id", partnerBackOffice.update);
backOffice.delete("/partners/:id", partnerBackOffice.remove);

// Leads Management
backOffice.get("/leads", partnerBackOffice.getAllLeads);
backOffice.get("/leads/:id", partnerBackOffice.getLeadById);
backOffice.get("/leads/:id/activities", partnerBackOffice.getLeadActivities);
backOffice.get("/leads/:id/notes", partnerNotes.adminGetNotes);
backOffice.post("/leads/:id/notes", partnerNotes.adminCreateNote);
backOffice.delete("/leads/:id/notes/:noteId", partnerNotes.adminDeleteNote);
backOffice.patch("/leads/:id", partnerBackOffice.updateLead);
backOffice.delete("/leads/:id", partnerBackOffice.deleteLead);

// Services Management (Commission Control)
backOffice.get("/services", partnerBackOffice.getAllServicesList);
backOffice.get("/services/:id", partnerBackOffice.getServiceById);
backOffice.post("/services", partnerBackOffice.createService);
backOffice.patch("/services/:id", partnerBackOffice.updateService);
backOffice.patch("/services/:id/commission-setting", partnerBackOffice.updateServiceCommission);
backOffice.delete("/services/:id", partnerBackOffice.deleteService);

// Sales Materials
backOffice.get("/materials", partnerBackOffice.getAllSalesMaterials);
backOffice.post("/materials", salesMaterialUpload.single("file"), partnerBackOffice.createMaterial);
backOffice.patch("/materials/:id", salesMaterialUpload.single("file"), partnerBackOffice.updateMaterial);
backOffice.delete("/materials/:id", partnerBackOffice.deleteMaterial);
backOffice.get("/terms-and-conditions", partnerBackOffice.getTermsAndConditions);
backOffice.put("/terms-and-conditions", express.json(), partnerBackOffice.updateTermsAndConditions);
backOffice.post("/upload-content-image", contentImageUpload.fields([{ name: 'image', maxCount: 1 }]), partnerBackOffice.uploadContentImage);

// Commission Disbursement
backOffice.get("/commissions", partnerBackOffice.listCommissions);
backOffice.post(
  "/commissions/upload-proof",
  commissionProofUpload.single("file"),
  partnerBackOffice.uploadCommissionProof,
);
backOffice.patch("/commissions/:id/pay", express.json(), partnerBackOffice.markCommissionPaid);
backOffice.patch("/commissions/:id/revert", express.json(), partnerBackOffice.revertCommission);
backOffice.patch("/commissions/:id/reject", express.json(), partnerBackOffice.rejectCommission);

// Commission Rule Engine
backOffice.get("/commission-rules", partnerBackOffice.listCommissionRules);
backOffice.post("/commission-rules", express.json(), partnerBackOffice.createCommissionRule);
backOffice.get("/commission-rules/:id", partnerBackOffice.getCommissionRule);
backOffice.patch("/commission-rules/:id", express.json(), partnerBackOffice.updateCommissionRule);
backOffice.delete("/commission-rules/:id", partnerBackOffice.deleteCommissionRule);
backOffice.get("/commission-rules/:id/logs", partnerBackOffice.listCommissionRuleLogs);

export default { endUser: router, backOffice };
