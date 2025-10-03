import { db } from "../../drizzle/db.js";
import { metas } from "../../drizzle/schema.js";
import { and, eq } from "drizzle-orm";
import logger from "../../utils/logger.js";

const META_TYPE = "blog";

const buildMetaRows = (blogId, entries = []) => {
  const unique = new Map();

  entries.forEach((entry) => {
    if (!entry || typeof entry !== "object") return;

    const key = (entry.key ?? "name").toString().trim();
    const value = entry.value != null ? entry.value.toString().trim() : "";
    const content = entry.content != null ? entry.content.toString().trim() : null;

    if (!value) return;

    const dedupeKey = `${key}:${value}`;
    unique.set(dedupeKey, {
      key,
      value,
      content,
      metaableId: blogId,
      metaableType: META_TYPE,
    });
  });

  return Array.from(unique.values());
};

export const replaceBlogMetas = async (blogId, entries = [], trx = db) => {
  try {
    const rows = buildMetaRows(blogId, entries);

    await trx
      .delete(metas)
      .where(and(eq(metas.metaableId, blogId), eq(metas.metaableType, META_TYPE)));

    if (!rows.length) return;

    await trx.insert(metas).values(rows);
  } catch (error) {
    logger.error(`META replace failed: ${error.message}`);
    throw new Error("Replace Blog Metas unsuccessfully");
  }
};

export const deleteBlogMetas = async (blogId, trx = db) => {
  try {
    await trx
      .delete(metas)
      .where(and(eq(metas.metaableId, blogId), eq(metas.metaableType, META_TYPE)));
  } catch (error) {
    logger.error(`META delete failed: ${error.message}`);
    throw new Error("Delete Blog Metas unsuccessfully");
  }
};

export const getBlogMetas = async (blogId) => {
  try {
    return await db.query.metas.findMany({
      where: and(eq(metas.metaableId, blogId), eq(metas.metaableType, META_TYPE)),
      orderBy: (fields, { asc }) => asc(fields.id),
    });
  } catch (error) {
    logger.error(`META get failed: ${error.message}`);
    throw new Error("Get Blog Metas unsuccessfully");
  }
};
