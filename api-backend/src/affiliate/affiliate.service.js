import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import {
    insertAffiliateApplication,
    findPendingByEmail,
    listAffiliateApplications,
    countAffiliateApplications,
    findAffiliateById,
    reviewAffiliateApplication,
    deleteAffiliateById,
    listAffiliateAllForExport,
    aggregateAffiliateStats,
} from "./affiliate.repository.js";

const normDigits = (s) => (s || "").toString().replace(/\D+/g, "");
const trim = (s) => (s == null ? s : String(s).trim());

export const createAffiliate = async (raw, req) => {
    const payload = {
        id: randomUUID(),
        fullName: trim(raw.full_name),
        email: trim(raw.email),
        countryCode: trim(raw.country_code) || "+62",
        phone: trim(raw.phone),
        country: trim(raw.country),
        govOrBusinessId: trim(raw.gov_or_business_id) || null,
        strategy: trim(raw.strategy),
        portfolioLinks: trim(raw.portfolio_links) || null,
        motivation: trim(raw.motivation) || null,
        otherPrograms: trim(raw.other_programs) || null,
        phoneE164: null,
        status: "pending",
        ipAddress: req.ip,
        userAgent: req.get("user-agent") || null,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    if (!payload.fullName || !payload.email || !payload.country || !payload.strategy || !payload.motivation) {
        throw new Error("Missing required fields");
    }

    // Normalisasi E.164
    const cc = (payload.countryCode || "").replace(/^\+/, "");
    const ph = normDigits(payload.phone);
    payload.phoneE164 = cc && ph ? `+${cc}${ph}` : null;

    // tolak duplikat pending per email
    const exists = await findPendingByEmail(payload.email);
    if (exists) throw new Error("You already have a pending application with this email.");

    await insertAffiliateApplication(payload);
    return payload;
};

export const getAllAffiliates = async (query = {}) => {
    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);
    const search = trim(query.search) || "";
    const status = trim(query.status) || "";
    const position = trim(query.position) || ""; // future: jika tambahkan kolom position
    const country = trim(query.country) || "";
    const sort = (trim(query.sort) || "newest").toLowerCase();
    const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
    const to = query.to ? dayjs(query.to).endOf("day").toDate() : null;

    const { data } = await listAffiliateApplications({
        page, limit, search, status, position, country, sort, from, to,
    });
    const total = await countAffiliateApplications({ search, status, position, country, from, to });
    const totalPages = Math.max(1, Math.ceil(total / limit));

    return { data, page, limit, total, totalPages };
};

export const getAffiliate = async (id) => {
    const row = await findAffiliateById(id);
    if (!row) throw new Error("Application not found");
    return row;
};

export const reviewAffiliate = async (id, { status, notes, reviewerId: payloadReviewerId }, reviewerId) => {
    if (!["approved", "rejected"].includes(status)) throw new Error("Invalid status");
    const finalReviewerId = reviewerId ?? payloadReviewerId ?? null;
    await reviewAffiliateApplication(id, {
        status,
        notes: notes || null,
        reviewerId: finalReviewerId,
        reviewedAt: dayjs().toDate(),
    });
};

export const deleteAffiliate = async (id) => {
    const row = await findAffiliateById(id);
    if (!row) throw new Error("Application not found");
    await deleteAffiliateById(id);
};

const toCsv = (rows) => {
    if (!rows?.length) return "full_name,email,phone,country,status,created_at\n";
    const header = Object.keys(rows[0]);
    const esc = (v) => String(v ?? "").replace(/"/g, '""');
    const lines = rows.map(r => header.map(h => `"${esc(r[h])}"`).join(",")).join("\n");
    return `${header.join(",")}\n${lines}\n`;
};

export const exportAffiliateCsv = async (query = {}) => {
    const sort = (trim(query.sort) || "newest").toLowerCase();
    const from = query.from ? dayjs(query.from).startOf("day").toDate() : null;
    const to = query.to ? dayjs(query.to).endOf("day").toDate() : null;

    const rows = await listAffiliateAllForExport({
        search: trim(query.search) || "",
        status: trim(query.status) || "",
        position: trim(query.position) || "",
        country: trim(query.country) || "",
        sort, from, to,
    });

    const csv = toCsv(rows);
    return { csv, filename: `affiliate_program_${dayjs().format("YYYYMMDD_HHmmss")}.csv` };
};

export const getAffiliateStats = async () => {
    return await aggregateAffiliateStats();
};
