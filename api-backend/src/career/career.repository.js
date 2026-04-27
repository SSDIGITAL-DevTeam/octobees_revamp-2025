import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { career, position } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllCareers = async (skip, limit, where, orderBy) => {
  try {
    let query = db
      .select({
        ...career,
        position: {
          id: position.id,
          name: position.name,
        },
      })
      .from(career)
      .leftJoin(position, eq(career.positionId, position.id));
    if (where) query = query.where(where);
    if (orderBy) query = query.orderBy(...orderBy);

    const datas = await query.limit(limit).offset(skip);

    const totalQuery = db.select({ count: count() }).from(career);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    throw new Error("Get All Career Unsuccessfully");
  }
};

export const findCareerById = async (id) => {
  try {
    const data = await db
      .select({
        ...career,
        position: {
          id: position.id,
          name: position.name,
        },
      })
      .from(career)
      .leftJoin(position, eq(career.positionId, position.id))
      .where(eq(career.id, id))
      .limit(1);
    return data[0] || null;
  } catch (error) {
    logger.error(`GET /:id error: ${error.message}`);
    throw new Error("Get Career By ID Unsuccessfully");
  }
};

export const insertCareer = async (data) => {
  try {
    await db.insert(career).values(data);
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    throw new Error("Insert Career Unsuccessfully");
  }
};

export const deleteCareer = async (id) => {
  try {
    await db.delete(career).where(eq(career.id, id));
  } catch (error) {
    logger.error(`DELETE /:id error: ${error.message}`);
    throw new Error("Delete Career unsuccessfully");
  }
};

export const editCareer = async (id, data) => {
  try {
    await db.update(career).set(data).where(eq(career.id, id));
  } catch (error) {
    logger.error(`UPDATE /:id error: ${error.message}`);
    throw new Error("Update Career unsuccessfully");
  }
};
