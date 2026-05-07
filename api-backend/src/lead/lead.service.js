import {
    findAllLeads,
    insertLead,
    findLeadById,
    editLead,
    deleteLead,
} from "./lead.repository.js";
import { asc, desc, and, or, eq, like, gte } from "drizzle-orm";
import { lead } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const getAllLeads = async (filters) => {
    try {
        const { page = 1, limit = 10, orderBy, search, createdAt, fromPrefix } = filters;

        const skip = (page - 1) * limit;

        const whereConditions = [];

        if (fromPrefix) {
            whereConditions.push(like(lead.from, `${fromPrefix}%`));
        }

        if (search) {
            const keyword = `%${search.toLowerCase()}%`;
            const searchFilters = [
                like(lead.name, keyword),
                like(lead.email, keyword),
                like(lead.phone, keyword),
                like(lead.business, keyword),
                like(lead.message, keyword),
                like(lead.from, keyword),
            ];
            whereConditions.push(or(...searchFilters));
        }

        const where = whereConditions.length
            ? and(...whereConditions)
            : undefined;

        const order = (orderBy || []).map((item) => {
            const field = Object.keys(item)[0];
            const direction = item[field];
            return direction === "desc" ? desc(lead[field]) : asc(lead[field]);
        });

        const { datas, total } = await findAllLeads(skip, limit, where, order);

        const totalPages = Math.ceil(total / limit);
        return {
            data: datas,
            pagination: {
                total,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getLeadById = async (id) => {
    try {
        let where = eq(lead.id, id);
        const leadData = await findLeadById(where);
        if (!leadData) {
            throw new Error("Lead not found");
        }
        return leadData;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const createLead = async (payload) => {
    try {
        await insertLead(payload);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const deleteLeadById = async (id) => {
    try {
        let where = eq(lead.id, id);
        const isLeadExist = await findLeadById(where);
        if (!isLeadExist) {
            throw new Error("Lead not found");
        }
        await deleteLead(id);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const updateLead = async (id, payload) => {
    try {
        const where = eq(lead.id, id);
        const isLeadExist = await findLeadById(where);
        if (!isLeadExist) {
            throw new Error("Lead not found");
        }
        await editLead(id, payload);
    } catch (error) {
        throw new Error(error.message);
    }
};
