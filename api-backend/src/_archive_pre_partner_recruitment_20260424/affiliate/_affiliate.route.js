import express from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import path from "path";
import affiliate from "./affiliate.controller.js";
import affiliateAuth from "./affiliate.auth.controller.js";
import affiliateDashboard from "./affiliate.dashboard.controller.js";
import { affiliateJwtGuard } from "./affiliate.auth.middleware.js";

const affiliateLoginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many login attempts, please try again later.",
});

const resumeStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "upload/");
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `affiliate-resume-${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
    },
});

const resumeUpload = multer({
    storage: resumeStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype === "application/pdf" || path.extname(file.originalname).toLowerCase() === ".pdf") {
            cb(null, true);
            return;
        }
        cb(new Error("Resume / CV must be a PDF file"));
    },
});

const endUser = express.Router();
endUser.post("/applications", resumeUpload.single("resume"), affiliate.create);
endUser.post("/auth/login", affiliateLoginLimiter, affiliateAuth.login);
endUser.post("/auth/change-password", affiliateAuth.changePassword);
endUser.post("/auth/forgot-password", affiliateAuth.forgotPassword);
endUser.post("/auth/logout", (req, res) => {
    res.status(200).json({ status: "success", message: "Logged out" });
});
endUser.post("/auth/agree-tnc", affiliateJwtGuard, affiliateAuth.agreeTnc);

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
backOffice.post("/applications/:id/approve-interview", affiliate.approveInterview);
backOffice.post("/applications/:id/process-to-onboard", affiliate.processToOnboard);
backOffice.post("/applications/:id/approve", affiliate.approve);
backOffice.post("/applications/:id/reject", affiliate.reject);
backOffice.post("/applications/:id/revert-final-decision", affiliate.revertFinalDecision);
backOffice.post("/applications/:id/resend-email", affiliate.resendEmail);
backOffice.delete("/applications/:id", affiliate.remove);

export default { endUser, backOffice };
