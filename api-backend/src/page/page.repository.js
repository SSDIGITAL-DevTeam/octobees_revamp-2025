import { db } from "../../drizzle/db.js";
import { metaTag, pages } from "../../drizzle/schema.js";
import { eq, sql, desc, asc, count } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";

export const findAllPages = async (skip, limit, where, orderBy) => {
  try {
    let baseQuery = db.select().from(pages);
    // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
    // .leftJoin(user, eq(blog.userId, user.id))
    if (where) baseQuery = baseQuery.where(where);
    if (orderBy) baseQuery = baseQuery.orderBy(...orderBy);

    const datas = await baseQuery.limit(limit).offset(skip);

    // console.log(datas)
    const totalQuery = db.select({ count: count() }).from(pages);
    // .leftJoin(blogCategory, eq(blog.categoryId, blogCategory.id))
    // .leftJoin(user, eq(blog.userId, user.id))

    if (where) totalQuery.where(where);

    const [{ count: total }] = await totalQuery;

    return { datas, total };
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan mengambil seluruh data page");
  }
};

// Find Pages By Slug
export const findPageBySlug = async (slug) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.slug, slug),
    })
    return data
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan mengambil data berdasarkan slug");
  }
};

// Find MetaTag By ID
export const findPageById = async (id) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.id, id),
    })
    // const data = await db
    //   .select()
    //   .from(pages)
    //   // .leftJoin(pages, eq(metaTag.slug, pages.slug))
    //   .where(eq(pages.id, id))
    //   .limit(1);

    return data;
  } catch (error) {
    console.error("Error fetching metaTag by ID:", error);
    throw new Error("Kesalahan mengambil data berdasarkan ID");
  }
};
export const findPageByTitle = async (page) => {
  try {
    const data = await db.query.pages.findFirst({
      where: eq(pages.page, page),
    })
    return data
  } catch (error) {
    console.error("Error fetching metaTag by TITLE:", error);
    throw new Error("Kesalahan mengambil data berdasarkan TITLE");
  }
};

// Insert New MetaTag
// export const insertPage = async (data) => {
//   const { page, key, value, content, slug } = data;
//   try {
//     await db.insert(metaTag).values({
//       key,
//       value,
//       content,
//       slug
//     });
//   } catch (error) {
//     console.error(error);
//     throw new Error('Kesalahan dalam penambahan meta');
//   }
// };

export const insertPage = async (page, slug, categoryServiceId = null) => {
  try {
    await db.insert(pages).values({
      page,
      slug,
      categoryServiceId,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan dalam penambahan page");
  }
};

// Delete MetaTag by ID
export const deletePage = async (id) => {
  try {
    await db.delete(metaTag).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan dalam penghapusan meta");
  }
};

// Edit MetaTag by ID
export const editPage = async (id, data) => {
  try {
    await db.update(metaTag).set(data).where(eq(metaTag.id, id));
  } catch (error) {
    console.error(error);
    throw new Error("Kesalahan dalam mengubah meta");
  }
};
