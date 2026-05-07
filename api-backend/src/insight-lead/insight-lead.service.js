import { findAllInsightLeads, insertInsightLead, findInsightLeadById, deleteInsightLead } from "./insight-lead.repository.js";
import { asc, desc, and, or, eq, like } from "drizzle-orm";
import { insightLead } from "../../drizzle/schema.js";

export const getAllInsightLeads = async (filters) => {
    try {
        const { page = 1, limit = 10, orderBy, search } = filters;
        const skip = (page - 1) * limit;

        const whereConditions = [];
        if (search) {
            const keyword = `%${search.toLowerCase()}%`;
            whereConditions.push(or(
                like(insightLead.name, keyword),
                like(insightLead.email, keyword),
                like(insightLead.phone, keyword),
                like(insightLead.from, keyword),
            ));
        }

        const where = whereConditions.length ? and(...whereConditions) : undefined;
        const order = (orderBy || []).map((item) => {
            const field = Object.keys(item)[0];
            const direction = item[field];
            return direction === "desc" ? desc(insightLead[field]) : asc(insightLead[field]);
        });

        const { datas, total } = await findAllInsightLeads(skip, limit, where, order);
        const totalPages = Math.ceil(total / limit);

        return {
            data: datas,
            pagination: { total, totalPages, currentPage: page, perPage: limit },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createInsightLead = async (payload) => {
    try {
        await insertInsightLead(payload);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getInsightLeadById = async (id) => {
    try {
        const where = eq(insightLead.id, id);
        const data = await findInsightLeadById(where);
        if (!data) throw new Error("Insight lead not found");
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteInsightLeadById = async (id) => {
    try {
        const where = eq(insightLead.id, id);
        const existing = await findInsightLeadById(where);
        if (!existing) throw new Error("Insight lead not found");
        await deleteInsightLead(id);
    } catch (error) {
        throw new Error(error.message);
    }
};
