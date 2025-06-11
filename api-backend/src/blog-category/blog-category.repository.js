import { count, eq } from "drizzle-orm";
import { db } from "../../drizzle/db.js";
import { blog, blogCategory } from "../../drizzle/schema.js";
import logger from "../../utils/logger.js";

export const findAllBlogCats = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db
    .select(blogCategory)
    .from(blogCategory);
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    const totalQuery = db.select({ count: count() }).from(blogCategory);
    if (where) totalQuery.where(where);
    const [{ count: total }] = await totalQuery;
    return { datas, total };

  } catch (error) {
    logger.error("GET / error: ", error);
    throw new Error("Error fetching all blog categories");
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
    logger.error("GET /:NAME error: ", error);
    throw new Error("Error fetching all blog categories by title");
  }
};

export const findBlogCatById = async (where) => {
  try {
    let baseQuery = db
      .select(
        blogCategory
      )
      .from(blogCategory)
      .where(where)
      .limit(1);

    const datas = await baseQuery;
    return datas[0];
  } catch (error) {
    logger.error("GET /:ID error: ", error);
    throw new Error("Error fetching all blog categories");
  }
};

export const findBlogCatBySlug = async (id, status) => {
  try {
    let baseQuery = db
      .select(blogCategory)
      .from(blogCategory)
      .where(eq(blogCategory.slug, id))
      .limit(1);

    if (status) baseQuery = baseQuery.where(eq(blogCategory.status, status));

    const datas = await baseQuery;
    
    return datas[0];
  } catch (error) {
    logger.error("GET /:SLUG error: ", error);
    throw new Error("Error fetching all blog categories");
  }
};

export const insertBlogCat = async (data) => {
  try {
    // logger.error("insertBlogCat data: ", data);

    await db.insert(blogCategory).values(data);
  } catch (error) {
    console.error("POST / error: ", error);
    throw new Error("Error inserting blog category");
  }
};

export const deleteBlogCat = async (id) => {
  try {
    await db.delete(blogCategory).where(eq(blogCategory.id, id));
  } catch (error) {
    logger.error("DELETE / error: ", error);
    throw new Error("Delete blog category unsuccessfully");
  }
};

export const editBlogCat = async (id, data) => {
  try {
    await db.update(blogCategory).set(data).where(eq(blogCategory.id, id));
  } catch (error) {
    logger.error("UPDATE / error: ", error);
    throw new Error("Change blog category unsuccessfully");
  }
};
