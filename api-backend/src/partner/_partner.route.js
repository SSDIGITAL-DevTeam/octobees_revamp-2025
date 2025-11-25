import express from "express";
import { affiliateJwtGuard } from "../affiliate/affiliate.auth.middleware.js";
import partnerLeads from "./partner.leads.controller.js";
import partnerDashboard from "./partner.dashboard.controller.js";
import partnerProfile from "./partner.profile.controller.js";

import partnerBackOffice from "./partner.backoffice.controller.js";

const router = express.Router();

// All partner routes are protected with affiliate JWT
router.use(affiliateJwtGuard);

// ==================== DASHBOARD ROUTES ====================
router.get("/dashboard/stats", partnerDashboard.stats);
router.get("/dashboard/services", partnerDashboard.services);
router.get("/dashboard/commissions", partnerDashboard.commissions);
router.get("/dashboard/recent-leads", partnerDashboard.recentLeads);

// ==================== LEADS ROUTES ====================
router.get("/leads", partnerLeads.getAll);
router.get("/leads/:id", partnerLeads.getById);
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
backOffice.get("/partners", partnerBackOffice.getAll);
backOffice.get("/partners/:id", partnerBackOffice.getById);
backOffice.patch("/partners/:id", partnerBackOffice.update);
backOffice.delete("/partners/:id", partnerBackOffice.remove);

export default { endUser: router, backOffice };
