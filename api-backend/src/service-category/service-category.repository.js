import { db } from "../../drizzle/db.js";
import { categoryService } from "../../drizzle/schema.js";
import { count, eq } from "drizzle-orm";
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
    logger.error("GET / error: ", error.message);
    throw new Error("Get All Categories Unsuccessfully");
  }
};

export const findCategoryById = async (id, where) => {
  try {
    const data = await db.query.categoryService.findFirst({
      where: eq(categoryService.id, id),
      with: {
        plans: {
          where,
          with: {
            prices: true,
            benefits: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error("GET /:ID error: ", error);
    throw new Error("Get Category By Id Unsuccessfully");
  }
};

export const findCategoryBySlug = async (slug, where) => {
  try {
    const data = await db.query.categoryService.findFirst({
      where: eq(categoryService.slug, slug),
      with: {
        plans: {
          where,
          with: {
            prices: true,
            benefits: true,
          },
        },
      },
    });
    return data;
  } catch (error) {
    logger.error("GET /:SLUG error: ", error);
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
    logger.error("GET /:NAME error: ", error);
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
    logger.error("POST / error: ", error);
    throw new Error("Create Category Unsuccessfully");
  }
};

export const deleteCategory = async (id) => {
  try {
    await db.delete(categoryService).where(eq(categoryService.id, id));
  } catch (error) {
    logger.error("DELETE /:ID error: ", error);
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
    logger.error("UPDATE /:ID error: ", error);
    throw new Error("Update Category Unsuccessfully");
  }
};
