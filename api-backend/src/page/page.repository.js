import { db } from "../../drizzle/db.js";
import { pages } from "../../drizzle/schema.js";
import { eq,  count } from "drizzle-orm";
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
    logger.error(`GET PAGE / error: ${error.message}`);
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
    logger.error(`GET PAGE /:SLUG error: ${error.message}`);
    throw new Error("Get Meta By Slug Unsuccessfully");
  }
};

export const findPageById = async (id) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.id, id),
    });

    return data;
  } catch (error) {
    logger.error(`GET PAGE /:ID error: ${error.message}`);
    throw new Error("Get Page By Id Unsuccessfully");
  }
};
export const findPageByTitle = async (page) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.page, page),
    });
    return data;
  } catch (error) {
    logger.error(`GET PAGE /:TITLE error: ${error.message}`);
    throw new Error("Get Page By Title Unsuccessfully");
  }
};

export const insertPage = async (data) => {
  try {
    await db.insert(pages).values(data);
  } catch (error) {
    logger.error(`POST PAGE / error: ${error.message}`);
    throw new Error("Create Page Unsuccessfully");
  }
};

export const deletePageByCategoryId = async (id) => {
  try {
    await db.delete(pages).where(eq(pages.categoryServiceId, id));
  } catch (error) {
    logger.error(`DELETE PAGE /:CATEGORY-ID error: ${error.message}`);
    throw new Error("Delete Page By Category Unsuccessfully");
  }
};
export const deletePageByBlogId = async (id) => {
  try {
    await db.delete(pages).where(eq(pages.blogId, id));
  } catch (error) {
    logger.error(`DELETE PAGE /:BLOG-ID error: ${error.message}`);
    throw new Error("Delete Page By Blog Unsuccessfully");
  }
};
export const deletePageById = async (id) => {
  try {
    await db.delete(pages).where(eq(pages.id, id));
  } catch (error) {
    logger.error(`DELETE PAGE /:ID error: ${error.message}`);
    throw new Error("Delete Page By Id Unsuccessfully");
  }
};

export const editPage = async (id, data) => {
  try {
    await db.update(pages).set(data).where(eq(pages.id, id));
  } catch (error) {
  logger.error(`UPDATE PAGE /:ID error: ${error.message}`);
    throw new Error("Update Page By Id Unsuccessfully");
  }
};

export const editPageByCategory = async (id, data) => {
  try {
    await db.update(pages).set(data).where(eq(pages.categoryServiceId, id));
  } catch (error) {
    logger.error(`UPDATE PAGE /:CATEGORY-ID error: ${error.message}`);
    throw new Error("Update Page By Category Unsuccessfully");
  }
};
export const editPageByBlog = async (id, data) => {
  try {
    await db.update(pages).set(data).where(eq(pages.blogId, id));
  } catch (error) {
    logger.error(`UPDATE PAGE /:BLOG-ID error: ${error.message}`);
    throw new Error("Update Page By Blog Unsuccessfully");
  }
};
