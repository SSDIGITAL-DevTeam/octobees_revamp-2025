import { db } from "../../drizzle/db.js";
import { course } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";
import { count, eq } from "drizzle-orm";

export const findAllCourses = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.course.findMany({
      where,
      limit,
      offset: skip,
      orderBy,
    });

    const totalQuery = db.select({ count: count() }).from(course);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET COURSE / error: ${error.message}`);
    throw new Error("Get All Course Unsuccessfully");
  }
};

export const findCourseById = async (id) => {
  try {
    const data = await db.query.course.findFirst({
      where: eq(course.id, id),
    });
    return data;
  } catch (error) {
    logger.error(`GET COURSE /:ID error: ${error.message}`);
    throw new Error("Get Course By Id Unsuccessfully");
  }
};

export const insertCourse = async (data) => {
  try {
    await db.insert(course).values(data);
  } catch (error) {
    logger.error(`POST COURSE / error: ${error.message}`);
    throw new Error("Insert Course Unsuccessfully");
  }
};

export const updateCourseQuery = async (id, data) => {
  try {
    await db.update(course).set(data).where(eq(course.id, id));
  } catch (error) {
    logger.error(`PATCH COURSE /:ID error: ${error.message}`);
    throw new Error("Update Course Unsuccessfully");
  }
};

export const deleteCourseByIdQuery = async (id) => {
  try {
    await db.delete(course).where(eq(course.id, id));
  } catch (error) {
    logger.error(`DELETE COURSE /:ID error: ${error.message}`);
    throw new Error("Delete Course Unsuccessfully");
  }
};
