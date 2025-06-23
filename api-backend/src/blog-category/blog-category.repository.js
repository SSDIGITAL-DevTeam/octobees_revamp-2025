import { and, count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { blog, blogCategory } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllBlogCats = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db.select(blogCategory).from(blogCategory);
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    const totalQuery = db.select({ count: count() }).from(blogCategory);
    if (where) totalQuery.where(where);
    const [{ count: total }] = await totalQuery;
    return { datas, total };
  } catch (error) {
    logger.error(`GET BLOG-CATEGORY / error: ${error.message}`);
    throw new Error("Get all blog categories unsuccessfully");
  }
};

export const findBlogCatByName = async (name) => {
  try {
    let baseQuery = db
      .select(blogCategory)
      .from(blogCategory)
      .leftJoin(blog, eq(blog.categoryId, blogCategory.id))
      .where(eq(blogCategory.name, name))
      .limit(1);
    const datas = await baseQuery;
    return datas[0];
  } catch (error) {
    logger.error(`GET BLOG-CATEGORY /:NAME error: ${error.message}`);
    throw new Error("Get blog category by name unsuccessfully");
  }
};

export const findBlogCatById = async (id, status) => {
  let where = eq(blogCategory.id, id);
  if (status !== undefined) {
    where = and(where, eq(blogCategory.status, status));
  }
  try {
    const data = await db.query.blogCategory.findFirst({
      where,
    });
    return data;
  } catch (error) {
    logger.error(`GET BLOG-CATEGORY /:ID error: ${error.message}`);
    throw new Error("Get blog category by id unsuccessfully");
  }
};

export const findBlogCatBySlug = async (slug, status) => {
  try {
    let baseQuery = db
      .select(blogCategory)
      .from(blogCategory)
      .where(eq(blogCategory.slug, slug))
      .limit(1);

    if (status) baseQuery = baseQuery.where(eq(blogCategory.status, status));

    const datas = await baseQuery;

    return datas[0];
  } catch (error) {
    logger.error(`GET BLOG-CATEGORY /:SLUG error: ${error.message}`);
    throw new Error("Get blog category by slug unsuccessfully");
  }
};

export const insertBlogCat = async (data) => {
  try {
    await db.insert(blogCategory).values(data);
  } catch (error) {
    logger.error(`POST BLOG-CATEGORY / error: ${error.message}`);
    throw new Error("Insert blog category unsuccessfully");
  }
};

export const deleteBlogCat = async (id) => {
  try {
    await db.delete(blogCategory).where(eq(blogCategory.id, id));
  } catch (error) {
    logger.error(`DELETE BLOG-CATEGORY /:ID error: ${error.message}`);
    throw new Error("Delete blog category unsuccessfully");
  }
};

export const editBlogCat = async (id, data) => {
  try {
    await db.update(blogCategory).set(data).where(eq(blogCategory.id, id));
  } catch (error) {
    logger.error(`UPDATE BLOG-CATEGORY /:ID error: ${error.message}`);
    throw new Error("Change blog category unsuccessfully");
  }
};
