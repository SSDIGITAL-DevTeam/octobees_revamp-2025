import { insertPage } from "../meta/meta.repository.js";
import {
  findAllCategories,
  findCategoryById,
  findCategoryBySlug,
  getCategoryByName,
  insertCategory,
  deleteCategory,
  editCategory,
} from "./service-category.repository.js";

import { categoryService, planService } from "../../drizzle/schema.js";
import { and, eq, or, like, desc, asc, gte } from "drizzle-orm";
import dayjs from "dayjs";
import slug from "slug";
import { generateUniqueSlug } from "../../utils/generate-slug.js";
import { deletePage, editPages } from "../page/page.repository.js";

export const getAllCategories = async (filters) => {
  try {
    let { page = 1, limit = 10, status, search, orderBy, createdAt } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];

    if (status !== undefined)
      whereConditions.push(
        eq(
          categoryService.status,
          typeof status === "boolean" ? status : status === "true"
        )
      );
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;
      const searchFilters = [
        like(categoryService.name, keyword),
        like(categoryService.heading, keyword),
        like(categoryService.slug, keyword),
        like(categoryService.status, keyword),
        like(categoryService.description, keyword),
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
        whereConditions.push(gte(categoryService.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc"
        ? desc(categoryService[field])
        : asc(categoryService[field]);
    });

    const { datas, total } = await findAllCategories(skip, limit, where, order);

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

export const getCategoryById = async (id, filters) => {
  try {
    const { status } = filters;
    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(planService.status, status));
    }

    const where =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;
    let data =
      (await findCategoryById(id, where)) ||
      (await findCategoryBySlug(id, where));
    if (!data) {
      throw new Error("Category with this ID not found");
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCategory = async (payload) => {
  try {
    const isNameExist = await getCategoryByName(payload.name);
    if (isNameExist) {
      throw new Error("Category with this name already exists");
    }

    const baseSlug = slug(payload.name);
    const uniqueSlug = await generateUniqueSlug(
      baseSlug,
      categoryService,
      categoryService.slug
    );

    const data = await insertCategory({ ...payload, slug: uniqueSlug });

    await insertPage({
      page: payload.name,
      slug: uniqueSlug,
      categoryServiceId: data.id,
    });
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeCategory = async (id) => {
  try {
    const category = await findCategoryById(id);
    if (!category) {
      throw new Error("Category with this ID not found");
    }
    await deleteCategory(id);
    await deletePage(id)
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (id, payload) => {
  try {
    const category = await findCategoryById(id);
    if (!category) {
      throw new Error("Category with this ID not found");
    }

    let uniqueSlug = category.slug;
    if (payload.name !== category.name) {
      const isNameExist = await getCategoryByName(payload.name);
      if (isNameExist && isNameExist.id !== id) {
        throw new Error("Category with this name already exists");
      }
      const baseSlug = slug(payload.name);
      uniqueSlug = await generateUniqueSlug(
        baseSlug,
        categoryService,
        categoryService.slug
      );
    }

    await editCategory(id, { ...payload, slug: uniqueSlug });
    await editPages(id, {
      page: payload.name,
      slug: uniqueSlug,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
