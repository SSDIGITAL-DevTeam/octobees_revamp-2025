import express from "express";
import affiliate from "./affiliate.controller.js";

const endUser = express.Router();
endUser.post("/applications", affiliate.create);

const backOffice = express.Router();
// TODO: pasang middleware auth/role kalau perlu, mis. backOffice.use(boAuth)

// --- LETAKKAN YANG SPESIFIK DULU (hindari ketangkep :id) ---
backOffice.get("/applications/export/csv", affiliate.exportCsv);
backOffice.get("/applications/stats", affiliate.stats);

// --- LIST/DETAIL/REVIEW/DELETE ---
backOffice.get("/applications", affiliate.getall);
backOffice.get("/applications/:id", affiliate.getid);
backOffice.patch("/applications/:id/review", affiliate.review);
backOffice.delete("/applications/:id", affiliate.remove);

export default { endUser, backOffice };
