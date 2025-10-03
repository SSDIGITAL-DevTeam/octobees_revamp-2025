//functionya re-usable

import {
  findAllBlogs,
  findBlogByTitle,
  findBlogById,
  findBlogBySlug,
} from "./blog.repository.js";
import dayjs from "dayjs";
import "dayjs/locale/id.js";

dayjs.locale("id"); // Set locale ke bahasa Indonesia
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { asc, desc, ilike, and, or, eq, like, sql, gte } from "drizzle-orm";
import { blog, user } from "../../drizzle/schema.js";
import { db } from "../../drizzle/db.js";
import { findBlogCatById } from "../blog-category/blog-category.repository.js";
import slug from "slug";
import { generateUniqueSlug } from "../../utils/generate-slug.js";
import {
  replaceBlogMetas,
  deleteBlogMetas,
  getBlogMetas,
} from "../metas/metas.repository.js";
import { v7 as uuidv7 } from "uuid";
// import { insertPage } from "../page/page.repository.js";

export const getAllBlogs = async (filters) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      orderBy,
      search,
      favorite,
      categoryId,
      createdAt,
    } = filters;

    const skip = (page - 1) * limit;

    const whereConditions = [];
    let newFavorite = favorite;
    if (typeof favorite === "string") newFavorite = favorite === "true";

    if (status !== undefined) whereConditions.push(eq(blog.status, status));
    if (categoryId !== undefined) {
      whereConditions.push(eq(blog.categoryId, categoryId));
    }

    if (favorite !== undefined)
      whereConditions.push(eq(blog.favorite, newFavorite));

    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      const searchFilters = [
        like(blog.title, keyword),
        like(user.name, keyword),
        like(blog.status, keyword),
      ];

      whereConditions.push(or(...searchFilters));
    }

    if (createdAt) {
      let dateFrom;
      const now = dayjs();

      switch (createdAt) {
        case "today":
          dateFrom = now.startOf("day").toDate();
          break;
        case "this_week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "this_month":
          dateFrom = now.startOf("month").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(blog.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(blog[field]) : asc(blog[field]);
    });

    const { datas, total } = await findAllBlogs(skip, limit, where, order);

    const totalPages = Math.ceil(total / limit);
    return {
      data: datas,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getBlogById = async (id, status) => {
  try {
    const data = (await findBlogById(id, status)) || (await findBlogBySlug(id, status));
    if (!data) throw new Error("Blog not found");

    const metas = await getBlogMetas(data.id);
    const metaMap = new Map(
      metas
        .filter((item) => item.value)
        .map((item) => [item.value, item])
    );

    const ensureMeta = (value, content, key = "name") => {
      if (metaMap.has(value) || !content) return;
      const entry = {
        key,
        value,
        content,
        metaableId: data.id,
        metaableType: "blog",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      metas.push(entry);
      metaMap.set(value, entry);
    };

    const truncatedDescription = data.content?.slice(0, 160)?.trim();
    ensureMeta("description", truncatedDescription);

    if (!metaMap.has("keyword") && !metaMap.has("keywords")) {
      const keywordFallback = [data.category?.name]
        .filter(Boolean)
        .join(", ");
      ensureMeta("keyword", keywordFallback);
    }

    return { ...data, metas };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBlog = async (payload) => {
  try {
    const existingBlog = await findBlogByTitle(payload.title);
    if (existingBlog) {
      throw new Error("Title already exists");
    }
    const existingCategory = await findBlogCatById(payload.categoryId);
    if (!existingCategory) {
      throw new Error("Category not found");
    }

    const baseSlug = slug(payload.title);
    const uniqueSlug = await generateUniqueSlug(baseSlug, blog, blog.slug);

    const { seo: metaEntries, ...blogPayload } = payload;

    await db.transaction(async (tx) => {
      const blogId = uuidv7();
      await tx.insert(blog).values({ id: blogId, ...blogPayload, slug: uniqueSlug });

      if (Array.isArray(metaEntries) && metaEntries.length > 0) {
        await replaceBlogMetas(blogId, metaEntries, tx);
      }
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteBlogById = async (id) => {
  try {
    const _blog = await findBlogById(id);
    if (_blog == null) {
      throw new Error("Blog with that ID not found");
    }
    const imagePath = _blog.image ? path.join(__dirname, "../../upload", _blog.image) : null;

    await db.transaction(async (tx) => {
      await tx.delete(blog).where(eq(blog.id, id));
      await deleteBlogMetas(id, tx);
    });

    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateBlog = async (id, payload) => {
  try {
    const _blog = await findBlogById(id);
    if (!_blog) {
      throw new Error("Blog not found");
    }

    const { image, favorite } = payload;
    let oldImagePath = null;
    if (image) {
      oldImagePath = path.join(__dirname, "../../upload", _blog.image);
    }

    let newFavorite = favorite;

    if (typeof favorite === "string") {
      newFavorite = favorite === "true";
    }

    const response = await findAllBlogs(0, 10, eq(_blog.favorite, true), [
      desc(_blog.createdAt),
    ]);

    if (_blog.status !== "Published" && newFavorite === true) {
      throw new Error("Blog must be published first");
    }
    if (
      newFavorite === true &&
      response.datas.length >= 3 &&
      _blog.favorite === false
    ) {
      throw new Error("You can only favorite up to 3 blogs");
    }

    let uniqueSlug = _blog.slug;
    if (payload.title !== _blog.title) {
      const baseSlug = slug(payload.title);
      uniqueSlug = await generateUniqueSlug(baseSlug, blog, blog.slug);
    }

    const { seo: metaEntries, ...blogPayload } = payload;

    const cleanedPayload = Object.fromEntries(
      Object.entries({ ...blogPayload, favorite: newFavorite, slug: uniqueSlug, updatedAt: new Date() })
        .filter(([, value]) => value !== undefined)
    );

    await db.transaction(async (tx) => {
      await tx.update(blog).set(cleanedPayload).where(eq(blog.id, id));

      if (Array.isArray(metaEntries)) {
        await replaceBlogMetas(id, metaEntries, tx);
      }
    });

    if (oldImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
