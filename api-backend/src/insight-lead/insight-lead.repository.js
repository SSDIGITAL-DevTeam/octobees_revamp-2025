import { db } from "../../drizzle/db.js";
import { insightLead } from "../../drizzle/schema.js";
import { eq, count } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const findAllInsightLeads = async (skip, limit, where, orderBy) => {
    try {
        const datas = await db.query.insightLead.findMany({
            where,
            orderBy,
            limit,
            offset: skip,
        });

        const totalQuery = db.select({ count: count() }).from(insightLead);
        if (where) totalQuery.where(where);
        const [{ count: total }] = await totalQuery;

        return { datas, total };
    } catch (error) {
        logger.error(`GET insight leads error: ${error.message}`);
        throw new Error("Get all insight leads unsuccessfully");
    }
};

export const findInsightLeadById = async (where) => {
    try {
        const data = await db.query.insightLead.findFirst({ where });
        return data;
    } catch (error) {
        logger.error(`GET insight lead by id error: ${error.message}`);
        throw new Error("Get insight lead by ID unsuccessfully");
    }
};

export const insertInsightLead = async (data) => {
    try {
        await db.insert(insightLead).values(data);
    } catch (error) {
        logger.error(`POST insight lead error: ${error.message}`);
        throw new Error("Insight lead insert unsuccessfully");
    }
};

export const deleteInsightLead = async (id) => {
    try {
        await db.delete(insightLead).where(eq(insightLead.id, id));
    } catch (error) {
        logger.error(`DELETE insight lead error: ${error.message}`);
        throw new Error("Insight lead delete unsuccessfully");
    }
};
