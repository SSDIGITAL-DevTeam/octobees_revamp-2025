import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { career } from "../../drizzle/schema.js";

export const findAllCareers = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.career.findMany({
      where,
      orderBy,
      limit,
      offset: skip,
    });

    const totalQuery = db.select({ count: count() }).from(career);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    console.log("GET / error: ", error);
    throw new Error("Get All Career Unsuccessfully");
  }
};

export const findCareerById = async (id) => {
  try {
    const data = await db.query.career.findFirst({
      where: eq(career.id, id),
    });
    return data;
  } catch (error) {
    console.log("GET /:id error: ", error);
    throw new Error("Get Career By ID Unsuccessfully");
  }
};

export const insertCareer = async (data) => {
  try {
    console.log(data);
    await db.insert(career).values(data);
  } catch (error) {
    console.error("POST / error: ", error);
    throw new Error("Insert Career Unsuccessfully");
  }
};

export const deleteCareer = async (id) => {
  try {
    await db.delete(career).where(eq(career.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("Delete Career unsuccessfully");
  }
};

export const editCareer = async (id, data) => {
  try {
    await db.update(career).set(data).where(eq(career.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("Update Career unsuccessfully");
  }
};
