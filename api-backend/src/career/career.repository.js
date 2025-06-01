import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { career } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllCareers = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.career.findMany({
      where,
      orderBy,
      limit,
      offset: skip,
      with:{
        position: {
          columns: {
            id: true,
            name: true
          }
        }
      }
    });

    const totalQuery = db.select({ count: count() }).from(career);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error("GET / error: ", error);
    throw new Error("Get All Career Unsuccessfully");
  }
};

export const findCareerById = async (id) => {
  try {
    const data = await db.query.career.findFirst({
      where: eq(career.id, id),
      with:{
        position: {
          columns: {
            id: true,
            name: true
          }
        }
      }
    });
    return data;
  } catch (error) {
    logger.error("GET /:id error: ", error);
    throw new Error("Get Career By ID Unsuccessfully");
  }
};

export const insertCareer = async (data) => {
  try {
    await db.insert(career).values(data);
  } catch (error) {
    logger.error("POST / error: ", error);
    throw new Error("Insert Career Unsuccessfully");
  }
};

export const deleteCareer = async (id) => {
  try {
    await db.delete(career).where(eq(career.id, id));
  } catch (error) {
    logger.error(error);
    throw new Error("Delete Career unsuccessfully");
  }
};

export const editCareer = async (id, data) => {
  try {
    await db.update(career).set(data).where(eq(career.id, id));
  } catch (error) {
    logger.error(error);
    throw new Error("Update Career unsuccessfully");
  }
};
