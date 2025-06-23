import { db } from "../../drizzle/db.js";
import { order } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";
import { count } from "drizzle-orm";

export const findAllOrders = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.order.findMany({
      where,
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        plan: {
          columns: {
            name: true,
          },
        },
      },
      limit,
      offset: skip,
    });

    const totalQuery = db.select({ count: count() }).from(order);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET ORDER / error: ${error.message}`);
    throw new Error("Get All Order Unsuccessfully");
  }
};

export const findOrderById = async (id) => {
  try {
    const data = await db.query.order.findFirst({
      where: eq(order.id, id),
      with: {
        category: {
          columns: {
            name: true,
          },
        },
        prices: true,
        benefits: {
          columns: {
            value: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET ORDER /:ID error: ${error.message}`);
    throw new Error("Get Order By Id Unsuccessfully");
  }
};

export const insertOrder = async (data) => {
  try {
    await db.insert(order).values(data);
  } catch (error) {
    logger.error(`POST ORDER / error: ${error.message}`);
    throw new Error("Insert Order Unsuccessfully");
  }
};
