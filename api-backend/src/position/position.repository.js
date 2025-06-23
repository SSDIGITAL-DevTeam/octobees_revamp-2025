import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { position } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllPositions = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.position.findMany({
      where,
      orderBy,
      limit,
      offset: skip,
    });

    const totalQuery = db.select({ count: count() }).from(position);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    throw new Error("Get All Position Unsuccessfully");
  }
};

export const findPositionById = async (id) => {
  try {
    const data = await db.query.position.findFirst({
      where: eq(position.id, id),
    });
    return data;
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    throw new Error("Get Position By ID Unsuccessfully");
  }
};

export const findPositionByName = async (name) => {
  try {
    const data = await db.query.position.findFirst({
      where: eq(position.name, name),
    });
    return data;
  } catch (error) {
    logger.error(`GET /:name error: ${error.message}`);
    throw new Error("Get Position By Name Unsuccessfully");
  }
};

export const insertPosition = async (data) => {
  try {
    await db.insert(position).values(data);
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    throw new Error("Insert Position Unsuccessfully");
  }
};

export const deletePosition = async (id) => {
  try {
    await db.delete(position).where(eq(position.id, id));
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    throw new Error("Delete Position unsuccessfully");
  }
};

export const editPosition = async (id, data) => {
  try {
    await db.update(position).set(data).where(eq(position.id, id));
  } catch (error) {
    logger.error(`UPDATE /:id error: ${error.message}`);
    throw new Error("Update Position unsuccessfully");
  }
};
