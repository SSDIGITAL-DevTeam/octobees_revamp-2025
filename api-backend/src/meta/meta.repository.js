import { db } from "../../drizzle/db.js";
import { metaTag, pages } from "../../drizzle/schema.js";
import { eq, count } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const findAllMetaTags = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db
      .select(metaTag)
      .from(metaTag)
      .leftJoin(pages, eq(metaTag.slug, pages.slug));

    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.offset(skip).limit(limit);

    let totalQuery = db
      .select({ count: count() })
      .from(metaTag)
      .leftJoin(pages, eq(metaTag.slug, pages.slug));

    if (where) {
      totalQuery = totalQuery.where(where);
    }

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    logger.error(`GET META / error: ${error.message}`);
    throw new Error("Get All Meta Tags Unsuccessfully");
  }
};

export const findPagesBySlug = async (slug) => {
  try {
    const data = await db.query.metaTag.findFirst({
      where: eq(metaTag.slug, slug),
    })
    return data
  } catch (error) {
    logger.error(`GET META /:SLUG error: ${error.message}`);
    throw new Error("Get Meta By Slug Unsuccessfully");
  }
};

export const findMetaById = async (id) => {
  try {
    const data = await db
      .select({
        ...metaTag,
        pages,
      })
      .from(metaTag)
      .leftJoin(pages, eq(metaTag.slug, pages.slug))
      .where(eq(metaTag.id, id))
      .limit(1);

    return data[0];
  } catch (error) {
    logger.error(`GET META /:ID error: ${error.message}`);
    throw new Error("Get Meta By ID Unsuccessfully");
  }
};

export const insertMeta = async (data) => {
  try {
    await db.insert(metaTag).values(data);
  } catch (error) {
    logger.error("POST META / error: ", error);
    throw new Error("Create MetaTag Unsuccessfully");
  }
};


export const insertPage = async (data) => {
  try {
    await db.insert(pages).values(data);
  } catch (error) {
    logger.error("POST PAGE / error: ", error);
    throw new Error("Create Page Unsuccessfully");
  }
};

export const deleteMeta = async (id) => {
  try {
    await db.delete(metaTag).where(eq(metaTag.id, id));
  } catch (error) {
    logger.error(`DELETE META /:ID error: ${error.message}`);
    throw new Error("Delete MetaTag Unsuccessfully");
  }
};

export const editMeta = async (id, data) => {
  try {
    await db.update(metaTag).set(data).where(eq(metaTag.id, id));
  } catch (error) {
    logger.error(`UPDATE META /:ID error: ${error.message}`);
    throw new Error("Update MetaTag Unsuccessfully");
  }
};
