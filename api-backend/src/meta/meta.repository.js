import { db } from "../../drizzle/db.js";
import { metaTag, pages } from "../../drizzle/schema.js";
import { eq, sql, desc, asc } from 'drizzle-orm';
import { v7 as uuidv7 } from 'uuid';
// Find All MetaTags with Pagination & Sorting
export const findAllServiceCats = async (skip = 0, limit = 10, whereClause = undefined, orderByClause = desc(metaTag.id)) => {
  try {
    const datas = await db
      .select({
        ...metaTag,
        pages
      })
      .from(metaTag)
      .leftJoin(pages, eq(metaTag.slug, pages.slug))
      .where(whereClause)
      .orderBy(orderByClause)
      .offset(skip)
      .limit(limit);

    const [{ count }] = await db
      .select({ count: sql`COUNT(*)`.as('count') })
      .from(metaTag)
      .where(whereClause);

    return { datas, total: count };
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan mengambil seluruh data meta');
  }
};

// Find Pages By Slug
export const findPagesBySlug = async (slug) => {
  try {
    const data = await db
      .select({
        ...pages,
        meta: metaTag
      })
      .from(pages)
      .leftJoin(metaTag, eq(metaTag.slug, pages.slug))
      .where(eq(pages.slug, slug))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan mengambil data berdasarkan page');
  }
};

// Find MetaTag By ID
export const findServiceCatById = async (id) => {
  try {
    const data = await db
      .select({
        ...metaTag,
        pages
      })
      .from(metaTag)
      .leftJoin(pages, eq(metaTag.slug, pages.slug))
      .where(eq(metaTag.id, id))
      .limit(1);

    return data[0] || null;
  } catch (error) {
    console.error('Error fetching metaTag by ID:', error);
    throw new Error('Kesalahan mengambil data berdasarkan ID');
  }
};

// Insert New MetaTag
export const insertServiceCat = async (data) => {
  const { page, key, value, content, slug } = data;
  try {
    await db.insert(metaTag).values({
      key,
      value,
      content,
      slug
    });
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan dalam penambahan meta');
  }
};

// Insert New Page
export const insertPage = async (name, slug, categoryServiceId) => {
  try {
   
    await db.insert(pages).values({
        id: uuidv7(),
      page: name,
      slug,
      categoryServiceId
    });
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan dalam penambahan page');
  }
};

// Delete MetaTag by ID
export const deleteServiceCat = async (id) => {
  try {
    await db.delete(metaTag).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan dalam penghapusan meta');
  }
};

// Edit MetaTag by ID
export const editServiceCat = async (id, data) => {
  try {
    await db.update(metaTag).set(data).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error('Kesalahan dalam mengubah meta');
  }
};
