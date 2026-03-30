import { db } from "../../drizzle/db.js";
import { coursePurchase } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";
import { count, eq } from "drizzle-orm";

export const findAllCoursePurchases = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.coursePurchase.findMany({
      where,
      with: {
        course: {
          columns: {
            title: true,
            price: true,
          },
        },
      },
      limit,
      offset: skip,
      orderBy,
    });

    const totalQuery = db.select({ count: count() }).from(coursePurchase);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET COURSE PURCHASE / error: ${error.message}`);
    throw new Error("Get All Course Purchase Unsuccessfully");
  }
};

export const findCoursePurchaseById = async (id) => {
  try {
    const data = await db.query.coursePurchase.findFirst({
      where: eq(coursePurchase.id, id),
      with: {
        course: {
          columns: {
            title: true,
            price: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET COURSE PURCHASE /:ID error: ${error.message}`);
    throw new Error("Get Course Purchase By Id Unsuccessfully");
  }
};

export const insertCoursePurchase = async (data) => {
  try {
    await db.insert(coursePurchase).values(data);
  } catch (error) {
    logger.error(`POST COURSE PURCHASE / error: ${error.message}`);
    throw new Error("Insert Course Purchase Unsuccessfully");
  }
};

export const updateCoursePurchaseStatusQuery = async (id, status) => {
  try {
    await db.update(coursePurchase).set({ status }).where(eq(coursePurchase.id, id));
  } catch (error) {
    logger.error(`PATCH COURSE PURCHASE STATUS /:ID error: ${error.message}`);
    throw new Error("Update Course Purchase Status Unsuccessfully");
  }
};
