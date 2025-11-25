import express from "express";
import rateLimit from "express-rate-limit";
import affiliate from "./affiliate.controller.js";
import affiliateAuth from "./affiliate.auth.controller.js";
import affiliateDashboard from "./affiliate.dashboard.controller.js";
import { affiliateJwtGuard } from "./affiliate.auth.middleware.js";

const affiliateLoginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many login attempts, please try again later.",
});

const endUser = express.Router();
endUser.post("/applications", affiliate.create);
endUser.post("/auth/login", affiliateLoginLimiter, affiliateAuth.login);
endUser.post("/auth/change-password", affiliateAuth.changePassword);
endUser.post("/auth/forgot-password", affiliateAuth.forgotPassword);

const affiliateProtected = express.Router();
affiliateProtected.use(affiliateJwtGuard);
affiliateProtected.get("/me", affiliateDashboard.me);
affiliateProtected.get("/stats", affiliateDashboard.stats);
affiliateProtected.get("/transactions", affiliateDashboard.transactions);
affiliateProtected.get("/referrals", affiliateDashboard.referrals);
endUser.use(affiliateProtected);

const backOffice = express.Router();
// TODO: pasang middleware auth/role kalau perlu, mis. backOffice.use(boAuth)

// --- LETAKKAN YANG SPESIFIK DULU (hindari ketangkep :id) ---
backOffice.get("/applications/export/csv", affiliate.exportCsv);
backOffice.get("/applications/stats", affiliate.stats);

// --- LIST/DETAIL/REVIEW/DELETE ---
backOffice.get("/applications", affiliate.getall);
backOffice.get("/applications/:id", affiliate.getid);
backOffice.patch("/applications/:id", affiliate.update);
backOffice.patch("/applications/:id/review", affiliate.review);
backOffice.post("/applications/:id/approve", affiliate.approve);
backOffice.post("/applications/:id/reject", affiliate.reject);
backOffice.post("/applications/:id/resend-email", affiliate.resendEmail);
backOffice.delete("/applications/:id", affiliate.remove);

export default { endUser, backOffice };
