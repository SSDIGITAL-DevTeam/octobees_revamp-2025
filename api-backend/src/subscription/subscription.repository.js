import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { subscription } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllSubscriptions = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db
    .select(subscription)
    .from(subscription);
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    const totalQuery = db.select({ count: count() }).from(subscription);
    if (where) totalQuery.where(where);
    const [{ count: total }] = await totalQuery;
    return { datas, total };

  } catch (error) {
    logger.error("GET / error: ", error);
    throw new Error("Get All Subscriptions unsuccessfully");
  }
};

export const findSubscriptionById = async (id) => {
  try {
    let baseQuery = db
      .select(
        subscription
      )
      .from(subscription)
      .where(eq(subscription.id, id))
      .limit(1);

    const datas = await baseQuery;
    return datas[0];
  } catch (error) {
    logger.error("GET /:ID error: ", error);
    throw new Error("Get Subscription by ID unsuccessfully");
  }
};

export const insertSubscription = async (data) => {
  try {
    await db.insert(subscription).values(data);
  } catch (error) {
    logger.error("POST / error: ", error);
    throw new Error("Post Subscription unsuccessfully");
  }
};

export const deleteSubscription = async (id) => {
  try {
    await db.delete(subscription).where(eq(subscription.id, id));
  } catch (error) {
    logger.error("DELETE / error: ", error);
    throw new Error("Delete Subscription unsuccessfully");
  }
};

export const editSubscription = async (id, data) => {
  try {
    await db.update(subscription).set(data).where(eq(subscription.id, id));
  } catch (error) {
    logger.error("UPDATE / error: ", error);
    throw new Error("Update Subscription unsuccessfully");
  }
};
