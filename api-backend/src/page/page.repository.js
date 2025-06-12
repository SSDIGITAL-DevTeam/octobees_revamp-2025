import { db } from "../../drizzle/db.js";
import { metaTag, pages } from "../../drizzle/schema.js";
import { eq, sql, desc, asc, count } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import logger from "../../utils/logger.js";

export const findAllPages = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.pages.findMany({
      where,
      limit,
      offset: skip,
      orderBy,
    });

    const totalQuery = db.select({ count: count() }).from(pages);
    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;
    return { datas, total };
  } catch (error) {
    logger.error(error);
    throw new Error("Get all pages unsuccessfully");
  }
};

export const findPageBySlug = async (slug) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    });
    return data;
  } catch (error) {
    logger.error("GET /:SLUG error: ",error);
    throw new Error("Get Meta By Slug Unsuccessfully");
  }
};

// Find MetaTag By ID
export const findPageById = async (id) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.id, id),
    });
    // const data = await db
    //   .select()
    //   .from(pages)
    //   // .leftJoin(pages, eq(metaTag.slug, pages.slug))
    //   .where(eq(pages.id, id))
    //   .limit(1);

    return data;
  } catch (error) {
    console.error("Error fetching metaTag by ID:", error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};
export const findPageByTitle = async (page) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.page, page),
    });
    return data;
  } catch (error) {
    logger.error("GET /:TITLE error: ",error);
    throw new Error("Get Page By Title Unsuccessfully");
  }
};

export const insertPage = async (data) => {
  try {
    await db.insert(pages).values(data);
  } catch (error) {
    logger.error("POST / error: ",error);
    throw new Error("Create Page Unsuccessfully");
  }
};

export const deletePageByCategoryId = async (id) => {
  try {
    await db.delete(pages).where(eq(pages.categoryServiceId, id));
  } catch (error) {
    logger.error("DELETE /:CAT ID error: ", error.message);
    throw new Error("Delete Page By Category Unsuccessfully");
  }
};
export const deletePageById = async (id) => {
  try {
    await db.delete(pages).where(eq(pages.id, id));
  } catch (error) {
    logger.error("DELETE /:ID error: ", error.message);
    throw new Error("Delete Page By Id Unsuccessfully");
  }
};

export const editPage = async (id, data) => {
  try {
    await db.update(pages).set(data).where(eq(pages.id, id));
  } catch (error) {
  logger.error("UPDATE / error: ",error.message);
    throw new Error("Update Page By Id Unsuccessfully");
  }
};

export const editPages = async (id, data) => {
  try {
    await db.update(pages).set(data).where(eq(pages.categoryServiceId, id));
  } catch (error) {
    logger.error("UPDATE / error: ",error.message);
    throw new Error("Update Page By Category Unsuccessfully");
  }
};
