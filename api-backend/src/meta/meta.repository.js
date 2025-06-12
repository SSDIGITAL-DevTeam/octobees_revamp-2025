import { db } from "../../drizzle/db.js";
import { metaTag, pages } from "../../drizzle/schema.js";
import { eq, sql, desc, asc, count } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import logger from "../../utils/logger.js";
// Find All MetaTags with Pagination & Sorting
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
    throw new Error("Get All MetaTag Unsuccessfully");
  }
};

// Find Pages By Slug
export const findPagesBySlug = async (slug) => {
  try {
    const data = await db.query.metaTag.findFirst({
      where: eq(metaTag.slug, slug),
    })
    return data
  } catch (error) {
    throw new Error("Get Meta By Slug Unsuccessfully");
  }
};

// Find MetaTag By ID
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

    return data[0] || null;
  } catch (error) {
    console.error("Error fetching metaTag by ID:", error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};

export const insertMeta = async (data) => {
  try {
    await db.insert(metaTag).values(data);
  } catch (error) {
    logger.error("POST / error: ", error);
    throw new Error("Create MetaTag Unsuccessfully");
  }
};

// Insert New Page
export const insertPage = async (data) => {
  try {
    await db.insert(pages).values(data);
  } catch (error) {
    logger.error("POST / error: ", error);
    throw new Error("Create Page Unsuccessfully");
  }
};

// Delete MetaTag by ID
export const deleteMeta = async (id) => {
  try {
    await db.delete(metaTag).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan dalam penghapusan meta");
  }
};

// Edit MetaTag by ID
export const editMeta = async (id, data) => {
  try {
    await db.update(metaTag).set(data).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan dalam mengubah meta");
  }
};
