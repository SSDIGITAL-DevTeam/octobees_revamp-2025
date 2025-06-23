//berkomunikasi dengan database
//dapat menggunakan orm atau query raw
//supaya untuk mengganti ORM tinggal ganti pada file ini aja kok

import { db } from "../../drizzle/db.js";
import { blog, blogCategory, user } from "../../drizzle/schema.js";
import { eq, count, and } from "drizzle-orm";
import logger from "../../utils/logger.js";
import { v7 as uuidv7 } from "uuid";

export const findAllBlogs = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db
      .select({
        ...blog,
        user: {
          id: user.id,
          name: user.name,
        },
        category: {
          id: blogCategory.id,
          name: blogCategory.name,
          slug: blogCategory.slug,
        },
      })
      .from(blog)
      .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
      .leftJoin(user, eq(blog.userId, user.id));
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    const totalQuery = db
      .select({ count: count() })
      .from(blog)
      .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
      .leftJoin(user, eq(blog.userId, user.id));

    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET / error: ${error.message}`);
    throw new Error("Get All Blogs Unsuccessfully");
  }
};

export const findBlogById = async (blogId, status) => {
  let where = eq(blog.id, blogId);
  if (status !== undefined) {
    where = and(where, eq(blog.status, status));
  }
  try {
    const selectedBlog = await db
      .select({
        ...blog,
        user: {
          id: user.id,
          name: user.name,
        },
        category: {
          id: blogCategory.id,
          name: blogCategory.name,
          slug: blogCategory.slug,
        },
      })
      .from(blog)
      .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
      .leftJoin(user, eq(blog.userId, user.id))
      .where(where)
      .limit(1);

    return selectedBlog[0]
  } catch (error) {
    logger.error(`GET by ID / error: ${error.message}`);
    throw new Error("Get blog by ID unsuccessfully");
  }
};
export const findBlogBySlug = async (slug, status) => {
  let where = eq(blog.slug, slug);
  if (status !== undefined) {
    where = and(where, eq(blog.status, status));
  }
  try {
    const selectedBlog = await db
      .select({
        ...blog,
        user: {
          id: user.id,
          name: user.name,
        },
        category: {
          id: blogCategory.id,
          name: blogCategory.name,
          slug: blogCategory.slug,
        },
      })
      .from(blog)
      .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
      .leftJoin(user, eq(blog.userId, user.id))
      .where(where)
      .limit(1);

    return selectedBlog[0]
  } catch (error) {
    logger.error(`GET by Slug / error: ${error.message}`);
    throw new Error("Get blog by slug unsuccessfully");
  }
};

export const findBlogByTitle = async (title) => {
  try {
    const result = await db.query.blog.findFirst({
      where: eq(blog.title, title),
    });
    return result;
  } catch (error) {
    logger.error(`GET by Title / error: ${error.message}`);
    throw new Error("Get blog by title unsuccessfully");
  }
};

export const insertBlog = async (data) => {
  try {
    const id = uuidv7();
    await db.insert(blog).values({
      id,
      ...data,
    });
    return { id, ...data };
  } catch (error) {
    logger.error(`POST / error: ${error.message}`);
    throw new Error("Insert blog unsuccessfully");
  }
};

export const deleteBlog = async (id) => {
  try {
    await db.delete(blog).where(eq(blog.id, id));
  } catch (error) {
    logger.error(`DELETE /:ID error: ${error.message}`);
    throw new Error("Delete blog unsuccessfully");
  }
};

export const editBlog = async (id, data) => {
  try {
    await db.update(blog).set(data).where(eq(blog.id, id));
  } catch (error) {
    logger.error(`UPDATE /:ID error: ${error.message}`);
    throw new Error("Update blog unsuccessfully");
  }
};
