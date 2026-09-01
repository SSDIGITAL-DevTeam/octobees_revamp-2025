import { db } from "../../drizzle/db.js";
import { lead } from "../../drizzle/schema.js";
import { eq, count } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const findAllLeads = async (skip, limit, where, orderBy) => {
    try {
        const queryOptions = {
            where,
            orderBy,
            with: {
                voucher: true,
            },
        };

        if (limit !== undefined && limit !== null) {
            queryOptions.limit = limit;
            if (skip !== undefined && skip !== null) {
                queryOptions.offset = skip;
            }
        }

        const datas = await db.query.lead.findMany(queryOptions);

        const totalQuery = db.select({ count: count() }).from(lead);
        if (where) totalQuery.where(where);

        const [{ count: total }] = await totalQuery;

        return { datas, total };
    } catch (error) {
        logger.error(`GET / error: ${error.message}`);
        throw new Error("Get all leads unsuccessfully");
    }
};

export const findLeadById = async (where) => {
    try {
        const data = await db.query.lead.findFirst({ where });
        return data;
    } catch (error) {
        logger.error(`GET /:id error: ${error.message}`);
        throw new Error("Get lead by ID unsuccessfully");
    }
};

export const insertLead = async (data) => {
    try {
        await db.insert(lead).values(data);
    } catch (error) {
        logger.error(`POST / error: ${error.message}`);
        throw new Error("Lead insert unsuccessfully");
    }
};

export const deleteLead = async (id) => {
    try {
        await db.delete(lead).where(eq(lead.id, id));
    } catch (error) {
        logger.error(`DELETE /:id error: ${error.message}`);
        throw new Error("Lead delete unsuccessfully");
    }
};

export const editLead = async (id, data) => {
    try {
        await db.update(lead).set(data).where(eq(lead.id, id));
    } catch (error) {
        logger.error(`UPDATE /:id error: ${error.message}`);
        throw new Error("Lead edit unsuccessfully");
    }
};
