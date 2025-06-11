import { and, asc, desc, eq, gte, like, or } from "drizzle-orm";
import {
  findAllBlogCats,
  findBlogCatByName,
  findBlogCatById,
  insertBlogCat,
  deleteBlogCat,
  editBlogCat,
  findBlogCatBySlug,
} from "./blog-category.repository.js";
import { blogCategory } from "../../drizzle/schema.js";
import dayjs from "dayjs";
import slug from "slug";
import { generateUniqueSlug } from "../../utils/generate-slug.js";

export const getAllBlogCat = async (filters) => {
  try {
    let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined)
      whereConditions.push(
        eq(
          blogCategory.status,
          typeof status === "boolean" ? status : status === "true"
        )
      );
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(blogCategory.name, keyword),
        like(blogCategory.status, keyword),
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
        case "week":
          dateFrom = now.startOf("week").toDate();
          break;
        case "month":
          dateFrom = now.startOf("month").toDate();
          break;
        case "year":
          dateFrom = now.startOf("year").toDate();
          break;
        default:
          dateFrom = null;
      }

      if (dateFrom) {
        whereConditions.push(gte(blogCategory.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(blogCategory[field])
        : asc(blogCategory[field]);
    });

    const { datas, total } = await findAllBlogCats(skip, limit, where, order);

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
    throw new Error(error);
  }
};

export const getBlogCatById = async (id, filters) => {
  try {
    const { status } = filters;
    const whereConditions = [];

    if (status !== undefined)
      whereConditions.push(
        eq(
          blogCategory.status,
          typeof status === "boolean" ? status : status === "true"
        )
      );

    whereConditions.push(eq(blogCategory.id, id));

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    let data = await findBlogCatById(where);
    if (!data) {
      data = await findBlogCatBySlug(id, status);
    }
    if (!data) {
      throw new Error("Blog Category is not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createBlogCat = async (payload) => {
  try {
    const isNameExist = await findBlogCatByName(payload.name);
    if (isNameExist) {
      throw new Error("Category with this name already exists");
    }
    const baseSlug = slug(payload.name);
    const uniqueSlug = await generateUniqueSlug(
      baseSlug,
      blogCategory,
      blogCategory.slug
    );

    const newStatus = payload.status === "true";
    const data = await insertBlogCat({
      ...payload,
      slug: uniqueSlug,
      status: newStatus,
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteBlogCatById = async (id) => {
  try {
    const isBlogCatExist = await findBlogCatById(eq(blogCategory.id, id));
    if (!isBlogCatExist) {
      throw new Error("Blog Category is not found");
    }
    await deleteBlogCat(id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateBlogCat = async (id, payload) => {
  try {
    const blogcat = await findBlogCatById(eq(blogCategory.id, id));
    if (!blogcat) {
      throw new Error("Blog Category is not found");
    }
    let uniqueSlug = blogcat.slug;
    if (payload.name !== blogcat.name) {
      const baseSlug = slug(payload.name);
      uniqueSlug = await generateUniqueSlug(
        baseSlug,
        blogCategory,
        blogCategory.slug
      );
    }
    const newStatus = payload.status === "true";
    await editBlogCat(id, { ...payload, slug: uniqueSlug, status: newStatus });
  } catch (error) {
    throw new Error(error.message);
  }
};
