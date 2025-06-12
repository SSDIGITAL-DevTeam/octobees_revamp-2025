import dayjs from "dayjs";
import { blogCategory, metaTag, pages } from "../../drizzle/schema.js";
import {
  findAllPages,
  findPageById,
  insertPage,
  editPage,
  findPageBySlug,
  findPageByTitle,
  deletePageById,
} from "./page.repository.js";
import { and, asc, desc, eq, gte, is, like, or } from "drizzle-orm";
import { findAllMetaTags } from "../meta/meta.repository.js";
import slug from "slug";
import { generateUniqueSlug } from "../../utils/generate-slug.js";

export const getAllPages = async (filters) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      orderBy,
      categoryId,
      createdAt,
    } = filters;

    limit = Math.max(parseInt(limit) || 10, 1);
    const skip = (page - 1) * limit;

    const whereConditions = [];
    if (categoryId) whereConditions.push(eq(blogCategory.id, categoryId));
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      const searchFilters = [
        like(pages.page, keyword),
        like(pages.slug, keyword),
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
        whereConditions.push(gte(pages.createdAt, dateFrom));
      }
    }

    const where = whereConditions.length ? and(...whereConditions) : undefined;

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(pages[field]) : asc(pages[field]);
    });

    const { datas, total } = await findAllPages(skip, limit, where, order);

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

export const getPageById = async (id, filters) => {
  try {
    let { page, limit, orderBy, search, createdAt } = filters;
    limit = Math.max(parseInt(limit) || 10, 1);

    const skip = (page - 1) * limit;

    const whereConditions = [];
    if (search) {
      const keyword = `%${search.toLowerCase()}%`;

      const searchFilters = [
        like(metaTag.key, keyword),
        like(metaTag.slug, keyword),
        like(metaTag.value, keyword),
        like(metaTag.content, keyword),
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
        whereConditions.push(gte(metaTag.createdAt, dateFrom));
      }
    }

    const order = (orderBy || []).map((item) => {
      const field = Object.keys(item)[0];
      const direction = item[field];
      return direction === "desc" ? desc(metaTag[field]) : asc(metaTag[field]);
    });

    let selectedPage = await findPageById(id);
    if (!selectedPage) {
      selectedPage = await findPageBySlug(id);
    }
    if (!selectedPage) {
      throw new Error("Page not found");
    }

    whereConditions.push(eq(metaTag.slug, selectedPage.slug));

    const where = whereConditions.length ? and(...whereConditions) : undefined;
    const { datas, total } = await findAllMetaTags(skip, limit, where, order);

    const totalPages = Math.ceil(total / limit);

    return {
      data: {
        pages: selectedPage,
        meta: [...datas],
      },
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

export const createPage = async (payload) => {
  try {
    const { page } = payload;
    const isPageExist = await findPageByTitle(page);
    if (isPageExist) {
      throw new Error("Page is already exist");
    }

    const baseSlug = slug(page);
    const uniqueSlug = await generateUniqueSlug(baseSlug, pages, pages.slug);

    await insertPage({ page, slug: uniqueSlug });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removePage = async (id) => {
  try {
    let isPageExist = await findPageById(id);
    if (!isPageExist) {
      isPageExist = await findPageBySlug(id);
    }
    if (!isPageExist) {
      throw new Error("Page not found");
    }
    await deletePageById(isPageExist.id);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePage = async (id, payload) => {
  try {
    const data = await findPageById(id);
    if (!data) {
      throw new Error("Page with id not found");
    }
    const { page } = payload;
    let uniqueSlug = data.slug;

    if(page !== data.page){
      const baseSlug = slug(page);
      uniqueSlug = await generateUniqueSlug(baseSlug, pages, pages.slug);
    }
    await editPage(id, { page, slug: uniqueSlug });
  } catch (error) {
    throw new Error(error.message);
  }
};
