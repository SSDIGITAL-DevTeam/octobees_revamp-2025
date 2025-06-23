import { db } from "../../drizzle/db.js";
import { categoryService } from "../../drizzle/schema.js";
import { and, count, eq } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import logger from "../../utils/logger.js";

export const findAllCategories = async (skip, limit, where, orderBy) => {
  try {
    const datas = await db.query.categoryService.findMany({
      where,
      limit,
      offset: skip,
      orderBy,
    });

    const totalQuery = db.select({ count: count() }).from(categoryService);
    if (where) totalQuery.where(where);
    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET CATEGORY / error: ${error.message}`);
    throw new Error("Get All Categories Unsuccessfully");
  }
};

export const findCategoryById = async (id, status) => {
  let where = eq(categoryService.id, id);
  if (status !== undefined)
    where = and(where, eq(categoryService.status, status));
  try {
    const data = await db.query.categoryService.findFirst({
      where,
      with: {
        plans: {
          where: eq(categoryService.status, status),
          with: {
            prices: true,
            benefits: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET CATEGORY /:ID error: ${error.message}`);
    throw new Error("Get Category By Id Unsuccessfully");
  }
};

export const findCategoryBySlug = async (slug, status) => {
  let where = eq(categoryService.slug, slug);
  if (status !== undefined)
    where = and(where, eq(categoryService.status, status));
  try {
    const data = await db.query.categoryService.findFirst({
      where,
      with: {
        plans: {
          where: eq(categoryService.status, status),
          with: {
            prices: true,
            benefits: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error(`GET CATEGORY /:SLUG error: ${error.message}`);
    throw new Error("Get Category By Slug Unsuccessfully");
  }
};

export const getCategoryByName = async (name) => {
  try {
    const data = await db.query.categoryService.findFirst({
      where: eq(categoryService.name, name),
    });
    return data;
  } catch (error) {
    logger.error(`GET CATEGORY /:NAME error: ${error.message}`);
    throw new Error("Get Category By Name Unsuccessfully");
  }
};

export const insertCategory = async (data) => {
  try {
    const id = uuidv7();
    await db.insert(categoryService).values({
      id,
      ...data,
    });

    return { id, ...data };
  } catch (error) {
    logger.error(`POST CATEGORY / error: ${error.message}`);
    throw new Error("Create Category Unsuccessfully");
  }
};

export const deleteCategory = async (id) => {
  try {
    await db.delete(categoryService).where(eq(categoryService.id, id));
  } catch (error) {
    logger.error(`DELETE CATEGORY /:ID error: ${error.message}`);
    throw new Error("Delete Category Unsuccessfully");
  }
};

export const editCategory = async (id, data) => {
  try {
    await db
      .update(categoryService)
      .set(data)
      .where(eq(categoryService.id, id));
  } catch (error) {
    logger.error(`UPDATE CATEGORY /:ID error: ${error.message}`);
    throw new Error("Update Category Unsuccessfully");
  }
};
